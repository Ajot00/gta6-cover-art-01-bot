export async function runShot(shot,query,load){
  const photo=query.get('photo')||'pier',caption=query.get('caption')||'Sunset Run';
  const otherPhoto=photo==='pier'?'boulevard':'pier';
  await load(`samples/${photo}.jpg`,caption,`samples/${otherPhoto}.jpg`);
  const e=window.vicePress;
  if(shot==='cover'){
    const size=query.get('size')||'landscape',dims={landscape:[1920,1080],portrait:[1080,1350],square:[1080,1080]}[size]||[1920,1080];
    const four=[{x:.5,y:.08,zoom:1.72},{x:.44,y:.06,zoom:1.78},{x:.48,y:.52,zoom:1.02},{x:.96,y:.78,zoom:1.82}];
    const tilt=[{x:.5,y:.5,zoom:1.02},{x:.44,y:.06,zoom:1.74},{x:.96,y:.78,zoom:1.82},{x:.52,y:1,zoom:1.1}];
    const defaults=Array.from({length:9},(_,i)=>({x:i%2?.65:.35,y:.04+(i%3)*.08}));defaults[1]={x:.48,y:.08,zoom:1.38};defaults[3]={x:.55,y:.92,zoom:1.02};
    e.state.width=dims[0];e.state.height=dims[1];e.state.size=size;e.state.layout=query.get('layout')||'hero';e.state.grade=query.get('grade')||'sunset';e.state.cropHandles=false;e.state.panelCrops=e.state.layout==='four'?four:e.state.layout==='tilt'?tilt:defaults;
    e.state.subtitle=query.get('subtitle')||'A city that never lets go';e.repaint();document.body.classList.add('shot-cover');
  }else if(shot==='editor'){
    e.state.assignments=[0,1,0,1,0,1,0,1,0];e.state.panelCrops=Array.from({length:9},(_,i)=>({x:i%2?.65:.35,y:.04+(i%3)*.08}));
    e.state.layout='hero';e.state.grade='sunset';e.state.width=1920;e.state.height=1080;e.state.caption=caption.toUpperCase();e.state.cropHandles=true;e.repaint();
  }
  requestAnimationFrame(()=>requestAnimationFrame(()=>{window.__shotReady=true;}));
}
