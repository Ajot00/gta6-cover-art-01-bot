import {layouts} from './layouts.js';
import {grades} from './grades.js';
import {drawLettering} from './lettering.js';

function photo(ctx,img,rect,crop,scale){
  const {x,y,w,h}=rect, iw=img.naturalWidth||img.width, ih=img.naturalHeight||img.height;
  if(!iw||!ih)return;
  const fit=Math.max(w/iw,h/ih)*(crop.zoom||1), dw=iw*fit,dh=ih*fit;
  const ox=(crop.x??.5)*(dw-w), oy=(crop.y??.5)*(dh-h);
  ctx.drawImage(img,x-ox,y-oy,dw,dh);
}
function colorWash(ctx,w,h,grade){
  ctx.save();ctx.globalCompositeOperation='color';ctx.globalAlpha=grade.strength;const g=ctx.createLinearGradient(0,h*.05,w,h*.92);for(const [p,c] of grade.stops)g.addColorStop(p,c);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();
  if(grade.sat===0){ctx.save();ctx.globalCompositeOperation='saturation';ctx.fillStyle='#777';ctx.fillRect(0,0,w,h);ctx.restore();}
}
function texture(ctx,w,h,seed){
  let n=(seed>>>0)||1;const rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};
  const shade=ctx.createRadialGradient(w*.5,h*.45,Math.min(w,h)*.18,w*.5,h*.48,Math.max(w,h)*.72);shade.addColorStop(0,'rgba(10,7,18,0)');shade.addColorStop(.68,'rgba(10,7,18,.04)');shade.addColorStop(1,'rgba(5,3,13,.68)');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha=.11;ctx.fillStyle='#fff';const dots=Math.max(600,Math.floor(w*h/1150));for(let i=0;i<dots;i++){const x=rand()*w,y=rand()*h,s=rand()*1.7+.3;ctx.fillRect(x,y,s,s);}ctx.restore();
}
export function renderCover(canvas,state){
  const w=state.width||1920,h=state.height||1080;if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
  const ctx=canvas.getContext('2d',{alpha:false});ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#16101d';ctx.fillRect(0,0,w,h);
  const layout=layouts.find(x=>x.id===state.layout)||layouts[0],grade=grades.find(x=>x.id===state.grade)||grades[0];
  const pad=Math.round(Math.min(w,h)*.023),gap=Math.round(Math.min(w,h)*.012),inner={x:pad,y:pad,w:w-pad*2,h:h-pad*2};
  const cells=layout.rects.map(r=>({x:inner.x+r[0]*inner.w,y:inner.y+r[1]*inner.h,w:r[2]*inner.w,h:r[3]*inner.h}));
  ctx.save();ctx.beginPath();
  for(let i=0;i<cells.length;i++){const c=cells[i],tilt=layout.kind==='tilt';ctx.save();ctx.beginPath();if(tilt){const skew=Math.min(c.w*.12,gap*1.2);ctx.moveTo(c.x+skew,c.y);ctx.lineTo(c.x+c.w,c.y);ctx.lineTo(c.x+c.w-skew,c.y+c.h);ctx.lineTo(c.x,c.y+c.h);ctx.closePath();}else ctx.rect(c.x,c.y,c.w,c.h);ctx.clip();const item=(state.photos||[])[(state.assignments?.[i]??i)%(state.photos?.length||1)];if(item?.image){const crop=state.panelCrops?.[i]??state.crops?.[item.id]??{};photo(ctx,item.image,c,crop,1);}else{const g=ctx.createLinearGradient(c.x,c.y,c.x+c.w,c.y+c.h);g.addColorStop(0,'#d76e65');g.addColorStop(.5,'#734887');g.addColorStop(1,'#152d55');ctx.fillStyle=g;ctx.fillRect(c.x,c.y,c.w,c.h);}colorWash(ctx,w,h,grade);ctx.restore();}
  ctx.restore();
  // Inked gutters and an outside paper keyline keep every composition reading as a cover.
  ctx.strokeStyle='#fff1e5';ctx.lineWidth=Math.max(3,gap*.48);ctx.lineJoin='round';
  if(layout.kind!=='full')for(const c of cells){ctx.save();if(layout.kind==='tilt'){const skew=Math.min(c.w*.12,gap*1.2);ctx.beginPath();ctx.moveTo(c.x+skew,c.y);ctx.lineTo(c.x+c.w,c.y);ctx.lineTo(c.x+c.w-skew,c.y+c.h);ctx.lineTo(c.x,c.y+c.h);ctx.closePath();ctx.stroke();}else ctx.strokeRect(c.x,c.y,c.w,c.h);ctx.restore();}
  ctx.strokeStyle='rgba(255,241,229,.9)';ctx.lineWidth=Math.max(2,pad*.12);ctx.strokeRect(pad*.5,pad*.5,w-pad,h-pad);
  texture(ctx,w,h,(state.caption||'VICE').length*211+(state.layout||'').length*43);
  // Restrained dot screen in the title area echoes printed poster stock.
  const band=h*.235;ctx.save();ctx.globalAlpha=.16;ctx.fillStyle='#ff9bb3';for(let y=h-band+gap;y<h-gap;y+=gap*.83)for(let x=gap;x<w-gap;x+=gap*.83)if((Math.floor(x/gap)+Math.floor(y/gap))%2===0)ctx.fillRect(x,y,Math.max(2,gap*.18),Math.max(2,gap*.18));ctx.restore();
  drawLettering(ctx,w,h,state);return canvas;
}
