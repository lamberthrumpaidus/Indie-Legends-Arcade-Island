export class Input {
 constructor(root){this.keys=new Set();this.pointers=new Map();this.axis={x:0,y:0};this.fire=false;this.controller=new AbortController();const signal=this.controller.signal;
 const clear=()=>{this.keys.clear();this.pointers.clear();this.fire=false;this.axis={x:0,y:0};root.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'))};
 window.addEventListener('keydown',e=>{if(/^(Arrow|Key[WASD]|Space)/.test(e.code)){e.preventDefault();this.keys.add(e.code)}},{signal});window.addEventListener('keyup',e=>this.keys.delete(e.code),{signal});window.addEventListener('blur',clear,{signal});document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()},{signal});
 root.querySelectorAll('[data-control]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,b.dataset.control);b.classList.add('pressed')},{signal});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{this.pointers.delete(e.pointerId);if(![...this.pointers.values()].includes(b.dataset.control))b.classList.remove('pressed')},{signal})});
 }
 read(){const p=this.pointers,k=this.keys;const has=(...a)=>a.some(v=>k.has(v)||[...p.values()].includes(v));let x=+has('ArrowRight','KeyD','right')-+has('ArrowLeft','KeyA','left'),y=+has('ArrowDown','KeyS','down')-+has('ArrowUp','KeyW','up');let l=Math.hypot(x,y)||1;this.axis.x=x/l;this.axis.y=y/l;this.fire=has('Space','fire');return this}
 destroy(){this.controller.abort();this.pointers.clear();this.keys.clear()}
}
