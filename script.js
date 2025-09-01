
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
  });
},{threshold:.18});
revealEls.forEach(el=>io.observe(el));

document.querySelectorAll('[data-ripple]').forEach(btn=>{
  btn.addEventListener('pointerdown', (e)=>{
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - rect.left)+'px');
    btn.style.setProperty('--y', (e.clientY - rect.top)+'px');
    btn.classList.add('rippling');
    setTimeout(()=>btn.classList.remove('rippling'), 350);
  });
});

const layers = document.querySelectorAll('.layer');
window.addEventListener('mousemove', (e)=>{
  const cx = window.innerWidth/2, cy = window.innerHeight/2;
  const dx = (e.clientX - cx)/cx, dy = (e.clientY - cy)/cy;
  layers.forEach(layer=>{
    const depth = parseFloat(layer.dataset.depth || 0.1);
    const tx = -dx * 24 * depth;
    const ty = -dy * 24 * depth;
    layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });
});

document.querySelectorAll('.tilt').forEach(card=>{
  let raf = 0;
  const onMove = (e)=>{
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top)/r.height - .5) * -8;
    const ry = ((e.clientX - r.left)/r.width - .5) * 8;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
  };
  const reset = ()=>{ card.style.transform = ''; };
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', reset);
});

const canvas = document.getElementById('bg-pixels');
const ctx = canvas.getContext('2d', { alpha: true });
let w, h, cells, squares;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const size = 32;
  cells = [];
  for(let y=0;y<h;y+=size){
    for(let x=0;x<w;x+=size){
      if((x/size + y/size) % 2 === 0){
        cells.push({x,y,alpha:0.04});
      }
    }
  }
  squares = new Array(80).fill(0).map(()=> ({
    x: Math.random()*w,
    y: Math.random()*h,
    s: (Math.random()*2+1)*8,
    vy: Math.random()*.4 + .1,
    alpha: Math.random()*.2 + .1
  }));
}
window.addEventListener('resize', resize);
resize();

function step(){
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle = 'rgba(255,120,60,0.06)';
  cells.forEach(c=>{
    ctx.globalAlpha = c.alpha;
    ctx.fillRect(c.x, c.y, 32, 32);
  });
  ctx.globalAlpha = 1;

  squares.forEach(s=>{
    s.y -= s.vy;
    if(s.y + s.s < 0){ s.y = h + s.s; s.x = Math.random()*w; }
    ctx.fillStyle = 'rgba(255,180,60,'+s.alpha+')';
    ctx.fillRect(Math.floor(s.x/8)*8, Math.floor(s.y/8)*8, s.s, s.s);
  });

  requestAnimationFrame(step);
}
requestAnimationFrame(step);

const copyBtn = document.getElementById("copy-ip");

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("mc.EverWorld.ru");

    let oldText = copyBtn.textContent;
    copyBtn.textContent = "✅ Успешно!";

    setTimeout(() => {
        copyBtn.textContent = oldText;
    }, 3000);
});