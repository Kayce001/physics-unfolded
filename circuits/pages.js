// Chapter 13, page by page (after the AP Physics C E&M organizer, Units 5 and 6). Text and a chart
// on the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, HS, MAG, SPEEDUP, LEN_SCALE, K_DOT } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(n)} × 10<sup>${e < 0 ? '−' : ''}${Math.abs(e)}</sup>`; };
const heightNote = `高度：每个 ${f(1 / HS, 0)} V 一个网格。`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const cs = cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  drude: { x0: 0, x1: 4, y0: 0, y1: 2.4 },
  res: { x0: 0, x1: 2, y0: 0, y1: 12 },
  energy: { x0: 0, x1: M.BULB.run, y0: 0, y1: 60 },
  term: { x0: 0, x1: 6, y0: 0, y1: 12 },
  pload: { x0: 0, x1: 8, y0: 0, y1: 20 },
  rc: { x0: 0, x1: M.RC.cycle, y0: -100, y1: 100 },
};

const { CU, RC } = M;
const ohmI = M.OHM.E / M.OHM.R, bulbI = M.BULB.E / M.BULB.R, bulbP = bulbI * M.BULB.E;
const kr = M.solve(M.KIRCH.edges, 'bl'), kI = n => M.edgeI(M.KIRCH, kr, n), kd = M.solve(M.kirchEdges(false), 'bl');

