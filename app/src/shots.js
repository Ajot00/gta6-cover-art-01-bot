export async function runShot(shot,query,load){
  const photo=query.get('photo')||'pier',caption=query.get('caption')||'Sunset Run';
  const otherPhoto=photo==='pier'?'boulevard':'pier';
  await load(`samples/${photo}.jpg`,caption,`samples/${otherPhoto}.jpg`);
  const e=window.vicePress;
  if(shot==='cover'){
    const size=query.get('size')||'landscape',dims={landscape:[1920,1080],portrait:[1080,1350],square:[1080,1080]}[size]||[1920,1080];
    e.state.width=dims[0];e.state.height=dims[1];e.state.size=size;e.state.layout=query.get('layout')||'hero';e.state.grade=query.get('grade')||'sunset';e.state.panelCrops=Array.from({length:9},(_,i)=>({x:i%2?.65:.35,y:.04+(i%3)*.08}));
    e.state.subtitle=query.get('subtitle')||'A city that never lets go';e.repaint();document.body.classList.add('shot-cover');
  }else if(shot==='editor'){
    e.state.assignments=[0,1,0,1,0,1,0,1,0];e.state.panelCrops=Array.from({length:9},(_,i)=>({x:i%2?.65:.35,y:.04+(i%3)*.08}));
    e.state.layout='hero';e.state.grade='sunset';e.state.width=1920;e.state.height=1080;e.state.caption=caption.toUpperCase();e.repaint();
  }
  requestAnimationFrame(()=>requestAnimationFrame(()=>{window.__shotReady=true;}));
}
