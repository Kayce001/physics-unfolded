// Chapter 12, page by page (after the AP Physics C E&M organizer, Unit 4). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const pF = c => f(c * 1e12, 1);
const BLUE = '#3d63a8', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, under = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const area = (R, pts) => `<path d="M${CH.sx(pts[0][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}${pts.map(([x, y]) => `L${CH.sx(x, R.x0, R.x1).toFixed(1)},${CH.sy(y, R.y0, R.y1).toFixed(1)}`).join('')}L${CH.sx(pts[pts.length - 1][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}Z" style="fill:#dfe7f6;stroke:none"/>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  charge: { x0: 0, x1: 100, y0: 0, y1: 800 },
  gap: { x0: 0, x1: 10, y0: 0, y1: 20 },
  sph: { x0: 0, x1: 25, y0: 0, y1: 2500 },
  cyl: { x0: 0, x1: 10, y0: 0, y1: 5000 },
  fill: { x0: 0, x1: 800, y0: 0, y1: 120 },
  slab: { x0: 0, x1: 1, y0: 0, y1: 2500 },
  energy: { x0: 0, x1: 1, y0: 0, y1: 3.5 },
  probe: { x0: -28, x1: 28, y0: 0, y1: 3500 },
};
const RS = R.sph, RC = R.cyl;
const sphCurve = samples(120, 0, 25, r => M.sphE(r / 100)), cylCurve = samples(200, 0, 10, r => M.cylE(r / 100));
const S = M.SER, PA = M.PAR, u = x => (x * 1e6).toFixed(0);

// a bar chart of the charge on each capacitor, series against parallel
const qBars = (() => {
  const bars = [['C₁', S.Q1, 0], ['C₂', S.Q2, 1], ['C₁', PA.Q1, 3], ['C₂', PA.Q2, 4]], base = 140, top = 24, max = 40e-6, bw = 46, x0 = 70;
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Charge on each capacitor, series and parallel">
    <line class="zero" x1="${x0 - 20}" x2="${x0 + 5.6 * (bw + 16)}" y1="${base}" y2="${base}"/>
    ${bars.map(([n, q, i]) => { const h = (base - top) * q / max, x = x0 + i * (bw + 16); return `<rect class="bar" x="${x}" y="${base - h}" width="${bw}" height="${h}"/><text class="ax" x="${x + bw / 2}" y="${base - h - 6}" text-anchor="middle">${u(q)} µC</text><text class="lab" x="${x + bw / 2}" y="${base + 16}" text-anchor="middle">${n}</text>`; }).join('')}
    <text class="ax" x="${x0 + (bw + 16) - 8}" y="${base + 32}" text-anchor="middle">series: same Q</text>
    <text class="ax" x="${x0 + 3.5 * (bw + 16) + bw / 2}" y="${base + 32}" text-anchor="middle">parallel: Q adds</text>
  </svg>`;
})();

const dielTable = `<table class="data">${[0, 2, 4, 6].map(i => `<tr><td>${M.DIELECTRICS[i][0]}</td><td>${M.DIELECTRICS[i][1]}</td><td>${M.DIELECTRICS[i + 1][0]}</td><td>${M.DIELECTRICS[i + 1][1]}</td></tr>`).join('')}</table>`;
const full = { iso: M.slab(1, false), con: M.slab(1, true) };

