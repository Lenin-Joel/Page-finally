// js/particles.js - Canvas background with subtle particles, circuits and matrix effect
(() => {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const codes = '01<>/{}[]()=+-_*;:.,'.split('');

  function rand(min,max){return Math.random()*(max-min)+min}

  function createParticles(n=120){
    particles.length=0;
    for(let i=0;i<n;i++){
      particles.push({x:Math.random()*w,y:Math.random()*h,vx:rand(-0.3,0.6),vy:rand(-0.2,0.6),r:rand(0.3,2),bright:rand(0.1,0.9)})
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(10,15,30,0.6)');
    g.addColorStop(1,'rgba(2,6,18,0.5)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

    // draw circuits lines
    ctx.strokeStyle = 'rgba(58,134,255,0.06)';
    ctx.lineWidth = 1;
    for(let i=0;i<40;i++){
      const x1 = (i/w)*w* (0.8+Math.sin(Date.now()/2000+i)*0.2) ;
      const y1 = Math.sin(i*12 + Date.now()/5000)*50 + h*0.15;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+rand(-200,200),h*0.9* Math.random());ctx.stroke();
    }

    // particles
    ctx.fillStyle = 'rgba(0,229,255,0.06)';
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x> w+20) p.x = -20; if(p.x< -20) p.x = w+20;
      if(p.y> h+20) p.y = -20; if(p.y< -20) p.y = h+20;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = `rgba(58,134,255,${p.bright*0.12})`; ctx.fill();
    }

    // matrix subtle
    ctx.fillStyle = 'rgba(0,229,255,0.02)';
    ctx.font = '12px monospace';
    for(let i=0;i<60;i++){
      const ch = codes[Math.floor(Math.random()*codes.length)];
      ctx.fillText(ch, (i*18)%w, (Date.now()/120 + i*14)%h);
    }

    requestAnimationFrame(draw);
  }

  function onResize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;createParticles(Math.max(60, Math.floor(w*h/20000)))}
  addEventListener('resize', onResize);
  createParticles(); draw();
})();