export const PAGES = [
  {
    kicker: "第13章", title: "当前", sub: "移动中电荷",
    body: `<p class="lede">A 电池将两个端子保持在固定电势差。用一根电线将它们连接起来，金属内部的场会推动其自由电荷：<b>电流</b>.</p>
      <div class="eq"><i>I</i> = d<i>q</i>/d<i>t</i> = <i>nqAv</i><sub>d</sub>,  <i>J</i> = <i>I</i>/<i>A</i> = <i>nqv</i><sub>d</sub> = σ<i>E</i></div>
      <p>1 A = 1 C/s，按 <i>positive</i> 电荷移动计算；电子向另一个方向漂移。板 Δ<i>x</i> = <i>v</i><sub>d</sub>Δ<i>t</i> 长期持有 <i>nqA</i>Δ<i>x</i>，所有这些都与 <i>A</i> 相交Δ<i>t</i>。一般来说，<i>I</i> = ∫<b>J</b>·d<b>A</b>.</p>
      <table class="data">
        <tr><td>1 1 mm² 铜中的 A：<i>n</i></td><td>${sci(CU.n, 1)} m⁻³</td></tr>
        <tr><td>漂移速度 <i>v</i><sub>d</sub></td><td>${f(CU.vd * 1e3, 3)} mm/s</td></tr>
      </table>
      <p>每个电子加速，撞击离子，停止，再次启动（德鲁德模型），平均 <i>v</i><sub>d</sub>：${f(CU.hours, 1)} h 每米。一盏灯仍然立刻亮起，因为场在电线上奔跑。</p>
      <div class="charts">${chart({ ...R.drude, xlabel: 'time (collisions)', ylabel: 'one electron’s speed / v_d', cursors: ['drude'], label: 'Sawtooth speed of one electron, averaging the drift speed',
        series: [{ pts: curve(t => M.drudeV(t, 1, 1), 0, 3.999, 400) }, { cls: 'trend', pts: [[0, 1], [4, 1]], tag: [3.25, 1, 'v_d'] }] })}</div>
      <p class="hintline"> 单击穿过 <i>A</i> 的板的线。绘制${MAG}×实物尺寸；漂移${SPEEDUP}×比生命更快。</p>`,
    cam: { target: [STATIONS.wire, 0.95, 0], az: -16, el: 14, dist: 21 }, lit: 'wire', scene: 'wire', look: {},
    fig: "电子逆电流漂移",
  },
  {
    kicker: '13.1', title: "阻力", sub: "又长又细的抵抗力更强",
    body: `<p class="lede"><b>电阻</b> <i>R</i> = Δ<i>V</i>/<i>I</i>，以欧姆（V/A）为单位，是推动电流通过某物的难度。</p>
      <div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = <i>L</i>/σ<i>A</i></div>
      <p>材料设定<b>电阻率</b> ρ = 1/σ（铜${sci(M.RHO.copper, 2)}、镍铬合金${sci(M.RHO.nichrome, 2)} Ω·m）；形状设置 <i>L</i>/<i>A</i>。两倍长：两个串联，两倍 <i>R</i>。两倍直径：四股并排，四分之一<i>R</i>.</p>
      <p>镍铬合金线 ${f(M.RES.dThin * 1e3, 1)} 和 ${f(M.RES.dThick * 1e3, 1)} 毫米宽，每根 1.5 V。两者的载流子漂移速度相同（相同的 <i>E</i> = Δ<i>V</i>/<i>L</i>）；厚的有四倍。</p>
      <div class="charts">${chart({ ...R.res, xlabel: 'length L (m)', ylabel: 'R (Ω)', cursors: ['thin', 'thick'], label: 'Resistance against length for two diameters',
        series: [{ pts: curve(M.rThin, 0, 2, 4), tag: [1.15, M.rThin(1.15), 'd'] }, { pts: curve(M.rThick, 0, 2, 4), tag: [1.5, M.rThick(1.5), '2d'] }] })}</div>
      <p class="hintline">单击将粗线分成四份。每米长度 ${LEN_SCALE * 100} 厘米；厚度放大.</p>`,
    cam: { target: [STATIONS.resist - 0.5, 0.35, 0], az: -14, el: 30, dist: 15 }, lit: 'wires', scene: 'wires', look: {},
    fig: "相同的 1.5 V，不同的形状",
  },
  {
    kicker: '13.2', title: "欧姆定律", sub: 'V = IR',
    body: `<p class="lede">对于欧姆导体，电流与其两端的电压成正比；比率就是它的电阻。</p>
      <p>从金属中的欧姆定律开始，<i>J</i> = σ<i>E</i>，其中 <i>E</i> = Δ<i>V</i>/<i>L</i> 沿导线：</p>
      <div class="eq"><i>I</i> = <i>JA</i> = σ<i>A</i>Δ<i>V</i>/<i>L</i>  ⟹  Δ<i>V</i> = <i>IR</i></div>
      <p>${M.OHM.E} V 横跨 ${M.OHM.R} Ω 驱动 ${f(ohmI, 1)} A。每个点均以其电势高度绘制：电池提升电荷 ${M.OHM.E} V，理想导线保持水平，电阻器呈斜坡下降。随着电流通过电阻器，您可以得到 <i>lose</i> 电势。</p>
      <div class="charts">${chart({ x0: 0, x1: 9, y0: 0, y1: 3, xlabel: 'ΔV (V)', ylabel: 'I (A)', label: 'Current against voltage for a 3 ohm resistor: a straight line',
        series: [{ pts: [[0, 0], [9, 3]], tag: [6.6, 2.15, 'slope 1/R'] }], marks: [[M.OHM.E, ohmI, `${M.OHM.E} V, ${f(ohmI, 1)} A`, 8, 14]] })}</div>
      <p class="hintline">单击电阻器中的字段。 ${heightNote}</p>`,
    cam: { target: [STATIONS.ohm, 0.8, 0.1], az: -34, el: 16, dist: 14 }, lit: 'ohm', scene: 'ohm', look: { ohm: 1 },
    fig: "向上通过电池，向下通过电阻",
  },
  {
    kicker: '13.3', title: "电源", sub: 'P = IΔV',
    body: `<p class="lede">电池中每次库仑增益 Δ<i>V</i> 焦耳，并在电阻器中以热量的形式释放，在灯泡中则以光的形式释放。</p>
      <div class="eq"><i>P</i> = d<i>U</i>/d<i>t</i> = <i>I</i>Δ<i>V</i> = <i>I</i>²<i>R</i> = Δ<i>V</i>²/<i>R</i></div>
      <p>最后两个使用Δ<i>V</i> = <i>IR</i>：当您知道电流（串联）时，<i>I</i>²<i>R</i>，当您知道电压（并联）时，Δ<i>V</i>²/<i>R</i>。单位：瓦，J/s.</p>
      <table class="data">
        <tr><td><i>I</i>Δ<i>V</i></td><td>${f(bulbI, 2)} A × ${M.BULB.E} V = ${f(bulbP, 1)} W</td></tr>
        <tr><td><i>I</i>²<i>R</i></td><td>(${f(bulbI, 2)} A)² × ${M.BULB.R} Ω = ${f(bulbI ** 2 * M.BULB.R, 1)} W</td></tr>
        <tr><td>Δ<i>V</i>²/<i>R</i></td><td>(${M.BULB.E} V)² / ${M.BULB.R} Ω = ${f(M.BULB.E ** 2 / M.BULB.R, 1)} W</td></tr>
      </table>
      <p>Energy <i>E</i> = <i>Pt</i>: ${f(bulbP * M.BULB.run, 0)} J 每 ${M.BULB.run} s.</p>
      <div class="charts">${chart({ ...R.energy, xlabel: 'time (s)', ylabel: 'energy (J)', cursors: ['energy'], label: 'Energy delivered against time: a straight line of slope P', series: [{ pts: [[0, 0], [M.BULB.run, bulbP * M.BULB.run]], tag: [5.2, 25, 'slope P = 6 W'] }] })}</div>
      <p class="hintline">点击灯泡将玻璃升起。</p>`,
    cam: { target: [STATIONS.power, 0.25, 0.05], az: -14, el: 42, dist: 12.5 }, lit: 'bulb', scene: 'bulb', look: {},
    fig: "六瓦的热量和光",
  },
  {
    kicker: '13.4', title: "电动势", sub: "真正的电池",
    body: `<p class="lede"><b>电动势</b> ℰ 是电池化学成分提供的每库仑能量。尽管有这个名字，但不是一种力量。</p>
      <p>A真电池有一个<b>内阻</b> <i>r</i>，电流在里面损失<i>Ir</i>：</p>
      <div class="eq">Δ<i>V</i><sub>terminal</sub> = ℰ − <i>Ir</i>,  <i>I</i> = ℰ/(<i>R</i> + <i>r</i>)</div>
      <p>这里 ℰ = ${M.CELL.E} V，<i>r</i> = ${M.CELL.r} Ω，灯泡的 <i>R</i> 扫描 ${M.CELL.Rmin}–${M.CELL.Rmax} Ω。电流更大、端电压更低，<i>I</i>²<i>r</i> 可以加热电池。灯泡得到ℰ²<i>R</i>/(<i>R</i> + <i>r</i>)²； d<i>P</i>/d<i>R</i> = 0 在 <i>R</i> = <i>r</i> 处，最亮处：ℰ²/4<i>r</i> = ${f(M.CELL.E ** 2 / (4 * M.CELL.r), 0)} W.</p>
      <div class="charts">${chart({ ...R.pload, xlabel: 'load R (Ω)', ylabel: 'power to the bulb (W)', cursors: ['pload'], vlines: [[M.CELL.r, 'r']], label: 'Load power against load resistance, peaking at R = r',
        series: [{ pts: curve(M.loadP, 0, 8) }] })}</div>
      <p class="hintline">点击电池将其打开。 ${heightNote}</p>`,
    cam: { target: [STATIONS.cell, 0.2, 0.05], az: -14, el: 42, dist: 14 }, lit: 'cell', scene: 'cell', look: {},
    fig: "电动势 12 V，内阻 2 Ω",
  },
  {
    kicker: '13.5', title: "串联和并联", sub: "一条路，或并排",
    body: `<p class="lede"><b>系列</b>中的电流只有一条路径，因此通过每个电阻的电流是相同的，并且电压相加。在 <b>平行</b> 中，每个分支跨越相同的两点，因此电压相同，电流相加。</p>
      <div class="eq"><i>R</i><sub>s</sub> = <i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>,  1/<i>R</i><sub>p</sub> = 1/<i>R</i><sub>1</sub> + 1/<i>R</i><sub>2</sub> + …</div>
      <table class="data cols">
        <tr><th>系列，9 V</th><th>并联，9 V</th></tr>
        <tr><td><i>R</i><sub>eq</sub> = 2 + 4 = 6 Ω</td><td><i>R</i><sub>eq</sub> = ${f(M.parallelR([2, 4, 6]), 3)} Ω</td></tr>
        <tr><td><i>I</i> = 9/6 = 1.5 A</td><td><i>I</i><sub>1</sub> = 9/2 = 4.5 A</td></tr>
        <tr><td>Δ<i>V</i><sub>1</sub> = 1.5 × 2 = 3 V</td><td><i>I</i><sub>2</sub> = 9/4 = 2.25 A</td></tr>
        <tr><td>Δ<i>V</i><sub>2</sub> = 1.5 × 4 = 6 V</td><td><i>I</i><sub>3</sub> = 9/6 = 1.5 A</td></tr>
        <tr><td>3 + 6 = 9V ✓</td><td><i>I</i> = 8.25A ✓</td></tr>
      </table>
      <p>更多系列提高<i>R</i><sub>eq</sub>；更多并行降低它，低于最小的分支。并行地，点沿着分支电流聚集的轨道加速。</p>
      <p class="hintline">单击任一电路将其升高。点速度∝电流（${f(K_DOT.parallel / K_DOT.series, 1)}×并联每放大器的速度）。</p>`,
    cam: { target: [STATIONS.sp + 0.07, 0.1, 0.1], az: -5, el: 50, dist: 20.5 }, lit: null, scene: 'sp', look: {},
    fig: "2Ω和4Ω； 2、4 和 6 Ω",
  },
  {
    kicker: '13.6', title: "组合", sub: "减少，然后恢复",
    body: `<p class="lede">A串并联电路逐步减少到一个等效电阻。然后对每个电压和电流进行反向计算。</p>
      <ol class="rules">
        <li>R<sub>2</sub>、R<sub>4</sub>、R<sub>5</sub> 承载一个电流：串联，4 + 2 + 2 = ${M.COMBO.R245} Ω.</li>
        <li>R<sub>3</sub> 和 ${M.COMBO.R245} Ω 跨越相同的两点：并联，1/(½ + ⅛) = ${f(M.COMBO.R2345, 1)} Ω.</li>
        <li>R<sub>1</sub>与其串联：<i>R</i><sub>eq</sub> = 2 + ${f(M.COMBO.R2345, 1)} = ${f(M.COMBO.Req, 1)} Ω，所以<i>I</i> = 9/${f(M.COMBO.Req, 1)} = ${f(9 / M.COMBO.Req, 1)} A.</li>
      </ol>
      <table class="data">
        <tr><th>退出</th><th>Δ<i>V</i></th><th><i>I</i></th></tr>
        <tr><td>R<sub>1</sub></td><td>2.5 × 2 = 5 V</td><td>2.5 A</td></tr>
        <tr><td>R<sub>3</sub>（并联部分）</td><td>9 − 5 = 4 V</td><td>4/2 = 2.0 A</td></tr>
        <tr><td>R<sub>2</sub>，R<sub>4</sub>， R<sub>5</sub></td><td>2, 1, 1 V</td><td>4/8 = 0.5 A</td></tr>
      </table>
      <p>每个阶段都绘制相同的2.5 A：这就是“等效”的意思。 （组织者写为 R<sub>245</sub> = 10 Ω 和 3.667 Ω；如标签所示，4 + 2 + 2 = 8 Ω。）</p>
      <p class="hintline">点击完整电路(1)将其升起。</p>`,
    cam: { target: [STATIONS.combo, 0.1, 0.15], az: -4, el: 56, dist: 27 }, lit: 'combo', scene: 'combo', look: {},
    fig: "五电阻对一电阻",
  },
  {
    kicker: '13.7', title: "基尔霍夫法则", sub: "电荷和能量，保持",
    body: `<p class="lede">不同支路的两节电池不会减少为一个电阻。基尔霍夫的两条规则总是有效的。</p>
      <ul class="rules"><li><b>连接规则</b>（电荷守恒）：输入=输出。在A处，<i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>.</li>
        <li><b>循环规则</b>（能量守恒）：任意循环ΣΔ<i>V</i> = 0。当电流通过电阻时，−<i>IR</i>；通过电池 − 至 +, +ℰ.</li></ul>
      <div class="eq">1:  −10<i>I</i><sub>1</sub> − 5<i>I</i><sub>2</sub> − 10<i>I</i><sub>1</sub> + 12 = 0</div>
      <div class="eq">2:  −20<i>I</i><sub>3</sub> + 6 − 20<i>I</i><sub>3</sub> + 5<i>I</i><sub>2</sub> = 0</div>
      <p>所以 <i>I</i><sub>1</sub> = ${f(kI('R1'), 2)} A, <i>I</i><sub>2</sub> = ${f(kI('R5'), 2)} A, <i>I</i><sub>3</sub> = ${f(kI('R3'), 2)} A、主办方的答案。他们需要 6 V 电池的 + 端位于底部，如下图所示。它的工作表在顶部绘制+：然后循环2有−6并且<i>I</i><sub>3</sub> = ${f(kd.I[2], 3)} A，电流相反。</p>
      <p class="hintline">单击将其升起并行走每个循环。 ${heightNote}</p>`,
    cam: { target: [STATIONS.kirch, 0.3, 0.1], az: -8, el: 46, dist: 16 }, lit: 'kirch', scene: 'kirch', look: {},
    fig: "I₁=I2+I₃；每个循环 ΣΔV = 0",
  },
  {
    kicker: '13.8', title: "RC电路", sub: "充电和放电",
    body: `<p class="lede">在<b>a</b>时电池通过<i>R</i>给电容充电；在 <b>b</b> 处，电容器将电流推回 <i>R</i>，直至其为空。</p>
      <div class="eq">ℰ − <i>IR</i> − <i>q</i>/<i>C</i> = 0, <i>I</i> = d<i>q</i>/d<i>t</i></div><div class="eq"><i>q</i> = ℰ<i>C</i>(1 − e<sup>−<i>t</i>/<i>RC</i></sup>)</div>
      <p>(单独: ∫d<i>q</i>/(ℰ<i>C</i> − <i>q</i>) = ∫d<i>t</i>/<i>RC</i>。) <i>I</i> = (ℰ/<i>R</i>)e<sup>−<i>t</i>/<i>RC</i></sup>。 τ = <i>RC</i> = ${f(RC.tau, 1)} s：一个 τ 后，<i>q</i> 为 ℰ<i>C</i> = ${f(RC.Qmax * 1e3, 1)} mC 的 63.2%，<i>I</i> 为 ℰ/<i>R</i> 的 36.8% = ${f(RC.Imax * 1e3, 1)} 毫安。放电，<i>q</i> = <i>Q</i><sub>max</sub>e<sup>−<i>t</i>/<i>RC</i></sup>.</p>
      <p>E空，电容充当导线；充实，作为休息。电池的<i>Q</i>ℰ = ${f(RC.Qmax * RC.E * 1e3, 1)} mJ，一半是储存的，一半是热量。</p>
      <div class="charts">${chart({ ...R.rc, xlabel: 'time (s)', ylabel: '% of max', cursors: ['rcq', 'rci'], vlines: [[RC.tau, 'τ'], [RC.Tch, 'b'], [RC.Tch + RC.tau, 'τ']],
        label: 'Charge and current against time while charging and discharging',
        series: [{ cls: 'zero', pts: [[0, 0], [RC.cycle, 0]] }, { pts: curve(t => 100 * M.rc(t).Q / RC.Qmax, 0, RC.cycle - 1e-6, 400), tag: [3.5, 92, 'q'] },
          { cls: 'curve total', pts: curve(t => 100 * M.rc(t).I / RC.Imax, 0, RC.cycle - 1e-6, 400), tag: [3.4, 14, 'I'] }],
        marks: [[RC.tau, 63.2, '63.2%'], [RC.tau, 36.8, '36.8%', 6, -6]] })}</div>
      <p class="hintline">点击提高它：Δ<i>V</i><sub>R</sub>随着Δ<i>V</i><sub>C</sub>的增长而缩小。</p>`,
    cam: { target: [STATIONS.rc, 0.25, 0.1], az: -10, el: 44, dist: 15 }, lit: 'rc', scene: 'rc', look: {},
    fig: '20 kΩ, 100 µF: τ = 2.0 s',
  },
];

