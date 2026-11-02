// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180), tan = d => Math.tan(d * Math.PI / 180);
const W = M.WHEEL, DS = M.DISC, DR = M.DOOR, PL = M.PLANK, LD = M.LADDER, SH = M.SHAPES, RD = M.ROD, WR = M.WRENCH, B = M.BOWL, WL = M.WELL, IM = M.IMP, SK = M.SKATE, HT = M.HIT;

// 0 · turns while speeding up
const Q0 = { th: 0.5 * W.alpha * W.tUp ** 2 };
Q0.rev = Q0.th / (2 * Math.PI);
// 1 · the edge rider at 1.6 s
const Q1 = { t: 1.6 };
Q1.p = M.pointAt(DS.r2, M.disc(Q1.t));
// 2 · the handle push at 30°, and α from the square push
const Q2 = { phi: 30 };
Q2.tau = M.torque(DR.cases[0].r, DR.F, Q2.phi);
Q2.alpha = DR.cases[0].tau / DR.I;
// 3 · crate 1.0 m from A
const Q3 = { x: 1.0 };
Q3.q = M.plank(Q3.x);
// 4 · ladder at 60°
const Q4 = { th: 60 };
Q4.f = M.ladder(Q4.th * Math.PI / 180).f;
// 5 · the disc after 2.0 s
const Q5 = { t: 2.0, disc: SH.list[1] };
Q5.w = Q5.disc.alpha * Q5.t;
// 6 · a rod whose density grows from one end, λ = Cx: I = ½ML²; an annulus R/2 → R: ⅝MR²
const Q6 = { I: 0.5 * RD.M * RD.L ** 2, Iann: 5 / 8 * SH.M * SH.R ** 2 };
// 7 · rod axis 0.30 m from one end; the end-pinned rod released from horizontal
const Q7 = { e: 0.30 };
Q7.d = RD.L / 2 - Q7.e;
Q7.I = RD.Icm + RD.M * Q7.d ** 2;
Q7.wBot = Math.sqrt(3 * G / RD.L);
// 8 · one 120° stroke
const Q8 = { W: WR.tau * WR.stroke };
// 9 · the disc at the bottom; h from the ramp
const Q9 = { h: M.RACE.h };
Q9.v = Math.sqrt(2 * G * Q9.h / 1.5);
// 10 · the bowling ball
const Q10 = { vf: 5 * B.v0 / 7, xStar: 12 * B.v0 ** 2 / (49 * B.muK * G) };
// 11 · bucket after the full 2.0 m
const Q11 = { v: Math.sqrt(2 * WL.a * WL.h) };
// 12 · a 100 N rim push for 0.90 s; a triangular torque pulse
const Q12 = { F: 100, dt: 0.9, peak: 200, T: 1.2 };
Q12.w = Q12.F * IM.R * Q12.dt / IM.I;
Q12.J = 0.5 * Q12.peak * Q12.T;
// 13 · the skater
const Q13 = { I0: M.inertia(SK.rOut), I1: M.inertia(SK.rIn) };
Q13.w = Q13.I0 * SK.w0 / Q13.I1;
Q13.wNoBody = (2 * SK.m * SK.rOut ** 2) * SK.w0 / (2 * SK.m * SK.rIn ** 2);
// 14 · the ball sticks to the rod; a ball dropped beside O
const Q14 = { w: HT.m * HT.v0 * HT.d / (HT.I + HT.m * HT.d ** 2), dLdt: HT.m * G * HT.d };

const eq = s => `<div class="eq">${s}</div>`;

