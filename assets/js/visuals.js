/* Create by LamberthRumpaidus. */
/* Atmosphere and motion across the 12 canvas games; keeps original game rules intact. */
(()=>{
 const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const palette={snake:'#66f1c6',meteor:'#ffa77d',space:'#83ecf0',flappy:'#ffdf8a',breakout:'#b9d7ff',pong:'#8fe4ef',racer:'#a9b8ff',catch:'#f6ce80',orbit:'#85e9d6',runner:'#f4b38e',aim:'#fb99ac',maze:'#87e3d2'};
 let particles=[],ticks=0;
 function burst(x,y,color,count){if(calm)return;for(let i=0;i<count;i++){let a=Math.random()*Math.PI*2,v=40+Math.random()*150;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.4+Math.random()*.5,max:.9,r:1.5+Math.random()*2.4,c:color})}if(particles.length>95)particles.splice(0,particles.length-95)}
 const oldSet=addScore;
 addScore=function(n=1){oldSet(n);if(!active||!handlers[active[0]]?.canvas)return;const s=gameState;let x=s.x??s.p??s.ball?.x??380,y=s.y??s.ball?.y??280;if(active[0]==='racer')x=250+(s.lane||0)*130,y=408;burst(x,y,palette[active[0]]||'#ffffff',Math.min(11,Math.max(3,n)))};
 // gently shifting illumination in every background, without blurring collision geometry

 function backdrop(id,t){
   if(!id)return;
   ctx.save();
   if(['space','meteor','orbit'].includes(id)){
     // Layered nebula / deep space, generated with Canvas gradients.
     for(let j=0;j<3;j++){
       let x=(j*.34+.12)*W+Math.sin(t*(.1+j*.04)+j)*27,y=(.25+j*.24)*H+Math.cos(t*.23+j)*16;
       const g=ctx.createRadialGradient(x,y,7,x,y,150+j*32);
       let colors=['115,103,214','57,180,183','169,95,142'];
       g.addColorStop(0,`rgba(${colors[j]},.14)`);g.addColorStop(1,`rgba(${colors[j]},0)`);
       ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
     }
     ctx.fillStyle='#a2eae71e';ctx.beginPath();ctx.arc(615+Math.sin(t*.12)*7,115,66,0,Math.PI*2);ctx.fill();
     ctx.strokeStyle='#c9f1ff16';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(615,115,102,31,-.3,0,Math.PI*2);ctx.stroke();
     for(let i=0;i<60;i++){
       let xx=((i*161+t*(i%4+1)*9)%W),yy=(i*89+39)%H;
       ctx.fillStyle=`rgba(201,227,252,${.22+.17*Math.sin(t*2+i)})`;
       ctx.fillRect(xx,yy,(i%7===0?2:1),1.3);
     }
   }else if(['runner','flappy'].includes(id)){
     // Soft receding mountains/clouds create depth as the level scrolls.
     let moon=ctx.createRadialGradient(610,115,5,610,115,150);
     moon.addColorStop(0,'#fff5d638');moon.addColorStop(1,'#fff5d600');ctx.fillStyle=moon;ctx.fillRect(450,0,310,280);
     ctx.fillStyle='#ffefcf56';ctx.beginPath();ctx.arc(611,112,29,0,Math.PI*2);ctx.fill();
     for(let layer=0;layer<3;layer++){
       let y0=270+layer*43,shift=t*(layer+1)*7;
       ctx.beginPath();ctx.moveTo(0,H);
       for(let x=-20;x<=W+30;x+=15){let h=30+Math.sin((x+shift)*.014+layer*1.7)*21+Math.sin((x+shift)*.031+layer*.4)*10;ctx.lineTo(x,y0-h)}
       ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=['#6fc8bf0b','#337b9570','#193f697f'][layer];ctx.fill();
     }
     if(id==='flappy'){for(let i=0;i<9;i++){let x=((i*134-t*(10+i%3*5))%900+900)%900-45,y=55+((i*71)%225);ctx.fillStyle='#ebffff16';ctx.beginPath();ctx.ellipse(x,y,32,6,0,0,Math.PI*2);ctx.fill()}}
   }else if(id==='racer'){
     // Subtle moving highway shoulder lights; gameplay lane geometry stays untouched.
     let yShift=t*180;
     for(let side of [-1,1]){
       let x=side<0?70:660;
       for(let i=0;i<8;i++){
         let y=((i*94+yShift)%570)-55;
         ctx.fillStyle=i%3===0?'#f8c4a13d':'#a5dae52a';ctx.fillRect(x,y,side*9,34);
         ctx.fillStyle='#f9d4a512';ctx.beginPath();ctx.ellipse(x,y+4,23,15,0,0,Math.PI*2);ctx.fill();
       }
     }
     for(let i=0;i<13;i++){
       let x=((i*61)%W),y=((i*79+t*9)%H);
       ctx.fillStyle='#afd8eb0a';ctx.fillRect(x,y,3,40);
     }
   }else if(['snake','maze','aim','breakout','pong'].includes(id)){
     const gridSpace=id==='snake'?24:id==='maze'?40:48;
     ctx.strokeStyle=id==='maze'?'#64b6c20c':'#badcf412';ctx.lineWidth=1;
     for(let x=0;x<=W;x+=gridSpace){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
     for(let y=0;y<=H;y+=gridSpace){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
     let x=W*(.5+.3*Math.sin(t*.28)),y=H*(.5+.2*Math.cos(t*.23)),g=ctx.createRadialGradient(x,y,1,x,y,240);
     g.addColorStop(0,'#95eeea1a');g.addColorStop(1,'#95eeea00');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
   }else if(id==='catch'){
     // Lavender light shafts in the background of the catcher field.
     for(let j=0;j<4;j++){let x=95+j*185+Math.sin(t*.3+j)*18;
       const g=ctx.createLinearGradient(x-45,0,x+80,H);g.addColorStop(0,'#bbbcfc17');g.addColorStop(1,'#d8d3f000');ctx.fillStyle=g;
       ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+25,0);ctx.lineTo(x+135,H);ctx.lineTo(x-65,H);ctx.fill();}
   }
   ctx.restore();
 }
 const oldBg=bg;
 bg=function(a,b){oldBg(a,b);if(!ctx)return;const t=performance.now()*.0004,px=W*(.50+.2*Math.sin(t)),py=H*(.35+.15*Math.cos(t*.8));let light=ctx.createRadialGradient(px,py,15,px,py,420);light.addColorStop(0,'#d7faff0b');light.addColorStop(1,'#d7faff00');ctx.fillStyle=light;ctx.fillRect(0,0,W,H);backdrop(active?.[0],performance.now()*.001)};
 const oldStars=glowStars;
 glowStars=function(n=60){const t=performance.now()*.0002;for(let i=0;i<n;i++){let x=((i*83+119+t*23*(i%4+1))%W),y=((i*137+63+t*10)%H);let twinkle=(Math.sin(i*4.5+t*3)+1)*.24+.20;ctx.fillStyle=`rgba(187,223,255,${twinkle})`;ctx.beginPath();ctx.arc(x,y,i%9===0?1.8:1,0,Math.PI*2);ctx.fill()}};
 const oldStart=startSession;
 startSession=function(id){particles=[];ticks=0;oldStart(id)};
 function post(id,dt){if(!ctx||!active)return;ticks+=dt;
 const s=gameState,t=ticks;ctx.save();
 // Subtle scene-specific movement highlights
 if(id==='snake'&&s.food){ctx.strokeStyle=`rgba(255,157,190,${.2+.3*Math.sin(t*4)**2})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(32+s.food.x*24,36+s.food.y*24,14+3*Math.sin(t*3),0,Math.PI*2);ctx.stroke()}
 if(id==='space'&&s.x!==undefined){let g=ctx.createRadialGradient(s.x,440,4,s.x,440,60);g.addColorStop(0,'#66fff52c');g.addColorStop(1,'#66fff500');ctx.fillStyle=g;ctx.fillRect(s.x-65,380,130,98);ctx.strokeStyle='#84ffff88';ctx.lineWidth=2;s.bullets?.forEach(b=>{ctx.beginPath();ctx.moveTo(b.x,b.y+14);ctx.lineTo(b.x,b.y+36);ctx.stroke()})}
 if(id==='meteor'){ctx.strokeStyle='#ffb67b55';ctx.lineWidth=1.8;s.rocks?.forEach(a=>{ctx.beginPath();ctx.moveTo(a.x,a.y-a.r);ctx.lineTo(a.x-2,a.y-a.r-24);ctx.stroke()})}
 if(id==='pong'&&s.ball){let b=s.ball;ctx.strokeStyle='#b8ffff5f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.055,b.y-b.vy*.055);ctx.stroke()}
 if(id==='breakout'&&s.ball){let b=s.ball;ctx.strokeStyle='#d6eaff70';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.035,b.y-b.vy*.035);ctx.stroke()}
 if(id==='racer'&&s.cars){for(let i=0;i<9;i++){let x=205+i*45+(i%2)*8,y=(t*350+i*68)%540-30;ctx.fillStyle='rgba(206,221,246,.13)';ctx.fillRect(x,y,1.4,21)}let x=250+s.lane*130;ctx.fillStyle='#ff767e55';ctx.fillRect(x-23,452,11,5);ctx.fillRect(x+12,452,11,5)}
 if(id==='flappy'&&s.x){ctx.fillStyle='#ffffff1b';for(let i=0;i<8;i++){let x=((i*172-t*13*(i%3+1))%920+920)%920-60,y=40+i*43;ctx.beginPath();ctx.ellipse(x,y,28,6,0,0,Math.PI*2);ctx.fill()} }
 if(id==='catch'&&s.items){s.items.filter(a=>!a.bomb).forEach(a=>{ctx.strokeStyle='#fff3b56c';ctx.beginPath();ctx.moveTo(a.x,a.y-7);ctx.lineTo(a.x,a.y-20);ctx.stroke()})}
 if(id==='runner'){let x=175,y=405-s.y;for(let i=0;i<4;i++){ctx.fillStyle=`rgba(255,206,160,${.25-i*.04})`;ctx.beginPath();ctx.arc(x-20-i*11,y+31+Math.sin(t*5+i)*4,3+i,0,Math.PI*2);ctx.fill()}}
 if(id==='orbit'&&s.x!==undefined){ctx.strokeStyle='#8ef0d855';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(s.x,s.y,26+Math.sin(t*5)*2,0,Math.PI*2);ctx.stroke()}
 if(id==='aim'&&s.target){let q=s.target;ctx.strokeStyle='#ffdfd988';ctx.lineWidth=2;ctx.beginPath();ctx.arc(q.x,q.y,q.r+4+Math.sin(t*6)*3,0,Math.PI*2);ctx.stroke()}
 if(id==='maze'&&s.grid){ctx.fillStyle=`rgba(196,245,222,${.045+Math.sin(t*2)*.02})`;ctx.fillRect(0,0,W,H)}
 // Spark particles from successful actions
 for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.88,dt*60);p.vy=p.vy*.985+20*dt;ctx.globalAlpha=Math.min(1,p.life/p.max)*.88;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
 // Darken edges very slightly for visual focus
 const vg=ctx.createLinearGradient(0,0,0,H);vg.addColorStop(0,'#0711253a');vg.addColorStop(.20,'#00000000');vg.addColorStop(.83,'#00000000');vg.addColorStop(1,'#07112534');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
 ctx.restore();}
 Object.entries(handlers).forEach(([id,h])=>{
 if(!h.canvas||typeof h.draw!=='function')return;
 const draw=h.draw.bind(h);
 h.draw=function(){draw();let dt=Math.min(.05,Math.max(.008,(performance.now()-(this._lastFX||performance.now()-16))/1000));this._lastFX=performance.now();post(id,dt)};
 });
})();