const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: "第12章", title: "电容器", sub: "电荷分开",
    body: `<p class="lede">A <b>电容器</b>是两个分开的导体。电池将电荷从一个电池转移到另一个电池，在 +<i>Q</i> 和 −<i>Q</i> 之间留下一个磁场。</p>
      <p>电压加倍，电荷加倍。它们的比率 <b> 电容 </b> 保持不变：</p>
      <div class="eq"><i>C</i> = <i>Q</i> / Δ<i>V</i></div>
      <p> 以法拉为单位 (1 F = 1 C/V)，绝不为负。它仅取决于 <b> 几何形状 </b> 和间隙中的材料。这些板的尺寸为 20 厘米见方，间距 5 厘米：<i>C</i> = ${pF(M.C0)} pF.</p>
      <div class="charts">${chart({ ...R.charge, xlabel: 'ΔV (V)', ylabel: 'Q (pC)', cursors: [['charge']], label: 'Charge against voltage: a straight line of slope C',
        series: [{ pts: [[0, 0], [100, M.Q0 * 1e12]], tag: [58, M.C0 * 58e12 - 190, `slope = C = ${pF(M.C0)} pF`] }] })}</div>
      <p class="hintline"> 每 ± 对一条磁力线。单击板块。按比例绘制。</p>`,
    cam: { target: [ST.plates, 1.4, 0], az: 24, el: 16, dist: 10.5 }, lit: 'plates', scene: 'plates', look: {},
    fig: "电池上下翻转",
  },
  {
    kicker: '12.1', title: "平行板", sub: "高斯定律，然后 ΔV，然后 C",
    body: `<p class="lede">三步，每次：按高斯定律计算<i>E</i>，按积分计算Δ<i>V</i>，<i>C</i> = <i>Q</i>/Δ<i>V</i>.</p>
      ${steps([
        ['<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>', 'pillbox'],
        ['<i>E</i> = σ/ε<sub>0</sub> = <i>Q</i>/ε<sub>0</sub><i>A</i>', 'uniform'],
        ['Δ<i>V</i> = −∫<sub><i>d</i></sub><sup>0</sup> <i>E ds</i> = <i>Ed</i>', 'E constant'],
        ['<i>C</i> = <i>Q</i>/Δ<i>V</i> = <b>ε<sub>0</sub><i>A</i>/<i>d</i></b>', 'Q cancels'],
      ])}
      当间隙变化时，<p><i>Q</i> 是固定的：<i>E</i> 保持 ${f(M.E0, 0)} V/m，Δ<i>V</i> = <i>Ed</i> 增长，<i>C</i> 下降1/<i>d</i>.</p>
      <div class="charts">${chart({ ...R.gap, xlabel: 'gap d (cm)', ylabel: 'C (pF)', cursors: [['gap']], label: 'Capacitance against gap',
        series: [{ pts: samples(80, 1.8, 10, d => M.cPlate(M.PLATE.A, d / 100) * 1e12) }] })}</div>
      <p class="hintline">点击药盒将其拉出。</p>`,
    cam: { target: [ST.pillbox, 1.45, 0], az: 24, el: 15, dist: 11 }, lit: 'pillbox', scene: 'gap', look: {},
    fig: "相同的电荷，间隙变化",
  },
  {
    kicker: '12.2', title: "两个球体", sub: "壳内的球",
    body: `<p class="lede">A 球 (<i>a</i> = ${M.SPH.a * 100} cm, +<i>Q</i>) 在壳 (<i>b</i> = ${M.SPH.b * 100} cm, −<i>Q</i>) 内，切成两半。</p>
      ${steps([
        ['<i>E</i>·4π<i>r</i><sup>2</sup> = <i>Q</i>/ε<sub>0</sub>', 'Gauss, a < r < b'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/4πε<sub>0</sub><i>r</i><sup>2</sup>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= <i>Q</i>(<i>b</i> − <i>a</i>)/4πε<sub>0</sub><i>ab</i>', ''],
        ['<i>C</i> = <b>4πε<sub>0</sub><i>ab</i>/(<i>b</i> − <i>a</i>)</b>', `${pF(M.SPH.C)} pF`],
      ])}
      <p>As <i>b</i> → Infini, <i>C</i> → 4πε<sub>0</sub><i>a</i>，孤球体。阴影：Δ<i>V</i> = ${M.V0} V.</p>
      <div class="charts">${chart({ ...RS, xlabel: 'r (cm)', ylabel: 'E (V/m)', cursors: [['sph']], label: 'Field against radius, zero outside the gap', under: area(RS, sphCurve.filter(([r]) => r >= 10 && r <= 20)), series: [{ pts: sphCurve }] })}</div>
      <p class="hintline">点击打开shell。箭头 2 cm 每 kV/m.</p>`,
    cam: { target: [ST.sphere, 2.2, 0], az: 14, el: 12, dist: 17 }, lit: 'sphere', scene: 'sphere', look: {},
    fig: "壳之间 E ∝ 1/r²",
  },
  {
    kicker: '12.3', title: "两个气缸", sub: "管内有一根棒",
    body: `<p class="lede">A 杆（<i>a</i> = ${M.CYL.a * 100} cm）位于管（<i>b</i> = ${M.CYL.b * 100} cm）内，<i>L</i> = ${M.CYL.L * 100} cm 长：短同轴电缆。</p>
      ${steps([
        ['<i>E</i>·2π<i>rL</i> = <i>Q</i>/ε<sub>0</sub>', 'Gauss, side only'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/2πε<sub>0</sub><i>rL</i>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= (<i>Q</i>/2πε<sub>0</sub><i>L</i>) ln(<i>b</i>/<i>a</i>)', '∫dr/r = ln r'],
        ['<i>C</i> = <b>2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>)</b>', `${pF(M.CYL.C)} pF`],
      ])}
      <p><i>E</i> ∝ 1/<i>r</i>，比 1/<i>r</i><sup>2</sup> 更温和，因此是对数。 <i>C</i> ∝长度：${f(M.CYL.C / M.CYL.L * 1e12, 0)} pF每米。</p>
      <div class="charts">${chart({ ...RC, xlabel: 'r (cm)', ylabel: 'E (V/m)', cursors: [['cyl']], label: 'Field against radius for the coaxial pair', under: area(RC, cylCurve.filter(([r]) => r >= 2 && r <= 8)), series: [{ pts: cylCurve }] })}</div>
      <p class="hintline">单击以将管滑出。箭头 1 cm/kV/m.</p>`,
    cam: { target: [ST.coax, 1.5, 0], az: 16, el: 14, dist: 14 }, lit: 'coax', scene: 'coax', look: {},
    fig: "E ∝ 1/r 管内",
  },
  {
    kicker: '12.4', title: "储存能量", sub: "充电工作",
    body: `<p class="lede">E 每个位 <i>dq</i> 通过 Δ<i>V</i> = <i>q</i>/<i>C</i> 从 - 传送到 + 相对于已经存在的字段。前几位是免费的；最后花费了完整的${M.V0} V.</p>
      <div class="eq"><i>U</i> = ∫<sub>0</sub><sup><i>Q</i></sup> <i>q</i>/<i>C</i> <i>dq</i> = <i>Q</i><sup>2</sup>/2<i>C</i></div>
      <p>= ½<i>Q</i>Δ<i>V</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup>：线下的三角形，此处为 ${f(M.U0 * 1e9, 1)} nJ。能量存在于现场，能量密度为 <b></b> (J/m³)</p>
      <div class="eq"><i>u</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup></div>
      <div class="charts">${chart({ ...R.fill, xlabel: 'charge moved q (pC)', ylabel: 'ΔV (V)', cursors: [['fill']], label: 'Voltage against charge moved; the area under it is the stored energy',
        under: `<path data-area="fill" style="fill:#dfe7f6"/>`, series: [{ pts: [[0, 0], [800, 800e-12 / M.C0]] }] })}</div>
      <p class="live" id="filllive"></p>
      <p class="hintline"> 间隙中的蓝色随着 u 变暗。点击板块。</p>`,
    cam: { target: [ST.energy + 0.4, 1.45, 0], az: 24, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: "充电，一次一点",
  },
  {
    kicker: '12.5', title: "串联和并联", sub: "相同的 Q，或相同的 ΔV",
    body: `V. ${M.CIRC.V} 上的 <p class="lede">${M.CIRC.C1 * 1e6} µF 和 ${M.CIRC.C2 * 1e6} µF V. 绘制板面积 ∝ <i>C</i>； 1 个标记为 2 µC.</p>
      <table class="data cols">
        <tr><th>系列</th><th>并联</th></tr>
        <tr><td> 每个上相同 <i>Q</i></td><td> 每个上相同 Δ<i>V</i></td></tr>
        <tr><td>Δ<i>V</i> = Δ<i>V</i><sub>1</sub> + Δ<i>V</i><sub>2</sub></td><td><i>Q</i> = <i>Q</i><sub>1</sub> + <i>Q</i><sub>2</sub></td></tr>
        <tr><td>1/<i>C</i><sub>eq</sub> = 1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub></td><td><i>C</i><sub>eq</sub> = <i>C</i><sub>1</sub> + <i>C</i><sub>2</sub></td></tr>
        <tr><td>${f(S.C * 1e6)} µF：${f(S.V1, 0)} V + ${f(S.V2, 0)} V</td><td>${f(PA.C * 1e6, 0)} µF：${u(PA.Q1)} + ${u(PA.Q2)} µC</td></tr>
      </table>
      <p>串联，它们之间的导线是一个中性岛：一端的+<i>Q</i>意味着另一端的-<i>Q</i>。电容器越小，承受的电压越大；并联时，越大的电荷越多。</p>
      <div class="charts">${qBars}</div>
      <p class="hintline">单击电路了解其电荷和电压。</p>`,
    cam: { target: [ST.circuits, 1.6, 0], az: 16, el: 9, dist: 19 }, lit: 'series', scene: 'circuits', look: {},
    fig: "9V 时为 2 µF 和 4 µF",
  },
  {
    kicker: '12.6', title: "电介质", sub: "间隙中的绝缘体",
    body: `<p class="lede">间隙中的绝缘体<b>极化</b>：每个分子偶极子感觉τ = <i>p</i>×<i>E</i> = <i>pE</i> sin θ并转向<i>U</i> = −<i>p</i>·<i>E</i>，其最低能量。</p>
      <p>排列好的端部在面上留下<b>束缚电荷</b>；其场 <i>E</i><sub>ind</sub> 对板’：</p>
      <div class="eq"><i>E</i> = <i>E</i><sub>0</sub> − <i>E</i><sub>ind</sub> = <i>E</i><sub>0</sub>/κ</div>
      <p><i>Q</i>固定时，Δ<i>V</i>下降κ，<i>C</i> = κε<sub>0</sub><i>A</i>/<i>d</i>上升κ≥ 1.</p>
      ${dielTable}
      <div class="charts">${chart({ ...R.slab, xlabel: 'fraction of the gap filled', ylabel: 'E (V/m)', cursors: [['slab']], label: 'Field against how far the slab is in',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, false).E) }], marks: [[1, full.iso.E, `E₀/κ`, -46, -8]] })}</div>`,
    cam: { target: [ST.slab, 1.85, 0], az: 26, el: 13, dist: 11.5 }, lit: 'slab', scene: 'slab', look: {},
    fig: "A κ = 3 板，板隔离",
  },
  {
    kicker: '12.7', title: "是否已连接", sub: "电池固定的内容",
    body: `<p class="lede">部分，板坯和旁边的空气是两个并联的电容器：<i>C</i> = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>x</i>)；一半，<i>C</i><sub>0</sub>/2·(1 + κ).</p>
      <table class="data">
        <tr><th>板完全处于</th><th>连接</th><th>断开</th></tr>
        <tr><td>固定</td><td>Δ<i>V</i> = ${M.V0} V</td><td><i>Q</i> = ${f(M.Q0 * 1e12, 0)} pC</td></tr>
        <tr><td><i>Q</i></td><td>κ<i>Q</i><sub>0</sub> = ${f(full.con.Q * 1e12, 0)} pC</td><td><i>Q</i><sub>0</sub></td></tr>
        <tr><td>Δ<i>V</i>、<i>E</i></td><td>未更改</td><td>÷κ (${f(full.iso.V, 1)}五)</td></tr>
        <tr><td><i>U</i></td><td>× κ (${f(full.con.U * 1e9, 1)} nJ)</td><td>÷ κ (${f(full.iso.U * 1e9, 1)}新泽西)</td></tr>
      </table>
      <p>连通，电荷流向板所在的位置；电池确实工作了Δ<i>V</i>·Δ<i>Q</i>，存储能量增加了一倍。无论哪种方式，板都会将板拉入。</p>
      <div class="charts">${chart({ ...R.energy, xlabel: 'fraction of the gap filled', ylabel: 'U / U₀', cursors: [['enA'], ['enB', GREY]], label: 'Stored energy against fraction filled, connected and disconnected',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, true).U / M.U0), tag: [0.3, 1.75, 'connected'] }, { pts: samples(60, 0, 1, x => M.slab(x, false).U / M.U0), color: GREY, tag: [0.6, 0.55, 'disconnected'] }] })}</div>
      <p class="hintline">单击任一电容。</p>`,
    cam: { target: [ST.compare, 1.75, 0], az: 24, el: 11, dist: 16.5 }, lit: 'battery', scene: 'compare', look: {},
    fig: "电池开启（左）、关闭（右）",
  },
  {
    kicker: '12.8', title: "导体", sub: "处于静电平衡状态",
    body: `<p class="lede">A ${M.COND.E0} V/m 场中的中性金属球。它的自由电子会漂移，直到它们自己的场抵消内部的外部场。然后：</p>
      <ul class="rules">
        <li><i>E</i> = 0 金属内各处；</li>
        <li>any电荷位于表面；</li>
        <li> 就在外面，<i>E</i> ⊥ 表面且 <i>E</i> = σ/ε<sub>0</sub>;</li>
        <li>整个导体为一电势。</li>
      </ul>
      <p>这里 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ，求和为零；在极点 <i>E</i> = 3<i>E</i><sub>0</sub>。电容器中厚度为 <i>t</i> 的金属板会留下两个串联间隙： <i>C</i> = ε<sub>0</sub><i>A</i>/(<i>d</i> − <i>t</i>).</p>
      <div class="charts">${chart({ ...R.probe, xlabel: 'along the axis (cm)', ylabel: 'E (V/m)', cursors: [['probe']], label: 'Field along the axis through the sphere',
        series: [{ pts: samples(160, -28, -10.0001, x => M.condAxisE(x / 100)) }, { pts: [[-10, 0], [10, 0]] }, { pts: samples(160, 10.0001, 28, x => M.condAxisE(x / 100)) }] })}</div>
      <p class="hintline">单击球体进行切割。从模型中追踪的场线。</p>`,
    cam: { target: [ST.conductor, 1.8, 0], az: 40, el: 10, dist: 19 }, lit: 'conductor', scene: 'conductor', look: {},
    fig: "场中的中性金属球",
  },
];

