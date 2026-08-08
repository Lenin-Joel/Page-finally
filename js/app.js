// js/app.js - Main interactions: clock, uploads, progress, profile upload, cursor, back to top, small AOS
(() => {
  // Loader
  window.addEventListener('load', ()=>{
    setTimeout(()=>{document.getElementById('loader').style.display='none'},600);
  });

  // Visits counter
  const visits = Number(localStorage.getItem('visits') || 0) + 1;
  localStorage.setItem('visits', visits);
  const visitsEl = document.getElementById('visits');
  if (visitsEl) visitsEl.textContent = visits;

  // Clock & date
  function updateClock(){
    const d=new Date();
    const t = d.toLocaleTimeString();
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if (clockEl) clockEl.textContent = t;
    if (dateEl) dateEl.textContent = d.toLocaleDateString();
  }
  setInterval(updateClock,1000);
  updateClock();

  // Back to top
  const topBtn = document.getElementById('topBtn');
  if (topBtn) {
    topBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', ()=>{topBtn.style.display = window.scrollY>400 ? 'block' : 'none'});
  }

  // Custom cursor follow
  const cursor = document.getElementById('cursor');
  if (cursor) {
    window.addEventListener('mousemove', e=>{cursor.style.left = e.clientX+'px'; cursor.style.top = e.clientY+'px'});
  }

  // Simple AOS - reveal when in view
  const aosEls = document.querySelectorAll('.aos');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('aos-animate')} });
    },{threshold:0.12});
    aosEls.forEach(el=>obs.observe(el));
  } else {
    aosEls.forEach(el=>el.classList.add('aos-animate'));
  }

  // File uploads for units
  function fileToDataURL(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(file)})}

  document.querySelectorAll('[data-unit-file]').forEach(inp=>{
    inp.addEventListener('change', async e=>{
      const key = inp.dataset.unitFile; const files = Array.from(e.target.files || []);
      const list = JSON.parse(localStorage.getItem('files-'+key) || '[]');
      for(const f of files){ const data = await fileToDataURL(f); list.push({name:f.name,data}); }
      localStorage.setItem('files-'+key, JSON.stringify(list)); renderFiles(key);
    });
  });

  function renderFiles(key){
    const list = JSON.parse(localStorage.getItem('files-'+key) || '[]');
    const target = document.getElementById(key.replace(/[^a-z0-9]/gi,'')+'-gallery') || document.getElementById(key+'-files');
    if(!target){ return }
    target.innerHTML='';
    for(const it of list){
      if(it.data.startsWith('data:image')){
        const img = document.createElement('img'); img.src=it.data; target.appendChild(img);
      } else {
        const a = document.createElement('a'); a.href=it.data; a.textContent = it.name; a.download = it.name; a.className='btn'; a.style.marginRight='.4rem'; target.appendChild(a);
      }
    }
  }
  // render known keys
  ['u1-pdf','u1-doc','u1-ppt','u3-files','u1-pdf','u2-pdf'].forEach(renderFiles);

  // Progress bars
  function bindProgress(id, barId){
    const range = document.getElementById(id);
    const bar = document.getElementById(barId);
    if (!range || !bar) return;
    const stored = Number(localStorage.getItem(id) || 0);
    range.value = stored;
    bar.style.width = stored+'%';
    range.addEventListener('input', ()=>{
      bar.style.width = range.value+'%';
      localStorage.setItem(id, range.value);
    });
  }
  bindProgress('progress-u1','bar-u1');
  bindProgress('progress-u2','bar-u2');
  bindProgress('progress-u3','bar-u3');

  // Social links - open new tab
  document.querySelectorAll('.social-card').forEach(card=>{
    const input = card.querySelector('.social-input'); const btn = card.querySelector('.btn');
    btn.addEventListener('click', ()=>{
      const url = input.value || '#'; window.open(url,'_blank');
    });
  });

  // Navbar links smooth offset
  document.querySelectorAll('header a[href^="#"]').forEach(a=>a.addEventListener('click', e=>{e.preventDefault();const id = a.getAttribute('href'); const el=document.querySelector(id); if(el) window.scrollTo({top: el.offsetTop-80, behavior:'smooth'});}));

  // Make editable content persist
  document.querySelectorAll('[contenteditable="true"]').forEach(el=>{
    const id = el.id || el.textContent.trim().slice(0,20).replace(/\s+/g,'-');
    const key = 'edit-'+(el.id||id);
    const stored = localStorage.getItem(key);
    if(stored) el.innerHTML = stored;
    el.addEventListener('input', ()=> localStorage.setItem(key, el.innerHTML));
  });

  // Unidad topics: open/close and persist editable topic bodies
  document.querySelectorAll('.summary-card').forEach(card=>{
    card.addEventListener('click', e=>{
      e.preventDefault();
      const href = card.getAttribute('href');
      if(!href) return;
      const id = href.replace('#','');
      const topic = document.getElementById(id);
      if(!topic) return;
      // open topic
      document.querySelectorAll('.topic').forEach(t=>{ t.classList.add('collapsed'); t.classList.remove('open'); });
      topic.classList.remove('collapsed'); topic.classList.add('open');
      // scroll into view
      setTimeout(()=>{ topic.scrollIntoView({behavior:'smooth',block:'start'}); }, 80);
      // focus first editable
      const ed = topic.querySelector('.editable'); if(ed) ed.focus();
    });
  });

  // Close buttons
  document.querySelectorAll('.close-topic').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const topic = btn.closest('.topic'); if(!topic) return;
      topic.classList.add('collapsed'); topic.classList.remove('open');
    });
  });

  // Open exercises button
  const exercisesButton = document.getElementById('open-exercises');
  if(exercisesButton){
    exercisesButton.addEventListener('click', ()=>{
      const topic = document.getElementById('topic-exercises');
      if(!topic) return;
      document.querySelectorAll('.topic').forEach(t=>{ t.classList.add('collapsed'); t.classList.remove('open'); });
      topic.classList.remove('collapsed'); topic.classList.add('open');
      setTimeout(()=>{ topic.scrollIntoView({behavior:'smooth',block:'start'}); }, 80);
    });
  }

  // Persist topic editable areas by data-key
  document.querySelectorAll('.topic .editable').forEach(el=>{
    const key = el.dataset.key;
    if(!key) return;
    const stored = localStorage.getItem(key);
    if(stored) el.innerHTML = stored;
    el.addEventListener('input', ()=> localStorage.setItem(key, el.innerHTML));
  });

  // Stars rendering invoked by stars.js (already persisted)

  // Animated counters for new stats section
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const duration = 1200;
        const start = performance.now();
        const update = (now)=>{
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if(progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, {threshold: 0.6});

  counters.forEach(counter => counterObserver.observe(counter));

})();
