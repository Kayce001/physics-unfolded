// Extract human-facing strings without rewriting model code or JS expressions.
// Usage: node tools/localize.mjs extract|apply
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'acorn';

const chapters = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ');
const root = process.cwd(), work = path.join(root, '.translation');
fs.mkdirSync(work, { recursive: true });
const glossary = {
  'Atlas of Physics': '物理展开', 'Kinematics': '运动学', 'Newton’s laws': '牛顿运动定律',
  'Circular motion': '圆周运动', 'Work and energy': '功与能', 'Momentum': '动量',
  'Oscillations': '振动', 'Rotation': '转动', 'Fluids': '流体', 'Electrostatics': '静电学',
  'Gauss’s law': '高斯定律', 'Electric potential': '电势', 'Capacitors': '电容器',
  'Circuits': '电路', 'Magnetism': '磁场', 'Induction': '电磁感应',
  'position': '位置', 'velocity': '速度', 'acceleration': '加速度', 'displacement': '位移',
  'distance': '路程', 'speed': '速率', 'Position': '位置', 'Velocity': '速度',
  'Acceleration': '加速度', 'Displacement': '位移', 'Distance': '路程', 'Speed': '速率',
  'Practice': '练习', 'Compare': '对照理解', 'Equations': '公式表', 'Equation sheet': '公式表',
  'Next page': '下一页', 'Previous page': '上一页', 'Pages': '页面',
  'Show the solution': '查看解答', 'Source on GitHub': 'GitHub 源码',
  'Scroll to turn the page': '滚动以翻页', 'zero': '零', 'downward': '向下', 'upward': '向上',
  'constant': '恒定', 'positive': '正', 'negative': '负', 'undefined': '未定义',
};
const humanKeys = new Set('kicker title sub body fig q why solution choices name label xlabel ylabel text hint'.split(' '));
const files = ['index.html', 'equations/index.html', 'engine/book.js', 'engine/xrefs.js', 'equations/build.mjs',
  ...chapters.flatMap(c => ['index.html', 'pages.js', 'practice.js', 'world.js', 'main.js'].map(f => `${c}/${f}`))];

