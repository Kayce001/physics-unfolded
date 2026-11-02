// Chapter 15, page by page (after the AP Physics C E&M organizer, Unit 8). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const GREY = '#86868c';

// ---------- small SVG charts for the left page: two quantities, one axis each side ----------
const W = 420, HH = 160, P = { l: 44, r: 44, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (HH - P.t - P.b) };
function chart({ L, Rt, series, xlabel, ylabel, rlabel, marks = [], cursors = [], label, under = '' }) {
  const { x0, x1 } = L, sx = x => CH.sx(x, x0, x1), sy = (y, a = L) => CH.sy(y, a.y0, a.y1);
  const paths = series.map(s => { const a = s.r ? Rt : L, c = s.r ? GREY : null;
    return `<path class="curve"${c ? ` style="stroke:${c}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y, a).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1], a) - 6}"${c ? ` style="fill:${c}"` : ''}>${s.tag[2]}</text>` : ''); }).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = L.y0 < 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${HH}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${HH - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(L.y1) + 4}" text-anchor="end">${L.y1}</text><text class="ax" x="${P.l - 6}" y="${sy(L.y0) + 4}" text-anchor="end">${L.y0}</text>
    <text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y1, Rt) + 4}" style="fill:${GREY}">${Rt.y1}</text><text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y0, Rt) + 4}" style="fill:${GREY}">${Rt.y0}</text>
    <text class="ax" x="${P.l}" y="${HH - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${HH - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="lab" x="${W - P.r - 6}" y="${P.t + 13}" text-anchor="end" style="fill:${GREY}">${rlabel}</text>
    <text class="ax" x="${(P.l + W - P.r) / 2}" y="${HH - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, r]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${r ? ` style="fill:${GREY}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges (left and right axes), shared with the live cursors in main.js
export const R = {
  phi0: { x0: 0, x1: 6, y0: -40, y1: 40 }, emf0: { x0: 0, x1: 6, y0: -45, y1: 45 },
  i1: { x0: 0, x1: 6, y0: -2, y1: 2 }, emf2: { x0: 0, x1: 6, y0: -0.3, y1: 0.3 },
  phiW: { x0: 0, x1: 3, y0: 0, y1: 1.5 }, emfW: { x0: 0, x1: 3, y0: 0, y1: 2 },
  phiX: { x0: 0, x1: 2, y0: -40, y1: 40 }, emfX: { x0: 0, x1: 2, y0: -60, y1: 60 },
  v: { x0: 0, x1: 5, y0: 0, y1: 1 }, pw: { x0: 0, x1: 5, y0: 0, y1: 0.2 },
  iS: { x0: 0, x1: 4, y0: -2, y1: 2 }, eS: { x0: 0, x1: 4, y0: -6, y1: 6 },
  iRL: { x0: 0, x1: 8, y0: -3, y1: 3 }, vRL: { x0: 0, x1: 8, y0: -12, y1: 12 },
  qLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 }, iLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 },
};
// live energy bars (the LC circuit): heights set in main.js, full height = the total Q²/2C
export const BARS = { x: 90, w: 56, gap: 50, base: 112, top: 16 };
const barChart = (key, items, top) => `<svg class="chart" viewBox="0 0 ${W} ${BARS.base + 26}" role="img" aria-label="Energy bar chart, live">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.top}" y2="${BARS.top}" style="stroke:#d4d4d0;stroke-dasharray:3 3"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${top}</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;
const sq = k => `一格子 = ${k}`;
const two = (l, r, o) => `<div class="charts">${chart({ L: R[l], Rt: R[r], cursors: [[l], [r, 1]], ...o })}</div>`;

// Lenz's four cases, from the model at mid-run
const lenzRows = M.CASES.map(c => {
  const r = M.lenzCase(c, M.LENZ.run * 0.6), Bdir = r.Bx < 0 ? '←' : '→', grows = c.move === 'in';
  return `<tr><td>${c.name}</td><td>${Bdir} ${grows ? 'growing' : 'shrinking'}</td><td>${f(r.emf * 1e6, 1)} µV</td><td>${r.emf > 0 ? '←' : '→'}</td></tr>`;
}).join('');
const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: "第15章", title: "电磁感应", sub: "改变磁通会产生电动势",
    body: `<p class="lede">电流产生磁场。法拉第发现了相反的情况： <b>改变</b> 穿过环路的磁通量驱动其周围的电流。</p>
      <div class="eq">Φ<sub><i>B</i></sub> = ∫<i>B</i>·<i>dA</i> &nbsp;&nbsp; ε = −<i>d</i>Φ<sub><i>B</i></sub>/<i>dt</i></div>
      <p>通量是跨越环路的表面上的场总和，单位为韦伯 (T·m²)； <i>N</i> 匝数得出 ε = −<i>N d</i>Φ/<i>dt</i>。电动势为 ∮<i>E</i>·<i>ds</i> of an <b>感应电场</b> 没有开始也没有结束：它不是保守的。这里，一块磁铁来到一个环上然后离开； ε 是 Φ 的负斜率。</p>
      ${two('phi0', 'emf0', { xlabel: 't (s)', ylabel: 'Φ (µWb)', rlabel: 'ε (µV)', label: 'Flux through the loop and the emf, against time',
        series: [{ pts: samples(160, 0, 6, t => M.fluxScene(t).Phi * 1e6) }, { r: 1, pts: samples(160, 0, 6, t => M.fluxScene(t).emf * 1e6) }] })}
      <p class="hintline">单击 B·dA 补丁的循环。 1 m = 10 个方格； ${sq('5 mA')}.</p>`,
    cam: { target: [ST.flux + 1.0, 1.7, 0], az: 30, el: 12, dist: 13 }, lit: 'flux', scene: 'flux', look: {},
    fig: "磁铁进出循环",
  },
  {
    kicker: '15.1', title: "楞次定律", sub: "当前反对变革",
    body: `<p class="lede">负号：感应电流产生磁场 <i>B</i><sub>工业</sub> 那个 <b>反对改变</b> 流，而不是流本身。</p>
      <table class="data"><tr><th>案例</th><th>B 在循环中</th><th>ε</th><th>B<sub>工业</sub></th></tr>${lenzRows}</table>
      <ul class="rules">
        <li>通量增长： <i>B</i><sub>工业</sub> 反对 <i>B</i>;</li>
        <li>通量收缩： <i>B</i><sub>工业</sub> 点与 <i>B</i>;</li>
        <li>右手定则转动 <i>B</i><sub>工业</sub> 进入 <i>I</i>.</li>
      </ul>
      <p>这是能量守恒：环路排斥接近的极点并拉回离开的极点，因此产生电流需要做功。在固体金属中，同样的制动使 <b>涡流</b>，加热它。向左面积向量： Φ > 0 时 <i>B</i> 剩下的点。</p>
      <p class="hintline">单击其自身字段的循环（虚线）。 <i>I</i> 虚线箭头仅显示方向； ${sq('10 mT')}.</p>`,
    cam: { target: [ST.lenz - 0.35, 2.1, 0], az: 26, el: 8, dist: 21 }, lit: 'nIn', scene: 'lenz', look: {},
    fig: "N或S，接近或离开",
  },
  {
    kicker: '15.2', title: "互感", sub: "一个电流，另一个电动势",
    body: `<p class="lede">A 改变线圈 1 中的电流会改变其通过线圈 2 的磁场。该磁通与 <i>I</i><sub>1</sub> 成正比，因此 </p>
      <div class="eq">ε<sub>2</sub> = −<i>N</i><sub>2</sub><i>d</i>Φ<sub>2</sub>/<i>dt</i> = −<i>M dI</i><sub>1</sub>/<i>dt</i></div>
      <p><b> 互感系数 </b> <i>M</i> 的几何形状为：对于这些 100 匝线圈，${f(M.COILS.M * 1e6, 0)} µH。在 <b>iron 铁芯 </b> 上，铁芯通过两个绕组承载磁通，μ<sub>r</sub> ≈ ${M.CORE.muR} 倍：<i>M</i> = ${f(M.CORE.M * 1e3, 0)} mH。随着 <i>I</i>(<i>t</i>) 上升，<i>B</i>(<i>t</i>) 向左增长，<i>B</i><sub>ind</sub> 向右增长。</p>
      ${two('i1', 'emf2', { xlabel: 't (s)', ylabel: 'I₁ (A)', rlabel: 'ε₂ (mV)', label: 'Current in coil 1 and emf in coil 2 against time',
        series: [{ pts: samples(120, 0, 6, t => M.coilsScene(t).I1) }, { r: 1, pts: samples(120, 0, 6, t => M.coilsScene(t).emf * 1e3) }] })}
      <p class="hintline">单击任一。 ${sq('4 A')} 在线圈 1 中，0.5 mA 在线圈 2 中，0.25 T 在铁中。</p>`,
    cam: { target: [ST.mutual, 1.95, 0], az: 26, el: 10, dist: 13.5 }, lit: 'mutual', scene: 'mutual', look: {},
    fig: "两个线圈；一个铁芯",
  },
  {
    kicker: '15.3', title: "留下一根电线", sub: "进入较弱的领域",
    body: `<p class="lede">A ${M.WIRE.b * 100} × ${M.WIRE.a * 100} cm 环以 ${M.WIRE.v * 100} cm/s 的速度远离承载 ${M.WIRE.I} A 的电线。 <i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i> 有所不同，因此将其汇总为条带：</p>
      ${steps([
        ['Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i>', 'strips'],
        ['&nbsp;&nbsp;&nbsp;= (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', ''],
        ['ε = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>)', '−<i>d</i>Φ/<i>dt</i>'],
      ])}
      <p> 导线下面的<i>B</i> 指向页面并收缩，因此电流顺时针运行，将字段添加到页面中。</p>
      ${two('phiW', 'emfW', { xlabel: 't (s)', ylabel: 'Φ (µWb)', rlabel: 'ε (µV)', label: 'Flux and emf against time',
        series: [{ pts: samples(90, 0, 3, t => M.wireScene(t).Phi * 1e6) }, { r: 1, pts: samples(90, 0, 2.999, t => M.wireScene(t).emf * 1e6) }] })}
      <p class="hintline">单击其条带的循环。 ⊗ 面积∝ <i>B</i>。 ${sq('0.4 mA')}.</p>`,
    cam: { target: [ST.wire - 0.3, 2.2, 0], az: 6, el: 6, dist: 17 }, lit: 'wire', scene: 'wire', look: {},
    fig: "长线，环移开",
  },
  {
    kicker: '15.4', title: "运动电动势", sub: "在磁场中运动的导体棒",
    body: `<p class="lede">A金属棒在<i>v</i>移动到<i>B</i>。里面的每个电荷也会移动，感觉<i>F</i> = <i>qv</i>×<i>B</i>沿着条。</p>
      <p>自由电荷滑动，直到一端堆积+，另一端堆积-。他们的场<i>E</i>向后推； </p>时电荷停止移动
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; ε = <i>EL</i> = <i>BLv</i></div>
      <table class="data">
        <tr><td><i>B</i>、<i>L</i>、<i>v</i></td><td>${M.BAR.B} T、${M.BAR.L * 100} 厘米、${M.BAR.v} m/s</td></tr>
        <tr><td><i>E</i> = <i>vB</i></td><td>${f(M.BAR.E, 2)} V/m</td></tr>
        <tr><td>ε = <i>BLv</i></td><td>${f(M.BAR.emf, 2)} V</td></tr>
      </table>
      <p>没有任何东西关闭电路，因此一旦电荷分离<b>就没有电流流动</b>。停下吧，他们又散开了。</p>
      <p class="hintline">单击一次电荷的两个力的栏。 1 m = 4 个方格； ${sq('0.25 V/m')}.</p>`,
    cam: { target: [ST.bar, 1.75, 0], az: 8, el: 6, dist: 15 }, lit: 'bar', scene: 'bar', look: {},
    fig: "0.5 m/s 至 0.4 T 的棒材",
  },
  {
    kicker: '15.5', title: "穿过一片场", sub: "只有边缘才算数",
    body: `<p class="lede">A ${M.CROSS.w * 100} × ${M.CROSS.h * 100} cm 环在 ${M.CROSS.v} m/s.</p> 处穿过 ${M.CROSS.B} T 的 ${M.CROSS.W * 100} cm 区域
      <table class="data">
        <tr><th>舞台</th><th>Φ</th><th>ε</th></tr>
        <tr><td>进入</td><td>增长</td><td>−<i>Bhv</i> = −${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} mV</td></tr>
        <tr><td>全部内</td><td>常数<i>Bhw</i></td><td>0</td></tr>
        <tr><td>离开</td><td>收缩</td><td>+${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} mV</td></tr>
      </table>
      <p>在均匀场地中，双方立柱均携带<i>BLv</i>，推法相同；他们取消了循环。电流仅在一侧输入、另一侧输出时流动：${f(M.CROSS.B * M.CROSS.h * M.CROSS.v / M.CROSS.R * 1e3, 0)} mA 通过 ${M.CROSS.R} Ω.</p>
      ${two('phiX', 'emfX', { xlabel: 't (s)', ylabel: 'Φ (mWb)', rlabel: 'ε (mV)', label: 'Flux and emf against time',
        series: [{ pts: samples(200, 0, 2, t => M.crossScene(t).Phi * 1e3) }, { r: 1, pts: samples(400, 0, 1.999, t => M.crossScene(t).emf * 1e3) }] })}
      <p class="hintline">单击循环以进行双方的推动。 ${sq('0.2 A')}.</p>`,
    cam: { target: [ST.crossing, 1.75, 0], az: 6, el: 6, dist: 15 }, lit: 'crossing', scene: 'crossing', look: {},
    fig: "进去、穿过、出去",
  },
  {
    kicker: '15.6', title: "铁轨上的导体棒", sub: "电路中的动电动势",
    body: `<p class="lede">Rails 通过电阻器连接闭合电路。导体棒给出${M.RAIL.v0} m/s并放开</p>
      ${steps([
        ['Φ = <i>BLx</i>, &nbsp;ε = <i>BLv</i>, &nbsp;<i>I</i> = <i>BLv</i>/<i>R</i>', 'counterclockwise'],
        ['<i>F</i> = <i>ILB</i> = <i>B</i><sup>2</sup><i>L</i><sup>2</sup><i>v</i>/<i>R</i>', 'backward'],
        ['<i>v</i> = <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>, &nbsp;τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup>', `${f(M.RAIL.tau, 1)} s`],
      ])}
      <p>制动器随着速度而增强，因此杆呈指数减慢并滑行${f(M.RAIL.v0 * M.RAIL.tau * 100, 0)}厘米。它所消耗的功率 <i>Fv</i> 恰好是 <i>I</i><sup>2</sup><i>R</i>：所有 ${f(0.5 * M.RAIL.m * M.RAIL.v0 ** 2 * 1e3, 0)} mJ 动能最终都转化为热量。</p>
      ${two('v', 'pw', { xlabel: 't (s)', ylabel: 'v (m/s)', rlabel: 'P = I²R (W)', label: 'Speed of the bar and power dissipated against time; the shaded area is the heat',
        under: `<path data-area="pw" style="fill:#e4e4e8"/>`, series: [{ pts: samples(100, 0, 5, t => M.railScene(t).v) }, { r: 1, pts: samples(100, 0, 5, t => M.railScene(t).P) }], marks: [[M.RAIL.tau, M.RAIL.v0 / Math.E, 'v₀/e at τ']] })}
      <p class="live" id="raillive"></p>
      <p class="hintline">点击电路。 ${sq('2 A')}，或0.25 N.</p>`,
    cam: { target: [ST.rails, 1.7, 0], az: 6, el: 7, dist: 15.5 }, lit: 'rails', scene: 'rails', look: {},
    fig: "由自身电流制动",
  },
  {
    kicker: '15.7', title: "电感", sub: "线圈抵抗自身的变化",
    body: `<p class="lede">A线圈的电流使磁通通过其自身的匝数。改变电流，磁通发生变化，感应出与变化相反的 <b> 反电动势 </b>。</p>
      ${steps([
        ['<i>L</i> = <i>N</i>Φ/<i>I</i>, &nbsp;ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i>', 'henries, H'],
        ['<i>B</i> = μ<sub>0</sub><i>nI</i> → <i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup><i>A</i>/ℓ', `${f(M.SOL.L * 1e3, 2)} mH`],
        ['<i>U</i> = ½<i>LI</i><sup>2</sup>, &nbsp;<i>u</i> = <i>B</i><sup>2</sup>/2μ<sub>0</sub>', 'stored'],
      ])}
      <p>${M.SOL.N} 接通 ${M.SOL.len * 100} cm，半径 ${M.SOL.r * 100} cm（μ<sub>0</sub><i>nI</i> 是这么短的线圈的 ${f((1 - M.solCentreB(1) / (M.MU0 * M.SOL.n)) * 100, 0)} % 高）。 ${M.SOL.ramp} s 中的斜坡 0 → ${M.SOL.Imax} A 给出 ε<sub><i>L</i></sub> = ${f(-M.SOL.L * M.SOL.Imax / M.SOL.ramp * 1e3, 2)} mV；稳定电流，无。电感器平滑突然的跳跃。</p>
      ${two('iS', 'eS', { xlabel: 't (s)', ylabel: 'I (A)', rlabel: 'ε_L (mV)', label: 'Current and back emf against time',
        series: [{ pts: samples(200, 0, 4, t => M.solCurrent(t).I) }, { r: 1, pts: samples(400, 0, 3.999, t => M.solScene(t).emfL * 1e3) }] })}
      <p class="hintline">25 400匝拉制。单击查看一圈的通量。 ${sq('5 mT')}.</p>`,
    cam: { target: [ST.solenoid, 1.85, 0], az: 22, el: 12, dist: 11.5 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: "螺线管，电流斜坡",
  },
  {
    kicker: '15.8', title: "强化学习电路", sub: "生长和衰减，τ = L/R",
    body: `<p class="lede">${M.RL.E} V, ${M.RL.R} Ω, ${M.RL.L} H. 绕环 ε − <i>IR</i> − <i>L dI</i>/<i>dt</i> = 0, 所以</p>
      <div class="eq"><i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), &nbsp;τ = <i>L</i>/<i>R</i></div>
      <p>首先，电感器是一个<b>开路开关</b>：<i>I</i> = 0，所有${M.RL.E} V穿过它。后来是<b>a普通线</b>：<i>I</i> = ε/<i>R</i> = ${f(M.RL.Imax, 0)} A.取出电池，它保持电流， <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>，而½<i>LI</i><sup>2</sup> = ${f(0.5 * M.RL.L * M.RL.Imax ** 2, 0)} J 变成热量。 τ = ${f(M.RL.tau, 1)} s.</p>
      ${two('iRL', 'vRL', { xlabel: 't (s)', ylabel: 'I (A)', rlabel: 'ΔV (V)', label: 'Current and inductor voltage against time, growth then decay',
        series: [{ pts: samples(320, 0, 7.999, t => M.rlScene(t).I) }, { r: 1, pts: samples(320, 0, 7.999, t => M.rlScene(t).VL), tag: [4.6, -8.5, 'L dI/dt'] }],
        marks: [[M.RL.tau, M.rlScene(M.RL.tau).I, '63 %'], [M.RL.phase + M.RL.tau, M.rlScene(M.RL.phase + M.RL.tau).I, '37 %']] })}
      <p class="hintline">黑色：右侧刻度上的<i>I</i>和<i>IR</i>。单击每个 ΔV 的电路。 ${sq('4 A')}.</p>`,
    cam: { target: [ST.rl - 0.15, 1.75, 0], az: 8, el: 8, dist: 14 }, lit: 'rl', scene: 'rl', look: {},
    fig: '12 V, 4 Ω, 2 H',
  },
  {
    kicker: '15.9', title: "LC振荡", sub: "电荷晃动通过线圈",
    body: `<p class="lede"> 将 ${f(M.LC.C * 1e6, 0)} µF 电容器充电至 ${f(M.LC.Q * 1e6, 0)} µC，并将其连接到 ${f(M.LC.L * 1e3, 0)} mH 线圈。电荷通过线圈流出，过冲，以另一种方式对极板充电，然后流回。</p>
      ${steps([
        ['<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i> = 0', 'loop rule'],
        ['<i>L d</i><sup>2</sup><i>q</i>/<i>dt</i><sup>2</sup> + <i>q</i>/<i>C</i> = 0', '<i>I</i> = <i>dq</i>/<i>dt</i>'],
        ['<i>q</i> = <i>Q</i> cos ω<i>t</i>, &nbsp;<i>I</i> = −ω<i>Q</i> sin ω<i>t</i>', `ω = 1/√(<i>LC</i>) = ${f(M.LC.w, 0)} rad/s`],
      ])}
      <p>的周期为<i>T</i> = 2π√(<i>LC</i>) = ${f(M.LC.T * 1e3, 2)} ms (${f(M.LC.f, 0)} Hz);该人物运行速度较慢 ${Math.round(M.LC.slow / 10) * 10}×。当 <i>q</i> 通过 0 时，电流达到峰值 ω<i>Q</i> = ${f(M.LC.Imax * 1e3, 0)} mA，并且当板充满时为零：相隔四分之一周期。线圈的反电动势携带电流经过 <i>q</i> = 0.</p>
      ${two('qLC', 'iLC', { xlabel: 't (ms)', ylabel: 'q (µC)', rlabel: 'I (mA)', label: 'Charge on the top plate and current against time',
        series: [{ pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).q * 1e6) }, { r: 1, pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).I * 1e3) }],
        marks: [[M.LC.T * 1e3, 100, 'T', 6, 14]] })}
      <div class="eq"><i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> = ${f(M.LC.U * 1e3, 2)} mJ</div>
      <div class="charts">${barChart('lc', [['UE', 'U_E = q²/2C', '#8fb0f0'], ['UB', 'U_B = ½LI²', '#c4c4c8'], ['U', 'total', '#f7f7f4']], `${f(M.LC.U * 1e3, 2)} mJ`)}</div>
      <table class="data"><tr><th>弹簧上的质量</th><th>LC电路</th></tr>
        <tr><td><i>x</i>，&nbsp;<i>v</i></td><td><i>q</i>， &nbsp;<i>I</i></td></tr>
        <tr><td><i>m</i>，&nbsp;<i>k</i></td><td><i>L</i>， &nbsp;1/<i>C</i></td></tr>
        <tr><td>½<i>kx</i><sup>2</sup>， &nbsp;½<i>mv</i><sup>2</sup></td><td><i>q</i><sup>2</sup>/2<i>C</i>, &nbsp;½<i>LI</i><sup>2</sup></td></tr></table>
      <p class="hintline">单击板或线圈以获得每个板或线圈所持有的能量。 ${sq('10 kV/m (E), 2 mT (B), 100 mA (I)')}.</p>`,
    cam: { target: [ST.lc + 0.3, 1.8, 0], az: 8, el: 8, dist: 12.5 }, lit: 'lcCap', scene: 'lc', look: {},
    fig: '25 µF, 40 mH, 100 µC',
  },
];

// ---------- click a scene: what it breaks into ----------
const lenzPlate = c => ({
  text: c.move === 'in'
    ? `${c.pole} 杆更近，因此更多的磁场穿过环路。该环路用电流进行响应，该电流的磁场（虚线）指向相反的方向通过它，并且它的近端面也变成 ${c.pole} 极：像极一样，因此磁铁被推回。`
    : `${c.pole} 杆移开，因此较少的磁场穿过环路。现在，电流使一个场（虚线）通过环路指向相同的方向，以弥补损失；它的近端面变成 ${c.pole === 'N' ? 'S' : 'N'} 极并将磁铁拉回。`,
  facts: s => { const r = M.lenzCase(c, s.lenz.t); return [['distance', `${f(r.d * 100, 1)} cm`], ["B在中心", `${f(Math.abs(r.Bx) * 1e3, 2)} mT ${r.Bx < 0 ? '←' : '→'}`], ["Φ（面积向量←）", `${f(r.Phi * 1e6, 2)} µWb`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 2)} µV`], ['I = ε/R (R = 10 mΩ)', `${f(r.I * 1e3, 2)} mA`]]; },
});
export const PLATES = {
  flux: { text: `在环上铺一个平坦的表面，并将其分成小块 dA。在每个上，B·dA 是直接穿过贴片面积的场（灰色箭头：沿环轴的分量）。将它们全部加起来，就得到了 Φ。靠近磁铁的箭头很长；当它离开时，它们会缩小到几乎为零。`,
    facts: s => { const r = M.fluxScene(s.flux.t); return [["磁铁距离", `${f(r.d * 100, 1)} cm`], ["B在中心", `${f(r.Bc * 1e3, 2)} mT`], ['Φ = ∫B·dA', `${f(r.Phi * 1e6, 2)} µWb`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 1)} µV`], ['I = ε/R (R = 10 mΩ)', `${f(r.I * 1e3, 2)} mA`]]; } },
  ...Object.fromEntries(M.CASES.map(c => [c.key, lenzPlate(c)])),
  mutual: { text: `线圈 1 的磁力线（随电流减弱）穿过线圈 2。通过线圈 2 各匝的磁通为 MI₁/N2。当 I₁ 上升时，线圈 2 的电流产生一个与之相反的磁场（虚线）；当我₁落下时，它也随之落下。`,
    facts: s => { const r = M.coilsScene(s.coil.t); return [['I₁', `${f(r.I1, 2)} A`], ['dI₁/dt', `${f(r.dI1, 2)} A/s`], ['M', `${f(M.COILS.M * 1e6, 0)} µH`], ['ε₂ = −M dI₁/dt', `${f(r.emf * 1e3, 3)} mV`], ['I₂ (R = 1 Ω)', `${f(r.I2 * 1e3, 3)} mA`]]; } },
  core: { text: `次级升起后：铁引导磁通，因此相同的 Φ = BA 穿过两个绕组的每一匝。次级的电动势是 N2 乘以一匝，并且 ε2/ε1 = N2/N1，这就是变压器阶跃电压的方式。`,
    facts: s => { const r = M.coreScene(s.coil.t); return [['I₁', `${f(r.I1, 3)} A`], ['B = μᵣμ₀N₁I₁/ℓ', `${f(r.B, 3)} T`], ["没有熨斗", `${f(r.Bair * 1e3, 3)} mT`], ["每转Φ", `${f(r.Phi * 1e6, 1)} µWb`], ['ε₂ = −N₂ dΦ/dt', `${f(r.emf2 * 1e3, 2)} mV`], ['ε₂/ε₁', `${f(r.emf2 / (r.emf1 || 1e-30), 2)}`]]; } },
  wire: { text: `B 在环路中发生变化，但不会沿着导线发生变化，因此将环路切成与导线平行的条带，每条宽为 b，高为 dr（由其场遮蔽）。每个持有B(r)·b dr 的通量；积分给出对数。等效地，近侧在 B_near bv 处割场，远侧在 B_far bv 处割场，差值为 ε。`,
    facts: s => { const r = M.wireScene(s.wire.t); return [["r（近侧）", `${f(r.r * 100, 1)} cm`], ['B near', `${f(r.Bnear * 1e6, 0)} µT`], ['B far', `${f(r.Bfar * 1e6, 0)} µT`], ['Φ', `${f(r.Phi * 1e6, 3)} µWb`], ['ε = (B_near − B_far)bv', `${f(r.emf * 1e6, 3)} µV`], ['I (R = 10 mΩ)', `${f(r.I * 1e3, 3)} mA`]]; } },
  bar: { text: `导体棒里一+充。磁力qv×B将其推向棒材；已经堆积在末端的电荷场 E 将其以 qE 向下推。平衡时，它仅随杆移动。沿棒每次电荷的功为 vB·L = ε。`,
    facts: s => { const r = M.barScene(s.bar.t, s.bar.resting); return [['v', `${f(r.v, 2)} m/s`], ["qvB（一个质子的电荷）", `${(r.Fmag).toExponential(2)} N`], ['qE', `${(M.E_CHARGE * r.E).toExponential(2)} N`], ['E = vB', `${f(r.E, 2)} V/m`], ['ε = BLv', `${f(r.emf, 3)} V`], ['current', '0']]; } },
  crossing: { text: `在场中的每个直立侧，v×B 通过电动势 BLv 将电荷推向该侧。当只有一侧进入时，该推动力会驱动周围的电流。当两者都进入时，推动力在环路正面相遇并取消：ε = 0，即使环路正在穿过一个场。`,
    facts: s => { const r = M.crossScene(s.cross.t); return [["领先方", r.inLead ? "在外地" : 'outside'], ["尾随侧", r.inTrail ? "在外地" : 'outside'], ["每边 BLv", `${f(r.sideEmf * 1e3, 0)} mV`], ['Φ', `${f(r.Phi * 1e3, 1)} mWb`], ['ε around', `${f(r.emf * 1e3, 0)} mV`], ['I = ε/R', `${f(r.I * 1e3, 0)} mA`]]; } },
  rails: { text: `阴影区域 Lx 是磁通量经过的环路，随着棒的移动而增大。它感应出的电流沿条形向上流动，该电流上的 ILB 指向后方（红色：唯一的水平力，合力）。制动功率 Fv 加热电阻器。`,
    facts: s => { const r = M.railScene(s.rail.t); return [['v', `${f(r.v, 3)} m/s`], ['ε = BLv', `${f(r.emf, 3)} V`], ['I = ε/R', `${f(r.I, 3)} A`], ['F = ILB', `${f(r.F, 3)} N`], ['Fv', `${f(r.F * r.v, 4)} W`], ['I²R', `${f(r.P, 4)} W`], ["到目前为止热度", `${f(r.heat * 1e3, 1)} mJ`]]; } },
  solenoid: { text: `在长线圈内部，B = μ₀nI 是均匀的，因此每匝都保持 Φ = BA（阴影匝）。所有 N 匝加起来就有 NΦ，NΦ/I 就是电感。当 I 改变时，NΦ 改变，反电动势 −L dI/dt 指向抵抗它： + 电流上升时进入的位置。`,
    facts: s => { const r = M.solScene(s.sol.t); return [['I', `${f(r.I, 2)} A`], ['B = μ₀nI', `${f(r.B * 1e3, 2)} mT`], ["每转 Φ = BA", `${f(r.Phi * 1e6, 2)} µWb`], ['NΦ = LI', `${f(r.NPhi * 1e3, 3)} mWb`], ['ε_L = −L dI/dt', `${f(r.emfL * 1e3, 2)} mV`], ['U = ½LI²', `${f(r.U * 1e3, 2)} mJ`]]; } },
  rl: { text: `电流沿着环路走：向上流过电池（+ε，当电池处于供电状态时），向下流过电阻器 (−IR)，向下流过电感器 (−L dI/dt)。它们的总和总是为零。随着电阻的增长，电感器吸收了电阻器所没有的东西；腐烂，它就成为源头。`,
    facts: s => { const r = M.rlScene(s.rl.t); return [[r.growing ? 'growing, t' : 'decaying, t', `${f(r.s, 2)} s`], ['I', `${f(r.I, 3)} A`], ['ε (battery)', `${f(r.emfBat, 1)} V`], ['IR', `${f(r.VR, 2)} V`], ['L dI/dt', `${f(r.VL, 2)} V`], ['U = ½LI²', `${f(r.U, 2)} J`], ["热耗率 I²R", `${f(r.P, 2)} W`]]; } },
  lcCap: { text: `能量存在于板块之间的场中（阴影部分：能量越多，颜色越深）。 ΔV = q/C，且 U_E = q²/2C = ½CΔV²。当极板通过线圈时，阴影就会消失。它回来时，板子以相反的方式充电，E 颠倒了。`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['t (real)', `${f(s.lc.t * 1e3, 2)} ms`], ["q（顶板）", `${f(r.q * 1e6, 1)} µC`], ['ΔV = q/C', `${f(r.V, 2)} V`], ['E = ΔV/d (d = 1 mm)', `${f(r.E / 1e3, 2)} kV/m`], ['U_E = q²/2C', `${f(r.UE * 1e3, 3)} mJ`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} mJ`]]; } },
  lcCoil: { text: `能量存在于线圈的磁场中（阴影部分）。当 q 超过 0 时，U_B = ½LI² 最大。线圈的反电动势在每个瞬间都等于电容器的 ΔV，因此 L dI/dt = −q/C：它会在极板充满时减慢电流，并在极板排空时保持电流继续流动。`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['I = dq/dt', `${f(r.I * 1e3, 1)} mA`], ['dI/dt = −q/LC', `${f(r.dI, 0)} A/s`], ['L dI/dt', `${f(M.LC.L * r.dI, 2)} V`], ['B = LI/NA (1600 turns)', `${f(r.B * 1e3, 3)} mT`], ['U_B = ½LI²', `${f(r.UB * 1e3, 3)} mJ`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} mJ`]]; } },
};
