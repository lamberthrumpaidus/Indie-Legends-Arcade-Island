/* Create by LamberthRumpaidus — cinematic vector art for all 12 canvas games.
 * No remote assets, no game logos or technical slogans in the playing area.
 */
(()=>{
'use strict';
const TAU=Math.PI*2, M=Math, PI=Math.PI;
const C=()=>ctx, S=()=>gameState;
const tm=()=>performance.now()/1000;
function lin(x1,y1,x2,y2,colors){let g=C().createLinearGradient(x1,y1,x2,y2);colors.forEach(([p,c])=>g.addColorStop(p,c));return g}
function rad(x,y,r,colors){let g=C().createRadialGradient(x,y,0,x,y,r);colors.forEach(([p,c])=>g.addColorStop(p,c));return g}
function fill(x,y,w,h,c,r=0){let c2=C();c2.fillStyle=c;c2.beginPath();if(r)c2.roundRect(x,y,w,h,r);else c2.rect(x,y,w,h);c2.fill()}
function disc(x,y,r,c){let c2=C();c2.beginPath();c2.arc(x,y,M.max(0.01,r),0,TAU);c2.fillStyle=c;c2.fill()}
function ellipse(x,y,rx,ry,c){let c2=C();c2.beginPath();c2.ellipse(x,y,rx,ry,0,0,TAU);c2.fillStyle=c;c2.fill()}
function shape(points,c){let a=C();a.beginPath();points.forEach((p,i)=>i?a.lineTo(...p):a.moveTo(...p));a.closePath();a.fillStyle=c;a.fill()}
function stroke(points,c,w=2){let a=C();a.beginPath();points.forEach((p,i)=>i?a.lineTo(...p):a.moveTo(...p));a.strokeStyle=c;a.lineWidth=w;a.lineCap='round';a.lineJoin='round';a.stroke()}
function outlined(x,y,w,h,c,border,r=8){fill(x,y,w,h,border,r+1);fill(x+2,y+2,w-4,h-4,c,r)}
function label(t,x,y,size=18,col='#fff',align='center'){let a=C();a.textAlign=align;a.font=`700 ${size}px system-ui,-apple-system,Arial`;a.fillStyle=col;a.fillText(String(t),x,y)}
function star(x,y,r,col,spikes=5){let pts=[];for(let i=0;i<spikes*2;i++){let a=-PI/2+i*PI/spikes;let rr=(i%2?0.45:1)*r;pts.push([x+M.cos(a)*rr,y+M.sin(a)*rr])}shape(pts,col)}
function gl(x,y,r,color='#8bf7e8',a=.26){disc(x,y,r,rad(x,y,r,[[0,color],[.26,color+'77'],[1,color+'00']]))}
function screenGlow(x,y,r,col){let a=C();a.save();a.globalAlpha=.48;disc(x,y,r,rad(x,y,r,[[0,col],[1,'#00000000']]));a.restore()}
const rng=(i,n)=>((M.sin(i*127.1+n*311.7)*43758.5453)%1+1)%1;
function mist(t,c='#8fc7b9',strength=.24){let a=C();a.save();a.globalAlpha=strength;for(let j=0;j<3;j++){let y=90+j*150;ellipse((t*(6+j*3)+j*287)%960-120,y,175+j*30,36,c+'30')}a.restore()}
function atmosphere(a,b,t,id){
 fill(0,0,W,H,lin(0,0,W,H,[[0,a],[1,b]]));
 for(let i=0;i<3;i++){let x=115+i*245+M.sin(t*.18+i*1.6)*22,y=80+i*85;
  let color=id==='racer'?'#f59f6d':id==='flappy'?'#d8f7e8':id==='runner'?'#fbcdac':'#4bbbad';
  disc(x,y,180,rad(x,y,180,[[0,color+'1a'],[1,color+'00']]));
 }
}
function stars(t,n=95){let c=C();c.save();for(let i=0;i<n;i++){let x=(i*137.31+Math.sin(i)*200)%W,y=(i*77.13+i*i*0.23+t*(5+i%5*5))%H;let r=(i%19===0?2.1:.5+(i%7)*.15);c.globalAlpha=.34+.48*(.5+.5*M.sin(t*(1.4+i%4*.3)+i));disc(x,y,r,i%7===0?'#affff6':'#ffffff')}c.restore()}
function hill(t,base,color,scale=1,speed=14){let a=C();a.beginPath();a.moveTo(-25,H);for(let x=-25;x<=W+50;x+=12){let h=24*scale*M.sin(x*.012+t*speed*.002)+16*scale*M.sin(x*.032+t*speed*.003+1);a.lineTo(x,base-h)}a.lineTo(W+40,H);a.closePath();a.fillStyle=color;a.fill()}
function planet(t,x,y,r){disc(x,y,r,rad(x-r*.3,y-r*.4,r*1.7,[[0,'#81b7b8'],[.45,'#345a83'],[1,'#162c5a']]));ellipse(x,y+r*.04,r*1.53,r*.24,'#9dbec62e')}
function spaceScene(t){atmosphere('#07142c','#163456',t,'space');stars(t);planet(t,634,104,61);
 for(let i=0;i<3;i++){let x=135+i*245+M.sin(t*.15+i)*21;disc(x,285,130,rad(x,285,130,[[0,['#468cb92a','#9e63ce17','#4bbda71e'][i]],[1,'#00000000']]))}}
function shooterShip(x,y,t,flame=true){let a=C();a.save();a.translate(x,y);let bob=M.sin(t*9)*1.1;a.translate(0,bob);
 if(flame){gl(0,24,34,'#41f5ff',.5);shape([[-9,16],[-6,38+M.sin(t*24)*10],[0,51+M.sin(t*32)*7],[7,34+M.sin(t*28)*8],[9,16]],lin(0,12,0,58,[[0,'#d9f6ff'],[.32,'#50ebfa'],[1,'#56e2ff00']]));}
 shape([[-9,17],[-32,29],[-30,8],[-16,-8],[0,-29],[15,-8],[30,8],[32,29],[10,17]],'#0c2240');
 shape([[-6,13],[-27,23],[-25,8],[-14,-5],[0,-30],[15,-5],[25,8],[27,23],[6,13]],lin(-25,-25,25,32,[[0,'#f8fdff'],[.28,'#8fc9e8'],[.58,'#517eab'],[1,'#1b345c']]));
 shape([[-7,6],[-13,-6],[0,-21],[13,-6],[7,6]],'#143e67');shape([[-4,-2],[0,-18],[5,-2]],'#70f8ff');
 fill(-27,14,9,5,'#5ce4ff',2);fill(18,14,9,5,'#5ce4ff',2);stroke([[0,-27],[0,16]],'#ffffff7a',1.8);a.restore()}
function drone(x,y,t,seed=0){let a=C();a.save();a.translate(x,y);a.rotate(M.sin(t*2+seed)*.16);
 gl(0,0,26,'#ff78ba');shape([[-24,-6],[-11,-20],[0,-14],[12,-20],[25,-6],[15,15],[-15,15]],'#2b2054');
 shape([[-22,-5],[-5,-9],[0,-15],[5,-9],[22,-5],[14,13],[-14,13]],lin(-12,-10,18,18,[[0,'#ffb1ec'],[.45,'#cd60b1'],[1,'#733c93']]));
 ellipse(0,2,15,8,'#331f58');ellipse(-6,1,3.5,3,'#a9fff2');ellipse(6,1,3.5,3,'#a9fff2');fill(-23,-2,7,5,'#ed9dfa',1);fill(17,-2,7,5,'#ed9dfa',1);a.restore()}
function asteroid(x,y,r,t){let a=C();a.save();a.translate(x,y);a.rotate((x+y)*.0007+t*.25);let p=[];for(let i=0;i<11;i++){let ang=TAU*i/11,rr=r*(.80+rng(i,Math.floor(r))*0.4);p.push([M.cos(ang)*rr,M.sin(ang)*rr])}
 shape(p,lin(-r,-r,r,r,[[0,'#e2b69f'],[.38,'#b37b7e'],[1,'#533e5e']]));stroke([...p,p[0]],'#ffe4c155',1.5);
 for(let i=0;i<3;i++)ellipse(M.sin(i*3+1)*r*.46,M.cos(i*6)*r*.35,r*.09+i*.4,r*.08+i*.5,'#563d50aa');a.restore()}
function hearts(n){for(let i=0;i<n;i++){let x=400-i*25;label('♥',x,35,21,'#ff91a2')}}
function lightParticle(x,y,t,color='#ffcf88',n=7){for(let i=0;i<n;i++){let xx=x+M.sin(i*2.4+t*1.7)*14,yy=y+M.cos(i*4+t*1.3)*17;disc(xx,yy,1.25,color)}}
function torii(x,y,s=1){let a=C();a.save();a.translate(x,y);a.scale(s,s);fill(-39,-37,9,72,'#a84b45',2);fill(30,-37,9,72,'#a84b45',2);fill(-53,-44,106,10,'#b85d4f',2);fill(-44,-29,88,7,'#8d423e',2);fill(-58,-47,116,4,'#f2b980');a.restore()}
function flappyScene(t){atmosphere('#356eaa','#9cd2cb',t,'flappy');disc(590,90,40,rad(575,72,110,[[0,'#fff8d8'],[.4,'#ffdfb5'],[1,'#ffdfb500']]));
 for(let i=0;i<9;i++){let xx=((i*128-t*(10+i%3*3))%920+920)%920-80,yy=53+(i*53)%215;ellipse(xx,yy,35,9,'#ffffff39')}
 hill(t,353,'#5f9ba8',1,5);hill(t,397,'#407b8f',1.2,13);fill(0,451,W,29,'#235e62');
 for(let i=0;i<14;i++){let x=((i*71-t*18)%820+820)%820;ellipse(x,465,21,5,'#61aa7d66')}
}
function flappyBird(x,y,t){let a=C();a.save();a.translate(x,y);a.rotate(M.sin(t*4)*.08);
 gl(0,0,31,'#ffd26d');ellipse(-9,2,23,17,'#7f4b51');ellipse(0,0,19,17,lin(-10,-18,16,22,[[0,'#fff5b5'],[.5,'#ffc972'],[1,'#e58a56']]));
 shape([[-20,3],[-38,-4],[-27,13],[-11,13]],'#f4af66');
 ellipse(-5,7+M.sin(t*18)*7,13,8,'#e99a5b');ellipse(1,6+M.sin(t*18)*6,11,7,'#ffe7aa');
 shape([[10,-1],[33,4],[10,12]],'#f49c51');disc(11,-6,6,'#fff8e2');disc(13,-6,3,'#26334e');disc(14,-7,1,'#fff');a.restore()}
function pipe(x,top,bottom){let w=64;
 if(top>0){fill(x,0,w,top,lin(x,0,x+w,0,[[0,'#194b54'],[.29,'#6cc7a1'],[.74,'#318e7d'],[1,'#143e50']]),5);outlined(x-7,top-20,w+14,23,'#2e947c','#90d9b4',6)}
 if(bottom<H){fill(x,bottom,w,H-bottom,lin(x,0,x+w,0,[[0,'#194b54'],[.29,'#6cc7a1'],[.74,'#318e7d'],[1,'#143e50']]),5);outlined(x-7,bottom,w+14,23,'#2e947c','#90d9b4',6)}
 fill(x+12,0,3,M.max(0,top-10),'#f0ffcb45');fill(x+12,bottom+25,3,H-bottom-25,'#f0ffcb45')}
function roadScene(t){atmosphere('#204757','#0a1728',t,'racer');
 hill(t,260,'#173d42',1,6);hill(t,287,'#10313a',1.2,10);
 for(let i=0;i<10;i++){let y=((t*170+i*91)%620)-70;let fade=1-y/H;fill(105,y,5,35,'#a7e7e850');fill(651,y,5,35,'#baffd740');disc(107,y,7,'#a5f5ed33');disc(651,y,7,'#d7f5b333')}
 fill(165,0,430,H,lin(160,0,590,0,[[0,'#273d4e'],[.5,'#172636'],[1,'#263f50']]));
 fill(158,0,7,H,'#7dbaa6');fill(595,0,7,H,'#7dbaa6');
 for(let i=1;i<3;i++){let x=185+i*130-65;for(let y=-50;y<H+50;y+=94)fill(x,(y+t*240)%600-40,4,44,'#b9d6dc89',2)}
}
function car(x,y,c,t,enemy=false){let a=C();a.save();a.translate(x,y+M.sin(t*12)*.8);ellipse(0,63,31,14,'#010e1a80');
 fill(-28,11,6,22,'#071628',4);fill(22,11,6,22,'#071628',4);fill(-28,47,6,22,'#071628',4);fill(22,47,6,22,'#071628',4);
 let side=lin(-26,0,26,0,[[0,'#172638'],[.17,c],[.68,c],[1,'#121b2c']]);shape([[-20,0],[20,0],[26,14],[25,59],[18,77],[-19,77],[-26,59],[-25,14]],side);
 shape([[-17,17],[-12,7],[12,7],[17,17],[17,37],[-17,37]],'#2c5f78');shape([[-14,18],[-11,10],[11,10],[14,18]],'#aeeaff');
 fill(-16,52,32,10,'#1a2b3c',2);fill(-17,69,12,5,enemy?'#f9a0ad':'#fbd19d',2);fill(5,69,12,5,enemy?'#f9a0ad':'#fbd19d',2);
 stroke([[-16,4],[16,4]],'#ffffff8b',2);stroke([[-18,43],[18,43]],'#ffffff31',2);a.restore()}
function courtScene(t){atmosphere('#08142b','#11384a',t);let c=C();fill(36,28,688,422,'#05182d66',17);c.strokeStyle='#68cddc37';c.lineWidth=2;c.strokeRect(36,28,688,422);for(let y=38;y<443;y+=33)fill(378,y,4,18,'#b3e5ee45',2);c.beginPath();c.arc(380,240,88,0,TAU);c.stroke();for(let i=0;i<40;i++){let x=57+i*17;disc(x,32,0.5,'#d3efff33')} }
function breakoutScene(t){atmosphere('#101b37','#231f43',t);stars(t,32);fill(26,24,W-52,H-31,'#0615245c',16);for(let i=0;i<13;i++){let x=(i*79)%760;stroke([[x,22],[x-22,H]],'#d6e8fd10',1)} }
function cubeBrick(x,y,w,h,col,t){let c=C();c.save();c.shadowColor=col;c.shadowBlur=11;fill(x,y,w,h,col,5);c.shadowBlur=0;fill(x+3,y+3,w-6,h*.32,'#ffffff65',3);fill(x+3,y+h*.72,w-6,h*.17,'#061b2b35',2);c.restore()}
function beachScene(t){atmosphere('#322047','#71475a',t,'runner');disc(616,103,44,rad(600,90,110,[[0,'#ffe9bb'],[.4,'#ffd5ae88'],[1,'#ffb49b00']]));
 hill(t,310,'#564b75',1,6);hill(t,377,'#373861',1.4,11);fill(0,405,W,H-405,'#1a3049');stroke([[0,405],[760,405]],'#e1c7a582',3);
 for(let i=0;i<14;i++){let x=((i*92-t*115)%900+900)%900-60;fill(x,413,46,4,'#e6bcb780',3)}}
function humanRunner(x,y,t,jump){let c=C(),moving=!jump;let stride=M.sin(t*16)*11; c.save();c.translate(x,y);
 ellipse(0,6,21,6,'#07172960');
 stroke([[-1,-18],[-6+stride,0]],'#172d3c',8);stroke([[4,-19],[12-stride,0]],'#172d3c',8);
 fill(-11,-46,24,32,lin(-10,-48,12,-15,[[0,'#ffd19c'],[.5,'#e78c68'],[1,'#ab5670']]),8);
 stroke([[-10,-39],[-19-stride*.6,-15]],'#ffd49e',6);stroke([[11,-41],[21+stride*.6,-20]],'#ffd49e',6);
 disc(1,-58,14,'#f4c499');ellipse(2,-66,14,8,'#233342');disc(7,-59,1.9,'#142f36');
 fill(-12,-4,17,7,'#f2efcf',3);fill(4,-4,17,7,'#f2efcf',3); c.restore()}
function catchScene(t){atmosphere('#24173b','#46375f',t,'catch');for(let i=0;i<9;i++){let x=28+i*91+M.sin(t*.1+i)*8;stroke([[x-25,0],[x+30,H]],'#d6c9f30c',24)}for(let i=0;i<22;i++){let xx=(i*31.22+t*(i%3+1)*10)%W,yy=(i*61)%H;disc(xx,yy,1.3,'#fff0c97d')}}
function basket(x,y){ellipse(x,y+27,61,12,'#000e2455');shape([[x-51,y-2],[x+51,y-2],[x+38,y+33],[x-38,y+33]],lin(x,y,x,y+36,[[0,'#c8a27d'],[.6,'#946879'],[1,'#4e3e62']]));
 ellipse(x,y-2,52,9,'#e0c3a2');ellipse(x,y-4,46,6,'#6d5064');for(let i=-3;i<=3;i++)stroke([[x+i*12,y+6],[x+i*10,y+27]],'#ffe3b957',2)}
function gridScene(t){atmosphere('#09192a','#123d3e',t,'snake');let a=C();a.save();a.globalAlpha=.54;
 for(let y=0;y<18;y++)for(let x=0;x<30;x++){fill(20+x*24,24+y*24,23,23,(x+y)%2?'#356a611a':'#88d9ac0c',3)}
 a.restore();for(let i=0;i<8;i++){let xx=(i*101+27)%W,yy=(i*149+30)%H;gl(xx,yy,30,'#8be6cc')}}
function apple(x,y,t){let a=C();a.save();a.translate(x,y+M.sin(t*3+x)*1.6);gl(0,2,27,'#ff6d83');
 disc(-5,2,10,lin(-13,-6,14,14,[[0,'#ffb1a1'],[.55,'#ee5d7a'],[1,'#a83566']]));disc(5,2,10,lin(-10,0,13,12,[[0,'#f07c7d'],[1,'#b3265d']]));
 ellipse(-4,-4,3,5,'#ffe5c766');stroke([[0,-6],[1,-14]],'#805334',2.8);ellipse(6,-13,6,3,'#8becae');lightParticle(1,2,t,'#ffd3bb',3);a.restore()}
function snake(t){let s=S();gridScene(t);apple(32+s.food.x*24,36+s.food.y*24,t);
 const cell=p=>({x:32+p.x*24,y:36+p.y*24});const now=s.body||[],prev=s._before||now;const f=M.min(1,(s.t||0)/M.max(.075,.14-score*.002));
 const bodies=now.map((p,i)=>{let a=cell(prev[i]||p),b=cell(p);return{x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f}});
 if(!bodies.length)return;
 let a=C();if(bodies.length>1){const paint=()=>{a.beginPath();let tail=bodies[bodies.length-1];a.moveTo(tail.x,tail.y);for(let i=bodies.length-2;i>=0;i--){let p=bodies[i];a.lineTo(p.x,p.y)}};
 a.save();a.lineCap='round';a.lineJoin='round';paint();a.strokeStyle='#052b32';a.lineWidth=22;a.stroke();paint();a.strokeStyle=lin(90,0,650,H,[[0,'#278f84'],[.42,'#64c78e'],[1,'#65e2bb']]);a.lineWidth=17;a.stroke();paint();a.strokeStyle='#d3ffe162';a.lineWidth=4.5;a.stroke();a.restore();}
 for(let i=bodies.length-1;i>0;i--){const p=bodies[i];disc(p.x,p.y,7.2,i%2?'#56bf8c':'#3da981');disc(p.x-2,p.y-2,2.5,'#c2f2ac90')}
 let head=bodies[0],d=s.dir||{x:1,y:0};a.save();a.translate(head.x,head.y);a.rotate(M.atan2(d.y,d.x));
 ellipse(2,0,13,11,'#123e39');ellipse(3,-1,12,9,lin(0,-10,7,9,[[0,'#c0f6aa'],[.6,'#67d7a5'],[1,'#349883']]));ellipse(13,1,7,6,'#5bbc93');
 disc(3,-5,3.8,'#ffffff');disc(4,-5,2.1,'#122c37');disc(3,5,3.8,'#ffffff');disc(4,5,2.1,'#122c37');
 disc(17,-2,1.2,'#204c42');disc(17,3,1.2,'#204c42');stroke([[18,0],[24+M.sin(t*9)*2,0]],'#f18a9b',1.5);
 if(M.sin(t*6)>.2){stroke([[24,0],[27,-3]],'#f18a9b',1.2);stroke([[24,0],[27,3]],'#f18a9b',1.2)}a.restore();
}
function meteor(t){spaceScene(t);let s=S();for(let i=0;i<4;i++)gl(((i*211+t*14)%830),((i*97)%H),85,'#a25aaa');
 (s.rocks||[]).forEach((q,i)=>{let a=C();a.save();a.translate(q.x,q.y);shape([[-q.r*.5,-q.r*.5],[-q.r*.2,-q.r*2.7],[q.r*.2,-q.r*2.3],[q.r*.5,-q.r*.3]],lin(0,-q.r*2.7,0,q.r,[[0,'#ffa65a00'],[1,'#ff9b5388']]));a.restore();asteroid(q.x,q.y,q.r,t)});
 shooterShip(s.x,420,t,true);hearts(s.life||0)}
function space(t){spaceScene(t);let s=S();(s.aliens||[]).forEach((q,i)=>drone(q.x,q.y,t,i));(s.bullets||[]).forEach(b=>{gl(b.x,b.y-5,17,'#97fffa');fill(b.x-3,b.y-17,6,22,'#dffff6',4);fill(b.x-1,b.y-28,2,16,'#82fff9',2)});shooterShip(s.x,420,t);hearts(s.hp||0)}
function flappy(t){flappyScene(t);let s=S();s.pipes.forEach(p=>pipe(p.x,p.gap-85,p.gap+85));flappyBird(s.x,s.y,t);if(!s.started){label('KETUK UNTUK TERBANG',W/2,61,19,'#ffffff');label('Lewati celah dan terus maju',W/2,87,12,'#ebffffb0')}}
function breakout(t){breakoutScene(t);let s=S();for(let b of s.bricks)if(b.alive)cubeBrick(b.x,b.y,b.w,b.h,b.color,t);gl(s.ball.x,s.ball.y,30,'#f2f7ff');disc(s.ball.x,s.ball.y,9,rad(s.ball.x-2,s.ball.y-3,15,[[0,'#fff'],[.5,'#a9eaf9'],[1,'#5da8dd']]));
 fill(s.p-57,438,114,20,'#101e3c',11);fill(s.p-54,440,108,14,lin(s.p-55,440,s.p+55,455,[[0,'#51a0cf'],[.48,'#d8eafe'],[1,'#5b92c4']]),8);fill(s.p-43,441,86,3,'#ffffff9c',3);hearts(s.life||0)}
function pong(t){courtScene(t);let s=S();gl(s.ball.x,s.ball.y,33,'#d2ffff');stroke([[s.ball.x,s.ball.y],[s.ball.x-s.ball.vx*.07,s.ball.y-s.ball.vy*.07]],'#81eeef8b',4);
 let c=C();c.save();c.shadowColor='#5ff9db';c.shadowBlur=14;fill(18,s.py-50,17,100,lin(18,0,37,0,[[0,'#2d8d99'],[1,'#bcfff1']]),9);c.shadowColor='#ff9bc9';fill(725,s.ai-50,17,100,lin(725,0,742,0,[[0,'#ff97c4'],[1,'#b94a91']]),9);c.restore();disc(s.ball.x,s.ball.y,10,'#effeff');label(`${s.p}  :  ${s.bot}`,380,63,35,'#dff8ff')}
function racer(t){roadScene(t);let s=S();(s.cars||[]).forEach((q,i)=>car(250+q.lane*130,q.y,q.c,t+i,true));car(250+s.lane*130,385,'#82bacf',t,false)}
function catchDraw(t){catchScene(t);let s=S();s.items.forEach(q=>{if(q.bomb){gl(q.x,q.y,22,'#ff867f');disc(q.x,q.y,15,'#1c2944');disc(q.x-4,q.y-6,5,'#56667b');stroke([[q.x+5,q.y-12],[q.x+10,q.y-23]],'#ed8a72',3);star(q.x+10,q.y-24,5,'#ffd6a2',5)}else{gl(q.x,q.y,24,'#ffe9a1');star(q.x,q.y,16,'#ffeeb0');star(q.x-2,q.y-3,8,'#fff9d8')}});basket(s.x,416);label('BOM '+s.miss+' / 3',26,34,18,'#ffe2e5','left')}
function orbit(t){spaceScene(t);let s=S();s.rocks.forEach(q=>asteroid(q.x,q.y,q.r,t));s.bullets.forEach(b=>{gl(b.x,b.y,11,'#fff4b8');disc(b.x,b.y,4,'#fff3c3')});let c=C();c.save();c.translate(s.x,s.y);c.rotate(s.a+PI/2);shootShipOrbit(t);c.restore();hearts(s.hp||0)}
function shootShipOrbit(t){let c=C();shape([[-9,13],[0,27+M.sin(t*25)*6],[9,13]],'#ffcb7999');shape([[0,-27],[20,16],[8,10],[0,4],[-8,10],[-20,16]],lin(0,-25,0,18,[[0,'#d3fffb'],[.5,'#79d6c7'],[1,'#467ba0']]));ellipse(0,-5,6,11,'#224963');ellipse(0,-8,3,5,'#ccfafa')}
function runner(t){beachScene(t);let s=S();s.blocks.forEach((q,i)=>{gl(q.x+q.w*.5,408-q.h*.5,45,'#fbb77c');fill(q.x,408-q.h,q.w,q.h,lin(q.x,0,q.x+q.w,0,[[0,'#a95e6c'],[.3,'#e8a679'],[1,'#704c66']]),5);fill(q.x+5,412-q.h,q.w-10,4,'#ffdfb1',3)});humanRunner(122,408-s.y,t,s.y>0)}
function aim(t){atmosphere('#211f3d','#514069',t,'aim');for(let i=0;i<15;i++){let x=22+i*53,y=60+M.sin(i*3+t*.5)*13;stroke([[x,0],[x+22,480]],'#ebcdff0a',12)}
 let s=S(),q=s.target;gl(q.x,q.y,76,'#ff869a');let r=q.r;disc(q.x,q.y,r+6,'#482c56');disc(q.x,q.y,r,'#f28baa');disc(q.x,q.y,r*.78,'#fff4eb');disc(q.x,q.y,r*.56,'#e66b88');disc(q.x,q.y,r*.35,'#ffe8cf');disc(q.x,q.y,r*.15,'#9a3d67');
 for(let i=0;i<3;i++){let a=t*(i%2?1:-1)+i*2.1;star(q.x+M.cos(a)*r*1.45,q.y+M.sin(a)*r*1.45,3,'#ffeacc',4)}label(M.max(0,M.ceil(s.time))+' s',W/2,41,24,'#fff8ef')}
function maze(t){atmosphere('#0c2530','#183d47',t,'maze');let s=S(),unit=40;for(let y=0;y<11;y++)for(let x=0;x<17;x++){let wall=s.grid[y][x],xx=40+x*unit,yy=20+y*unit;if(wall){fill(xx,yy,39,39,lin(xx,yy,xx+30,yy+39,[[0,'#466173'],[1,'#283e53']]),5);fill(xx+2,yy+2,34,6,'#9cc4c333');fill(xx+2,yy+35,34,3,'#091e2750')}else{fill(xx,yy,39,39,(x+y)%2?'#173d43':'#1b444a',3);disc(xx+20,yy+20,1.3,'#7dbeaa33')}}
 let ex=59+s.exit[0]*40,ey=39+s.exit[1]*40;gl(ex,ey,34,'#f9d895');star(ex,ey,18,'#ffdc8b',6);star(ex,ey,9,'#fff7d7',6);
 let xx=59+s.x*40,yy=39+s.y*40;gl(xx,yy,28,'#84efcf');disc(xx,yy,13,'#266c71');disc(xx,yy,10,'#9be8c9');disc(xx+2,yy-3,4,'#eefdfa');disc(xx+3,yy-3,1.8,'#294e5b')}
const painters={snake,meteor,space,flappy,breakout,pong,racer,catch:catchDraw,orbit,runner,aim,maze};
// Snake interpolation records the previous tile positions exactly when the logic moves.
let oldSnake=handlers.snake.update;
handlers.snake.update=function(dt){const s=S();const previous=s.body.map(p=>({...p}));const oldHead=s.body[0];oldSnake.call(this,dt);if(s.body[0]!==oldHead)s._before=previous};
// Smooth transitions for lane changes and prevent huge motion jumps after a tab resumes.
for(let [id,paint] of Object.entries(painters)){
 const h=handlers[id];h.draw=function(){const t=tm();try{paint(t)}catch(e){if(!this._failed){console.error('Render '+id,e);this._failed=true}atmosphere('#12172c','#213750',t)}};
}
})();
