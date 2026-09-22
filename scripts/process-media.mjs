import {mkdir,access} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const args=Object.fromEntries(process.argv.slice(2).map(a=>a.replace(/^--/,'').split('=')));
const key=args.key||'0x00d000', similarity=Number(args.similarity||0.22),blend=Number(args.blend||0.08);
if(!/^0x[0-9a-f]{6}$/i.test(key)||!(similarity>0&&similarity<=1)||!(blend>=0&&blend<=1))throw new Error('Invalid chromakey parameters');
function run(a){const p=spawnSync('ffmpeg',a,{stdio:'inherit'});if(p.error)throw p.error;if(p.status!==0)throw new Error(`FFmpeg failed: ${p.status}`);}
await mkdir(path.join(root,'public/videos'),{recursive:true});await mkdir(path.join(root,'public/posters'),{recursive:true});
let count=0;
for(let i=1;i<=7;i++){
 const n=String(i).padStart(2,'0'),src=path.join(root,`inputs/videos/${n}.mp4`);
 try{await access(src)}catch{continue}
 const dst=path.join(root,`public/videos/doctor-idle-${n}.webm`),poster=path.join(root,`public/posters/poster-${n}.webp`);
 run(['-v','error','-y','-i',src,'-vf',`fps=30,scale=1280:720:force_original_aspect_ratio=decrease,chromakey=${key}:${similarity}:${blend},despill=green:mix=0.7,format=yuva420p,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=black@0`,'-an','-c:v','libvpx-vp9','-b:v','0','-crf','32','-auto-alt-ref','0',dst]);
 run(['-v','error','-y','-c:v','libvpx-vp9','-i',dst,'-frames:v','1','-c:v','libwebp','-lossless','1',poster]);
 count++;console.log(`Prepared ${n}: video + poster. Check hair, clothing edges and loop seam.`);
}
console.log(`${count} video(s) processed. Originals preserved.`);
