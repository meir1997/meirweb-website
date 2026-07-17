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
  const baseSpeed = 0.32;

  if (!reducedMotion && finePointer.matches) {
    const track = portfolioRail.querySelector('.portfolio-track');
    const originalCards = [...track.children];
    const clonedCards = originalCards.map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      track.appendChild(clone);
      return clone;
    });

    let cycleWidth = 0;
    let targetSpeed = baseSpeed;
    let currentSpeed = baseSpeed;
    let animationFrame;
    let isVisible = false;

    const measureCycle = () => {
      cycleWidth = clonedCards[0].offsetLeft - originalCards[0].offsetLeft;
    };

    const animateRail = () => {
      if (!isVisible) {
        animationFrame = undefined;
        return;
      }

      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      let nextScroll = portfolioRail.scrollLeft + currentSpeed;

      if (cycleWidth) {
        if (nextScroll >= cycleWidth) nextScroll -= cycleWidth;
        if (nextScroll < 0) nextScroll += cycleWidth;
      }

      portfolioRail.scrollLeft = nextScroll;
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
  }

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
