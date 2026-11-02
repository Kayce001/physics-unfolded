// Chapter 5, page by page (after the AP Physics 1 organizer, Unit 6). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, F_WALL, F_EGG, EGG_ZOOM, CRASH_SCALE, W_SCALE, W_PLATE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const k = (x, n = 0) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const cm = s => `${(s * 100).toFixed(0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 140, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const d = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  const paths = series.map(s => (s.fill ? `<path class="area" d="${d(s.pts)}L${sx(s.pts.at(-1)[0]).toFixed(1)},${sy(0).toFixed(1)}L${sx(s.pts[0][0]).toFixed(1)},${sy(0).toFixed(1)}Z"/>` : '') +
    `<path class="${s.cls || 'curve'}" d="${d(s.pts)}"/>` + (s.tag ? `<text class="lab${s.cls === 'total' ? ' blue' : ''}" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.tag[3] ? ' text-anchor="end"' : ''}>${s.tag[2]}</text>` : '')).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const samples = (a, b, n, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// collision pages: momentum of each cart and the total, against time
export const COLL_T = { y0: -3, y1: 7 };
const momChart = (c, key, tags) => chart({
  x0: 0, x1: c.run, ...COLL_T, xlabel: "时间（秒）", ylabel: "动量（kg·m/s）", cursors: [key], label: "每辆车的动量和总时间与时间的关系",
  series: [
    { pts: [[0, c.m1 * c.u1], [c.tc, c.m1 * c.u1], [c.tc, c.m1 * c.v1], [c.run, c.m1 * c.v1]], tag: [tags[0][0], tags[0][1], 'p₁'] },
    { pts: [[0, c.m2 * c.u2], [c.tc, c.m2 * c.u2], [c.tc, c.m2 * c.v2], [c.run, c.m2 * c.v2]], tag: [tags[1][0], tags[1][1], 'p₂'] },
    { cls: 'total', pts: [[0, c.m1 * c.u1 + c.m2 * c.u2], [c.run, c.m1 * c.u1 + c.m2 * c.u2]], tag: [c.run - 0.03, c.m1 * c.u1 + c.m2 * c.u2, 'P, total', 1] },
  ] });
const collTable = c => { const K0 = M.ke(c.m1, c.u1) + M.ke(c.m2, c.u2), K1 = M.ke(c.m1, c.v1) + M.ke(c.m2, c.v2); return `
  <table class="data">
    <tr><th>kg·m/s, J</th><th><i>p</i>₁</th><th><i>p</i>₂</th><th><i>P</i> total</th><th><i>KE</i></th></tr>
    <tr><td>before</td><td>${f(c.m1 * c.u1, 1)}</td><td>${f(c.m2 * c.u2, 1)}</td><td>${f(c.m1 * c.u1 + c.m2 * c.u2, 1)}</td><td>${f(K0)}</td></tr>
    <tr><td>after</td><td>${f(c.m1 * c.v1, 1)}</td><td>${f(c.m2 * c.v2, 1)}</td><td>${f(c.m1 * c.v1 + c.m2 * c.v2, 1)}</td><td>${f(K1)}</td></tr>
  </table>`; };

const Wl = M.WALL, Eg = M.EGG, S = M.STICK, B = M.BOUNCE, X = M.BURST, Pd = M.PEND, C = M.CRASH, Sh = M.SHELL;
const deg = r => (r * 180 / Math.PI).toFixed(1);
// a real bullet: 10 g into 2.0 kg, swinging to the same angle
export const BULLET = ((0.01 + 2.0) / 0.01) * Math.sqrt(2 * M.G * Pd.L * (1 - Math.cos(Pd.theta)));

// tip-to-tail sketch of the crash momenta, to scale
const vecSketch = (() => {
  const s = 0.0016, ox = 190, oy = 128, ax = ox + C.px * s, ay = oy - C.py * s;
  const head = (x1, y1, x2, y2, cls) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 9; return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2 - 6 * Math.cos(a)}" y2="${y2 - 6 * Math.sin(a)}"/><path class="${cls}h" d="M${x2},${y2}L${x2 - L * Math.cos(a - 0.4)},${y2 - L * Math.sin(a - 0.4)}L${x2 - L * Math.cos(a + 0.4)},${y2 - L * Math.sin(a + 0.4)}Z"/>`; };
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Momentum vectors added tip to tail">
    ${head(ox, oy, ax, oy, 'vk')}${head(ax, oy, ax, ay, 'vk')}${head(ox, oy, ax, ay, 'vb')}
    <text class="lab" x="${ox - 4}" y="${oy + 6}" text-anchor="end">p_car ${k(C.px)}</text>
    <text class="lab" x="${ax + 8}" y="${(oy + ay) / 2}">p_truck ${k(C.py)}</text>
    <text class="lab blue" x="${(ox + ax) / 2 - 8}" y="${(oy + ay) / 2 - 6}" text-anchor="end">P ${k(C.P)}</text>
    <text class="ax" x="${W - 14}" y="20" text-anchor="end">kg·m/s · east → north ↑</text>
  </svg>`;
})();

const shellChart = chart({
  x0: 0, x1: 14, y0: 0, y1: 5, xlabel: 'x (m)', ylabel: "高度（米）", cursors: ['shell'], label: "壳的路径、两半和质心",
  series: [
    { cls: 'trend', pts: samples(0, Sh.run, 40, t => 0).map(([t]) => M.shell(t).cm), tag: [Sh.R * 0.62, Sh.H * 0.55, "质心"] },
    { pts: samples(0, Sh.ta, 20, t => 0).map(([t]) => M.shell(t).cm) },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).a), tag: [Sh.R / 2 - 0.15, 0.9, "后半部", 1] },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).b), tag: [10.3, 3.0, "前半部分"] },
  ],
  marks: [[Sh.R / 2, 0, 'R/2'], [Sh.R, 0, 'R'], [1.5 * Sh.R, 0, '3R/2']],
});


// continuous bodies: λ(x) with the moment x·λ(x) shaded; strip sums converging
const Rd = M.ROD, Tr = M.TRI, Se = M.SEMI, Ll = M.ELL, Ho = M.HOLE;
const rodChart = chart({
  x0: 0, x1: Rd.L, y0: 0, y1: 3, xlabel: "x 沿杆 (m)", ylabel: "λ (kg/m) 和 x·λ (kg)", cursors: ['rodL', 'rodM'], label: "线密度及其沿杆的力矩；平衡点已标记",
  series: [
    { fill: true, pts: samples(0, Rd.L, 40, x => x * M.lam('N', x)), tag: [0.95, 1.25, 'x·λ: area = ∫x dm', 1] },
    { pts: samples(0, Rd.L, 2, x => M.lam('N', x)), tag: [1.97, 1.02, 'λ: area = M', 1] },
    { cls: 'trend', pts: [[Rd.xN, 0], [Rd.xN, 3]] },
  ],
  marks: [[Rd.xN, 2.92, 'x_cm = 2L/3']] });
const NS = Array.from({ length: 12 }, (_, i) => i + 1);
const stripChart = chart({
  x0: 1, x1: 12, y0: 0.95, y1: 1.55, xlabel: "条数 n", ylabel: "条带总和 ÷ 精确值", label: "随着 n 的增长，质心的条带和估计接近积分",
  series: [
    { pts: NS.map(n => [n, M.stripSum(M.triW, Tr.h, n) / Tr.ucm]), tag: [11.8, 1.44, "上：三角形", 1] },
    { pts: NS.map(n => [n, M.stripSum(M.semiW, Se.R, n) / Se.ucm]), tag: [11.8, 1.36, "下：半圆", 1] },
    { cls: 'trend', pts: [[1, 1], [12, 1]], tag: [11.8, 1.0, "积分", 1] },
  ],
  });
const xy = c => `(${f(c[0])}, ${f(c[1])})`;

export const PAGES = [
  {
    kicker: "第5章", title: "动量", sub: "停下来有多难",
    body: `<p class="lede"><b>动量</b> 测量移动物体停止的难度：质量乘以速度，kg·m/s.</p> 中的向量
      <div class="eq"><i>p</i> = <i>mv</i></div>
      <p>A 轻、快的球和重、慢的球车可以承载相同的动量：</p>
      <table class="data">
        <tr><th></th><th>mass</th><th>velocit y</th><th>动量</th><th>KE</th></tr>
        <tr><td>ball</td><td>${f(M.BALL.m, 1)} kg</td><td>${f(M.BALL.v, 1)} m/s</td><td>${f(M.p(M.BALL.m, M.BALL.v), 1)} kg·m/s</td><td>${f(M.ke(M.BALL.m, M.BALL.v), 1)} J</td></tr>
        <tr><td>cart</td><td>${f(M.CART.m, 1)} kg</td><td>${f(M.CART.v, 1)} m/s</td><td>${f(M.p(M.CART.m, M.CART.v), 1)} kg·m/s</td><td>${f(M.ke(M.CART.m, M.CART.v), 1)} J</td></tr>
      </table>
      但<p>的动能不一样：<i>K</i> = <i>p</i>²/2<i>m</i>，因此较轻的携带更多。动量变化为 Δ<i>p</i> = <i>m</i>Δ<i>v</i>.</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 4, xlabel: 'velocity (m/s)', ylabel: 'momentum (kg·m/s)', label: 'Momentum against velocity for 0.5 kg and 2 kg',
        series: [{ pts: [[0, 0], [2, 4]], tag: [1.75, 3.0, '2.0 kg', 1] }, { pts: [[0, 0], [5, 2.5]], tag: [4.1, 2.05, '0.5 kg'] }, { cls: 'trend', pts: [[0, 2], [5, 2]] }],
        marks: [[M.CART.v, 2, 'cart'], [M.BALL.v, 2, 'ball']] })}</div>
      <p class="hintline">动量箭头：${cm(P_SCALE)}每kg·m/s。单击添加速度。</p>`,
    cam: { target: [STATIONS.mom + 0.3, 0.4, 0], az: -14, el: 16, dist: 16 }, lit: 'mom', scene: 'mom', look: {},
    fig: "相同的 p，不同的 m 和 v",
  },
  {
    kicker: '5.1', title: "冲量", sub: "一段时间内的力量",
    body: `<p class="lede">推动一个物体一段时间，它的动量就会改变。推的时间就是 <b>冲量</b>.</p>
      <div class="eq"><i>J</i> = <i>F</i>Δ<i>t</i> = Δ<i>p</i></div>
      <p>的 ${f(Wl.m, 1)} kg 球到达 +${f(Wl.v, 1)} m/s 并离开 -${f(Wl.v, 1)} m/s: Δ<i>p</i> = −${f(Wl.J, 1)} kg·m/s，其动量的两倍，因为它必须停止 <i>and</i> 回来。</p>
      <p>墙的推力升起又倒下 ${f(Wl.tau, 2)} s，峰值为 ${f(Wl.Fpk, 0)} N.The <b>力-时间图下方的面积</b> 是冲量， ${f(Wl.J, 1)} N·s：与稳定相同 ${f(Wl.Favg, 0)} N 为 ${f(Wl.tau, 2)} s。它指向力的方向，远离墙壁。</p>
      <div class="charts">${chart({ x0: 0.15, x1: 0.35, y0: 0, y1: 50, xlabel: 'time (s)', ylabel: 'wall’s push (N)', cursors: ['wall'], label: 'Force on the ball against time; the shaded area is the impulse',
        series: [{ fill: true, pts: samples(0.15, 0.35, 80, t => -M.wall(t).F), tag: [0.287, 30, `area = ${f(Wl.J, 1)} N·s`] }] })}</div>
      <p>AP 物理 C：对于变化的力，冲量是积分 <i>J</i> = ∫<i>F</i> d<i>t</i>。对于这个脉冲：</p>
      <div class="eq">∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = 2<i>F</i><sub>pk</sub>τ/π = ${f(Wl.J, 1)} N·s</div>
      <p class="hintline">${M.SLOW_HIT}× 速度。力 ${cm(F_WALL)} 每牛顿。单击查看 Δp。</p>`,
    cam: { target: [STATIONS.wall - 0.55, 0.6, 0], az: -14, el: 12, dist: 7.2 }, lit: 'wall', scene: 'wall', look: {},
    fig: "墙的推力使球逆转",
  },
  {
    kicker: '5.2', title: "力较小", sub: "相同的 Δp，更长的时间",
    body: `<p class="lede"> 两个鸡蛋从 ${f(Eg.h * 100, 0)} 厘米处落下，落在 ${f(Eg.v0, 1)} m/s 处。每个人都必须失去 ${f(Eg.J, 2)} kg·m/s，因此每个人都需要相同的脉冲。</p>
      <p>枕头让位，带${f(Eg.tauSoft, 2)}；地板需要${f(Eg.tauHard, 2)} s。 <i>F</i>Δ<i>t</i>是固定的，所以减少六倍的时间意味着六倍的力：</p>
      <table class="data">
        <tr><th></th><th>停止时间</th><th>平均净重力</th><th>峰值</th></tr>
        <tr><td>枕头</td><td>${f(Eg.tauSoft, 2)} s</td><td>${f(Eg.J / Eg.tauSoft)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauSoft))} N</td></tr>
        <tr><td>地板</td><td>${f(Eg.tauHard, 2)} s</td><td>${f(Eg.J / Eg.tauHard)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauHard))} N</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 0.2, y0: 0, y1: 8, xlabel: 'time after landing (s)', ylabel: 'net force (N)', cursors: ['eggS', 'eggH'], label: 'Two force pulses with the same area',
        series: [{ fill: true, pts: samples(0, Eg.tauSoft, 60, t => M.pulse(t, Eg.J, Eg.tauSoft, Eg.m).F).concat([[0.2, 0]]), tag: [0.075, 1.4, 'pillow'] },
                 { fill: true, pts: samples(0, Eg.tauHard, 30, t => M.pulse(t, Eg.J, Eg.tauHard, Eg.m).F).concat([[0.2, 0]]), tag: [0.034, 5.2, 'floor: same area'] }] })}</div>
      <p>安全气囊、溃缩区和弯曲膝盖不能改变Δ<i>p</i>；他们拉伸 Δ<i>t</i>.</p>
      <p class="hintline"> 以 ${M.SLOW_HIT}× 速度绘制 ${EGG_ZOOM}× 实际尺寸。红色：合力，${cm(F_EGG * EGG_ZOOM)} 每牛顿。点击比较。</p>`,
    cam: { target: [STATIONS.eggs, 1.05, 0], az: -10, el: 10, dist: 10.5 }, lit: 'eggs', scene: 'eggs', look: {},
    fig: "相同的 Δp，时间延长",
  },
  {
    kicker: '5.3', title: "保护", sub: "粘着的推车",
    body: `<p class="lede">将两车视为一个<b>封闭系统</b>，无净外力。它的总动量不能改变。</p>
      <p>推车彼此给予彼此相等且相反的冲动：无论一个人失去什么，另一个人都会获得。</p>
      <div class="eq"><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = (<i>m</i>₁ + <i>m</i>₂)<i>v</i>′</div>
      <p>${f(S.m1, 1)} kg 在 ${f(S.u1, 1)} m/s 符合 ${f(S.m2, 1)} kg 在 ${f(S.u2, 1)} m/s。它们坚持 <i>v</i>′ = ${f(S.m1 * S.u1 + S.m2 * S.u2, 1)}/${f(S.m1 + S.m2, 1)} = ${f(S.v1, 1)} m/s。 <b>完全无弹性</b>：KE因热量、声音和凹痕而损失。</p>
      ${collTable(S)}
      <div class="charts">${momChart(S, 'stick', [[0.05, 6.1], [0.05, -1.5]])}</div>
      <p class="hintline">蓝色：总计<i>P</i>。圆盘：质心。点击比较。</p>`,
    cam: { target: [STATIONS.stick - 0.4, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'stick', scene: 'stick', look: {},
    fig: 'Δp = 0, ΔKE < 0',
  },
  {
    kicker: '5.4', title: "弹性碰撞", sub: "弹跳的推车",
    body: `<p class="lede">如果小车弹开且没有能量损失，则碰撞为 <b>弹性</b>：动量 <i>and</i> 动能守恒。</p>
      <p>${f(B.m1, 1)} 公斤在 ${f(B.u1, 1)} m/s 达到 ${f(B.m2, 1)} 静止公斤。两个未知数，两个方程：</p>
      <table class="data eqs">
        <tr><td><i>m</i>₁<i>v</i>₁ + <i>m</i>2<i>v</i>2 = <i>m</i>₁<i>v</i>₁′ + <i>m</i>2<i>v</i>2′</td><td>Δ<i>p</i> = 0</td></tr>
        <tr><td>½<i>m</i>₁<i>v</i>₁² + 1/2<i>m</i>2<i>v</i>22 = 1/2<i>m</i>₁<i>v</i>₁′2 + ½<i>m</i>2<i>v</i>2′2</td><td>Δ<i>KE</i> = 0</td></tr>
      </table>
      <p>所以 <i>v</i>₁′ = ${f(B.v1, 1)} m/s 和 <i>v</i>2′ = ${f(B.v2, 1)} m/s。相等且相反的 ${f(B.m2 * B.v2, 1)} N·s 脉冲：质量越小，Δ<i>v</i>.</p>
      ${collTable(B)}
      <div class="charts">${momChart(B, 'bounce', [[0.05, 4.1], [0.05, -1.0]])}</div>`,
    cam: { target: [STATIONS.bounce - 0.5, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'bounce', scene: 'bounce', look: {},
    fig: 'Δp = 0, ΔKE = 0',
  },
  {
    kicker: '5.5', title: "爆炸", sub: "与休息分开",
    body: `<p class="lede">两车并排休息；它们之间的弹簧被释放。总动量为零，因此保持为零。</p>
      <div class="eq">(<i>m</i>₁ + <i>m</i>₂)<i>v</i> = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</div>
      <p> 当 <i>v</i> = 0 时，两个动量相等且方向相反，因此 ${f(X.m1, 1)} 公斤车的移动速度是 ${f(X.m2, 1)} 公斤车的三倍。弹簧的${f(X.Q, 1)} J变成动能：KE <i>increases</i>.</p>
      ${collTable(X)}
      <table class="data">
        <tr><th>碰撞</th><th>Δ<i>p</i></th><th>Δ<i>KE</i></th><th>线索</th></tr>
        <tr><td>inelastic</td><td>0</td><td>&lt; 0</td><td>KE 丢失；大多数如果他们坚持</td></tr>
        <tr><td>elastic</td><td>0</td><td>0</td><td>他们反弹，什么都没有丢失</td></tr>
        <tr><td>爆炸</td><td>0</td><td>&gt; 0</td><td>一起出发，飞翔分开</td></tr>
      </table>
      <p class="hintline">质心保持不变。点击查看之前和之后。</p>`,
    cam: { target: [STATIONS.burst - 0.8, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'burst', scene: 'burst', look: {},
    fig: 'Δp = 0, ΔKE > 0',
  },
  {
    kicker: '5.6', title: "弹道摆", sub: "动量，然后是能量",
    body: `<p class="lede">A ${f(Pd.m, 1)} kg ${f(Pd.u, 0)} m/s 处的粘土块粘在 ${f(Pd.M, 1)} kg 块上的 ${f(Pd.L, 1)} m 绳上，块向上摆动。两步两法：</p>
      <table class="data">
        <tr><th>step</th><th>law</th><th>这里</th></tr>
        <tr><td>命中</td><td>Δ<i>p</i> = 0：<i>mv</i> = (<i>m</i>+<i>M</i>)<i>v</i>′</td><td><i>v</i>′ = ${f(Pd.v)} m/s</td></tr>
        <tr><td>摆动</td><td>Δ<i>E</i> = 0: ½<i>v</i>′² = <i>g</i>Δ<i>y</i></td><td>Δ<i>y</i> = ${f(Pd.dy * 100, 1)} cm</td></tr>
      </table>
      <p> 能量不会在击球过程中保持（${f(M.ke(Pd.m, Pd.u), 1)} J → ${f(M.ke(Pd.m + Pd.M, Pd.v))} J），并且动量不会在挥杆过程中保持（弦和重力是外力）。 Δ<i>y</i> = <i>L</i>(1 − cos θ), θ = ${deg(Pd.theta)}°:</p>
      <div class="eq"><i>v</i> = ((<i>m</i> + <i>M</i>)/<i>m</i>) √(2<i>gL</i>(1 − cos θ))</div>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 2, xlabel: 'time after the hit (s)', ylabel: 'energy (J)', cursors: ['pendK', 'pendU'], label: 'Kinetic and potential energy during the swing',
        series: [{ pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).K), tag: [0.1, 1.15, 'KE'] }, { pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).U), tag: [Pd.T / 4 - 0.12, 1.15, 'Ug'] }, { cls: 'trend', pts: [[0, M.ke(Pd.m + Pd.M, Pd.v)], [2.4, M.ke(Pd.m + Pd.M, Pd.v)]], tag: [2.36, 1.72, 'total', 1] }] })}</div>
      <p class="hintline">点击标记Δy、L和θ，等方式求v′。</p>`,
    cam: { target: [STATIONS.pend + 0.2, 1.25, 0], az: -10, el: 8, dist: 7.4 }, lit: 'pend', scene: 'pend', look: {},
    fig: "击球 Δp = 0，挥杆 ΔE = 0",
  },
  {
    kicker: '5.7', title: "二维", sub: "十字路口发生车祸",
    body: `在${f(C.v1, 0)} m/s向东行驶的<p class="lede">A ${k(C.m1)}公斤汽车与在${f(C.v2, 0)} m/s向北行驶的${k(C.m2)}公斤卡车相撞并锁在一起。每个方向动量分别守恒。</p>
      <table class="data">
        <tr><th>east (<i>x</i>)</th><th>north (<i>y</i>)</th></tr>
        <tr><td><i>m</i>₁<i>v</i>₁ = (<i>m</i>₁+<i>m</i>2)<i>v</i>′<sub>x</sub></td><td><i>m</i>2<i>v</i>2 = (<i>m</i>₁+<i>m</i>2)<i>v</i>′<sub>y</sub></td></tr>
        <tr><td>${k(C.px)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>x</sub></td><td>${k(C.py)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>y</sub></td></tr>
        <tr><td><i>v</i>′<sub>x</sub> = ${f(C.vx)} m/s</td><td><i>v</i>′<sub>y</sub> = ${f(C.vy)} m/s</td></tr>
      </table>
      <p>将动量尖端添加到尾部： <i>P</i> = √(<i>p</i><sub>x</sub>² + <i>p</i><sub>y</sub>²) = ${k(C.P)} kg·m/s，所以 <i>v</i>′ = <i>P</i>/(<i>m</i>₁+<i>m</i>2) = ${f(C.v)} m/s，${C.angle.toFixed(1)}°在东边。切勿添加速度。</p>
      <div class="charts">${vecSketch}</div>
      <p class="hintline">此处箭头：每 1000 kg·m/s 为 ${cm(CRASH_SCALE)}。单击将它们的尖端添加到尾部。</p>`,
    cam: { target: [STATIONS.crash + 0.5, 0, -1.5], az: -10, el: 50, dist: 58 }, lit: 'crash', scene: 'crash', look: {},
    fig: "p_汽车 + p_卡车 = P",
  },
  {
    kicker: '5.8', title: "质心", sub: "它继续飞翔，好像什么也没发生过一样",
    body: `<p class="lede"><b> 质量中心</b> 是系统的质量加权平均位置。内部推动无法改变它的移动方式：在购物车页面上，它会直接滑过每次碰撞。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i>₁<i>x</i>₁ + <i>m</i>₂<i>x</i>₂) / (<i>m</i>₁ + <i>m</i>₂)</div>
      <p>A ${f(Sh.m, 1)} kg 炮弹向 ${f(Sh.v0, 0)} m/s、${Sh.deg}° 向上发射，并在顶部炸成相等的两半。后半部分处于静止状态并下降至 <i>R</i>/2。前半部分占据所有动力，<i>v</i>2′ = ((<i>m</i>₁+<i>m</i>2)/<i>m</i>2)<i>v</i><sub>x</sub> = ${f(Sh.v2, 1)} m/s，并降落在 3<i>R</i>/2。质心落在 <i>R</i> = ${f(Sh.R)} m，就好像它从未破裂一样。</p>
      <div class="charts">${shellChart}</div>
      <p>提示：两件总是获得相等且相反的脉冲，因此越轻的件获得越大的Δ<i>v</i>.</p>`,
    cam: { target: [STATIONS.shell + 0.2, 2.4, 0], az: -6, el: 8, dist: 44 }, lit: 'shell', scene: 'shell', look: {},
    fig: "质心落在 R",
  },
  {
    kicker: "5.9 · AP 物理 C", title: "固体", sub: "积分质心",
    body: `<p class="lede">将实心棒切成碎片 d<i>m</i> = λ d<i>x</i>（λ：每米质量），按其所在位置加权，然后积分。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>x</i> d<i>m</i></div>
      <table class="data">
        <tr><th>${f(Rd.L, 1)} 米杆</th><th><i>M</i> = ∫λ d<i>x</i></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>λ = ${f(Rd.lamU, 1)} kg/m</td><td>λ<i>L</i> = ${f(Rd.MU, 1)} kg</td><td><i>L</i>/2 = ${f(Rd.xU)} m</td></tr>
        <tr><td>λ = λ₀<i>x</i>/<i>L</i>, λ₀ = ${f(Rd.lam0, 1)}</td><td>λ₀<i>L</i>/2 = ${f(Rd.MN, 1)} kg</td><td>2<i>L</i>/3 = ${f(Rd.xN)} m</td></tr>
      </table>
      <div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div>
      <p>除以<i>M</i> = λ₀<i>L</i>/2：2<i>L</i>/3，过中间。每根杆均位于其 <i>x</i><sub>cm</sub> 处的刀刃上，其中净力矩 ∫(<i>x</i> − <i>x</i><sub>cm</sub>)<i>g</i> d<i>m</i> = 0.</p>
      <div class="charts">${rodChart}</div>
      <p class="hintline">较暗 = 较密。单击切片（${cm(W_SCALE)} 每 N）。</p>`,
    cam: { target: [STATIONS.rods + 0.1, 0.4, 0], az: -14, el: 22, dist: 9.4 }, lit: 'rods', scene: 'rods', look: {},
    fig: "平衡于 x_cm",
  },
  {
    kicker: "5.10 · AP 物理 C", title: "盘子", sub: "一条一条地",
    body: `<p class="lede">将板材 (σ = ${f(M.SIGMA, 1)} kg/m²) 切成平行于边缘的条状。从边缘开始的条带 <i>u</i>，<i>w</i>(<i>u</i>) 宽，有 d<i>m</i> = σ<i>w</i> d<i>u</i>.</p>
      <div class="eq"><i>u</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>u</i> σ<i>w</i>(<i>u</i>) d<i>u</i></div>
      <table class="data">
        <tr><th>板</th><th><i>w</i>(<i>u</i>)</th><th><i>u</i><sub>cm</sub></th></tr>
        <tr><td>三角形，<i>h</i> = ${f(Tr.h, 1)} m</td><td><i>b</i>(1 − <i>u</i>/<i>h</i>)</td><td><i>h</i>/3 = ${f(Tr.ucm)} m</td></tr>
        <tr><td>半圆，<i>R</i> = ${f(Se.R, 1)} m</td><td>2√(<i>R</i>² − <i>u</i>²)</td><td>4<i>R</i>/3π = ${f(Se.ucm)} m</td></tr>
      </table>
      <div class="eq">∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> = 2<i>R</i>³/3</div>
      <p>÷面积π<i>R</i>²/2 = 4<i>R</i>/3π。三角形是最后一页的杆横向转动：从顶点开始，它的条带像 λ₀<i>x</i>/<i>L</i> 一样变宽。剥离金额接近：</p>
      <div class="charts">${stripChart}</div>
      <p class="hintline">销位于质心。单击以分割条带（每 N ${cm(W_PLATE)}）。</p>`,
    cam: { target: [STATIONS.plates + 0.05, 0.3, 0], az: -10, el: 22, dist: 10.6 }, lit: 'plates', scene: 'plates', look: {},
    fig: 'u_cm = (1/M)∫u dm',
  },
  {
    kicker: "5.11 · AP 物理 C", title: "零件和孔", sub: "添加碎片，减去间隙",
    body: `<p class="lede">对于由简单部件组成的物体，将每个部件的质量放在其自身的质心处并相加。孔是一块负质量。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>)/(<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th>L，从其内角</th><th>mass</th><th>(<i>x</i>，<i>y</i>)， m</th></tr>
        <tr><td>arm A，${f(Ll.A.a1 - Ll.A.a0, 1)} × ${f(Ll.A.b1 - Ll.A.b0, 1)} m</td><td>${f(Ll.pA.m)}公斤</td><td>${xy(Ll.pA.c)}</td></tr>
        <tr><td>arm B、${f(Ll.B.a1 - Ll.B.a0, 1)} × ${f(Ll.B.b1 - Ll.B.b0, 1)} m</td><td>${f(Ll.pB.m)}公斤</td><td>${xy(Ll.pB.c)}</td></tr>
        <tr><td>L</td><td>${f(Ll.M)} kg</td><td>${xy(Ll.cm)}</td></tr>
      </table>
      <p>该点位于间隙中，而不是在L上。就像环或回旋镖一样，它无法在销钉上保持平衡，而是通过旋转的绳子悬挂起来，直到其质心位于结的正下方。</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>full</sub><i>x</i><sub>full</sub> − <i>m</i><sub>plug</sub><i>x</i><sub>plug</sub>)/<i>M</i></div>
      <p>A ${f(Ho.s, 1)} m 平方 (${f(Ho.mFull)} kg) 在 ${xy(Ho.c)} 处失去半径为 ${f(Ho.r, 1)} m (${f(Ho.mPlug)} kg) 的塞子： <i>x</i><sub>cm</sub> = <i>y</i><sub>cm</sub> = −${f(Ho.mPlug)}×${f(Ho.c[0])}/${f(Ho.M)} = ${f(Ho.cm[0], 3)}米，${f(Math.hypot(...Ho.cm) * 100, 1)} 距中心厘米，距孔。</p>
      <p class="hintline">点击将L拉开并将插头拔出。</p>`,
    cam: { target: [STATIONS.parts + 0.05, 1.22, 0], az: -12, el: 14, dist: 10.2 }, lit: 'parts', scene: 'parts', look: {},
    fig: "材质外",
  },
];

// ---------- click a scene: what it breaks into ----------
const collFacts = c => s => { const r = M.track(c, s[c === S ? 'stick' : c === B ? 'bounce' : 'burst'].t); return [
  ['p₁', `${f(r.p1)} kg·m/s`], ['p₂', `${f(r.p2)} kg·m/s`], ['total P', `${f(r.P)} kg·m/s`], ["动能", `${f(r.K)} J`], ["质心速度", `${f(r.P / (c.m1 + c.m2))} m/s`]]; };
export const PLATES = {
  mom: { text: `灰色箭头是速度：球的长度是原来的四倍。黑色动量箭头的长度相同，因为小车的质量是其四倍。动量是质量和速度的总和。`,
    facts: () => [['ball: 0.5 kg × 4.0 m/s', `${f(M.p(M.BALL.m, M.BALL.v))} kg·m/s`], ['cart: 2.0 kg × 1.0 m/s', `${f(M.p(M.CART.m, M.CART.v))} kg·m/s`], ["球 KE = p²/2m", `${f(M.ke(M.BALL.m, M.BALL.v))} J`], ["购物车 KE = p²/2m", `${f(M.ke(M.CART.m, M.CART.v))} J`]] },
  wall: { text: `之前（右）和之后（左）的动量。变化 Δp = p<sub>a​​fter</sub> − p<sub>before</sub> 的长度是其中任何一个的两倍，并且指向远离墙壁的方向，与墙壁的推力相同。这种改变就是冲量。`,
    facts: s => { const w = M.wall(s.wall.t); return [['p before', `+${f(Wl.m * Wl.v)} kg·m/s`], ['p after', `−${f(Wl.m * Wl.v)} kg·m/s`], ['Δp = J', `−${f(Wl.J)} N·s`], ["接触时间", `${f(Wl.tau)} s`], ["现在强制", `${f(Math.abs(w.F), 1)} N`]]; } },
  eggs: { text: `灰色箭头是两个脉冲：相同，因为两个鸡蛋失去相同的动量。不同之处在于这需要多长时间，以及推动的力度有多大。`,
    facts: () => [["冲量，每", `${f(Eg.J, 3)} N·s`], ['pillow: J / Δt', `${f(Eg.J / Eg.tauSoft)} N for ${f(Eg.tauSoft)} s`], ['floor: J / Δt', `${f(Eg.J / Eg.tauHard)} N for ${f(Eg.tauHard)} s`], ["力比", `${f(Eg.tauSoft / Eg.tauHard, 1)}×`]] },
  stick: { text: `上方，前后的气势，首尾相接。每行加起来都是相同的蓝色总数。购物车 2 的动量甚至改变了符号；总数根本没有改变。`, facts: collFacts(S) },
  bounce: { text: `之前：所有动量都在购物车 1 中。之后：购物车 1 为负，购物车 2 大于总数。从头到尾，两行加起来仍然是同一个蓝色箭头。`, facts: collFacts(B) },
  burst: { text: `之前：什么都没有。之后：两个相等且方向相反的箭头相加等于零。总动量始终为零，因此质心永远不会移动。`, facts: collFacts(X) },
  pend: { text: `虚线标记了秋千的底部和顶部，相距 Δy。根据三角形，cos θ = (L − Δy)/L，因此 Δy = L(1 − cos θ)。击中后找到 v′ 的其他方法：木块在粗糙的地板上滑动停止，v′ = √(2μ<sub>k</sub>gΔx);它挤压弹簧，v′ = √(kΔx²/(m+M))；它飞离桌子，v′ = Δx/√(2Δy/g)。`,
    facts: s => { const q = M.pend(s.pend.t); return [["击中后 v′", `${f(Pd.v)} m/s`], ['Δy = v′²/2g', `${f(Pd.dy * 100, 1)} cm`], ['θ max', `${deg(Pd.theta)}°`], ["现在角度", `${deg(q.th)}°`], ["现在KE + Ug", `${f(q.K + q.U)} J`], ["10克子弹变成2.0公斤，相同的θ", `${f(BULLET, 0)} m/s`]]; } },
  crash: { text: `汽车的动量指向东，卡车的动量指向北。将头尾相连，形成直角三角形；蓝色斜边是沉船在东边以北 ${C.angle.toFixed(1)}° 带走的总量。`,
    facts: () => [['p car (east)', `${k(C.px)} kg·m/s`], ['p truck (north)', `${k(C.py)} kg·m/s`], ['total P', `${k(C.P)} kg·m/s`], ['v′ = P/(m₁+m₂)', `${f(C.v)} m/s`], ['direction', `${C.angle.toFixed(1)}° 东偏北`], ['KE', `${k(C.K0 / 1000)} kJ → ${k(C.K1 / 1000)} kJ`]] },
  shell: { text: `重力是一种外力，它会弯曲每个人的路径，因此垂直动量不断变化。爆发是内部的：在那一刻，总动量（蓝色）前后相同，现在全部都在前半部分。`,
    facts: s => { const q = M.shell(s.shell.t); return [["质心 x", `${f(q.cm[0])} m`], ["爆发前：m·vx", `${f(Sh.m * Sh.vx)} kg·m/s`], ['after: (m/2)·v₂′', `${f(Sh.m / 2 * Sh.v2)} kg·m/s`], ["降落在", `${f(Sh.R / 2)} m and ${f(1.5 * Sh.R)} m`]]; } },

  rods: { text: `每个切片都在其自身的质心处绘制，其重力为 d<i>m</i>·<i>g</i>（${cm(W_SCALE)} 每牛顿）。在均匀的杆上，十个重力相等；另一方面，它们与 <i>x</i> 一起生长，因此右侧的切片较少且较重，而左侧的切片较多且较轻。刀口周围两侧的力矩相等。`,
    facts: () => { const sl = M.rodSlices('N'), g = M.G, L = sl.filter(q => q.x < Rd.xN).reduce((a, q) => a + (Rd.xN - q.x) * q.dm * g, 0), Rr = sl.filter(q => q.x >= Rd.xN).reduce((a, q) => a + (q.x - Rd.xN) * q.dm * g, 0);
      return [["均匀：每片", `${f(M.rodSlices('U')[0].dm, 3)} kg`], ["λ₀x/L：第一个和最后一个切片", `${f(sl[0].dm, 3)} kg, ${f(sl.at(-1).dm, 3)} kg`], ["x_cm，均匀/λ₀x/L", `${f(Rd.xU)} m / ${f(Rd.xN)} m`], ["左片力矩", `${f(L, 3)} N·m`], ["右片力矩", `${f(Rr, 3)} N·m`]]; } },
  plates: { text: `每条八条，每条都以其自身的质心和重力（${cm(W_PLATE)} 每牛顿）绘制。靠近底部或直径的宽条最重，这就是为什么平衡点距离边缘比距离远端更近的原因。`,
    facts: () => { const t = M.plateStrips(Tr), c = M.plateStrips(Se); return [['triangle: M = σbh/2', `${f(Tr.M)} kg`], ["三角形：最重/最轻的条带", `${f(t[0].dm, 3)} / ${f(t.at(-1).dm, 3)} kg`], ['semicircle: M = σπR²/2', `${f(Se.M)} kg`], ["半圆：最重/最轻的条带", `${f(c[0].dm, 3)} / ${f(c.at(-1).dm, 3)} kg`], ["8个矩形：三角形、半圆形", `${f(M.stripSum(M.triW, Tr.h, 8), 3)}, ${f(M.stripSum(M.semiW, Se.R, 8), 3)} m`], ["积分：h/3, 4R/3π", `${f(Tr.ucm, 3)}, ${f(Se.ucm, 3)} m`]]; } },
  parts: { text: `拉开后，每个臂都是位于其中心（小圆盘）的点质量。 L 的质心位于它们之间的线上，更靠近较重的手臂，并且在它们分开时保持原状。拿出来，塞子是负质量：正方形的中心、塞子的中心和板的质心位于一条直线上，平衡点在远离孔的一侧。`,
    facts: () => [['arm A', `${f(Ll.pA.m)} kg at ${xy(Ll.pA.c)} m`], ['arm B', `${f(Ll.pB.m)} kg at ${xy(Ll.pB.c)} m`], ['the L', `${f(Ll.M)} kg at ${xy(Ll.cm)} m`], ["全方形 - 插头", `${f(Ho.mFull)} − ${f(Ho.mPlug)} = ${f(Ho.M)} kg`], ["孔板 x_cm, y_cm", `${f(Ho.cm[0], 3)}, ${f(Ho.cm[1], 3)} m`]] },
};
