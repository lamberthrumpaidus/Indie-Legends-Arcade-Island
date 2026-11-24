// Explicit offline pack with bounded worker concurrency and completeness verification.
export class Offline {
 constructor(){this.prompt=null;this.registration=null;this.onProgress=()=>{};this.onStatus=()=>{};window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();this.prompt=e;this.onStatus()});window.addEventListener('appinstalled',()=>{this.prompt=null;this.onStatus()})}
 async init(){if(!('serviceWorker'in navigator)||!isSecureContext)return null;try{await navigator.serviceWorker.register('./sw.js');this.registration=await navigator.serviceWorker.ready;this.onStatus();return await this.status()}catch(e){console.warn('Offline init',e);return null}}
 request(type,onProgress=()=>{}){return new Promise((resolve,reject)=>{const worker=this.registration?.active||navigator.serviceWorker.controller;if(!worker){reject(Error('Service worker belum siap'));return}const ch=new MessageChannel();let timeout;const finish=()=>{clearTimeout(timeout);ch.port1.close()};const restartTimer=()=>{clearTimeout(timeout);timeout=setTimeout(()=>{finish();reject(Error('Tidak ada respons. Coba lagi.'))},90000)};restartTimer();ch.port1.onmessage=e=>{const d=e.data;restartTimer();if(d.type==='progress'){onProgress(d);return}finish();if(d.type==='error')reject(Error(d.message));else resolve(d)};worker.postMessage({type},[ch.port2])})}
 async status(){return this.request('STATUS')}
 async download(){let persistent=false;try{persistent=await navigator.storage?.persist?.()||false}catch{}const r=await this.request('DOWNLOAD_ALL',this.onProgress);return {...r,persistent}}
 async install(){if(!this.prompt)return null;const p=this.prompt;this.prompt=null;await p.prompt();const result=await p.userChoice;this.onStatus();return result}
}
