// capacitors/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { EPS0, K, C0, V0, Q0, U0, PLATE } = M;
const A = PLATE.A, d = PLATE.d;

// ---- page 0: the battery turned up steadily from 20 V to 100 V in 4.0 s ----
const P0 = { V1: 20, V2: 100, dt: 4.0 };
P0.I = C0 * (P0.V2 - P0.V1) / P0.dt;
P0.nums = [C0 * P0.V2 / P0.dt, P0.I, P0.I / 2, C0 * P0.V1 / P0.dt].map(x => x * 1e12);   // final V not ΔV · right · halved · starting V
// ---- page 1: isolated plates pulled from 5 cm to 8 cm; the force between them ----
const P1 = { d2: 0.08 };
P1.V = Q0 / M.cPlate(A, P1.d2);
P1.nums = [V0 * d / P1.d2, V0, V0 * (P1.d2 / d) ** 2, P1.V];        // ΔV ∝ 1/d · battery's · ∝ d² · right
P1.F = Q0 * Q0 / (2 * EPS0 * A);
P1.fnums = [Q0 * M.E0, P1.F, K * Q0 * Q0 / d ** 2, P1.F / 2].map(x => x * 1e6);   // full field σ/ε₀ · right · point charges · ¼
// ---- page 2: the page's spheres, a = 10 cm, b = 20 cm, 100 V ----
const { a: sa, b: sb } = M.SPH, r2 = 0.15;
const P2 = { E: K * M.SPH.Q / r2 ** 2 };
P2.nums = [V0 / (sb - sa), K * M.SPH.Q / sb ** 2, P2.E, K * M.SPH.Q / sa ** 2];   // as if plates · used b · right · used a
P2.dV = V0 * (1 / sa - 1 / r2) / (1 / sa - 1 / sb);
P2.vnums = [P2.dV, V0 * (r2 - sa) / (sb - sa), V0 - P2.dV, V0 * (1 / sa ** 2 - 1 / r2 ** 2) / (1 / sa ** 2 - 1 / sb ** 2)];   // right · linear · the other part · 1/r² for V
// ---- page 3: the page's coax; the tube widened to 16 cm; where the energy is ----
const { a: ca, b: cb, L: cL } = M.CYL, cb2 = 2 * cb;
const P3 = { C: 2 * Math.PI * EPS0 * cL / Math.log(cb2 / ca) };
P3.nums = [M.CYL.C / 2, M.CYL.C, P3.C, M.CYL.C / 4].map(x => x * 1e12);   // C ∝ 1/b · unchanged · right · 1/b²
P3.frac = Math.log(2) / Math.log(cb / ca);
P3.fnums = [((2 * ca) ** 2 - ca ** 2) / (cb ** 2 - ca ** 2), ca / (cb - ca), (1 / ca ** 2 - 1 / (2 * ca) ** 2) / (1 / ca ** 2 - 1 / cb ** 2), P3.frac].map(x => x * 100);   // by volume · by radius · E² not E²r · right
// ---- page 4: the second half of the charge; the gap halved on the battery ----
const P4 = { frac: 1 - 0.25 };
P4.nums = [25, 50, P4.frac * 100, 87.5];
const P4b = { d2: d / 2 };
P4b.U = 0.5 * M.cPlate(A, P4b.d2) * V0 * V0;
P4b.nums = [U0 / 2, U0, 4 * U0, P4b.U].map(x => x * 1e9);           // as if Q fixed · unchanged · ×4 · right
// ---- page 5: 2 µF and 4 µF in series on 9 V ----
const { C1, C2, V: CV } = M.CIRC, S = M.SER;
const P5 = { V1: S.Q / C1 };
P5.nums = [P5.V1, CV * C1 / (C1 + C2), CV, CV / 2];                // right · split the wrong way · all of it · halves
P5.U = S.Q * S.Q / 2 * (1 / C1 + 1 / C2);
P5.unums = [S.Q * CV, M.PAR.U, S.Q * S.Q / (2 * C1), P5.U].map(x => x * 1e6);   // forgot ½ · parallel · C₁ only · right
// ---- page 6: the κ = 3 slab, plates isolated; a graded dielectric ----
const KA = M.KAPPA;
const P6 = { V: V0 / KA };
P6.nums = [V0 * KA, P6.V, V0, V0 / KA ** 2];
const P6b = { k1: 1, k2: 3 };
P6b.C = EPS0 * A * (P6b.k2 - P6b.k1) / (d * Math.log(P6b.k2 / P6b.k1));      // the free-response answer
// ---- page 7: slab fully in, battery on; half in, battery off ----
const P7 = { dQ: (KA - 1) * Q0 };
P7.nums = [KA * Q0, Q0, Q0 * (1 - 1 / KA), P7.dQ].map(x => x * 1e12);  // total not added · Q₀ · wrong way · right
const P7b = { x: 0.5, side: PLATE.side };
P7b.F = U0 * (KA - 1) / (P7b.side * (1 + (KA - 1) * P7b.x) ** 2);
P7b.nums = [U0 * (KA - 1) / P7b.side, P7b.F, U0 * (KA - 1) / (P7b.side * (1 + (KA - 1) * P7b.x)), U0 / (P7b.side * (1 + (KA - 1) * P7b.x) ** 2)].map(x => x * 1e9);   // V held · right · C not C² · no (κ − 1)
// ---- page 8: the induced charge on one half of the sphere ----
const { R: cR, E0: cE } = M.COND, sMax = 3 * EPS0 * cE;
const P8 = { q: sMax * Math.PI * cR * cR };
P8.nums = [sMax * 2 * Math.PI * cR * cR, 0, sMax * 4 * Math.PI * cR * cR, P8.q].map(x => x * 1e9);   // σ_max × half the area · total · whole area · right

