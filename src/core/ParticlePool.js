// Bounded structure-of-arrays pool.
export class ParticlePool {
  constructor(capacity=1024){this.capacity=capacity;this.count=0;this.x=new Float32Array(capacity);this.y=new Float32Array(capacity);this.vx=new Float32Array(capacity);this.vy=new Float32Array(capacity);this.life=new Float32Array(capacity);this.maxLife=new Float32Array(capacity);this.size=new Float32Array(capacity);this.color=new Float32Array(capacity*3);this.fields=[this.x,this.y,this.vx,this.vy,this.life,this.maxLife,this.size]}
  burst(x,y,n=30,color=[.3,1,.7],power=1){for(let j=0;j<n&&this.count<this.capacity;j++){let i=this.count++,a=Math.random()*Math.PI*2,v=(25+Math.random()*180)*power;this.x[i]=x;this.y[i]=y;this.vx[i]=Math.cos(a)*v;this.vy[i]=Math.sin(a)*v;this.life[i]=this.maxLife[i]=.25+Math.random()*.55;this.size[i]=2+Math.random()*5;this.color.set(color,i*3)}}
  update(dt){for(let i=this.count-1;i>=0;i--){this.life[i]-=dt;if(this.life[i]<=0){const end=--this.count;for(const a of this.fields)a[i]=a[end];this.color.copyWithin(i*3,end*3,end*3+3);continue}this.x[i]+=this.vx[i]*dt;this.y[i]+=this.vy[i]*dt;this.vx[i]*=Math.exp(-dt*1.7);this.vy[i]+=dt*24}}
  clear(){this.count=0}
}
