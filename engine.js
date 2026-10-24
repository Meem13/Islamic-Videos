// @ts-nocheck
/* Animation engine for the Salman story (canvas, 1920x1080). Draws the frame for time t (seconds). */
export function makeEngine(g, mark, CFG, D) {

const W=1920,H=1080;
const K={sage:'#D2DAD7',gold:'#E6B95F',hi:'#FFE7A8',cream:'#F6EFDD',tg:'#F2C76F'};
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),L=(a,b,t)=>a+(b-a)*t;
const eo=t=>{t=cl(t);return 1-Math.pow(1-t,3)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const sm=(t,a,b)=>eio((t-a)/(b-a));
const R=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const win=(t,a,b,f=.45)=>eio((t-a)/f)*(1-eio((t-b)/f));
function hx(c){const n=parseInt(c.slice(1),16);return[n>>16,n>>8&255,n&255]}
function mixc(a,b,t){t=cl(t);const A=hx(a),B=hx(b);const r=Math.round(L(A[0],B[0],t)),gg=Math.round(L(A[1],B[1],t)),bb=Math.round(L(A[2],B[2],t));return '#'+((1<<24)+(r<<16)+(gg<<8)+bb).toString(16).slice(1)}
function rgba(c,a){const A=hx(c);return `rgba(${A[0]},${A[1]},${A[2]},${Math.max(0,Math.min(1,a))})`}
function archPath(cx,top,w,h){const r=w/2;g.beginPath();g.moveTo(cx-r,top+h);g.lineTo(cx-r,top+r);g.arc(cx,top+r,r,Math.PI,0);g.lineTo(cx+r,top+h);g.closePath()}
function cam(z,cx,cy){g.translate(W/2,H/2);g.scale(z,z);g.translate(-cx,-cy)}
function sky(c0,c1,c2){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,c0);gr.addColorStop(.6,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(-400,-400,W+800,H+800)}
function ridge(base,A1,f1,A2,f2,ph,col,scroll){g.fillStyle=col;g.beginPath();g.moveTo(-300,H+300);for(let x=-300;x<=W+300;x+=14){const X=x+scroll;g.lineTo(x,base-A1*(.5+.5*Math.sin(X*f1+ph))-A2*Math.sin(X*f2+ph*1.7))}g.lineTo(W+300,H+300);g.closePath();g.fill()}
function glow(x,y,r,col,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,rgba(col,a));gr.addColorStop(1,rgba(col,0));g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
function clouds(t,col,a,yb,speed,n){for(let i=0;i<n;i++){const x=((R(i+40)*(W+700)-t*speed*(.6+R(i+3)))%(W+700)+W+700)%(W+700)-350,y=yb+R(i+60)*160;g.fillStyle=rgba(col,a*(.5+.5*R(i+9)));g.beginPath();g.ellipse(x,y,160+R(i+7)*160,10+R(i+8)*14,0,0,7);g.fill();g.beginPath();g.ellipse(x+60,y-10,100+R(i)*70,8+R(i+2)*8,0,0,7);g.fill()}}
function vig(a,cy=H/2){const gr=g.createRadialGradient(W/2,cy,H*.35,W/2,cy,H*1.05);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,`rgba(0,0,0,${a})`);g.fillStyle=gr;g.fillRect(0,0,W,H)}

// ---------- fire ----------
function flame(x,y,s,t,k,seed){seed=seed||0;if(s<=2)return;
 const sway=(Math.sin(t*6.1+seed)*.5+Math.sin(t*11.7+seed*2)*.3)*.1*s;
 const fl=1+.07*Math.sin(t*17+seed)+.05*Math.sin(t*29+seed*3);
 g.save();g.globalCompositeOperation='lighter';glow(x,y-s*.45,s*2.4,'#FF8A3D',.36*k*fl);glow(x,y-s*.3,s*1.1,'#FFC070',.22*k);g.restore();
 const layers=[['#E4551E',1,.5],['#FF9A3C',.82,.38],['#FFD36B',.6,.26],['#FFF4D0',.36,.14]];
 layers.forEach((l,i)=>{const h=s*l[1]*fl,w=s*l[2],tx=x+sway*(1+i*.3);g.fillStyle=l[0];g.beginPath();g.moveTo(x-w,y);
  g.bezierCurveTo(x-w*1.15,y-h*.35,x-w*.4+sway*.3,y-h*.62,tx,y-h);g.bezierCurveTo(x+w*.4+sway*.3,y-h*.62,x+w*1.15,y-h*.35,x+w,y);g.quadraticCurveTo(x,y+w*.35,x-w,y);g.fill()});
 for(let j=0;j<4;j++){const ox=(j-1.5)*s*.2,hh=s*(.42+.14*Math.sin(t*9+j*2+seed))*fl,w=s*.09;g.fillStyle=j%2?'#FF9A3C':'#FFD36B';g.beginPath();g.moveTo(x+ox-w,y-4);g.quadraticCurveTo(x+ox-w*.4+sway*.5,y-hh*.6,x+ox+sway*(1.2+j*.1),y-hh);g.quadraticCurveTo(x+ox+w*.4+sway*.5,y-hh*.6,x+ox+w,y-4);g.fill()}}
function embers(x,y,spread,t,n,k){for(let i=0;i<n;i++){const life=2.2+R(i+7)*2,ph=R(i+13)*life,u=((t+ph)%life)/life;const px=x+(R(i)-.5)*spread+Math.sin(t*1.3+i)*30*u,py=y-u*(260+R(i+3)*240);g.fillStyle=rgba('#FFB25A',(1-u)*.9*k*(.5+.5*R(i+9)));g.beginPath();g.arc(px,py,1.2+R(i+5)*2.2*(1-u),0,7);g.fill()}}
function surgeAt(t){let s=0;CFG.surge.forEach(te=>{if(t>te)s+=.38*Math.exp(-(t-te)/.4)});return s}

// ---------- people ----------
function person(x,y,s,o){
 const d={f:1,robe:'#5a2a3a',trim:null,sash:null,skin:'#B98558',hair:'#1b1410',turban:null,beard:false,shade:0,rim:null,rimA:0,w:0,amp:0,aN:[.08,.14],aF:[-.08,-.1],tilt:0,kneel:0,head:0,alpha:1,hem:38,pants:'#2a2230',hold:null,kid:false,shadow:.28};
 o=Object.assign(d,o||{});if(o.alpha<=.01)return;
 const shd=c=>o.shade>0?mixc(c,'#06030a',o.shade):c;
 g.save();g.globalAlpha*=o.alpha;g.translate(x,y);
 g.fillStyle=`rgba(0,0,0,${o.shadow})`;g.beginPath();g.ellipse(0,3,58*s,11*s,0,0,7);g.fill();
 g.scale(s*o.f,s);
 const sw=Math.sin(o.w),cw=Math.cos(o.w),kn=o.kneel;
 const hipY=-130*(1-.45*kn),shY=-248*(1-.36*kn),hem=-o.hem,hemW=(o.kid?44:52)*(1+.28*kn);
 const bob=-Math.abs(sw)*5*o.amp,st=28*o.amp;
 const fN=[sw*st,-Math.max(0,cw)*15*o.amp],fF=[-sw*st,-Math.max(0,-cw)*15*o.amp];
 if(o.hem>60&&kn<.5){g.lineCap='round';g.lineWidth=17;[fF,fN].forEach((f,i)=>{g.strokeStyle=shd(i?o.pants:mixc(o.pants,'#000000',.25));g.beginPath();g.moveTo(i?4:-4,hipY);g.lineTo(f[0]+(i?4:-4),f[1]-8);g.stroke()})}
 g.fillStyle=shd('#1a1216');
 if(kn<.7){[fF,fN].forEach(f=>{g.beginPath();g.ellipse(f[0]+8,f[1]-6,18,8,0,0,7);g.fill()})}else{g.beginPath();g.ellipse(-4,-8,22,8,0,0,7);g.fill()}
 g.save();g.translate(0,bob);g.translate(0,hipY);g.rotate(o.tilt);g.translate(0,-hipY);
 const arm=(sx,sy,a,col)=>{const p1=[sx+Math.sin(a[0])*64,sy+Math.cos(a[0])*64],p2=[p1[0]+Math.sin(a[1])*58,p1[1]+Math.cos(a[1])*58];g.lineCap='round';g.lineJoin='round';g.strokeStyle=col;g.lineWidth=19;g.beginPath();g.moveTo(sx,sy);g.lineTo(p1[0],p1[1]);g.lineTo(p2[0],p2[1]);g.stroke();g.fillStyle=shd(o.skin);g.beginPath();g.arc(p2[0],p2[1],10.5,0,7);g.fill();return p2};
 arm(-8,shY+14,o.aF,shd(mixc(o.robe,'#000000',.45)));
 const tp=new Path2D();tp.moveTo(-34,shY+16);tp.quadraticCurveTo(-34,shY-2,-14,shY-5);tp.lineTo(14,shY-5);tp.quadraticCurveTo(34,shY-2,34,shY+16);tp.bezierCurveTo(40,shY+(hem-shY)*.45,hemW+4,hem-60,hemW,hem);tp.lineTo(-hemW,hem);tp.bezierCurveTo(-hemW-4,hem-60,-40,shY+(hem-shY)*.45,-34,shY+16);tp.closePath();
 const gr=g.createLinearGradient(-hemW,0,hemW,0);gr.addColorStop(0,shd(mixc(o.robe,'#ffffff',.1)));gr.addColorStop(1,shd(mixc(o.robe,'#000000',.38)));g.fillStyle=gr;g.fill(tp);
 if(o.trim){g.fillStyle=shd(o.trim);g.fillRect(-hemW-1,hem-13,hemW*2+2,13);g.strokeStyle=shd(o.trim);g.lineWidth=4;g.beginPath();g.moveTo(-10,shY-2);g.lineTo(0,shY+48);g.lineTo(10,shY-2);g.stroke()}
 if(o.sash){g.fillStyle=shd(o.sash);g.fillRect(-37,hipY-14,74,14)}
 if(o.rim&&o.rimA>0){g.save();g.globalCompositeOperation='lighter';g.strokeStyle=rgba(o.rim,o.rimA);g.lineWidth=3;g.stroke(tp);g.restore()}
 const hp=arm(8,shY+14,o.aN,shd(o.robe));
 if(o.hold==='log'){g.save();g.translate(hp[0]+4,hp[1]-4);g.rotate(-.08);g.fillStyle='#6B4526';g.fillRect(-38,-9,76,18);g.fillStyle='#C79A63';g.beginPath();g.ellipse(38,0,6,9,0,0,7);g.fill();g.restore()}
 if(o.hold==='torch'){g.save();g.translate(hp[0],hp[1]);g.strokeStyle='#4A3020';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-4,14);g.lineTo(8,-54);g.stroke();g.restore();flame(hp[0]+8,hp[1]-54,34,TNOW,.8,hp[0]);}
 if(o.hold==='brick'){g.save();g.translate(hp[0]+2,hp[1]-4);g.fillStyle='#B5603F';g.fillRect(-18,-9,36,18);g.fillStyle='#8E4A30';g.fillRect(-18,3,36,6);g.restore()}
 const hr=o.kid?28:26;
 g.save();g.translate(0,shY-12);g.rotate(o.head);
 g.fillStyle=shd(o.skin);g.fillRect(-7,-14,14,18);const hy=-hr-6;
 g.beginPath();g.ellipse(3,hy,hr*.92,hr,0,0,7);g.fill();
 if(o.turban){g.fillStyle=shd(o.turban);g.beginPath();g.ellipse(0,hy-hr*.5,hr*1.22,hr*.84,0,0,7);g.fill();g.fillStyle=shd(mixc(o.turban,'#000000',.18));g.beginPath();g.ellipse(2,hy-hr*.3,hr*1.1,hr*.34,-.12,0,Math.PI);g.fill();g.strokeStyle=shd(mixc(o.turban,'#000000',.28));g.lineWidth=3;g.beginPath();g.ellipse(0,hy-hr*.6,hr*.9,hr*.55,-.2,3.4,5.6);g.stroke()}
 else{g.fillStyle=shd(o.hair);g.beginPath();g.ellipse(-1,hy-3,hr*.98,hr*.98,0,Math.PI*.8,Math.PI*2.2);g.fill()}
 if(o.beard){g.fillStyle=shd('#2a1f1a');g.beginPath();g.ellipse(9,hy+hr*.55,hr*.62,hr*.7,0,0,Math.PI);g.fill()}
 g.restore();g.restore();g.restore()}
function swingArms(w,amp){const s=Math.sin(w)*amp*.5;return{aN:[.05-s,.1-s*1.1],aF:[-.05+s,-s*-1.1*0-.0+s*1.1]}}
const FATHER={robe:'#5B2336',trim:'#D9B15A',sash:'#E6C878',turban:'#EFE8D8',beard:true};
const BOY={robe:'#E8DCC2',sash:'#8A5A3A',hair:'#1c140f',kid:true,hem:100,pants:'#6B5A48'};
function wk(x0,x1,ta,tb,t,stride){const k=cl((t-ta)/(tb-ta));const x=L(x0,x1,k);return{x,amp:(t>ta&&t<tb)?1:0,w:Math.PI*Math.abs(x-x0)/stride}}
function flip(t,t0,from,to,dur){dur=dur||.18;return L(from,to,cl((t-t0)/dur))}

// ---------- village pieces ----------
function house(x,y,w,h,c,o){o=o||{};const sh=mixc(c,'#1a1020',.35);g.fillStyle=c;g.fillRect(x,y-h,w,h);g.fillStyle=sh;g.fillRect(x+w*.74,y-h,w*.26,h);g.fillStyle=mixc(c,'#000000',.2);g.fillRect(x-5,y-h-9,w+10,11);
 const dw=w*.2,dh=h*.5,dx=x+w*.16;g.fillStyle=o.lit?'#FFC46A':'#2a1a22';g.beginPath();g.moveTo(dx,y);g.lineTo(dx,y-dh+dw/2);g.arc(dx+dw/2,y-dh+dw/2,dw/2,Math.PI,0);g.lineTo(dx+dw,y);g.fill();
 for(let i=0;i<(o.win===undefined?2:o.win);i++){const wx=x+w*(.46+i*.2),wy=y-h*.7;g.fillStyle=o.lit?'#FFD27C':'#3a2a30';g.fillRect(wx,wy,w*.07,h*.16);if(o.lit){g.save();g.globalCompositeOperation='lighter';glow(wx+w*.035,wy+h*.08,34,'#FFB050',.35);g.restore()}}}
function domeHouse(x,y,w,h,c,dc){house(x,y,w,h,c,{lit:1,win:1});const r=w*.42,cx=x+w/2,by=y-h-8;g.fillStyle=dc;g.beginPath();g.ellipse(cx,by,r,r*.95,0,Math.PI,0);g.fill();g.fillStyle=rgba('#000000',.22);g.beginPath();g.ellipse(cx,by,r,r*.95,0,Math.PI*1.5,Math.PI*2);g.lineTo(cx,by);g.fill();g.fillStyle=dc;g.fillRect(cx-2,by-r*.95-26,4,28);g.beginPath();g.arc(cx,by-r*.95-30,5,0,7);g.fill()}
function cypress(x,y,h,col,sw){g.fillStyle=col;g.beginPath();g.moveTo(x+sw,y-h);g.bezierCurveTo(x+h*.16+sw,y-h*.7,x+h*.17,y-h*.2,x+h*.06,y);g.lineTo(x-h*.06,y);g.bezierCurveTo(x-h*.17,y-h*.2,x-h*.16+sw,y-h*.7,x+sw,y-h);g.fill()}
function birds(t,t0,t1,y0){if(t<t0||t>t1)return;const u=(t-t0)/(t1-t0);for(let i=0;i<5;i++){const x=L(-100,W+100,u)-i*70+Math.sin(i)*20,y=y0+Math.sin(u*6+i)*20+i*16,f=Math.sin(t*10+i)*.7;g.strokeStyle='rgba(40,24,36,.75)';g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(x-16,y+f*10);g.quadraticCurveTo(x-6,y-8,x,y);g.quadraticCurveTo(x+6,y-8,x+16,y+f*10);g.stroke()}}
function smoke(x,y,t,n,col){for(let i=0;i<n;i++){const life=4,u=((t*1+i*life/n)%life)/life;g.fillStyle=rgba(col,.22*(1-u));g.beginPath();g.arc(x+Math.sin(u*5+i)*10+u*26,y-u*120,6+u*20,0,7);g.fill()}}
function label(t,txt,a,b,y,sub,back){const al=win(t,a,b,.6);if(al<=.01)return;g.save();g.globalAlpha*=al;if(back){const bg=g.createRadialGradient(960,y+10,10,960,y+10,460);bg.addColorStop(0,'rgba(8,3,3,.55)');bg.addColorStop(1,'rgba(8,3,3,0)');g.fillStyle=bg;g.fillRect(0,0,W,H)}g.textAlign='center';g.letterSpacing='9px';g.font='60px LoraB';g.fillStyle=K.cream;g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=18;g.fillText(txt,960,y);if(sub){g.letterSpacing='4px';g.font='30px LoraR';g.fillStyle=K.gold;g.fillText(sub,960,y+52)}g.restore()}

