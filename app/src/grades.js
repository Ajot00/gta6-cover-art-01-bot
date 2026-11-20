const maps={
  sunset:{name:'Vice Sunset',swatch:'linear-gradient(110deg,#ffbd69,#f04785,#55358c)',stops:[[0,'#ffb85f'],[.48,'#f24c81'],[1,'#553c9c']],strength:.39,sat:1.18},
  neon:{name:'Neon Night',swatch:'linear-gradient(110deg,#35d5c4,#1b497d,#ec4f9b)',stops:[[0,'#35d5c4'],[.52,'#19245f'],[1,'#ed4c9d']],strength:.42,sat:1.27},
  gold:{name:'Palm Gold',swatch:'linear-gradient(110deg,#f4d275,#ef8b3f,#62386e)',stops:[[0,'#f5d67a'],[.55,'#ee883e'],[1,'#754064']],strength:.35,sat:1.12},
  purple:{name:'Dusk Purple',swatch:'linear-gradient(110deg,#ff8d99,#8454b4,#252b6b)',stops:[[0,'#f08b9e'],[.5,'#8550b8'],[1,'#242c69']],strength:.4,sat:1.2},
  mono:{name:'Mono Ink',swatch:'linear-gradient(110deg,#ede2d5,#79747d,#252430)',stops:[[0,'#f1e8de'],[.5,'#85818a'],[1,'#24232e']],strength:.28,sat:0},
};
export const grades=Object.entries(maps).map(([id,v])=>({id,...v}));
