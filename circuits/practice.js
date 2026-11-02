// circuits/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { CU, E_CH } = M;

// ---- page 0: drift speed in a round copper wire; charge from a changing current ----
const P0 = { I: 3.0, D: 2.0e-3 };
const vd = A => P0.I / (CU.n * E_CH * A);
P0.v = vd(Math.PI * (P0.D / 2) ** 2);
P0.nums = [P0.v, vd(Math.PI * P0.D ** 2), vd(P0.D ** 2), vd((P0.D / 2) ** 2)].map(x => x * 1e3);   // right · diameter as radius · A = D² · forgot π
const P0b = { a: 4.0, b: 1.0, T: 4.0 };                     // I = a t − b t² (A), 0 to T
P0b.q = P0b.a * P0b.T ** 2 / 2 - P0b.b * P0b.T ** 3 / 3;
P0b.Imax = P0b.a ** 2 / (4 * P0b.b);
P0b.nums = [P0b.Imax * P0b.T, P0b.Imax * P0b.T / 2, P0b.q, P0b.a * P0b.T ** 2 / 2];   // peak × time · triangle · right · dropped the t² term
// ---- page 1: the page's thin nichrome wire; a tapered one ----
const { rho } = M.RES, L1 = 2.0, rA = M.RES.dThin / 2, rB = M.RES.dThick / 2;
const P1 = { R: M.rThin(L1) };
P1.nums = [rho * L1 / (Math.PI * M.RES.dThin ** 2), rho * L1 / rA ** 2, P1.R, rho * L1 / M.RES.dThin ** 2];   // diameter as radius · forgot π · right · A = d²
const P1b = { R: rho * L1 / (Math.PI * rA * rB) };
P1b.nums = [rho * L1 / (Math.PI * ((rA + rB) / 2) ** 2), (M.rThin(L1) + M.rThick(L1)) / 2, M.rThin(L1), P1b.R];   // mean radius · mean of the ends · thin end only · right
// ---- page 2: a hollow carbon cylinder, current flowing radially ----
const P2 = { rho: 3.5e-5, a: 0.010, b: 0.020, L: 0.050 };
P2.R = P2.rho * Math.log(P2.b / P2.a) / (2 * Math.PI * P2.L);
P2.nums = [P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.a * P2.L), P2.R, P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.b * P2.L), P2.rho * P2.L / (Math.PI * (P2.b ** 2 - P2.a ** 2))].map(x => x * 1e5);
// inner area only · right · outer area only · current along the axis instead
// ---- page 3: two of the page's bulbs in series; a ramped voltage ----
const { E: VB, R: RB } = M.BULB;
const P3 = { P: VB ** 2 / (2 * RB) };
P3.nums = [2 * VB ** 2 / RB, VB ** 2 / RB, P3.P, VB ** 2 / (4 * RB)];   // parallel · one bulb · right · each bulb
const P3b = { T: 10 };
P3b.E = VB ** 2 / RB * P3b.T / 3;
P3b.nums = [VB ** 2 / RB * P3b.T / 2, P3b.E, VB ** 2 / RB * P3b.T, (VB / 2) ** 2 / RB * P3b.T];   // average P linear · right · full P · P at the average V
// ---- page 4: the page's cell on 4 Ω; what r is best ----
const { E: EC, r: rC } = M.CELL, RL4 = 4;
const P4 = { V: EC * RL4 / (RL4 + rC) };
P4.nums = [EC, EC * rC / (RL4 + rC), P4.V, EC / 2];                 // ideal · the Ir drop · right · half
// ---- page 5: strips side by side ----
const P5 = { R0: 12 };
P5.R = P5.R0 / 2;                                                    // σ averages 2σ₀ across the width
P5.nums = [P5.R0 * Math.log(3) / 2, P5.R0 / 3, P5.R, P5.R0];         // strips in series · edge at 3σ₀ · right · σ₀ throughout
// ---- page 6: the page's combination with R₃ broken; R₃ as a variable resistor ----
const CB = M.COMBO;
const P6 = { I: CB.E / (CB.R1 + CB.R245) };
P6.nums = [CB.E / CB.Req, P6.I, CB.E / CB.R1, CB.E / CB.R245];      // unchanged · right · R₁ only · the 8 Ω only
const P6b = { R: CB.R1 * CB.R245 / (CB.R1 + CB.R245) };
P6b.nums = [P6b.R, CB.R1, CB.R245, CB.R1 + CB.R245];                 // right · R₁ only · the branch only · in series
// ---- page 7: the page's network with the 6 V battery replaced by a wire ----
const K7 = M.KIRCH, R345 = 1 / (1 / K7.R5 + 1 / (K7.R3 + K7.R4));
const P7 = { I: K7.E1 / (K7.R1 + K7.R2 + R345) };
const I1now = M.edgeI(K7, M.solve(K7.edges, 'bl'), 'R1');
P7.nums = [I1now, P7.I, K7.E1 / (K7.R1 + K7.R2), K7.E1 / (K7.R1 + K7.R2 + K7.R3 + K7.R4)].map(x => x * 1e3);   // unchanged · right · R₅ a short · R₅ ignored
const P7b = { dI: 1 / 44, E2zero: -2.4 };                            // from the solution below; checked numerically
// ---- page 8: the page's RC circuit ----
const { E: ER, tau } = M.RC, V8 = 9.0;
const P8 = { t: -tau * Math.log(1 - V8 / ER) };
P8.nums = [tau * Math.log(ER / V8), P8.t, tau * V8 / ER, tau];   // ln upside down · right · linear · τ
const P8b = { f: 1 - Math.exp(-2) };
P8b.nums = [(1 - Math.exp(-1)) * 100, P8b.f * 100, Math.exp(-1) * 100, 50];   // used e^(−t/RC) for the energy · right · what's left of q · half

