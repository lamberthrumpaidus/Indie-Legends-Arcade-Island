// Shared fixed-step simulation, interpolation, hit stop and trauma shake.
export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const damp=(a,b,rate,dt)=>lerp(a,b,1-Math.exp(-rate*dt));
export class GameFeel {
  constructor({hz=60,maxSteps=5,reducedMotion=false}={}){
    this.step=1/hz;this.maxSteps=maxSteps;this.acc=0;this.freeze=0;this.trauma=0;this.clock=0;this.reducedMotion=reducedMotion;
    this.offset={x:0,y:0};this.last=null;
  }
  impact(strength=.55,ms=55){this.trauma=clamp(this.trauma+strength,0,1);this.freeze=Math.max(this.freeze,clamp(ms,0,180)/1000)}
  resetClock(){this.last=null;this.acc=0}
  frame(time,simulate,render){
    const dt=this.last===null?0:clamp((time-this.last)/1000,0,.1);this.last=time;this.clock+=dt;
    const stopped=Math.min(this.freeze,dt);this.freeze=Math.max(0,this.freeze-dt);this.acc+=dt-stopped;
    let steps=0;while(this.acc>=this.step&&steps<this.maxSteps){simulate(this.step);this.acc-=this.step;steps++;if(this.freeze>0){this.acc=Math.min(this.acc,this.step);break}}
    if(steps===this.maxSteps)this.acc=Math.min(this.acc,this.step);
    this.trauma=Math.max(0,this.trauma-dt*1.85);
    const a=this.reducedMotion?0:this.trauma*this.trauma;
    this.offset.x=(Math.sin(this.clock*83.1)+Math.sin(this.clock*31.7)*.35)*a*12;
    this.offset.y=(Math.cos(this.clock*77.3)+Math.sin(this.clock*49.4)*.32)*a*12;
    render({dt,alpha:clamp(this.acc/this.step,0,1),shake:this.offset,freeze:this.freeze});
  }
  static velocity(current,target,dt,rate=18){return damp(current,target,rate,dt)}
}
