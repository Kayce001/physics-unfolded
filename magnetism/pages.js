// Chapter 14, page by page (after the AP Physics C E&M organizer, Unit 7). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${f(m, n)}×10${String(e).split('').map(c => SUP[c]).join('')}`; };
const uT = x => f(x * 1e6, 1);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x) + 4}" y="${H - P.b - 6}">${t}</text>`).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  magnet: { x0: -40, x1: 40, y0: 0, y1: 300 },
  rhr: { x0: 0, x1: 180, y0: 0, y1: 2 },
  cyclo: { x0: 0, x1: 2.5, y0: 0, y1: 3 },
  selector: { x0: 0, x1: 2, y0: -2, y1: 2 },
  loop: { x0: 0, x1: 180, y0: -0.08, y1: 0.08 },
  ampere: { x0: 0, x1: 15, y0: 0, y1: 400 },
  ring: { x0: 0, x1: 36, y0: 0, y1: 45 },
  wires: { x0: 0, x1: 40, y0: 0, y1: 2 },
  solenoid: { x0: -40, x1: 40, y0: 0, y1: 300 },
};

// the closed surface round the magnet's N end, summed once
export const MAGFLUX = M.boxFlux(M.magnetB, M.MAG_BOX.c, M.MAG_BOX.h, 60);
const BC = M.magnetB([0, 0, 0])[0], SOLC = M.solB([0, 0, 0])[0];
const slow = c => sci(c, 1);

