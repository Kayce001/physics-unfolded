// Chapter 6, page by page (after the AP Physics 1 organizer, Unit 7). Text and charts on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, PAPER, TQ_ARC } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const deg = r => (r / M.DEG).toFixed(0);

// ---------- small SVG charts for the left page, with live cursors ----------
const W = 420, P = { l: 44, r: 14, t: 16, b: 30 };
export const CURSORS = {};       // key → (x, y) → [cx, cy]
export const LIVE = {};          // key → (t) → path d, for a series that is redrawn every frame
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, h = 170, ylabels, xlabels }) {
  const H = h;
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  for (const c of cursors) CURSORS[c] = (x, y) => [sx(x), sy(y)];
  const toD = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  for (const s of series) if (s.live) { LIVE[s.live] = t => toD(s.fn(t)); s.pts = s.fn(0); }
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.live ? ` data-live="${s.live}"` : ''} d="${toD(s.pts)}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const [yt, yb] = ylabels || [y1, y0], [xl, xr] = xlabels || [x0, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${yt}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${yb}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${xl}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${xr}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const sample = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const T2 = 2 * M.T0;

const at = (k, dx = 0, dy = 0.35) => [STATIONS[k] + dx, dy, 0];

export const PAGES = [
  {
    kicker: "第6章", title: "振动", sub: "来来回回",
    body: `<p class="lede"><b>振动</b> 是围绕 <b>平衡位置</b> 位置来回运动。当 <b> 恢复力 </b> 将其按与其位移成比例拉回到平衡状态时，它是 <b> 简谐振动 </b> (SHM)。那么周期就永远不会改变。</p>
      <table class="data">
        <tr><td>振幅<i>A</i>：距平衡最远</td><td>${f(M.A)} m</td></tr>
        <tr><td>period <i>T</i>：一个完整周期的时间</td><td>${f(M.T0, 3)} s</td></tr>
        <tr><td>频率 <i>f</i> = 1/<i>T</i>：每秒周期数</td><td>${f(M.F0, 3)} Hz</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -M.A, y1: M.A, ylabels: ['+A', '−A'], xlabel: 'time', ylabel: 'position x', cursors: ['x0'], label: 'Position against time: a cosine', h: 140,
        series: [{ pts: sample(u => M.spring(u * T2).x, 0, 1) }], marks: [[0.5, M.A, 'T', -3, 16]] })}</div>
      <p class="hintline">轮廓是相同时间的频闪图像：在块缓慢的末端聚集。单击 v 和 a 的块。</p>`,
    cam: { target: at('spring', -0.25, 0.3), az: -20, el: 20, dist: 7.6 }, lit: 'spring', scene: 'spring', look: {},
    fig: "弹簧无摩擦地板上的块",
  },
  {
    kicker: '6.1', title: "胡克定律", sub: "恢复力",
    body: `<p class="lede">拉伸或挤压弹簧，弹簧会向后推，与末端移动的距离成比例：</p>
      <div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></div>
      <p><i>k</i> = ${M.K} N/m 是 <b> 弹簧常数 </b>，即刚度。负号：力始终指向 <b> 相反的 </b> 位移。重力和法向力抵消，因此 <i>F</i><sub>s</sub> 是合力，<i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i>（红色）。</p>
      <table class="data">
        <tr><th>其中</th><th>力、加速度</th><th>速度</th></tr>
        <tr><td><i>x</i> = ±<i>A</i></td><td>${f(M.FMAX, 1)} N，${f(M.AMAX, 1)} m/s²： max</td><td>0</td></tr>
        <tr><td><i>x</i> = 0</td><td>0</td><td>${f(M.VMAX, 1)} m/s：最大</td></tr>
      </table>
      <div class="charts">${chart({ x0: -M.A, x1: M.A, y0: -M.FMAX, y1: M.FMAX, xlabel: 'displacement x (m)', ylabel: 'F (N)', cursors: ['Fx'], label: 'Spring force against displacement: a line of slope −k', h: 130,
        series: [{ pts: [[-M.A, M.FMAX], [M.A, -M.FMAX]], tag: [0.12, -2.4, 'slope −k'] }] })}</div>
      <p class="hintline">单击该块查看其自由体图。</p>`,
    cam: { target: at('hooke', -0.2, 0.3), az: -16, el: 14, dist: 7.8 }, lit: 'hooke', scene: 'hooke', look: {},
    fig: "力始终朝向 x = 0",
  },
  {
    kicker: '6.2', title: "x、v 和 a", sub: "余弦及其斜率",
    body: `<p class="lede">A 纸条从块下方滑出，因此块根据时间绘制自己的位置：余弦。</p>
      <table class="data eqs">
        <tr><td><i>x</i> = <i>A</i> cos 2π<i>ft</i></td><td>±<i>A</i> 在结束</td></tr>
        <tr><td><i>v</i> = −2π<i>fA</i> sin 2π<i>ft</i></td><td>max ${f(M.VMAX)} m/s 在<i>x</i> = 0</td></tr>
        <tr><td><i>a</i> = −4π²<i>f</i>²<i>A</i> cos 2π<i>ft</i></td><td>max ${f(M.AMAX)} m/s² 于 ±<i>A</i></td></tr>
      </table>
      <p>Eeach 图是上图的斜率：cos → −sin → −cos。 <i>a</i> 是 <i>x</i> 翻转和缩放后的结果。</p>
      <div class="charts">
        ${chart({ x0: 0, x1: 1, xlabels: ['', ''], y0: -1, y1: 1, ylabels: ['+A', '−A'], xlabel: '', ylabel: 'x', cursors: ['tx'], label: 'Position: cosine', h: 78, series: [{ pts: sample(u => Math.cos(2 * Math.PI * 2 * u), 0, 1) }] })}
        ${chart({ x0: 0, x1: 1, xlabels: ['', ''], y0: -1, y1: 1, ylabels: ['+max', '−max'], xlabel: '', ylabel: 'v', cursors: ['tv'], label: 'Velocity: negative sine', h: 78, series: [{ pts: sample(u => -Math.sin(2 * Math.PI * 2 * u), 0, 1) }] })}
        ${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -1, y1: 1, ylabels: ['+max', '−max'], xlabel: 'time', ylabel: 'a', cursors: ['ta'], label: 'Acceleration: negative cosine', h: 88, series: [{ pts: sample(u => -Math.cos(2 * Math.PI * 2 * u), 0, 1) }] })}
      </div>
      <p class="hintline">单击笔迹处的斜率：速度。</p>`,
    cam: { target: [STATIONS.trace - 0.1, 0, 1.45], az: -10, el: 52, dist: 11 }, lit: 'trace', scene: 'trace', look: {},
    fig: "该块根据 t 绘制 x",
  },
  {
    kicker: '6.3', title: "能源", sub: "交易，从未丢失",
    body: `<p class="lede"> 没有摩擦，整体保持原状。它只是在块的运动和弹簧之间移动：</p>
      <div class="eq">½<i>kA</i>² = ½<i>mv</i>² + ½<i>kx</i>²</div>
      <p>在±<i>A</i>时，全部处于弹簧状态，½<i>kA</i>² = ${f(M.E)} J。在<i>x</i> = 0时，全部是动能的，因此½<i>mv</i><sub>max</sub>² = ½<i>kA</i>² 和 <i>v</i><sub>max</sub> = √(<i>k</i>/<i>m</i>)·<i>A</i> = ${f(M.VMAX)} m/s。份额相等为 <i>x</i> = <i>A</i>√2/2 = ${f(M.X_HALF, 3)} m，而不是中间。</p>
      <div class="charts">${chart({ x0: -M.A, x1: M.A, y0: 0, y1: M.E, xlabel: 'position x (m)', ylabel: 'energy (J)', cursors: ['U', 'K'], label: 'Kinetic and spring energy against position', h: 140,
        series: [{ pts: sample(x => 0.5 * M.K * x * x, -M.A, M.A), tag: [0.27, 0.32, 'U'] }, { pts: sample(x => M.E - 0.5 * M.K * x * x, -M.A, M.A), tag: [-0.06, 1.72, 'K'] }],
        marks: [[M.X_HALF, M.E / 2, 'K = U', 8, 4]] })}</div>
      <p>弹簧能量是拉伸它所做的功：<i>F</i>下的三角形 = <i>kx</i>, ½(<i>kx</i>)<i>x</i>.</p>
      <p class="hintline">单击可将动力部件从堆栈中提起。</p>`,
    cam: { target: at('energy', 0.95, 0.6), az: -10, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: "动能和弹簧能",
  },
  {
    kicker: '6.4', title: "一个悬挂的弹簧", sub: "重力移动中间，而不是节拍",
    body: `<p class="lede">由同一弹簧固定同一块。它会下垂，直到弹簧保持其重力，<i>kd</i> = <i>mg</i>:</p>
      <div class="eq"><i>d</i> = <i>mg</i>/<i>k</i> = ${f(M.D, 3)} m</div>
      <p>即是新的均衡。从那里测量 <i>y</i>，重力消失：<i>k</i>(<i>d</i> − <i>y</i>) − <i>mg</i> = −<i>ky</i>。再次遵循胡克定律，因此它的摆动周期与地板上相同，${f(M.T0, 3)} s.</p>
      <table class="data">
        <tr><th>其中</th><th>弹簧</th><th>重力</th><th>net（红色）</th></tr>
        <tr><td>top</td><td>${f(M.K * (M.D - M.HANG.A))} N</td><td>${f(M.WEIGHT)} N</td><td>${f(M.K * M.HANG.A)} N ↓</td></tr>
        <tr><td>平衡</td><td>${f(M.WEIGHT)} N</td><td>${f(M.WEIGHT)} N</td><td>0</td></tr>
        <tr><td>底部</td><td>${f(M.K * (M.D + M.HANG.A))} N</td><td>${f(M.WEIGHT)} N</td><td>${f(M.K * M.HANG.A)} N ↑</td></tr>
      </table>
      <p class="hintline">单击该块查看其自由体图。</p>`,
    cam: { target: at('hang', 0.1, 1.9), az: -14, el: 6, dist: 9 }, lit: 'hang', scene: 'hang', look: {},
    fig: "垂直弹簧上的块",
  },
  {
    kicker: '6.5', title: "钟摆", sub: "SHM，如果波动较小",
    body: `<p class="lede">绳子会沿着自身拉动，因此只有重力才能将鲍勃沿着弧线拉回：</p>
      <div class="eq"><i>F</i> = −<i>mg</i> sin θ</div>
      <p>与θ不太成正比。但在 10° 以下，sin θ ≈ θ（弧度），所以 <i>F</i> ≈ −<i>mg</i>θ 是 SHM 和 </p>
      <div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = ${f(M.P_T, 3)} s</div>
      <p>在±${deg(M.PEND.th0)}°时，真实周期仅长${f(100 * (M.periodExact(M.PEND.L, M.PEND.th0) / M.P_T - 1), 2)}%。在底部没有恢复力，并且摆锤速度最快： ½<i>mv</i>² = <i>mg</i>Δ<i>y</i> 给出 ${f(M.vmaxPendulum(M.PEND.L, M.PEND.th0), 3)} m/s.</p>
      <div class="charts">${chart({ x0: 0, x1: 60, y0: 0, y1: 1.05, ylabels: ['mg', '0'], xlabel: 'angle θ (°)', ylabel: 'restoring force', cursors: ['th'], label: 'mg sin theta against mg theta', h: 120,
        series: [{ pts: sample(d => Math.sin(d * M.DEG), 0, 60), tag: [46, Math.sin(46 * M.DEG) - 0.24, 'mg sin θ'] }, { cls: 'trend', pts: sample(d => d * M.DEG, 0, 60), tag: [40, 40 * M.DEG + 0.04, 'mgθ'] }, { cls: 'grid', pts: [[10, 0], [10, 1.05]] }],
        marks: [[10, Math.sin(10 * M.DEG), '10°', 6, 16]] })}</div>
      <p class="hintline">箭头：${(P_SCALE * 100).toFixed(0)} 厘米每牛顿。单击鲍勃以分割其重力。</p>`,
    cam: { target: at('pendulum', 0, 2.05), az: -12, el: 5, dist: 9.5 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: `A ${M.PEND.L.toFixed(1)} 米摆锤，±${deg(M.PEND.th0)}°`,
  },
  {
    kicker: '6.6', title: "期间加倍", sub: "注意平方根",
    body: `<p class="lede">周期为<i>m</i>、1/<i>k</i>或<i>L</i>的<i>square root</i>。要加倍，请将它们加四倍。</p>
      <table class="data cols">
        <tr><th>弹簧上的质量</th><th>摆</th></tr>
        <tr><td><i>T</i> = 2π√(<i>m</i>/<i>k</i>)</td><td><i>T</i> = 2π√(<i>L</i>/<i>g</i>)</td></tr>
        <tr><td>2<i>T</i>：4<i>m</i>或1/4<i>k</i></td><td>2<i>T</i>： 4<i>L</i></td></tr>
        <tr><td>${f(M.periodSpring(M.DOUBLE.m, M.K))} → ${f(M.periodSpring(M.DOUBLE.m4, M.K))} s</td><td>${f(M.periodPendulum(M.DOUBLE.L))} → ${f(M.periodPendulum(M.DOUBLE.L4))} s</td></tr>
      </table>
      <p><b>带数字。</b> 8 kg，2 N/m：<i>T</i> = 2π√(8/2) = 4π s。对于 8π s，8π = 2π√(<i>m</i>/2) 得出 <i>m</i> = 32 kg：四倍。</p>
      <p><b>有比例。</b> <i>T</i> ∝ √<i>m</i>，所以 2<i>T</i> ∝ √(<u>&nbsp;?&nbsp;</u><i>m</i>)：2的平方根是多少？四。当 <i>k</i> 位于该线下方时，2 = √(1/<i>x</i>) 给出 ¼。仅扩展您更改的内容； 2π 和 ½ 沿行。</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 3.5, xlabel: 'mass on the 16 N/m spring (kg)', ylabel: 'period (s)', label: 'Period against mass: a square root', h: 120,
        series: [{ pts: sample(m => M.periodSpring(m, M.K), 0, 4) }], marks: [[1, M.periodSpring(1, M.K), 'm: 1.57 s', 6, 14], [4, M.periodSpring(4, M.K), '4m: 3.14 s', -64, 16]] })}</div>
      <p class="hintline">单击任一对以计算其周期。</p>`,
    cam: { target: at('double', -0.45, 1.6), az: -12, el: 10, dist: 16.5 }, lit: 'springs4', scene: 'double', look: {},
    fig: "4×质量，4×长度：2×周期",
  },
  {
    kicker: '6.7', title: "它忽略了什么", sub: "振幅和摆的质量",
    body: `<p class="lede">Amplitude 不会改变 <b> 而不是 </b> 改变周期。它不在这两个公式中。</p>
      <p>远块的起始位置是远块的两倍。同时加倍的力，加倍的加速度，加倍的距离：两者保持同步。</p>
      <p>Nor 摆的 <b>质量</b>：<i>ma</i> = −<i>mg</i> sin θ，并且 <i>m</i> 抵消，就像自由落体一样。 ${f(M.IGNORE.m2, 0)} 公斤鲍勃与 ${f(M.IGNORE.m1, 0)} 公斤鲍勃保持同步。</p>
      <table class="data">
        <tr><th>更改</th><th>期间</th></tr>
        <tr><td>弹簧上的质量 <i>m</i></td><td><i>T</i> ∝ √<i>m</i></td></tr>
        <tr><td>弹簧常数<i>k</i></td><td><i>T</i> ∝ 1/√<i>k</i></td></tr>
        <tr><td>摆长 <i>L</i></td><td><i>T</i> ∝ √<i>L</i></td></tr>
        <tr><td>摆质量</td><td>无变化</td></tr>
        <tr><td>振幅（小，用于摆）</td><td>无变化</td></tr>
      </table>`,
    cam: { target: at('ignore', -0.6, 1.2), az: -12, el: 11, dist: 13.5 }, lit: 'amp', scene: 'ignore', look: {},
    fig: "两个振幅，两个质量，各一个周期",
  },

  {
    kicker: "6.8 · AP 物理 C", title: "SHM方程", sub: "为什么答案是余弦",
    body: `<p class="lede">将胡克定律代入 Σ<i>F</i> = <i>ma</i> 你会得到一个方程 <i>x</i>(<i>t</i>):</p>
      <div class="eq">d²<i>x</i>/d<i>t</i>² = −(<i>k</i>/<i>m</i>) <i>x</i></div>
      <p>尝试一下 <i>x</i> = <i>A</i> 余弦(ω<i>t</i> + φ): 二次微分，即 -<i>A</i>ω² 余弦(ω<i>t</i> + φ) = −ω²<i>x</i>。这适合任何 <i>A</i> 如果 ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} 弧度/秒。 <i>A</i> 和 φ 从一开始， <i>x</i><sub>0</sub> = <i>A</i> 余弦 φ 和 <i>v</i><sub>0</sub> = −<i>A</i>ω 正弦 φ：</p>
      <div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) &nbsp; tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub></div>
      <table class="data">
        <tr><th>开始</th><th><i>x</i><sub>0</sub>, <i>v</i><sub>0</sub></th><th><i>A</i></th><th>φ</th></tr>
        ${M.STARTS.map((st, i) => `<tr><td>${i ? 'pushed' : 'let go'}</td><td>${f(st.x0)} m, ${f(st.v0, 1)} m/s</td><td>${f(st.A)} m</td><td>${f(st.phi / M.DEG, 1)}°</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -0.55, y1: 0.55, ylabels: ['0.5 m', '−0.5'], xlabel: 'time', ylabel: 'x', cursors: ['st0', 'st1'], label: 'Position against time for the two starts: same period, different amplitude and phase', h: 112,
        series: [{ cls: 'trend', pts: sample(u => M.start(0, u * T2).x, 0, 1, 160) }, { pts: sample(u => M.start(1, u * T2).x, 0, 1, 160) }] })}</div>
      <p class="hintline">破折号：放开。固：推动。单击任一块。</p>`,
    cam: { target: at('ode', 0.05, 0.45), az: -8, el: 16, dist: 16.5 }, lit: 'starts', scene: 'ode', look: {},
    fig: "一个方程，两个起点",
  },
  {
    kicker: "6.9 · AP 物理 C", title: "物理摆", sub: "枢轴上的刚体",
    body: `<p class="lede">刚体的重力作用于其质心，距离 <i>d</i> 低于枢轴，然后将其扭转回来：</p>
      <div class="eq">τ = −<i>mgd</i> sin θ ≈ −<i>mgd</i> θ</div>
      <p><i>I</i>α = τ 得出 d²θ/d<i>t</i>² = −(<i>mgd</i>/<i>I</i>)θ：SHM，其中 ω = √(<i>mgd</i>/<i>I</i>）和</p>
      <div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>)</div>
      <p><i>I</i> 关于枢轴： <i>I</i> = <i>I</i><sub>cm</sub> + <i>md</i>²（平行轴）。</p>
      <table class="data">
        <tr><th></th><th><i>I</i></th><th><i>d</i></th><th><i>T</i></th></tr>
        <tr><td>鲍勃，字符串 <i>L</i></td><td><i>mL</i>²</td><td><i>L</i></td><td>2π√(<i>L</i>/<i>g</i>) = ${f(M.periodPendulum(M.ROD.L))} s</td></tr>
        <tr><td>杆 <i>L</i>，到最后</td><td>⅓<i>mL</i>²</td><td><i>L</i>/2</td><td>2π√(2<i>L</i>/3<i>g</i>) = ${f(M.ROD.T)} s</td></tr>
        <tr><td>钉在钉子上</td><td>2<i>mR</i>²</td><td><i>R</i></td><td>2π√(2<i>R</i>/<i>g</i>) = ${f(M.HOOP.T)} s</td></tr>
      </table>
      <div class="charts">${chart({ x0: -5, x1: 0, xlabels: ['5 s ago', 'now'], y0: -9, y1: 9, ylabels: ['+8°', '−8°'], xlabel: 'time', ylabel: 'θ', cursors: ['rodNow', 'strNow'], label: 'Angle against time for the rod and a simple pendulum of the same length: the rod has the shorter period', h: 104,
        series: [{ cls: 'trend', live: 'strTh', fn: t => sample(u => M.pendulum(t + u, M.ROD.L, M.ROD.th0).th / M.DEG, -5, 0, 160) }, { live: 'rodTh', fn: t => sample(u => M.physical(M.ROD, t + u).th / M.DEG, -5, 0, 160) }] })}</div>
      <p class="hintline">固体：棒。虚线：字符串。单击杆。</p>`,
    cam: { target: at('physical', 0.1, 2.1), az: -8, el: 6, dist: 11.5 }, lit: 'rod', scene: 'physical', look: {},
    fig: "一根绳子、一根杆子和一个箍子，每个都在一个枢轴上",
  },
  {
    kicker: "6.10 · AP 物理 C", title: "扭摆", sub: "一个扭转，一个扭转",
    body: `<p class="lede">用电线吊起一个圆盘并转动它。钢丝按角度成比例向后扭转，胡克转动定律：</p>
      <div class="eq">τ = −κθ &nbsp;⇒&nbsp; <i>T</i> = 2π√(<i>I</i>/κ)</div>
      <p>since <i>I</i>α = −κθ 是弹簧方程，其中 <i>m</i> → <i>I</i> 和 <i>k</i> → κ，线材的 <b> 扭转常数 </b>、${M.TORS.kappa} N·m/弧度。半径为 ${f(M.TORS.R)} m 的 ${f(M.TORS.M, 1)} kg 圆盘有 <i>I</i> = ½<i>MR</i>² = ${f(M.TORS.I, 3)} kg·m²，因此 <i>T</i> = ${f(M.TORS.T, 2)} s.</p>
      <p> 这次没有小角度步进：无论电线扭曲多远（在其限制内），力矩都与 θ 成正比。在 ${(M.TORS.th0 / M.DEG).toFixed(0)}° 或 5° 时，周期相同。</p>
      <div class="charts">${chart({ x0: -60, x1: 60, y0: -0.3, y1: 0.3, ylabels: ['0.3 N·m', '−0.3'], xlabels: ['−60°', '60°'], xlabel: 'twist θ', ylabel: 'τ', cursors: ['tq'], label: 'Torque against twist angle: a straight line of slope minus kappa', h: 120,
        series: [{ pts: [[-60, M.TORS.kappa * 60 * M.DEG], [60, -M.TORS.kappa * 60 * M.DEG]], tag: [12, -0.08, 'slope −κ'] }] })}</div>
      <p class="hintline">点击圆盘查看钢丝在其上的力矩。</p>`,
    cam: { target: at('torsion', 0.1, 1.9), az: -14, el: 22, dist: 5.9 }, lit: 'disc', scene: 'torsion', look: {},
    fig: "缠绕在电线上的圆盘",
  },
  {
    kicker: '6.11', title: "日常震荡指标", sub: "一辆车，一个秋千",
    body: `<p class="lede">任何具有随位移而增加的恢复力的物体都会振荡。</p>
      <p><b>A 汽车在其弹簧上。</b> ${M.CAR.m} kg 在四个弹簧上，${(M.CAR.k / 1000).toFixed(0)} kN/m 在一起。它在其重力下下垂 ${f(100 * M.CAR.d, 1)} 厘米；按下它，它会弹起 <i>T</i> = 2π√(<i>m</i>/<i>k</i>) = ${f(M.CAR.T)} s。 （真正的减震器在一两个周期内就能消除这种影响；在这里它们就关闭了。）</p>
      <p><b>A秋千。</b> ${f(M.SWING.L, 1)} m秋千上的孩子是一个钟摆： <i>T</i> = 2π√(<i>L</i>/<i>g</i>) = ${f(M.SWING.T)} s，小推或大，轻或重。这就是为什么你要按节奏推进。</p>
      <table class="data cols">
        <tr><th>弹簧上的质量</th><th>摆</th></tr>
        <tr><td>恢复−<i>kx</i></td><td>恢复−<i>mg</i> sin θ</td></tr>
        <tr><td>小θ总是SHM</td><td>SHM</td></tr>
        <tr><td>½<i>kA</i>² = ½<i>mv</i><sub>max</sub>²</td><td><i>mg</i>Δ<i>y</i> = ½<i>mv</i><sub>max</sub>²</td></tr>
      </table>`,
    cam: { target: at('life', -1.4, 1.4), az: -12, el: 8, dist: 19.5 }, lit: 'car', scene: 'life', look: {},
    fig: "汽车颠簸，孩子摇摆",
  },
];

// ---------- click a scene: what it breaks into ----------
const phase = t => { const s = M.spring(t); return Math.abs(s.x) > 0.97 * M.A ? "结束时：停止，力和加速度最大" : Math.abs(s.x) < 0.03 * M.A ? "平衡时：最快，无力" : s.x * s.v < 0 ? "前进：加速" : "出发：放慢速度"; };
export const PLATES = {
  spring: { text: `恢复力之上的速度（黑色）和加速度（红色）。加速度总是指向中间，就像力一样。速度指向块所去的任何地方。进去后，他们同意了，阻塞速度加快了；出发时，他们意见不一致，速度就慢了。`,
    facts: s => { const r = M.spring(s.t); return [['position x', `${f(r.x)} m`], ['velocity v', `${f(r.v)} m/s`], ['acceleration a', `${f(r.a)} m/s²`], ['now', phase(s.t)]]; } },
  hooke: { text: `该块缩小为一个点：它的自由体图。重力和法向力抵消。弹簧力是唯一剩下的力，因此它是合力，并且它始终指向 x = 0。`,
    facts: s => { const r = M.spring(s.t); return [['displacement x', `${f(r.x)} m`], ['F<sub>s</sub> = −kx', `${f(r.F)} N`], ['a = F<sub>s</sub>/m', `${f(r.a)} m/s²`], ["重力、支持力", `${f(M.WEIGHT)} N各，取消`]]; } },
  trace: { text: `红线是笔处轨迹的切线。纸每秒移动 ${PAPER} 米，所以笔每秒横向移动的距离，斜率，就是方块的速度。当笔穿过中间时，它是最陡的，而边缘则平坦。`,
    facts: s => { const r = M.spring(s.t); return [['x', `${f(r.x)} m`], ['slope = v', `${f(r.v)} m/s`], ['a', `${f(r.a)} m/s²`], ['t', `${f(s.t % M.T0)} s of ${f(M.T0, 3)} s`]]; } },
  energy: { text: `该堆栈分为两部分。它们的高度每时每刻都在变化，但它们总能到达虚线：½kA²。`,
    facts: s => { const r = M.spring(s.t); return [['kinetic ½mv²', `${f(r.KE)} J`], ['spring ½kx²', `${f(r.U)} J`], ['total', `${f(r.KE + r.U)} J`], ['x', `${f(r.x)} m`]]; } },
  hang: { text: `自由体图。弹簧总是向上拉（这里总是被拉伸）；重力下降。它们的差异，即红色合力，为−ky：平衡时为零，顶部和底部最大。`,
    facts: s => { const r = M.hang(s.t); return [["y 从平衡", `${f(r.y)} m`], ['spring k(d − y)', `${f(r.Fs)} N up`], ["体重 毫克", `${f(M.WEIGHT)} N down`], ['net = −ky', `${f(r.net)} N`]]; } },
  pendulum: { text: `重力被它的两个部分（灰色）取代：沿着绳子和沿着弧线。沿着绳子，mg cos θ 被张力所抵消，这也会将路径弯曲成圆形。沿着弧线，mg sin θ 是恢复力：它指向底部。`,
    facts: s => { const p = M.pendulum(s.t); return [['angle θ', `${f(p.th / M.DEG, 1)}°`], ["mg sin θ（恢复）", `${f(Math.abs(p.restoring), 3)} N`], ["mg cos θ", `${f(p.along, 3)} N`], ['tension T', `${f(p.tension, 3)} N`], ['speed', `${f(Math.abs(p.v), 3)} m/s`]]; } },
  springs4: { text: `4.0 kg 块的质量是相同 16 N/m 弹簧的四倍。每完成一个周期，1.0 kg 的块就完成两个周期。`,
    facts: s => [['1.0 kg: T', `${f(M.periodSpring(1, M.K), 3)} s`], ['4.0 kg: T', `${f(M.periodSpring(4, M.K), 3)} s`], ["到目前为止的周期", `${f(s.t / M.periodSpring(1, M.K), 1)} and ${f(s.t / M.periodSpring(4, M.K), 1)}`]] },
  pend4: { text: `长摆的长度是短摆的四倍。短的每摆动两次，它就摆动一次。`,
    facts: s => [[`${f(M.DOUBLE.L)} m: T`, `${f(M.periodPendulum(M.DOUBLE.L), 3)} s`], [`${f(M.DOUBLE.L4, 1)} m: T`, `${f(M.periodPendulum(M.DOUBLE.L4), 3)} s`], ["到目前为止波动", `${f(s.t / M.periodPendulum(M.DOUBLE.L), 1)} and ${f(s.t / M.periodPendulum(M.DOUBLE.L4), 1)}`]] },
  amp: { text: `同样的块，同样的弹簧，一个拉出两倍远。在每一瞬间，远处的那个都有两倍的位移、两倍的力和两倍的速度，所以它们一起到达两端和中间。`,
    facts: s => [['small: x', `${f(M.spring(s.t, M.IGNORE.A1).x)} m`], ['large: x', `${f(M.spring(s.t, M.IGNORE.A2).x)} m`], ['ratio', '2, always'], ['both: T', `${f(M.T0, 3)} s`]] },
  bobs: { text: `四倍质量意味着四倍恢复力，四倍移动惯性。它们取消了，鲍勃一起摆动。`,
    facts: s => [["1 kg: mg sin θ", `${f(Math.abs(M.pendulum(s.t, M.IGNORE.L, M.IGNORE.th0, 1).restoring), 3)} N`], ["4 kg: mg sin θ", `${f(Math.abs(M.pendulum(s.t, M.IGNORE.L, M.IGNORE.th0, 4).restoring), 3)} N`], ['both: T', `${f(M.periodPendulum(M.IGNORE.L), 3)} s`]] },

  starts: { text: `每个块都是一个红点围绕半径为 A 且 ω = √(k/m) 的圆的阴影。两个点以相同的速率循环；它们从不同大小的圆上的不同角度 φ 开始。被推动的方块的点从 53° 开始，所以它的方块已经进入了。`,
    facts: s => [0, 1].map(i => { const r = M.start(i, s.t), st = M.STARTS[i]; return [i ? 'pushed' : 'let go', `x ${f(r.x)} m, A ${f(st.A)} m, φ ${f(st.phi / M.DEG, 0)}°`]; }).concat([['ω, both', `${f(M.W, 1)} rad/s`], ['T, both', `${f(M.T0, 3)} s`]]) },
  string: { text: `单摆是一种物理摆，其所有质量都集中在一点：I = mL² 且 d = L，因此 2π√(I/mgd) = 2π√(L/g)。`,
    facts: s => { const p = M.pendulum(s.t, M.ROD.L, M.ROD.th0); return [['angle', `${f(p.th / M.DEG, 1)}°`], ['I = mL²', `${f(M.ROD.m * M.ROD.L ** 2, 2)} kg·m²`], ['d', `${f(M.ROD.L, 2)} m`], ['T', `${f(M.periodPendulum(M.ROD.L), 3)} s`]]; } },
  rod: { text: `重力作用于质心，枢轴下方 d = L/2。它穿过杆（红色）的部分具有杠杆臂 d，因此 τ = −mgd sin θ。 2L/3 处的红色标记是摆动中心：绳子上的摆锤与杆同步摆动。`,
    facts: s => { const r = M.physical(M.ROD, s.t); return [['angle', `${f(r.th / M.DEG, 1)}°`], ["τ = −mgd sin θ", `${f(r.torque, 3)} N·m`], ['I = ⅓mL²', `${f(M.ROD.I, 3)} kg·m²`], ['α = τ/I', `${f(r.torque / M.ROD.I, 3)} rad/s²`], ['T', `${f(M.ROD.T, 3)} s`]]; } },
  hoop: { text: `环的所有质量都是从其中心算起的 R，因此 I_cm = mR²。钉子距离中心也是 R，因此平行轴定理又增加了一个 mR²：I = 2mR²。 d = R，T = 2π√(2R/g)，只要环很宽，就是一个简单的摆。`,
    facts: s => { const h = M.physical(M.HOOP, s.t); return [['angle', `${f(h.th / M.DEG, 1)}°`], ['I = 2mR²', `${f(M.HOOP.I, 3)} kg·m²`], ['d = R', `${f(M.HOOP.d)} m`], ['τ', `${f(h.torque, 3)} N·m`], ['T', `${f(M.HOOP.T, 3)} s`]]; } },
  disc: { text: `红色箭头是圆盘上的线材力矩：始终向后朝向 θ = 0，并且扭曲得越远（${TQ_ARC} 弧度每 N·m）。当 θ = 0 时，没有任何转动，圆盘转得最快。`,
    facts: s => { const r = M.torsion(s.t); return [['twist θ', `${f(r.th / M.DEG, 1)}°`], ['τ = −κθ', `${f(r.torque, 3)} N·m`], ['α = τ/I', `${f(r.alpha, 2)} rad/s²`], ["角速度", `${f(Math.abs(r.om), 2)} rad/s`], ['T', `${f(M.TORS.T, 3)} s`]]; } },
  car: { text: `身体在四个弹簧上上下移动，作为一个质量在一个弹簧上，其组合刚度。它的加速度（红色）指向静止高度，在每次弹跳的顶部和底部最大。`,
    facts: s => { const r = M.shm(M.CAR.A, Math.sqrt(M.CAR.k / M.CAR.m), s.t); return [["静止高度", `${f(100 * r.x, 1)} cm`], ['acceleration', `${f(r.a)} m/s²`], ['period', `${f(M.CAR.T, 3)} s`], ['frequency', `${f(1 / M.CAR.T, 2)} Hz`]]; } },
  swing: { text: `秋千是一个钟摆，其长度从树枝到孩子的质心。它的周期仅取决于长度和 g。`,
    facts: s => { const p = M.pendulum(s.t, M.SWING.L, M.SWING.th0, M.SWING.m); return [['angle', `${f(p.th / M.DEG, 1)}°`], ['speed', `${f(Math.abs(p.v))} m/s`], ['period', `${f(M.SWING.T, 2)} s`], ["恢复力", `${f(Math.abs(p.restoring), 1)} N`]]; } },
};
