// js/theme.js - Theme toggle with localStorage
(() => {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  function applyTheme(t){
    if(t==='dark'){
      root.style.setProperty('--bg','#050814');root.style.setProperty('--bg-2','#071028');
    } else {
      root.style.setProperty('--bg','#F6F9FF');root.style.setProperty('--bg-2','#E9F2FF');
    }
  }
  const stored = localStorage.getItem('theme') || 'dark'; applyTheme(stored);
  btn.addEventListener('click', ()=>{
    const now = (localStorage.getItem('theme')||'dark')==='dark' ? 'light' : 'dark';
    localStorage.setItem('theme', now); applyTheme(now);
  });
})();
