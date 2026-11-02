// magnetism/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { MU0, QE, MP } = M;
const k2 = MU0 / (2 * Math.PI);                                       // μ₀/2π = 2×10⁻⁷ T·m/A

// ---- page 0: flux through a dome in a uniform field ----
const P0 = { B: 0.40, R: 0.050 };
P0.phi = P0.B * Math.PI * P0.R ** 2;
P0.nums = [P0.B * 2 * Math.PI * P0.R ** 2, 0, P0.phi, P0.B * 4 * Math.PI * P0.R ** 2].map(x => x * 1e3);   // dome's area · closed-surface zero · right · whole sphere
// ---- page 1: the force averaged over the page's sweep of θ ----
const F1 = M.RHR.Fmax;
const P1 = { avg: 2 / Math.PI * F1 };
P1.nums = [F1 / 2, P1.avg, F1, F1 / Math.SQRT2].map(x => x / 1e-14);    // linear in θ · right · peak · rms
// ---- page 2: a deuteron through the page's 200 V ----
const rp = M.CYC.r[1];
const P2 = { m: 2 * MP, V: M.CYC.dV[1] };
P2.r = Math.sqrt(2 * P2.m * QE * P2.V) / (QE * M.CYC.B);
P2.nums = [2 * rp, rp, rp / Math.SQRT2, P2.r].map(x => x * 100);       // r ∝ m · unchanged · upside down · right
// ---- page 3: the page's selector ----
const { E: SE, B: SB, v0 } = M.SEL;
const P3 = { v: 1.25 * v0 };
P3.F = QE * (P3.v * SB - SE);
P3.nums = [QE * SE, P3.F, QE * P3.v * SB, QE * (P3.v * SB + SE)].map(x => x / 1e-17);   // qE only · right · qvB only · added
const S0 = M.SEL.paths[0], s0 = S0[S0.length - 1];
const P3b = { vi: M.SEL.k[0] * v0, dy: +Math.abs(s0.p[1] * 100).toFixed(3) / 100 };   // the drop as shown, from the model's path
P3b.v = Math.sqrt(P3b.vi ** 2 + 2 * QE * SE * P3b.dy / MP);
P3b.nums = [P3b.vi, Math.sqrt(P3b.vi ** 2 - 2 * QE * SE * P3b.dy / MP), P3b.v, v0].map(x => x / 1e4);   // unchanged · sign · right · E/B
// ---- page 4: turning the page's loop over; a semicircular wire ----
const { mu, B: LB } = M.LOOP;
const P4 = { W: 2 * mu * LB };
P4.nums = [mu * LB, Math.PI * mu * LB, 0, P4.W];                      // only to 90° · τ_max × π · start = end? · right
const P4b = { I: 2.0, R: 0.10, B: 0.50 };
P4b.F = 2 * P4b.I * P4b.R * P4b.B;
P4b.nums = [Math.PI * P4b.I * P4b.R * P4b.B, P4b.F, 0, P4b.I * P4b.R * P4b.B];   // arc length · right · cancels · radius
// ---- page 5: inside the page's thick wire; the page's rectangle ----
const { I: AI, a: Aa } = M.AMP, r5 = 0.005;
const P5 = { B: MU0 * AI * r5 / (2 * Math.PI * Aa ** 2) };
P5.nums = [k2 * AI / r5, k2 * AI / Aa, k2 * AI * r5 ** 2 / Aa ** 3, P5.B].map(x => x * 1e6);   // outside formula · surface value · ∝ r² · right
const { a: Fa, c: Fc, b: Fb } = M.FLUX, area5 = Fb * Fc;
P5.fnums = [k2 * AI / (Fa + Fc / 2) * area5, k2 * AI / Fa * area5, M.FLUX.phi, k2 * AI / (Fa + Fc) * area5].map(x => x * 1e6);   // B at the middle · near side · right · far side
// ---- page 6: the page's ring on its axis; a semicircle with radial leads ----
const { R: RR, I: RI, Bc } = M.RING;
const P6 = { B: M.ringAxis(RR) };
P6.nums = [P6.B, Bc / 2, Bc, Bc / 4].map(x => x * 1e6);              // right · halved · centre · 1/z²
const P6b = { B: Bc / 2 };
P6b.nums = [Bc, Bc / 2 + k2 * RI / RR, P6b.B, k2 * RI / RR].map(x => x * 1e6);   // whole loop · leads added · right · leads only
// ---- page 7: a rod perpendicular to a long wire ----
const P7 = { I1: M.WIRES.I, I2: M.WIRES.I, r1: 0.05, r2: 0.25 };
P7.F = k2 * P7.I1 * P7.I2 * Math.log(P7.r2 / P7.r1);
const L7 = P7.r2 - P7.r1;
P7.nums = [P7.F, k2 * P7.I1 / ((P7.r1 + P7.r2) / 2) * P7.I2 * L7, k2 * P7.I1 / P7.r1 * P7.I2 * L7, k2 * P7.I1 / P7.r2 * P7.I2 * L7].map(x => x * 1e3);   // right · B at the middle · near end · far end
// ---- page 8: the page's toroid at 12 cm; the end of the page's solenoid ----
const { N: TN, I: TI, R0 } = M.TOR, r8 = 0.12;
const P8 = { B: MU0 * TN * TI / (2 * Math.PI * r8) };
P8.nums = [MU0 * TN * TI / (2 * Math.PI * M.TOR.a), 0, MU0 * TN * TI / (2 * Math.PI * R0), P8.B].map(x => x * 1e6);   // used the tube radius · "outside" · mean radius · right
const { L: SL, R: SR } = M.SOL;
const P8b = { B: M.SOL.B / 2 * SL / Math.hypot(SL, SR) };
P8b.nums = [P8b.B, M.SOL.B, M.SOL.B / 4, 0].map(x => x * 1e6);       // right · the long-solenoid value · quarter · "outside"

