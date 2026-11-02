// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180);
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG;

// 0 · pressing down on the resting block
const PRESS = 5.0;
// 1 · strings at 25°
const TH1 = 25;
// 2 · hanging in an elevator moving up at constant speed
const VEL2 = 3.0;
// 3 · more thrust
const THRUST3 = 2400;
// 4 · distance in the push time
const X4 = 0.5 * M.A1 * M.PUSH_T ** 2;
// 5 · the car at highway speed, same forward push
const V5 = 30, D5 = M.CAR.k * V5 ** 2, A5 = (M.CAR.F - D5) / M.CAR.m;
// 6 · an 8.0 N push at rest; a 12.0 N push while sliding
const P6 = 8.0, P6b = 12.0, A6 = (P6b - M.F_K) / M.M1;
// 7 · the push moved to B's side
const C7 = M.M1 * M.PUSH / (M.M1 + M.M2);
// 8 · where the skaters meet, measured from A's start
const MEET = TG.d0 * TG.mB / TG.M;
// 9 · a harder pull on the board
const F9 = 24, ACM9 = F9 / BD.M, ABOARD9 = (F9 - BD.f) / BD.Mb;
// 10 · down the slope; with friction
const V10 = Math.sqrt(2 * M.A_INC * M.INC_LEN), A10 = G * (sin(M.THETA_DEG) - M.MU_K * cos(M.THETA_DEG));
// 11 · half of terminal speed; drag when a = g/4
const THALF = DR.tau * Math.log(2), D11 = 0.75 * DR.W;
// 12 · distance fallen in 1.00 s
const T12 = 1.00, X12 = M.linDrag(T12).x;