let TNOW=0;
function drawChurch(cx,cy,m,gw){const body=mixc('#D8CFBC','#A9B8CC',m),sh=mixc('#B0A690','#7E8EA6',m),roof=mixc('#7B5646','#4A5870',m);
 g.fillStyle=body;g.fillRect(cx-170,cy-210,340,210);g.fillStyle=sh;g.fillRect(cx+110,cy-210,60,210);
 g.fillStyle=roof;g.beginPath();g.moveTo(cx-195,cy-206);g.lineTo(cx,cy-340);g.lineTo(cx+195,cy-206);g.closePath();g.fill();
 g.fillStyle=body;g.fillRect(cx-290,cy-330,90,330);g.fillStyle=sh;g.fillRect(cx-230,cy-330,30,330);g.fillStyle=roof;g.beginPath();g.moveTo(cx-300,cy-326);g.lineTo(cx-245,cy-440);g.lineTo(cx-190,cy-326);g.closePath();g.fill();
 g.strokeStyle=mixc('#6B5A48','#3E4E66',m);g.lineWidth=7;[[cx,cy-340,60],[cx-245,cy-440,48]].forEach(c=>{g.beginPath();g.moveTo(c[0],c[1]);g.lineTo(c[0],c[1]-c[2]);g.moveTo(c[0]-c[2]*.35,c[1]-c[2]*.65);g.lineTo(c[0]+c[2]*.35,c[1]-c[2]*.65);g.stroke()});
 const gc=mixc('#5A4636','#E4F0FF',gw*.9);g.fillStyle=gc;archPath(cx,cy-150,70,150);g.fill();g.beginPath();g.arc(cx,cy-245,34,0,7);g.fill();
 g.fillStyle=mixc('#5A4636','#EAF4FF',gw*.9);archPath(cx-110,cy-160,40,80);g.fill();archPath(cx+110,cy-160,40,80);g.fill();
 if(gw>.01){g.save();g.globalCompositeOperation='lighter';glow(cx,cy-120,360,'#9CC8FF',.3*gw);glow(cx,cy-245,150,'#E8F2FF',.3*gw);
  for(let i=0;i<9;i++){const a=-Math.PI*.95+i*Math.PI*.12+Math.sin(TNOW*.6+i)*.04,len=520+R(i)*200;g.fillStyle=rgba('#DDEBFF',.055*gw);g.beginPath();g.moveTo(cx,cy-120);g.lineTo(cx+Math.cos(a-.045)*len,cy-120+Math.sin(a-.045)*len);g.lineTo(cx+Math.cos(a+.045)*len,cy-120+Math.sin(a+.045)*len);g.closePath();g.fill()}g.restore()}}

// ---- church exterior (continues the last shot of minute 1) ----
// ================= MINUTE 4 SCENES =================
const T1={robe:'#8A8272',turban:'#CFC6B0',beard:true},T2={robe:'#7A8A7A',turban:'#D8D0BC',beard:true},T3={robe:'#8A7A6A',turban:'#CFC6B0',beard:true};
function lying(x,y,s,o){g.save();g.translate(x,y);g.scale(s,s);const rb=o.robe,dk=mixc(rb,'#000000',.25);
 g.fillStyle='#5A4430';g.fillRect(-240,-60,480,18);g.fillRect(-230,-42,14,44);g.fillRect(216,-42,14,44);
 g.fillStyle='#CFC4A8';g.beginPath();g.moveTo(-230,-60);g.quadraticCurveTo(-230,-82,-210,-82);g.lineTo(210,-82);g.quadraticCurveTo(230,-82,230,-60);g.closePath();g.fill();
 g.fillStyle=rb;g.beginPath();g.moveTo(-150,-82);g.quadraticCurveTo(-150,-124,-100,-124);g.lineTo(130,-110);g.quadraticCurveTo(170,-100,170,-82);g.closePath();g.fill();
 g.fillStyle='#E8DFC8';g.beginPath();g.ellipse(-190,-102,52,34,0,0,7);g.fill();
 g.fillStyle='#B98A64';g.beginPath();g.arc(-182,-128,25,0,7);g.fill();
 g.fillStyle=o.turban||'#CFC6B0';g.beginPath();g.ellipse(-184,-148,29,15,-.1,Math.PI,0);g.fill();
 if(o.beard){g.fillStyle='#CFC6B0';g.beginPath();g.moveTo(-200,-124);g.quadraticCurveTo(-190,-92,-164,-122);g.closePath();g.fill()}
 g.fillStyle=mixc('#9A8A6A','#5A4A3A',.3);g.beginPath();g.moveTo(-60,-110);g.lineTo(240,-100);g.lineTo(240,-82);g.lineTo(-60,-82);g.closePath();g.fill();
 g.strokeStyle=dk;g.lineWidth=18;g.lineCap='round';g.beginPath();g.moveTo(-110,-112);const a=o.arm||0;g.lineTo(-110+Math.sin(a)*90,-112-Math.cos(a)*30*(o.armUp||0)+(1-(o.armUp||0))*8);g.stroke();
 g.restore()}
function deathRoom(t,o){TNOW=t;const c=o.c||0;
 const wg=g.createLinearGradient(0,0,0,H);wg.addColorStop(0,mixc('#3A3040','#14101C',c));wg.addColorStop(1,mixc('#201A28','#0A0810',c));g.fillStyle=wg;g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(140,120,120,.09)';g.lineWidth=2;for(let r=0;r<10;r++)for(let k=0;k<16;k++)g.strokeRect(k*130-(r%2)*65,r*90,130,90);
 const wx=1480;g.save();archPath(wx,150,260,460);g.clip();const sg=g.createLinearGradient(0,150,0,610);sg.addColorStop(0,'#080C20');sg.addColorStop(1,mixc('#1A2250','#7A5A5A',o.dawn||0));g.fillStyle=sg;g.fillRect(wx-140,140,280,480);
 for(let i=0;i<20;i++){g.fillStyle=rgba('#FFF4DC',(.3+.7*R(i))*(.6+.4*Math.sin(t*3+i))*(1-(o.dawn||0)));g.fillRect(wx-130+R(i+3)*260,160+R(i+9)*300,2.4,2.4)}
 if(o.far>0){const k=o.far;g.fillStyle=rgba('#0A0A18',1);g.fillRect(wx-140,560,280,60);g.save();g.globalCompositeOperation='lighter';glow(wx+20,552,L(40,200,k),'#FFC870',.9*k);g.restore();g.fillStyle=rgba('#FFE7A8',k);g.beginPath();g.arc(wx+20,552,L(3,9,k),0,7);g.fill()}
 g.restore();archPath(wx,150,260,460);g.strokeStyle='#4A3A44';g.lineWidth=22;g.stroke();
 const fg=g.createLinearGradient(0,860,0,H);fg.addColorStop(0,'#2A2230');fg.addColorStop(1,'#0C0A10');g.fillStyle=fg;g.fillRect(0,860,W,H-860);
 g.fillStyle='#6A3A3A';g.beginPath();g.moveTo(440,890);g.lineTo(1500,890);g.lineTo(1580,1000);g.lineTo(360,1000);g.closePath();g.fill();
 // bed & teacher
 lying(1000,870,1.25,{robe:o.robe.robe,turban:o.robe.turban,beard:true,arm:o.arm,armUp:o.armUp});
 // lamp
 const lk=o.lamp==null?1:o.lamp;g.fillStyle='#3A2A1A';g.fillRect(370,790,10,70);g.fillStyle='#8A6A2E';g.beginPath();g.ellipse(375,788,28,10,0,0,Math.PI);g.fill();
 if(lk>.02)flame(375,782,44*lk,t,.9,3);g.save();g.globalCompositeOperation='lighter';glow(375,740,L(260,820,lk),'#FFB070',.28*lk);g.restore();
 // Salman kneeling
 const bow=o.bow||0;person(590,868,.98,Object.assign({},BOY,{f:1,kneel:.85,aN:[.7+.3*bow,2.2],aF:[.6,2.1],head:-.05-.3*bow,tilt:.06*bow,rim:'#FFB070',rimA:.55*lk}));
 if(o.fx)o.fx(t);
 g.fillStyle=rgba('#050810',.28*c);g.fillRect(0,0,W,H);vig(.5+.2*c)}
function citySil(x,y,s,col,dome){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=col;g.fillRect(-420,-170,840,170);for(let i=0;i<22;i++)g.fillRect(-420+i*40,-196,24,28);
 g.fillRect(-90,-330,180,160);g.beginPath();g.ellipse(0,-330,90,80,0,Math.PI,0);g.fill();g.fillRect(-4,-440,8,40);
 g.fillRect(250,-380,34,220);g.beginPath();g.moveTo(246,-380);g.lineTo(267,-420);g.lineTo(288,-380);g.fill();g.fillRect(-300,-300,34,130);g.beginPath();g.ellipse(-283,-300,24,26,0,Math.PI,0);g.fill();
 g.fillStyle='rgba(0,0,0,.55)';archPath(0,-120,90,120);g.fill();g.restore()}
function roadScene(t,o){TNOW=t;sky(o.s0,o.s1,o.s2);g.save();g.globalCompositeOperation='lighter';glow(o.sx||1500,o.sy||260,o.sr||420,o.sc||'#FFF0C0',o.sa||.45);g.restore();
 clouds(t,'#FFFFFF',.35,140,6,5);ridge(700,40,.003,20,.008,.9+(o.ph||0),o.m0,0);
 const gy=880;
 if(o.city)citySil(o.cx,gy-30,o.cs||1,o.cc||'#B8A68A');
 ridge(900,30,.004,12,.012,2.4+(o.ph||0),o.g0,0);
 const gg=g.createLinearGradient(0,gy-30,0,H);gg.addColorStop(0,o.g1);gg.addColorStop(1,o.g2);g.fillStyle=gg;g.fillRect(0,gy-30,W,H);
 if(o.fn)o.fn(t,gy)}
function walkSal(t,a,b,x0,x1,gy,s,extra){const k=cl((t-a)/(b-a));const x=L(x0,x1,eio(k));const am=(k>0&&k<1)?1:0;const w=Math.PI*(x-x0)/82;const ss=swingArms(w,am);return person(x,gy+12,s||.78,Object.assign({},BOY,{f:1,w:w,amp:am,aN:ss.aN,aF:ss.aF},extra||{}))}
function sheep(x,y,s,ph,f){g.save();g.translate(x,y);g.scale(s*f,s);const b=Math.sin(ph)*3;g.fillStyle='#4A3A2A';[-24,-10,12,26].forEach((lx,i)=>g.fillRect(lx-3,-30+(i%2?b:-b)*.3,6,32));
 g.fillStyle='#F2EBDC';g.beginPath();g.ellipse(0,-48,42,28,0,0,7);g.fill();g.beginPath();g.arc(-22,-60,18,0,7);g.arc(10,-66,18,0,7);g.arc(28,-54,16,0,7);g.fill();
 g.fillStyle='#3A2E26';g.beginPath();g.ellipse(46,-56,15,12,.3,0,7);g.fill();g.restore()}
function cow(x,y,s,ph,f,col){g.save();g.translate(x,y);g.scale(s*f,s);const b=Math.sin(ph)*5;g.fillStyle=mixc(col,'#000',.3);[-60,-40,40,60].forEach((lx,i)=>g.fillRect(lx-6,-70+(i%2?b:-b)*.4,12,72));
 g.fillStyle=col;g.beginPath();g.ellipse(0,-100,86,46,0,0,7);g.fill();g.beginPath();g.ellipse(92,-120,30,24,.4,0,7);g.fill();
 g.fillStyle=mixc(col,'#FFFFFF',.55);g.beginPath();g.ellipse(-20,-108,30,20,.3,0,7);g.fill();g.fillStyle='#E8DFC8';g.fillRect(100,-150,6,18);g.fillRect(82,-150,6,18);g.restore()}

// ---- 1: the first teacher dies ----
function sceneFirst(t){const c=.3+.45*sm(t,18.3,20.6)-.3*sm(t,25.5,27);
 const lamp=1-.55*sm(t,18.4,20.6)+.4*sm(t,25.5,26.5);const sp=win(t,13.4,26.0,.5);
 deathRoom(t,{c:c,robe:T1,lamp:lamp,far:sm(t,21.1,22.6)*(1-sm(t,26.5,27.2)),arm:.9,armUp:.4+.5*Math.sin(t*2.2)*sp*.5+.2*sm(t,25.4,26),bow:.2+.15*sm(t,8,10)})}
// ---- 2: road to Mosul ----
function sceneMosul(t){roadScene(t,{s0:'#4A5C9A',s1:'#E8A878',s2:'#FFD8A0',sx:1500,sy:700,sr:700,sc:'#FFD890',sa:.6,m0:'#9A7A7A',g0:'#8A6A5A',g1:'#C9A070',g2:'#6A4A3A',city:true,cx:1420,cs:1.0,cc:'#A8967A',
 fn:(t,gy)=>{label(t,'MOSUL',28.9,31.8,190);
 walkSal(t,27.2,31.0,150,1000,gy,.78);
 const mt=sm(t,31.0,31.6);if(mt>0){const bw=sm(t,32.6,33.3)*(1-sm(t,35.3,36.0));const wl=sm(t,36.4,37.0);
  person(1180,gy+8,.95,Object.assign({},T2,{f:-1,alpha:mt,aN:[L(.5,1.1,wl),L(2.5,1.2,wl)],aF:[.4,2.45]}));
  person(1000,gy+12,.78,Object.assign({},BOY,{f:1,tilt:.12*bw,aN:[L(.1,.8,sm(t,31.1,31.8)),L(.14,1.0,sm(t,31.1,31.8))],aF:[-.1,.4]}))}}});
 const d=sm(t,37.3,38.1);if(d>0){g.fillStyle=rgba('#FFF0C0',.15*d*(1-sm(t,38.2,39)));g.fillRect(0,0,W,H)}}
// ---- 3: serving, the best of men ----
function sceneServe(t){TNOW=t;const gl=sm(t,39.4,41.0);const wg=g.createLinearGradient(0,0,0,H);wg.addColorStop(0,mixc('#5A4A3A','#8A6E48',gl));wg.addColorStop(1,mixc('#3A2E24','#5A4630',gl));g.fillStyle=wg;g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(60,40,20,.12)';g.lineWidth=2;for(let r=0;r<10;r++)for(let k=0;k<16;k++)g.strokeRect(k*130-(r%2)*65,r*90,130,90);
 g.save();archPath(520,150,260,460);g.clip();g.fillStyle=mixc('#B8C8E8','#FFE0A0',gl);g.fillRect(380,140,280,480);g.restore();archPath(520,150,260,460);g.strokeStyle='#5A4430';g.lineWidth=22;g.stroke();
 g.save();g.globalCompositeOperation='lighter';g.fillStyle=rgba('#FFE7A8',.18+.12*gl);g.beginPath();g.moveTo(420,420);g.lineTo(620,420);g.lineTo(1000,880);g.lineTo(560,880);g.closePath();g.fill();g.restore();
 const fg=g.createLinearGradient(0,860,0,H);fg.addColorStop(0,'#5A4630');fg.addColorStop(1,'#2A2018');g.fillStyle=fg;g.fillRect(0,860,W,H-860);g.fillStyle='#8A4A3A';g.beginPath();g.moveTo(780,890);g.lineTo(1500,890);g.lineTo(1580,1000);g.lineTo(700,1000);g.closePath();g.fill();
 const pr=.5+.5*Math.sin(t*.9);const st=sm(t,36.9,37.8);
 person(1240,868,.98,Object.assign({},T2,{f:-1,kneel:.85*st,aN:[L(.5,.7+.7*pr,st),L(2.5,2.4,st)],aF:[L(.4,.6+.6*pr,st),L(2.45,2.3,st)],head:-.05-.12*pr*st,rim:'#FFE0A0',rimA:.5}));
 // Salman sweeps
 const sw=Math.sin(t*3)*.5;person(860,868,.8,Object.assign({},BOY,{f:1,aN:[.7+sw*.5,.9+sw*.5],aF:[.6,.8],tilt:.1*sw,head:.1}));
 g.strokeStyle='#6A4A2A';g.lineWidth=6;g.beginPath();g.moveTo(960+sw*60,858);g.lineTo(900+sw*30,720);g.stroke();
 for(let i=0;i<8;i++){const u=((t*.5+i*.13)%1);g.fillStyle=rgba('#FFE7A8',.4*(1-u)*(.3+.7*gl));g.fillRect(700+R(i)*500,820-u*300,3,3)}
 g.save();g.globalCompositeOperation='lighter';glow(1240,700,600*gl+100,'#FFD890',.3*gl);g.restore();
 g.fillStyle=rgba('#FFF0C0',.2*sm(t,41.4,42.0)*(1-sm(t,42.0,42.4)));g.fillRect(0,0,W,H);vig(.35)}
