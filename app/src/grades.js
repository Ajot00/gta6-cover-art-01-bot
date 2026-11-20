const maps={
  sunset:{name:'Vice Sunset',swatch:'linear-gradient(110deg,#ffbd69,#f04785,#55358c)',stops:[[0,'#ff8736'],[.48,'#f04478'],[1,'#61368f']],strength:.6,sat:1.3},
  neon:{name:'Neon Night',swatch:'linear-gradient(110deg,#35d5c4,#1b497d,#ec4f9b)',stops:[[0,'#08e9da'],[.52,'#18265f'],[1,'#ff218e']],strength:.64,sat:1.36},
  gold:{name:'Palm Gold',swatch:'linear-gradient(110deg,#f4d275,#ef8b3f,#62386e)',stops:[[0,'#ffd05b'],[.55,'#f17930'],[1,'#79405f']],strength:.54,sat:1.19},
  purple:{name:'Dusk Purple',swatch:'linear-gradient(110deg,#ff8d99,#8454b4,#252b6b)',stops:[[0,'#ff7690'],[.5,'#8750b4'],[1,'#272963']],strength:.54,sat:1.27},
  mono:{name:'Mono Ink',swatch:'linear-gradient(110deg,#ede2d5,#79747d,#252430)',stops:[[0,'#f1e8de'],[.5,'#85818a'],[1,'#24232e']],strength:.28,sat:0},
};
export const grades=Object.entries(maps).map(([id,v])=>({id,...v}));
