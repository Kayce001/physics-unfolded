// Chapter 11, page by page (after the AP Physics C E&M organizer, Unit 3). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST, SC } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const BLUE = '#3d63a8';
const uJ = J => f(J * 1e6, 3);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false, extra = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" style="fill:none${s.color ? `;stroke:${s.color}` : ''}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}${extra}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges, shared with the live cursors in main.js
export const R = {
  pair: { x0: 10, x1: 40, y0: -1, y1: 1 },
  square: { x0: 0, x1: 4.8, y0: 0, y1: 1.2 },
  uniform: { x0: 0, x1: 20, y0: -12, y1: 0 },
  hill: { x0: 0, x1: 0.4, y0: 0, y1: 200 },
  rod: { x0: 0, x1: 0.4, y0: 0, y1: 300 },
  ring: { x0: 0, x1: 0.25, y0: 0, y1: 250 },
  sphV: { x0: 0, x1: 0.4, y0: 0, y1: 300 },
  sphE: { x0: 0, x1: 0.4, y0: 0, y1: 2 },
  accel: { x0: 0, x1: 6, y0: 0, y1: 6 },
};

const Ulike = M.pair(M.PAIR.run, 1), Uunl = M.pair(M.PAIR.run, -1);
const steps = [0, 1, 2, 3].map(M.sqStep);
const dipAxis = M.VdipAxis(M.DIP.axisX), rodA = M.VrodAxis(0.1), rodB = M.VrodBis(M.ROD.bisA);
// split a sampled curve into the runs that stay inside ±lim (it blows up at each charge)
const runs = (pts, lim) => pts.reduce((out, p, i) => { if (Math.abs(p[1]) > lim || !isFinite(p[1])) return out; if (i && Math.abs(pts[i - 1][1]) <= lim && out.length) out.at(-1).push(p); else out.push([p]); return out; }, []);

