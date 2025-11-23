// Trigger slide-down animation for hero section contents after page load
window.addEventListener('DOMContentLoaded', function() {
  
  const items = document.querySelectorAll(".slide-down-animate");

  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });
  
    items.forEach((el) => observer.observe(el));
  }, 2000); // 200ms is enough


});
// interactions: open invite (plays music), reveal on scroll, countdown, copy buttons, music toggle,
// letter-by-letter title reveal, and parallax layers
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const openBtn = document.getElementById('openInvite');
  const bgMusic = document.getElementById('bgMusic');
  const bgVideo = document.getElementById('bgVideo');
  const musicToggle = document.getElementById('musicToggle');
  const copyBtns = document.querySelectorAll('.copy-btn');
  const revealEls = document.querySelectorAll('.reveal');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const floralSVG = document.querySelector('.floral-frame');
  const titleEls = document.querySelectorAll('.hero-title.js-split');


  document.querySelectorAll(".detail-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.target);
      target.style.display = target.style.display === "block" ? "none" : "block";
    });
  });

  // Copy account number
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      alert("Nomor rekening telah disalin");
    });
  });

  // MOBILE MENU
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      navLinks.style.display = expanded ? 'none' : 'flex';
    });
  }

  // PLAY AUDIO + OPEN INVITE (user gesture)
  if (openBtn) {
    openBtn.addEventListener('click', async () => {
      try {
        // Ensure music starts playing
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.classList.add('on');
      } catch (e) {
        console.warn('Autoplay prevented:', e);
      }

      if (bgVideo && bgVideo.paused) {
        try { await bgVideo.play(); } catch(e){ /* ignore */ }
      }

      // focus next section
      document.getElementById('save').scrollIntoView({behavior:'smooth'});
    });
  }

  // Music toggle
  if (musicToggle) {
    musicToggle.addEventListener('click', async () => {
      try {
        if (bgMusic.paused) {
          await bgMusic.play();
          musicToggle.setAttribute('aria-pressed', 'true');
          musicToggle.classList.add('on');
        } else {
          bgMusic.pause();
          musicToggle.setAttribute('aria-pressed', 'false');
          musicToggle.classList.remove('on');
        }
      } catch (e) {
        console.warn('Music toggle error:', e);
      }
    });
  }

  // Reveal on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {threshold: 0.15});

  revealEls.forEach(el => io.observe(el));

  // Initialize Lottie animation
  function initLottieAnimation() {
    const lottieContainer = document.getElementById('lottie-scroll');
    if (!lottieContainer || lottieContainer.hasAttribute('data-lottie-loaded')) {
      return; // already loaded or container doesn't exist
    }
    
    if (!window.lottie) {
      console.warn('Lottie library not available yet');
      return;
    }
    
    try {
      lottieContainer.setAttribute('data-lottie-loaded', 'true');
      window.lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'media/scroll_down.json'
      });
      console.log('Lottie animation loaded successfully');
    } catch (e) {
      console.error('Error loading Lottie animation:', e);
    }
  }

  // Initialize Birds Lottie animation
  function initBirdsAnimation() {
    const birdsContainer = document.getElementById('lottie-birds');
    if (!birdsContainer || birdsContainer.hasAttribute('data-lottie-loaded')) {
      return; // already loaded or container doesn't exist
    }
    
    if (!window.lottie) {
      console.warn('Lottie library not available yet');
      return;
    }
    
    try {
      birdsContainer.setAttribute('data-lottie-loaded', 'true');
      window.lottie.loadAnimation({
        container: birdsContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'media/birds.json'
      });
      console.log('Birds animation loaded successfully');
    } catch (e) {
      console.error('Error loading birds animation:', e);
    }
  }

  // Initialize Wedding Floral Lottie animation
  function initWeddingFloralAnimation() {
    const floralContainer = document.getElementById('lottie-weddingfloral');
    if (!floralContainer || floralContainer.hasAttribute('data-lottie-loaded')) {
      return; // already loaded or container doesn't exist
    }
    
    if (!window.lottie) {
      console.warn('Lottie library not available yet');
      return;
    }
    
    try {
      floralContainer.setAttribute('data-lottie-loaded', 'true');
      window.lottie.loadAnimation({
        container: floralContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'media/weddingfloral.json'
      });
      console.log('Wedding floral animation loaded successfully');
    } catch (e) {
      console.error('Error loading wedding floral animation:', e);
    }
  }
  
  // Try to initialize Lottie when the hero section becomes visible
  const heroSectionForLottie = document.getElementById('heroSection');
  if (heroSectionForLottie) {
    const lottieObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Hero section visible, initializing animations');
          initLottieAnimation();
          initBirdsAnimation();
          // Stop observing after first intersection
          lottieObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1});
    lottieObserver.observe(heroSectionForLottie);
  } else {
    console.warn('heroSection element not found');
  }

  // Also try initializing after a short delay as fallback
  setTimeout(() => {
    if (document.getElementById('lottie-scroll') && !document.getElementById('lottie-scroll').hasAttribute('data-lottie-loaded')) {
      console.log('Initializing scroll animation via timeout');
      initLottieAnimation();
    }
    if (document.getElementById('lottie-birds') && !document.getElementById('lottie-birds').hasAttribute('data-lottie-loaded')) {
      console.log('Initializing birds animation via timeout');
      initBirdsAnimation();
    }
    if (document.getElementById('lottie-weddingfloral') && !document.getElementById('lottie-weddingfloral').hasAttribute('data-lottie-loaded')) {
      console.log('Initializing wedding floral animation via timeout');
      initWeddingFloralAnimation();
    }
  }, 500);

  // Try immediate initialization for weddingfloral (it's visible on page load)
  if (document.getElementById('lottie-weddingfloral')) {
    initWeddingFloralAnimation();
  }

  // COUNTDOWN (to Akad start)
  (function setupCountdown(){
    const target = new Date(2026, 0, 17, 8, 0, 0); // Jan 17 2026 08:00 local
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    function update(){
      const now = new Date();
      let diff = target - now;
      if (isNaN(diff) || diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const sec = 1000;
      const min = 60 * sec;
      const hour = 60 * min;
      const day = 24 * hour;

      const d = Math.floor(diff / day);
      diff -= d * day;
      const h = Math.floor(diff / hour);
      diff -= h * hour;
      const m = Math.floor(diff / min);
      diff -= m * min;
      const s = Math.floor(diff / sec);

      if (daysEl) daysEl.textContent = String(d).padStart(2,'0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2,'0');
      if (minsEl) minsEl.textContent = String(m).padStart(2,'0');
      if (secsEl) secsEl.textContent = String(s).padStart(2,'0');
    }

    update();
    setInterval(update, 1000);
  })();

  // COPY TO CLIPBOARD buttons
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Tersalin!';
        setTimeout(()=> btn.textContent = original, 1400);
      } catch(err) {
        alert('Gagal menyalin. Silakan salin manual: ' + text);
      }
    });
  });

  // Pause music when leaving tab (polite)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !bgMusic.paused) {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed','false');
      musicToggle.classList.remove('on');
    }
  });

  // Try to autoplay muted video
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.loop = true;
    bgVideo.play().catch(()=>{/* blocked until gesture */});
  }

  // --- PARALLAX: mousemove + scroll effect ---
  // Keep the movement subtle to mimic templates like Wekita
  (function setupParallax(){
    // Mouse-driven parallax (only when viewport wide enough)
    let ww = window.innerWidth;
    function applyParallax(mouseX, mouseY) {
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0.03;
        const x = (mouseX - ww/2) * speed;
        const y = (mouseY - window.innerHeight/2) * speed;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      // small tilt for SVG frame
      if (floralSVG) {
        const tiltX = (mouseY - window.innerHeight/2) * 0.002;
        const tiltY = (mouseX - ww/2) * -0.002;
        floralSVG.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    }

    // throttle mouse move for perf
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          applyParallax(e.clientX, e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    });

    // subtle scroll parallax (background moves slightly)
    window.addEventListener('scroll', () => {
      const sc = window.scrollY;
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0.03;
        const y = sc * speed * -0.2; // invert for subtle depth
        const x = 0;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    });

    // recalc on resize
    window.addEventListener('resize', () => { ww = window.innerWidth; });
  })();

  // --- Letter-by-letter title split + animation ---
  function splitTitleToLetters(el) {
    const text = el.getAttribute('data-text') || el.textContent.trim();
    el.textContent = ''; // clear
    // create spans for letters & spaces
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      // keep spaces visible but with non-breaking space
      if (ch === ' ') span.innerHTML = '&nbsp;';
      el.appendChild(span);
    });
  }

  function animateTitleLetters(el) {
    el.classList.add('animated');
    const chars = el.querySelectorAll('.char');
    chars.forEach((c, i) => {
      // stagger with easing: small delay increments
      const delay = 60 * i; // ms
      setTimeout(() => {
        c.classList.add('revealed');
      }, delay);
    });
  }

  // init split immediately so layout stable; reveal triggered on open or when visible
  if (titleEls) {
    titleEls.forEach((titleEl) => {
    splitTitleToLetters(titleEl);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !titleEl.classList.contains('animated')) {
          animateTitleLetters(titleEl);
        }
      });
    }, { threshold: 0.35 });

    observer.observe(titleEl);
  });

  }

  // Reveal title letters also when RSVPed/opened (openInvite handler triggers animateTitleLetters)

  // Book Cover logic
  const coverOverlay = document.getElementById('coverOverlay');
  const heroOverlay = document.getElementById('heroOverlay');
  const heroBgVideo = document.getElementById('heroBgVideo');
  const loveSection = document.getElementById('loveSection');
  const invitationSection = document.getElementById('invitationSection');
  const mainContent = document.getElementById('mainContent');
  const openInviteCover = document.getElementById('openInviteCover');
  const heroSection = document.getElementById('heroSection');

  function showSection(section) {
    if (section) {
      section.style.display = '';
      setTimeout(() => section.classList.remove('hide'), 10);
    }
  }
  function hideSection(section) {
    if (section) {
      section.classList.add('hide');
      setTimeout(() => section.style.display = 'none', 700);
    }
  }

  if (coverOverlay && openInviteCover && heroSection) {
    openInviteCover.addEventListener('click', () => {

      hideSection(coverOverlay);
      showSection(mainContent);
      try {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            musicToggle.setAttribute('aria-pressed', 'true');
            musicToggle.classList.add('on');
          });
        }
      } catch(e) {
        console.warn("Autoplay blocked:", e);
      }
      // Play hero video once
      if (heroBgVideo) {
        heroBgVideo.muted = true;
        heroBgVideo.loop = false;
        heroBgVideo.play().catch(()=>{});
        heroBgVideo.addEventListener('ended', () => {
          heroBgVideo.pause();
        });
      }
      // Lottie animation will initialize automatically via IntersectionObserver
    });
  }

  document.getElementById("viewEvents").addEventListener("click", function () {
    const eventSection = document.getElementById("event");
    eventSection.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("btn-reminder").addEventListener("click", function () {
    window.open("https://calendar.google.com/calendar/r/eventedit?text=Nabila+%26+Farhan+Wedding&dates=20260117T010000Z/20260117T070000Z&location=Masjid+Daarul+Adzkaar%2C+Lebak+Bulus%2C+Jakarta+Selatan&details=Acara+Pernikahan+Nabila+%26+Farhan", "_blank");
  });


});
