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

/* ---- Pixel art flag animation ---- */
(function setupFlag() {
  var canvas = document.getElementById('flagCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var SCALE = 3, FW = 40, FH = 26;
  var RED = '#CC2936', WHT = '#FFFFFF', BLU = '#002868';

  var px = [];
  for (var y = 0; y < FH; y++) {
    px[y] = [];
    var stripeIdx = Math.floor(y / 2);
    for (var x = 0; x < FW; x++) {
      var inCanton = x < 16 && y < 14;
      px[y][x] = inCanton ? BLU : (stripeIdx % 2 === 0 ? RED : WHT);
    }
  }
  var sixStarX  = [1, 3, 6, 8, 11, 13];
  var fiveStarX = [2, 5, 7, 10, 12];
  [1, 3, 5, 7, 9, 11, 13].forEach(function(sy, i) {
    var xs = i % 2 === 0 ? sixStarX : fiveStarX;
    xs.forEach(function(sx) { if (sx < 16 && sy < 14) px[sy][sx] = WHT; });
  });

  var time = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var x = 0; x < FW; x++) {
      var wave = Math.sin(x * 0.38 + time) * 1.2;
      for (var y = 0; y < FH; y++) {
        ctx.fillStyle = px[y][x];
        ctx.fillRect(x * SCALE, Math.round(y * SCALE + wave * SCALE), SCALE, SCALE);
      }
    }
    time += 0.03;
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
