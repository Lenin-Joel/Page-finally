// js/app.js - Main interactions: clock, uploads, progress, profile upload, cursor, back to top, small AOS
(() => {
  // Loader
  window.addEventListener('load', ()=>{
    setTimeout(()=>{document.getElementById('loader').style.display='none'},600);
  });

  // Visits counter
  const visits = Number(localStorage.getItem('visits') || 0) + 1; localStorage.setItem('visits', visits); document.getElementById('visits').textContent = visits;

  // Clock & date
  function updateClock(){
    const d=new Date();
    const t = d.toLocaleTimeString(); document.getElementById('clock').textContent=t;
    document.getElementById('date').textContent = d.toLocaleDateString();
  }
  setInterval(updateClock,1000); updateClock();

  // Back to top
  const topBtn = document.getElementById('topBtn'); topBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll', ()=>{topBtn.style.display = window.scrollY>400 ? 'block' : 'none'});

  // Custom cursor follow
  const cursor = document.getElementById('cursor'); window.addEventListener('mousemove', e=>{cursor.style.left = e.clientX+'px'; cursor.style.top = e.clientY+'px'})

  // Simple AOS - reveal when in view
  const aosEls = document.querySelectorAll('.aos');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('aos-animate')} });
  },{threshold:0.12});
  aosEls.forEach(el=>obs.observe(el));

  // Profile upload
  const profileUpload = document.getElementById('profileUpload'); const profileImg = document.getElementById('profile-img');
  profileUpload.addEventListener('change', async e=>{
    const f = e.target.files[0]; if(!f) return; const data = await fileToDataURL(f); localStorage.setItem('profile-img', data); profileImg.src = data;
  });
  // load profile if exists
  const prof = localStorage.getItem('profile-img'); if(prof) profileImg.src = prof;

  // File uploads for units
  function fileToDataURL(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(file)})}

  document.querySelectorAll('[data-unit-file]').forEach(inp=>{
    inp.addEventListener('change', async e=>{
      const key = inp.dataset.unitFile; const files = Array.from(e.target.files);
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
    const range = document.getElementById(id); const bar = document.getElementById(barId);
    const stored = Number(localStorage.getItem(id) || 0); range.value = stored; bar.style.width = stored+'%';
    range.addEventListener('input', ()=>{bar.style.width = range.value+'%'; localStorage.setItem(id, range.value)});
  }
  bindProgress('progress-u1','bar-u1'); bindProgress('progress-u2','bar-u2'); bindProgress('progress-u3','bar-u3');

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

  // Stars rendering invoked by stars.js (already persisted)

})();
