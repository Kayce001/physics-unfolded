// Chapter 14: magnetic fields, on the shared book.
import { startBook } from '../engine/book.js?v=20261102-nav';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CH, R, MAGFLUX, sci } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const uT = x => f(x * 1e6, 1);
const deg = Math.PI / 180;

startBook({
  no: 14, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: s => W.update(s), labels: W.labels };
  },
  state: (clock, reduced) => ({ clock: reduced ? 4 : clock * M.SLOW }),
  readout(s, page) {
    const c = s.clock;
    switch (page.scene) {
      case 'magnet': return `B在中心 ${f(M.magnetB([0, 0, 0])[0] * 1000, 0)} mT\nN 轮结束：出局 ${f(MAGFLUX.out * 1e6, 0)} μWb, in ${f(MAGFLUX.in * 1e6, 0)} μWb`;
      case 'rhr': { const d = M.rhrAngle(c); return `θ ${f(d, 0)}°   v ${sci(M.RHR.v, 1)} m/s   B ${f(M.RHR.B)} T\nF = qvB sin θ = ${sci(Math.max(M.RHR.Fmax * Math.sin(d * deg), 1e-20))} N`; }
      case 'cyclo': { const t = M.cycTime(c) % M.CYC.T; return `t ${f(t * 1e6, 3)} μs   T = 2πm/qB = ${f(M.CYC.T * 1e6, 3)} μs\nr₁ ${f(M.CYC.r[0] * 100)} cm   r₂ ${f(M.CYC.r[1] * 100)} cm`; }
      case 'selector': return `E/B = ${sci(M.SEL.v0, 1)} m/s\nE ${f(M.SEL.E, 0)} V/m   B ${f(M.SEL.B, 3)} T`;
      case 'loop': { const d = M.loopAngle(c); return `θ ${f(d, 0)}°   τ = μB sin θ = ${f(M.len(M.loopTorque(d)), 3)} N·m\nU = −μB cos θ = ${f(M.loopU(d), 3)} J`; }
      case 'ampere': { const r = M.ampR(c), B = M.ampereB(r); return `r ${f(r * 100, 1)} cm   B ${uT(B)} μT\nB·2πr = ${sci(B * 2 * Math.PI * r)} T·m = μ₀I   Φ ${f(M.FLUX.phi * 1e6)} μWb`; }
      case 'ring': { const z = M.ringZ(c); return `z ${f(z * 100, 1)} cm   B ${uT(M.ringAxis(z))} μT\n中心 μ₀I/2R = ${uT(M.RING.Bc)} μT`; }
      case 'wires': return `${f(M.WIRES.I, 0)} 每一个， ${f(M.WIRES.d * 100, 0)} 相距厘米\nF/L = ${f(M.WIRES.FL * 1000)} mN/m：吸引、排斥`;
      case 'solenoid': { const r = M.torR(c); return `螺线管: B ${uT(M.solB([0, 0, 0])[0])} μT   μ₀nI ${uT(M.SOL.B)} μT\n环形线圈: r ${f(r * 100, 1)} cm   B ${uT(M.torIdeal(r))} μT`; }
    }
    return '';
  },
  onFrame(s, sheets) {
    const q = sel => sheets.flatMap(el => [...el.querySelectorAll(sel)]);
    const put = (key, r, x, y) => q(`circle[data-cursor="${key}"]`).forEach(el => { el.setAttribute('cx', CH.sx(x, r.x0, r.x1)); el.setAttribute('cy', CH.sy(Math.min(Math.max(y, r.y0), r.y1), r.y0, r.y1)); });
    const c = s.clock, d = M.rhrAngle(c), L = M.loopAngle(c), r = M.ampR(c), z = M.ringZ(c);
    put('rhr', R.rhr, d, M.RHR.Fmax * Math.sin(d * deg) / 1e-14);
    put('loop', R.loop, L, M.LOOP.tmax * Math.sin(L * deg));
    put('ampere', R.ampere, r * 100, M.ampereB(r) * 1e6);
    put('ring', R.ring, z * 100, M.ringAxis(z) * 1e6);
  },
});