// ---- 4: the second teacher ----
function sceneSecond(t){const c=.55+.2*sm(t,42.2,44.0);const lamp=1-.5*sm(t,42.3,44.0)+.3*sm(t,50.5,52);
 const sp=win(t,49.1,54.6,.4);deathRoom(t,{c:c,robe:T3,lamp:lamp,far:sm(t,52.3,53.5)*(1-sm(t,54.5,55.3)),arm:.9,armUp:.1+.25*sp*(.5+.5*Math.sin(t*2.4))+.5*sm(t,52.3,53),bow:.15+.3*sm(t,45,46.5)*(1-sm(t,49.1,50))})
 label(t,'NISIBIS',52.4,55.0,150,null,true)}
// ---- 5: Nisibis, and the years pass ----
function sceneNisibis(t){const dayK=sm(t,57.7,60.6);const ap=Math.sin(Math.PI*dayK);
 roadScene(t,{s0:mixc('#6A8AC0','#4A5C9A',ap*0+0),s1:'#F2D8B0',s2:'#FFE8C0',sx:L(300,1700,dayK),sy:L(700,260,Math.sin(Math.PI*dayK)),sr:600,sc:'#FFF0C0',sa:.55,m0:'#B8A890',g0:'#9A8060',g1:'#CBA878',g2:'#7A5A44',city:true,cx:1380,cs:1.0,cc:'#B0A084',ph:1.3,
 fn:(t,gy)=>{const k=dayK;if(t>57.6&&t<60.8){g.fillStyle=rgba('#FFF4D0',1);g.beginPath();g.arc(L(160,1760,k),L(640,200,Math.sin(Math.PI*k)),60,0,7);g.fill()}
  walkSal(t,55.2,57.1,150,900,gy,.78);
  if(t>57.1){const w=sm(t,57.1,57.7);person(1040,gy+8,.95,Object.assign({},T3,{f:-1,alpha:w}));const sx=900;person(sx,gy+12,.78,Object.assign({},BOY,{f:1,aN:[.5,2.5],aF:[.4,2.45],tilt:.04*Math.sin(t*3)}))}}});
 if(t>57.6&&t<60.8){const n=Math.sin(Math.PI*dayK);g.fillStyle=rgba('#0A1030',.45*(1-n*1.2>0?1-n*1.2:0));g.fillRect(0,0,W,H)}
 label(t,'NISIBIS',55.8,58.0,190)}
// ---- 6: the third teacher ----
function sceneThird(t){const c=.55;deathRoom(t,{c:c,robe:{robe:'#6A7088',turban:'#D8D0BC',beard:true},lamp:.5+.4*sm(t,63.4,64.2),far:0,dawn:.25*sm(t,64.5,66),arm:.9,armUp:.5*sm(t,63.5,64.3)*(1-sm(t,65.8,66.3)),bow:.35})}
// ---- 7: Amuriyah, work, cows and sheep ----
function sceneAmuriyah(t){const sun=sm(t,67,73);roadScene(t,{s0:mixc('#7A9AD0','#5A4A8A',sun),s1:mixc('#C8E0F0','#F0A070',sun),s2:mixc('#F0F0D0','#FFD890',sun),sx:L(700,500,sun),sy:L(300,720,sun),sr:700,sc:'#FFD890',sa:.55,m0:'#8AA088',g0:'#6A9A5A',g1:mixc('#7AA860','#9A8A50',sun),g2:mixc('#3A5A34','#4A3A2A',sun),city:true,cx:1560,cs:.8,cc:'#9A9482',ph:2.1,
 fn:(t,gy)=>{label(t,'AMURIYAH  ·  RUM',66.9,69.8,190);
  const ph=t*3;const ca=sm(t,70.9,72.0);
  [[880,1],[1010,.9],[1150,1.05]].forEach((p,i)=>{const a=ca*(i==0?1:sm(t,71.1+i*.3,72.4+i*.3));if(a<.01)return;g.save();g.globalAlpha*=a;cow(p[0]+Math.sin(t*.4+i)*10,gy-6+i*8,p[1]*.7,ph+i,-1,['#9A6A4A','#B08A68','#7A5A44'][i]);g.restore()});
  [[1260,0],[1330,1],[1400,2],[1470,3]].forEach((p,i)=>{const a=sm(t,71.8+i*.15,72.8+i*.15);if(a<.01)return;g.save();g.globalAlpha*=a;sheep(p[0]+Math.sin(t*.5+i)*8,gy+4+(i%2)*10,.9,ph+i*2,-1);g.restore()});
  const wk=cl((t-65.9)/4.0);const x=L(150,640,eio(wk));const am=(wk>0&&wk<1)?1:0;const w=Math.PI*(x-150)/82;const ss=swingArms(w,am);const lift=win(t,69.2,73,.4);
  person(x,gy+12,.8,Object.assign({},BOY,{f:1,w:w,amp:am,aN:am?ss.aN:[L(.1,.5,lift*.5),.2],aF:am?ss.aF:[.1,.3],rim:'#FFD890',rimA:.4+.3*sun,head:-.04*lift}))}});
 g.fillStyle=rgba('#FFD890',.05*sun);g.fillRect(0,0,W,H);vig(.3)}


function camel(x,y,s,ph,col,f,rim){g.save();g.translate(x,y);g.scale(s*f,s);g.strokeStyle=col;g.fillStyle=col;g.lineCap='round';g.lineJoin='round';g.lineWidth=14;
 [[-72,0],[-46,Math.PI],[46,Math.PI*.5],[72,Math.PI*1.5]].forEach(l=>{const a=Math.sin(ph+l[1])*.45,hx=l[0],hy=-132,kx=hx+Math.sin(a)*62,ky=hy+Math.cos(a)*62,fx=kx+Math.sin(a*.5)*62,fy=Math.min(0,ky+Math.cos(a*.5)*62);g.beginPath();g.moveTo(hx,hy);g.lineTo(kx,ky);g.lineTo(fx,fy);g.stroke()});
 g.beginPath();g.ellipse(0,-152,98,44,0,0,7);g.fill();g.beginPath();g.ellipse(-5,-186,36,32,0,Math.PI,0);g.fill();
 g.fillStyle=mixc(col,'#7A5A3A',.5);g.fillRect(-60,-200,50,34);g.fillRect(2,-206,44,36);g.fillStyle=col;
 g.lineWidth=26;g.beginPath();g.moveTo(76,-160);g.quadraticCurveTo(122,-196,128,-250);g.stroke();g.beginPath();g.ellipse(144,-262,30,15,-.35,0,7);g.fill();
 g.lineWidth=6;g.beginPath();g.moveTo(-96,-160);g.quadraticCurveTo(-120,-130,-112,-90+Math.sin(ph*2)*10);g.stroke();
 if(rim){g.strokeStyle=rgba(rim,.55);g.lineWidth=3;g.beginPath();g.ellipse(0,-152,98,44,0,Math.PI*1.05,Math.PI*1.95);g.stroke()}
 g.restore()}
// ================= MINUTE 5 SCENES =================
const T5={robe:'#7A6A88',turban:'#D8D0BC',beard:true},MERCH=[{robe:'#4A5A6A',turban:'#CFC6B0',beard:true},{robe:'#6A4A3A',turban:'#E8DCC0'},{robe:'#5A6A4A',turban:'#CFC6B0',beard:true},{robe:'#7A5A4A',turban:'#D8CDB0'}];
function palm(x,y,h,col,lean,t){g.save();g.translate(x,y);g.strokeStyle=col;g.fillStyle=col;g.lineCap='round';g.lineWidth=Math.max(5,h*.045);const tx=lean*h*.2;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(tx*.4,-h*.5,tx,-h);g.stroke();
 for(let i=0;i<9;i++){const a=-Math.PI*.95+i*Math.PI*.1+Math.sin(t*.8+i+x)*.03,len=h*.42;g.lineWidth=Math.max(3,h*.025);g.beginPath();g.moveTo(tx,-h);g.quadraticCurveTo(tx+Math.cos(a)*len*.6,-h+Math.sin(a)*len*.9-h*.05,tx+Math.cos(a)*len,-h+Math.sin(a)*len+h*.1);g.stroke()}g.restore()}
function stars(n,seed,a,t){for(let i=0;i<n;i++){g.fillStyle=rgba('#FFF4DC',a*(.3+.7*R(i+seed))*(.6+.4*Math.sin(t*3+i)));g.fillRect(R(i+seed+3)*W,R(i+seed+9)*H*.6,2.4,2.4)}}
function seal(cx,cy,r,a,t){g.save();g.translate(cx,cy);g.globalAlpha*=a;g.save();g.globalCompositeOperation='lighter';glow(0,0,r*3,'#FFD890',.7);g.restore();g.strokeStyle='#FFE7A8';g.lineWidth=5;g.fillStyle=rgba('#FFE7A8',.12);
 g.beginPath();g.arc(0,0,r,0,7);g.fill();g.stroke();g.lineWidth=3;g.beginPath();g.arc(0,0,r*.82,0,7);g.stroke();g.rotate(t*.15);
 for(let k=0;k<2;k++){g.rotate(Math.PI/8);g.beginPath();for(let i=0;i<8;i++){const an=i*Math.PI/4,px=Math.cos(an)*r*.7,py=Math.sin(an)*r*.7;i?g.lineTo(px,py):g.moveTo(px,py)}g.closePath();g.stroke()}
 g.restore()}
// 1: Amuriyah death room
function sceneA(t){const c=.45;deathRoom(t,{c:c,robe:T5,lamp:.9,far:0,arm:.9,armUp:.35+.3*sm(t,6,7)*Math.sin(t*2.2)*.5,bow:.25,fx:null})}
// 2: the teacher speaks - light grows in the window
function sceneB(t){const k=sm(t,15.8,19.5);const u=1-sm(t,38.8,40.2);
 deathRoom(t,{c:.5-.3*k,robe:T5,lamp:.9,far:0,dawn:0,arm:.9,armUp:.45+.35*Math.sin(t*2.2)*.5+.3*sm(t,40.0,40.8),bow:.2});
 g.save();g.globalCompositeOperation='lighter';glow(1480,360,L(80,900,k)*u,'#FFD890',.5*k*u);g.fillStyle=rgba('#FFE7A8',.1*k*u);g.beginPath();g.moveTo(1380,300);g.lineTo(1580,300);g.lineTo(1000,900);g.lineTo(600,900);g.closePath();g.fill();g.restore()}
// 3: religion of Ibrahim: star-filled night with a pure light
function sceneIbrahim(t){TNOW=t;const u=t-19.0;sky('#05081C','#1A2250','#3A3A6A');stars(90,5,1,t);g.save();g.globalCompositeOperation='lighter';const k=sm(t,19.4,21.4)*(1-sm(t,21.8,22.4));glow(960,420,L(60,620,k),'#FFE7A8',.7*k);g.restore();
 g.fillStyle=rgba('#FFF4D0',k);g.beginPath();g.arc(960,420,L(4,22,k),0,7);g.fill();ridge(900,40,.003,20,.009,.4,'#0A0C1C',0);label(t,'THE RELIGION OF IBRAHIM',19.6,22.0,780,null,true);vig(.5)}
