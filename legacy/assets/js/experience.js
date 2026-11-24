/* Create by LamberthRumpaidus — gameplay event audio and scene art. */
(function(){
'use strict';
const A=window.ILAudio;
const oldIDs=new Set(catalog.slice(0,23).map(g=>g[0]));
const moving=new Set('riverraft jetpack orbitdodge lunarlander cloudglider paradrop magnetlab samuraidash fireflynight ballbalance shieldwall dragonbreath spinningtop peakclimber climbpeak'.split(' '));
const survival=new Set(['racer','meteor','runner']);
const actionType={flappy:'jump',runner:'jump',space:'fire',orbit:'fire',jetpack:'boost',lunarlander:'boost',samuraidash:'dash',dragonbreath:'fire',archeryduel:'fire',knifewheel:'fire',hookrescue:'move',climbpeak:'jump',juggleballs:'bounce',shieldwall:'move',colorswitch:'tile',lockpick:'tile',spinningtop:'move',fishingline:'water',hoopshot:'bounce',puttgolf:'bounce',perfectstack:'tile',magnetlab:'tile',paradrop:'steer'};
let current='',fx=[],lastMove=0,sceneCache=new Map(),lastAmbient=0;
const now=()=>performance.now();
function enter(id){current=id;fx=[];lastMove=0;lastAmbient=0;A.select(id);A.unlock();A.play('start',id)}
function emit(type,id=current,opts){return A.play(type,id,opts)}
function action(id){return actionType[id]||'tap'}
function spark(x,y,color='#b9f8e4',count=10){
 if(!Number.isFinite(x)||!Number.isFinite(y))return;
 for(let i=0;i<count&&fx.length<90;i++){let ang=i*Math.PI*2/count+Math.random()*.35,v=30+Math.random()*95;fx.push({x,y,vx:Math.cos(ang)*v,vy:Math.sin(ang)*v,age:0,life:.35+Math.random()*.25,c:color})}
}
function effects(dt){
 if(document.hidden)return;for(let p of fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.age+=dt;p.vy+=45*dt}fx=fx.filter(p=>p.age<p.life)
}
function drawFX(){
 if(!ctx||!fx.length)return;ctx.save();for(let p of fx){let f=1-p.age/p.life;ctx.globalAlpha=f*.85;ctx.fillStyle=p.c;ctx.shadowColor=p.c;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.35,f*2.7),0,Math.PI*2);ctx.fill()}ctx.restore()
}
function state(s){
 return {hp:s.hp,life:s.life,lives:s.lives,miss:s.miss,misses:s.misses,health:s.health,inv:s.inv,bot:s.bot,
 x:s.x,y:s.y,vy:s.vy,vx:s.vx,ballvx:s.ball?.vx,ballvy:s.ball?.vy,lane:s.lane,ang:s.ang,step:s.steps,
 round:s.round,phase:s.phase,flash:s.flash,pol:s.pol,hit:s.hit,move:s.moves,land:s.land,fire:s.fire,shots:s.shots?.length,
 dash:s.dash,headx:s.body?.[0]?.x,heady:s.body?.[0]?.y};
}
function observe(id,b,s,dt=0){
 if(!b||finished)return;
 for(let k of ['hp','life','lives','health'])if(Number.isFinite(b[k])&&Number.isFinite(s[k])&&s[k]<b[k]-.0001){emit('hit',id);break}
 for(let k of ['miss','misses','bot'])if(Number.isFinite(b[k])&&Number.isFinite(s[k])&&s[k]>b[k]){emit('wrong',id);break}
 if((id==='pong'||id==='breakout')&&((b.ballvx*s.ball?.vx<0)||(b.ballvy*s.ball?.vy<0)))emit('bounce',id);
 if(id==='snake'&&(s.body?.[0]?.x!==b.headx||s.body?.[0]?.y!==b.heady))emit('move',id);
 if(id==='racer'&&b.lane!==s.lane)emit('steer',id);
 if(id==='maze'&&b.step!==s.steps)emit('step',id);
 if(id==='magnetlab'&&b.pol!==s.pol)emit('tile',id);
 if(id==='samuraidash'&&s.dash>0&&!b.dash)emit('dash',id);
 if(moving.has(id)&&dt>0&&now()-lastMove>280){
 const moved=(Number.isFinite(s.x)&&Number.isFinite(b.x)&&Math.abs(s.x-b.x)>.1)||(Number.isFinite(s.y)&&Number.isFinite(b.y)&&Math.abs(s.y-b.y)>.1)||(Number.isFinite(s.ang)&&Math.abs(s.ang-b.ang)>.01);
 if(moved&&(held('arrowleft','arrowright','arrowup','arrowdown','w','a','s','d',' ')||down||Object.values(s.virtual||{}).some(Boolean))){emit(id==='jetpack'||id==='lunarlander'?'boost':'move',id);lastMove=now()}
 }
 if(dt&&now()-lastAmbient>2200&&['forest','water','engine'].includes(A.profile(id).family)&&!finished){emit('ambient',id);lastAmbient=now()}
}
function interact(id,x,y,kind='tap'){
 emit(kind,id);spark(x,y,'#e4fff3',6);
}
function scene(d,t){
 const id=d.id,style=A.profile(id),family=style.family,color=d.color||'#254a5e';
 const Wd=760,Hd=480;ctx.save();
 const g=ctx.createLinearGradient(0,0,0,Hd);g.addColorStop(0,'#071526');g.addColorStop(.48,color);g.addColorStop(1,'#08141f');ctx.fillStyle=g;ctx.fillRect(0,0,Wd,Hd);
 const halo=ctx.createRadialGradient(500,100,10,500,100,480);halo.addColorStop(0,'#e3f8ff18');halo.addColorStop(1,'#00000000');ctx.fillStyle=halo;ctx.fillRect(0,0,Wd,Hd);
 const n=style.variant;
 if(family==='forest'||id==='pocketfarm'||id==='bloomgarden'){
 for(let j=0;j<3;j++){ctx.fillStyle=['#9cd0c011','#142c3b44','#07162055'][j];ctx.beginPath();ctx.moveTo(0,Hd);for(let x=-40;x<=800;x+=40){let h=120+j*45+Math.sin(x*.01+n+j)*38+Math.sin(x*.028+j)*17;ctx.lineTo(x,Hd-h)}ctx.lineTo(800,Hd);ctx.fill()}
 for(let i=0;i<13;i++){let x=i*64+((i*31)%26)-35,h=140+(i*43)%155;ctx.strokeStyle='#07192560';ctx.lineWidth=4+(i%4)*2;ctx.beginPath();ctx.moveTo(x,Hd);ctx.quadraticCurveTo(x+Math.sin(t*.6+i)*7,Hd-h*.6,x+Math.sin(t*.7+i)*12,Hd-h);ctx.stroke()}
 }else if(family==='water'){
 for(let i=0;i<12;i++){let y=115+i*34;ctx.strokeStyle=i%3===0?'#88fff820':'#a1eff20d';ctx.lineWidth=1.5;ctx.beginPath();for(let x=0;x<=760;x+=12){let yy=y+Math.sin(x*.022+i+t*.9)*5+Math.sin(x*.008+t*.75)*8;x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.stroke()}
 }else if(family==='laser'||['orbitdodge','lunarlander','planetworkshop','jetpack'].includes(id)){
 let px=600-n*16,py=65+n*7,r=75+n*5;let pg=ctx.createRadialGradient(px-25,py-25,2,px,py,r);pg.addColorStop(0,'#bad9f93c');pg.addColorStop(1,'#557eab07');ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#abd9e91a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(px,py,r*1.55,r*.26,-.32,0,Math.PI*2);ctx.stroke();
 for(let i=0;i<50;i++){let x=(i*133+n*41)%760,y=(i*73+n*17)%480;ctx.globalAlpha=.13+.15*(1+Math.sin(t*.8+i))*.5;ctx.fillStyle='#bde6ff';ctx.fillRect(x,y,i%11===0?2:1,i%11===0?2:1)}ctx.globalAlpha=1;
 }else if(family==='engine'||family==='blade'||family==='bounce'){
 let horizon=family==='engine'?160:225;ctx.strokeStyle='#d3f3ff0d';ctx.lineWidth=1;
 for(let x=-760;x<1500;x+=100){ctx.beginPath();ctx.moveTo(380,horizon);ctx.lineTo(x,480);ctx.stroke()}
 for(let i=0;i<10;i++){let v=((i/10+t*.12)%1);let y=horizon+(480-horizon)*v*v;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(760,y);ctx.stroke()}
 if(family==='blade'){ctx.fillStyle='#ecb07b13';ctx.beginPath();ctx.arc(624,108,83,0,Math.PI*2);ctx.fill()}
 }else if(family==='music'){
 for(let i=0;i<27;i++){let x=i*29,h=8+30*(.5+.5*Math.sin(t*1.8+i*.8))+((i*19)%26);ctx.fillStyle='#a5dfff12';ctx.fillRect(x,480-h,20,h)}
 for(let i=0;i<4;i++){let x=95+i*190;ctx.fillStyle='#a4cfff08';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-95,480);ctx.lineTo(x+95,480);ctx.fill()}
 }else{
 // Low-contrast decorative geometry, never masks puzzle pieces or text.
 for(let i=0;i<12;i++){let x=(i*167+n*37)%760,y=(i*81+n*19)%480,r=26+(i%4)*15;ctx.strokeStyle='#e8f9ff0c';ctx.lineWidth=1;ctx.beginPath();for(let k=0;k<=6;k++){let a=k*Math.PI/3+t*.045+i;let xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;k===0?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy)}ctx.stroke()}
 }
 for(let i=0;i<23;i++){let x=((i*137+n*17+t*(i%3+1)*3)%780+780)%780,y=((i*61+n*23+Math.sin(t*.4+i)*11)%480+480)%480;ctx.fillStyle='#e6fff71f';ctx.beginPath();ctx.arc(x,y,i%6===0?1.9:.8,0,Math.PI*2);ctx.fill()}
 const vignette=ctx.createRadialGradient(380,240,170,380,240,510);vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#02071280');ctx.fillStyle=vignette;ctx.fillRect(0,0,760,480);ctx.restore()
}
function material(c,x,y,w,h){
 if(typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c)||Math.min(w,h)<13||w*h>68000)return c;
 let g=ctx.createLinearGradient(x,y,x+w*.2,y+h);g.addColorStop(0,c);g.addColorStop(.53,c);g.addColorStop(1,c+'b5');return g
}
window.ILExperience={scene,material,state,observe,interact,drawFX,effects,action,emit,spark};
const start=startSession;startSession=function(id){enter(id);return start(id)};
const oldScore=setScore;setScore=function(n){let was=score;let r=oldScore(n);if(active&&n>was&&!survival.has(active[0]))emit('point',active[0]);return r};
const oldEnd=endGame;endGame=function(win=false,msg=''){if(!finished&&active)emit(win?'win':'fail',active[0]);return oldEnd(win,msg)};
const open3D=openFlagship;openFlagship=function(){A.select('shinrin');A.unlock();return open3D()};
for(const id of oldIDs){
 const h=handlers[id];if(!h)continue;
 if(h.update){let original=h.update;h.update=function(dt){let b=state(gameState);original.call(this,dt);observe(id,b,gameState,dt);effects(dt)}}
 if(h.canvas&&h.draw){let original=h.draw;h.draw=function(){original.call(this);drawFX()}}
 if(h.pointer){let original=h.pointer;h.pointer=function(x,y,type){let b=state(gameState);let r=original.call(this,x,y,type);if(type==='pointerdown')interact(id,x,y,action(id));observe(id,b,gameState);return r}}
 if(h.key){let original=h.key;h.key=function(k){let b=state(gameState);let r=original.call(this,k);if(!['space','orbit','flappy','runner'].includes(id))emit(k===' '?action(id):'move',id);observe(id,b,gameState);return r}}
 for(const method of ['fire','jump'])if(h[method]){let original=h[method];h[method]=function(...args){let b=state(gameState);let count=gameState.bullets?.length;let r=original.apply(this,args);if(method==='fire'&&gameState.bullets?.length>count)emit('fire',id);if(method==='jump'&&b.vy!==gameState.vy)emit('jump',id);return r}}
}
if(handlers.simon?.flash){const f=handlers.simon.flash;handlers.simon.flash=function(i){emit('note','simon',{note:i*2,force:true});return f.call(this,i)}}
const button=document.createElement('button');button.type='button';button.id='ilaSoundToggle';button.className='soundToggle';
function status(){button.textContent=A.enabled?'🔊':'🔇';button.setAttribute('aria-label',A.enabled?'Matikan suara game':'Aktifkan suara game');button.setAttribute('aria-pressed',String(A.enabled));button.title=A.enabled?'Suara aktif':'Suara nonaktif'}
status();document.querySelector('.headerRight')?.prepend(button);
button.addEventListener('click',()=>{A.toggle();status();if(A.enabled){A.unlock();emit('start','island',{force:true})}const f=document.querySelector('#flagshipLayer iframe');f?.contentWindow?.postMessage({type:'ila-audio-setting',enabled:A.enabled},location.origin)});
window.addEventListener('storage',status);
document.querySelector('#stage')?.addEventListener('click',e=>{if(active&&!finished&&!handlers[active[0]]?.canvas&&e.target.closest('button,input,.tile,[data-v]'))emit('tile',active[0])},{capture:true});
document.querySelector('#stage')?.addEventListener('submit',()=>{if(active&&!finished)emit('tap',active[0])},{capture:true});
document.querySelector('#controls')?.addEventListener('pointerdown',e=>{if(active&&!finished&&e.target.closest('button')){const b=e.target.closest('button');emit(b.dataset.k===' '?action(active[0]):'move',active[0])}},{capture:true,passive:true});
document.addEventListener('keydown',e=>{if(active&&!finished&&!e.repeat&&/^(Arrow|Key[WASD]|Space|Enter)/.test(e.code)){let id=active[0];if(e.code==='Space'&&['space','orbit','runner','flappy'].includes(id))return;emit(e.code==='Space'?action(id):'move',id)}},{capture:true,passive:true});
for(let id of ['close','restart','again'])document.getElementById(id)?.addEventListener('click',()=>emit('tap',current||'island'));
})();
