/* Create by LamberthRumpaidus — scaling, responsive controls and presentation. */
(()=>{
 'use strict';
 const originalInit=initCanvas;
 initCanvas=function(){
   originalInit();
   // Draw a high-resolution canvas internally while retaining the original
   // fixed game coordinate system for physics, hit testing and touch controls.
   const mobile=matchMedia('(max-width:700px)').matches || matchMedia('(pointer:coarse)').matches;
   const deviceMemory=navigator.deviceMemory||4;
   const factor=mobile?1:Math.min(deviceMemory<=2?1.4:1.85,Math.max(1.2,Math.min(innerWidth/760,innerHeight/480)*1.3));
   canvas.width=Math.round(W*factor);
   canvas.height=Math.round(H*factor);
   ctx=canvas.getContext('2d',{alpha:false,desynchronized:false});
   ctx.setTransform(factor,0,0,factor,0,0);
 };
 const oldStart=startSession;
 startSession=function(id){
   $('stage').dataset.game=id;
   $('overlay').dataset.game=id;
   $('controls').classList.remove('has-controls');
   oldStart(id);
 };
 const oldClose=closeGame;
 closeGame=function(){oldClose();$('overlay').removeAttribute('data-game');$('stage').removeAttribute('data-game')};
 // Temporary keyboard help is available in the main page only, never as HUD.
 // Prevent dragged touch input from scrolling gameplay screens.
 document.querySelector('#playfield').addEventListener('touchmove',e=>{
   if(e.target.closest('canvas,.ctrlbtn'))e.preventDefault();
 },{passive:false});
})();
