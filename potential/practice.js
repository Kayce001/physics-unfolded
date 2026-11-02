// potential/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const s = x => (x < 0 ? '−' : x > 0 ? '+' : '') + Math.abs(x);   // signed, with a real minus
const K = M.K, nC = M.nC;

// ---- page 0: the page's pair brought from 40 cm to 10 cm ----
const { q1, q2, r0, r1 } = M.PAIR;
const P0 = { W: K * q1 * q2 * (1 / r1 - 1 / r0) };
P0.nums = [K * q1 * q2 / r1, P0.W, K * q1 * q2 / r1 ** 2 * (r0 - r1), K * q1 * q2 / (r0 - r1)].map(x => x * 1e6);   // from ∞ · right · F(r₁)Δr · 1/Δr
// ---- page 1: the page's square; charging a sphere ----
const P1 = { U: M.SQ.U, a: M.SQ.a, q: M.SQ.q };
P1.nums = [4 * K * P1.q ** 2 / P1.a, 2 * P1.U, P1.U, (4 + 2 * Math.SQRT2) * K * P1.q ** 2 / P1.a].map(x => x * 1e6);   // sides only · every pair twice · right · diagonal a/√2
const P1b = { Q: 2 * nC, R: 0.15 };
P1b.U = K * P1b.Q ** 2 / (2 * P1b.R);
P1b.nums = [2 * P1b.U, P1b.U / 2, P1b.U, P1b.U / P1b.R].map(x => x * 1e6);   // Q × final V · ¼ · right · extra 1/R
// ---- page 2: the page's A → C; E = 3x² ----
const P2 = { W: -M.UNI.q * (M.Vuni(M.UNI.C) - M.Vuni(M.UNI.A)) };
P2.L = Math.hypot(M.UNI.C[0] - M.UNI.A[0], M.UNI.C[2] - M.UNI.A[2]);
P2.nums = [-P2.W, 0, M.UNI.q * M.UNI.E * P2.L, P2.W].map(x => x * 1e9);   // sign · "path ⟂ somewhere" · full length · right
const P2b = { c: 3, x: 2 };
P2b.dV = -P2b.c * P2b.x ** 3 / 3;
P2b.nums = [-P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x, P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x / 2];   // sign · E(x)·x · right · mean of end fields
// ---- page 3: the page's hill where V = 90 V; V = 3x²y − y³ ----
const P3 = { V: 90 };
P3.r = K * M.HILL.Q / P3.V;
P3.E = P3.V / P3.r;
P3.nums = [P3.V, P3.E, P3.E / 2, 2 * P3.E];
const P3b = { x: 1, y: 2 };
P3b.Ex = -6 * P3b.x * P3b.y; P3b.Ey = -(3 * P3b.x ** 2 - 3 * P3b.y ** 2);
P3b.E = Math.hypot(P3b.Ex, P3b.Ey);
P3b.nums = [Math.abs(P3b.Ex) + Math.abs(P3b.Ey), Math.abs(P3b.Ex), P3b.E, Math.abs(P3b.Ey)];
// ---- page 4: the page's dipole at P ----
const P4 = { V: M.VdipAxis(M.DIP.axisX) };
P4.nums = [-P4.V, 0, P4.V, -2 * M.DIP.a * K * M.DIP.q / M.DIP.axisX ** 2];   // sign · bisector habit · right · far-field
// ---- page 5: the page's rod at a = 10 cm ----
const { L: rL, Q: rQ, lam: rlam } = M.ROD;
const P5 = { a: 0.10 };
P5.V = M.VrodAxis(P5.a);
P5.nums = [K * rQ / P5.a, K * rQ / (P5.a + rL / 2), K * rlam * Math.log10((P5.a + rL) / P5.a), P5.V];   // all at the end · all at the middle · log₁₀ · right
P5.E = K * rQ / (P5.a * (P5.a + rL));
P5.nums2 = [P5.E, P5.V / P5.a, K * rQ / P5.a ** 2, K * rlam / P5.a];   // right · V/a · point at the end · kλ/a
// ---- page 6: the page's ring at z = 20 cm; the half-ring's field at its centre ----
const P6 = { z: 0.20 };
P6.V = M.Vring(P6.z);
P6.nums = [K * M.RING.Q / P6.z, P6.V, K * M.RING.Q * P6.z / (M.RING.R ** 2 + P6.z ** 2) ** 1.5, K * M.RING.Q / M.RING.R];   // point · right · that's E · centre
const P6b = { E: 2 * K * M.ARC.Q / (Math.PI * M.ARC.R ** 2) };
P6b.nums = [K * M.ARC.Q / M.ARC.R ** 2, P6b.E / 2, P6b.E, 0];   // as a point · lost 2 · right · ring symmetry
// ---- page 7: the page's insulating sphere at R/2; two connected spheres ----
const P7 = { r: M.SPH.R / 2 };
P7.V = M.Vins(P7.r);
P7.nums = [K * M.SPH.Q / P7.r, P7.V, M.Vcond(P7.r), M.Vins(0)];   // point · right · conductor · centre
const P7b = { nums: [1 / 3, 3, 1, 1 / 9] };
// ---- page 8: the page's proton; an electron falling toward +1 nC ----
const P8 = { v: M.ACC.vp };
P8.nums = [Math.sqrt(M.E_CH * M.ACC.dV / M.M_P), M.speed(M.E_CH, M.ACC.Vhi, M.M_P), P8.v, M.speed(M.E_CH, M.ACC.dV, M.M_E)].map(v => v / 1e3);   // lost 2 · used 7 V · right · electron
const P8b = { Q: 1 * nC, ra: 0.10, rb: 0.05 };
P8b.dV = K * P8b.Q * (1 / P8b.rb - 1 / P8b.ra);
P8b.v = M.speed(M.E_CH, P8b.dV, M.M_E);
P8b.nums = [M.speed(M.E_CH, K * P8b.Q / P8b.rb, M.M_E), P8b.v, P8b.v / Math.SQRT2, M.speed(M.E_CH, P8b.dV, M.M_P)].map(v => v / 1e6);   // V at the end only · right · lost 2 · proton mass

