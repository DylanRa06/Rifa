const MIN=100,MAX=500;
let pool=[],eliminated=[],winners=[],notSold=[],candidate=null;
const prizes=[
 {name:'5.º Premio — Regalo sorpresa',className:''},
 {name:'4.º Premio — Chompa térmica Vizupró',className:''},
 {name:'3.º Premio — Terno térmico Vizupró',className:''},
 {name:'2.º Premio — Mochila de herramientas',className:''},
 {name:'1.er Premio — Edredón de 2 plazas',className:'first'}
];
const $=id=>document.getElementById(id);
function init(){
 pool=Array.from({length:MAX-MIN+1},(_,i)=>i+MIN);eliminated=[];winners=[];notSold=[];candidate=null;
 $('remaining').textContent=pool.length;$('ball').textContent='?';$('message').textContent='Presiona “Iniciar sorteo”';$('sub').textContent='Cada número puede salir una sola vez.';$('status').textContent='LISTO PARA COMENZAR';
 $('draw').textContent='🎲 Iniciar sorteo';$('draw').disabled=false;$('draw').classList.remove('hidden');$('confirmSale').classList.add('hidden');render();
}
function render(){
 $('eliminated').innerHTML=eliminated.map(n=>`<span class="chip">${n}</span>`).join('')||'<span class="muted">Aún ninguno</span>';
 $('notSoldList').innerHTML=notSold.map(n=>`<span class="chip nosold">${n}</span>`).join('')||'<span class="muted">Aún ninguno</span>';
 $('winners').innerHTML=winners.map((w,i)=>`<div class="winner ${prizes[i].className}">${prizes[i].name}<br><strong>🎟️ #${w}</strong></div>`).join('')||'<p class="muted">Los premios aparecerán desde el sorteo 11.</p>';
}
function nextButton(){
 if(eliminated.length<10){$('draw').textContent=`🎲 Sacar eliminado ${eliminated.length+1}/10`;return;}
 if(winners.length<5){$('draw').textContent=`🏆 Sortear ${prizes[winners.length].name}`;return;}
 $('draw').textContent='✅ Sorteo finalizado';$('draw').disabled=true;
}
function draw(){
 if(candidate!==null||winners.length>=5)return;
 const btn=$('draw');btn.disabled=true;$('ball').classList.add('spin');$('message').textContent='Mezclando boletos…';$('status').textContent=eliminated.length<10?'ELIMINACIÓN':'SORTEO DE PREMIO';
 let ticks=0;
 const anim=setInterval(()=>{
   $('ball').textContent=pool[Math.floor(Math.random()*pool.length)];
   if(++ticks>16){
     clearInterval(anim);const idx=Math.floor(Math.random()*pool.length),n=pool.splice(idx,1)[0];$('remaining').textContent=pool.length;$('ball').classList.remove('spin');$('ball').textContent=n;
     if(eliminated.length<10){
       eliminated.push(n);$('message').textContent=`Número ${n} eliminado`;$('sub').textContent=`Eliminado ${eliminated.length} de 10`;render();btn.disabled=false;nextButton();
     }else{
       candidate=n;$('message').textContent=`🎟️ Boleto #${n}`;$('sub').textContent=`Candidato para ${prizes[winners.length].name}`;$('confirmSale').classList.remove('hidden');btn.classList.add('hidden');
     }
   }
 },65);
}
function confirmSold(){
 if(candidate===null)return;
 const n=candidate;winners.push(n);candidate=null;$('confirmSale').classList.add('hidden');$('draw').classList.remove('hidden');
 $('message').textContent=`🏆 ${prizes[winners.length-1].name}`;$('sub').textContent=`¡El boleto #${n} es ganador confirmado!`;$('stage').classList.add('flash');setTimeout(()=>$('stage').classList.remove('flash'),500);render();
 if(winners.length===5){$('draw').disabled=true;$('draw').textContent='✅ Sorteo finalizado';$('message').textContent='🎉 ¡Tenemos los 5 ganadores!';$('status').textContent='SORTEO FINALIZADO';}else{$('draw').disabled=false;nextButton();}
}
function confirmNotSold(){
 if(candidate===null)return;
 const n=candidate;notSold.push(n);candidate=null;$('confirmSale').classList.add('hidden');$('draw').classList.remove('hidden');$('draw').disabled=false;
 $('message').textContent=`❌ Boleto #${n} no vendido`;$('sub').textContent=`Se repetirá el sorteo de ${prizes[winners.length].name}`;$('status').textContent='BOLETO NO VENDIDO';render();nextButton();
}
$('draw').addEventListener('click',draw);$('sold').addEventListener('click',confirmSold);$('notSold').addEventListener('click',confirmNotSold);$('reset').addEventListener('click',()=>{if(confirm('¿Reiniciar todo el sorteo?'))init()});init();