export const PRACTICE = {
  0: [
    { q: "一个封闭的盒子仅包围页面条形磁铁的 N 端。盒子外的净磁通量为",
      choices: ["零：进入的通量与离开的通量一样多", "正：磁力线离开 N 极", "负：磁铁内部的磁场进入盒子", "正值，盒子越大则越大"], answer: 0,
      why: "<p>∮<b>B</b>·<i>d</i><b>A</b> = 0 通过每个闭合表面：没有磁荷。线穿过外表面，但同样多的线穿过切割磁铁的面进入，内部磁场从 S 延伸到 N，通向 N 端。极子不是 <b>B</b> 的来源，而电荷是 <b>E</b>.</p> 的来源" },
    { q: `统一的 ${p(P0.B, 2)} T 场点笔直向上。半径为 ${p(P0.R * 100, 0)} cm 的开放半球形圆顶位于平坦的桌子上，圆顶朝上。通过曲面流出的磁通量为`,
      choices: P0.nums.map(x => `${p(x, 2)} mWb`), answer: 2, nums: P0.nums,
      why: `<p>圆顶加上其下方的平盘是一个封闭表面，因此它们的通量相互抵消：离开圆顶的通量等于通过圆盘的通量，<i>B</i>π<i>R</i><sup>2</sup>。或者从垂直方向对 θ 进行积分：</p><div class="eq">Φ = ∫ <i>B</i> cos θ · 2π<i>R</i><sup>2</sup> sin θ <i>d</i>θ (0 to π/2) = <i>B</i>π<i>R</i><sup>2</sup> = ${p(P0.phi * 1e3, 2)} mWb</div><p><i>B</i> × 2π<i>R</i><sup>2</sup> (${p(P0.nums[0], 2)} mWb) 忽略 <b>B</b> 对于大多数圆顶来说是不支持力的。</p>` },
  ],
  1: [
    { q: "电子通过指向 +<i>y</i> 方向的均匀磁场沿 +<i>x</i> 方向移动。其上的磁力指向",
      choices: ["+<i>z</i> 方向", "-<i>y</i> 方向", "无处：力为零", "-<i>z</i> 方向"], answer: 3,
      why: "<p><b>F</b> = <i>q</i><b>v</b> × <b>B</b> 和 <i>x̂</i> × <i>ŷ</i> = +<i>ẑ</i>。电子的电荷为负，翻转它：−<i>z</i>。力永远不会沿着<b>B</b>；它垂直于 <b>v</b> 和 <b>B</b>.</p>" },
    { q: `在页面上，<b>v</b> 和 <b>B</b> 之间的 θ 以稳定速率从 0 到 180° 扫描质子 (<i>F</i><sub>max</sub> = <i>qvB</i> = ${p(F1 / 1e-14, 2)} × 10<sup>−14</sup> N)。扫掠过程中的平均力大小为`,
      choices: P1.nums.map(x => `${p(x, 2)} × 10<sup>−14</sup> N`), answer: 1, nums: P1.nums,
      why: `<p>θ随时间均匀增长，因此时间平均值是 θ 上的平均值：</p><div class="eq">⟨<i>F</i>⟩ = (1/π) ∫<sub>0</sub><sup>π</sup> <i>qvB</i> sin θ <i>d</i>θ = (2/π)<i>qvB</i> = ${p(P1.avg / 1e-14, 2)} × 10<sup>−14</sup> N</div><p>不是峰值的一半（${p(P1.nums[0], 2)}）：sin θ不是一条直线，它在顶部附近花费更长的时间。</p>` },
  ],
  2: [
    { q: `氘核（电荷 +<i>e</i>，质量 2<i>m</i><sub>p</sub>）从静止加速通过页面的 ${P2.V} V 并进入相同的 ${p(M.CYC.B, 2)} T 场，其中 ${P2.V} V 质子在<i>r</i> = ${p(rp * 100, 2)} 厘米。氘核的半径为`,
      choices: P2.nums.map(x => `${p(x, 2)} cm`), answer: 3, nums: P2.nums,
      why: `<p>电荷相同，Δ<i>V</i>，所以动能相同 <i>e</i>Δ<i>V</i>;然后 <i>mv</i> = √(2<i>m</i> · <i>e</i>Δ<i>V</i>）和</p><div class="eq"><i>r</i> = <i>mv</i>/<i>qB</i> = √(2<i>m</i>Δ<i>V</i>/<i>q</i>)/<i>B</i> ∝ √<i>m</i> &nbsp;→&nbsp; √2 × ${p(rp * 100, 2)} cm = ${p(P2.r * 100, 2)} cm</div><p>质量的两倍并不意味着半径的两倍（${p(P2.nums[0], 2)} cm)：氘核的速度也较慢，慢了 √2。</p>` },
    { q: `免费回复。一个带电粒子 <i>q</i> 和质量 <i>m</i> 以速度移动 <b>v</b> 垂直于均匀场 <b>B</b> = <i>B</i><i>ẑ</i>。从牛顿第二定律出发，写出微分方程 <i>v<sub>x</sub></i> 和 <i>v<sub>y</sub></i>，解决它们，并找到周期。评估页面的质子（<i>B</i> = ${p(M.CYC.B, 2)} T).`,
      solution: `<p><b>F</b> = <i>q</i><b>v</b> × <b>B</b> 与 <b>v</b> × <i>ẑ</i> = (<i>v<sub>y</sub></i>, −<i>v<sub>x</sub></i>, 0):</p><div class="eq"><i>m dv<sub>x</sub></i>/<i>dt</i> = <i>qBv<sub>y</sub></i>, &nbsp; <i>m dv<sub>y</sub></i>/<i>dt</i> = −<i>qBv<sub>x</sub></i></div><p>区分第一个并使用第二个： <i>d</i><sup>2</sup><i>v<sub>x</sub></i>/<i>dt</i><sup>2</sup> = −ω<sup>2</sup><i>v<sub>x</sub></i>, ω = <i>qB</i>/<i>m</i>. So</p><div class="eq"><i>v<sub>x</sub></i> = <i>v</i> cos ω<i>t</i>, &nbsp; <i>v<sub>y</sub></i> = −<i>v</i> sin ω<i>t</i></div><p>速度保持不变 <i>v</i>;再次积分得到一个半径为圆的圆 <i>v</i>/ω = <i>mv</i>/<i>qB</i>，从+看顺时针追踪<i>z</i> 为了 <i>q</i> > 0. 周期不依赖于 <i>v</i>:</p><div class="eq"><i>T</i> = 2π/ω = 2π<i>m</i>/<i>qB</i> = 2π × 1.67×10<sup>−27</sup> / (1.60×10<sup>−19</sup> × ${p(M.CYC.B, 2)}) = ${p(M.CYC.T * 1e6, 3)} μs</div><p>这就是为什么页面上的 50 V 和 200 V 质子每次都会在开始时再次相遇。</p>`, val: M.CYC.T },
  ],
  3: [
    { q: `在页面的选择器中 (<i>E</i> = ${p(SE, 0)} V/m 下降， <i>B</i> = ${p(SB, 3)} T 进入页面），质子在 1.25 处进入<i>E</i>/<i>B</i> = ${p(P3.v / 1e5, 3)} × 10<sup>5</sup> 米/秒。当它进入时所受的合力很大`,
      choices: P3.nums.map(x => `${p(x, 1)} × 10<sup>−17</sup> N`), answer: 1, nums: P3.nums,
      why: `<p>这两个力是相反的： <i>qE</i> 下来， <i>qvB</i> 起来。快于 <i>E</i>/<i>B</i>，磁性者获胜：</p><div class="eq"><i>F</i> = <i>q</i>(<i>vB</i> − <i>E</i>) = 1.60×10<sup>−19</sup> × (${p(P3.v * SB, 0)} − ${p(SE, 0)}) = ${p(P3.F / 1e-17, 1)} × 10<sup>−17</sup> N, up</div><p>添加它们（${p(P3.nums[3], 1)}）错过了他们指向相反的方向；这就是该设备的全部要点。</p>` },
    { q: `页面的慢质子进入 ${p(P3b.vi / 1e4, 1)} × 10<sup>4</sup> m/s 并离开板 ${p(P3b.dy * 100, 3)} 厘米比它进入（朝向 - 板）低。它离开时的速度是`,
      choices: P3b.nums.map(x => `${p(x, 2)} × 10<sup>4</sup> m/s`), answer: 2, nums: P3b.nums,
      why: `<p>工作是∫<b>F</b>·<i>d</i><b>s</b>。磁力始终为 ⊥ <i>d</i><b>s</b>，因此不会产生任何作用；当质子下降时，电力为 <i>qE</i>Δ<i>y</i>：</p><div class="eq">½<i>mv</i><sup>2</sup> = ½<i>mv</i><sub>i</sub><sup>2</sup> + <i>qE</i>Δ<i>y</i> &nbsp;→&nbsp; <i>v</i> = √(<i>v</i><sub>i</sub><sup>2</sup> + 2<i>qE</i>Δ<i>y</i>/<i>m</i>) = ${p(P3b.v / 1e4, 2)} × 10<sup>4</sup> m/s</div><p>它加速，向较低电势下降。未达到<i>E</i>/<i>B</i> = ${p(v0 / 1e4, 1)} × 10<sup>4</sup> m/s；这不是任何事物所追求的速度。</p>` },
  ],
  4: [
    { q: `页面循环（μ = ${p(mu, 2)} A·m²、<i>B</i> = ${p(LB, 2)} T）从 θ = 0（μ 沿 <b>B</b>）缓慢转动到 θ = 180°。谁转动它所做的工作就是`,
      choices: P4.nums.map(x => `${p(x, 3)} J`), answer: 3, nums: P4.nums,
      why: `<p>对抗恢复力矩 μ<i>B</i> sin θ:</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup>π</sup> μ<i>B</i> sin θ <i>d</i>θ = 2μ<i>B</i> = ${p(P4.W, 3)} J</div><p>与Δ<i>U</i> = (−μ<i>B</i> cos 180°) − (−μ<i>B</i> cos 0) = 2μ<i>B</i> 相同。停在 90° 时仅给出 μ<i>B</i>； τ<sub>max</sub> × π (${p(P4.nums[1], 3)} J) 将力矩视为常数。</p>` },
    { q: `弯曲成半径为 ${p(P4b.R * 100, 0)} cm 的半圆的导线在垂直于其平面的均匀 ${p(P4b.B, 2)} T 场中承载 ${p(P4b.I, 1)} A。半圆上的净磁力为`,
      choices: P4b.nums.map(x => `${p(x, 3)} N`), answer: 1, nums: P4b.nums,
      why: `<p>添加<i>d</i><b>F</b> = <i>I d</i><b>s</b> × <b>B</b>。由于 <b>B</b> 是一致的，所以由积分出来，∫<i>d</i><b>s</b> 就是从一端到另一端的直向量，长度2<i>R</i>:</p><div class="eq"><i>F</i> = <i>I</i>(2<i>R</i>)<i>B</i> = ${P4b.I} × ${p(2 * P4b.R, 2)} × ${P4b.B} = ${p(P4b.F, 3)} N</div><p> 棋子的侧面部分抵消，因此弧长 π<i>R</i> (${p(P4b.nums[0], 3)} N) 超算。</p>` },
  ],
  5: [
    { q: `页面的金属丝（半径 ${p(Aa * 100, 0)} cm，${AI} A 均匀分布在其横截面上）。 <b>内部</b> 内的场 ${p(r5 * 1000, 0)} 距离轴 mm 为`,
      choices: P5.nums.map(x => `${p(x, 0)} μT`), answer: 3, nums: P5.nums,
      why: `<p>半径为 <i>r</i> < <i>a</i> 的安培圆仅包含分数<i>r</i><sup>2</sup>/<i>a</i><sup>2</sup> 的当前：</p><div class="eq"><i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>I</i><i>r</i><sup>2</sup>/<i>a</i><sup>2</sup> &nbsp;→&nbsp; <i>B</i> = μ<sub>0</sub><i>Ir</i>/2π<i>a</i><sup>2</sup> = ${p(P5.B * 1e6, 0)} μT</div><p>μ<sub>0</sub><i>I</i>/2π<i>r</i> (${p(P5.nums[0], 0)} μT) 计算超出范围的电流圆.</p>` },
    { q: `页面的矩形（边 ${p(Fb * 100, 0)} 厘米与 ${AI} A 线平行，近边 ${p(Fa * 100, 0)} 厘米远，${p(Fc * 100, 0)} 厘米宽）。通过它的磁通量为`,
      choices: P5.fnums.map(x => `${p(x, 2)} μWb`), answer: 2, nums: P5.fnums,
      why: `<p><i>B</i> 在整个矩形中变化，因此添加条带 <i>b dr</i>:</p><div class="eq">Φ = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>c</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>r</i>) <i>b dr</i> = (μ<sub>0</sub><i>Ib</i>/2π) ln(${p((Fa + Fc) / Fa, 0)}) = ${p(M.FLUX.phi * 1e6, 2)} μWb</div><p><i>B</i> 在中间 × 区域给出 ${p(P5.fnums[0], 2)} μWb：太低，因为 1/<i>r</i> 是弯曲的，并且附近的条带数量更多。</p>` },
  ],
  6: [
    { q: `页面的循环（<i>R</i> = ${p(RR * 100, 0)} cm, <i>B</i> = ${p(Bc * 1e6, 1)} μT 位于其中心）。在它的轴上，有一段距离 <i>z</i> = <i>R</i> 从中心开始，该场是`,
      choices: P6.nums.map(x => `${p(x, 1)} μT`), answer: 0, nums: P6.nums,
      why: `<div class="eq"><i>B</i> = μ<sub>0</sub><i>IR</i><sup>2</sup>/2(<i>R</i><sup>2</sup> + <i>z</i><sup>2</sup>)<sup>3/2</sup> = (μ<sub>0</sub><i>I</i>/2<i>R</i>) · 1/2<sup>3/2</sup> = ${p(Bc * 1e6, 1)}/${p(2 ** 1.5, 3)} = ${p(P6.B * 1e6, 1)} μT</div><p>不是一半：每块距离√2远（1/<i>r</i><sup>2</sup> → ½) 并且只有 d 的 cos 45°<b>B</b> 沿轴分布（另一个 1/√2）。</p>` },
    { q: `一根线承载 ${RI} A 沿着指向半径半圆中心的直引线进入 ${p(RR * 100, 0)} 厘米，绕半圆一周，并沿着一条直接指向中心的引线离开。中心的场是`,
      choices: P6b.nums.map(x => `${p(x, 1)} μT`), answer: 2, nums: P6b.nums,
      why: `<p>在直引线上， <i>d</i><b>l</b> 沿着 <b>r̂</b>, so <i>d</i><b>l</b> × <b>r̂</b> = 0：它们不添加任何内容。在弧上每块都是 ⊥ <b>r̂</b> 在远处 <i>R</i>:</p><div class="eq"><i>B</i> = (μ<sub>0</sub><i>I</i>/4π<i>R</i><sup>2</sup>) ∫<i>dl</i> = (μ<sub>0</sub><i>I</i>/4π<i>R</i><sup>2</sup>)(π<i>R</i>) = μ<sub>0</sub><i>I</i>/4<i>R</i> = ${p(P6b.B * 1e6, 1)} μT</div><p>半个完整的循环。计算侧面的引线（如半无限电线）（${p(P6b.nums[1], 1)} μT）是陷阱。</p>` },
  ],
  7: [
    { q: "两条长平行线可承载 20 A 和 10 A 电流 <b>对面</b> 方向。与 20 A 电线上的力相比，10 A 电线上的力为",
      choices: ["两倍大，电线吸引", "尺寸相同，电线会吸引", "尺寸相同，电线相互排斥", "一半大，电线排斥"], answer: 2,
      why: "<p><i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π<i>d</i> 两个电流是对称的（牛顿第三定律）：大小相等。相反的电流相互排斥。 10 A 电线所在的磁场强度是其两倍，但承载的电流却只有一半。</p>" },
    { q: `一根直杆躺着 <b>垂直</b> 到一根长电线，在同一平面上，从 ${p(P7.r1 * 100, 0)} cm to ${p(P7.r2 * 100, 0)} 厘米远。两者都带有页面的 ${P7.I1} A. 作用在棒上的磁力为`,
      choices: P7.nums.map(x => `${p(x, 3)} mN`), answer: 0, nums: P7.nums,
      why: `<p>导线的磁场到处都是 ⊥ 杆，但沿它减弱，因此积分 <i>dF</i> = <i>I</i><sub>2</sub><i>B</i>(<i>r</i>) <i>dr</i>:</p><div class="eq"><i>F</i> = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (μ<sub>0</sub><i>I</i><sub>1</sub>/2π<i>r</i>) <i>I</i><sub>2</sub> <i>dr</i> = (μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π) ln(${p(P7.r2 / P7.r1, 0)}) = ${p(P7.F * 1e3, 3)} mN</div><p>使用 <i>B</i> 在杆的中间（${p(P7.nums[1], 3)} mN) 低估了电线附近的强场。</p>` },
  ],
  8: [
    { q: `页面的环形线圈 (${TN} 轮流， ${TI} 一个；它的核心来自 ${p((R0 - M.TOR.a) * 100, 0)} to ${p((R0 + M.TOR.a) * 100, 0)} 距中心厘米）。核心内的场位于 <i>r</i> = ${p(r8 * 100, 0)} cm is`,
      choices: P8.nums.map(x => `${p(x, 1)} μT`), answer: 3, nums: P8.nums,
      why: `<p> 核心内半径为 <i>r</i> 的安培圆每转链接一次：</p><div class="eq"><i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>NI</i> &nbsp;→&nbsp; <i>B</i> = μ<sub>0</sub><i>NI</i>/2π<i>r</i> = 2×10<sup>−7</sup> × ${TN} × ${TI} / ${r8} = ${p(P8.B * 1e6, 1)} μT</div><p><i>B</i> 取决于 <i>r</i>：平均半径 ${p(R0 * 100, 0)} cm 给出 ${p(P8.nums[2], 1)} μT，仅在 ${p(R0 * 100, 0)} cm 处的值。</p>` },
    { q: `沿着页面螺线管的电流环求和（<i>n</i> = ${p(M.SOL.n, 0)} 转/米，<i>I</i> = ${M.SOL.I} A，<i>L</i> = ${p(SL * 100, 0)} cm，<i>R</i> = ${p(SR * 100, 0)} cm）得出轴上的 <i>B</i> = (μ<sub>0</sub><i>nI</i>/2)(cos θ<sub>1</sub> − cos θ<sub>2</sub>)。 <b>末端</b> 中心的场是`,
      choices: P8b.nums.map(x => `${p(x, 1)} μT`), answer: 0, nums: P8b.nums,
      why: `<p>每个片<i>dx</i>是一个承载<i>nI dx</i>的环；其轴向场加：</p><div class="eq"><i>B</i> = ∫<sub>0</sub><sup><i>L</i></sup> μ<sub>0</sub><i>nI R</i><sup>2</sup> <i>dx</i> / 2(<i>R</i><sup>2</sup> + <i>x</i><sup>2</sup>)<sup>3/2</sup> = (μ<sub>0</sub><i>nI</i>/2) · <i>L</i>/√(<i>L</i><sup>2</sup> + <i>R</i><sup>2</sup>) = ${p(P8b.B * 1e6, 1)} μT</div><p>几乎是μ<sub>0</sub><i>nI</i> = ${p(M.SOL.B * 1e6, 1)} μT：从末端开始，线圈仅向一侧延伸。</p>` },
  ],
};
