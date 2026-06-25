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
