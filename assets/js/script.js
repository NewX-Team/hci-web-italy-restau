
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  
  document.querySelectorAll('.real-content').forEach(el => {
    el.style.visibility = 'visible';
    el.style.opacity = '0';
  });

  function revealPage() {
    loader.classList.add('hide');
    document.querySelectorAll('.real-content').forEach(el => {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '1';
    });
  }

  const alreadyVisited = sessionStorage.getItem('marca_visited');

  if (alreadyVisited) {
    loader.style.display = 'none';
    document.querySelectorAll('.real-content').forEach(el => {
      el.style.opacity = '1';
    });
  } else {
    sessionStorage.setItem('marca_visited', '1');
    const minDelay = 1800;
    const startTime = Date.now();

    if (document.readyState === 'complete') {
      setTimeout(revealPage, Math.max(0, minDelay - Date.now() + startTime));
    } else {
      window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        setTimeout(revealPage, Math.max(0, minDelay - elapsed));
      });
    }
  }
})();



const navbarDesktop = document.querySelector('.navbar-desktop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbarDesktop?.classList.add('scrolled');
  } else {
    navbarDesktop?.classList.remove('scrolled');
  }
});



const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.gallery-card, .story-inner, .hero-content').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});



const menuTabs = document.querySelectorAll('.menu-tab');
const menuCats = document.querySelectorAll('.menu-category');

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    menuCats.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const target = document.getElementById('cat-' + tab.dataset.cat);
    if (target) target.classList.add('active');
  });
});