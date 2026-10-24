(function(){
'use strict';
/* Footer year */
document.getElementById('year').textContent=new Date().getFullYear();

/* Logo fallback: shows a text mark until logo.png is added */
document.querySelectorAll('.brand-logo').forEach(function(img){
  img.addEventListener('error',function(){
    var m=document.createElement('span');
    m.className='brand-mark';m.textContent='K';m.setAttribute('aria-hidden','true');
    img.replaceWith(m);
  });
});

/* Gallery: hide broken sample images so the gold placeholder shows */
document.querySelectorAll('.tile img').forEach(function(img){
  img.addEventListener('error',function(){img.style.display='none';});
});

/* Mobile menu */
var btn=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
function setMenu(open){
  menu.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open);
  btn.setAttribute('aria-label',open?'Close menu':'Open menu');
}
btn.addEventListener('click',function(){setMenu(!menu.classList.contains('open'));});
menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});

/* Active link highlight */
var links=[].slice.call(menu.querySelectorAll('a'));
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){
      links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+en.target.id);});
    }
  });
},{rootMargin:'-45% 0px -50% 0px'});
links.forEach(function(l){var s=document.querySelector(l.getAttribute('href'));if(s)io.observe(s);});

/* Hero: drifting gold sparkles (the one ambient moment) */
var cv=document.getElementById('sparkle'),ctx=cv.getContext('2d'),dots=[],raf;
var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){
  cv.width=cv.offsetWidth*devicePixelRatio;cv.height=cv.offsetHeight*devicePixelRatio;
  dots=[];var n=Math.round(cv.offsetWidth/18);
  for(var i=0;i<n;i++)dots.push({x:Math.random(),y:Math.random(),r:Math.random()*2.2+.6,s:Math.random()*.00006+.00002,p:Math.random()*6.28});
}
function draw(t){
  ctx.clearRect(0,0,cv.width,cv.height);
  dots.forEach(function(d){
    if(!still)d.y-=d.s*16;if(d.y<-.02)d.y=1.02;
    var a=.25+.45*Math.abs(Math.sin(t/1800+d.p));
    ctx.beginPath();
    ctx.arc(d.x*cv.width,d.y*cv.height,d.r*devicePixelRatio,0,6.283);
    ctx.fillStyle='rgba(235,207,138,'+a.toFixed(2)+')';
    ctx.shadowColor='rgba(201,162,75,.9)';ctx.shadowBlur=12;ctx.fill();
  });
  if(!still)raf=requestAnimationFrame(draw);
}
size();draw(0);
window.addEventListener('resize',function(){cancelAnimationFrame(raf);size();draw(0);});

/* Inquiry form: client-side validation only. Nothing is sent. */
var form=document.getElementById('inquiry'),ok=document.getElementById('success');
var dateInput=document.getElementById('date');
dateInput.min=new Date().toISOString().split('T')[0];
var rules={
  name:function(v){return v.trim().length>=2||'Please enter your name.';},
  phone:function(v){return v.replace(/\D/g,'').length>=7||'Please enter a valid phone number.';},
  type:function(v){return v!==''||'Please choose an event type.';},
  date:function(v){return v!==''||'Please pick an event date.';},
  message:function(v){return v.trim().length>=10||'Please add a short message (10+ characters).';}
};
function check(el){
  var r=rules[el.name](el.value),f=el.closest('.field');
  f.classList.toggle('invalid',r!==true);
  f.querySelector('.err').textContent=r===true?'':r;
  el.setAttribute('aria-invalid',r!==true);
  return r===true;
}
form.querySelectorAll('input,select,textarea').forEach(function(el){
  el.addEventListener('blur',function(){check(el);});
  el.addEventListener('input',function(){if(el.closest('.field').classList.contains('invalid'))check(el);});
});
form.addEventListener('submit',function(e){
  e.preventDefault();ok.hidden=true;
  var bad=[].filter.call(form.querySelectorAll('input,select,textarea'),function(el){return !check(el);});
  if(bad.length){bad[0].focus();return;}
  ok.textContent='Thank you, '+form.name.value.trim()+'. This is a demo, so your inquiry was not sent. On the final website this form would reach the business.';
  ok.hidden=false;form.reset();
});
})();
