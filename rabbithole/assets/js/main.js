(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // Header taust kerimisel
  var header = document.querySelector('[data-header]');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobiilimenüü
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  var setOpen = function (open) {
    document.body.classList.toggle('nav-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  if (toggle) toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  if (nav) nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  // Videod: liikumist vältivatele kasutajatele peatatud; nupp peatamiseks/käivitamiseks
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-video]').forEach(function (v) {
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
  });
  document.querySelectorAll('[data-video-toggle]').forEach(function (btn) {
    var v = btn.parentNode.querySelector('video');
    if (!v) return;
    var sync = function () {
      var paused = v.paused;
      btn.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-label', paused ? btn.dataset.labelPlay : btn.dataset.labelPause);
    };
    btn.addEventListener('click', function () { if (v.paused) { v.play(); } else { v.pause(); } });
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    sync();
  });

  // Aeglane ilmumine
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
