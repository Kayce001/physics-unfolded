// gauss/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const K = M.K, E0 = M.EPS0, PI = Math.PI;

// ---- page 0: the page's square at 60°; a field that grows across a square ----
const P0 = { th: 60 };
P0.F = M.flux(P0.th);
P0.nums = [M.FLUX.E * M.FLUX.A * Math.sin(P0.th * PI / 180), P0.F, M.FLUX.max, M.FLUX.E * M.FLUX.side * Math.cos(P0.th * PI / 180)];   // sin · right · face on · side not area
const P0b = { b: 3.0e4, s: 0.20 };
P0b.F = P0b.b * P0b.s ** 3 / 2;
P0b.nums = [P0b.b * P0b.s ** 3, P0b.b * P0b.s ** 3 / 3, P0b.b * P0b.s ** 2 / 2, P0b.F];   // E at the far edge × A · ∫y² · lost an s · right
// ---- page 1: a cube around the page's charge; E = c r inside a sphere ----
const P1 = { q: M.POINT.q };
P1.nums = [P1.q / (6 * E0), P1.q / E0, K * P1.q, P1.q / (2 * E0)];
const P1b = { c: 5.0e4, R: 0.10 };
P1b.q = 4 * PI * E0 * P1b.c * P1b.R ** 3;
P1b.nums = [E0 * P1b.c * P1b.R ** 3, 4 * PI * E0 * P1b.c * P1b.R ** 2, 4 / 3 * PI * E0 * P1b.c * P1b.R ** 3, P1b.q].map(q => q * 1e9);   // no 4π · lost an R · volume, not area · right
// ---- page 2: the page's line, at 5 cm; potential difference out to 20 cm ----
const lam = M.LINE.lam;
const P2 = { r: 0.05 };
P2.nums = [K * lam / P2.r, M.lineE(P2.r), 2 * K * lam / P2.r ** 2, lam / (2 * E0 * P2.r)];   // lost 2 · right · 1/r² · lost π
const P2b = { r1: 0.05, r2: 0.20 };
P2b.dV = 2 * K * lam * Math.log(P2b.r2 / P2b.r1);
P2b.nums = [2 * K * lam * (1 / P2b.r1 - 1 / P2b.r2), M.lineE(P2b.r1) * (P2b.r2 - P2b.r1), P2b.dV, M.lineE(P2b.r2) * (P2b.r2 - P2b.r1)];
// ---- page 3: two sheets ±σ; a slab with ρ = ρ₀|x|/d ----
const sg = M.SHEET.sigma;
const P3 = { nums: [sg / E0, sg / (2 * E0), 0, 2 * sg / E0] };      // field between the sheets, per choice
const P3b = { rho0: 4.0e-7, d: 0.05, x: 0.02 };
P3b.E = P3b.rho0 * P3b.x ** 2 / (2 * E0 * P3b.d);
P3b.nums = [2 * P3b.E, P3b.E, P3b.rho0 * P3b.x / (2 * E0), P3b.E / 2];   // one cap · right · ρ₀ uniform · lost a 2
// ---- page 4: field energy outside the page's metal sphere ----
const { Q, R } = M.SPH;
const P4 = { U: K * Q * Q / (2 * R) };
P4.nums = [2 * P4.U, P4.U / 2, P4.U / 3, P4.U].map(u => u * 1e6);   // kQ²/R · only out to 2R · surface density × sphere's volume · right
// ---- page 5: the page's insulating sphere at R/2 ----
const P5 = { r: R / 2 };
P5.E = M.iSphere.E(P5.r);
P5.nums = [K * Q / P5.r ** 2, P5.E, 0, 3 * P5.E];
// ---- page 6: the page's insulating rod at R/2 ----
const P6 = { r: M.ROD.R / 2 };
P6.E = M.iRod.E(P6.r);
P6.nums = [0, 2 * K * M.ROD.lam / P6.r, P6.E, M.ROD.lam * P6.r / (2 * E0 * M.ROD.R ** 2)];   // metal · outside formula · right · lost π
// ---- page 7: the page's ρ = br sphere at R/2; ρ = br² ----
const P7 = { r: R / 2 };
P7.E = M.nSphere.E(P7.r);
P7.nums = [M.nSphere.rho(P7.r) * P7.r / (3 * E0), M.iSphere.E(P7.r), P7.E, 4 * P7.E];   // local ρ as if uniform · uniform sphere · right · lost the 4
const P7b = { nums: [1 / 8, 1 / 32, 1 / 16, 1 / 4] };
// ---- page 8: the induced charge on the cage's right half ----
const P8 = { q: 3 * E0 * M.CAGE.E0 * PI * M.CAGE.R ** 2 };
P8.nums = [0, P8.q, 2 * P8.q, P8.q / 3].map(q => q * 1e9);   // net zero · right · σ_max × area · lost the 3

