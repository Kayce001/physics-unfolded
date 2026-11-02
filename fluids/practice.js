// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, RHO = M.RHO;
const AL = M.MATERIALS.find(m => m.key === 'al'), ICEM = M.MATERIALS.find(m => m.key === 'ice');
const BU = M.BUOY, PA = M.PASCAL, FL = M.FLOW, BE = M.BERN, TK = M.TANK;
const eq = s => `<div class="eq">${s}</div>`;

// 0 · a 5.0 cm ice cube
const S0 = 0.05, M0 = ICEM.rho * S0 ** 3;
// 1 · standing on one shoe
const A1 = M.SHOE.w * M.SHOE.l, P1 = M.PERSON.W / A1;
// 2 · the lake floor
const D2 = M.LAKE.depth, P2 = M.pAt(D2);
// 3 · a car lift: pistons of radius 2.0 cm and 10.0 cm, a 12 000 N car
const R3a = 0.020, R3b = 0.100, W3 = 12000, F3 = W3 * (R3a / R3b) ** 2;
const D3 = PA.stroke * PA.A1 / PA.A2;
// 4 · the cube all the way under
const T4 = BU.W - BU.Fb;
// 5 · wood in sea water; the steel ball on the floor
const FR5 = M.WOOD.rho / M.RHO_SEA, N5 = M.BALL.W - M.BALL.Fb;
// 6 · narrowing to 10 cm radius; filling a 1000 L tank from the wide part
const R6 = 0.10, V6 = FL.v1 * (FL.r1 / R6) ** 2, T6 = 1.0 / FL.Q;
// 7 · Bernoulli at the three points
const [B1, B2, B3] = BE.pts;
// 8 · the jet when the water is 0.60 m above the hole
const H8 = 0.60, X8 = 2 * Math.sqrt(H8 * TK.yh);
const kPa = (x, n = 1) => `${(x / 1000).toFixed(n)} kPa`;

