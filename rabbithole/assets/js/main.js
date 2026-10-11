(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // Uus leht avaneb alati ülevalt (v.a ankurlingid ja brauseri tagasi-nupp)
  if (!location.hash) {
    var navEntry = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
    if (!navEntry || navEntry.type !== 'back_forward') {
      var toTop = function () {
        doc.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        doc.style.scrollBehavior = '';
      };
      toTop();
      window.addEventListener('DOMContentLoaded', toTop);
      window.addEventListener('load', toTop);
    }
  }

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

  // Videod: vaiksed ja aeglased, mängivad iseenesest; igal videol on peatamise nupp
  document.querySelectorAll('[data-video]').forEach(function (v) {
    v.muted = true;
    v.setAttribute('muted', '');
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* automaatne esitus keelatud: jääb poster, nupust saab käivitada */ });
  });
  document.querySelectorAll('[data-video-toggle]').forEach(function (btn) {
    var box = btn.closest('.hero, .room__media, .location__media') || btn.parentNode;
    var v = box.querySelector('video');
    if (!v) return;
    var sync = function () {
      var paused = v.paused;
      btn.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-label', paused ? btn.dataset.labelPlay : btn.dataset.labelPause);
    };
    btn.addEventListener('click', function () { if (v.paused) { v.muted = true; v.play(); } else { v.pause(); } });
    v.addEventListener('play', sync); v.addEventListener('pause', sync); v.addEventListener('playing', sync);
    setTimeout(sync, 1200);
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
