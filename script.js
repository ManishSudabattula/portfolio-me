const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const stage = document.querySelector('.portrait-stage');
const character = document.querySelector('.portrait-tilt');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if (stage && character) {
  stage.addEventListener('pointermove', (event) => {
    if (motion.matches || !pointer.matches) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    character.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
  });
  const reset = () => { character.style.transform = ''; };
  stage.addEventListener('pointerleave', reset);
  motion.addEventListener('change', reset);
  pointer.addEventListener('change', reset);
}