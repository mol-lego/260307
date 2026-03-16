(function() {
  var nav = document.querySelector('.site-nav');
  var heroTitle = document.querySelector('.hero-title');
  var parallaxItems = Array.prototype.slice.call(document.querySelectorAll('[data-parallax-speed]'));
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!nav || !heroTitle || !('IntersectionObserver' in window)) {
    if (nav) {
      nav.classList.add('is-visible');
    }
  } else {
    var observer = new IntersectionObserver(function(entries) {
      var entry = entries[0];
      nav.classList.toggle('is-visible', !entry.isIntersecting);
    }, {
      threshold: 0.05
    });

    observer.observe(heroTitle);
  }

  if (!parallaxItems.length || prefersReducedMotion) {
    return;
  }

  var ticking = false;

  function updateParallax() {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    parallaxItems.forEach(function(item) {
      var speed = parseFloat(item.getAttribute('data-parallax-speed')) || 0;
      var rect = item.getBoundingClientRect();
      var distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      var offset = distanceFromCenter * speed * -0.3;
      var limitedOffset = Math.max(Math.min(offset, 84), -84);
      item.style.transform = 'translate3d(0, ' + limitedOffset.toFixed(2) + 'px, 0)';
    });

    ticking = false;
  }

  function requestTick() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  requestTick();
})();
