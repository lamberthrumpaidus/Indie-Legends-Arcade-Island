/* 77 original independent browser mini games share drawing, input and audio utilities. */
const IL=(()=>{'use strict';
const TAU=Math.PI*2, touch=('ontouchstart'in window)||navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches;
const hues=['#53d5c1','#f1bf70','#a9a0ff','#6bb7ff','#f281ae','#a5db86'];
const dot=(x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU);ctx.fill()};
const rounded=(x,y,w,h,c,r=9)=>{ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()};
const line=(x,y,X,Y,c='#ffffff',lw=3)=>{ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke()};
const label=(str,x,y,size=20,c='#f4faff',align='center')=>{ctx.textAlign=align;ctx.font=`700 ${size}px system-ui`;ctx.fillStyle=c;ctx.fillText(String(str),x,y)};
const poly=(pts,c)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=c;ctx.fill()};
const win=(msg='Tantangan selesai!')=>endGame(true,msg),lose=(msg='Coba sekali lagi!')=>endGame(false,msg);
const rr=(a,b)=>Math.random()*(b-a)+a, rint=n=>Math.floor(Math.random()*n);
const dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
const within=(x,y,X,Y,w,h)=>x>=X&&y>=Y&&x<=X+w&&y<=Y+h;
const burst=(s,x,y,color='#6ee7db',n=12)=>{for(let i=0;i<n;i++){const p=rr(0,TAU),v=rr(40,190);s.fx.push({x,y,vx:Math.cos(p)*v,vy:Math.sin(p)*v,life:1,c:color})}};
const collide=(a,b,r=0)=>Math.hypot(a.x-b.x,a.y-b.y)<(a.r||0)+(b.r||0)+r;
const glimmer=(x,y,r,color)=>{ctx.save();ctx.shadowBlur=18;ctx.shadowColor=color;dot(x,y,r,color);ctx.restore()};
const capsule=(x,y,w,h,color)=>{rounded(x,y,w,h,color,h/2);};
const background=(color,t)=>{let g=ctx.createLinearGradient(0,0,760,480);g.addColorStop(0,'#081222');g.addColorStop(.55,color||'#15374c');g.addColorStop(1,'#080d21');ctx.fillStyle=g;ctx.fillRect(0,0,760,480);for(let i=0;i<70;i++){let x=(i*131+Math.sin(t*.22+i)*33)%760,y=(i*87+Math.cos(t*.3+i)*25)%480;dot(x,y,i%8===0?1.8:.65,'#ffffff28')}ctx.fillStyle='#ffffff06';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse((i*190+44+t*3)%1000-90,100+i*70,55+i*7,19,0,0,TAU);ctx.fill()}};
const ctrlpos={left:[72,363],right:[168,363],up:[120,279],down:[120,365],action:[675,363],alt:[578,363]};
function controls(s,items){if(!touch)return;for(let k of items){const [x,y]=ctrlpos[k];ctx.globalAlpha=s.virtual[k]?.9:.34;ctx.strokeStyle='#b9fbff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,k==='action'?44:43,0,TAU);ctx.stroke();label(({left:'◀',right:'▶',up:'▲',down:'▼',action:'●',alt:'◆'})[k],x,y+8,k==='action'?23:19,'#f0ffff');ctx.globalAlpha=1}}
const hud=(s)=>{if(!s.timeLimit)return;ctx.save();rounded(338,10,84,34,'#031421bb',12);label(Math.max(0,s.timeLimit-s.t).toFixed(0)+'s',380,33,16,'#dcf8f5');ctx.restore()};
function register(d){const meta=[d.id,d.name,d.category||'Arcade',d.icon||'✦',d.desc||'Tantangan baru.',d.color||'#254a5e','Sentuh layar atau gunakan keyboard'];catalog.push(meta);
 let s={},v={},heldFinger=false;const api={dot,rounded,line,label,poly,win,lose,rr,rint,dist,within,burst,collide,glimmer,capsule,
  get input(){return v},get time(){return s.t}, get touch(){return touch},
  get moveX(){return (held('arrowright','d')||v.right?1:0)-(held('arrowleft','a')||v.left?1:0)},
  get moveY(){return (held('arrowdown','s')||v.down?1:0)-(held('arrowup','w')||v.up?1:0)},
  get action(){return !!(held(' ','enter')||v.action)},
  get alt(){return !!(held('shift')||v.alt)},score(n=1){addScore(n)},click(){ILAudio?.play('tap')},fire(){ILAudio?.play('fire')},jump(){ILAudio?.play('jump')}};
 const makeControls=()=>controls(s,d.controls||[]);
 handlers[d.id]={canvas:true,init(){s={t:0,fx:[],timeLimit:d.duration||0,...(d.init?.(api)||{})};v={};s.virtual=v;canvas.addEventListener('pointerup',()=>{v={};s.virtual=v;heldFinger=false});canvas.addEventListener('pointercancel',()=>{v={};s.virtual=v;heldFinger=false});canvas.addEventListener('lostpointercapture',()=>{v={};s.virtual=v;heldFinger=false});if(d.ready)d.ready(s,api);},
  update(dt){s.t+=dt;for(let p of s.fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt;p.life-=dt*1.6}s.fx=s.fx.filter(p=>p.life>0);if(d.update)d.update(s,dt,api);if(!finished&&d.duration&&s.t>=d.duration){if(d.timeout)d.timeout(s,api);else lose('Waktu berakhir')}},
  draw(){background(d.color,s.t);ctx.save();if(d.draw)d.draw(s,api);ctx.restore();for(let p of s.fx){ctx.globalAlpha=p.life;dot(p.x,p.y,4*p.life,p.c)}ctx.globalAlpha=1;makeControls();hud(s)},
  pointer(x,y,type){if(type==='pointerdown'){heldFinger=true;let btn=null;if(touch)for(let k of d.controls||[]){const p=ctrlpos[k];if(p&&dist(x,y,p[0],p[1])<41){btn=k;break}}if(btn){v[btn]=true;api.click();d.button?.(s,btn,api);return}}if(type==='pointermove'&&heldFinger){if(touch&&Object.values(v).some(Boolean))return;}if(d.pointer)d.pointer(s,x,y,type,api)},
  key(k){if(d.key)d.key(s,k,api)}};return d}
function finishDisplay(){if(!catalog||!window.renderCards)return;renderFilters();renderCards();$('totalStat').textContent=catalog.length;}
return{register,finishDisplay,TAU,touch,rr,rint,dist,within,colors:hues};})();