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

    const createDuplicate = () => {
      const duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.querySelectorAll('a').forEach((link) => link.tabIndex = -1);
      return duplicate;
    };

    track.replaceChildren(group, createDuplicate());

    let activeDirection = null;
    let groupWidth = 0;
    let position = 0;
    let previousTime = performance.now();
    const speed = 42;

    const measureAndFillTrack = () => {
      groupWidth = group.getBoundingClientRect().width;
      const requiredWidth = portfolioRail.clientWidth + groupWidth;
      while (track.scrollWidth < requiredWidth) {
        track.appendChild(createDuplicate());
      }
      if (groupWidth > 0) position %= groupWidth;
    };

    const setGalleryDirection = (direction) => {
      if (direction === activeDirection) return;
      activeDirection = direction;

      if (direction) {
        portfolioRail.dataset.direction = direction;
      } else {
        delete portfolioRail.dataset.direction;
      }
    };

    const animateGallery = (currentTime) => {
      const elapsed = Math.min((currentTime - previousTime) / 1000, 0.05);
      previousTime = currentTime;

      if (activeDirection !== 'center' && groupWidth > 0) {
        const movementDirection = activeDirection === 'right' ? -1 : 1;
        position = (position + speed * elapsed * movementDirection) % groupWidth;
        if (position < 0) position += groupWidth;
        track.style.transform = `translate3d(${-position}px, 0, 0)`;
      }

      requestAnimationFrame(animateGallery);
    };

    const updateGalleryDirection = (event) => {
      const bounds = portfolioRail.getBoundingClientRect();
      const activeZone = Math.min(260, bounds.width * 0.28);
      const pointerFromLeft = event.clientX - bounds.left;
      const pointerFromRight = bounds.right - event.clientX;

      if (pointerFromLeft < activeZone) {
        setGalleryDirection('left');
      } else if (pointerFromRight < activeZone) {
        setGalleryDirection('right');
      } else {
        setGalleryDirection('center');
      }
    };

    portfolioRail.addEventListener('pointerenter', updateGalleryDirection);
    portfolioRail.addEventListener('pointermove', updateGalleryDirection);
    portfolioRail.addEventListener('pointerleave', () => setGalleryDirection(null));
    window.addEventListener('resize', measureAndFillTrack, { passive: true });

    measureAndFillTrack();
    requestAnimationFrame(animateGallery);
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
