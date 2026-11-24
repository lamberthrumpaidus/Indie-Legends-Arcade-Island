// All sounds and ambient music are original, locally synthesized AudioBuffers.
const Ctx=globalThis.AudioContext||globalThis.webkitAudioContext;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export class SensoryManager {
  constructor(){this.ctx=null;this.enabled=true;this.haptics=true;this.buffers=new Map();this.voices=new Set();this.maxVoices=24;this.music=null;this.duckUntil=0;this.last=new Map();try{this.enabled=localStorage.getItem('ila_sound')!=='off';this.haptics=localStorage.getItem('ila_haptic')!=='off'}catch{}}
  async unlock(){if(!Ctx||!this.enabled)return false;try{
    if(!this.ctx){const a=this.ctx=new Ctx({latencyHint:'interactive'});this.master=a.createGain();this.sfx=a.createGain();this.bgm=a.createGain();this.compressor=a.createDynamicsCompressor();this.master.gain.value=.68;this.sfx.gain.value=.8;this.bgm.gain.value=.24;this.sfx.connect(this.master);this.bgm.connect(this.master);this.master.connect(this.compressor);this.compressor.connect(a.destination);this.prepare();}
    if(this.ctx.state!=='running')await this.ctx.resume();return this.ctx.state==='running';
  }catch{return false}}
  prepare(){for(const name of ['bloop','collect','shoot','impact','explosion','win','step','spell'])this.buffer(name);}
  buffer(name){if(this.buffers.has(name))return this.buffers.get(name);const a=this.ctx,sr=a.sampleRate;
    const settings={bloop:[.10,350,740,.03],collect:[.27,520,1040,.015],shoot:[.17,940,105,.09],impact:[.19,145,48,.55],explosion:[.62,100,34,.72],win:[.85,392,784,.02],step:[.13,90,45,.48],spell:[.36,160,850,.09]};
    const [duration,f0,f1,noise]=settings[name]||settings.bloop;const b=a.createBuffer(1,Math.ceil(sr*duration),sr);const data=b.getChannelData(0);let phase=0,low=0;
    for(let i=0;i<data.length;i++){const t=i/sr,u=t/duration;let freq=f0*Math.pow(f1/f0,u);if(name==='win')freq=[392,494,587,784][Math.min(3,Math.floor(u*4))];phase+=2*Math.PI*freq/sr;low=low*.78+(Math.random()*2-1)*.22;const env=Math.min(1,t/.008)*Math.pow(1-u,2.2);data[i]=env*(Math.sin(phase)*.50+Math.sin(phase*2.01)*.12+low*noise)*.7;}
    this.buffers.set(name,b);return b;
  }
  play(name,{important=false,rate=1,gain=1,minGap=40}={}){if(!this.enabled||!this.ctx||this.ctx.state!=='running'||document.hidden)return false;const a=this.ctx,t=a.currentTime;if(t-(this.last.get(name)??-Infinity)<minGap/1000)return false;this.last.set(name,t);if(this.voices.size>=this.maxVoices)return false;
    const source=a.createBufferSource(),level=a.createGain();source.buffer=this.buffer(name);source.playbackRate.value=clamp(rate,.5,2);level.gain.value=clamp(gain,0,1.25);source.connect(level);level.connect(this.sfx);this.voices.add(source);source.onended=()=>{this.voices.delete(source);source.disconnect();level.disconnect()};source.start();if(important)this.duck(source.buffer.duration/source.playbackRate.value+.12);return true;
  }
  duck(seconds=.35){if(!this.ctx)return;const t=this.ctx.currentTime,g=this.bgm.gain;this.duckUntil=Math.max(this.duckUntil,t+seconds);if(g.cancelAndHoldAtTime)g.cancelAndHoldAtTime(t);else{g.cancelScheduledValues(t);g.setValueAtTime(g.value,t)}g.linearRampToValueAtTime(.065,t+.045);g.setValueAtTime(.065,this.duckUntil);g.linearRampToValueAtTime(.24,this.duckUntil+.32)}
  startMusic(){if(!this.ctx||!this.enabled||this.ctx.state!=='running'||this.music)return;const a=this.ctx,sr=a.sampleRate,seconds=8;let b=this.buffers.get('ambient-loop');if(!b){b=a.createBuffer(1,sr*seconds,sr);let d=b.getChannelData(0);for(let i=0;i<d.length;i++){let t=i/sr;let fade=Math.min(1,t/.3,(seconds-t)/.3),wave=0;for(const f of [110,164.875,220,329.625])wave+=Math.sin(2*Math.PI*f*t)*.13*(.65+.35*Math.sin(t*Math.PI*.5+f));d[i]=wave*fade*.5}this.buffers.set('ambient-loop',b)}const s=a.createBufferSource();s.buffer=b;s.loop=true;s.connect(this.bgm);s.start();this.music=s;}
  stopMusic(){if(this.music){try{this.music.stop()}catch{}this.music.disconnect();this.music=null}}
  vibrate(pattern=12){if(this.haptics&&!document.hidden&&typeof navigator.vibrate==='function'){try{return navigator.vibrate(pattern)}catch{}}return false}
  setEnabled(on){this.enabled=!!on;try{localStorage.setItem('ila_sound',on?'on':'off')}catch{}if(this.ctx)this.master.gain.setTargetAtTime(on?.68:0,this.ctx.currentTime,.015);if(!on){this.stopMusic();for(const v of this.voices)try{v.stop()}catch{}}return this.enabled}
  suspend(){this.stopMusic();if(this.ctx?.state==='running')this.ctx.suspend().catch(()=>{});try{navigator.vibrate?.(0)}catch{}}
}
