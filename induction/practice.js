// induction/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const MU0 = M.MU0;

// ---- page 0: average emf of a coil in a growing field; when a polynomial flux has zero emf ----
const P0 = { N: 200, A: 0.0050, B1: 0.10, B2: 0.50, dt: 0.20 };
P0.emf = P0.N * P0.A * (P0.B2 - P0.B1) / P0.dt;
P0.nums = [P0.A * (P0.B2 - P0.B1) / P0.dt, P0.emf, P0.N * P0.A * P0.B2 / P0.dt, P0.N * P0.A * (P0.B2 - P0.B1) * P0.dt];   // forgot N · right · used B₂ not ΔB · ×Δt
const P0b = { a: 4.0, b: 6.0 };                      // Φ = a t³ − b t (mWb)
P0b.t = Math.sqrt(P0b.b / (3 * P0b.a));
P0b.nums = [Math.sqrt(P0b.b / P0b.a), P0b.b / (3 * P0b.a), Math.sqrt(3 * P0b.a / P0b.b), P0b.t];   // where Φ = 0 · forgot the root · upside down · right

// ---- page 1: charge through the loop as the N pole comes in (page's magnet and loop) ----
const L1 = (() => { const c = M.CASES[0], a = M.lenzCase(c, 0), b = M.lenzCase(c, M.LENZ.run), dPhi = b.Phi - a.Phi;
  return { dPhi, Q: dPhi / M.LENZ.R, nums: [dPhi / M.LENZ.R / 2, dPhi / (M.LENZ.R * M.LENZ.run), dPhi * M.LENZ.run / M.LENZ.R, dPhi / M.LENZ.R].map(x => x * 1e3) }; })();
// ---- page 2: the iron core, I₁ = c t² ----
const P2 = { c: 2.0, t: 0.50 };
P2.dI = 2 * P2.c * P2.t;
P2.nums = [M.CORE.M * P2.c * P2.t ** 2, M.CORE.M * P2.dI, M.CORE.L1 * P2.dI, M.CORE.M * P2.c * P2.t].map(x => x * 1e3);   // M·I · right · L₁ · lost the 2
// ---- page 3: the page's loop leaving the wire, at r = 2 cm ----
const P3 = (() => { const { I, a, b, r0: r, v } = M.WIRE, k = MU0 * I / (2 * Math.PI);
  return { emf: k * a * b * v / (r * (r + a)), nums: [k / r * b * v, k * (1 / r + 1 / (r + a)) * b * v, k * (1 / r - 1 / (r + a)) * a * v, k * (1 / r - 1 / (r + a)) * b * v].map(x => x * 1e6) }; })();
// ---- page 4: a rod turning about one end ----
const P4 = { l: 0.50, w: 20, B: 0.40 };
P4.emf = 0.5 * P4.B * P4.w * P4.l ** 2;
P4.nums = [P4.B * P4.w * P4.l ** 2, P4.emf, P4.B * P4.w * P4.l, P4.emf / 2];   // tip speed for the whole rod · right · dropped an ℓ · ¼
// ---- page 5: pulling the page's loop into the field at constant speed ----
const P5 = (() => { const { B, h, w, v, R } = M.CROSS, F = B * B * h * h * v / R;
  return { F, nums: [B * B * h * w * v / R, 2 * F, F, B * h * h * v / R].map(x => x * 1e3) }; })();   // used w · both sides · right · one B only
// ---- page 6: how far the page's bar coasts ----
const P6 = (() => { const { v0, tau } = M.RAIL; return { d: v0 * tau, nums: [v0 * tau / 2, v0 * tau * (1 - 1 / Math.E), v0 * tau] }; })();
// ---- page 7: a solenoid's inductance; the page's solenoid driven sinusoidally ----
const P7 = { N: 500, l: 0.25, r: 0.010 };
P7.L = MU0 * P7.N ** 2 * Math.PI * P7.r ** 2 / P7.l;
P7.nums = [P7.L, MU0 * P7.N ** 2 * Math.PI * (2 * P7.r) ** 2 / P7.l, MU0 * P7.N * Math.PI * P7.r ** 2 / P7.l, MU0 * P7.N ** 2 * P7.r ** 2 / P7.l].map(x => x * 1e3);   // right · diameter · N not N² · forgot π
const P7b = { I0: 2.0, w: 50 };
P7b.emf = M.SOL.L * P7b.I0 * P7b.w;
P7b.nums = [M.SOL.L * P7b.I0, M.SOL.L * P7b.I0 / P7b.w, P7b.emf, M.SOL.L * P7b.I0 * P7b.w ** 2].map(x => x * 1e3);
// ---- page 8: the page's RL circuit reaching 2.0 A ----
const P8 = { I: 2.0 };
P8.t = -M.RL.tau * Math.log(1 - P8.I / M.RL.Imax);
P8.nums = [M.RL.tau, P8.t, M.RL.tau * Math.log(M.RL.Imax / P8.I), M.RL.tau * P8.I / M.RL.Imax];   // assumed τ · right · ln upside down · linear
// ---- page 9: the page's LC circuit, first maximum of the current ----
const P9 = { t: M.LC.T / 4, I: M.LC.Imax };