// 4: land of the Arabs
function sceneArabs(t){TNOW=t;const k=sm(t,22.2,24.0);const x=(t-22)*14;sky(mixc('#1A2250','#6A5AA0',k),mixc('#6A4A6A','#FFB27A',k),mixc('#C98A6A','#FFE0A0',k));
 g.save();g.globalCompositeOperation='lighter';glow(1300,720,800,'#FFD890',.5*k);g.restore();ridge(780,60,.0021,30,.006,1.0,'#C98A6A',x*.3);ridge(830,70,.0027,26,.007,2.4,'#A86A58',x*.6);ridge(900,60,.003,24,.009,.5,'#7A4A4A',x);
 const gy=910;const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#B07A58');pg.addColorStop(1,'#4A2E34');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 g.fillStyle=rgba('#FFF4D0',.9*k);g.beginPath();g.arc(1300,700-k*40,70,0,7);g.fill();label(t,'THE LAND OF THE ARABS',22.4,24.8,190,null,true);vig(.35)}
// 5: between two lava fields, palms between
function sceneLava(t){TNOW=t;const k=sm(t,24.6,26.6);sky('#2A1830','#6A3A3A','#E8A070');g.save();g.globalCompositeOperation='lighter';glow(960,700,900,'#FFC890',.4+.2*k);g.restore();
 // dark lava fields left and right
 [[0,1],[W,-1]].forEach(([x0,d],i)=>{g.fillStyle='#120C10';g.beginPath();g.moveTo(x0,H);g.lineTo(x0,620);for(let x=0;x<=760;x+=40){const X=x0+d*x;g.lineTo(X,620+x*.22-18*Math.sin(x*.05+i)-10*R(x+i))}g.lineTo(x0+d*760,H);g.closePath();g.fill();g.strokeStyle='rgba(255,140,60,.15)';g.lineWidth=2;for(let m=0;m<9;m++){g.beginPath();const sx=x0+d*(60+m*80);g.moveTo(sx,820+m*8);g.lineTo(sx+d*30,860+m*8);g.stroke()}});
 const gy=880;const vg=g.createLinearGradient(0,gy-60,0,H);vg.addColorStop(0,'#6A4A34');vg.addColorStop(1,'#2A1A18');g.fillStyle=vg;g.beginPath();g.moveTo(560,H);g.lineTo(760,gy-40);g.lineTo(1160,gy-40);g.lineTo(1360,H);g.closePath();g.fill();
 [[780,160,-.3],[860,210,.1],[940,260,0],[1020,230,-.1],[1100,190,.2],[1160,140,.3]].forEach((p,i)=>{const a=sm(t,25.2+i*.25,26.2+i*.25);if(a<.01)return;g.save();g.globalAlpha*=a;palm(p[0],gy-30+(i%2)*8,p[1]*(.6+.4*a),'#0E1410',p[2],t);g.restore()});
 label(t,'BETWEEN TWO LAVA FIELDS',25.0,28.0,190,null,true);vig(.5)}
// 6: signs: gift not charity
function sceneSigns(t){TNOW=t;const g1=sm(t,30.2,31.8);const wg=g.createLinearGradient(0,0,0,H);wg.addColorStop(0,'#2A2230');wg.addColorStop(1,'#120E18');g.fillStyle=wg;g.fillRect(0,0,W,H);
 g.save();g.globalCompositeOperation='lighter';glow(960,560,900,'#FFC890',.18+.12*g1);g.restore();
 const fy=800;g.fillStyle='#2A2028';g.fillRect(0,fy,W,H);
 // gift tray of dates
 const ga=sm(t,32.4,33.2)*(1-sm(t,33.6,34.2));
 const ba=sm(t,33.8,34.6);
 function dish(x,gl,a,col){g.save();g.globalAlpha*=a;g.fillStyle=col;g.beginPath();g.ellipse(x,fy-10,190,34,0,0,7);g.fill();g.fillStyle=mixc(col,'#000',.3);g.beginPath();g.ellipse(x,fy-26,160,24,0,0,7);g.fill();
  for(let i=0;i<14;i++){const px=x-120+(i%7)*40+(Math.floor(i/7))*16,py=fy-44-Math.floor(i/7)*18;g.fillStyle=mixc('#6A3A1E','#C98A4A',gl);g.beginPath();g.ellipse(px,py,22,12,.2,0,7);g.fill()}
  if(gl>0){g.save();g.globalCompositeOperation='lighter';glow(x,fy-60,300,'#FFD890',.6*gl);g.restore()}g.restore()}
 dish(700,1,Math.max(sm(t,32.4,33.0),0)*(t<35.4?1:Math.max(0,1-(t-35.4)*2)),'#8A6A3A');
 // charity basket
 const bk=sm(t,33.8,34.5)*(t<35.4?1:Math.max(0,1-(t-35.4)*2));g.save();g.globalAlpha*=bk;g.fillStyle='#4A4A50';g.beginPath();g.ellipse(1260,fy-10,150,28,0,0,7);g.fill();g.fillStyle='#3A3A40';g.fillRect(1110,fy-80,300,70);g.beginPath();g.ellipse(1260,fy-80,150,24,0,0,7);g.fill();g.restore();
 label(t,'HE EATS A GIFT',32.4,33.9,300);label(t,'BUT NOT CHARITY',33.8,35.6,300);
 // seal of prophethood, drawn as abstract light only
 const sl=sm(t,36.0,37.6)*(1-sm(t,39.2,39.8));if(sl>0)seal(960,520,150,sl,t);label(t,'THE SEAL OF PROPHETHOOD',36.4,39.0,780,null,true);vig(.5)}
// 7: death, then years in Amuriyah (time-lapse)
function sceneStay(t){const k=sm(t,45.5,48.6);roadScene(t,{s0:mixc('#6A8AC0','#5A4A8A',k*.3),s1:'#E8D8B8',s2:'#FFE0A0',sx:L(300,1700,k),sy:L(700,260,Math.sin(Math.PI*k)),sr:600,sc:'#FFF0C0',sa:.55,m0:'#8AA088',g0:'#6A9A5A',g1:'#7AA860',g2:'#3A5A34',city:true,cx:1560,cs:.8,cc:'#9A9482',ph:2.1,fn:(t,gy)=>{
  g.fillStyle=rgba('#FFF4D0',1);g.beginPath();g.arc(L(160,1760,k),L(640,200,Math.sin(Math.PI*k)),60,0,7);g.fill();
  [[850,1],[980,.9]].forEach((p,i)=>cow(p[0],gy-6+i*8,p[1]*.7,t*3+i,-1,['#9A6A4A','#B08A68'][i]));[[1120,0],[1200,1],[1280,2]].forEach((p,i)=>sheep(p[0],gy+4+(i%2)*10,.9,t*3+i*2,-1));
  person(620,gy+12,.8,Object.assign({},BOY,{f:1,aN:[.3,.2],aF:[.1,.3],head:-.04}))}});
 const n=Math.sin(Math.PI*k);g.fillStyle=rgba('#0A1030',.35*Math.max(0,1-n*1.4)*sm(t,45.6,46.0));g.fillRect(0,0,W,H)}
function sceneDeath(t){const u=sm(t,42.6,44.2);deathRoom(t,{c:.55+.2*u,robe:T5,lamp:1-.9*u,far:0,arm:.9,armUp:.4*(1-u),bow:.3+.3*u});
 g.fillStyle=rgba('#0A1030',.2*u);g.fillRect(0,0,W,H)}
// 8: merchants of Kalb arrive
function duneBack(t,X,top,mid,bot,sc){sky(top,mid,bot);g.save();g.globalCompositeOperation='lighter';glow(1300,700,800,'#FFD890',.5);g.restore();ridge(780,60,.0021,30,.006,1.0,'#C98A6A',X*.2);ridge(830,70,.0027,26,.007,2.4,'#A86A58',X*.4);ridge(900,60,.003,24,.009,.5,'#7A4A4A',X*.8);
 const gy=910;const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#B07A58');pg.addColorStop(1,'#4A2E34');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);return gy}
function sceneMerchants(t){TNOW=t;const gy=duneBack(t,0,'#5A7AB0','#F2D8B0','#FFE8C0');const k=sm(t,48.9,51.6);const ph=t*3.4;
 [[0,0],[1,1]].forEach((c,i)=>{const x=L(2300+i*320,1180+i*340,k);camel(x,gy+10,.7,ph+i*1.3,'#4A3426',-1,'#FFE0A0')});
 MERCH.forEach((m,i)=>{const x=L(2160+i*120,1000+i*110,k);const w=ph+i*1.7;const sa=swingArms(w,k<1?1:0);person(x,gy+26,.7,Object.assign({},m,{f:-1,w:w,amp:k<1?1:0,aN:sa.aN,aF:sa.aF}))});
 const sw=sm(t,52.8,53.4);person(440,gy+22,.8,Object.assign({},BOY,{f:1,aN:[L(.3,1.2,sw),L(.2,1.3,sw)],aF:[.1,.3],head:-.05}));
 label(t,'THE ARABS OF KALB',49.6,52.2,190);vig(.3)}
// 9: the deal - cows and flock
function sceneDeal(t){TNOW=t;const gy=duneBack(t,0,'#5A7AB0','#F2D8B0','#FFE8C0');const gv=sm(t,60.3,62.4);const ph=t*3;
 MERCH.forEach((m,i)=>{const nod=(t>59.2&&t<60.4)?.12*Math.sin((t-59.2)*8):0;person(1180+i*100,gy+26,.7,Object.assign({},m,{f:-1,aN:[.5,2.5],aF:[.4,2.45],head:nod}))});
 [[620,1],[740,.9],[860,1.05]].forEach((p,i)=>cow(L(p[0],1060+i*40,gv)+Math.sin(t*.4+i)*6,gy-50+i*8,p[1]*.7,ph+i,1,['#9A6A4A','#B08A68','#7A5A44'][i]));
 [[520,0],[570,1],[640,2],[700,3]].forEach((p,i)=>sheep(L(p[0],1000+i*50,gv),gy-14+(i%2)*10,.85,ph+i*2,1));
 const ofr=sm(t,55.0,56.0);person(330,gy+22,.8,Object.assign({},BOY,{f:1,aN:[L(.3,1.3,ofr*(1-gv)),L(.2,1.4,ofr*(1-gv))],aF:[.1,.3],head:-.05}));vig(.3)}
// 10: journey and Wadi al-Qura
function sceneJourney(t){TNOW=t;const u=t-60.9;const X=u*90;const red=sm(t,64.0,66.3);sky(mixc('#6A5AA0','#4A1A22',red),mixc('#FFB27A','#C0502A',red),mixc('#FFE0A0','#E8784A',red));
 g.save();g.globalCompositeOperation='lighter';glow(1300,660,700,'#FFD890',.6);g.restore();g.fillStyle=mixc('#FFF4D0','#FFB07A',red);g.beginPath();g.arc(1300,660-u*6,92,0,7);g.fill();
 ridge(780,60,.0021,30,.006,1.0,mixc('#C98A6A','#6A2E34',red),X*.2);ridge(830,70,.0027,26,.007,2.4,mixc('#A86A58','#4A222A',red),X*.4);
 const oa=sm(t,63.6,65.0);if(oa>0)[[1500,170],[1580,220],[1660,190],[1740,150],[1820,210]].forEach((p,i)=>palm(p[0],880,p[1]*oa,mixc('#2A3A2A','#1A1014',red),(i%2?-.2:.2),t));
 label(t,'WADI AL-QURA',64.0,66.4,190,null,true);
 const gy=910;const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,mixc('#B07A58','#6A3028',red));pg.addColorStop(1,mixc('#4A2E34','#1A0C10',red));g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 const ph=t*3.4,stop=1-sm(t,63.9,65.0);const sp=stop;
 [[360,0],[1040,1]].forEach((c,i)=>camel(c[0]+(1-sp)*0,gy+10,.7,ph*sp+c[1],'#2A1A28',1,'#FFC47A'));
 MERCH.forEach((m,i)=>{const x=[520,640,1180,1260][i];const w=ph*sp+i;const sa=swingArms(w,sp>.05?1:0);person(x,gy+26,.66,Object.assign({},m,{f:i<2?1:-1,w:w,amp:sp>.05?1:0,aN:sa.aN,aF:sa.aF,shade:.3+.4*red,rim:'#FFC47A',rimA:.5}))});
 person(860,gy+28,.66,Object.assign({},BOY,{f:1,w:ph*sp,amp:sp>.05?1:0,aN:swingArms(ph*sp,sp>.05?1:0).aN,aF:swingArms(ph*sp,sp>.05?1:0).aF,head:.2*red,tilt:.05*red,rim:'#FFC47A',rimA:.6}));
 g.fillStyle=rgba('#6A1010',.2*red);g.fillRect(0,0,W,H);vig(.35+.3*red)}
// 11: sold
function sceneSold(t){TNOW=t;const k=sm(t,67.2,68.2);sky('#2A1A34','#8A3A3A','#E8784A');g.save();g.globalCompositeOperation='lighter';glow(900,760,700,'#FF8A4A',.4);g.restore();
 ridge(800,40,.003,20,.008,.6,'#4A2A3A',0);const gy=900;const gg=g.createLinearGradient(0,gy-40,0,H);gg.addColorStop(0,'#3A2230');gg.addColorStop(1,'#120A12');g.fillStyle=gg;g.fillRect(0,gy-40,W,H);
 [[1560,180,-.2],[1660,230,.1],[1760,200,0],[1860,160,.2]].forEach(p=>palm(p[0],gy-30,p[1],'#0E0810',p[2],t));
 MERCH.forEach((m,i)=>person(1040+i*90-(i>1?0:0)+k*(60),gy+10,.7,Object.assign({},m,{f:1,aN:[.5,2.5],aF:[.4,2.45],shade:.5,rim:'#FF8A4A',rimA:.5,alpha:1-k*.85,head:.15})));
 person(640,gy+16,.82,Object.assign({},BOY,{f:1,aN:[.1,.3],aF:[.1,.2],head:.3,shade:.2,rim:'#FF8A4A',rimA:.7,tilt:.05}));
 const bm=sm(t,67.8,68.8);person(L(1500,900,bm),gy+10,.95,{f:-1,robe:'#3A4A6A',trim:'#9AA0B0',turban:'#E8E0D0',beard:true,w:Math.PI*bm*8,amp:bm>0&&bm<1?1:0,aN:[.5,2.5],aF:[.4,2.45],alpha:bm,shade:.3,rim:'#FF8A4A',rimA:.4});
 g.fillStyle=rgba('#7A1010',.15);g.fillRect(0,0,W,H);vig(.55)}


// ================= MINUTE 6 SCENES =================
function coinAt(x,y,r,a){g.fillStyle=rgba('#F2C94C',a);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle=rgba('#FFF2A8',a*.8);g.beginPath();g.arc(x-r*.25,y-r*.25,r*.4,0,7);g.fill()}
const BUYER={robe:'#3A4A6A',trim:'#9AA0B0',turban:'#E8E0D0',beard:true},MASTER={robe:'#6A3A3A',trim:'#C9A050',turban:'#E8DCC0',beard:true},COUSIN={robe:'#5A6A4A',turban:'#CFC6B0',beard:true};
function bigPalm(x,y,h,col,lean,t,sc){g.save();g.translate(x,y);g.strokeStyle=col;g.fillStyle=col;g.lineCap='round';const tx=lean*h*.12;g.lineWidth=h*.06;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(tx*.3,-h*.5,tx,-h);g.stroke();
 g.strokeStyle=mixc(col,'#000',.25);g.lineWidth=2;for(let i=0;i<14;i++){const yy=-h*(i/14);g.beginPath();g.moveTo(-h*.03+tx*(i/14)*.9,yy);g.lineTo(h*.03+tx*(i/14)*.9,yy-6);g.stroke()}
 g.strokeStyle=col;for(let i=0;i<11;i++){const a=-Math.PI*.98+i*Math.PI*.098+Math.sin(t*.8+i+x)*.03,len=h*.5;g.lineWidth=h*.03;g.beginPath();g.moveTo(tx,-h);g.quadraticCurveTo(tx+Math.cos(a)*len*.6,-h+Math.sin(a)*len*.9-h*.06,tx+Math.cos(a)*len,-h+Math.sin(a)*len+h*.12);g.stroke()}
 g.restore();return [x+tx,y-h]}
function groveSky(tod){const d=tod;sky(mixc('#5A8AD0','#4A3A7A',d),mixc('#CFE4F0','#F0A070',d),mixc('#F8F0D8','#FFD890',d));g.save();g.globalCompositeOperation='lighter';glow(1500,360+d*340,520,mixc('#FFF4D0','#FFC890',d),.5);g.restore();clouds(TNOW,'#FFFFFF',.35,140,6,5)}
function groveGround(gy,d){const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,mixc('#B89A68','#8A6A48',d));pg.addColorStop(1,mixc('#6A5034','#2A1E18',d));g.fillStyle=pg;g.fillRect(0,gy-30,W,H)}
function lavaRidges(d){[[0,1],[W,-1]].forEach(([x0,dir],i)=>{g.fillStyle=mixc('#2A1E22','#0E0A10',d);g.beginPath();g.moveTo(x0,H);g.lineTo(x0,640);for(let x=0;x<=620;x+=40){g.lineTo(x0+dir*x,640+x*.2-16*Math.sin(x*.05+i)-8*R(x+i))}g.lineTo(x0+dir*620,H);g.closePath();g.fill()})}
function townSil(cx,gy,s,col){g.save();g.translate(cx,gy);g.scale(s,s);g.fillStyle=col;[[-380,110,150],[-250,90,190],[-130,120,140],[0,100,230],[130,130,170],[270,100,200],[390,110,150]].forEach((b,i)=>{g.fillRect(b[0]-b[1]/2,-b[2],b[1],b[2]);g.fillRect(b[0]-b[1]/2-4,-b[2]-8,b[1]+8,10)});g.fillStyle='rgba(255,200,120,.5)';[[-250,-120],[0,-150],[130,-110],[270,-130]].forEach(w=>g.fillRect(w[0]-6,w[1],12,18));g.restore()}
function walkP(x0,x1,t,a,b,gy,s,o){const k=cl((t-a)/(b-a)),x=L(x0,x1,eio(k)),am=(k>0&&k<1)?1:0,w=Math.PI*(x-x0)/80,sa=swingArms(w,am);return person(x,gy+12,s,Object.assign({f:1,w:w,amp:am,aN:sa.aN,aF:sa.aF},o))}

// 1: Wadi al-Qura, hope then doubt
function s1(t){TNOW=t;const dub=sm(t,7.2,8.0);const d=.55;groveSky(d);const gy=880;
 ridge(760,50,.003,22,.008,.7,mixc('#8A6A6A','#5A4A5A',dub),0);
 [[1300,300],[1420,360],[1540,320],[1660,380],[1780,300],[1880,340]].forEach((p,i)=>{const a=sm(t,.3+i*.2,1.6+i*.2);g.save();g.globalAlpha*=a;palm(p[0],gy-10,p[1]*(.7+.3*a),mixc('#2A3A2A','#1C2420',dub),(i%2?-.25:.25),t);g.restore()});
 groveGround(gy,d);label(t,'WADI AL-QURA',.2,3.0,190,null,true);
 g.save();g.globalCompositeOperation='lighter';glow(1560,620,L(420,200,dub),'#FFD890',L(.35,.05,dub));g.restore();
 const bw=Math.sin(t*1.2)*.04;person(560,gy+16,.82,Object.assign({},BOY,{f:1,aN:[.1,.3],aF:[.1,.2],head:-.12+.3*dub,tilt:bw,rim:'#FFC890',rimA:.5}));
 g.fillStyle=rgba('#3A3A44',.25*dub);g.fillRect(0,0,W,H);vig(.35+.2*dub)}
