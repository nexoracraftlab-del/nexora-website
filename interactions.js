// Position-aware card depth, only for a mouse/trackpad with motion enabled.
(() => {
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  const panels = [...document.querySelectorAll('.panel:not(.journey-card)')];
  const cleanups = [];
  panels.forEach(panel => {
    let frame = 0;
    let bounds = null;
    let point = null;
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      bounds = null;
      point = null;
      panel.classList.remove('is-pointer-active');
      panel.style.removeProperty('--tilt-x');
      panel.style.removeProperty('--tilt-y');
    }
    function update() {
      frame = 0;
      if (!bounds || !point) return;
      const x = Math.max(-1, Math.min(1, (point.x - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (point.y - bounds.top) / bounds.height * 2 - 1));
      panel.style.setProperty('--tilt-x', (-y * 5).toFixed(2) + 'deg');
      panel.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
      panel.classList.add('is-pointer-active');
    }
    function move(event) {
      if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) return;
      if (!bounds) bounds = panel.getBoundingClientRect();
      point = {x:event.clientX,y:event.clientY};
      if (!frame) frame = requestAnimationFrame(update);
    }
    panel.addEventListener('pointerenter', move);
    panel.addEventListener('pointermove', move, {passive:true});
    panel.addEventListener('pointerleave', reset);
    panel.addEventListener('pointercancel', reset);
    cleanups.push(reset);
  });
  function resetAll() { cleanups.forEach(reset => reset()); }
  finePointer.addEventListener('change', resetAll);
  reducedMotion.addEventListener('change', resetAll);
  addEventListener('scroll', resetAll, {passive:true});
  addEventListener('resize', resetAll, {passive:true});
})();

// A soft halo and two trailing glows; the operating system cursor stays intact.
(() => {
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const wide = matchMedia('(min-width:781px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const aura = document.createElement('div');
  aura.className = 'cursor-aura';
  aura.setAttribute('aria-hidden', 'true');
  const dots = Array.from({length:3}, () => {
    const dot = document.createElement('i'); aura.append(dot); return dot;
  });
  document.body.append(aura);
  const points = dots.map(() => ({x:0,y:0}));
  let target = null, frame = 0, lastTime = 0;
  function hide() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0; target = null;
    aura.classList.remove('is-visible');
  }
  function tick(time) {
    frame = 0;
    if (!target || !fine.matches || !wide.matches || reduced.matches || document.hidden) { hide(); return; }
    const elapsed = lastTime ? Math.min(40, time - lastTime) : 16;
    lastTime = time;
    let distance = 0;
    points.forEach((point, i) => {
      const aim = i ? points[i - 1] : target;
      const blend = 1 - Math.exp(-elapsed / (i ? 80 + i * 25 : 45));
      point.x += (aim.x - point.x) * blend;
      point.y += (aim.y - point.y) * blend;
      dots[i].style.transform = 'translate3d(' + point.x.toFixed(2) + 'px,' + point.y.toFixed(2) + 'px,0)';
      distance += Math.abs(target.x - point.x) + Math.abs(target.y - point.y);
    });
    if (distance > .4) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !fine.matches || !wide.matches || reduced.matches) return;
    if (!target) points.forEach(point => { point.x = event.clientX; point.y = event.clientY; });
    target = {x:event.clientX,y:event.clientY};
    aura.classList.add('is-visible');
    if (!frame) frame = requestAnimationFrame(tick);
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('pointercancel', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  addEventListener('blur', hide);
  fine.addEventListener('change', hide);
  wide.addEventListener('change', hide);
  reduced.addEventListener('change', hide);
})();
