/* Create by LamberthRumpaidus — pinned first-party game distribution. */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const lock=JSON.parse(await fs.readFile(path.join(root,'featured-games.lock.json'),'utf8'));
function git(cwd,args){return execFileSync('git',args,{cwd,encoding:'utf8',timeout:180000,maxBuffer:8*1024*1024,env:{...process.env,GIT_TERMINAL_PROMPT:'0'}}).trim()}
function safe(rel){if(!rel||rel.includes('\\')||rel.startsWith('/')||rel.split('/').some(x=>x==='..'||x==='.'||!x))throw Error('Unsafe path: '+rel);return rel}
function gitHash(data){return crypto.createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex')}
async function verifyFile(dir,file){const target=path.join(dir,safe(file.path));const stat=await fs.lstat(target);if(!stat.isFile()||stat.isSymbolicLink())throw Error('Invalid source file: '+file.path);const data=await fs.readFile(target);if(data.length!==file.bytes||gitHash(data)!==file.sha)throw Error('Source integrity mismatch: '+file.path);return data}
export async function syncFeatured(){
 const output=path.join(root,'featured');
 const staging=await fs.mkdtemp(path.join(root,'.featured-stage-'));
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'ila-games-'));
 try{
  for(const game of lock.games){
   const id=safe(game.id),src=path.join(temp,id),dest=path.join(staging,id);await fs.mkdir(src,{recursive:true});await fs.mkdir(dest,{recursive:true});
   if(!/^[\w-]+$/.test(game.repo)||! /^[0-9a-f]{40}$/.test(game.commit)||! /^[\w-]+$/.test(lock.owner))throw Error('Invalid source lock');
   const existing=path.join(output,id);let useLocal=true;
   try{for(const file of game.files)await verifyFile(existing,file)}catch{useLocal=false}
   if(!useLocal){
    git(src,['init','-q']);git(src,['remote','add','origin','https://github.com/'+lock.owner+'/'+game.repo+'.git']);
    git(src,['-c','protocol.version=2','fetch','--quiet','--depth=1','--no-tags','origin',game.commit]);
    if(git(src,['rev-parse','FETCH_HEAD'])!==game.commit)throw Error('Wrong game revision: '+id);
    git(src,['-c','core.autocrlf=false','-c','core.hooksPath=/dev/null','checkout','--quiet','--detach','FETCH_HEAD']);
   }
   for(const file of game.files){const data=await verifyFile(useLocal?existing:src,file);const to=path.join(dest,safe(file.path));await fs.mkdir(path.dirname(to),{recursive:true});await fs.writeFile(to,data)}
   await fs.access(path.join(dest,'index.html'));await fs.access(path.join(dest,safe(game.cover)));console.log('Featured '+game.title+': '+game.files.length+' verified files, '+game.bytes+' bytes @ '+game.commit.slice(0,8));
  }
  const backup=output+'.previous';await fs.rm(backup,{recursive:true,force:true});
  let had=false;try{await fs.rename(output,backup);had=true}catch(e){if(e.code!=='ENOENT')throw e}
  try{await fs.rename(staging,output)}catch(e){if(had)await fs.rename(backup,output);throw e}
  await fs.rm(backup,{recursive:true,force:true});
 }finally{await fs.rm(temp,{recursive:true,force:true});await fs.rm(staging,{recursive:true,force:true})}
}
