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
  let targetSpeed = 0;
  let currentSpeed = 0;
  let animationFrame;

  const animateRail = () => {
    currentSpeed += (targetSpeed - currentSpeed) * 0.12;

    if (Math.abs(currentSpeed) < 0.05 && targetSpeed === 0) {
      currentSpeed = 0;
      animationFrame = undefined;
      return;
    }

    const maximumScroll = portfolioRail.scrollWidth - portfolioRail.clientWidth;
    const nextScroll = Math.min(maximumScroll, Math.max(0, portfolioRail.scrollLeft + currentSpeed));
    portfolioRail.scrollLeft = nextScroll;

    if (nextScroll === 0 || nextScroll === maximumScroll) {
      currentSpeed = 0;
      targetSpeed = 0;
    }
    animationFrame = window.requestAnimationFrame(animateRail);
  };

  const requestAnimation = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(animateRail);
  };

  portfolioRail.addEventListener('pointermove', (event) => {
    if (reducedMotion || !finePointer.matches) return;

    const bounds = portfolioRail.getBoundingClientRect();
    const edgeZone = Math.min(220, bounds.width * 0.22);
    const distanceFromLeft = event.clientX - bounds.left;
    const distanceFromRight = bounds.right - event.clientX;

    if (distanceFromLeft < edgeZone) {
      targetSpeed = -Math.pow((edgeZone - distanceFromLeft) / edgeZone, 1.8) * 15;
    } else if (distanceFromRight < edgeZone) {
      targetSpeed = Math.pow((edgeZone - distanceFromRight) / edgeZone, 1.8) * 15;
    } else {
      targetSpeed = 0;
    }

    requestAnimation();
  });

  portfolioRail.addEventListener('pointerleave', () => {
    targetSpeed = 0;
    requestAnimation();
  });

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
