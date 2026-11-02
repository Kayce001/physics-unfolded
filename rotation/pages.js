// Chapter 7, page by page (after the AP Physics 1 organizer, Unit 8, with the AP Physics C additions). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_LIGHT, F_HEAVY, F_SHAPES, RACE_V, F_PAX, F_WRENCH, F_SLIP, P_SCALE, LP_SCALE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => (r * 180 / Math.PI).toFixed(1);
const cm = s => `${(s * 100).toFixed(s * 100 < 1 ? 1 : 0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
const sx = (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false }) {
  const X = x => sx(x, x0, x1), Y = y => sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${X(s.tag[0]) + 4}" y="${Y(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${X(x)}" cy="${Y(y)}" r="3.5"/><text class="ax" x="${X(x) + dx}" y="${Y(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${Y(0)}" y2="${Y(0)}"/>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${Y(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${Y(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
export const CH = { sx, sy };
const curvePts = (fn, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// race: where the energy goes, a stacked bar per racer
function energyBars() {
  const bw = W - 150 - P.r, rowH = 30, top = 22, mgh = M.RACE.m * M.G * M.RACE.h;
  const rows = M.RACE.list.map((o, i) => {
    const kt = 1 / (1 + o.f), y = top + i * rowH;
    return `<text class="ax" x="${140}" y="${y + 14}" text-anchor="end">${o.name}</text>
      <rect class="bar" x="150" y="${y}" width="${(bw * kt).toFixed(1)}" height="18"/>
      <rect x="${(150 + bw * kt).toFixed(1)}" y="${y}" width="${(bw * (1 - kt)).toFixed(1)}" height="18" fill="#8a8a8f"/>
      <text class="ax" x="${155}" y="${y + 13}">${Math.round(kt * 100)}%</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${top + 4 * rowH + 22}" role="img" aria-label="Share of kinetic energy that is translational and rotational for each racer">
    <text class="lab" x="150" y="14">mgh = ${f(mgh)} 底部 J →</text>${rows}
    <rect class="bar" x="150" y="${top + 4 * rowH + 4}" width="12" height="10"/><text class="ax" x="168" y="${top + 4 * rowH + 13}">½mv²（沿行）</text>
    <rect x="290" y="${top + 4 * rowH + 4}" width="12" height="10" fill="#8a8a8f"/><text class="ax" x="308" y="${top + 4 * rowH + 13}">½Iω²（旋转）</text>
  </svg>`;
}

const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const R0 = M.ROD, PX = M.PAX.list, WR = M.WRENCH, B = M.BOWL, IM = M.IMP.list, HT = M.HIT;
const D = M.DOOR.cases, [ring, discS, sphere] = M.SHAPES.list, sk0 = M.skater(0.2), sk1 = M.skater(4);

export const PAGES = [
  {
    kicker: "第7章", title: "转动", sub: "转动，用运动的语言",
    body: `<p class="lede">转动轮上的每个点都经过相同的转动 <b>角度</b> θ（以弧度为单位）同时。因此，我们用角度来描述整个车轮： ω = Δθ/Δt（以 rad/s 为单位），α = Δω/Δt（以 rad/s² 为单位）。</p>
      <p>逆时针方向为正。该轮子的速度为 ${f(M.WHEEL.alpha, 1)} rad/s²，然后以相同的速率制动。加速时， ω 和 α 有 <b>相同的标志</b>;放慢速度， <b>对面</b> 迹象。运动学方程由 x → θ、v → ω、a → α 延续：</p>
      <table class="data eqs">
        <tr><td>ω = ω<sub>0</sub> + αt</td><td>no Δθ</td></tr>
        <tr><td>Δθ = ω<sub>0</sub>t + ½αt²</td><td>no ω</td></tr>
        <tr><td>ω² = ω<sub>0</sub>² + 2αΔθ</td><td>no t</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 4.8, y0: 0, y1: 4, xlabel: 'time (s)', ylabel: 'ω (rad/s)', cursors: ['wheelW'], label: 'Angular velocity against time: up, then down',
        series: [{ pts: curvePts(t => M.wheel(t).w, 0, M.WHEEL.run, 48), tag: [0.5, 1.6, 'α > 0'] }, { cls: 'trend', pts: [], tag: [3.5, 2.4, 'α < 0'] }] })}</div>
      <p class="hintline">单击滚轮可查看其转动的角度。</p>`,
    cam: { target: [STATIONS.wheel, 1.15, 0], az: -14, el: 6, dist: 7.2 }, lit: 'wheel', scene: 'wheel', look: {},
    fig: "车轮旋转，然后制动",
  },
  {
    kicker: '7.1', title: "两名骑手", sub: 'v = rω',
    body: `<p class="lede">在旋转木马上，两个骑手共享一个 ω。边缘的那个同时绕了一个更大的圈，所以她移动得更快：半径的两倍，速度的两倍。</p>
      <table class="data">
        <tr><th></th><th>线性</th><th>有角的</th><th>链接</th></tr>
        <tr><td>位移</td><td>Δx</td><td>Δθ</td><td>s = rΔθ</td></tr>
        <tr><td>速度</td><td>v</td><td>ω</td><td>v = rω</td></tr>
        <tr><td>加速度</td><td>a<sub>t</sub></td><td>α</td><td>a<sub>t</sub> = rα</td></tr>
      </table>
      <p>每个骑手还有一个向心加速度a<sub>c</sub> = rω² 向中间，从方向的变化。</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 2.5, xlabel: 'time (s)', ylabel: 'speed v (m/s)', cursors: ['disc1', 'disc2'], label: 'Speed of the two riders against time',
        series: [{ pts: curvePts(t => M.DISC.r2 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.3, 1.75, `r = ${M.DISC.r2} m`] }, { pts: curvePts(t => M.DISC.r1 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.75, 0.12, `r = ${M.DISC.r1} m`] }] })}</div>
      <p class="hintline">单击可分割每个骑手的加速度。五： ${cm(V_SCALE)} 每米/秒；一： ${cm(A_SCALE)} 每米/秒²。</p>`,
    cam: { target: [STATIONS.disc, 0.7, 0], az: -10, el: 42, dist: 10.5 }, lit: 'disc', scene: 'disc', look: {},
    fig: "两个骑手，一个ω",
  },
  {
    kicker: '7.2', title: "力矩", sub: "是什么让事情发生转变",
    body: `<p class="lede">仅当推力远离铰链而不是直接作用于铰链时，推力才会使门摆动。其转动效果是 <b>力矩</b>, in N·m:</p>
      <div class="eq">τ = rF sin φ = F × lever arm</div>
      <p>r从铰链延伸到推杆，φ是r和F之间的角度。只有F sin φ（与门成直角的部分）才能转动门。</p>
      <table class="data">
        <tr><th>一样的 ${f(M.DOOR.F, 0)} N推</th><th>τ (N·m)</th></tr>
        ${D.map(c => `<tr><td>${c.name}</td><td>${f(c.tau)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: 0, y1: 10, xlabel: 'angle φ between r and F (°)', ylabel: 'τ (N·m)', label: 'Torque against push angle at two distances',
        series: [{ pts: curvePts(p => M.torque(0.85, M.DOOR.F, p), 0, 180), tag: [122, 7.6, 'r = 0.85 m'] }, { pts: curvePts(p => M.torque(0.425, M.DOOR.F, p), 0, 180), tag: [118, 1.4, 'r = 0.425 m'] }],
        marks: [[90, D[0].tau, '', 0, 0], [90, D[1].tau, '', 0, 0], [30, D[2].tau, '30°', -26, -6]] })}</div>
      <p class="hintline">单击门以绘制每个杠杆臂。箭头 ${cm(F_LIGHT)} 每牛顿。</p>`,
    cam: { target: [STATIONS.doors + 0.05, 0.6, -0.4], az: -14, el: 48, dist: 14.5 }, lit: 'doors', scene: 'doors', look: {},
    fig: "相同的推力，三个力矩",
  },
  {
    kicker: '7.3', title: "平衡", sub: "不推、不转",
    body: `<p class="lede">A木板桥，一个${M.PLANK.m}公斤的板条箱缓缓滑过。为了保持不变，Σ<i>F</i> = 0 <i>and</i> Στ = 0.</p>
      <p>取关于未知数最多的点的力矩：支撑A，其中<i>F</i><sub>A</sub>没有杠杆臂。逆时针+、顺时针-：</p>
      <div class="eq">L·F<sub>B</sub> − (L/2)·Mg − x·mg = 0</div>
      <p>则 Σ<i>F</i> = 0 得到 <i>F</i><sub>A</sub> = (M + m)g − <i>F</i><sub>B</sub>。板条箱距离支撑物越近，支撑物支撑得越多。</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 400, xlabel: 'crate position x from A (m)', ylabel: 'support force (N)', cursors: ['plankA', 'plankB'], label: 'Support forces against crate position',
        series: [{ pts: curvePts(x => M.plank(x).FA, 0, 4, 4), tag: [3.55, M.plank(3.55).FA + 4, 'F<tspan baseline-shift="sub" font-size="8">A</tspan>'] }, { pts: curvePts(x => M.plank(x).FB, 0, 4, 4), tag: [3.55, M.plank(3.55).FB - 60, 'F<tspan baseline-shift="sub" font-size="8">B</tspan>'] }] })}</div>
      <p class="hintline">单击木板以获得关于 A 的力矩。箭头 ${cm(F_HEAVY)} 每牛顿。</p>`,
    cam: { target: [STATIONS.plank, 1.3, 0], az: -14, el: 10, dist: 13 }, lit: 'plank', scene: 'plank', look: {},
    fig: `一块 ${M.PLANK.M} 公斤木板，一个 ${M.PLANK.m} 公斤板条箱`,
  },
  {
    kicker: '7.4', title: "梯子", sub: "它能倾斜多低？",
    body: `<p class="lede">A ${M.LADDER.m} 公斤梯子在粗糙的地面上靠在光滑的墙壁上，只能直线推出。</p>
      <p>力：<i>F</i><sub>N</sub> = mg，<i>f</i><sub>s</sub> = <i>F</i><sub>w</sub>。关于脚 O 的力矩，其中两个力消失：</p>
      <div class="eq">(L sin θ)·F<sub>w</sub> = (½L cos θ)·mg</div>
      <p>梯子越低，脚部需要的摩擦力就越大。摩擦力最多为 μ<sub>s</sub>mg，因此它滑落至 tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>)：${dg(M.LADDER.thMin)}° μ<sub>s</sub> = ${f(M.LADDER.muS)}，无论其质量或长度。</p>
      <div class="charts">${chart({ x0: 40, x1: 85, y0: 0, y1: 120, xlabel: 'ladder angle θ (°)', ylabel: 'friction needed (N)', cursors: ['ladder'], label: 'Friction needed against ladder angle',
        series: [{ pts: curvePts(d => Math.min(M.ladder(d * Math.PI / 180).f, 120), 41.2, 85) }, { cls: 'trend', pts: [[40, M.LADDER.muS * M.LADDER.W], [85, M.LADDER.muS * M.LADDER.W]], tag: [64, M.LADDER.muS * M.LADDER.W + 4, 'most friction can give'] }],
        marks: [[dg(M.LADDER.thMin), M.LADDER.muS * M.LADDER.W, `θ<tspan baseline-shift="sub" font-size="8">min</tspan> = ${dg(M.LADDER.thMin)}°`, -62, 22]] })}</div>
      <p class="hintline">单击关于 O 的杠杆臂的梯子。箭头 ${cm(F_HEAVY)} 每牛顿。</p>`,
    cam: { target: [STATIONS.ladder + 0.15, 1.45, 0], az: -18, el: 8, dist: 11.5 }, lit: 'ladder', scene: 'ladder', look: {},
    fig: "粗糙地板上的梯子",
  },
  {
    kicker: '7.5', title: "转动惯量", sub: 'Στ = Iα',
    body: `<p class="lede">牛顿第二转动定律是 Στ = Iα。 <b> 惯性矩</b> I = Σmr² 起到质量的作用，远离轴的质量最重要。</p>
      <p>E每个形状的 ${f(M.SHAPES.M, 1)} kg、半径 ${f(M.SHAPES.R, 1)} m 和相同的 ${f(M.SHAPES.F, 1)} N 围绕其边缘的绳子拉力： τ = ${f(M.SHAPES.tau)} N·m.</p>
      <table class="data">
        <tr><th></th><th>I = fMR²</th><th>α = τ/I</th></tr>
        ${M.SHAPES.list.map(s => `<tr><td>${s.key}</td><td>${s.frac === '1' ? '' : s.frac}MR²</td><td>${f(s.alpha)} rad/s²</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 8, xlabel: 'time (s)', ylabel: 'ω (rad/s)', cursors: ['sh0', 'sh1', 'sh2'], label: 'Angular velocity of ring, disc and sphere',
        series: M.SHAPES.list.map(s => ({ pts: [[0, 0], [2.4, s.alpha * 2.4]], tag: [1.75, s.alpha * 1.75 + (s.key === 'sphere' ? 0.5 : s.key === 'disc' ? -0.3 : 0), s.key] })) })}</div>
      <p class="hintline">单击形状将圆盘切割成环形。箭头 ${cm(F_SHAPES)} 每牛顿。</p>`,
    cam: { target: [STATIONS.inertia, 1.15, 0], az: -10, el: 22, dist: 10.2 }, lit: 'inertia', scene: 'inertia', look: {},
    fig: "相同的力矩，三种形状",
  },
  {
    kicker: "7.6 · AP 物理 C", title: "加起来我", sub: 'I = ∫ r² dm',
    body: `<p class="lede"> 将物体切成小块 dm 并为每个小块添加 r² dm：I = ∫ r² dm。答案取决于轴在哪里。</p>
      <p>A 均匀杆 (${f(R0.M, 1)} kg, ${f(R0.L, 1)} m) 的 λ = M/L，因此切片 dx 的 dm = λ dx。圆盘是薄环，每个环 dm = σ·2πr dr (σ = M/πR²):</p>
      <table class="data">
        <tr><td>杆，中心轴</td><td>∫<sub>−L/2</sub><sup>L/2</sup> λx² dx</td><td><sup>1</sup>⁄<sub>12</sub>ML²</td></tr>
        <tr><td>杆，末端轴</td><td>∫<sub>0</sub><sup>L</sup> λx² dx</td><td>⅓ML²</td></tr>
        <tr><td>圆盘，轴在中心</td><td>∫<sub>0</sub><sup>R</sup> r²·σ2πr dr</td><td>½MR²</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 1.8, xlabel: 'distance r from the axis (m)', ylabel: 'dI/dr = λr² (kg·m)', cursors: ['integE', 'integC'], label: 'Contribution to I per metre of rod against distance from the axis',
        series: [{ cls: 'bar', pts: [[0, 0], ...curvePts(r => R0.lam * r * r, 0, 1.2, 40), [1.2, 0]] }, { pts: curvePts(r => R0.lam * r * r, 0, 1.2, 40), tag: [0.25, 1.0, `end: area 0→L = ${f(R0.Iend, 2)}`] }, { cls: 'trend', pts: [[0.6, 0], [0.6, 1.8]], tag: [0.62, 0.15, `centre: 2 × (0→L/2) = ${f(R0.Icm, 2)}`] }] })}</div>
      <p class="hintline">单击将切片和环分开，并将总和与积分进行比较。</p>`,
    cam: { target: [STATIONS.integ - 0.3, 1.0, 0], az: -10, el: 22, dist: 14.5 }, lit: 'integ', scene: 'integ', look: {},
    fig: "切片和环",
  },
  {
    kicker: "7.7 · AP 物理 C", title: "平行轴", sub: "I = I<sub>cm</sub> + Md²",
    body: `<p class="lede">将轴从质心移动距离 d，I 增长 Md²：</p>
      <div class="eq">I = I<sub>cm</sub> + Md²</div>
      <p>固定在其末端，d = L/2：<sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML²（铰链上的门：⅓MW²）。因此，相同的 τ = ${f(M.PAX.tau)} N·m 使其旋转速度慢四倍。</p>
      <table class="data">
        <tr><th>固定at</th><th>I<sub>cm</sub></th><th>Md²</th><th>I</th><th>α = τ/I</th></tr>
        ${PX.map(p => `<tr><td>${p.key}</td><td>${f(R0.Icm)}</td><td>${f(R0.M * p.d * p.d)}</td><td>${f(p.I)}</td><td>${f(p.alpha)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 4.5, xlabel: 'time (s)', ylabel: 'ω (rad/s)', cursors: ['pax0', 'pax1'], label: 'Angular velocity of the two rods against time',
        series: PX.map((p, i) => ({ pts: [[0, 0], [2.4, p.alpha * 2.4]], tag: i ? [1.25, p.alpha * 1.25 + 0.15, 'pinned at the end'] : [0.75, 2.2, 'at the centre'] })) })}</div>
      <p class="hintline">单击杆查看距离 d。箭头 ${cm(F_PAX)} 每牛顿。</p>`,
    cam: { target: [STATIONS.parallel - 0.45, 0.8, 0.15], az: -10, el: 55, dist: 11 }, lit: 'parallel', scene: 'parallel', look: {},
    fig: "相同的推力，两个轴",
  },
  {
    kicker: '7.8', title: "工作与权力", sub: 'W = τΔθ, P = τω',
    body: `<p class="lede">A ${f(WR.F, 0)} N 推动扳手 ${f(WR.r, 2)} m 长转动螺母。手沿弧线移动 s = rΔθ，所以它所做的功是</p>
      <div class="eq">W = F·s = F·rΔθ = τΔθ</div>
      <p>W = Fd 的旋转双胞胎。做功的速率就是功率，P = Fv:</p> 的孪生
      <div class="eq">P = τω</div>
      <p>这里 τ = ${f(WR.tau, 0)} N·m 在稳定的 ${f(WR.w, 1)} rad/s: P = ${f(WR.P, 0)} W，并且一个 120° 行程需要 ${f(M.wrench(9).W, 1)} J。螺纹的摩擦力使 ω 保持稳定，因此这项工作变成了热量，不旋转。如果没有摩擦，它将进入 ½Iω².</p>
      <div class="charts">${chart({ x0: 0, x1: 2.2, y0: 0, y1: 45, xlabel: 'angle turned Δθ (rad)', ylabel: 'work W (J)', cursors: ['wrench'], label: 'Work against angle turned: a straight line of slope τ',
        series: [{ pts: [[0, 0], [WR.stroke, WR.tau * WR.stroke]], tag: [0.95, WR.tau * 0.95 + 2, `slope = τ = ${f(WR.tau, 0)} N·m`] }],
        marks: [[WR.stroke, WR.tau * WR.stroke, '120°', -36, 4]] })}</div>
      <p class="hintline">单击扳手查看半径和圆弧。箭头 ${cm(F_WRENCH)} 每牛顿。</p>`,
    cam: { target: [STATIONS.wrench + 0.08, 0.15, 0.12], az: -14, el: 48, dist: 3.6 }, lit: 'wrench', scene: 'wrench', look: {},
    fig: "螺母上的扳手",
  },
  {
    kicker: '7.9', title: "滚动", sub: "坡道下的比赛",
    body: `<p class="lede">A 球体、圆盘和环从静止处滚下 ${dg(M.RACE.theta)}° 坡道，旁边是一个在冰上滑动的盒子。滚动的东西必须在旋转上花费一些能量：</p>
      <div class="eq">mgh = ½mv² + ½Iω²</div>
      <p> 其中 I = fmR² 且 ω = v/R，v² = 2gh/(1 + f)。质量和半径取消；形状因子f越小，速度越快。盒子获胜，然后是球体、圆盘、环。滚<i>up</i>一座小山，旋转能量购买额外的高度。</p>
      <div class="charts">${energyBars()}</div>
      <p class="hintline">单击赛车以查看滚动盘如何移动。箭头 ${cm(RACE_V)} 与 m/s.</p>`,
    cam: { target: [STATIONS.race + 0.15, 0.6, 0], az: -14, el: 36, dist: 12.5 }, lit: 'race', scene: 'race', look: {},
    fig: "盒子、球体、圆盘、环",
  },
  {
    kicker: "7.10 · AP 物理 C", title: "滑动，然后滚动", sub: "一个保龄球",
    body: `<p class="lede">A 保龄球在 ${f(B.v0, 1)} m/s 处离开手，没有旋转。它的底部打滑，因此动摩擦 μ<sub>k</sub>mg 向后作用：它使球减慢，并作用于 R，使其向上旋转。</p>
      <table class="data cols">
        <tr><th>前进：ΣF = ma</th><th>转弯：Στ = Iα, I = ⅖mR²</th></tr>
        <tr><td>v = v<sub>0</sub> − µ<sub>k</sub>g t</td><td>ω = (5μ<sub>k</sub>g/2R) t</td></tr>
      </table>
      <p>滚动一次 v = Rω:</p>
      <div class="eq">t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g,&nbsp; v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub></div>
      <p>与μ<sub>k</sub> = ${f(B.muK, 1)}：t* = ${f(B.tStar)} s和${f(B.xStar)} m，则它在${f(B.vf)} m/s处滚动。 ${f(0.5 * B.m * B.v0 ** 2 - M.bowl(9).K, 1)} J 去热。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 2.6, xlabel: 'time (s)', ylabel: 'speed (m/s)', cursors: ['slipV', 'slipW'], label: 'Ball speed v and rim speed R omega against time, meeting at t star',
        series: [{ pts: curvePts(t => M.bowl(t).v, 0, 1.1, 50), tag: [0.22, 2.0, 'v'] }, { pts: curvePts(t => B.R * M.bowl(t).w, 0, 1.1, 50), tag: [0.24, 0.15, 'Rω'] }],
        marks: [[B.tStar, B.vf, 't*', 4, 18]] })}</div>
      <p class="hintline">单击球以查看其底部滑动的速度。 v：${cm(RACE_V)} 每 m/s； f: ${cm(F_SLIP)} 每牛顿.</p>`,
    cam: { target: [STATIONS.slip, 0.15, 0], az: -8, el: 18, dist: 7.2 }, lit: 'slip', scene: 'slip', look: {},
    fig: "推出滑行",
  },
  {
    kicker: '7.11', title: "井", sub: "力和力矩一起",
    body: `<p class="lede">A ${f(M.WELL.m, 1)} 公斤桶，绳子缠绕在 ${f(M.WELL.M, 1)} 公斤桶（实心圆柱体）上。松手：桶落下，滚筒旋转。</p>
      <table class="data cols">
        <tr><th>桶：ΣF = ma</th><th>鼓：Στ = Iα，a = rα</th></tr>
        <tr><td>mg − T = ma</td><td>rT = ½Mr²·(a/r)，因此 T = ½Ma</td></tr>
      </table>
      <div class="eq">a = mg / (m + ½M) = ${f(M.WELL.a)} m/s²</div>
      <p>T = ${f(M.WELL.T)} N，小于重力。鼓越重意味着下落速度越慢。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 8, xlabel: 'time (s)', ylabel: 'bucket speed (m/s)', cursors: ['well'], label: 'Bucket speed against time, compared with free fall',
        series: [{ pts: [[0, 0], [M.WELL.run, M.WELL.a * M.WELL.run]], tag: [0.78, M.WELL.a * 0.78 - 1.6, 'on the drum'] }, { cls: 'trend', pts: [[0, 0], [0.64, M.G * 0.64]], tag: [0.5, M.G * 0.5 + 0.6, 'free fall'] }] })}</div>
      <p class="hintline">点击井与自由落体进行比较。箭头 ${cm(F_LIGHT)} 每牛顿。</p>`,
    cam: { target: [STATIONS.well + 0.25, 2.05, 0], az: 22, el: 8, dist: 14 }, lit: 'well', scene: 'well', look: {},
    fig: "一个桶和一个卷筒",
  },
  {
    kicker: '7.12', title: "角冲量", sub: 'τΔt = ΔL',
    body: `<p class="lede">A旋转物体携带<b>角动量</b> L = Iω。力矩会改变它，就像力会改变一样 p:</p>
      <div class="eq">Στ = ΔL/Δt, so τΔt = ΔL</div>
      <p>τΔt 是 <b> 角脉冲 </b>，即 τ–t 图下方的面积。两个相等的旋转木马 (I = ½MR² = ${f(M.IMP.I, 0)} kg·m²) 在边缘受到两次推动：A 猛烈且短，B 轻柔且长。这些区域匹配，因此它们以相同的 L 和相同的 ω 结尾 = ${f(IM[0].wf)} rad/s.</p>
      <div class="charts">${chart({ x0: 0, x1: 3, y0: 0, y1: 300, xlabel: 'time (s)', ylabel: 'torque τ (N·m)', cursors: ['impT0', 'impT1'], label: 'Torque against time for the two pushes: equal areas',
        series: [{ cls: 'bar', pts: [[0, 0], [0, IM[1].tau], [IM[1].dt, IM[1].tau], [IM[1].dt, 0]], tag: [1.55, IM[1].tau - 30, `B: ${IM[1].tau} × ${IM[1].dt} = ${IM[1].J}`] }, { pts: [[0, 0], [0, IM[0].tau], [IM[0].dt, IM[0].tau], [IM[0].dt, 0], [3, 0]], tag: [0.65, IM[0].tau - 50, `A: ${IM[0].tau} × ${IM[0].dt} = ${IM[0].J}`] }] })}</div>
      <p class="hintline"> 单击旋转木马以获取其杠杆臂。箭头 ${cm(F_HEAVY)} 每牛顿。</p>`,
    cam: { target: [STATIONS.impulse, 0.5, 0.2], az: -10, el: 36, dist: 16.5 }, lit: 'impulse', scene: 'impulse', look: {},
    fig: "硬而短，柔而长",
  },
  {
    kicker: '7.13', title: "旋转", sub: "角动量，L = Iω",
    body: `<p class="lede">无外部力矩时，<b>角动量</b> L = Iω不能改变： I<sub>0</sub>ω<sub>0</sub> = I<sub>f</sub>ω<sub>f</sub>.</p>
      <p>A 滑冰者手持 ${f(M.SKATE.m, 1)} 公斤重物旋转，然后将其举过头顶。冰几乎不产生力矩。拉动质量会缩小 I，因此 ω 会增大。 L 持有，但 K<sub>r</sub> 上升：她的手臂起作用。</p>
      <table class="data">
        <tr><th></th><th>武装</th><th>武装</th></tr>
        <tr><td>I (kg·m²)</td><td>${f(sk0.I)}</td><td>${f(sk1.I)}</td></tr>
        <tr><td>ω (rad/s)</td><td>${f(sk0.w)}</td><td>${f(sk1.w)}</td></tr>
        <tr><td>L = Iω</td><td>${f(sk0.L)}</td><td>${f(sk1.L)}</td></tr>
        <tr><td>K<sub>r</sub> = ½Iω² (J)</td><td>${f(sk0.K)}</td><td>${f(sk1.K)}</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: +M.SKATE.run.toFixed(1), y0: 0, y1: 5, xlabel: 'time (s)', ylabel: 'ω (rad/s)', cursors: ['skater'], label: 'Skater angular velocity against time',
        series: [{ pts: curvePts(t => M.skater(t).w, 0, M.SKATE.run, 120) }] })}</div>
      <p class="hintline">单击溜冰者以查看重力开始的位置。</p>`,
    cam: { target: [STATIONS.skater, 1.3, 0], az: -16, el: 16, dist: 9.6 }, lit: 'skater', scene: 'skater', look: {},
    fig: "双臂内收，旋转",
  },
  {
    kicker: "7.14 · AP 物理 C", title: "粒子的L", sub: 'L = r × p',
    body: `<p class="lede">A 直线滑动的球绕点O有角动量：</p>
      <div class="eq">L = r × p, |L| = mvr sin φ = mvr<sub>⊥</sub></div>
      <p>r<sub>⊥</sub> = d 是从 O 到运动线的距离。当球滑动时，r 和 φ 发生变化，但 r sin φ 保持不变：<b>L 沿直线是常数 </b>。然后它撞击固定在 O 处的 ${f(HT.M, 1)} kg 杆。销钉没有关于 O 的力矩，因此关于 O 的 L 守恒：</p>
      <div class="eq">mv<sub>0</sub>d = −mv<sub>f</sub>d + ⅓ML²ω</div>
      <p>EElastic：${f(HT.m, 1)}公斤球在${f(-HT.v1)} m/s处反弹；杆转动 ${f(HT.w)} rad/s.</p>
      <div class="charts">${chart({ x0: 0, x1: 2.1, y0: -0.4, y1: 1.4, zero: true, xlabel: 'time (s)', ylabel: 'L about O (kg·m²/s)', cursors: ['hitB', 'hitR', 'hitL'], label: 'Angular momentum of ball, rod and total against time',
        series: [{ pts: [[0, M.hit(0).Lb], [HT.tHit, M.hit(0).Lb], [HT.tHit, M.hit(9).Lb], [2.1, M.hit(9).Lb]], tag: [1.5, M.hit(9).Lb + 0.01, 'ball'] }, { cls: 'trend', pts: [[0, 0], [HT.tHit, 0], [HT.tHit, HT.I * HT.w], [2.1, HT.I * HT.w]], tag: [1.3, HT.I * HT.w + 0.02, 'rod'] }, { cls: 'curve total', pts: [[0, M.hit(0).L], [2.1, M.hit(0).L]], tag: [0.15, M.hit(0).L - 0.22, 'total'] }] })}</div>
      <p class="hintline">单击将 L 绘制为向量。 p：${cm(P_SCALE)} 每 kg·m/s.</p>`,
    cam: { target: [STATIONS.particle - 0.4, 0.15, 0.15], az: -14, el: 52, dist: 8.5 }, lit: 'particle', scene: 'particle', look: {},
    fig: "一个球、一个销钉和一个杆",
  },
];

