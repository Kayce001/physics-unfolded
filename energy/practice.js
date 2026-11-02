// energy/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, D2R = Math.PI / 180;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);

// 0 · work: the page's pull, 20 N at 30°, over 3.0 m
const P = M.PULL, d0 = 3.0, W0 = P.F * d0 * Math.cos(P.th);
// 1 · the toss
const T = M.TOSS, Wup = -0.5 * T.m * T.v0 ** 2;
// 2 · the whirl, half a lap
const Wh = M.WHIRL, halfArc = Math.PI * Wh.r;
// 3 · the car over 12 m from rest
const C = M.CAR, d3 = 12, v3 = Math.sqrt(2 * C.F * d3 / C.m);
// 4 · the drop, zero on the 1.0 m tabletop; speed 1.0 m above the ground
const Dr = M.DROP, y4 = 1.0, U4 = Dr.m * G * (Dr.h - Dr.ref2), v4 = Math.sqrt(2 * G * (Dr.h - y4));
// 5 · the spring, compression when the block has slowed to 1.0 m/s
const S = M.SPRING, v5 = 1.0, x5 = Math.sqrt(S.m * (S.v0 ** 2 - v5 ** 2) / S.k);
// 6 · the changing push (Physics C)
const Pu = M.PUSH, v6 = Math.sqrt(2 * Pu.W / Pu.m), Whalf = Pu.F0 * Pu.L * 13 / 24;
// 7 · the pendulum at 20°
const Pd = M.PEND, th7 = 20 * D2R, v7 = Math.sqrt(2 * G * Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)));
const vb = Math.sqrt(2 * G * Pd.L * (1 - Math.cos(Pd.th0))), Tb = Pd.m * G + Pd.m * vb ** 2 / Pd.L;
// 8 · U(x) = 3x² − 2x³ (Physics C)
const U8 = x => 3 * x * x - 2 * x ** 3, F8 = x => -(6 * x - 6 * x * x), x8 = 2.0;
// 9 · the bond (Physics C)
const B = M.BOND, kB = 72 * B.eps / B.r0 ** 2, TB = 2 * Math.PI * Math.sqrt(B.m / kB);
// 10 · the slide, from 8.0 m/s; heat after 1.0 m from 4.0 m/s
const Sl = M.SLIDE, v10 = 8.0, d10 = v10 ** 2 / (2 * Sl.mu * G), x10 = 1.0, Q10 = Sl.mu * Sl.m * G * x10;
// 11 · a student on the stairs
const m11 = 70, h11 = 3.0, t11 = 4.2, P11 = m11 * G * h11 / t11;

