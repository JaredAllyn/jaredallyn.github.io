/* =============================================
   JARED ALLYN — PERSONAL WEBSITE
   scripts/main.js
   ============================================= */

/* ---- Bounce-click animation ---- */
function addBounceToElements(selector) {
  document.querySelectorAll(selector).forEach(function(el) {
    el.addEventListener('click', function() {
      el.classList.remove('bounce-click');
      // Force reflow so the animation restarts if clicked again quickly
      void el.offsetWidth;
      el.classList.add('bounce-click');
      el.addEventListener('animationend', function handler() {
        el.classList.remove('bounce-click');
        el.removeEventListener('animationend', handler);
      });
    });
  });
}

/* Apply bounce to buttons, nav links, and contact links */
addBounceToElements('.btn');
addBounceToElements('.navbar__links a');
addBounceToElements('.navbar__mobile a');
addBounceToElements('.contact-link-item');

/* ---- Copy email to clipboard ---- */
(function setupEmailCopy() {
  var emailLink = document.querySelector('a[href="mailto:allynkjared@gmail.com"]');
  if (!emailLink) return;

  emailLink.addEventListener('click', function(e) {
    e.preventDefault();
    navigator.clipboard.writeText('allynkjared@gmail.com').then(function() {
      var label = emailLink.querySelector('.contact-link-label');
      var original = label.childNodes[0].nodeValue;
      label.childNodes[0].nodeValue = 'Copied to clipboard!';
      setTimeout(function() {
        label.childNodes[0].nodeValue = original;
      }, 2000);
    });
  });
})();

/* ---- Smooth SVG flag wave animation ---- */
(function setupFlag() {
  var canvas = document.getElementById('flagCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var W = canvas.width, H = canvas.height;
  var COLS = 80;
  var RED = '#B22234', WHT = '#FFFFFF', BLU = '#3C3B6E';

  /* stripe heights: 13 stripes, 7 red 6 white */
  var stripeH = H / 13;
  /* canton covers top 7 stripes, left 2/5 width */
  var cantonW = W * 0.4, cantonH = stripeH * 7;

  var time = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* draw column slices with wave offset */
    for (var col = 0; col < COLS; col++) {
      var x = (col / COLS) * W;
      var sliceW = W / COLS + 1;
      /* wave: amplitude grows left→right like a waving flag */
      var amp = (col / COLS) * 5.5;
      var waveY = Math.sin(col * 0.22 - time) * amp;

      ctx.save();
      ctx.translate(0, waveY);

      /* 13 stripes */
      for (var s = 0; s < 13; s++) {
        ctx.fillStyle = s % 2 === 0 ? RED : WHT;
        ctx.fillRect(x, s * stripeH, sliceW, stripeH + 0.5);
      }

      /* canton blue field */
      if (x < cantonW) {
        ctx.fillStyle = BLU;
        ctx.fillRect(x, 0, Math.min(sliceW, cantonW - x), cantonH);
      }

      ctx.restore();
    }

    /* stars — drawn on top, unaffected by wave for clarity */
    ctx.fillStyle = WHT;
    var rows = [6, 5, 6, 5, 6, 5, 6, 5, 6];
    var starR = 1.8;
    rows.forEach(function(count, rowIdx) {
      var offsetX = count === 5 ? (cantonW / 12) : (cantonW / 24);
      for (var i = 0; i < count; i++) {
        var sx = offsetX + i * (cantonW / (count === 6 ? 6 : 5.5));
        var sy = stripeH * 0.65 + rowIdx * (cantonH / 9.5);
        ctx.beginPath();
        ctx.arc(sx, sy, starR, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    time += 0.04;
    requestAnimationFrame(draw);
  }

  draw();
})();

/* ---- Pixel art duck ---- */
(function setupDuck() {
  var canvas = document.getElementById('duckCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  /* pixel grid — 0=transparent, 1=yellow, 2=orange, 3=black, 4=dark yellow */
  var S = 4; /* scale: each pixel = 4x4 screen pixels */
  var Y = '#FFD800';
  var O = '#FF8800';
  var B = '#111111';
  var D = '#C8A800';
  var _ = null;

  var grid = [
    [_,_,_,Y,Y,Y,_,_,_,_],
    [_,_,Y,Y,Y,Y,Y,_,_,_],
    [_,_,Y,Y,B,Y,O,O,_,_],
    [_,_,Y,Y,Y,Y,O,O,_,_],
    [_,Y,Y,Y,Y,Y,Y,Y,Y,_],
    [Y,Y,D,D,Y,Y,Y,Y,Y,_],
    [Y,Y,D,D,Y,Y,Y,Y,Y,_],
    [_,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,_,Y,Y,_,_,Y,Y,_,_],
    [_,_,O,O,_,_,O,O,_,_],
    [_,_,O,_,_,_,O,_,_,_],
  ];

  canvas.width  = grid[0].length * S;
  canvas.height = grid.length * S;

  grid.forEach(function(row, ry) {
    row.forEach(function(col, rx) {
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(rx * S, ry * S, S, S);
    });
  });

  /* Quack on hover + click */
  var bubble = document.getElementById('quackBubble');
  if (!bubble) return;

  var hideTimer = null;

  function showQuack() {
    clearTimeout(hideTimer);
    bubble.classList.remove('show');
    void bubble.offsetWidth;
    bubble.classList.add('show');
    hideTimer = setTimeout(function() {
      bubble.style.opacity = '0';
      bubble.style.transform = 'scale(0)';
    }, 1800);
  }

  canvas.addEventListener('mouseenter', showQuack);
  canvas.addEventListener('click', showQuack);
})();

/* ---- Active nav link highlighting ---- */
(function highlightActiveNav() {
  var path = window.location.pathname;
  var filename = path.split('/').pop() || 'index.html';
  if (filename === '') filename = 'index.html';

  var allLinks = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
  allLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === filename || (filename === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- Mobile hamburger toggle ---- */
(function setupHamburger() {
  var btn = document.querySelector('.navbar__hamburger');
  var drawer = document.querySelector('.navbar__mobile');
  if (!btn || !drawer) return;

  btn.addEventListener('click', function() {
    var isOpen = drawer.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    // Animate bars
    var bars = btn.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  // Close drawer when a link is clicked
  drawer.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      drawer.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      var bars = btn.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    });
  });
})();
