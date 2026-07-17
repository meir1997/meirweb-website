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
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopLayout = window.matchMedia('(min-width: 861px)');
  const baseSpeed = 0.32;

  if (!reducedMotion && finePointer.matches && desktopLayout.matches) {
    const track = portfolioRail.querySelector('.portfolio-track');
    const originalCards = [...track.children];
    const makeClone = (card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      return clone;
    };
    const trailingCards = originalCards.map(makeClone);
    track.append(...trailingCards);

    let cycleWidth = 0;
    let position = 0;
    let targetSpeed = baseSpeed;
    let currentSpeed = baseSpeed;
    let animationFrame;
    let isVisible = false;

    const measureCycle = () => {
      cycleWidth = trailingCards[0].offsetLeft - originalCards[0].offsetLeft;
      position = 0;
      track.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    const animateRail = () => {
      if (!isVisible) {
        animationFrame = undefined;
        return;
      }

      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      position -= currentSpeed;

      if (cycleWidth) {
        if (position <= -cycleWidth) position += cycleWidth;
        if (position >= 0) position -= cycleWidth;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
      animationFrame = window.requestAnimationFrame(animateRail);
    };

    const requestAnimation = () => {
      if (!animationFrame && isVisible) animationFrame = window.requestAnimationFrame(animateRail);
    };

    const updateDirection = (event) => {
      const bounds = portfolioRail.getBoundingClientRect();
      const edgeZone = Math.min(220, bounds.width * 0.22);
      const distanceFromLeft = event.clientX - bounds.left;
      const distanceFromRight = bounds.right - event.clientX;

      if (distanceFromLeft < edgeZone) {
        targetSpeed = -Math.pow((edgeZone - distanceFromLeft) / edgeZone, 1.6) * 8;
      } else if (distanceFromRight < edgeZone) {
        targetSpeed = Math.pow((edgeZone - distanceFromRight) / edgeZone, 1.6) * 8;
      } else {
        targetSpeed = 0;
      }

      requestAnimation();
    };

    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) requestAnimation();
    }, { threshold: 0.1 });

    visibilityObserver.observe(portfolioRail);
    new ResizeObserver(measureCycle).observe(track);
    window.requestAnimationFrame(measureCycle);

    portfolioRail.addEventListener('pointerenter', updateDirection);
    portfolioRail.addEventListener('pointermove', updateDirection);
    portfolioRail.addEventListener('pointerleave', () => {
      targetSpeed = baseSpeed;
      requestAnimation();
    });

    portfolioRail.addEventListener('keydown', (event) => {
      const movement = 340;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        position += movement;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        position -= movement;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        position = 0;
      }
      if (event.key === 'End') {
        event.preventDefault();
        position = -cycleWidth + portfolioRail.clientWidth;
      }
      if (cycleWidth) {
        if (position <= -cycleWidth) position += cycleWidth;
        if (position >= 0) position -= cycleWidth;
      }
      track.style.transform = `translate3d(${position}px, 0, 0)`;
    });
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
