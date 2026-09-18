/* Candy Cane Lane — Garden City Christmas Parade */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Parade date (edit here each year) ---------- */
  var PARADE_DATE = new Date('2026-12-05T18:00:00-06:00');

  /* ---------- Countdown ---------- */
  var cd = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
    label: document.querySelector('.countdown-label')
  };

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var diff = PARADE_DATE - Date.now();
    if (diff <= 0) {
      cd.days.textContent = '00';
      cd.hours.textContent = '00';
      cd.mins.textContent = '00';
      cd.secs.textContent = '00';
      if (cd.label) cd.label.textContent = 'The parade is here! See you on Main Street!';
      return;
    }
    var s = Math.floor(diff / 1000);
    cd.days.textContent = pad(Math.floor(s / 86400));
    cd.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.mins.textContent = pad(Math.floor((s % 3600) / 60));
    cd.secs.textContent = pad(s % 60);
  }
  if (cd.days) { tick(); setInterval(tick, 1000); }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Back to top ---------- */
  var topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.card, .timeline-item, .sponsor-card, .accordion details, .route-map, .route-notes, .entry-form');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- Entry form ---------- */
  var form = document.getElementById('entry-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var ok = field.checkValidity();
        field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.textContent = 'Please fill in the highlighted fields so we can reach you.';
        status.classList.add('error');
        return;
      }
      status.classList.remove('error');
      status.textContent = 'Ho ho ho! Your entry is on the list. We will email line-up details soon. 🎄';
      form.reset();
      burst();
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Snow ---------- */
  var canvas = document.getElementById('snow');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var flakes = [];
  var W = 0, H = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeFlake(fromTop) {
    return {
      x: Math.random() * W,
      y: fromTop ? -10 : Math.random() * H,
      r: 1 + Math.random() * 3,
      vy: 0.5 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.6,
      o: 0.4 + Math.random() * 0.6,
      wobble: Math.random() * Math.PI * 2
    };
  }

  function drawSnow() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.wobble += 0.02;
      f.x += f.vx + Math.sin(f.wobble) * 0.3;
      f.y += f.vy;
      if (f.y > H + 10 || f.x < -10 || f.x > W + 10) flakes[i] = makeFlake(true);
      ctx.globalAlpha = f.o;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawSnow);
  }

  if (ctx && !reduceMotion) {
    resize();
    var count = Math.min(160, Math.floor(W / 8));
    for (var i = 0; i < count; i++) flakes.push(makeFlake(false));
    window.addEventListener('resize', resize);
    requestAnimationFrame(drawSnow);
  }

  /* ---------- Candy burst on form success ---------- */
  function burst() {
    if (!ctx || reduceMotion) return;
    var colors = ['#e63946', '#ffffff', '#2a9d8f', '#f4c95d', '#ffb3c1'];
    var pieces = [];
    var cx = W / 2, cy = H / 2;
    for (var i = 0; i < 90; i++) {
      pieces.push({
        x: cx, y: cy,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 2,
        c: colors[i % colors.length],
        s: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        life: 90
      });
    }
    (function frame() {
      var alive = false;
      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        if (p.life <= 0) continue;
        alive = true;
        p.vy += 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += 0.1;
        p.life--;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.min(1, p.life / 30);
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      if (alive) requestAnimationFrame(frame);
    })();
  }
})();