export const PRACTICE = {
  0: [
    { q: `一根<b>直径</b> ${p(P0.D * 1e3, 1)} mm的铜线载有${p(P0.I, 1)} A (<i>n</i> = 8.5 × 10<sup>28</sup> m<sup>−3</sup>)。其电子的漂移速度为`,
      choices: P0.nums.map(x => `${p(x, 4)} mm/s`), answer: 0, nums: P0.nums,
      why: `<p><b>半径</b>的面积：<i>A</i> = π(${p(P0.D / 2 * 1e3, 1)} mm)<sup>2</sup> = ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)} mm²。则</p><div class="eq"><i>v</i><sub>d</sub> = <i>I</i>/<i>neA</i> = ${P0.I} / (8.5×10<sup>28</sup> × 1.60×10<sup>−19</sup> × ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)}×10<sup>−6</sup>) = ${p(P0.v * 1e3, 4)} mm/s</div><p>使用直径作为半径给出${p(P0.nums[1], 4)} mm/s，慢四倍。</p>` },
    { q: `导线中的电流为 <i>I</i>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i> − ${p(P0b.b, 1)}<i>t</i><sup>2</sup>（A、<i>t</i>，单位为 s）从 <i>t</i> = 0 到 ${p(P0b.T, 1)} s。通过横截面的电荷为`,
      choices: P0b.nums.map(x => `${p(x, 1)} C`), answer: 2, nums: P0b.nums,
      why: `<div class="eq"><i>q</i> = ∫<i>I dt</i> = ∫<sub>0</sub><sup>${P0b.T}</sup> (${P0b.a}<i>t</i> − <i>t</i><sup>2</sup>) <i>dt</i> = ${p(P0b.a / 2, 0)}(${P0b.T})<sup>2</sup> − (${P0b.T})<sup>3</sup>/3 = ${p(P0b.a * P0b.T ** 2 / 2, 0)} − ${p(P0b.b * P0b.T ** 3 / 3, 2)} = ${p(P0b.q, 1)} C</div><p> 下的面积<i>I</i>(<i>t</i>)，抛物线峰值位于${p(P0b.Imax, 0)} A。峰值×时间(${p(P0b.nums[0], 1)} C)超算；三角形 (${p(P0b.nums[1], 1)} C) 计数不足。</p>` },
  ],
  1: [
    { q: `页面的细镍铬合金丝（ρ = 1.10 × 10<sup>−6</sup> Ω·m，<b>直径</b> ${p(M.RES.dThin * 1e3, 1)} mm）长为${p(L1, 1)} m。其电阻为`,
      choices: P1.nums.map(x => `${p(x, 2)} Ω`), answer: 2, nums: P1.nums,
      why: `<div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = ρ<i>L</i>/π<i>r</i><sup>2</sup> = 1.10×10<sup>−6</sup> × ${L1} / (π × (${p(rA * 1e3, 2)}×10<sup>−3</sup>)<sup>2</sup>) = ${p(P1.R, 2)} Ω</div><p>半径为直径的一半；使用直径给出四分之一的答案，${p(P1.nums[0], 2)} Ω.</p>` },
    { q: `${p(L1, 1)} m 镍铬合金棒是锥形的：其半径从一端的 ${p(rA * 1e3, 2)} mm 线性增长到另一端的 ${p(rB * 1e3, 2)} mm。其首尾电阻为`,
      choices: P1b.nums.map(x => `${p(x, 2)} Ω`), answer: 3, nums: P1b.nums,
      why: `<p>切片<i>dx</i>是串联的；每个都有 <i>dR</i> = ρ <i>dx</i>/π<i>r</i>(<i>x</i>)<sup>2</sup>，其中 <i>r</i> = <i>a</i> + (<i>b</i> − <i>a</i>)<i>x</i>/<i>L</i>，所以 <i>dx</i> = <i>L dr</i>/(<i>b</i> − <i>a</i>):</p><div class="eq"><i>R</i> = (ρ<i>L</i>/π(<i>b</i> − <i>a</i>)) ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = ρ<i>L</i>/π<i>ab</i> = ${p(P1b.R, 2)} Ω</div><p> 不是平均半径 (${p(P1b.nums[0], 2)} Ω) 也不是最终值的平均值 (${p(P1b.nums[1], 2)} Ω)：细端占主导地位，但不是完全.</p>` },
  ],
  2: [
    { q: "在该页的电路中（6 V 电池、3 Ω 电阻、理想导线），连接电池 + 端子和电阻的导线两端之间的电势差是多少？",
      choices: ['6 V', '3 V', '2 V', '0 V'], answer: 3,
      why: "<p>理想的导线具有 <i>R</i> = 0，因此无论电流如何，沿着它的 Δ<i>V</i> = <i>IR</i> = 0。该电线的每一点都处于电池的+电势；整个 6 V 压降发生在电阻器上。</p>" },
    { q: `碳管（ρ = ${p(P2.rho * 1e5, 1)} × 10<sup>−5</sup> Ω·m），内半径 ${p(P2.a * 100, 0)} cm，外径 ${p(P2.b * 100, 0)} cm，长度 ${p(P2.L * 100, 0)} cm，有电流流过<b>从内表面到外径向</b>。其电阻为`,
      choices: P2.nums.map(x => `${p(x, 2)} × 10<sup>−5</sup> Ω`), answer: 1, nums: P2.nums,
      why: `<p>薄壁圆柱壳系列；每个沿电流的长度为 <i>dr</i>，面积为 2π<i>rL</i>:</p><div class="eq"><i>R</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> ρ <i>dr</i>/2π<i>rL</i> = (ρ/2π<i>L</i>) ln(<i>b</i>/<i>a</i>) = ${p(P2.R * 1e5, 2)} × 10<sup>−5</sup> Ω</div><p>面积随着<i>r</i>的增长而增长，因此内部面积也不会增长(${p(P2.nums[0], 2)}) 也不外 (${p(P2.nums[2], 2)}) 是正确的。</p>` },
  ],
  3: [
    { q: `该页面的两个灯泡（每个 ${RB} Ω）在 <b> 系列 </b> 中通过 ${VB} V 电池连接。他们使用的总功率是`,
      choices: P3.nums.map(x => `${p(x, 1)} W`), answer: 2, nums: P3.nums,
      why: `<p>串联<i>R</i><sub>eq</sub> = ${2 * RB} Ω，所以</p><div class="eq"><i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i><sub>eq</sub> = ${VB}<sup>2</sup>/${2 * RB} = ${p(P3.P, 1)} W</div><p>H 一个灯泡的一半 (${p(P3.nums[1], 1)} W)：电流减半，每个灯泡获得四分之一的功率 (${p(P3.nums[3], 1)} W)。同时他们将使用 ${p(P3.nums[0], 1)} W.</p>` },
    { q: `${RB} Ω 电阻两端的电压在 ${P3b.T} s 内从 0 稳定上升到 ${VB} V。此时它转化为热能的能量为`,
      choices: P3b.nums.map(x => `${p(x, 1)} J`), answer: 1, nums: P3b.nums,
      why: `<p>与 Δ<i>V</i> = (${VB}/${P3b.T})<i>t</i>, <i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i> 随着 <i>t</i><sup>2</sup>:</p><div class="eq"><i>E</i> = ∫<i>P dt</i> = ∫<sub>0</sub><sup><i>T</i></sup> (${VB}<i>t</i>/${P3b.T})<sup>2</sup>/${RB} <i>dt</i> = (${VB}<sup>2</sup>/${RB})·<i>T</i>/3 = ${p(P3b.E, 1)} J</div><p>线性平均<i>P</i> (${p(P3b.nums[0], 1)} J) 或使用平均电压 (${p(P3b.nums[3], 1)} J) 会忽略 <i>P</i> 是 Δ<i>V</i>.</p> 的二次方` },
  ],
  4: [
    { q: `该页面的电池（ℰ = ${EC} V，<i>r</i> = ${rC} Ω）驱动 ${RL4} Ω 灯泡。电池端子之间的电势差为`,
      choices: P4.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P4.nums,
      why: `<div class="eq"><i>I</i> = ℰ/(<i>R</i> + <i>r</i>) = ${EC}/${RL4 + rC} = ${p(EC / (RL4 + rC), 1)} A, &nbsp; Δ<i>V</i> = ℰ − <i>Ir</i> = ${EC} − ${p(EC / (RL4 + rC) * rC, 1)} = ${p(P4.V, 1)} V</div><p>电动势仅是无电流流过时的端电压； ${p(P4.nums[1], 1)} V 是下降 <i>inside</i> 电池。</p>` },
    { q: `现在灯泡固定在 <i>R</i> = ${RL4} Ω，可选择电池内阻 <i>r</i> （同样ℰ）。哪个 <i>r</i> 使灯泡最亮？`,
      choices: [`<i>r</i> = ${2 * RL4} Ω`, `<i>r</i> = ${RL4} Ω，匹配负载`, `<i>r</i> = ${RL4 / 2} Ω`, '<i>r</i> = 0'], answer: 3,
      why: `<p><i>P</i> = ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>2</sup>，现在 <i>r</i> 是变量：</p><div class="eq"><i>dP</i>/<i>dr</i> = −2ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>3</sup> < 0</div><p>对于每一个 <i>r</i>, so <i>P</i> 最大是最小的 <i>r</i>： 零。 <i>R</i> = <i>r</i> 最大化功率时 <b>负载</b> 随电池固定而变化，而不是相反。</p>` },
  ],
  5: [
    { q: "第四个电阻器与理想 9 V 电池上的 2、4 和 6 Ω 并联。 (i) 2 Ω 支路中的电流和 (ii) 来自电池的电流会发生什么情况？",
      choices: ["(i) 增加； (二) 增加", "(i) 保持不变； (二) 增加", "(i) 减少； (二) 增加", "(i) 减少； (ii) 保持不变"], answer: 1,
      why: "<p>每个分支仍然跨越完整的 9 V，因此 2 Ω 分支保持 9/2 = 4.5 A。新分支添加自己的电流，电池提供总和：更多路径，更低 <i>R</i><sub>eq</sub>，更多的总电流。 （由于内阻，端电压会下降，支路电流也会略有下降。）</p>" },
    { q: `由均匀电导率 σ 制成的棒<sub>0</sub> 会有抵抗力 ${P5.R0} Ω 端到端。相反，其电导率呈线性上升 <b>横跨其宽度</b>，从 σ<sub>0</sub> 一侧边缘至 3σ<sub>0</sub> 在另一个。其首尾电阻为`,
      choices: P5.nums.map(x => `${p(x, 2)} Ω`), answer: 2, nums: P5.nums,
      why: `<p>宽度的纵向条带 <i>dy</i> 全部跨越相同的两端：它们在 <b>平行</b>，因此它们的电导相加：</p><div class="eq">1/<i>R</i> = ∫<sub>0</sub><sup><i>w</i></sup> σ(<i>y</i>)<i>t dy</i>/<i>L</i> = (σ<sub>0</sub><i>wt</i>/<i>L</i>)·∫<sub>0</sub><sup>1</sup>(1 + 2<i>u</i>) <i>du</i> = 2/<i>R</i><sub>0</sub></div><p><i>R</i> = ${P5.R0}/2 = ${p(P5.R, 2)} Ω。像串联一样添加条带给出 (ln 3/2)<i>R</i><sub>0</sub> = ${p(P5.nums[0], 2)} Ω.</p>` },
  ],
  6: [
    { q: `在页面的组合中 (9 V; R<sub>1</sub> = 2 Ω, R<sub>3</sub> = 2 Ω, R<sub>2</sub> + R<sub>4</sub> + R<sub>5</sub> = ${CB.R245} Ω), R<sub>3</sub> 烧坏（开路）。通过R的电流<sub>1</sub> 变成`,
      choices: P6.nums.map(x => `${p(x, 2)} A`), answer: 1, nums: P6.nums,
      why: `<p>随着R<sub>3</sub>消失，R<sub>1</sub>和${CB.R245} Ω串简单地串联：</p><div class="eq"><i>I</i> = 9 V / (2 + ${CB.R245}) Ω = ${p(P6.I, 2)} A</div><p> 小于 ${p(P6.nums[0], 2)} 之前的 A：删除并行路径 <i>raises</i> <i>R</i><sub>eq</sub>.</p>` },
    { q: "R<sub>3</sub>替换为可变电阻<i>x</i>；其他一切都保留。 <i>x</i>里面的功率最大是多少？",
      choices: P6b.nums.map(x => `${p(x, 1)} Ω`), answer: 0, nums: P6b.nums,
      why: `<p>从<i>x</i>看，剩下的是带电池的R<sub>1</sub>，与${CB.R245}的Ω串并联。去掉 <i>x</i> 后的电压为 ℰ<sub>th</sub> = 9 × ${CB.R245}/${CB.R1 + CB.R245} = ${p(9 * CB.R245 / (CB.R1 + CB.R245), 1)} V，其电阻<i>R</i><sub>th</sub> = 2 × ${CB.R245}/(2 + ${CB.R245}) = ${p(P6b.R, 1)} Ω。则</p><div class="eq"><i>P</i>(<i>x</i>) = ℰ<sub>th</sub><sup>2</sup><i>x</i>/(<i>R</i><sub>th</sub> + <i>x</i>)<sup>2</sup>, &nbsp; <i>dP</i>/<i>dx</i> = 0 → <i>x</i> = <i>R</i><sub>th</sub> = ${p(P6b.R, 1)} Ω</div><p>R<sub>1</sub> 单独 (2 Ω) 会忽略 ${CB.R245} Ω 字符串也通过 <i>x</i>.</p> 连接` },
  ],
  7: [
    { q: `在该页面的网络中，${K7.E2} V 电池被普通电线取代。通过${K7.E1} V电池（<i>I</i><sub>1</sub>）的电流变为`,
      choices: P7.nums.map(x => `${p(x, 0)} mA`), answer: 1, nums: P7.nums,
      why: `<p> 剩下一节电池时，网络减少： R<sub>3</sub> + R<sub>4</sub> = ${K7.R3 + K7.R4} 与 R<sub>5</sub> 并联 Ω = ${K7.R5} Ω 给出 ${p(R345, 3)} Ω，与 R<sub>1</sub> + R<sub>2</sub> = ${K7.R1 + K7.R2} 串联Ω：</p><div class="eq"><i>I</i><sub>1</sub> = ${K7.E1} V / ${p(K7.R1 + K7.R2 + R345, 3)} Ω = ${p(P7.I * 1e3, 0)} mA</div><p>从${p(I1now * 1e3, 0)} mA向下：通过叠加，6V电池（+端在底部）已经将${p((I1now - P7.I) * 1e3, 0)} mA添加到<i>I</i><sub>1</sub>。将 R<sub>5</sub> 视为短路，可得到 ${p(P7.nums[2], 0)} mA；忽略它，${p(P7.nums[3], 0)} mA.</p>` },
    { q: `免费回复。在页面的网络中，将第二个电池的电动势 ℰ<sub>2</sub>（+ 位于底部，如图所示）视为变量。使用页面的两个循环方程和 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>，找到<i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub>，以及ℰ<sub>2</sub> <i>I</i><sub>3</sub> = 0。`,
      solution: `<p>循环 1: 20<i>I</i><sub>1</sub> + 5<i>I</i><sub>2</sub> = 12. 循环 2: 40<i>I</i><sub>3</sub> − 5<i>I</i><sub>2</sub> = ℰ<sub>2</sub>。将 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub> 放入循环中1：</p><div class="eq">25<i>I</i><sub>2</sub> + 20<i>I</i><sub>3</sub> = 12 &nbsp;→&nbsp; <i>I</i><sub>2</sub> = (12 − 20<i>I</i><sub>3</sub>)/25</div><div class="eq">40<i>I</i><sub>3</sub> − (12 − 20<i>I</i><sub>3</sub>)/5 = ℰ<sub>2</sub> &nbsp;→&nbsp; <i>I</i><sub>3</sub> = (ℰ<sub>2</sub> + 2.4)/44</div><p>所以<i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub> = 1/44 A/V = ${p(P7b.dI * 1e3, 1)} mA 每伏：电路是线性的，因此这对于每个ℰ<sub>2</sub>。在 ℰ<sub>2</sub> = 6 V 时，<i>I</i><sub>3</sub> = 8.4/44 = ${p(8.4 / 44, 3)} A，页面的值。 <i>I</i><sub>3</sub> = 0 at ℰ<sub>2</sub> = ${p(P7b.E2zero, 1)} V：2.4 V 电池，+ 端位于 <b>最高点</b>，这正是平衡 12 V 电池对 R<sub>5</sub>.</p> 的推动`, val: P7b },
  ],
  8: [
    { q: `在页面的RC电路中（ℰ = ${ER} V，τ = <i>RC</i> = ${p(tau, 1)} s），从空载开始，多久电容电压达到${p(V8, 1)} V？`,
      choices: P8.nums.map(x => `${p(x, 2)} s`), answer: 1, nums: P8.nums,
      why: `<div class="eq">Δ<i>V</i><sub>C</sub> = ℰ(1 − e<sup>−<i>t</i>/τ</sup>) &nbsp;→&nbsp; <i>t</i> = −τ ln(1 − Δ<i>V</i><sub>C</sub>/ℰ) = ${p(tau, 1)} s × ln ${p(ER / (ER - V8), 0)} = ${p(P8.t, 2)} s</div><p>非线性（${p(P8.nums[2], 2)} s）：随着电容器充满，充电速度减慢。 1个τ仅达到${ER} V.</p>的63%` },
    { q: "现在满电容通过 <i>R</i> 放电。经过一个时间常数后，<i>R</i> 中存储的能量的哪一部分变成了热量？",
      choices: P8b.nums.map(x => `${p(x, 1)} %`), answer: 1, nums: P8b.nums,
      why: `<p>的电流为<i>I</i><sub>0</sub>e<sup>−<i>t</i>/τ</sup>，所以功率<i>I</i><sup>2</sup><i>R</i> 衰减速度是原来的两倍：</p><div class="eq"><i>E</i> = ∫<sub>0</sub><sup>τ</sup> <i>I</i><sub>0</sub><sup>2</sup><i>R</i> e<sup>−2<i>t</i>/τ</sup> <i>dt</i> = ½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ(1 − e<sup>−2</sup>) = <i>U</i><sub>0</sub>(1 − e<sup>−2</sup>)</div><p>(½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ = <i>Q</i><sup>2</sup>/2<i>C</i> = <i>U</i><sub>0</sub>。） 所以 ${p(P8b.f * 100, 1)} %。电量已降至 36.8 %，但能量为 <i>q</i><sup>2</sup>：仅剩下 e<sup>−2</sup> = ${p(Math.exp(-2) * 100, 1)} %。</p>` },
  ],
};