// ---------- click a scene: what it breaks into ----------
const turns = th => (th / (2 * Math.PI));
export const PLATES = {
  wheel: { text: `虚线是标记辐条的起点；灰色弧线是它经过的角度，θ，以弧度表示。阀门沿着边缘移动了 s = rθ 弧线。轮子上的每个点都转动相同的 θ，但点越远，行驶得越远。即使阀门回到起始位置（零线性位移），一整圈的角位移为 2π rad。`,
    facts: s => { const q = M.wheel(s.wheel.t); return [['θ', `${f(q.th)} rad = ${f(turns(q.th))} turns`], ["弧长 s = rθ", `${f(M.WHEEL.R * q.th)} m`], ['ω', `${f(q.w)} rad/s`], ['α', `${f(q.a)} rad/s²`], ["轮缘速度 v = rω", `${f(M.WHEEL.R * q.w)} m/s`]]; } },
  disc: { text: `每个骑手的加速度一分为二。 a<sub>t</sub>（沿着路径）改变了她的速度；当车辆加速时，它指向前方；当车辆减速时，它指向后方。 a<sub>c</sub>（朝中间）绕着圆圈旋转并随着 ω² 一起增长。红色箭头是它们的和，a = r√(ω⁴ + α²)。两者都是半径的两倍。`,
    facts: s => { const q = M.disc(s.disc.t), p1 = M.pointAt(M.DISC.r1, q), p2 = M.pointAt(M.DISC.r2, q); return [['ω, α (shared)', `${f(q.w)} rad/s, ${f(q.a)} rad/s²`], [`r = ${M.DISC.r1} m: v, a<sub>t</sub>, a<sub>c</sub>`, `${f(p1.v)}, ${f(p1.at)}, ${f(p1.ac)}`], [`r = ${M.DISC.r2} m: v, a<sub>t</sub>, a<sub>c</sub>`, `${f(p2.v)}, ${f(p2.at)}, ${f(p2.ac)}`]]; } },
  doors: { text: `沿其 <b> 作用线 </b>（虚线）延伸每个力。 <b>杠杆臂</b> r<sub>⊥</sub>是从铰链到该线的最短距离，与它成直角。 τ = F·r<sub>⊥</sub>。在右侧门上，推力分为 F<sub>⊥</sub>（用于转动门）和 F<sub>∥</sub>（将门推入铰链中，但对转动没有任何作用）。将 r 减半，或将推力倾斜至 30°（sin 30° = ½），力矩减半。`,
    facts: () => D.map(c => [c.name, `r⊥ = ${f(c.arm, 3)} m → τ = ${f(c.tau)} N·m`]) },
  plank: { text: `绕 A 施加力矩。每个力使木板转动（距 A 的距离）×（力）。木板的重力作用在其中部，L/2；箱子在 x 处； F<sub>B</sub> 位于 L。F<sub>A</sub> 作用于枢轴，因此没有力矩。权重将其顺时针旋转 (−)，将 F<sub>B</sub> 逆时针旋转 (+)，然后它们会抵消。`,
    facts: s => { const x = M.crateX(s.clock * M.SLOW), q = M.plank(x); return [['τ of F<sub>B</sub> (+)', `${f(M.PLANK.L)} × ${f(q.FB, 1)} = ${f(M.PLANK.L * q.FB, 0)} N·m`], ["板条 τ Mg (−)", `${f(M.PLANK.L / 2)} × ${f(M.PLANK.Wp, 1)} = ${f(M.PLANK.L / 2 * M.PLANK.Wp, 0)} N·m`], ["板条箱的 τ mg (−)", `${f(x)} × ${f(M.PLANK.Wc, 1)} = ${f(x * M.PLANK.Wc, 0)} N·m`], ['Στ about A', '0 N·m'], ['F<sub>A</sub>, F<sub>B</sub>', `${f(q.FA, 1)} N, ${f(q.FB, 1)} N`]]; } },
  ladder: { text: `关于脚O，只有两个力有力矩。壁力是水平的，因此将其向侧面延伸：其杠杆臂是顶部的高度 L sin θ。重物是垂直的，因此将其向下延伸：其杠杆臂是到中心的横向距离，½L cos θ。 F<sub>N</sub> 和 f<sub>s</sub> 作用于 O 本身并退出。`,
    facts: s => { const th = M.ladderAngle(s.clock * M.SLOW), q = M.ladder(th); return [['θ', `${dg(th)}°`], ['F<sub>w</sub> × L sin θ', `${f(q.Fw * M.LADDER.L * Math.sin(th), 1)} N·m`], ['mg × ½L cos θ', `${f(M.LADDER.W * M.LADDER.L / 2 * Math.cos(th), 1)} N·m`], ["需要摩擦力", `${f(q.f, 1)} N`], ["最可用μ<sub>s</sub>F<sub>N</sub>", `${f(q.fMax, 1)} N`]]; } },
  inertia: { text: `圆盘分离成四个等宽的薄环。每个环的所有质量都集中在一个半径左右，因此它的 I 约为 mr²。外环具有更大的质量，<i>and</i> 坐得更远，因此它们占主导地位。将它们相加得到 ½MR²，即半个环，所有质量都在边缘。实心球体在轴附近的质量更大：⅖MR²。`,
    facts: () => M.discAsRings(4).map((r, k) => [`ring ${k + 1}: ${f(r.r0, 1)}–${f(r.r1, 1)} m, ${f(r.m, 3)} kg`, `I = ${f(r.I, 4)} kg·m²`]).concat([['sum', `${f(M.discAsRings(4).reduce((a, r) => a + r.I, 0), 4)} = ½MR²`]]) },
  race: { text: `滚动而不打滑，接触斜坡的点暂时静止。中心以 v 移动，顶部以 2v 移动：整个圆盘围绕接触点转动。这就是为什么 ω = v/R。盒子在冰上滑动，无需支付旋转费用，并且最先到达。对于任何质量或尺寸，能量分裂都是相同的：球体保持 1/(1 + ⅖) = 71% 作为 ½mv²。`,
    facts: s => M.RACE.list.map(o => { const q = M.race(o, s.race.t), e = M.energy(o, q.v); return [o.name, `½mv² ${f(e.Kt)} J + ½Iω² ${f(e.Kr)} J`]; }) },
  well: { text: `幽灵是一个自由落体的桶：没有任何东西可以旋转，它会以 g 的速度下落。绳索在滚筒边缘拉动，距轴距离为 r，并与轴成直角，因此其力矩为 rT。该力矩必须使滚筒旋转，因此 T 保持在 mg 以下，并且铲斗仅在 ${f(M.WELL.a)} m/s² 处下降。重型滑轮（阿特伍德机器）上的两个质量以相同的方式工作：a = (m<sub>1</sub> − m<sub>2</sub>)g / (m<sub>1</sub> + m<sub>2</sub> + ½M)。`,
    facts: s => { const q = M.well(s.well.t); return [["桶落下", `${f(q.y)} m at ${f(q.v)} m/s`], ["自由落体将是", `${f(Math.min(0.5 * M.G * s.well.t ** 2, M.WELL.h))} m`], ["力矩rT", `${f(M.WELL.R * M.WELL.T)} N·m`], ['drum ω', `${f(q.w)} rad/s`]]; } },
  skater: { text: `幽灵球标记了手臂伸出时重物所在的位置。将它们从 r = ${f(M.SKATE.rOut)} m 中移入，从 ${f(2 * M.SKATE.m * M.SKATE.rOut ** 2)} 到 ${f(2 * M.SKATE.m * M.SKATE.rIn ** 2, 3)} kg·m² 减少了 2mr²。 L = Iω 不变，因此 ω 上升的幅度与 I 下降的幅度相同。`,
    facts: s => { const q = M.skater(s.skater.t); return [['r', `${f(q.r)} m`], ['I', `${f(q.I)} kg·m²`], ['ω', `${f(q.w)} rad/s`], ['L = Iω', `${f(q.L, 3)} kg·m²/s`], ['K<sub>r</sub>', `${f(q.K)} J`]]; } },
  integ: { text: `切片滑开，环升起。每个切片具有相同的质量 dm = λΔx，但其 I 份额为 r²dm，因此远切片计数最多：在末端固定杆上，最后一个切片比第一个切片远 19 倍，因此计数为 19² = 361 倍。将切片相加，Σr²Δm，随着切片变薄，总和接近积分。这些环的工作方式相同，但每个环的质量也随着 r 的增加而增长 (dm = σ2πr dr)，因此 I = ∫σ2πr³dr。`,
    facts: () => [[`${R0.N} 切片，轴位于中心`, `Σr²Δm = ${f(M.rodSum(R0.N, 0), 4)} kg·m²`], ["积分 ML²/12", `${f(R0.Icm, 4)} kg·m²`], [`${R0.N}切片，轴在末端`, `Σr²Δm = ${f(M.rodSum(R0.N, -R0.L / 2), 4)} kg·m²`], ["积分 ML²/3", `${f(R0.Iend, 4)} kg·m²`], ["100 片，中心", `${f(M.rodSum(100, 0), 5)} kg·m²`]] },
  parallel: { text: `虚线是穿过端销杆质心的第二轴，与销平行。关于该轴，该杆具有 I<sub>cm</sub> = ML²/12，与其他杆相同。从销开始测量，每个部件都位于距质心加上 d = L/2 的位置。平方并相加：交叉项取消（关于质心平衡），留下 I<sub>cm</sub> + Md²。该定理仅适用于质心轴：I 在那里最小。`,
    facts: s => PX.map(p => [`pinned at the ${p.key}: I<sub>cm</sub> + Md²`, `${f(R0.Icm)} + ${f(R0.M * p.d * p.d)} = ${f(p.I)} kg·m²`]).concat(PX.map(p => [`${p.key}: ω`, `${f(M.paxSpin(p, s.parallel.t).w)} rad/s`])) },
  wrench: { text: `灰色轮廓是笔画开始的地方。手的路径是灰色弧线，s = rΔθ，推力始终沿着它，与手柄成直角。所以 W = Fs = F·rΔθ = τΔθ：功是力矩乘以角度（以弧度为单位）。对于相同的 τ，扳手的长度是两倍，需要一半的推力，但手的移动距离是两倍：做的功相同。`,
    facts: s => { const q = M.wrench(s.wrench.t); return [['Δθ', `${f(q.th)} rad = ${dg(q.th)}°`], ['arc s = rΔθ', `${f(q.s, 3)} m`], ['F·s', `${f(WR.F * q.s, 1)} J`], ['τΔθ', `${f(q.W, 1)} J`], ['P = τω', `${f(q.P, 0)} W`]]; } },
  slip: { text: `球的底部以 v − Rω 移动（灰色，在地板上）。虽然该值不为零，但球会打滑并产生动摩擦点。 v 下降，Rω 上升（顶部灰色箭头），直到它们相遇；然后底部静止，摩擦停止，球滚动。关于接触线摩擦力没有力矩，因此 mvR + Iω 保持不变： mv<sub>0</sub>R = mvR + ⅖mR²(v/R) 再次给出 v = 5v<sub>0</sub>/7。`,
    facts: s => { const q = M.bowl(s.slip.t); return [['v', `${f(q.v)} m/s`], ['ω', `${f(q.w, 1)} rad/s`], ["底部幻灯片 v − Rω", `${f(q.vSlip)} m/s`], ['friction', q.slip ? `${f(B.f, 1)} N backward` : "无：滚动"], ['K', `${f(q.K, 1)} J of ${f(0.5 * B.m * B.v0 ** 2, 1)} J`]]; } },
  impulse: { text: `每个推力作用于边缘，与半径成直角，因此杠杆臂是完整半径 R = ${f(M.IMP.R, 1)} m 且 τ = FR。用力推动会在短时间内产生较大的 τ，而轻柔的推动会在较长时间内产生较小的 τ。对最终旋转重要的是面积 τΔt。推动后没有力矩（轴承是光滑的），因此 L 保持原状。`,
    facts: s => IM.map(p => { const q = M.imp(p, s.impulse.t); return [`${p.key}: τΔt = ${p.tau} × ${p.dt}`, `${p.J} kg·m²/s → L now ${f(q.L, 0)}, ω ${f(q.w)} rad/s`]; }) },
  particle: { text: `L 关于 O 绘制为向量，向上为从上方看的逆时针方向（右手定则）。击球前，只有球有L，mv<sub>0</sub>d。之后，球的 L 点朝下（它向相反的方向移动），杆的点朝上。蓝色总数不变：销钉在 O 处推动杆本身，因此它没有关于 O 的力矩。此处线性动量守恒为 <i>not</i>：销钉推动。`,
    facts: s => { const q = M.hit(s.particle.t); return [["r（O 到球）", `${f(q.r)} m`], ['r sin φ = r<sub>⊥</sub>', `${f(HT.d)} m`], ['L ball = mv r<sub>⊥</sub>', `${f(q.Lb, 3)} kg·m²/s`], ['L rod = Iω', `${f(q.Lr, 3)} kg·m²/s`], ['total', `${f(q.L, 3)} kg·m²/s`]]; } },
};
