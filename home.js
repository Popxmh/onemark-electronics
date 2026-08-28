const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const header = document.querySelector('[data-header]');
const hero = document.querySelector('[data-hero]');
const customSection = document.querySelector('.custom-section');

const hud = document.createElement('div');
hud.className = 'factory-hud';
hud.setAttribute('aria-hidden', 'true');
hud.innerHTML = '<span class="hud-index">ONEMARK / 01</span><span class="hud-line"></span><span>CN · SZ</span><span>OEM / ODM</span><span>QC ACTIVE</span><span>EXPORT READY</span>';
hero?.append(hud);

const assembly = document.createElement('div');
assembly.className = 'assembly-stage';
assembly.setAttribute('aria-hidden', 'true');
assembly.setAttribute('dir', 'ltr');
assembly.innerHTML = `
  <div class="assembly-head"><span>CONFIGURATION / LIVE</span><i></i></div>
  <div class="terminal-build">
    <span class="terminal-shell"></span><span class="terminal-screen"></span>
    <span class="terminal-camera"></span><span class="terminal-reader"></span>
    <span class="terminal-printer"></span><span class="terminal-base"></span>
    <span class="terminal-scan"></span>
  </div>
  <div class="assembly-data"><span>DISPLAY</span><span>I/O</span><span>PAYMENT</span><span>BRAND</span></div>`;
document.querySelector('.custom-copy')?.append(assembly);

let ticking = false;
const updateScrollEffects = () => {
  const pageRange = document.documentElement.scrollHeight - innerHeight;
  header?.style.setProperty('--page-progress', pageRange > 0 ? Math.min(scrollY / pageRange, 1) : 0);
  header?.classList.toggle('is-scrolled', scrollY > 24);

  if (!reduceMotion && innerWidth > 760) {
    document.querySelectorAll('.market-image, .factory-photo').forEach(item => {
      const box = item.getBoundingClientRect();
      const offset = Math.max(-18, Math.min(18, (innerHeight / 2 - box.top - box.height / 2) * .035));
      item.style.setProperty('--parallax', `${offset}px`);
    });
  }

  if (customSection) {
    const box = customSection.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .72 - box.top) / (box.height * .72)));
    customSection.style.setProperty('--process-progress', progress);
  }
  ticking = false;
};

const requestScrollUpdate = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScrollEffects);
  }
};
updateScrollEffects();
addEventListener('scroll', requestScrollUpdate, {passive: true});
addEventListener('resize', requestScrollUpdate, {passive: true});

if (!reduceMotion) {
  document.documentElement.classList.add('motion-ready');
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      }
    });
  }, {threshold: .1});
  document.querySelectorAll('[data-reveal]').forEach(section => reveal.observe(section));

  hero?.addEventListener('pointermove', event => {
    const box = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
    hero.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
  }, {passive: true});

  if (finePointer) {
    document.querySelectorAll('.product-grid-featured .cc2').forEach(card => {
      card.addEventListener('pointermove', event => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        card.style.setProperty('--rx', `${(y - .5) * -5}deg`);
        card.style.setProperty('--ry', `${(x - .5) * 6}deg`);
        card.style.setProperty('--gx', `${x * 100}%`);
        card.style.setProperty('--gy', `${y * 100}%`);
      }, {passive: true});
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
}

// One small canvas creates the technical depth without adding a framework.
if (hero && !reduceMotion && innerWidth > 760) {
  const canvas = document.createElement('canvas');
  canvas.className = 'factory-field';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const context = canvas.getContext('2d');
  const points = [];
  let width = 0;
  let height = 0;
  let active = true;
  let lastFrame = 0;

  const resizeCanvas = () => {
    const dpr = Math.min(devicePixelRatio, 1.5);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    points.length = 0;
    const count = Math.min(68, Math.max(38, Math.round(width / 23)));
    for (let i = 0; i < count; i += 1) {
      points.push({x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18});
    }
  };

  const draw = time => {
    if (active && time - lastFrame > 32) {
      lastFrame = time;
      context.clearRect(0, 0, width, height);
      points.forEach((point, index) => {
        point.x = (point.x + point.vx + width) % width;
        point.y = (point.y + point.vy + height) % height;
        for (let next = index + 1; next < points.length; next += 1) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 112) {
            context.strokeStyle = `rgba(80, 214, 255, ${(1 - distance / 112) * .16})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
        context.fillStyle = 'rgba(118, 226, 255, .48)';
        context.fillRect(point.x, point.y, 1.4, 1.4);
      });
      const scan = (time * .045) % height;
      const gradient = context.createLinearGradient(0, scan - 45, 0, scan + 3);
      gradient.addColorStop(0, 'rgba(46, 202, 255, 0)');
      gradient.addColorStop(1, 'rgba(46, 202, 255, .15)');
      context.fillStyle = gradient;
      context.fillRect(0, scan - 45, width, 48);
    }
    requestAnimationFrame(draw);
  };

  new ResizeObserver(resizeCanvas).observe(hero);
  new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }).observe(hero);
  resizeCanvas();
  requestAnimationFrame(draw);
}
