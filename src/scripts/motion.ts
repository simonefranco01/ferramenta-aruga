// Animazioni all'ingresso in viewport (handoff: "Interactions & Behavior").
// Elementi con data-rv="up|pop|hammer|ruler|screw|fill|count", ritardo data-d, durata data-dur.
// Con prefers-reduced-motion: reduce non parte nulla.

const K: Record<string, Keyframe[]> = {
  screw: [{ opacity: 0, transform: 'rotate(-300deg) scale(.4)' }, { opacity: 1, transform: 'none' }],
  fill: [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
  ruler: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
  up: [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }],
  pop: [{ opacity: 0, transform: 'translateY(30px) scale(.95)' }, { opacity: 1, transform: 'none' }],
  hammer: [
    { transform: 'rotate(0)' },
    { transform: 'rotate(-32deg)', offset: 0.35 },
    { transform: 'rotate(5deg)', offset: 0.55 },
    { transform: 'rotate(-4deg)', offset: 0.72 },
    { transform: 'rotate(0)' },
  ],
};

function count(el: HTMLElement, delay: number) {
  const to = parseFloat(el.dataset.to || '0');
  const dec = +(el.dataset.dec || 0);
  const t0 = performance.now() + delay;
  const f = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - t0) / 1400));
    el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace('.', ',');
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

function init() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const k = el.dataset.rv || 'up';
        const d = +(el.dataset.d || 0);
        if (k === 'count') return count(el, d);
        el.animate(K[k] || K.up, {
          duration: +(el.dataset.dur || 600),
          delay: d,
          easing: k === 'fill' ? 'linear' : 'cubic-bezier(.2,.8,.2,1)',
          fill: 'backwards',
        });
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll<HTMLElement>('[data-rv]').forEach((el) => io.observe(el));
}

init();