// ---------- click a scene: what it breaks into ----------
const vC = n => n.toFixed(2);
export const PLATES = {
  wire: { text: `蓝色板是 <i>A</i> 和上游距离 Δ<i>x</i> = <i>v</i><sub>d</sub>Δ<i>t</i> 之间的电线。其中每个电子在 Δ<i>t</i> 内穿过 <i>A</i>，因此通过 <i>A</i> 的电荷为 <i>nqA</i>Δ<i>x</i>，电流为 <i>nqAv</i><sub>d</sub>。`,
    facts: () => { const dx = 1.5 / MAG, dt = dx / CU.vd, Q = CU.n * M.E_CH * CU.A * dx; return [["板坯长度Δx", `${f(dx * 1e3, 2)} mm (drawn 1.5 units)`], ["穿越时间 Δt = Δx/v_d", `${f(dt, 1)} s`], ["其中电荷 nqAΔx", `${f(Q, 1)} C`], ['I = Q/Δt', `${f(Q / dt, 2)} A`], ["碰撞之间的时间", `${f(CU.tauC * 1e15, 0)} fs`]]; } },
  wires: { text: `粗线分成四股细线，每股都像细线一样。并排的四个相等路径在相同电压下承载四倍的电流：四分之一的电阻。`,
    facts: s => { const L = M.resLength(s.clock); return [['length L', `${f(L)} m`], ['thin: R = ρL/A', `${f(M.rThin(L))} Ω, I ${f(1.5 / M.rThin(L))} A`], ['thick: R/4', `${f(M.rThick(L))} Ω, I ${f(1.5 / M.rThick(L))} A`], ['ρ (nichrome)', `${sci(M.RES.rho, 2)} Ω·m`]]; } },
  ohm: { text: `蓝色箭头：电阻器中的磁场，指向斜坡下方。在理想的电线中，没有斜率，因此不需要场：零电阻，零电压。整个 ${M.OHM.E} V 都消耗在电阻器上。`,
    facts: () => [["电池电量上升", `+${M.OHM.E} V`], ['wires', '0 V'], ["电阻压降 IR", `−${f(ohmI * M.OHM.R, 1)} V`], ['current', `${f(ohmI, 1)} A`], ["绕圈", '0 V']] },
  bulb: { text: `玻璃下面有一圈细钨丝：一种温度足够高而发光的电阻器。灯泡无非就是电路中的${M.BULB.R}Ω。`,
    facts: s => { const t = s.clock % M.BULB.run; return [['P = IΔV', `${f(bulbP, 1)} W`], ['P = I²R', `${f(bulbI ** 2 * M.BULB.R, 1)} W`], ['P = ΔV²/R', `${f(M.BULB.E ** 2 / M.BULB.R, 1)} W`], ["到目前为止的能量 E = Pt", `${f(bulbP * t, 1)} J`]]; } },
  cell: { text: `内部：一个理想的 ${M.CELL.E} V emf 和一个串联的 ${M.CELL.r} Ω 电阻。升高后，电池将电荷 ${M.CELL.E} V 升起，内部电阻将 <i>Ir</i> 返回到端子之前。`,
    facts: s => { const R = M.cellLoad(s.clock), I = M.cellI(R); return [['load R', `${f(R)} Ω`], ['current I = ℰ/(R + r)', `${f(I)} A`], ["迷失在红外线中", `${f(I * M.CELL.r)} V`], ['terminal ΔV = ℰ − Ir', `${f(M.terminalV(I))} V`], ["灯泡功率", `${f(M.loadP(R))} W`], ["I²r 内部浪费", `${f(I * I * M.CELL.r)} W`]]; } },
  series: { text: `升高时，电池电压升高 9V，电流依次下降两个斜坡：3V 下降 2Ω，6V 下降 4Ω。电阻越大，电压份额越大。`,
    facts: () => [['R_eq', '6 Ω'], ['I (everywhere)', '1.5 A'], ['ΔV₁', '3.0 V'], ['ΔV₂', '6.0 V'], ['sum', '9.0 V']] },
  parallel: { text: `拉高后，左轨电压为 9 V，右轨电压为 0 V，因此每个分支都会降低全部 9 V 电压。每个分支都有自己的电流 ΔV/R；铁轨承载着总和。`,
    facts: () => [["每个分支上的 ΔV", '9.0 V'], ['I₁ (2 Ω)', '4.50 A'], ['I₂ (4 Ω)', '2.25 A'], ['I₃ (6 Ω)', '1.50 A'], ['battery', '8.25 A'], ['R_eq', `${f(M.parallelR([2, 4, 6]), 3)} Ω`]] },
  combo: { text: `升高：将 R<sub>1</sub> 降低 5 V，然后同时以两种方式将剩余的 4 V 电压降低：同时将 R<sub>3</sub> 降低，或分三步降低 R<sub>2</sub>，即 2、1 和 1 V， R<sub>4</sub>、R<sub>5</sub>。`,
    facts: () => [['R_eq', `${f(M.COMBO.Req, 1)} Ω`], ["电池电流", '2.5 A'], ['across R₁', '5.0 V'], ['across R₃', '4.0 V, 2.0 A'], ['R₂, R₄, R₅', '2.0, 1.0, 1.0 V at 0.5 A']] },
  kirch: { text: `提高，每一点都发挥其电势。蓝色球先走循环 1，然后走循环 2，将每次上升和下降相加。它总是回到开始的地方：ΣΔV = 0。`,
    facts: s => [['V at A', `${f(kr.V.a)} V`], ['V at B', `${f(kr.V.b)} V`], ['I₁ = I₂ + I₃', `${f(kI('R1'), 3)} = ${f(kI('R5'), 3)} + ${f(kI('R3'), 3)} A`], ["步行循环", `${s.walk.loop}`], ["到目前为止 ΣΔV", `${f(s.walk.sum)} V`]] },
  rc: { text: `升高：电池升高12V；电阻器的斜坡为 <i>IR</i>，电容器的阶跃为 <i>q</i>/<i>C</i>。充电时，电阻的份额随着电容的增大而减小；它们总是增加到 12 V。放电时，电池被切断，电容器的阶跃将电流驱动回来。`,
    facts: s => { const r = s.rc; return [['switch', r.charging ? 'a: charging' : 'b: discharging'], ["自从切换以来", `${f(r.s, 1)} s = ${f(r.s / RC.tau, 2)} τ`], ['q', `${vC(r.Q * 1e3)} mC (${f(100 * r.Q / RC.Qmax, 1)}%)`], ['I', `${f(r.I * 1e3, 3)} mA`], ['ΔV_R', `${f(Math.abs(r.VR))} V`], ['ΔV_C', `${f(r.Vc)} V`], ['stored q²/2C', `${f(r.Q ** 2 / (2 * RC.C) * 1e3)} mJ`]]; } },
};
