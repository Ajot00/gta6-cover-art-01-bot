export const layouts = [
  {id:'four',name:'Four square',kind:'grid',count:4,rects:[[0,0,.5,.5],[.5,0,.5,.5],[0,.5,.5,.5],[.5,.5,.5,.5]]},
  {id:'hero',name:'Hero + three',kind:'hero',count:4,rects:[[0,0,.62,1],[.62,0,.38,.333],[.62,.333,.38,.333],[.62,.666,.38,.334]]},
  {id:'full',name:'Full bleed',kind:'full',count:1,rects:[[0,0,1,1]]},
  {id:'tilt',name:'Tilted snapshots',kind:'tilt',count:4,rects:[[0,0,.52,.57],[.5,.05,.5,.39],[.44,.47,.56,.53],[0,.58,.48,.42]]},
  {id:'nine',name:'Nine panel',kind:'nine',count:9,rects:Array.from({length:9},(_,i)=>[(i%3)/3,Math.floor(i/3)/3,1/3,1/3])},
  {id:'story',name:'Story strip',kind:'story',count:3,rects:[[0,0,.36,1],[.36,0,.32,1],[.68,0,.32,1]]},
];
