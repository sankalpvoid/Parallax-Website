const parallaxElements = document.querySelectorAll('.parallax');
const main = document.querySelector('main');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

let xValue = 0;
let yValue = 0;
let rotateDegree = 0;
let timeline;

function updateScene(pointerX = window.innerWidth / 2) {
  parallaxElements.forEach((el) => {
    const speedX = Number(el.dataset.speedx || 0);
    const speedY = Number(el.dataset.speedy || 0);
    const speedZ = Number(el.dataset.speedz || 0);
    const rotateSpeed = Number(el.dataset.rotation || 0);
    const computedLeft = parseFloat(getComputedStyle(el).left) || window.innerWidth / 2;
    const isInLeft = computedLeft < window.innerWidth / 2 ? 1 : -1;
    const zValue = (pointerX - computedLeft) * isInLeft * 0.1;

    el.style.transform = `translateX(calc(-50% + ${-xValue * speedX}px)) translateY(calc(-50% + ${yValue * speedY}px)) perspective(2300px) translateZ(${zValue * speedZ}px) rotateY(${rotateDegree * rotateSpeed}deg)`;
  });
}

function resetScene() {
  xValue = 0;
  yValue = 0;
  rotateDegree = 0;
  updateScene(window.innerWidth / 2);
}

function handlePointerMove(event) {
  if (prefersReducedMotion || !supportsFinePointer || timeline?.isActive()) return;

  xValue = event.clientX - window.innerWidth / 2;
  yValue = event.clientY - window.innerHeight / 2;
  rotateDegree = (xValue / Math.max(window.innerWidth / 2, 1)) * 16;
  updateScene(event.clientX);
}

function buildIntroAnimation() {
  timeline?.kill();
  gsap.set('.parallax, .text h1, .text h2, .hide', { clearProps: 'transform,opacity' });

  if (prefersReducedMotion) {
    resetScene();
    return;
  }

  const travelScale = window.innerWidth < 700 ? 0.35 : 1;
  timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  parallaxElements.forEach((el) => {
    const distance = Number(el.dataset.distance || 0);
    timeline.from(
      el,
      {
        y: (window.innerHeight + distance) * travelScale,
        duration: window.innerWidth < 700 ? 1.6 : 3.2,
      },
      'scene'
    );
  });

  timeline
    .from('.text h1', { y: window.innerWidth < 700 ? 70 : 200, opacity: 0, duration: 1.4 }, 'title')
    .from('.text h2', { y: -70, opacity: 0, duration: 1.2 }, 'title')
    .from('.hide', { opacity: 0, duration: 1.5 }, 'title+=0.15')
    .eventCallback('onComplete', resetScene);
}

window.addEventListener('pointermove', handlePointerMove, { passive: true });
window.addEventListener('pointerleave', () => {
  if (!timeline?.isActive()) resetScene();
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resetScene();
  }, 120);
});

main.addEventListener('touchmove', resetScene, { passive: true });

buildIntroAnimation();
