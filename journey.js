// Native scrolling and clickable stops share one position in the product story.
(() => {
  const section = document.querySelector('.product-journey');
  if (!section) return;
  const cards = [...section.querySelectorAll('.journey-card')];
  const buttons = cards.map(card => card.querySelector('.journey-select'));
  const stage = section.querySelector('.journey-stage');
  const path = section.querySelector('.journey-route-lit');
  const spark = section.querySelector('.journey-spark');
  const desktop = matchMedia('(min-width:740px) and (min-height:560px)');
  const fullDesktop = matchMedia('(min-width:1001px) and (min-height:680px)');
  const routeSvg = section.querySelector('.journey-route');
  const routeBase = routeSvg ? routeSvg.querySelector('path') : null;
  const wideRoute = path ? path.getAttribute('d') : '';
  const compactRoute = 'M200 480 C340 535 560 530 760 530 C910 530 970 560 940 600 C920 626.666667 865 630 820 630 C680 630 560 685 450 780 C410 814.545455 400 850 410 880';
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));
  let frame = 0, paintFrame = 0, painted = 0, targetRoute = 0, lastPaint = 0;
  let pinned = false, selected = -1, navigation = null;
  let pathLength = path ? path.getTotalLength() : 0;

  function select(index) {
    if (index === selected) return;
    selected = index;
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === index);
      card.classList.toggle('is-past', i < index);
      buttons[i].setAttribute('aria-pressed', String(i === index));
      if (i === index) card.setAttribute('aria-current', 'step');
      else card.removeAttribute('aria-current');
    });
  }
  function draw(value) {
    section.style.setProperty('--route-progress', value.toFixed(4));
    if (spark && pathLength) {
      const point = path.getPointAtLength(pathLength * value);
      spark.setAttribute('cx', point.x.toFixed(2));
      spark.setAttribute('cy', point.y.toFixed(2));
    }
  }
  function paint(time) {
    paintFrame = 0;
    const elapsed = lastPaint ? Math.min(40, time - lastPaint) : 16;
    lastPaint = time;
    painted += (targetRoute - painted) * (1 - Math.exp(-elapsed / 110));
    if (Math.abs(targetRoute - painted) < .0003) { painted = targetRoute; lastPaint = 0; }
    draw(painted);
    if (painted !== targetRoute) paintFrame = requestAnimationFrame(paint);
  }
  function setRoute(value, instant = false) {
    targetRoute = value;
    if (instant || reduced.matches) {
      cancelAnimationFrame(paintFrame); paintFrame = 0; lastPaint = 0;
      painted = value; draw(value);
    } else if (!paintFrame && !document.hidden) paintFrame = requestAnimationFrame(paint);
  }
  function routeAt(progress) {
    const stops = fullDesktop.matches ? [0.000000, 0.629416, 0.923816, 1] : [0.000000, 0.637244, 0.920522, 1];
    const phase = clamp(progress) * cards.length;
    const step = Math.min(cards.length - 1, Math.floor(phase));
    return stops[step] + (stops[step + 1] - stops[step]) * Math.min(1, phase - step);
  }
  function update() {
    frame = 0;
    if (reduced.matches) return;
    if (navigation && (Math.abs(scrollY - navigation.y) < 2 || performance.now() > navigation.deadline)) navigation = null;
    if (pinned) {
      const top = parseFloat(section.style.getPropertyValue('--journey-top'));
      const distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const progress = clamp((top - section.getBoundingClientRect().top) / distance);
      setRoute(routeAt(navigation ? (navigation.index + .35) / cards.length : progress));
      select(navigation ? navigation.index : Math.min(cards.length - 1, Math.floor(progress * cards.length)));
    } else if (!navigation) {
      const center = innerHeight * .52;
      let nearest = 0, gap = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const next = Math.abs(rect.top + rect.height / 2 - center);
        if (next < gap) { nearest = i; gap = next; }
      });
      select(nearest);
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function cancelNavigation() { navigation = null; schedule(); }
  function topInset() { return parseFloat(section.style.getPropertyValue('--journey-top')) || 88; }
  function activate(index) {
    let y;
    if (pinned) {
      const distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const progress = (index + .35) / cards.length;
      y = scrollY + section.getBoundingClientRect().top - topInset() + distance * progress;
      setRoute(routeAt(progress));
    } else {
      const rect = cards[index].getBoundingClientRect();
      y = scrollY + rect.top - Math.max(topInset() + 16, (innerHeight - rect.height) / 2);
    }
    y = Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight));
    navigation = {index, y, deadline:performance.now() + 1600};
    select(index);
    window.scrollTo({top:y, behavior:reduced.matches ? 'instant' : 'smooth'});
    schedule();
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => activate(index)));
  addEventListener('wheel', cancelNavigation, {passive:true});
  addEventListener('touchstart', cancelNavigation, {passive:true});
  addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(event.key) || (event.key === ' ' && !event.target.closest('.journey-select'))) cancelNavigation();
  });
  function configure() {
    navigation = null;
    section.style.setProperty('--journey-top', Math.ceil(document.querySelector('header').getBoundingClientRect().height + 8) + 'px');
    pinned = desktop.matches && !reduced.matches;
    section.classList.toggle('is-pinned', pinned);
    section.classList.toggle('is-compact', pinned && !fullDesktop.matches);
    if (path) {
      const d = fullDesktop.matches ? wideRoute : compactRoute;
      path.setAttribute('d', d);
      if (routeBase) routeBase.setAttribute('d', d);
    }
    if (pinned) {
      const bounds = stage.getBoundingClientRect();
      const heading = section.querySelector('.section-heading').getBoundingClientRect();
      const bottom = Math.max(...cards.map(card => card.getBoundingClientRect().bottom));
      if (heading.top < bounds.top || bottom > bounds.bottom - 8) {
        pinned = false; section.classList.remove('is-pinned');
      }
    }
    selected = -1;
    if (reduced.matches) {
      cancelAnimationFrame(paintFrame); paintFrame = 0; lastPaint = 0;
      cards.forEach((card, i) => {
        card.classList.remove('is-current', 'is-past');
        card.removeAttribute('aria-current');
        buttons[i].setAttribute('aria-pressed', 'false');
      });
      section.style.removeProperty('--route-progress');
    } else { pathLength = path ? path.getTotalLength() : 0; schedule(); }
  }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', configure, {passive:true});
  desktop.addEventListener('change', configure);
  fullDesktop.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  new MutationObserver(configure).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(paintFrame); paintFrame = 0; lastPaint = 0; }
    else schedule();
  });
  function goToStart(behavior = 'smooth') {
    navigation = null;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    window.scrollTo({top:scrollY + section.getBoundingClientRect().top - Math.max(padding, topInset()), behavior:reduced.matches ? 'instant' : behavior});
  }
  document.querySelectorAll('a[href="#services"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== '#services') history.pushState(null, '', '#services');
      goToStart();
    });
  });
  document.fonts.ready.then(() => {
    configure();
    if (location.hash === '#services') goToStart('instant');
  });
  addEventListener('load', () => {
    if (location.hash === '#services') requestAnimationFrame(() => goToStart('instant'));
  }, {once:true});
  configure();
})();
