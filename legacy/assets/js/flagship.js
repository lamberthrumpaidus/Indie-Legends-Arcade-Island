/* Create by LamberthRumpaidus. */
const _flagshipEncoded='';
let _flagshipElement=null;
function openFlagship(){
 if(_flagshipElement)return;
 const holder=document.createElement('div');holder.id='flagshipLayer';holder.setAttribute('role','dialog');holder.setAttribute('aria-label','SHINRIN petualangan 3D');holder.setAttribute('aria-modal','true');
 const iframe=document.createElement('iframe');iframe.title='SHINRIN — Spirit Forest';iframe.setAttribute('allow','autoplay; fullscreen');
 iframe.src='games/shinrin.html';
 const close=document.createElement('button');close.id='flagshipClose';close.setAttribute('aria-label','Tutup game 3D');close.textContent='×';close.onclick=closeFlagship;
 holder.append(iframe,close);document.body.append(holder);document.body.style.overflow='hidden';_flagshipElement=holder;close.focus();
}
function closeFlagship(){if(!_flagshipElement)return;_flagshipElement.remove();_flagshipElement=null;document.body.style.overflow='';}
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&_flagshipElement){closeFlagship();e.stopImmediatePropagation();}},true);
const _originalEndGame=endGame;
endGame=function(win=false,msg=''){_originalEndGame(win,msg);if(win){let root=$('result');for(let i=0;i<30;i++){const part=document.createElement('i');part.className='confetti';part.style.background=['#f6dca0','#9ce9de','#c9adf9','#f8b6ad'][i%4];part.style.setProperty('--cx',(Math.random()*750-375)+'px');part.style.setProperty('--cy',(Math.random()*430-260)+'px');part.style.setProperty('--cr',(Math.random()*1080-540)+'deg');root.append(part);setTimeout(()=>part.remove(),1800);}}};
