// electrostatics/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${m.toFixed(n)} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const K = M.K, nC = M.nC, uC = M.uC;

// ---- page 0: two metal spheres touched; a rod with λ = cx ----
const P0 = { q1: 6, q2: -2 };                                   // nC
P0.each = (P0.q1 + P0.q2) / 2;
P0.nums = [(Math.abs(P0.q1) + Math.abs(P0.q2)) / 2, P0.each, NaN, 0];   // added sizes · right · no flow · cancelled
const P0b = { c: 40 * nC, L: 0.50 };                           // λ = c x (C/m², m)
P0b.Q = P0b.c * P0b.L ** 2 / 2;
P0b.nums = [P0b.c * P0b.L ** 3 / 3, P0b.c * P0b.L ** 2, P0b.Q, P0b.c * P0b.L].map(q => q / M.QE);   // ∫x² · forgot ½ · right · λ(L)·1 m
// ---- page 1: the grounding current ----
const P1 = { I0: 2.4e-3, tau: 1.5e-6 };
P1.n = P1.I0 * P1.tau / M.QE;
P1.nums = [P1.n * (1 - 1 / Math.E), P1.n / 2, P1.n / Math.E, P1.n];   // stopped at τ · triangle · I(τ)·τ · right
// ---- page 2: the page's pair at 20 cm; work as a like pair flies apart ----
const P2 = { r: 0.20 };
P2.F = M.coulomb(M.PAIR.q1, M.PAIR.q2, P2.r);
P2.nums = [K * M.PAIR.q1 * -M.PAIR.q2 / P2.r, M.coulomb(M.PAIR.q1, M.PAIR.q1, P2.r), P2.F, P2.F / 2];   // 1/r · q1² · right · "smaller charge, smaller force"
const P2b = { q1: M.PAIR.q1, q2: M.PAIR.like, r1: 0.20, r2: 0.40 };
P2b.W = K * P2b.q1 * P2b.q2 * (1 / P2b.r1 - 1 / P2b.r2);
{ const F = r => M.coulomb(P2b.q1, P2b.q2, r), dr = P2b.r2 - P2b.r1;
  P2b.nums = [F(P2b.r1) * dr, F(P2b.r2) * dr, (F(P2b.r1) + F(P2b.r2)) / 2 * dr, P2b.W]; }   // start force · end force · mean force · right
