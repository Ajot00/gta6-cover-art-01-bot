const heavy='900 100px Impact, "Arial Black", system-ui, sans-serif';
export function drawLettering(ctx,w,h,state){
  const bandH=h*.235, y=h-bandH;
  const grad=ctx.createLinearGradient(w*.07,y,w*.91,h);
  grad.addColorStop(0,'#ffac55');grad.addColorStop(.52,'#fa5484');grad.addColorStop(1,'#9c4aa6');
  ctx.save();
  const fade=ctx.createLinearGradient(0,y,0,h);fade.addColorStop(0,'rgba(10,8,18,0)');fade.addColorStop(.2,'rgba(10,8,18,.6)');fade.addColorStop(1,'rgba(10,8,18,.94)');ctx.fillStyle=fade;ctx.fillRect(0,y,w,bandH);
  const title=(state.caption||'').trim().toUpperCase()||'YOUR STORY';
  let size=h*.133;ctx.font=`900 ${size}px Impact, "Arial Black", system-ui, sans-serif`;
  while(ctx.measureText(title).width>w*.86&&size>16){size*=.94;ctx.font=`900 ${size}px Impact, "Arial Black", system-ui, sans-serif`;}
  const x=w/2, ty=y+bandH*.62;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=Math.max(3,h*.009);ctx.strokeStyle='#21121e';ctx.shadowColor='#08040d';ctx.shadowBlur=h*.018;ctx.shadowOffsetY=h*.012;ctx.strokeText(title,x,ty,w*.9);ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle=grad;ctx.fillText(title,x,ty,w*.9);
  const sub=(state.subtitle||'').trim();if(sub){ctx.font=`italic 500 ${Math.max(15,h*.035)}px Georgia, serif`;ctx.fillStyle='#ffb3cd';ctx.shadowColor='#ff367f';ctx.shadowBlur=h*.024;ctx.fillText(sub,x,h-bandH*.18,w*.8);}
  ctx.restore();
}
export function fitFont(ctx,text,maxW,ideal){let s=ideal;ctx.font=`900 ${s}px Impact, "Arial Black", system-ui, sans-serif`;while(ctx.measureText(text).width>maxW&&s>14){s*=.94;ctx.font=`900 ${s}px Impact, "Arial Black", system-ui, sans-serif`;}return s}
