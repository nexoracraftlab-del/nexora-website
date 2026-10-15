// Position-aware card depth, only for a mouse/trackpad with motion enabled.
(() => {
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  const panels = [...document.querySelectorAll('.panel')];
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
