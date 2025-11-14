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
  const titleEl = document.querySelector('.hero-title.js-split');

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
        await bgMusic.play();
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.classList.add('on');
      } catch (e) {
        console.warn('Autoplay prevented:', e);
      }

      if (bgVideo && bgVideo.paused) {
        try { await bgVideo.play(); } catch(e){ /* ignore */ }
      }

      // animate title letters on open (if not already played)
      if (titleEl && !titleEl.classList.contains('animated')) {
        animateTitleLetters(titleEl);
      }

      // focus next section
      document.getElementById('save').scrollIntoView({behavior:'smooth'});
    });
  }

  // Music toggle
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.classList.add('on');
      } else {
        bgMusic.pause();
        musicToggle.setAttribute('aria-pressed', 'false');
        musicToggle.classList.remove('on');
      }
    });
  }

  // REVEAL ON SCROLL using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {threshold: 0.15});

  revealEls.forEach(el => io.observe(el));

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
  if (titleEl) {
    splitTitleToLetters(titleEl);
    // Optional: if title is already visible on load, animate it
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !titleEl.classList.contains('animated')) {
          animateTitleLetters(titleEl);
        }
      });
    }, {threshold:0.35});
    titleObserver.observe(titleEl);
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

  if (coverOverlay && openInviteCover && heroOverlay) {
    openInviteCover.addEventListener('click', () => {
      hideSection(coverOverlay);
      showSection(heroOverlay);
      // Play hero video
      if (heroBgVideo) {
        heroBgVideo.muted = true;
        heroBgVideo.loop = true;
        heroBgVideo.play().catch(()=>{});
      }
      // Lottie scroll animation
      if (window.lottie) {
        window.lottie.loadAnimation({
          container: document.getElementById('lottie-scroll'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'media/scroll_down.json'
        });
      }
    });
  }

  // Sequential scroll logic
  let currentStep = 1;
  window.addEventListener('wheel', (e) => {
    if (currentStep === 1 && heroOverlay && heroOverlay.style.display !== 'none') {
      hideSection(heroOverlay);
      showSection(loveSection);
      window.scrollTo({top: loveSection.offsetTop, behavior: 'smooth'});
      currentStep = 2;
    } else if (currentStep === 2 && loveSection && loveSection.style.display !== 'none') {
      hideSection(loveSection);
      showSection(invitationSection);
      window.scrollTo({top: invitationSection.offsetTop, behavior: 'smooth'});
      currentStep = 3;
    } else if (currentStep === 3 && invitationSection && invitationSection.style.display !== 'none') {
      hideSection(invitationSection);
      showSection(mainContent);
      window.scrollTo({top: mainContent.offsetTop, behavior: 'smooth'});
      currentStep = 4;
    }
  });

});
