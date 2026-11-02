// Chapter 2, page by page (after the AP Physics 1 organizer, Unit 3). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, KN_SCALE, F_SCALE, TUG_SCALE, DRAG_SCALE, HONEY_SCALE } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG, HN = M.HONEY;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${String(y0).replace('-', '−')}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };

const frictionChart = chart({
  x0: 0, x1: 12, y0: 0, y1: 12, xlabel: "施加的力 (N)", ylabel: "摩擦力（牛）", cursor: 'friction', label: "对抗作用力的摩擦力",
  series: [{ pts: [[0, 0], [M.F_SMAX, M.F_SMAX]], tag: [2.2, 2.2, 'static: f = F'] }, { pts: [[M.F_SMAX, M.F_K], [12, M.F_K]], tag: [5.6, M.F_K - 1.6, 'kinetic: μk·FN →'] }, { cls: 'trend', pts: [[M.F_SMAX, M.F_SMAX], [M.F_SMAX, M.F_K]] }],
  marks: [[M.F_SMAX, M.F_SMAX, `${f(M.F_SMAX)} N`]],
});

export const PAGES = [
  {
    kicker: "第2章", title: "牛顿运动定律", sub: "什么改变了运动",
    body: `<p class="lede">运动学描述了运动。动力学解释：<b>力</b> 是推或拉，力改变运动。</p>
      <p>A 力是一个矢量，从物体中心绘制为箭头。 1 牛顿是使 1 公斤产生 1 m/s² 加速度的力。这款${f(M.M1, 1)}公斤块手感二：</p>
      <table class="data">
        <tr><th>force</th><th>符号</th><th>这里</th></tr>
        <tr><td>重力（重力）</td><td><i>F</i><sub>g</sub> = <i>mg</i></td><td>${f(M.W1, 1)} N下</td></tr>
        <tr><td>支持力（表面）</td><td><i>F</i><sub>N</sub></td><td>${f(M.FN, 1)} N上</td></tr>
        <tr><td>张力（一串）</td><td><i>T</i></td><td>—</td></tr>
        <tr><td>摩擦</td><td><i>f</i></td><td>—</td></tr>
        <tr><td>拖动(空运)</td><td><i>F</i><sub>d</sub></td><td>—</td></tr>
      </table>
      <p>总是从绘制<b>自由体图开始</b>：物体作为一个点，作用在其上的每个力作为一个箭头。单击该块即可查看它。</p>`,
    cam: { target: at('rest', 0.45), az: -30, el: 12, dist: 9 }, lit: 'rest', scene: 'rest', look: {},
    fig: "静止的块",
  },
  {
    kicker: '2.1', title: "张力", sub: "一根绳子只能拉动",
    body: `<p class="lede"><b>拉力</b> <i>T</i> 是绳子或绳子沿绳子的拉力。一根绳子只能拉，不能推。</p>
      <p> 在左侧，${f(M.M1, 1)} 公斤块用一根绳子悬挂。它处于平衡状态，所以 <i>T</i> = <i>mg</i> = ${f(M.W1, 1)} N.</p>
      <p>右侧两串分担负载。只有它们的垂直部分支撑着方块，所以 2<i>T</i> sin θ = <i>mg</i> 和 </p>
      <div class="eq"><i>T</i> = <i>mg</i> / (2 sin θ)</div>
      <p>随着琴弦变平，θ缩小，张力增大：${f(M.tension2(70), 1)} N为70°，${f(M.tension2(30), 1)} N为30°，${f(M.tension2(20), 1)} N为20°。这就是为什么晾衣绳永远无法完全拉直。水平部分相互抵消。</p>
      <div class="charts">${chart({ x0: 10, x1: 90, y0: 0, y1: 60, xlabel: 'string angle θ (°)', ylabel: 'tension in each string (N)', cursor: 'tension', label: 'Tension against string angle',
        series: [{ pts: Array.from({ length: 41 }, (_, i) => { const d = 12 + i * 1.95; return [d, Math.min(M.tension2(d), 60)]; }) }] })}</div>
      <p class="hintline">点击琴弦将每个张力分成几部分。</p>`,
    cam: { target: [STATIONS.tension, 1.5, 0], az: -10, el: 5, dist: 11 }, lit: 'tension', scene: 'tension', look: {},
    fig: "一串，然后两串",
  },
  {
    kicker: '2.2', title: "第一定律", sub: "惯性",
    body: `<p class="lede">静止的物体保持静止，沿直线运动的物体保持以相同的速度运动，除非有非零的<b>合力</b>作用在其上。</p>
      <p>该块在 ${f(M.V_GLIDE, 1)} m/s 处的无摩擦表面上滑动。它的重力和法向力相互抵消，因此 Σ<i>F</i> = 0，并且不会改变其运动。频闪图像均匀分布。</p>
      <p><b>平衡</b> 表示 Σ<i>F</i> = 0。这包括匀速移动，而不仅仅是静止。 <i>keep</i> 不需要任何东西就可以移动。</p>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 3.6, xlabel: 'time (s)', ylabel: 'position (m)', label: 'Position against time: a straight line', series: [{ pts: [[0, 0], [2.4, 3.6]] }] })}</div>`,
    cam: { target: at('glide', 0.45), az: -18, el: 14, dist: 12 }, lit: 'glide', scene: 'glide', look: {},
    fig: "恒定速度，零合力",
  },
  {
    kicker: '2.3', title: "水平飞行", sub: "移动，但处于平衡状态",
    body: `<p class="lede">A ${M.PLANE.m} kg 飞机以 ${M.PLANE.v} m/s 水平、直线稳定巡航。它的速度不变，因此根据第一定律，合力为零。</p>
      <table class="data">
        <tr><td>升力（从机翼向上）</td><td>${(M.PLANE.L / 1000).toFixed(2)} kN</td></tr>
        <tr><td>重力（下）</td><td>${(M.PLANE.W / 1000).toFixed(2)} kN</td></tr>
        <tr><td>推力（向前，来自螺旋桨）</td><td>${(M.PLANE.T / 1000).toFixed(2)} kN</td></tr>
        <tr><td><b>阻力</b>（背面，从空中）</td><td>${(M.PLANE.D / 1000).toFixed(2)} kN</td></tr>
      </table>
      <p><b>阻力</b> 是流体抵抗其运动所施加的力。它随速度增长，大致为 <i>F</i><sub>d</sub> = ½<i>DρAv</i>²（<i>D</i> 阻力系数，<i>A</i> 面向流动的面积）。发动机不需要让飞机保持移动；需要取消拖动。</p>
      <p class="hintline">这里的箭头是按${(KN_SCALE * 100).toFixed(0)}厘米每千牛顿绘制的。</p>`,
    cam: { target: [STATIONS.plane, 3.0, 0], az: -26, el: 9, dist: 34 }, lit: 'plane', scene: 'plane', look: {},
    fig: "升力=重力，推力=阻力",
  },
  {
    kicker: '2.4', title: "第二定律", sub: 'ΣF = ma',
    body: `<p class="lede">A 合力在其方向上产生加速度，大小为 Σ<i>F</i>/<i>m</i>.</p>
      <p> 两个块在无摩擦表面上获得相同的 ${f(M.PUSH, 1)} N 推力。 ${f(M.M1, 1)} kg 块以 ${f(M.A1, 1)} m/s² 加速。 ${f(M.M2, 1)} kg 块的质量是两倍，得到一半：${f(M.A2, 1)} m/s².</p>
      <p>更大的力，更大的加速度。质量更大，加速度更小。</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 6, xlabel: 'net force (N)', ylabel: 'acceleration (m/s²)', label: 'Acceleration against net force for 2 kg and 4 kg', series: [{ pts: [[0, 0], [12, 6]], tag: [9, 4.5, '2 kg'] }, { pts: [[0, 0], [12, 3]], tag: [9.6, 2.4, '4 kg'] }], marks: [[M.PUSH, M.A1, '3.0'], [M.PUSH, M.A2, '1.5']] })}</div>`,
    cam: { target: [STATIONS.second + 1.2, 0.4, 0], az: -22, el: 20, dist: 12 }, lit: 'second', scene: 'second', look: {},
    fig: "2 kg 和 4 kg 相同的 6.0 N",
  },
  {
    kicker: '2.5', title: "什么推动汽车？", sub: "道路确实",
    body: `<p class="lede">发动机转动车轮，但发动机是汽车的一部分，没有任何东西可以推动自己。汽车上的前进力来自<b>道路</b>：轮胎上的静摩擦力。</p>
      <p>轮胎向后推路面。根据第三定律，道路将轮胎向前推，此处为 ${f(M.CAR.F / 1000, 1)} kN。轮胎不打滑，因此即使汽车移动，这也是 <i>static</i> 摩擦力。</p>
      <p>空气阻力随着<i>v</i>²推回并增长：在${f(M.car(M.CAR.run).v, 1)} m/s处只有${f(M.car(M.CAR.run).D, 0)} N，但在高速公路速度（30 m/s）时为${f(M.CAR.k * 30 * 30, 0)} N。随着汽车加速，合力和加速度会减小。</p>
      <div class="charts">${chart({ x0: 0, x1: 3.2, y0: 0, y1: 10, xlabel: 'time (s)', ylabel: 'speed (m/s)', cursor: 'car', label: 'Car speed against time',
        series: [{ pts: Array.from({ length: 33 }, (_, i) => [i * 0.1, M.car(i * 0.1).v]) }] })}</div>
      <p class="hintline">箭头：${(KN_SCALE * 100).toFixed(0)} 厘米每千牛顿.</p>`,
    cam: { target: [STATIONS.car + 0.5, 1.2, 0], az: -20, el: 14, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: "向前摩擦，向后拖动",
  },
  {
    kicker: '2.6', title: "摩擦力", sub: "静态，然后动态",
    body: `<p class="lede">在粗糙的地板上，推力稳定增长，${f(M.RAMP, 1)}每秒N。起初，块不移动：<b>静摩擦力</b>与推力完全匹配。</p>
      <p>静摩擦力有极限，μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)}块挣脱。 <b>动摩擦</b>然后以较小、稳定的μ<sub>k</sub><i>F</i><sub>N</sub> = ${f(M.F_K)} N接管，无论推动力如何。红色箭头，即合力，仅在推动获胜后出现。</p>
      <div class="charts">${frictionChart}</div>`,
    cam: { target: [STATIONS.friction + 0.4, 0.45, 0], az: -26, el: 13, dist: 9 }, lit: 'friction', scene: 'friction', look: {},
    fig: "在粗糙的地板上不断增加的推力",
  },
  {
    kicker: '2.7', title: "第三定律", sub: "力量是成对出现的",
    body: `<p class="lede">如果A推动B，则B在同一瞬间以相同大小的相反方向的力推动A。</p>
      <p>A ${f(M.PUSH, 1)} N 推动将两个块一起移动到 ${f(M.A_PAIR, 1)} m/s² 处。为了给 B (${f(M.M2, 1)} kg) 加速度，A 必须用 ${f(M.CONTACT, 1)} N 推动它。B 用 ${f(M.CONTACT, 1)} N 向后推 A，因此 A 上的合力为 ${f(M.PUSH - M.CONTACT, 1)} N，正好是 ${f(M.M1, 1)} kg × ${f(M.A_PAIR, 1)} m/s².</p>
      <p>一对两个力作用于<b>不同的物体</b>，因此它们永远不会相互抵消。重力和法向力 <i>not</i> 是一对：两者作用在同一个块上。块的重力的伙伴是拉动地球的块。</p>`,
    cam: { target: [STATIONS.third + 0.9, 0.45, 0], az: -24, el: 12, dist: 9 }, lit: 'third', scene: 'third', look: {},
    fig: "A推B，B推A",
  },

  {
    kicker: '2.8', title: "选择系统", sub: "内力取消",
    body: `<p class="lede">在你喜欢的任何物体周围画一个边界，并将它们称为 <b>系统</b>。其内部事物之间的作用力是 <b>内部</b>。来自外界任何事物的力量 <b>外部的</b>.</p>
      <p>溜冰者 A (${TG.mA} kg) 和溜冰者 B (${TG.mB} kg）站在无摩擦的冰上并用轻绳牵引。绳子拉着他们每个人 ${TG.T} N，所以 A 加速 ${f(TG.aA, 1)} m/s² 和 B 处 ${f(TG.aB, 1)} m/s²，彼此相对。</p>
      <p>以溜冰者+绳索为系统。张力是内部的，它们成对出现，大小相等且方向相反，因此它们的总和为零。重力和法向力是外部的，但它们相互抵消。整个系统无法加速。其 <b>质心</b> 保持原状：</p>
      <div class="eq"><i>x</i><sub>cm</sub> = Σ<i>m</i><i>x</i> / Σ<i>m</i></div>
      <div class="eq">= (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th></th><th><i>x</i><sub>A</sub></th><th><i>x</i><sub>B</sub></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>在开始时</td><td>${f(M.tug(0).xA)} m</td><td>${f(M.tug(0).xB)} m</td><td>0.00 m</td></tr>
        <tr><td>之后 ${f(TG.run, 2)} s</td><td>${f(M.tug(TG.run).xA)} m</td><td>${f(M.tug(TG.run).xB)} m</td><td>0.00 m</td></tr>
      </table>
      <p>越轻的滑冰者覆盖的冰越多， ${f(M.tug(TG.run).xA - TG.xA0, 1)} 我反对 ${f(TG.xB0 - M.tug(TG.run).xB, 1)} m，正好保持的比例 <i>x</i><sub>cm</sub> 固定。如果他们一起滑翔， <i>x</i><sub>cm</sub> 会保持以相同的速度滑行。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.7, y0: -3, y1: 2, xlabel: 'time (s)', ylabel: 'position (m)', cursor: 'tug', label: 'Positions of both skaters and of the centre of mass against time',
        series: [{ pts: Array.from({ length: 21 }, (_, i) => [i * TG.run / 20, M.tug(i * TG.run / 20).xA]), tag: [0.15, TG.xA0 + 0.25, 'A'] }, { pts: Array.from({ length: 21 }, (_, i) => [i * TG.run / 20, M.tug(i * TG.run / 20).xB]), tag: [0.75, M.tug(0.75).xB - 0.75, 'B'] }, { cls: 'curve total', pts: [[0, 0], [TG.run, 0]], tag: [1.2, 0.1, 'x<tspan dy="3" font-size="8">cm</tspan>'] }] })}</div>
      <p class="hintline">箭头在这里： ${(TUG_SCALE * 100).toFixed(1)} 厘米每牛顿。单击滑冰者可查看系统边界。</p>`,
    cam: { target: [STATIONS.tug - 0.45, 0.95, 0], az: -8, el: 9, dist: 18 }, lit: 'tug', scene: 'tug', look: {},
    fig: "在冰上拉绳子",
  },
  {
    kicker: '2.9', title: "质心加速", sub: "ΣF_ext = Ma_cm",
    body: `<p class="lede"> 为系统的每个部分写出 <i>F</i> = <i>ma</i> 并将它们相加。内力成对抵消，剩下的是整个系统的第二定律：</p>
      <div class="eq">Σ<i>F</i><sub>ext</sub> = <i>M</i> <i>a</i><sub>cm</sub>, &nbsp; <i>M</i> = Σ<i>m</i></div>
      <p>A ${f(BD.m, 1)} kg 块放在冰上的 ${f(BD.Mb, 1)} kg 板上，一根绳子用 ${BD.F} N 拉动板。这超出了静摩擦力可以分配的范围 (μ<sub>s</sub><i>Mg</i> = ${f(BD.Fslip)} N)，因此块滑动。动摩擦力 ${f(BD.f)} N 将木块向前拖动，将木板向后拖动。</p>
      <table class="data">
        <tr><td>块：<i>f</i>/<i>m</i></td><td>${f(BD.aBlock)} m/s²</td></tr>
        <tr><td>板：(<i>F</i> − <i>f</i>)/<i>M</i><sub>板</sub></td><td>${f(BD.aBoard)} m/s²</td></tr>
        <tr><td><b>系统</b>: <i>F</i>/(<i>m</i> + <i>M</i><sub>板</sub>)</td><td>${f(BD.aCm)} m/s²</td></tr>
      </table>
      <p>检查：(${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(BD.aBoard)}) / ${f(BD.M, 1)} = ${f(BD.aCm)} m/s²。对于 <i>a</i><sub>cm</sub> 来说，摩擦力从来不重要。从盘子下面拉开桌布，同样的事情会发生：摩擦力是拖动盘子的唯一因素，它只能给它们μ<i>g</i>.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 4.5, xlabel: 'time (s)', ylabel: 'velocity (m/s)', cursor: 'board', label: 'Velocity of block, board and centre of mass against time',
        series: [{ pts: [[0, 0], [1.1, BD.aBoard * 1.1]], tag: [0.86, BD.aBoard * 0.86 + 0.2, 'board'] }, { cls: 'curve total', pts: [[0, 0], [1.1, BD.aCm * 1.1]], tag: [0.92, BD.aCm * 0.92 - 0.95, 'cm'] }, { pts: [[0, 0], [1.1, BD.aBlock * 1.1]], tag: [0.8, BD.aBlock * 0.8 - 0.75, 'block'] }] })}</div>
      <p class="hintline">箭头：${(F_SCALE * 100).toFixed(0)} 厘米每牛顿。点击抬起木块即可看到摩擦副。</p>`,
    cam: { target: [STATIONS.board + 0.4, 0.5, 0], az: -16, el: 15, dist: 13.5 }, lit: 'board', scene: 'board', look: {},
    fig: "从方块下面拉出一块木板",
  },
  {
    kicker: '2.10', title: "斜面", sub: "倾斜轴",
    body: `<p class="lede">在斜坡上，沿斜坡并垂直于斜坡进行测量。然后重力分成两部分。</p>
      <table class="data">
        <tr><td>沿斜率</td><td><i>mg</i> sin θ = ${f(M.W_PAR)} N</td></tr>
        <tr><td>入斜率</td><td><i>mg</i> cos θ = ${f(M.W_PERP)} N</td></tr>
      </table>
      <p>没有加速进入斜坡，因此法向力抵消了第二部分：<i>F</i><sub>N</sub> = <i>mg</i> cos θ = ${f(M.FN_INC)} N。仅留下沿斜坡的部分：<i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s².</p>
      <p>加摩擦力，当tanθ=μ<sub>k</sub>时，块体匀速滑动。对于 μ<sub>k</sub> = ${f(M.MU_K)} 即 ${f(M.critical(M.MU_K), 1)}°.</p>
      <p class="hintline">单击块以分割其重力。</p>`,
    cam: { target: [STATIONS.incline - 0.2, 1.0, 0], az: -8, el: 12, dist: 12 }, lit: 'incline', scene: 'incline', look: {},
    fig: `${M.THETA_DEG}°斜坡`,
  },
  {
    kicker: "2.11 · AP 物理 C", title: "阻力与 v 成正比", sub: "终端速度",
    body: `<p class="lede">Drag点与速度相反，并随着速度而增长。对于粘稠流体中的小而慢的物体，它与速度成正比： <i>F</i><sub>d</sub> = −<i>bv</i>.</p>
      <p>A ${f(DR.m, 2)} kg 球，<i>b</i> = ${f(DR.b)} kg/s 从静止状态释放。记下为正：</p>
      <div class="eq"><i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i></div>
      <p>首先<i>v</i> = 0且<i>a</i> = <i>g</i>。阻力随着速度的增加而增加，因此合力会缩小。当<i>bv</i> = <i>mg</i>时为零：<b>终端速度</b> <i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> = ${f(DR.vt)} m/s。分隔变量，其中 τ = <i>m</i>/<i>b</i>:</p>
      <div class="eq">d<i>v</i> / (<i>v</i><sub>t</sub> − <i>v</i>) = d<i>t</i> / τ</div>
      <div class="eq">∫<sub>0</sub><sup><i>v</i></sup> d<i>v</i>′/(<i>v</i><sub>t</sub> − <i>v</i>′) = ∫<sub>0</sub><sup><i>t</i></sup> d<i>t</i>′/τ</div>
      <div class="eq">−ln(1 − <i>v</i>/<i>v</i><sub>t</sub>) = <i>t</i>/τ</div>
      <div class="eq"><i>v</i>(<i>t</i>) = <i>v</i><sub>t</sub> (1 − e<sup>−<i>t</i>/τ</sup>)</div>
      <p>这里 τ = ${f(DR.tau)} s。经过一个 τ 后，球的值为 1 − 1/e = 63.2% <i>v</i><sub>t</sub>； 3τ后，95%； 5τ后，99.3%。它永远不会到达那里。</p>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 4.5, xlabel: 'time (s)', ylabel: 'speed (m/s)', cursor: 'drag', label: 'Speed against time approaching terminal velocity',
        series: [{ cls: 'trend', pts: [[0, DR.vt], [2, DR.vt]], tag: [1.62, DR.vt, 'v<tspan dy="3" font-size="8">t</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).v]) }, { cls: 'trend', pts: [[DR.tau, 0], [DR.tau, M.linDrag(DR.tau).v]] }],
        marks: [[DR.tau, M.linDrag(DR.tau).v, `63.2% at τ = ${f(DR.tau, 1)} s`]] })}
        ${chart({ x0: 0, x1: 2, y0: 0, y1: 6, xlabel: 'time (s)', ylabel: 'force (N)', cursor: 'dragF', label: 'Drag and weight against time',
        series: [{ cls: 'trend', pts: [[0, DR.W], [2, DR.W]], tag: [1.2, DR.W, 'weight <tspan font-style="italic">mg</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).D]), tag: [0.5, M.linDrag(0.5).D - 2.2, 'drag <tspan font-style="italic">bv</tspan>'] }] })}</div>
      <p class="hintline">此处箭头：${(DRAG_SCALE * 100).toFixed(0)} 厘米每牛顿。单击球查看其实时自由体图。</p>`,
    cam: { target: [STATIONS.drag, 2.8, 0], az: -10, el: 5, dist: 23 }, lit: 'drag', scene: 'drag', look: {},
    fig: "球受阻力落下 -bv",
  },
  {
    kicker: "2.12 · AP 物理 C", title: "真实流体", sub: "位置，以及拖动定律",
    body: `<p class="lede">对下降的位置再次积分：</p>
      <div class="eq"><i>x</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i> d<i>t</i>′ = <i>v</i><sub>t</sub> [ <i>t</i> − τ (1 − e<sup>−<i>t</i>/τ</sup>) ]</div>
      <p>几个 τ 后，这是 <i>v</i><sub>t</sub>(<i>t</i> − τ): 球下落，就好像它一直在 <i>v</i><sub>t</sub> 一直以来，但开始时间晚了τ（​​下面的虚线）。</p>
      <p>线性阻力适用于粘稠流体中的小而慢的物体。大或快的物体将液体推到一边，阻力随着 <i>kv</i>²，如第 2.5 页上的汽车。然后 <i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>).</p>
      <table class="data">
        <tr><th>坠落</th><th><i>v</i><sub>t</sub></th><th>τ</th><th>拖动</th></tr>
        <tr><td>雾滴，20 µm</td><td>${f(M.drop(1e-5).vLin * 100, 1)} cm/s</td><td>${f(M.drop(1e-5).tau * 1000, 1)} ms</td><td><i>bv</i></td></tr>
        <tr><td>蜂蜜钢球，10 毫米</td><td>${f(HN.vt * 100, 1)} cm/s</td><td>${f(HN.tau * 1000, 1)} ms</td><td><i>bv</i></td></tr>
        <tr><td>雨滴，2 毫米</td><td>${f(M.drop(1e-3).vQuad, 1)} m/s</td><td>—</td><td><i>kv</i>²</td></tr>
      </table>
      <p>对于雨滴来说， <i>bv</i> 会预测 ${f(M.drop(1e-3).vLin, 0)} 多发性硬化症。它实际上以大约 6.5 m/s 的速度下降，因为 <i>kv</i>² 说。</p>
      <p>蜂蜜中的钢珠（按10倍实物尺寸绘制）也有浮力感 <i>B</i>, so <i>mg</i> 变成 <i>mg</i> − <i>B</i> 和 <i>v</i><sub>t</sub> = (<i>mg</i> − <i>B</i>)/<i>b</i>。仅用 τ ${f(HN.tau * 1000, 1)} ms 它的终端速度在不到一毫米的范围内，因此它似乎从一开始就稳定下沉。</p>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 7, xlabel: 'time (s)', ylabel: 'distance fallen (m)', label: 'Distance fallen against time, with its asymptote',
        series: [{ cls: 'trend', pts: [[DR.tau, 0], [2, DR.vt * (2 - DR.tau)]], tag: [1.25, DR.vt * 0.85 - 0.4, 'v<tspan dy="3" font-size="8">t</tspan><tspan dy="-3">(t − τ)</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).x]) }] })}
        ${chart({ x0: 0, x1: 2, y0: 0, y1: 4.5, xlabel: 'time (s)', ylabel: 'speed (m/s), same v_t', label: 'Linear and quadratic drag, same terminal speed',
        series: [{ cls: 'trend', pts: [[0, DR.vt], [2, DR.vt]] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.quadV(i * 0.05)]), tag: [0.18, M.quadV(0.3), 'kv²'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).v]), tag: [0.5, M.linDrag(0.4).v - 1.3, 'bv'] }] })}</div>
      <p><i>kv</i>² 弱于 <i>bv</i> 下面 <i>v</i><sub>t</sub>，所以用同样的 <i>v</i><sub>t</sub> 它很快就会接近： ${(100 * M.quadV(DR.tau) / DR.vt).toFixed(0)}% at <i>t</i> = τ，不是 63%。</p>
      <p class="hintline">箭头在这里： ${HONEY_SCALE} 米每牛顿。单击球以查看其力量。</p>`,
    cam: { target: [STATIONS.honey, 0.68, 0], az: -12, el: 8, dist: 5.6 }, lit: 'honey', scene: 'honey', look: {},
    fig: "钢球沉入蜂蜜中",
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  tug: { text: `浅色盒子是系统：滑冰者和绳子。 A上的张力和B上的张力是内部的；它们相等且相反，所以它们相加为零。每个滑冰者的重力都被冰的法向力抵消。在没有净外力的情况下，质心（四分之一圆盘）无法移动。`,
    facts: s => { const r = M.tug(s.tug.t), xc = M.xcm([TG.mA, TG.mB], [r.xA, r.xB]); return [['x<sub>A</sub>, v<sub>A</sub>', `${f(r.xA)} m, ${f(r.vA)} m/s`], ['x<sub>B</sub>, v<sub>B</sub>', `${f(r.xB)} m, ${f(r.vB)} m/s`], ['x<sub>cm</sub> = Σmx/Σm', `${f(Math.abs(xc) < 5e-3 ? 0 : xc)} m`], ['internal: T on A + T on B', `${TG.T} − ${TG.T} = 0 N`], ['external: ΣF<sub>ext</sub>', '0 N']]; } },
  board: { text: `抬起来，摩擦副显示：木板向前拖动木块，木块向后拖动木块，各为 ${f(BD.f)} N。在区块+董事会系统内，他们取消了。只有拉力 F 是外部的，因此质心以 F/M 加速，介于木块和板的加速度之间。`,
    facts: s => { const t = s.board.t, r = M.board(t); return [['ΣF<sub>ext</sub> = F', `${BD.F} N`], ['M = m + M<sub>board</sub>', `${f(BD.M, 1)} kg`], ['a<sub>cm</sub> = ΣF<sub>ext</sub>/M', `${f(BD.aCm)} m/s²`], ["v<sub>块</sub>，v<sub>板</sub>", `${f(r.vBlock)}, ${f(r.vBoard)} m/s`], ['v<sub>cm</sub>', `${f(M.xcm([BD.m, BD.Mb], [r.vBlock, r.vBoard]))} m/s`]]; } },
  drag: { text: `球收缩到其自由体图：重力向下，阻力向上。阻力为 bv，因此它随着速度而增加，直到与重力相匹配，并且合力（红色）消失。加速度为 g e<sup>−t/τ</sup>：开始时最大，终端速度为零。`,
    facts: s => { const r = M.linDrag(s.drag.t); return [['time', `${f(s.drag.t)} s = ${f(s.drag.t / DR.tau, 1)} τ`], ['speed v', `${f(r.v)} m/s = ${(100 * r.v / DR.vt).toFixed(1)}% of v<sub>t</sub>`], ["拖曳公司", `${f(r.D)} N`], ["体重 毫克", `${f(DR.W)} N`], ["合力，a", `${f(DR.W - r.D)} N, ${f(r.a)} m/s²`]]; } },
  honey: { text: `三种力量已经平衡：体重减轻；阻力和浮力向上。球处于最终速度，因此频闪图像间隔均匀。这里的阻力是线性的，因为雷诺数 ρvd/η（将流体推向一边与其粘性进行比较）远低于 1。`,
    facts: () => [["体重 毫克", `${f(HN.W * 1000, 1)} mN`], ['buoyancy B', `${f(HN.B * 1000, 1)} mN`], ["拖动 bv<sub>t</sub> (b = 6πηr)", `${f(HN.b * HN.vt * 1000, 1)} mN`], ["合力", '0 N'], ['v<sub>t</sub>, τ', `${f(HN.vt * 100, 2)} cm/s, ${f(HN.tau * 1000, 1)} ms`], ["雷诺数", f(HN.Re, 3)]] },
  tension: { text: `每个张力分为水平部分和垂直部分（灰色）。水平部分相等​​且相反，因此它们抵消。两个垂直部分加起来就是重力。琴弦越扁平，每个垂直部分越小，因此张力就越大。`,
    facts: s => { const th = M.hangAngle(s.clock * M.SLOW), T = M.tension2(th), r = th * Math.PI / 180; return [['angle θ', `${th.toFixed(1)}°`], ["每个张力T", `${f(T)} N`], ["垂直部分 T sin θ", `${f(T * Math.sin(r))} N × 2 = ${f(2 * T * Math.sin(r))} N`], ["水平部分 T cos θ", `${f(T * Math.cos(r))} N, cancelling`]]; } },
  plane: { text: `四个力，两个平衡对。请注意，它们不是第三定律对：所有四个定律都在平面上起作用。升力和重力平衡，因为飞机没有爬升或下沉；推力和阻力平衡，因为它的速度没有改变。`,
    facts: () => [['lift − weight', '0 N'], ['thrust − drag', '0 N'], ['acceleration', '0 m/s²'], ['speed', `${M.PLANE.v} m/s, constant`]] },
  car: { text: `重力和法向力抵消。侧面有两种力：来自道路的静摩擦力（向前）和空气阻力（向后）。它们的差异是合力（红色）。`,
    facts: s => { const c = M.car(s.car.t); return [["道路摩擦力（前进）", `${f(M.CAR.F)} N`], ["空气阻力（后）", `${f(c.D)} N`], ["合力", `${f(M.CAR.F - c.D)} N`], ['acceleration', `${f(c.a)} m/s²`], ['speed', `${f(c.v)} m/s`]]; } },
  rest: { text: `该块缩小为一个点，只留下作用在其上的力：它的自由体图。两个大小相等、方向相反的力，因此合力为零，保持静止状态。`,
    facts: () => [["重力 F<sub>g</sub>", `${f(M.W1)} N down`], ["支持力 F<sub>N</sub>", `${f(M.FN)} N up`], ["合力", '0 N']] },
  glide: { text: `自由体图与静止状态下的块相同。 Σ<i>F</i> = 0 并不意味着“不动”。意思是“速度不变”。`,
    facts: s => [['velocity', `${f(M.V_GLIDE)} m/s, constant`], ["合力", '0 N'], ['acceleration', '0 m/s²']] },
  second: { text: `红色箭头是每个块上的合力：相同的 6.0 N。除以每个质量即可得到其加速度。`,
    facts: s => [['2.0 kg: a = 6.0/2.0', `${f(M.A1)} m/s²`], ['4.0 kg: a = 6.0/4.0', `${f(M.A2)} m/s²`], ['time', `${f(s.second.t)} s`]] },
  friction: { text: `四大势力对峙，生死存亡。上下取消。从侧面看，摩擦力与推力相匹配，直到推力经过 ${f(M.F_SMAX)} N。之后摩擦力下降到 ${f(M.F_K)} N，并且差异使块加速。`,
    facts: s => { const r = M.friction(s.friction.t); return [["推送F<sub>app</sub>", `${f(r.F)} N`], [`friction (${r.kind})`, `${f(r.f)} N`], ["合力", `${f(r.F - r.f)} N`], ['acceleration', `${f(r.a)} m/s²`]]; } },
  third: { text: `拉开一会儿，这对很容易看到：A 用 ${f(M.CONTACT, 1)} N 向前推动 B，B 用 ${f(M.CONTACT, 1)} N 将 A 向后推。大小相同，方向相反，在不同的块上。`,
    facts: () => [["F on A（外推）", `${f(M.PUSH, 1)} N →`], ['F<sub>B on A</sub>', `${f(M.CONTACT, 1)} N ←`], ['F<sub>A on B</sub>', `${f(M.CONTACT, 1)} N →`], ["两者都加速于", `${f(M.A_PAIR, 1)} m/s²`]] },
  incline: { text: `重力（垂直向下）被其沿倾斜轴的两个部分所取代。法向力抵消了进入斜坡的部分。沿斜坡的部分是合力，因此块沿着斜坡加速。`,
    facts: () => [["mg sin θ", `${f(M.W_PAR)} N`], ["毫克 cos θ = F<sub>N</sub>", `${f(M.W_PERP)} N`], ['a = g sin θ', `${f(M.A_INC)} m/s²`]] },
};
