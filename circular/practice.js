// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, rad = d => d * Math.PI / 180, RE = M.EARTH.R, GM = M.GM, m = M.SAT_M;
const B = M.BALL;

// 0 · twice the speed
const AC0 = M.ac(M.V2, B.r);
// 1 · half the string
const T1 = B.m * M.V1 ** 2 / (B.r / 2);
// 2 · a wet road
const MU2 = 0.40, V2MAX = Math.sqrt(MU2 * G * M.CAR.r);
// 3 · the cone at 60°
const TH3 = 60, R3 = M.CONE.L * Math.sin(rad(TH3)), V3 = Math.sqrt(R3 * G * Math.tan(rad(TH3))), T3 = M.CONE.m * G / Math.cos(rad(TH3));
// 4 · the loop's top at 9.0 m/s
const L = M.LOOP, V4 = 9.0, N4 = L.m * (V4 ** 2 / L.r - G);
// 5 · a wider banked curve
const R5 = 40, V5 = Math.sqrt(R5 * G * Math.tan(M.BANK.th));
// 6 · a record turntable
const RPM6 = 100 / 3, R6 = 0.15, V6 = R6 * RPM6 * 2 * Math.PI / 60;
// 7 · g one Earth radius up
const G7 = M.EARTH.g / 4;
// 8 · orbit at 3 R_E
const V8 = Math.sqrt(GM / (3 * RE));
// 9 · an ellipse from 2 R_E to 4 R_E
const RP9 = 2 * RE, RA9 = 4 * RE, VP9 = M.visViva(RP9, (RP9 + RA9) / 2), VA9 = VP9 * RP9 / RA9;
// 10 · the page's ellipse: K at apogee from energy
const KP = 0.5 * m * M.ELL.vp ** 2, UP = M.Ugrav(M.ELL.rp), UA = M.Ugrav(M.ELL.ra), KA = KP + UP - UA;
// 11 · gravity's work from 4 R_E in to 2 R_E; ΔU to 100 km
const W11 = GM * m * (1 / (2 * RE) - 1 / (4 * RE)), H11 = 100e3, DU11 = GM * m * (1 / RE - 1 / (RE + H11)), MGH11 = m * M.EARTH.g * H11;
// 12 · escape from 4 R_E; from a circular orbit at 2 R_E
const VE12 = M.vEsc(4 * RE), R12 = 2 * RE;
const GJ = x => f(x / 1e9, 2);

