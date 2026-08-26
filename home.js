const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const hero = document.querySelector('[data-hero]');

const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 24);
updateHeader();
addEventListener('scroll', updateHeader, {passive: true});

if (!reduceMotion) {
  document.documentElement.classList.add('motion-ready');
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  document.querySelectorAll('[data-reveal]').forEach(section => reveal.observe(section));

  hero?.addEventListener('pointermove', event => {
    const box = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
    hero.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
  }, {passive: true});
}
