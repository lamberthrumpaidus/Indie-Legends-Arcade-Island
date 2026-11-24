/* Create by LamberthRumpaidus. */

'use strict';
const $=id=>document.getElementById(id), W=760,H=480,rand=(a,b)=>Math.random()*(b-a)+a, ri=n=>Math.floor(Math.random()*n),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const catalog=[
['shinrin','SHINRIN — Spirit Forest','3D Petualangan','⛩️','Petualangan 3D: gerbang torii, air, cahaya, dan tujuh roh.','#16473d','WASD / joystick, drag kamera, lompat, dash'],
['snake','Snake Neon','Arcade','🐍','Kumpulkan energi, jangan menabrak tubuh.','#175b61','Panah / WASD • geser layar'],
['meteor','Meteor Escape','Aksi','☄️','Hindari hujan meteor selama mungkin.','#45316b','Panah / A D • seret kapal'],
['space','Space Defender','Aksi','🚀','Tembak musuh di galaksi.','#173f75','Panah / A D dan Spasi • sentuh untuk menembak'],
['flappy','Sky Hopper','Arcade','🐤','Terbang melewati celah pipa.','#3173aa','Spasi / ketuk untuk terbang'],
['breakout','Block Breaker','Arcade','🧱','Pecahkan semua balok dengan bola.','#755326','Panah / A D • geser paddle'],
['pong','Neon Pong','Olahraga','🏓','Kalahkan paddle komputer.','#2f517c','Panah atas/bawah / W S • seret paddle'],
['racer','Lane Racer','Balap','🏎️','Lewati jalan raya tanpa tabrakan.','#66352d','Panah kiri/kanan • sentuh lajur'],
['catch','Star Catcher','Arcade','⭐','Tangkap bintang, hindari bom.','#574483','Panah kiri/kanan • geser keranjang'],
['orbit','Asteroid Field','Aksi','🛸','Hancurkan asteroid sebelum menabrak.','#3c365e','Panah + Spasi • sentuh untuk menembak'],
['runner','Pixel Runner','Aksi','🏃','Lompat melewati rintangan.','#6a402c','Spasi / panah atas / ketuk'],
['aim','Target Rush','Aksi','🎯','Bidik sebanyak mungkin dalam 30 detik.','#744b61','Klik / ketuk target'],
['maze','Maze Explorer','Puzzle','🧭','Cari jalan keluar dari labirin.','#325766','Panah / WASD • tombol arah'],
['2048','Merge 2048','Puzzle','🔢','Gabungkan angka sampai 2048.','#645231','Panah / WASD • geser arah'],
['tictactoe','Tic Tac Toe','Strategi','❎','Lawan bot yang berusaha menang.','#274e6d','Ketuk kotak untuk memasang X'],
['memory','Memory Match','Puzzle','🃏','Temukan 8 pasang kartu yang sama.','#653d72','Ketuk dua kartu untuk mencocokkan'],
['mines','Minesweeper','Strategi','💣','Buka kotak aman, tandai ranjau.','#484c64','Ketuk buka • mode bendera untuk tanda'],
['slide','Sliding 15','Puzzle','🧩','Urutkan angka 1 sampai 15.','#345c55','Ketuk ubin di sebelah ruang kosong'],
['math','Math Sprint','Edukasi','🧠','Jawab 10 soal matematika secepatnya.','#766038','Pilih jawaban yang tepat'],
['simon','Color Echo','Memori','🌈','Ulangi urutan warna yang semakin panjang.','#37526e','Dengarkan / lihat lalu ketuk warna'],
['words','Susun Kata','Edukasi','🔤','Susun huruf menjadi kata bahasa Indonesia.','#6a3960','Ketik jawaban lalu kirim'],
['reaction','Reaction Test','Arcade','⚡','Ukur kecepatan reaksimu.','#57613b','Tunggu hijau, lalu ketuk'],
['rps','Suit Arena','Strategi','✊','Batu, gunting, kertas lawan komputer.','#4e4670','Pilih tangan untuk bertanding']
];
$('totalStat').textContent=catalog.length;
let category='Semua',query='',active=null,session=0,frameId=0,lastTime=0,keys={},timers=[],gameState={},ctx=null,canvas=null,down=false,score=0,finished=false;
const allcats=['Semua',...new Set(catalog.map(g=>g[2]))];
function renderFilters(){ $('filters').innerHTML=allcats.map(c=>`<button class="filter ${category===c?'active':''}" data-cat="${c}">${c}</button>`).join('');$('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{category=b.dataset.cat;renderFilters();renderCards()})}
function renderCards(){let list=catalog.filter(g=>(category==='Semua'||g[2]===category)&&g[1].toLowerCase().includes(query));$('count').textContent=`${list.length} game tersedia`;$('cards').innerHTML=list.length?list.map(g=>`<button class="gamecard ${g[0]==='shinrin'?'featured':''}" data-id="${g[0]}" aria-label="Mainkan ${g[1]}"><div class="cover" style="background:linear-gradient(130deg,${g[5]},#101728)"><span class="tag">${g[2]}</span><span class="emoji">${g[3]}</span></div><div class="cardbody"><div class="cardline"><h3>${g[1]}</h3><span class="arrow">↗</span></div><p>${g[4]}</p></div></button>`).join(''):'<p class="muted">Tidak ada game yang cocok dengan pencarian.</p>';$('cards').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openGame(b.dataset.id))}
$('search').oninput=e=>{query=e.target.value.toLowerCase().trim();renderCards()};renderFilters();renderCards();
function schedule(fn,ms){const id=setTimeout(()=>{timers=timers.filter(t=>t!==id);if(active)fn()},ms);timers.push(id);return id}
function resetTimers(){timers.forEach(clearTimeout);timers=[]}
function setScore(n){const was=score;score=n;$('score').textContent='Skor '+score;if(n>was){$('score').classList.remove('score-hit');void $('score').offsetWidth;$('score').classList.add('score-hit')}}
function addScore(n=1){setScore(score+n)}
function endGame(win=false,msg=''){if(finished)return;finished=true;keys={};const name=active&&active[0];if(name){try{let best=Number(localStorage.getItem('lamarcade_'+name)||0);if(score>best)localStorage.setItem('lamarcade_'+name,String(score))}catch(e){}}$('resultTitle').textContent=win?'Hebat!':'Game selesai';$('resultText').textContent=(msg||'Permainan berakhir.')+` Skor: ${score}.`;$('result').classList.add('show')}
function restartGame(){if(active)startSession(active[0])}
function openGame(id){if(id==='shinrin'){openFlagship();return}const g=catalog.find(x=>x[0]===id);if(!g)return;active=g;$('overlay').classList.add('show');document.body.style.overflow='hidden';startSession(id)}
function closeGame(){session++;resetTimers();cancelAnimationFrame(frameId);active=null;finished=false;keys={};down=false;$('overlay').classList.remove('show');document.body.style.overflow='';$('stage').innerHTML='';$('result').classList.remove('show')}
$('close').onclick=closeGame;$('restart').onclick=restartGame;$('again').onclick=restartGame;
window.addEventListener('keydown',e=>{if(!active)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;const handler=handlers[active[0]];if(handler&&handler.key&&!e.repeat&&!finished)handler.key(e.key.toLowerCase());});window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});window.addEventListener('blur',()=>{keys={};down=false});window.addEventListener('pagehide',()=>{keys={};down=false});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)closeGame()});
function held(...names){return names.some(n=>keys[n])}
function initCanvas(){canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.setAttribute('aria-label','Bidang permainan');$('stage').append(canvas);$('stage').style.cssText='width:100%;display:block';ctx=canvas.getContext('2d');canvas.addEventListener('pointerdown',pointerEvent);canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('pointermove',pointerEvent);canvas.addEventListener('pointerup',()=>{down=false});canvas.addEventListener('pointercancel',()=>{down=false});}
function pointerEvent(e){if(!active||finished)return;if(e.pointerType==='touch')e.preventDefault();if(e.type==='pointerdown'){down=true;try{canvas.setPointerCapture(e.pointerId)}catch(err){}}let r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;const h=handlers[active[0]];if(h&&h.pointer)h.pointer(x,y,e.type);}
function setControls(type){
 const name=active?.[0];
 const map={snake:['up','left','down','right'],maze:['up','left','down','right'],'2048':['up','left','down','right'],
 orbit:['up','left','right','fire'],space:['left','right','fire'],
 pong:['up','down'],meteor:['left','right'],racer:['left','right'],breakout:['left','right'],catch:['left','right'],
 flappy:['jump'],runner:['jump']};
 const allowed=map[name]||[];
 const arrows={up:'↑',down:'↓',left:'←',right:'→'};
 const keyboard={up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',fire:' ',jump:' '};
 let direction=allowed.filter(k=>k in arrows);
 let html=direction.length?`<div class="dpad ${direction.length===2?'two-way':''}">${direction.map(k=>`<button type="button" class="ctrlbtn ${k}" data-k="${keyboard[k]}" aria-label="${k}">${arrows[k]}</button>`).join('')}</div>`:'';
 html+=allowed.includes('fire')?'<button type="button" class="ctrlbtn actionbtn" data-k=" " aria-label="Tembak">●</button>':'';
 html+=allowed.includes('jump')?'<button type="button" class="ctrlbtn actionbtn" data-k=" " aria-label="Lompat">↑</button>':'';
 $('controls').innerHTML=html;
 const root=$('controls');root.classList.toggle('has-controls',!!allowed.length);
 root.querySelectorAll('.ctrlbtn').forEach(b=>{
   const k=b.dataset.k;let id=null;
   const release=e=>{if(id!==null&&e&&e.pointerId!==id)return;id=null;keys[k]=false;b.classList.remove('pressed')};
   b.addEventListener('pointerdown',e=>{
     if(!active||finished)return;e.preventDefault();id=e.pointerId;
     try{b.setPointerCapture(id)}catch(_){}
     keys[k]=true;b.classList.add('pressed');
     const h=handlers[active[0]];
     if(h?.key)h.key(k);
     if(k===' '&&active[0]==='space')handlers.space.fire();
   });
   for(const ev of ['pointerup','pointercancel','lostpointercapture']) b.addEventListener(ev,release);
 });
}
function startSession(id){session++;resetTimers();cancelAnimationFrame(frameId);finished=false;keys={};score=0;setScore(0);$('result').classList.remove('show');$('stage').replaceChildren();$('stage').style.cssText='';const g=catalog.find(x=>x[0]===id);active=g;gameState={};$('modalTitle').textContent=g[1];$('instructions').textContent='';$('hint').textContent='';$('controls').innerHTML='';let h=handlers[id];if(!h){$('stage').textContent='Game belum tersedia';return}if(h.canvas){initCanvas();setControls(h.controls||'horizontal')}h.init();if(h.canvas){const thisSession=session;lastTime=performance.now();const loop=now=>{if(thisSession!==session||!active)return;const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;if(!finished)h.update?.(dt);h.draw?.();frameId=requestAnimationFrame(loop)};frameId=requestAnimationFrame(loop)}}
const handlers={};
function bg(c1='#0a122b',c2='#192746'){let grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,c1);grad.addColorStop(1,c2);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H)}
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();if(r)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fill()}
function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function textAt(t,x,y,size=22,color='#f8fafc',align='center'){ctx.fillStyle=color;ctx.textAlign=align;ctx.font=`800 ${size}px system-ui`;ctx.fillText(String(t),x,y)}
function glowStars(n=60){for(let i=0;i<n;i++){circle((i*83+119)%W,(i*137+63)%H,i%3===0?1.7:1,'#b9d6ff70')}}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function collides(x,y,r,a){return x+r>a.x&&x-r<a.x+a.w&&y+r>a.y&&y-r<a.y+a.h}
function addDom(root){$('stage').style.cssText='width:100%';const d=document.createElement('div');d.className='domstage';$('stage').append(d);d.innerHTML=root;return d}
function domFinish(win,msg){endGame(win,msg)}
