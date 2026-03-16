(function() {
  var nav = document.querySelector('.site-nav');
  var heroTitle = document.querySelector('.hero-title');
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var heroParallaxItems = Array.prototype.slice.call(document.querySelectorAll('.hero [data-parallax-speed]'));
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (nav && heroTitle && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function(entries) {
      var entry = entries[0];
      nav.classList.toggle('is-visible', !entry.isIntersecting);
    }, {
      threshold: 0.05
    });

    navObserver.observe(heroTitle);
  } else if (nav) {
    nav.classList.add('is-visible');
  }

  if (revealItems.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -10% 0px'
    });

    revealItems.forEach(function(item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function(item) {
      item.classList.add('is-visible');
    });
  }

  if (!heroParallaxItems.length || prefersReducedMotion) {
    return;
  }

  var ticking = false;

  function updateHeroParallax() {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    heroParallaxItems.forEach(function(item) {
      var speed = parseFloat(item.getAttribute('data-parallax-speed')) || 0;
      var rect = item.getBoundingClientRect();
      var distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      var offset = distanceFromCenter * speed * -0.08;
      var limitedOffset = Math.max(Math.min(offset, 16), -16);
      item.style.transform = 'translate3d(0, ' + limitedOffset.toFixed(2) + 'px, 0)';
    });

    ticking = false;
  }

  function requestTick() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateHeroParallax);
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  requestTick();
})();
