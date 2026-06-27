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

/* ---- Pixel art duck (SAVED — headshot version) ---- */
if (false) { (function setupDuck() {
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
    bubble.style.transition = '';
    bubble.style.opacity = '';
    bubble.classList.remove('show');
    void bubble.offsetWidth;
    bubble.classList.add('show');
    hideTimer = setTimeout(function() {
      /* Pin opacity:1 inline so removing .show doesn't snap to 0 */
      bubble.style.opacity = '1';
      bubble.classList.remove('show');
      void bubble.offsetWidth;
      bubble.style.transition = 'opacity 0.7s ease';
      bubble.style.opacity = '0';
    }, 1800);
  }

  canvas.addEventListener('mouseenter', showQuack);
  canvas.addEventListener('click', showQuack);
})(); }

/* ---- Walking duck across hero ---- */
(function setupWalkingDuck() {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  hero.style.position = 'relative';

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
  hero.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var S = 4;
  var Y = '#FFD800', O = '#FF8800', B = '#111111', D = '#C8A800', _ = null;

  /* Right-facing, waddle A — left foot forward */
  var duckRA = [
    [_,_,_,Y,Y,Y,_,_,_,_],
    [_,_,Y,Y,Y,Y,Y,_,_,_],
    [_,_,Y,Y,B,Y,O,O,_,_],
    [_,_,Y,Y,Y,Y,O,O,_,_],
    [_,Y,Y,Y,Y,Y,Y,Y,Y,_],
    [Y,Y,D,D,Y,Y,Y,Y,Y,_],
    [Y,Y,D,D,Y,Y,Y,Y,Y,_],
    [_,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,_,Y,Y,_,_,Y,_,_,_],
    [_,_,O,O,_,_,O,_,_,_],
    [_,O,O,_,_,_,O,O,_,_],
  ];

  /* Right-facing, waddle B — right foot forward */
  var duckRB = [
    [_,_,_,Y,Y,Y,_,_,_,_],
    [_,_,Y,Y,Y,Y,Y,_,_,_],
    [_,_,Y,Y,B,Y,O,O,_,_],
    [_,_,Y,Y,Y,Y,O,O,_,_],
    [_,Y,Y,Y,Y,Y,Y,Y,Y,_],
    [Y,Y,D,D,Y,Y,Y,Y,Y,_],
    [Y,Y,D,D,Y,Y,Y,Y,Y,_],
    [_,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,_,_,Y,_,_,Y,Y,_,_],
    [_,_,_,O,_,_,O,O,_,_],
    [_,_,O,O,_,_,_,O,O,_],
  ];

  /* Front-facing — used near the top of the arc */
  var duckFwd = [
    [_,_,Y,Y,Y,Y,_,_],
    [_,Y,Y,Y,Y,Y,Y,_],
    [_,Y,B,Y,Y,B,Y,_],
    [_,Y,Y,O,O,Y,Y,_],
    [_,Y,Y,O,O,Y,Y,_],
    [Y,Y,Y,Y,Y,Y,Y,Y],
    [Y,D,D,Y,Y,D,D,Y],
    [Y,D,D,Y,Y,D,D,Y],
    [_,Y,Y,Y,Y,Y,Y,_],
    [_,O,Y,_,_,Y,O,_],
    [O,O,_,_,_,_,O,O],
  ];

  var t = 0;
  var waddleFrame = 0;
  var waddleTick = 0;

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function getPos() {
    var W = canvas.width, H = canvas.height;
    /* base arc: starts/ends at ~78% down, peaks at ~5% (above the headshot) */
    var baseX = W * 0.05 + t * W * 0.90;
    var baseY = H * 0.78 - Math.sin(Math.PI * t) * H * 0.73;
    /* add gentle wobble so the path has organic variation */
    var wobbleX = Math.sin(t * Math.PI * 3.5) * W * 0.028;
    var wobbleY = Math.sin(t * Math.PI * 5 + 1.0) * H * 0.035;
    return { x: baseX + wobbleX, y: baseY + wobbleY };
  }

  function drawGrid(grid, cx, cy) {
    var cols = grid[0].length, rows = grid.length;
    var ox = Math.round(cx - cols * S / 2);
    var oy = Math.round(cy - rows * S / 2);
    grid.forEach(function(row, ry) {
      row.forEach(function(cell, rx) {
        if (!cell) return;
        ctx.fillStyle = cell;
        ctx.fillRect(ox + rx * S, oy + ry * S, S, S);
      });
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* waddle toggle */
    waddleTick++;
    if (waddleTick >= 14) { waddleFrame = 1 - waddleFrame; waddleTick = 0; }

    var pos = getPos();

    /* sprite selection: front-facing at the top of the arc */
    var grid;
    if (t > 0.38 && t < 0.62) {
      grid = duckFwd;
    } else {
      grid = waddleFrame === 0 ? duckRA : duckRB;
    }

    drawGrid(grid, pos.x, pos.y);

    t += 0.0013;
    if (t > 1.08) t = 0; /* brief pause at end before looping */

    requestAnimationFrame(draw);
  }

  draw();
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