const fr = x => ({ 0.125: '1/8', 0.03125: '1/32', 0.0625: '1/16', 0.25: '1/4' })[x];

export const PRACTICE = {
  0: [
    { q: `页面的 ${p(M.FLUX.side * 100, 0)} 平方厘米位于均匀的 ${p(M.FLUX.E / 1000, 1)} kN/C 场中，其面积矢量位于 ${P0.th}° 到 <b>E</b>。通过它的通量为`,
      choices: P0.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 1, nums: P0.nums,
      why: `<div class="eq">Φ = <i>EA</i> cos θ = ${M.FLUX.E} × ${p(M.FLUX.A, 3)} m² × cos ${P0.th}° = ${p(P0.F, 1)} N·m²/C</div><p>θ 是根据 <b> 面积向量 </b>（法线）测量的，因此它是 cos，而不是 sin；仅当 θ 是与表面本身的角度时，sin 才是正确的。</p>` },
    { q: `A 字段 <b>E</b> = <i>by</i> <b>x̂</b>, <i>b</i> = ${p(P0b.b / 1e4, 1)} × 10<sup>4</sup> N/C m，在 <i>yz</i> 平面上穿过 ${p(P0b.s * 100, 0)} cm 平方，0 ≤ <i>y</i> ≤ ${p(P0b.s, 2)} m。通过正方形的通量（法线 +<b>x̂</b>）为`,
      choices: P0b.nums.map(x => `${g(x)} N·m²/C`), answer: 3, nums: P0b.nums,
      why: `<p><i>E</i> 在正方形上发生变化，因此将其切成宽度为 d<i>y</i> 和长度为 <i>s</i> 的条，每个条带有通量 <i>E</i>(<i>y</i>) <i>s</i> d<i>y</i>:</p><div class="eq">Φ = ∫<sub>0</sub><sup><i>s</i></sup> <i>by</i> · <i>s</i> d<i>y</i> = <i>bs</i>³/2 = ${g(P0b.F)} N·m²/C</div><p>使用整个正方形的远边缘处的场给出两倍， ${g(P0b.nums[0])}.</p>` },
  ],
  1: [
    { q: `该页面的 ${p(P1.q * 1e9, 1)} nC 电荷位于立方体的中心。通过立方体 <b>一个</b> 面的通量为`,
      choices: P1.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 0, nums: P1.nums,
      why: `<p>高斯：整个立方体带有<i>q</i>/ε<sub>0</sub> = ${p(P1.nums[1], 0)} N·m²/C。通过对称性，六个面中的每一个都具有相同的份额：</p><div class="eq">Φ<sub>face</sub> = <i>q</i>/6ε<sub>0</sub> = ${p(P1.nums[0], 1)} N·m²/C</div><p><i>kq</i> = ${p(P1.nums[2], 2)} 也有单位 N·m²/C，但它是<i>q</i>/4πε<sub>0</sub>，不是通过任何东西的通量。</p>` },
    { q: `在某些区域，磁场为径向，每米 <i>E</i> = <i>cr</i>、<i>c</i> = ${p(P1b.c / 1e4, 1)} × 10<sup>4</sup> N/C。以原点为中心、半径为 ${p(P1b.R * 100, 0)} cm 的球体内有多少电荷？`,
      choices: P1b.nums.map(x => `${g(x)} nC`), answer: 3, nums: P1b.nums,
      why: `<p>在球体 <b>E</b> ∥ d<b>A</b> 和 <i>E</i> = <i>cR</i> 处处，所以</p><div class="eq">∮<b>E</b> · d<b>A</b> = <i>cR</i> · 4π<i>R</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>q</i><sub>enc</sub> = 4πε<sub>0</sub><i>cR</i>³ = ${g(P1b.q * 1e9)} nC</div><p>曲面为 4π<i>R</i>²，而不是 ⁴⁄₃π<i>R</i>³：通量是面积积分。</p>` },
  ],
  2: [
    { q: `该页的行带有 λ = ${p(lam * 1e9, 1)} nC/m。距离它的场 ${p(P2.r * 100, 0)} 厘米是`,
      choices: P2.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P2.nums,
      why: `<p>A同轴圆柱：无磁通通过帽，<i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub>，所以</p><div class="eq"><i>E</i> = λ/2πε<sub>0</sub><i>r</i> = 2<i>k</i>λ/<i>r</i> = ${p(P2.nums[1], 0)} N/C</div><p>A 线的磁场下降为 1/<i>r</i>，而不是 1/<i>r</i>² (${p(P2.nums[2], 0)} N/C).</p>` },
    { q: `距离该线的电势 ${p(P2b.r1 * 100, 0)} 厘米比距离它的 ${p(P2b.r2 * 100, 0)} 厘米高多少？`,
      choices: P2b.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq"><i>V</i>(<i>r</i><sub>1</sub>) − <i>V</i>(<i>r</i><sub>2</sub>) = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (2<i>k</i>λ/<i>r</i>) d<i>r</i> = 2<i>k</i>λ ln(<i>r</i><sub>2</sub>/<i>r</i><sub>1</sub>) = ${p(2 * K * lam, 2)} × ln ${p(P2b.r2 / P2b.r1, 0)} = ${p(P2b.dV, 1)} V</div><p>1/<i>r</i> 积分为对数。点电荷习惯 1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub> 给出 ${p(P2b.nums[0], 1)} V； <i>E</i> × 与近场的距离，${p(P2b.nums[1], 1)} V，忽略<i>E</i>下降。</p>` },
  ],
  3: [
    { q: `两个大的平行非导电片带有+σ和-σ，σ = ${p(sg * 1e9, 1)} nC/m²。该字段是`,
      choices: [`${p(P3.nums[0], 0)} 之间 N/C，外部 0`, `${p(P3.nums[1], 0)} 它们与外部之间 N/C`, `0 之间，${p(P3.nums[0], 0)} N/C 外`, `${p(P3.nums[3], 0)} 之间 N/C，外部 0`], answer: 0, nums: P3.nums,
      why: `<p>Each 片单独给出 σ/2ε<sub>0</sub> = ${p(P3.nums[1], 0)} N/C 在两侧，远离+和朝向-。在两张纸之间以相同的方式指向并相加；外面它们指向相反的方向并取消：</p><div class="eq"><i>E</i> = σ/2ε<sub>0</sub> + σ/2ε<sub>0</sub> = σ/ε<sub>0</sub> = ${p(P3.nums[0], 0)} N/C between</div> 之间 N/C` },
    { q: `厚的非导电板填充 −<i>d</i> ≤ <i>x</i> ≤ <i>d</i> (<i>d</i> = ${p(P3b.d * 100, 0)} cm)，其中 ρ = ρ<sub>0</sub>|<i>x</i>|/<i>d</i>, ρ<sub>0</sub> = ${p(P3b.rho0 * 1e7, 1)} × 10<sup>−7</sup> C/m³。 <i>x</i> = ${p(P3b.x * 100, 0)} cm 处的场为`,
      choices: P3b.nums.map(x => `${g(x)} N/C`), answer: 1, nums: P3b.nums,
      why: `<p>使用帽盖区域为<i>A</i>的药盒，从-<i>x</i>到<i>x</i>。通过对称性，场通过 <b> 两个 </b> 帽离开：</p><div class="eq">2<i>EA</i> = (1/ε<sub>0</sub>) · 2<i>A</i>∫<sub>0</sub><sup><i>x</i></sup> ρ<sub>0</sub><i>x</i>′/<i>d</i> d<i>x</i>′ = <i>A</i>ρ<sub>0</sub><i>x</i>²/ε<sub>0</sub><i>d</i> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>x</i>²/2ε<sub>0</sub><i>d</i> = ${g(P3b.E)} N/C</div><p>仅计算一个上限双倍它（${g(P3b.nums[0])} N/C）。</p>` },
  ],
  4: [
    { q: "带电荷 +<i>Q</i> 的金属球位于厚的同心金属壳的中心，其净电荷为 -3<i>Q</i>。壳<b>外部</b>表面的电荷为",
      choices: ['−3<i>Q</i>', '−<i>Q</i>', '+<i>Q</i>', '−2<i>Q</i>'], answer: 3,
      why: "<p>A 壳金属内部的高斯球体上有 <i>E</i> = 0，因此它包含零电荷：内表面必须保持 −<i>Q</i> 以抵消球体的 +<i>Q</i>。壳的其余部分 -3<i>Q</i> 到达外表面： -3<i>Q</i> - (-<i>Q</i>) = -2<i>Q</i>.</p>" },
    { q: `页面金属球外部的场中存储了多少能量（<i>Q</i> = ${p(Q * 1e9, 1)} nC，<i>R</i> = ${p(R * 100, 0)} cm）？ （能量密度ε<sub>0</sub><i>E</i>²/2。）`,
      choices: P4.nums.map(x => `${g(x)} μJ`), answer: 3, nums: P4.nums,
      why: `<p> 在金属内部 <i>E</i> = 0。在外部，添加体积为 4π<i>r</i>² 的壳 d<i>r</i>:</p><div class="eq"><i>U</i> = ∫<sub><i>R</i></sub><sup>∞</sup> (ε<sub>0</sub>/2)(<i>kQ</i>/<i>r</i>²)² 4π<i>r</i>² d<i>r</i> = <i>kQ</i>²/2<i>R</i> = ${g(P4.U * 1e6)} μJ</div><p>停在 2<i>R</i> 仅给出一半(${g(P4.nums[1])} μJ)：远处的场仍然持有能量。表面能量密度乘以球体体积 (${g(P4.nums[2])} μJ) 将能量放在了错误的位置：金属内部没有能量。</p>` },
  ],
  5: [
    { q: `页面的绝缘球（<i>Q</i> = ${p(Q * 1e9, 1)} nC均匀分布，<i>R</i> = ${p(R * 100, 0)} cm）。距其中心的场 ${p(P5.r * 100, 0)} 厘米为`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>A 半径为 <i>r</i> 的高斯球包含 <i>Q</i>(<i>r</i>/<i>R</i>)³ = <i>Q</i>/8:</p><div class="eq"><i>E</i> · 4π<i>r</i>² = <i>Q</i>(<i>r</i>/<i>R</i>)³/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kQr</i>/<i>R</i>³ = ${p(P5.E, 0)} N/C</div><p>Zero 为 <i>metal</i> 球体； <i>kQ</i>/<i>r</i>² 计算高斯球外的电荷。</p>` },
    { q: "绝缘球壳具有内半径<i>a</i>、外半径<i>b</i>和均匀电荷密度ρ。在所有三个区域中查找 <i>E</i>(<i>r</i>)。",
      solution: "<p>球对称：在半径为 <i>r</i>、<i>E</i> · 4π<i>r</i>² = 的高斯球面上<i>q</i><sub>enc</sub>/ε<sub>0</sub>，与 <i>q</i><sub>enc</sub> = ∫ ρ 4π<i>r</i>′² d<i>r</i>′在内部带电部分。</p><div class=\"eq\"><i>r</i> &lt; <i>a</i>: &nbsp;<i>q</i><sub>enc</sub> = 0, &nbsp;<i>E</i> = 0</div><div class=\"eq\"><i>a</i> &lt; <i>r</i> &lt; <i>b</i>: &nbsp;<i>q</i><sub>enc</sub> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> ρ4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₃πρ(<i>r</i>³ − <i>a</i>³), &nbsp;<i>E</i> = ρ(<i>r</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>²</div><div class=\"eq\"><i>r</i> &gt; <i>b</i>: &nbsp;<i>E</i> = ρ(<i>b</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>² = <i>kQ</i>/<i>r</i>²</div><p>检查：在<i>r</i> = <i>a</i>处中间形式为0，在<i>r</i> = <i>b</i>处满足外部形式，所以<i>E</i> 是连续的。当 <i>a</i> = 0 时，它变成实心球的 ρ<i>r</i>/3ε<sub>0</sub>.</p>" },
  ],
  6: [
    { q: `页面的绝缘杆（λ = ${p(M.ROD.lam * 1e9, 1)} nC/m 均匀分布，<i>R</i> = ${p(M.ROD.R * 100, 0)} cm）。距其轴的场 ${p(P6.r * 100, 1)} cm 为`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<p>A 半径为 <i>r</i>、长度为 <i>L</i> 的同轴圆柱体容纳 λ<i>L</i>(<i>r</i>/<i>R</i>)²:</p><div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i><i>r</i>²/<i>R</i>²ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ<i>r</i>/<i>R</i>² = ${p(P6.E, 0)} N/C</div><p>2<i>k</i>λ/<i>r</i> (${p(P6.nums[1], 0)} N/C) 仅适用外面，所有 λ 都被包围； 0为金属棒。</p>` },
    { q: "半径为 <i>R</i> 的长绝缘圆柱体，ρ = ρ<sub>0</sub><i>r</i>/<i>R</i>。在它里面（<i>r</i> &lt; <i>R</i>）字段是",
      choices: ['ρ<sub>0</sub><i>r</i>/2ε<sub>0</sub>', 'ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>³/3ε<sub>0</sub><i>R</i>²'], answer: 1,
      why: "<p>添加薄圆柱壳，每个圆柱壳的体积为 2π<i>r</i>′<i>L</i> d<i>r</i>′:</p><div class=\"eq\"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> (ρ<sub>0</sub><i>r</i>′/<i>R</i>) 2π<i>r</i>′<i>L</i> d<i>r</i>′ = 2πρ<sub>0</sub><i>Lr</i>³/3<i>R</i></div><div class=\"eq\"><i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i></div><p>ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i> 将局部 ρ(<i>r</i>）进入均匀杆结果而不是积分。</p>" },
  ],
  7: [
    { q: `页面的球体有 ρ = <i>br</i> (<i>Q</i> = ${p(Q * 1e9, 1)} nC, <i>R</i> = ${p(R * 100, 0)} cm, <i>b</i> = ${p(M.SPH.b * 1e6, 2)} μC/m⁴）。领域 ${p(P7.r * 100, 0)} 距离中心的厘米是`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P7.nums,
      why: `<div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴, &nbsp;<i>E</i> = π<i>br</i>⁴/(4πε<sub>0</sub><i>r</i>²) = <i>br</i>²/4ε<sub>0</sub> = ${p(P7.E, 0)} N/C</div><p>仅 <i>Q</i>/16 在里面 <i>R</i>/2，因为电荷向外聚集。均匀球体具有相同的 <i>Q</i> 给出 ${p(P7.nums[1], 0)} 常闭；堵漏ρ(<i>r</i>) 代入 ρ<i>r</i>/3ε<sub>0</sub> 给出 ${p(P7.nums[0], 0)} N/C.</p>` },
    { q: "半径为一个球体 <i>R</i> 有 ρ = <i>br</i>².其总电荷的哪一部分位于 <i>r</i> = <i>R</i>/2?",
      choices: P7b.nums.map(fr), answer: 1, nums: P7b.nums,
      why: "<div class=\"eq\"><i>q</i>(<i>r</i>) = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′² 4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₅π<i>br</i>⁵ &nbsp;→&nbsp; <i>q</i>(<i>R</i>/2)/<i>q</i>(<i>R</i>) = (½)⁵ = 1/32</div><p>1/8 是均匀球体的 (½)³； 1/16 是 ρ = <i>br</i>’s (½)⁴.</p>" },
  ],
  8: [
    { q: "点电荷+<i>q</i> 位于中性厚球形金属壳中空部分的偏心位置。在壳外，场是",
      choices: ["零", "<i>kq</i>/<i>r</i>²，与 <i>r</i> 从电荷测量", "<i>kq</i>/<i>r</i>²，与 <i>r</i> 从壳中心测量", "靠近电荷的一侧更强"], answer: 2,
      why: "<p>−<i>q</i> 聚集在内表面上，不均匀，因此金属中的场为零。这可以保护外界免受电荷所在位置的影响。 +<i>q</i> 留在外表面的电荷感受不到来自内部的磁场，因此它像孤立球体上的电荷一样均匀分布。在外面，具有同心球的高斯给出 <i>kq</i>/<i>r</i>² 从 <b>贝壳的</b> 中心。</p>" },
    { q: `在页面未充电的外壳上（<i>R</i> = ${p(M.CAGE.R * 100, 0)} 厘米）在 ${p(M.CAGE.E0 / 1000, 1)} kN/C 场，σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> 余弦θ。下游一半的总电荷 (cos θ &gt; 0) is`,
      choices: P8.nums.map(x => `${x ? g(x) : '0'} nC`), answer: 1, nums: P8.nums,
      why: `<p> 宽度为 <i>R</i> dθ 的环的面积为 2π<i>R</i>² sin θ dθ:</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i>² sin θ dθ = 3πε<sub>0</sub><i>E</i><sub>0</sub><i>R</i>² = ${g(P8.q * 1e9)} nC</div><p>另一半持有−${g(P8.q * 1e9)} nC，因此壳保持中立； σ<sub>max</sub> × 半边面积 (${g(P8.nums[2])} nC) 忽略 σ 在边缘处降至 0。</p>` },
  ],
};
