(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href'); if(id==='#') return; const target=document.querySelector(id); if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}
  }));
})();

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.card-grid,.work-grid,.blog-grid,.location-grid,.review-grid,.bento,.process').forEach(track=>{
  if(track.children.length<2)return;
  const bar=document.createElement('div');bar.className='carousel-controls';bar.setAttribute('aria-label','Browse cards');
  const prev=document.createElement('button'),next=document.createElement('button');
  prev.type=next.type='button';prev.setAttribute('aria-label','Previous cards');next.setAttribute('aria-label','Next cards');prev.textContent='‹';next.textContent='›';bar.append(prev,next);track.after(bar);
  const move=dir=>track.scrollBy({left:dir*(track.firstElementChild.getBoundingClientRect().width+14),behavior:'smooth'});
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 });
});
