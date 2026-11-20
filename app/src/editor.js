import {createEditor} from './main.js';
import {renderCover} from './render.js';
const e=window.vicePress||createEditor(),{state}=e;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const sizeOptions=[['square','1080 × 1080'],['portrait','1080 × 1350'],['landscape','1920 × 1080']];
const toast=(msg)=>{const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2100);};
function snapshot(){return JSON.stringify({caption:state.caption,subtitle:state.subtitle,layout:state.layout,grade:state.grade,size:state.size,crops:state.crops,assignments:state.assignments,selected:state.selected});}
const history=[snapshot()];let hpos=0,internal=false;
function record(){if(internal)return;const v=snapshot();if(v===history[hpos])return;history.splice(hpos+1);history.push(v);if(history.length>45)history.shift();hpos=history.length-1;}
function restore(index){if(index<0||index>=history.length)return;hpos=index;const data=JSON.parse(history[index]);Object.assign(state,data);sync();draw();}
function draw(){e.repaint();$('#coverLabel').textContent=state.caption||'Untitled cover';$('#dimensions').textContent=`${state.width} × ${state.height}`;}
function sync(){internal=true;$('#caption').value=state.caption;$('#subtitle').value=state.subtitle;$('#zoom').value=state.crops[state.photos[state.selected]?.id]?.zoom||1;$('#zoomValue').textContent=`${Number($('#zoom').value).toFixed(1)}×`;$$('.size-option').forEach(x=>x.classList.toggle('active',x.dataset.id===state.size));$$('.select-option').forEach(x=>x.classList.toggle('active',x.dataset.id===state.layout));$$('.grade-option').forEach(x=>x.classList.toggle('active',x.dataset.id===state.grade));internal=false;draw();}
function buildOptions(){
  $('#sizes').innerHTML=sizeOptions.map(([id,label])=>`<button class="size-option${id===state.size?' active':''}" data-id="${id}">${label}</button>`).join('');
  $('#layouts').innerHTML=e.layouts.map((l,i)=>`<button class="select-option${l.id===state.layout?' active':''}" data-id="${l.id}"><span class="layout-glyph ${['grid','hero','full','tilt','nine','story'][i]}">${Array.from({length:l.count},()=>'<i></i>').join('')}</span><span>${l.name}</span></button>`).join('');
  $('#grades').innerHTML=e.grades.map(g=>`<button class="grade-option${g.id===state.grade?' active':''}" data-id="${g.id}"><i class="swatch" style="background:${g.swatch}"></i>${g.name}</button>`).join('');
}
function refreshPhotos(){
 const strip=$('#thumbs');strip.innerHTML='';state.photos.forEach((p,i)=>{const im=document.createElement('img');im.className='thumb'+(i===state.selected?' active':'');im.src=p.url;im.title=p.name;im.onclick=()=>{state.selected=i;sync();refreshPhotos();refreshPanels();};strip.append(im);});refreshPanels();
}
function refreshPanels(){const count=e.layouts.find(x=>x.id===state.layout)?.count||4;$('#panelPicker').innerHTML=Array.from({length:count},(_,i)=>`<button class="panel-chip${i===state.selected?' active':''}" data-panel="${i}">FRAME ${String(i+1).padStart(2,'0')}</button>`).join('');$$('.panel-chip').forEach(b=>b.onclick=()=>{state.selected=Number(b.dataset.panel);state.selected=Math.min(state.selected,Math.max(0,state.photos.length-1));refreshPanels();sync();});}
function addImage(image,name,url){const id=`photo-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;state.photos.push({id,name,image,url});state.selected=state.photos.length-1;record();refreshPhotos();sync();}
async function readFile(file){if(!file||!file.type.startsWith('image/'))return;const url=URL.createObjectURL(file),im=new Image();im.src=url;await im.decode();addImage(im,file.name,url);toast(`${file.name} added to your frames`);}
async function readBlob(blob,name='pasted-photo.png'){const url=URL.createObjectURL(blob),im=new Image();im.src=url;await im.decode();addImage(im,name,url);toast('Clipboard photo added');}
const input=$('#fileInput'),zone=$('#dropzone');$('#addPhotos').onclick=()=>input.click();zone.onclick=()=>input.click();zone.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' ')input.click();};input.onchange=async()=>{for(const f of input.files)await readFile(f);input.value='';};
for(const ev of ['dragenter','dragover'])zone.addEventListener(ev,x=>{x.preventDefault();zone.classList.add('dragover');});for(const ev of ['dragleave','drop'])zone.addEventListener(ev,x=>{x.preventDefault();zone.classList.remove('dragover');});zone.addEventListener('drop',async ev=>{for(const f of ev.dataTransfer.files)await readFile(f);});
window.addEventListener('paste',async ev=>{for(const item of ev.clipboardData?.items||[])if(item.type.startsWith('image/'))await readBlob(item.getAsFile());});
$$('.select-option').forEach(b=>{});
$('#layouts').addEventListener('click',ev=>{const b=ev.target.closest('[data-id]');if(!b)return;record();state.layout=b.dataset.id;refreshPanels();sync();});$('#grades').addEventListener('click',ev=>{const b=ev.target.closest('[data-id]');if(!b)return;record();state.grade=b.dataset.id;sync();});
$('#sizes').addEventListener('click',ev=>{const b=ev.target.closest('[data-id]');if(!b)return;const s=e.sizes.find(x=>x.id===b.dataset.id);if(!s)return;record();state.size=s.id;state.width=s.width;state.height=s.height;sync();});
$('#caption').addEventListener('input',()=>{state.caption=$('#caption').value;draw();});$('#caption').addEventListener('change',record);$('#subtitle').addEventListener('input',()=>{state.subtitle=$('#subtitle').value;draw();});$('#subtitle').addEventListener('change',record);
$('#zoom').addEventListener('input',()=>{const p=state.photos[state.selected];if(!p)return;state.crops[p.id]??={x:.5,y:.5,zoom:1};state.crops[p.id].zoom=Number($('#zoom').value);$('#zoomValue').textContent=`${state.crops[p.id].zoom.toFixed(1)}×`;draw();});$('#zoom').addEventListener('change',record);
const cv=$('#preview');let drag=null;
cv.addEventListener('pointerdown',ev=>{const box=cv.getBoundingClientRect(),x=(ev.clientX-box.left)/box.width,y=(ev.clientY-box.top)/box.height;const l=e.layouts.find(q=>q.id===state.layout);const panel=l.rects.findIndex(r=>x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3]);state.selected=Math.max(0,panel);refreshPanels();const p=state.photos[state.selected%Math.max(state.photos.length,1)];if(p){const c=state.crops[p.id]??={x:.5,y:.5,zoom:1};drag={id:p.id,x:ev.clientX,y:ev.clientY,cx:c.x,cy:c.y};cv.setPointerCapture(ev.pointerId);}});
cv.addEventListener('pointermove',ev=>{if(!drag)return;const c=state.crops[drag.id],amp=Math.max(1,(c.zoom||1)-.55);c.x=Math.max(0,Math.min(1,drag.cx-(ev.clientX-drag.x)/cv.clientWidth/amp));c.y=Math.max(0,Math.min(1,drag.cy-(ev.clientY-drag.y)/cv.clientHeight/amp));draw();});cv.addEventListener('pointerup',()=>{if(drag){drag=null;record();}});
cv.addEventListener('wheel',ev=>{const p=state.photos[state.selected];if(!p)return;ev.preventDefault();const c=state.crops[p.id]??={x:.5,y:.5,zoom:1};c.zoom=Math.max(1,Math.min(2.8,c.zoom+(ev.deltaY<0?.06:-.06)));$('#zoom').value=c.zoom;$('#zoomValue').textContent=`${c.zoom.toFixed(1)}×`;draw();record();},{passive:false});
function exportPng(){const target=document.createElement('canvas');renderCover(target,state);target.toBlob(blob=>{if(!blob){toast('Could not export this cover');return;}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`vice-press-${state.width}x${state.height}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);toast(`PNG ready · ${state.width} × ${state.height}`);},'image/png');}
$('#export').onclick=exportPng;$('#exportTop').onclick=exportPng;$('#undo').onclick=()=>restore(hpos-1);$('#redo').onclick=()=>restore(hpos+1);
buildOptions();sync();refreshPhotos();