export const PAGES = [
  {
    kicker: "第11章", title: "电势能", sub: "存储在一对电荷中的工作",
    body: `<p class="lede">将一个电荷推向另一个相同符号的电荷，你确实会抵抗斥力。该功存储为 <b> 电势能 </b>.</p>
      <div class="eq"><i>U</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub> / <i>r</i></div>
      当电荷相距无限远时，<p><i>U</i> = 0。将 +2 nC 从 ${M.PAIR.r0 * 100} cm 引入到 ${M.PAIR.r1 * 100} cm +4 nC 需要 ${uJ(Ulike.W)} μJ。与电荷聚集不同，因此它们的 <i>U</i> 是 <b> 负 </b> 并在关闭时下降。 <i>U</i> 是标量：电荷的符号带有其符号。</p>
      <div class="charts">${chart({ ...R.pair, zero: true, xlabel: 'separation r (cm)', ylabel: 'U (μJ)', cursors: [['pairL'], ['pairU', BLUE]], label: 'Potential energy against separation for like and unlike pairs',
        series: [{ pts: samples(60, 10, 40, r => M.Upair(M.PAIR.q1, M.PAIR.q2, r / 100) * 1e6), tag: [24, 0.38, 'like: U > 0'] }, { color: BLUE, pts: samples(60, 10, 40, r => M.Upair(M.PAIR.q1, -M.PAIR.q2, r / 100) * 1e6), tag: [24, -0.18, 'unlike: U < 0'] }] })}</div>
      <p class="hintline">单击步骤中的路径，每次添加<i>F</i>Δ<i>r</i>。 1 平方 = 10 厘米；力 ${(SC.F * 10).toFixed(1)} cm/μN.</p>`,
    cam: { target: [ST.pair + 0.2, 0.3, 0], az: -12, el: 32, dist: 16 }, lit: 'pair', scene: 'pair', look: {},
    fig: "相似和不同的成对，接近",
  },
  {
    kicker: '11.1', title: "组装费", sub: "将每一对相加",
    body: `<p class="lede">一组电荷的能量是将它们从无穷大一次引入一个的功。</p>
      <table class="data">
        <tr><td><i>q</i><sub>1</sub></td><td>没有还有</td><td>0</td></tr>
        <tr><td><i>q</i><sub>2</sub></td> <td><i>kq</i>²/<i>a</i></td><td>${uJ(steps[1])} μJ</td></tr>
        <tr><td><i>q</i><sub>3</sub></td><td><i>kq</i>²/<i>a</i> + <i>kq</i>²/√2<i>a</i></td><td>${uJ(steps[2])} μJ</td></tr>
        <tr><td><i>q</i><sub>4</sub></td><td>2<i>kq</i>²/<i>a</i> + <i>kq</i>²/√2<i>a</i></td><td>${uJ(steps[3])} μJ</td></tr>
      </table>
      <div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = ${uJ(M.SQ.U)} μJ</div>
      <p>四个+2 nC电荷，<i>a</i> = ${M.SQ.a * 100} cm。六对，任意顺序。</p>
      <div class="charts">${chart({ ...R.square, xlabel: 'time (s)', ylabel: 'U of the group (μJ)', cursors: [['square']], label: 'Energy of the group as the charges arrive',
        series: [{ pts: samples(240, 0, M.SQ.run, t => M.square(t).U * 1e6) }] })}</div>
      <p class="hintline">单击方块查看其六对。</p>`,
    cam: { target: [ST.square, 0.3, 0], az: -12, el: 40, dist: 15 }, lit: 'square', scene: 'square', look: {},
    fig: "四个电荷，六组电荷对",
  },
  {
    kicker: '11.2', title: "电势", sub: "每单位电荷的能量",
    body: `<p class="lede"><b>电势</b> <i>V</i> 是每单位电荷的势能，以伏特 (J/C) 为单位。放置在那里的电荷 <i>q</i> 具有 <i>U</i> = <i>qV</i>.</p>
      <div class="eq">Δ<i>V</i> = −∫<sub>A</sub><sup>B</sup> <b><i>E</i></b> · d<b><i>s</i></b></div>
      <p>仅沿 <b><i>E</i></b> 的每个步骤 d<b><i>s</i></b> 的部分计数。对于 <i>E</i> = ${M.UNI.E} N/C：A → B 穿过 <b><i>E</i></b> 并加 0； B → C 沿其长度为 0.2 m，−${M.UNI.E} × 0.2 = <b>−10 V</b>。 A → C 直行给出相同的结果。移动<b>和</b> <b><i>E</i></b>，<i>V</i>下跌。浅色片为 <b>等势面</b>，与 <b><i>E</i></b> 成直角。对于 <i>E</i> = 4<i>x</i>： −∫<sub>0</sub><sup>4</sup> 4<i>x</i> d<i>x</i> = ${M.VARY.dV}五、</p>
      <div class="charts">${chart({ ...R.uniform, xlabel: 'distance along E (cm)', ylabel: 'V (volts)', cursors: [['uni']], label: 'Potential against distance along the field', series: [{ pts: [[0, 0], [20, -10]] }] })}</div>
      <p class="hintline">单击将 A → C 拆分为步骤 d<b><i>s</i></b>。 <b><i>E</i></b>：每 25 N/C.</p> 一个正方形`,
    cam: { target: [ST.uniform, 0.4, 0.2], az: -18, el: 34, dist: 19 }, lit: 'uniform', scene: 'uniform', look: {},
    fig: "E = 50 常闭； A 至 C 下降 10 V",
  },
  {
    kicker: '11.3', title: "电势构成的山丘", sub: "V = kq/r，且 E = −∇V",
    body: `<p class="lede">围绕点电荷仅计算每一步的径向部分，<b>r̂</b> · d<b><i>s</i></b> = d<i>r</i>:</p>
      <div class="eq">Δ<i>V</i> = −∫ <i>kq</i>/<i>r</i>² d<i>r</i> = <i>kq</i>(1/<i>r</i><sub>B</sub> − 1/<i>r</i><sub>A</sub>)</div>
      <p>从无穷大开始，<i>V</i> = <i>kq</i>/<i>r</i>，绘制为 +1 nC 的高度。圆圈每 30 V 等电位；他们聚集在山势陡峭的地方。 <b><i>E</i></b> 指向直下坡，与坡度一样大： <b><i>E</i></b> = −∇<i>V</i>，或 <i>E</i> = −d<i>V</i>/d<i>r</i>.</p>
      <div class="charts">${chart({ ...R.hill, xlabel: 'distance r (m)', ylabel: 'V (volts)', cursors: [['hill']], label: 'Potential against distance, with the tangent at the probe',
        series: [{ pts: samples(80, 0.045, 0.4, r => M.Vpoint(M.HILL.Q, r)) }], extra: `<path class="trend" style="fill:none" data-tangent="hill" d=""/>` })}</div>
      <p class="live" id="hilllive"></p>
      <p class="hintline">单击可将山从地图上移出。高度：每 60 V 一个正方形（150 V 以上四舍五入）； <b><i>E</i></b>：每kN/C一个正方形。</p>`,
    cam: { target: [ST.hill, 0.9, 0], az: -18, el: 30, dist: 25 }, lit: 'hill', scene: 'hill', look: {},
    fig: "高度表示电势；箭头指向电势降低的方向",
  },
  {
    kicker: '11.4', title: "偶极子", sub: "电势作为数字相加",
    body: `<p class="lede">Potential 是一个标量：对于多个电荷，将每个 <i>kq</i>/<i>r</i> 及其符号相加。无组件。</p>
      <div class="eq"><i>V</i><sub>axis</sub> = −2<i>akq</i>/(<i>x</i>² − <i>a</i>²)</div>
      <p>即 <i>kq</i>/(<i>x</i> + <i>a</i>) − <i>kq</i>/(<i>x</i> − <i>a</i>) ±1 nC，${2 * M.DIP.a * 100} 厘米相距：井边的一座小山。在 P 处，${M.DIP.axisX * 100} 厘米出，<i>V</i> = ${f(dipAxis, 1)} V。垂直平分线的每个点到两者的距离相等，因此 <i>V</i> = <b>0</b> <b><i>E</i></b> 不是。对于平分线上的两个相似电荷 <i>V</i> 不为 0：它在中点达到峰值。</p>
      <div class="charts">${chart({ x0: -0.36, x1: 0.36, y0: -200, y1: 200, zero: true, xlabel: 'position along the axis (m)', ylabel: 'V on the axis (volts)', label: 'Potential along the dipole axis',
        series: runs(samples(720, -0.36, 0.36, x => M.Vdip([x, 0, 0])), 200).map(pts => ({ pts })),
        marks: [[M.DIP.axisX, dipAxis, `P: ${f(dipAxis, 0)} V`, 6, 16]] })}</div>
      <p class="hintline">单击查看 P 和 P′ 处每个费用的份额。高度：每 60 V 一个正方形。蓝色：从模型追踪的场线。</p>`,
    cam: { target: [ST.dipole, 0, 0], az: -14, el: 30, dist: 24 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: "一座山，一口井，其间 V = 0",
  },
  {
    kicker: '11.5', title: "带电棒", sub: "将每个 dq 加起来",
    body: `<p class="lede">将分散装药切割成碎片d<i>q</i>，每个碎片添加<i>k</i> d<i>q</i>/<i>r</i>，并积分。</p>
      <table class="data eqs">
        <tr><td>λ=<i>Q</i>/<i>L</i>，d<i>q</i>=λd<i>x</i></td><td>${f(M.ROD.lam * 1e9, 0)} nC/m</td></tr>
        <tr><td>P，在轴上：<i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>)</td><td>${f(rodA, 1)} V</td></tr>
        <tr><td>P′，在平分线上：<i>k</i>λ ln[(<i>L</i> + <i>s</i>)/(−<i>L</i> + <i>s</i>)]</td><td>${f(rodB, 1)} V</td></tr>
      </table>
      <p>+3 nC 超过 ${M.ROD.L * 100} cm，<i>a</i> = 10 cm 时的值，其中 <i>s</i> = √(<i>L</i>² + 4<i>a</i>²) 来自 ∫ d<i>x</i>/√(<i>x</i>² + <i>a</i>²) = ln(<i>x</i> + √(<i>x</i>² + <i>a</i>²))。远处的杆就像点电荷（虚线）。</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'distance a from the end (m)', ylabel: 'V at P (volts)', cursors: [['rod']], label: 'Potential on the rod axis against distance',
        series: [{ pts: samples(60, 0.04, 0.4, M.VrodAxis), tag: [0.09, 175, 'rod'] }, { cls: 'trend', pts: samples(60, 0.04, 0.4, a => M.K * M.ROD.Q / (a + M.ROD.L / 2)), tag: [0.2, 95, 'kQ/(a + L/2)'] }] })}</div>
      <p class="hintline">点击杆将其切成12块d<i>q</i>.</p>`,
    cam: { target: [ST.rod - 0.5, 1.6, 0], az: -12, el: 14, dist: 15 }, lit: 'rod', scene: 'rod', look: {},
    fig: "λ = 10nC/m； P沿轴滑动",
  },
  {
    kicker: '11.6', title: "环、弧、盘", sub: "当每个 dq 的距离相同时",
    body: `<p class="lede">在圆环或圆弧的中心，每个d<i>q</i>距<i>R</i>的距离相同，因此<i>V</i><sub>c</sub> = (<i>k</i>/<i>R</i>)∫d<i>q</i> = <i>kQ</i>/<i>R</i>.</p>
      <table class="data eqs">
        <tr><td>环，在其轴上</td><td><i>kQ</i>/√(<i>R</i>² + <i>z</i>²)</td></tr>
        <tr><td>圆盘，d<i>q</i> = σ·2π<i>r</i> d<i>r</i></td><td>2π<i>k</i>σ(√(<i>R</i>² + <i>z</i>²) − <i>z</i>)</td></tr>
        <tr><td>圆盘中心，σ = <i>Q</i>/π<i>R</i>²</td><td>2<i>kQ</i>/<i>R</i></td></tr>
      </table>
      <p>Each +2 nC，<i>R</i> = ${M.RING.R * 100} 厘米。环和半环中心：${f(M.Varc0, 1)} V。圆盘中心：${f(M.Vdisc(0), 1)} V，两倍，因为相同的电荷位置更近。</p>
      <div class="charts">${chart({ ...R.ring, xlabel: 'distance z along the axis (m)', ylabel: 'V (volts)', cursors: [['ring'], ['disc', BLUE]], label: 'Potential on the axis of a ring and a disc',
        series: [{ color: BLUE, pts: samples(60, 0, 0.25, M.Vdisc), tag: [0.1, 160, 'disc'] }, { pts: samples(60, 0, 0.25, M.Vring), tag: [0.1, 70, 'ring'] }, { cls: 'trend', pts: samples(40, 0.075, 0.25, z => M.K * M.RING.Q / z), tag: [0.17, 112, 'kQ/z'] }] })}</div>
      <p class="hintline">点击环、弧或盘将其打碎 d<i>q</i>.</p>`,
    cam: { target: [ST.ring - 1.4, 1.8, 0], az: -32, el: 12, dist: 29 }, lit: 'ring', scene: 'ring', look: {},
    fig: "kQ/R 位于中心； P 在轴上输出",
  },
  {
    kicker: '11.7', title: "带电球体", sub: "导体和绝缘体",
    body: `<p class="lede">用高斯定律在每个区域找到<b><i>E</i></b>，然后从无穷远走进去： ∞ → <i>R</i> 外面，<i>R</i> → <i>r</i> 里面。</p>
      <p>在外面，两者的作用都像点电荷，<i>V</i> = <i>kQ</i>/<i>r</i>。在 <b>导体</b> <i>E</i> = 0 内，因此 <i>V</i> 保持 <i>kQ</i>/<i>R</i> = ${f(M.Vcond(0), 1)} V. 在<b>绝缘子</b> <i>E</i> = <i>kQr</i>/<i>R</i>³ 不断添加：</p>
      <div class="eq"><i>V</i> = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²)</div>
      <p>3<i>kQ</i>/2<i>R</i> = ${f(M.Vins(0), 1)} V 位于中心（+2 nC，<i>R</i> = ${M.SPH.R * 100} cm）。 <i>V</i>永不跳跃。</p>
      <div class="charts">${chart({ ...R.sphV, xlabel: 'r (m)', ylabel: 'V (volts)', cursors: [['sphVc'], ['sphVi', BLUE]], label: 'Potential against r for the two spheres',
        series: [{ color: BLUE, pts: samples(120, 0, 0.4, M.Vins), tag: [0.11, 215, 'insulator'] }, { pts: samples(120, 0, 0.4, M.Vcond), tag: [0.13, 150, 'conductor'] }] })}</div>
      <p class="hintline"> 沿路径单击 <b><i>E</i></b> 的球体。棒：每 150 V 一个方块； <b><i>E</i></b>：每 2.5 kN/C 一个正方形。</p>`,
    cam: { target: [ST.spheres, 1.8, 0], az: -8, el: 10, dist: 27 }, lit: 'conductor', scene: 'spheres', look: {},
    fig: "从40厘米处走进去",
  },
  {
    kicker: '11.8', title: "电子伏特", sub: "来自电势差的能量",
    body: `<p class="lede">放掉电荷：势能转化为动能，机械能守恒。</p>
      <div class="eq"><i>qV</i><sub>0</sub> = <i>qV</i><sub>f</sub> + ½<i>mv</i>²  →  <i>v</i> = √(2<i>q</i>Δ<i>V</i>/<i>m</i>)</div>
      <p>A质子与<b><i>E</i></b>一起“下坡”，从7V到1V；电子则朝相反的方向运动。每个增益${M.ACC.dV} <b>eV</b>（1 eV = ${M.E_CH.toExponential(2).replace('e-', ' × 10⁻')} J，一个<i>e</i>通过1 V），但电子比${Math.round(M.M_P / M.M_E)}轻：</p>
      <table class="data">
        <tr><th></th><th>质子</th><th>电子</th></tr>
        <tr><td>最终速度</td><td>${f(M.ACC.vp / 1000, 1)} km/s</td><td>${f(M.ACC.ve / 1e6, 2)} × 10⁶ m/s</td></tr>
        <tr><td>跨过6厘米的时间</td><td>${f(M.ACC.Tp * 1e6, 2)} μs</td><td>${f(M.ACC.Te * 1e9, 0)} ns</td></tr>
      </table>
      <div class="charts">${chart({ ...R.accel, xlabel: 'distance from the 7 V plate (cm)', ylabel: 'K (eV)', cursors: [['accP'], ['accE', BLUE]], label: 'Kinetic energy against position for the proton and the electron',
        series: [{ pts: [[0, 0], [6, 6]], tag: [3.6, 3.0, 'proton →'] }, { color: BLUE, pts: [[6, 0], [0, 6]], tag: [0.5, 3.4, '← electron'] }] })}</div>
      <p class="hintline">Each 在 ${M.ACC.run} 秒内减速穿越。单击以获取力和频闪。 1 平方 = 1 厘米； <b><i>E</i></b>：每 50 V/m 一个正方形。</p>`,
    cam: { target: [ST.accel, 2.3, 0], az: -16, el: 10, dist: 21 }, lit: 'accel', scene: 'accel', look: {},
    fig: "下降 6 V 和上升 6 V：各 6 eV",
  },
];

// ---------- click a scene: what it breaks into ----------
const pairFacts = s => { const a = M.pair(s.pair.t, 1), b = M.pair(s.pair.t, -1);
  return [['separation r', `${f(a.r * 100, 1)} cm`], ['like: F on +2 nC', `${f(a.F * 1e6)} μN, away`], ['like: U', `${uJ(a.U)} μJ`], ["喜欢：到目前为止完成的工作", `${uJ(a.W)} μJ`], ['unlike: U', `${uJ(b.U)} μJ`], ["不同之处：到目前为止已完成的工作", `${uJ(b.W)} μJ`]]; };
export const PLATES = {
  pair: { text: `鬼魂以 5 厘米的步长标记路径，每个步长都带有电力。力以 1/<i>r</i>² 的形式增长，因此每一步的成本都比上一步高；总和 −∫<i>F</i> d<i>r</i> 是 <i>U</i> 的变化。对于相似的一对，你要对抗力量（正的工作）；对于不同的一对，力产生拉力，而你阻止（负功）。`, facts: pairFacts },
  square: { text: `六个链接是六对。每个存储 <i>kq</i>²/<i>r</i>：<i>r</i> = <i>a</i> 处的四个边，√2<i>a</i> 处的两条对角线。它们的总和就是团体的能量。`,
    facts: s => { const st = M.square(s.square.t); return [["收费到位", `${st.n} of 4`], ['U now', `${uJ(st.U)} μJ`], ["每边 kq²/a", `${uJ(M.K * M.SQ.q ** 2 / M.SQ.a)} μJ`], ["每条对角线 kq²/√2a", `${uJ(M.K * M.SQ.q ** 2 / (Math.SQRT2 * M.SQ.a))} μJ`], ["所有六个", `${uJ(M.SQ.U)} μJ`]]; } },
  uniform: { text: `A→C 切成四步 d<b><i>s</i></b>（黑色）。仅灰色部分d<i>x</i>，沿着<b><i>E</i></b>，计数：<b><i>E</i></b>· d<b><i>s</i></b> = <i>E</i> d<i>x</i>。四个 5 厘米的台阶，每个台阶都会使电势下降 2.5 V。每个台阶的侧面部分沿着等电势运行，不会增加任何东西，这就是路径无关紧要的原因。`,
    facts: s => { const r = M.uniPath(s.uniform.t); return [["每一步：−E dx", `−${M.UNI.E} × 0.05 = −2.5 V`], ["A→C，四步", '−10.00 V'], ["电荷于", `x = ${f(r.p[0] * 100, 1)} cm`], ['V there', `${f(r.V)} V`], ['U = qV (q = +1 nC)', `${f(r.U * 1e9)} nJ`]]; } },
  hill: { text: `表面从楼层地图上升起。每个等高线环都落在其等势圆上：等势线是围绕山丘的水平路径。蓝色的 <b><i>E</i></b> 箭头与圆圈成直角交叉，指向下坡，圆圈拥挤的地方最长。`,
    facts: s => { const r = M.hillProbe(s.clock); return [["探针在 r", `${f(r * 100, 1)} cm`], ['V = kq/r', `${f(M.Vpoint(M.HILL.Q, r), 1)} V`], ['E = kq/r²', `${f(M.Epoint(M.HILL.Q, r), 0)} N/C`], ['slope −dV/dr', `${f(M.Epoint(M.HILL.Q, r), 0)} V/m`]]; } },
  dipole: { text: `在每一点，红棒是 +1 nC 的 <i>kq</i>/<i>r</i>，蓝棒是 -1 nC，黑棒是它们的总和。在轴上，靠近 -q 的获胜。在平分线 P′ 上，两者完全抵消：<i>V</i> = 0，黑棒消失。`,
    facts: () => { const a = M.DIP.axisX, z = M.DIP.bisZ, v1 = M.Vpoint(M.DIP.q, a + M.DIP.a), v2 = M.Vpoint(-M.DIP.q, a - M.DIP.a), w = M.Vpoint(M.DIP.q, Math.hypot(M.DIP.a, z));
      return [['P: from +q', `${f(v1, 1)} V`], ['P: from −q', `${f(v2, 1)} V`], ['P: total', `${f(v1 + v2, 1)} V`], ['P′: ±q each', `±${f(w, 1)} V`], ['P′: total', '0 V']]; } },
  rod: { text: `将杆视为 ${12} 切片 d<i>q</i> = λΔ<i>x</i> = 0.25 nC，每个点电荷。每个切片将<i>k</i> d<i>q</i>/<i>r</i>发送到P和P′；这些线是距离 <i>r</i>。十二个切片已经接近积分。`,
    facts: s => { const a = M.rodProbe(s.clock); return [['P: distance a', `${f(a * 100, 1)} cm`], ['P: kλ ln((a+L)/a)', `${f(M.VrodAxis(a), 1)} V`], ["P：12片的总和", `${f(M.rodSum(12, [-a, 0, 0]), 1)} V`], ["P′：封闭形式", `${f(rodB, 1)} V`], ["P′：12 个切片的总和", `${f(M.rodSum(12, [M.ROD.L / 2, 0, -M.ROD.bisA]), 1)} V`]]; } },
  ring: { text: `十六块 0.125 nC，每块与 P 的距离相同 √(<i>R</i>² + <i>z</i>²)，因此该距离的总和仅为 <i>kQ</i>。`,
    facts: s => { const z = M.axisProbe(s.clock); return [['P at z', `${f(z * 100, 1)} cm`], ["每一件都是", `${f(Math.hypot(M.RING.R, z) * 100, 1)} 厘米远`], ['kQ/√(R² + z²)', `${f(M.Vring(z), 1)} V`], ["16 件之和", `${f(M.ringSum(16, z), 1)} V`]]; } },
  arc: { text: `一个半环，八块 0.25 nC，距离中心 C 均为 ${M.ARC.R * 100} 厘米。电弧的跨度并不重要，重要的是其总电荷：<i>V</i><sub>c</sub> = <i>kQ</i>/<i>R</i>。 （它在 C 处的场取决于形状；但它的电势则不然。）`,
    facts: () => [["每件", `k(0.25 nC)/0.15 m = ${f(M.Varc0 / 8, 2)} V`], ["八块", `${f(M.arcSum(8), 1)} V`], ['kQ/R', `${f(M.Varc0, 1)} V`]] },
  disc: { text: `五环，滑开。每个都是一个电荷环 d<i>q</i> = σ · 2π<i>r</i> d<i>r</i> 距 P 的距离为 √(<i>r</i>² + <i>z</i>²)；外环容纳更多电荷，但距离较远。将它们相加就是对 <i>r</i> 的积分。`,
    facts: s => { const z = M.axisProbe(s.clock); return [['P at z', `${f(z * 100, 1)} cm`], ['σ', `${f(M.DISC.sigma * 1e9, 1)} nC/m²`], ['2πkσ(√(R² + z²) − z)', `${f(M.Vdisc(z), 1)} V`], ["5个环的总和", `${f(M.discSum(5, z), 1)} V`]]; } },
  conductor: { text: `两条腿走路。从 ∞ 到 <i>R</i>，磁场为 <i>kQ</i>/<i>r</i>²（蓝色），<i>V</i> 攀升至 <i>kQ</i>/<i>R</i>。在内部，<i>E</i> = 0：没有箭头，没有任何可添加的内容，因此 <i>V</i> 保持平坦。整个导体是一个等电位。`,
    facts: s => { const r = M.sphProbe(s.spheres.t); return [["探针在 r", `${f(r * 100, 1)} cm`], ['E there', `${f(M.Econd(r), 0)} N/C`], ['V there', `${f(M.Vcond(r), 1)} V`], ['∞ → R adds', `${f(M.Vcond(M.SPH.R), 1)} V`], ['R → 0 adds', '0 V']]; } },
  insulator: { text: `同样的步行。外部，相同的 <i>kQ</i>/<i>r</i>² 字段。在内部，磁场向中心收缩为 <i>kQr</i>/<i>R</i>³（仅计算 <i>r</i> 内部的电荷），但它不为零，因此 <i>V</i> 不断上升，中心是另一个 <i>kQ</i>/2<i>R</i>。`,
    facts: s => { const r = M.sphProbe(s.spheres.t); return [["探针在 r", `${f(r * 100, 1)} cm`], ['E there', `${f(M.Eins(r), 0)} N/C`], ['V there', `${f(M.Vins(r), 1)} V`], ['∞ → R adds', `${f(M.Vins(M.SPH.R), 1)} V`], ['R → 0 adds', `${f(M.Vins(0) - M.Vins(M.SPH.R), 1)} V`]]; } },
  accel: { text: `每个 <i>eE</i> 上的力相同，方向相反：正电荷沿着 <b><i>E</i></b> 推动，负电荷则相反。频闪图像的间隔时间相等，随着每个图像的加速而散开。等距离上的等力：等功，每个 6 eV。`,
    facts: s => { const u = s.accel.t / M.ACC.run, p = M.accel(u, 'p'), e = M.accel(u, 'e');
      return [["对每个强制 eE", `${(M.E_CH * M.ACC.E).toExponential(2)} N`], ['proton: V, K', `${f(p.V)} V, ${f(M.eV(p.K))} eV`], ['proton: v', `${f(p.v / 1000, 1)} km/s`], ['electron: V, K', `${f(e.V)} V, ${f(M.eV(e.K))} eV`], ['electron: v', `${f(e.v / 1e6, 3)} × 10⁶ m/s`]]; } },
};