// ---- page 3: the page's balance point and its stiffness ----
const { qA, qB, D, q0 } = M.LINE;
const P3 = { x: M.LINE.xEq };
P3.nums = [D * Math.sqrt(qB) / (Math.sqrt(qA) + Math.sqrt(qB)), D * qA / (qA + qB), D / 2, P3.x].map(x => x * 100);   // nearer A · no root · midpoint · right
P3.k = 2 * K * q0 * (qA / P3.x ** 3 + qB / (D - P3.x) ** 3);
P3.nums2 = [P3.k, P3.k / 2, 2 * K * q0 * Math.abs(qA / P3.x ** 3 - qB / (D - P3.x) ** 3), K * q0 * (qA / P3.x ** 2 + qB / (D - P3.x) ** 2)];   // right · lost the 2 · subtracted · not differentiated
// ---- page 4: a −1 nC charge; a test charge moving out ----
const P4 = { Q: M.POINT.Q, r: 0.20 };
P4.E = M.pointMag(P4.Q, P4.r);
P4.nums = [P4.E, NaN, K * P4.Q / P4.r, K * P4.Q / (P4.r * 100) ** 2];
const P4b = { r: 0.20, v: 0.050 };
P4b.rate = 2 * K * M.POINT.Q * P4b.v / P4b.r ** 3;
P4b.nums = [P4b.rate / 2, P4b.rate, 2 * K * M.POINT.Q * P4b.v / P4b.r ** 2, 2 * K * M.POINT.Q * P4b.v / P4b.r ** 4];   // lost the 2 · right · one r short · one r too many
// ---- page 5: the page's dipole on its bisector ----
const P5 = { y: 0.10 }, dq = M.DIPOLE.q, da = M.DIPOLE.a;
P5.E = M.dipoleBisector(P5.y);
P5.nums = [2 * K * dq * da / P5.y ** 3, P5.E, 2 * K * dq / (da * da + P5.y * P5.y), P5.E / 2];   // far-field · right · no cos θ · one charge only
// ---- page 6: the page's rod, on its axis ----
const P6 = { a: 0.10 };
P6.E = M.rodAxis(P6.a);
P6.nums = [K * M.RODE.Q / P6.a ** 2, K * M.RODE.Q / (P6.a + M.RODE.L / 2) ** 2, P6.E, K * M.RODE.lambda / P6.a];   // all at the end · all at the middle · right · kλ/a
// ---- page 7: the page's ring at z = 15 cm; where it peaks ----
const P7 = { z: 0.15 }, RR = M.RING.R, RQ = M.RING.Q;
P7.E = M.ringAxis(P7.z);
P7.nums = [K * RQ / (P7.z ** 2 + RR ** 2), P7.E, K * RQ / P7.z ** 2, K * RQ * RR / (P7.z ** 2 + RR ** 2) ** 1.5];   // no cos φ · right · point charge · sin φ
P7.nums2 = [RR, RR / 2, RR * Math.SQRT2, RR / Math.SQRT2].map(x => x * 100);
// ---- page 8: the page's electron; a field that grows along the plates ----
const PL = M.PLATES;
const P8 = { nums: [2 * PL.yExit, 4 * PL.yExit, PL.yProton, PL.yExit].map(y => y * 1000) };     // forgot ½ · t = 2L/v₀ · proton · right
const P8b = { vy: PL.vyExit / 2 };
P8b.nums = [PL.vyExit, P8b.vy, PL.vyExit / 3, PL.vyExit / 4].map(v => v / 1e6);

const mm = x => x < 0.01 ? p(x, 5) : g(x);

