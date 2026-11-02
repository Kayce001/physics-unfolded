// Chapter 4, page by page (after the AP Physics 1 organizer, Unit 5). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, BAR_COLORS } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const ST = STATIONS;
const INK = '#2c2c30', BLUE = '#4f7cbd', AMBER = '#bf9030', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1, h = H) => P.t + (1 - (y - y0) / (y1 - y0)) * (h - P.t - P.b) };   // h: a chart may be shorter
function chart({ x0, x1, y0, y1, h: H = 170, series, xlabel, ylabel, marks = [], cursors = [], label, under = '', zero = false }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1, H);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// live energy bars on the left page (the pendulum): heights set in main.js
export const BARS = { x: 70, w: 64, gap: 46, base: 150, top: 20 };
const barChart = (key, items, Emax) => `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Energy bar chart, live">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.top}" y2="${BARS.top}"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${f(Emax)} J</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  pull: { x0: 0, x1: 3.2, y0: 0, y1: 70 },
  toss: { x0: 0, x1: 1.25, y0: -10, y1: 10 },
  car: { x0: 0, x1: 8, y0: 0, y1: 25 },
  drop: { x0: 0, x1: 3, y0: 0, y1: 16 },
  spring: { x0: 0, x1: 0.5, y0: 0, y1: 25 },
  slide: { x0: 0, x1: 2.2, y0: 0, y1: 18 },
  lift: { x0: 0, x1: 4.2, y0: 0, y1: 250 },
  push: { x0: 0, x1: 4, y0: 0, y1: 20, h: 140 },
  beadU: { x0: 0, x1: 6, y0: 0, y1: 4, h: 125 },
  beadF: { x0: 0, x1: 6, y0: -2, y1: 2, h: 110 },
  bondU: { x0: 0.13, x1: 0.34, y0: -1.2, y1: 0.4, h: 135 },
};
const P0 = M.pull(M.PULL.run), XS = M.SPRING.xmax;

export const PAGES = [
  {
    kicker: "第4章", title: "工作", sub: "远距离的力",
    body: `<p class="lede"><b>功</b> 是通过力移入或移出物体的能量。仅当力作用时物体移动时，力才起作用。</p>
      <div class="eq"><i>W</i> = |<i>F</i>| |Δ<i>x</i>| cos θ</div>
      <p>θ 是力和位移之间的角度。功以焦耳为单位：1 J 等于 1 N 作用于 1 m.</p>
      <p>A 绳索将 ${f(M.PULL.m, 1)} 公斤箱与 ${f(M.PULL.F, 0)} N 拉动在 ${M.PULL.deg}° 穿过无摩擦地板。只有 <i>F</i> cos θ = ${f(M.PULL.Fx, 1)} N 点沿运动。 <i>F</i> sin θ = ${f(M.PULL.Fy, 1)} N 拉过它并且不做功。超过${f(P0.x)}米，绳子做${f(P0.W, 1)} J，小于${f(M.PULL.F * P0.x, 1)} J水平拉力。</p>
      <div class="charts">${chart({ ...R.pull, xlabel: 'displacement Δx (m)', ylabel: 'work by the rope (J)', cursors: [['pull']], label: 'Work against displacement',
        series: [{ cls: 'trend', pts: [[0, 0], [3.2, M.PULL.F * 3.2]], tag: [1.7, M.PULL.F * 1.7 + 3, 'θ = 0°'] }, { pts: [[0, 0], [3.2, M.PULL.Fx * 3.2]], tag: [2.45, M.PULL.Fx * 2.45 - 13, 'θ = 30°'] }] })}</div>
      <p class="hintline">单击该框可拆分拉力。箭头：${SC.pull.F * 100} 厘米每牛顿。</p>`,
    cam: { target: [ST.pull + 0.75, 0.6, 0], az: -20, el: 12, dist: 17 }, lit: 'pull', scene: 'pull', look: {},
    fig: "30°拉力",
  },
  {
    kicker: '4.1', title: "正功与负功", sub: "赞成或反对该动议",
    body: `<p class="lede">A 沿运动的力 (θ &lt; 90°) 对 <b> 正 </b> 做功：物体获得动能。对它的力 (θ &gt; 90°) 对 <b> 负 </b> 做功：物体失去动能。</p>
      <p>A ${f(M.TOSS.m)} kg 球在 ${f(M.TOSS.v0, 1)} m/s 处抛出：上升，重力与运动相反 (θ = 180°)，并在球停止的顶部做 ${f(-M.TOSS.m * M.G * M.TOSS.h, 1)} J 的工作。下落（θ = 0°）时，重力将 ${f(M.TOSS.m * M.G * M.TOSS.h, 1)} J 返回。条形加起来： <i>K</i><sub>0</sub> + <i>W</i><sub>g</sub> = <i>K</i>.</p>
      <div class="charts">${chart({ ...R.toss, zero: true, xlabel: 'time (s)', ylabel: 'energy (J)', cursors: [['tossK', BLUE], ['tossW']], label: 'Kinetic energy and work by gravity against time',
        series: [{ color: BLUE, pts: samples(40, 0, M.TOSS.run, t => M.toss(t).K), tag: [0.02, 7.2, 'K'] }, { pts: samples(40, 0, M.TOSS.run, t => M.toss(t).Wg), tag: [0.5, -9.6, 'work by gravity'] }] })}</div>
      <p class="hintline">箭头：<b>v</b> ${SC.toss.v * 100} 厘米每 m/s、<i>F</i><sub>g</sub> ${SC.toss.F * 100} 厘米/N。杆：${SC.toss.E * 100} cm/J.</p>`,
    cam: { target: [ST.toss + 0.8, 1.25, 0], az: -16, el: 7, dist: 12 }, lit: 'toss', scene: 'toss', look: {},
    fig: "对抗重力，顺着重力下降",
  },
  {
    kicker: '4.2', title: "不做功的力量", sub: "与运动成直角",
    body: `<p class="lede">A 与位移成 90° 的力不起作用，因为 cos 90° = 0。它可以改变运动方向，但不能改变速度。</p>
      <p>A ${f(M.WHIRL.m)} kg 球在 ${f(M.WHIRL.r, 1)} m 绳上绕 ${f(M.WHIRL.v, 1)} m/s 的光滑桌子旋转。绳子将其拉向中心，<i>T</i> = ${f(M.WHIRL.T, 1)} N，始终穿过其速度。其动能保持为${f(M.WHIRL.K)} J.</p>
      圆形轨道上的<p>A卫星也是如此：重力指向行星，穿过速度，因此重力对其不起作用。水平地板上的法向力也是如此。</p>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: -10, y1: 10, zero: true, xlabel: 'angle θ (°)', ylabel: 'work by 10 N over 1 m (J)', label: 'Work against angle',
        series: [{ pts: samples(60, 0, 180, d => M.work(10, 1, d)) }, { cls: 'trend', pts: [], tag: [20, 2.5, 'positive'] }, { cls: 'trend', pts: [], tag: [120, -8, 'negative'] }], marks: [[90, 0, 'zero at 90°', 8, -8]] })}</div>
      <p class="hintline">点击球以获得较早的时刻。 <b>v</b>：${SC.whirl.v * 100} 厘米每 m/s； <i>T</i>: ${SC.whirl.F * 100} cm/N.</p>`,
    cam: { target: [ST.whirl, 0.1, 0], az: -14, el: 36, dist: 8.8 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: "速度上的张力",
  },
  {
    kicker: '4.3', title: "动能", sub: "功-能定理",
    body: `<p class="lede"><b>动能</b>是运动能量，<i>K</i> = ½<i>mv</i>²。它是一个标量，以焦耳为单位，并且绝不为负。</p>
      <p><b>功-能定理</b>：净功等于动能的变化。</p>
      <div class="eq"><i>W</i><sub>net</sub> = Δ<i>K</i> = ½<i>mv</i><sub>f</sub>² − ½<i>mv</i><sub>0</sub>²</div>
      <p>道路以${f(M.CAR.F / 1000, 1)} kN（忽略阻力）的速度推动这辆${M.CAR.m} kg汽车前进。在 ${f(M.car(M.CAR.run).x)} m 之后，它完成了 ${f(M.car(M.CAR.run).Wnet / 1000)} kJ 的工作，并且汽车以 ${f(M.car(M.CAR.run).v, 1)} m/s 移动： ½ × ${M.CAR.m} × ${f(M.car(M.CAR.run).v, 1)}² = ${f(M.car(M.CAR.run).K / 1000)} kJ。两根杠一起成长。</p>
      <div class="charts">${chart({ ...R.car, xlabel: 'distance (m)', ylabel: 'K = W_net (kJ)', cursors: [['car', BLUE]], label: 'Kinetic energy against distance',
        series: [{ color: BLUE, pts: [[0, 0], [8, M.CAR.F * 8 / 1000]], tag: [3.2, M.CAR.F * 3.2 / 1000 + 3, 'slope = F = 3.0 kN'] }] })}</div>
      <p class="hintline">点击小车：重力和法向力不起作用。箭头：每 kN 25 厘米。条形：7.5 cm/kJ.</p>`,
    cam: { target: [ST.car + 4.6, 1.0, 0], az: -16, el: 12, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: "净功输入，动能输出",
  },
  {
    kicker: '4.4', title: "重力势能", sub: "高度能量",
    body: `<p class="lede"><b>势能</b>是取决于位置的存储能量。近地表</p>
      <div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i></div>
      <p>，其中 Δ<i>y</i> 从您选择的任何位置 <i>U</i><sub>g</sub> = 0 测量。它等于克服重力举起物体所需的最少功。</p>
      <p>这个${f(M.DROP.m)} kg球从${f(M.DROP.h, 1)} m落下：<i>U</i><sub>g</sub> = ${f(M.DROP.E, 1)} J，<i>K</i> = 0。当它落下时<i>U</i><sub>g</sub> 变为 <i>K</i>；就在着陆之前 <i>K</i> = ${f(M.DROP.E, 1)} J，所以 <i>v</i> = ${f(Math.sqrt(2 * M.G * M.DROP.h))} m/s。从高处跌落，<i>U</i><sub>g0</sub> = <i>K</i><sub>f</sub>.</p>
      <div class="charts">${chart({ ...R.drop, xlabel: 'height above the ground (m)', ylabel: 'energy (J)', cursors: [['dropU', AMBER], ['dropK', BLUE]], label: 'Potential and kinetic energy against height',
        series: [{ cls: 'trend', pts: [[0, M.DROP.E], [3, M.DROP.E]], tag: [1.25, M.DROP.E - 1, 'E'] }, { color: AMBER, pts: [[0, 0], [3, M.DROP.E]], tag: [2.2, 8.5, 'U<tspan dy="3" font-size="8">g</tspan>'] }, { color: BLUE, pts: [[0, M.DROP.E], [3, 0]], tag: [0.35, 10.0, 'K'] }] })}</div>
      <p class="hintline">单击球移动零。条形：${SC.drop.E * 100} 厘米每焦耳。</p>`,
    cam: { target: [ST.drop + 0.7, 1.5, 0], az: -14, el: 6, dist: 14 }, lit: 'drop', scene: 'drop', look: {},
    fig: "高度变成速度",
  },
  {
    kicker: '4.5', title: "弹簧势能", sub: "胡克定律",
    body: `<p class="lede">弹簧被压扁或拉伸得越厉害，就越会推回其自然长度。</p>
      <table class="data eqs"><tr><td><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></td><td>与 Δx 相反； <i>k</i> in N/m</td></tr><tr><td><i>U</i><sub>s</sub> = ½<i>k</i>Δ<i>x</i>²</td><td>储存能量</td></tr></table>
      <p>与 <i>k</i> = ${M.SPRING.k} 牛顿/米， ${f(M.SPRING.m, 1)} 公斤块（<i>K</i> = ${f(M.SPRING.E, 1)} J) 停在 Δ 处<i>x</i> = ${f(XS)} 米：全部 ${f(M.SPRING.E, 1)} J 被存储，然后返回。工作是 <b>力-位移图下的面积</b>;下 <i>kx</i> 它是一个三角形， ½ · Δ<i>x</i> · <i>k</i>Δ<i>x</i>.</p>
      <div class="charts">${chart({ ...R.spring, xlabel: 'compression Δx (m)', ylabel: 'spring force (N)', cursors: [['spring']], label: 'Spring force against compression, with the shaded area equal to the stored energy',
        under: `<path data-area="spring" style="fill:${BAR_COLORS.U};opacity:.45" d=""/>`, series: [{ pts: [[0, 0], [0.5, M.SPRING.k * 0.5]] }] })}</div>
      <p class="live" id="springlive"></p>
      <p class="hintline">无摩擦。箭头： ${SC.spring.F * 100} 厘米/牛顿。酒吧： ${SC.spring.E * 100} cm/J.</p>`,
    cam: { target: [ST.spring - 0.05, 0.6, 0], az: -14, el: 20, dist: 14 }, lit: 'spring', scene: 'spring', look: {},
    fig: "挤压弹簧",
  },
  {
    kicker: "4.6 · AP 物理 C", title: "通过不断变化的力量开展工作", sub: "F(x) 下的面积",
    body: `<p class="lede">当沿途受力变化时，将路径切成细条，每条加上<i>F</i>Δ<i>x</i>，让细条收缩。总和就变成了 F(x) 图下的 <b> 面积 </b>:</p>
      <div class="eq"><i>W</i> = lim Σ <i>F</i>(<i>x</i><sub>i</sub>)Δ<i>x</i> = ∫ <i>F</i>(<i>x</i>) d<i>x</i></div>
      <p>A ${f(M.PUSH.m, 1)} 公斤板条箱放在光滑的地板上得到 <i>F</i> = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>)，${M.PUSH.F0} N 在 <i>L</i> = ${f(M.PUSH.L, 1)} m 处衰落至 0。积分，<i>W</i> = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(M.PUSH.W, 1)} J，全部为动能。</p>
      <div class="charts">${chart({ ...R.push, xlabel: 'position x (m)', ylabel: 'push F(x) (N)', cursors: [['push']], label: 'Push against position, with the area up to the crate shaded and six strips outlined',
        under: `<path data-area="push" style="fill:#86868c;opacity:.35" d=""/>` + Array.from({ length: 6 }, (_, i) => { const dx = M.PUSH.L / 6, x = i * dx, F = M.pushF(x + dx / 2), X = v => CH.sx(v, R.push.x0, R.push.x1), Y = v => CH.sy(v, R.push.y0, R.push.y1, R.push.h); return `<rect class="trend" x="${X(x)}" y="${Y(F)}" width="${X(dx) - X(0)}" height="${Y(0) - Y(F)}"/>`; }).join(''),
        series: [{ pts: [...samples(60, 0, M.PUSH.L, M.pushF), [R.push.x1, 0]] }] })}</div>
      <p class="hintline">6 条（虚线） ${f(M.pushStrips(6))} J； 64 条 ${f(M.pushStrips(64), 3)} J.${SC.push.F * 100} cm/N.</p>`,
    cam: { target: [ST.push + 0.1, 0.8, 0], az: -12, el: 9, dist: 14.5 }, lit: 'push', scene: 'push', look: {},
    fig: "功是 F(x) 下的面积",
  },
  {
    kicker: '4.7', title: "节约能源", sub: "机械能保持恒定",
    body: `<p class="lede">机械能，<i>E</i> = <i>K</i> + <i>U</i><sub>g</sub> + <i>U</i><sub>s</sub>，有时保持不变无摩擦或阻力。</p>
      <div class="eq"><i>U</i><sub>g0</sub> + <i>U</i><sub>s0</sub> + <i>K</i><sub>0</sub> = <i>U</i><sub>gf</sub> + <i>U</i><sub>sf</sub> + <i>K</i><sub>f</sub></div>
      <p>A ${f(M.PEND.m, 1)} kg 鲍勃放在 ${f(M.PEND.L, 1)} m 弦上，在 ${M.PEND.deg0}° 处放手。末端都是 <i>U</i><sub>g</sub>、${f(M.PEND.E)} J。底部都是 <i>K</i>，即 ${f(Math.sqrt(2 * M.PEND.E / M.PEND.m))} m/s。绳子拉动整个运动，但不起作用。提示：首先找到零项（<i>v</i> = 0 在末端，Δ<i>y</i> = 0 在底部）。</p>
            <div class="charts">${barChart('pend', [['K', 'K', BAR_COLORS.K], ['U', 'U<tspan dy="3" font-size="8">g</tspan>', BAR_COLORS.U], ['E', 'E', BAR_COLORS.E]], M.PEND.E)}</div>
      <p class="hintline">单击鲍勃以分割其重力。箭头：${SC.pendulum.F * 100} cm/N。杆：${SC.pendulum.E * 100} cm/J.</p>`,
    cam: { target: [ST.pendulum + 0.7, 1.8, 0], az: -10, el: 6, dist: 14 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: "K 和 U 交换位置",
  },
  {
    kicker: "4.8 · AP 物理 C", title: "来自势能的力", sub: "减去 U 的斜率",
    body: `<p class="lede">由于 d<i>W</i> = <i>F</i> d<i>x</i> = −d<i>U</i>，保守力为 <b> 减去斜率 </b> <i>U</i>(<i>x</i>)：它指向下坡，在<i>U</i>平坦的地方为零。</p>
      <div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i></div>
      <p>A ${f(M.BEAD.m)} 光滑金属丝上的 kg 珠子，<i>x</i> 沿其测量： <i>U</i> = <i>mgh</i>(<i>x</i>).</p>
      <div class="charts">${chart({ ...R.beadU, xlabel: 'x along the wire (m)', ylabel: 'U (J) and its tangent', cursors: [['beadU']], label: 'Potential energy along the wire, with the tangent at the bead',
        under: `<line data-tangent="bead" class="curve" style="stroke:#e5484d;stroke-width:1.3"/>`,
        series: [{ cls: 'trend', pts: [[0, M.BEAD.E], [R.beadU.x1, M.BEAD.E]], tag: [5.3, M.BEAD.E - 0.55, 'E'] }, { pts: samples(120, 0, M.BEAD.len, M.beadU) }] })}
        ${chart({ ...R.beadF, zero: true, xlabel: 'x along the wire (m)', ylabel: 'F = −dU/dx (N)', cursors: [['beadF']], label: 'Force along the wire',
        series: [{ pts: samples(120, 0, M.BEAD.len, M.beadF) }], marks: [[M.BEAD.stable, 0, 'stable', -16, 14], [M.BEAD.unstable, 0, 'unstable', 6, -6]] })}</div>
      <p class="hintline">单击圆珠作为切线。 ${SC.bead.F * 100} 厘米/N.</p>`,
    cam: { target: [ST.bead - 0.1, 0.85, 0], az: -10, el: 8, dist: 14.5 }, lit: 'bead', scene: 'bead', look: {},
    fig: "U 图上的下坡",
  },
  {
    kicker: "4.9 · AP 物理 C", title: "能量图", sub: "转折点和平衡点",
    body: `<p class="lede">在总能量<i>E</i>处画一条线：<i>U</i>(<i>x</i>)之上的差距是<i>K</i>。粒子在 <b> 转折点 </b> 处折返，其中 <i>U</i> = <i>E</i>.</p>
      <table class="data eqs"><tr><td>stable</td><td>U 最小值，U″ &gt; 0：F 推返回</td></tr><tr><td>unstable</td><td>U最大，U”&lt; 0：F推开（驼峰）</td></tr><tr><td>中性</td><td>U平：无力（线的右端）</td></tr></table>
      <p>A 轻原子与重原子结合，位于 <i>E</i> = ${f(M.BOND.E / M.EV, 1)} eV。靠近底部的孔充当弹簧，<i>k</i> = <i>U</i>″:</p>
      <div class="eq">ω² = <i>U</i>″(<i>x</i><sub>0</sub>)/<i>m</i> → <i>T</i> = ${f(2 * Math.PI / M.BOND.w * 1e15, 1)} fs</div>
      <div class="charts">${chart({ ...R.bondU, xlabel: 'separation r (nm)', ylabel: 'U (eV)', cursors: [['bondU']], zero: true, label: 'Bond potential energy with the total-energy line and turning points',
        series: [{ cls: 'trend', pts: [[R.bondU.x0, M.BOND.E / M.EV], [R.bondU.x1, M.BOND.E / M.EV]], tag: [0.315, M.BOND.E / M.EV + 0.06, 'E'] }, { pts: samples(120, 0.1355, R.bondU.x1, r => M.bondU(r * 1e-9) / M.EV) }],
        marks: [[M.BOND.r1 * 1e9, M.BOND.E / M.EV, 'turn', -32, 4], [M.BOND.r2 * 1e9, M.BOND.E / M.EV, 'turn', 6, 14]] })}</div>
      <p class="hintline">绘制0.1 nm = 1 m，<i>F</i> ${SC.bond.F * 100} cm/nN，${(() => { const [a, e] = (1 / (M.SLOW * M.BOND.tscale)).toExponential(1).split('e+'); return `${a}×10<sup>${e}</sup>`; })()}×较慢。</p>`,
    cam: { target: [ST.bond - 0.45, 1.25, 0], az: -10, el: 6, dist: 12.5 }, lit: 'bond', scene: 'bond', look: {},
    fig: "井中的一个粒子",
  },
  {
    kicker: '4.10', title: "当它不被保存时", sub: "摩擦力将能量转化为热能",
    body: `<p class="lede">摩擦力和阻力是<b>阻力</b>力。他们反对该动议，因此他们的工作总是负的。它们去除的机械能变成热能。</p>
      <div class="eq"><i>E</i><sub>mech,i</sub> = <i>E</i><sub>mech,f</sub> + |<i>W</i><sub>resistive</sub>|</div>
      <p>${f(M.SLIDE.m, 1)} kg 块滑到 ${f(M.SLIDE.v0, 1)} m/s 的粗糙地板上。当 μ<sub>k</sub> = ${f(M.SLIDE.mu)} 时，摩擦力为 <i>f</i> = μ<sub>k</sub><i>mg</i> = ${f(M.SLIDE.f)} N。在 ${f(M.SLIDE.d)} m 之后停止： |<i>W</i><sub>f</sub>| = <i>f</i>·<i>d</i> = ${f(M.SLIDE.E, 1)} J，其全部<i>K</i>。 <i>E</i><sub>mech</sub>降至零；总数，包括热量，永远不会改变。</p>
      <div class="charts">${chart({ ...R.slide, xlabel: 'distance slid (m)', ylabel: 'energy (J)', cursors: [['slideK', BLUE], ['slideT', GREY]], label: 'Kinetic and thermal energy against distance',
        series: [{ cls: 'trend', pts: [[0, M.SLIDE.E], [M.SLIDE.d, M.SLIDE.E]], tag: [0.85, M.SLIDE.E - 0.2, 'total'] }, { color: BLUE, pts: [[0, M.SLIDE.E], [M.SLIDE.d, 0]], tag: [0.2, 11.5, 'K'] }, { color: GREY, pts: [[0, 0], [M.SLIDE.d, M.SLIDE.E]], tag: [1.45, 8.0, 'thermal'] }] })}</div>
      <p class="hintline">单击该块。箭头：${SC.slide.F * 100} cm/N。杆：${SC.slide.E * 100} cm/J.</p>`,
    cam: { target: [ST.slide + 0.3, 0.55, 0], az: -16, el: 12, dist: 14 }, lit: 'slide', scene: 'slide', look: {},
    fig: "动能变成热能",
  },
  {
    kicker: '4.11', title: "电源", sub: "工作完成得有多快",
    body: `<p class="lede"><b>功率</b> 是做功的速率，或将能量从一种形式转变为另一种形式的速率。以瓦为单位测量：1 W = 1 J/s，1 马力 = ${M.HP} W.</p>
      <div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>F</i>Δ<i>x</i>/<i>t</i> = <i>Fv</i></div>
      <p> ${M.LIFT.m} kg 板条箱以稳定速度上升 ${f(M.LIFT.h, 1)} m，因此每根绳子以 <i>T</i> = <i>mg</i> = ${f(M.LIFT.W, 0)} N 拉动，并做 ${f(M.LIFT.work, 0)} J。最快的拉动 ${f(M.LIFT.tFast, 1)} s：${f(M.LIFT.Pfast, 0)} W。慢的需要${f(M.LIFT.tSlow, 1)} s：${f(M.LIFT.Pslow, 0)} W。同样的工作，两倍的功率。给定速度和时间，<i>P</i> = Δ<i>E</i>/<i>t</i> 通常是最快的。</p>
            <div class="charts">${chart({ ...R.lift, xlabel: 'time (s)', ylabel: 'work done (J)', cursors: [['liftF'], ['liftS']], label: 'Work against time, fast and slow',
        series: [{ pts: [[0, 0], [M.LIFT.tFast, M.LIFT.work], [4.2, M.LIFT.work]], tag: [0.25, 160, 'fast: slope 98 W'] }, { cls: 'trend', pts: [[0, 0], [M.LIFT.tSlow, M.LIFT.work]], tag: [2.45, 95, 'slow: 49 W'] }] })}</div>
      <p class="hintline">短暂启动和停止被忽略。箭头：${SC.lift.F * 100} 厘米每牛顿。</p>`,
    cam: { target: [ST.lift, 1.7, 0], az: -12, el: 6, dist: 14 }, lit: 'lift', scene: 'lift', look: {},
    fig: "同样的工作，一半的时间",
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  pull: { text: `拉力分成两部分（灰色）。 <i>F</i> cos θ 沿着位移并完成所有工作。 <i>F</i> sin θ 笔直向上，与运动成 90°，并且不执行任何操作：它只会使地板向上推得更少。绳子的功等于盒子的动能，因为其他东西都不起作用。`,
    facts: s => { const r = M.pull(s.pull.t); return [['F cos θ (along Δx)', `${f(M.PULL.Fx)} N`], ['F sin θ (across)', `${f(M.PULL.Fy)} N，不工作`], ['Δx', `${f(r.x)} m`], ['W = F Δx cos θ', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`]]; } },
  toss: { text: `观察重力和速度之间的角度。向上，它们的方向相反（180°）：重力功为负，K 条收缩。下来他们同意（0°）：工作是正的，K 又回来了。在每一时刻，K = K<sub>0</sub> + W<sub>g</sub>。`,
    facts: s => { const r = M.toss(s.toss.t); return [['height', `${f(r.y)} m`], ['velocity', `${f(r.v)} m/s`], ["到目前为止 W 受重力影响", `${f(r.Wg)} J`], ['K = K₀ + W_g', `${f(M.toss(0).K)} + (${f(r.Wg)}) = ${f(r.K)} J`]]; } },
  whirl: { text: `早些时候，间隔四分之一圈：在每个时刻，张力（朝向钉）和速度（沿着圆周）以 90° 相交。在任何小步长上，位移都沿着 <b>v</b>，因此 T·Δx·cos 90° = 0。重力和工作台的推动力是垂直的，也不做功。`,
    facts: () => [['tension T', `${f(M.WHIRL.T)} N`], ["T 和 v 之间的角度", '90°'], ["T 的作品", '0 J'], ['speed', `${f(M.WHIRL.v)} m/s, constant`], ['K', `${f(M.WHIRL.K)} J, constant`]] },
  car: { text: `重力和法向力是垂直的，与运动成 90°，因此它们不做功并被搁置。沿 Δx 的唯一力是道路的推力，也是合力（红色）。它的功 F·Δx 是动能的总变化。`,
    facts: s => { const r = M.car(s.car.t); return [["F（道路，前进）", `${f(M.CAR.F / 1000)} kN`], ['Δx', `${f(r.x)} m`], ['W_net = F Δx', `${f(r.Wnet / 1000)} kJ`], ['v', `${f(r.v)} m/s`], ['K = ½mv²', `${f(r.K / 1000)} kJ`]]; } },
  drop: { text: `将零向上移动到 ${f(M.DROP.ref2, 1)} m 和 U 的每个值<sub>g</sub> 下降毫克× ${f(M.DROP.ref2, 1)} = ${f(M.DROP.m * M.G * M.DROP.ref2)} J. 低于新的零，U<sub>g</sub> 是负数。但是 <i>change</i> in U<sub>g</sub> 秋天的时间是一样的，所以你预测的速度是一样的。选择使算术最简单的零。`,
    facts: s => { const r = M.drop(s.drop.t), m = M.DROP.m * M.G; return [['height', `${f(r.y)} m`], ["U_g，接地为零", `${f(r.U)} J`], [`U_g，${f(M.DROP.ref2, 1)} m 处为零`, `${f(m * (r.y - M.DROP.ref2))} J`], ["释放后的 ΔU_g", `${f(r.U - M.DROP.E)} J 任一方式`], ['K', `${f(r.K)} J`]]; } },
  spring: { text: `灰色箭头是压缩 Δx，根据弹簧的自然长度测量。弹簧力 F<sub>s</sub> = −kΔx 指向相反方向。随着区块减速，其 K 柱空入 U<sub>s</sub> 柱；在完全压缩时，全部为 U<sub>s</sub>。总数永远不会改变。`,
    facts: s => { const r = M.spring(s.spring.t); return [['compression Δx', `${f(r.x, 3)} m`], ['F_s = −kΔx', `${f(r.F)} N`], ['U_s = ½kΔx²', `${f(r.U)} J`], ['K = ½mv²', `${f(r.K)} J`], ['K + U_s', `${f(r.K + r.U)} J`]]; } },
  push: { text: `F(x) 下方的区域分为 ${6} 条带。每个都是 F(x<sub>i</sub>)·Δx，即推力几乎不改变的一小步的工作。它们的总和 ${f(M.pushStrips(6))} J 已经接近积分 ${f(M.PUSH.W)} J；较薄的条带缩小了间隙。地板水平且光滑，因此重力和法向力不起作用，并且该面积全部是动能。`,
    facts: s => { const r = M.push(s.push.t); return [['x', `${f(r.x)} m`], ['F(x)', `${f(r.F)} N`], ["W = ∫F dx 到目前为止", `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`], ["6条总和，整推", `${f(M.pushStrips(6))} J`], ['∫₀ᴸ F dx', `${f(M.PUSH.W)} J`]]; } },
  bead: { text: `虚线是导线的切线。重力分成沿导线的部分 mg sin θ 和沿导线的推力所承受的穿过导线的部分。由于沿导线 U = mgh 且 dh/dx = sin θ，因此沿导线的部分恰好为 −dU/dx。在谷底和驼峰顶部，切线是水平的：没有力，平衡。`,
    facts: s => { const r = M.bead(s.bead.t); return [["x 沿线", `${f(r.x)} m`], ['U = mgh', `${f(r.U)} J`], ['dU/dx (slope)', `${f(r.slope)} J/m`], ['F = −dU/dx', `${f(r.F)} N`], ['K + U', `${f(r.K + r.U, 3)} J`]]; } },
  bond: { text: `该键为 Lennard-Jones 模型，U = ε[(r<sub>0</sub>/r)12 − 2(r<sub>0</sub>/r)⁶], r<sub>0</sub> = ${f(M.BOND.r0 * 1e9)}纳米；重原子几乎不移动。幽灵标记了转折点，即 U = E 且原子停止。蓝色虚线抛物线为 ½k(r − r<sub>0</sub>)²，其中 k = U″(r<sub>0</sub>) = ${f(M.BOND.k, 0)} N/m：它适合井底，这就是为什么小振动是简谐，ω² = U″/m。真正的井在较高处是不平衡的，内部陡峭，外部柔软，因此这种摆动速度较慢，并且需要更长的伸展时间。`,
    facts: s => { const r = M.bond(s.bond.t); return [['r', `${f(r.r * 1e9, 4)} nm`], ['U', `${f(r.U / M.EV, 3)} eV`], ['K = E − U', `${f(r.K / M.EV, 3)} eV`], ['F = −dU/dr', `${f(r.F * 1e9)} nN`], ['k = U″(r₀)', `${f(M.BOND.k, 0)} N/m`], ["T小/本秋千", `${f(2 * Math.PI / M.BOND.w * 1e15)} / ${f(M.BOND.period * 1e15)} fs`]]; } },
  pendulum: { text: `重力沿着路径分成 mg sin θ 和沿着绳子 mg cos θ。只有 mg sin θ 起作用：它在上升的过程中减慢鲍勃的速度，在下降的过程中加速它的速度。张力和 mg cos θ 穿过运动并且不产生任何作用，这就是 K + U<sub>g</sub> 保持固定的原因。`,
    facts: s => { const r = M.pendulum(s.pendulum.t); return [['angle θ', `${f(r.th * 180 / Math.PI, 1)}°`], ["mg sin θ（沿路径）", `${f(r.Ftan)} N`], ['tension T', `${f(r.T)} N，不工作`], ['K', `${f(r.K)} J`], ['U_g', `${f(r.U)} J`], ['K + U_g', `${f(r.K + r.U)} J`]]; } },
  slide: { text: `重力和法向力不起作用并被搁置。摩擦力是沿运动方向的唯一力，它指向后方：θ = 180°，因此它的功为 −f·Δx。这种负功正是损失的动能，它以热量的形式重新出现在砖块和地板上。`,
    facts: s => { const r = M.slide(s.slide.t); return [['friction f = μk mg', `${f(M.SLIDE.f)} N`], ['Δx', `${f(r.x)} m`], ['W_f = −f Δx', `${f(r.Wf)} J`], ['K', `${f(r.K)} J`], ["热能", `${f(r.Eth)} J`], ['K + thermal', `${f(r.K + r.Eth)} J`]]; } },
  lift: { text: `灰色箭头是每个板条箱的上升 Δy。在稳定速度下，绳子的拉力等于重力，因此每根绳子的 W = mgΔy。同等高度意味着同等工作；速度越快的板条箱可以用一半的时间到达那里，因此它的绳索可以提供两倍的力量。`,
    facts: s => { const a = M.lift(s.lift.t, M.LIFT.vFast), b = M.lift(s.lift.t, M.LIFT.vSlow); return [['T = mg', `${f(M.LIFT.W, 1)} N`], ["快：到目前为止工作", `${f(a.W, 0)} J, P ${f(a.P, 0)} W`], ["慢：到目前为止工作", `${f(b.W, 0)} J, P ${f(b.P, 0)} W`], ['P = Fv (fast)', `${f(M.LIFT.W, 0)} × ${f(M.LIFT.vFast, 1)} = ${f(M.LIFT.Pfast, 0)} W`]]; } },
};
