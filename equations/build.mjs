// Builds equations/index.html: the AP Physics 1, C: Mechanics and C: E&M equation sheets, each
// row linked to the atlas pages that show it. Run: node equations/build.mjs (then node equations/check.mjs).
// Transcribed from the "Table of Information: Equations" appendix of each course's Course and Exam Description
// (apcentral.collegeboard.org, effective fall 2024; sheets © 2025 College Board), in the sheets' order and notation.
// Chip labels come from each chapter's pages.js (kicker + title), so they follow renumbering.
// Markup shorthand in the data: {x} italic, _{..} subscript, ^{..} superscript (may nest {x}), !{..} vector (arrow).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { localizeHtml } from './localize.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ');

// ---------- page titles from pages.js ----------
const pages = {};
for (const c of CHAPTERS) {
  const src = fs.readFileSync(path.join(ROOT, c, 'pages.js'), 'utf8');
  const list = [...src.matchAll(/kicker:\s*(['"])(.*?)\1,\s*title:\s*(['"])(.*?)\3/g)];
  list.forEach(([, , k, , t], i) => {
    const no = i === 0 ? `第 ${CHAPTERS.indexOf(c) + 1} 章` : k.split(' ')[0];
    pages[`${c}/${i}`] = [no, t];
  });
}

const md = s => {
  s = s.replace(/!\{([^{}]*)\}/g, '<i class="vec">$1</i>').replace(/(?<![_^])\{([^{}]*)\}/g, '<i>$1</i>');
  for (let p; p !== s;) { p = s; s = s.replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>').replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>'); }
  return s;
};
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

let links = 0;
const chips = refs => {
  if (refs === null) return '';                      // math reference rows: no chips, no mark
  const list = refs.split(/\s+/).filter(Boolean);
  if (!list.length) return "<span class=\"none\">尚未显示</span>";
  return list.map(r => {
    if (!pages[r]) throw new Error('unknown page ' + r);
    const [c, i] = r.split('/'); links++;
    const [no, t] = pages[r];
    return `<a href="../${c}/#${i}">${no} ${esc(t)}</a>`;
  }).join('');
};

// ---------- the sheets ----------
// constants: [name, value markup, refs]; rows: [equation markup, atlas label, refs ('' = not shown yet, null = math)]
// Groups with `same` are on that sheet too, identical to the group linked.
const G_CONST = ["万有引力常数", '{G} = 6.67 × 10^{−11} m^{3}/(kg·s^{2}) = 6.67 × 10^{−11} N·m^{2}/kg^{2}', 'circular/7 circular/8'];
const G_ACC = ["地球表面重力加速度的大小", '{g} = 9.8 m/s^{2}', 'kinematics/3 circular/7'];
const G_FIELD = ["地球表面引力场强度的大小", '{g} = 9.8 N/kg', 'circular/7'];
const PREFIXES = [['10^{12}', 'tera', 'T'], ['10^{9}', 'giga', 'G'], ['10^{6}', 'mega', 'M'], ['10^{3}', 'kilo', 'k'], ['10^{−2}', 'centi', 'c'],
  ['10^{−3}', 'milli', 'm'], ['10^{−6}', 'micro', 'μ'], ['10^{−9}', 'nano', 'n'], ['10^{−12}', 'pico', 'p']];
const TRIG = [['θ', '0°', '30°', '37°', '45°', '53°', '60°', '90°'],
  ['sin θ', '0', '1/2', '3/5', '√2/2', '4/5', '√3/2', '1'],
  ['cos θ', '1', '√3/2', '4/5', '√2/2', '3/5', '1/2', '0'],
  ['tan θ', '0', '√3/3', '3/4', '1', '4/3', '√3', '∞']];
const MECH_VARS_L = "{a} = 加速度 · {d} = 距离 · {E} = 能量 · {f} = 频率 · {F} = 力 · {J} = 冲量 · {k} = 弹簧常数 · {K} = 动能 · ℓ = 长度 · {m} = 质量 · {M} = 质量 · {p} = 动量 · {P} = 功率 · {r} = 半径、距离或位置 · {t} = 时间 · {T} = 周期 · {U} = 势能 · {v} = 速度或速度 · {W} = 功 · {x} = 位置或距离 · {y} = 垂直位置 · λ = 线性质量密度 · μ = 摩擦系数";
const MECH_VARS_R = "{a} = 加速度 · {d} = 距离 · {f} = 频率 · {F} = 力 · {I} = 转动惯量 · {k} = 弹簧常数 · {K} = 动能 · ℓ = 长度 · {L} = 角动量 · {m} = 质量 · {M} = 质量 · {p} = 动量 · {r} = 半径、距离或位置 · {t} = 时间 · {T} = 周期 · {v} = 速度或速度 · {W} = 功 · {x} = 位置或距离 · α = 角加速度 · θ = 角位置 · τ = 力矩 · φ = 相位角 · ω = 角频率或角速度";

const SHEETS = [
  {
    id: 'physics-1', nav: 'Physics 1', title: "AP物理1", sub: "基于代数·2024 年秋季生效",
    constants: [
      G_CONST,
      ["1个大气压", '1 atm = 1.0 × 10^{5} N/m^{2} = 1.0 × 10^{5} Pa', 'fluids/2'],
      G_ACC, G_FIELD,
    ],
    units: [['hertz', 'Hz'], ['joule', 'J'], ['kilogram', 'kg'], ['meter', 'm'], ['newton', 'N'], ['pascal', 'Pa'], ['second', 's'], ['watt', 'W']],
    conventions: ["除非另有说明，否则任何问题的参考系都被假定为惯性的。",
      "除非另有说明，否则假定空气阻力可以忽略不计。",
      "除非另有说明，否则弹簧和弦被假定为理想的。",
      "除非另有说明，否则假定流体是理想的，并且假定管道完全充满流体。"],
    groups: [
      { h: "几何和三角学", id: 'geometry', vars: "{A} = 面积 · {b} = 底面 · {C} = 周长 · {h} = 高度 · ℓ = 长度 · {r} = 半径 · {s} = 弧长 · {S} = 表面积 · {V} = 体积 · {w} = 宽度 · θ = 角度",
        rows: [
          ['{A} = {b}{h}', 'Rectangle', null],
          ['{A} = ½{b}{h}', 'Triangle', 'energy/5 momentum/10'],
          ['{A} = π{r}^{2} &nbsp; {C} = 2π{r} &nbsp; {s} = {r}θ', 'Circle', 'circular/0 fluids/6 circular/6 rotation/1'],
          ['{V} = ℓ{w}{h}', "长方体", 'fluids/0'],
          ['{V} = π{r}^{2}ℓ &nbsp; {S} = 2π{r}ℓ + 2π{r}^{2}', 'Cylinder', 'gauss/2 gauss/6'],
          ['{V} = <sup>4</sup>⁄<sub>3</sub>π{r}^{3} &nbsp; {S} = 4π{r}^{2}', 'Sphere', 'gauss/1 gauss/5'],
          ["{a}^{2} + {b}^{2} = {c}^{2} &nbsp; sin θ = {a}/{c} &nbsp; cos θ = {b}/{c} &nbsp; tan θ = {a}/{b}", "直角三角形", 'kinematics/7 kinematics/8 newton/10 momentum/7'],
        ] },
      { h: "力学和流体·左栏", vars: "{a} = 加速度 · {d} = 距离 · {E} = 能量 · {F} = 力 · {J} = 冲量 · {k} = 弹簧常数 · {K} = 动能 · {m} = 质量 · {p} = 动量 · {P} = 功率 · {r} = 半径或距离 · {t} = 时间 · {U} = 势能 · {v} = 速度或速度 · {W} = 功 · {x} = 位置 · {y} = 垂直位置 · θ = 角度 · μ =摩擦系数",
        rows: [
          ['{v}_{{x}} = {v}_{{x}0} + {a}_{{x}}{t}', "恒定加速度下的速度", 'kinematics/5 kinematics/3'],
          ['{x} = {x}_{0} + {v}_{{x}0}{t} + ½{a}_{{x}}{t}^{2}', "恒定加速度位置", 'kinematics/5 kinematics/6 electrostatics/8'],
          ['{v}_{{x}}^{2} = {v}_{{x}0}^{2} + 2{a}_{{x}}({x} − {x}_{0})', "没有时间的速度", 'kinematics/5'],
          ['!{x}_{cm} = Σ{m}_{{i}}!{x}_{{i}} / Σ{m}_{{i}}', "质心", 'newton/8 momentum/8 momentum/11'],
          ['!{a}_{sys} = Σ!{F} / {m}_{sys} = !{F}_{net} / {m}_{sys}', "牛顿第二定律", 'newton/4 newton/9 circular/1'],
          ['|!{F}_{{g}}| = {G}{m}_{1}{m}_{2} / {r}^{2}', "万有引力", 'circular/7 circular/8'],
          ['|!{F}_{{f}}| ≤ |μ!{F}_{{N}}|', 'Friction', 'newton/6 circular/2 energy/10 rotation/4 rotation/10'],
          ['!{F}_{{s}} = −{k}Δ!{x}', "胡克定律：弹簧力", 'energy/5 oscillations/1 oscillations/4'],
          ['{a}_{{c}} = {v}^{2} / {r}', "向心加速度", 'circular/0 circular/1 circular/3 circular/4 circular/5 circular/8 rotation/1'],
          ['{K} = ½{m}{v}^{2}', "动能", 'energy/3 energy/1 momentum/0'],
          ['{W} = {F}_{∥}{d} = {F}{d} cos θ', "以恒定的力工作", 'energy/0 energy/2 rotation/8'],
          ['Δ{K} = Σ{W}_{{i}} = Σ{F}_{∥,{i}}{d}_{{i}}', "功-能定理", 'energy/3 energy/1'],
          ['{U}_{{s}} = ½{k}(Δ{x})^{2}', "弹簧势能", 'energy/5 oscillations/3 oscillations/11'],
          ['{U}_{{G}} = −{G}{m}_{1}{m}_{2} / {r}', "重力势能，任何距离", 'circular/10 circular/11 circular/12'],
          ['Δ{U}_{{g}} = {m}{g}Δ{y}', "表面附近的重力势能", 'energy/4 energy/7 circular/11 momentum/6'],
          ['{P}_{avg} = {W} / Δ{t} = Δ{E} / Δ{t}', "平均功率", 'energy/11'],
          ['{P}_{inst} = {F}_{∥}{v} = {F}{v} cos θ', "瞬时功率", 'energy/11 induction/6'],
          ['!{p} = {m}!{v}', 'Momentum', 'momentum/0 momentum/3'],
          ['!{F}_{net} = Δ!{p} / Δ{t} = {m}Δ!{v} / Δ{t} = {m}!{a}', "合力和动量变化", 'momentum/1 momentum/2'],
          ['!{J} = !{F}_{avg}Δ{t} = Δ!{p}', 'Impulse', 'momentum/1 momentum/2 momentum/6'],
          ['!{v}_{cm} = Σ!{p}_{{i}} / Σ{m}_{{i}} = Σ{m}_{{i}}!{v}_{{i}} / Σ{m}_{{i}}', "质心速度", 'momentum/3 momentum/8 newton/8'],
        ] },
      { h: "力学与流体·右栏", vars: "{a} = 加速度 · {A} = 振幅或面积 · {d} = 距离 · {f} = 频率 · {F} = 力 · {h} = 高度 · {I} = 转动惯量 · {k} = 弹簧常数 · {K} = 动能 · ℓ = 长度 · {L} = 角动量 · {m} = 质量 · {M} = 质量 · {P} = 压力 · {r} = 半径或距离 · {t} = 时间 · {T} = 周期 · {v} = 速度或速度 · {V} = 体积 · {W} = 功 · {x} = 位置 · {y} = 垂直位置 · α = 角加速度 · θ = 角度或角位置 · ρ = 密度 · τ = 力矩 · ω = 角速度",
        rows: [
          ['ω = ω_{0} + α{t}', "角速度恒定 α", 'rotation/0'],
          ['θ = θ_{0} + ω_{0}{t} + ½α{t}^{2}', "角度恒定 α", 'rotation/0'],
          ['ω^{2} = ω_{0}^{2} + 2α(θ − θ_{0})', "没有时间的角速度", 'rotation/0'],
          ['{v} = {r}ω', "线速度和角速度", 'circular/6 rotation/1 rotation/9'],
          ['{a}_{{T}} = {r}α', "切向加速度", 'rotation/1 rotation/11'],
          ['τ = {r}_{⊥}{F} = {r}{F} sin θ', 'Torque', 'rotation/2 rotation/3 rotation/4 oscillations/9'],
          ['{I} = Σ{m}_{{i}}{r}_{{i}}^{2}', "转动惯量", 'rotation/5 rotation/6'],
          ['{I}′ = {I}_{cm} + {M}{d}^{2}', "平行轴定理", 'rotation/7 oscillations/9'],
          ['α_{sys} = Στ / {I}_{sys} = τ_{net} / {I}_{sys}', "牛顿第二旋转定律", 'rotation/5 rotation/7 rotation/10 rotation/11'],
          ['{K} = ½{I}ω^{2}', "旋转动能", 'rotation/9 rotation/13 rotation/8'],
          ['{W} = τΔθ', "力矩所做的功", 'rotation/8'],
          ['{L} = {I}ω', "刚体的角动量", 'rotation/12 rotation/13'],
          ['{L} = {r}{m}{v} sin θ', "粒子的角动量", 'rotation/14 circular/9'],
          ['Δ{L} = τΔ{t}', "角冲量", 'rotation/12'],
          ['Δ{x}_{cm} = {r}Δθ', "滚动不打滑", 'rotation/9 rotation/10'],
          ['{T} = 1 / {f}', "周期和频率", 'oscillations/0'],
          ['{T}_{{s}} = 2π√({m} / {k})', "弹簧上的质量周期", 'oscillations/6 oscillations/7 oscillations/11'],
          ['{T}_{{p}} = 2π√(ℓ / {g})', "单摆的周期", 'oscillations/5 oscillations/6 oscillations/11'],
          ['{x} = {A} cos(2π{f}{t})', "简谐振动中的位置，来自 x = A", 'oscillations/2'],
          ['{x} = {A} sin(2π{f}{t})', "简谐振动中的位置，从 x = 0", ''],
          ['ρ = {m} / {V}', 'Density', 'fluids/0 fluids/5'],
          ['{P} = {F}_{⊥} / {A}', 'Pressure', 'fluids/1 fluids/3'],
          ['{P} = {P}_{0} + ρ{g}{h}', "深度绝对压力", 'fluids/2 fluids/4'],
          ['{P}_{gauge} = ρ{g}{h}', "表压", 'fluids/2'],
          ['{F}_{{b}} = ρ{V}{g}', "浮力", 'fluids/4 fluids/5 newton/12'],
          ['{A}_{1}{v}_{1} = {A}_{2}{v}_{2}', 'Continuity', 'fluids/6'],
          ['{P}_{1} + ρ{g}{y}_{1} + ½ρ{v}_{1}^{2} = {P}_{2} + ρ{g}{y}_{2} + ½ρ{v}_{2}^{2}', 'Bernoulli’s equation', 'fluids/7 fluids/8'],
        ] },
    ],
  },
  {
    id: 'mechanics', nav: 'C: Mechanics', title: "AP 物理 C：力学", sub: "基于微积分·2024 年秋季生效",
    constants: [G_CONST, G_ACC, G_FIELD],
    units: [['hertz', 'Hz'], ['joule', 'J'], ['kilogram', 'kg'], ['meter', 'm'], ['newton', 'N'], ['second', 's'], ['watt', 'W']],
    conventions: ["除非另有说明，否则任何问题的参考系都被假定为惯性的。",
      "除非另有说明，否则假定空气阻力可以忽略不计。",
      "除非另有说明，否则弹簧和弦被假定为理想的。"],
    groups: [
      { h: "力学·左栏", id: 'mechanics-c', vars: MECH_VARS_L,
        rows: [
          ['{v}_{{x}} = {v}_{{x}0} + {a}_{{x}}{t}', "恒定加速度下的速度", 'kinematics/5'],
          ['{x} = {x}_{0} + {v}_{{x}0}{t} + ½{a}_{{x}}{t}^{2}', "恒定加速度位置", 'kinematics/5 kinematics/6'],
          ['{v}_{{x}}^{2} = {v}_{{x}0}^{2} + 2{a}_{{x}}({x} − {x}_{0})', "没有时间的速度", 'kinematics/5'],
          ['Δ{x} = ∫{v}_{{x}}({t}) d{t}', "位移作为积分", 'kinematics/9'],
          ['Δ{v}_{{x}} = ∫{a}_{{x}}({t}) d{t}', "速度变化作为积分", 'kinematics/9'],
          ['!{x}_{cm} = Σ{m}_{{i}}!{x}_{{i}} / Σ{m}_{{i}}', "质心", 'newton/8 momentum/8 momentum/11'],
          ['!{r}_{cm} = ∫!{r} d{m} / ∫d{m}', "固体的质心", 'momentum/9 momentum/10'],
          ['λ = (d/dℓ) {m}(ℓ)', "线性质量密度", 'momentum/9 rotation/6'],
          ['!{a}_{sys} = Σ!{F} / {m}_{sys} = !{F}_{net} / {m}_{sys}', "牛顿第二定律", 'newton/4 newton/9 newton/11'],
          ['|!{F}_{{g}}| = {G}{m}_{1}{m}_{2} / {r}^{2}', "万有引力", 'circular/7 circular/8'],
          ['|!{F}_{{f}}| ≤ |μ!{F}_{{N}}|', 'Friction', 'newton/6 circular/2 energy/10 rotation/10'],
          ['!{F}_{{s}} = −{k}Δ!{x}', "胡克定律：弹簧力", 'energy/5 oscillations/1'],
          ['{a}_{{c}} = {v}^{2} / {r} = {r}ω^{2}', "向心加速度", 'circular/0 circular/1 circular/4 circular/6 rotation/1'],
          ['{T} = 1 / {f}', "周期和频率", 'oscillations/0'],
          ['{K} = ½{m}{v}^{2}', "动能", 'energy/3'],
          ['{W} = ∫_{{a}}^{{b}} !{F} · d!{r}', 'Work', 'energy/6 energy/0'],
          ['Δ{K} = Σ{W}_{{i}} = Σ{F}_{∥,{i}}{d}_{{i}}', "功-能定理", 'energy/3 energy/6'],
          ['Δ{U} = −∫_{{a}}^{{b}} !{F}_{cf}({r}) · d!{r}', "来自保守力的势能", 'circular/11 energy/8'],
          ['{F}_{{x}} = −d{U}({x}) / d{x}', "来自势能的力", 'energy/8 energy/9 circular/11'],
          ['{U}_{{s}} = ½{k}(Δ{x})^{2}', "弹簧势能", 'energy/5 oscillations/3'],
          ['{U}_{{G}} = −{G}{m}_{1}{m}_{2} / {r}', "重力势能", 'circular/10 circular/11 circular/12'],
          ['Δ{U}_{{g}} = {m}{g}Δ{y}', "表面附近的重力势能", 'energy/4 circular/11'],
          ['{P}_{avg} = {W} / Δ{t} = Δ{E} / Δ{t}', "平均功率", 'energy/11'],
          ['{P}_{inst} = d{W} / d{t}', "瞬时功率", 'energy/11 induction/6'],
          ['!{p} = {m}!{v}', 'Momentum', 'momentum/0'],
          ['!{F}_{net} = d!{p} / d{t}', "合力是动量的变化率", 'momentum/1'],
          ['!{J} = ∫_{{t}_{1}}^{{t}_{2}} !{F}_{net}({t}) d{t} = Δ!{p}', 'Impulse', 'momentum/1 momentum/2'],
          ['!{v}_{cm} = Σ!{p}_{{i}} / Σ{m}_{{i}} = Σ{m}_{{i}}!{v}_{{i}} / Σ{m}_{{i}}', "质心速度", 'momentum/3 momentum/8'],
        ] },
      { h: "力学·右栏", vars: MECH_VARS_R,
        rows: [
          ['ω = dθ / d{t}', "角速度", 'rotation/0 circular/6'],
          ['α = dω / d{t}', "角加速度", 'rotation/0 rotation/10'],
          ['ω = ω_{0} + α{t}', "角速度恒定 α", 'rotation/0'],
          ['θ = θ_{0} + ω_{0}{t} + ½α{t}^{2}', "角度恒定 α", 'rotation/0'],
          ['ω^{2} = ω_{0}^{2} + 2α(θ − θ_{0})', "没有时间的角速度", 'rotation/0'],
          ['{v} = {r}ω', "线速度和角速度", 'circular/6 rotation/1'],
          ['{a}_{{T}} = {r}α', "切向加速度", 'rotation/1 rotation/11'],
          ['!{τ} = !{r} × !{F}', 'Torque', 'rotation/2 rotation/3 rotation/4 oscillations/9'],
          ['{I}_{tot} = Σ{I}_{{i}} = Σ{m}_{{i}}{r}_{{i}}^{2}', "转动惯量", 'rotation/5 rotation/6'],
          ['{I} = ∫{r}^{2} d{m}', "固体的转动惯量", 'rotation/6'],
          ['{I}′ = {I}_{cm} + {M}{d}^{2}', "平行轴定理", 'rotation/7 oscillations/9'],
          ['α_{sys} = Στ / {I}_{sys} = τ_{net} / {I}_{sys}', "牛顿第二旋转定律", 'rotation/5 rotation/10 rotation/11 oscillations/10'],
          ['{K}_{rot} = ½{I}ω^{2}', "旋转动能", 'rotation/9 rotation/13'],
          ['{W} = ∫τ · dθ', "力矩所做的功", 'rotation/8'],
          ['!{L} = !{r} × !{p} = {I}!{ω}', "角动量", 'rotation/14 circular/9 rotation/12 rotation/13'],
          ['Δ{L} = ∫τ d{t}', "角冲量", 'rotation/12'],
          ['Δ{x}_{cm} = {r}Δθ', "滚动不打滑", 'rotation/9 rotation/10'],
          ['{T} = 2π / ω = 1 / {f}', "周期和频率", 'oscillations/0 oscillations/8'],
          ['{T}_{{s}} = 2π√({m} / {k})', "弹簧上的质量周期", 'oscillations/6 oscillations/4'],
          ['{T}_{{p}} = 2π√(ℓ / {g})', "单摆的周期", 'oscillations/5 oscillations/6'],
          ['{T}_{phys} = 2π√({I} / {m}{g}{d})', "物理摆的周期", 'oscillations/9'],
          ['{x} = {x}_{max} cos(ω{t} + φ)', "简谐振动中的位置", 'oscillations/8 oscillations/2'],
        ] },
      { h: "几何和三角学", same: '#geometry', label: "物理1页" },
      { h: 'Vectors', id: 'vectors', vars: "该表的数学参考。",
        rows: [
          ['!{A} · !{B} = {AB} cos θ', "点积", 'energy/0 gauss/0'],
          ['|!{A} × !{B}| = {AB} sin θ', "叉积", 'rotation/2 magnetism/1'],
          ['!{r} = ({A}{î} + {B}{ĵ} + {C}{k̂})', "来自组件的向量", null],
          ['!{C} = !{A} + !{B}', "向量和", 'kinematics/7 kinematics/8'],
          ['!{C} = ({A}_{{x}} + {B}_{{x}}){î} + ({A}_{{y}} + {B}_{{y}}){ĵ}', "按分量向量和", null],
        ] },
      { h: 'Calculus', id: 'calculus', vars: "该表的数学参考。",
        rows: [
          ['d{f}/d{x} = (d{f}/d{u})(d{u}/d{x})', "链式法则", null],
          ['d/d{x} ({x}^{{n}}) = {n}{x}^{{n}−1}', "幂的导数", 'kinematics/10'],
          ['d/d{x} ({e}^{{ax}}) = {a}{e}^{{ax}}', "指数的导数", null],
          ['d/d{x} (ln {ax}) = 1/{x}', "对数的导数", null],
          ['d/d{x} [sin({ax})] = {a} cos({ax})', "正弦导数", 'oscillations/2 oscillations/8'],
          ['d/d{x} [cos({ax})] = −{a} sin({ax})', "余弦的导数", 'oscillations/2 oscillations/8'],
          ['∫{x}^{{n}} d{x} = (1/({n} + 1)) {x}^{{n}+1}, {n} ≠ −1', "幂的积分", 'kinematics/9 momentum/9 rotation/6'],
          ['∫{e}^{{ax}} d{x} = (1/{a}) {e}^{{ax}}', "指数的积分", 'newton/12'],
          ['∫d{x} / ({x} + {a}) = ln|{x} + {a}|', "积分给出对数", 'newton/11 capacitors/3 circuits/8'],
          ['∫cos({ax}) d{x} = (1/{a}) sin({ax})', "余弦积分", null],
          ['∫sin({ax}) d{x} = −(1/{a}) cos({ax})', "正弦积分", 'momentum/1'],
        ] },
      { h: 'Identities', id: 'identities', vars: "该表的数学参考。",
        rows: [
          ['log({a} · {b}^{{x}}) = log {a} + {x} log {b}', "乘积和幂的对数", null],
          ['sin^{2} θ + cos^{2} θ = 1', "毕达哥拉斯恒等式", null],
          ['sin(2θ) = 2 sin θ cos θ', "双角", null],
          ['sin θ / cos θ = tan θ', 'Tangent', null],
        ] },
    ],
  },
  {
    id: 'em', nav: 'C: E&amp;M', title: "AP 物理 C：电和磁", sub: "基于微积分·2024 年秋季生效",
    constants: [
      ["库仑常数", '{k} = 1/4πε_{0} = 9.0 × 10^{9} (N·m^{2})/C^{2}', 'electrostatics/2'],
      ["真空介电常数", 'ε_{0} = 8.85 × 10^{−12} C^{2}/(N·m^{2})', 'gauss/1'],
      ["真空透过率", 'μ_{0} = 4π × 10^{−7} (T·m)/A', 'magnetism/5'],
      ["质子质量", '{m}_{{p}} = 1.67 × 10^{−27} kg', 'electrostatics/0 magnetism/2'],
      ["中子质量", '{m}_{{n}} = 1.67 × 10^{−27} kg', 'electrostatics/0'],
      ["电子质量", '{m}_{{e}} = 9.11 × 10^{−31} kg', 'electrostatics/0 electrostatics/8'],
      ["基本电荷", '{e} = 1.60 × 10^{−19} C', 'electrostatics/0'],
      ["1电子伏特", '1 eV = 1.60 × 10^{−19} J', 'potential/8'],
      ["光速", '{c} = 3.00 × 10^{8} m/s', ''],
      ["1个统一原子质量单位", '1 u = 1.66 × 10^{−27} kg = 931 MeV/{c}^{2}', ''],
      G_CONST, G_ACC, G_FIELD,
    ],
    units: [['ampere', 'A'], ['coulomb', 'C'], ["电子伏特", 'eV'], ['farad', 'F'], ['henry', 'H'], ['hertz', 'Hz'], ['joule', 'J'], ['kilogram', 'kg'],
      ['meter', 'm'], ['newton', 'N'], ['ohm', 'Ω'], ['second', 's'], ['tesla', 'T'], ['volt', 'V'], ['watt', 'W']],
    conventions: ["除非另有说明，本考试中使用以下约定：",
      "任何问题的参考系都是惯性的。",
      "摩擦力和空气阻力可以忽略不计。",
      "绳子、弹簧、电池、电线和仪表都是理想的选择。",
      "在距离孤立点电荷无限远的地方，电势为零。",
      "电流的方向是正电荷漂移的方向。",
      "电阻器和灯泡是欧姆的。",
      "电容器是充气的 (κ = 1.0)。"],
    groups: [
      { h: "电与磁·左栏", vars: "{A} = 面积 · {C} = 电容 · {d} = 距离 · {E} = 电场 · {F} = 力 · {I} = 电流 · {J} = 电流密度 · ℓ = 长度 · {P} = 功率 · {q} = 电荷 · {Q} = 电荷 · {r} = 半径、距离或位置 · {R} = 电阻 · {t} = 时间 · {U} = 势能 · {V} = 电势或体积 · ε = 介电常数 · ρ = 电阻率或电荷密度 · κ = 介电常数 · Φ = 通量",
        rows: [
          ['|!{F}_{{E}}| = (1/4πε_{0}) |{q}_{1}{q}_{2}| / {r}^{2} = {k}|{q}_{1}{q}_{2}| / {r}^{2}', 'Coulomb’s law', 'electrostatics/2 electrostatics/3'],
          ['!{E} = !{F}_{{E}} / {q}', "电场", 'electrostatics/4 electrostatics/8'],
          ['!{E} = (1/4πε_{0}) ∫ (d{q} / {r}^{2}) {r̂}', "连续电荷场", 'electrostatics/6 electrostatics/7'],
          ['Φ_{{E}} = ∫!{E} · d!{A}', "电通量", 'gauss/0'],
          ['∮!{E} · d!{A} = {q}_{enc} / ε_{0}', 'Gauss’s law', 'gauss/1 gauss/2 gauss/3 gauss/4 gauss/5 gauss/6 gauss/7 capacitors/1'],
          ['{Q}_{total} = ∫ρ({r}) d{V}', "电荷密度的总电荷", 'gauss/7'],
          ['{U}_{{E}} = (1/4πε_{0}) {q}_{1}{q}_{2} / {r}', "两个电荷的电势能", 'potential/0 potential/1'],
          ['{V} = (1/4πε_{0}) ∫ d{q} / {r}', "连续电荷的电势", 'potential/5 potential/6'],
          ['Δ{V} = −∫_{{a}}^{{b}} !{E} · d!{r}', "与现场的潜在差异", 'potential/2 potential/3 potential/7 capacitors/1 capacitors/2 capacitors/3'],
          ['{E}_{{x}} = −d{V} / d{x}', "势场", 'potential/3'],
          ['Δ{U}_{{E}} = {q}Δ{V}', "来自势能的势能", 'potential/2 potential/8 magnetism/2'],
          ['{C} = {Q} / Δ{V}', 'Capacitance', 'capacitors/0 capacitors/1 capacitors/2 capacitors/3'],
          ['{C} = κε_{0}{A} / {d}', "平行板电容器", 'capacitors/1 capacitors/6 capacitors/8'],
          ['{U}_{{C}} = ½{Q}Δ{V}', "储存在电容器中的能量", 'capacitors/4 capacitors/7'],
          ['κ = ε / ε_{0}', "介电常数", 'capacitors/6'],
          ['{I} = d{q} / d{t}', 'Current', 'circuits/0 circuits/8'],
          ['{I} = ∫!{J} · d!{A}', "电流密度产生的电流", 'circuits/0'],
          ['!{E} = ρ!{J}', "材料中的欧姆定律", 'circuits/0 circuits/2'],
          ['{R} = ρℓ / {A}', "电线的电阻", 'circuits/1'],
          ['{I} = Δ{V} / {R}', 'Ohm’s law', 'circuits/2 circuits/5 circuits/6'],
          ['{P} = {I}Δ{V}', "电力", 'circuits/3 circuits/4'],
        ] },
      { h: "电与磁·右栏", vars: "{A} = 面积 · {B} = 磁场 · {C} = 电容 · {E} = 电场 · {F} = 力 · {I} = 电流 · ℓ = 长度 · {L} = 电感 · {n} = 每单位长度的回路数 · {N} = 回路数 · {q} = 电荷 · {r} = 半径、距离或位置 · {R} = 电阻 · {t} = 时间 · {U} = 势能 · {v} = 速度或速度· ε = emf · μ = 磁导率 · τ = 时间常数 · Φ = 磁通 · ω = 角频率",
        rows: [
          ['{R}_{eq,{s}} = Σ_{{i}} {R}_{{i}}', "串联电阻", 'circuits/5 circuits/6'],
          ['1 / {R}_{eq,{p}} = Σ_{{i}} 1 / {R}_{{i}}', "并联电阻", 'circuits/5 circuits/6'],
          ['1 / {C}_{eq,{s}} = Σ_{{i}} 1 / {C}_{{i}}', "串联电容器", 'capacitors/5 capacitors/8'],
          ['{C}_{eq,{p}} = Σ_{{i}} {C}_{{i}}', "并联电容器", 'capacitors/5 capacitors/7'],
          ['τ = {R}_{eq}{C}_{eq}', "RC时间常数", 'circuits/8'],
          ['∮!{B} · d!{A} = 0', "无磁单极子", 'magnetism/0'],
          ['!{F}_{{B}} = {q}(!{v} × !{B})', "移动电荷上的磁力", 'magnetism/1 magnetism/2 magnetism/3 induction/4'],
          ['d!{B} = (μ_{0}/4π) {I}(d!{ℓ} × {r̂}) / {r}^{2}', "毕奥-萨伐尔定律", 'magnetism/6'],
          ['!{F}_{{B}} = ∫{I}(d!{ℓ} × !{B})', "电流上的磁力", 'magnetism/4 magnetism/7 induction/6'],
          ['∮!{B} · d!{ℓ} = μ_{0}{I}_{enc}', 'Ampère’s law', 'magnetism/5 magnetism/8'],
          ['{B}_{sol} = μ_{0}{n}{I}', "螺线管内的磁场", 'magnetism/8 induction/7'],
          ['Φ_{{B}} = ∫!{B} · d!{A}', "磁通量", 'induction/0 induction/3 induction/6 magnetism/0'],
          ['ε = ∮!{E} · d!{ℓ} = −dΦ_{{B}} / d{t}', 'Faraday’s law', 'induction/0 induction/1 induction/2 induction/3 induction/5'],
          ['|ε_{sol}| = {N}|dΦ_{{B}} / d{t}|', "N 圈线圈的电动势", 'induction/0'],
          ['{L}_{sol} = μ_{core}{N}^{2}{A} / ℓ', "螺线管的电感", 'induction/7'],
          ['{U}_{{L}} = ½{L}{I}^{2}', "储存在电感器中的能量", 'induction/7 induction/9'],
          ['ε = −{L} d{I} / d{t}', "自感电动势", 'induction/7 induction/8'],
          ['τ = {L} / {R}_{eq}', "RL时间常数", 'induction/8'],
          ['ω_{{LC}} = 1 / √({L}{C})', "LC角频率", 'induction/9'],
        ] },
      { h: 'Mechanics', same: '#mechanics-c', label: "C：力学表（两列）" },
      { h: "几何和三角学", same: '#geometry', label: "物理1页" },
      { h: "向量、微积分和恒等式", same: '#vectors', label: "C：力学表" },
    ],
  },
];

// ---------- render ----------
let rows = 0;
const counts = {};
const unshown = [];
const sectionHTML = SHEETS.map(S => {
  counts[S.title] = 0;
  const consts = `
      <div class="group consts">
        <h3>Constants and conversion factors</h3>
        <table class="ctab">${S.constants.map(([n, v, r]) => `
          <tr><th>${n}</th><td class="cv">${md(v)}</td><td>${r === null ? '' : `<span class="chips">${chips(r)}</span>`}</td></tr>`).join('')}
        </table>
      </div>`;
  const tables = `
      <div class="group ref">
        <div class="rgrid">
          <div><h3>Prefixes</h3><table class="rtab"><tr><th>Factor</th><th>Prefix</th><th>Symbol</th></tr>${PREFIXES.map(([f, p, s]) => `<tr><td>${md(f)}</td><td>${p}</td><td>${s}</td></tr>`).join('')}</table></div>
          <div><h3>Unit symbols</h3><table class="rtab">${S.units.map(([n, s]) => `<tr><td>${n},</td><td>${s}</td></tr>`).join('')}</table></div>
          <div><h3>Values of trigonometric functions for common angles</h3><table class="rtab trig">${TRIG.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</table></div>
        </div>
      </div>
      <div class="group ref">
        <h3>Conventions</h3>
        <p class="vars">${S.conventions[0].endsWith(':') ? S.conventions[0] : 'The following conventions are used in this exam:'}</p>
        <ul class="conv">${S.conventions.filter(c => !c.endsWith(':')).map(c => `<li>${md(c)}</li>`).join('')}</ul>
      </div>`;
  const groups = S.groups.map(G => G.same ? `
      <div class="group ref">
        <h3>${G.h}</h3>
        <p class="vars">Also on this sheet, identical to <a href="${G.same}">${G.label}</a>.</p>
      </div>` : `
      <div class="group"${G.id ? ` id="${G.id}"` : ''}>
        <h3>${G.h}</h3>
        <p class="vars">${md(G.vars)}</p>
        <ul>${G.rows.map(([e, n, r]) => {
          rows++; counts[S.title]++;
          if (r === '') unshown.push(`${S.title} · ${G.h}: ${n}`);
          return `
          <li${r === '' ? ' class="unshown"' : ''}><div class="e">${md(e)}</div><div class="m"><span class="n">${n}</span><span class="chips">${chips(r)}</span></div></li>`;
        }).join('')}
        </ul>
      </div>`).join('');
  return `
    <section class="sheet" id="${S.id}">
      <div class="shead"><h2>${S.title}</h2><span>${S.sub}</span></div>${consts}${tables}${groups}
    </section>`;
}).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Equation sheet · Atlas of Physics</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../atlas.css">
<!-- Generated by equations/build.mjs: edit the data there and rebuild. -->
<style>
  html { scroll-padding-top: 76px; }
  body { min-height: 100vh; padding: 0 16px 80px; }
  header { max-width: 1180px; margin: 0 auto; padding: 22px 12px; display: flex; justify-content: space-between; gap: 12px; font: 500 12px var(--mono); letter-spacing: .06em; color: var(--muted); text-transform: uppercase; }
  header a { font: 500 19px var(--serif); letter-spacing: 0; text-transform: none; color: var(--strong); text-decoration: none; }
  header span { text-align: right; padding-top: 5px; margin-left: auto; }
  header a.gh { display: flex; padding-top: 3px; color: var(--muted); }
  header a.gh:hover { color: var(--strong); }
  .hero { text-align: center; margin: 56px auto 40px; max-width: 760px; }
  .hero h1 { font: 400 clamp(46px, 7vw, 84px)/1 var(--serif); color: var(--strong); letter-spacing: -.015em; }
  .hero p { font: italic 400 clamp(19px, 2.2vw, 24px)/1.4 var(--serif); color: var(--muted); margin-top: 16px; }
  nav { position: sticky; top: 0; z-index: 2; margin: 0 -16px; padding: 10px 16px; background: color-mix(in srgb, var(--page) 92%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid var(--faint); }
  nav .in { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 6px 22px; flex-wrap: wrap; }
  nav a { font: 500 12px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); text-decoration: none; padding: 8px 0; }
  nav a:hover { color: var(--strong); }
  nav input { margin-left: auto; width: min(100%, 280px); font: 14px var(--sans); color: var(--strong); background: var(--card); border: 1px solid var(--faint); border-radius: 999px; padding: 8px 14px; }
  nav input:focus { outline: none; border-color: var(--mid); }
  main { max-width: 1180px; margin: 0 auto; }
  .sheet { padding-top: 48px; }
  .shead { display: flex; align-items: baseline; justify-content: space-between; gap: 8px 16px; flex-wrap: wrap; border-bottom: 1px solid var(--mid); padding: 0 4px 10px; margin-bottom: 18px; }
  .shead h2 { font: 400 clamp(30px, 4vw, 42px)/1.05 var(--serif); color: var(--strong); }
  .shead span { font: 500 12px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .group { background: var(--card); border-radius: 14px; box-shadow: var(--lift); padding: 18px 22px 8px; margin-bottom: 18px; }
  .group h3 { font: 500 12px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .vars { font-size: 12.5px; line-height: 1.55; color: var(--muted); margin: 8px 0 6px; max-width: 920px; }
  .vars i, .ctab i { font-family: var(--serif); font-size: 1.12em; color: var(--hi); }
  .vars a { color: var(--hi); }
  ul { list-style: none; padding: 0; }
  li { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 4px 24px; align-items: baseline; padding: 11px 0; border-top: 1px solid var(--faint); }
  .e { font: 400 21px/1.35 var(--serif); color: var(--strong); overflow-x: auto; overflow-y: hidden; padding-left: 14px; border-left: 1px solid var(--mid); }
  .e sub, .e sup, .cv sub, .cv sup { font-size: .68em; line-height: 0; }
  .m { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.3fr); gap: 6px 18px; align-items: baseline; }
  .n { font-size: 14px; color: var(--text); }
  .chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .chips a, .none { font: 11px/1.3 var(--mono); letter-spacing: .02em; color: var(--hi); text-decoration: none; border: 1px solid var(--faint); background: var(--page); border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
  .chips a:hover, .chips a:focus-visible { border-color: var(--hi); color: var(--lit); }
  .none { color: var(--lo); border-style: dashed; background: none; font-style: italic; }
  li.unshown .e { color: var(--mid); border-left-style: dashed; }
  .vec { position: relative; display: inline-block; }
  .vec::before { content: '→'; position: absolute; left: 55%; transform: translateX(-50%); top: -.42em; font-size: .7em; font-style: normal; line-height: 1; }
  .rgrid { display: grid; grid-template-columns: auto auto minmax(0, 1fr); gap: 14px 36px; margin: 2px 0 14px; align-items: start; }
  .rgrid > div { min-width: 0; overflow-x: auto; }
  .rtab { border-collapse: collapse; margin-top: 10px; font: 15px var(--serif); color: var(--strong); }
  .rtab th, .rtab td { border: 1px solid var(--faint); padding: 4px 10px; text-align: center; font-weight: 400; white-space: nowrap; }
  .rtab sup { font-size: .68em; line-height: 0; }
  .conv li { display: list-item; list-style: disc; margin-left: 20px; padding: 3px 0; border: 0; font-size: 14px; color: var(--text); }
  .conv { padding-bottom: 10px; }
  .ctab { border-collapse: collapse; width: 100%; margin: 10px 0 10px; }
  .ctab th, .ctab td { text-align: left; vertical-align: baseline; padding: 9px 16px 9px 0; border-top: 1px solid var(--faint); }
  .ctab th { font: 400 14px var(--sans); color: var(--text); width: 30%; }
  .ctab .cv { font: 17px var(--serif); color: var(--strong); white-space: nowrap; }
  .ctab td:last-child { padding-right: 0; }
  .empty { display: none; text-align: center; font: italic 20px var(--serif); color: var(--muted); padding: 48px 0; }
  .hidden { display: none !important; }
  footer { max-width: 1180px; margin: 40px auto 0; padding: 0 4px; font-size: 12.5px; color: var(--muted); }
  @media (max-width: 1000px) {
    .m { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    html { scroll-padding-top: 112px; }
    header span { display: none; }
    .hero { margin: 28px auto 28px; }
    nav .in { gap: 0 16px; }
    nav input { margin: 4px 0 2px; width: 100%; }
    .group { padding: 16px 16px 6px; border-radius: 12px; }
    li { grid-template-columns: 1fr; padding: 12px 0; }
    .e { font-size: 20px; }
    .ctab, .ctab tbody, .ctab tr, .ctab th, .ctab td { display: block; width: auto; }
    .ctab tr { border-top: 1px solid var(--faint); padding: 9px 0; }
    .ctab th, .ctab td { border: 0; padding: 2px 0; }
    .ctab .cv { white-space: normal; }
    .rgrid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
  <header><a href="../">Atlas of Physics</a><span>The AP sheets, linked to the pages</span></header>
  <section class="hero">
    <h1>Equation sheet</h1>
    <p>The official AP Physics 1 and Physics C equation sheets, line by line. Each equation links to every page of the atlas that shows or uses it.</p>
  </section>
  <nav aria-label="Sheets"><div class="in">
    ${SHEETS.map(S => `<a href="#${S.id}">${S.nav}</a>`).join('\n    ')}
    <input type="search" id="q" placeholder="Filter: torque, ω, Gauss…" aria-label="Filter equations" autocomplete="off">
  </div></nav>
  <main>${sectionHTML}
    <p class="empty" id="empty">No equation matches.</p>
  </main>
  <footer>Transcribed from the Table of Information in the College Board’s AP Physics 1, Physics C: Mechanics and Physics C: Electricity and Magnetism Course and Exam Descriptions (effective fall 2024; sheets © 2025 College Board), in the sheets’ order and notation. Arrows mark vectors, as on the sheets. The names beside each equation are the atlas’s labels, not part of the sheets. Chips give section and page; muted rows are on the sheet but not drawn in the atlas yet.</footer>
<script>
  // Filter rows by their text (equation, name and linked page titles); hide groups and sheets left empty.
  const q = document.getElementById('q'), norm = s => s.normalize('NFKD').toLowerCase();
  const items = [...document.querySelectorAll('.group:not(.ref) li, .ctab tr')].map(el => [el, norm(el.textContent)]);
  q.addEventListener('input', () => {
    const t = norm(q.value.trim());
    for (const [el, txt] of items) el.classList.toggle('hidden', !!t && !txt.includes(t));
    for (const g of document.querySelectorAll('.group')) g.classList.toggle('hidden', !!t && (g.matches('.ref') || !g.querySelector('li:not(.hidden), tr:not(.hidden)')));
    for (const s of document.querySelectorAll('.sheet')) s.classList.toggle('hidden', !!t && !s.querySelector('.group:not(.hidden)'));
    document.getElementById('empty').style.display = t && !document.querySelector('.sheet:not(.hidden)') ? 'block' : 'none';
  });
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'equations', 'index.html'), localizeHtml(html));
console.log(`rows ${rows}`, counts, `links ${links}`);
console.log("尚未显示：" + unshown.join('\n  '));