// 2: bought by the cousin from Banu Qurayza, taken toward Madinah
function s2(t){TNOW=t;const d=.45+.2*sm(t,13,15.5);sky(mixc('#6A8AC0','#5A4A8A',d),mixc('#E8D8B8','#F0A070',d),mixc('#FFE8C0','#FFD890',d));g.save();g.globalCompositeOperation='lighter';glow(1400,700,700,'#FFD890',.5);g.restore();
 const X=Math.max(0,t-12.6)*90;ridge(780,60,.0021,30,.006,1.0,mixc('#C98A6A','#8A5A5A',d),X*.2);ridge(830,70,.0027,26,.007,2.4,mixc('#A86A58','#6A3A44',d),X*.4);const gy=910;
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#B07A58');pg.addColorStop(1,'#4A2E34');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 label(t,'BANU QURAYZA',11.2,13.6,190,null,true);
 // purse handed over
 const ex=sm(t,12.4,13.0);const mx=1000;const k=sm(t,12.6,15.2);const walk=cl((t-13.4)/2.4);
 const ox=L(0,900,eio(walk));
 // old master (stays)
 person(1560-ox*.0,gy+22,.82,Object.assign({},MASTER,{f:-1,alpha:1-sm(t,13.8,15.0),aN:[L(.5,1.2,ex*(1-sm(t,13.2,13.8))),L(2.5,1.3,ex*(1-sm(t,13.2,13.8)))],aF:[.4,2.45]}));
 const bx=L(1080,1080+ox,1),sx=L(660,660+ox,1);const am=(walk>0&&walk<1)?1:0;const w=Math.PI*ox/80;const sa=swingArms(w,am);
 person(bx,gy+22,.86,Object.assign({},BUYER,{f:1,w:w,amp:am,aN:am?sa.aN:[L(.5,1.3,ex),L(2.5,1.4,ex)],aF:am?sa.aF:[.4,2.45]}));
 person(sx,gy+22,.78,Object.assign({},BOY,{f:1,w:w+1,amp:am,aN:am?sa.aN:[.1,.3],aF:am?sa.aF:[.1,.2],head:am?0:.25}));
 if(t>12.4&&t<13.4){const u=(t-12.4)/1.0;coinAt(L(1080,1560,u),gy-200-Math.sin(u*Math.PI)*60,12,1)}
 vig(.3)}
// 3: Madinah, recognized
function s3(t){TNOW=t;const rec=sm(t,19.6,21.2);sky('#6A8AC0','#F2D8B0','#FFE8C0');g.save();g.globalCompositeOperation='lighter';glow(960,620,900,'#FFD890',.4+.3*rec);g.restore();
 ridge(760,50,.003,22,.008,.2,'#C2A890',0);lavaRidges(0);const gy=880;townSil(960,gy-70,1.1,'#B8A080');
 [[520,260],[640,300],[760,240],[1160,250],[1280,300],[1400,260]].forEach((p,i)=>palm(p[0],gy-40,p[1],'#2A4A2A',(i<3?-.2:.2),t));
 groveGround(gy,0);label(t,'MADINAH',15.6,18.6,190,null,true);
 const k=cl((t-14.9)/3.8);const x=L(-100,860,eio(k));const am=(k>0&&k<1)?1:0;const w=Math.PI*(x+100)/80;const sa=swingArms(w,am);
 person(x-130,gy+20,.86,Object.assign({},BUYER,{f:1,w:w,amp:am,aN:sa.aN,aF:sa.aF}));
 person(x,gy+22,.78,Object.assign({},BOY,{f:1,w:w+1,amp:am,aN:am?sa.aN:[.5+.2*rec,.5],aF:am?sa.aF:[.4,.4],head:-.18*rec,rim:'#FFE7A8',rimA:.7*rec}));
 g.fillStyle=rgba('#FFF4D0',.18*rec*(1-sm(t,21.4,22.2)));g.fillRect(0,0,W,H);vig(.3)}
// 4: the years: Salman at work; the light from Makkah; the migration
function s4(t){TNOW=t;const dayK=((t-22)/3.2)%1;const d=.5*(1-Math.cos(Math.PI*2*dayK))*.35;const mk=sm(t,23.6,25.4);const mig=sm(t,33.9,36.0);
 groveSky(d);const gy=880;ridge(790,50,.003,22,.008,.9,mixc('#B8A090','#6A5A6A',d),0);
 [[300,330],[520,360],[1180,340],[1420,360],[1660,330]].forEach((p,i)=>palm(p[0],gy-10,p[1],'#2A4A2A',(i%2?-.2:.2),t));groveGround(gy,d);
 // water bucket work
 const sw=Math.sin(t*3.2);const bx=940+Math.sin(t*.9)*340;const f=Math.cos(t*.9)>0?1:-1;const w=t*3.2;const sa=swingArms(w,1);
 person(bx,gy+22,.8,Object.assign({},BOY,{f:f,w:w,amp:1,aN:[.5,.5],aF:[.5,.5],head:.12,tilt:.04*sw}));
 g.strokeStyle='#4A3220';g.lineWidth=4;g.beginPath();g.moveTo(bx-30*f,gy-130);g.lineTo(bx+50*f,gy-130);g.stroke();g.fillStyle='#8A6A3A';g.fillRect(bx+40*f-12,gy-130,24,26);
 // light from the direction of Makkah (abstract only)
 if(mk>0){const a=mk*(1-sm(t,31.8,33.0));g.save();g.globalCompositeOperation='lighter';glow(0,640,900*a,'#FFE7A8',.55*a);g.fillStyle=rgba('#FFE7A8',.1*a);g.beginPath();g.moveTo(0,300);g.lineTo(0,820);g.lineTo(1200,860);g.lineTo(1200,760);g.closePath();g.fill();g.restore()}
 label(t,'MAKKAH',24.6,28.0,190,null,true);
 // migration: a light travels along a path across the desert toward Madinah
 if(mig>0){const u=cl((t-33.9)/2.6);g.save();g.strokeStyle=rgba('#FFE7A8',.35*mig);g.setLineDash([10,16]);g.lineWidth=3;g.beginPath();g.moveTo(0,700);g.quadraticCurveTo(700,640,1300,760);g.stroke();g.setLineDash([]);
  const px=L(0,1300,eio(u)),py=700+(1-Math.pow(1-eio(u),2))*0+(Math.sin(eio(u)*Math.PI)*-30)+eio(u)*60;g.globalCompositeOperation='lighter';glow(px,py,150,'#FFE7A8',.9*mig);g.fillStyle=rgba('#FFF4D0',mig);g.beginPath();g.arc(px,py,9,0,7);g.fill();g.restore()}
 label(t,'THEN HE MIGRATED TO MADINAH',34.0,37.0,300,null,true);
 const nt=sm(t,33.9,36.0);g.fillStyle=rgba('#0A1030',0);vig(.3)}
// 5: top of the palm, master below, cousin arrives
function s5(t){TNOW=t;const d=.15+.1*sm(t,45,55);groveSky(d);const gy=880;ridge(790,50,.003,22,.008,.9,'#B8A090',0);
 [[280,330],[480,360],[1560,340],[1760,360]].forEach((p,i)=>palm(p[0],gy-10,p[1],'#2A4A2A',(i%2?-.2:.2),t));groveGround(gy,d);
 const top=bigPalm(1100,gy,560,'#4A3A28',.4,t);
 // Salman at the crown, working on the fronds
 const wk=Math.sin(t*3.0);person(top[0]-40,top[1]+120,.52,Object.assign({},BOY,{f:1,kneel:.85,aN:[.9+.4*wk,1.0],aF:[.8-.3*wk,.9],head:.15,tilt:.05*wk}));
 // master sits underneath
 g.fillStyle='#8A4A3A';g.beginPath();g.ellipse(840,gy+4,150,22,0,0,7);g.fill();
 person(840,gy+30,.86,Object.assign({},MASTER,{f:1,kneel:.9,aN:[.7,.8],aF:[.6,.7],head:t>46&&t<56?.05*Math.sin(t*2):0}));
 // cousin arrives and speaks
 const k=sm(t,44.4,45.8);const cx=L(-120,520,k);const am=(k>0&&k<1)?1:0;const w=Math.PI*(cx+120)/80;const sa=swingArms(w,am);const sp=win(t,46.0,55.2,.3);
 person(cx,gy+24,.9,Object.assign({},COUSIN,{f:1,w:w,amp:am,aN:am?sa.aN:[L(.5,1.6+.4*Math.sin(t*5),sp),L(2.5,1.8,sp)],aF:am?sa.aF:[.4,2.45],head:-.1*sp}));
 if(t>48.0&&t<51)label(t,'THE AWS AND THE KHAZRAJ',48.0,50.8,190);
 if(t>51.0)label(t,'QUBA',51.0,55.0,190,null,true);vig(.3)}
