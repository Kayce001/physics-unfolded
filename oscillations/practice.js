// oscillations/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, TAU = 2 * Math.PI;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);

// 1 · Hooke: the block at x = −0.20 m and at +0.25 m
const x1 = -0.20, x1b = 0.25;
// 2 · speed at x = 0.30 m
const x2 = 0.30, v2 = M.W * Math.sqrt(M.A ** 2 - x2 ** 2);
// 3 · energy at x = A/2
const K3 = 0.5 * M.K * (M.A ** 2 - (M.A / 2) ** 2);
// 4 · a 0.50 kg block on the same spring; the 1.0 kg block's spring force at the bottom
const m4 = 0.50, d4 = m4 * G / M.K, Fbot = M.K * (M.D + M.HANG.A);
// 5 · the 1.5 m pendulum on the Moon; its fastest speed
const gMoon = 1.62, Tmoon = TAU * Math.sqrt(M.PEND.L / gMoon), vmax5 = M.vmaxPendulum(M.PEND.L, M.PEND.th0);
// 6 · doubling the period; a pendulum for 3.0 s
const k6 = M.K / 4, T6 = 3.0, L6 = G * (T6 / TAU) ** 2, TL = M.periodPendulum(M.DOUBLE.L);
// 8 · the pushed start (Physics C)
const St = M.STARTS[1], t8 = (Math.PI / 2 - St.phi) / M.W;
// 9 · the rod and the hoop (Physics C)
const R = M.ROD, H = M.HOOP;
// 10 · the torsion pendulum (Physics C)
const Ts = M.TORS, wT = TAU / Ts.T;
// 11 · the car with 300 kg aboard; the swing
const C = M.CAR, m11 = C.m + 300, T11 = M.periodSpring(m11, C.k), Sw = M.SWING;

