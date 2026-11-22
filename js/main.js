/* Alquimia Córdoba – site interactions (plain JavaScript, no build step needed). */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (toggle && mobileMenu) {
    var setMenu = function (open) {
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.hidden = !open;
    };
    toggle.addEventListener('click', function () {
      setMenu(!mobileMenu.classList.contains('is-open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- Back to top ---------- */
  document.querySelectorAll('.back-to-top').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ---------- Hero slider (home) ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dot');
  if (slides.length) {
    var active = 0;
    var timer = null;
    var showSlide = function (n) {
      active = n;
      var next = (n + 1) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('is-active', i === n);
        s.classList.toggle('is-next', i === next);
        s.setAttribute('aria-hidden', String(i !== n));
        if (i === n || i === next) {
          var img = s.querySelector('img');
          if (img) img.loading = 'eager';
        }
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === n); });
      // Advance every 6 seconds; restarts when a dot is clicked.
      clearTimeout(timer);
      timer = setTimeout(function () { showSlide((active + 1) % slides.length); }, 6000);
    };
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { showSlide(i); });
    });
    showSlide(0);
  }

  /* ---------- FAQ accordion (home) ---------- */
  var CARET_CLOSED = '<path d="M2 2l4.5 4L2 10z" fill="currentColor"></path>';
  var CARET_OPEN = '<path d="M0 8.5 4 4.5l4 4z" fill="currentColor"></path>';
  var accItems = document.querySelectorAll('.acc-item');
  var setAcc = function (item, open) {
    var title = item.querySelector('.acc-title');
    var content = item.querySelector('.acc-content');
    var caret = item.querySelector('.acc-caret');
    item.classList.toggle('is-open', open);
    title.setAttribute('aria-expanded', String(open));
    title.setAttribute('aria-selected', String(open));
    content.hidden = !open;
    if (caret) caret.innerHTML = open ? CARET_OPEN : CARET_CLOSED;
  };
  accItems.forEach(function (item) {
    var title = item.querySelector('.acc-title');
    var label = item.querySelector('.acc-label');
    var toggleItem = function () {
      var willOpen = !item.classList.contains('is-open');
      accItems.forEach(function (other) { setAcc(other, false); });
      if (willOpen) setAcc(item, true);
    };
    if (label) label.addEventListener('click', function (e) { e.preventDefault(); });
    title.addEventListener('click', toggleItem);
    title.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem();
      }
    });
  });

  /* ---------- Testimonials carousel (home) ---------- */
  var carousel = document.querySelector('.carousel');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var cards = track.querySelectorAll('.testi-card');
    var perViewFor = function (w) { return w <= 767 ? 1 : w <= 1024 ? 2 : 3; };
    var perView = perViewFor(document.documentElement.clientWidth);
    var index = perView === 3 ? 1 : perView === 2 ? 2 : 3;
    var interval = null;

    var maxIndex = function () { return cards.length - perView; };
    var render = function () {
      index = Math.min(index, maxIndex());
      carousel.style.setProperty('--pv', String(perView));
      track.style.transform = 'translateX(calc(' + -index + ' * (100% + var(--gap)) / var(--pv)))';
    };
    var restartAuto = function () {
      clearInterval(interval);
      interval = setInterval(function () {
        index = index >= maxIndex() ? 0 : index + 1;
        render();
      }, 20000);
    };

    carousel.querySelector('.arrow-prev').addEventListener('click', function () {
      index = index <= 0 ? maxIndex() : index - 1;
      render();
    });
    carousel.querySelector('.arrow-next').addEventListener('click', function () {
      index = index >= maxIndex() ? 0 : index + 1;
      render();
    });
    window.addEventListener('resize', function () {
      var pv = perViewFor(document.documentElement.clientWidth);
      if (pv !== perView) {
        perView = pv;
        render();
        restartAuto();
      }
    });

    render();
    restartAuto();
  }

  /* ---------- Share buttons (article) ---------- */
  var SHARE_URLS = {
    facebook: function (u) { return 'https://www.facebook.com/sharer/sharer.php?u=' + u; },
    twitter: function (u, t) { return 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t; },
    linkedin: function (u) { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + u; },
    reddit: function (u, t) { return 'https://www.reddit.com/submit?url=' + u + '&title=' + t; },
    telegram: function (u, t) { return 'https://t.me/share/url?url=' + u + '&text=' + t; },
    whatsapp: function (u, t) { return 'https://api.whatsapp.com/send?text=' + t + '%20' + u; }
  };
  document.querySelectorAll('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var build = SHARE_URLS[btn.getAttribute('data-share')];
      if (!build) return;
      var titleEl = document.querySelector('.article-body .title');
      var u = encodeURIComponent(window.location.href);
      var t = encodeURIComponent(titleEl ? titleEl.textContent : document.title);
      window.open(build(u, t), '_blank', 'noopener');
    });
  });
})();
