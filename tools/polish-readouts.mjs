import fs from 'node:fs';
import { parse } from 'acorn';
const words = { approaching:'靠近中', area:'面积', available:'可用', axis:'轴线', ball:'小球', bar:'导体棒', bounces:'反弹次数', caps:'电容器', car:'汽车', clay:'黏土', coils:'线圈', connected:'连接电源', cycles:'周期数', drag:'阻力', each:'每个', gauge:'表压', inside:'内部', insulator:'绝缘体', ion:'离子', line:'线', absolute:'绝对', arc:'圆弧', bisector:'垂直平分线', bulb:'灯泡', cart:'小车', centre:'中心', conductor:'导体', core:'铁芯', disconnected:'断开电源', end:'末端', net:'合', neutral:'中性', fast:'快速', floor:'地面', friction:'摩擦', like:'同号', metal:'金属', parallel:'平行', range:'射程', restoring:'回复', side:'侧面', string:'绳', swing:'摆动', thin:'细', toroid:'环形线圈', path:'路径', pend:'单摆', pillow:'软垫', probe:'探测点', rod:'带电棒', series:'串联', slab:'薄片', slow:'慢速', solenoid:'螺线管', spring:'弹簧', swings:'摆动', terminal:'终端', thermal:'热', thick:'粗', unlike:'异号', weight:'重力' };
const states = { charging:'充电', discharging:'放电', sliding:'滑动', rolling:'滚动', growth:'增长', decay:'衰减' };
for(const c of 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ')) {
  const p = `${c}/main.js`; let s=fs.readFileSync(p,'utf8');
  const ast=parse(s,{ecmaVersion:'latest',sourceType:'module'}), edits=[];
  function walk(n,parent) {
    if(!n||typeof n!=='object') return;
    if(n.type==='TemplateElement' && !/<|\[data-|#|[{}]/.test(n.value.raw)) {
      let value=n.value.raw.split('\\n').map(part=>part.replace(/\b[a-z]+\b/g,w=>words[w]||w)).join('\\n');
      if(value!==n.value.raw) edits.push({start:n.start,end:n.end,value});
    }
    if(n.type==='Literal' && states[n.value] && parent?.type==='ConditionalExpression') edits.push({start:n.start,end:n.end,value:JSON.stringify(states[n.value])});
    for(const v of Object.values(n)) if(v&&typeof v==='object') Array.isArray(v)?v.forEach(x=>walk(x,n)):walk(v,n);
  }
  walk(ast);
  for(const e of edits.sort((a,b)=>b.start-a.start)) s=s.slice(0,e.start)+e.value+s.slice(e.end);
  fs.writeFileSync(p,s);
}
