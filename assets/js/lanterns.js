/* 轻量 Canvas 灯笼漂浮特效（自绘，不依赖图片） */
(function(){
  const canvas = document.querySelector('canvas[data-lanterns]');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W=0,H=0,DPR=Math.min(2, window.devicePixelRatio || 1);
  function resize(){
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  const rand = (a,b)=> a + Math.random()*(b-a);
  const lanterns = [];
  const COUNT = Math.max(18, Math.min(34, Math.floor(W/42)));

  function makeLantern(){
    return {
      x: rand(0, W),
      y: rand(H*0.35, H*1.15),
      s: rand(16, 34),
      vy: rand(0.25, 0.7),
      sway: rand(0.6, 1.8),
      phase: rand(0, Math.PI*2),
      a: rand(0.08, 0.18),
      glow: rand(0.08, 0.18)
    };
  }

  for(let i=0;i<COUNT;i++) lanterns.push(makeLantern());

  let mouseX = W/2, mouseY = H/2;
  window.addEventListener('mousemove', (e)=>{
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  }, {passive:true});

  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function drawLantern(L){
    const swayX = Math.sin(L.phase) * L.sway;
    const px = L.x + swayX;
    const py = L.y;

    // glow
    ctx.save();
    ctx.globalAlpha = L.glow;
    ctx.fillStyle = '#b11f2d';
    ctx.beginPath();
    ctx.arc(px, py, L.s*0.95, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // body
    ctx.save();
    ctx.globalAlpha = L.a;
    const w = L.s*0.82, h = L.s*1.05;
    const x = px - w/2, y = py - h/2;
    const grd = ctx.createLinearGradient(x, y, x+w, y+h);
    grd.addColorStop(0, '#b11f2d');
    grd.addColorStop(.55, '#c8a15a');
    grd.addColorStop(1, '#b11f2d');
    ctx.fillStyle = grd;
    ctx.strokeStyle = 'rgba(255,255,255,.15)';
    ctx.lineWidth = 1;
    roundRect(x, y, w, h, 8);
    ctx.fill(); ctx.stroke();

    // cap lines
    ctx.strokeStyle = 'rgba(20,20,20,.22)';
    ctx.globalAlpha = L.a*0.9;
    ctx.beginPath();
    ctx.moveTo(x+2, y+h*0.25); ctx.lineTo(x+w-2, y+h*0.25);
    ctx.moveTo(x+2, y+h*0.75); ctx.lineTo(x+w-2, y+h*0.75);
    ctx.stroke();

    // tassel
    ctx.globalAlpha = L.a*0.75;
    ctx.strokeStyle = 'rgba(20,20,20,.25)';
    ctx.beginPath();
    ctx.moveTo(px, y+h+2);
    ctx.lineTo(px, y+h+L.s*0.65);
    ctx.stroke();
    ctx.fillStyle = 'rgba(200,161,90,.55)';
    ctx.beginPath();
    ctx.arc(px, y+h+L.s*0.65, 2.4, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  let t0 = performance.now();
  function tick(t){
    const dt = Math.min(32, t - t0); t0 = t;
    ctx.clearRect(0,0,W,H);

    if(!prefersReduce){
      for(const L of lanterns){
        L.phase += (dt/1000) * 1.2;
        L.y -= L.vy * (dt/16);
        // subtle mouse drift
        const dx = (mouseX - W/2) * 0.0002;
        L.x += dx * (dt/16) * (L.s/28);

        if(L.y < -80){ L.y = H + rand(30, 220); L.x = rand(0, W); }
        if(L.x < -60) L.x = W + 60;
        if(L.x > W + 60) L.x = -60;

        drawLantern(L);
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();