export const PRACTICE = {
  0: [
    { q: `面积为 ${p(P0.A * 1e4, 0)} cm² 的 ${P0.N} 匝线圈平放在与其垂直的均匀场中。该领域从 ${p(P0.B1, 2)} T 到 ${p(P0.dt, 2)} s 中的 ${p(P0.B2, 2)} T 稳步增长。感应电动势的大小为`,
      choices: P0.nums.map(x => `${p(x, 3)} V`), answer: 1, nums: P0.nums,
      why: `<p>每转有 Φ = <i>BA</i>，以及所有 ${P0.N} 轮流添加：</p><div class="eq">|ε| = <i>NA</i> Δ<i>B</i>/Δ<i>t</i> = ${P0.N} × ${P0.A} m² × ${p(P0.B2 - P0.B1, 2)} T / ${P0.dt} s = ${p(P0.emf, 3)} V</div><p>只有 <b>改变</b> in <i>B</i> 计数：使用 ${P0.B2} T 独自给出 ${p(P0.nums[2], 3)} V，并省略 <i>N</i> 给一回合 ${p(P0.nums[0], 3)} V.</p>` },
    { q: `通过环路的通量为 Φ<sub><i>B</i></sub>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i><sup>3</sup> − ${p(P0b.b, 1)}<i>t</i> （兆瓦， <i>t</i> 在 s) 中。什么时间 <i>t</i> > 0 感应电动势为零吗？`,
      choices: P0b.nums.map(x => `${p(x, 2)} s`), answer: 3, nums: P0b.nums,
      why: `<p>电动势减去 <b>坡度</b> 的 Φ，而不是 Φ 本身：</p><div class="eq">ε = −<i>d</i>Φ/<i>dt</i> = −(${p(3 * P0b.a, 0)}<i>t</i><sup>2</sup> − ${p(P0b.b, 0)}) = 0 &nbsp;→&nbsp; <i>t</i> = √(${p(P0b.b, 0)}/${p(3 * P0b.a, 0)}) = ${p(P0b.t, 2)} s</div><p>At ${p(P0b.nums[0], 2)} 通量为零但仍在变化，因此电动势不是。</p>` },
  ],
  1: [
    { q: "条形磁铁的 N 极被沿着其轴直接拉离环。从磁铁方向看，环路中的感应电流为",
      choices: ["逆时针方向，环排斥磁铁", "顺时针旋转，环排斥磁铁", "逆时针方向，环吸引磁铁", "顺时针旋转，环吸引磁铁"], answer: 3,
      why: "<p>N 极的磁场穿过远离观察者的环路，并且正在缩小。感应场指向相同的方向，远离观察者，以弥补损失：根据右手定则， <b>顺时针</b> 从磁铁处看到的电流。磁力线进入环路的近端面，因此该面是 S 极，并将 N 极拉回：环路阻止运动。</p>" },
    { q: `在页面循环中（<i>R</i> = ${p(M.LENZ.R * 1e3, 0)} mΩ) 通量从 ${p(M.lenzCase(M.CASES[0], 0).Phi * 1e6, 2)} µWb to ${p(M.lenzCase(M.CASES[0], M.LENZ.run).Phi * 1e6, 2)} µWb 当 N 极进入时 ${p(M.LENZ.run, 1)} s。绕环路流动的总电荷为`,
      choices: L1.nums.map(x => `${p(x, 2)} mC`), answer: 3, nums: L1.nums,
      why: `<p>积分电流；时间消失：</p><div class="eq"><i>Q</i> = ∫<i>I dt</i> = ∫(ε/<i>R</i>) <i>dt</i> = (1/<i>R</i>)∫|<i>d</i>Φ| = ΔΦ/<i>R</i> = ${p(L1.dPhi * 1e6, 2)} µWb / ${M.LENZ.R} Ω = ${p(L1.Q * 1e3, 2)} mC</div><p>磁铁移动的速度有多快并不重要。 ${p(L1.nums[1], 2)} 是平均电流（以 mA 为单位），而不是电荷。</p>` },
  ],
  2: [
    { q: "两个线圈共用一个铁芯。如果匝数 <b>中学</b> 互感加倍 <i>M</i>",
      choices: ["双打", "没有改变", "四倍体", "一半"], answer: 0,
      why: "<p><i>M</i> = <i>N</i><sub>2</sub>Φ<sub>2</sub>/<i>I</i><sub>1</sub>。由初级电流和匝数设定的每匝磁通保持不变；两倍的次级匝数可容纳两倍的磁链。 <i>M</i> = μ<sub>r</sub>μ<sub>0</sub><i>N</i><sub>1</sub><i>N</i><sub>2</sub><i>A</i>/ℓ 在每个中都是线性的 <i>N</i>;它是一个自感，如下所示 <i>N</i><sup>2</sup>.</p>" },
    { q: `在页面的铁芯上（<i>M</i> = ${p(M.CORE.M * 1e3, 1)} mH，<i>L</i><sub>1</sub> = ${p(M.CORE.L1 * 1e3, 1)} mH）初级承载<i>I</i><sub>1</sub> = ${p(P2.c, 1)}<i>t</i><sup>2</sup>（A，<i>t</i>，单位为秒）。 <i>t</i> = ${p(P2.t, 2)} s 处的二次电动势的大小为`,
      choices: P2.nums.map(x => `${p(x, 1)} mV`), answer: 1, nums: P2.nums,
      why: `<div class="eq">ε<sub>2</sub> = −<i>M dI</i><sub>1</sub>/<i>dt</i> = −<i>M</i>(${p(2 * P2.c, 1)}<i>t</i>) = −${p(M.CORE.M * 1e3, 1)} mH × ${p(P2.dI, 2)} A/s = −${p(P2.nums[1], 1)} mV</div><p> 它需要变化率，而不是<i>I</i><sub>1</sub> 本身（${p(P2.nums[0], 1)} mV）；辅助设备看到的是 <i>M</i>，而不是主设备自己的 <i>L</i><sub>1</sub>.</p>` },
  ],
  3: [
    { q: "矩形环路的边 <i>b</i> 与承载 <i>I</i> 的长导线平行；它的近侧位于距离 <i>r</i>，远侧位于 <i>r</i> + <i>a</i>。通过它的通量为",
      choices: ['(μ<sub>0</sub><i>Ib</i>/2π<i>r</i>)<i>a</i>', '(μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', '(μ<sub>0</sub><i>Ia</i>/2π) ln((<i>r</i> + <i>b</i>)/<i>r</i>)', '(μ<sub>0</sub><i>Ib</i>/2π)(1/<i>r</i> − 1/(<i>r</i> + <i>a</i>))'], answer: 1,
      why: "<p><i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>s</i> 随距离 <i>s</i> 的变化而变化，因此将环路切成与 <i>b ds</i> 平行的条带电线：</p><div class=\"eq\">Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i> = (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)</div><p>选项 A 将 <i>B</i> 视为其近侧值均匀；选择D是导数的形状，而不是积分的形状。</p>" },
    { q: `页面循环（沿导线的 <i>b</i> = ${p(M.WIRE.b * 100, 0)} cm，横向 <i>a</i> = ${p(M.WIRE.a * 100, 0)} cm）以 ${p(M.WIRE.v * 100, 0)} cm/s 的速度直接远离 ${M.WIRE.I} A 导线。当其近侧距离导线为${p(M.WIRE.r0 * 100, 0)} cm时，|ε|是`,
      choices: P3.nums.map(x => `${p(x, 3)} µV`), answer: 3, nums: P3.nums,
      why: `<p>仅两侧平行于线切割场线。每个都有运动电动势 <i>Bbv</i>，并围绕它们反对的环：</p><div class="eq">ε = (<i>B</i><sub>near</sub> − <i>B</i><sub>far</sub>)<i>bv</i> = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>) = ${p(P3.emf * 1e6, 3)} µV</div><p>与对数的−<i>d</i>Φ/<i>dt</i> 相同。仅近侧给出 ${p(P3.nums[0], 3)} µV；添加两侧，${p(P3.nums[1], 3)} µV.</p>` },
  ],
  4: [
    { q: "一根垂直的金属条通过均匀的场向右移动，指向页面，没有电路。过了一会儿，",
      choices: ["顶端电势较高，没有电流流过", "底端电势较高，有电流流动", "底端电势较高，无电流流过", "顶端电势较高，电流沿条流过"], answer: 0,
      why: "<p><i>F</i> = <i>qv</i>×<i>B</i>：右×进入页面=向上，因此正电荷聚集在顶部。它的场向后推，直到 <i>qE</i> = <i>qvB</i>；然后没有任何东西沿着导体棒移动。如果没有闭合路径，则存在电动势 <i>BLv</i>，但没有稳定电流。</p>" },
    { q: `一根 ${p(P4.l * 100, 0)} cm 金属棒在 ${P4.w} rad/s 处绕一端转动，在垂直于均匀 ${p(P4.B, 2)} T 场的平面中。其两端之间的电动势为`,
      choices: P4.nums.map(x => `${p(x, 2)} V`), answer: 1, nums: P4.nums,
      why: `<p>每件 <i>dr</i> 移动于 <i>v</i> = ω<i>r</i>，所以它的电动势是 <i>B</i>ω<i>r dr</i>。沿着杆添加它们：</p><div class="eq">ε = ∫<sub>0</sub><sup>ℓ</sup> <i>B</i>ω<i>r dr</i> = ½<i>B</i>ωℓ<sup>2</sup> = ½ × ${P4.B} × ${P4.w} × ${P4.l}<sup>2</sup> = ${p(P4.emf, 2)} V</div><p>使用整个杆的尖端速度 ωℓ 可得出 ${p(P4.nums[0], 2)} V，两倍太多：平均速度是尖端的一半。</p>` },
  ],
  5: [
    { q: `环路（高度 <i>h</i> = ${p(M.CROSS.h * 100, 0)} 厘米，宽度 ${p(M.CROSS.w * 100, 0)} cm, <i>R</i> = ${M.CROSS.R} Ω）被拉入 ${M.CROSS.B} T场稳定 ${M.CROSS.v} 多发性硬化症。当其前导侧向内、尾随侧向外时，所需的拉力为`,
      choices: P5.nums.map(x => `${p(x, 1)} mN`), answer: 2, nums: P5.nums,
      why: `<div class="eq"><i>I</i> = <i>Bhv</i>/<i>R</i>, &nbsp;<i>F</i> = <i>IhB</i> = <i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>v</i>/<i>R</i> = ${p(P5.F * 1e3, 1)} mN</div><p>只有前导侧在场中携带电流（顶部和底部力抵消），并且只有高度 <i>h</i> 切割场线。检查： <i>Fv</i> = ${p(P5.F * M.CROSS.v * 1e3, 1)} mW = ε<sup>2</sup>/<i>R</i>.</p>` },
    { q: "质量环 <i>m</i>, 电阻 <i>R</i> 和身高 <i>h</i> 幻灯片 <b>自由地</b> （无拉力）进入均匀场 <i>B</i> 高速 <i>v</i><sub>0</sub>。求其速度与距离的函数关系 <i>x</i> 它的领先方已进入场地，而落后方仍在场外。",
      solution: `<p>目前只有该领域的领先方 <i>Bhv</i>/<i>R</i> 场将其反推 <i>IhB</i>:</p><div class="eq"><i>m dv</i>/<i>dt</i> = −<i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>v</i>/<i>R</i></div><p>写 <i>dv</i>/<i>dt</i> = <i>v dv</i>/<i>dx</i> 并取消 <i>v</i>:</p><div class="eq"><i>m dv</i>/<i>dx</i> = −<i>B</i><sup>2</sup><i>h</i><sup>2</sup>/<i>R</i> &nbsp;→&nbsp; <i>v</i>(<i>x</i>) = <i>v</i><sub>0</sub> − <i>B</i><sup>2</sup><i>h</i><sup>2</sup><i>x</i>/<i>mR</i></div><p>速度下降 <b>与距离成线性关系</b> （随时间呈指数增长）。如果 <i>v</i> 之前会达到 0 <i>x</i> = 循环的宽度，循环在中途停止。</p>` },
  ],
  6: [
    { q: `页面栏 (τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup> = ${p(M.RAIL.tau, 2)} s) 被释放 ${p(M.RAIL.v0, 2)} m/s，没有任何东西推动它。停车前行驶了多远？`,
      choices: [`${p(P6.nums[0], 2)} m`, `${p(P6.nums[1], 2)} m`, "它永远不会停止，所以距离无限增长", `${p(P6.nums[2], 2)} m`], answer: 3, nums: [P6.nums[0], P6.nums[1], NaN, P6.nums[2]],
      why: `<p>速度呈指数衰减，但其积分是有限的：</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup>∞</sup> <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup> <i>dt</i> = <i>v</i><sub>0</sub>τ = ${p(P6.d, 2)} m</div><p>${p(P6.nums[1], 2)} m 只是它经过的距离 <i>t</i> = τ; ${p(P6.nums[0], 2)} m 假设减速度恒定。</p>` },
    { q: "连接轨道的电阻器被替换为两倍电阻之一，并且杆以相同的速度发射。静止时产生的总热量",
      choices: ["双打", "一半", "没有改变", "四倍体"], answer: 2,
      why: "<p> 棒的所有动能 ½<i>mv</i><sub>0</sub><sup>2</sup> 最终都会变成热量，无论 <i>R</i> 是什么。 <i>R</i> 越大，意味着电流越小，制动也越弱，因此 τ 加倍，滑杆滑行距离也加倍，但总热量相同。</p>" },
  ],
  7: [
    { q: `螺线管具有 ${P7.N} 匝数 ${p(P7.l * 100, 0)} cm，半径为 ${p(P7.r * 100, 1)} cm。其电感量约为`,
      choices: P7.nums.map(x => x < 0.01 ? `${p(x * 1e3, 2)} µH` : `${p(x, 3)} mH`), answer: 0, nums: P7.nums,
      why: `<p><i>B</i> = μ<sub>0</sub><i>nI</i> 经过每一圈，因此 <i>N</i>Φ = <i>N</i>(μ<sub>0</sub><i>NI</i>/ℓ)π<i>r</i><sup>2</sup>和</p><div class="eq"><i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup>π<i>r</i><sup>2</sup>/ℓ = ${p(P7.L * 1e3, 3)} mH</div><p>使用 <i>r</i> 的直径给出 4× 太多； <i>N</i> 而不是 <i>N</i><sup>2</sup> 忘记了更多的转弯既可以产生更多的场，也可以捕获更多的场。</p>` },
    { q: `页面的螺线管 (<i>L</i> = ${p(M.SOL.L * 1e3, 2)} mH) 带有 <i>I</i>(<i>t</i>) = (${p(P7b.I0, 1)} A) sin(${P7b.w}<i>t</i>)。其反电动势的最大值为`,
      choices: P7b.nums.map(x => x < 1 ? `${p(x, 3)} mV` : x < 10 ? `${p(x, 2)} mV` : x < 1000 ? `${p(x, 1)} mV` : `${p(x / 1e3, 1)} V`), answer: 2, nums: P7b.nums,
      why: `<div class="eq">ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i> = −<i>LI</i><sub>0</sub>ω cos ω<i>t</i>, &nbsp;max <i>LI</i><sub>0</sub>ω = ${p(M.SOL.L * 1e3, 2)} mH × ${P7b.I0} A × ${P7b.w} s<sup>−1</sup> = ${p(P7b.emf * 1e3, 1)} mV</div><p> 当 <i>I</i> = 0 时出现峰值，变化最快； <i>LI</i><sub>0</sub> = ${p(P7b.nums[0], 2)} mV 是以 mWb 为单位的磁链，而不是电动势。</p>` },
  ],
  8: [
    { q: `在页面电路中（ε = ${M.RL.E} V，<i>R</i> = ${M.RL.R} Ω，<i>L</i> = ${M.RL.L} H），从<i>I</i> = 0开始，电流达到${p(P8.I, 1)} A需要多长时间？`,
      choices: P8.nums.map(x => `${p(x, 3)} s`), answer: 1, nums: P8.nums,
      why: `<p> 根据 <i>I</i> = 0 求解 <i>L dI</i>/<i>dt</i> = ε − <i>IR</i>： <i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), τ = <i>L</i>/<i>R</i> = ${p(M.RL.tau, 2)} s.</p><div class="eq"><i>t</i> = −τ ln(1 − <i>IR</i>/ε) = −${p(M.RL.tau, 2)} ln(1 − ${p(P8.I, 1)}/${p(M.RL.Imax, 1)}) = ${p(P8.t, 3)} s</div><p>${p(P8.I, 1)} A 是 ${p(M.RL.Imax, 0)} A 的 ${p(P8.I / M.RL.Imax * 100, 0)} %，超过 τ 处达到的 63%，因此需要比 τ.</p> 更长的时间` },
    { q: "当电池突然脱离环路（环路通过电阻保持闭合）时，带有电池的 RL 电路已经开启了很长时间。就在之后，",
      choices: ["电流为ε/<i>R</i>，下降，电感作为源极", "电流为零", "电流为ε/<i>R</i>且稳定", "电流反转方向"], answer: 0,
      why: "<p>电感器禁止电流突然跳跃，因此<i>I</i>以相同方向的ε/<i>R</i>开始。在没有电池的情况下，<i>L dI</i>/<i>dt</i> = −<i>IR</i>：电感器的电动势现在驱动电流通过 <i>R</i>，同时电流衰减为 <i>e</i><sup>−<i>t</i>/τ</sup>，从而转动½<i>LI</i><sup>2</sup> 转化为热量。</p>" },
  ],
  9: [
    { q: `该页面的电容器（${p(M.LC.C * 1e6, 0)} µF、${p(M.LC.Q * 1e6, 0)} µC）在 <i>t</i> = 0 时连接到 ${p(M.LC.L * 1e3, 0)} mH 线圈。电流首先达到最大值`,
      choices: [`<i>t</i> = ${p(M.LC.T / 2 * 1e3, 2)} ms, ${p(P9.I * 1e3, 0)} mA`, `<i>t</i> = ${p(P9.t * 1e3, 2)} ms, ${p(M.LC.f * M.LC.Q * 1e3, 1)} mA`, `<i>t</i> = ${p(P9.t * 1e3, 2)} ms, ${p(P9.I * 1e3, 0)} mA`, `<i>t</i> = 0, ${p(P9.I * 1e3, 0)} mA`], answer: 2,
      nums: [M.LC.T / 2 * 1e3, P9.t * 1e3, P9.t * 1e3, 0], nums2: [P9.I * 1e3, M.LC.f * M.LC.Q * 1e3, P9.I * 1e3, P9.I * 1e3],
      why: `<p>ω = 1/√(<i>LC</i>) = ${p(M.LC.w, 0)} rad/s、<i>T</i> = 2π/ω = ${p(M.LC.T * 1e3, 2)} 毫秒。 <i>q</i> = <i>Q</i> cos ω<i>t</i>, <i>I</i> = −ω<i>Q</i> sin ω<i>t</i> 首先在 ω<i>t</i> = π/2 处最大，即四分之一周期，此时板为空：</p><div class="eq"><i>t</i> = <i>T</i>/4 = ${p(P9.t * 1e3, 2)} ms, &nbsp;|<i>I</i>| = ω<i>Q</i> = ${p(P9.I * 1e3, 0)} mA</div><p> 当 <i>t</i> = 0 时，电流为零：线圈不会让它跳变。 ${p(M.LC.f * M.LC.Q * 1e3, 1)} mA 使用 <i>f</i> 代替 ω.</p>` },
    { q: "对于无电阻的 LC 电路，证明 <i>U</i> = <i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup> 是常数，并使用能量求出电流当电容器上的电荷为<i>Q</i>/2（其最大电荷为<i>Q</i>）时。",
      solution: `<p>微分，其中 <i>I</i> = <i>dq</i>/<i>dt</i>:</p><div class="eq"><i>dU</i>/<i>dt</i> = (<i>q</i>/<i>C</i>)<i>I</i> + <i>LI dI</i>/<i>dt</i> = <i>I</i>(<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i>)</div><p>括号里是循环规则，时刻为零，所以<i>U</i> = <i>Q</i><sup>2</sup>/2<i>C</i>整个过程。在 <i>q</i> = <i>Q</i>/2 处：</p><div class="eq">½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> − <i>Q</i><sup>2</sup>/8<i>C</i> = 3<i>Q</i><sup>2</sup>/8<i>C</i> &nbsp;→&nbsp; |<i>I</i>| = (√3/2) <i>Q</i>/√(<i>LC</i>) = (√3/2)ω<i>Q</i></div><p> 对于页面电路，即 ${p(Math.sqrt(3) / 2 * M.LC.Imax * 1e3, 1)} mA。当只剩下一半电荷时，四分之三的能量都在线圈中。</p>` },
  ],
};
