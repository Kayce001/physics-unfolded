// Chapter 8, page by page (AP Physics 1, Unit 8: fluids). Text and charts on the left page; on the
// right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, PY6, PY7 } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const kPa = (p, n = 1) => `${f(p / 1000, n)} kPa`;

// ---------- small SVG charts for the left page, with live cursors ----------
const W = 420, P = { l: 44, r: 14, t: 16, b: 30 };
export const CURSORS = {};       // key → (x, y) → [cx, cy]
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, h = 170, ylabels, xlabels }) {
  const H = h;
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  for (const c of cursors) CURSORS[c] = (x, y) => [sx(x), sy(y)];
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const [yt, yb] = ylabels || [y1, y0], [xl, xr] = xlabels || [x0, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${yt}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${yb}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${xl}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${xr}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const sample = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// Bernoulli's energy per volume at the three points, as stacked bars
function bernBars() {
  const H = 150, top = 85, sy = v => P.t + (1 - v / top) * (H - P.t - P.b), bw = 60;
  const cols = M.BERN.pts.map((p, k) => {
    const x = P.l + 40 + k * 120; let y0 = 0, out = '';
    for (const [val, fill] of [[p.P, '#ecece8'], [p.K / 1000 * 1000, '#8fb0f0'], [p.U, '#9c9ca2']]) {
      const v = val / 1000; if (v > 0.01) out += `<rect x="${x}" y="${sy(y0 + v)}" width="${bw}" height="${sy(y0) - sy(y0 + v)}" fill="${fill}" stroke="#8a8a8f" stroke-width=".8"/>`; y0 += v;
    }
    return out + `<text class="lab" x="${x + bw / 2}" y="${H - 9}" text-anchor="middle">point ${k + 1}</text>`;
  }).join('');
  const tot = sy(M.BERN.E / 1000);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Energy per volume at three points: pressure, kinetic and potential parts always add to the same total">
    <line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>${cols}
    <line class="trend" x1="${P.l}" x2="${W - P.r}" y1="${tot}" y2="${tot}"/><text class="lab" x="${W - P.r}" y="${tot - 6}" text-anchor="end">总计 ${f(M.BERN.E / 1000, 0)} kPa</text>
    <text class="ax" x="${P.l - 6}" y="${sy(top) + 4}" text-anchor="end">${top}</text><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">kPa = kJ/m³: P（浅色）+ ½ρv²（蓝色）+ ρgy（灰色）</text>
  </svg>`;
}

const at = (k, dx = 0, dy = 0.5, dz = 0) => [STATIONS[k] + dx, dy, dz];
const Bp = M.BERN.pts;

export const PAGES = [
  {
    kicker: "第8章", title: "流体", sub: "密度",
    body: `<p class="lede">A <b>流体</b> 是任何流动的东西：液体或气体。它的分子没有锁定到位，因此它具有容器的形状。我们用它的<b>密度</b>来描述它，每体积质量：</p>
      <div class="eq">ρ = <i>m</i> / <i>V</i></div>
      <p>这五个立方体的边长均为 10 厘米，每个立方体 1.0 升：体积相同，质量却截然不同，从 ${f(M.MATERIALS[0].mass)} 公斤软木到 ${f(M.MATERIALS[4].mass)} 公斤铁。在质量与体积的关系图中，每种材料都是一条直线，其斜率就是其密度。</p>
      <p>密度属于材质，而不是物体：将立方体切成两半，<i>m</i>和<i>V</i>都减半。 <b>理想流体</b>是不可压缩的（其密度永远不会改变）并且流动时没有摩擦。水就差一点了。</p>
      <div class="charts">${chart({ x0: 0, x1: 1, y0: 0, y1: 3, xlabel: 'volume (L)', ylabel: 'mass (kg): slope = ρ', label: 'Mass against volume for five materials: straight lines whose slope is the density', h: 150,
        series: M.MATERIALS.map(m => ({ pts: [[0, 0], [Math.min(1, 3 / m.mass), Math.min(m.mass, 3)]], tag: { cork: [0.78, 0.24, 'cork'], ice: [0.62, 0.95, 'ice, water'], water: null, al: [0.66, 1.8, 'aluminium'], iron: [0.4, 2.3, 'iron'] }[m.key] })) })}</div>
      <p class="hintline">点击立方体将每个立方体切成八个。</p>`,
    cam: { target: at('density', 0, 0.06), az: -14, el: 16, dist: 3.4 }, lit: 'blocks', scene: 'density', look: {},
    fig: "五个 1 升立方体",
  },
  {
    kicker: '8.1', title: "压力", sub: "力分布在一个区域上",
    body: `<p class="lede"><b>压力</b> 是直接推到表面上的力，单位面积：</p>
      <div class="eq"><i>P</i> = <i>F</i><sub>⊥</sub> / <i>A</i></div>
      <p>是一个标量，以帕斯卡为单位测量：1 Pa = 1 N/m²。同一个${M.PERSON.m}公斤人（${f(M.PERSON.W, 0)} N）在雪上站立两次：</p>
      <table class="data">
        <tr><th></th><th>面积</th><th>压力</th></tr>
        <tr><td>鞋</td><td>${f(M.SHOE.A, 3)} m²</td><td>${kPa(M.P_SHOE)}</td></tr>
        <tr><td>雪鞋</td><td>${f(M.SNOWSHOE.A, 2)} m²</td><td>${kPa(M.P_SNOW, 2)}</td></tr>
      </table>
      <p>E八倍的面积，八分之一的压力，所以雪能保持。钉子则以相反的方式工作：用 ${M.NAIL.F} N 推动其 1 cm² 头部，并将其 0.5 mm² 尖端以 ${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa 压在木材上。</p>
      <div class="charts">${chart({ x0: 0, x1: 0.5, y0: 0, y1: 30, xlabel: 'contact area (m²)', ylabel: 'P = W/A (kPa)', label: 'Pressure against contact area for the same weight: P falls as 1/A', h: 118,
        series: [{ pts: sample(A => Math.min(M.PERSON.W / A / 1000, 30), 0.0229, 0.5) }], marks: [[M.SHOE.A, M.P_SHOE / 1000, 'shoes'], [M.SNOWSHOE.A, M.P_SNOW / 1000, 'snowshoes', -40, -10]] })}</div>
      <p class="hintline">箭头：雪上的推力，每 125 cm² 一个，${f(SC.shoeP * 1e5, 1)} cm 每 kPa。点击抬人。</p>`,
    cam: { target: at('pressure', 0, 0.9), az: -18, el: 12, dist: 10.5 }, lit: 'feet', scene: 'pressure', look: {},
    fig: "相同重力，更大面积",
  },
  {
    kicker: '8.2', title: "压力和深度", sub: "上面水的重力",
    body: `<p class="lede">在水下，压力来自于上面的水的重力。高度为 <i>h</i> 且面积为 <i>A</i> 的柱子的重力为 ρ<i>Ah g</i>，因此它会将 ρ<i>gh</i> 添加到顶部的压力：</p>
      <div class="eq"><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i></div>
      <p><i>P</i><sub>0</sub> = ${kPa(M.P0)} 是压在表面上的大气。 <i>P</i>为<b>绝对</b>压力； ρ<i>gh</i> 单独是 <b>表压</b> 压力，即高于大气压的部分。每 ${f(M.P0 / (M.RHO * M.G), 1)} 米的水会增加大约一个大气层：在 10 m 处，潜水员感觉到 ${kPa(M.pAt(10), 0)}.</p>
      <p>在某一深度，无论周围水的形状如何，每个方向的压力都是相同的。</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 240, xlabel: 'depth h (m)', ylabel: 'pressure (kPa)', cursors: ['depth', 'gauge'], label: 'Absolute and gauge pressure against depth: parallel straight lines', h: 150,
        series: [{ pts: [[0, M.P0 / 1000], [12, M.pAt(12) / 1000]], tag: [7.4, M.pAt(7.4) / 1000 + 4, 'absolute'] }, { cls: 'trend', pts: [[0, 0], [12, M.gauge(12) / 1000]], tag: [8.6, M.gauge(8.6) / 1000 - 32, 'gauge ρgh'] }] })}</div>
      <p class="hintline">箭头 ${f(SC.lakeP * 1e5, 1)} cm/kPa。点击潜水员可以看到上面的水柱。</p>`,
    cam: { target: at('depth', 0.2, 6.4), az: -12, el: 6, dist: 44 }, lit: 'diver', scene: 'depth', look: {},
    fig: "一名潜水员，水下 1 m 至 10 m",
  },
  {
    kicker: '8.3', title: "帕斯卡原理", sub: "到处都感受到一股推力",
    body: `<p class="lede">推动容器中封闭的液体，额外的压力会到达容器的每个部分和每面墙壁，不会减少。这就是<b>帕斯卡原理</b>.</p>
      <p>A ${M.PASCAL.F1} N 推动小活塞增加 Δ<i>P</i> = <i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = ${kPa(M.PASCAL.dP, 2)}无处不在。在大活塞下，${f(M.PASCAL.A2 / M.PASCAL.A1, 0)}乘以面积，同样的Δ<i>P</i>给${f(M.PASCAL.F2, 0)} N，足以撑起${f(M.PASCAL.load, 1)} kg：</p>
      <div class="eq"><i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub></div>
      <p>没有什么是免费的。水不能被挤压，所以左边压下去的体积在右边出现： <i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>。大活塞移动 ${f(M.PASCAL.A2 / M.PASCAL.A1, 0)} 次，因此输入功等于输出功，<i>F</i><sub>1</sub><i>d</i><sub>1</sub> = <i>F</i><sub>2</sub><i>d</i><sub>2</sub>.</p>
      <table class="data">
        <tr><th></th><th>区域</th><th>力</th><th>移动</th></tr>
        <tr><td>小活塞</td><td>${f(M.PASCAL.A1 * 1e4, 0)} cm²</td><td>${M.PASCAL.F1} N</td><td>${f(M.PASCAL.stroke * 100, 0)} cm</td></tr>
        <tr><td>大活塞</td><td>${f(M.PASCAL.A2 * 1e4, 0)} cm²</td><td>${f(M.PASCAL.F2, 0)} N</td><td>${f(M.PASCAL.stroke * 100 * M.PASCAL.A1 / M.PASCAL.A2, 0)} cm</td></tr>
      </table>
      <p class="hintline">E每个小箭头是一个${f(M.PASCAL.A1 * 1e4, 0)} cm²补丁上的Δ<i>P</i>：小活塞下有一个，大活塞下有十六个。点击查看每面墙上的Δ<i>P</i>。</p>`,
    cam: { target: at('pascal', -0.15, 0.8), az: -18, el: 14, dist: 7.2 }, lit: 'pascal', scene: 'pascal', look: {},
    fig: "相同的 ΔP，面积的十六倍",
  },
  {
    kicker: '8.4', title: "浮力", sub: "阿基米德原理",
    body: `<p class="lede">水会推动水下物体的每个面，并且向下推动的力会更大。横推取消；底部的上推胜过顶部的下推。区别是<b>浮力</b>.</p>
      <p>对于边长为 <i>s</i> 的立方体： (<i>P</i><sub>bottom</sub> − <i>P</i><sub>top</sub>)<i>s</i>² = ρ<i>gs</i>·<i>s</i>² = ρ<i>Vg</i>，它推开的水的重力：</p>
      <div class="eq"><i>F</i><sub>b</sub> = ρ<sub>fluid</sub> <i>V</i><sub>displaced</sub> <i>g</i></div>
      <p>它随着立方体的进入而增长，然后停留在${f(M.BUOY.Fb, 0)} N，无论深度如何。字符串保存其余部分，<b>表观重力</b> <i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(M.BUOY.W - M.BUOY.Fb, 0)} N而不是${f(M.BUOY.W, 0)} N.</p>
      <div class="charts">${chart({ x0: -0.35, x1: 0.75, y0: 0, y1: 900, xlabel: 'depth of the bottom face (m)', ylabel: 'force (N)', cursors: ['fb', 'T'], label: 'Buoyant force and string tension against how deep the cube is', h: 140, xlabels: ['−0.35', '0.75'],
        series: [{ pts: sample(d => M.buoy(M.BUOY.L0 - d).Fb, -0.35, 0.75), tag: [0.45, M.BUOY.Fb + 10, 'F_b'] }, { pts: sample(d => M.buoy(M.BUOY.L0 - d).T, -0.35, 0.75), tag: [0.45, M.BUOY.W - M.BUOY.Fb + 10, 'T = W − F_b'] }, { cls: 'trend', pts: [[-0.35, M.BUOY.W], [0.75, M.BUOY.W]], tag: [0.6, M.BUOY.W + 10, 'W'] }] })}</div>
      <p class="hintline">表压，${f(SC.buoyP * 1e5, 1)} cm/kPa；每 N 的力 ${f(SC.buoyF * 1000, 1)} 毫米。单击查看每个面的总推力。</p>`,
    cam: { target: at('buoy', 0, 0.95), az: -20, el: 8, dist: 6.8 }, lit: 'cube', scene: 'buoy', look: {},
    fig: `${f(M.BUOY.s * 100, 0)} 厘米铝制立方体，串在绳子上`,
  },
  {
    kicker: '8.5', title: "漂浮或下沉", sub: "比较密度",
    body: `<p class="lede">如果一个物体的密度小于水，它只会下沉，直到它排开的水的重量与它一样重： ρ<sub>fluid</sub><i>V</i><sub>under</sub><i>g</i> = ρ<sub>obj</sub><i>Vg</i>，所以</p>
      <div class="eq"><i>V</i><sub>under</sub> / <i>V</i> = ρ<sub>obj</sub> / ρ<sub>fluid</sub></div>
      <table class="data">
        <tr><th></th><th>ρ (kg/m³)</th><th>结果</th></tr>
        <tr><td>木块</td><td>${M.WOOD.rho}</td><td>浮子，${f(100 * M.WOOD.draft / M.WOOD.s, 0)}%下</td></tr>
        <tr><td>ice</td><td>${M.ICE.rho}</td><td>浮动，${f(100 * M.ICE.draft / M.ICE.s, 1)}%低于</td></tr>
        <tr><td>钢球</td><td>${M.BALL.rho}</td><td>水槽</td></tr>
        <tr><td>钢船，平均</td><td>${f(M.SHIP.avg, 0)}</td><td>浮子，${f(M.SHIP.draft * 100, 1)} cm深</td></tr>
      </table>
      <p>海水中的一座冰山是${f(100 * M.fractionUnder(917, M.RHO_SEA), 0)}%下的。球的 <i>F</i><sub>b</sub> = ${f(M.BALL.Fb, 0)} N 无法匹配其 ${f(M.BALL.W, 0)} N；地板将其余部分推高。该船为钢制，可容纳空气。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.5, y0: 0, y1: 1.15, xlabel: 'ρ_object / ρ_water', ylabel: 'fraction under water', label: 'Fraction submerged against density ratio: equal to it, up to 1, where things sink', h: 104, ylabels: ['', '0'],
        series: [{ pts: [[0, 0], [1, 1], [1.5, 1]], tag: [1.02, 1.0, 'sinks →'] }], marks: [[M.SHIP.avg / 1000, M.SHIP.avg / 1000, 'ship'], [0.6, 0.6, 'wood'], [0.917, 0.917, 'ice', -26, -8]] })}</div>
      <p class="hintline">每 N 施加 ${f(SC.floatF * 1000, 1)} 毫米的力。单击以提起排出的水。</p>`,
    cam: { target: at('float', 0.15, 0.55), az: -10, el: 9, dist: 12.5 }, lit: 'float', scene: 'float', look: {},
    fig: "木头、冰、钢球、钢船",
  },
  {
    kicker: '8.6', title: "连续性", sub: "进去的东西出来",
    body: `<p class="lede">水无法被挤压，管道也不会泄漏，因此每秒都有相同的体积通过每个横截面。那就是 <b>体积流量</b>, <i>Q</i> = <i>Av</i>:</p>
      <div class="eq"><i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub></div>
      <p>管道缩小到半径的一半，面积的四分之一，因此水的速度增加了四倍： ${f(M.FLOW.v1, 1)} m/s to ${f(M.FLOW.v2, 1)} m/s. <i>Q</i> = ${f(M.FLOW.Q * 1000, 0)} L/s无处不在。</p>
      <p>沿着深色的水片走：宽的部分又短又胖；在狭窄的部分，同样的体积又长又薄。将拇指放在软管上也能起到同样的作用。</p>
      <div class="charts">${chart({ x0: 0, x1: 0.3, y0: 0, y1: 3, xlabel: 'cross-section area A (m²)', ylabel: 'speed v = Q/A (m/s)', cursors: ['flow'], label: 'Speed against cross-section area: v falls as 1/A', h: 150,
        series: [{ pts: sample(A => Math.min(M.FLOW.Q / A, 3), M.FLOW.Q / 3, 0.3) }], marks: [[M.FLOW.A1, M.FLOW.v1, 'A₁', -6, -10], [M.FLOW.A2, M.FLOW.v2, 'A₂']] })}</div>
      <p class="hintline">速度 ${f(SC.flowV * 100, 0)} 厘米每米/秒。单击管道以拉出其两个横截面。</p>`,
    cam: { target: at('continuity', 0, PY6 + 0.1), az: -12, el: 14, dist: 14 }, lit: 'pipe', scene: 'continuity', look: {},
    fig: "面积四分之一，速度四倍",
  },
  {
    kicker: '8.7', title: "伯努利", sub: "流体能量守恒",
    body: `<p class="lede">沿着管道流一点水。当它加速时，就必须有某种东西推动它前进：它后面的压力一定比前面的压力高。所以 <b>流速快意味着压力低</b>.</p>
      <p>每体积能量沿流动方向守恒（理想流体，稳定流动）：</p>
      <div class="eq"><i>P</i> + ½ρ<i>v</i>² + ρ<i>gy</i> = constant</div>
      <table class="data">
        <tr><th></th><th><i>v</i></th><th><i>y</i></th><th><i>P</i> （仪表）</th></tr>
        ${Bp.map((p, k) => `<tr><td>${k + 1} ${['wide, low', 'narrow, low', 'wide, high'][k]}</td><td>${f(p.v, 1)} m/s</td><td>${f(p.y, 1)} m</td><td>${kPa(p.P)}</td></tr>`).join('')}
      </table>
      <div class="charts">${bernBars()}</div>
      <p class="hintline">半速。压力 ${f(SC.bernP * 1e5, 1)} 厘米每千帕。单击将钢筋放置在管道旁边。</p>`,
    cam: { target: at('bernoulli', 0.8, PY7 + 0.6), az: -12, el: 10, dist: 24.5 }, lit: 'bernoulli', scene: 'bernoulli', look: {},
    fig: "窄的地方快，高的地方慢",
  },
  {
    kicker: '8.8', title: "托里拆利定律", sub: "从洞中喷出的喷射流",
    body: `<p class="lede">水留下一个洞 <i>h</i> 低于表面。将伯努利从开放表面（大气，几乎静止）应用到射流（再次大气）：压力项取消，留下 ρ<i>gh</i> = ½ρ<i>v</i>², so</p>
      <div class="eq"><i>v</i> = √(2<i>gh</i>)</div>
      <p>与自由落体的水滴速度相同 <i>h</i>。这里 <i>h</i> 开始于 ${f(M.TANK.h0, 1)} m, so <i>v</i> = ${f(M.torricelli(M.TANK.h0))} 多发性硬化症。当水箱排空时， <i>h</i> 和 <i>v</i> 一起跌倒。</p>
      <p>一旦出去，每一滴都是一个弹丸： <i>v</i> 跨越、坠落 ${f(M.TANK.yh, 2)} m in ${f(M.jetFlight, 3)} s。其范围为 <i>v t</i> = 2√(<i>h y</i><sub>洞</sub>), ${f(M.jetRange(M.TANK.h0))} 满时米。</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 5, xlabel: 'water height above the hole h (m)', ylabel: 'jet speed v (m/s)', cursors: ['tank'], label: 'Jet speed against water height: the square root of 2gh', h: 150,
        series: [{ pts: sample(h => M.torricelli(h), 0, 1.2) }] })}</div>
      <p class="hintline">速度 ${f(SC.jetV * 100, 0)} 厘米每米/秒。单击水箱以分割液滴的速度。</p>`,
    cam: { target: at('torricelli', -0.05, 1.15), az: -14, el: 10, dist: 10 }, lit: 'tank', scene: 'torricelli', look: {},
    fig: "水箱通过一个洞排水",
  },
];

// ---------- click a scene: what it breaks into ----------
const b4 = s => s.st4;
export const PLATES = {
  blocks: { text: `每个立方体都分为八个更小的立方体。每块的质量是八分之一，体积是八分之一，因此密度相同。密度是物质的属性，而不是你拥有的东西的数量。`,
    facts: () => M.MATERIALS.map(m => [`${m.name}: ${f(m.mass / 8, 3)} kg / 0.125 L`, `${m.rho} kg/m³`]) },
  feet: { text: `人们离开了，把接触的痕迹留在雪地上。两者的总力相同 ${f(M.PERSON.W, 0)} N；雪鞋将其分布在八倍的面积上，因此每个补丁的推力减少了八倍。`,
    facts: () => [['weight W', `${f(M.PERSON.W, 0)} N`], ['shoes: W / A', `${f(M.PERSON.W, 0)} / ${f(M.SHOE.A, 3)} = ${kPa(M.P_SHOE)}`], ['snowshoes: W / A', `${f(M.PERSON.W, 0)} / ${f(M.SNOWSHOE.A, 2)} = ${kPa(M.P_SNOW, 2)}`], ['ratio', `${f(M.P_SHOE / M.P_SNOW, 0)}×`]] },
  diver: { text: `较暗的柱子是潜水员正上方的水，直径为 1 m²。它的重力除以 1 m²，就是表压 ρgh。加上上面的气氛，你就拥有了绝对的压力。从下面看的箭头比从上面看的箭头稍长：潜水员的脚比头更深。`,
    facts: s => { const d = M.diveDepth(s.clock); return [['depth h', `${f(d, 2)} m`], ["柱重 ρ(1 m²)h g", `${f(M.gauge(d) / 1000, 1)} kN`], ['gauge ρgh', kPa(M.gauge(d))], ['absolute P₀ + ρgh', kPa(M.pAt(d))], ["在大气中", `${f(M.pAt(d) / M.P0, 2)} atm`]]; } },
  pascal: { text: `推力产生的额外压力在每个壁和两个活塞上都是相同的。不同之处在于它作用的面积：大活塞下方面积的十六倍，因此力的十六倍。`,
    facts: s => { const p = M.pascal(s.clock); return [['ΔP everywhere', kPa(M.PASCAL.dP, 2)], ['F₁ = ΔP·A₁', `${M.PASCAL.F1} N`], ['F₂ = ΔP·A₂', `${f(M.PASCAL.F2, 0)} N`], ["小活塞向下 d₁", `${f(p.d1 * 100, 1)} cm`], ["大活塞向上 d2", `${f(p.d2 * 100, 2)} cm`], ['work F₁d₁ = F₂d₂', `${f(M.PASCAL.F1 * p.d1, 2)} J`]]; } },
  cube: { text: `每个面上的箭头均替换为该面的总推力，即面中心的 <i>P</i>·<i>A</i>。四边成对抵消。底部减去顶部就是浮力，与立方体推开水的重力相同。`,
    facts: s => { const b = b4(s), A = M.BUOY.s ** 2, top = M.gaugeAtY(b.yb + M.BUOY.s, b.L) * A, bot = M.gaugeAtY(b.yb, b.L) * A;
      return [["在底部", `${f(bot, 1)} N`], ["从上到下", `${f(top, 1)} N`], ['F_b = bottom − top', `${f(bot - top, 1)} N`], ['ρ V_under g', `${f(b.Fb, 1)} N`], ['tension T = W − F_b', `${f(b.T, 1)} N`], ["水位上升", `${f((b.L - M.BUOY.L0) * 1000, 1)} mm`]]; } },
  float: { text: `每个蓝色块都是物体推开、提起的水。对于漂浮物来说，它的重量与物体的重量完全相同。钢球将其整个体积推到一边，但这仍然不够。`,
    facts: () => [['wood: W = F_b', `${f(M.WOOD.W, 0)} N`], ['ice: W = F_b', `${f(M.ICE.W, 0)} N`], ["钢球：W、F_b", `${f(M.BALL.W, 0)} N, ${f(M.BALL.Fb, 0)} N`], ['ship: W = F_b', `${f(M.SHIP.W, 0)} N（${f(M.SHIP.m, 1)} 公斤钢）`]] },
  pipe: { text: `两个横截面滑出。每个第二个 ${f(M.FLOW.Q * 1000, 0)} L 都经过： 通过 ${f(M.FLOW.v1, 1)} m/s 处的 ${f(M.FLOW.A1, 3)} m²，以及通过 ${f(M.FLOW.v2, 1)} m/s 处的 ${f(M.FLOW.A2, 3)} m²。`,
    facts: s => { const A = M.PIPE1.area(s.slab6); return [['A₁v₁', `${f(M.FLOW.A1, 4)} × ${f(M.FLOW.v1, 1)} = ${f(M.FLOW.Q, 4)} m³/s`], ['A₂v₂', `${f(M.FLOW.A2, 4)} × ${f(M.FLOW.v2, 1)} = ${f(M.FLOW.Q, 4)} m³/s`], ["暗片：A", `${f(A, 4)} m²`], ["其速度Q/A", `${f(M.FLOW.Q / A, 2)} m/s`]]; } },
  bernoulli: { text: `每个点后面都有其单位体积的能量：压力（浅色）、动能 ½ρv²（蓝色）和势能 ρgy（灰色）。这些棋子可以相互交换，但堆叠的高度始终相同。同样的操作也可以抬起机翼：其弯曲顶部的空气移动速度更快，因此来自上方的压力比来自下方的压力小。`,
    facts: () => Bp.map((p, k) => [`point ${k + 1}: P + ½ρv² + ρgy`, `${f(p.P / 1000, 1)} + ${f(p.K / 1000, 1)} + ${f(p.U / 1000, 1)} = ${f((p.P + p.K + p.U) / 1000, 1)} kPa`]) },
  tank: { text: `虚线是当前速度的路径。离开后 0.25 秒显示的下降具有与离开时相同的水平速度 v（灰色，横向），并且向下获得了 g·t（灰色，向下）。`,
    facts: s => { const h = s.h8, v = M.torricelli(h); return [['h', `${f(h)} m`], ['v = √(2gh)', `${f(v)} m/s`], ['½v² = gh', `${f(0.5 * v * v, 2)} = ${f(M.G * h, 2)} J/kg`], ["跌倒的时间", `${f(M.jetFlight, 3)} s`], ['range', `${f(M.jetRange(h))} m`]]; } },
};
