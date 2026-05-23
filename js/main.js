// Mobile menu toggle
function toggleMobile() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('active');
}

// Scroll to signup
function scrollToSignup() {
  var signup = document.getElementById('signup');
  if (signup) signup.scrollIntoView({ behavior: 'smooth' });
}

// Email signup handler
async function handleSignup(e) {
  e.preventDefault();
  var form = e.target;
  var emailInput = form.querySelector('input[type="email"]');
  var email = emailInput.value;
  var submitButton = form.querySelector('button[type="submit"]');

  var originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  try {
    var response = await fetch('https://n8n.flowmatica.ca/webhook/flowmatica-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        timestamp: new Date().toISOString(),
        source: 'flowmatica-landing-page'
      })
    });

    if (response.ok) {
      var msg = document.getElementById('success-message');
      if (msg) msg.classList.add('show');
      form.reset();
      setTimeout(function() {
        var msg2 = document.getElementById('success-message');
        if (msg2) msg2.classList.remove('show');
      }, 5000);
    } else {
      throw new Error('Failed');
    }
  } catch (err) {
    alert('Oops! Something went wrong. Email us at hello@flowmatica.ca');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        var menu = document.getElementById('mobile-menu');
        if (menu && menu.classList.contains('active')) {
          menu.classList.remove('active');
        }
      }
    }
  });
});

// Close mobile menu on outside click
document.addEventListener('click', function(e) {
  var menu = document.getElementById('mobile-menu');
  var nav = document.getElementById('nav');
  if (menu && nav && menu.classList.contains('active') && !nav.contains(e.target)) {
    menu.classList.remove('active');
  }
});

// Nav scroll effect
var nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Resize handler
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    var menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.remove('active');
  }
});

// Lightbox (only if elements exist)
(function() {
  var links = document.querySelectorAll('.lightbox');
  if (links.length === 0) return;

  var overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  var overlayImg = document.createElement('img');
  overlay.appendChild(overlayImg);
  document.body.appendChild(overlay);

  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      overlayImg.src = link.href;
      overlay.style.display = 'flex';
    });
  });

  overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
  });
})();

// Scroll Reveal with Intersection Observer
(function() {
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(function(el) { observer.observe(el); });
})();

// Counter Animation
(function() {
  var counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = target % 1 !== 0;
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(0) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(el) { observer.observe(el); });
})();

// Parallax Hero Shapes
(function() {
  var shapes = document.querySelectorAll('.parallax-shapes .shape');
  if (shapes.length === 0) return;

  window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset;
    shapes.forEach(function(shape, i) {
      var speed = 0.05 + (i * 0.02);
      shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  });
})();

// Carousel
(function() {
  var track = document.getElementById('carousel-track');
  if (!track) return;

  var slides = track.querySelectorAll('.carousel-slide');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var dotsContainer = document.getElementById('carousel-dots');
  var currentIndex = 0;
  var totalSlides = slides.length;
  var autoplayInterval;
  var container = track.closest('.carousel-container');

  // Create dots
  for (var i = 0; i < totalSlides; i++) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function(idx) { return function() { goTo(idx); }; }(i));
    dotsContainer.appendChild(dot);
  }

  var dots = dotsContainer.querySelectorAll('.carousel-dot');

  function goTo(index) {
    currentIndex = index;
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  function goNext() { goTo((currentIndex + 1) % totalSlides); }
  function goPrev() { goTo((currentIndex - 1 + totalSlides) % totalSlides); }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(goNext, 4000);
  }
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  startAutoplay();

  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });
})();
