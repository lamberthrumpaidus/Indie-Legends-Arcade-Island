export const QUALITY={low:{dpr:1,bloom:false,chroma:false,particles:400},medium:{dpr:1.35,bloom:true,chroma:false,particles:900},high:{dpr:1.75,bloom:true,chroma:true,particles:1600}};
export class AdaptiveQuality {
 constructor(tier='medium'){this.tier=tier;this.avg=16.7;this.frames=0;this.slow=0;this.fast=0;this.lastChange=0}
 get config(){return QUALITY[this.tier]}
 observe(dt,now){if(!dt||dt>.15)return false;this.avg=this.avg*.96+dt*1000*.04;this.frames++;if(this.frames<90)return false;this.slow=this.avg>22?this.slow+dt:0;this.fast=this.avg<13?this.fast+dt:0;if(now-this.lastChange<6000)return false;let next=this.tier;if(this.slow>3)next=this.tier==='high'?'medium':'low';else if(this.fast>15)next=this.tier==='low'?'medium':'high';if(next===this.tier)return false;this.tier=next;this.lastChange=now;this.fast=this.slow=0;return true}
}
