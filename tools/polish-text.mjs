// Editorial fixes for untranslated emphasis and introductory wording.
import fs from 'node:fs';
import { parse } from 'acorn';
const chapters = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ');
const words = { current:'电流', emf:'电动势', parallel:'平行', conduction:'接触带电', Work:'功', Power:'功率', fluid:'流体', gauge:'表压', flux:'通量', Position:'位置', Distance:'路程', Velocity:'速度', Speed:'速率', moving:'运动', same:'相同', Momentum:'动量', elastic:'弹性', force:'力', Tension:'拉力', Equilibrium:'平衡', drag:'阻力', Drag:'阻力', oscillation:'振动', equilibrium:'平衡位置', mass:'质量', Potential:'电势', equipotials:'等势面', conductor:'导体' };
Object.assign(words, { one:'一个', energy:'能量', other:'另一个', second:'第二', top:'最高点', speed:'速率', bottom:'最低点', outer:'外部', square:'平方', velocity:'速度', twice:'两倍', horizontal:'水平', inside:'内部', end:'末端', field:'场', most:'最大', sticks:'粘在一起' });
for (const c of chapters) {
  for (const f of ['pages.js','practice.js','world.js']) {
    const p = `${c}/${f}`;
    let s = fs.readFileSync(p,'utf8');
    for (const [en,zh] of Object.entries(words)) s = s.replaceAll(`<b>${en}</b>`,`<b>${zh}</b>`);
    s = s.replaceAll('头寸','位置').replaceAll('净变化','变化量').replaceAll('图表','图像');
    // In the motion chapter, distance means path length (路程), not separation.
    if (c === 'kinematics') s = s.replaceAll('位移和距离','位移和路程').replaceAll('<th>距离</th>','<th>路程</th>');
    fs.writeFileSync(p,s);
  }
}
const p = 'kinematics/pages.js';
let s = fs.readFileSync(p,'utf8');
const ast = parse(s,{ecmaVersion:'latest',sourceType:'module'});
const array = ast.body.find(n=>n.type==='ExportNamedDeclaration' && n.declaration?.declarations?.[0].id.name==='PAGES').declaration.declarations[0].init;
const introductions = [
  '`<p class="lede">运动学用三个量描述运动：物体在哪里、运动得多快，以及速度如何变化。它不讨论运动的原因。</p><p>本章从一个以 ${f(M.VY0)} m/s 的初速度竖直向上抛出的小球开始。离手后，小球只受重力，因此始终做自由落体运动；上升和下落阶段都是如此。</p><p>小球上升 ${f(M.T / 2)} s，在抛出点上方 ${f(M.H)} m 处瞬时速度为零，并在抛出 ${f(M.T)} s 后回到原高度。右侧动画以半速播放。</p>`',
  '`<p class="lede"><b>位置</b> <i>y</i> 表示小球相对坐标原点的位置。这里以抛出点为原点，规定竖直向上为正方向。</p><p><b>位移</b> Δ<i>y</i> = <i>y</i><sub>f</sub> − <i>y</i><sub>0</sub> 是位置的变化量。位移是矢量，既有大小，也有方向；图中坐标轴旁的黑色箭头表示位移。</p><p><b>路程</b> 是运动路径的总长度。它是标量，不会为负。</p><table class="data"><tr><th></th><th>位移</th><th>路程</th></tr><tr><td>抛出点 → 最高点</td><td>+${f(M.H)} m</td><td>${f(M.H)} m</td></tr><tr><td>抛出点 → 回到原高度</td><td>0.00 m</td><td>${f(2 * M.H)} m</td></tr></table>`',
  '`<p class="lede"><b>平均速度</b> <i>v</i> = Δ<i>y</i>/Δ<i>t</i> 描述位置变化的快慢和方向。<b>速率</b> 只表示运动的快慢，不包含方向。</p><p>图中的箭头表示瞬时速度。它从 +${f(M.VY0)} m/s 开始，在最高点减小到零；随后向下增大，回到抛出高度时为 −${f(M.VY0)} m/s。抛出和返回时的速率相同，速度则方向相反。</p><p>对整个往返过程，平均速度和平均速率也有区别：</p><table class="data"><tr><td>平均速度</td><td>Δ<i>y</i>/Δ<i>t</i> = 0 / ${f(M.T)} = 0 m/s</td></tr><tr><td>平均速率</td><td>路程/Δ<i>t</i> = ${f(2 * M.H)} / ${f(M.T)} = ${f(2 * M.H / M.T)} m/s</td></tr></table>`',
  '`<p class="lede"><b>加速度</b> <i>a</i> = Δ<i>v</i>/Δ<i>t</i>。小球在上升、到达最高点和下落时，加速度始终是 −${f(M.G)} m/s²；红色箭头保持不变。</p><p>半透明小球表示每隔 ${f(tau, 1)} s 记录一次的位置。上升时，相邻位置的间距每次减少 <i>g</i>τ² = ${f(M.G * tau * tau)} m；下落时，小球依次经过相同的高度。</p><p><b>怎样判断加速还是减速？</b>比较速度与加速度的符号。二者异号时，速率减小，对应上升阶段；二者同号时，速率增大，对应下落阶段。两种情况下都存在加速度。</p><p class="live" id="live-sign"></p>`'
];
const edits = introductions.map((text,i)=>({node:array.elements[i].properties.find(p=>p.key.name==='body').value,text}));
for (const {node,text} of edits.sort((a,b)=>b.node.start-a.node.start)) s=s.slice(0,node.start)+text+s.slice(node.end);
fs.writeFileSync(p,s);