const frac = x => ({ [1 / 3]: '1/3', 3: '3', 1: '1', [1 / 9]: '1/9' })[x];

export const PRACTICE = {
  0: [
    { q: `您必须做多少工作才能将页面的 +${q2 / nC} nC 电荷从 ${p(r0 * 100, 0)} cm 变为 ${p(r1 * 100, 0)} cm 从固定的 +${q1 / nC} nC 电荷（在静止状态下开始和结束）？`,
      choices: P0.nums.map(x => `${p(x, 3)} μJ`), answer: 1, nums: P0.nums,
      why: `<p>你反对 <i>F</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>²，它会随着你的发展而增长，所以整合：</p><div class="eq"><i>W</i> = −∫<sub><i>r</i><sub>0</sub></sub><sup><i>r</i><sub>1</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>0</sub>) = Δ<i>U</i> = ${p(P0.W * 1e6, 3)} μJ</div><p><i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i><sub>1</sub> (${p(P0.nums[0], 3)} μJ) 是来自无穷远的功，而不是来自 ${p(r0 * 100, 0)} cm.</p>` },
    { q: "两个粒子与势能相互作用 <i>U</i>(<i>r</i>) = <i>A</i>/<i>r</i>² − <i>B</i>/<i>r</i> (<i>A</i>, <i>B</i> &gt; 0）。距离多大时它们之间的力为零？",
      choices: ['<i>A</i>/<i>B</i>', '√(<i>A</i>/<i>B</i>)', '<i>B</i>/2<i>A</i>', '2<i>A</i>/<i>B</i>'], answer: 3,
      why: "<p><i>F</i> = −d<i>U</i>/d<i>r</i>，因此将斜率设置为零：</p><div class=\"eq\">d<i>U</i>/d<i>r</i> = −2<i>A</i>/<i>r</i>³ + <i>B</i>/<i>r</i>² = 0 &nbsp;→&nbsp; <i>r</i> = 2<i>A</i>/<i>B</i></div><p><i>A</i>/<i>B</i> 是哪里 <i>U</i> = 0，不是其斜率所在的位置。 2点<i>A</i>/<i>B</i> <i>U</i> 有其最小值，因此分离是稳定的。</p>" },
  ],
  1: [
    { q: `该页面的四个+${P1.q / nC} nC 电荷位于正方形边的角上 ${p(P1.a * 100, 0)} 厘米。该基团的电势能为`,
      choices: P1.nums.map(x => `${p(x, 3)} μJ`), answer: 2, nums: P1.nums,
      why: `<p>六对：四边在 <i>a</i>, √2 处的两条对角线<i>a</i>.</p><div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = (4 + √2)<i>kq</i>²/<i>a</i> = ${p(P1.U * 1e6, 3)} μJ</div><p>求和 <i>qV</i> 每次电荷时，每对都会计数两次（${p(P1.nums[1], 3)} μJ）；对角线是 √2<i>a</i>, 不 <i>a</i>/√2.</p>` },
    { q: `金属球半径 ${p(P1b.R * 100, 0)} cm 被充电至 ${p(P1b.Q / nC, 1)} nC 通过带来微小电荷 d<i>q</i> 从无穷大中。所需的总工作量为`,
      choices: P1b.nums.map(x => `${p(x, 3)} μJ`), answer: 2, nums: P1b.nums,
      why: `<p>当球体保持住时 <i>q</i> 它的电势是 <i>kq</i>/<i>R</i>，并带来 d<i>q</i> 成本（<i>kq</i>/<i>R</i>) d<i>q</i>:</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>Q</i></sup> (<i>kq</i>/<i>R</i>) d<i>q</i> = <i>kQ</i>²/2<i>R</i> = ${p(P1b.U * 1e6, 3)} μJ</div><p><i>Q</i> × 最终势能 (${p(P1b.nums[0], 3)} μJ) 每 d 电荷一次<i>q</i> 全价；早期的几乎没有遇到排斥。</p>` },
  ],
  2: [
    { q: `页面上有一个+${M.UNI.q / nC} nC 电荷均匀地从 A 移动到 C ${M.UNI.E} N/C 场，其中 <i>V</i><sub>C</sub> − <i>V</i><sub>A</sub> = −10 V。场对其所做的功是`,
      choices: P2.nums.map(x => `${s(+p(x, 1))} nJ`), answer: 3, nums: P2.nums,
      why: `<div class="eq"><i>W</i><sub>field</sub> = −Δ<i>U</i> = −<i>q</i>Δ<i>V</i> = −(${M.UNI.q / nC} nC)(−10 V) = +${p(P2.W * 1e9, 1)} nJ</div><p>路径并不重要：只有 ${p(M.UNI.C[0] * 100, 0)} 厘米沿 <b>E</b> 计数，而不是 ${p(P2.L * 100, 1)} 厘米直线路径（${p(P2.nums[2], 1)} 新泽西州）。 A+电荷移动带 <b>E</b> 失去 <i>U</i>，所以该领域做了正的工作。</p>` },
    { q: `沿 + 的场点<i>x</i> 与 <i>E</i> = ${P2b.c}<i>x</i>² (N/C, <i>x</i> in m). <i>V</i>(${P2b.x} m) − <i>V</i>(0) is`,
      choices: P2b.nums.map(x => `${s(x)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq">Δ<i>V</i> = −∫<sub>0</sub><sup>${P2b.x}</sup> ${P2b.c}<i>x</i>² d<i>x</i> = −<i>x</i>³ |<sub>0</sub><sup>${P2b.x}</sup> = ${s(P2b.dV)} V</div><p>与<b>E</b>一起移动，<i>V</i>下降，所以答案是否定的。 <i>E</i>(${P2b.x}) × ${P2b.x} m = ${-P2b.nums[1]} V 将最大场视为一直保持不变。</p>` },
  ],
  3: [
    { q: `在页面的山 (+${M.HILL.Q / nC} nC) 上，在 <i>V</i> = ${P3.V} V 的点上，场具有大小`,
      choices: P3.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P3.nums,
      why: `<p>首先距离：<i>r</i> = <i>kQ</i>/<i>V</i> = ${p(K * M.HILL.Q, 2)}/${P3.V} = ${p(P3.r * 100, 2)} 厘米。那么斜率：</p><div class="eq"><i>E</i> = −d<i>V</i>/d<i>r</i> = <i>kQ</i>/<i>r</i>² = <i>V</i>/<i>r</i> = ${p(P3.E, 0)} N/C</div><p><i>V</i> 和 <i>E</i> 具有不同的单位和尺寸：${P3.V} V 是山的高度，${p(P3.E, 0)} N/C 是其陡度。</p>` },
    { q: "在区域 <i>V</i>(<i>x</i>, <i>y</i>) = 3<i>x</i>²<i>y</i> − <i>y</i>³（伏特、米）中。 <b>E</b> 在（1 m，2 m）处的星等为",
      choices: P3b.nums.map(x => `${p(x, 1)} N/C`), answer: 2, nums: P3b.nums,
      why: `<p><b>E</b> = −∇<i>V</i>，逐个组件：</p><div class="eq"><i>E<sub>x</sub></i> = −∂<i>V</i>/∂<i>x</i> = −6<i>xy</i> = ${s(P3b.Ex)} N/C, &nbsp;<i>E<sub>y</sub></i> = −(3<i>x</i>² − 3<i>y</i>²) = ${s(P3b.Ey)} N/C</div><div class="eq">|<b>E</b>| = √(${P3b.Ex ** 2} + ${P3b.Ey ** 2}) = ${p(P3b.E, 1)} N/C</div><p>分量作为向量相加，而不是作为数字 (${p(P3b.nums[0], 1)}).</p>` },
  ],
  4: [
    { q: `对于页面的偶极子（+${M.DIP.q / nC} nC at <i>x</i> = −${p(M.DIP.a * 100, 0)} cm，−${M.DIP.q / nC} nC at +${p(M.DIP.a * 100, 0)} cm），轴上 P 处的电势，<i>x</i> = ${p(M.DIP.axisX * 100, 0)} cm`,
      choices: P4.nums.map(x => `${x === 0 ? '0' : s(+p(x, 1))} V`), answer: 2, nums: P4.nums,
      why: `<p> 将两个 <i>kq</i>/<i>r</i> 及其符号相加：</p><div class="eq"><i>V</i> = <i>kq</i>/${p((M.DIP.axisX + M.DIP.a), 2)} − <i>kq</i>/${p((M.DIP.axisX - M.DIP.a), 2)} = ${p(K * M.DIP.q / (M.DIP.axisX + M.DIP.a), 1)} − ${p(K * M.DIP.q / (M.DIP.axisX - M.DIP.a), 1)} = ${s(+p(P4.V, 1))} V</div><p>P 更接近 - 电荷，因此 <i>V</i> &lt; 0。 <i>V</i> = 0 在平分线上成立，但此处不成立；远场 −2<i>akq</i>/<i>x</i>² (${p(P4.nums[3], 1)} V) 需要 <i>x</i> ≫ <i>a</i>.</p>` },
    { q: "在偶极子轴的远处，在 −<i>q</i> 电荷的一侧，<i>V</i> ≈ −2<i>akq</i>/<i>x</i>²。那里的田地有",
      choices: ["4<i>akq</i>/<i>x</i>³，远离偶极子", "2<i>akq</i>/<i>x</i>³，指向偶极子", "4<i>akq</i>/<i>x</i>³，指向偶极子", "2<i>akq</i>/<i>x</i>²，指向远离偶极子的方向"], answer: 2,
      why: "<div class=\"eq\"><i>E<sub>x</sub></i> = −d<i>V</i>/d<i>x</i> = −d/d<i>x</i>(−2<i>akq x</i><sup>−2</sup>) = −4<i>akq</i>/<i>x</i>³</div><p>负：朝向-<i>x</i>，背向偶极子。这符合：较近的−<i>q</i> 比较远的+<i>q</i> 将正测试电荷拉入更难。 <b>E</b>从高到低指向<i>V</i>，而<i>V</i>则更低（更负）靠近</p>" },
  ],
  5: [
    { q: `页杆（+${rQ / nC} nC 超过 ${p(rL * 100, 0)} cm）。其轴 ${p(P5.a * 100, 0)} cm 上超过一端的电势为`,
      choices: P5.nums.map(x => `${p(x, 1)} V`), answer: 3, nums: P5.nums,
      why: `<div class="eq"><i>V</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i> = <i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>) = ${p(K * rlam, 1)} × ln ${p((P5.a + rL) / P5.a, 0)} = ${p(P5.V, 1)} V</div><p> 1/<i>x</i> 的积分是自然对数； log₁₀给出${p(P5.nums[2], 1)} V。将所有电荷放在中间（${p(P5.nums[1], 1)} V）只能在很远的地方起作用。</p>` },
    { q: `从该轴上的 <i>V</i>(<i>a</i>) 开始，经过末端的场 ${p(P5.a * 100, 0)} 厘米为`,
      choices: P5.nums2.map(x => `${p(x, 0)} N/C`), answer: 0, nums: P5.nums2,
      why: `<div class="eq"><i>E</i> = −d<i>V</i>/d<i>a</i> = −<i>k</i>λ[1/(<i>a</i> + <i>L</i>) − 1/<i>a</i>] = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(P5.E, 0)} N/C</div><p> 指向远离杆的方向。 <i>V</i>/<i>a</i> (${p(P5.nums2[1], 0)} N/C) 仅适用于 <i>V</i> ∝ 1/<i>a</i>；取导数。</p>` },
  ],
  6: [
    { q: `页环（+${M.RING.Q / nC} nC，<i>R</i> = ${p(M.RING.R * 100, 0)} cm）。其轴 ${p(P6.z * 100, 0)} cm 上距中心的电势为`,
      choices: P6.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P6.nums,
      why: `<p> 每个 d<i>q</i> 距离 √(<i>R</i>² + <i>z</i>²) = ${p(Math.hypot(M.RING.R, P6.z) * 100, 0)} cm 远，并且 <i>V</i> 是一个标量，所以没有元件：</p><div class="eq"><i>V</i> = <i>kQ</i>/√(<i>R</i>² + <i>z</i>²) = ${p(K * M.RING.Q, 2)}/${p(Math.hypot(M.RING.R, P6.z), 2)} = ${p(P6.V, 1)} V</div><p>${p(P6.nums[2], 1)} 是 N/C 中的字段 <i>kQz</i>/(<i>R</i>² + <i>z</i>²)<sup>3/2</sup>； cos 因子属于 <b>E</b>，而不是 <i>V</i>.</p>` },
    { q: `页面的半环（+${M.ARC.Q / nC} nC，<i>R</i> = ${p(M.ARC.R * 100, 0)} cm）的中心有<i>V</i> = <i>kQ</i>/<i>R</i>。 <b>场</b> 有大小`,
      choices: P6b.nums.map(x => `${x ? p(x, 0) : '0'} N/C`), answer: 2, nums: P6b.nums,
      why: `<p>当 λ = <i>Q</i>/π<i>R</i> 时，每个 d<i>q</i> = λ<i>R</i> dθ 给出 <i>k</i>λ dθ/<i>R</i>。从对称线测量θ；横向部分抵消，其余部分相加：</p><div class="eq"><i>E</i> = ∫<sub>−π/2</sub><sup>π/2</sup> (<i>k</i>λ/<i>R</i>) cos θ dθ = 2<i>k</i>λ/<i>R</i> = 2<i>kQ</i>/π<i>R</i>² = ${p(P6b.E, 0)} N/C</div><p>与<i>V</i>不同，<b>E</b>不仅仅是<i>kQ</i>/<i>R</i>²（${p(P6b.nums[0], 0)} N/C）：棋子指向不同的方式。仅对于全环为零。</p>` },
  ],
  7: [
    { q: `页面的绝缘球（+${M.SPH.Q / nC} nC均匀分布，<i>R</i> = ${p(M.SPH.R * 100, 0)} cm）。距其中心的势 ${p(P7.r * 100, 0)} cm 为`,
      choices: P7.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P7.nums,
      why: `<p>从无穷远走进：−∫<i>E</i> d<i>r</i> 外面给出 <i>kQ</i>/<i>R</i>；里面，<i>E</i> = <i>kQr</i>/<i>R</i>³ 增加更多：</p><div class="eq"><i>V</i>(<i>r</i>) = <i>kQ</i>/<i>R</i> + ∫<sub><i>r</i></sub><sup><i>R</i></sup> <i>kQr</i>′/<i>R</i>³ d<i>r</i>′ = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²) = ${p(P7.V, 1)} V</div><p><i>kQ</i>/<i>r</i> (${p(P7.nums[0], 1)} V) 就好像所有电荷都在 <i>r</i> 内部； ${p(P7.nums[2], 1)} V 是金属球，其中 <i>E</i> = 0 内部。</p>` },
    { q: "两个金属球，半径为 <i>R</i><sub>1</sub> = 3<i>R</i><sub>2</sub>，距离较远，并通过细线连接，然后带电。表面电荷密度之比 σ<sub>1</sub>/σ<sub>2</sub> 为",
      choices: P7b.nums.map(frac), answer: 0, nums: P7b.nums,
      why: "<p>连接后，它们是一个电势的一根导体：<i>kQ</i><sub>1</sub>/<i>R</i><sub>1</sub> = <i>kQ</i><sub>2</sub>/<i>R</i><sub>2</sub>，所以<i>Q</i><sub>1</sub>/<i>Q</i><sub>2</sub> = <i>R</i><sub>1</sub>/<i>R</i><sub>2</sub> = 3。则</p><div class=\"eq\">σ<sub>1</sub>/σ<sub>2</sub> = (<i>Q</i><sub>1</sub>/<i>R</i><sub>1</sub>²)/(<i>Q</i><sub>2</sub>/<i>R</i><sub>2</sub>²) = 3 × (1/3)² = 1/3</div><p> 大球体容纳更多电荷，但将其分散得更薄：电荷在导体急剧弯曲的地方聚集。</p>" },
  ],
  8: [
    { q: `页的质子从 ${M.ACC.Vhi} V 板处的静止开始，穿过 ${M.ACC.Vlo} V 板。它到达`,
      choices: P8.nums.map(x => `${p(x, 1)} km/s`), answer: 2, nums: P8.nums,
      why: `<div class="eq"><i>e</i>Δ<i>V</i> = ½<i>mv</i>² &nbsp;→&nbsp; <i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>p</sub>) = √(2 × ${M.E_CH.toExponential(2).replace('e-', ' × 10<sup>−')}</sup> × ${M.ACC.dV}/${M.M_P.toExponential(2).replace('e-', ' × 10<sup>−')}</sup>) = ${p(P8.v / 1e3, 1)} km/s</div><p>仅计算<b>差异</b>、${M.ACC.dV} V，不计算启动板的${M.ACC.Vhi} V。 ${p(P8.nums[3], 0)} km/s 是相同 6 eV 的电子速度。</p>` },
    { q: `电子从固定的 +${P8b.Q / nC} nC 电荷开始静止 ${p(P8b.ra * 100, 0)} cm 并被拉近。当远离 ${p(P8b.rb * 100, 0)} cm 时其速度为`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> m/s`), answer: 1, nums: P8b.nums,
      why: `<p> 力随着落入而增大，因此使用能量，该能量已包含积分 ∫<i>F</i> d<i>r</i>:</p><div class="eq">Δ<i>V</i> = <i>kQ</i>(1/<i>r</i><sub>b</sub> − 1/<i>r</i><sub>a</sub>) = ${p(P8b.dV, 1)} V, &nbsp;<i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>e</sub>) = ${p(P8b.v / 1e6, 2)} × 10<sup>6</sup> m/s</div><p>仅在${p(P8b.rb * 100, 0)} cm处使用<i>V</i>（${p(K * P8b.Q / P8b.rb, 0)} V）忘记它是从${p(K * P8b.Q / P8b.ra, 0)}开始的V，不是0.</p>` },
  ],
};
