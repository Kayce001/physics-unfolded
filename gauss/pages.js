// Chapter 10, page by page (after the AP Physics C E&M organizer, Unit 2). Text and an E(r) chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, Y0 } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const nC = q => f(q * 1e9, 2);
const arrowNote = s => `箭头：${f(s, 1)} 方形${s === 1 ? '' : 's'} 每kN/C。一个方格的面积是10厘米。`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const cs = [cursor, ...cursors].filter(Boolean).map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  flux: { x0: 0, x1: 180, y0: -80, y1: 80 },
  point: { x0: 0, x1: 26, y0: 0, y1: 2 },
  line: { x0: 0, x1: 22, y0: 0, y1: 0.8 },
  sheet: { x0: -15, x1: 15, y0: -0.5, y1: 0.5 },
  sphere: { x0: 0, x1: 26, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 17, y0: 0, y1: 0.8 },
  cage: { x0: -40, x1: 40, y0: 0, y1: 3.2 },
};
const kE = fn => r => fn(r / 100) / 1000;     // r in cm → E in kN/C
const sphereChart = (fn, cursor, extra = []) => chart({ ...R.sphere, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursor, label: "场强与中心距离的关系",
  vlines: [[10, 'R']], series: [...extra, { pts: curve(kE(fn), 0.001, 26, 120) }] });