export const PRACTICE = {
  0: [
    { q: `绳索将带有 ${f(P.F, 0)} N 的 ${f(P.m, 1)} kg 箱拉至水平面以上 ${P.deg}°，同时沿无摩擦地板滑动 ${f(d0, 1)} m。绳子做了多少功？`,
      choices: [`${f(P.F * d0 * Math.sin(P.th), 1)} J`, `${f(P.F * d0, 1)} J`, `${f(W0, 1)} J`, `${f(P.F * d0 / Math.cos(P.th), 1)} J`], answer: 2,
      why: `<p>只有沿位移的分量起作用：</p><div class="eq"><i>W</i> = <i>F</i>Δ<i>x</i> cos θ = ${f(P.F, 0)} × ${f(d0, 1)} × cos ${P.deg}° = ${f(W0, 1)} J</div><p>${f(P.F * d0 * Math.sin(P.th), 1)} J 使用 sin θ，即穿过运动的部分； ${f(P.F * d0, 1)} J忽略角度。</p>` },
    { q: "在同样的拉力过程中，地板的法向力对盒子做了多少功？",
      choices: ["负，因为法向力小于 <i>mg</i>", "零，因为它垂直于位移", "正，因为它指向上方", "与绳索所做的功大小相等且方向相反"], answer: 1,
      why: "<p>法向力是垂直的，盒子水平移动：θ = 90°，cos 90° = 0，所以<i>W</i> = 0。它的尺寸（比<i>mg</i>小，因为绳子升力一点）并不重要。</p>" },
  ],
  1: [
    { q: `${f(T.m)} 公斤球在 ${f(T.v0, 1)} m/s 处垂直向上离开手。从手到顶部，重力对它做了多少功？`,
      choices: [`${f(-Wup)} J`, `${f(0)} J`, `${f(2 * Wup)} J`, `${f(Wup)} J`], answer: 3,
      why: `<p>重力点与运动相反（θ = 180°），因此它的功为负，根据功能量定理，它消除了所有动能：</p><div class="eq"><i>W</i><sub>g</sub> = Δ<i>K</i> = 0 − ½ × ${f(T.m)} × ${f(T.v0, 1)}² = ${f(Wup)} J</div><p>${f(2 * Wup)} J 忘记了 1/2； +${f(-Wup)} J 符号错误。</p>` },
    { q: "在整个行程中，从手离开到回到同一高度，重力对球所做的总功为",
      choices: ["正", "负", "零", "等于<i>mgh</i>，其中<i>h</i>最大高度"], answer: 2,
      why: "<p>上升途中负功，下降途中等量正功：总量为零。这就是为什么球以其发射速度回到手上（无空气阻力）。</p>" },
  ],
  2: [
    { q: `旋转球上的弦张力为 ${f(Wh.T, 1)} N，圆的半径为 ${f(Wh.r, 1)} m。半圈期间张力做了多少功？`,
      choices: [`${f(Wh.T * halfArc, 1)} J`, `${f(Wh.T * 2 * Wh.r, 1)} J`, `${f(-Wh.T * halfArc, 1)} J`, '0 J'], answer: 3,
      why: `<p> 在每一瞬间，张力点位于中心，速度沿圆：它们以 90° 相交，因此每个小步贡献 <i>T</i> d<i>s</i> cos 90° = 0。总计为 0 J，速度永远不会</p><p>${f(Wh.T * halfArc, 1)} J 将力乘以弧长，就好像它们平行一样； ${f(Wh.T * 2 * Wh.r, 1)} J 使用直径，净位移，仍然不是沿每个时刻的力。</p>` },
    { q: "现在，球在同一根绳子上以两倍的速度旋转。张力和球的动能受哪些因素影响？",
      choices: ["张力×2，动能×4", "张力×4，动能×4", "张力×4，动能×2", "张力×2，动能×2"], answer: 1,
      why: "<p><i>T</i> = <i>mv</i>²/<i>r</i> 和 <i>K</i> = ½<i>mv</i>² 都与 <i>v</i>² 相同，因此两者都增长 4 倍。张力仍然不起作用：更大的 <i>K</i> 来自加速球向上的任何东西。</p>" },
  ],
  3: [
    { q: `${f(C.F / 1000, 1)} kN 的合力将 ${C.m} kg 车从静止状态推过 ${d3} m。那么它的速度是多少呢？`,
      choices: [`${f(Math.sqrt(C.F * d3 / C.m))} m/s`, `${f(v3)} m/s`, `${f(C.F * d3 / C.m, 1)} m/s`, `${f(2 * C.F * d3 / C.m, 1)} m/s`], answer: 1,
      why: `<div class="eq"><i>W</i><sub>net</sub> = <i>F</i>Δ<i>x</i> = ${f(C.F * d3 / 1000, 1)} kJ = ½<i>mv</i>² &nbsp;⇒&nbsp; <i>v</i> = √(2 × ${f(C.F * d3, 0)} / ${C.m}) = ${f(v3)} m/s</div><p>${f(Math.sqrt(C.F * d3 / C.m))} m/s 下降 1/2；另外两个忘记平方根。</p>` },
    { q: "同样的合力使汽车从静止状态达到速度 <i>v</i>，然后从 <i>v</i> 达到 2<i>v</i>。第二阶段的净功是第一阶段的多少倍？",
      choices: ['1', '2', '4', '3'], answer: 3,
      why: "<p>Δ<i>K</i>从0到<i>v</i>是1/2<i>mv</i>²。从 <i>v</i> 到 2<i>v</i> 为 ½<i>m</i>(4<i>v</i>² − <i>v</i>²) = 3 × ½<i>mv</i>²。动能随着 <i>v</i>² 的增加而增加，因此同等的速度会消耗越来越多的功（和距离）。</p>" },
  ],
  4: [
    { q: `将 <i>U</i><sub>g</sub> = 0 放在距地面 ${f(Dr.ref2, 1)} 米的桌面上。 ${f(Dr.m)} kg 球距地面 ${f(Dr.h, 1)} 米的 <i>U</i><sub>g</sub> 是多少？`,
      choices: [`${f(Dr.m * G * Dr.h)} J`, `${f(Dr.m * G * Dr.ref2)} J`, `${f(U4)} J`, `${f(Dr.m * G * (Dr.h + Dr.ref2))} J`], answer: 2,
      why: `<p> 从所选零点测量 Δ<i>y</i>： ${f(Dr.h, 1)} − ${f(Dr.ref2, 1)} = ${f(Dr.h - Dr.ref2, 1)} m.</p><div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i> = ${f(Dr.m)} × ${f(G)} × ${f(Dr.h - Dr.ref2, 1)} = ${f(U4)} J</div><p>${f(Dr.m * G * Dr.h)} J 仅当零接地时才正确。</p>` },
    { q: `球从 ${f(Dr.h, 1)} 米处落下。当它距离地面 ${f(y4, 1)} 米时，它的移动速度有多快？`,
      choices: [`${f(Math.sqrt(2 * G * y4))} m/s`, `${f(Math.sqrt(2 * G * Dr.h))} m/s`, `${f(2 * G * (Dr.h - y4), 1)} m/s`, `${f(v4)} m/s`], answer: 3,
      why: `<p>已经掉了${f(Dr.h - y4, 1)}米，丢失的<i>U</i><sub>g</sub>现在是<i>K</i>:</p><div class="eq"><i>mg</i>Δ<i>y</i> = ½<i>mv</i>² &nbsp;⇒&nbsp; <i>v</i> = √(2 × ${f(G)} × ${f(Dr.h - y4, 1)}) = ${f(v4)} m/s</div><p>${f(Math.sqrt(2 * G * y4))} m/s 使用其距地面的高度而不是跌落的距离。</p>` },
  ],
  5: [
    { q: `${f(S.m, 1)} kg 块在 ${f(S.v0, 1)} m/s 处撞击 ${S.k} N/m 弹簧。当块减速到 ${f(v5, 1)} m/s 时，弹簧压缩了多远？`,
      choices: [`${f(x5, 3)} m`, `${f(S.xmax / 2, 3)} m`, `${f(S.m * (S.v0 ** 2 - v5 ** 2) / S.k, 3)} m`, `${f(Math.sqrt(S.m * (S.v0 ** 2 - v5 ** 2) / (2 * S.k)), 3)} m`], answer: 0,
      why: `<div class="eq">½<i>mv</i><sub>0</sub>² = ½<i>mv</i>² + ½<i>k</i>Δ<i>x</i>² &nbsp;⇒&nbsp; Δ<i>x</i> = √(<i>m</i>(<i>v</i><sub>0</sub>² − <i>v</i>²)/<i>k</i>) = √(${f(S.m, 1)} × ${f(S.v0 ** 2 - v5 ** 2, 1)} / ${S.k}) = ${f(x5, 3)} m</div><p>H一半的速度不是压缩的一半：四分之三的动能已经储存，所以Δ<i>x</i>是${f(S.xmax)} m.</p>的√¾` },
    { q: "如果木块进入的速度是原来的两倍，则弹簧的最大压缩量将为",
      choices: ["一样的", "√2倍大", "两倍大", "四倍大"], answer: 2,
      why: "<p>½<i>kx</i><sub>max</sub>² = ½<i>mv</i><sub>0</sub>²，所以<i>x</i><sub>max</sub> = <i>v</i><sub>0</sub>√(<i>m</i>/<i>k</i>)：与<i>v</i><sub>0</sub>。四倍能量，但能量为 <i>x</i>²，因此压缩倍数。</p>" },
  ],
  6: [
    { q: `推入 <i>F</i>(<i>x</i>) = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>)、<i>F</i><sub>0</sub> = ${Pu.F0} N、<i>L</i> = ${f(Pu.L, 1)} m，作用于 ${f(Pu.m, 1)} kg 板条箱休息。它的速度为<i>x</i> = <i>L</i>？`,
      choices: [`${f(Math.sqrt(2 * Pu.F0 * Pu.L / Pu.m))} m/s`, `${f(Math.sqrt(Pu.W / Pu.m))} m/s`, `${f(Math.sqrt(2 * (Pu.F0 / 2) * Pu.L / Pu.m))} m/s`, `${f(v6)} m/s`], answer: 3,
      why: `<p>展开积分：</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>F</i><sub>0</sub>(1 + <i>x</i>/<i>L</i> − 2<i>x</i>²/<i>L</i>²) d<i>x</i> = <i>F</i><sub>0</sub><i>L</i>(1 + ½ − ⅔) = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(Pu.W, 1)} J</div><div class="eq"><i>v</i> = √(2<i>W</i>/<i>m</i>) = √(2 × ${f(Pu.W, 1)} / ${f(Pu.m, 1)}) = ${f(v6)} m/s</div><p>${f(Math.sqrt(2 * Pu.F0 * Pu.L / Pu.m))} m/s 将推送视为稳定 ${Pu.F0} N； ${f(Math.sqrt(2 * (Pu.F0 / 2) * Pu.L / Pu.m))} m/s 仅对两个最终值进行平均，缺少中间的凸起。</p>` },
    { q: `免费回复。求相同的推力在其范围的前半部分（从 <i>x</i> = 0 到 <i>x</i> = <i>L</i>/2）所做的功。是多于还是少于 ${f(Pu.W, 1)} J 总数的一半？为什么？`,
      solution: `<p>展开：<i>F</i> = <i>F</i><sub>0</sub>(1 + <i>x</i>/<i>L</i> − 2<i>x</i>²/<i>L</i>²)。逐项积分：</p><div class="eq"><i>W</i> = <i>F</i><sub>0</sub>[<i>x</i> + <i>x</i>²/2<i>L</i> − 2<i>x</i>³/3<i>L</i>²]<sub>0</sub><sup><i>L</i>/2</sup> = <i>F</i><sub>0</sub><i>L</i>(½ + ⅛ − 1/12) = (13/24)<i>F</i><sub>0</sub><i>L</i></div><div class="eq"><i>W</i> = (13/24) × ${Pu.F0} × ${f(Pu.L, 1)} = ${f(Whalf, 1)} J</div><p>超过${f(Pu.W, 1)} J的一半：推动峰值在<i>x</i> = <i>L</i>/4，因此<i>F</i>(<i>x</i>)下面的区域在前半部分集中，并且后半部分只得到褪色的尾巴。</p>` },
  ],
  7: [
    { q: `${f(Pd.L, 1)} m 弦上的 ${f(Pd.m, 1)} kg 摆锤在 ${Pd.deg0}° 处从静止状态释放。当绳子与垂直方向成 20° 时，它移动的速度有多快？`,
      choices: [`${f(v7)} m/s`, `${f(Math.sqrt(2 * G * Pd.L * (1 - Math.cos(th7))))} m/s`, `${f(vb)} m/s`, `${f(vb / Math.SQRT2)} m/s`], answer: 0,
      why: `<p>仅计算两个角度之间的高度差： Δ<i>y</i> = <i>L</i>(cos 20° − cos ${Pd.deg0}°) = ${f(Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)), 3)} m.</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = √(2 × ${f(G)} × ${f(Pd.L * (Math.cos(th7) - Math.cos(Pd.th0)), 3)}) = ${f(v7)} m/s</div><p>${f(Math.sqrt(2 * G * Pd.L * (1 - Math.cos(th7))))} m/s 使用距底部 20° 的高度，而不是 ${Pd.deg0}° 的落差。一半的角度不是一半的能量。</p>` },
    { q: "当鲍勃经过最低点时，绳子的张力是多少？",
      choices: [`${f(Pd.m * G * Math.cos(Pd.th0))} N`, `${f(Pd.m * G)} N`, `${f(Tb)} N`, `${f(Pd.m * G - Pd.m * vb ** 2 / Pd.L)} N`], answer: 2,
      why: `<p> 在底部，鲍勃在 <i>v</i> = ${f(vb)} m/s 处沿圆周运动，因此合力向上指向枢轴：</p><div class="eq"><i>T</i> − <i>mg</i> = <i>mv</i>²/<i>L</i> &nbsp;⇒&nbsp; <i>T</i> = ${f(Pd.m * G)} + ${f(Pd.m * vb ** 2 / Pd.L)} = ${f(Tb)} N</div><p><i>T</i> = <i>mg</i> 仅当鲍勃在那里静止时才是正确的。</p>` },
  ],
  8: [
    { q: "粒子沿 <i>x</i> 移动，势能为 <i>U</i>(<i>x</i>) = 3<i>x</i>² − 2<i>x</i>³（<i>U</i> 单位为 J，<i>x</i> 单位为 m）。 <i>x</i> = 2.0 m 时作用在其上的力是多少？",
      choices: [`${f(-U8(x8), 1)} N`, `${f(-F8(x8), 1)} N`, `${f(U8(x8), 1)} N`, `+${f(F8(x8), 1)} N`], answer: 3,
      why: `<div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i> = −(6<i>x</i> − 6<i>x</i>²) = −(12 − 24) = +${f(F8(x8), 1)} N</div><p><i>U</i> 的斜率为负（<i>U</i> 向+<i>x</i> 方向下降），因此力点在+<i>x</i>：下坡。 −${f(F8(x8), 1)} N 忘记减号； ±${f(-U8(x8), 1)} N 使用 <i>U</i> 本身，而不是其斜率。</p>` },
    { q: "对于相同的 <i>U</i>(<i>x</i>) = 3<i>x</i>² − 2<i>x</i>³，粒子可以在 <i>x</i> = 0 和 <i>x</i> = 1 m 处达到平衡。哪个是哪个？",
      choices: ["都稳定", "<i>x</i> = 0 不稳定，<i>x</i> = 1 m 稳定", "<i>x</i> = 0 稳定，<i>x</i> = 1 m 不稳定", "都不稳定"], answer: 2,
      why: "<p>d<i>U</i>/d<i>x</i> = 6<i>x</i> − 6<i>x</i>² = 0 at <i>x</i> = 0 和 1。二阶导数决定： <i>U</i>″ = 6 − 12<i>x</i> is +6 at <i>x</i> = 0（谷，稳定）和−6 <i>x</i> = 1 m（驼峰，不稳定）。</p>" },
  ],
  9: [
    { q: `免费回复。对于键，<i>U</i>(<i>r</i>) = ε[(<i>r</i><sub>0</sub>/<i>r</i>)12− 2(<i>r</i><sub>0</sub>/<i>r</i>)⁶] 其中 ε = ${f(B.eps / M.EV, 1)} eV 且 <i>r</i><sub>0</sub> = ${f(B.r0 * 1e9)}纳米。证明<i>r</i><sub>0</sub>是平衡状态，求弹簧常数<i>k</i> = <i>U</i>″(<i>r</i><sub>0</sub>)，以及弹簧小振动的周期${f(B.m / M.AMU, 1)} u原子。`,
      solution: `<p>微分：</p><div class="eq"><i>U</i>′ = ε[−12<i>r</i><sub>0</sub>¹²/<i>r</i>¹³ + 12<i>r</i><sub>0</sub>⁶/<i>r</i>⁷]</div><p>At <i>r</i> = <i>r</i><sub>0</sub> 括号给出 −12/<i>r</i><sub>0</sub> + 12/<i>r</i><sub>0</sub> = 0：无力，平衡。</p><div class="eq"><i>U</i>″ = ε[156<i>r</i><sub>0</sub>¹²/<i>r</i>¹⁴ − 84<i>r</i><sub>0</sub>⁶/<i>r</i>⁸] &nbsp;⇒&nbsp; <i>U</i>″(<i>r</i><sub>0</sub>) = 72ε/<i>r</i><sub>0</sub>²</div><p>为正，所以稳定的最小值。其中 ε = ${B.eps.toExponential(3).replace('e-', '×10<sup>−')}</sup> J 和 <i>r</i><sub>0</sub> = ${f(B.r0 * 1e9)}×10<sup>−9</sup> m:</p><div class="eq"><i>k</i> = 72 × ${f(B.eps * 1e19, 3)}×10<sup>−19</sup> / (${f(B.r0 * 1e9)}×10<sup>−9</sup>)² = ${f(kB, 0)} N/m</div><div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${f(B.m * 1e27, 3)}×10<sup>−27</sup> / ${f(kB, 0)}) = ${f(TB * 1e15, 1)} fs</div>` },
    { q: "势阱中的粒子在边缘以下的总能量为 <i>E</i>。在任何一个转折点，",
      choices: ["它的速度为零并且其上的力为零", "它的速度最大而力为零", "它的势能为零", "它的速度为零，力指向井中"], answer: 3,
      why: "<p> 在转折点 <i>U</i> = <i>E</i>，因此 <i>K</i> = 0 并且粒子停止。但 <i>U</i> 在那里是倾斜的（它是井壁，而不是底部），因此 <i>F</i> = −d<i>U</i>/d<i>x</i> ≠ 0 并且指向下坡，回到最小值。这就是它转身的原因。</p>" },
  ],
  10: [
    { q: `该块现在滑到 ${f(v10, 1)} m/s 处的同一楼层（μ<sub>k</sub> = ${f(Sl.mu)}），而不是 ${f(Sl.v0, 1)} m/s。它能滑多远？`,
      choices: [`${f(2 * Sl.d)} m`, `${f(d10)} m`, `${f(Sl.d)} m`, `${f(v10 ** 2 / (Sl.mu * G), 1)} m`], answer: 1,
      why: `<div class="eq">½<i>mv</i><sub>0</sub>² = μ<sub>k</sub><i>mgd</i> &nbsp;⇒&nbsp; <i>d</i> = <i>v</i><sub>0</sub>²/(2μ<sub>k</sub><i>g</i>) = ${f(v10, 1)}² / (2 × ${f(Sl.mu)} × ${f(G)}) = ${f(d10)} m</div><p>两倍的速度，四倍的动能，四倍的距离（之前滑过${f(Sl.d)}米）。 ${f(2 * Sl.d)} m 将其加倍，就好像 <i>d</i> ∝ <i>v</i>.</p>` },
    { q: `回到${f(Sl.v0, 1)} m/s（${f(Sl.E, 1)}动能J）：${f(x10, 1)}第一个滑动米后，摩擦产生了多少热能？`,
      choices: [`${f(Sl.E / 2)} J`, `${f(Sl.mu * G * x10)} J`, `${f(Q10)} J`, `${f(Sl.E)} J`], answer: 2,
      why: `<div class="eq"><i>E</i><sub>th</sub> = <i>f</i><i>d</i> = μ<sub>k</sub><i>mg</i> × <i>d</i> = ${f(Sl.mu)} × ${f(Sl.m, 1)} × ${f(G)} × ${f(x10, 1)} = ${f(Q10)} J</div><p> 该块仍然有 <i>K</i> 的 ${f(Sl.E - Q10)} J。 ${f(Sl.mu * G * x10)} J 省略质量。</p>` },
  ],
  11: [
    { q: `一名 ${m11} kg 的学生以稳定的速度跑上 ${f(t11, 1)} 的 ${f(h11, 1)} 米高的楼梯。她举起自己时的平均力量是多少？`,
      choices: [`${f(m11 * h11 / t11, 1)} W`, `${f(P11, 0)} W`, `${f(m11 * G * h11, 0)} W`, `${f(m11 * G * h11 * t11, 0)} W`], answer: 1,
      why: `<div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>mgh</i>/<i>t</i> = ${m11} × ${f(G)} × ${f(h11, 1)} / ${f(t11, 1)} = ${f(P11, 0)} W</div><p>${f(m11 * G * h11, 0)} 是以焦耳为单位的功，而不是功率； ${f(m11 * h11 / t11, 1)} W 使用质量而不是重力。</p>` },
    { q: "起重机以稳定的 0.5 m/s 将板条箱提升至高度 <i>h</i>，然后以稳定的 1.0 m/s 将相同的板条箱提升至相同高度。与慢速电梯相比，快速电梯需要",
      choices: ["双倍的工作和双倍的功率", "同样的工作，同样的力量", "相同的工作和两倍的功率", "一半的工作和两倍的功率"], answer: 2,
      why: "<p> 在稳定的速度下，电缆以任意方式拉动 <i>mg</i>，因此 <i>mgh</i> 的工作原理是相同的。快速提升需要一半的时间，因此 <i>P</i> = <i>W</i>/<i>t</i> = <i>Fv</i> 加倍。</p>" },
  ],
};
