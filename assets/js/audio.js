/* Create by LamberthRumpaidus — offline, layered, game-specific sound synthesis. */
(function(){
'use strict';
const C=window.AudioContext||window.webkitAudioContext;
const groups={
 forest:'shinrin darkmaze maze fireflynight bloomgarden',
 water:'riverraft fishingline aquariumcare hookrescue sandsculpt battleship',
 engine:'racer jetpack lunarlander traffic rushcars cloudglider paradrop caravantrade sorttrain',
 laser:'meteor space orbit orbitdodge shieldwall mirrorbeam circuitlink binarygate magnetlab',
 blade:'ninjafruit samuraidash knifewheel archeryduel dragonbreath',
 bounce:'pong breakout ballbalance hoopshot puttgolf juggleballs perfectstack dartprecision spinningtop',
 pop:'catch bubbleburst flappy whackmole colorswitch reaction aim',
 wood:'sokobanmicro hanoitowers towerguard pocketfarm checkerssix nimstones fourqueens knighttour',
 bell:'snake 2048 hexmerge numbertrail numbermaze coordinatehunt planet workshop planetworkshop',
 paper:'wordhunt words wordladder cipherwheel fractionpairs deductiondoors math primehunter sumforge',
 glass:'lightsout nonogram sudoku4 piperotate tangramtap colorflood codebreaker patternmatrix shapecompass',
 tile:'tictactoe memory mines slide connectfour reversiarena lifegarden hexterritory pixelstudio cloudbuilder',
 music:'simon beatlane melodyecho', arcade:'runner climbpeak lockpick cupshuffle rps'
};
const families={};for(const [name,ids] of Object.entries(groups))for(const id of ids.split(' '))families[id]=name;
const timbres={
 forest:[220,'sine',600,0.17],water:[185,'sine',950,0.16],engine:[105,'triangle',390,0.22],
 laser:[290,'sawtooth',2200,0.11],blade:[175,'triangle',2850,0.12],bounce:[160,'sine',700,0.12],
 pop:[330,'sine',1600,0.09],wood:[145,'triangle',560,0.10],bell:[420,'sine',2100,0.2],
 paper:[250,'triangle',1200,0.10],glass:[520,'sine',3400,0.17],tile:[210,'triangle',850,0.11],
 music:[262,'sine',1200,0.2],arcade:[280,'triangle',1400,0.13]
};
let ac,master,analyser,noiseBuffer,selected='island',enabled=true,unlocking=false;
let queue=[],last=new Map(),counts={},peak=0;
try{enabled=localStorage.getItem('ila_sound')!=='off'}catch(_){}
const hash=id=>{let h=2166136261;for(let c of String(id)){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0};
function profile(id){let family=families[id]||'arcade',v=timbres[family],h=hash(id);
 return {id,family,root:v[0]*Math.pow(2,((h%19)-9)/36),wave:v[1],filter:v[2],decay:v[3],variant:(h>>>9)%7,signature:family+'-'+h.toString(16)}}
function create(){
 if(ac||!C)return !!ac;
 ac=new C({latencyHint:'interactive'});master=ac.createGain();master.gain.value=enabled?.75:0;
 const compressor=ac.createDynamicsCompressor();compressor.threshold.value=-18;compressor.ratio.value=4;compressor.attack.value=.003;compressor.release.value=.15;
 analyser=ac.createAnalyser();analyser.fftSize=1024;master.connect(compressor);compressor.connect(analyser);analyser.connect(ac.destination);
 noiseBuffer=ac.createBuffer(1,Math.round(ac.sampleRate*1.5),ac.sampleRate);let b=noiseBuffer.getChannelData(0);for(let i=0;i<b.length;i++)b[i]=Math.random()*2-1;
 return true;
}
function unlock(){if(!enabled||!C)return false;
 try{if(!create())return false;if(ac.state==='running')return true;
 if(!unlocking){unlocking=true;const silent=ac.createBufferSource();silent.buffer=ac.createBuffer(1,1,ac.sampleRate);silent.connect(master);silent.start();
 Promise.resolve(ac.resume()).then(()=>{unlocking=false;if(ac.state==='running'&&enabled){let q=queue;queue=[];for(const v of q)emit(...v)}}).catch(()=>{unlocking=false})}
 return true}catch(_){unlocking=false;return false}}
function tone(t,f,g,d,amp,w='sine',cut=4000){
 if(!ac||!master)return;const o=ac.createOscillator(),env=ac.createGain(),lp=ac.createBiquadFilter();
 o.type=w;o.frequency.setValueAtTime(Math.max(32,f),t);o.frequency.exponentialRampToValueAtTime(Math.max(32,g),t+d*.85);
 lp.type='lowpass';lp.frequency.value=cut;env.gain.setValueAtTime(.0001,t);env.gain.exponentialRampToValueAtTime(Math.max(.001,amp),t+Math.min(.012,d*.2));env.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(lp);lp.connect(env);env.connect(master);o.start(t);o.stop(t+d+.012);
}
function noise(t,d,amp,center,end=center){
 const src=ac.createBufferSource(),env=ac.createGain(),bp=ac.createBiquadFilter();src.buffer=noiseBuffer;
 bp.type='bandpass';bp.Q.value=.85;bp.frequency.setValueAtTime(Math.max(50,center),t);bp.frequency.exponentialRampToValueAtTime(Math.max(50,end),t+d);
 env.gain.setValueAtTime(.0001,t);env.gain.exponentialRampToValueAtTime(amp,t+Math.min(.009,d*.2));env.gain.exponentialRampToValueAtTime(.0001,t+d);
 src.connect(bp);bp.connect(env);env.connect(master);src.start(t,Math.random()*.25,d+.01);src.stop(t+d+.015);
}
function pluck(t,f,d=.18,amp=.14){tone(t,f,f*.995,d,amp,'triangle');tone(t,f*2.01,f*2,d*.48,amp*.30,'sine');tone(t,f*3,f*2.99,d*.25,amp*.12,'sine')}
function chord(t,p,up=true){[0,up?4:3,up?7:-2,up?12:-7].forEach((n,i)=>pluck(t+i*.095,p.root*Math.pow(2,n/12),.36,.12))}
function action(t,p,kind){
 let r=p.root,f=p.filter,v=p.variant,d=p.decay;
 switch(kind){
 case 'water':noise(t,.23,.16,1300+v*120,220);tone(t,r*2,r*.65,.13,.105);tone(t+.05,r*2.8,r*1.4,.1,.06);break;
 case 'engine':tone(t,r*.55,r*1.8,.24,.16,'sawtooth',750);noise(t,.26,.115,700,280);tone(t+.035,r*2,r*1.4,.17,.04,'triangle');break;
 case 'laser':tone(t,r*4.2,r*.55,.13,.15,'sawtooth',3500);tone(t,r*2.8,r*.9,.085,.06,'square',2300);noise(t,.08,.055,2300,600);break;
 case 'blade':noise(t,.16,.20,3400,650);tone(t,r*4,r*.8,.14,.10,'triangle');break;
 case 'bounce':tone(t,r*2.6,r,.085,.19,'sine');tone(t+.008,r*5,r*2,.035,.05);noise(t,.04,.045,900);break;
 case 'pop':tone(t,r*.9,r*2.6,.05,.13);tone(t+.035,r*2.3,r*.8,.08,.08);noise(t,.05,.065,1800);break;
 case 'wood':tone(t,r,r*.67,.10,.14,'triangle');noise(t,.075,.12,480+v*70,190);break;
 case 'bell':pluck(t,r*1.6,.28,.14);tone(t,r*3.07,r*3.02,.19,.045);break;
 case 'paper':noise(t,.105,.13,1800+v*110,700);tone(t,r*1.5,r*1.08,.065,.065);break;
 case 'glass':pluck(t,r,.22,.12);tone(t,r*2.76,r*2.7,.12,.045);break;
 case 'tile':tone(t,r*1.6,r,.08,.13,'triangle');noise(t,.055,.09,900,400);break;
 case 'forest':noise(t,.15,.12,520+v*60,200);tone(t,r*.74,r*.65,.11,.06);break;
 case 'music':pluck(t,r,.32,.15);break;
 default:tone(t,r,r*1.65,d,.13,p.wave,f);tone(t+.025,r*2,r*1.4,.08,.045);
 }
}
function emit(event,id,opts={}){
 if(!enabled||!ac||ac.state!=='running')return false;
 try{
 const p=profile(id),r=p.root,t=ac.currentTime+.012;
 switch(event){
 case 'note':pluck(t,[261.626,293.665,329.628,349.228,391.995,440,493.883,523.251][Math.abs(opts.note||0)%8],.36,.17);break;
 case 'start':pluck(t,r,.21,.1);pluck(t+.09,r*1.5,.28,.12);break;
 case 'win':case 'success':case 'solve':chord(t,p,true);break;
 case 'fail':case 'lose':tone(t,r*1.35,r*.55,.34,.15,'triangle',1000);noise(t,.23,.12,420,150);tone(t+.13,r*.75,r*.5,.28,.09);break;
 case 'hit':case 'collision':case 'wrong':case 'damage':noise(t,.18,.2,opts.heavy?220:700,160);tone(t,r*.92,r*.42,.19,.13,'triangle',900);break;
 case 'point':case 'collect':case 'correct':action(t,p,p.family);pluck(t+.05,r*2,.19,.10);break;
 case 'fire':case 'shoot':action(t,p,['blade','wood','music','bounce','water','engine','glass'].includes(p.family)?p.family:'laser');break;
 case 'jump':case 'flap':tone(t,r*.75,r*2.1,.17,.15,'triangle');noise(t,.11,.075,p.family==='forest'?600:1700,450);break;
 case 'dash':case 'boost':action(t,p,'blade');tone(t,r*.65,r*2,.18,.11,'sawtooth',1200);break;
 case 'bounce':action(t,p,'bounce');break;
 case 'step':case 'land':action(t,p,p.family==='forest'?'forest':p.family==='water'?'water':'wood');break;
 case 'tick':pluck(t,r*1.5,.09,.085);break;
 case 'ambient':if(p.family==='forest'||p.family==='water'){noise(t,.85,.045,p.family==='water'?450:1100,650);if(p.family==='forest')tone(t+.2,1200+p.variant*95,1500+p.variant*70,.15,.026)}else tone(t,r*.5,r*.65,.32,.035,'sine');break;
 case 'move':case 'steer':case 'tap':case 'select':case 'pop':case 'burst':case 'tile':default:action(t,p,p.family);
 }
 counts[id+':'+event]=(counts[id+':'+event]||0)+1;return true;
 }catch(e){console.warn('ILAI audio:',e);return false}
}
function play(event='tap',id=selected,opts={}){
 if(!enabled||document.hidden||!C)return false;
 if(!ac&&!unlock())return false;
 const k=id+':'+event,now=performance.now(),gap=({move:150,step:230,ambient:850,hit:150,fire:90,point:95,tap:85,note:35,burst:120})[event]||70;
 if(!opts.force&&now-(last.get(k)??-1e6)<gap)return false;
 last.set(k,now);
 if(ac.state!=='running'){if(queue.length<16)queue.push([event,id,opts]);return false}
 return emit(event,id,opts);
}
function setEnabled(on,persist=true){enabled=!!on;if(persist)try{localStorage.setItem('ila_sound',enabled?'on':'off')}catch(_){}
 if(master)master.gain.setTargetAtTime(enabled?.75:0,ac.currentTime,.012);if(!enabled)queue=[];return enabled}
function meter(){if(!analyser)return 0;let data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);let p=0;for(let v of data)p=Math.max(p,Math.abs(v));peak=Math.max(peak,p);return p}
window.ILAudio={play,unlock,profile,select(id){selected=id},setEnabled,toggle(){return setEnabled(!enabled)},get enabled(){return enabled},get state(){return ac?.state||'uninitialized'},get signatures(){return Object.fromEntries(Object.keys(families).map(x=>[x,profile(x).signature]))},diagnostics(){return{state:ac?.state||'uninitialized',enabled,counts:{...counts},level:meter(),peak}},meter};
const gesture=()=>{if(enabled)unlock()};
for(const event of ['pointerdown','touchend','click','keydown'])document.addEventListener(event,gesture,{capture:true,passive:true});
window.addEventListener('storage',e=>{if(e.key==='ila_sound')setEnabled(e.newValue!=='off',false)});
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='ila-audio-setting')setEnabled(e.data.enabled,false)});
})();