export const PRACTICE = {
  0: [
    { q: `当您用 ${f(PRESS, 1)} N 直接向下压 ${f(M.M1, 1)} 公斤块时，来自地板的法向力是多少？`,
      choices: [`${p3(M.W1 + PRESS)} N`, `${p3(M.W1)} N`, `${p3(M.W1 - PRESS)} N`, `${p3(PRESS)} N`], answer: 0,
      why: `<p>自由体图：重力${f(M.W1, 1)} N向下，你推${f(PRESS, 1)} N向下，法向力向上。该块保持静止状态，因此 Σ<i>F</i> = 0:</p><div class="eq"><i>F</i><sub>N</sub> = <i>mg</i> + <i>F</i><sub>push</sub> = ${f(M.W1, 1)} + ${f(PRESS, 1)} = ${p3(M.W1 + PRESS)} N</div><p>法向力是表面必须提供的力；仅当没有其他东西垂直推动时，它才等于 <i>mg</i>。</p>` },
    { q: "一个块以恒定速度在无摩擦的地板上滑动（无空气阻力）。哪些力属于其自由体图？",
      choices: ["重力、法向力和保持其移动的向前力", "仅重力", "法向力和向前力", "仅重力和法向力"], answer: 3,
      why: `<p>只有接触块的物体（和重力）才会对其施加力。地板给予法向力；地球赋予重力。没有任何东西推动它前进：它的速度保持不变，因为合力为零，而不是因为有什么东西驱动它。</p>` },
  ],
  1: [
    { q: `${f(M.M1, 1)} 公斤块由两根绳子静止悬挂，每根绳子位于水平面上方 ${TH1}° 处。每根弦的张力是多少？`,
      choices: [`${p3(M.W1 / (2 * cos(TH1)))} N`, `${p3(M.W1 / (2 * sin(TH1)))} N`, `${p3(M.W1 / sin(TH1))} N`, `${p3(M.W1 / 2)} N`], answer: 1,
      why: `<p>水平部分取消。两个垂直部分支撑着重力：</p><div class="eq">2<i>T</i> sin θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.W1, 1)} / (2 sin ${TH1}°) = ${p3(M.W1 / (2 * sin(TH1)))} N</div><p>角度是从水平方向测量的，因此垂直部分是<i>T</i> sin θ，而不是<i>T</i> cos θ。每根弦承载一半以上的重力，${p3(M.W1 / 2)} N.</p>` },
    { q: "两根绳子被拉得越来越平，朝向水平方向，而木块仍然悬挂在静止状态。紧张会发生什么？",
      choices: ["它跌向零。", "它的重力保持在一半。", "它生长无极限；完全水平的弦是不可能的。", "它接近全重。"], answer: 2,
      why: `<p><i>T</i> = <i>mg</i>/(2 sin θ).当 θ → 0、sin θ → 0 且 <i>T</i> → ∞ 时。水平弦根本没有垂直部分，因此没有有限的张力可以支撑木块。</p>` },
  ],
  2: [
    { q: `的 ${f(M.M1, 1)} 公斤块用一根绳子悬挂在正在移动的电梯内 <b>恒定向上 ${f(VEL2, 1)} m/s</b>。绳子的张力是多少？`,
      choices: [`${p3(M.W1 + M.M1 * VEL2)} N`, `${p3(M.M1 * VEL2)} N`, `${p3(M.W1 - M.M1 * VEL2)} N`, `${p3(M.W1)} N`], answer: 3,
      why: `<p> 恒定速度意味着 <i>a</i> = 0，因此块处于平衡状态： Σ<i>F</i> = <i>T</i> − <i>mg</i> = 0.</p><div class="eq"><i>T</i> = <i>mg</i> = ${f(M.M1, 1)} × ${f(G)} = ${p3(M.W1)} N</div><p> 速度永不进入；力改变速度，不需要保持速度。 （<i>mv</i> 甚至不是一个力量。）</p>` },
    { q: "冰球以稳定的速度在无摩擦的冰上滑动。需要什么来让它继续运转？",
      choices: ["什么都没有；合力为零时，其速度保持不变。", "等于其重力的稳定向前力", "缓慢减小的向前力", "它的“惯性力”会随着时间的推移而减弱"], answer: 0,
      why: `<p>第一定律：当Σ<i>F</i> = 0时，无论移动与否，速度保持恒定。惯性是一种属性（对速度变化的阻力），而不是力，并且它不会磨损。</p>` },
  ],
  3: [
    { q: `${M.PLANE.m} kg 飞机处于巡航水平，阻力为 ${M.PLANE.D} N。飞行员将推力提高到 ${THRUST3} N。在此之后，阻力发生变化之前，飞机的加速度是多少？`,
      choices: [`${p3(THRUST3 / M.PLANE.m)} m/s²`, `${p3(M.PLANE.D / M.PLANE.m)} m/s²`, `${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s²`, `${p3((THRUST3 + M.PLANE.D) / M.PLANE.m)} m/s²`], answer: 2,
      why: `<p>Lift仍然取消重力。沿飞行路径的合力为推力减去阻力：</p><div class="eq"><i>a</i> = (${THRUST3} − ${M.PLANE.D}) / ${M.PLANE.m} = ${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s² forward</div><p>单独使用推力忽略仍然作用的阻力。</p>` },
    { q: `在 ${M.PLANE.v} m/s 稳定平飞时，向前推力与阻力相比如何？`,
      choices: ["推力要大一些，否则飞机会减速。", "他们是平等的。", "飞机的重力推力更大。", "阻力较大，因为飞机在移动。"], answer: 1,
      why: `<p>恒定速度意味着零合力（第一定律），因此推力=阻力=${M.PLANE.D} N。推力大于阻力将使飞机加速，而不仅仅是保持移动。</p>` },
  ],
  4: [
    { q: `${f(M.PUSH, 1)} N 推力作用在 ${f(M.M1, 1)} 公斤块上，从静止状态到无摩擦表面。 ${f(M.PUSH_T, 1)} 能走多远？`,
      choices: [`${p3(2 * X4)} m`, `${p3(0.5 * M.A2 * M.PUSH_T ** 2)} m`, `${p3(M.A1 * M.PUSH_T)} m`, `${p3(X4)} m`], answer: 3,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = ${f(M.PUSH, 1)}/${f(M.M1, 1)} = ${f(M.A1, 2)} m/s²，常数，所以</p><div class="eq">Δ<i>x</i> = ½<i>at</i>² = ½ × ${f(M.A1, 2)} × (${f(M.PUSH_T, 1)})² = ${p3(X4)} m</div><p>${p3(2 * X4)} m 忘记了 ½； ${p3(M.A1 * M.PUSH_T)} 是达到的速度，在m/s.</p>` },
    { q: "小车上的合力加倍，其质量也加倍。其加速度变为",
      choices: ["四分之一大", "一样的", "两倍大", "四倍大"], answer: 1,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = (2Σ<i>F</i>)/(2<i>m</i>)：因子抵消。</p>` },
  ],
  5: [
    { q: "汽车在平坦的道路上加速。什么外力推动汽车前进？",
      choices: ["发动机对汽车的作用力", "轮胎对路面的作用力", "路面对轮胎的静摩擦力", "路面对轮胎的动摩擦力"], answer: 2,
      why: `<p>发动机是汽车的一部分；内力无法加速它。轮胎向后推路面，根据第三定律，路面将轮胎向前推。轮胎表面在路面上不打滑，因此为<b>静态</b>摩擦力。轮胎在路面上的力作用在路面上，而不是汽车上。</p>` },
    { q: `以相同的 ${f(M.CAR.F / 1000, 1)} kN 从道路向前推，${M.CAR.m} kg 车到达 ${V5} m/s，其中阻力为 ${f(D5, 0)} N。那么它的加速度是多少？`,
      choices: [`${p3(M.CAR.F / M.CAR.m)} m/s²`, `${p3(A5)} m/s²`, `${p3((M.CAR.F + D5) / M.CAR.m)} m/s²`, `${p3(D5 / M.CAR.m)} m/s²`], answer: 1,
      why: `<p>向后拖动点，与运动相反：</p><div class="eq"><i>a</i> = (<i>F</i> − <i>F</i><sub>d</sub>)/<i>m</i> = (${M.CAR.F} − ${f(D5, 0)}) / ${M.CAR.m} = ${p3(A5)} m/s²</div><p>${p3(M.CAR.F / M.CAR.m)} m/s² 忽略阻力，这就是为什么真实汽车在速度.</p>` },
  ],
  6: [
    { q: `${f(M.M1, 1)} kg 块位于粗糙的地板上（μ<sub>s</sub> = ${f(M.MU_S)}、μ<sub>k</sub> = ${f(M.MU_K)}）。用 ${f(P6, 1)} N 将其向侧面推，其上的摩擦力是多少？`,
      choices: [`${p3(M.F_SMAX)} N`, `${p3(M.F_K)} N`, `${p3(P6)} N`, '0 N'], answer: 2,
      why: `<p>的极限为μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)} N。 ${f(P6, 1)} N 在其下方，因此块保持不动，静摩擦力正好平衡推力：${p3(P6)} N。 μ<sub>s</sub><i>F</i><sub>N</sub> 是<b>最大值</b>，不是值。</p>` },
    { q: `一旦滑动，推力就增大到${f(P6b, 1)} N。该块的加速度是多少？`,
      choices: [`${p3((P6b - M.F_SMAX) / M.M1)} m/s²`, `${p3(P6b / M.M1)} m/s²`, `${p3((P6b + M.F_K) / M.M1)} m/s²`, `${p3(A6)} m/s²`], answer: 3,
      why: `<p>滑动，因此动摩擦 μ<sub>k</sub><i>mg</i> = ${f(M.F_K)} N 向后作用：</p><div class="eq"><i>a</i> = (${f(P6b, 1)} − ${f(M.F_K)}) / ${f(M.M1, 1)} = ${p3(A6)} m/s²</div><p>静摩擦力的${f(M.F_SMAX)} N限制一旦滑动就不再适用。</p>` },
  ],
  7: [
    { q: `现在将相同的 ${f(M.PUSH, 1)} N 推力应用于 B (${f(M.M2, 1)} kg)，将其推入无摩擦地板上的 A (${f(M.M1, 1)} kg)。木块相互推动的力度有多大？`,
      choices: [`${p3(C7)} N`, `${p3(M.CONTACT)} N`, `${p3(M.PUSH)} N`, `${p3(M.PUSH / 2)} N`], answer: 0,
      why: `<p>合计：<i>a</i> = ${f(M.PUSH, 1)}/(${f(M.M1, 1)} + ${f(M.M2, 1)}) = ${f(M.A_PAIR, 2)} m/s²。接触力是 A 上唯一的水平力，因此 </p><div class="eq"><i>F</i><sub>BA</sub> = <i>m</i><sub>A</sub><i>a</i> = ${f(M.M1, 1)} × ${f(M.A_PAIR, 2)} = ${p3(C7)} N</div><p> 从后面推动打火机块只需很小的接触力； ${p3(M.CONTACT)} N 是 A.</p> 上的推送的答案` },
    { q: "该块放在桌子上。方块重力的第三定律是什么（地球把方块拉下来）？",
      choices: ["桌子将方块向上推", "将地球拉起的块", "将木块压在桌子上", "桌子压在地板上"], answer: 1,
      why: `<p>A 第三定律对从两侧看都是相同的相互作用：地球拉动物块，物块拉动地球，大小相同，方向相反，在不同的物体上。桌子的法向力也作用在块上，所以它不可能是伙伴，即使在这里它的大小相等。</p>` },
  ],
  8: [
    { q: `滑冰者 A (${TG.mA} kg) 和 B (${TG.mB} kg) 站在 ${f(TG.d0, 1)} 米的无摩擦冰上，拉动轻绳直至相遇。他们距 A 的起点有多远？`,
      choices: [`${p3(TG.d0 / 2)} m`, `${p3(TG.d0 * TG.mA / TG.M)} m`, `${p3(MEET)} m`, `${p3(TG.d0 * TG.mA / TG.mB)} m`], answer: 2,
      why: `<p>只有内力水平作用，所以质心保持不动；他们在那里见面。来自：</p><div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub> · 0 + <i>m</i><sub>B</sub> · <i>d</i>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>) = ${TG.mB} × ${f(TG.d0, 1)} / ${TG.M} = ${p3(MEET)} m</div><p> 较轻的滑冰者移动得更远。 ${p3(TG.d0 * TG.mA / TG.M)}米换质量。</p>` },
    { q: "对于溜冰者和绳索的系统，当他们拉动时，哪一个陈述是正确的？",
      choices: ["质心向较重的滑冰者移动。", "绳索张力加速了系统的质心。", "仅当 A 和 B 的质量相等时，A 和 B 上的张力才会消除。", "质心保持静止，因为张力是内部的。"], answer: 3,
      why: `<p>绳索在系统内部以相等且相反的力拉动 A 和 B，因此无论质量如何，它们都会添加为零。重力和法向力抵消。当Σ<i>F</i><sub>ext</sub> = 0时，<i>a</i><sub>cm</sub> = 0，并且它从静止状态开始。</p>` },
  ],
  9: [
    { q: `板上拉力升至${F9} N； ${f(BD.m, 1)} kg 块仍然在 ${f(BD.Mb, 1)} kg 板上滑动 (μ<sub>k</sub> = ${f(BD.mu_k)})。物块的加速度是多​​少？`,
      choices: [`${p3(ACM9)} m/s²`, `${p3(BD.aBlock)} m/s²`, `${p3(BD.mu_s * G)} m/s²`, `${p3(ABOARD9)} m/s²`], answer: 1,
      why: `<p>作用在块上的唯一水平力是动摩擦力，μ<sub>k</sub><i>mg</i> = ${f(BD.f)} N，无论拉力如何：</p><div class="eq"><i>a</i> = μ<sub>k</sub><i>g</i> = ${f(BD.mu_k)} × ${f(G)} = ${p3(BD.aBlock)} m/s²</div><p> 绳子拉动木板，而不是木块。 ${p3(ACM9)} m/s² 为质心。</p>` },
    { q: `相同的 ${F9} N 拉力。木块+木板的质心加速度是多​​少？`,
      choices: [`${p3(F9 / BD.Mb)} m/s²`, `${p3(ABOARD9)} m/s²`, `${p3((F9 - BD.f) / BD.M)} m/s²`, `${p3(ACM9)} m/s²`], answer: 3,
      why: `<p>块与板之间的摩擦力内部消除。唯一的水平外力是拉力：</p><div class="eq"><i>a</i><sub>cm</sub> = Σ<i>F</i><sub>ext</sub>/<i>M</i> = ${F9} / ${f(BD.M, 1)} = ${p3(ACM9)} m/s²</div><p>检查：（${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(ABOARD9)}) / ${f(BD.M, 1)} = ${f(ACM9)} m/s².</p>` },
  ],
  10: [
    { q: `该块从静止的 ${f(M.INC_LEN, 1)} 米处沿着无摩擦的 ${M.THETA_DEG}° 斜坡滑动。底部的速度有多快？`,
      choices: [`${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s`, `${p3(Math.sqrt(G * sin(M.THETA_DEG) * M.INC_LEN))} m/s`, `${p3(V10)} m/s`, `${p3(Math.sqrt(2 * G * cos(M.THETA_DEG) * M.INC_LEN))} m/s`], answer: 2,
      why: `<p>沿斜率 <i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s²。从休息开始，没有给出时间：</p><div class="eq"><i>v</i> = √(2<i>aL</i>) = √(2 × ${f(M.A_INC)} × ${f(M.INC_LEN, 1)}) = ${p3(V10)} m/s</div><p>${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s使用了完整的<i>g</i>，就好像${f(M.INC_LEN, 1)}米直落下来一样； cos θ 是 <b> 到 </b> 斜率的一部分。</p>` },
    { q: `现在斜率是粗糙的，μ<sub>k</sub> = ${f(M.MU_K)}。木块向下滑动的加速度是多​​少？`,
      choices: [`${p3(M.A_INC)} m/s²`, `${p3(G * (sin(M.THETA_DEG) + M.MU_K * cos(M.THETA_DEG)))} m/s²`, `${p3(A10)} m/s²`, `${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s²`], answer: 2,
      why: `<p>摩擦力为 μ<sub>k</sub><i>F</i><sub>N</sub>，在斜坡上 <i>F</i><sub>N</sub> = <i>mg</i> cos θ。它指向斜坡上，反对滑动：</p><div class="eq"><i>a</i> = <i>g</i>(sin θ − μ<sub>k</sub> cos θ) = ${f(G)}(${f(sin(M.THETA_DEG), 3)} − ${f(M.MU_K)} × ${f(cos(M.THETA_DEG), 3)}) = ${p3(A10)} m/s²</div><p>${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s² 使用<i>F</i><sub>N</sub> = <i>mg</i>，仅在水平地面上有效。</p>` },
  ],
  11: [
    { q: `${f(DR.m, 2)} kg 球 (<i>b</i> = ${f(DR.b)} kg/s) 从静止状态释放。需要多长时间才能达到终端速度的一半？`,
      choices: [`${p3(DR.tau / 2)} s`, `${p3(THALF)} s`, `${p3(DR.tau)} s`, `${p3(Math.log(2))} s`], answer: 1,
      why: `<p> 由 <i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i> 进行分离和积分得到 <i>v</i> = <i>v</i><sub>t</sub>(1−e<sup>−<i>t</i>/τ</sup>)，τ=<i>m</i>/<i>b</i>=${f(DR.tau)}。设置 <i>v</i> = <i>v</i><sub>t</sub>/2:</p><div class="eq">e<sup>−<i>t</i>/τ</sup> = ½ &nbsp;→ <i>t</i> = τ ln 2 = ${f(DR.tau)} × ${f(Math.log(2), 3)} = ${p3(THALF)} s</div><p>速度不是线性增长的，因此不是τ/2；在 τ 时已经有 63%。</p>` },
    { q: `对于同一个球（<i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i>，与其余球相比），对 <i>v</i>(<i>t</i>) 进行微分以找到<i>a</i>(<i>t</i>)。然后求<i>a</i> = <i>g</i>/4时刻的阻力，以及它发生的时间。`,
      solution: `<p>1。 <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>)，所以 <i>a</i> = d<i>v</i>/d<i>t</i> = (<i>v</i><sub>t</sub>/τ) e<sup>−<i>t</i>/τ</sup> = <i>g</i> e<sup>−<i>t</i>/τ</sup>，因为 <i>v</i><sub>t</sub>/τ = (<i>mg</i>/<i>b</i>)(<i>b</i>/<i>m</i>) = <i>g</i>.</p><p>2。根据 ODE，<i>ma</i> = <i>mg</i> − <i>F</i><sub>d</sub>。其中 <i>a</i> = <i>g</i>/4：</p><div class="eq"><i>F</i><sub>d</sub> = <i>mg</i> − <i>mg</i>/4 = ¾<i>mg</i> = ¾ × ${f(DR.W, 2)} = ${f(D11, 2)} N</div><p>3。 e<sup>−<i>t</i>/τ</sup> = ¼ 得出 <i>t</i> = τ ln 4 = ${f(DR.tau)} × ${f(Math.log(4), 3)} = ${f(DR.tau * Math.log(4), 3)} s。检查：<i>v</i> = 3/4<i>v</i><sub>t</sub> = ${f(0.75 * DR.vt)} m/s 和 <i>bv</i> = ${f(DR.b * 0.75 * DR.vt, 2)} N.</p>` },
  ],
  12: [
    { q: `从静止状态释放后，球 (<i>v</i><sub>t</sub> = ${f(DR.vt)} m/s, τ = ${f(DR.tau)} s) 下落 ${f(T12)} s 有多远？`,
      choices: [`${p3(DR.vt * T12)} m`, `${p3(X12)} m`, `${p3(DR.vt * (T12 - DR.tau))} m`, `${p3(0.5 * G * T12 ** 2)} m`], answer: 1,
      why: `<p>对速度进行积分：</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>′/τ</sup>) d<i>t</i>′ = <i>v</i><sub>t</sub>[<i>t</i> − τ(1 − e<sup>−<i>t</i>/τ</sup>)]</div><div class="eq">= ${f(DR.vt)} × [${f(T12)} − ${f(DR.tau)}(1 − e<sup>−${f(T12 / DR.tau, 1)}</sup>)] = ${p3(X12)} m</div><p>${p3(DR.vt * (T12 - DR.tau))} m 为后期渐近线 <i>v</i><sub>t</sub>(<i>t</i> − τ)；在 <i>t</i> = ${f(T12 / DR.tau, 1)}τ 处，e<sup>−<i>t</i>/τ</sup> 项尚不可忽略。 ${p3(0.5 * G * T12 ** 2)} m忽略阻力。</p>` },
    { q: "两个球，其中一个的质量是另一个的 4 倍，但大小和形状相同，以最终速度下降。较重的球的 <i>v</i><sub>t</sub> 在线性阻力 (<i>bv</i>) 和二次阻力 (<i>kv</i>²) 下大多少倍？",
      choices: ["线性 2×，二次 4×", "线性 4×、二次 4×", "线性 2×、二次 2×", "线性 4×、二次 2×"], answer: 3,
      why: `<p>在终端速度拖动= <i>mg</i>。线性：<i>bv</i><sub>t</sub> = <i>mg</i>、<i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> ∝ <i>m</i>，所以 4×。二次：<i>kv</i><sub>t</sub>² = <i>mg</i>、<i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>) ∝ √<i>m</i>，所以 2×。相同的尺寸和形状使 <i>b</i> 和 <i>k</i> 保持相同。</p>` },
  ],
};
