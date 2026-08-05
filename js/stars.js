// js/stars.js - interactive, keyboard/touch accessible star ratings persisted in localStorage
(() => {
  const starContainers = document.querySelectorAll('.stars');

  function save(unit, value) { localStorage.setItem('rating-u' + unit, String(value)); }
  function load(unit) { return Number(localStorage.getItem('rating-u' + unit) || 0); }

  function renderStars(container, value) {
    container.innerHTML = '';
    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-live', 'polite');

    for (let i = 1; i <= 5; i++) {
      const iel = document.createElement('i');
      iel.className = 'fa-solid fa-star';
      iel.dataset.value = i;
      iel.setAttribute('role', 'radio');
      iel.setAttribute('aria-label', `${i} de 5 estrellas`);
      iel.setAttribute('aria-checked', i <= value ? 'true' : 'false');

      // Manage focus order: the selected star is focusable, otherwise first star is focusable
      if (value === 0) {
        iel.tabIndex = (i === 1 ? 0 : -1);
      } else {
        iel.tabIndex = (i === value ? 0 : -1);
      }

      if (i <= value) iel.classList.add('active');

      // Click / touch
      iel.addEventListener('click', () => {
        setRating(container, Number(iel.dataset.value));
        // move focus to the chosen star
        setTimeout(() => iel.focus(), 0);
      });

      // Hover preview (mouse)
      iel.addEventListener('mouseover', () => {
        highlightPreview(container, Number(iel.dataset.value));
      });

      // Keyboard handling on each star
      iel.addEventListener('keydown', (ev) => {
        const key = ev.key;
        const current = Number(iel.dataset.value);
        if (key === 'ArrowRight' || key === 'ArrowUp') {
          ev.preventDefault();
          focusStar(container, Math.min(5, current + 1));
        } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
          ev.preventDefault();
          focusStar(container, Math.max(1, current - 1));
        } else if (key === 'Home') {
          ev.preventDefault();
          focusStar(container, 1);
        } else if (key === 'End') {
          ev.preventDefault();
          focusStar(container, 5);
        } else if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
          ev.preventDefault();
          setRating(container, current);
        } else if (/^[1-5]$/.test(key)) {
          // number keys 1-5
          ev.preventDefault();
          setRating(container, Number(key));
        }
      });

      container.appendChild(iel);
    }

    // restore focusability if container was focused previously
    if (document.activeElement === container) {
      const sel = container.querySelector('[aria-checked="true"]') || container.querySelector('i');
      if (sel) sel.focus();
    }
  }

  function highlightPreview(container, previewValue) {
    // visually show preview without changing stored value
    const stars = container.querySelectorAll('i');
    stars.forEach(s => {
      const v = Number(s.dataset.value);
      if (v <= previewValue) {
        s.classList.add('active');
        s.setAttribute('aria-checked', 'true');
      } else {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
      }
    });
  }

  function setRating(container, value) {
    const unit = container.dataset.unit;
    save(unit, value);
    // re-render so tabindex/aria-checked are updated consistently
    renderStars(container, value);
  }

  function focusStar(container, value) {
    const star = container.querySelector(`i[data-value="${value}"]`);
    if (star) {
      // adjust tabindex so the focused star is tabbable
      container.querySelectorAll('i').forEach(s => s.tabIndex = -1);
      star.tabIndex = 0;
      star.focus();
    }
  }

  // When leaving container with mouse, restore stored rating
  function attachContainerHandlers(sc) {
    const unit = sc.dataset.unit;
    sc.addEventListener('mouseout', (e) => {
      // only restore when mouse leaves the container (not when moving between stars)
      if (!sc.contains(e.relatedTarget)) {
        renderStars(sc, load(unit));
      }
    });

    // Allow container itself to be focusable (so users can tab into rating)
    if (!sc.hasAttribute('tabindex')) sc.tabIndex = 0;
    sc.addEventListener('focus', () => {
      // focus the currently selected star or the first star
      const sel = sc.querySelector('[aria-checked="true"]') || sc.querySelector('i');
      if (sel) sel.focus();
    });

    // Keyboard on container: accept number keys and arrow keys when container has focus
    sc.addEventListener('keydown', (ev) => {
      const key = ev.key;
      const currentStored = load(sc.dataset.unit);
      if (/^[1-5]$/.test(key)) {
        ev.preventDefault();
        setRating(sc, Number(key));
      } else if (key === 'ArrowRight' || key === 'ArrowUp') {
        ev.preventDefault();
        const activeVal = document.activeElement && document.activeElement.dataset && Number(document.activeElement.dataset.value);
        focusStar(sc, Math.min(5, activeVal || currentStored || 1));
      } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
        ev.preventDefault();
        const activeVal = document.activeElement && document.activeElement.dataset && Number(document.activeElement.dataset.value);
        focusStar(sc, Math.max(1, activeVal || currentStored || 1));
      } else if (key === 'Home') {
        ev.preventDefault();
        focusStar(sc, 1);
      } else if (key === 'End') {
        ev.preventDefault();
        focusStar(sc, 5);
      }
    });
  }

  // Initialize all star containers
  starContainers.forEach(sc => {
    const unit = sc.dataset.unit;
    const initial = load(unit);
    renderStars(sc, initial);
    attachContainerHandlers(sc);
  });
})();