export const PRACTICE = {
  0: [
    { q: `两个相同的金属球携带 +${P0.q1} nC 和 -${-P0.q2} NC。它们被触碰在一起，然后被拉开。现在每人都携带着`,
      choices: [`+${p(P0.nums[0], 0)} nC`, `+${p(P0.each, 0)} nC`, `+${P0.q1 / 2} nC 和 -${-P0.q2 / 2} nC`, '0'], answer: 1, nums: P0.nums,
      why: `<p> 电荷守恒：总数 ${P0.q1} + (−${-P0.q2}) = +${P0.q1 + P0.q2} nC 由相同球体平均共享。</p><div class="eq"><i>q</i> = (${P0.q1} − ${-P0.q2})/2 = +${p(P0.each, 0)} nC each</div><p> 添加尺寸 (+${p(P0.nums[0], 0)} nC) 将忽略符号；来自负球体的电子抵消了部分正球体的电荷。</p>` },
    { q: `一根细塑料棒沿着 <i>x</i> 轴从 0 到 ${p(P0b.L, 2)} m，单位长度的电荷 λ = <i>cx</i>，<i>c</i> = +${p(P0b.c / nC, 0)} nC/m²。失去了多少电子？`,
      choices: P0b.nums.map(n => sci(n)), answer: 2, nums: P0b.nums,
      why: `<p>λ 沿杆变化，因此添加切片 d<i>q</i> = λ d<i>x</i>:</p><div class="eq"><i>Q</i> = ∫<sub>0</sub><sup><i>L</i></sup> <i>cx</i> d<i>x</i> = <i>cL</i>²/2 = ${p(P0b.c / nC, 0)} × ${p(P0b.L, 2)}²/2 = ${p(P0b.Q / nC, 2)} nC</div><div class="eq"><i>n</i> = <i>Q</i>/<i>e</i> = ${p(P0b.Q / nC, 2)} × 10<sup>−9</sup>/${sci(M.QE)} = ${sci(P0b.nums[2])}</div><p>省略 1/2（远端的 λ 乘以长度）给出两倍的值。</p>` },
  ],
  1: [
    { q: "页面中性金属球：靠近负极棒，将球体接地，剪断地线，然后将棒拿开。球体最终结束",
      choices: ["中立的", "负电，均匀分布在其表面", "呈阳性，均匀分布在其表面", "正，拥挤在杆所在的一侧"], answer: 2,
      why: `<p>杆将球体的自由电子推向远端，接地则让其中一些电子离开。首先切割地面会捕获赤字：球体为正（此处为+${p(M.QG / nC, 2)} nC），与杆相反。一旦棒消失，就没有任何东西将电荷固定在一侧，因此它会均匀地分布在表面上。</p>` },
    { q: `在另一种感应装置中，当球体接地时，地线中的电流为 <i>I</i>(<i>t</i>) = <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>，其中<i>I</i><sub>0</sub> = ${p(P1.I0 * 1e3, 1)} mA 和 τ = ${p(P1.tau * 1e6, 1)} μs。总共剩下多少个电子？`,
      choices: P1.nums.map(n => sci(n)), answer: 3, nums: P1.nums,
      why: `<p>电荷是电流的积分：</p><div class="eq"><i>Q</i> = ∫<sub>0</sub><sup>∞</sup> <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup> d<i>t</i> = <i>I</i><sub>0</sub>τ = ${p(P1.I0 * P1.tau / nC, 2)} nC, &nbsp;<i>n</i> = <i>Q</i>/<i>e</i> = ${sci(P1.n)}</div><p>停止在<i>t</i> = τ只计算其中的63％，${sci(P1.nums[0])}.</p>` },
  ],
  2: [
    { q: `该页的+${M.PAIR.q1 / uC} μC 和−${-M.PAIR.q2 / uC} μC 电荷相距${p(P2.r * 100, 0)} cm。 −${-M.PAIR.q2 / uC} μC 电荷上的力的大小为`,
      choices: P2.nums.map(x => `${g(x)} N`), answer: 2, nums: P2.nums,
      why: `<div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>² = ${sci(K)} × (${M.PAIR.q1 / uC} × 10<sup>−6</sup>)(${-M.PAIR.q2 / uC} × 10<sup>−6</sup>)/(${p(P2.r, 2)})² = ${g(P2.F)} N</div><p>两种电荷感觉相同 ${g(P2.F)} N，第三定律对；较小的电荷感觉不到一半（${g(P2.nums[3])} N）。</p>` },
    { q: `该页面的相似对，+${P2b.q1 / uC} μC 和 +${P2b.q2 / uC} μC，间隔 ${p(P2b.r1 * 100, 0)} 厘米。 +${P2b.q2 / uC} μC 电荷被释放（另一个保持固定）。当它们相距 ${p(P2b.r2 * 100, 0)} 厘米时，电力对它做了多少功？`,
      choices: P2b.nums.map(x => `${g(x)} J`), answer: 3, nums: P2b.nums,
      why: `<p>移动时力发生变化，因此积分：</p><div class="eq"><i>W</i> = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub>) = ${g(K * P2b.q1 * P2b.q2)} × (${p(1 / P2b.r1, 1)} − ${p(1 / P2b.r2, 1)}) = ${g(P2b.W)} J</div><p>力 × 与起始点的距离力（${g(P2b.nums[0])} J）太大：推力减弱为1/<i>r</i>²。平均末端力 (${g(P2b.nums[2])} J) 也是错误的，因为 <i>F</i> 在 <i>r</i>.</p> 中不是线性的` },
  ],
  3: [
    { q: `在页面上，A (+${qA / uC} μC) 和 B (+${qB / uC} μC) 相距 ${p(D * 100, 0)} cm。距 A 多远，它们之间的测试电荷上的合力为零？`,
      choices: P3.nums.map(x => `${p(x, 1)} cm`), answer: 3, nums: P3.nums,
      why: `<div class="eq"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)² &nbsp;→&nbsp; (<i>d</i> − <i>x</i>)/<i>x</i> = √(<i>q</i><sub>B</sub>/<i>q</i><sub>A</sub>) = ${p(Math.sqrt(qB / qA), 2)} &nbsp;→&nbsp; <i>x</i> = ${p(P3.x * 100, 1)} cm</div><p>它更靠近<b>较小的</b>电荷，B。以电荷比率（${p(P3.nums[1], 1)} cm）分裂<i>d</i>忘记了力的变化为1/<i>r</i>²，因此距离为平方根。</p>` },
    { q: `+${p(q0 / uC, 1)} μC 测试电荷沿着该平衡点沿线微移一小段距离 <i>s</i>。则合力为 <i>F</i> ≈ −κ<i>s</i>。 κ 是`,
      choices: P3.nums2.map(x => `${g(x)} N/m`), answer: 0, nums: P3.nums2,
      why: `<p>κ = −d<i>F</i>/d<i>x</i> 在 <i>x</i><sub>eq</sub>，其中 <i>F</i>(<i>x</i>) = <i>kq</i><sub>0</sub><i>q</i><sub>A</sub>/<i>x</i>² − <i>kq</i><sub>0</sub><i>q</i><sub>B</sub>/(<i>d</i> - <i>x</i>)²:</p><div class="eq">κ = 2<i>kq</i><sub>0</sub>[<i>q</i><sub>A</sub>/<i>x</i>³ + <i>q</i><sub>B</sub>/(<i>d</i> − <i>x</i>)³] = ${g(P3.k)} N/m</div><p>两项加上：向B移动，A的推力减弱<i>and</i> B 的推力增大，双方都将电荷送回。减去它们得到 ${g(P3.nums2[2])} N/m.</p>` },
  ],
  4: [
    { q: `−${M.POINT.Q / nC}.0 nC 点电荷位于原点。其东边的电场为 ${p(P4.r * 100, 0)} cm`,
      choices: [`${p(P4.E, 0)} N/C，西`, `${p(P4.E, 0)} 北卡罗来纳州，东`, `${p(P4.nums[2], 1)} N/C，西`, `${p(P4.nums[3], 4)} N/C，西`], answer: 0, nums: P4.nums,
      why: `<div class="eq"><i>E</i> = <i>k</i>|<i>Q</i>|/<i>r</i>² = ${sci(K)} × 1.0 × 10<sup>−9</sup>/(${p(P4.r, 2)})² = ${p(P4.E, 0)} N/C</div><p>负电荷场指向<b>向</b>它：正测试电荷以东它被拉向西。使用以 cm 为单位的 <i>r</i> 得到 ${p(P4.nums[3], 4)} N/C； <i>kQ</i>/<i>r</i>是势，不是场。</p>` },
    { q: `测试电荷以 ${p(P4b.v * 100, 1)} cm/s 的速度直接从页面的 +${M.POINT.Q / nC} nC 电荷移开。当距离 ${p(P4b.r * 100, 0)} cm 时，其位置处的磁场减小的速度有多快？`,
      choices: P4b.nums.map(x => `${g(x)} N/C per s`), answer: 1, nums: P4b.nums,
      why: `<p>链式法则：<i>E</i>(<i>r</i>) = <i>kQ</i>/<i>r</i>²，且<i>r</i>增长于<i>v</i>:</p><div class="eq">d<i>E</i>/d<i>t</i> = (d<i>E</i>/d<i>r</i>)(d<i>r</i>/d<i>t</i>) = −(2<i>kQ</i>/<i>r</i>³)<i>v</i> = −2 × ${p(K * M.POINT.Q, 2)} × ${p(P4b.v, 3)}/${p(P4b.r, 2)}³ = −${g(P4b.rate)} N/C per s</div><p>从幂规则中删除 2 得到 ${g(P4b.nums[0])}.</p>` },
  ],
  5: [
    { q: `对于页面的偶极子（±${dq / nC} nC，${p(2 * da * 100, 0)} cm 相距），距中心垂直平分线 ${p(P5.y * 100, 0)} cm 上的场具有大小`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>每次电荷距离为 √(<i>a</i>² + <i>y</i>²) = ${p(Math.hypot(da, P5.y) * 100, 1)} cm，得出 <i>kq</i>/(<i>a</i>² + <i>y</i>²) = ${p(K * dq / (da * da + P5.y * P5.y), 0)} N/C。 <i>y</i>零件取消； <i>x</i> 部分，每 × cos θ = <i>a</i>/√(<i>a</i>² + <i>y</i>²)，加上：</p><div class="eq"><i>E</i> = 2<i>kqa</i>/(<i>a</i>² + <i>y</i>²)<sup>3/2</sup> = ${p(P5.E, 0)} N/C, parallel to the axis, from + toward −</div><p>远场2<i>kqa</i>/<i>y</i>³ (${p(P5.nums[0], 0)} N/C) 仅适用于 <i>y</i> ≫ <i>a</i>；这里 <i>y</i> = <i>a</i>.</p>` },
    { q: "偶极子在 <i>x</i> = +<i>a</i> 处具有 +<i>q</i>，在 <i>x</i> = -<i>a</i> 处具有 -<i>q</i>。找到轴上 <i>x</i> ≫ <i>a</i> 的字段，并将其显示为 1/<i>x</i>³。",
      solution: `<p>两个场均沿轴分布； +<i>q</i> 获胜：</p><div class="eq"><i>E</i> = <i>kq</i>/(<i>x</i> − <i>a</i>)² − <i>kq</i>/(<i>x</i> + <i>a</i>)² = <i>kq</i> · 4<i>ax</i>/(<i>x</i>² − <i>a</i>²)²</div><p>对于 <i>x</i> ≫ <i>a</i>, (<i>x</i>² − <i>a</i>²)² → <i>x</i>⁴，因此 <i>E</i> → 4<i>kqa</i>/<i>x</i>3 = 2<i>kp</i>/<i>x</i>3 <i>p</i> = 2<i>qa</i>，指向+<i>x</i>。另一种方式： <i>f</i>(<i>x</i>) = <i>kq</i>/<i>x</i>² 两个电荷之间的变化约为 <i>f</i>′(<i>x</i>) · (−2<i>a</i>)，因此 <i>E</i> ≈ −2<i>a</i> · (−2<i>kq</i>/<i>x</i>3) = 4<i>kqa</i>/<i>x</i>3。这两个场几乎抵消，留下的差异比任何一个都快下降一个幂。</p>` },
  ],
  6: [
    { q: `页杆（+${M.RODE.Q / nC} nC 超过 ${p(M.RODE.L * 100, 0)} cm）。其轴 ${p(P6.a * 100, 0)} cm 上经过一端的场为`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<div class="eq"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(K * M.RODE.Q, 2)}/(${p(P6.a, 2)} × ${p(P6.a + M.RODE.L, 2)}) = ${p(P6.E, 0)} N/C</div><p>将所有电荷视为在近端 (${p(P6.nums[0], 0)} N/C) 或在中间 (${p(P6.nums[1], 0)} N/C) 失败：切片处于不同的距离，并且 1/<i>x</i>² 加权不是线性.</p>` },
    { q: "杆（λ，长度 <i>L</i>）位于 <i>x</i> 轴上，从 -<i>L</i>/2 到 <i>L</i>/2。哪个积分给出了中点以上距离 <i>a</i> 处的场？",
      choices: ['∫ <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)', '∫ <i>k</i>λ<i>x</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup>', '∫ <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>1/2</sup>', '∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup>'], answer: 3,
      why: "<p>每个切片给出 d<i>E</i> = <i>k</i>λ d<i>x</i>/(<i>x</i>² + <i>a</i>²)。横向部分成对抵消，因此仅保留沿 <i>a</i> 的部分，× cos θ = <i>a</i>/√(<i>x</i>² + <i>a</i>²):</p><div class=\"eq\"><i>E</i> = ∫<sub>−<i>L</i>/2</sub><sup><i>L</i>/2</sup> <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>² + <i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/(<i>a</i>√(<i>L</i>²/4 + <i>a</i>²))</div><p>第一个增加幅度而不取消； <i>x</i> d<i>x</i>积分是横向部分，为零； 1/2次方就是势能。</p>" },
  ],
  7: [
    { q: `页环（+${p(RQ / nC, 0)} nC，<i>R</i> = ${p(RR * 100, 0)} cm）。其轴 ${p(P7.z * 100, 0)} cm 上距中心的场为`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P7.nums,
      why: `<p>每件距离 √(<i>z</i>² + <i>R</i>²) = ${p(Math.hypot(P7.z, RR) * 100, 0)} 厘米远；仅轴向部分 cos φ = <i>z</i>/√(<i>z</i>² + <i>R</i>²) = ${p(P7.z / Math.hypot(P7.z, RR), 2)}，保留：</p><div class="eq"><i>E</i> = <i>kQz</i>/(<i>z</i>² + <i>R</i>²)<sup>3/2</sup> = ${p(P7.E, 0)} N/C</div><p> 如果没有 cos φ，则为${p(P7.nums[0], 0)} 常闭；在此距离，环不是点电荷 (${p(P7.nums[2], 0)} N/C)。</p>` },
    { q: `离环中心多远，其轴上的场最强？`,
      choices: P7.nums2.map(x => `${p(x, 1)} cm`), answer: 3, nums: P7.nums2,
      why: `<p>设置 d<i>E</i>/d<i>z</i> = 0，对于 <i>E</i> = <i>kQz</i>(<i>z</i>² + <i>R</i>²)<sup>−3/2</sup>:</p><div class="eq"><i>kQ</i>[(<i>z</i>² + <i>R</i>²) − 3<i>z</i>²]/(<i>z</i>² + <i>R</i>²)<sup>5/2</sup> = 0 &nbsp;→&nbsp; <i>z</i> = <i>R</i>/√2 = ${p(P7.nums2[3], 1)} cm</div><p><i>E</i> 在中心处为零，在远处为 1/<i>z</i>²，因此峰值位于它们之间。</p>` },
  ],
  8: [
    { q: `页的电子在 ${p(PL.v0 / 1e7, 1)} × 10<sup>7</sup> m/s 处进入 ${M.PLATES.E} N/C 场，平行于 ${p(PL.L * 100, 0)} cm 板移动。当它离开它们时，它向侧面移动了多远？`,
      choices: P8.nums.map(x => `${mm(x)} mm`), answer: 3, nums: P8.nums,
      why: `<p>恒定的力穿过，没有沿：射弹。</p><div class="eq"><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub> = ${sci(PL.a)} m/s², &nbsp;<i>t</i> = <i>L</i>/<i>v</i><sub>0</sub> = ${p(PL.tCross * 1e9, 1)} ns, &nbsp;<i>y</i> = ½<i>at</i>² = ${mm(P8.nums[3])} mm</div><p> 忘记 ½ 会使它加倍。质子的质量为 ${mm(P8.nums[2])} mm，${p(M.MP / M.ME, 0)}× 更少。</p>` },
    { q: `相反，假设板之间的场沿着它们增长，<i>E</i> = <i>E</i><sub>0</sub><i>x</i>/<i>L</i> (<i>E</i><sub>0</sub> = ${M.PLATES.E} N/C 在远端）。电子离开时的横向速度为`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> m/s`), answer: 1, nums: P8b.nums,
      why: `<p><i>x</i> = <i>v</i><sub>0</sub><i>t</i>，因此横向加速度随时间增长，<i>a</i>(<i>t</i>) = (<i>eE</i><sub>0</sub>/<i>m</i>)(<i>v</i><sub>0</sub><i>t</i>/<i>L</i>):</p><div class="eq"><i>v<sub>y</sub></i> = ∫<sub>0</sub><sup><i>L</i>/<i>v</i><sub>0</sub></sup> (<i>eE</i><sub>0</sub><i>v</i><sub>0</sub>/<i>mL</i>) <i>t</i> d<i>t</i> = ½(<i>eE</i><sub>0</sub>/<i>m</i>)(<i>L</i>/<i>v</i><sub>0</sub>) = ${p(P8b.vy / 1e6, 2)} × 10<sup>6</sup> m/s</div><p>H均匀场值的一半（${p(PL.vyExit / 1e6, 2)} × 10<sup>6</sup> m/s）：平均而言，场强是一半。</p>` },
  ],
};