export const PAGES = [
  {
    kicker: "第10章", title: "电通量", sub: "通过了多少场",
    body: `<p class="lede"><b>通量</b> 穿过表面的场的 Φ 测量穿过该表面的场的量。计算穿过表面的磁力线。</p>
      <div class="eq">Φ = <b>E</b> · <b>A</b> = <i>EA</i> cos θ</div>
      <p>面积向量<b>A</b>垂直于曲面，只要其面积即可； θ 是 <b>E</b> 和 <b>A</b> 之间的角度。更大的视野、更大的面积或更多的正面：更多的通量。单位：N·m²/C.</p>
      <p>${f(M.FLUX.side * 100, 0)} 平方厘米在均匀的 ${f(M.FLUX.E / 1000, 1)} kN/C 场中转动。正面，Φ=${f(M.FLUX.max, 0)} N·m²/C；边缘，0；超过 90°，为负。通过任何 <i>closed</i> 表面，均匀场的通量为 0.</p>
      <div class="charts">${chart({ ...R.flux, zero: true, xlabel: 'θ (°)', ylabel: 'Φ (N·m²/C)', cursor: 'flux', label: 'Flux against angle', series: [{ pts: curve(M.flux, 0, 180) }] })}</div>
      <p class="hintline">单击正方形以分割<b>E</b>。 ${arrowNote(SC.flux)}</p>`,
    cam: { target: [STATIONS.flux + 0.3, Y0 - 0.2, 0], az: -16, el: 26, dist: 17 }, lit: 'flux', scene: 'flux', look: {},
    fig: "在均匀场中转动的正方形",
  },
  {
    kicker: '10.1', title: "高斯定律", sub: "流出量 = 内部电荷",
    body: `<p class="lede">通过任何 <b> 封闭的 </b> 表面，总通量为封闭的电荷除以 ε<sub>0</sub>.</p>
      <div class="eq">∮ <b>E</b> · d<b>A</b> = <i>q</i><sub>enc</sub> / ε<sub>0</sub></div>
      <p>d<b>A</b> 指向外。球体呼吸，但 Φ 保持 ${f(M.POINT.flux, 0)} N·m²/C：<i>E</i> 下降为 1/<i>r</i>²，面积 4π<i>r</i>² 增大为 <i>r</i>²。上<b>E</b>∥d<b>A</b>和<i>E</i>是常数，所以</p>
      <div class="eq"><i>E</i> · 4π<i>r</i>² = <i>q</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kq</i>/<i>r</i>²</div>
      <p>即库仑定律。该盒子不带电荷：进入它的每一条线都会离开，因此它的通量为零。</p>
      <div class="charts">${chart({ ...R.point, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursor: 'point', label: 'Point charge field against distance', series: [{ pts: curve(kE(M.pointE), 6.5, 26) }] })}</div>
      <p class="hintline"> 单击 d<b>A</b> 的球体，每个面的框。 ${arrowNote(SC.point)}</p>`,
    cam: { target: [STATIONS.gauss + 1.2, Y0, 0], az: -10, el: 14, dist: 29 }, lit: 'gauss', scene: 'gauss', look: {},
    fig: `q = ${nC(M.POINT.q)} nC，两个闭合曲面`,
  },
  {
    kicker: '10.2', title: "线电荷", sub: "它周围有一个圆柱体",
    body: `<p class="lede">一条无限长的线，每米电荷为 λ。由于对称性，<b>E</b> 从直线指向直线，因此将其包裹在半径为 <i>r</i>、长度为 <i>L</i>.</p> 的同轴圆柱体中
      <p>将表面分成两个帽和一个弯曲的侧面。盖上 <b>E</b> ⊥ d<b>A</b>：无助焊剂。一边 <b>E</b> ∥ d<b>A</b> 和 <i>E</i> 为常数：</p>
      <div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ/<i>r</i></div>
      <p><i>L</i> 取消，场下降为 1/<i>r</i>，比点电荷慢。这里 λ = ${nC(M.LINE.lam)} nC/m，因此 <i>E</i> = ${f(M.lineE(0.1), 0)} N/C at 10 cm.</p>
      <div class="charts">${chart({ ...R.line, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursor: 'line', label: 'Line charge field against distance', series: [{ pts: curve(kE(M.lineE), 4.5, 22) }] })}</div>
      <p class="hintline">单击气缸以取下其盖子。 ${arrowNote(SC.line)}</p>`,
    cam: { target: [STATIONS.line, Y0, 0], az: -32, el: 18, dist: 23 }, lit: 'line', scene: 'line', look: {},
    fig: "盖子和侧面",
  },
  {
    kicker: '10.3', title: "板材和板材", sub: "穿过表面的药盒",
    body: `<p class="lede">药盒横跨每个表面。它的边平行于 <b>E</b>，因此只有帽带有通量，封闭的电荷为 σ<i>A</i>.</p>
      <table class="data">
        <tr><th></th><th>非导电片材</th><th>金属板</th></tr>
        <tr><td>通量流出</td><td>两个大写：2<i>EA</i></td><td>一顶： <i>EA</i></td></tr>
        <tr><td>so <i>E</i> =</td><td>σ/2ε<sub>0</sub> = ${f(M.SHEET.E, 0)} N/C</td><td>σ/ε<sub>0</sub> = ${f(M.PLATE.E, 0)} N/C</td></tr>
      </table>
      <p>金属内部 <i>E</i> = 0，因此板的内盖不承载任何东西。这里 σ = ${nC(M.SHEET.sigma)} nC/m² 是纸张上每单位面积的电荷 <i>each face</i> 的盘子。这两个场都不依赖于距离：它是均匀的。</p>
      <div class="charts">${chart({ ...R.sheet, zero: true, xlabel: 'height above the middle (cm)', ylabel: 'E (kN/C, up)', label: 'Field against height for the sheet and the plate',
        series: [{ cls: 'trend', pts: [[-15, -M.SHEET.E / 1000], [0, -M.SHEET.E / 1000], [0, M.SHEET.E / 1000], [15, M.SHEET.E / 1000]], tag: [-14, -M.SHEET.E / 1000 + 0.1, 'sheet'] },
          { pts: [[-15, -M.PLATE.E / 1000], [-3, -M.PLATE.E / 1000], [-3, 0], [3, 0], [3, M.PLATE.E / 1000], [15, M.PLATE.E / 1000]], tag: [5, M.PLATE.E / 1000 - 0.16, 'plate'] }] })}</div>
      <p class="hintline">单击任一按钮即可打开其药盒。 ${arrowNote(SC.sheet)}</p>`,
    cam: { target: [(STATIONS.sheet + STATIONS.plate) / 2, Y0, 0], az: -10, el: 24, dist: 30 }, lit: 'sheet', scene: 'sheet', look: {},
    fig: "一片片材和一块金属板",
  },
  {
    kicker: '10.4', title: "金属球体", sub: "里里外外",
    body: `<p class="lede">在导体上，电荷扩散到 <b>表面</b>。金属内部的高斯球体不包围任何金属。</p>
      <table class="data">
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>q</i><sub>编码</sub> = 0</td><td><i>E</i> = 0</td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>q</i><sub>编码</sub> = <i>Q</i></td><td><i>E</i> · 4π<i>r</i>² = <i>Q</i>/ε<sub>0</sub> → <i>E</i> = <i>kQ</i>/<i>r</i>²</td></tr>
      </table>
      <p>在外面，球体的作用就像其中心的点电荷。该字段从 0 跳转到 <i>kQ</i>/<i>R</i>² = ${f(M.cSphere.E(M.SPH.R), 0)} 表面 N/C。这里 <i>Q</i> = ${nC(M.SPH.Q)} NC 和 <i>R</i> = ${f(M.SPH.R * 100, 0)} 厘米。楔子被切掉，以便您可以看到里面。</p>
      <div class="charts">${sphereChart(M.cSphere.E, 'csphere')}</div>
      <p class="hintline">单击球体可查看高斯球体所包围的内容。 ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.csphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'csphere', scene: 'csphere', look: {},
    fig: "电荷仅分布在表面",
  },
  {
    kicker: '10.5', title: "绝缘球体", sub: "电荷分布在整个体积内",
    body: `<p class="lede">在绝缘体中，电荷保持不变：这里均匀分布在整个体积中，ρ = <i>Q</i>/(⁴⁄₃π<i>R</i>³) = ${f(M.SPH.rho * 1e6, 3)} μC/m³.</p>
      <p>里面， <i>q</i><sub>编码</sub> = ρ⁴⁄₃π<i>r</i>³：使用小 <i>r</i> 里面，大 <i>R</i> 外部。</p>
      <table class="data eqs">
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>r</i>³/ε<sub>0</sub></td><td><i>E</i> = ρ<i>r</i>/3ε<sub>0</sub>，里面</td></tr>
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>R</i>³/ε<sub>0</sub></td><td><i>E</i> = <i>kQ</i>/<i>r</i>²、外部</td></tr>
      </table>
      <p><i>E</i> 线性增长至表面峰值，然后下降为 1/<i>r</i>².外面，它与金属球相匹配（相同 <i>Q</i>, <i>R</i>）。如果是空心的， <i>E</i> = 0 在空心处。</p>
      <div class="charts">${sphereChart(M.iSphere.E, 'isphere')}</div>
      <p class="hintline">单击球体可查看包含的电荷。 ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.isphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'isphere', scene: 'isphere', look: {},
    fig: "E ∝ r 内，1/r² 外",
  },
  {
    kicker: '10.6', title: "带电棒", sub: "金属和绝缘体",
    body: `<p class="lede">两根长杆半径 <i>R</i> = ${f(M.ROD.R * 100, 0)} cm，每个 λ = ${nC(M.ROD.lam)} nC 每米。每个都有一个同轴圆柱体；它的盖子不带有助焊剂。</p>
      <table class="data">
        <tr><th></th><th>金属（表面σ）</th><th>绝缘体（ρ内部）</th></tr>
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>E</i> = 0</td><td><i>E</i> = ρ<i>r</i>/2ε<sub>0</sub></td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>E</i> = σ<i>R</i>/ε<sub>0</sub><i>r</i></td><td><i>E</i> = ρ<i>R</i>²/2ε<sub>0</sub><i>r</i></td></tr>
      </table>
      <p>在绝缘体内部， <i>q</i><sub>编码</sub> = ρπ<i>r</i>²<i>L</i> 和 <i>E</i> · 2π<i>rL</i> = <i>q</i><sub>编码</sub>/ε<sub>0</sub>。从外面看，两者都只有 2<i>k</i>λ/<i>r</i>，再次电荷线。空心绝缘棒或球体具有 <i>E</i> = 0 在其空心处。</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'r (cm)', ylabel: 'E (kN/C)', cursors: ['crod', 'irod'], label: 'Rod fields against distance', vlines: [[5, 'R']],
        series: [{ cls: 'trend', pts: curve(kE(M.cRod.E), 0.001, 17, 120), tag: [1.2, 0.07, 'metal'] }, { pts: curve(kE(M.iRod.E), 0.001, 17, 120), tag: [1.6, 0.36, 'insulator'] }] })}</div>
      <p class="hintline">单击一根杆可查看其圆柱体所包围的内容。 ${arrowNote(SC.rod)}</p>`,
    cam: { target: [(STATIONS.crod + STATIONS.irod) / 2, Y0 + 0.3, 0], az: -12, el: 14, dist: 19 }, lit: 'irod', scene: 'rods', look: {},
    fig: "左为金属，右为绝缘体",
  },
  {
    kicker: '10.7', title: "不均匀的电荷分布", sub: 'ρ(r) = br',
    body: `<p class="lede">当 ρ 变化为 <i>r</i>，将薄壳加起来，每个壳包含 ρ(<i>r</i>) · 4π<i>r</i>² d<i>r</i>.</p>
      <div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ · 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴</div>
      <p>里面， <i>E</i> · 4π<i>r</i>² = π<i>br</i>⁴/ε<sub>0</sub> → <i>E</i> = <i>br</i>²/4ε<sub>0</sub>。外面， <i>E</i> = <i>bR</i>⁴/4ε<sub>0</sub><i>r</i>².这里 <i>b</i> = ${f(M.SPH.b * 1e6, 2)} μC/m⁴：相同 ${nC(M.SPH.Q)} nC.</p>
      <table class="data"><tr><th>ρ(r)</th><td>C</td><td>br</td><td>br²</td><td>br³</td></tr><tr><th>E 内 ∝</th><td>r</td><td>r²</td><td>r³</td><td>r⁴</td></tr></table>
      <div class="charts">${sphereChart(M.nSphere.E, 'nsphere', [{ cls: 'trend', pts: curve(kE(M.iSphere.E), 0.001, 10, 40), tag: [3.5, 0.95, 'uniform'] }])}</div>
      <p class="hintline">电荷点向中心变细。 ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.nsphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'nsphere', scene: 'nsphere', look: {},
    fig: "越靠近表面越致密",
  },
  {
    kicker: '10.8', title: "导体", sub: "平衡状态：法拉第笼",
    body: `<p class="lede">一旦导体中的电荷停止移动：</p>
      <ol class="rules">
        <li><i>E</i> = 0 金属内部各处。</li>
        <li>任何多余的电荷都位于表面上。</li>
        <li>就在外面， <b>E</b> 垂直于表面，有 <i>E</i> = σ/ε<sub>0</sub>.</li>
        <li>内部空洞，不带电荷，没有场：a <b>法拉第笼</b>.</li>
      </ol>
      <p>这个不带电的外壳位于制服中 ${f(M.CAGE.E0 / 1000, 1)} kN/C 场。电子聚集到左边，留下右边的正极；他们的场取消 <b>E</b><sub>0</sub> 内部并弯曲线条以与表面成直角。 （当有电流流动时， <i>E</i> 导线中的值不为零。）</p>
      <div class="charts">${chart({ ...R.cage, xlabel: 'x (cm)', ylabel: 'E (kN/C)', label: 'Field along the axis through the shell', vlines: [[-14, '−R'], [14, 'R']],
        series: [{ pts: curve(x => M.len(M.cageField([x / 100, 0, 0])) / 1000, -40, 40, 400) }] })}</div>
      <p class="hintline">单击金属中高斯表面的壳。 ${arrowNote(SC.cage)}</p>`,
    cam: { target: [STATIONS.cage, Y0, 0], az: -18, el: 14, dist: 21 }, lit: 'cage', scene: 'cage', look: {},
    fig: "shell 内没有字段",
  },
];

// ---------- click a scene: what it breaks into ----------
const rNow = (s, sc) => M.breathe(s.clock, sc.rMin, sc.rMax, sc.T);
const sphereFacts = model => s => { const r = rNow(s, M.SPH); return [["高斯半径 r", `${f(r * 100, 1)} cm (R = ${f(M.SPH.R * 100, 0)} cm)`], ['q<sub>enc</sub>', `${nC(model.qenc(r))} nC`], ["通量 q<sub>enc</sub>/ε<sub>0</sub>", `${f(model.qenc(r) / M.EPS0, 1)} N·m²/C`], ['E = flux / 4πr²', `${f(model.E(r), 0)} N/C`]]; };
const rodFacts = model => s => { const r = rNow(s, M.ROD); return [["高斯半径 r", `${f(r * 100, 1)} cm (R = ${f(M.ROD.R * 100, 0)} cm)`], ["气缸长度L", `${f(M.ROD.L * 100, 0)} cm`], ['q<sub>enc</sub>', `${f(model.qenc(r) * 1e12, 0)} pC`], ['E = q<sub>enc</sub>/(ε<sub>0</sub> 2πrL)', `${f(model.E(r), 0)} N/C`]]; };
export const PLATES = {
  flux: { text: `<b>E</b> 分成沿 <b>A</b>、<i>E</i> cos θ 的部分，以及位于表面的部分 <i>E</i> sin θ，它掠过但没有穿过。只有第一个带有通量。同样：正方形沿场的阴影面积为 <i>A</i> cos θ（虚线）。`,
    facts: s => { const d = M.fluxAngle(s.clock); return [['θ', `${f(d, 1)}°`], ['E cos θ', `${f(M.FLUX.E * Math.cos(d * Math.PI / 180), 0)} N/C`], ['A', `${f(M.FLUX.A, 3)} m²`], ["Φ = EA cos θ", `${f(M.flux(d), 1)} N·m²/C`]]; } },
  gauss: { text: `每个小补丁 d<b>A</b>（黑色）沿着 <b>E</b>（蓝色）笔直伸出。所以每个补丁上的 <b>E</b> · d<b>A</b> = <i>E</i> d<i>A</i>，并且 <i>E</i> 在球体上的任何地方都相同，∮ <i>E</i> d<i>A</i> = <i>E</i>·4π<i>r</i>²。`,
    facts: s => { const r = rNow(s, M.POINT); return [['r', `${f(r * 100, 1)} cm`], ['E = kq/r²', `${f(M.pointE(r), 0)} N/C`], ['4πr²', `${f(4 * Math.PI * r * r, 4)} m²`], ['Φ = E · 4πr²', `${f(M.pointE(r) * 4 * Math.PI * r * r, 1)} N·m²/C`], ['q/ε<sub>0</sub>', `${f(M.POINT.flux, 1)} N·m²/C`]]; } },
  box: { text: `六个面被拉开，每个面都标有自己的通量 N·m²/C，从电荷场中进行数字求和。通过最靠近电荷的面流入 (−)，通过其他五个面流出 (+)。它们相加为零：盒子中不包含任何电荷。`,
    facts: () => { const b = M.boxFaces(); return [["近脸（中）", `${f(b[1], 1)} N·m²/C`], ["远方的脸", `${f(b[0], 1)} N·m²/C`], ["四个侧面", `${f(b[2] + b[3] + b[4] + b[5], 1)} N·m²/C`], ['total', `${f(Math.abs(b.reduce((a, c) => a + c)) < 0.05 ? 0 : b.reduce((a, c) => a + c), 1)} N·m²/C`]]; } },
  line: { text: `帽子脱落。在盖子上，场平放在其中（灰色箭头），因此 <b>E</b> ⊥ d<b>A</b> 并且没有通量交叉。所有通量均通过弯曲侧离开，其中 <b>E</b> ∥ d<b>A</b>。`,
    facts: s => { const r = rNow(s, M.LINE); return [['r', `${f(r * 100, 1)} cm`], ["侧面积2πrL", `${f(2 * Math.PI * r * M.LINE.L, 4)} m²`], ['E = 2kλ/r', `${f(M.lineE(r), 0)} N/C`], ["通过侧面的通量", `${f(M.lineE(r) * 2 * Math.PI * r * M.LINE.L, 2)} N·m²/C`], ['λL/ε<sub>0</sub>', `${f(M.LINE.lam * M.LINE.L / M.EPS0, 2)} N·m²/C`]]; } },
  sheet: { text: `盖子升起。每个向外携带<i>EA</i>；侧面没有。 2<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>，因此 <i>E</i> = σ/2ε<sub>0</sub>，无论碉堡的高度是多少。`,
    facts: () => [['σ', `${nC(M.SHEET.sigma)} nC/m²`], ["帽面积A", `${f(M.SHEET.Abox * 1e4, 1)} cm²`], ['q<sub>enc</sub> = σA', `${f(M.SHEET.sigma * M.SHEET.Abox * 1e12, 1)} pC`], ['E = σ/2ε<sub>0</sub>', `${f(M.SHEET.E, 0)} N/C`]] },
  plate: { text: `内盖位于金属中，其中 <i>E</i> = 0，因此只有外盖承载通量：<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>。与板材相同的 σ，是场的两倍。`,
    facts: () => [["每个面上的 σ", `${nC(M.PLATE.sigma)} nC/m²`], ["金属中的E", '0'], ['E outside = σ/ε<sub>0</sub>', `${f(M.PLATE.E, 0)} N/C`]] },
  csphere: { text: `金属会褪色。在内部，高斯球体不封闭任何东西：没有通量，没有场。一旦它比金属大，它就会包围所有 <i>Q</i>（红色外壳）和 <i>E</i> = <i>kQ</i>/<i>r</i>²。`, facts: sphereFacts(M.cSphere) },
  isphere: { text: `红球是高斯球体所包围的电荷。内部增长为 <i>r</i>³，而面积增长为 <i>r</i>²，因此 <i>E</i> 增长为 <i>r</i>。外面，停在<i>Q</i>。`, facts: sphereFacts(M.iSphere) },
  nsphere: { text: `红球是封闭的电荷，现在为 π<i>br</i>⁴：外壳容纳更多，因此它增长得很快，如 <i>r</i>⁴，并且 <i>E</i> = <i>q</i><sub>enc</sub>/(4π<i>r</i>²ε<sub>0</sub>) 增长为 <i>r</i>²。`, facts: sphereFacts(M.nSphere) },
  crod: { text: `金属会褪色。金属内部的高斯圆柱体不包含电荷。其外部包含 σ·2π<i>RL</i>（红色）和 <i>E</i>·2π<i>rL</i> = σ2π<i>RL</i>/ε<sub>0</sub>。`, facts: rodFacts(M.cRod) },
  irod: { text: `红色核心是高斯圆柱内的电荷，ρπ<i>r</i>²<i>L</i>，而<i>r</i> &lt; <i>R</i>。除以 ε<sub>0</sub> 和边面积 2π<i>rL</i>：<i>E</i> = ρ<i>r</i>/2ε<sub>0</sub>。`, facts: rodFacts(M.iRod) },
  cage: { text: `在金属内部绘制的高斯球体（虚线）。其上的 <i>E</i> = 0，因此它不包含净电荷：内壁上没有电荷，空心中没有场。表面上的箭头与其垂直：在 - 侧向内，在 + 侧向外。`,
    facts: () => [['E<sub>0</sub>', `${f(M.CAGE.E0, 0)} N/C`], ["σ 在 + 极", `${f(M.cageSigma(1) * 1e9, 2)} nC/m²`], ["极点 E = σ/ε<sub>0</sub>", `${f(M.cageSigma(1) / M.EPS0, 0)} N/C`], ["E在空心处", '0'], ["壳上的净电荷", '0']] },
};