export const PRACTICE = {
  0: [
    { q: `将 10 厘米的铝立方体（ρ = ${AL.rho} kg/m³）切成八个相等的小立方体。每个小立方体的密度为`,
      choices: [`${AL.rho / 8} kg/m³`, `${AL.rho / 2} kg/m³`, `${AL.rho} kg/m³`, `${AL.rho * 8} kg/m³`], answer: 2,
      why: `<p>每块的质量为 1/8，体积为 1/8，因此 ρ = m/V 不变。密度属于物质，不属于物体。</p>` },
    { q: `冰块 ${f(S0 * 100, 1)} 边长的质量是多少？ (ρ<sub>ice</sub> = ${ICEM.rho} 千克/m³)`,
      choices: [`${p3(ICEM.mass / 2)} kg`, `${p3(M0)} kg`, `${p3(ICEM.mass / 4)} kg`, `${p3(ICEM.rho * (S0 * 10) ** 3)} kg`], answer: 1,
      why: `<p>先转换为米：V = (${f(S0, 2)} m)³ = ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> m³.</p>${eq(`m = ρV = ${ICEM.rho} × ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> = ${p3(M0)} kg`)}<p>H将侧面减半，将体积减少到 ⅛，而不是 1/2：10 厘米立方体的 ${f(ICEM.mass, 3)} kg 变为 ${p3(M0)} kg.</p>` },
  ],
  1: [
    { q: `${M.PERSON.m} kg 人站在 <b>一个</b> 鞋上（鞋底 ${f(M.SHOE.w * 100, 0)} cm × ${f(M.SHOE.l * 100, 0)} cm）。雪上的压力为`,
      choices: [`${kPa(M.P_SHOE)}`, `${kPa(M.PERSON.m / A1, 2)}`, `${kPa(2 * P1)}`, `${kPa(P1)}`], answer: 3,
      why: `${eq(`P = F/A = mg / A = ${f(M.PERSON.W, 0)} N / ${f(A1, 3)} m² = ${kPa(P1)}`)}<p>H是两只鞋面积的一半，所以是${kPa(M.P_SHOE)}的两倍。 ${kPa(M.PERSON.m / A1, 2)} 将质量而不是重力除以面积。</p>` },
    { q: `将一颗钉子钉入木头，其 1 平方厘米的头部带有 ${M.NAIL.F} N；它不会加速。与你在头上的拇指相比，木头上的尖端施加`,
      choices: ["相同的力和相同的压力", "更大的力和更大的压力", "相同的力和更大的压力", "较小的力和较大的压力"], answer: 2,
      why: `<p>钉子处于平衡状态（几乎无质量），因此木材以相同的 ${M.NAIL.F} N 向后推。尖端面积小 200 倍，因此压力大 200 倍：${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa 与 ${f(M.NAIL.F / M.NAIL.head / 1e3, 0)} kPa.</p>` },
  ],
  2: [
    { q: `${D2} 米向下的湖底绝对压力是多少？ (<i>P</i><sub>0</sub> = ${kPa(M.P0)})`,
      choices: [`${kPa(M.gauge(D2))}`, `${kPa(P2)}`, `${kPa(M.P0)}`, `${kPa(2 * M.P0)}`], answer: 1,
      why: `${eq(`<i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> = ${kPa(M.P0)} + ${RHO} × ${f(G)} × ${D2} = ${kPa(M.P0)} + ${kPa(M.gauge(D2))} = ${kPa(P2)}`)}<p>${kPa(M.gauge(D2))} 是表压：它排除了表面上的大气。</p>` },
    { q: "一个又高又细的花瓶、一个宽碗和一个向上变窄的圆锥体，都装满了相同深度的水。底部压力为",
      choices: ["最大的在宽碗中，它容纳的水最多", "圆锥体最大，水被挤进去", "薄花瓶中最伟大的", "三个都一样"], answer: 3,
      why: "<p><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> 仅取决于开放表面以下的深度，而不取决于形状或水量。墙壁的重力不同。</p>" },
  ],
  3: [
    { q: `汽车举升机具有半径为 ${f(R3a * 100, 1)} cm 和 ${f(R3b * 100, 1)} cm 的活塞。小活塞上的什么力可以将 ${W3} N 车支撑在大活塞上？`,
      choices: [`${p3(W3 * R3a / R3b)} N`, `${p3(F3)} N`, `${p3(W3)} N`, `${p3(W3 * (R3b / R3a) ** 2)} N`], answer: 1,
      why: `<p>相同的Δ<i>P</i>作用在两个活塞上，因此<i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub>，面积为r²:</p>${eq(`<i>F</i><sub>1</sub> = ${W3} × (${f(R3a * 100, 1)} / ${f(R3b * 100, 1)})² = ${p3(F3)} N`)}<p>${p3(W3 * R3a / R3b)} N 使用半径比而不是面积。</p>` },
    { q: `在页面压力机上，小活塞 (${f(PA.A1 * 1e4, 0)} cm²) 被向下推至 ${f(PA.stroke * 100, 0)} cm。大活塞（${f(PA.A2 * 1e4, 0)} cm²）上升多远？`,
      choices: [`${p3(PA.stroke * 100 * PA.r1 / PA.r2)} cm`, `${p3(PA.stroke * 100)} cm`, `${p3(PA.stroke * 100 * PA.A2 / PA.A1)} cm`, `${p3(D3 * 100)} cm`], answer: 3,
      why: `<p>水无法被挤压，所以压下去的体积就上来了： <i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>.</p>${eq(`<i>d</i><sub>2</sub> = ${f(PA.stroke * 100, 0)} cm × ${f(PA.A1 * 1e4, 0)} / ${f(PA.A2 * 1e4, 0)} = ${p3(D3 * 100)} cm`)}<p>十六倍的力通过十六分之一的距离：工作等于锻炼。</p>` },
  ],
  4: [
    { q: `${f(BU.s * 100, 0)} 厘米铝立方体 (W = ${f(BU.W, 0)} N) 挂在绳子上，完全浸在水下。弦张力为`,
      choices: [`${p3(BU.W)} N`, `${p3(BU.Fb)} N`, `${p3(BU.W + BU.Fb)} N`, `${p3(T4)} N`], answer: 3,
      why: `${eq(`<i>F</i><sub>b</sub> = ρ<sub>water</sub><i>Vg</i> = ${RHO} × ${f(BU.V, 3)} × ${f(G)} = ${f(BU.Fb, 0)} N`)}${eq(`<i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(BU.W, 0)} − ${f(BU.Fb, 0)} = ${p3(T4)} N`)}<p>浮力使用<b>水的</b>密度，而不是铝的密度； ${p3(BU.Fb)} N 是浮力，不是张力。</p>` },
    { q: "一旦完全沉入下方，立方体就会被降低得更深。作用在其上的浮力",
      choices: ["增加，因为更深的压力更大", "减少，因为上面有更多的水", "保持不变", "增加直到等于重力"], answer: 2,
      why: "<p>更深，顶面和底面压力均上升相同的ρgΔh。它们的差 ρgs，因此 <i>F</i><sub>b</sub> = ρ<i>Vg</i> 不会改变。 （水视为不可压缩。）</p>" },
  ],
  5: [
    { q: `${M.WOOD.rho} kg/m³ 木块漂浮在海水（${M.RHO_SEA} kg/m³）而不是淡水中。其中多少部分在水下？`,
      choices: [`${f(100 * M.WOOD.rho / RHO, 1)}%`, `${f(100 * (1 - FR5), 1)}%`, `${f(100 * FR5, 1)}%`, `${f(100 * (1 - M.WOOD.rho / RHO), 1)}%`], answer: 2,
      why: `<p>浮动，<i>F</i><sub>b</sub> = <i>W</i>： ρ<sub>sea</sub><i>V</i><sub>下</sub><i>g</i> = ρ<sub>wood</sub><i>Vg</i>.</p>${eq(`<i>V</i><sub>under</sub>/<i>V</i> = ${M.WOOD.rho} / ${M.RHO_SEA} = ${f(100 * FR5, 1)}%`)}<p>密度较大的水以较小的体积容纳它，因此略小于淡水中的${f(100 * M.WOOD.rho / RHO, 1)}％。 ${f(100 * (1 - FR5), 1)}%就是上面的部分。</p>` },
    { q: `钢球（半径 ${f(M.BALL.r, 2)} m，ρ = ${M.BALL.rho} kg/m³）搁在池底。地板将其向上推`,
      choices: [`${p3(M.BALL.W)} N`, `${p3(N5)} N`, `${p3(M.BALL.Fb)} N`, `${p3(M.BALL.W + M.BALL.Fb)} N`], answer: 1,
      why: `${eq(`V = ⁴⁄₃πr³ = ${f(M.BALL.V, 4)} m³, W = ρ<sub>steel</sub>Vg = ${f(M.BALL.W, 0)} N, <i>F</i><sub>b</sub> = ρ<sub>water</sub>Vg = ${f(M.BALL.Fb, 0)} N`)}${eq(`<i>F</i><sub>N</sub> = W − <i>F</i><sub>b</sub> = ${p3(N5)} N`)}<p>水仍然向上推着一个沉没的球；地板仅供应其余部分。</p>` },
  ],
  6: [
    { q: `${f(FL.v1, 1)} m/s处的水在${f(FL.r1 * 100, 0)} cm半径的管道中流入半径为${f(R6 * 100, 0)} cm的一段。它的速度有`,
      choices: [`${p3(FL.v1 * FL.r1 / R6)} m/s`, `${p3(V6)} m/s`, `${p3(FL.v1 * (R6 / FL.r1) ** 2)} m/s`, `${p3(FL.v1 * R6 / FL.r1)} m/s`], answer: 1,
      why: `${eq(`<i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub> → <i>v</i><sub>2</sub> = <i>v</i><sub>1</sub>(r<sub>1</sub>/r<sub>2</sub>)² = ${f(FL.v1, 1)} × 3² = ${p3(V6)} m/s`)}<p>Area 为 r²，因此半径的三分之一是面积的九分之一。 ${p3(FL.v1 * FL.r1 / R6)} m/s采用半径比。</p>` },
    { q: `宽管（半径 ${f(FL.r1 * 100, 0)} cm、${f(FL.v1, 1)} m/s）需要多长时间才能充满 1000 L 水箱？`,
      choices: [`${p3(1.0 / (Math.PI * (2 * FL.r1) ** 2 * FL.v1))} s`, `${p3(1.0 / (2 * Math.PI * FL.r1 * FL.v1))} s`, `${p3(T6)} s`, `${p3(1.0 / (FL.r1 ** 2 * FL.v1))} s`], answer: 2,
      why: `${eq(`<i>Q</i> = <i>Av</i> = π(${f(FL.r1, 2)})² × ${f(FL.v1, 1)} = ${f(FL.Q, 4)} m³/s`)}${eq(`t = V/Q = 1.000 m³ / ${f(FL.Q, 4)} m³/s = ${p3(T6)} s`)}<p>1000 L 为 1 m³。使用 60 厘米直径作为半径得出的面积是原来的四倍。</p>` },
  ],
  7: [
    { q: `在页面的管道中，水在宽部以表压${kPa(B1.P, 0)}以${f(B1.v, 1)} m/s移动，并在相同高度的窄部加速到${f(B2.v, 1)} m/s。那里的表压是`,
      choices: [`${kPa(B1.P + (B2.P - B1.P) * -1, 0)}`, `${kPa(B1.P, 0)}`, `${kPa(B1.P * B1.v / B2.v, 1)}`, `${kPa(B2.P, 0)}`], answer: 3,
      why: `${eq(`<i>P</i><sub>2</sub> = <i>P</i><sub>1</sub> + ½ρ(<i>v</i><sub>1</sub>² − <i>v</i><sub>2</sub>²) = ${kPa(B1.P, 0)} + ½ × ${RHO} × (${f(B1.v, 0)}² − ${f(B2.v, 0)}²) = ${kPa(B2.P, 0)}`)}<p>流量快，压力低。 ${kPa(B1.P + (B2.P - B1.P) * -1, 0)} 的符号翻转了：水流速度加快，因为其背后的压力更高。</p>` },
    { q: `回到${f(B3.v, 1)} m/s，管道然后爬升${f(BE.H, 1)}米。高、宽部分的表压为`,
      choices: [`${kPa(B1.P + RHO * G * BE.H)}`, `${kPa(B3.P)}`, `${kPa(B1.P)}`, `${kPa(B1.P - 2 * RHO * G * BE.H)}`], answer: 1,
      why: `<p>与点 1 相同的速度，因此 ½ρv² 项取消：</p>${eq(`<i>P</i><sub>3</sub> = <i>P</i><sub>1</sub> − ρ<i>g</i>Δy = ${kPa(B1.P, 0)} − ${RHO} × ${f(G)} × ${f(BE.H, 1)} = ${kPa(B3.P)}`)}<p>提高水的压力，就像潜水更深会增加压力一样。</p>` },
  ],
  8: [
    { q: "洞上方的水位上升到其高度的四倍。喷气机离开洞口",
      choices: ["以相同的速度", `√2倍快`, "快两倍", "四倍快"], answer: 2,
      why: "<p><i>v</i> = √(2<i>gh</i>)：四倍<i>h</i>给出√4 = 2倍的速度，与一块石头从四倍的高度落下相同。</p>" },
    { q: `该洞距地面 ${f(TK.yh, 2)} 米。当水位在孔上方 ${f(H8, 2)} 米时，飞机降落时距水箱多远？`,
      choices: [`${p3(Math.sqrt(H8 * TK.yh))} m`, `${p3(X8)} m`, `${p3(M.jetRange(TK.h0))} m`, `${p3(Math.sqrt(2 * H8 * TK.yh))} m`], answer: 1,
      why: `${eq(`<i>v</i> = √(2 × ${f(G)} × ${f(H8, 2)}) = ${f(M.torricelli(H8))} m/s, t = √(2 × ${f(TK.yh, 2)} / ${f(G)}) = ${f(M.jetFlight, 3)} s`)}${eq(`x = vt = 2√(h y<sub>hole</sub>) = ${p3(X8)} m`)}<p>${p3(M.jetRange(TK.h0))} m 是油箱已满的范围 (${f(TK.h0, 1)} m)，不是现在。</p>` },
  ],
};
