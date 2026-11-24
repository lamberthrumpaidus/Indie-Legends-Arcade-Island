/* Create by LamberthRumpaidus. */
/* Minimal device-specific interaction layer. Touch screen has no decorative instructions. */
(()=>{
 let start=null;
 window.addEventListener('keydown',e=>{if(!active)return;
  // horizontal paddle games also work with WASD and arrows on laptop
  if(e.code==='Escape'){e.preventDefault()}
 });
 // Swipe on the puzzle board remains supported by its original handler. Prevent scroll only during canvas play.
 document.addEventListener('visibilitychange',()=>{if(document.hidden){keys={};down=false}});
 document.querySelector('#overlay').addEventListener('touchmove',e=>{if(e.target.closest('canvas,.ctrlbtn'))e.preventDefault()},{passive:false});
 // Standalone SHINRIN iframe locks the background while active, cleanup when returning.
 window.addEventListener('pagehide',()=>{keys={};down=false});
})();
