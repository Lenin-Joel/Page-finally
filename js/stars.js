// js/stars.js - interactive star ratings persisted in localStorage
(() => {
  const starContainers = document.querySelectorAll('.stars');
  function renderStars(container, value){
    container.innerHTML='';
    for(let i=1;i<=5;i++){
      const iel = document.createElement('i');
      iel.className = 'fa-solid fa-star';
      if(i<=value) iel.classList.add('active');
      iel.dataset.value = i;
      container.appendChild(iel);
    }
  }

  function save(unit, value){ localStorage.setItem('rating-u'+unit, String(value)); }
  function load(unit){ return Number(localStorage.getItem('rating-u'+unit) || 0); }

  starContainers.forEach(sc => {
    const unit = sc.dataset.unit;
    const initial = load(unit);
    renderStars(sc, initial);
    sc.addEventListener('mouseover', e=>{
      if(e.target.dataset.value){ renderStars(sc, Number(e.target.dataset.value)); }
    });
    sc.addEventListener('mouseout', ()=>{ renderStars(sc, load(unit)); });
    sc.addEventListener('click', e=>{
      if(e.target.dataset.value){
        const v = Number(e.target.dataset.value); save(unit,v); renderStars(sc,v);
      }
    });
  });
})();
