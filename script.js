const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Original gentle floating motion and pointer tilt.
const stage = document.querySelector('.portrait-stage');
const character = document.querySelector('.portrait-still');
if (stage && character) {
  stage.addEventListener('pointermove', (event) => {
    if (motion.matches || !finePointer.matches) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    character.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
  });
  const reset = () => { character.style.transform = ''; };
  stage.addEventListener('pointerleave', reset);
  motion.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
}

// Reveal effects never hide essential content before JavaScript or observation.
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!motion.matches) target.classList.add('is-revealed');
      observer.unobserve(target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.job, .impact-row, .skills-grid article, .education-list article')
    .forEach((element) => reveal.observe(element));
}

const nav = [...document.querySelectorAll('.nav-links a')];
const sections = nav.map((link) => document.querySelector(link.getAttribute('href')));
const progress = document.querySelector('.reading-progress span');
let scrollPending = false;
function updateScroll() {
  scrollPending = false;
  const range = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
  const header = document.querySelector('.header');
  const threshold = (header ? header.getBoundingClientRect().height : 100) + 100;
  let current = -1;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= threshold) current = index;
  });
  nav.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!scrollPending) {
    scrollPending = true;
    requestAnimationFrame(updateScroll);
  }
}, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

const stories = {
  planning: {
    title: 'Planning that reaches the warehouse.',
    description: 'Demand planning, replenishment, and S&OP helped align inventory decisions across 30+ warehouses and support a 98% OTIF delivery rate at FedEx.',
    href: '#inventory', card: 0
  },
  analytics: {
    title: 'Clear signals. Better decisions.',
    description: 'Power BI and Tableau dashboards brought procurement, demand, and logistics KPIs into view. SQL, VBA, and Excel reporting automation reduced manual effort by 40% at FedEx.',
    href: '#forecasting', card: 1
  },
  systems: {
    title: 'Connecting systems to operations.',
    description: 'SAP S/4HANA, SAP EWM, Oracle ERP, and Manhattan WMS supported inventory and warehouse improvements, including an 18% improvement in inventory turnover at FedEx.',
    href: '#experience', card: 2
  },
  business: {
    title: 'From business need to technical clarity.',
    description: 'BRDs, FRDs, UML diagrams, gap analysis, and Jira user stories translated operational requirements into ERP enhancements and coordinated implementation.',
    href: '#experience', card: 3
  }
};
const explorer = document.querySelector('.expertise-explorer');
if (explorer) {
  const controls = [...explorer.querySelectorAll('[data-focus]')];
  const cards = [...document.querySelectorAll('.skills-grid article')];
  explorer.hidden = false;
  function selectStory(key) {
    const story = stories[key];
    if (!story) return;
    controls.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.focus === key)));
    explorer.querySelector('#expertise-title').textContent = story.title;
    explorer.querySelector('#expertise-description').textContent = story.description;
    explorer.querySelector('#expertise-link').setAttribute('href', story.href);
    cards.forEach((card, index) => card.classList.toggle('is-highlighted', index === story.card));
  }
  controls.forEach((button) => button.addEventListener('click', () => selectStory(button.dataset.focus)));
  selectStory('planning');
}

const copy = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
let copyTimer;
if (copy && navigator.clipboard && window.isSecureContext) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('sudabattulam26@gmail.com');
      copyStatus.textContent = 'Email copied.';
    } catch {
      copyStatus.textContent = 'Couldn’t copy. Use the email link above.';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyStatus.textContent = ''; }, 5000);
  });
}
