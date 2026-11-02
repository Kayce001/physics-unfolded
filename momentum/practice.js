// momentum/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);   // signed, for velocities on a track

// 0 · the ball and the cart; a ball bouncing back
const Bl = M.BALL, Ct = M.CART, vb = 3.0, dp0 = Bl.m * (Bl.v + vb);
// 1 · the wall pulse
const Wl = M.WALL;
// 2 · the egg on the floor
const Eg = M.EGG, Fhard = Eg.J / Eg.tauHard;
// 3–5 · the carts
const S = M.STICK, Bo = M.BOUNCE, X = M.BURST;
const K0s = M.ke(S.m1, S.u1) + M.ke(S.m2, S.u2), K1s = M.ke(S.m1 + S.m2, S.v1);
// 6 · the ballistic pendulum
const Pd = M.PEND, Kclay = M.ke(Pd.m, Pd.u), Kafter = M.ke(Pd.m + Pd.M, Pd.v);
// 7 · the crash
const Cr = M.CRASH;
// 8 · the shell
const Sh = M.SHELL;
// 9 · rods (Physics C): λ = λ0 x/L, and λ = λ0 x²/L²
const Rd = M.ROD, xq = 3 * Rd.L / 4, Mq = Rd.lam0 * Rd.L / 3;
// 10 · plates (Physics C)
const Tr = M.TRI, Se = M.SEMI;
// 11 · the L and the holed square (Physics C)
const Ll = M.ELL, Ho = M.HOLE;

