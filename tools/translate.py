"""Generate a cached Chinese draft of public upstream textbook text.

Only used during localization; the published website makes no translation requests.
Resumes jobs left unfinished after a network failure. Markup and interpolations are
protected and validated before any result can be written into executable source.
"""
import concurrent.futures
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

WORK = Path('.translation')
JOBS = WORK / 'jobs.json'

def fragment_fallback(source):
    # When a translator drops adjacent opaque markers, keep them entirely local.
    # Translate only text between them, and reassemble the unchanged markup.
    pieces = re.split(r'(<i\b[^>]*>.*?</i>|<[^>]+>|&[A-Za-z#0-9]+;|ZXQ\d+XQZ|\\n)', source, flags=re.S)
    indices = [i for i in range(0,len(pieces),2) if re.search(r'[A-Za-z]{3}',pieces[i])]
    if not indices:
        return source
    sep = '\n|||SECTION|||\n'
    payload = sep.join(pieces[i] for i in indices)
    url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode({
        'client':'gtx','sl':'en','tl':'zh-CN','dt':'t','q':payload})
    req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req,timeout=45) as response:
        data = json.load(response)
    result = ''.join(s[0] or '' for s in data[0])
    parts = re.split(r'\|\|\|\s*(?:SECTION|部分|章节)\s*\|\|\|',result,flags=re.I)
    if len(parts) != len(indices):
        raise ValueError('fragment separator mismatch')
    for i,t in zip(indices,parts):
        original = pieces[i]
        pieces[i] = (' ' if original.startswith(' ') else '') + t.strip() + (' ' if original.endswith(' ') else '')
    return ''.join(pieces)

def translate(item):
    key, job = item
    source = job['source']
    protected = []
    def mask(m):
        protected.append(m.group())
        return f'ZXQ{10000 + len(protected)-1}XQZ'
    # Preserve math variables, tags/attributes, entities, units and template slots.
    text = re.sub(r'<i\b[^>]*>.*?</i>|<[^>]+>|&[A-Za-z#0-9]+;|ZXQ\d+XQZ|(?<!\w)(?:m/s²|m/s|m/s\^2|N/kg|kg·m/s|rad/s²|rad/s|N·m|kg·m²|m³|m²|s²)(?!\w)', mask, source, flags=re.S)
    expected = re.findall(r'ZXQ\d+XQZ', text)
    for attempt in range(5):
        try:
            url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode({
                'client': 'gtx', 'sl': 'en', 'tl': 'zh-CN', 'dt': 't', 'q': text})
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=45) as response:
                data = json.load(response)
            result = ''.join(s[0] or '' for s in data[0])
            # The service sometimes inserts whitespace within an opaque marker.
            result = re.sub(r'Z\s*X\s*Q\s*(\d+)\s*X\s*Q\s*Z', lambda m: f'ZXQ{m[1]}XQZ', result, flags=re.I)
            actual = re.findall(r'ZXQ\d+XQZ', result)
            if sorted(actual) != sorted(expected):
                raise ValueError(f'placeholder mismatch {expected} != {actual}')
            for i, original in enumerate(protected):
                result = result.replace(f'ZXQ{10000+i}XQZ', original)
            # Require exact markup sequence: never change HTML nesting/order.
            if re.findall(r'<[^>]+>', result) != re.findall(r'<[^>]+>', source):
                raise ValueError('markup sequence changed')
            return key, result, None
        except Exception as exc:
            if isinstance(exc, ValueError):
                try:
                    return key, fragment_fallback(source), None
                except Exception as fallback_error:
                    exc = fallback_error
            if attempt == 4:
                return key, None, str(exc)
            time.sleep(1 + attempt * 2)

def main():
    jobs = json.loads(JOBS.read_text(encoding='utf-8'))
    pending = [(k,j) for k,j in jobs.items() if not j['translation']]
    print(f'Translating {len(pending)} strings', flush=True)
    done, errors = 0, []
    batches, batch, size = [], [], 0
    for item in pending:
        cost = len(item[1]['source']) + 40
        if batch and size + cost > 3200:
            batches.append(batch)
            batch, size = [], 0
        batch.append(item)
        size += cost
    if batch:
        batches.append(batch)
    separator = '\nZXQ999999XQZ\n'
    def run_batch(items):
        if len(items) == 1:
            return [translate(items[0])]
        source = separator.join(j['source'] for _,j in items)
        _, result, error = translate(('batch', {'source': source}))
        pieces = result.split('ZXQ999999XQZ') if result else []
        if not error and len(pieces) == len(items):
            return [(item[0], piece.strip(), None) for item,piece in zip(items,pieces)]
        # A failed batch never writes damaged source. Retry its members separately.
        return [translate(item) for item in items]
    print(f'{len(batches)} requests, with individual fallback on malformed batches', flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(run_batch, batch) for batch in batches]
        for future in concurrent.futures.as_completed(futures):
            for key, translated, error in future.result():
                if error:
                    errors.append({'id': key, 'error': error})
                else:
                    jobs[key]['translation'] = translated
                done += 1
            JOBS.write_text(json.dumps(jobs, ensure_ascii=False, indent=2), encoding='utf-8')
            print(f'{done}/{len(pending)}; failures {len(errors)}', flush=True)
    (WORK/'errors.json').write_text(json.dumps(errors, ensure_ascii=False, indent=2), encoding='utf-8')
    if errors:
        raise SystemExit(f'{len(errors)} strings need correction; see .translation/errors.json')

if __name__ == '__main__':
    main()