export const PRACTICE = {
  0: [
    { q: `车轮从静止开始，并以 ${f(W.alpha, 1)} rad/s² 加速，持续 ${f(W.tUp, 1)} s。在那段时间里它进行了多少次革命？`,
      choices: [`${p3(Q0.th / Math.PI)} 版`, `${p3(Q0.th)} 版`, `${p3(Q0.rev)} 版`, `${p3(Q0.th * 2 * Math.PI)} 版`], answer: 2,
      why: `<p> 静止状态下的常数 α：Δθ = ½αt²，以弧度为单位。然后除以每转 2π 弧度。</p>${eq(`Δθ = ½ × ${f(W.alpha, 1)} × ${f(W.tUp, 1)}² = ${f(Q0.th)} rad = ${f(Q0.th)} / 2π = ${p3(Q0.rev)} rev`)}<p>${p3(Q0.th)} rev 忘记了 ½αt² 以弧度表示； ${p3(Q0.th / Math.PI)} 转速下降 ½.</p>` },
    { q: "逆时针方向为正。制动时车轮逆时针转动。 ω 和 α 的符号为",
      choices: ['ω > 0, α > 0', 'ω < 0, α < 0', 'ω < 0, α > 0', 'ω > 0, α < 0'], answer: 3,
      why: "<p>它逆时针转动，所以ω > 0。它正在减速，所以α指向ω：α < 0. The sign of ω gives the direction of turning; α only tells you which way ω is changing.</p>" },
  ],
  1: [
    { q: `旋转木马以稳定的 ω 转动。 ${DS.r2} m处的骑手的向心加速度是${DS.r1} m处的骑手的多少倍？`,
      choices: ["1（相同的ω，相同的加速度）", '4', '2', '½'], answer: 2,
      why: "<p>均共享ω，且<i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω²。在固定 ω 下，它与 <i>r</i> 成正比：半径的两倍，加速度的两倍。</p><p>4 来自 <i>v</i>²/<i>r</i>，其中 <i>v</i> 加倍，但 <i>r</i> 被遗忘在分母.</p>" },
    { q: `行驶从静止加速到 α = ${f(DS.alpha, 1)} rad/s²。当 <i>t</i> = ${f(Q1.t, 1)} s 时，骑手在 ${DS.r2} m 处的总加速度大小是多少？`,
      choices: [`${p3(Q1.p.at)} m/s²`, `${p3(Q1.p.ac)} m/s²`, `${p3(Q1.p.a)} m/s²`, `${p3(Q1.p.at + Q1.p.ac)} m/s²`], answer: 2,
      why: `<p>ω = αt = ${f(DS.alpha * Q1.t)} rad/s。两个垂直部分：</p>${eq(`<i>a</i><sub>t</sub> = rα = ${f(Q1.p.at)} m/s², <i>a</i><sub>c</sub> = rω² = ${f(Q1.p.ac)} m/s²`)}${eq(`<i>a</i> = √(${f(Q1.p.at)}² + ${f(Q1.p.ac)}²) = ${p3(Q1.p.a)} m/s²`)}<p>它们成直角，因此它们作为向量相加，而不是作为数字（${p3(Q1.p.at + Q1.p.ac)}）。</p>` },
  ],
  2: [
    { q: `${f(DR.F, 0)} N 推力作用于手柄，距离铰链 ${f(DR.cases[0].r, 2)} 米，位于门的 ${Q2.phi}° 处。它对铰链产生多大的力矩？`,
      choices: [`${p3(DR.F * DR.cases[0].r)} N·m`, `${p3(Q2.tau)} N·m`, `${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} N·m`, '0 N·m'], answer: 1,
      why: `<p>φ是<b>r</b>（沿门）和<b>F</b>之间的角度，这里${Q2.phi}°.</p>${eq(`τ = rF sin φ = ${f(DR.cases[0].r)} × ${f(DR.F, 0)} × sin ${Q2.phi}° = ${p3(Q2.tau)} N·m`)}<p>${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} N·m 使用 cos：即 F 沿着门的部分，推入铰链。</p>` },
    { q: `门（${DR.M} kg，${f(DR.W, 1)} 米宽，I = ⅓MW²）在手柄处以 τ = ${f(DR.cases[0].tau, 1)} N·m 方形推入。其角加速度为`,
      choices: [`${p3(DR.cases[0].tau / (DR.M * DR.W ** 2))} rad/s²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 2))} rad/s²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 12))} rad/s²`, `${p3(Q2.alpha)} rad/s²`], answer: 3,
      why: `${eq(`I = ⅓MW² = ⅓ × ${DR.M} × ${f(DR.W, 1)}² = ${f(DR.I)} kg·m²`)}${eq(`α = τ/I = ${f(DR.cases[0].tau, 1)} / ${f(DR.I)} = ${p3(Q2.alpha)} rad/s²`)}<p>A 门围绕其边缘而不是中间转动，因此 <sup>1</sup>⁄<sub>12</sub>MW²（围绕中心）给出了太大的α.</p>` },
  ],
  3: [
    { q: `${PL.m} kg 板条箱位于距离 ${f(PL.L, 1)} m、${PL.M} kg 木板上的支撑 A ${f(Q3.x, 1)} m 处。支撑B施加什么力？`,
      choices: [`${p3(Q3.q.FA)} N`, `${p3((PL.Wp + PL.Wc) / 2)} N`, `${p3(Q3.x * PL.Wc / PL.L)} N`, `${p3(Q3.q.FB)} N`], answer: 3,
      why: `<p>关于 A 的力矩，其中 <i>F</i><sub>A</sub> 没有杠杆臂：</p>${eq(`${f(PL.L, 1)}·<i>F</i><sub>B</sub> = ${f(PL.L / 2, 1)} × ${f(PL.Wp, 0)} + ${f(Q3.x, 1)} × ${f(PL.Wc, 0)} → <i>F</i><sub>B</sub> = ${p3(Q3.q.FB)} N`)}<p> 板条箱更靠近 A，因此 A 容纳更多 (${p3(Q3.q.FA)} N) 和B 少。 ${p3(Q3.x * PL.Wc / PL.L)} N 忘记了木板自身的重力。</p>` },
    { q: "板条箱缓慢地从 A 滑向 B。支撑力会发生什么变化？",
      choices: ["<i>F</i><sub>A</sub> 下跌，<i>F</i><sub>B</sub> 上涨，它们的总和保持不变", "<i>F</i><sub>A</sub> 上涨，<i>F</i><sub>B</sub> 下跌", "两者保持不变：总重力不变", "<i>F</i><sub>A</sub> 下跌，<i>F</i><sub>B</sub> 上涨，它们的总和上涨"], answer: 0,
      why: "<p>Σ<i>F</i> = 0 将总和固定为 (M + m)g。关于 A = 0 的 Στ 给出​​ <i>F</i><sub>B</sub> = [(L/2)Mg + x·mg]/L，其随 x 增长。因此，<i>F</i><sub>B</sub> 上涨，<i>F</i><sub>A</sub> 下跌相同的金额。</p>" },
  ],
  4: [
    { q: `${LD.m} kg 梯子以 ${Q4.th}° 倾斜到地板上，靠着光滑的墙壁。地板必须提供多少摩擦力？`,
      choices: [`${p3(LD.W / tan(Q4.th))} N`, `${p3(Q4.f)} N`, `${p3(LD.muS * LD.W)} N`, `${p3(LD.W * tan(Q4.th) / 2)} N`], answer: 1,
      why: `<p>绕脚的力矩：(L sin θ)<i>F</i><sub>w</sub> = (½L cos θ)mg，因此 <i>F</i><sub>w</sub> = mg / (2 tan θ)。 ΣF<sub>x</sub> = 0 使摩擦力相等 <i>F</i><sub>w</sub>:</p>${eq(`<i>f</i> = ${f(LD.W, 0)} / (2 tan ${Q4.th}°) = ${p3(Q4.f)} N`)}<p>${p3(LD.muS * LD.W)} N 是<b>最大</b> 静摩擦力可以给出，而不是它给出的值。</p>` },
    { q: "同一楼层的梯子被替换为两倍重、相同长度的梯子。它能站立的最小角度是",
      choices: ["更大", "较小", "一样的", "只有更长才更大"], answer: 2,
      why: "<p> 所需摩擦力，mg/(2 tan θ)，可用摩擦力，μ<sub>s</sub>mg，均以 m 为单位。将它们设置为相等，得到 tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>)：没有 m，没有 L.</p>" },
  ],
  5: [
    { q: "环、圆盘和实心球具有相同的质量和半径以及相同的力矩。对它们的角加速度进行排序，最大的在前。",
      choices: ["环、盘、球体", "球体、圆盘、环", "圆盘、球体、环", "一切平等"], answer: 1,
      why: "<p>α = τ/I 其中 I = MR²（环）、½MR²（盘）、⅖MR²（球）。球体的质量最接近轴，I 最小，α 最大。</p>" },
    { q: `圆盘（${f(SH.M, 1)} kg、${f(SH.R, 1)} m）通过 ${f(SH.F, 1)} N 拉动其边缘的绳子从静止状态开始。 ${f(Q5.t, 1)} s后的ω为`,
      choices: [`${p3(SH.F / Q5.disc.I * Q5.t)} rad/s`, `${p3(SH.tau / (SH.M * SH.R ** 2) * Q5.t)} rad/s`, `${p3(SH.tau / (0.4 * SH.M * SH.R ** 2) * Q5.t)} rad/s`, `${p3(Q5.w)} rad/s`], answer: 3,
      why: `${eq(`τ = FR = ${f(SH.tau)} N·m, I = ½MR² = ${f(Q5.disc.I)} kg·m²`)}${eq(`α = τ/I = ${f(Q5.disc.alpha)} rad/s², ω = αt = ${p3(Q5.w)} rad/s`)}<p>${p3(SH.F / Q5.disc.I * Q5.t)} rad/s 将力视为力矩。</p>` },
  ],
  6: [
    { q: `一根 ${f(RD.M, 1)} kg 棒，${f(RD.L, 1)} m 长，朝一端变得更密： λ = Cx，其中 x 来自光端 O。其关于穿过 O 的垂直轴的 I 为`,
      choices: [`${p3(RD.M * RD.L ** 2 / 3)} kg·m²`, `${p3(Q6.I)} kg·m²`, `${p3(RD.M * RD.L ** 2 / 4)} kg·m²`, `${p3(RD.M * RD.L ** 2)} kg·m²`], answer: 1,
      why: `<p>首先从质量中固定 C，然后将 r² dm 与 dm = Cx dx 积分：</p>${eq(`M = ∫<sub>0</sub><sup>L</sup> Cx dx = ½CL² → C = 2M/L²`)}${eq(`I = ∫<sub>0</sub><sup>L</sup> x²·Cx dx = ¼CL⁴ = ½ML² = ${p3(Q6.I)} kg·m²`)}<p> 超过均匀杆的 ⅓ML² (${p3(RD.M * RD.L ** 2 / 3)})：质量位于更远的位置。 ¼ML² 忘记用 2M/L² 替换 C。</p>` },
    { q: `质量为 M 的平垫圈（环形）具有内半径 R/2 和外半径 R。使用 I = ∫r² dm，证明围绕其中心的 I = ⅝MR²，并根据 M = ${f(SH.M, 1)} kg、R = ${f(SH.R, 1)} m 对其进行评估。`,
      solution: `<p>单位面积质量 σ = M / [π(R² − R²/4)] = 4M / (3πR²)。 r 宽度为 dr 的环有 dm = σ·2πr dr.</p>${eq(`I = ∫<sub>R/2</sub><sup>R</sup> r²·σ2πr dr = 2πσ [r⁴/4]<sub>R/2</sub><sup>R</sup> = 2πσ · (15/64)R⁴`)}${eq(`I = 2π · 4M/(3πR²) · 15R⁴/64 = (120/192)MR² = ⅝MR²`)}${eq(`I = ⅝ × ${f(SH.M, 1)} × ${f(SH.R, 1)}² = ${p3(Q6.Iann)} kg·m²`)}<p> 在圆盘 (½MR²) 和环 (MR²) 之间，应该是：孔将质量向外移动。</p>` },
  ],
  7: [
    { q: `${f(RD.M, 1)} kg、${f(RD.L, 1)} m 杆（I<sub>cm</sub> = ${f(RD.Icm)} kg·m²）从一端绕垂直轴 ${f(Q7.e, 2)} m 转动。它的转动惯量为`,
      choices: [`${p3(RD.Icm + RD.M * Q7.d)} kg·m²`, `${p3(RD.M * Q7.d ** 2)} kg·m²`, `${p3(RD.Iend + RD.M * Q7.e ** 2)} kg·m²`, `${p3(Q7.I)} kg·m²`], answer: 3,
      why: `<p> 该定理从质心轴开始计算，因此 d 是从中心测量的： d = ${f(RD.L / 2, 2)} − ${f(Q7.e, 2)} = ${f(Q7.d, 2)} m.</p>${eq(`I = I<sub>cm</sub> + Md² = ${f(RD.Icm)} + ${f(RD.M, 1)} × ${f(Q7.d, 2)}² = ${p3(Q7.I)} kg·m²`)}<p>${p3(RD.Iend + RD.M * Q7.e ** 2)} 将Md²添加到最终值，但末端不是质心。</p>` },
    { q: `杆的一端用销钉固定，并从水平状态释放。利用平行轴定理求出 I，将 Στ = Iα 写为其低于水平面的角度 θ 的微分方程，并对其积分以求出其在底部摆动时的 ω。`,
      solution: `<p>I = <sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML²。重力作用在中心，距销 L/2，杠杆臂 (L/2)cos θ:</p>${eq(`⅓ML² · d²θ/dt² = Mg(L/2) cos θ`)}${eq(`d²θ/dt² = (3g / 2L) cos θ`)}<p> 写出 d²θ/dt² = ω dω/dθ 并从 θ = 0, ω = 积分0：</p>${eq(`∫<sub>0</sub><sup>ω</sup> ω dω = (3g/2L) ∫<sub>0</sub><sup>θ</sup> cos θ dθ → ω² = (3g/L) sin θ`)}${eq(`at the bottom, θ = 90°: ω = √(3g/L) = √(3 × ${f(G)} / ${f(RD.L, 1)}) = ${p3(Q7.wBot)} rad/s`)}<p>按能量检查：中心下降L/2，所以Mg(L/2) = ½(⅓ML²)ω²，结果相同。 α 不是常数，因此 ω² = 2αΔθ 不适用。</p>` },
  ],
  8: [
    { q: `将 ${f(WR.F, 0)} N 推方形扳手连接至 ${f(WR.r, 2)} m 扳手可将螺母转动 120° 行程。所做的工作是`,
      choices: [`${p3(WR.tau)} J`, `${p3(WR.F * WR.stroke)} J`, `${p3(Q8.W)} J`, `${p3(WR.tau * 120)} J`], answer: 2,
      why: `${eq(`W = τΔθ = (${f(WR.r, 2)} × ${f(WR.F, 0)}) × 2π/3 = ${f(WR.tau, 0)} × ${f(WR.stroke, 3)} = ${p3(Q8.W)} J`)}<p>Δθ 必须以弧度为单位。 ${p3(WR.tau * 120)} J乘以120度。</p>` },
    { q: "相同的螺母需要相同的力矩。使用两倍长的扳手，所需的推力和每 120° 行程的功为",
      choices: ["一半的推动，一半的工作", "一半的推力，同样的工作", "同样的推动，双倍的工作", "事半功倍"], answer: 1,
      why: "<p>τ = rF：双倍 r，减半 F。 W = τΔθ：相同 τ，相同角度，相同功。手用一半的力移动两倍的距离。</p>" },
  ],
  9: [
    { q: `圆盘 (I = ½mR²) 从静止状态滚动，不会从 ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° 处的 ${f(M.RACE.len, 1)} m 坡道上滑落。其在底部的速度为`,
      choices: [`${p3(Math.sqrt(2 * G * Q9.h))} m/s`, `${p3(Math.sqrt(2 * G * Q9.h / 1.4))} m/s`, `${p3(Math.sqrt(G * Q9.h))} m/s`, `${p3(Q9.v)} m/s`], answer: 3,
      why: `<p>h = ${f(M.RACE.len, 1)} sin ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° = ${f(Q9.h, 3)} m。 ω = v/R:</p>${eq(`mgh = ½mv² + ½(½mR²)(v/R)² = ¾mv² → v = √(4gh/3) = ${p3(Q9.v)} m/s`)}<p>${p3(Math.sqrt(2 * G * Q9.h))} m/s 是滑动框，在旋转上不花费任何费用。</p>` },
    { q: "实心球体 (⅖MR2)、空心球体 (⅔MR2) 和环 (MR2) 从静止状态滚下同一坡道。他们按什么顺序到达？",
      choices: ["环、空心球、实心球", "全部在一起", "实心球、空心球、环形", "空心球、实心球、环形"], answer: 2,
      why: "<p>a = g sin θ / (1 + f) 其中 I = fMR²。 f 最小，旋转消耗的能量最少，最快：实心 (0.4)，然后是空心 (0.67)，然后是环 (1)。质量和半径取消。</p>" },
  ],
  10: [
    { q: `保龄球在 ${f(B.v0, 1)} m/s 处离开手时不旋转并打滑，直至滚动。当它开始滚动时，它移动的速度有多快？`,
      choices: [`${p3(B.v0)} m/s`, `${p3(Q10.vf)} m/s`, `${p3(B.v0 / Math.sqrt(1.4))} m/s`, `${p3(2 * B.v0 / 7)} m/s`], answer: 1,
      why: `<p>关于接触线摩擦没有力矩，因此mvR + Iω保持在mv<sub>0</sub>R。滚动，ω = v/R：</p>${eq(`mv<sub>0</sub>R = mvR + ⅖mR²(v/R) → v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub> = ${p3(Q10.vf)} m/s`)}<p>${p3(B.v0 / Math.sqrt(1.4))} m/s 假设动能守恒，但当球打滑时，动摩擦会将部分动能转化为热量。</p>` },
    { q: `写出打滑时的 v(t) 和 ω(t) (μ<sub>k</sub> = ${f(B.muK, 1)})，找到 v = Rω 时的时间 t*，并对 v(t) 积分即可得出球打滑的距离。`,
      solution: `<p>摩擦 μ<sub>k</sub>mg 向后作用底部：</p>${eq(`m dv/dt = −μ<sub>k</sub>mg → v = v<sub>0</sub> − μ<sub>k</sub>g t`)}${eq(`⅖mR² dω/dt = μ<sub>k</sub>mgR → ω = (5μ<sub>k</sub>g / 2R) t`)}${eq(`v<sub>0</sub> − μ<sub>k</sub>g t* = <sup>5</sup>⁄<sub>2</sub>μ<sub>k</sub>g t* → t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g = ${f(B.tStar, 3)} s`)}${eq(`x* = ∫<sub>0</sub><sup>t*</sup> (v<sub>0</sub> − μ<sub>k</sub>g t) dt = v<sub>0</sub>t* − ½μ<sub>k</sub>g t*²`)}${eq(`x* = 12v<sub>0</sub>² / 49μ<sub>k</sub>g = ${p3(Q10.xStar)} m`)}<p>不取决于R或m。</p>` },
  ],
  11: [
    { q: `${f(WL.m, 1)} 公斤铲斗从静止状态落下，松开 ${f(WL.M, 1)} 公斤桶（实心圆柱体）。 ${f(WL.h, 1)} 下落后的速度为 m`,
      choices: [`${p3(Math.sqrt(2 * G * WL.h))} m/s`, `${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} m/s`, `${p3(Q11.v)} m/s`, `${p3(Math.sqrt(WL.a * WL.h))} m/s`], answer: 2,
      why: `${eq(`a = mg / (m + ½M) = ${f(WL.m * G, 1)} / ${f(WL.m + WL.M / 2, 1)} = ${f(WL.a)} m/s²`)}${eq(`v = √(2ah) = √(2 × ${f(WL.a)} × ${f(WL.h, 1)}) = ${p3(Q11.v)} m/s`)}<p>${p3(Math.sqrt(2 * G * WL.h))} m/s 为自由落体，忽略滚筒所承受的能量； ${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} m/s 将鼓视为箍 (I = MR²)。</p>` },
    { q: "当桶下落时，绳索张力为",
      choices: ["等于桶的重力", "大于桶的重力", "小于桶的重力但大于零", "零，因为桶正在下落"], answer: 2,
      why: `<p>铲斗向下加速，所以 mg − T = ma > 0: T < mg. But the rope must pull on the drum to spin it up (rT = Iα), so T > 0。这里 T = ${f(WL.T)} N 对 mg = ${f(WL.m * G, 1)} N.</p>` },
  ],
  12: [
    { q: `旋转木马（I = ${f(IM.I, 0)} kg·m²，R = ${f(IM.R, 1)} m）开始静止。 ${Q12.F} N 与边缘相切的推动持续 ${f(Q12.dt, 2)} s。其最终的 ω 为`,
      choices: [`${p3(Q12.F * Q12.dt / IM.I)} rad/s`, `${p3(Q12.w)} rad/s`, `${p3(Q12.F * IM.R * Q12.dt / (IM.M * IM.R ** 2))} rad/s`, `${p3(Q12.F * IM.R / IM.I)} rad/s`], answer: 1,
      why: `${eq(`ΔL = τΔt = (${Q12.F} × ${f(IM.R, 1)}) × ${f(Q12.dt, 2)} = ${f(Q12.F * IM.R * Q12.dt, 0)} kg·m²/s`)}${eq(`ω = ΔL / I = ${f(Q12.F * IM.R * Q12.dt, 0)} / ${f(IM.I, 0)} = ${p3(Q12.w)} rad/s`)}<p>${p3(Q12.F * Q12.dt / IM.I)} rad/s使用FΔt（线性脉冲）代替τΔt； ${p3(Q12.F * IM.R / IM.I)} 是 τ/I，角加速度，而不是 ω.</p>` },
    { q: `车轮上的力矩在 ${f(Q12.T / 2, 1)} 秒内从 0 稳定上升到 ${Q12.peak} N·m，然后在 ${f(Q12.T, 1)} 秒内稳定回落至 0。车轮角动量的变化为`,
      choices: [`${p3(Q12.peak)} kg·m²/s`, `${p3(Q12.peak * Q12.T)} kg·m²/s`, `${p3(Q12.peak / Q12.T)} kg·m²/s`, `${p3(Q12.J)} kg·m²/s`], answer: 3,
      why: `<p>ΔL是τ–t图下方的面积，这里一个三角形：</p>${eq(`ΔL = ½ × ${f(Q12.T, 1)} s × ${Q12.peak} N·m = ${p3(Q12.J)} kg·m²/s`)}<p>${p3(Q12.peak * Q12.T)}将其视为矩形； ${p3(Q12.peak / Q12.T)} 是一个坡度，而不是一个区域。</p>` },
  ],
  13: [
    { q: `滑冰者 (I<sub>body</sub> = ${f(SK.Ib, 1)} kg·m²) 以 ${f(SK.w0, 1)} rad/s 旋转，${f(SK.m, 1)} kg 重力为 ${f(SK.rOut, 2)} m，并将它们拉入${f(SK.rIn, 2)} 米她的新 ω 是`,
      choices: [`${p3(SK.w0 * SK.rOut / SK.rIn)} rad/s`, `${p3(Q13.wNoBody)} rad/s`, `${p3(Q13.w)} rad/s`, `${p3(SK.w0)} rad/s`], answer: 2,
      why: `${eq(`I<sub>0</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rOut, 2)}² = ${f(Q13.I0)} kg·m², I<sub>f</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rIn, 2)}² = ${f(Q13.I1, 3)} kg·m²`)}${eq(`ω<sub>f</sub> = I<sub>0</sub>ω<sub>0</sub> / I<sub>f</sub> = ${p3(Q13.w)} rad/s`)}<p>${p3(Q13.wNoBody)} rad/s 遗漏了她身体的 ${f(SK.Ib, 1)} kg·m²，该值不会改变。</p>` },
    { q: "当她拉动重物时，她的旋转动能",
      choices: ["保持不变，因为 L 是守恒的", "减少，因为我减少", "增加，因为冰施加力矩", "增加，因为她的手臂确实对重力起作用"], answer: 3,
      why: `<p>K = L²/2I。 L 固定，I 下降，因此 K 上升：这里从 ${f(M.skater(0.5).K)} J 到 ${f(M.skater(3.5).K)} J。能量来自她的肌肉，将重物向内拉，以防止其飞出。冰（几乎）不产生力矩，这就是 L 成立的原因。</p>` },
  ],
  14: [
    { q: `${f(HT.m, 1)} kg 球在 ${f(HT.v0, 1)} m/s 处从销 O 和 <b>粘在一起</b> 撞击杆 (I = ⅓ML² = ${f(HT.I, 2)} kg·m²) ${f(HT.d, 1)} m。紧接着的杆的 ω 是`,
      choices: [`${p3(HT.m * HT.v0 * HT.d / HT.I)} rad/s`, `${p3(Q14.w)} rad/s`, `${p3(HT.m * HT.v0 * HT.d / (HT.M * HT.L ** 2 / 12 + HT.m * HT.d ** 2))} rad/s`, `${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} rad/s`], answer: 1,
      why: `<p>销钉推动，因此线性动量不守恒；但销钉没有关于 O 的力矩，因此关于 O 的 L 为：</p>${eq(`mv<sub>0</sub>d = (I + md²)ω → ω = ${f(HT.m * HT.v0 * HT.d, 2)} / (${f(HT.I, 2)} + ${f(HT.m * HT.d ** 2, 2)}) = ${p3(Q14.w)} rad/s`)}<p>${p3(HT.m * HT.v0 * HT.d / HT.I)} 忘记了球现在随杆转动； ${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} 保留线性动量，销破坏了该动量。</p>` },
    { q: `一个 ${f(HT.m, 1)} kg 的球从静止状态下落到 O 一侧的 ${f(HT.d, 1)} 米点，位于同一垂直平面内。当它下落时，它关于 O 的角动量以多大的速率变化？`,
      choices: [`${p3(Q14.dLdt / 2)} kg·m²/s²`, `${p3(2 * Q14.dLdt)} kg·m²/s²`, `${p3(Q14.dLdt)} kg·m²/s²`, "0：直线移动"], answer: 2,
      why: `<p> 当 O 位于原点且球位于 (d, y) 时，p = (0, −mgt)。则</p>${eq(`L = xp<sub>y</sub> − yp<sub>x</sub> = −d·mgt → |dL/dt| = mgd = ${f(HT.m, 1)} × ${f(G)} × ${f(HT.d, 1)} = ${p3(Q14.dLdt)} kg·m²/s²`)}<p>即为关于O的重力力矩，d·mg。仅当没有力作用时，直线才使 L 保持恒定：此处速度增加。</p>` },
  ],
};