export const PRACTICE = {
  0: [
    { q: `的 ${f(Bl.m, 1)} 千克球和 ${f(Ct.m, 1)} 公斤车有相同的动量。小球的动能与小车的动能之比是多少？`,
      choices: [f(1, 1), f(Bl.m / Ct.m), f(Ct.m / Bl.m, 1), f(Math.sqrt(Ct.m / Bl.m), 1)], answer: 2,
      why: `<p>与相同的 <i>p</i>, <i>K</i> = <i>p</i>²/2<i>m</i>, so <i>K</i><sub>球</sub>/<i>K</i><sub>购物车</sub> = <i>m</i><sub>购物车</sub>/<i>m</i><sub>球</sub> = ${f(Ct.m, 1)}/${f(Bl.m, 1)} = ${f(Ct.m / Bl.m, 1)}。检查： ${f(M.ke(Bl.m, Bl.v), 1)} J 反对 ${f(M.ke(Ct.m, Ct.v), 1)} J. 动量相等并不意味着能量相等。</p>` },
    { q: `的 ${f(Bl.m, 1)} 公斤球向东移动 ${f(Bl.v, 1)} m/s 向西反弹 ${f(vb, 1)} 多发性硬化症。其动量变化的幅度是多少？`,
      choices: [f(Bl.m * (Bl.v - vb)) + ' kg·m/s', f(Bl.m * Bl.v) + ' kg·m/s', f(dp0) + ' kg·m/s', f(Bl.v + vb) + ' kg·m/s'], answer: 2,
      why: `<p>以东为+。 Δ<i>p</i> = <i>m</i>(<i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>) = ${f(Bl.m, 1)} × (−${f(vb, 1)} − ${f(Bl.v, 1)}) = −${f(dp0)} kg·m/s, so |Δ<i>p</i>| = ${f(dp0)} 千克·米/秒。减去速度（${f(Bl.m * (Bl.v - vb))}）忽略速度反转。</p>` },
  ],
  1: [
    { q: `墙倒转了 ${f(Wl.m, 1)} kg 球的速度从 +${f(Wl.v, 1)} m/s to −${f(Wl.v, 1)} m/s in ${f(Wl.tau)} s。球上的平均力的大小是多少？`,
      choices: [`${f(Wl.m * Wl.v / Wl.tau, 1)} N`, `${f(Wl.J / Wl.tau, 1)} N`, `${f(Wl.J * Wl.tau, 2)} N`, `${f(Wl.Fpk, 1)} N`], answer: 1,
      why: `<div class="eq"><i>F</i><sub>avg</sub> = |Δ<i>p</i>|/Δ<i>t</i> = 2<i>mv</i>/Δ<i>t</i> = ${f(Wl.J, 1)} / ${f(Wl.tau)} = ${f(Wl.J / Wl.tau, 1)} N</div><p>${f(Wl.m * Wl.v / Wl.tau, 1)} N 只停球；它也必须回来。 ${f(Wl.Fpk, 1)} N 是脉冲的峰值，而不是其平均值。</p>` },
    { q: `墙的力为 <i>F</i>(<i>t</i>) = <i>F</i><sub>pk</sub> 正弦(π<i>t</i>/τ) 对于 0 ≤ <i>t</i> ≤ τ，其中 <i>F</i><sub>pk</sub> = ${f(Wl.Fpk, 1)} N 和 τ = ${f(Wl.tau)} s。它给球带来什么推动力？`,
      choices: [`${f(Wl.Fpk * Wl.tau / 2)} N·s`, `${f(Wl.Fpk * Wl.tau)} N·s`, `${f(Wl.Fpk * Wl.tau / Math.PI)} N·s`, `${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s`], answer: 3,
      why: `<div class="eq"><i>J</i> = ∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = <i>F</i><sub>pk</sub>(τ/π)[−cos(π<i>t</i>/τ)]<sub>0</sub><sup>τ</sup> = 2<i>F</i><sub>pk</sub>τ/π = ${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s</div><p>它匹配 2<i>mv</i> = ${f(Wl.J)} N·s. <i>F</i><sub>pk</sub>τ 将峰值视为持续整个时间； <i>F</i><sub>pk</sub>τ/2 是三角形的面积，而不是正弦弧形的面积。</p>` },
  ],
  2: [
    { q: `的 ${f(Eg.m, 3)} 公斤鸡蛋落在地板上 ${f(Eg.v0, 1)} m/s 并停止于 ${f(Eg.tauHard)} s 无弹跳。其上的平均合力的大小是多少？`,
      choices: [`${f(Fhard)} N`, `${f(2 * Fhard, 1)} N`, `${f(Eg.J, 3)} N`, `${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>net</sub>Δ<i>t</i> = Δ<i>p</i> &nbsp;⇒&nbsp; <i>F</i><sub>net</sub> = <i>mv</i>/Δ<i>t</i> = ${f(Eg.J, 3)} / ${f(Eg.tauHard)} = ${f(Fhard)} N</div><p>它停止时没有弹跳，所以 Δ<i>p</i> = <i>mv</i>，不是 2<i>mv</i>. ${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N 将能量除以时间（即幂）。</p>` },
    { q: "与落在地板上相比，落在枕头上会产生鸡蛋",
      choices: ["较小的冲量和较小的平均力", "较长时间内较大的冲量", "较长时间内相同的平均力", "相同的冲量和较小的平均力"], answer: 3,
      why: "<p>E 无论哪种方式，鸡蛋从 <i>v</i> 到 0，因此冲量 Δ<i>p</i> 是相同的。枕头拉伸 Δ<i>t</i>，因此 <i>F</i> = Δ<i>p</i>/Δ<i>t</i> 较小。</p>" },
  ],
  3: [
    { q: `向右取+。 ${sg(S.u1, 1)} m/s 处的 ${f(S.m1, 1)} 公斤车和 ${sg(S.u2, 1)} m/s 处的 ${f(S.m2, 1)} 公斤车发生碰撞并粘住。他们之后的速度？`,
      choices: [`${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s`, `${sg((S.u1 + S.u2) / 2)} m/s`, `${sg(S.v1)} m/s`, `${sg(S.m1 * S.u1 + S.m2 * S.u2)} m/s`], answer: 2,
      why: `<div class="eq"><i>v</i>′ = (<i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂)/(<i>m</i>₁ + <i>m</i>₂) = (${f(S.m1 * S.u1, 1)} − ${f(-S.m2 * S.u2, 1)})/${f(S.m1 + S.m2, 1)} = ${sg(S.v1)} m/s</div><p>第二辆小车向左移动，因此其动量为负：将其添加为 +${f(-S.m2 * S.u2, 1)} 得出${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s。平均速度忽略质量。</p>` },
    { q: "碰撞中损失了多少动能？",
      choices: [`${f(K1s)} J`, `${f(K0s)} J`, '0 J', `${f(K0s - K1s)} J`], answer: 3,
      why: `<p> 之前： ½(${f(S.m1, 1)})(${f(S.u1, 1)})² + ½(${f(S.m2, 1)})(${f(S.u2, 1)})² = ${f(K0s)} J. 之后： ½(${f(S.m1 + S.m2, 1)})(${f(S.v1, 1)})² = ${f(K1s)} J。丢失：${f(K0s - K1s)} J，加热、声音和凹痕。动量守恒；动能则不然。</p>` },
  ],
  4: [
    { q: `向右取+。 ${f(Bo.m1, 1)} 公斤车在 ${sg(Bo.u1, 1)} m/s 处弹性地撞击静止的 ${f(Bo.m2, 1)} 公斤车。 ${f(Bo.m1, 1)} kg 小车之后的速度是多少？`,
      choices: [`${sg(-Bo.v1)} m/s`, `${sg(Bo.v1)} m/s`, `${f(0)} m/s`, `${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s`], answer: 1,
      why: `<p>在弹性碰撞中，相对速度反转：<i>v</i>2′ - <i>v</i>₁′ = ${f(Bo.u1, 1)} m/s。有了动量，${f(Bo.m1, 1)} × ${f(Bo.u1, 1)} = ${f(Bo.m1, 1)}<i>v</i>₁′ + ${f(Bo.m2, 1)}<i>v</i>2′:</p><div class="eq"><i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = ${sg(Bo.v1)} m/s, &nbsp; <i>v</i>₂′ = ${sg(Bo.v2)} m/s</div><p>打火机车弹回来。 ${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s 是固定答案。</p>` },
    { q: "相反，如果移动的小车弹性地撞击静止的相同小车，那么之后",
      choices: ["两者都以一半的速度前进", "第一个停止，第二个以第一个的速度离开", "第一个以原来的速度反弹", "都停止"], answer: 1,
      why: "<p>与 <i>m</i>₁ = <i>m</i>2, <i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>2)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>2) = 0 且 <i>v</i>2′ = <i>v</i>1。以一半的速度一起前进会保存动量，但会损失一半的动能，因此没有弹性。</p>" },
  ],
  5: [
    { q: `${f(X.m1, 1)} 公斤车和 ${f(X.m2, 1)} 公斤车之间的弹簧（两者均处于静止状态）会释放 ${f(X.Q, 1)} J。${f(X.m2, 1)} 公斤车移动的速度有多快？`,
      choices: [`${f(-X.v1)} m/s`, `${f(Math.sqrt(2 * X.Q / X.m2))} m/s`, `${f(Math.sqrt(2 * X.Q / (X.m1 + X.m2)))} m/s`, `${f(X.v2)} m/s`], answer: 3,
      why: `<p>动量保持为零：<i>m</i>₁<i>v</i>₁′ = −<i>m</i>2<i>v</i>2′，因此 ${f(X.m1, 1)} 公斤车的速度是 ${f(X.m2 / X.m1, 0)} 倍。能量： ½<i>m</i>₁(${f(X.m2 / X.m1, 0)}<i>v</i>)² + ½<i>m</i>2<i>v</i>² = ${f(X.Q, 1)} J 给出 <i>v</i> = ${f(X.v2)} m/s（以及用于轻型推车的 ${f(-X.v1)} m/s）。</p><p>${f(Math.sqrt(2 * X.Q / X.m2))} m/s 将所有能量提供给一辆推车，这将打破动量守恒。</p>` },
    { q: `在那次爆炸中，${f(X.m1, 1)} 公斤车的动能除以 ${f(X.m2, 1)} 公斤车的动能是多少？`,
      choices: [f(X.m1 / X.m2), f(1, 1), f(X.m2 / X.m1, 1), f((X.m2 / X.m1) ** 2, 1)], answer: 2,
      why: `<p>E 动量大小相等且方向相反，且 <i>K</i> = <i>p</i>²/2<i>m</i>，因此比率为 <i>m</i>2/<i>m</i>₁ = ${f(X.m2 / X.m1, 1)}: ${f(M.ke(X.m1, X.v1), 1)} J 与${f(M.ke(X.m2, X.v2), 1)} J.轻车消耗了弹簧的大部分能量。</p>` },
  ],
  6: [
    { q: `${f(Pd.m, 1)} kg 粘土位于 ${f(Pd.u, 0)} m/s 处，粘在 ${f(Pd.M, 1)} kg 块中。木块摆动的高度是多少？`,
      choices: [`${f(Pd.dy * 100, 1)} cm`, `${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm`, `${f(Pd.v ** 2 / G * 100, 1)} cm`, `${f(Pd.u ** 2 / (2 * G) * 100, 0)} cm`], answer: 0,
      why: `<p>命中：动量，<i>v</i>′ = <i>mu</i>/(<i>m</i> + <i>M</i>) = ${f(Pd.m * Pd.u, 1)}/${f(Pd.m + Pd.M, 1)} = ${f(Pd.v, 3)} m/s。挥杆：能量，Δ<i>y</i> = <i>v</i>′²/2<i>g</i> = ${f(Pd.dy * 100, 1)} cm。</p><p>${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm 假设粘土的动能在击中后仍存在；当粘土粘住时，大部分都会丢失。</p>` },
    { q: "粘土的动能在撞击中损失了多少？",
      choices: [`${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%`, '0%', `${f(100 * (1 - Kafter / Kclay), 1)}%`, '50.0%'], answer: 2,
      why: `<p> 之前： ½(${f(Pd.m, 1)})(${f(Pd.u, 0)})² = ${f(Kclay, 1)} J。之后：½(${f(Pd.m + Pd.M, 1)})(${f(Pd.v, 3)})² = ${f(Kafter)} J。保留： <i>m</i>/(<i>m</i> + <i>M</i>) = ${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%，所以 ${f(100 * (1 - Kafter / Kclay), 1)}% 丢失。</p>` },
  ],
  7: [
    { q: `${Cr.m1}公斤车（${f(Cr.v1, 0)} m/s东）和${Cr.m2}公斤卡车（${f(Cr.v2, 0)} m/s北）锁在一起。沉船刚刚移动的速度有多快？`,
      choices: [`${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s`, `${f(Cr.v)} m/s`, `${f((Cr.v1 + Cr.v2) / 2, 1)} m/s`, `${f(Math.hypot(Cr.v1, Cr.v2), 1)} m/s`], answer: 1,
      why: `<p>各方向分别为：<i>v</i>′<sub>x</sub> = ${Cr.px}/${Cr.m1 + Cr.m2} = ${f(Cr.vx)} m/s， <i>v</i>′<sub>y</sub> = ${Cr.py}/${Cr.m1 + Cr.m2} = ${f(Cr.vy)} m/s.</p><div class="eq"><i>v</i>′ = √(${f(Cr.vx)}² + ${f(Cr.vy)}²) = ${f(Cr.v)} m/s</div><p>${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s 添加动量，就好像它们指向相同一样方式.</p>` },
    { q: "沉船向什么方向移动？",
      choices: [`${f(90 - Cr.angle, 1)}° 东偏北`, `${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}° 东偏北`, `${f(Math.atan2(Cr.v1, Cr.v2) * 180 / Math.PI, 1)}° 东偏北`, `${f(Cr.angle, 1)}° 东偏北`], answer: 3,
      why: `<div class="eq">tan θ = <i>p</i><sub>y</sub>/<i>p</i><sub>x</sub> = ${Cr.py}/${Cr.px} &nbsp;⇒&nbsp; θ = ${f(Cr.angle, 1)}° north of east</div><p> 使用动量，而不是速度：慢速卡车的重量是其八倍，因此它获胜。 ${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}°使用速度。</p>` },
  ],
  8: [
    { q: `外壳（${f(Sh.v0, 0)} m/s at ${Sh.deg}°，射程 <i>R</i> = ${f(Sh.R)} m 未爆裂）在顶部分成相等的两半；后半部分直接落下。前半部分着地在哪里？`,
      choices: [`${f(Sh.R / 2)} m`, `${f(Sh.R)} m`, `${f(1.5 * Sh.R)} m`, `${f(2 * Sh.R)} m`], answer: 2,
      why: `<p>的质心仍然落在<i>R</i>，就好像什么也没发生一样。后半部分落在 <i>R</i>/2 = ${f(Sh.R / 2)} m 处，且两半相等，因此前半部分落在 <i>R</i> 之外： <i>x</i> = 2<i>R</i> − <i>R</i>/2 = 3<i>R</i>/2 = ${f(1.5 * Sh.R)} m.</p><p>直接：在2<i>v</i><sub>x</sub>处离开顶部并同时下降，因此覆盖了剩余<i>R</i>/2.</p>的两倍` },
    { q: "在爆炸和第一块落地之间，系统质心的加速度为",
      choices: ["零", "<i>g</i>，向下", "2<i>g</i>，向下", "向前，从爆发"], answer: 1,
      why: "<p>爆裂力是内部的，成对抵消。唯一的外力仍然是总重力<i>Mg</i>，所以<i>a</i><sub>cm</sub> = <i>g</i>向下，与爆裂前一模一样。</p>" },
  ],
  9: [
    { q: `从 <i>x</i> = 0 到 <i>L</i> = ${f(Rd.L, 1)} m 的杆具有 λ(<i>x</i>) = λ<sub>0</sub><i>x</i>/<i>L</i>。它的质心在哪里？`,
      choices: [`<i>x</i> = ${f(Rd.L / 2)} m`, `<i>x</i> = ${f(Rd.L / 3, 3)} m`, `<i>x</i> = ${f(Rd.xN)} m`, `<i>x</i> = ${f(3 * Rd.L / 4)} m`], answer: 2,
      why: `<div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>/2, &nbsp; ∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/3)/(λ<sub>0</sub><i>L</i>/2) = 2<i>L</i>/3 = ${f(Rd.xN)} m</div><p>朝密端。 <i>L</i>/3从错误的一端开始测量； <i>L</i>/2忽略密度。</p>` },
    { q: `免费回复。从 <i>x</i> = 0 到 <i>L</i> = ${f(Rd.L, 1)} m 的杆具有 λ(<i>x</i>) = λ<sub>0</sub><i>x</i>²/<i>L</i>²， λ<sub>0</sub> = ${f(Rd.lam0, 1)} 千克/米。找到它的质量和质心。`,
      solution: `<p>将其切片为 d<i>m</i> = λ d<i>x</i>:</p><div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>/3 = ${f(Rd.lam0, 1)} × ${f(Rd.L, 1)}/3 = ${f(Mq)} kg</div><div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>³/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>²/4</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/4)/(λ<sub>0</sub><i>L</i>/3) = 3<i>L</i>/4 = ${f(xq)} m</div><p>比线性杆的2<i>L</i>/3更靠近密集端，因为它应该是：更多的质量靠近<i>x</i> = <i>L</i>.</p>` },
  ],
  10: [
    { q: `均匀的半圆板，半径为 <i>R</i> = ${f(Se.R, 1)} m。它的质心距直尺有多远？`,
      choices: [`${f(Se.R / 2, 3)} m`, `${f(2 * Se.R / Math.PI, 3)} m`, `${f(Se.R / 3, 3)} m`, `${f(Se.ucm, 3)} m`], answer: 3,
      why: `<p>条带平行于直径，宽度2√(<i>R</i>² − <i>u</i>²):</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> / (π<i>R</i>²/2) = (2<i>R</i>³/3)/(π<i>R</i>²/2) = 4<i>R</i>/3π = ${f(Se.ucm, 3)} m</div><p><i>R</i>/2忽略了条带远离边缘变窄的情况； 2<i>R</i>/π = ${f(2 * Se.R / Math.PI, 3)} m 适用于细半圆线，其质量全部在边缘。</p>` },
    { q: `均匀的三角形板距底面高度 <i>h</i> = ${f(Tr.h, 1)} m。它的质心距离底座有多远？`,
      choices: [`${f(Tr.h / 2, 3)} m`, `${f(Tr.ucm, 3)} m`, `${f(2 * Tr.h / 3, 3)} m`, `${f(Tr.h / 4, 3)} m`], answer: 1,
      why: `<p> 与底座平行的条带宽度为 <i>w</i> = <i>b</i>(1 − <i>u</i>/<i>h</i>)：底座宽，底座为零顶点.</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>h</i></sup> <i>u</i>·<i>b</i>(1 − <i>u</i>/<i>h</i>) d<i>u</i> / (<i>bh</i>/2) = (<i>bh</i>²/6)/(<i>bh</i>/2) = <i>h</i>/3 = ${f(Tr.ucm, 3)} m</div><p>2<i>h</i>/3 是距顶点的距离。</p>` },
  ],
  11: [
    { q: `L：A臂，${f(Ll.pA.m)} kg，中心为<i>x</i> = ${f(Ll.pA.c[0])} m； B 臂，${f(Ll.pB.m)} kg，中心位于 <i>x</i> = ${f(Ll.pB.c[0])} m。 L的<i>x</i><sub>cm</sub>是什么？`,
      choices: [`${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m`, `${f(Ll.pA.c[0], 3)} m`, `${f((Ll.pB.m * Ll.pA.c[0] + Ll.pA.m * Ll.pB.c[0]) / Ll.M, 3)} m`, `${f(Ll.cm[0], 3)} m`], answer: 3,
      why: `<div class="eq"><i>x</i><sub>cm</sub> = (${f(Ll.pA.m)} × ${f(Ll.pA.c[0])} + ${f(Ll.pB.m)} × ${f(Ll.pB.c[0])})/${f(Ll.M)} = ${f(Ll.cm[0], 3)} m</div><p>通过每个中心自身的质量来加权。 ${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m 是中心的简单平均值，仅适用于相等质量。</p>` },
    { q: `免费回复。从 <i>x</i><sub>cm</sub> = (1/<i>M</i>)∫<i>x</i> d<i>m</i> 开始，证明将孔视为负质量。然后找到 ${f(Ho.s, 1)} m 正方形（σ = ${f(M.SIGMA, 1)} kg/m²，以原点为中心）的 <i>x</i><sub>cm</sub>，其中心为 <i>x</i> = 半径为 ${f(Ho.r, 1)} m 的孔${f(Ho.c[0])} 米`,
      solution: `<p> 区域上的积分会分裂其部分。盘子是完整的正方形减去盘子，所以</p><div class="eq">∫<sub>plate</sub> <i>x</i> d<i>m</i> = ∫<sub>square</sub> <i>x</i> d<i>m</i> − ∫<sub>disc</sub> <i>x</i> d<i>m</i> = <i>m</i><sub>full</sub><i>x</i><sub>full</sub> − <i>m</i><sub>plug</sub><i>x</i><sub>plug</sub></div><p>同样<i>M</i> = <i>m</i><sub>full</sub> − <i>m</i><sub>plug</sub>：孔完全像质量一样进入 -<i>m</i><sub>plug</sub>中心.</p><p><i>m</i><sub>full</sub> = σ<i>s</i>² = ${f(Ho.mFull)} kg 在<i>x</i> = 0; <i>m</i><sub>plug</sub> = σπ<i>r</i>² = ${f(Ho.mPlug, 3)} kg，<i>x</i> = ${f(Ho.c[0])} m； <i>M</i> = ${f(Ho.M, 3)} kg.</p><div class="eq"><i>x</i><sub>cm</sub> = (0 − ${f(Ho.mPlug, 3)} × ${f(Ho.c[0])})/${f(Ho.M, 3)} = ${f(Ho.cm[0] * 100)} cm</div><p>负：质心远离孔。</p>` },
  ],
};
