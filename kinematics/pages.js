// The chapter, page by page: text on the left, and for the figure on the right the camera,
// the one lit thing and what is shown. Every number comes from model.js.
import * as M from './model.js';
import { ST, RAIN_V, RIV, PULLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const tau = M.STROBE;
const deg = r => (r * 180 / Math.PI).toFixed(1);

// ---------- small SVG charts for pages 1.7–1.10 (live parts are updated in main.js) ----------
const CW = 420, CH = 86, CP = { l: 40, r: 12, t: 9, b: 19 };
export const KR = {
  rain: { x0: 0, x1: 30, y0: 0, y1: 90 },
  map: { x0: -2, x1: 16, y0: 0, y1: 24 },
  pa: { x0: 0, x1: 5, y0: 0, y1: 6 }, pv: { x0: 0, x1: 5, y0: 0, y1: 12 }, px: { x0: 0, x1: 5, y0: 0, y1: 45 },
  cx: { x0: 0, x1: 2, y0: -3, y1: 3 }, cv: { x0: 0, x1: 2, y0: -3, y1: 9 }, ca: { x0: 0, x1: 2, y0: 0, y1: 12 },
};
export const KC = {
  sx: (x, R) => CP.l + (x - R.x0) / (R.x1 - R.x0) * (CW - CP.l - CP.r),
  sy: (y, R) => CP.t + (1 - (y - R.y0) / (R.y1 - R.y0)) * (CH - CP.t - CP.b),
};
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
function kchart(R, { series, xlabel, ylabel, label, live = '', marks = [] }) {
  const sx = x => KC.sx(x, R), sy = y => KC.sy(y, R);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = R.y0 < 0 ? `<line class="zero" x1="${CP.l}" x2="${CW - CP.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v);
  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="${label}">
    <rect class="frame" x="${CP.l}" y="${CP.t}" width="${CW - CP.l - CP.r}" height="${CH - CP.t - CP.b}"/>${zero}${live}${paths}${mk}
    <text class="ax" x="${CP.l - 6}" y="${sy(R.y1) + 4}" text-anchor="end">${fmt(R.y1)}</text><text class="ax" x="${CP.l - 6}" y="${sy(R.y0) + 4}" text-anchor="end">${fmt(R.y0)}</text>
    <text class="ax" x="${CP.l}" y="${CH - 7}">${R.x0}</text><text class="ax" x="${CW - CP.r}" y="${CH - 7}" text-anchor="end">${R.x1}</text>
    <text class="lab" x="${CP.l + 6}" y="${CP.t + 13}">${ylabel}</text><text class="ax" x="${(CP.l + CW - CP.r) / 2}" y="${CH - 7}" text-anchor="middle">${xlabel}</text>
  </svg>`;
}
// live pieces: a shaded area (filled by main.js), a red tangent, a cursor
const AREA = k => `<path data-area="${k}" style="fill:rgba(229,72,77,.18);stroke:none"/>`;
const TAN = k => `<line data-tan="${k}" style="stroke:#e5484d;stroke-width:1.4"/>`;
const CUR = k => `<circle class="cursor" r="4.5" data-cursor="${k}"/>`;

export const PAGES = [
  {
    kicker: "第一章", title: "运动学", sub: "运动的描述",
    body: `<p class="lede">运动学用三个量描述运动：物体在哪里、运动得多快，以及速度如何变化。它不讨论运动的原因。</p><p>本章从一个以 ${f(M.VY0)} m/s 的初速度竖直向上抛出的小球开始。离手后，小球只受重力，因此始终做自由落体运动；上升和下落阶段都是如此。</p><p>小球上升 ${f(M.T / 2)} s，在抛出点上方 ${f(M.H)} m 处瞬时速度为零，并在抛出 ${f(M.T)} s 后回到原高度。右侧动画以半速播放。</p>`,
    cam: { target: [-1.0, 2.7, 0], az: 22, el: 7, dist: 21 }, lit: 'ball', look: { strobe: 1, level: 1 },
    fig: "一个球直接向上抛",
  },
  {
    kicker: '1.1', title: "位置", sub: "位移和路程",
    body: `<p class="lede"><b>位置</b> <i>y</i> 表示小球相对坐标原点的位置。这里以抛出点为原点，规定竖直向上为正方向。</p><p><b>位移</b> Δ<i>y</i> = <i>y</i><sub>f</sub> − <i>y</i><sub>0</sub> 是位置的变化量。位移是矢量，既有大小，也有方向；图中坐标轴旁的黑色箭头表示位移。</p><p><b>路程</b> 是运动路径的总长度。它是标量，不会为负。</p><table class="data"><tr><th></th><th>位移</th><th>路程</th></tr><tr><td>抛出点 → 最高点</td><td>+${f(M.H)} m</td><td>${f(M.H)} m</td></tr><tr><td>抛出点 → 回到原高度</td><td>0.00 m</td><td>${f(2 * M.H)} m</td></tr></table>`,
    cam: { target: [-0.3, 2.9, 0], az: -16, el: 6, dist: 15 }, lit: 'staff', look: { disp: 1 },
    fig: "位置轴",
  },
  {
    kicker: '1.2', title: "速度", sub: "和速度，这是不一样的",
    body: `<p class="lede"><b>平均速度</b> <i>v</i> = Δ<i>y</i>/Δ<i>t</i> 描述位置变化的快慢和方向。<b>速率</b> 只表示运动的快慢，不包含方向。</p><p>图中的箭头表示瞬时速度。它从 +${f(M.VY0)} m/s 开始，在最高点减小到零；随后向下增大，回到抛出高度时为 −${f(M.VY0)} m/s。抛出和返回时的速率相同，速度则方向相反。</p><p>对整个往返过程，平均速度和平均速率也有区别：</p><table class="data"><tr><td>平均速度</td><td>Δ<i>y</i>/Δ<i>t</i> = 0 / ${f(M.T)} = 0 m/s</td></tr><tr><td>平均速率</td><td>路程/Δ<i>t</i> = ${f(2 * M.H)} / ${f(M.T)} = ${f(2 * M.H / M.T)} m/s</td></tr></table>`,
    cam: { target: [0.1, 3.0, 0.2], az: 24, el: 8, dist: 18 }, lit: 'vArrow', look: {},
    fig: "速度",
  },
  {
    kicker: '1.3', title: "加速度", sub: "速度变化率",
    body: `<p class="lede"><b>加速度</b> <i>a</i> = Δ<i>v</i>/Δ<i>t</i>。小球在上升、到达最高点和下落时，加速度始终是 −${f(M.G)} m/s²；红色箭头保持不变。</p><p>半透明小球表示每隔 ${f(tau, 1)} s 记录一次的位置。上升时，相邻位置的间距每次减少 <i>g</i>τ² = ${f(M.G * tau * tau)} m；下落时，小球依次经过相同的高度。</p><p><b>怎样判断加速还是减速？</b>比较速度与加速度的符号。二者异号时，速率减小，对应上升阶段；二者同号时，速率增大，对应下落阶段。两种情况下都存在加速度。</p><p class="live" id="live-sign"></p>`,
    cam: { target: [0.1, 2.75, 0], az: -6, el: 5, dist: 15.5 }, lit: 'aArrow', look: { strobe: 1 },
    fig: "频闪，每个" + tau.toFixed(1) + ' s',
  },
  {
    kicker: '1.4', title: "动态图", sub: "斜坡和区域",
    body: `<p class="lede">这三个图绘制了同一航班。位置图按比例绘制：其高度是球的真实高度。</p>
      <ul class="rules">
        <li> <i>x</i>–<i>t</i> 的斜率 = 速度</li>
        <li> <i>v</i>–<i>t</i> 的斜率 = 加速度</li>
        <li><i>v</i>–<i>t</i>下的面积=位移</li>
        <li> <i>a</i>–<i>t</i> 下的面积 = 速度变化 </li>
      </ul>
      <p> 恒定加速度给出一条平坦的 <i>a</i>–<i>t</i> 线、一条直线 <i>v</i>–<i>t</i> 线以及一条 <i>x</i>–<i>t</i> 的抛物线。每张图都比上面的图低一个“幂”。</p>
      <p class="hintline">单击图形查看其斜率和面积。</p>`,
    cam: { target: [-7.6, 3.0, -1.0], az: 0, el: 3, dist: 40 }, lit: 'boardX', look: { level: 1 },
    fig: "位置、速度和加速度随时间的变化",
  },
  {
    kicker: '1.5', title: "运动学方程", sub: "仅适用于恒定加速度",
    body: `<p class="lede"> 有五个量描述此运动：Δ<i>y</i>、<i>v</i><sub>0</sub>、<i>v</i>、<i>a</i>、<i>t</i>。每个方程都遗漏了一个，因此请选择没有您不知道且不需要的数量的方程。</p>
      <table class="data eqs">
        <tr><th>equation</th><th>省略</th></tr>
        <tr><td><i>v</i> = <i>v</i><sub>0</sub> + <i>at</i></td><td>Δ<i>y</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²</td><td><i>v</i></td></tr>
        <tr><td><i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i></td><td><i>t</i></td></tr>
        <tr><td>Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i></td><td><i>a</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>vt</i> − ½<i>at</i>²</td><td><i>v</i><sub>0</sub></td></tr>
      </table>
      <p>有多高？在顶部，<i>v</i> = 0，并且不需要 <i>t</i>： 0 = ${f(M.VY0)}² + 2(−${f(M.G)})Δ<i>y</i>，因此 Δ<i>y</i> = ${f(M.H)} m.</p>`,
    cam: { target: [-3.2, 3.1, -0.4], az: 20, el: 15, dist: 34 }, lit: 'ball', look: { level: 1 },
    fig: "一次航班，五个数量",
  },
  {
    kicker: '1.6', title: "抛射运动", sub: "同时进行两个动作",
    body: `<p class="lede">同时抛出第二个球，同样向上 ${f(M.VY0)} 米/秒，加上 ${f(M.VX)} 米/秒横向。</p>
      <p>它始终与第一个球保持水平并同时落地。垂直运动是自由落体，横向速度不会改变它。它在地板上的影子以相等的速度移动 ${f(M.VX * tau)} m步：水平运动匀速。</p>
      <table class="data cols">
        <tr><th>水平·均匀</th><th>垂直·自由落体</th></tr>
        <tr><td><i>v</i><sub>x</sub> = ${f(M.VX)} m/s</td><td><i>v</i><sub>0</sub> = ${f(M.VY0)} m/s, <i>v</i> = −${f(M.VY0)} m/s</td></tr>
        <tr><td>Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(M.RANGE, 1)} m</td><td><i>a</i> = −${f(M.G)} m/s², Δ<i>y</i> = 0</td></tr>
        <tr><td><i>t</i> = ${f(M.T)} s</td><td><i>t</i> = ${f(M.T)} s</td></tr>
      </table>
      <p>顶部仅垂直部分 <i>v</i><sub>y</sub> 为零。球仍向一侧移动 ${f(M.VX)} m/s.</p>`,
    cam: { target: [4.6, 2.7, 0.6], az: -16, el: 13, dist: 33 }, lit: 'projV', look: { proj: 1, comp: 1 },
    fig: "相同的高度，每一个瞬间",
  },
  {
    kicker: '1.7', title: "参考系", sub: "速度取决于谁在看",
    body: `<p class="lede">每个速度都是相对于某物来测量的。降雨 ${f(M.RAIN.vr, 1)} m/s 相对于道路垂直向下；从执行 ${f(M.RAIN.vc, 1)} m/s 的汽车来看，它倾斜于 ${f(M.vlen(M.V_RC))} m/s.</p>
      <p>写<i>v</i><sub>AB</sub>表示“A相对于B”（R雨，C车，G地）。速度链，内字母匹配：</p>
      <div class="eq"><i>v</i><sub>AC</sub> = <i>v</i><sub>AB</sub> + <i>v</i><sub>BC</sub></div>
      <p>所以 <i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>,添加尖端到尾巴。交换字母会翻转箭头：从汽车开始，道路向后移动，<i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>。两部分成直角，因此|<i>v</i><sub>RC</sub>| = √(${f(M.RAIN.vc, 1)}² + ${f(M.RAIN.vr, 1)}²) = ${f(M.vlen(M.V_RC))} m/s，tan θ = ${f(M.RAIN.vc, 1)}/${f(M.RAIN.vr, 1)}，距垂直方向 θ = ${f(M.RAIN_ANGLE, 1)}°。更快的车，更倾斜：</p>
      <div class="charts">${kchart(KR.rain, { xlabel: 'car speed (m/s)', ylabel: 'slant θ from vertical (°)', label: 'The rain’s slant, seen from the car, against the car’s speed',
        series: [{ pts: samples(60, 0, 30, M.rainAngleAt) }], marks: [[M.RAIN.vc, M.RAIN_ANGLE, `${f(M.RAIN_ANGLE, 1)}°`, 8, 16]] })}</div>
      <p class="hintline">1:1绘制。箭头 ${(RAIN_V * 100).toFixed(0)} 厘米每 m/s。 1/4 速度。单击三角形以获取角度。</p>`,
    cam: { target: [ST.rain + 11, 2.3, 0], az: -8, el: 10, dist: 60 }, lit: 'rainSum', look: {}, scene: 'rain',
    fig: "一样的雨，两帧",
  },
  {
    kicker: '1.8', title: "过一条河", sub: "两种速度，从头到尾添加",
    body: `<p class="lede">A 船相对于岸的速度是其在水中的速度加上水相对于岸的速度：</p>
      <div class="eq"><i>v</i><sub>BS</sub> = <i>v</i><sub>BW</sub> + <i>v</i><sub>WS</sub></div>
      <p>两艘船通过${f(M.RIVER.vw, 1)} m/s处的水流进行${f(M.RIVER.vb, 1)} m/s，穿过${M.RIVER.w} m.</p>
      <table class="data">
        <tr><th>m/s，s，m</th><th>aimed直通</th><th>aimed ${deg(M.AIM_UP)}°上游</th></tr>
        <tr><td>速度</td><td>√(${f(M.RIVER.vb, 1)}² + ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(0)))}</td><td>√(${f(M.RIVER.vb, 1)}²−${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(M.AIM_UP)))}</td></tr>
        <tr><td>时间</td><td>${M.RIVER.w}/${f(M.RIVER.vb, 1)} = ${f(M.crossTime(0), 1)} s</td><td>${M.RIVER.w}/${f(M.vBS(M.AIM_UP)[1], 1)} = ${f(M.crossTime(M.AIM_UP), 1)} s</td></tr>
        <tr><td>drift</td><td>${f(M.RIVER.vw, 1)} × ${f(M.crossTime(0), 1)} = ${f(M.drift(0), 1)} m</td><td>0 m</td></tr>
      </table>
      <p>只有横过的部分才有船过去，所以直过最快；水流只是把它带到下游。要在对面着陆，请向上游转向，直到 sin θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)}.</p>
      <div class="charts">${kchart(KR.map, { xlabel: 'downstream (m)', ylabel: 'across (m)', label: 'Both boats’ paths seen from above',
        live: CUR('boatA') + CUR('boatB'), series: [{ pts: [[0, 0], [M.drift(0), M.RIVER.w]], tag: [8.6, 12.5, 'straight across'] }, { pts: [[0, 0], [0, M.RIVER.w]], tag: [0.3, 3, 'upstream'] }] })}</div>
      <p class="hintline">绘制 1 m = ${(RIV.s * 100).toFixed(0)} cm。箭头 ${(RIV.v * 100).toFixed(0)} 厘米每 m/s。显示为${M.RIVER.rate}×速度。</p>`,
    cam: { target: [ST.river - 1.7, 0, 0.3], az: -4, el: 44, dist: 40 }, lit: 'boatA', look: {}, scene: 'river',
    fig: "指向一个方向，携带另一个方向",
  },
  {
    kicker: "1.9 · AP 物理 C", title: "微积分运动学", sub: "当加速度改变时",
    body: `<p class="lede"> 1.5的方程需要常数<i>a</i>。这辆车的 <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> m/s² 在 <i>t</i><sub>1</sub> = ${f(M.T1)} s 处渐变为零，因此积分相反。它从以下行开始：<i>v</i><sub>0</sub> = 0，<i>x</i><sub>0</sub> = 0.</p>
      <div class="eq"><i>v</i> = <i>v</i><sub>0</sub> + ∫<i>a</i> d<i>t</i> = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>² &nbsp;→ ${f(M.V1, 1)} m/s</div>
      <div class="eq"><i>x</i> = <i>x</i><sub>0</sub> + ∫<i>v</i> d<i>t</i> = ${f(M.PULL.a0 / 2, 1)}<i>t</i>² − ${f(M.PULL.k / 6)}<i>t</i>³ &nbsp;→ ${f(M.X1, 1)} m</div>
      <div class="charts">
        ${kchart(KR.pa, { xlabel: 't (s)', ylabel: 'a (m/s²) · area = Δv', label: 'Acceleration against time, area shaded', live: AREA('pa') + CUR('pa'), series: [{ pts: samples(100, 0, 5, M.pa) }] })}
        ${kchart(KR.pv, { xlabel: 't (s)', ylabel: 'v (m/s) · area = Δx, slope = a', label: 'Velocity against time, area shaded', live: AREA('pv') + TAN('pv') + CUR('pv'), series: [{ pts: samples(100, 0, 5, M.pv) }] })}
        ${kchart(KR.px, { xlabel: 't (s)', ylabel: 'x (m) · slope = v', label: 'Position against time with its tangent', live: TAN('px') + CUR('px'), series: [{ pts: samples(100, 0, 5, M.px) }] })}
      </div>
      <p class="hintline">Shaded = 积分，红色 = 导数。 1 m 绘制为 ${(PULLS.s * 100).toFixed(0)} cm.</p>`,
    cam: { target: [ST.pull + 4.4, 0.3, 0], az: -8, el: 24, dist: 22 }, lit: 'pull', look: {}, scene: 'pull',
    fig: 'a = ' + M.PULL.a0.toFixed(1) + ' − ' + M.PULL.k.toFixed(1) + 't',
  },
  {
    kicker: "1.10 · AP 物理 C", title: "x(t) 的运动", sub: "向下分化，向上整合",
    body: `<p class="lede">给定<i>x</i>(<i>t</i>)，求微分。对于 <i>x</i> = <i>t</i>3 − 3<i>t</i>:</p>
      <div class="eq"><i>v</i> = 3<i>t</i>² − 3 &nbsp;&nbsp; <i>a</i> = 6<i>t</i></div>
      <p>从 ${f(-M.cv(0))} m/s 向左出发，在 <i>t</i> = ${f(M.T_TURN)} s、<i>x</i> = ${f(M.cx(M.T_TURN))} m 处转弯。 2秒以上：位移${f(M.cx(2))}米，距离${f(M.cdist(2))}米.</p>
      <p><b>回溯</b>需要初始条件：由<i>a</i> = 6<i>t</i>, <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub> 和 <i>x</i> = <i>t</i>³ + <i>C</i><sub>1</sub><i>t</i> + <i>C</i><sub>2</sub>; <i>v</i>(0) = −3 且 <i>x</i>(0) = 0 给出 <i>C</i><sub>1</sub> = −3, <i>C</i><sub>2</sub> = 0.</p>
      <div class="charts">
        ${kchart(KR.cx, { xlabel: 't (s)', ylabel: 'x (m) · slope = v', label: 'Position against time', live: TAN('cx') + CUR('cx'), series: [{ pts: samples(100, 0, 2, M.cx) }] })}
        ${kchart(KR.cv, { xlabel: 't (s)', ylabel: 'v (m/s) · area = Δx', label: 'Velocity against time, signed area shaded', live: AREA('cv') + CUR('cv'), series: [{ pts: samples(100, 0, 2, M.cv) }] })}
        ${kchart(KR.ca, { xlabel: 't (s)', ylabel: 'a (m/s²) · area = Δv', label: 'Acceleration against time, area shaded', live: AREA('ca') + CUR('ca'), series: [{ pts: samples(100, 0, 2, M.ca) }] })}
      </div>
      <p class="hintline">每0.2秒；后面的行程画在前面。</p>`,
    cam: { target: [ST.cube + 0.25, 0.25, 0], az: -6, el: 28, dist: 19.5 }, lit: 'bead', look: {}, scene: 'cube',
    fig: 'x = t³ − 3t',
  },
];

// ---------- click a concept: what it breaks into ----------
const sign = v => v > 1e-9 ? '+' : v < -1e-9 ? '−' : '';
export const PLATES = {
  ball: { text: `一个自由落体的球。发射后没有任何东西可以推动它；它之所以上升，只是因为它仍在向上移动，而重力每秒会改变该速度 ${M.G.toFixed(2)} m/s。`,
    facts: t => [['time', `${t.toFixed(2)} s`], ['position y', `${M.y(t).toFixed(2)} m`], ['velocity v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['acceleration a', `−${M.G.toFixed(2)} m/s²`]] },
  staff: { text: `垂直线是位置轴。它的零是发射点。短标记位于球的高度；黑色箭头是从零开始的位移，虽然球已经移动了${(2 * M.H).toFixed(2)}米，但当球落地时它又回到零。`,
    facts: t => [['position y', `${M.y(t).toFixed(2)} m`], ['displacement', `${sign(M.y(t))}${Math.abs(M.y(t)).toFixed(2)} m`], ["到目前为止的距离", `${M.distance(t).toFixed(2)} m`]] },
  vArrow: { text: `箭头的长度是速度，其方向是速度的符号。它以固定比例绘制，因此速度加倍，长度加倍。`,
    facts: t => [['velocity', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['speed', `${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['direction', M.vy(t) > 1e-9 ? 'up' : M.vy(t) < -1e-9 ? 'down' : "暂时没有"]] },
  aArrow: { text: `每个瞬间的加速度都是相同的，所以这个箭头永远不会改变。球加速还是减速取决于速度符号与其的比较。`,
    facts: t => [['acceleration', `−${M.G.toFixed(2)} m/s²`], ['velocity', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ["所以球是", M.vy(t) > 1e-9 ? "放慢速度" : M.vy(t) < -1e-9 ? "加速" : "在顶部"]] },
  boardX: { text: `红线就是此时的切线。它的斜率（上升超过运行）是速度：发射时陡峭，顶部平坦，着陆时相反陡峭。`,
    facts: t => [['slope = v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  boardV: { text: `一条直线，因此斜率（加速度）是恒定的。直线和零之间的阴影区域是到目前为止的位移。低于零的面积算作负数，因此通过着陆，两半会抵消。`,
    facts: t => [['slope = a', `−${M.G.toFixed(2)} m/s²`], ['area = Δy', `${sign(M.areaUnderV(t))}${Math.abs(M.areaUnderV(t)).toFixed(2)} m`]] },
  boardA: { text: `平坦的线：恒定的加速度。阴影区域是迄今为止速度的变化，a·t。`,
    facts: t => [['area = Δv', `${t > 0 ? '−' : ''}${(M.G * t).toFixed(2)} m/s`], ['v = v₀ + Δv', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  proj: { text: `同时进行两个独立的运动：匀速侧向、上下自由落体。每个问题都是一个具有自己的方程的一维问题。他们只分享时间。`,
    facts: t => [['x', `${M.x(t).toFixed(2)} m`], ['y', `${M.y(t).toFixed(2)} m`], ['time', `${t.toFixed(2)} s`]] },
  projV: { text: `速度箭头分为永远不会改变的水平部分和行为与第一个球的速度完全相同的垂直部分。将它们的尖端与尾部相加，您就可以得到箭头。`,
    facts: t => [['vₓ', `${M.VX.toFixed(2)} m/s`], ['v_y', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['speed √(vₓ² + v_y²)', `${Math.hypot(M.VX, M.vy(t)).toFixed(2)} m/s`]] },
  shadow: { text: `来自正上方的光线使地板上的运动变得平坦。剩下的就是水平运动：在相同的时间内迈出相同的步数，因为没有任何东西会横向运动。`,
    facts: t => [["到目前为止 Δx", `${M.x(t).toFixed(2)} m`], ["每一步" + M.STROBE.toFixed(1) + ' s', `${(M.VX * M.STROBE).toFixed(2)} m`]] },
  rainRoad: { text: `从道路上看，每个水滴在 ${M.RAIN.vr.toFixed(1)} m/s 处直接落下，汽车在 ${M.RAIN.vc.toFixed(1)} m/s 处行驶在其下方。这里没有什么是倾斜的。`,
    facts: () => [['car, v_CG', `${M.RAIN.vc.toFixed(2)} m/s forward`], ['rain, v_RG', `${M.RAIN.vr.toFixed(2)} m/s down`], ['a drop’s path', 'vertical']] },
  rainCar: { text: `从车上看，车子处于静止状态。道路在 ${M.RAIN.vc.toFixed(1)} m/s 处向后流动，每一滴水滴都保持向下运动，同时也随着道路向后移动，因此其条纹是倾斜的。`,
    facts: () => [['rain, v_RC', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ["从垂直方向倾斜", `${M.RAIN_ANGLE.toFixed(1)}°`], ['road, v_GC', `${M.RAIN.vc.toFixed(2)} m/s backward`], ['car', '0 m/s']] },
  rainSum: { text: `从头到尾：从雨在地面上的速度开始，然后加上地面相对于汽车的速度。从第一个尾部到最后一个尖端的箭头就是从车上看到的雨。`,
    facts: () => [["前部", `${M.V_RC[0].toFixed(2).replace('-', '−')} m/s`], ["上部分", `${M.V_RC[1].toFixed(2).replace('-', '−')} m/s`], ['|v_RC|', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['tan θ = 10.0 / 7.0', `θ = ${M.RAIN_ANGLE.toFixed(1)}°`]] },
  river: { text: `水相对于海岸的移动速度为 ${M.RIVER.vw.toFixed(1)} m/s。任何漂浮的物体，例如这些叶子或船，都会以其自身运动的速度在水中移动。`,
    facts: (t, s) => [['current, v_WS', `${M.RIVER.vw.toFixed(2)} m/s downstream`], ['width', `${M.RIVER.w} m`], ['time', `${s.river.t.toFixed(1)} s`]] },
  boatA: { text: `直接穿过，它在 w/v_b = ${M.crossTime(0).toFixed(1)} 秒内到达远端，这是最快的，但水流将其带到下游 ${M.drift(0).toFixed(1)} 米。船朝一个方向移动，又朝另一个方向移动。`,
    facts: (t, s) => boatFacts(0, s.river.t) },
  boatB: { text: `将${deg(M.AIM_UP)}°转向上游，其上游部分(${M.RIVER.vb.toFixed(1)} sin θ = ${M.RIVER.vw.toFixed(1)} m/s)抵消电流。它直接落地，但只剩下 ${M.vBS(M.AIM_UP)[1].toFixed(1)} m/s 可以穿越，所以需要 ${M.crossTime(M.AIM_UP).toFixed(1)} s。`,
    facts: (t, s) => boatFacts(M.AIM_UP, s.river.t) },
  pull: { text: `它的加速度不是恒定的，因此 1.5 的运动学方程不适用。到目前为止，它的速度是 a-t 下的面积，其位置是 v-t 下的面积。轮廓之间的间隙不断增大，但每次增大的幅度都较小，直到 a = 0 时它们相等。`,
    facts: (t, s) => { const u = s.pull.t; return [['time', `${u.toFixed(2)} s`], ['x = ∫v dt', `${M.px(u).toFixed(2)} m`], ['v = ∫a dt', `${M.pv(u).toFixed(2)} m/s`], ['a', `${M.pa(u).toFixed(2)} m/s²`]]; } },
  pullA: { text: `a = ${M.PULL.a0.toFixed(1)} − ${M.PULL.k.toFixed(1)}t：v–t 图的斜率，在 t₁ = ${M.T1.toFixed(2)} s 处稳定降至零。其变化率 da/dt = −${M.PULL.k.toFixed(1)} m/s³，称为加加速度。`,
    facts: (t, s) => { const u = s.pull.t; return [['a = dv/dt', `${M.pa(u).toFixed(2)} m/s²`], ['da/dt', u < M.T1 ? `−${M.PULL.k.toFixed(2)} m/s³` : '0'], ["到目前为止的面积 = v", `${M.pv(u).toFixed(2)} m/s`]]; } },
  bead: { text: `x = t3 − 3t。对速度微分一次，对加速度微分两次。转弯时，v = 0 但a = ${M.ca(M.T_TURN).toFixed(1)} m/s²：零速度并不意味着零加速度。`,
    facts: (t, s) => { const u = s.cube.t, v = M.cv(u), a = M.ca(u); return [['time', `${u.toFixed(2)} s`], ['x', `${f(M.cx(u))} m`], ['v = 3t² − 3', `${f(v)} m/s`], ['a = 6t', `${f(a)} m/s²`], ['so it is', Math.abs(v) < 0.02 ? "转身" : v * a > 0 ? "加速" : a === 0 ? "a = 0, 瞬间" : "放慢速度"]]; } },
  cubeLine: { text: `黑色箭头是从开始的位移。粒子向左移动 2 m，然后向右移动 4 m：2 s 时的位移为 +2 m，但行进的距离为 6 m。`,
    facts: (t, s) => { const u = s.cube.t; return [['position x', `${f(M.cx(u))} m`], ['displacement', `${f(M.cx(u))} m`], ["到目前为止的距离", `${M.cdist(u).toFixed(2)} m`]]; } },
};
function boatFacts(phi, t) {
  const tt = Math.min(t, M.crossTime(phi)), [dx, dy] = M.boatPos(phi, t);
  return [['time', `${tt.toFixed(1)} s`], ['across', `${dy.toFixed(1)} of ${M.RIVER.w} m`], ['downstream', `${Math.abs(dx) < 0.05 ? '0.0' : dx.toFixed(1)} m`], ['speed |v_BS|', `${M.vlen(M.vBS(phi)).toFixed(2)} m/s`], ['lands', `${M.crossTime(phi).toFixed(1)} s, ${Math.abs(M.drift(phi)) < 0.05 ? '0.0' : M.drift(phi).toFixed(1)} m down`]];
}