const pF = x => `${p(x, 1)} pF`;

export const PRACTICE = {
  0: [
    { q: "电容器两端的电池从 Δ<i>V</i> 增大到 3Δ<i>V</i>。每个板上的电容 <i>C</i> 和电荷 <i>Q</i> 哪一个是正确的？",
      choices: ["<i>C</i> 三元组； <i>Q</i>不变", "<i>C</i>不变； <i>Q</i> 三元组", "<i>C</i>不变； <i>Q</i> 变大9倍", "<i>C</i>跌至第三； <i>Q</i>不变"], answer: 1,
      why: "<p><i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i> 仅取决于板和间隙，因此它保持不变。那么<i>Q</i> = <i>C</i>Δ<i>V</i> 按比例增长：3倍。 <b>能量</b> ½<i>C</i>Δ<i>V</i><sup>2</sup> 上涨了 9 倍。</p>" },
    { q: `该页面的极板（<i>C</i> = ${p(C0 * 1e12, 2)} pF）位于电池上，在 ${p(P0.dt, 1)} s 中从 ${P0.V1} V 稳定上升到 ${P0.V2} V。同时+板上的电流为`,
      choices: P0.nums.map(x => `${p(x, 1)} pA`), answer: 1, nums: P0.nums,
      why: `<p> 将 <i>Q</i> = <i>C</i>Δ<i>V</i> 与 <i>C</i> 常量微分：</p><div class="eq"><i>I</i> = <i>dQ</i>/<i>dt</i> = <i>C</i> <i>d</i>(Δ<i>V</i>)/<i>dt</i> = ${p(C0 * 1e12, 2)} pF × ${p((P0.V2 - P0.V1) / P0.dt, 0)} V/s = ${p(P0.I * 1e12, 1)} pA</div><p> 仅 <b> 电压变化率 </b> 计数：${P0.V2} V / ${p(P0.dt, 1)} s (${p(P0.nums[0], 1)} pA) 将电压与其变化混合。</p>` },
  ],
  1: [
    { q: `该页面的极板以 ${p(d * 100, 0)} cm 间隙充电至 ${V0} V，然后断开连接。将板拉开至 ${p(P1.d2 * 100, 0)} 厘米。现在的潜在差异是`,
      choices: P1.nums.map(x => `${p(x, 1)} V`), answer: 3, nums: P1.nums,
      why: `<p>断开，<i>Q</i> 固定，因此 σ 和 <i>E</i> = σ/ε<sub>0</sub> = ${p(M.E0, 0)} V/m 保持不变。仅距离增长：</p><div class="eq">Δ<i>V</i> = <i>Ed</i> = ${p(M.E0, 0)} V/m × ${p(P1.d2, 2)} m = ${p(P1.V, 1)} V</div><p> 等价<i>C</i> 下降到其值的 ${p(d * 100, 0)}/${p(P1.d2 * 100, 0)}，并且 Δ<i>V</i> = <i>Q</i>/<i>C</i> 反向上升。仅当电池仍处于连接状态时，${V0} V 才会保持不变。</p>` },
    { q: `当 <i>Q</i> 固定时，页面板的能量为 <i>U</i>(<i>x</i>) = <i>Q</i><sup>2</sup><i>x</i>/2ε<sub>0</sub><i>A</i> 间隙 <i>x</i>。当 <i>Q</i> = ${p(Q0 * 1e12, 0)} pC 和 <i>A</i> = ${p(A, 2)} m² 时，板之间的吸引力为`,
      choices: P1.fnums.map(x => `${p(x, 3)} µN`), answer: 1, nums: P1.fnums,
      why: `<p>该力减去固定电荷时能量的斜率：</p><div class="eq"><i>F</i> = −<i>dU</i>/<i>dx</i> = −<i>Q</i><sup>2</sup>/2ε<sub>0</sub><i>A</i> = −(${p(Q0 * 1e12, 0)}×10<sup>−12</sup> C)<sup>2</sup> / (2 × ${EPS0} × ${p(A, 2)}) = −${p(P1.F * 1e6, 3)} µN</div><p> 负号意味着它缩小了差距。每个板块都位于 <b>另一个</b> 板块的场中，σ/2ε<sub>0</sub>，因此 <i>F</i> = <i>Q</i>(σ/2ε<sub>0</sub>)；使用全间隙场 σ/ε<sub>0</sub> 将其加倍为 ${p(P1.fnums[0], 3)} µN.</p>` },
  ],
  2: [
    { q: `在页面的球形电容器（<i>a</i> = ${sa * 100} cm，<i>b</i> = ${sb * 100} cm，Δ<i>V</i> = ${V0} V）上，<i>r</i> = ${r2 * 100} cm处的场强是`,
      choices: P2.nums.map(x => `${p(x, 0)} V/m`), answer: 2, nums: P2.nums,
      why: `<p><i>Q</i> = <i>C</i>Δ<i>V</i> = ${p(M.SPH.C * 1e12, 1)} pF × ${V0} V = ${p(M.SPH.Q * 1e9, 3)} nC，高斯给出了球体：</p><div class="eq"><i>E</i> = <i>kQ</i>/<i>r</i><sup>2</sup> = ${p(K / 1e9, 2)}×10<sup>9</sup> × ${p(M.SPH.Q * 1e9, 3)}×10<sup>−9</sup> / ${r2}<sup>2</sup> = ${p(P2.E, 0)} V/m</div><p>Δ<i>V</i>/(<i>b</i> − <i>a</i>) = ${p(P2.nums[0], 0)} V/m 仅适用于均匀场；这里 <i>E</i> 为 1/<i>r</i><sup>2</sup>.</p>` },
    { q: `球体之间的 ${V0} V 中，从 <i>r</i> = ${sa * 100} cm 到 ${r2 * 100} cm 跨越间隙的内半部分是多少？`,
      choices: P2.vnums.map(x => `${p(x, 1)} V`), answer: 0, nums: P2.vnums,
      why: `<p> 对每个部分积分 <i>E</i> = <i>kQ</i>/<i>r</i><sup>2</sup>； <i>kQ</i>抵消比例：</p><div class="eq">Δ<i>V</i><sub>inner</sub> / Δ<i>V</i> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> ÷ ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = (1/<i>a</i> − 1/<i>r</i>)/(1/<i>a</i> − 1/<i>b</i>) = (${p(1 / sa, 2)} − ${p(1 / r2, 2)})/(${p(1 / sa, 2)} − ${p(1 / sb, 2)}) =${p(P2.dV / V0, 3)}</div><p>所以${p(P2.dV, 1)} V.球附近场强最强，所以内半占一半以上； ${p(P2.vnums[1], 1)} V 假设均匀场。</p>` },
  ],
  3: [
    { q: `页面的同轴电缆（<i>a</i> = ${ca * 100} cm，<i>b</i> = ${cb * 100} cm，<i>L</i> = ${cL * 100} cm，<i>C</i> = ${p(M.CYL.C * 1e12, 1)} pF）获得更宽的管， <i>b</i> = ${cb2 * 100} 厘米。其电容变为`,
      choices: P3.nums.map(pF), answer: 2, nums: P3.nums,
      why: `<div class="eq"><i>C</i> = 2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>) = 2π × ${EPS0} × ${cL} / ln(${cb2 * 100}/${ca * 100}) = ${p(P3.C * 1e12, 1)} pF</div><p>ln 4 → ln 8 只有 3/2 大，因此 <i>C</i> 降至 ${p(M.CYL.C * 1e12, 1)} pF 的 2/3，而不是一半： <i>C</i>仅通过对数依赖于<i>b</i>。</p>` },
    { q: `页面的同轴电缆（<i>a</i> = ${ca * 100} cm、<i>b</i> = ${cb * 100} cm）已收费。其存储能量的多少部分位于轴的 ${2 * ca * 100} cm 范围内（<i>r</i> = ${ca * 100} 和 ${2 * ca * 100} cm 之间）？`,
      choices: P3.fnums.map(x => `${p(x, 1)} %`), answer: 3, nums: P3.fnums,
      why: `<p>能量密度乘以体积为2π<i>rL dr</i>的薄壳，其中<i>E</i> = λ/2πε<sub>0</sub><i>r</i>:</p><div class="eq"><i>dU</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup> · 2π<i>rL dr</i> = (λ<sup>2</sup><i>L</i>/4πε<sub>0</sub>) <i>dr</i>/<i>r</i></div><div class="eq">fraction = ln(2<i>a</i>/<i>a</i>) / ln(<i>b</i>/<i>a</i>) = ln 2 / ln 4 = ${p(P3.frac, 3)}</div><p><i>r</i> 的每次加倍保持相同的能量。按体积计算，仅为 ${p(P3.fnums[0], 1)} %；靠近杆的场强得多。</p>` },
  ],
  4: [
    { q: "通过携带小位 <i>dq</i>，电容器从 0 充电到 <i>Q</i>。将 <b>第二</b> 一半的电荷从 <i>Q</i>/2 移动到 <i>Q</i> 花费了总工作量的多少？",
      choices: P4.nums.map(x => `${p(x, 1)} %`), answer: 2, nums: P4.nums,
      why: "<p>Each <i>dq</i> 成本 Δ<i>V</i> <i>dq</i> = (<i>q</i>/<i>C</i>) <i>dq</i>,所以</p><div class=\"eq\"><i>W</i> = ∫<sub><i>Q</i>/2</sub><sup><i>Q</i></sup> (<i>q</i>/<i>C</i>) <i>dq</i> = (<i>Q</i><sup>2</sup> − <i>Q</i><sup>2</sup>/4)/2<i>C</i> = ¾ · <i>Q</i><sup>2</sup>/2<i>C</i></div><p>75%。后面的位需要更大的电压，因此成本更高； 50% 对待每一点都一视同仁。</p>" },
    { q: `该页面的极板保留在 ${V0} V 电池上 (<i>U</i> = ${p(U0 * 1e9, 1)} nJ)，而间隙减半为 ${p(P4b.d2 * 100, 1)} cm。储存的能量变成`,
      choices: P4b.nums.map(x => `${p(x, 1)} nJ`), answer: 3, nums: P4b.nums,
      why: `<p>已连接，Δ<i>V</i>固定； <i>C</i> = ε<sub>0</sub><i>A</i>/<i>d</i> 双打：</p><div class="eq"><i>U</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup> = 2<i>U</i><sub>0</sub> = ${p(P4b.U * 1e9, 1)} nJ</div><p>或按密度：<i>E</i> = Δ<i>V</i>/<i>d</i> 加倍， ½ε<sub>0</sub><i>E</i><sup>2</sup>变为×4，体积减半。 ${p(P4b.nums[0], 1)} nJ 是答案，而 <i>Q</i> 已修复（电池关闭）。</p>` },
  ],
  5: [
    { q: `本页的 ${C1 * 1e6} µF 和 ${C2 * 1e6} µF 电容器属于 ${CV} V 上的 <b> 系列 </b>。${C1 * 1e6} µF 电容器两端的电压为`,
      choices: P5.nums.map(x => `${p(x, 1)} V`), answer: 0, nums: P5.nums,
      why: `<p>In系列均具有相同的<i>Q</i> = <i>C</i><sub>eq</sub>Δ<i>V</i> = ${p(S.C * 1e6, 3)} µF × ${CV} V = ${p(S.Q * 1e6, 0)} µC，所以</p><div class="eq">Δ<i>V</i><sub>1</sub> = <i>Q</i>/<i>C</i><sub>1</sub> = ${p(S.Q * 1e6, 0)} µC / ${C1 * 1e6} µF = ${p(P5.V1, 1)} V</div><p>，<b> 较小，</b> 电容占据较大份额； ${p(P5.nums[1], 1)} V 以错误的方式将其分开。</p>` },
    { q: `从空充电该系列对，完成的功为 ∫ (<i>q</i>/<i>C</i><sub>1</sub> + <i>q</i>/<i>C</i><sub>2</sub>) <i>dq</i>从0到最后一次充电。储存的总能量为`,
      choices: P5.unums.map(x => `${p(x, 0)} µJ`), answer: 3, nums: P5.unums,
      why: `<p>相同的<i>q</i>在任何时刻都处于打开状态，因此电压在积分内相加：</p><div class="eq"><i>U</i> = (<i>Q</i><sup>2</sup>/2)(1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub>) = <i>Q</i><sup>2</sup>/2<i>C</i><sub>eq</sub> = (${p(S.Q * 1e6, 0)} µC)<sup>2</sup>/(2 × ${p(S.C * 1e6, 3)} µF) = ${p(P5.U * 1e6, 0)} µJ</div><p><i>Q</i>Δ<i>V</i> = ${p(P5.unums[0], 0)} µJ 是电池供电；其中一半以热量的形式散失在电线中。 ${p(P5.unums[1], 0)} µJ 是并联对。</p>` },
  ],
  6: [
    { q: `该页面的极板被充电至 ${V0} V 并断开连接，然后 κ = ${KA} 板填充间隙。电势差变为`,
      choices: P6.nums.map(x => `${p(x, 1)} V`), answer: 1, nums: P6.nums,
      why: `<p> 被隔离，<i>Q</i> 保持不变。板面上的束缚电荷抵消了部分场： <i>E</i> = <i>E</i><sub>0</sub>/κ，因此 </p><div class="eq">Δ<i>V</i> = <i>Ed</i> = Δ<i>V</i><sub>0</sub>/κ = ${V0}/${KA} = ${p(P6.V, 1)} V</div><p> 相当于 <i>C</i> 上升 κ 倍Δ<i>V</i> = <i>Q</i>/<i>C</i> 下降 κ 倍。仅当连接电池时，它才保持 ${V0} V。</p>` },
    { q: `免费回复。页面的极板（<i>A</i> = ${p(A, 2)} m²、<i>d</i> = ${p(d * 100, 0)} cm）填充有电介质，其常数在间隙中线性上升，κ(<i>x</i>) = 1 + 2<i>x</i>/<i>d</i>，从一个板 1 个到另一个板 3 个。导出电容并对其进行评估。`,
      solution: `<p>自由电荷±<i>Q</i>位于板上；根据电介质高斯定律，<i>x</i> 深度处的场为 <i>E</i>(<i>x</i>) = σ/κ(<i>x</i>)ε<sub>0</sub>, σ = <i>Q</i>/<i>A</i>。跨间隙积分：</p><div class="eq">Δ<i>V</i> = ∫<sub>0</sub><sup><i>d</i></sup> σ <i>dx</i> / ε<sub>0</sub>(1 + 2<i>x</i>/<i>d</i>) = (σ<i>d</i>/2ε<sub>0</sub>) ln 3</div><div class="eq"><i>C</i> = <i>Q</i>/Δ<i>V</i> = 2ε<sub>0</sub><i>A</i>/(<i>d</i> ln 3) = (2/ln 3)<i>C</i><sub>0</sub> = ${p(P6b.C / C0, 3)} × ${p(C0 * 1e12, 2)} pF = ${p(P6b.C * 1e12, 2)} pF</div><p>检查：之间<i>C</i><sub>0</sub> (κ = 1) 和 3<i>C</i><sub>0</sub> (κ = 3)，且小于简单平均值2<i>C</i><sub>0</sub>，因为薄层堆叠在间隙上添加到 <b> 系列</b>.</p>`, val: P6b.C },
  ],
  7: [
    { q: `当 κ = ${KA} 板完全滑入时，页面的极板保留在 ${V0} V 电池 (<i>Q</i><sub>0</sub> = ${p(Q0 * 1e12, 0)} pC) 上。电池移动到 + 极板上的电量是多少？`,
      choices: P7.nums.map(x => `${p(x, 0)} pC`), answer: 3, nums: P7.nums,
      why: `<p>已连接，Δ<i>V</i> 保持 ${V0} V，<i>C</i> 变为 κ<i>C</i><sub>0</sub>，因此电荷变为κ<i>Q</i><sub>0</sub> = ${p(P7.nums[0], 0)} PC。继续下去就是区别：</p><div class="eq">Δ<i>Q</i> = (κ − 1)<i>Q</i><sub>0</sub> = ${KA - 1} × ${p(Q0 * 1e12, 0)} pC = ${p(P7.dQ * 1e12, 0)} pC</div><p>${p(P7.nums[0], 0)} pC是最终总计，而不是添加的内容。</p>` },
    { q: `该页面的板（侧面 ${p(P7b.side * 100, 0)} cm，<i>U</i><sub>0</sub> = ${p(U0 * 1e9, 1)} nJ，无板）已充电并断开连接。当 κ = ${KA} 板处于中间时，深度为 <i>C</i>(<i>s</i>) = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>s</i>/ℓ) <i>s</i>。将板拉入的力为`,
      choices: P7b.nums.map(x => `${p(x, 1)} nN`), answer: 1, nums: P7b.nums,
      why: `<p>与<i>Q</i>固定，<i>U</i> = <i>Q</i><sup>2</sup>/2<i>C</i>(<i>s</i>)且力向下能量斜率：</p><div class="eq"><i>F</i> = −<i>dU</i>/<i>ds</i> = (<i>Q</i><sup>2</sup>/2<i>C</i><sup>2</sup>) <i>dC</i>/<i>ds</i> = <i>U</i><sub>0</sub>(κ − 1) / ℓ(1 + (κ − 1)<i>s</i>/ℓ)<sup>2</sup> = ${p(U0 * 1e9, 1)} nJ × ${KA - 1} / (${P7b.side} m × ${p((1 + (KA - 1) * P7b.x) ** 2, 0)}) = ${p(P7b.F * 1e9, 1)} nN</div><p>正：<i>U</i> 随着板的进入而下降，因此它被拉入。${p(P7b.nums[0], 1)} nN 是答案Δ<i>V</i> 保持在 ${V0} V，一旦电池关闭，情况就不是这样了。</p>` },
  ],
  8: [
    { q: "点电荷 +<i>q</i> 位于中性空心导电球体的空腔中心。平衡状态下，内表面和外表面上的电荷为",
      choices: ["内0、外0", "内-<i>q</i>，外0", "内-<i>q</i>，外+<i>q</i>", "内+<i>q</i>，外-<i>q</i>"], answer: 2,
      why: "<p>A 金属内部的高斯表面上有 <i>E</i> = 0，因此它包含零电荷：内表面必须保持 −<i>q</i>。外壳是中性的，所以+<i>q</i>留在外表面上。外面，场地是中心的+<i>q</i>。</p>" },
    { q: `页面的中性球（<i>R</i> = ${p(cR * 100, 0)} cm，<i>E</i><sub>0</sub> = ${cE} V/m）带有 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ。面向前场的一半 (0 ≤ θ ≤ 90°) 上的总电荷为`,
      choices: P8.nums.map(x => `${p(x, 3)} nC`), answer: 3, nums: P8.nums,
      why: `<p> 宽度为 <i>R dθ</i> 的环的面积为 2π<i>R</i><sup>2</sup> sin θ <i>dθ</i>:</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i><sup>2</sup> sin θ <i>dθ</i> = 3ε<sub>0</sub><i>E</i><sub>0</sub>π<i>R</i><sup>2</sup> = ${p(P8.q * 1e9, 3)} nC</div><p>半球面积上 cos θ 的平均值为 1/2，因此 σ<sub>max</sub> × 2π<i>R</i><sup>2</sup> (${p(P8.nums[0], 3)} nC) 是两倍。在 <b>整个 </b> 球体上，其总和为零。</p>` },
  ],
};
