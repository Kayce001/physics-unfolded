// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => r * 180 / Math.PI;

// 0 · a faster throw
const H2 = (2 * M.VY0) ** 2 / (2 * M.G);
// 1 · caught on the way down, below the launch point
const DROP = 1.50, DIST1 = 2 * M.H + DROP;
// 2 · averages over the first 1.50 s
const T2 = 1.50, Y2 = M.y(T2), D2 = 2 * M.H - Y2;
// 3 · strobe gaps shrink by gτ²
const TAU = M.STROBE;
// 5 · speed at 3.00 m up
const Y5 = 3.00, V5 = Math.sqrt(M.VY0 ** 2 - 2 * M.G * Y5);
// 6 · twice the sideways speed
const R6 = 2 * M.VX * M.T;
// 7 · a faster car
const VC7 = 20.0, A7 = dg(Math.atan2(VC7, M.RAIN.vr));
// 8 · a stronger current, aimed straight across
const VW8 = 2.0;
// 9 · the fading pull, at 2.00 s
const T9 = 2.00, V9 = M.PULL.a0 * T9 - 0.5 * M.PULL.k * T9 ** 2;

export const PRACTICE = {
  0: [
    { q: `球直接向上抛向 ${f(2 * M.VY0, 1)} m/s，而不是 ${f(M.VY0)} m/s。升到多高？ （无空气阻力。）`,
      choices: [`${p3(2 * M.H)} m`, `${p3(Math.SQRT2 * M.H)} m`, `${p3(H2)} m`, `${p3(8 * M.H)} m`], answer: 2,
      why: `<p>在顶部<i>v</i> = 0，所以<i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>。高度随发射速度的 <b>平方</b> 变化：将 <i>v</i><sub>0</sub> 增加一倍，得到 4 × ${f(M.H)} m.</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)}) = ${p3(H2)} m</div><p>${p3(2 * M.H)} m 假设高度成比例地速.</p>` },
    { q: "当球到达最高点时，它的加速度为",
      choices: ["零", `${f(M.G)} m/s² 向下`, `${f(M.G)} m/s²向上`, "未定义，因为它正在改变方向"], answer: 1,
      why: `<p>重力是每时每刻唯一的力，因此<i>a</i> = <i>g</i> = ${f(M.G)} m/s²在整个飞行过程中向下。在顶部，<b>速度</b> 为零，但它仍在变化：片刻之后它指向下方。</p>` },
  ],
  1: [
    { q: `一个球直接向上抛出 ${f(M.VY0)} m/s 从壁架上下来并在下降过程中被抓住 ${f(DROP)} m <b>下面</b> 发射点。它总共行驶了多少距离？`,
      choices: [`${p3(DROP)} m`, `${p3(2 * M.H - DROP)} m`, `${p3(M.H + DROP)} m`, `${p3(DIST1)} m`], answer: 3,
      why: `<p>Distance 将路径的每条路段相加。上升 <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} m，下降 ${f(M.H)} m 回到发射点，然后 ${f(DROP)} m更多：</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} m</div><p>${p3(DROP)} m为尺寸<b>位移</b>（−${f(DROP)}米，向上正），不是距离。</p>` },
    { q: "对于沿直线运动的物体，其位移的大小与行进的距离相比如何？",
      choices: ["他们总是平等的。", "位移可以大于距离。", "位移永远不会更大；仅当物体永不反转时它们才相等。", "位移总是小于距离。"], answer: 2,
      why: `<p>Distance 计算路径的每一米；位移仅是变化量。任何反转都会取消部分位移，但会增加距离（往返行程：0 米相对于 ${f(2 * M.H)} 米）。如果没有反转，它们是相等的，所以“总是更小”也是错误的。</p>` },
  ],
  2: [
    { q: `球的平均数是多少 <b>速度</b> 从发射到 <i>t</i> = ${f(T2)} 是？ （它被抛出在 ${f(M.VY0)} m/s 并达到顶峰 ${f(M.H)} m at ${f(M.T / 2)} s.)`,
      choices: [`${p3(D2 / T2)} m/s`, `${p3(Y2 / T2)} m/s`, `${p3(M.H / T2)} m/s`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} m/s`], answer: 0,
      why: `<p>平均速度=距离/时间。在 ${f(T2)} s 处，球位于 <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} m，处于下降状态。距离 = 向上 ${f(M.H)} m + 向下 ${f(M.H - Y2, 3)} m = ${f(D2, 3)} m.</p><div class="eq">${f(D2, 3)} m / ${f(T2)} s = ${p3(D2 / T2)} m/s</div><p>${p3(Y2 / T2)} m/s是平均值<b>速度</b>（位移/时间）。</p>` },
    { q: "将球离开手后的速度与返回手前的速度进行比较。",
      choices: ["他们是一样的。", "着陆速度较大，因为重力作用时间较长。", "两者的平均值均为零，因此无法进行比较。", "速度相同，方向相反。"], answer: 3,
      why: `<p>运动是对称的：发射时+${f(M.VY0)} m/s，-${f(M.VY0)} m/s在相同高度下降（<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>，其中 Δ<i>y</i> = 0）。速度相等，但速度包含方向，所以速度不同。</p>` },
  ],
  3: [
    { q: "采取正的态度。球在飞行的哪一部分加速？",
      choices: ["向上，因为速度为正", "在顶部，因为那里的加速度最大", "下来，因为 v 和 a 具有相同的符号", "从不：负加速度总是使物体减慢"], answer: 2,
      why: `<p>加速意味着<i>v</i>和<i>a</i>指向相同的方向。 <i>a</i> = −${f(M.G)} m/s²；在下降的过程中<i>v</i>也是负的，所以速度会增长。负值 <i>a</i> 仅在 <i>v</i> 为正值时减慢球的速度。</p>` },
    { q: `闪光灯每隔 ${f(TAU, 3)} 秒闪烁一次。在上升的过程中，连续图像之间的每个间隙与之前的图像相比缩小了多少？`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} m`, `${p3(M.G * TAU ** 2)} m`, `${p3(M.G * TAU)} m`, `${p3(2 * M.G * TAU ** 2)} m`], answer: 1,
      why: `<p>Each 间隙是一个间隔 <i>v</i>τ − ½<i>g</i>τ² 中走过的距离，其中 <i>v</i> 是起始处的速度。从一个间隙到下一个 <i>v</i> 下降了 <i>g</i>τ，因此间隙下降了 (<i>g</i>τ)τ：</p><div class="eq">Δ(gap) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} m</div><p> ½ 属于单个间隙，而不属于两个之间的差异。</p>` },
  ],
  4: [
    { q: `在球的<i>v</i>–<i>t</i>图上（向上正，<i>v</i><sub>0</sub> = ${f(M.VY0)} m/s），从0到时间轴之间的净面积是多少${f(T2)} 是吗？`,
      choices: [`${p3(D2)} m`, `${p3(M.VY0 * T2)} m`, `${p3(M.H)} m`, `${p3(Y2)} m`], answer: 3,
      why: `<p> <i>v</i>–<i>t</i>下的面积为位移；轴下方的区域计数为负。在轴上方，有一个到 ${f(M.T / 2)} s 的三角形：+½(${f(M.VY0)})(${f(M.T / 2)}) = +${f(M.H)} m。下面，从 ${f(M.T / 2)} 到 ${f(T2)} s： −½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))}) = −${f(M.H - Y2, 3)} m.</p><div class="eq">net = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} m</div><p>${p3(D2)} m 添加轴下方的部分而不是减去它：这就是距离。</p>` },
    { q: "当球到达最高点时，哪一个为零？",
      choices: ["<i>y</i>–<i>t</i> 图的斜率", "<i>v</i>–<i>t</i> 图的斜率", "从 <i>a</i>–<i>t</i> 图像中读取的值", "从抛出时刻起 <i>a</i>–<i>t</i> 图线下的面积"], answer: 0,
      why: `<p><i>y</i>–<i>t</i>的斜率是速度，顶部为零。 <i>v</i>–<i>t</i> 和 <i>a</i>–<i>t</i> 值的斜率均为 −${f(M.G)} m/s²。自发射以来 <i>a</i>–<i>t</i> 下的面积为 Δ<i>v</i> = −${f(M.VY0)} m/s，不为零。</p>` },
  ],
  5: [
    { q: `当球位于发射点上方 ${f(Y5)} 米时，球移动的速度有多快？ （<i>v</i><sub>0</sub> = ${f(M.VY0)} m/s 向上。）`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s`, `${p3(V5)} m/s`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} m/s`, `${p3(V5 ** 2)} m/s`], answer: 1,
      why: `<p> 没有给出或不需要时间，因此使用省略 <i>t</i> 的方程，其中 <i>a</i> = −${f(M.G)} m/s²:</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)}) = ${f(V5 ** 2)} m²/s², &nbsp;<i>v</i> = ${p3(V5)} m/s</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s 来自将 <i>a</i> 视为+<i>g</i>：球在那里必须更慢，而不是更快。 （它以相同的速度经过 ${f(Y5)} 米两次。）</p>` },
    { q: `您希望球首先到达 ${f(Y5)} m 的时间，只知道 <i>v</i><sub>0</sub>、<i>a</i> 和 Δ<i>y</i>。哪一个方程一步就能得到它？`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p> 您不需要的未知数是最终速度 <i>v</i>，因此选择省略 <i>v</i> 的方程： Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²。 <i>t</i> 是二次方；较小的根是向上的。其他三个要么包含<i>v</i>，要么不包含<i>t</i>.</p>` },
  ],
  6: [
    { q: `第二个球离开时，${f(M.VX)} m/s 侧向，${f(M.VY0)} m/s 向上。它在路径顶部的速度是多少？`,
      choices: ['0 m/s', `${p3(M.VY0)} m/s`, `${p3(M.V0P)} m/s`, `${p3(M.VX)} m/s`], answer: 3,
      why: `<p>在顶部只有<i>v</i><sub>y</sub>为零。没有任何东西横向作用，所以 <i>v</i><sub>x</sub> 保持 ${f(M.VX)} m/s，速度为 √(<i>v</i><sub>x</sub>² + 0²) = ${p3(M.VX)} m/s。 “0 m/s”仅适用于垂直向上抛出的球。</p>` },
    { q: `再次以相同的 ${f(M.VY0)} m/s 向上抛出，但 <b>两倍</b> 横向速度，${f(2 * M.VX)} m/s，从水平地面。落地距离有多远？`,
      choices: [`${p3(M.RANGE)} m`, `${p3(R6)} m`, `${p3(4 * M.RANGE)} m`, `${p3(Math.SQRT2 * M.RANGE)} m`], answer: 1,
      why: `<p>在空中的时间仅取决于垂直运动：<i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} s，不变。水平运动匀速：</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} m</div><p>${p3(4 * M.RANGE)} m 将使整个发射速度加倍，这也使时间加倍。</p>` },
  ],
  7: [
    { q: `雨直下${f(M.RAIN.vr, 1)} m/s。汽车速度可达 ${f(VC7, 1)} m/s。从汽车上看，条纹与垂直方向的倾斜角度是多少？`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>： ${f(M.RAIN.vr, 1)} m/s 向下加上 ${f(VC7, 1)} m/s 向后，呈直角。从垂直方向看，对边为水平部分：</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}, &nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}° 是与 <b>水平</b>.</p> 的角度` },
    { q: `对于在 ${f(M.RAIN.vc, 1)} m/s 处向前行驶的汽车中的乘客，道路的速度是多少？`,
      choices: [`${f(M.RAIN.vc, 1)} m/s 向后`, `${f(M.RAIN.vc, 1)} m/s 前进`, "零：道路为参考", `${f(M.vlen(M.V_RC))} m/s，倾斜`], answer: 0,
      why: `<p>交换字母会翻转向量：<i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>。汽车相对于道路向前移动 ${f(M.RAIN.vc, 1)} m/s，因此道路相对于汽车向后移动 ${f(M.RAIN.vc, 1)} m/s。参考哪个对象是一个选择，而不是事实。</p>` },
  ],
  8: [
    { q: `电流升至${f(VW8, 1)} m/s。该船仍以 ${f(M.RIVER.vb, 1)} m/s 的方式穿过水面，瞄准笔直穿过 ${M.RIVER.w} 米河。穿越需要多长时间？`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} s`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} s`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} s`, `${p3(M.RIVER.w / M.RIVER.vb)} s`], answer: 3,
      why: `<p>只有速度的横渡部分将船带到远岸，水流没有横渡部分。所以</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} s</div><p>与之前相同；更强的水流只会将其带到下游更远的地方（${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} m）。除以全速 ${f(Math.hypot(M.RIVER.vb, VW8))} m/s 使用倾斜路径的速度计算直线距离。</p>` },
    { q: `回到${f(M.RIVER.vw, 1)} m/s 当前：${f(M.RIVER.vb, 1)} m/s 船必须指向正对岸的上游多远？`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>船的上游部分必须取消水流。船自身速度为斜边：</p><div class="eq"><i>v</i><sub>b</sub> sin θ = <i>v</i><sub>w</sub> &nbsp;→ sin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}, θ = ${p3(dg(M.AIM_UP))}°</div><p>tan θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)} 对待 ${f(M.RIVER.vb, 1)} m/s为横侧，但那是船在水中的整体速度。</p>` },
  ],
  9: [
    { q: `汽车从静止开始，<i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>（m/s²，<i>t</i> 单位为 s）。 <i>t</i> = ${f(T9)} s 时的速度是多少？`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s`, `${p3(M.PULL.a0 * T9)} m/s`, `${p3(V9)} m/s`, `${p3(M.pa(T9))} m/s`], answer: 2,
      why: `<p><i>a</i> 不是常数，因此积分：</p><div class="eq"><i>v</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)}) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} m/s</div><p>${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s 忘记了积分 <i>t</i> 的 1/2； ${p3(M.PULL.a0 * T9)} m/s 将 <i>a</i> 视为常数 ${f(M.PULL.a0, 1)} m/s².</p>` },
    { q: `对于同一辆车（<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i>，直到达到零，然后为 0；从 <i>x</i> = 0 处的静止状态开始），表明它已经消失当加速度为零时，<i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>²，并找出<i>t</i> = 5.00 s时的位置。`,
      solution: `<p>1。 <i>a</i> = 0 在 <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} s.</p><p>2。 <i>v</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>²，因此 <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} m/s.</p><p>3。 <i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² - <i>kt</i>³/6。在 <i>t</i><sub>1</sub>:</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}²) = ${f(M.X1, 1)} m</div><p>4。 <i>t</i><sub>1</sub>之后，<i>a</i> = 0，所以<i>v</i>保持为${f(M.V1, 1)} m/s:</p><div class="eq"><i>x</i>(5.00) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)}) = ${f(M.px(5), 1)} m</div>` },
  ],
  10: [
    { q: `粒子的运动为 <i>x</i> = <i>t</i>³ − 3<i>t</i> (m, s)。速度为零（<i>t</i> &gt; 0）时的加速度是多​​少？`,
      choices: [`${p3(M.ca(M.T_TURN))} m/s²`, '0 m/s²', `${p3(M.cx(M.T_TURN))} m/s²`, `${p3(3 * M.CUBE.A * M.T_TURN)} m/s²`], answer: 0,
      why: `<p><i>v</i> = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3 = 0（<i>t</i> = ${f(M.T_TURN)} 时）。 <i>a</i> = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} m/s².</p><p>零速度并不意味着零加速度：粒子正在转动，因此其速度为改变。 （${p3(M.cx(M.T_TURN))} 是它在那里的位置，单位为米。）</p>` },
    { q: "粒子具有 <i>a</i> = 6<i>t</i> (m/s²)，其中 <i>v</i>(0) = −3 m/s 且 <i>x</i>(0) = 0。找到 <i>x</i>(<i>t</i>)，当它回到 <i>x</i> = 0 时，时间 <i>t</i> &gt; 0 以及此时的速度。",
      solution: `<p>1。积分一次：<i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>； <i>v</i>(0) = −3 给出 <i>C</i><sub>1</sub> = −3.</p><p>2。再次积分：<i>x</i> = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>； <i>x</i>(0) = 0 给出 <i>C</i><sub>2</sub> = 0.</p><p>3。 <i>x</i> = <i>t</i>(<i>t</i>² − 3) = 0，<i>t</i> = √3 = ${f(Math.sqrt(3))} s.</p><div class="eq"><i>v</i>(√3) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} m/s</div><p>在 1 s 时向左移动到 <i>x</i> = −2 m，然后向右返回，速度比开始时更快。</p>` },
  ],
};