// 6: trembling
function s6(t){TNOW=t;const u=sm(t,60.6,61.4);const sh=Math.sin(t*38)*5*u*(1-sm(t,64,65.3));groveSky(.15);const gy=880;g.save();g.translate(sh,Math.sin(t*41)*3*u);
 ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.15);const top=bigPalm(1100,gy,560,'#4A3A28',.4,t);
 const tr=Math.sin(t*34)*.08*u;person(top[0]-40,top[1]+120,.52,Object.assign({},BOY,{f:1,kneel:.85,aN:[1.0,1.1],aF:[.9,1.0],head:.15,tilt:tr+.1*sm(t,63.4,64.6)}));
 g.fillStyle='#8A4A3A';g.beginPath();g.ellipse(840,gy+4,150,22,0,0,7);g.fill();person(840,gy+30,.86,Object.assign({},MASTER,{f:1,kneel:.9,aN:[.7,.8],aF:[.6,.7]}));person(520,gy+24,.9,Object.assign({},COUSIN,{f:1,aN:[.5,2.5],aF:[.4,2.45]}));g.restore();
 g.save();const vg=g.createRadialGradient(960,540,200,960,540,1100);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(10,10,30,${.55*u})`);g.fillStyle=vg;g.fillRect(0,0,W,H);g.restore()}
// 7: climbing down and asking
function s7(t){TNOW=t;groveSky(.15);const gy=880;ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.15);bigPalm(1100,gy,560,'#4A3A28',.4,t);
 const dn=sm(t,66.0,67.6);const top=[1100+.4*560*.12,gy-560];const sy=L(top[1]+120,gy+22,dn);const sx=L(top[0]-40,980,dn);
 person(sx,sy,L(.52,.78,dn),Object.assign({},BOY,{f:1,kneel:.85*(1-dn),aN:[.9,1.0],aF:[.8,.9],head:.1}));
 g.fillStyle='#8A4A3A';g.beginPath();g.ellipse(840,gy+4,150,22,0,0,7);g.fill();person(840,gy+30,.86,Object.assign({},MASTER,{f:1,kneel:.9,aN:[.7,.8],aF:[.6,.7]}));person(520,gy+24,.9,Object.assign({},COUSIN,{f:1,aN:[.5,2.5],aF:[.4,2.45]}));vig(.3)}
// 8: the blow
function s8(t){TNOW=t;const hit=sm(t,73.7,73.85);const rage=sm(t,70.2,71.8);groveSky(.2);const gy=880;ridge(790,50,.003,22,.008,.9,mixc('#B8A090','#6A4A4A',rage),0);groveGround(gy,.2);bigPalm(1100,gy,560,'#4A3A28',.4,t);
 const back=sm(t,76.0,77.4);
 person(520,gy+24,.9,Object.assign({},COUSIN,{f:1,aN:[.5,2.5],aF:[.4,2.45]}));
 const mk=.5+.5*Math.sin(t*14);const blowT=(t>73.5&&t<74.1)?1:0;
 const mx=L(840,760,sm(t,71.8,72.8)*(1-sm(t,74.1,74.8)));
 person(mx,gy+22,.9,Object.assign({},MASTER,{f:1,aN:[L(.5,1.6+.5*blowT,rage),L(2.5,1.8,rage)],aF:[.4,2.45],head:-.15*rage,rim:'#FF8A4A',rimA:.5*rage}));
 const sx=L(1060,960,back*0);const snap=(t>73.7&&t<74.4)?-.5*Math.exp(-(t-73.7)*6):0;
 person(980,gy+22,.78,Object.assign({},BOY,{f:-1,aN:[.1,.3],aF:[.1,.2],head:snap+.15*(1-hit),tilt:snap*.3,rim:'#FFC890',rimA:.3}));
 g.fillStyle=rgba('#7A1010',.22*rage*(1-sm(t,74.6,75.6)));g.fillRect(0,0,W,H);if(t>73.7&&t<73.95){g.fillStyle=rgba('#FFFFFF',.35*(1-(t-73.7)/.25));g.fillRect(0,0,W,H)}
 vig(.4+.2*rage)}
// 9: back to work; hope at dusk
function s9(t){TNOW=t;const d=sm(t,75.5,77.8)*.7+.2;groveSky(d);const gy=880;ridge(790,50,.003,22,.008,.9,mixc('#B8A090','#5A4A5A',d),0);groveGround(gy,d);
 const top=bigPalm(1100,gy,560,'#3A2E22',.4,t);const up=sm(t,76.3,77.6);
 person(L(980,top[0]-40,up),L(gy+22,top[1]+120,up),L(.78,.52,up),Object.assign({},BOY,{f:1,kneel:.85*up,aN:[.5,1.0],aF:[.4,.9],head:.1}));
 g.save();g.globalCompositeOperation='lighter';glow(1500,720,500,'#FFC890',.3*sm(t,76,78));g.restore();vig(.45)}


// ================= MINUTE 7 SCENES =================
const COMP=[{robe:'#7A6A58',turban:'#CFC6B0',beard:true},{robe:'#5A6A6A',hair:'#1c140f'},{robe:'#6A5A6A',turban:'#D8D0BC'},{robe:'#8A7A5A',hair:'#1c140f',beard:true},{robe:'#5A5A4A',turban:'#CFC6B0'},{robe:'#6A6A7A',hair:'#1c140f'}];
function lightPillar(x,gy,t,k){if(k<=0)return;g.save();g.globalCompositeOperation='lighter';
 const bg=g.createLinearGradient(0,gy-760,0,gy);bg.addColorStop(0,rgba('#FFE7A8',0));bg.addColorStop(.7,rgba('#FFE7A8',.22*k));bg.addColorStop(1,rgba('#FFD890',.4*k));g.fillStyle=bg;g.beginPath();g.moveTo(x-34,gy-760);g.lineTo(x+34,gy-760);g.lineTo(x+120,gy);g.lineTo(x-120,gy);g.closePath();g.fill();
 glow(x,gy-150,520,'#FFD890',.55*k);glow(x,gy-40,300,'#FFF4D0',.5*k);
 for(let i=0;i<16;i++){const u=((t*.3+i*.0625)%1);g.fillStyle=rgba('#FFF4D0',.7*(1-u)*k);g.fillRect(x+Math.sin(i*2.3+t)*90*(u+.2),gy-40-u*620,3,3)}g.restore()}
function tray(x,y,s,a,gl){g.save();g.globalAlpha*=a;g.translate(x,y);g.scale(s,s);g.fillStyle='#6A4A2A';g.beginPath();g.ellipse(0,0,120,24,0,0,7);g.fill();g.fillStyle='#8A6A3A';g.beginPath();g.ellipse(0,-6,104,18,0,0,7);g.fill();
 for(let i=0;i<9;i++){g.fillStyle=mixc('#6A3A1E','#E8B060',gl);g.beginPath();g.ellipse(-70+i*17.5,-16-(i%3)*3,15,9,.2,0,7);g.fill()}
 if(gl>0){g.save();g.globalCompositeOperation='lighter';glow(0,-20,220,'#FFD890',.6*gl);g.restore()}g.restore()}
function circle(cx,gy,t,eatK,sitK,skip){const pts=[[cx-360,-1],[cx-250,-1],[cx-140,-1],[cx+140,1],[cx+250,1],[cx+360,1]];pts.forEach((p,i)=>{const lean=eatK>0?.08*Math.sin(t*3+i*1.7)*eatK:0;person(p[0],gy+10+(i%2)*6,.78,Object.assign({},COMP[i],{f:p[1]==-1?1:-1,kneel:.9,aN:[L(.6,1.3,eatK*(.5+.5*Math.sin(t*2.2+i))),L(.8,1.4,eatK)],aF:[.5,1.0],tilt:lean,head:.05,rim:'#FFE0A0',rimA:.45*sitK,alpha:sitK}))})}
function duskSky(d){sky(mixc('#6A5AA0','#0A1030',d),mixc('#FFB27A','#3A2A5A',d),mixc('#FFE0A0','#B85A4A',d))}
function quba(t,d,gy){duskSky(d);if(d>.5)stars(60,2,(d-.5)*2,t);ridge(800,50,.003,22,.008,.4,mixc('#8A5A6A','#14102A',d),0);
 [[200,330],[360,360],[1560,340],[1740,360],[1880,320]].forEach((p,i)=>palm(p[0],gy-10,p[1],mixc('#1E2E22','#06100C',d),(i%2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,mixc('#9A7A58','#2A2220',d));pg.addColorStop(1,mixc('#4A3426','#0C0A0C',d));g.fillStyle=pg;g.fillRect(0,gy-30,W,H)}
function numeral(n,x,y,a,t){g.save();g.globalAlpha*=a;g.textAlign='center';g.font='260px LoraB';g.shadowColor='rgba(255,200,100,.8)';g.shadowBlur=60;g.fillStyle='#FFE7A8';g.fillText(n,x,y);g.restore()}

// 1: gathering something, walking to Quba
function a1(t){TNOW=t;const gy=880;const d=.35+.25*sm(t,0,5);duskSky(d);ridge(800,50,.003,22,.008,.4,mixc('#8A5A6A','#2A1E3A',d),0);
 [[300,330],[520,360],[1180,340],[1420,360],[1660,330]].forEach((p,i)=>palm(p[0],gy-10,p[1],mixc('#1E2E22','#0A1410',d),(i%2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#8A6A4A');pg.addColorStop(1,'#3A2A22');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 label(t,'THAT EVENING',.0,1.8,190,null,true);label(t,'QUBA',4.6,7.2,190,null,true);
 const k=cl((t-3.2)/3.6);const x=L(380,1250,eio(k));const am=(k>0&&k<1)?1:0;const w=Math.PI*(x-380)/80;const sa=swingArms(w,am);
 const gat=sm(t,1.1,2.6);
 person(x,gy+22,.8,Object.assign({},BOY,{f:1,w:w,amp:am,aN:am?[.9,1.0]:[L(.3,1.2,gat),.5],aF:am?[.8,.9]:[.2,.4],head:.1*(1-am)}));
 if(t>1.1){g.fillStyle='#E8D8B0';g.beginPath();g.ellipse(x+54,gy-120+(am?0:20*(1-gat)),30,20,.1,0,7);g.fill();g.fillStyle=rgba('#C98A4A',1);g.beginPath();g.arc(x+48,gy-134+(am?0:20*(1-gat)),9,0,7);g.fill()}
 const far=sm(t,4.8,6.6);lightPillar(1600,gy,t,.8*far);vig(.35)}
// 2: speaking before the light, offering
function a2(t){TNOW=t;const gy=880;const d=.65;quba(t,d,gy);lightPillar(960,gy,t,sm(t,7.0,8.0));
 circle(960,gy,t,0,1);
 const bow=sm(t,7.8,8.6);const place=sm(t,21.3,22.6);const x=L(1700,1250,eio(sm(t,6.6,8.0)));
 // Salman kneels at the front, offering the bundle
 const off=sm(t,14.6,16.2)*(1-place);person(L(x,720,sm(t,7.8,8.8)),gy+60,.9,Object.assign({},BOY,{f:1,kneel:.9*bow,aN:[L(.3,1.3,off),L(.2,1.4,off)],aF:[.2,.4],head:-.1*bow+.1*Math.sin(t*3)*(win(t,8.3,21,.3)),rim:'#FFE0A0',rimA:.7}));
 tray(960,gy+34,.9,place,0);
 if(t>13.5&&t<14.7)label(t,'THE COMPANIONS WERE STRANGERS IN NEED',13.4,14.8,190);
 vig(.45)}
// 3: eat — the light does not move
function a3(t){TNOW=t;const gy=880;quba(t,.7,gy);lightPillar(960,gy,t,1);const eat=sm(t,26.6,27.8)*(1-sm(t,30.8,31.5));
 circle(960,gy,t,eat,1);tray(960,gy+34,.9,1-.8*sm(t,28,30.6),0);
 person(720,gy+60,.9,Object.assign({},BOY,{f:1,kneel:.9,aN:[.9,.8],aF:[.8,.7],head:-.12,rim:'#FFE0A0',rimA:.7}));
 g.save();g.globalCompositeOperation='lighter';const hold=sm(t,27.6,28.6)*(1-sm(t,30.5,31.3));glow(960,gy-90,200*hold,'#FFFFFF',.15*hold);g.restore();vig(.45)}
// 4: this is one
function a4(t){TNOW=t;const gy=880;const d=.8;duskSky(d);stars(80,5,1,t);ridge(840,40,.003,22,.008,.2,'#0C0A1C',0);const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#2A2220');pg.addColorStop(1,'#0C0A0C');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 lightPillar(1560,gy,t,.5);const k=sm(t,31.7,33.0);person(760,gy+22,.8,Object.assign({},BOY,{f:1,aN:[.2,.3],aF:[.1,.2],head:-.2*k,rim:'#FFE0A0',rimA:.7}));
 numeral('1',960,520,sm(t,33.6,34.4)*(1-sm(t,35.4,36.0)),t);vig(.5)}
// 5: leaves, gathers more, the light moves to Madinah
function a5(t){TNOW=t;const gy=880;const d=.8-.4*sm(t,37.5,41);duskSky(d);if(d>.5)stars(60,5,(d-.5)*2,t);ridge(800,50,.003,22,.008,.4,mixc('#8A5A6A','#14102A',d),0);lavaRidges(d);
 [[520,260],[640,300],[1280,300],[1400,260]].forEach((p,i)=>palm(p[0],gy-30,p[1],mixc('#2A4A2A','#08100C',d),(i<2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,mixc('#9A7A58','#2A2220',d));pg.addColorStop(1,'#1A1210');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 townSil(1000,gy-70,.9,mixc('#B8A080','#2A2430',d));
 const mv=sm(t,39.0,41.6);label(t,'THE MESSENGER HAD MOVED TO MADINAH',39.2,42.2,190,null,true);
 // abstract light travels from left (Quba) to town
 const lx=L(100,1000,eio(mv));g.save();g.globalCompositeOperation='lighter';glow(lx,gy-120,260,'#FFE7A8',.8*(.3+.7*sm(t,38.8,39.6)));g.restore();
 // Salman gathers, walks
 const gat=sm(t,36.8,38.0);const k=cl((t-39.2)/2.8);const x=L(260,640,eio(k));const am=(k>0&&k<1)?1:0;const w=Math.PI*(x-260)/80;
 person(x,gy+22,.8,Object.assign({},BOY,{f:1,w:w,amp:am,aN:am?[.9,1.0]:[L(.2,1.2,gat),.5],aF:am?[.8,.9]:[.1,.4],rim:'#FFE0A0',rimA:.4}));vig(.4)}
// 6: in Madinah, the gift
function a6(t){TNOW=t;const gy=880;const d=.35;duskSky(d);ridge(800,50,.003,22,.008,.2,'#6A4A5A',0);lavaRidges(d);townSil(1500,gy-70,.7,'#7A6A68');
 [[180,300],[360,340],[1700,320],[1860,300]].forEach((p,i)=>palm(p[0],gy-20,p[1],'#1E2E22',(i%2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#9A7A58');pg.addColorStop(1,'#3A2A22');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 lightPillar(960,gy,t,sm(t,43.0,44.2));circle(960,gy,t,0,sm(t,42.4,43.4));
 const off=sm(t,48.0,49.2);const place=sm(t,50.2,51.0);const x=L(1700,720,eio(sm(t,41.6,43.6)));
 person(x,gy+60,.9,Object.assign({},BOY,{f:1,kneel:.9*sm(t,43.4,44.4),aN:[L(.3,1.3,off*(1-place)),L(.2,1.4,off*(1-place))],aF:[.2,.4],head:-.1,rim:'#FFE0A0',rimA:.7}));
 tray(960,gy+34,.9,place,sm(t,50,51.2));
 label(t,'THIS IS A GIFT',47.6,50.8,300);vig(.4)}
// 7: the Messenger eats; companions eat
function a7(t){TNOW=t;const gy=880;const g1=sm(t,51.5,53.0);duskSky(.3);ridge(800,50,.003,22,.008,.2,'#6A4A5A',0);lavaRidges(.3);townSil(1500,gy-70,.7,'#7A6A68');
 [[180,300],[360,340],[1700,320],[1860,300]].forEach((p,i)=>palm(p[0],gy-20,p[1],'#1E2E22',(i%2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#9A7A58');pg.addColorStop(1,'#3A2A22');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 lightPillar(960,gy,t,1+.3*g1);const eat=sm(t,53.6,54.6);circle(960,gy,t,eat,1);
 tray(960,gy+34,.9,1-.7*sm(t,54.6,56.4),1-g1*0);
 person(720,gy+60,.9,Object.assign({},BOY,{f:1,kneel:.9,aN:[.9,.8],aF:[.8,.7],head:-.1,rim:'#FFE0A0',rimA:.7}));
 g.save();g.globalCompositeOperation='lighter';glow(960,gy-60,700*g1,'#FFD890',.4*g1);g.restore();vig(.4)}
// 8: this is two
function a8(t){TNOW=t;const gy=880;const d=.5;duskSky(d);stars(60,7,.8,t);ridge(840,40,.003,22,.008,.2,'#2A1E3A',0);const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#3A2A28');pg.addColorStop(1,'#0C0A0C');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 lightPillar(1560,gy,t,.8);person(760,gy+22,.8,Object.assign({},BOY,{f:1,aN:[.2,.3],aF:[.1,.2],head:-.25,rim:'#FFE0A0',rimA:.7}));
 numeral('1',760,520,.6,t);numeral('2',1160,520,sm(t,59.4,60.2),t);g.fillStyle=rgba('#FFD890',.08*sm(t,59.4,60.4));g.fillRect(0,0,W,H);vig(.5)}


// ================= MINUTE 8 SCENES =================
function mound(x,y,w,h,col){g.fillStyle=col;g.beginPath();g.moveTo(x-w/2,y);g.quadraticCurveTo(x,y-h*1.6,x+w/2,y);g.closePath();g.fill()}
function graves(gy,d){for(let i=0;i<14;i++){const x=80+i*140+R(i)*50,y=gy+30+(i%3)*14;mound(x,y,90,24,mixc('#8A6A52','#2A2020',d));g.fillStyle=mixc('#6A5444','#1A1414',d);g.fillRect(x-4,y-34,8,24)}}
function sapling(x,y,s,a){g.save();g.globalAlpha*=a;g.translate(x,y);g.scale(s,s);g.strokeStyle='#4A3A22';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(0,0);g.lineTo(0,-60);g.stroke();g.strokeStyle='#3A7A3A';g.lineWidth=4;[-1,1].forEach(d=>{g.beginPath();g.moveTo(0,-60);g.quadraticCurveTo(d*26,-86,d*40,-60);g.stroke();g.beginPath();g.moveTo(0,-60);g.quadraticCurveTo(d*16,-100,d*18,-84);g.stroke()});g.restore()}
function goldBar(x,y,s,a,t){g.save();g.globalAlpha*=a;g.translate(x,y);g.scale(s,s);g.fillStyle='#E0B040';g.beginPath();g.moveTo(-60,0);g.lineTo(60,0);g.lineTo(44,-34);g.lineTo(-44,-34);g.closePath();g.fill();g.fillStyle='#FFE08A';g.beginPath();g.moveTo(-44,-34);g.lineTo(44,-34);g.lineTo(38,-44);g.lineTo(-38,-44);g.closePath();g.fill();g.save();g.globalCompositeOperation='lighter';glow(0,-30,120,'#FFD870',.5);g.restore();g.restore()}
function story(icon,x,y,a,t){g.save();g.globalAlpha*=a;g.translate(x,y);if(icon==0){flame(0,0,50,t,.9,1)}else if(icon==1){g.scale(.2,.2);drawChchurchSafe()}else if(icon==2){g.scale(.35,.35);camel(0,0,1,t*3,'#FFE0A0',1,null)}else{palm(0,40,120,'#7ACA7A',0,t)}g.restore()}
function drawChchurchDummy(){}
function drawChurchSafe(){drawChurch(0,0,0,0)}
function baq(t,d,gy){duskSky(d);if(d>.5)stars(50,3,(d-.5)*2,t);ridge(820,50,.003,22,.008,.7,mixc('#8A5A6A','#14102A',d),0);
 [[160,300],[1760,330],[1880,290]].forEach((p,i)=>palm(p[0],gy-10,p[1],mixc('#1E2E22','#06100C',d),(i%2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,mixc('#9A7A58','#2A2220',d));pg.addColorStop(1,mixc('#4A3426','#0C0A0C',d));g.fillStyle=pg;g.fillRect(0,gy-30,W,H);graves(gy,d)}

// 1: Salman walks to Baqi
function b1(t){TNOW=t;const gy=880;baq(t,.55,gy);label(t,"BAQI AL-GHARQAD",.0,3.2,190,null,true);
 lightPillar(1500,gy,t,.8*sm(t,1.5,3));const k=cl((t-.4)/4.2);const x=L(150,980,eio(k));const am=(k>0&&k<1)?1:0;const w=Math.PI*(x-150)/80;
 person(x,gy+50,.8,Object.assign({},BOY,{f:1,w:w,amp:am,aN:am?[.9,1.0]:[.2,.3],aF:am?[.8,.9]:[.1,.2],head:-.05,rim:'#FFE0A0',rimA:.4}));vig(.4)}
// 2: the funeral and the circle
function b2(t){TNOW=t;const gy=880;baq(t,.6,gy);lightPillar(1220,gy,t,1);
 // bier with a shrouded form, mourners
 g.fillStyle='#4A3220';g.fillRect(360,gy+8,300,18);g.fillStyle='#E8E0D0';g.beginPath();g.moveTo(370,gy+8);g.quadraticCurveTo(380,gy-50,460,gy-48);g.lineTo(600,gy-46);g.quadraticCurveTo(650,gy-44,650,gy+8);g.closePath();g.fill();g.fillStyle='rgba(0,0,0,.14)';g.fillRect(370,gy-6,280,14);
 [[300,0],[700,1]].forEach((p,i)=>person(p[0],gy+44,.78,Object.assign({},COMP[i],{f:i?-1:1,aN:[.5,2.5],aF:[.4,2.45],head:.15,shade:.2})));
 circle(1220,gy-4,t,0,sm(t,10.8,12.0));
 label(t,'HE HAD FOLLOWED A FUNERAL',8.4,11.0,190);
 const x=L(980,860,sm(t,6.4,8.0));person(x,gy+50,.8,Object.assign({},BOY,{f:1,aN:[.2,.3],aF:[.1,.2],head:-.05,rim:'#FFE0A0',rimA:.4}));vig(.45)}
// 3: greets, moves around to the back
function b3(t){TNOW=t;const gy=880;baq(t,.65,gy);lightPillar(1100,gy,t,1);circle(1100,gy-4,t,0,1);
 const gr=sm(t,14.6,15.6);const mv=sm(t,16.3,18.6);const px=L(760,1100,0)+0;
 // path around the pillar: front-left -> over the top -> back (smaller, behind)
 const ang=Math.PI*mv;const sx=1100-Math.cos(ang)*340;const sy=gy+60-Math.sin(ang)*70;const sc=L(.85,.6,Math.sin(ang));
 const behind=Math.sin(ang)>.3?1:0;
 g.save();g.globalAlpha*=1;person(sx,sy,sc,Object.assign({},BOY,{f:(Math.cos(ang)>-.2?1:-1)*(mv>0&&mv<1?1:1),aN:[L(.2,.8,gr*(1-mv)),.3],aF:[.2,.4],head:-.1,rim:'#FFE0A0',rimA:.6,alpha:1}));g.restore();
 label(t,'FOR THE SEAL HIS TEACHER HAD DESCRIBED',18.6,21.0,190,null,true);vig(.45)}
// 4: he knew; the cloak falls; the seal
function b4(t){TNOW=t;const gy=880;baq(t,.65,gy);const kn=sm(t,23.1,24.0)*(1-sm(t,26.5,27.2));const fall=sm(t,27.9,29.6);
 lightPillar(1100,gy,t,1+.3*kn);circle(1100,gy-4,t,0,1);
 // light-cloak: a golden veil dropping
 if(fall>0&&fall<1.01){g.save();g.globalCompositeOperation='lighter';const cy=gy-640+fall*620;const gr=g.createLinearGradient(0,gy-700,0,cy);gr.addColorStop(0,rgba('#FFE7A8',0));gr.addColorStop(1,rgba('#FFE7A8',.5*(1-fall*.5)));g.fillStyle=gr;g.beginPath();g.moveTo(1010,gy-700);g.lineTo(1190,gy-700);g.lineTo(1230+fall*40,cy);g.lineTo(970-fall*40,cy);g.closePath();g.fill();g.restore()}
 const sl=sm(t,28.6,30.2);if(sl>0)seal(1100,gy-380,L(40,110,sl),sl,t);
 person(640,gy+54,.82,Object.assign({},BOY,{f:1,aN:[.2,.3],aF:[.1,.2],head:-.12,rim:'#FFE0A0',rimA:.7}));
 g.save();g.globalCompositeOperation='lighter';glow(1100,gy-380,500*kn,'#FFFFFF',.2*kn);g.restore();vig(.45)}
// 5: he recognizes the seal, falls weeping
function b5(t){TNOW=t;const gy=880;const d=.65;baq(t,d,gy);lightPillar(1100,gy,t,1);circle(1100,gy-4,t,0,1);
 seal(1100,gy-380,110,1,t);const rec=sm(t,32.2,33.4);const fl=sm(t,34.3,35.2);
 const x=L(640,900,fl);person(x,gy+54,.82,Object.assign({},BOY,{f:1,kneel:.9*fl,aN:[L(.2,1.5,fl),L(.3,1.6,fl)],aF:[.2,.8],head:-.12+.4*fl,tilt:.15*fl,rim:'#FFE0A0',rimA:.8}));
 // tears
 if(t>35.4)for(let i=0;i<8;i++){const u=((t*.9+i*.125)%1);g.fillStyle=rgba('#DDEEFF',.8*(1-u));g.beginPath();g.arc(x+34+Math.sin(i)*6,gy+10+u*50,3.4,0,7);g.fill()}
 g.fillStyle=rgba('#FFF4D0',.12*rec*(1-sm(t,33.8,34.4)));g.fillRect(0,0,W,H);vig(.45)}
// 6: come around, he tells his story
function b6(t){TNOW=t;const gy=880;baq(t,.65,gy);lightPillar(1100,gy,t,1);
 const lean=sm(t,40,41.5);circle(1100,gy-4,t,0,1);
 // companions turn to listen: slight sway
 const sx=L(960,800,sm(t,40.4,41.8));const sit=sm(t,41.4,42.4);
 person(sx,gy+58,.84,Object.assign({},BOY,{f:1,kneel:.9*sit,aN:[L(.2,.9+.2*Math.sin(t*2.6),sit),.7],aF:[.2,.6],head:-.05+.05*Math.sin(t*2),rim:'#FFE0A0',rimA:.7}));
 // story vignettes rising above Salman
 for(let i=0;i<4;i++){const t0=42.4+i*.65,u=(t-t0)/2.2;if(u<0||u>1)continue;const a=Math.sin(u*Math.PI);g.save();g.globalAlpha*=a;g.translate(sx+(i-1.5)*120,gy-300-u*280);if(i==0)flame(0,0,46,t,.9,2);else if(i==1){g.scale(.16,.16);drawChurch(0,0,0,0)}else if(i==2){g.scale(.3,.3);camel(0,0,1,t*3,'#FFE0A0',1,null)}else{palm(0,40,110,'#7ACA7A',0,t)}g.restore()}
 g.save();g.globalCompositeOperation='lighter';glow(sx,gy-200,260,'#FFD890',.15);g.restore();vig(.45)}
// 7: embraces Islam; slavery keeps him busy until Badr and Uhud
function b7(t){TNOW=t;const gy=880;const is=sm(t,47.6,49.6);const busy=sm(t,50.6,51.4);const dayK=((t-50.6)/1.6)%1;const d=L(.65,0,is)*(1-busy)+busy*(.5*(1-Math.cos(Math.PI*2*dayK))*.5);
 if(t<50.6){baq(t,d,gy);lightPillar(1100,gy,t,1-.4*sm(t,49,50.5));}else{groveSky(d);ridge(790,50,.003,22,.008,.9,mixc('#B8A090','#6A5A6A',d),0);[[300,330],[520,360],[1500,340],[1740,360]].forEach((p,i)=>palm(p[0],gy-10,p[1],'#2A4A2A',(i%2?-.2:.2),t));groveGround(gy,d)}
 if(t<50.6){const pr=.5+.5*Math.sin(t*1.3);g.save();g.globalCompositeOperation='lighter';glow(860,gy-160,500*is,'#FFE7A8',.45*is);g.restore();
  person(860,gy+58,.84,Object.assign({},BOY,{f:1,aN:[L(.2,2.6,is),L(.3,2.8,is)],aF:[.2,2.4],head:-.2*is,rim:'#FFE7A8',rimA:.8*is}))}
 else{const bx=940+Math.sin(t*1.1)*340;const f=Math.cos(t*1.1)>0?1:-1;const w=t*3.2;person(bx,gy+22,.8,Object.assign({},BOY,{f:f,w:w,amp:1,aN:[.5,.5],aF:[.5,.5],head:.12}));g.strokeStyle='#4A3220';g.lineWidth=4;g.beginPath();g.moveTo(bx-30*f,gy-130);g.lineTo(bx+50*f,gy-130);g.stroke();g.fillStyle='#8A6A3A';g.fillRect(bx+40*f-12,gy-130,24,26);
  if(t>51.6)g.fillStyle='#FFE7A8';label(t,'BADR',52.0,53.4,190,null,true);label(t,'UHUD',53.0,54.8,190,null,true)}
 label(t,'ISLAM',47.8,50.2,190,null,true);
 if(t>50.6&&t<55){g.fillStyle=rgba('#0A1030',.35*(1-Math.sin(Math.PI*dayK)*1.4>0?1-Math.sin(Math.PI*dayK)*1.4:0));g.fillRect(0,0,W,H)}vig(.35)}
// 8: the contract
function b8(t){TNOW=t;const gy=880;groveSky(.25);ridge(790,50,.003,22,.008,.9,'#B8A090',0);[[300,330],[520,360],[1560,340],[1760,360]].forEach((p,i)=>palm(p[0],gy-10,p[1],'#2A4A2A',(i%2?-.2:.2),t));groveGround(gy,.25);
 lightPillar(1560,gy,t,.8*sm(t,55.7,57));
 const sc=sm(t,58.6,60);person(700,gy+30,.84,Object.assign({},MASTER,{f:1,aN:[.5,1.2],aF:[.4,1.1],head:.05}));person(1000,gy+30,.8,Object.assign({},BOY,{f:-1,aN:[.5,1.2],aF:[.4,1.1],head:-.05,rim:'#FFE0A0',rimA:.4}));
 if(sc>0){g.save();g.globalAlpha*=sc;g.translate(850,gy-120-20*Math.sin(t*2));g.fillStyle='#F2E6C4';g.fillRect(-60,-34,120,68);g.fillStyle='#D8C89A';g.fillRect(-72,-40,14,80);g.fillRect(58,-40,14,80);g.fillStyle='#8A6A3A';for(let i=0;i<4;i++)g.fillRect(-44,-20+i*14,88-(i%2)*30,3);g.restore()}
 label(t,'A CONTRACT FOR HIS FREEDOM',58.6,62.4,190,null,true);vig(.35)}
// 9: the terms: 300 palms and 40 ounces of gold
function b9(t){TNOW=t;const gy=880;groveSky(.3);ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.3);
 const n=Math.floor(300*sm(t,63.6,65.0));
 // rows of saplings
 for(let r=0;r<3;r++)for(let i=0;i<16;i++){const idx=r*16+i;const a=sm(t,63.6+idx*.02,64.2+idx*.02)*(t<65.4?1:1);sapling(120+i*105+r*30,gy-10+r*28,.55+r*.12,a)}
 // grow to fruit palms
 const gr=sm(t,65.4,67.4);if(gr>0)for(let i=0;i<7;i++){g.save();g.globalAlpha*=gr;palm(160+i*270,gy-10,L(60,260,gr),'#2A4A2A',(i%2?-.2:.2),t);g.restore()}
 numeral('300',960,430,sm(t,63.8,64.6)*(1-sm(t,65.6,66.2)),t);
 const go=sm(t,68.1,69.0);for(let i=0;i<5;i++)goldBar(780+i*100-(i>2?50:0),gy+40-(i>2?50:0),1.1,go*sm(t,68.1+i*.12,68.7+i*.12),t);
 numeral('40',960,430,go*(1-sm(t,70.0,70.4)),t);label(t,'OUNCES OF GOLD',68.4,70.2,500,null,true);vig(.4)}
// 10: help your brother
function b10(t){TNOW=t;const gy=880;const d=.15;groveSky(d);ridge(790,50,.003,22,.008,.9,'#B8A090',0);[[200,330],[360,360],[1560,340],[1760,360]].forEach((p,i)=>palm(p[0],gy-10,p[1],'#2A4A2A',(i%2?-.2:.2),t));groveGround(gy,d);
 lightPillar(1480,gy,t,.9);const k=sm(t,72.0,73.6);
 person(960,gy+40,.82,Object.assign({},BOY,{f:1,aN:[.2,.3],aF:[.1,.2],head:-.12,rim:'#FFE0A0',rimA:.7}));
 [0,1,2,3,4,5].forEach(i=>{const left=i<3;const fx=left?-120-i*100:2040+(i-3)*100;const tx=left?(560+i*110):(1260+(i-3)*110);const x=L(fx,tx,sm(t,70.8+i*.15,72.6+i*.15));const am=(x!=tx)?1:0;const w=Math.PI*Math.abs(x-fx)/80;const sa=swingArms(w,am);
  person(x,gy+34+(i%2)*10,.78,Object.assign({},COMP[i],{f:left?1:-1,w:w,amp:am,aN:[.9,1.0],aF:[.8,.9],rim:'#FFE0A0',rimA:.5}));sapling(x+(left?36:-36),gy-60+(i%2)*10,.5,1)});
 g.save();g.globalCompositeOperation='lighter';glow(960,gy-200,700*k,'#FFD890',.35*k);g.restore();vig(.35)}


// ================= MINUTE 9 SCENES =================
function eggGold(x,y,s,a,t){g.save();g.globalAlpha*=a;g.translate(x,y);g.rotate(Math.sin(t*1.3)*.15);g.scale(s,s);const gr=g.createRadialGradient(-12,-16,4,0,0,50);gr.addColorStop(0,'#FFF4B0');gr.addColorStop(.5,'#F2C94C');gr.addColorStop(1,'#A8741A');g.fillStyle=gr;g.beginPath();g.ellipse(0,0,36,46,0,0,7);g.fill();g.save();g.globalCompositeOperation='lighter';glow(0,0,170,'#FFD870',.8);g.restore();for(let i=0;i<5;i++){const u=((t*.7+i*.2)%1);g.fillStyle=rgba('#FFF4C0',(1-u)*.9);g.fillRect(-30+i*14,-40-u*50,3,3)}g.restore()}
function cuff(x,y,s,open,fall,a){g.save();g.globalAlpha*=a;g.translate(x,y+fall);g.rotate(fall*.004);g.scale(s,s);g.strokeStyle='#8A8A92';g.lineWidth=16;g.lineCap='round';g.beginPath();g.arc(0,0,48,Math.PI*(.15+.3*open),Math.PI*(2-.15-.3*open*0));g.stroke();g.strokeStyle='#B8B8C0';g.lineWidth=5;g.beginPath();g.arc(0,0,48,Math.PI*1.1,Math.PI*1.6);g.stroke();g.fillStyle='#6A6A72';g.fillRect(-14,40,28,22);g.restore()}
function scaleBal(x,y,t,k){g.save();g.translate(x,y);g.strokeStyle='#6A4A2A';g.lineWidth=10;g.beginPath();g.moveTo(0,0);g.lineTo(0,240);g.stroke();g.fillRect(-60,236,120,14);const tilt=Math.sin(Math.min(1,k)*Math.PI*.5)*-.0+(1-Math.min(1,k))*.12;g.save();g.rotate(tilt);g.strokeStyle='#8A6A3A';g.lineWidth=8;g.beginPath();g.moveTo(-200,0);g.lineTo(200,0);g.stroke();[-200,200].forEach((px,i)=>{g.save();g.translate(px,0);g.strokeStyle='#8A6A3A';g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(-60,110);g.moveTo(0,0);g.lineTo(60,110);g.stroke();g.fillStyle='#A8844A';g.beginPath();g.ellipse(0,114,74,16,0,0,7);g.fill();if(i==0)for(let j=0;j<5;j++)goldBar(-52+j*26,108,.34,Math.min(1,k*5-j),t);g.restore()});g.restore();g.restore()}
function trenchScene(t,gy,d){duskSky(d);if(d>.5)stars(40,2,(d-.5)*2,t);g.save();g.globalCompositeOperation='lighter';glow(1400,700,900,'#FFD890',.4*(1-d));g.restore();ridge(800,50,.003,22,.008,.4,mixc('#8A5A6A','#14102A',d),0);
 townSil(1560,gy-60,.7,mixc('#9A8872','#1A1620',d));[[160,300],[330,340]].forEach((p,i)=>palm(p[0],gy-10,p[1],mixc('#1E2E22','#06100C',d),(i%2?-.2:.2),t));
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,mixc('#B89A68','#3A2A22',d));pg.addColorStop(1,mixc('#4A3426','#0C0A0C',d));g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 // the trench: a dark ditch with a perspective
 g.fillStyle=mixc('#3A2A1E','#0C0806',d);g.beginPath();g.moveTo(0,gy+90);g.lineTo(W,gy+40);g.lineTo(W,gy+130);g.lineTo(0,gy+190);g.closePath();g.fill();g.fillStyle=mixc('#8A6A48','#2A2018',d);g.beginPath();g.moveTo(0,gy+84);g.lineTo(W,gy+34);g.lineTo(W,gy+44);g.lineTo(0,gy+94);g.closePath();g.fill();
 // diggers
 for(let i=0;i<9;i++){const x=120+i*210,y=gy+82-(i*5.5)+14;const sw=Math.sin(t*3+i*1.3);person(x,y,.62,Object.assign({},COMP[i%6],{f:i%2?1:-1,aN:[.7+.5*sw,.9],aF:[.6-.3*sw,.8],tilt:.1*sw,head:.2,shade:.2*d}));g.strokeStyle='#4A3220';g.lineWidth=5;g.beginPath();g.moveTo(x+(i%2?44:-44),y-90+sw*10);g.lineTo(x+(i%2?24:-24),y-10);g.stroke();
  const u=((t*.8+i*.17)%1);g.fillStyle=rgba('#B89A68',.5*(1-u));g.beginPath();g.arc(x+(i%2?44:-44),y-20-u*50,6+u*10,0,7);g.fill()}}

// 1: dig the holes
function c1(t){TNOW=t;const gy=880;groveSky(.1);ridge(790,50,.003,22,.008,.9,'#B8A090',0);[[300,330],[520,360],[1560,340],[1760,360]].forEach((p,i)=>palm(p[0],gy-10,p[1],'#2A4A2A',(i%2?-.2:.2),t));groveGround(gy,.1);
 lightPillar(1500,gy,t,.8*sm(t,.2,1.2));
 // pile of saplings
 for(let i=0;i<9;i++)sapling(1180+(i%5)*34+Math.floor(i/5)*16,gy+10-Math.floor(i/5)*8,.6,1);
 const spd=sm(t,4.0,5.0);const sw=Math.sin(t*3.4);person(760,gy+34,.84,Object.assign({},BOY,{f:1,aN:[.6+.5*sw*spd,.9],aF:[.5,.8],tilt:.08*sw*spd,head:.1,rim:'#FFE0A0',rimA:.4}));
 label(t,'TO DIG THE HOLES',2.9,5.5,190,null,true);vig(.3)}
// 2: dig with companions
function c2(t){TNOW=t;const gy=880;groveSky(.15);ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.15);
 const done=sm(t,10.2,14.6);
 for(let r=0;r<2;r++)for(let i=0;i<12;i++){const x=160+i*150+r*60,y=gy+30+r*34;g.fillStyle='#3A2A1E';g.beginPath();g.ellipse(x,y,36,10,0,0,7);g.fill();g.fillStyle=rgba('#9A7A58',1);g.beginPath();g.ellipse(x,y-4,36,8,0,Math.PI,0);g.fill()}
 [[420,0],[760,1],[1100,2],[1440,3]].forEach((p,i)=>{const sw=Math.sin(t*3.2+i);person(p[0],gy+40+(i%2)*28,.8,Object.assign({},i==1?BOY:COMP[i],{f:1,aN:[.6+.5*sw,.9],aF:[.5-.3*sw,.8],tilt:.08*sw,head:.1}))});
 const wk=sm(t,15.2,17.0);const lx=1600;lightPillar(lx,gy,t,.7);const bx=L(1100,1480,wk);
 person(bx,gy+40,.84,Object.assign({},BOY,{f:1,aN:[.3,.4],aF:[.2,.3],head:-.05,rim:'#FFE0A0',rimA:.4*wk}));vig(.3)}
// 3: planting with his own hand: light goes along the holes
function c3(t){TNOW=t;const gy=880;groveSky(.2);ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.2);
 const n=Math.floor(sm(t,19.5,24.0)*11);
 for(let i=0;i<12;i++){const x=160+i*150;g.fillStyle='#3A2A1E';g.beginPath();g.ellipse(x,gy+32,36,10,0,0,7);g.fill();if(i<n)sapling(x,gy+30,.7,Math.min(1,(t-19.5-(i/11)*4.5)*2+1))}
 const k=sm(t,19.0,24.0);const lx=L(200,1780,k);lightPillar(lx,gy,t,sm(t,17.5,18.5));
 const sx=lx-210;const am=(k>0&&k<1)?1:0;const w=Math.PI*(sx)/80;
 person(sx,gy+44,.84,Object.assign({},BOY,{f:1,w:w,amp:am,aN:[.9,1.0],aF:[.8,.9],head:.05,rim:'#FFE0A0',rimA:.6}));vig(.3)}
// 4: not one died: saplings grow into palms
function c4(t){TNOW=t;const gy=880;const gr=sm(t,26.2,31.8);groveSky(.15);ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.15);
 for(let i=0;i<12;i++){const x=160+i*150;if(gr<.4)sapling(x,gy+30,.7+gr,1);else palm(x,gy+30,L(70,230,gr)+(i%3)*14,'#2A5A2A',(i%2?-.2:.2),t)}
 g.save();g.globalCompositeOperation='lighter';glow(960,gy-160,900*gr,'#BFFFA0',.18*gr);g.restore();
 person(960,gy+60,.82,Object.assign({},BOY,{f:1,aN:[.2,.3],aF:[.1,.2],head:-.12,rim:'#FFE0A0',rimA:.4}));vig(.3)}
// 5: trees paid, gold remained
function c5(t){TNOW=t;const gy=880;const d=.3+.3*sm(t,33.3,35.2);groveSky(d);ridge(790,50,.003,22,.008,.9,mixc('#B8A090','#6A5A6A',d),0);
 for(let i=0;i<12;i++)palm(160+i*150,gy+30,230+(i%3)*14,mixc('#2A5A2A','#14301A',d),(i%2?-.2:.2),t);groveGround(gy,d);
 const go=sm(t,33.9,35.0);goldBar(960,gy-10,1.3,go,t);label(t,'THE GOLD REMAINED',33.9,35.8,300);vig(.35)}
// 6: the egg of gold from the mine
function c6(t){TNOW=t;const gy=880;const d=.55;duskSky(d);stars(50,3,.6,t);ridge(780,60,.003,24,.008,.5,'#2A1E3A',0);
 // mountain with mine entrance
 g.fillStyle='#1A1420';g.beginPath();g.moveTo(80,gy);g.lineTo(560,360);g.lineTo(1000,gy);g.closePath();g.fill();g.fillStyle='#050308';archPath(560,640,160,240);g.fill();g.save();g.globalCompositeOperation='lighter';glow(560,820,260,'#FFB070',.4);g.restore();
 const pg=g.createLinearGradient(0,gy-30,0,H);pg.addColorStop(0,'#3A2A28');pg.addColorStop(1,'#0C0A0C');g.fillStyle=pg;g.fillRect(0,gy-30,W,H);
 const k=sm(t,37.0,41.0);const x=L(560,1500,eio(k)),y=L(760,640,Math.sin(Math.PI*k)*.0+k)-Math.sin(k*Math.PI)*120;eggGold(x,y,1.0,sm(t,36.2,37.2),t);
 lightPillar(1560,gy,t,sm(t,38.5,40.0));label(t,'A PIECE OF GOLD FROM ONE OF THE MINES',36.4,40.6,190,null,true);vig(.5)}
// 7: what happened to the Persian Salman?
function c7(t){TNOW=t;const gy=880;quba(t,.6,gy);lightPillar(960,gy,t,1);circle(960,gy-4,t,0,1);
 const call=sm(t,46.2,47.4);const turn=sm(t,46.2,46.8);label(t,'THE PERSIAN SALMAN',43.2,45.8,190,null,true);
 const x=L(1900,1500,call);const am=(call>0&&call<1)?1:0;const w=Math.PI*Math.abs(1900-x)/80;person(x,gy+50,.84,Object.assign({},BOY,{f:-1,w:w,amp:am,aN:[.9,1.0],aF:[.8,.9],alpha:call,rim:'#FFE0A0',rimA:.5}));vig(.45)}
// 8: take this; how far will it go
function c8(t){TNOW=t;const gy=880;quba(t,.62,gy);lightPillar(1000,gy,t,1);circle(1000,gy-4,t,0,1);
 const x=L(1500,760,sm(t,48.0,50.0));const kn=sm(t,50.0,51.4);const doubt=sm(t,55.4,57.0)*(1-sm(t,58.4,59.0));
 person(x,gy+56,.86,Object.assign({},BOY,{f:1,kneel:.9*kn,aN:[L(.3,1.4,sm(t,49.2,50.4)),L(.2,1.5,sm(t,49.2,50.4))],aF:[.2,.5],head:-.05+.2*doubt,rim:'#FFE0A0',rimA:.7}));
 eggGold(x+44,gy-150+(1-kn)*10,.55,sm(t,48.8,49.6),t);vig(.45)}
// 9: Allah will make it enough
function c9(t){TNOW=t;const gy=880;const k=sm(t,59.6,62.0);quba(t,.6,gy);lightPillar(1000,gy,t,1+.3*k);circle(1000,gy-4,t,0,1);
 person(760,gy+56,.86,Object.assign({},BOY,{f:1,kneel:.9,aN:[1.4,1.5],aF:[.2,.5],head:-.05,rim:'#FFE0A0',rimA:.7}));eggGold(804,gy-142,.55+.25*k,1,t);
 g.save();g.globalCompositeOperation='lighter';glow(804,gy-142,500*k,'#FFD870',.35*k);g.restore();vig(.45)}
// 10: weighed, paid, free
function c10(t){TNOW=t;const gy=880;const fr=sm(t,69.6,70.8);groveSky(.2);ridge(790,50,.003,22,.008,.9,'#B8A090',0);groveGround(gy,.2);
 scaleBal(960,gy-460,t,sm(t,64.6,66.4));numeral('40',960,360,sm(t,66.6,67.4)*(1-sm(t,68.2,68.8)),t);
 // payment: Salman and the master
 const pay=sm(t,68.2,69.2);person(1260,gy+34,.86,Object.assign({},MASTER,{f:-1,aN:[L(.5,1.2,pay),L(2.5,1.3,pay)],aF:[.4,2.45]}));person(1000,gy+36,.82,Object.assign({},BOY,{f:1,aN:[L(.3,1.3,pay*(1-fr)),L(.2,1.4,pay*(1-fr))],aF:[.2,.4],head:-.05,rim:'#FFE0A0',rimA:.4+.6*fr}));
 // chain cuffs open and fall
 const op=sm(t,69.4,70.0);const fl=Math.max(0,(t-69.8))*420;cuff(1000+54,gy-30,.5,op,Math.min(fl,260),1-sm(t,70.6,71.4));
 g.save();g.globalCompositeOperation='lighter';glow(1000,gy-180,800*fr,'#FFE7A8',.4*fr);g.restore();g.fillStyle=rgba('#FFF4D0',.2*fr*(1-sm(t,71.0,71.5)));g.fillRect(0,0,W,H);vig(.35)}
// 11: the Trench, never missed a battle
function c11(t){TNOW=t;const gy=860;const d=1-sm(t,71.6,74.6);trenchScene(t,gy,d);
 const k=sm(t,72.5,74.0);const x=L(2000,1260,k);const am=(k>0&&k<1)?1:0;const w=Math.PI*Math.abs(2000-x)/80;
 person(x,gy+22,.9,Object.assign({},BOY,{f:-1,w:w,amp:am,aN:[.9,1.0],aF:[.8,.9],rim:'#FFE0A0',rimA:.6}));
 g.save();g.globalCompositeOperation='lighter';glow(1500,gy-100,900*(1-d),'#FFD890',.3*(1-d));g.restore();label(t,'THE TRENCH',71.6,74.4,190,null,true);vig(.4)}

const SCENES=[
 {a:-1,d:.01,fn:c1},
 {a:9.6,d:.6,fn:c2},
 {a:17.3,d:.6,fn:c3},
 {a:24.6,d:.6,fn:c4},
 {a:31.4,d:.5,fn:c5},
 {a:35.8,d:.6,fn:c6},
 {a:41.3,d:.6,fn:c7},
 {a:47.8,d:.5,fn:c8},
 {a:59.2,d:.5,fn:c9},
 {a:63.2,d:.6,fn:c10},
 {a:71.2,d:.6,fn:c11}];
function render(t){g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);TNOW=t;
 SCENES.forEach((sc,i)=>{if(t<sc.a)return;const nx=SCENES[i+1];if(nx&&t>nx.a+nx.d+.05)return;
  const al=eio((t-sc.a)/sc.d);if(al<=0)return;g.save();g.globalAlpha=al;sc.fn(t);g.restore()});
 g.globalAlpha=1;
 const sc2=g.createLinearGradient(0,720,0,H);sc2.addColorStop(0,'rgba(0,0,0,0)');sc2.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=sc2;g.fillRect(0,720,W,H-720);
 CUES.forEach(c=>drawCue(c,t));
 if(mark){const h=150,w=mark.width*h/mark.height;g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=12;g.globalAlpha=.95;g.drawImage(mark,50,40,w,h);g.restore()}}


// ================= CAPTIONS =================
const CUES=[];
function clean(w){return w.toLowerCase().replace(/[^a-z']/g,'')}
function mk(segs,hiw,opt){opt=opt||{};const words=[];let end=0;segs.forEach(s=>{const ws=s[2].split(' '),tot=ws.reduce((a,b)=>a+b.length,0);let c=0;ws.forEach(w=>{words.push({w:w,t:s[0]+(s[1]-s[0])*c/tot-.02,c:hiw.indexOf(clean(w))>=0?K.tg:null});c+=w.length});end=s[1]});CUES.push({words:words,start:words[0].t,end:opt.end||end+.45})}
mk([[0.00,1.04,'The Messenger said:'],[1.57,2.51,'go, Salman,'],[2.97,4.13,'and dig the holes for them.']],['dig'],{end:4.5});
mk([[4.90,5.77,'When you have finished,'],[6.07,6.54,'come to me,']],[],{end:6.8});
mk([[6.99,9.11,'and I will plant them with my own hand.']],['plant','hand'],{end:9.45});
mk([[10.03,11.45,'Salman went and dug,'],[11.96,13.26,'and his companions helped him,']],['dug','helped'],{end:13.6});
mk([[13.62,14.74,'until he had finished.'],[15.44,16.94,'Then he came and told him.']],[],{end:17.3});
mk([[17.71,19.03,'The Messenger went out with him.']],[],{end:19.4});
mk([[19.77,21.96,'They brought him the saplings, one by one,']],['saplings'],{end:22.1});
mk([[22.35,24.19,'and he placed them with his own hand.']],['hand'],{end:24.55});
mk([[25.15,25.97,'Salman said:'],[26.51,28.75,'by Him in whose hand is my soul,']],[],{end:29.0});
mk([[29.22,30.98,'not one of those trees died.']],['not','died'],{end:31.4});
mk([[31.85,33.23,'So the trees were paid.'],[33.87,35.11,'But the gold remained.']],['gold'],{end:35.5});
mk([[36.03,38.89,'Then a piece of gold, the size of a hen\'s egg,']],['gold','egg'],{end:39.0});
mk([[39.16,41.07,'came to the Prophet from one of the mines.']],['mines'],{end:41.5});
mk([[41.77,42.11,'He said:'],[42.66,45.66,'what happened to the Persian Salman, who made the contract?']],['persian'],{end:46.0});
mk([[46.51,47.61,'Salman was called.']],[],{end:48.0});
mk([[48.33,48.67,'He said:'],[49.16,50.26,'take this, Salman,'],[50.64,51.58,'and pay what you owe.']],['pay'],{end:51.9});
mk([[52.43,53.23,'Salman said:'],[53.73,55.02,'O Messenger of Allah,']],[],{end:55.3});
mk([[55.46,57.90,'how far will this go, against what I owe?']],['owe'],{end:58.2});
mk([[58.81,59.17,'He said:'],[59.63,60.03,'take it.']],[],{end:60.3});
mk([[60.62,62.65,'Allah will make it enough for what you owe.']],['allah','enough'],{end:62.95});
mk([[63.60,64.51,'Salman took it,'],[64.90,66.06,'and it was weighed out for them,']],[],{end:66.3});
mk([[66.51,67.59,'forty ounces.']],['forty'],{end:67.9});
mk([[68.31,69.39,'He paid them in full,'],[69.79,70.49,'and he was free.']],['free'],{end:70.9});
mk([[71.45,73.85,'Then he witnessed the Trench with the Messenger.']],['trench'],{end:74.1});
mk([[74.46,75.17,'And after that,'],[75.56,76.80,'he never missed a battle.']],['never'],{end:77.6});
function wrapLines(cue,font,maxW){g.font=font;const sp=g.measureText(' ').width;const ws=cue.words.map(o=>g.measureText(o.w).width),N=ws.length;
 const wd=(i,j)=>{let x=0;for(let k=i;k<j;k++)x+=ws[k]+(k>i?sp:0);return x};
 const greedy=m=>{let n=1,cw=0,c=0;ws.forEach(w=>{const nw=cw+(c?sp:0)+w;if(nw>m&&c){n++;cw=w;c=1}else{cw=nw;c++}});return n};
 const n=greedy(maxW),INF=1e18;const dp=Array.from({length:n+1},()=>Array(N+1).fill(INF)),bk=Array.from({length:n+1},()=>Array(N+1).fill(0));dp[0][0]=0;
 for(let l=1;l<=n;l++)for(let j=1;j<=N;j++)for(let i=l-1;i<j;i++){if(dp[l-1][i]>=INF)continue;const w=wd(i,j);if(w>maxW*1.04)continue;const c=Math.max(dp[l-1][i],0)+Math.pow(maxW-w,2);if(c<dp[l][j]){dp[l][j]=c;bk[l][j]=i}}
 let br=[],j=N;for(let l=n;l>=1;l--){const i=bk[l][j];br.unshift([i,j]);j=i}
 cue.lines=br.map(b=>{const ix=[];for(let k=b[0];k<b[1];k++)ix.push(k);const tot=wd(b[0],b[1]);let x=0;return{ix:ix,tot:tot,xs:ix.map(k=>{const r=x;x+=ws[k]+sp;return r})}})}
function drawCue(cue,t){const font='66px LoraB',maxW=1500;if(!cue.lines)wrapLines(cue,font,maxW);
 const fo=1-cl((t-cue.end)/.25);if(fo<=0||t<cue.start-.05)return;const lh=88,yc=925,n=cue.lines.length;
 g.save();g.font=font;g.textAlign='left';g.textBaseline='alphabetic';g.shadowColor='rgba(0,0,0,.7)';g.shadowBlur=22;g.shadowOffsetY=4;
 cue.lines.forEach((ln,li)=>{const y=yc+(li-(n-1)/2)*lh+30,x0=960-ln.tot/2;ln.ix.forEach((wi,k)=>{const o=cue.words[wi],a=eo((t-o.t)/.16);if(a<=0)return;g.globalAlpha=a*fo;g.fillStyle=o.c||K.cream;g.fillText(o.w,x0+ln.xs[k],y+(1-a)*14)})});g.restore();g.globalAlpha=1}


return render;
}