// ---------- click a scene: what it breaks into ----------
const sph = r => [["高斯半径 r", `${f(r * 100, 1)} cm`], ['E(r) = Q/4πε₀r²', `${f(M.sphE(r), 0)} V/m`], ['flux E·4πr²', `${f(M.sphE(r) * 4 * Math.PI * r * r, 1)} V·m`], ['Q/ε₀', `${f(M.SPH.Q / M.EPS0, 1)} V·m`]];
export const PLATES = {
  plates: { text: `每个板单独形成一个场 σ/2ε₀ 指向远离+并指向-（灰色）。在板之间，两者以相同的方式指向并添加 σ/ε₀。外面他们指向相反的方向并取消。这就是为什么这个领域都处于空白之中。`,
    facts: s => { const r = M.charging(s.charge.t); return [['ΔV', `${f(r.V, 1)} V`], ['Q = CΔV', `${f(r.Q * 1e12, 0)} pC`], ["每块板 σ/2ε₀", `${f(r.E / 2, 0)} V/m`], ["之间：总和", `${f(r.E, 0)} V/m`], ["外部：差异", '0 V/m']]; } },
  pillbox: { text: `药盒横跨 + 板。它的外表面处于零磁场中，并且其侧面沿着磁场延伸，因此唯一的通量是通过间隙中的表面：E·A。其内部是电荷 σA。高斯：EA = σA/ε₀。`,
    facts: s => { const r = M.gapScene(s.gap.t), A = M.PILLBOX.A; return [["面部面积A", `${f(A * 1e4, 1)} cm²`], ['flux E·A', `${f(r.E * A, 3)} V·m`], ['q_enc/ε₀', `${f(M.Q0 / M.PLATE.A * A / M.EPS0, 3)} V·m`], ['gap d', `${f(r.d * 100, 1)} cm`], ['ΔV = Ed', `${f(r.V, 0)} V`], ['C = ε₀A/d', `${pF(r.C)} pF`]]; } },
  sphere: { text: `打开后，外壳显示出球和它们之间的高斯球体。无论其半径如何，通过它的通量都是相同的 Q/ε₀，因此 E 为 1/r²。`,
    facts: s => sph(M.gaussR(s.sweep.t, M.SPH.a, M.SPH.b)) },
  coax: { text: `将管子、杆和高斯圆柱放在一边。通量仅通过弯曲侧（面积 2πrL）离开，因此 E = Q/2πε₀rL 为 1/r。`,
    facts: s => { const r = M.gaussR(s.sweep.t, M.CYL.a, M.CYL.b); return [["高斯半径 r", `${f(r * 100, 1)} cm`], ['E(r)', `${f(M.cylE(r), 0)} V/m`], ['flux E·2πrL', `${f(M.cylE(r) * 2 * Math.PI * r * M.CYL.L, 1)} V·m`], ['Q/ε₀', `${f(M.CYL.Q / M.EPS0, 1)} V·m`], ['C', `${pF(M.CYL.C)} pF`]]; } },
  energy: { text: `能量通过间隙体积 A × d 传播，密度为 u = ½ε₀E²。将它们相乘即可得到 ½CΔV²。`,
    facts: s => { const r = M.filling(s.fill.t), vol = M.PLATE.A * M.PLATE.d; return [['E', `${f(r.E, 0)} V/m`], ['u = ½ε₀E²', `${f(r.u * 1e6, 2)} µJ/m³`], ["批量广告", `${f(vol * 1e6, 0)} cm³`], ['u·Ad', `${f(r.u * vol * 1e9, 2)} nJ`], ['Q²/2C', `${f(r.U * 1e9, 2)} nJ`]]; } },
  series: { text: `电池在环路中移动 ${u(S.Q)} µC。两个内板和它们之间的导线是一个中性岛：一侧为−${u(S.Q)} µC，另一侧为+${u(S.Q)} µC。每个电容器的电压为 Q/C，它们相加到 ${M.CIRC.V} V。`,
    facts: () => [['C_eq', `${f(S.C * 1e6)} µF`], ["每个都有问", `${u(S.Q)} µC`], ['ΔV₁ = Q/C₁', `${f(S.V1, 1)} V`], ['ΔV₂ = Q/C₂', `${f(S.V2, 1)} V`], ['energy ½C_eqV²', `${f(S.U * 1e6, 0)} µJ`]] },
  parallel: { text: `两个电容器都直接跨接在电池上，因此每个电容器都具有完整的 ${M.CIRC.V} V。每个电容器都采用 Q = CΔV，并且电池提供总和。`,
    facts: () => [['C_eq', `${f(PA.C * 1e6, 0)} µF`], ["每个上的 ΔV", `${M.CIRC.V} V`], ['Q₁ = C₁ΔV', `${u(PA.Q1)} µC`], ['Q₂ = C₂ΔV', `${u(PA.Q2)} µC`], ['energy ½C_eqV²', `${f(PA.U * 1e6, 0)} µJ`]] },
  slab: { text: `在平板中：仅板上的自由电荷就产生 E₀（灰色，右）。板表面上的束缚电荷形成 E_ind（灰色，左）。剩下的是 E（蓝色），在板中和在其旁边的空气中是相同的，因为两者跨越相同的 ΔV。`,
    facts: s => { const x = M.fillOf(s.slide.t), r = M.slab(x, false); return [["板坯", `${f(x * 100, 0)} %`], ["E₀ = σ_free/ε₀（板部分）", `${f(r.Efree, 0)} V/m`], ['E_ind = σ_bound/ε₀', `${f(r.Eind, 0)} V/m`], ['E = E₀ − E_ind', `${f(r.E, 0)} V/m`], ['ΔV', `${f(r.V, 1)} V`], ['C', `${pF(r.C)} pF`]]; } },
  battery: { text: `电池将 ΔV 保持在 ${M.V0} V，因此 E = ΔV/d 不会改变。当板进入时，电荷流到面向它的极板上，直到那里的电荷量达到 κ 倍。`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), true); return [['C', `${pF(r.C)} pF`], ['Q', `${f(r.Q * 1e12, 0)} pC`], ['ΔV', `${f(r.V, 1)} V`], ['E', `${f(r.E, 0)} V/m`], ['U', `${f(r.U * 1e9, 1)} nJ`]]; } },
  isolated: { text: `没有任何东西可以流动或流动，所以 Q 留下来。电荷向平板方向移动，间隙中各处电场均下降，ΔV 也随之下降。`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), false); return [['C', `${pF(r.C)} pF`], ['Q', `${f(r.Q * 1e12, 0)} pC`], ['ΔV', `${f(r.V, 1)} V`], ['E', `${f(r.E, 0)} V/m`], ['U', `${f(r.U * 1e9, 1)} nJ`]]; } },
  conductor: { text: `切开：内部不带电荷，不存在电场，仅在表面。金属中任何位置的高斯表面上的 E = 0，因此它不包含电荷。这同样适用于空心壳，这就是为什么金属盒子会屏蔽里面的东西。`,
    facts: s => { const x = M.probeX(s.clock); return [["探测于", `${f(x * 100, 1)} cm`], ['E there', `${f(M.condAxisE(x), 0)} V/m`], ['E inside', '0 V/m'], ["两极 σ", `±${f(M.condSigma(0) * 1e9, 1)} nC/m²`], ["极点 E = σ/ε₀", `${f(M.condSigma(0) / M.EPS0, 0)} V/m`]]; } },
};
