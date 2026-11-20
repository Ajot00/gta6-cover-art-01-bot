export async function runShot(shot,query,load){
  const photo=query.get('photo')||'pier',caption=query.get('caption')||'Sunset Run';
  await load(`samples/${photo}.jpg`,caption);
  const e=window.vicePress;
  if(shot==='cover'){
    const size=query.get('size')||'landscape',dims={landscape:[1920,1080],portrait:[1080,1350],square:[1080,1080]}[size]||[1920,1080];
    e.state.width=dims[0];e.state.height=dims[1];e.state.size=size;e.state.layout=query.get('layout')||'hero';e.state.grade=query.get('grade')||'sunset';
    e.state.subtitle=query.get('subtitle')||'A city that never lets go';e.repaint();document.body.classList.add('shot-cover');
  }else if(shot==='editor'){
    const image=new Image();image.src='samples/pier.jpg';await image.decode();e.state.photos.push({id:'shot-pier',name:'pier.jpg',image,url:'samples/pier.jpg'});e.state.assignments=[0,1,0,1,0,1,0,1,0];
    e.state.layout='hero';e.state.grade='sunset';e.state.width=1920;e.state.height=1080;e.state.caption=caption.toUpperCase();e.repaint();
  }
  requestAnimationFrame(()=>requestAnimationFrame(()=>{window.__shotReady=true;}));
}