export const PRACTICE = {
  0: [
    { q: "球以恒定速度旋转。它的加速度指向哪个方向？",
      choices: ["沿着其速度，与圆相切", "向圆心", "远离中心", "无处：恒定速度意味着零加速度"], answer: 1,
      why: `<p>Velocity是一个向量；它的方向不断转向中心，因此 Δ<i>v</i>（和 <i>a</i>）指向中心，⟂ <i>v</i>。常数 <b>速率</b> 表示 <i>a</i> 沿 <i>v</i> 不存在任何部分，不为零 <i>a</i>.</p>` },
    { q: `球在 ${f(M.V2, 1)} m/s（而不是 ${f(M.V1, 1)} m/s）处绕相同的 ${f(B.r)} m 圆旋转。它的向心加速度是多​​少？`,
      choices: [`${p3(2 * M.ac(M.V1, B.r))} m/s²`, `${p3(M.ac(M.V1, B.r))} m/s²`, `${p3(AC0)} m/s²`, `${p3(M.ac(M.V1, B.r) / 2)} m/s²`], answer: 2,
      why: `<div class="eq"><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = (${f(M.V2, 1)})² / ${f(B.r)} = ${p3(AC0)} m/s²</div><p>速度是平方：速度的两倍是${f(M.ac(M.V1, B.r))} m/s²的四倍，而不是两倍。</p>` },
  ],
  1: [
    { q: `${f(B.m)} kg 球仍为 ${f(M.V1, 1)} m/s，但绳子长度为 ${f(B.r / 2)} m 的一半。紧张是什么？`,
      choices: [`${p3(T1)} N`, `${p3(T1 / 4)} N`, `${p3(2 * T1)} N`, `${p3(T1 / 2)} N`], answer: 0,
      why: `<p>在光滑的工作台上，拉力是唯一的水平力，因此它是整个向心力：</p><div class="eq"><i>T</i> = <i>mv</i>²/<i>r</i> = ${f(B.m)} × (${f(M.V1, 1)})² / ${f(B.r / 2)} = ${p3(T1)} N</div><p>H 以相同速度将 <i>r</i> 减半，使 <i>T</i> 加倍（来自 ${f(M.tension(M.V1))} N）.</p>` },
    { q: "从上面看，当球旋转时，绳子断了。紧接着，球移动了",
      choices: ["沿着螺旋向外", "沿着旧绳子从中心直接出来", "沿着该点的切线的直线", "在同一个圆上，减速"], answer: 2,
      why: `<p> 绳子消失后，不再有水平力，因此（第一定律）球保持其速度：与圆相切，沿直线运动。没有向外的力将其径向抛掷。</p>` },
  ],
  2: [
    { q: `在潮湿的日子，轮胎的 μ<sub>s</sub> 下降至 ${f(MU2)}。 ${M.CAR.r} 平弯汽车最快能走多少米弯道？`,
      choices: [`${p3(M.CAR.vmax)} m/s`, `${p3(M.CAR.vmax / 2)} m/s`, `${p3(MU2 * G * M.CAR.r)} m/s`, `${p3(V2MAX)} m/s`], answer: 3,
      why: `<p>在极限情况下，所能给出的最大静摩擦力正是所需的向心力： μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>.</p><div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = √(${f(MU2)} × ${f(G)} × ${M.CAR.r}) = ${p3(V2MAX)} m/s</div><p>H 将 μ<sub>s</sub> 减半将 <i>v</i><sub>max</sub> 除以 √2，而不是 2.</p>` },
    { q: "一辆质量是汽车两倍的卡车，在相同的轮胎和平坦的弯道上，会尽可能快地通过弯道。与汽车的最高时速相比，卡车的最高时速是",
      choices: ["一半大", "1/√2一样大", "一样的", "√2倍大"], answer: 2,
      why: `<p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>：质量在两侧且抵消，<i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>)。卡车需要两倍的摩擦力，但其重力加倍，使道路供应量增加一倍。</p>` },
  ],
  3: [
    { q: `${f(M.CONE.L, 1)} m 弦上的 ${f(M.CONE.m)} kg 球摆动得更快，直到弦与垂直方向成 ${TH3}°。球移动的速度有多快？`,
      choices: [`${p3(Math.sqrt(M.CONE.L * G * Math.tan(rad(TH3))))} m/s`, `${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s`, `${p3(V3)} m/s`, `${p3(Math.sqrt(G * M.CONE.L))} m/s`], answer: 2,
      why: `<p>半径是水平范围，<i>r</i> = <i>L</i> sin θ = ${f(R3, 3)} m，而不是<i>L</i>。由 <i>g</i> tan θ = <i>v</i>²/<i>r</i>:</p><div class="eq"><i>v</i> = √(<i>rg</i> tan θ) = √(${f(R3, 3)} × ${f(G)} × ${f(Math.tan(rad(TH3)), 3)}) = ${p3(V3)} m/s</div><p>${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s 使用与水平面的角度的 tan。</p>` },
    { q: `相同的球，线距垂直方向为 ${TH3}°。绳子的张力是多少？`,
      choices: [`${p3(T3)} N`, `${p3(M.CONE.m * G * Math.cos(rad(TH3)))} N`, `${p3(M.CONE.m * G / Math.sin(rad(TH3)))} N`, `${p3(M.CONE.m * G)} N`], answer: 0,
      why: `<p>没有任何东西会垂直加速，因此绳子的垂直部分支撑着重力：</p><div class="eq"><i>T</i> cos θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.CONE.m * G, 2)} / cos ${TH3}° = ${p3(T3)} N</div><p>张力必须是 <b>更大</b> 比 <i>mg</i>，因为只有部分向上； <i>mg</i> cos θ 走错了路。</p>` },
  ],
  4: [
    { q: `${L.m} kg 车通过 ${f(L.r, 1)} m 环路的顶部（颠倒），位于 ${f(V4, 1)} m/s 处。轨道对它的推力有多大？`,
      choices: [`${p3(L.m * (V4 ** 2 / L.r + G) / 1000)} kN`, `${p3(N4 / 1000)} kN`, `${p3(L.m * V4 ** 2 / L.r / 1000)} kN`, `${p3(L.W / 1000)} kN`], answer: 1,
      why: `<p>在顶部，两个力都向下指向中心，并且它们一起提供 <i>mv</i>²/<i>r</i>：</p><div class="eq"><i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>F</i><sub>N</sub> = ${L.m}(${f(V4 ** 2 / L.r, 2)} − ${f(G)}) = ${f(N4, 0)} N = ${p3(N4 / 1000)} kN</div><p> 添加 <i>mg</i> 改为 <b>最低点</b> 循环方程。</p>` },
    { q: `小车通过 ${f(L.r, 1)} 米环路顶部并保持在轨道上的最慢速度是多少？`,
      choices: [`${p3(Math.sqrt(2 * G * L.r))} m/s`, `${p3(G * L.r)} m/s`, `${p3(Math.sqrt(G * L.r / 2))} m/s`, `${p3(L.vmin)} m/s`], answer: 3,
      why: `<p>越慢意味着来自轨道的推力越小。极限为 <i>F</i><sub>N</sub> = 0，仅重力提供向心力：</p><div class="eq"><i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>v</i><sub>min</sub> = √(<i>gr</i>) = √(${f(G)} × ${f(L.r, 1)}) = ${p3(L.vmin)} m/s</div><p>质量取消；比这慢，重力将小车拉入圆圈内并离开轨道。</p>` },
  ],
  5: [
    { q: `半径为 ${R5} m 的曲线在同一 ${M.BANK.thetaDeg}° 处倾斜。汽车可以在没有任何摩擦的情况下以什么速度行驶？`,
      choices: [`${p3(M.BANK.v)} m/s`, `${p3(Math.sqrt(R5 * G))} m/s`, `${p3(R5 * G * Math.tan(M.BANK.th))} m/s`, `${p3(V5)} m/s`], answer: 3,
      why: `<p>垂直：<i>F</i><sub>N</sub> cos θ = <i>mg</i>。水平：<i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i>。除法：</p><div class="eq">tan θ = <i>v</i>²/(<i>rg</i>) &nbsp;→ <i>v</i> = √(${R5} × ${f(G)} × tan ${M.BANK.thetaDeg}°) = ${p3(V5)} m/s</div><p> ${f(M.BANK.v)} m/s 在 ${M.BANK.r} m 曲线上的四倍半径、两倍速度。</p>` },
    { q: "在冰冷（无摩擦）的倾斜曲线上，汽车的行驶速度超过了该倾斜方向的适当速度。会发生什么？",
      choices: ["它沿着河岸向曲线外侧漂去。", "它沿着河岸滑向内侧。", "它遵循曲线，因为法向力会增长以匹配。", "它停止转动并沿着斜坡直线移动。"], answer: 0,
      why: `<p> 在没有摩擦的情况下，法向力必须将汽车举起 (<i>F</i><sub>N</sub> cos θ = <i>mg</i>) 并使其转动，因此其水平部分固定在 <i>mg</i> tan θ。一辆更快的汽车需要的不止于此，因此它无法沿着圆圈行驶并漂移到更大的半径，上岸。</p>` },
  ],
  6: [
    { q: `唱片的转速为 33⅓ rpm。距中心一米的尘埃 ${f(R6)} 移动的速度有多快？`,
      choices: [`${p3(R6 * RPM6 / 60)} m/s`, `${p3(V6)} m/s`, `${p3(R6 * RPM6)} m/s`, `${p3(2 * R6 * RPM6 * 2 * Math.PI / 60)} m/s`], answer: 1,
      why: `<p>先转换为rad/s： ω = 33⅓ × 2π/60 = ${f(RPM6 * 2 * Math.PI / 60, 3)} rad/s。则</p><div class="eq"><i>v</i> = <i>r</i>ω = ${f(R6)} × ${f(RPM6 * 2 * Math.PI / 60, 3)} = ${p3(V6)} m/s</div><p><i>v</i> = <i>r</i>ω 仅适用于 rad/s 中的 ω； ${p3(R6 * RPM6)}直接使用rpm，${p3(R6 * RPM6 / 60)}使用rev/s并忘记2π。</p>` },
    { q: `块位于距离旋转盘中心 ${f(M.DISC.r1)} 米和 ${f(M.DISC.r2)} 米处。与内块相比，外块的向心加速度为`,
      choices: ["一半大", "一样的", "两倍大", "四倍大"], answer: 2,
      why: `<p>两者共享一个ω，因此<i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω²与<i>r</i>成比例增长。 （使用 <i>v</i>²/<i>r</i>，<i>v</i> 会加倍，但 <i>r</i> 也会加倍：4/2 = 2，而不是 4。）</p>` },
  ],
  7: [
    { q: "两个球体相互吸引，力为 <i>F</i>。一个质量增加了三倍，它们的中心之间的距离增加了一倍。力变为",
      choices: [`${(3 / 4).toFixed(3)} <i>F</i>`, `${(3 / 2).toFixed(2)} <i>F</i>`, `${(3 / 8).toFixed(3)} <i>F</i>`, `${(3 * 4).toFixed(1)} <i>F</i>`], answer: 0,
      why: `<p><i>F</i> ∝ <i>m</i><sub>1</sub><i>m</i><sub>2</sub>/<i>r</i>²：乘以因数，3 × 1 / 2² = 3/4。忘记对 <i>r</i> 求平方得到 1.5 <i>F</i>.</p>` },
    { q: `距地表一个地球半径高度处的引力场强度（自由落体加速度）是多少？ （<i>g</i> = ${f(M.EARTH.g)} m/s² 在表面）`,
      choices: [`${p3(M.EARTH.g / 2)} m/s²`, `${p3(G7)} m/s²`, `${p3(M.EARTH.g / 9)} m/s²`, `${p3(M.EARTH.g)} m/s²`], answer: 1,
      why: `<p> 表面上方 <b> 的一个半径 </b> 距中心 2<i>R</i><sub>E</sub>，且 <i>g</i> = <i>GM</i>/<i>r</i>²下降为 1/<i>r</i>²:</p><div class="eq"><i>g</i>′ = ${f(M.EARTH.g)} / 2² = ${p3(G7)} m/s²</div><p>H 减半重力为 1/<i>r</i>.</p>` },
  ],
  8: [
    { q: "卫星 B 的轨道半径是卫星 A 的两倍（围绕同一行星的圆形轨道）。 B的周期是A的几倍？",
      choices: [`${p3(Math.SQRT2)}`, `${p3(2)}`, `${p3(4)}`, `${p3(2 ** 1.5)}`], answer: 3,
      why: `<p>开普勒第三定律，<i>T</i>² ∝ <i>r</i>³，所以 <i>T</i> ∝ <i>r</i><sup>3/2</sup>： 2<sup>3/2</sup> = ${p3(2 ** 1.5)}。 （比较表中2个<i>R</i><sub>E</sub>和4个<i>R</i><sub>E</sub>：${f(M.orbitT(M.SAT.r1) / 3600)} h和${f(M.orbitT(M.SAT.r2) / 3600)} h。）</p>` },
    { q: `卫星在半径为 3 <i>R</i><sub>E</sub> 的圆形轨道上运行的速度有多快？ （<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s²， <i>R</i><sub>E</sub> = ${f(RE / 1e6)} × 10<sup>6</sup> m)`,
      choices: [`${p3(Math.sqrt(GM / RE) / 3 / 1000)} km/s`, `${p3(Math.sqrt(2 * GM / (3 * RE)) / 1000)} km/s`, `${p3(V8 / 1000)} km/s`, `${p3(Math.sqrt(GM / RE) / 1000)} km/s`], answer: 2,
      why: `<p>重力为向心力：<i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>，所以</p><div class="eq"><i>v</i> = √(<i>GM</i>/<i>r</i>) = √(${f(GM / 1e14)} × 10<sup>14</sup> / ${f(3 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(V8 / 1000)} km/s</div><p><i>v</i> ∝ 1/√<i>r</i>，而不是 1/<i>r</i>； √2版本为逃逸速度。</p>` },
  ],
  9: [
    { q: `卫星的轨道从近地点 2 <i>R</i><sub>E</sub> 到远地点 4 <i>R</i><sub>E</sub>。在近地点，它的移动速度为 ${f(VP9 / 1000)} km/s。最高点的速度有多快？`,
      choices: [`${p3(VP9 * (RP9 / RA9) ** 2 / 1000)} km/s`, `${p3(VA9 / 1000)} km/s`, `${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s`, `${p3(2 * VP9 / 1000)} km/s`], answer: 1,
      why: `<p>关于地球的角动量守恒（重力对其没有力矩），并且在两端 <i>v</i> ⟂ <i>r</i>:</p><div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub> &nbsp;→ <i>v</i><sub>a</sub> = ${f(VP9 / 1000)} × 2/4 = ${p3(VA9 / 1000)} km/s</div><p>√(<i>GM</i>/<i>r</i>) 缩放比例 (${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s) 仅适用于<b>圆形</b>轨道.</p>` },
    { q: "对于椭圆轨道上的卫星，近地点和远地点哪个量相同？",
      choices: ["它的速度", "它的动能", "它关于地球中心的角动量", "其上的重力"], answer: 2,
      why: `<p>重力指向地球中心，因此不会对其施加力矩，并且 <i>L</i> = <i>mvr</i><sub>⊥</sub> 保持不变。近地点速度和动能最大；那里的力也最大（较小的<i>r</i>）。</p>` },
  ],
  10: [
    { q: `在页面轨道上，${m} kg 卫星在近地点有 <i>K</i> = ${GJ(KP)} GJ 和 <i>U</i> = ${GJ(UP)} GJ。在远地点 <i>U</i> = ${GJ(UA)} GJ。远地点的 <i>K</i> 是什么？`,
      choices: [`${p3(KP / 1e9)} GJ`, `${p3(KP / 3 / 1e9)} GJ`, `${p3(KA / 1e9)} GJ`, `${p3((KP - UP + UA) / 1e9)} GJ`], answer: 2,
      why: `<p>只有重力作用，是保守的，所以<i>K</i> + <i>U</i>两端相同：</p><div class="eq"><i>K</i><sub>a</sub> = <i>K</i><sub>p</sub> + <i>U</i><sub>p</sub> − <i>U</i><sub>a</sub> = ${GJ(KP)} + (${GJ(UP)}) − (${GJ(UA)}) = ${p3(KA / 1e9)} GJ</div><p>检查：速度的三分之一，动能的九分之一。 ${p3((KP - UP + UA) / 1e9)} GJ 来自负 <i>U</i> 上的符号滑。</p>` },
    { q: "当卫星从近地点爬升到远地点时，卫星-地球系统的能量会发生什么变化？",
      choices: ["K 减少，U 增加（负值减少），E 保持不变", "K 减小、U 减小、E 减小", "K 保持不变，U 增加，E 增加", "K 和 U 都增加，因此 E 增加"], answer: 0,
      why: `<p>爬出时，重力有一部分对<i>v</i>做负功，所以<i>K</i>掉下来。 <i>U</i> = −<i>GMm</i>/<i>r</i> 以相同的量向零上升。没有外力作用，所以 <i>E</i> = <i>K</i> + <i>U</i> 是常数。</p>` },
  ],
  11: [
    { q: `当 ${m} kg 卫星从 <i>r</i> = 4 <i>R</i><sub>E</sub> 落到 2 <i>R</i><sub>E</sub> 时，重力对它做了多少功？ (<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s²)`,
      choices: [`${p3(-W11 / 1e9)} GJ`, `${p3(W11 / 1e9)} GJ`, `${p3(m * G * 2 * RE / 1e9)} GJ`, `${p3(2 * W11 / 1e9)} GJ`], answer: 1,
      why: `<p>的力与<i>r</i>不同，所以积分。重力点向内，<i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²:</p><div class="eq"><i>W</i> = ∫<sub>4<i>R</i></sub><sup>2<i>R</i></sup> (−<i>GMm</i>/<i>r</i>²) d<i>r</i> = <i>GMm</i>[1/<i>r</i>]<sub>4<i>R</i></sub><sup>2<i>R</i></sup> = <i>GMm</i>/4<i>R</i> = ${p3(W11 / 1e9)} GJ</div><p>正：力和位移都指向。 <i>mgh</i> 与 <i>h</i> = 2<i>R</i><sub>E</sub> (${p3(m * G * 2 * RE / 1e9)} GJ) 假设 <i>g</i> 一直保持在 ${f(G)} m/s² 位置。</p>` },
    { q: `求当 ${m} kg 质量从地面上升到 <i>h</i> = ${f(H11 / 1000, 0)} km 时势能的确切变化，并将其与 <i>mgh</i> 进行比较，并显示分数差约为<i>h</i>/<i>R</i><sub>E</sub>。`,
      solution: `<p>1。 Δ<i>U</i> = −∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>F</i><sub>r</sub> d<i>r</i> = ∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>GMm</i>/<i>r</i>² d<i>r</i> = <i>GMm</i>(1/<i>R</i> − 1/(<i>R</i> + <i>h</i>)) = <i>GMmh</i> / [<i>R</i>(<i>R</i> + <i>h</i>)].</p><div class="eq">Δ<i>U</i> = ${f(DU11 / 1e9, 4)} GJ</div><p>2。对于 <i>g</i> = <i>GM</i>/<i>R</i>² = ${f(M.EARTH.g)} m/s²： <i>mgh</i> = <i>GMmh</i>/<i>R</i>² = ${f(MGH11 / 1e9, 4)} GJ.</p><p>3。比率：<i>mgh</i>/Δ<i>U</i> = (<i>R</i> + <i>h</i>)/<i>R</i> = 1 + <i>h</i>/<i>R</i> = 1 + ${f(H11 / 1000, 0)}/${f(RE / 1000, 0)} = ${f(MGH11 / DU11, 4)}。所以 <i>mgh</i> 是 ${f(100 * (MGH11 / DU11 - 1), 1)}% 高，因为它使 <i>g</i> 一直保持其表面价值。</p>` },
  ],
  12: [
    { q: `距地心 4 <i>R</i><sub>E</sub> 处的逃逸速度是多少？ (<i>GM</i><sub>E</sub> = ${f(GM / 1e14)} × 10<sup>14</sup> m³/s², <i>R</i><sub>E</sub> = ${f(RE / 1e6)} × 10<sup>6</sup> m)`,
      choices: [`${p3(M.orbitV(4 * RE) / 1000)} km/s`, `${p3(VE12 / 1000)} km/s`, `${p3(M.vEsc(RE) / 4 / 1000)} km/s`, `${p3(2 * M.orbitV(4 * RE) / 1000)} km/s`], answer: 1,
      why: `<p>要达到无穷大，<i>E</i> = ½<i>mv</i>² − <i>GMm</i>/<i>r</i> = 0:</p><div class="eq"><i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = √(2 × ${f(GM / 1e14)} × 10<sup>14</sup> / ${f(4 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(VE12 / 1000)} km/s</div><p>就是√2×那里的圆周速度(${p3(M.orbitV(4 * RE) / 1000)} km/s)，不是2×；它的缩放比例为 1/√<i>r</i>，而不是 1/<i>r</i>.</p>` },
    { q: `一颗 ${m} kg 卫星位于 <i>r</i> = 2 <i>R</i><sub>E</sub> 的圆形轨道上。证明 <i>K</i> = −<i>U</i>/2，然后找到它逃逸所需添加的最少能量，以及通过侧面燃烧实现这一目标的速度提升。`,
      solution: `<p>1。圆形轨道：<i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>，所以 <i>K</i> = ½<i>mv</i>² = <i>GMm</i>/2<i>r</i> = −<i>U</i>/2，且 <i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i>.</p><div class="eq"><i>E</i> = −${f(GM / 1e14)} × 10<sup>14</sup> × ${m} / (2 × ${f(R12 / 1e7, 3)} × 10<sup>7</sup>) = ${GJ(M.circE(R12))} GJ</div><p>2。逃生需要 <i>E</i> ≥ 0（相当于足够的 <i>K</i> 来提供工作 ∫<sub><i>r</i></sub><sup>∞</sup> <i>GMm</i>/<i>r</i>′² d<i>r</i>′ = <i>GMm</i>/<i>r</i> 对抗重力）。因此至少添加 ${GJ(-M.circE(R12))} GJ.</p><p>3。速度：<i>v</i><sub>c</sub> = √(<i>GM</i>/<i>r</i>) = ${f(M.orbitV(R12) / 1000)} 公里/秒，<i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = ${f(M.vEsc(R12) / 1000)} km/s，因此沿 <i>v</i>.</p> 增加 ${f((M.vEsc(R12) - M.orbitV(R12)) / 1000)} km/s` },
  ],
};
