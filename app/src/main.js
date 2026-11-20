import {renderCover} from './render.js';
import {layouts} from './layouts.js';
import {grades} from './grades.js';
import {runShot} from './shots.js';

export const sizes=[{id:'square',label:'Square',width:1080,height:1080},{id:'portrait',label:'Portrait',width:1080,height:1350},{id:'landscape',label:'Landscape',width:1920,height:1080}];
export function createEditor(){
 const canvas=document.querySelector('#preview'),state={width:1920,height:1080,size:'landscape',layout:'hero',grade:'sunset',caption:'SUNSET RUN',subtitle:'A city that never lets go',photos:[],crops:{},assignments:[0,1,0,1,0,1,0,1,0],selected:0};
 const repaint=()=>renderCover(canvas,state);return {canvas,state,repaint,sizes,layouts,grades};
}
const editor=createEditor();window.vicePress=editor;editor.repaint();
if(new URLSearchParams(location.search).has('shot'))await runShot(new URLSearchParams(location.search).get('shot'),new URLSearchParams(location.search),async(path,caption)=>{await loadSample(path);editor.state.caption=caption.toUpperCase();editor.repaint();});
async function loadSample(path){const image=new Image();image.src=path;await image.decode();editor.state.photos=[{id:'shot-photo',name:path.split('/').pop(),image,url:path}];editor.state.assignments.fill(0);editor.repaint();}
