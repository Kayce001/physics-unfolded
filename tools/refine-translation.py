"""Apply physics terminology corrections and preserve equation-only content."""
import json
import re
from pathlib import Path

p = Path('.translation/jobs.json')
jobs = json.loads(p.read_text(encoding='utf-8'))
overrides = {
    'Physics, taken apart.': '把物理，一层层展开。',
    'Learn each chapter with in-depth visuals and explanations': '用可交互的三维图示，读懂每一章物理。',
    'potential as height': '用高度表示电势',
    'Positive and negative work': '正功与负功',
    'The potential well': '势阱', 'The potential hill': '电势构成的山丘',
    'Charge in the volume': '体积内的电荷', 'Charge': '电荷',
    'Charge on the surface only': '电荷仅分布在表面',
    'charge all the way through': '电荷分布在整个体积内',
    'charge all through it': '电荷分布在整个体积内',
    'Four charges, six pairs': '四个电荷，六组电荷对',
    'A closed box, the charge outside': '封闭盒面，电荷位于面外',
    'A ring of charge': '带电圆环', 'A line of charge': '线电荷',
    'Line of charge': '线电荷', 'A disc of charge': '带电圆盘',
    'Uneven charge': '不均匀的电荷分布', 'Charging objects': '使物体带电',
    'a bar moving through a field': '在磁场中运动的导体棒',
    'coil 1’s changing field threads coil 2': '线圈 1 变化的磁场穿过线圈 2',
    'A loop crossing a field': '穿过磁场的线框',
    'steel ball · sinks': '钢球 · 下沉', 'Height = potential; arrows run downhill': '高度表示电势；箭头指向电势降低的方向',
    'the area under the <i>a</i>–<i>t</i> graph since launch': '从抛出时刻起 <i>a</i>–<i>t</i> 图线下的面积',
    'ΔU_g since release': '释放后的 ΔU_g',
    'weight, normal': '重力、支持力', 'normal F<sub>N</sub>': '支持力 F<sub>N</sub>',
}
corrected = preserved = 0
math_words = set('sin cos tan cot sec csc ln log exp sqrt atan asin acos pi max min abs m s kg N J W C V A T H F Hz Pa eV rad cm mm km ms kJ mJ kN mN μN μC nC pC μF nF pF kV mV mA μA mT μT kPa mW kW MW cm² cm³ g mg dm dt dx dy dv dU dV dE dB dA dS dl ds dq dp dL dI dQ dΦ dθ dω a b x y z t v r h u U R L C I B E F P Q K A V M N T G f q p w d l k c n e div curl'.split())
for job in jobs.values():
    source, result = job['source'], job['translation']
    if not result:
        raise RuntimeError('Incomplete translations')
    before = result
    # A bare expression or equation fragment should remain mathematical notation.
    plain = re.sub(r'<[^>]+>|ZXQ\d+XQZ|&[\w#]+;', '', source)
    words = re.findall(r'[A-Za-z]+', plain)
    if words and all(w in math_words for w in words):
        result = source
        preserved += 1
    else:
        for pattern, old, new in [
            (r'\bimpulse\b', '冲动', '冲量'), (r'\btorque', '扭矩', '力矩'),
            (r'\bpotential', '潜力', '电势'), (r'\bpotential', '电位', '电势'),
            (r'\bfield', '田野', '场'), (r'\bbar\b', '酒吧', '导体棒'),
            (r'\bpositive', '积极', '正'), (r'\bnegative', '消极', '负'),
            (r'\bnormal', '正常', '支持力'), (r'\bweight', '重量', '重力'),
            (r'\blaunch', '发布', '抛出'), (r'\brelease', '发布', '释放'),
            (r'\bmass\b', '弥撒', '质量'), (r'\bnet force', '净力', '合力'),
        ]:
            if re.search(pattern, source, re.I):
                result = result.replace(old, new)
        if re.search(r'\bcharges?\b', source, re.I) and not re.search(r'charg(?:ing|ed)|discharg|battery|capacitor',source,re.I):
            result = result.replace('充电', '电荷')
        result = result.replace('物理图集','物理展开').replace('物理图谱','物理展开')
        # Displayed equation blocks retain exactly the original math and interpolation.
        eq = r'<div class="eq">[\s\S]*?</div>'
        original = re.findall(eq,source)
        translated = re.findall(eq,result)
        if len(original) != len(translated):
            raise ValueError('Equation markup changed')
        for a,b in zip(original,translated):
            result = result.replace(b,a,1)
        if source in overrides:
            result = overrides[source]
    if result != before:
        corrected += 1
    job['translation'] = result
p.write_text(json.dumps(jobs,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Refined {corrected} strings; preserved {preserved} math-only strings')
