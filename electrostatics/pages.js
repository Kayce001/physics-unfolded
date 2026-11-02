// Chapter 9, page by page (after the AP Physics C: E&M organizer, Unit 1). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, S, E_SCALE, F_SCALE, PL } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const p = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** p; return `${m.toFixed(n)} × 10<sup>${p < 0 ? '−' + -p : p}</sup>`; };
const cm = x => (x * 100).toFixed(0);
const kNC = x => (x / 1000).toFixed(2);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 150, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
const curve = (x0, x1, fn, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });
const clip = (y, y1) => Math.min(y, y1);
// chart ranges shared with main.js (live cursors)
export const RANGE = {
  induce: { x0: 0, x1: Math.ceil(M.INDUCE.run), y0: -1, y1: 4 },
  coulomb: { x0: 15, x1: 50, y0: 0, y1: 4 },
  line: { x0: 10, x1: 40, y0: -0.4, y1: 0.3 },
  field: { x0: 5, x1: 35, y0: 0, y1: 4 },
  dipole: { x0: 10, x1: 50, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 40, y0: 0, y1: 4 },
  ring: { x0: 0, x1: 60, y0: 0, y1: 1.5 },
  plates: { x0: 0, x1: 12, y0: 0, y1: 14 },
};
const at = (k, x = 0, y = 0.4) => [STATIONS[k] + x, y, 0];
const R = RANGE;

const pairF = r => M.coulomb(M.PAIR.q1, M.PAIR.q2, r);
const inducedSeries = () => curve(0, M.INDUCE.run, t => M.induce(t).Qnet / M.nC, 200);

