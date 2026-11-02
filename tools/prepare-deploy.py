"""Build an explicit public-file bundle; keep QA, credentials and tooling private."""
import hashlib
import json
import re
import shutil
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = 'https://physics.selfworks.ai'
CHAPTERS = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split()
TITLES = '运动学 牛顿运动定律 圆周运动 功与能 动量 振动 转动 流体 静电学 高斯定律 电势 电容器 电路 磁场 电磁感应'.split()

def metadata():
    pages = [('', '物理展开：用交互式三维图示学习力学和电磁学，包含 15 章中文讲解、练习与解析。'),
             ('equations/', 'AP 物理公式表中文版，按主题搜索公式，并跳转到对应的三维图示和讲解。')]
    pages += [(c+'/', f'通过可旋转、可拆解的三维图示学习{title}，阅读中文讲解，完成练习并查看解析。') for c,title in zip(CHAPTERS,TITLES)]
    for route,description in pages:
        p = ROOT / route / 'index.html'
        s = p.read_text(encoding='utf-8')
        s = re.sub(r'\n<!-- deployment metadata -->[\s\S]*?<!-- /deployment metadata -->\n', '\n', s)
        title = re.search(r'<title>(.*?)</title>',s)[1]
        meta = f'''\n<!-- deployment metadata -->
<meta name="description" content="{description}">
<link rel="canonical" href="{HOST}/{route}">
<meta property="og:type" content="website">
<meta property="og:locale" content="zh_CN">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{HOST}/{route}">
<!-- /deployment metadata -->\n'''
        s = s.replace('</head>',meta+'</head>')
        p.write_text(s,encoding='utf-8')
    (ROOT/'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {HOST}/sitemap.xml\n',encoding='utf-8')
    urls = ''.join(f'  <url><loc>{HOST}/{route}</loc></url>\n' for route,_ in pages)
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'</urlset>\n',encoding='utf-8')

metadata()
out = ROOT/'qa-artifacts'/'public'
out.mkdir(parents=True,exist_ok=True)
files = [ROOT/f for f in ['index.html','atlas.css','LICENSE','robots.txt','sitemap.xml']]
files += [ROOT/'equations'/'index.html']
files += [p for p in (ROOT/'engine').iterdir() if p.suffix in ['.js','.css']]
files += [p for p in (ROOT/'img').iterdir() if p.suffix in ['.jpg','.png','.webp']]
files += [ROOT/c/f for c in CHAPTERS for f in ['index.html','main.js','model.js','world.js','pages.js','practice.js']]
manifest = {}
for p in files:
    rel = p.relative_to(ROOT)
    target = out/rel
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(p,target)
    manifest[rel.as_posix()] = hashlib.sha256(p.read_bytes()).hexdigest()
archive = ROOT/'qa-artifacts'/'physics-public.tar.gz'
with tarfile.open(archive,'w:gz') as tar:
    for rel in manifest:
        tar.add(out/rel,arcname=rel)
(ROOT/'qa-artifacts'/'deploy-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(f'{len(manifest)} public files; bundle {archive}')