function visible(s) {
  return s.replace(/<[^>]*>/g, '').replace(/ZXQ\d+XQZ/g, '').trim();
}
function isHuman(s, key) {
  const t = visible(s);
  if (/^\([\w-]+:|^vec(?:\s|$)|^kinematics newton |^[A-Za-z]+(?:[A-Z][a-z]+)+$/.test(t)) return false;
  if (!/[A-Za-z]{3}/.test(t) || /^(?:https?:|\.\.?\/|#[\w-]+$)/.test(t)) return false;
  if (humanKeys.has(key)) return true;
  // Prose in array entries, inline SVG/HTML, UI hints, and dynamic readouts.
  return /[A-Za-z]{2,}[ ,;:!?·–—→↔]+[A-Za-z]{2,}/.test(t)
    && !/[{};]\s*(?:const|return|function)|document\.|\.js\b|\b(?:rgba|translate|rotate|scale)\(/.test(t)
    && !/^[.#][\w-]/.test(t)
    && !/^[\w-]+(?:\/[\w#.-]+)+$/.test(t);
}

if (process.argv[2] === 'extract') {
  const records = [], jobs = {};
  const cache = fs.existsSync(path.join(work,'cache.json')) ? JSON.parse(fs.readFileSync(path.join(work,'cache.json'))) : {};
  function add(file, start, end, value, kind, extra = {}) {
    if (!value.trim()) return;
    const id = String(Object.keys(jobs).length);
    // Deduplicate exact strings across the book.
    let found = Object.entries(jobs).find(([, j]) => j.source === value)?.[0];
    if (found === undefined) { found = id; jobs[id] = { source: value, translation: glossary[value.trim()] || cache[value] || null }; }
    records.push({ file, start, end, id: found, kind, ...extra });
  }
  for (const file of files) {
    const src = fs.readFileSync(path.join(root, file), 'utf8');
    if (file.endsWith('.html')) {
      const hidden = [...src.matchAll(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi)].map(m => [m.index, m.index + m[0].length]);
      const inHidden = i => hidden.some(([a,b]) => i >= a && i < b);
      for (const m of src.matchAll(/>([^<>]+)</g)) {
        if (!inHidden(m.index) && isHuman(m[1], 'text')) add(file, m.index + 1, m.index + 1 + m[1].length, m[1], 'html');
      }
      for (const m of src.matchAll(/\b(alt|aria-label|title)="([^"]*)"/g)) {
        if (!inHidden(m.index) && isHuman(m[2], 'label')) {
          const i = m.index + m[0].indexOf('"') + 1;
          add(file, i, i + m[2].length, m[2], 'attr');
        }
      }
      continue;
    }
    const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
    function walk(n, key = '') {
      if (!n || typeof n !== 'object') return;
      if (n.type === 'Property') key = n.key.name || n.key.value || key;
      if (n.type === 'ImportDeclaration' || n.type === 'ImportExpression') return;
      if (n.type === 'CallExpression') {
        // Function names, selectors, CSS classes, and geometry attribute names are code.
        const labelCall = n.callee.type === 'Identifier' && n.callee.name === 'label';
        n.arguments.forEach((arg,i) => {
          if (labelCall && i === 0) return;
          walk(arg, labelCall && i === 1 ? 'label' : '');
        });
        return;
      }
      if (n.type === 'ConditionalExpression') {
        walk(n.consequent,key); walk(n.alternate,key); return;
      }
      if (n.type === 'BinaryExpression' && !['+'].includes(n.operator)) return;
      if (n.type === 'Literal' && typeof n.value === 'string' && isHuman(n.value, key)) {
        add(file, n.start, n.end, n.value, 'literal'); return;
      }
      if (n.type === 'TemplateLiteral') {
        const expressions = n.expressions.map(e => src.slice(e.start, e.end));
        const value = n.quasis.map((q, i) => q.value.raw + (i < expressions.length ? `ZXQ${i}XQZ` : '')).join('');
        if (isHuman(value, key)) { add(file, n.start, n.end, value, 'template', { expressions }); return; }
      }
      for (const [k,v] of Object.entries(n)) {
        if (['key', 'start', 'end', 'type'].includes(k)) continue;
        if (Array.isArray(v)) v.forEach(x => walk(x, key));
        else if (v && typeof v === 'object') walk(v, key);
      }
    }
    walk(ast);
  }
  fs.writeFileSync(path.join(work, 'records.json'), JSON.stringify(records, null, 2));
  fs.writeFileSync(path.join(work, 'jobs.json'), JSON.stringify(jobs, null, 2));
  console.log(`${records.length} strings; ${Object.keys(jobs).length} unique; ${Object.values(jobs).reduce((n,j)=>n+j.source.length,0)} characters`);
} else if (process.argv[2] === 'apply') {
  const records = JSON.parse(fs.readFileSync(path.join(work, 'records.json')));
  const jobs = JSON.parse(fs.readFileSync(path.join(work, 'jobs.json')));
  const grouped = Object.groupBy(records, r => r.file);
  const missing = Object.values(jobs).filter(j => !j.translation);
  if (missing.length) throw Error(`${missing.length} untranslated strings`);
  for (const [file, rs] of Object.entries(grouped)) {
    let src = fs.readFileSync(path.join(root, file), 'utf8');
    for (const r of rs.sort((a,b) => b.start-a.start)) {
      let t = jobs[r.id].translation;
      if (r.kind === 'literal') t = JSON.stringify(t);
      if (r.kind === 'attr') t = t.replace(/"/g, '&quot;');
      if (r.kind === 'template') {
        t = t.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
        for (let i=0; i<r.expressions.length; i++) {
          if (t.split(`ZXQ${i}XQZ`).length !== 2) throw Error(`Lost expression ${file}:${r.id}:${i}`);
          t = t.replace(`ZXQ${i}XQZ`, () => '${' + r.expressions[i] + '}');
        }
        t = '`' + t + '`';
      }
      src = src.slice(0,r.start) + t + src.slice(r.end);
    }
    fs.writeFileSync(path.join(root,file), src);
  }
  fs.writeFileSync(path.join(root,'TRANSLATION_REPORT.json'), JSON.stringify({
    language: 'zh-CN', method: 'Machine translation draft with protected JavaScript expressions, markup, and physics model; terminology corrections and automated checks. Full expert sentence-by-sentence review remains outstanding.',
    strings: records.length, uniqueStrings: Object.keys(jobs).length, files: Object.fromEntries(Object.entries(grouped).map(([f,r])=>[f,r.length]))
  },null,2)+'\n');
  console.log(`Applied ${records.length} translations in ${Object.keys(grouped).length} files`);
} else throw Error('Usage: node tools/localize.mjs extract|apply');