export const PAGES = [
  {
    kicker: "第9章", title: "电荷量", sub: "以电子计算",
    body: `<p class="lede">原子由带电部分构成：原子核中的<b>质子</b> (+)、其周围的<b>电子</b> (−)以及中性中子。电荷相斥；相反电荷相吸。</p>
      <table class="data">
        <tr><th>粒子</th><th>电荷</th><th>质量</th></tr>
        <tr><td>质子</td><td>+<i>e</i></td><td>${sci(M.MP)}公斤</td></tr>
        <tr><td>电子</td><td>−<i>e</i></td><td>${sci(M.ME)} kg</td></tr>
        <tr><td>neutron</td><td>0</td><td>≈ <i>m</i><sub>p</sub></td></tr>
      </table>
      <div class="eq">1 <i>e</i> = ${sci(M.QE)} C</div>
      <p>E等号：<b>中性</b>。额外电子：<b>负</b>。太少：<b>正</b>。在带电固体中，只有电子移动，每次电荷都是 <i>e</i>.</p> 的整数倍
      <p><b>电荷守恒：</b>电荷永远不会被制造或销毁，只会被移动。用毛皮摩擦一根棒，一个得到+<i>q</i>，另一个得到−<i>q</i>.</p>
      <p class="hintline">点击原子找到多余的电子和缺失的电子。</p>`,
    cam: { target: at('charge', 0, 0.3), az: -14, el: 10, dist: 25 }, lit: 'atoms', scene: 'atoms', look: {},
    fig: "中性、负面、正面",
  },
  {
    kicker: '9.1', title: "使物体带电", sub: "电子移动的四种方式",
    body: `<p class="lede">Charging从不充电。它将电子移动到物体上、离开物体或穿过物体。</p>
      <table class="data">
        <tr><td><b>摩擦</b></td><td>PVC上的摩擦毛皮：电子交叉</td></tr>
        <tr><td><b>接触带电</b></td><td>触摸：铺展在金属上，保持在绝缘体上</td></tr>
        <tr><td><b>感应</b></td><td>无接触：将金属电子推开，将其接地</td></tr>
        <tr><td><b>极化</b></td><td>an绝缘体的分子伸展成偶极子</td></tr>
      </table>
      <p>${f(M.ROD.Q / M.nC, 0)} nC 杆在 ${cm(M.ROD.near)} 厘米内。球体的自由电子聚集到远端；接地可以让他们逃脱。球体保持<b>+${f(M.QG / M.nC)} nC</b>，与杆相反。</p>
      <div class="charts">${chart({ ...R.induce, xlabel: 'time (s)', ylabel: 'net charge on the sphere (nC)', cursor: 'induce', label: 'Net charge on the sphere through the induction cycle',
        series: [{ pts: inducedSeries() }] })}</div>
      <p class="hintline">Bead尺寸为表面电荷σ。单击球体或气球。</p>`,
    cam: { target: at('charging', -0.3, 0.4), az: -8, el: 8, dist: 32 }, lit: 'induce', scene: 'induce', look: {},
    fig: "感应和极化",
  },
  {
    kicker: '9.2', title: "库仑定律", sub: "平方反比",
    body: `<p class="lede">两点电荷之间的力随着电荷的乘积而增大，随着距离的平方而减小。</p>
      <div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>²</div>
      <p><i>k</i> = 1/4πε<sub>0</sub> = ${sci(M.K)} N·m²/C²。使用尺寸|<i>q</i>|；标志只说吸引或排斥。这两个力是第三定律对：相等，即使一个电荷是另一个电荷的两倍。</p>
      <div class="charts">${chart({ ...R.coulomb, xlabel: 'separation r (cm)', ylabel: 'force on each (N)', cursor: 'coulomb', label: 'Force against separation, falling as one over r squared',
        series: [{ pts: curve(15, 50, x => clip(pairF(x / 100), 4)) }], marks: [[20, pairF(0.2), `${f(pairF(0.2))} N`], [40, pairF(0.4), `${f(pairF(0.4))} N`, -46, -8]] })}</div>
      <p><b>有多强？</b> 给两个相距 1 m 的 ${M.PEOPLE.m} kg 人，质子比电子多 1%：每个 ${sci(M.PEOPLE.q)} C，且 <i>F</i> = ${sci(M.PEOPLE.F)} N，足以使地球加速${f(M.PEOPLE.a, 1)} m/s².</p>
      <p class="hintline">${S}×全尺寸；每牛顿力 ${cm(F_SCALE.coulomb)} 厘米。点击查看类似的一对。</p>`,
    cam: { target: at('coulomb', 0, 0.1), az: -12, el: 8, dist: 13 }, lit: 'coulomb', scene: 'coulomb', look: {},
    fig: `+${M.PAIR.q1 / M.uC} μC 和 −${-M.PAIR.q2 / M.uC} μC`,
  },
  {
    kicker: '9.3', title: "合力", sub: "和平衡点",
    body: `<p class="lede"> 对于多个电荷，找到电荷上的每个力，然后将它们添加为向量： <b> 叠加 </b>.</p>
      <p>A +${f(M.LINE.q0 / M.uC, 1)} μC 测试电荷位于 A (+${M.LINE.qA / M.uC} μC) 和 B (+${M.LINE.qB / M.uC} μC) 之间，相距 ${cm(M.LINE.D)} cm。双方都推。推平衡式</p>
      <div class="eq sm"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)² → <i>x</i> = ${cm(M.LINE.xEq)} cm</div>
      <p>平衡点始终是<b>更靠近较小电荷</b>。它不需要位于它们之间：使 B 为负值，并且它移出 B，到达 ${cm(M.LINE.xEqUnlike)} cm.</p>
      <div class="charts">${chart({ ...R.line, xlabel: 'position x (cm)', ylabel: 'net force on q₀ (N)', cursor: 'line', label: 'Net force on the test charge against position, crossing zero at the equilibrium point',
        series: [{ pts: curve(10, 40, x => Math.max(Math.min(M.lineForces(x / 100).net[0], 0.3), -0.4)) }], marks: [[M.LINE.xEq * 100, 0, `${cm(M.LINE.xEq)} cm`, 6, -8]] })}</div>
      <p class="hintline"> 每 0.01 N 施加 ${f(F_SCALE.line, 0)} cm 的力。单击将测试电荷停放在平衡点。</p>`,
    cam: { target: at('line', 0, 0.3), az: -10, el: 8, dist: 15.5 }, lit: 'line', scene: 'line', look: {},
    fig: "A 和 B 之间的测试电荷",
  },
  {
    kicker: '9.4', title: "电场", sub: "每单位电荷的力",
    body: `<p class="lede">电荷会改变它周围的空间。一个小正 <b>测试费用</b> <i>q</i><sub>0</sub> 放置在任何地方都能感受到一股力量；场是每库仑的力。</p>
      <div class="eq"><b>E</b> = <b>F</b>/<i>q</i><sub>0</sub> = (<i>kQ</i>/<i>r</i>²) <b>r̂</b></div>
      <p><b>r̂</b> 点远离 <i>Q</i>。对于+<i>Q</i> 现场指出；对于 -<i>Q</i>，英寸。单位 N/C。</p>
      <table class="data">
        <tr><td><b>场线</b></td><td>方向和力量取决于他们的拥挤程度；从 + 开始，从 - 结束</td></tr>
        <tr><td><b>场向量</b></td><td>尺寸也： ${f(M.pointMag(M.POINT.Q, 0.1), 0)}, ${f(M.pointMag(M.POINT.Q, 0.2), 0)}, ${f(M.pointMag(M.POINT.Q, 0.3), 0)} N/C at 10, 20, 30 cm</td></tr>
      </table>
      <div class="charts">${chart({ ...R.field, xlabel: 'distance r (cm)', ylabel: 'E (kN/C)', cursor: 'field', label: 'Field strength against distance, falling as one over r squared',
        series: [{ cls: 'curve total', pts: curve(5, 35, x => clip(M.pointMag(M.POINT.Q, x / 100) / 1000, 4)) }] })}</div>
      <p class="hintline">每个单独收取的费用， ${S}× 全尺寸；乙 ${cm(E_SCALE.field * 100)} 厘米每 100 N/C。 +${f(M.POINT.q0 / M.nC, 1)} nC 测试电荷的力与 E 一样长。单击 r̂。</p>`,
    cam: { target: at('field', 0, 0.4), az: -8, el: 8, dist: 35 }, lit: 'point', scene: 'point', look: {},
    fig: `+${M.POINT.Q / M.nC} nC 和 -${M.POINT.Q / M.nC} nC`,
  },
  {
    kicker: '9.5', title: "电偶极子", sub: "字段作为向量相加",
    body: `<p class="lede">两个相反的电荷 ±<i>q</i>, 2<i>a</i> 分开。 <b>E</b> at P 是每个电荷场的矢量和。</p>
      <p><b>在轴上</b> 两个区域都位于线上，较近的冲锋获胜：</p>
      <div class="eq sm"><i>E</i> = <i>kq</i>/(<i>x</i>−<i>a</i>)² − <i>kq</i>/(<i>x</i>+<i>a</i>)² = 4<i>kqax</i>/(<i>x</i>²−<i>a</i>²)²</div>
      <p><b>在平分线上</b> 的 <i>y</i> 部分取消并且 <i>x</i> 零件添加：</p>
      <div class="eq sm"><i>E</i> = 2 · <i>kq</i>/(<i>a</i>²+<i>y</i>²) · 余弦θ = 2<i>kqa</i>/(<i>a</i>²+<i>y</i>²)<sup>3/2</sup></div>
      <p>远处这些变成了 4<i>kqa</i>/<i>x</i>3 和 2<i>kqa</i>/<i>y</i>³：两个字段几乎抵消，因此 E 为 <b>1/<i>r</i>³</b>.</p>
      <div class="charts">${chart({ ...R.dipole, xlabel: 'distance from the centre (cm)', ylabel: 'E (kN/C)', cursor: 'dipole', label: 'Dipole field on the axis and on the bisector against distance, with their far-field approximations',
        series: [{ cls: 'curve total', pts: curve(20, 50, x => clip(M.dipoleAxis(x / 100) / 1000, 2)), tag: [27, 1.0, 'axis'] }, { cls: 'curve trend', pts: curve(20, 50, x => clip(4 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) },
          { cls: 'curve total', pts: curve(10, 50, x => clip(M.dipoleBisector(x / 100) / 1000, 2)), tag: [15.5, 0.75, 'bisector'] }, { cls: 'curve trend', pts: curve(14, 50, x => clip(2 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) }] })}</div>
      <p class="hintline">虚线：1/r³。 ${S}× 全尺寸；乙 ${cm(E_SCALE.dipole * 100)} 厘米每 100 N/C。单击将 E 拆分为 E₊ 和 E₋。</p>`,
    cam: { target: at('dipole', -0.6, 0.2), az: -10, el: 8, dist: 19 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: `±${M.DIPOLE.q / M.nC} nC, ${cm(2 * M.DIPOLE.a)} 相距厘米`,
  },
  {
    kicker: '9.6', title: "带电棒", sub: "把切片加起来",
    body: `<p class="lede">将棒材切成片 d<i>x</i>，每个持有 d<i>q</i> = λ d<i>x</i> (λ = <i>Q</i>/<i>L</i> = ${f(M.RODE.lambda / M.nC, 0)} nC/米）。每个切片都是一个点电荷；整合。</p>
      <p><b>在轴上</b>, <i>a</i> 过去结束：</p>
      <div class="eq sm"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>k</i>λ[1/<i>a</i> − 1/(<i>a</i>+<i>L</i>)] = <i>kQ</i>/<i>a</i>(<i>a</i>+<i>L</i>)</div>
      <p><b>在平分线上</b>, <i>a</i> 中间上方， <i>x</i> 部分取消：</p>
      <div class="eq sm"><i>E</i> = ∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>²+<i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/<i>a</i>√(<i>L</i>²/4 + <i>a</i>²)</div>
      <p>远方（<i>a</i> ≫ <i>L</i>) 都变成 <i>kQ</i>/<i>a</i>²、点电荷。靠近中间（<i>a</i> ≪ <i>L</i>) it is 2<i>k</i>λ/<i>a</i>.</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'distance a (cm)', ylabel: 'E (kN/C)', cursor: 'rod', label: 'Rod field on the axis and on the bisector against distance, with the point-charge field',
        series: [{ cls: 'curve total', pts: curve(2, 40, x => clip(M.rodAxis(x / 100) / 1000, 4)), tag: [3.5, 1.5, 'axis'] }, { cls: 'curve total', pts: curve(3, 40, x => clip(M.rodBisector(x / 100) / 1000, 4)), tag: [13, 2.0, 'bisector'] },
          { cls: 'curve trend', pts: curve(10, 40, x => clip(M.K * M.RODE.Q / (x / 100) ** 2 / 1000, 4)), tag: [24, 0.75, 'kQ/a²'] }] })}</div>
      <p class="hintline">${S}× 全尺寸；乙 ${cm(E_SCALE.rod * 100)} 厘米每 100 N/C。单击将杆切割成 ${M.RODE.slices} 切片。</p>`,
    cam: { target: at('rod', 0, 1.0), az: -10, el: 8, dist: 21 }, lit: 'rod', scene: 'rod', look: {},
    fig: `+${M.RODE.Q / M.nC} nC on a ${cm(M.RODE.L)} 厘米杆`,
  },
  {
    kicker: '9.7', title: "带电圆环", sub: "和一张光盘",
    body: `<p class="lede">每个环到其轴上点 P 的距离相同。横向部分取消；只有 cos φ = <i>z</i>/√(<i>z</i>²+<i>R</i>²) 每个都幸存下来。</p>
      <div class="eq sm"><i>E</i> = ∫<sub>0</sub><sup>2π</sup> <i>k</i>λ<i>R</i> d<i>θ</i> · <i>z</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup></div>
      <p>零在中心， <i>kQ</i>/<i>z</i>² 很远，并且之间有一个高峰，在 <i>z</i> = <i>R</i>/√2 = ${f(M.RING_ZMAX * 100, 1)} cm.</p>
      <div class="charts">${chart({ ...R.ring, xlabel: 'distance along the axis z (cm)', ylabel: 'E (kN/C)', cursor: 'ring', label: 'Ring field along the axis: zero at the centre, a peak, then falling',
        series: [{ cls: 'curve total', pts: curve(0, 60, x => M.ringAxis(x / 100) / 1000) }, { cls: 'curve trend', pts: curve(31, 60, x => clip(M.K * M.RING.Q / (x / 100) ** 2 / 1000, 1.5)), tag: [44, 0.55, 'kQ/z²'] }], marks: [[M.RING_ZMAX * 100, M.ringAxis(M.RING_ZMAX) / 1000, 'R/√2', 6, -6]] })}</div>
      <p><b>一张光盘</b> 是一堆环，d<i>q</i> = σ 2π<i>r</i> d<i>r</i>:</p>
      <div class="eq sm"><i>E</i> = (σ/2ε<sub>0</sub>)(1 − <i>z</i>/√(<i>z</i>²+<i>R</i>²))</div>
      <p>就在其中心上方，它是 σ/2ε<sub>0</sub>，不为零：光盘在 P 正下方带有电荷。</p>
      <p class="hintline">${S}× 全尺寸；乙 ${cm(E_SCALE.ring * 100)} 厘米每 100 N/C，d<i>E</i> ×2。点击查看碎片。</p>`,
    cam: { target: at('ring', -0.4, 0.5), az: -30, el: 12, dist: 20 }, lit: 'ring', scene: 'ring', look: {},
    fig: `+${(M.RING.Q / M.nC).toFixed(0)} nC 在环上，R = ${cm(M.RING.R)} cm`,
  },
  {
    kicker: '9.8', title: "均匀的场", sub: "再次抛射运动",
    body: `<p class="lede">在两个带相反电荷的大板之间，从+到-，场在各处都是相同的。那里的电荷会感受到恒定的力并像抛出的球一样移动。</p>
      <div class="eq"><i>F</i> = <i>qE</i> = <i>ma</i></div>
      <p>一个电子在${sci(M.PLATES.v0, 1)} m/s处进入； <i>E</i> = ${M.PLATES.E} 常闭。其力点<i>against</i> <b>E</b>，朝向+板。</p>
      <table class="data">
        <tr><td><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub></td><td>${sci(M.PLATES.a)} m/s²，向上</td></tr>
        <tr><td><i>t</i> = <i>L</i>/<i>v</i><sub>0</sub></td><td>${f(M.PLATES.tCross * 1e9, 1)} 之间的 ns ${cm(M.PLATES.L)} 厘米板</td></tr>
        <tr><td><i>y</i> = ½<i>at</i>²</td><td>${f(M.PLATES.yExit * 1000, 2)} 毫米；叶子位于 ${f(M.PLATES.angle, 1)}°</td></tr>
      </table>
      <p>A质子会向另一个方向弯曲，${f(M.MP / M.ME, 0)}×小于：${f(M.PLATES.yProton * 1e6, 1)} μm.</p>
      <div class="charts">${chart({ ...R.plates, xlabel: 'x (cm)', ylabel: 'y (mm)', cursor: 'plates', label: 'The electron path: a parabola between the plates, then a straight line',
        series: [{ pts: curve(0, M.PLATES.run, t => [M.electron(t).x * 100, M.electron(t).y * 1000]).map(p => p[1]) }, { cls: 'curve trend', pts: [[M.PLATES.L * 100, 0], [M.PLATES.L * 100, 14]], tag: [M.PLATES.L * 100 - 3.6, 12, 'plates end'] }] })}</div>
      <p class="hintline">减慢~10⁹×； ${PL.S}×全尺寸； E ${f(PL.E * 100 * 1000, 0)} 厘米/kN/C。单击查看 v<sub>x</sub>、v<sub>y</sub>.</p>`,
    cam: { target: at('plates', -0.1, 0.5), az: -10, el: 5, dist: 17 }, lit: 'plates', scene: 'plates', look: {},
    fig: "带电板之间的电子",
  },
];

// ---------- click a scene: what it breaks into ----------
const ind = s => s.induce;
export const PLATES = {
  atoms: { text: `所有三个都具有相同的原子核：6 个质子，+6<i>e</i>。负离子获得了一个额外的电子，并在此处被拉出。正离子失去了一个；轮廓标记了它的空位置。净电荷始终为（质子 - 电子）× <i>e</i>。 （一幅漫画：真实的原子直径约为 10⁻10 米，原子核小 100 000 倍，电子不像行星那样绕轨道运行。）`,
    facts: () => M.ATOMS.map(a => [a.name, `${a.p} − ${a.e} = ${a.p - a.e >= 0 ? (a.p - a.e ? '+' : '') : '−'}${Math.abs(a.p - a.e)} e = ${a.p === a.e ? '0' : (a.p > a.e ? '+' : '−') + sci(M.QE)} C`]) },
  induce: { text: `珠子尺寸是球体上的表面电荷密度 σ。当杆靠近且没有任何连接时，σ 在近侧为 +，在远侧为 -，但加起来仍然为零：电子只是移动了。接地可以让远端电子离开。留下来的东西被杆固定住，一旦杆离开，就会均匀地散开。`,
    facts: s => { const st = ind(s); return [['stage', st.stage], ["杆尖至中心", st.rod ? `${cm(st.dTip)} cm` : 'gone'], ["球体净电荷", `${f(st.Qnet / M.nC)} nC`], ["接地后", `−Σ q R/d = +${f(M.QG / M.nC)} nC`]]; } },
  balloon: { text: `墙壁是绝缘体，因此它的电子无法离开其分子。每个分子只是拉伸，其−端朝向+气球。 - 端更近，因此它们的吸引力击败了 + 端的排斥力，气球被拉近。此处的拉伸随着气球的场而增长。`,
    facts: s => { const g = s.balloonGap, r = g + M.BALLOON.r; return [["气球电荷", `+${M.BALLOON.q / M.nC} nC`], ["与墙的间隙", `${f(g * 100, 1)} cm`], ["墙上的气球场", `${kNC(M.K * M.BALLOON.q / (r * r))} kN/C`]]; } },
  coulomb: { text: `下面是一对距离相同的同类：它相互排斥。 +4 μC 电荷与两对中较小的电荷感受到的力大小相同。乘积 q₁q2 决定了力的大小，符号决定了它是吸引还是排斥。`,
    facts: s => { const r = s.pairR; return [['r', `${f(r * 100, 1)} cm`], ['F = k|q₁q₂|/r²', `${f(pairF(r))} N`], ['F at 2r', `${f(pairF(2 * r))} N (¼)`], ["不像对", 'attract'], ["像一对", 'repel']]; } },
  line: { text: `停在 x<sub>eq</sub>，两股推动力大小相等且方向相反，红网力量消失。无论向哪个方向轻推它，较近的电荷都会将其推回：沿着这条线，该点是稳定的。方法：（1）决定平衡的位置，各力从哪个方向指向； (2) 使力相等并求解距离； (3) 检查是否更接近较小的电荷。`,
    facts: () => { const r = M.lineForces(M.LINE.xEq); return [['x<sub>eq</sub>', `${cm(M.LINE.xEq)} 距 A 厘米`], ["F<sub>A</sub> 那里", `${f(r.FA[0], 3)} N →`], ["F<sub>B</sub> 那里", `${f(-r.FB[0], 3)} N ←`], ['net', `${f(Math.abs(r.net[0]), 3)} N`]]; } },
  point: { text: `测试电荷在 20 cm 处停止。 r̂（灰色）是一个单位向量，长度为 1，指向从电荷到测试电荷的位置。该字段是 <i>kQ</i>/<i>r</i>² 乘 r̂。对于−Q，相同的公式得出−r̂，因此正测试电荷上的力指向内。`,
    facts: () => { const r = 0.2, E = M.pointMag(M.POINT.Q, r); return [['r', `${f(r * 100, 1)} cm`], ['E = kQ/r²', `${f(E, 0)} N/C`], ['F = q₀E', `${sci(M.POINT.q0 * E)} N`], ['r̂', `(cos 22.5°, sin 22.5°) = (${f(Math.cos(M.POINT.ang))}, ${f(Math.sin(M.POINT.ang))})`]]; } },
  dipole: { text: `在每个 P 处，细箭头是 E₊（从 +q 指向远处）和 E₋（指向 −q）。在轴线上，它们指向相反的方向，较近的一方获胜。在平分线上，它们相等：灰色 y 部分相消，x 部分相加。对于任意一组电荷的方法： (1) 求每个电荷在 P 处的场； (2) 查看哪些分量通过对称性抵消； (3) 根据边长用 sin 和 cos 计算余数； (4)添加。`,
    facts: s => { const x = s.dipoleX, y = s.dipoleY, a = M.DIPOLE.a, k = M.K * M.DIPOLE.q; return [['axis: E₊ − E₋', `${f(k / (x - a) ** 2, 0)} − ${f(k / (x + a) ** 2, 0)} = ${f(M.dipoleAxis(x), 0)} N/C`], ["平分线：每个", `${f(k / (a * a + y * y), 0)} N/C`], ['bisector: 2 E cos θ', `${f(M.dipoleBisector(y), 0)} N/C`]]; } },
  rod: { text: `两个 P 靠得很近。杆被拉开进入 ${M.RODE.slices} 片，每个片一个点电荷 Q/${M.RODE.slices}。它们在上部 P 处的 dE 箭头对称地散开，因此侧面部分抵消。它们的向量和已经接近积分；更多、更薄的切片使其更加精确。在平分线上积分使用 ∫x dx/(x²+a²)<sup>3/2</sup> = −1/(x²+a²)<sup>1/2</sup>，这给出了 E<sub>x</sub> = 0 在对称极限之间，且 ∫dx/(x²+a²)<sup>3/2</sup> = x/a²(x²+a²)<sup>1/2</sup> 对于E<sub>y</sub>.`,
    facts: () => { const b = M.RODE.b0, sum = M.sumE(M.rodSlices(M.RODE.slices), [0, b, 0])[1]; return [['a (bisector)', `${f(b * 100, 1)} cm`], [`总和 ${M.RODE.slices} 切片`, `${f(sum, 0)} N/C`], ['integral', `${f(M.rodBisector(b), 0)} N/C`], ['sideways', '0, cancelled']]; } },
  ring: { text: `P 停在峰值处，z = R/√2。每个 ${M.RING.beads} 件沿着它自己的环线（虚线）给出 dE。在环周围，侧面部分指向各个方向并取消；沿轴的部分全部相加。每件作品都有相同的 <i>r</i> 和相同的 cos φ，因此 θ 上的积分仅为 2π：E = 2π<i>k</i>λ<i>Rz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup>。对于光盘，将这些环集成 <i>r</i> = 0 to <i>R</i> 与 ∫<i>r</i> d<i>r</i>/(<i>z</i>²+<i>r</i>²)<sup>3/2</sup> = −1/(<i>z</i>²+<i>r</i>²)<sup>1/2</sup>.`,
    facts: () => { const z = M.RING_ZMAX, dEm = M.K * M.RING.Q / M.RING.beads / (z * z + M.RING.R ** 2); return [['z', `${f(z * 100, 1)} cm`], ["每个dE", `${f(dEm, 0)} N/C`], ['cos φ', f(z / Math.hypot(z, M.RING.R), 3)], ["E = Σ dE cos φ", `${f(M.ringAxis(z), 0)} N/C`]]; } },
  plates: { text: `两个速度分量，灰色。 v<sub>x</sub> 永远不会改变； v<sub>y</sub> 当电子位于两板之间时，电子会稳定增长，然后两者都保持固定。它是一种具有场效应重力的弹丸。频闪轮廓的间隔时间相等。`,
    facts: s => { const e = M.electron(s.plates.t); return [['t', `${f(s.plates.t * 1e9, 2)} ns`], ['v<sub>x</sub>', `${sci(e.vx)} m/s`], ['v<sub>y</sub>', `${sci(Math.max(e.vy, 1))} m/s`], ['y', `${f(e.y * 1000, 2)} mm`]]; } },
};
