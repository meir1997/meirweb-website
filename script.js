document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 1px 0 rgba(0,0,0,.3)' : 'none';
});

const portfolioRail = document.getElementById('portfolioRail');

if (portfolioRail) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopLayout = window.matchMedia('(min-width: 861px)');

  if (!reducedMotion && desktopLayout.matches) {
    const track = portfolioRail.querySelector('.portfolio-track');
    const cards = [...track.children];
    const group = document.createElement('div');
    group.className = 'portfolio-group';
    cards.forEach((card) => group.appendChild(card));

    const duplicate = group.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('a').forEach((link) => link.tabIndex = -1);
    track.replaceChildren(group, duplicate);
  } else {
    portfolioRail.addEventListener('keydown', (event) => {
      const movement = 340;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        portfolioRail.scrollBy({ left: -movement, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        portfolioRail.scrollBy({ left: movement, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      if (event.key === 'Home') {
        event.preventDefault();
        portfolioRail.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
      if (event.key === 'End') {
        event.preventDefault();
        portfolioRail.scrollTo({ left: portfolioRail.scrollWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });
  }
}
