// Chapter 3, page by page (after the AP Physics 1 organizer, Units 4 and 6, and AP Physics C
// gravitation and orbits). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_SCALE, ROAD, COASTER, SPACE, ORBIT, WELLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const cm = x => (x * 100).toFixed(x * 100 < 1 ? 1 : 0);
const deg = r => r * 180 / Math.PI;

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
const curve = (x0, x1, fn, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });

const lapW = M.period(M.V1, M.BALL.r);
const vb = M.loopV(0), Nb = M.loopN(0), Nt = M.loopN(Math.PI);
const r1 = M.SAT.r1, r2 = M.SAT.r2, RE = M.EARTH.R;
const Kp = 0.5 * M.SAT_M * M.ELL.vp ** 2, Ka = 0.5 * M.SAT_M * M.ELL.va ** 2;
const dE = M.circE(M.SAT.r2) - M.circE(M.SAT.r1), dU = M.Ugrav(M.SAT.r2) - M.Ugrav(M.SAT.r1);
const F1 = M.gravF(M.SPHERES.m1, M.SPHERES.m2, M.SPHERES.rMin), F3 = M.gravF(M.SPHERES.m1, M.SPHERES.m2, M.SPHERES.rMax);

export const PAGES = [
  {
    kicker: "第三章", title: "圆周运动", sub: "速度稳定，仍在加速",
    body: `<p class="lede">A 球在绳子上旋转，速度保持不变，但始终在加速。它的速度在圆上的每一点都改变<b>方向</b>。</p>
      <p>Velocity 是一个向量：如果其大小 <i>or</i> 其方向改变，它也会改变。该球在 ${f(M.BALL.r)} 米绳上绕 ${f(M.V1, 1)} m/s 的光滑桌子旋转；每⅛圈的微弱图像均匀分布。</p>
      <table class="data">
        <tr><td><i>v</i>（蓝色）</td><td>与圆相切</td></tr>
        <tr><td><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i>（红色）</td><td>${f(M.ac(M.V1, M.BALL.r))} m/s²，到中心，⟂ <i>v</i></td></tr>
        <tr><td><i>T</i> = 2π<i>r</i>/<i>v</i></td><td>${f(lapW)} 每圈</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: -3, y1: 3, xlabel: 'time (s)', ylabel: 'velocity (m/s)', cursor: 'whirl', label: 'One component of the velocity swings while the speed stays constant',
        series: [{ pts: curve(0, 5, t => M.uniform(M.BALL.r, M.V1, t).vx, 120), tag: [0.15, -2.2, 'v<tspan dy="3" font-size="8">x</tspan>'] }, { cls: 'trend', pts: [[0, M.V1], [5, M.V1]], tag: [3.6, M.V1 + 0.1, 'speed'] }] })}</div>
      <p class="hintline">单击球即可找到 Δv。 ${cm(V_SCALE)} 厘米每 m/s，${cm(A_SCALE)} 厘米每 m/s².</p>`,
    cam: { target: [STATIONS.whirl, 0.1, 0.05], az: -18, el: 40, dist: 5.2 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: "从上方看，绳子上的球",
  },
  {
    kicker: '3.1', title: "向心力", sub: "一份工作，而不是一支新力量",
    body: `<p class="lede"> 向中心的加速度需要向中心的合力：Σ<i>F</i> = <i>ma</i><sub>c</sub> = <i>mv</i>²/<i>r</i>。这不是一种新的力，而是任何真正指向内的力：</p>
      <table class="data">
        <tr><td>绳上球</td><td>张力<i>T</i></td></tr>
        <tr><td>摆动桶中的水</td><td>来自桶的法向力</td></tr>
        <tr><td>平弯汽车</td><td>静摩擦力<i>f</i><sub>s</sub></td></tr>
        <tr><td>倾斜曲线上的汽车</td><td>部分法向力</td></tr>
        <tr><td>月球绕地球</td><td>重力<i>F</i><sub>g</sub></td></tr>
      </table>
      <p>此处 <i>F</i><sub>N</sub> = <i>mg</i>，且 <i>T</i> = <i>mv</i>²/<i>r</i>：${f(M.tension(M.V1))} N ${f(M.V1, 1)} m/s、<b>${f(M.tension(M.V2))} N</b> 于 ${f(M.V2, 1)} m/s。双倍速度，四倍张力；半径减半，加倍。</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 6, xlabel: 'speed v (m/s)', ylabel: 'tension T (N)', label: 'Tension grows as speed squared',
        series: [{ pts: curve(0, 5, v => Math.min(M.tension(v), 6)) }], marks: [[M.V1, M.tension(M.V1), `${f(M.tension(M.V1), 1)} N`], [M.V2, M.tension(M.V2), `${f(M.tension(M.V2), 1)} N`, -44, 4]] })}</div>
      <p class="hintline">点击一个球：自由体图。 ${cm(F_SCALE)} 厘米每 N.</p>`,
    cam: { target: [STATIONS.double, 0.1, 0.1], az: -10, el: 38, dist: 11.5 }, lit: 'double', scene: 'double', look: {},
    fig: "2.0 m/s 和 4.0 m/s 在同一串上",
  },
  {
    kicker: '3.2', title: "一辆汽车在弯道上", sub: "摩擦力使转动",
    body: `<p class="lede"> 在平坦的曲线上，汽车上唯一的侧向力是道路的 <b> 静摩擦力 </b>，朝向中心。静态，因为轮胎不会侧滑；它最多可以是μ<sub>s</sub><i>F</i><sub>N</sub>.</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>F</i><sub>N</sub> = <i>mg</i> = ${f(M.CAR.W / 1000)} kN</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>f</i><sub>s</sub> = <i>mv</i>²/<i>r</i> = ${f(M.CAR.f / 1000)} ${f(M.CAR.fmax / 1000)} kN</td></tr>
      </table>
      <p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>;质量取消：</p>
      <div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = ${f(M.CAR.vmax)} m/s</div>
      <p>比这更快，车子沿切线滑出：直上，不向外甩。</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 16, xlabel: 'speed v (m/s)', ylabel: 'friction needed (kN)', cursor: 'flatcar', label: 'Friction needed against speed, and the most the road can give',
        series: [{ pts: curve(0, 12, v => Math.min(M.CAR.m * v * v / M.CAR.r / 1000, 16)) }, { cls: 'trend', pts: [[0, M.CAR.fmax / 1000], [12, M.CAR.fmax / 1000]], tag: [0.3, M.CAR.fmax / 1000 + 0.3, 'μs·mg'] }],
        marks: [[M.CAR.vmax, M.CAR.fmax / 1000, `v<tspan dy="3" font-size="8">max</tspan><tspan dy="-3"> ${f(M.CAR.vmax, 1)}</tspan>`, 8, 18]] })}</div>
      <p class="hintline">单击汽车查看其自由体图。平局1:4； ${cm(ROAD.kN)} 厘米每 kN，${cm(ROAD.v)} 厘米每 m/s.</p>`,
    cam: { target: [STATIONS.flatcar, 0.2, 0.3], az: -14, el: 48, dist: 21 }, lit: 'flatcar', scene: 'flatcar', look: {},
    fig: `${M.CAR.r} m 曲线位于 ${f(M.CAR.v, 1)} m/s`,
  },
  {
    kicker: '3.3', title: "在圆锥体中摆动", sub: "弦倾斜",
    body: `<p class="lede">在绳子上旋转球，绳子无法保持水平：必须有东西支撑球抵抗重力。绳子向下倾斜，直到它的拉力完成这两项工作。</p>
      <p>从垂直方向测量 θ。那么水平部分用sin θ，垂直部分用cos θ：</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>T</i> cos θ = <i>mg</i>，所以<i>T</i> = <i>mg</i>/cos θ = ${f(M.CONE.T)} N</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>T</i> sin θ = <i>mv</i>²/<i>r</i> = ${f(M.CONE.Tx)} N</td></tr>
      </table>
      <p>一分为二，张力取消：</p>
      <div class="eq"><i>g</i> tan θ = <i>v</i>²/<i>r</i> = <i>a</i><sub>c</sub></div>
      <p>这里有一根 ${f(M.CONE.L, 1)} m 弦，在 θ = ${M.CONE.thetaDeg}° 处，轨迹为 <i>r</i> = ${f(M.CONE.r)} m 的圆，因此球必须走 ${f(M.CONE.v)} m/s，每 ${f(M.period(M.CONE.v, M.CONE.r))} 绕一圈s。完美水平的弦是不可能的：没有任何东西可以平衡 <i>mg</i>.</p>
      <p class="hintline">点击球来分散张力。每牛顿力 ${cm(F_SCALE)} 厘米。</p>`,
    cam: { target: [STATIONS.cone, 1.25, 0], az: -14, el: 24, dist: 5.6 }, lit: 'cone', scene: 'cone', look: {},
    fig: `一根 ${f(M.CONE.L, 1)} 米弦，距垂直方向为 ${M.CONE.thetaDeg}°`,
  },
  {
    kicker: '3.4', title: "垂直圆圈", sub: "循环的顶部和底部",
    body: `<p class="lede">在垂直循环中重力加入。在底部和顶部，中心垂直向上或向下，因此合力是垂直的：<i>mv</i>²/<i>r</i>.</p>
      <table class="data eqs">
        <tr><td>底部：<i>F</i><sub>N</sub> − <i>mg</i> = <i>mv</i>²/<i>r</i></td><td><i>F</i><sub>N</sub> = <i>m</i>(<i>v</i>²/<i>r</i> + <i>g</i>) = ${f(Nb / 1000, 1)} kN</td></tr>
        <tr><td>顶部：<i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i></td><td><i>F</i><sub>N</sub> = <i>m</i>(<i>v</i>²/<i>r</i> − <i>g</i>) = ${f(Nt / 1000, 1)} kN</td></tr>
      </table>
      <div class="eq"><i>F</i><sub>N top</sub> = 0: <i>v</i><sub>min</sub> = √(<i>gr</i>) = ${f(M.LOOP.vmin)} m/s</div>
      <p>同样的一桶水在头顶上晃动。这台 ${M.LOOP.m} 公斤车在 ${f(M.LOOP.vTop, 1)} m/s 处到达环路顶部，并到达底部的 ${f(vb, 1)} m/s；在这两者之间，部分合力加速或减慢它。</p>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: 0, y1: 35, xlabel: 'angle round the loop from the bottom (°)', ylabel: 'normal force (kN)', cursor: 'loop', label: 'Normal force round the loop',
        series: [{ pts: curve(0, 360, d => M.loopN(d * Math.PI / 180) / 1000, 90) }, { cls: 'trend', pts: [[0, M.LOOP.W / 1000], [360, M.LOOP.W / 1000]], tag: [8, M.LOOP.W / 1000 + 0.5, 'mg'] }],
        marks: [[180, Nt / 1000, `top ${f(Nt / 1000, 1)}`, 10, -10]] })}</div>
      <p class="hintline">单击购物车获取自由体图。拉伸比例 1:5，力 ${cm(COASTER.kN)} cm/kN.</p>`,
    cam: { target: [STATIONS.loop + 0.75, 1.3, 0], az: -8, el: 6, dist: 12 }, lit: 'loop', scene: 'loop', look: {},
    fig: `一个${f(M.LOOP.r, 0)}米环，${f(M.LOOP.vTop, 0)} m/s在顶部`,
  },
  {
    kicker: '3.5', title: "倾斜曲线", sub: "使道路倾斜",
    body: `<p class="lede">倾斜道路，法向力随之倾斜，倾斜角为 θ。它的水平部分使汽车转动，完全没有摩擦力。</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>F</i><sub>N</sub> θ = <i>mg</i>, <i>F</i><sub>N</sub> = ${f(M.BANK.N / 1000)} kN</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i> = ${f(M.BANK.Nx / 1000)} kN</td></tr>
      </table>
      <div class="eq">tan θ = <i>v</i>²/(<i>rg</i>)</div>
      <p> 每个组有一个适当的速度，√(<i>rg</i> tan θ): ${f(M.BANK.v)} m/s 这里。车子更快地冲上岸；速度较慢，它会滑落。</p>
      <div class="charts">${chart({ x0: 0, x1: 45, y0: 0, y1: 10, xlabel: 'bank angle θ (°)', ylabel: 'proper speed (m/s)', label: 'Proper speed against bank angle for a 10 m curve',
        series: [{ pts: curve(0, 45, d => M.bankSpeed(d)) }], marks: [[M.BANK.thetaDeg, M.BANK.v, `${M.BANK.thetaDeg}°: ${f(M.BANK.v)} m/s`]] })}</div>
      <p class="hintline">点击小车分流法向力。拉伸比例 1:4，力 ${cm(ROAD.kN)} cm/kN.</p>`,
    cam: { target: [STATIONS.bank, 0.3, 0.3], az: -14, el: 30, dist: 21 }, lit: 'bank', scene: 'bank', look: {},
    fig: `倾斜于 ${M.BANK.thetaDeg}°，无摩擦`,
  },
  {
    kicker: '3.6', title: "角速度", sub: 'v = rω',
    body: `<p class="lede"> 旋转圆盘上的每个点在同一时间转过相同的角度：一个 <b> 角速度</b> ω。越远的点覆盖的距离越远，因此移动得越快。</p>
      <table class="data eqs">
        <tr><td>ω = Δθ/<i>t</i></td><td>rad/s（或rpm）</td></tr>
        <tr><td><i>s</i> = <i>r</i>Δθ</td><td>弧长；当 <i>s</i> = <i>r</i></td></tr> 时为 1 弧度
        <tr><td><i>v</i> = <i>r</i>ω</td><td>切向速度； <i>T</i> = 2π/ω</td></tr>
      </table>
      <p>At ω = ${f(M.DISC.w)} rad/s (${f(M.radToRpm(M.DISC.w), 1)} rpm; rpm × 2π/60 = rad/s) ${f(M.DISC.r1)} m 处的程序块在 ${f(M.DISC.v1)} m/s 处移动，两倍远至${f(M.DISC.v2)} m/s。两者每回合都需要 ${f(M.DISC.T)} 秒；质量并不重要。</p>
      <div class="charts">${chart({ x0: 0, x1: 1, y0: 0, y1: 3, xlabel: 'distance from the centre r (m)', ylabel: 'speed v (m/s)', label: 'Speed grows in proportion to radius',
        series: [{ pts: [[0, 0], [1, M.DISC.w]], tag: [0.06, 1.0, 'slope = ω'] }], marks: [[M.DISC.r1, M.DISC.v1, 'v₁'], [M.DISC.r2, M.DISC.v2, 'v₂']] })}</div>
      <p class="hintline">点击圆盘可看到一弧度扫过。</p>`,
    cam: { target: [STATIONS.disc, 0.05, 0.05], az: -16, el: 40, dist: 5.6 }, lit: 'disc', scene: 'disc', look: {},
    fig: `ω = ${f(M.DISC.w, 1)} rad/s`,
  },
  {
    kicker: '3.7', title: "引力", sub: "每个质量都互相拉动",
    body: `<p class="lede">每个质量都相互吸引，其力与两个质量成正比，与它们中心之间的距离的平方成反比。</p>
      <div class="eq"><i>F</i><sub>g</sub> = <i>G m</i><sub>1</sub><i>m</i><sub>2</sub> / <i>r</i>²</div>
      <p><i>G</i> = 6.67 × 10⁻11 N·m²/kg²。这些球体在 ${f(M.SPHERES.rMin, 1)} m（半粒米的重力）下以 ${f(F1 * 1e6, 0)} μN 拉力；三倍，第九：${f(F3 * 1e6, 1)} μN。地球给出 <i>g</i> = <i>GM</i><sub>E</sub>/<i>R</i><sub>E</sub>² = ${f(M.EARTH.g)} m/s²： ${f(M.gravF(M.EARTH.M, M.PERSON, M.EARTH.R), 0)} N上${M.PERSON}公斤人，只是<i>mg</i>.</p>
      <table class="data">
        <tr><td>2<i>m</i><sub>1</sub>，2<i>m</i><sub>2</sub>， 3<i>r</i></td><td>2 × 2 / 3²</td><td>4/9 <i>F</i></td></tr>
        <tr><td>4<i>m</i><sub>1</sub>，<i>m</i><sub>2</sub>， ½<i>r</i></td><td>4 × 1 / 0.5²</td><td>${f(M.ratio(4, 1, 0.5), 0)} <i>F</i></td></tr>
      </table>
      <div class="charts">${chart({ x0: 0.8, x1: 3.2, y0: 0, y1: 220, xlabel: 'distance between centres r (m)', ylabel: 'force (μN)', cursor: 'gravity', label: 'Gravitational force against distance: inverse square',
        series: [{ pts: curve(0.8, 3.2, r => M.gravF(M.SPHERES.m1, M.SPHERES.m2, r) * 1e6, 80) }] })}</div>
      <p class="hintline">点击比较加速度。 ${f(SPACE.uN * 1000, 0)} 毫米/μN.</p>`,
    cam: { target: [STATIONS.gravity + 0.15, 0.85, 0], az: -10, el: 12, dist: 14 }, lit: 'gravity', scene: 'gravity', look: {},
    fig: `${M.SPHERES.m1}公斤和${M.SPHERES.m2}公斤铁`,
  },
  {
    kicker: '3.8', title: "轨道", sub: "绳子上的重力",
    body: `<p class="lede">A圆形轨道卫星是一个串在绳子上的球，以重力为绳子。对于太空中的任何问题，从 <i>F</i><sub>g</sub> = <i>F</i><sub>c</sub>:</p> 开始
      <div class="eq"><i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i> &nbsp;→&nbsp; <i>v</i> = √(<i>GM</i>/<i>r</i>)</div>
      <p>卫星自身质量抵消。代入 <i>v</i> = 2π<i>r</i>/<i>T</i>，则得出开普勒第三定律 <i>T</i>² ∝ <i>r</i>³:</p>
      <div class="eq"><i>T</i>² = (4π²/<i>GM</i>) <i>r</i>³</div>
      <table class="data">
        <tr><th>orbit半径</th><th><i>v</i></th><th><i>T</i></th><th><i>a</i></th></tr>
        <tr><td>2 <i>R</i><sub>E</sub> = ${f(r1 / 1e6 * 1000, 0)} km</td><td>${f(M.orbitV(r1) / 1000)}公里/秒</td><td>${f(M.orbitT(r1) / 3600)} h</td><td>${f(M.orbitA(r1))} m/s²</td></tr>
        <tr><td>4 <i>R</i><sub>E</sub> = ${f(r2 / 1e6 * 1000, 0)} km</td><td>${f(M.orbitV(r2) / 1000)}公里/秒</td><td>${f(M.orbitT(r2) / 3600)} h</td><td>${f(M.orbitA(r2))} m/s²</td></tr>
      </table>
      <p>更高的轨道：更长的周期，<b>更慢的</b>速度。这与圆盘相反，圆盘上的每个点共享一个 ω，并且外侧移动速度最快。真正的轨道是椭圆形，行星位于一个焦点（开普勒第一定律），在相同的时间内扫过相同的面积（他的第二定律）。下一页画一个。</p>
      <p class="hintline">显示快了 3600 倍：这里的一秒就是一小时。每 ${f(1 / ORBIT.draw / 1e6 * 1000, 0)} 公里 1 m； ${cm(ORBIT.v)} 厘米每公里/秒，${cm(ORBIT.a)} 厘米每 m/s².</p>`,
    cam: { target: [STATIONS.orbit, 1.6, 0.2], az: -14, el: 36, dist: 34 }, lit: 'orbit', scene: 'orbit', look: {},
    fig: "绕地球半径 2 倍和 4 倍运行",
  },
  {
    kicker: '3.9', title: "椭圆轨道", sub: "相同时间相同面积",
    body: `<p class="lede">大多数轨道是椭圆形，地球位于一个焦点（开普勒第一定律）。重力对地球中心没有力矩，因此角动量 <i>mvr</i><sub>⊥</sub> 守恒。在近地点和远地点 <i>v</i> ⟂ <i>r</i>:</p>
      <div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub></div>
      <table class="data">
        <tr><td>近地点，2 <i>R</i><sub>E</sub></td><td><i>v</i><sub>p</sub> = ${f(M.ELL.vp / 1000)} 公里/秒</td></tr>
        <tr><td>apogee，6 <i>R</i><sub>E</sub></td><td><i>v</i><sub>a</sub> = ${f(M.ELL.va / 1000)} 公里/秒</td></tr>
      </table>
      <p>三倍远，三分之一快。半径在相同的时间内扫过相同的面积（开普勒第二定律）；他的第三个持有半长轴 <i>a</i> 为 <i>r</i>.</p>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: 0, y1: 8, xlabel: 'angle from perigee (°)', ylabel: 'speed (km/s)', cursor: 'kepler', label: 'Speed round the ellipse: fastest at perigee, slowest at apogee',
        series: [{ pts: curve(0, 360, d => M.ellV(d * Math.PI / 180) / 1000, 120) }],
        marks: [[180, M.ELL.va / 1000, `apogee ${f(M.ELL.va / 1000)}`, -36, -12]] })}</div>
      <p class="hintline">单击近地点和远地点。楔子：每次一小时（蓝色：最后一个）。 3600×； ${cm(ORBIT.v)} 厘米每公里/秒.</p>`,
    cam: { target: [STATIONS.kepler + 0.6, 1.8, 0.3], az: -6, el: 62, dist: 41 }, lit: 'kepler', scene: 'kepler', look: {},
    fig: "近地点 2、远地点 6 地球半径",
  },
  {
    kicker: '3.10', title: "轨道上的能量", sub: "动力贸易和潜在贸易",
    body: `<p class="lede">只有重力起作用，且重力是保守的，因此卫星-地球系统保持其机械能：</p>
      <div class="eq">½<i>mv</i>² − <i>GMm</i>/<i>r</i> = <i>E</i>, constant</div>
      <p>向近地点坠落，重力有一部分沿着 <i>v</i>。它有正的作用： <i>U</i> = −<i>GMm</i>/<i>r</i> 滴和 <i>K</i> 增长同样多。爬出去时，同样的部分会减慢速度。</p>
      <table class="data">
        <tr><th>${M.SAT_M} kg</th><th><i>K</i></th><th><i>U</i></th><th><i>E</i></th></tr>
        <tr><td>近地点</td><td>${f(Kp / 1e9, 1)} GJ</td><td>${f(M.Ugrav(M.ELL.rp) / 1e9, 1)} GJ</td><td>${f(M.ELL.E / 1e9, 1)} GJ</td></tr>
        <tr><td>远地点</td><td>${f(Ka / 1e9, 1)} GJ</td><td>${f(M.Ugrav(M.ELL.ra) / 1e9, 1)} GJ</td><td>${f(M.ELL.E / 1e9, 1)} GJ</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: -35, y1: 25, xlabel: 'angle from perigee (°)', ylabel: 'energy (GJ)', label: 'Kinetic, potential and total energy round the ellipse',
        series: [{ pts: curve(0, 360, d => 0.5 * M.SAT_M * M.ellV(d * Math.PI / 180) ** 2 / 1e9, 120), tag: [172, 5, 'K'] },
                 { pts: curve(0, 360, d => M.Ugrav(M.ellR(d * Math.PI / 180)) / 1e9, 120), tag: [172, -20, 'U'] },
                 { cls: 'curve total', pts: [[0, M.ELL.E / 1e9], [360, M.ELL.E / 1e9]], tag: [262, M.ELL.E / 1e9 + 0.5, 'E = K + U'] }] }).replace('</svg>', '<circle class="cursor" r="4.5" data-cursor="orbitK"/><circle class="cursor" r="4.5" data-cursor="orbitU"/></svg>')}</div>
      <p class="hintline">单击卫星可沿和横向分割重力 <i>v</i>. ${f(ORBIT.kN * 100, 0)} 厘米每千牛；酒吧 ${f(ORBIT.GJ * 100, 0)} 厘米每吉焦。</p>`,
    cam: { target: [STATIONS.orbitE + 0.1, 1.9, 0.3], az: -6, el: 36, dist: 36 }, lit: 'orbitE', scene: 'orbitE', look: {},
    fig: `一颗${M.SAT_M}公斤卫星，K+U=E`,
  },
  {
    kicker: "3.11 · AP 物理 C", title: "势能", sub: "U = −GMm/r，无穷远为零",
    body: `<p class="lede">远离地面<i>g</i>发生变化，<i>mgh</i>发生故障。无穷远时设置 <i>U</i> = 0；积分 <i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²:</p>
      <div class="eq"><i>U</i> = −∫<sub>∞</sub><sup><i>r</i></sup> <i>F</i><sub>r</sub> d<i>r</i>′ = <i>GMm</i>[−1/<i>r</i>′]<sub>∞</sub><sup><i>r</i></sup> = −<i>GMm</i>/<i>r</i></div>
      <p>为负值，因为重力将 <i>m</i> 从无穷远拉近做正功。只有差异才重要，-d<i>U</i>/d<i>r</i> 会返回 <i>F</i><sub>r</sub>。靠近地面时，<i>r</i> = <i>R</i> + <i>h</i> 其中 <i>h</i> ≪ <i>R</i>:</p>
      <div class="eq">Δ<i>U</i> ≈ (<i>GMm</i>/<i>R</i>²) <i>h</i> = <i>mgh</i></div>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 130, xlabel: 'height h (Earth radii)', ylabel: 'ΔU from the ground (GJ)', label: 'mgh against the exact change in potential energy, 1000 kg',
        series: [{ pts: curve(0, 2, h => (M.Ugrav(RE * (1 + h)) - M.Ugrav(RE)) / 1e9), tag: [1.5, 34, 'exact'] }, { cls: 'trend', pts: curve(0, 2, h => M.SAT_M * M.EARTH.g * h * RE / 1e9, 2), tag: [1.25, 96, 'mgh'] }] })}</div>
      <p class="hintline"><i>mgh</i> 100 公里高度为 ${f(100e3 / M.EARTH.R * 100, 1)}%；单击曲线。每 ${f(1 / ORBIT.draw / 1e6 * 1000, 0)} 公里宽 1 m，每 GJ 下 ${cm(WELLS.GJ)} 厘米，每 kN ${cm(WELLS.kN)} 厘米。</p>`,
    cam: { target: [STATIONS.well + 3.8, 1.3, 0], az: -8, el: 10, dist: 30 }, lit: 'well', scene: 'well', look: {},
    fig: `${M.SAT_M} kg 卫星的 U(r)`,
  },
  {
    kicker: "3.12 · AP 物理 C", title: "逃脱", sub: "限制在零以下",
    body: `<p class="lede"> 在圆形轨道上 <i>mv</i>² = <i>GMm</i>/<i>r</i>，所以 <i>K</i> = −<i>U</i>/2 和 </p>
      <div class="eq"><i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i></div>
      <p>将${M.SAT_M} kg从2增加到4 <i>R</i><sub>E</sub>花费${f(dE / 1e9, 1)} GJ，但最终会变慢：<i>U</i>获得${f(dU / 1e9, 1)} GJ， <i>K</i> 输 ${f(dE / 1e9, 1)}。要达到 <i>r</i> → ∞ 需要 <i>E</i> ≥ 0:</p>
      <div class="eq">½<i>mv</i>² = <i>GMm</i>/<i>R</i> → <i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>R</i>)</div>
      <p>${f(M.vEsc(M.EARTH.R) / 1000, 1)} km/s 距地面任意方向； ${f(M.LAUNCH.vesc / 1000)} km/s = √2 <i>v</i><sub>c</sub> 来自 2 <i>R</i><sub>E</sub>。在它的下面是一个椭圆；对它来说，是一条抛物线；上面是一条双曲线。</p>
      <div class="charts">${chart({ x0: 1.6, x1: 8, y0: -40, y1: 10, xlabel: 'circular orbit radius (Earth radii)', ylabel: 'energy (GJ)', label: 'U(r) with the total energy and kinetic energy of circular orbits at 2 and 4 Earth radii',
        series: [{ pts: curve(1.6, 8, x => M.Ugrav(x * RE) / 1e9, 90), tag: [5.6, -17, 'U(r)'] },
          ...[2, 4].flatMap(x => [{ cls: 'curve total', pts: [[x - 0.35, M.circE(x * RE) / 1e9], [x + 0.35, M.circE(x * RE) / 1e9]], tag: [x + 0.35, M.circE(x * RE) / 1e9 - 1, 'E'] },
            { cls: 'trend', pts: [[x, M.Ugrav(x * RE) / 1e9], [x, M.circE(x * RE) / 1e9]], tag: [x - 0.02, (M.Ugrav(x * RE) + M.circE(x * RE)) / 2e9 - 2, 'K'] }]),
          { cls: 'trend', pts: [[6.3, 0], [8, 0]], tag: [5.2, 1, 'escape: E ≥ 0'] }],
        marks: [[2, M.Ugrav(2 * RE) / 1e9, '2 R<tspan dy="3" font-size="8">E</tspan>', 6, 12], [4, M.Ugrav(4 * RE) / 1e9, '4 R<tspan dy="3" font-size="8">E</tspan>', 6, 12]] })}</div>
      <p class="hintline">单击启动以比较速度。如图所示为${M.ESC_TIME}×； ${cm(ORBIT.v)} 厘米每公里/秒.</p>`,
    cam: { target: [STATIONS.escape - 0.8, 1.4, -2.4], az: -8, el: 52, dist: 42 }, lit: 'escape', scene: 'escape', look: {},
    fig: "从 2 个地球半径侧面发射",
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  whirl: { text: `取两个时刻的速度，${f(deg(M.DPHI), 0)}° 圆分开，并从一点画出这两个时刻的速度。变化 Δ<i>v</i> = <i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>（红色）指向圆心。缩短它们之间的时间，Δ<i>v</i>/Δ<i>t</i> 正好变成 <i>v</i>²/<i>r</i>，始终瞄准中心。`,
    facts: () => { const dt = M.DPHI * M.BALL.r / M.V1; return [['Δv = 2v sin(Δθ/2)', `${f(M.deltaV(M.V1, M.DPHI))} m/s`], ['Δt', `${f(dt, 3)} s`], ['Δv / Δt', `${f(M.avgAccel(M.V1, M.BALL.r, M.DPHI))} m/s²`], ['v²/r (Δt → 0)', `${f(M.ac(M.V1, M.BALL.r))} m/s²`]]; } },
  double: { text: `每个球都收缩成一个点：它的自由体图。上下移动，桌子的推力抵消了重力。唯一的侧向力是弦，因此张力 <i>is</i> 是合力（红色），指向销钉。`,
    facts: () => [['F<sub>N</sub> = mg', `${f(M.BALL.m * M.G)} N, both`], [`T at ${f(M.V1, 1)} m/s`, `${f(M.tension(M.V1))} N`], [`T at ${f(M.V2, 1)} m/s`, `${f(M.tension(M.V2))} N`], ['ratio', `(${f(M.V2 / M.V1, 0)})² = ${f(M.tension(M.V2) / M.tension(M.V1), 0)}`]] },
  flatcar: { text: `汽车缩小为一个点：重力和法向力抵消；朝向中心的静摩擦力是合力。虚线是如果摩擦消失，汽车在冰上行驶的方向：沿着切线直线行驶。`,
    facts: () => [['f<sub>s</sub> = mv²/r', `${f(M.CAR.f)} N`], ["μ<sub>s</sub> F<sub>N</sub>（极限）", `${f(M.CAR.fmax)} N`], ['a<sub>c</sub> = v²/r', `${f(M.CAR.v ** 2 / M.CAR.r)} m/s²`], ['v<sub>max</sub> = √(μ<sub>s</sub> g r)', `${f(M.CAR.vmax)} m/s`]] },
  cone: { text: `张力分为垂直部分（将球保持在 <i>mg</i> 上）和水平部分（指向圆心）。水平部分是整个合力（红色）。`,
    facts: () => [['T', `${f(M.CONE.T)} N`], ['T cos θ = mg', `${f(M.CONE.Ty)} N`], ['T sin θ = mv²/r', `${f(M.CONE.Tx)} N`], ['tan θ = v²/(rg)', `${f(Math.tan(M.CONE.th), 3)}`]] },
  loop: { text: `顶部和底部的自由体图。在底部，轨道向上推，并且还必须克服重力：${f(Nb / M.LOOP.W, 1)} × 重力。在顶部，轨道和重力都向下推向中心；他们一起制作了 <i>mv</i>²/<i>r</i>。`,
    facts: () => [["底部：F<sub>N</sub>", `${f(Nb / 1000)} kN at ${f(vb)} m/s`], ["顶部：F<sub>N</sub>", `${f(Nt / 1000)} kN at ${f(M.LOOP.vTop)} m/s`], ["体重 毫克", `${f(M.LOOP.W / 1000)} kN`], ['v<sub>min</sub> = √(gr)', `${f(M.LOOP.vmin)} m/s`]] },
  bank: { text: `法向力分为垂直部分（精确平衡重力）和水平部分（朝向中心）。该水平部分是合力（红色）。在适当的速度下不需要摩擦。`,
    facts: () => [['F<sub>N</sub> = mg / cos θ', `${f(M.BANK.N)} N`], ["F<sub>N</sub> cos θ = mg", `${f(M.BANK.Ny)} N`], ["F<sub>N</sub> sin θ = mv²/r", `${f(M.BANK.Nx)} N`], ["适当的速度", `${f(M.BANK.v)} m/s`]] },
  disc: { text: `在同一时刻，两个块都转动一个弧度。外弧长两倍，因为 <i>s</i> = <i>r</i>θ。同样的时间，两倍的距离：两倍的速度。`,
    facts: () => [['Δθ', '1 rad = 57.3°'], ['s₁ = r₁ × 1 rad', `${f(M.DISC.r1)} m`], ['s₂ = r₂ × 1 rad', `${f(M.DISC.r2)} m`], ["1 rad 的时间", `${f(1 / M.DISC.w)} s`]] },
  gravity: { text: `这两个拉力是第三定律对：大小相等，方向相反，尽管一个球体的质量是其两倍。它们的加速度（红色，<i>a</i> = <i>F</i>/<i>m</i>）不相等：较轻的球体获得两倍的加速度。`,
    facts: s => { const r = M.sep(s.clock), F = M.gravF(M.SPHERES.m1, M.SPHERES.m2, r); return [['r', `${f(r)} m`], ['F<sub>12</sub> = F<sub>21</sub>', `${f(F * 1e6, 1)} μN`], ['a₁ (1000 kg)', `${f(F / M.SPHERES.m1 * 1e9, 1)} × 10⁻⁹ m/s²`], ['a₂ (2000 kg)', `${f(F / M.SPHERES.m2 * 1e9, 1)} × 10⁻⁹ m/s²`]]; } },
  orbit: { text: `弧线显示每颗卫星在同一小时内运行的距离。内一扫${f(deg(3600 * M.orbitV(r1) / r1), 0)}°；外层只有${f(deg(3600 * M.orbitV(r2) / r2), 0)}°。与圆盘上的点不同，轨道不共享角速度：距离越远，各方面速度就越慢。`,
    facts: () => [['T₁², T₂² ÷ r³', `${(M.orbitT(r1) ** 2 / r1 ** 3).toExponential(3)} s²/m³, both`], ['4π² / GM', `${(4 * Math.PI ** 2 / M.GM).toExponential(3)} s²/m³`], ['T₂ / T₁', `${f(M.orbitT(r2) / M.orbitT(r1))} = 2√2`], ['v₂ / v₁', `${f(M.orbitV(r2) / M.orbitV(r1), 3)} = 1/√2`]] },
  kepler: { text: `卫星在近地点和远地点。在这两种情况下，<i>v</i> 都是 ⟂ <i>r</i>，因此 <i>L</i> = <i>mvr</i>。距离是原来的三倍，移动速度是原来的三分之一。一小时长的楔形物面积相等：靠近地球的楔形物短而宽，远离地球的楔形物又长又薄。`,
    facts: () => [['r<sub>p</sub> v<sub>p</sub>', `${f(M.ELL.rp * M.ELL.vp / 1e10, 3)} × 10¹⁰ m²/s`], ['r<sub>a</sub> v<sub>a</sub>', `${f(M.ELL.ra * M.ELL.va / 1e10, 3)} × 10¹⁰ m²/s`], ["每小时面积 (RK4)", `${f(M.swept(0, M.SWEEP) / 1e12, 1)} × 10¹² m²`], ['T = 2π√(a³/GM)', `${f(M.ELL.T / 3600)} h`]] },
  orbitE: { text: `重力（红色）分成沿速度方向的部分和沿速度方向的部分。只有沿 <i>v</i> 的部分起作用：它在卫星进入时加速卫星在离开时减慢速度。在近地点和远地点它消失，并且速度达到极限。`,
    facts: s => { const p = M.ELL.track.at(s.clock * M.ORBIT_TIME), K = 0.5 * M.SAT_M * p.v ** 2, U = M.Ugrav(p.r); return [['r', `${f(p.r / RE)} R<sub>E</sub>`], ['K = ½mv²', `${f(K / 1e9)} GJ`], ['U = −GMm/r', `${f(U / 1e9)} GJ`], ['E = K + U', `${f((K + U) / 1e9)} GJ`]]; } },
  well: { text: `红线是 <i>U</i>(<i>R</i>) + <i>mgh</i>，即地面上坡度为 <i>mg</i> 的曲线的切线。适用于小型<i>h</i>；随着 <i>g</i> 的减弱，在更高的位置，真实曲线变平，并且它永远不会达到零，而该线在地球半径向上一个位置处与零相交。`,
    facts: s => { const r = M.wellR(s.clock); return [['r', `${f(r / RE)} R<sub>E</sub>`], ['U = −GMm/r', `${f(M.Ugrav(r) / 1e9)} GJ`], ['F = GMm/r²', `${f(M.GM * M.SAT_M / r ** 2 / 1000)} kN`], ['U(R) + mgh', `${f((M.Ugrav(RE) + M.SAT_M * M.EARTH.g * (r - RE)) / 1e9)} GJ`]]; } },
  escape: { text: `四种发射速度并排，全部从同一点侧向发射。 <i>E</i>的符号决定：零以下，球受束缚并回圆；当速度为零时，它只是逃逸，在很远的地方它的速度趋于零；高于零时，它会留下多余的速度。`,
    facts: () => M.LAUNCH.list.map(o => [`${o.name}: ${f(o.v0 / 1000)} km/s`, `E ${Math.abs(o.E) < 1 ? '0' : f(o.E * M.SAT_M / 1e9, 1)} GJ`]) },
};