export const PRACTICE = {
  0: [
    { q: `该块以振幅 <i>A</i> = ${f(M.A)} m 振荡。在一个完整周期内它行驶了多远？`,
      choices: ['0 m', `${f(M.A)} m`, `${f(2 * M.A)} m`, `${f(4 * M.A)} m`], answer: 3,
      why: `<p>从+<i>A</i>到−<i>A</i>是2<i>A</i>，再返回是另一个2<i>A</i>：4<i>A</i> = ${f(4 * M.A)} m。一段时间内的 <i>displacement</i> 为 0，因为它在开始处结束。</p>` },
    { q: `周期为${f(M.T0, 3)} s。频率是多少？`,
      choices: [`${f(M.T0)} Hz`, `${f(M.F0, 3)} Hz`, `${f(M.W)} Hz`, `${f(1 / M.W, 3)} Hz`], answer: 1,
      why: `<div class="eq"><i>f</i> = 1/<i>T</i> = 1/${f(M.T0, 3)} = ${f(M.F0, 3)} Hz</div><p>${f(M.W)} 是 ω = 2π<i>f</i> rad/s，角频率，不是每秒的周期数。</p>` },
  ],
  1: [
    { q: `将+移至平衡右侧。该块 (<i>k</i> = ${M.K} N/m) 位于 <i>x</i> = ${f(x1)} m。其上的弹簧力是多少？`,
      choices: [`${sg(-M.K * x1)} N`, `${sg(M.K * x1)} N`, `${sg(-M.K / x1, 1)} N`, `${sg(-0.5 * M.K * x1)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i> = −${M.K} × (${f(x1)}) = ${sg(-M.K * x1)} N</div><p>向左挤压，弹簧向右推，达到平衡。 ${sg(M.K * x1)} N去掉减号。</p>` },
    { q: `${f(M.M1, 1)} kg 块在 <i>x</i> = ${sg(x1b)} m 处的加速度是多少？`,
      choices: [`${sg(M.K * x1b / M.M1)} m/s²`, `${sg(-M.W * x1b)} m/s²`, `${sg(-M.AMAX)} m/s²`, `${sg(-M.K * x1b / M.M1)} m/s²`], answer: 3,
      why: `<div class="eq"><i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i> = −(${M.K}/${f(M.M1, 1)}) × ${f(x1b)} = ${sg(-M.K * x1b / M.M1)} m/s²</div><p>加速度不是恒定的：${sg(-M.AMAX)} m/s²仅在<i>x</i> = +<i>A</i>时才是其值。 −ω<i>x</i> 忘记对 ω.</p> 求平方` },
  ],
  2: [
    { q: "此时区块位于 <i>x</i> = +<i>A</i>，",
      choices: ["<i>v</i> = 0 且 <i>a</i> = 0", "<i>v</i> 最大且 <i>a</i> = 0", "<i>v</i> = 0 并且 <i>a</i> 最大，朝向 −<i>x</i>", "<i>v</i> = 0且<i>a</i>最大，朝向+<i>x</i>"], answer: 2,
      why: "<p><i>x</i>–<i>t</i> 图在那里有一个峰值：斜率为零，因此 <i>v</i> = 0。而 <i>a</i> = −ω²<i>x</i> 的尺寸最大，指向平衡状态， −<i>x</i>.</p>" },
    { q: `当 <i>A</i> = ${f(M.A)} m 且 ω = ${f(M.W, 1)} rad/s 时，块在 <i>x</i> = ${f(x2)} m 处移动的速度有多快？`,
      choices: [`${f(M.VMAX)} m/s`, `${f(M.W * x2)} m/s`, `${f(v2)} m/s`, `${f(M.W * (M.A - x2))} m/s`], answer: 2,
      why: `<p>来自能量， ½<i>mv</i>² = ½<i>k</i>(<i>A</i>² − <i>x</i>²)，所以</p><div class="eq"><i>v</i> = ω√(<i>A</i>² − <i>x</i>²) = ${f(M.W, 1)} × √(${f(M.A ** 2)} − ${f(x2 ** 2)}) = ${f(v2)} m/s</div><p>${f(M.VMAX)} m/s 是仅在 <i>x</i> = 0.</p> 时的速度` },
  ],
  3: [
    { q: `总能量 ½<i>kA</i>² = ${f(M.E)} J. <i>x</i> = <i>A</i>/2 时块的动能是多少？`,
      choices: [`${f(M.E / 2)} J`, `${f(K3)} J`, `${f(M.E - K3)} J`, `${f(M.E)} J`], answer: 1,
      why: `<div class="eq"><i>U</i> = ½<i>k</i>(<i>A</i>/2)² = ¼ × ½<i>kA</i>² = ${f(M.E - K3)} J &nbsp;⇒&nbsp; <i>K</i> = ${f(M.E)} − ${f(M.E - K3)} = ${f(K3)} J</div><p>H一半的能量不是一半：<i>U</i> 与 <i>x</i>² 一样增长。 ${f(M.E - K3)} J为弹簧份额。</p>` },
    { q: "振幅加倍。总能量和最大速度变为",
      choices: ["能量×2，最大速度×2", "能量×4，最大速度×2", "能量×4，最大速度×4", "能量×2，最大速度×√2"], answer: 1,
      why: "<p><i>E</i> = ½<i>kA</i>² 增长 4 倍。 <i>v</i><sub>max</sub> = ω<i>A</i>，并且 ω = √(<i>k</i>/<i>m</i>) 不变，因此它加倍（4×动能 ⇒ 2×速度）。</p>" },
  ],
  4: [
    { q: `${f(m4)} kg 块悬挂在同一个 ${M.K} N/m 弹簧上。弹簧拉伸多远才能达到新的平衡状态？`,
      choices: [`${f(m4 / M.K, 4)} m`, `${f(M.D, 3)} m`, `${f(M.K / (m4 * G), 2)} m`, `${f(d4, 3)} m`], answer: 3,
      why: `<div class="eq"><i>kd</i> = <i>mg</i> &nbsp;⇒&nbsp; <i>d</i> = ${f(m4)} × ${f(G)} / ${M.K} = ${f(d4, 3)} m</div><p>H质量减半，垂度减半（${f(M.D, 3)} m 代表 ${f(M.M1, 1)} kg）。 ${f(m4 / M.K, 4)} m 忘记了 <i>g</i>：它使用的是质量，而不是重力； ${f(M.K / (m4 * G), 2)} m 将公式颠倒过来。</p>` },
    { q: `${f(M.M1, 1)} kg 块在其平衡状态下摆动 ${f(M.HANG.A)} m（下垂 ${f(M.D, 3)} m）。弹簧在最低点所受的力是多少？`,
      choices: [`${f(M.WEIGHT)} N`, `${f(Fbot)} N`, `${f(M.K * M.HANG.A)} N`, `${f(M.K * (M.D - M.HANG.A))} N`], answer: 1,
      why: `<p>在底部弹簧被拉伸 <i>d</i> + <i>A</i> = ${f(M.D + M.HANG.A, 4)} m:</p><div class="eq"><i>F</i><sub>s</sub> = <i>k</i>(<i>d</i> + <i>A</i>) = ${M.K} × ${f(M.D + M.HANG.A, 4)} = ${f(Fbot)} N</div><p>即${f(M.K * M.HANG.A)} N余重力：净重${f(M.K * M.HANG.A)} N向上，回到平衡状态。 ${f(M.K * (M.D - M.HANG.A))} N是顶部的力。</p>` },
  ],
  5: [
    { q: `将 ${f(M.PEND.L, 1)} m 摆（地球上的周期为 ${f(M.P_T)} s）带到月球，其中 <i>g</i> = ${f(gMoon)} m/s²。它的时期在那里？`,
      choices: [`${f(Tmoon)} s`, `${f(M.P_T)} s`, `${f(M.P_T * G / gMoon, 1)} s`, `${f(M.P_T * Math.sqrt(gMoon / G), 3)} s`], answer: 0,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(M.PEND.L, 1)}/${f(gMoon)}) = ${f(Tmoon)} s</div><p>重力较弱，摆动较慢，但只能通过 √(${f(G)}/${f(gMoon)}) = ${f(Math.sqrt(G / gMoon))}，而不是通过完整比率 ${f(G)}/${f(gMoon)} = ${f(G / gMoon)}，这给出${f(M.P_T * G / gMoon, 1)} s.</p>` },
    { q: `同一摆在 ${(M.PEND.th0 / M.DEG).toFixed(0)}° 处从静止状态释放。鲍勃在底部移动的速度有多快？`,
      choices: [`${f(Math.sqrt(2 * G * M.PEND.L * Math.sin(M.PEND.th0)))} m/s`, `${f(Math.sqrt(2 * G * M.PEND.L))} m/s`, `${f(Math.sqrt(G * M.PEND.L * (1 - Math.cos(M.PEND.th0))), 3)} m/s`, `${f(vmax5, 3)} m/s`], answer: 3,
      why: `<p>下降 Δ<i>y</i> = <i>L</i>(1 − cos θ<sub>0</sub>) = ${f(M.PEND.L * (1 - Math.cos(M.PEND.th0)) * 100, 2)} cm.</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = ${f(vmax5, 3)} m/s</div><p>√(2<i>gL</i>) 需要减少整个字符串长度； sin θ<sub>0</sub> 给出横向距离，而不是高度。</p>` },
  ],
  6: [
    { q: `${M.K} N/m 弹簧上的 ${f(M.DOUBLE.m, 1)} kg 块的周期为 ${f(M.periodSpring(M.DOUBLE.m, M.K))} s。哪个弹簧常数使周期加倍？`,
      choices: [`${f(M.K / 2, 1)} N/m`, `${f(2 * M.K, 1)} N/m`, `${f(k6, 1)} N/m`, `${f(4 * M.K, 1)} N/m`], answer: 2,
      why: `<p><i>T</i> ∝ 1/√<i>k</i>。对于 2<i>T</i>，√(<i>k</i><sub>new</sub>) 必须是 √<i>k</i> 的一半，因此 <i>k</i><sub>new</sub> = <i>k</i>/4 = ${f(k6, 1)} 牛/米。将 <i>k</i> 减半仅给出 √2 × 周期；更硬的弹簧使其更短。</p>` },
    { q: `${f(M.DOUBLE.L)} m 摆的周期为 ${f(TL)} s。 ${f(T6, 1)} s 的周期必须是多长？`,
      choices: [`${f(M.DOUBLE.L * T6 / TL)} m`, `${f(G * T6 / TAU)} m`, `${f(G * T6 ** 2 / 4, 1)} m`, `${f(L6)} m`], answer: 3,
      why: `<div class="eq"><i>L</i> = <i>g</i>(<i>T</i>/2π)² = ${f(G)} × (${f(T6, 1)}/2π)² = ${f(L6)} m</div><p>或按比例：<i>L</i> ∝ <i>T</i>²，所以 ${f(M.DOUBLE.L)} × (${f(T6, 1)}/${f(TL)})² = ${f(L6)} m。按时间比率本身缩放 <i>L</i> 得出 ${f(M.DOUBLE.L * T6 / TL)} m.</p>` },
  ],
  7: [
    { q: "水平弹簧上的块在释放前被拉出两倍远。与之前相比，其周期和最大速度分别为",
      choices: ["相同时间段，最大速度加倍", "周期加倍，最大速度相同", "两者相同", "周期×√2，最大速度加倍"], answer: 0,
      why: "<p><i>T</i> = 2π√(<i>m</i>/<i>k</i>) 中没有 <i>A</i>。两倍的距离，两倍的力，两倍的加速度：它同时覆盖地面的两倍，因此 <i>v</i><sub>max</sub> = ω<i>A</i> 加倍。</p>" },
    { q: "哪种变化会改变简单摆钟的周期？",
      choices: ["鲍勃重四倍", "摆动 4° 而不是 8°", "将其移至月球", "用推力开始，而不是从休息开始"], answer: 2,
      why: "<p><i>T</i> = 2π√(<i>L</i>/<i>g</i>) 仅取决于 <i>L</i> 和 <i>g</i>。质量抵消（<i>ma</i> = −<i>mg</i> sin θ），小振幅都给出相同的周期，并且推动仅改变振幅。</p>" },
  ],
  8: [
    { q: `${M.K} N/m 弹簧上的 ${f(M.M1, 1)} kg 块从 <i>x</i><sub>0</sub> = ${f(St.x0)} m 开始，其中 <i>v</i><sub>0</sub> = ${f(St.v0, 1)} m/s。它的振幅是多少？`,
      choices: [`${f(St.A, 3)} m`, `${f(St.x0, 3)} m`, `${f(St.x0 + Math.abs(St.v0) / M.W, 3)} m`, `${f(Math.hypot(St.x0, St.v0), 3)} m`], answer: 0,
      why: `<p>ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s。根据能量， ½<i>kA</i>² = ½<i>kx</i><sub>0</sub>² + ½<i>mv</i><sub>0</sub>²:</p><div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) = √(${f(St.x0)}² + ${f(Math.abs(St.v0) / M.W)}²) = ${f(St.A, 3)} m</div><p> 推动会增加能量，因此<i>A</i> &gt; <i>x</i><sub>0</sub>。两部分相加为平方，而不是直接相加； √(<i>x</i><sub>0</sub>² + <i>v</i><sub>0</sub>²) 将米与每秒米混合。</p>` },
    { q: `免费回复。证明 <i>x</i> = <i>A</i> cos(ω<i>t</i> + φ) 可求解 <i>m</i> d²<i>x</i>/d<i>t</i>² = −<i>kx</i>。对于上面推入的块，求 φ ，第一次经过时 <i>x</i> = 0。`,
      solution: `<p> 微分两次： d<i>x</i>/d<i>t</i> = −<i>A</i>ω sin(ω<i>t</i> + φ), d²<i>x</i>/d<i>t</i>² = −<i>A</i>ω² cos(ω<i>t</i> + φ) = −ω²<i>x</i>。对于每个 <i>t</i>，这等于 −(<i>k</i>/<i>m</i>)<i>x</i>，如果 ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s.</p><p>在 <i>t</i> = 0 时：<i>A</i> cos φ = ${f(St.x0)} m 和 −<i>A</i>ω sin φ = ${f(St.v0, 1)} m/s，所以 tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub> = ${f(-St.v0 / (M.W * St.x0), 3)} 且 cos φ &gt; 0:</p><div class="eq">φ = ${f(St.phi / M.DEG, 1)}° = ${f(St.phi, 3)} rad, &nbsp; <i>A</i> = ${f(St.A, 3)} m</div><p> 首先到达当 ω<i>t</i> + φ = π/2 时，<i>x</i> = 0：</p><div class="eq"><i>t</i> = (π/2 − φ)/ω = (${f(Math.PI / 2, 3)} − ${f(St.phi, 3)})/${f(M.W, 1)} = ${f(t8, 3)} s</div><p> 早于四分之一周期 (${f(M.T0 / 4, 3)} s)，因为它开始更接近并且已经趋向平衡。</p>` },
  ],
  9: [
    { q: `一根 ${f(R.L, 1)} 米长的均匀杆绕一端摆动。小幅波动的周期是多少？`,
      choices: [`${f(M.periodPendulum(R.L))} s`, `${f(M.periodPendulum(R.L / 2))} s`, `${f(R.T)} s`, `${f(M.periodPhysical(R.m, R.d, R.Icm))} s`], answer: 2,
      why: `<p><i>I</i> 左右端 = <i>I</i><sub>cm</sub> + <i>m</i>(<i>L</i>/2)² = <i>mL</i>²/12 + <i>mL</i>²/4 = <i>mL</i>²/3，且 <i>d</i> = <i>L</i>/2:</p><div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>) = 2π√(2<i>L</i>/3<i>g</i>) = ${f(R.T)} s</div><p>${f(M.periodPendulum(R.L / 2))} s 将其视为鲍勃它的质心； ${f(M.periodPhysical(R.m, R.d, R.Icm))} s 在枢轴周围使用 <i>I</i><sub>cm</sub> 而不是 <i>I</i>。</p>` },
    { q: `免费回复。半径为 <i>R</i> = ${f(H.R)} m 的细环通过其边缘悬挂在钉子上。求其关于钉子的转动惯量，写出其平面上小幅摆动的运动方程，并求出周期。`,
      solution: `<p>关于其中心，环的每一点的距离为<i>R</i>：<i>I</i><sub>cm</sub> = ∫<i>R</i>² d<i>m</i> = <i>mR</i>²。钉子距离中心为 <i>d</i> = <i>R</i>，因此通过平行轴 <i>I</i> = <i>mR</i>² + <i>mR</i>² = 2<i>mR</i>².</p><p>重力作用在中心： τ = −<i>mgR</i> sin θ ≈ −<i>mgR</i>θ。 τ = <i>I</i>α:</p><div class="eq">d²θ/d<i>t</i>² = −(<i>mgR</i>/2<i>mR</i>²)θ = −(<i>g</i>/2<i>R</i>)θ</div><p>SHM，其中 ω = √(<i>g</i>/2<i>R</i>)，独立于质量：</p><div class="eq"><i>T</i> = 2π√(2<i>R</i>/<i>g</i>) = 2π√(${f(2 * H.R)}/${f(G)}) = ${f(H.T)} s</div><p>与简单摆一样，只要箍宽（${f(2 * H.R)}米）。</p>` },
  ],
  10: [
    { q: `导线上的${f(Ts.M, 1)} kg圆盘有周期${f(Ts.T)} s。它被替换为质量相同但半径是其两倍的圆盘。新时期？`,
      choices: [`${f(Ts.T)} s`, `${f(Ts.T * Math.SQRT2)} s`, `${f(2 * Ts.T)} s`, `${f(4 * Ts.T, 1)} s`], answer: 2,
      why: `<p><i>I</i> = ½<i>MR</i>² 以两倍半径增长 4×，<i>T</i> = 2π√(<i>I</i>/κ) 增长 √4 = 2×：${f(2 * Ts.T)} s。相同的电线，相同的κ.</p>` },
    { q: `免费回复。椎间盘（<i>I</i> = ${f(Ts.I, 3)} kg·m²，κ = ${Ts.kappa} N·m/rad）扭转 ${(Ts.th0 / M.DEG).toFixed(0)}° 并从静止状态释放。写出θ(<i>t</i>)并求出最大力矩和最大角速度。`,
      solution: `<p><i>I</i> d²θ/d<i>t</i>² = −κθ，因此 θ = θ<sub>0</sub> cos(ω<i>t</i>) 且 ω = √(κ/<i>I</i>) = √(${Ts.kappa}/${f(Ts.I, 3)}) = ${f(wT, 3)} rad/s 和 θ<sub>0</sub> = ${(Ts.th0 / M.DEG).toFixed(0)}° = ${f(Ts.th0, 3)} rad（从静止状态释放，因此 φ = 0）。无小角度阶跃：τ = −κθ 在任何扭曲下均成立。</p><div class="eq">|τ|<sub>max</sub> = κθ<sub>0</sub> = ${Ts.kappa} × ${f(Ts.th0, 3)} = ${f(Ts.kappa * Ts.th0, 3)} N·m &nbsp;(at the ends)</div><div class="eq">|dθ/d<i>t</i>|<sub>max</sub> = θ<sub>0</sub>ω = ${f(Ts.th0, 3)} × ${f(wT, 3)} = ${f(Ts.th0 * wT, 2)} rad/s &nbsp;(passing θ = 0)</div><p>θ 必须是以弧度为单位：力矩定律和 ω 均假定它。</p>` },
  ],
  11: [
    { q: `${C.m} kg 汽车在弹簧上以 ${f(C.T, 3)} s 的周期弹跳（减震器关闭）。总重300公斤的乘客可以进入。新时期？`,
      choices: [`${f(C.T, 3)} s`, `${f(C.T * m11 / C.m, 3)} s`, `${f(C.T * Math.sqrt(C.m / m11), 3)} s`, `${f(T11, 3)} s`], answer: 3,
      why: `<div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${m11}/${C.k}) = ${f(T11, 3)} s</div><p>汽车较重，弹跳较慢，由√(${m11}/${C.m}) = ${f(Math.sqrt(m11 / C.m), 3)}，而不是由质量比本身。</p>` },
    { q: `要在 ${f(Sw.L, 1)} 米秋千上推动儿童一次（每个完整周期一次），两次推动之间应等待多长时间？`,
      choices: [`${f(Sw.T / 2)} s`, `${f(Sw.T)} s`, `${f(TAU * Math.sqrt(G / Sw.L), 1)} s`, `${f(Math.sqrt(Sw.L / G), 3)} s`], answer: 1,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(Sw.L, 1)}/${f(G)}) = ${f(Sw.T)} s</div><p>每个完整周期孩子会回到您的手中一次。其中一半，${f(Sw.T / 2)} s，是当孩子在远端时。孩子的质量和（小）振幅并不重要。</p>` },
  ],
};
