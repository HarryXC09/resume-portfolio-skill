import {mkdir,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const rules={resume:/\.(pdf|docx|txt|md)$/i,videos:/\.mp4$/i,photos:/\.(png|jpe?g|webp)$/i,logos:/\.(png|svg|jpe?g|webp)$/i,models:/\.glb$/i};
const inventory={};
for(const [kind,ext] of Object.entries(rules)){
 const folder=path.join(root,'inputs',kind); await mkdir(folder,{recursive:true});
 inventory[kind]=(await readdir(folder,{withFileTypes:true})).filter(e=>e.isFile()&&ext.test(e.name)).map(e=>e.name);
 console.log(`${kind}: ${inventory[kind].length} file(s) — ${folder}`);
}
if(!inventory.resume.length)console.log('缺少主要简历：请放入 inputs/resume/。');
if(inventory.resume.length>1)console.log('多个简历版本：请确认使用哪一个。');
const missing=Array.from({length:7},(_,i)=>`${String(i+1).padStart(2,'0')}.mp4`).filter(n=>!inventory.videos.includes(n));
if(missing.length)console.log(`视频缺项：${missing.join(', ')}；01/03/04 可作为起步，其他镜头可明确复用或改照片。`);
if(!inventory.logos.length)console.log('尚无机构 Logo：请提供学校/工作单位 Logo，或明确省略。');
console.log('文件存在不等于内容已验收。下一步由 Agent 阅读简历并查看素材。');
