/* Indie Legends Arcade Island — original procedural sound effects. */
(()=>{'use strict';
 let ac=null,enabled=true;try{enabled=localStorage.getItem('ila_sound')!=='off'}catch(e){}
 const sound={get enabled(){return enabled}, toggle(){enabled=!enabled;try{localStorage.setItem('ila_sound',enabled?'on':'off')}catch(e){};button.textContent=enabled?'♫':'♪';button.setAttribute('aria-label',enabled?'Matikan suara':'Aktifkan suara');if(enabled)this.play('start');},
  play(type='tap'){if(!enabled)return;try{if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume().catch(()=>{});let now=ac.currentTime;const patterns={tap:[[460,590,.055,'sine',.027]],point:[[620,940,.12,'sine',.055],[930,1220,.13,'triangle',.028]],success:[[523,784,.17,'sine',.06],[659,988,.20,'sine',.05],[784,1176,.3,'triangle',.055]],fail:[[270,160,.2,'sawtooth',.027],[210,90,.3,'triangle',.025]],start:[[280,420,.08,'sine',.042],[500,720,.15,'sine',.04]],jump:[[330,700,.15,'triangle',.04]],fire:[[760,210,.08,'square',.014]],tick:[[750,850,.055,'triangle',.02]]};
  for(const [i,p] of (patterns[type]||patterns.tap).entries()){const [f0,f1,d,w,v]=p;const o=ac.createOscillator(),g=ac.createGain();o.type=w;o.frequency.setValueAtTime(f0,now+i*.045);o.frequency.exponentialRampToValueAtTime(Math.max(40,f1),now+i*.045+d);g.gain.setValueAtTime(.0001,now+i*.045);g.gain.exponentialRampToValueAtTime(v,now+i*.045+.012);g.gain.exponentialRampToValueAtTime(.0001,now+i*.045+d);o.connect(g);g.connect(ac.destination);o.start(now+i*.045);o.stop(now+i*.045+d+.02)}}catch(e){}}
 };
 const button=document.createElement('button');button.type='button';button.className='soundToggle';button.textContent=enabled?'♫':'♪';button.title='Suara game';button.setAttribute('aria-label',enabled?'Matikan suara':'Aktifkan suara');button.onclick=()=>sound.toggle();document.querySelector('.headerRight')?.prepend(button);
 window.ILAudio=sound;
 const oldAdd=addScore;addScore=function(n=1){oldAdd(n);sound.play('point')};
 const oldEnd=endGame;endGame=function(win=false,msg=''){if(!finished)sound.play(win?'success':'fail');return oldEnd(win,msg)};
 document.querySelector('#cards')?.addEventListener('click',e=>{if(e.target.closest('.gamecard'))sound.play('start')});
 document.querySelector('#controls')?.addEventListener('pointerdown',e=>{if(e.target.closest('button'))sound.play('tap')},{passive:true});
 const btns=['#restart','#again','#close'];for(const selector of btns)document.querySelector(selector)?.addEventListener('click',()=>sound.play('tap'));
})();