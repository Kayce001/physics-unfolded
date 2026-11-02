"""Finish branding, shared navigation, language metadata and CJK typography."""
from pathlib import Path
import re

chapters = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split()
titles = '运动学 牛顿运动定律 圆周运动 功与能 动量 振动 转动 流体 静电学 高斯定律 电势 电容器 电路 磁场 电磁感应'.split()
for p in [Path('index.html'), Path('equations/index.html'), *[Path(c)/'index.html' for c in chapters]]:
    s = p.read_text(encoding='utf-8').replace('lang="en"','lang="zh-CN"')
    s = s.replace('https://github.com/nathanliow/atlas-of-physics','https://github.com/Kayce001/physics-unfolded')
    s = s.replace('Atlas of Physics','物理展开')
    s = s.replace('Drag to turn · shift-drag to pan · click to break it down','拖动旋转 · Shift + 拖动平移 · 点击查看拆解')
    s = s.replace('Scroll to turn the page','滚动以翻页')
    s = re.sub(r'<title>.*?</title>', '<title>' + (titles[chapters.index(p.parent.name)]+' · 物理展开' if p.parent.name in chapters else '公式表 · 物理展开' if p.parent.name=='equations' else '物理展开 · Physics Unfolded') + '</title>',s)
    if p.parent.name in chapters:
        title = titles[chapters.index(p.parent.name)]
        s = re.sub(r'(<span class="crumb">).*?(</span>)',lambda m:m[1]+f'第 {chapters.index(p.parent.name)+1:02} 章 · {title}'+m[2],s)
    s = re.sub(r'<script defer src="/_vercel/insights/script.js"></script>\s*','',s)
    p.write_text(s,encoding='utf-8')

p = Path('engine/book.js')
s = p.read_text(encoding='utf-8')
for a,b in {
    '>Practice<':'>练习<', '>Compare<':'>对照理解<', '>Equations<':'>公式表<',
    '>Show the solution<':'>查看解答<', '>Next page<':'>下一页<',
    'aria-label="Previous page"':'aria-label="上一页"',
    'aria-label="Next page"':'aria-label="下一页"',
    'aria-label="Source on GitHub"':'aria-label="GitHub 源码"',
    'https://github.com/nathanliow/atlas-of-physics':'https://github.com/Kayce001/physics-unfolded',
    '`Fig. ${':'`图 ${', '`Page ${i + 1}: ${p.title}`':'`第 ${i + 1} 页：${p.title}`',
}.items():
    s=s.replace(a,b)
p.write_text(s,encoding='utf-8')

p=Path('atlas.css')
s=p.read_text(encoding='utf-8').replace("'EB Garamond', Georgia, serif", "'EB Garamond', 'Noto Serif SC', 'Songti SC', SimSun, serif").replace("'Inter', system-ui, sans-serif", "'Inter', 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', system-ui, sans-serif")
s += '''\n/* Chinese prose needs comfortable spacing; equations keep their original font. */
:lang(zh-CN) .sheet { line-height: 1.8; }
:lang(zh-CN) .sheet h1 { line-height: 1.2; }
:lang(zh-CN) .card h2 { line-height: 1.25; }
:lang(zh-CN) .sheet p, :lang(zh-CN) .qtext { overflow-wrap: anywhere; }
'''
p.write_text(s,encoding='utf-8')
