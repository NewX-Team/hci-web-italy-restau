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

// Active state sudah di-handle langsung di masing-masing HTML per halaman
// Tidak perlu JS toggle lagi