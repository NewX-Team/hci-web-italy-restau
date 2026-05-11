// ==============================
// DESKTOP NAVBAR SCROLL EFFECT
// ==============================
const navbarDesktop = document.querySelector('.navbar-desktop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbarDesktop?.classList.add('scrolled');
  } else {
    navbarDesktop?.classList.remove('scrolled');
  }
});


// ==============================
// FADE IN ON SCROLL
// ==============================
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.gallery-card, .story-inner, .hero-content').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});