export const PAGES = [
  {
    kicker: "第14章", title: "磁场", sub: "由移动电荷制成",
    body: `<p class="lede">A <b>磁场</b> <b>B</b>是通过移动电荷形成的：电流或磁体内部旋转的电子。以特斯拉为单位（1 T = 10<sup>4</sup> 高斯）。</p>
      <p>在磁铁外面，线路从N延伸到S；在里面，从S回到N，所以每条线都会自行闭合。没有磁单极子（切掉一个，你会得到两个磁铁），所以通过任何闭合表面</p>
      <div class="eq">∮ <b>B</b> · d<b>A</b> = 0</div>
      <p> 这款 ${f(M.MAG.L * 100, 0)} 厘米磁铁的绘制方式如安培所描绘的那样，其侧面有一片电流。每条线都是从该电流的毕奥-萨伐尔和中追踪的。</p>
      <div class="charts">${chart({ ...R.magnet, xlabel: 'x along the axis (cm)', ylabel: 'B (mT)', label: 'Field along the magnet axis', vlines: [[-10, 'S'], [10, 'N']],
        series: [{ pts: curve(x => M.magnetB([x / 100, 0, 0])[0] * 1000, -40, 40, 120) }] })}</div>
      <p class="hintline">单击磁铁，在其 N 端周围出现一个封闭的盒子。一格正方形为10厘米。</p>`,
    cam: { target: [STATIONS.magnet, 2.0, 0], az: -18, el: 20, dist: 20 }, lit: 'magnet', scene: 'magnet', look: {},
    fig: "线路离开 N 并返回 S",
  },
  {
    kicker: '14.1', title: "磁力", sub: 'F = qv × B',
    body: `<p class="lede">A 磁场仅推动 <b>运动</b> 电荷，并且横向：与 <b>v</b> 和 <b>B</b>.</p> 成直角
      <div class="eq"><b>F</b> = <i>q</i> <b>v</b> × <b>B</b>, &nbsp; <i>F</i> = <i>qvB</i> sin θ</div>
      <p><b>右手定则：</b>拇指沿<b>v</b>，食指沿<b>B</b>；中指在+电荷上给出<b>F</b>，在-电荷上相反。沿着<b>B</b>移动，没有力。</p>
      <p><b>F</b> ⊥ <b>v</b> 总是，所以 <b>B</b> 做 <b>no 工作</b>：它会电荷但永远不会加快速度。对于 <b>E</b>，<b>F</b> = <i>q</i><b>E</b> + <i>q</i><b>v</b> × <b>B</b>（洛伦兹力）.</p>
      <div class="charts">${chart({ ...R.rhr, xlabel: 'θ between v and B (°)', ylabel: 'F (10⁻¹⁴ N)', cursor: 'rhr', label: 'Force against angle', series: [{ pts: curve(d => M.RHR.Fmax * Math.sin(d * Math.PI / 180) / 1e-14, 0, 180) }] })}</div>
      <p class="hintline">单击以沿 <b>B</b> 分割 <b>v</b>。 <i>v</i> = ${sci(M.RHR.v, 1)} m/s，<i>B</i> = ${f(M.RHR.B)} T； <b>F</b> 是 ${sci(M.RHR.Fmax, 1)} N.</p> 处的 1.5 平方`,
    cam: { target: [STATIONS.rhr, 1.9, 0], az: -36, el: 22, dist: 17 }, lit: 'rhr', scene: 'rhr', look: {},
    fig: "质子和电子，速度相同",
  },
  {
    kicker: '14.2', title: "在场里盘旋", sub: 'r = mv/qB',
    body: `<p class="lede">跨过制服 <b>B</b> 力与速度保持直角。这是一种向心力：电荷以恒定速度旋转。</p>
      <div class="eq"><i>qvB</i> = <i>mv</i>²/<i>r</i> → <i>r</i> = <i>mv</i>/<i>qB</i>, &nbsp;ω = <i>qB</i>/<i>m</i></div>
      <p>两个质子从静止开始经过 50 V 和 200 V（50 eV 和 200 eV，其中 <i>q</i>Δ<i>V</i> = ½<i>mv</i>²）。四倍能量，两倍速度，两倍半径： ${f(M.CYC.r[0] * 100)} 和 ${f(M.CYC.r[1] * 100)} cm.</p>
      <p>然而 <i>T</i> = 2π<i>m</i>/<i>qB</i> = ${f(M.CYC.T * 1e6, 3)} 两者都为 μs，因此它们每次都会在开始时相遇。一个 <b>回旋加速器</b> 使用这个，将他们踢过一个间隙 ${f(M.CYC.f / 1e6)} 兆赫。</p>
      <div class="charts">${chart({ ...R.cyclo, xlabel: 'v (10⁵ m/s)', ylabel: 'r (cm)', label: 'Radius against speed', series: [{ pts: curve(v => M.MP * v * 1e5 / (M.QE * M.CYC.B) * 100, 0, 2.5) }],
        marks: M.CYC.v.map((v, i) => [v / 1e5, M.CYC.r[i] * 100, `${M.CYC.dV[i]} V`]) })}</div>
      <p class="hintline">单击查看力和半径。 <i>B</i> = ${f(M.CYC.B)} T，下来。一个方格的面积是1厘米；时间运行 ${slow(M.CYC.show / M.CYC.T)}× 较慢。</p>`,
    cam: { target: [STATIONS.cyclo, 0.8, 0], az: -14, el: 40, dist: 17 }, lit: 'cyclo', scene: 'cyclo', look: {},
    fig: "两倍的速度，两倍的半径，相同的周期",
  },
  {
    kicker: '14.3', title: "交叉E和B", sub: "速度选择器",
    body: `<p class="lede"><b>E</b> 板之间将质子推向 - 板 <i>qE</i>. <b>B</b> 进入页面将其推回 <i>qvB</i>。他们以一种速度取消：</p>
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; <i>v</i> = <i>E</i>/<i>B</i></div>
      <p>这里 <i>E</i> = ${f(M.SEL.E, 0)} V/m 和 <i>B</i> = ${f(M.SEL.B, 3)} T, so ${sci(M.SEL.v0, 1)} m/s 直线前进。慢一点， <i>qE</i> 赢了，它就弯下腰；更快， <i>qvB</i> 赢了，它就会弯曲。</p>
      <p>的 <b>霍尔效应</b> 与电线中的平衡相同：电荷堆积在一个边缘上，直到 <i>qE</i> = <i>qv</i><sub>d</sub><i>B</i>，留下Δ<i>V</i><sub>H</sub> = <i>v</i><sub>d</sub><i>Bd</i> = <i>IBd</i>/<i>nqA</i>.</p>
      <div class="charts">${chart({ ...R.selector, zero: true, xlabel: 'v (10⁵ m/s)', ylabel: 'qvB − qE, up (10⁻¹⁶ N)', label: 'Net force against speed',
        series: [{ pts: curve(v => M.QE * (v * 1e5 * M.SEL.B - M.SEL.E) / 1e-16, 0, 2) }], marks: M.SEL.k.map((k, i) => [k, M.QE * M.SEL.E * (k - 1) / 1e-16, ['0.8', 'E/B', '1.25'][i], i === 1 ? -26 : 6, i === 1 ? -8 : 14]) })}</div>
      <p class="hintline">点击查看 <i>q</i><b>E</b> 和 <i>q</i><b>v</b> × <b>B</b> 在每个质子上。一个方格的面积是1厘米。</p>`,
    cam: { target: [STATIONS.selector + 0.4, 2.5, 0], az: -22, el: 13, dist: 31 }, lit: 'selector', scene: 'selector', look: {},
    fig: "只有 v = E/B 才能通过直道",
  },
  {
    kicker: '14.4', title: "对电流施加力", sub: "和环上的力矩",
    body: `<p class="lede">电流是许多移动电荷。与 <i>I</i> = <i>nqAv</i><sub>d</sub>，电荷上的力 <i>nqAL</i> 在电线中变成</p>
      <div class="eq"><b>F</b> = <i>I</i> <b>L</b> × <b>B</b></div>
      <p>在均匀场中的环上，侧向力加为零，但两个垂直侧沿不同的线以相反的方式推动。他们扭曲了它：</p>
      <div class="eq"><b>τ</b> = <b>μ</b> × <b>B</b>, &nbsp; <b>μ</b> = <i>I</i><b>A</b></div>
      <p>As <i>U</i> = −<b>p</b> · <b>E</b> 对于电荷偶极子， <i>U</i> = −<b>μ</b> · <b>B</b>: 沿途最低 <b>B</b> （稳定），最高（不稳定）。这里μ = ${f(M.LOOP.mu, 2)} A·m².</p>
      <div class="charts">${chart({ ...R.loop, zero: true, xlabel: 'θ between μ and B (°)', ylabel: 'τ (N·m), U (J)', cursor: 'loop', label: 'Torque and energy against angle',
        series: [{ pts: curve(d => M.LOOP.tmax * Math.sin(d * Math.PI / 180), 0, 180), tag: [80, M.LOOP.tmax, 'τ'] }, { cls: 'trend', pts: curve(M.loopU, 0, 180), tag: [150, M.loopU(150), 'U'] }] })}</div>
      <p class="hintline">环慢慢地转动各个角度。单击它可查看每侧的力（每 N 4 个方块）。</p>`,
    cam: { target: [STATIONS.loop, 2.3, 0], az: -32, el: 16, dist: 20 }, lit: 'loop', scene: 'loop', look: {},
    fig: `${f(M.LOOP.a * 100, 0)} × ${f(M.LOOP.b * 100, 0)} cm, ${f(M.LOOP.I, 1)} A, B = ${f(M.LOOP.B)} T`,
  },
  {
    kicker: '14.5', title: "安培定律", sub: "B 绕长线",
    body: `<p class="lede">绕一条长线，线条是圆圈：拇指沿<i>I</i>，手指卷曲<b>B</b>.</p>
      <div class="eq">∮ <b>B</b> · d<b>s</b> = μ<sub>0</sub><i>I</i><sub>enc</sub></div>
      <p>在圆上 <b>B</b> ∥ d<b>s</b>，<i>B</i> 常数：<i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>I</i>，所以<i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i>。在粗导线内部，<i>B</i> = μ<sub>0</sub><i>Ir</i>/2π<i>a</i>².</p>
      <p>穿过矩形，添加条带： ∫<sub><i>a</i></sub><sup><i>a</i>+<i>c</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>r</i>) <i>b</i> d<i>r</i>，或</p>
      <div class="eq">Φ = (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>a</i> + <i>c</i>)/<i>a</i>)</div>
      <div class="charts">${chart({ ...R.ampere, xlabel: 'r (cm)', ylabel: 'B (μT)', cursor: 'ampere', label: 'Field against distance from a thick wire', vlines: [[1, 'a']],
        series: [{ pts: curve(r => M.ampereB(r / 100) * 1e6, 0, 15, 150) }] })}</div>
      <p class="hintline"> 单击 d<b>s</b> 的导线，即其条带的矩形。 <b>B</b>：每 100 μT 0.8 个方格。</p>`,
    cam: { target: [STATIONS.ampere + 0.7, 3.3, 0], az: 34, el: 21, dist: 24 }, lit: 'ampere', scene: 'ampere', look: {},
    fig: `${f(M.AMP.I, 0)} A上长线`,
  },
  {
    kicker: '14.6', title: "比奥-萨伐尔", sub: "把每一块加起来",
    body: `<p class="lede">没有对称性，将每根导线的电场d<b>l</b>相加，就像库仑定律将电荷相加一样。 <b>r̂</b> 从 d<b>l</b> 点到 P:</p>
      <div class="eq">d<b>B</b> = (μ<sub>0</sub><i>I</i>/4π) d<b>l</b> × <b>r̂</b> / <i>r</i>²</div>
      <p> 在循环轴上每隔 d<b>l</b> ⊥ <b>r</b>。 d<b>B</b> 的横向部分取消循环；沿轴的零件 (cos θ = <i>R</i>/<i>r</i>) 添加：</p>
      <div class="eq"><i>B</i> = μ<sub>0</sub><i>IR</i>² / 2(<i>R</i>² + <i>z</i>²)<sup>3/2</sup></div>
      <p>在中心，μ<sub>0</sub><i>I</i>/2<i>R</i> = ${uT(M.RING.Bc)} μT。远处，μ<sub>0</sub><i>IR</i>²/2<i>z</i>³：偶极子的1/<i>z</i>³.</p>
      <div class="charts">${chart({ ...R.ring, xlabel: 'z along the axis (cm)', ylabel: 'B (μT)', cursor: 'ring', label: 'Field along the axis of a loop',
        series: [{ cls: 'trend', pts: curve(z => M.ringFar(z / 100) * 1e6, 12, 36), tag: [24, 13, 'μ₀IR²/2z³'] }, { pts: curve(z => M.ringAxis(z / 100) * 1e6, 0, 36) }] })}</div>
      <p class="hintline">单击 ${M.RING.pieces} 件 d<b>l</b> 及其 d<b>B</b> 的循环（绘制长度为 5 倍）。 <b>B</b>：每20μT 1个正方形。</p>`,
    cam: { target: [STATIONS.ring + 1.0, 2.5, 0], az: -38, el: 14, dist: 22 }, lit: 'ring', scene: 'ring', look: {},
    fig: `R = ${f(M.RING.R * 100, 0)} cm, I = ${f(M.RING.I, 0)} A`,
  },
  {
    kicker: '14.7', title: "平行线", sub: "就像电流吸引一样",
    body: `<p class="lede">每根电线都位于对方的场内，因此每个人都感觉 <b>F</b> = <i>I</i> <b>L</b> × <b>B</b>.</p>
      <div class="eq"><i>B</i><sub>1</sub> = μ<sub>0</sub><i>I</i><sub>1</sub>/2π<i>d</i> &nbsp;→&nbsp; <i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π<i>d</i></div>
      <p>与${f(M.WIRES.I, 0)}各A，相距${f(M.WIRES.d * 100, 0)} cm，即${f(M.WIRES.FL * 1000)} mN每米。电流以<b>相同</b>方式吸引； <b>相反</b>方式排斥，电荷相反。</p>
      <p>场线显示它。类似电流在电线之间抵消（<i>B</i> = 0 中途）并且外部线路环绕两者。相反的电流在它们之间挤满了场。</p>
      <div class="charts">${chart({ ...R.wires, xlabel: 'd (cm)', ylabel: 'F/L (mN/m)', label: 'Force per length against separation',
        series: [{ pts: curve(d => M.MU0 * M.WIRES.I ** 2 / (2 * Math.PI * d / 100) * 1000, 2, 40) }], marks: [[M.WIRES.d * 100, M.WIRES.FL * 1000, `${f(M.WIRES.FL * 1000)} mN/m`]] })}</div>
      <p class="hintline"> 单击一对，了解每根电线与另一根电线感受到的场。力：2 个方格/mN/m.</p>`,
    cam: { target: [(STATIONS.same + STATIONS.opposite) / 2, 2.0, 0], az: -10, el: 30, dist: 34 }, lit: 'same', scene: 'wires', look: {},
    fig: "同样的方式，然后相反的方式",
  },
  {
    kicker: '14.8', title: "电磁阀", sub: "和环形线圈：均匀场",
    body: `<p class="lede">堆叠许多循环：它们的字段在内部添加，在外部几乎取消。那是一个 <b>螺线管</b>.</p>
      <p>取一个长方形，一半在里面。只有它的内侧才算数（<b>B</b> ⊥ d<b>s</b> 在两端， <i>B</i> ≈ 0 外），所以 <i>BL</i> = μ<sub>0</sub><i>NI</i>。与 <i>n</i> = <i>N</i>/<i>L</i> 每米转数：</p>
      <div class="eq"><i>B</i> = μ<sub>0</sub><i>nI</i> &nbsp;&nbsp; toroid: <i>B</i> = μ<sub>0</sub><i>NI</i>/2π<i>r</i></div>
      <p>这里μ<sub>0</sub><i>nI</i> = ${uT(M.SOL.B)} μT；比奥-萨伐尔总和给出 ${uT(SOLC)} μT，因为该线圈仅 ${f(M.SOL.L / M.SOL.R, 1)} 半径长。弯成一个环，它是 <b>环形线圈</b>: <i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>NI</i> 内，孔内和外为 0。</p>
      <div class="charts">${chart({ ...R.solenoid, xlabel: 'x along the axis (cm)', ylabel: 'B (μT)', label: 'Field along the solenoid axis', vlines: [[-20, 'end'], [20, 'end']],
        series: [{ cls: 'trend', pts: [[-20, M.SOL.B * 1e6], [20, M.SOL.B * 1e6]], tag: [-6, M.SOL.B * 1e6 + 6, 'μ₀nI'] }, { pts: curve(x => M.solB([x / 100, 0, 0])[0] * 1e6, -40, 40, 100) }] })}</div>
      <p class="hintline">单击螺线管查看其 Aperian 矩形，即环形线圈以查看其内部。 <b>B</b>：每 100 μT 1 个正方形。</p>`,
    cam: { target: [(STATIONS.solenoid + STATIONS.toroid) / 2 - 0.4, 1.8, 0], az: -10, el: 30, dist: 31 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: `${M.SOL.N} 转弯和 ${M.TOR.N} 轮流， ${f(M.SOL.I, 1)} A`,
  },
];

// ---------- click a scene: what it breaks into ----------
const deg = Math.PI / 180;
export const PLATES = {
  magnet: { text: `磁铁会消失，内部的线条就会显现出来，并且在其 N 端放置一个封闭的盒子。线条通过盒子的外表面离开，相同的线条通过切割磁铁的面返回。进出取消：本身没有杆。`,
    facts: () => [["通量流出", `${sci(MAGFLUX.out)} Wb`], ["通量", `${sci(MAGFLUX.in)} Wb`], ['total ∮B·dA', `${f(Math.abs(MAGFLUX.total / MAGFLUX.out) * 100, 3)}流出通量百分比：0`], ["B在中心", `${f(BC * 1000, 0)} mT`]] },
  rhr: { text: `<b>v</b> 沿分裂成一部分 <b>B</b> 和它的一部分（灰色）。只有横过的部分感觉到有力： <i>F</i> = <i>qv</i><sub>⊥</sub><i>B</i> = <i>qvB</i> 正弦θ。 <b>F</b> 两者都是 ⊥ <b>v</b> 和 <b>B</b>。带负电荷的电子被推向另一个方向。`,
    facts: s => { const d = M.rhrAngle(s.clock), v = M.RHR.v; return [['θ', `${f(d, 0)}°`], ['v along B', `${sci(Math.max(Math.abs(v * Math.cos(d * deg)), 1), 2)} m/s`], ['v across B', `${sci(Math.max(v * Math.sin(d * deg), 1), 2)} m/s`], ['F = qv⊥B', `${sci(Math.max(M.RHR.Fmax * Math.sin(d * deg), 1e-30), 2)} N`], ["F 完成的工作", '0']]; } },
  cyclo: { text: `力（红色）指向每个圆的中心，⊥ 到 <b>v</b>，所以速度永远不会改变。更快的质子需要更大的圆，但它会同时覆盖它。`,
    facts: s => { const t = M.cycTime(s.clock) % M.CYC.T; return [["t 在本回合中", `${f(t * 1e6, 3)} μs of ${f(M.CYC.T * 1e6, 3)} μs`], ["50 V 质子上的 F", `${sci(M.QE * M.CYC.v[0] * M.CYC.B)} N`], ["200 V 质子上的 F", `${sci(M.QE * M.CYC.v[1] * M.CYC.B)} N`], ['ω = qB/m', `${sci(M.CYC.omega)} rad/s`]]; } },
  selector: { text: `对于板之间的每个质子： <i>q</i><b>E</b> 下来，对所有人都一样，并且 <i>q</i><b>v</b> × <b>B</b> 向上，快速成长。它们的总和（红色）仅在以下情况下为零： <i>v</i> = <i>E</i>/<i>B</i>。仅 <b>E</b> 确实起作用，因此慢速质子在落向 - 板时会加速。`,
    facts: () => [["qE（全部三个）", `${sci(M.QE * M.SEL.E)} N`], ["qvB 为 0.8 E/B", `${sci(0.8 * M.QE * M.SEL.E)} N`], ["E/B 处的 qvB", `${sci(M.QE * M.SEL.E)} N`], ["qvB 为 1.25 E/B", `${sci(1.25 * M.QE * M.SEL.E)} N`]] },
  loop: { text: `每侧 <b>F</b> = <i>I</i> <b>L</b> × <b>B</b>。垂直边上的 <b>F</b><sub>1</sub> 和 <b>F</b><sub>3</sub> 始终为 <i>IbB</i>，但它们的作用不同线，所以它们扭曲。 <b>F</b><sub>2</sub> 和 <b>F</b><sub>4</sub> 在同一条线上相等且相反：它们仅拉伸或挤压环。弯曲的导线也没有什么不同：半径为 <i>R</i> 的半圆感觉 ∫<i>I</i> d<b>s</b> × <b>B</b> = 2<i>IRB</i>，与其直弦相同。`,
    facts: s => { const d = M.loopAngle(s.clock), S = M.loopSides(d); return [['θ', `${f(d, 0)}°`], ["F₁、F₃（垂直边）", `${f(M.len(S[0].F), 3)} N each`], ["F2、F₄（顶部、底部）", `${f(M.len(S[1].F), 3)} N each`], ['ΣF', '0 N'], ['τ = μB sin θ', `${f(M.len(M.loopTorque(d)), 4)} N·m`]]; } },
  ampere: { text: `安培圆被切成碎片 d<b>s</b>。每块 <b>B</b> 的运行方式与 d<b>s</b> 相同，并且具有相同的尺寸，因此 ∮<b>B</b> · d<b>s</b> 是只是<i>B</i> × 2π<i>r</i>。随着圆的增大，<i>B</i> 会缩小以匹配：总数保持为 μ<sub>0</sub><i>I</i>。`,
    facts: s => { const r = M.ampR(s.clock), B = M.ampereB(r); return [['r', `${f(r * 100, 1)} cm`], ['B', `${uT(B)} μT`], ['2πr', `${f(2 * Math.PI * r * 100, 1)} cm`], ['B · 2πr', `${sci(B * 2 * Math.PI * r)} T·m`], ['μ₀I', `${sci(M.MU0 * M.AMP.I)} T·m`]]; } },
  flux: { text: `将矩形切割成宽度为 d<i>r</i> 的 ${M.FLUX.strips} 条。 <i>B</i> 在每个带上几乎恒定，因此每个带的通量为 <i>B</i>(<i>r</i>) <i>b</i> d<i>r</i>。靠近的条带携带最多。将它们相加就是积分。`,
    facts: () => { const s = M.fluxStrips(); return [...s.map((x, i) => [`strip ${i + 1} (r ${f((M.FLUX.a + (i + 0.5) * M.FLUX.c / M.FLUX.strips) * 100, 1)} cm)`, `${f(x * 1e9, 0)} nWb`]), ['sum', `${f(s.reduce((a, b) => a + b, 0) * 1e9, 0)} nWb`], ['(μ₀Ib/2π) ln((a+c)/a)', `${f(M.FLUX.phi * 1e9, 0)} nWb`]]; } },
  ring: { text: `环路有十二块 d<b>l</b>，每块 d<b>B</b> 位于 P（灰色）处。每个 d<b>B</b> 都是 d<b>l</b> 和 <b>r</b> 的 ⊥，因此它们一起形成一个圆锥体。在循环中，侧面部分成对抵消，沿轴部分加起来为 <b>B</b>。`,
    facts: s => { const z = M.ringZ(s.clock), p = M.ringPieces(z), one = M.len(p[0].dB); return [['z', `${f(z * 100, 1)} cm`], ['each |dB|', `${f(one * 1e6, 2)} μT`], ["每个沿轴", `${f(p[0].dB[0] * 1e6, 2)} μT`], [`${p.length} 之和`, `${uT(p.reduce((a, q) => a + q.dB[0], 0))} μT`], ['μ₀IR²/2(R²+z²)^{3/2}', `${uT(M.ringAxis(z))} μT`]]; } },
  same: { text: `在导线 2 处，导线 1 的场 <b>B</b><sub>1</sub> 将 ⊥ 延伸至导线。 <i>I</i><sub>2</sub><b>L</b> × <b>B</b><sub>1</sub> 指向导线 1。反之亦然圆形，相等且相反的一对。`,
    facts: () => [["B₁ 位于电线 2 处", `${uT(M.ampereB(M.WIRES.d))} μT`], ["每个 F/L", `${f(M.WIRES.FL * 1000)} mN/m`], ['B midway', '0'], ['direction', "朝向彼此"]] },
  opposite: { text: `反向 <i>I</i><sub>2</sub> 和 <i>I</i><sub>2</sub><b>L</b> × <b>B</b><sub>1</sub> 也相反：电线推开。现在在它们之间添加了两个字段。`,
    facts: () => [["B₁ 位于电线 2 处", `${uT(M.ampereB(M.WIRES.d))} μT`], ["每个 F/L", `${f(M.WIRES.FL * 1000)} mN/m`], ['B midway', `${uT(2 * M.ampereB(M.WIRES.d / 2))} μT`], ['direction', 'apart']] },
  solenoid: { text: `转弯逐渐淡出，显示出内部的场：几乎均匀、几乎平行。虚线 Amperian 矩形包围 ${M.rectTurns()} 匝。仅其沿轴的边加上 ∮<b>B</b> · d<b>s</b>。`,
    facts: () => { const L = 2 * M.SOL_RECT.h, N = M.rectTurns(); return [["圈数封闭 N", `${N}`], ["内侧，L", `${f(L * 100, 0)} cm`], ['μ₀NI / L', `${uT(M.MU0 * N * M.SOL.I / L)} μT`], ["∮B·ds，根据模型求和", `${sci(M.lineIntegral(M.solB, M.rectPath(M.SOL_RECT.h, M.SOL_RECT.Y, 200)))} T·m`], ['μ₀NI', `${sci(M.MU0 * N * M.SOL.I)} T·m`]]; } },
  toroid: { text: `转弯消失了。虚线圆圈从洞中呼吸，穿过核心，到达外部。它的 <b>B</b> 箭头仅在其位于绕组内部时出现，其中它包围了所有 ${M.TOR.N} 匝一次。`,
    facts: s => { const r = M.torR(s.clock); return [['r', `${f(r * 100, 1)} cm`], ["当前封闭", r > M.TOR.R0 - M.TOR.a && r < M.TOR.R0 + M.TOR.a ? `NI = ${f(M.TOR.N * M.TOR.I, 0)} A` : '0'], ['μ₀NI/2πr', `${uT(M.torIdeal(r))} μT`], ["从模型", `${uT(M.len(M.torB([r, 0, 0])))} μT`]]; } },
};
