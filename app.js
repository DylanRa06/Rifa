const MIN=100,MAX=599;
let pool=[],eliminated=[],winners=[],notSold=[],autoRetry=null;
const SOLD=new Set([
100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,129,131,132,133,134,135,137,138,139,140,143,145,146,147,148,150,151,152,153,154,155,156,157,158,160,161,162,163,164,165,166,167,168,170,171,174,175,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,197,198,200,201,204,207,210,211,213,214,216,217,219,221,222,223,224,227,228,232,234,237,242,
244,245,246,248,254,255,258,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,295,298,300,301,302,303,304,305,306,307,308,309,310,311,315,316,321,323,324,326,327,330,331,333,337,340,348,350,358,362,363,367,369,371,376,377,382,
398,399,401,410,411,423,427,432,440,444,454,457,460,461,465,474,480,483,484,485,486,487,491,496,498,499,501,502,503,504,505,507,508,510,512,517,525,528,
533,534,535,536,537,540,542,544,550,551,552,553,554,555,556,557,559,560,564,576,582,583,586,589,590,592,593,594,595,596,597,598,599
]);
const prizes=[
 {name:'5.º Premio — Regalo sorpresa',className:''},
 {name:'4.º Premio — Chompa térmica Vizupró',className:''},
 {name:'3.º Premio — Terno térmico Vizupró',className:''},
 {name:'2.º Premio — Mochila de herramientas',className:''},
 {name:'1.er Premio — Edredón de 2 plazas',className:'first'}
];
const $=id=>document.getElementById(id);
function init(){
 if(autoRetry)clearTimeout(autoRetry);autoRetry=null;
 pool=Array.from({length:MAX-MIN+1},(_,i)=>i+MIN);eliminated=[];winners=[];notSold=[];
 $('remaining').textContent=pool.length;$('ball').textContent='?';$('message').textContent='Presiona “Iniciar sorteo”';$('sub').textContent='Los premios validan automáticamente si el boleto fue vendido.';$('status').textContent='LISTO PARA COMENZAR';
 $('draw').textContent='🎲 Iniciar sorteo';$('draw').disabled=false;$('draw').classList.remove('hidden');$('confirmSale').classList.add('hidden');render();
}
function render(){
 $('eliminated').innerHTML=eliminated.map(n=>`<span class="chip">${n}</span>`).join('')||'<span class="muted">Aún ninguno</span>';
 $('notSoldList').innerHTML=notSold.map(n=>`<span class="chip nosold">${n}</span>`).join('')||'<span class="muted">Aún ninguno</span>';
 $('winners').innerHTML=winners.map((w,i)=>`<div class="winner ${prizes[i].className}">${prizes[i].name}<br><strong>🎟️ #${w}</strong></div>`).join('')||'<p class="muted">Los premios aparecerán después de los 10 eliminados.</p>';
}
function nextButton(){
 if(eliminated.length<10){$('draw').textContent=`🎲 Sacar eliminado ${eliminated.length+1}/10`;return;}
 if(winners.length<5){$('draw').textContent=`🏆 Sortear ${prizes[winners.length].name}`;return;}
 $('draw').textContent='✅ Sorteo finalizado';$('draw').disabled=true;
}
function finishWinner(n){
 winners.push(n);$('message').textContent=`🏆 ${prizes[winners.length-1].name}`;$('sub').textContent=`¡El boleto #${n} está vendido y es ganador!`;$('status').textContent='BOLETO VENDIDO — GANADOR';$('stage').classList.add('flash');setTimeout(()=>$('stage').classList.remove('flash'),500);render();
 if(winners.length===5){$('draw').disabled=true;$('draw').textContent='✅ Sorteo finalizado';$('message').textContent='🎉 ¡Tenemos los 5 ganadores!';$('status').textContent='SORTEO FINALIZADO';}else{$('draw').disabled=false;nextButton();}
}
function rejectUnsold(n){
 notSold.push(n);$('message').textContent=`❌ Boleto #${n} NO VENDIDO`;$('sub').textContent=`No participa por el premio. Se repetirá ${prizes[winners.length].name}.`;$('status').textContent='BOLETO NO VENDIDO';render();
 $('draw').textContent='⏳ Repitiendo el mismo premio…';
 autoRetry=setTimeout(()=>{autoRetry=null;$('draw').disabled=false;draw();},1800);
}
function draw(){
 if(winners.length>=5||pool.length===0)return;
 const btn=$('draw');btn.disabled=true;$('ball').classList.add('spin');$('message').textContent='Mezclando boletos…';$('status').textContent=eliminated.length<10?'ELIMINACIÓN':'SORTEO DE PREMIO';
 let ticks=0;const anim=setInterval(()=>{
   $('ball').textContent=pool[Math.floor(Math.random()*pool.length)];
   if(++ticks>16){clearInterval(anim);const idx=Math.floor(Math.random()*pool.length),n=pool.splice(idx,1)[0];$('remaining').textContent=pool.length;$('ball').classList.remove('spin');$('ball').textContent=n;
     if(eliminated.length<10){eliminated.push(n);$('message').textContent=`Número ${n} eliminado`;$('sub').textContent=`Eliminado ${eliminated.length} de 10`;render();btn.disabled=false;nextButton();}
     else if(SOLD.has(n)){finishWinner(n);}else{rejectUnsold(n);}
   }
 },65);
}
$('draw').addEventListener('click',draw);$('reset').addEventListener('click',()=>{if(confirm('¿Reiniciar todo el sorteo?'))init()});init();