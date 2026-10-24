/**
 * Luxury Hindu Wedding Microsite - Core JavaScript Engine
 * Couple: Aditya & Chetna (A & C)
 * 
 * Features:
 *  1. Fullscreen Envelope Intro with 3D Flap, Golden Light Bloom (#lightBurst), & 600ms Transition
 *  2. Persistent Floating Audio Controller with Royalty-Free Shehnai & Web Audio Synth Fallback
 *  3. Interactive HTML5 Canvas Touch & Drag Scratch-to-Reveal Date (Heart Badges: 12 / DEC / 2026)
 *     - Tracks cleared pixel percentage using ctx.getImageData
 *     - Triggers reveal ONLY when all 3 cards reach >= 35% cleared area (or quick reveal clicked)
 *  4. Live Wedding Countdown Clock strictly hidden until unlocked, targeting Dec 12, 2026, 22:30:00 IST
 *  5. Dual-Engine Celebratory Golden and Crimson Confetti
 *  6. Touch-enabled Photo Gallery Carousel & Lightbox Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Audio Engine (Background Music at 0:26 with Audio Controller)
  // ==========================================
  const audioFab = document.getElementById('audioFab');
  const weddingMusic = document.getElementById('wedding-music') || document.getElementById('weddingAudio');
  let isPlaying = false;
  let audioContext = null;
  let synthDroneGain = null;
  let isUsingSynth = false;
  const START_OFFSET = 26; // Starts at 0:26 seconds (main chorus / vocals)

  // Configure audio offset & seamless looping
  function setAudioOffset() {
    if (weddingMusic && weddingMusic.currentTime < START_OFFSET) {
      try {
        weddingMusic.currentTime = START_OFFSET;
      } catch (e) {
        // Will set on playback if metadata not ready yet
      }
    }
  }

  if (weddingMusic) {
    weddingMusic.addEventListener('loadedmetadata', setAudioOffset);
    weddingMusic.addEventListener('canplay', () => {
      if (weddingMusic.currentTime < START_OFFSET) {
        setAudioOffset();
      }
    });

    // Seamless loop restarting from 0:26
    weddingMusic.addEventListener('ended', () => {
      weddingMusic.currentTime = START_OFFSET;
      weddingMusic.play().catch(() => {});
    });

    // Safeguard: If native loop resets to 0:00, jump immediately to 0:26
    weddingMusic.addEventListener('timeupdate', () => {
      if (isPlaying && weddingMusic.currentTime < 1.0) {
        weddingMusic.currentTime = START_OFFSET;
      }
    });
  }

  /**
   * Generates a calming Indian Tanpura & Bansuri drone in Raag Bhupali/Yaman
   * using Web Audio API as a zero-dependency, 100% reliable fallback.
   */
  function initIndianSynth() {
    if (audioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = new AudioCtx();

      // Master Gain
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.2, audioContext.currentTime);
      masterGain.connect(audioContext.destination);

      // Tanpura Root Drones (D3: 146.83 Hz, A3: 220 Hz, D4: 293.66 Hz)
      const baseFreqs = [146.83, 220.00, 293.66, 146.83 * 2];
      synthDroneGain = audioContext.createGain();
      synthDroneGain.gain.setValueAtTime(0, audioContext.currentTime);
      synthDroneGain.connect(masterGain);

      baseFreqs.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), audioContext.currentTime);

        // Subtle chorus LFO
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(1.5, audioContext.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.12 / baseFreqs.length, audioContext.currentTime);
        osc.connect(oscGain);
        oscGain.connect(synthDroneGain);
        osc.start();
      });

      // Melodic Bansuri Flute Simulation with gentle interval steps
      const fluteNotes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33]; // D Major Pentatonic
      let noteIndex = 0;

      function playFluteMelody() {
        if (!isPlaying || !audioContext) return;
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        const targetFreq = fluteNotes[noteIndex % fluteNotes.length];
        noteIndex = (noteIndex + Math.floor(Math.random() * 2) + 1) % fluteNotes.length;

        osc.frequency.setValueAtTime(targetFreq, now);
        osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.01, now + 1.2);

        // Breath/Wind envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 2.5);

        const nextDelay = 1800 + Math.random() * 1200;
        setTimeout(playFluteMelody, nextDelay);
      }

      // Schedule first flute phrase
      setTimeout(playFluteMelody, 800);
      isUsingSynth = true;
    } catch (e) {
      console.warn('Web Audio synth not supported:', e);
    }
  }

  function toggleAudio(forcePlay = null) {
    const shouldPlay = forcePlay !== null ? forcePlay : !isPlaying;

    if (shouldPlay) {
      if (weddingMusic && !isUsingSynth) {
        if (weddingMusic.currentTime < START_OFFSET) {
          try {
            weddingMusic.currentTime = START_OFFSET;
          } catch (e) {}
        }
        weddingMusic.play().then(() => {
          isPlaying = true;
          updateAudioUI(true);
        }).catch((err) => {
          console.log('HTML5 audio blocked/failed, starting Indian synthesizer fallback:', err);
          initIndianSynth();
          if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
          }
          if (synthDroneGain) {
            synthDroneGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 1);
          }
          isPlaying = true;
          updateAudioUI(true);
        });
      } else {
        initIndianSynth();
        if (audioContext && audioContext.state === 'suspended') {
          audioContext.resume();
        }
        if (synthDroneGain) {
          synthDroneGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.6);
        }
        isPlaying = true;
        updateAudioUI(true);
      }
    } else {
      if (weddingMusic && !weddingMusic.paused) {
        weddingMusic.pause();
      }
      if (synthDroneGain && audioContext) {
        synthDroneGain.gain.linearRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
      }
      isPlaying = false;
      updateAudioUI(false);
    }
  }

  function updateAudioUI(playing) {
    if (!audioFab) return;
    if (playing) {
      audioFab.classList.add('audio-playing');
      audioFab.setAttribute('aria-label', 'Mute Wedding Music');
      audioFab.title = 'Mute Music';
    } else {
      audioFab.classList.remove('audio-playing');
      audioFab.setAttribute('aria-label', 'Play Wedding Music');
      audioFab.title = 'Play Music';
    }
  }

  if (audioFab) {
    audioFab.addEventListener('click', () => toggleAudio());
  }

  // ==========================================
  // 2. Fullscreen Envelope Intro & Light Burst Bloom Transition
  // ==========================================
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const envelopeHeader = document.getElementById('envelopeHeader');
  const pearlSeal = document.getElementById('pearlSeal');
  const pearlSealWrapper = document.getElementById('pearlSealWrapper');
  const reopenBtn = document.getElementById('reopenEnvelopeBtn');
  const lightBurst = document.getElementById('lightBurst');

  function openEnvelope() {
    if (!envelopeFlap || !envelopeOverlay) return;

    // 1. Top flap flips smoothly upward (rotateX(180deg) with 0.8s transition)
    envelopeFlap.classList.add('open');
    envelopeOverlay.classList.add('opened');

    // Smoothly fade out envelope header branding
    if (envelopeHeader) {
      envelopeHeader.style.opacity = '0';
      envelopeHeader.style.transform = 'translateY(-12px) scale(0.96)';
    }

    // Scale away pearl seal button
    if (pearlSealWrapper) {
      pearlSealWrapper.style.transform = 'translate(-50%, -50%) scale(0)';
      pearlSealWrapper.style.opacity = '0';
    }

    // 2. Radial golden light bloom effect bursts across viewport for 600ms
    if (lightBurst) {
      lightBurst.classList.remove('bursting');
      void lightBurst.offsetWidth; // Force reflow
      lightBurst.classList.add('bursting');
    }

    // Auto-activate background wedding shehnai/flute music
    toggleAudio(true);

    // Fire celebratory gold & crimson confetti
    fireConfetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });

    // 3. Envelope overlay fades out (opacity: 0), and after 600ms sets display: none and pointer-events: none
    envelopeOverlay.style.transition = 'opacity 0.6s ease-in-out';
    envelopeOverlay.style.opacity = '0';

    setTimeout(() => {
      envelopeOverlay.style.display = 'none';
      envelopeOverlay.style.pointerEvents = 'none';
      document.body.classList.remove('overflow-hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  }

  if (pearlSeal) {
    pearlSeal.addEventListener('click', openEnvelope);
    pearlSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  // Re-open envelope on demand
  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      envelopeOverlay.style.display = 'flex';
      envelopeOverlay.style.pointerEvents = 'auto';
      void envelopeOverlay.offsetWidth;
      envelopeOverlay.style.opacity = '1';
      envelopeOverlay.classList.remove('opened');
      envelopeFlap.classList.remove('open');
      if (pearlSealWrapper) {
        pearlSealWrapper.style.transform = 'translate(-50%, -50%) scale(1)';
        pearlSealWrapper.style.opacity = '1';
      }
      if (envelopeHeader) {
        envelopeHeader.style.opacity = '1';
        envelopeHeader.style.transform = 'translateY(0) scale(1)';
      }
      if (lightBurst) {
        lightBurst.classList.remove('bursting');
      }
      document.body.classList.add('overflow-hidden');
    });
  }

  // ==========================================
  // 3. Celebratory Golden and Crimson Confetti Engine
  // ==========================================
  function fireConfetti(options = {}) {
    const goldCrimsonColors = ['#ECC876', '#E5A93C', '#FBF0B9', '#7A1521', '#5B0E17', '#FFFFFF', '#F06292'];

    if (typeof confetti === 'function') {
      confetti({
        particleCount: options.particleCount || 60,
        spread: options.spread || 75,
        origin: options.origin || { y: 0.6 },
        colors: goldCrimsonColors
      });
      return;
    }

    // Built-in Lightweight Canvas Confetti Fallback
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const particles = [];
    const count = options.particleCount || 70;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width * (options.origin?.x || 0.5),
        y: height * (options.origin?.y || 0.6),
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 4,
        color: goldCrimsonColors[Math.floor(Math.random() * goldCrimsonColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationId;
    function render() {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationId);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    }
    render();
  }

  // ==========================================
  // 4. Scratch-Card to Countdown Reveal System
  // - 3 scratch canvases independently track cleared pixel percentage using ctx.getImageData
  // - ONLY when ALL 3 cards reach >= 35% scratched area (or if instant reveal clicked):
  //   * Fully clear all three canvases
  //   * Fire celebratory golden and crimson confetti burst using canvas-confetti
  //   * Transition the countdown container into view (display: block, smooth fade-in slide up)
  //   * Countdown targets Dec 12, 2026, 22:30:00 IST (Auspicious Pheras Muhurat)
  // ==========================================
  const scratchCards = [
    { canvasId: 'scratchDateCanvas', value: '12', label: 'Date', percentCleared: 0, unlocked: false },
    { canvasId: 'scratchMonthCanvas', value: 'DEC', label: 'Month', percentCleared: 0, unlocked: false },
    { canvasId: 'scratchYearCanvas', value: '2026', label: 'Year', percentCleared: 0, unlocked: false }
  ];

  let allDatesRevealed = false;

  function initScratchCard(item) {
    const canvas = document.getElementById(item.canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = (rect.width || 104) * dpr;
    canvas.height = (rect.height || 98) * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width || 104;
    const h = rect.height || 98;

    // Paint luxury gold metallic texture over heart
    function drawGoldScratchLayer() {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#ECC876');
      grad.addColorStop(0.3, '#FFF5CC');
      grad.addColorStop(0.6, '#E5A93C');
      grad.addColorStop(1, '#B8860B');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle metallic glitter sparkles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 35; i++) {
        const gx = Math.random() * w;
        const gy = Math.random() * h;
        ctx.beginPath();
        ctx.arc(gx, gy, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ornamental label on top of scratch surface
      ctx.font = 'bold 11px Cinzel, serif';
      ctx.fillStyle = '#5B0E17';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH', w / 2, h / 2 - 6);
      ctx.font = '13px serif';
      ctx.fillText('✨', w / 2, h / 2 + 10);
    }

    drawGoldScratchLayer();

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getCoords(e) {
      const b = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - b.left,
        y: clientY - b.top
      };
    }

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();

      // Connect continuous strokes
      if (lastX && lastY) {
        ctx.beginPath();
        ctx.lineWidth = 32;
        ctx.lineCap = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      lastX = x;
      lastY = y;
    }

    function checkScratchProgress() {
      if (allDatesRevealed) return;

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let cleared = 0;
        let total = 0;

        // Sample every 8th pixel
        for (let i = 3; i < data.length; i += 32) {
          total++;
          if (data[i] < 64) {
            cleared++;
          }
        }

        const percent = total > 0 ? (cleared / total) * 100 : 0;
        item.percentCleared = percent;

        if (percent >= 35) {
          item.unlocked = true;
        }

        // Check if ALL 3 cards have reached >= 35% scratched area
        const allReached = scratchCards.every((c) => c.percentCleared >= 35);
        if (allReached && !allDatesRevealed) {
          onAllDatesRevealed();
        }
      } catch (err) {
        item.unlocked = true;
        item.percentCleared = 100;
        if (scratchCards.every((c) => c.unlocked)) {
          onAllDatesRevealed();
        }
      }
    }

    // Touch & Pointer Event Listeners
    function startScratching(e) {
      isDrawing = true;
      const { x, y } = getCoords(e);
      lastX = x;
      lastY = y;
      scratch(x, y);
      e.preventDefault();
    }

    function moveScratching(e) {
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      scratch(x, y);
      e.preventDefault();
    }

    function stopScratching() {
      if (!isDrawing) return;
      isDrawing = false;
      lastX = 0;
      lastY = 0;
      checkScratchProgress();
    }

    // Mouse events
    canvas.addEventListener('mousedown', startScratching);
    window.addEventListener('mousemove', moveScratching);
    window.addEventListener('mouseup', stopScratching);

    // Touch events
    canvas.addEventListener('touchstart', startScratching, { passive: false });
    window.addEventListener('touchmove', moveScratching, { passive: false });
    window.addEventListener('touchend', stopScratching);
  }

  function onAllDatesRevealed() {
    if (allDatesRevealed) return;
    allDatesRevealed = true;

    // 1. Fully clear all three canvases
    scratchCards.forEach((c) => {
      const cv = document.getElementById(c.canvasId);
      if (cv) {
        const cCtx = cv.getContext('2d');
        if (cCtx) cCtx.clearRect(0, 0, cv.width, cv.height);
        cv.classList.add('revealed');
      }
      c.unlocked = true;
      c.percentCleared = 100;
    });

    // 2. Hide quick reveal helper link
    const quickRevealBtn = document.getElementById('quickRevealBtn');
    if (quickRevealBtn) quickRevealBtn.classList.add('hidden');

    // 3. Show Date Unlocked Banner
    const banner = document.getElementById('dateUnlockedMessage');
    if (banner) {
      banner.classList.remove('hidden');
      banner.classList.add('animate-bounce');
    }

    // 4. Celebratory golden and crimson confetti burst
    fireConfetti({ particleCount: 120, spread: 90, origin: { y: 0.55 } });
    setTimeout(() => {
      fireConfetti({ particleCount: 80, spread: 120, origin: { y: 0.65 } });
    }, 400);

    // 5. Transition countdown container into view (display: block, smooth fade-in slide up)
    const countdownContainer = document.getElementById('liveCountdownSection');
    if (countdownContainer) {
      countdownContainer.style.display = 'block';
      void countdownContainer.offsetWidth; // Force reflow
      countdownContainer.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
      countdownContainer.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto', 'shadow-gold-glow');
    }
  }

  scratchCards.forEach(initScratchCard);

  // Quick helper to reveal all instantly
  const quickRevealBtn = document.getElementById('quickRevealBtn');
  if (quickRevealBtn) {
    quickRevealBtn.addEventListener('click', () => {
      scratchCards.forEach((c) => {
        c.percentCleared = 100;
        c.unlocked = true;
      });
      onAllDatesRevealed();
    });
  }

  // ==========================================
  // 5. Live Wedding Countdown Clock
  // Target: December 12, 2026, 22:30:00 IST (Auspicious Pheras Muhurat)
  // ==========================================
  const weddingTimestamp = new Date('2026-12-12T22:30:00+05:30').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingTimestamp - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      const label = document.getElementById('countdownLabel');
      if (label) label.textContent = 'Today is Aditya & Chetna’s sacred wedding day!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // 6. Photo Gallery Carousel with Touch Swiping & Lightbox
  // ==========================================
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  let currentSlide = 0;

  function buildDots() {
    if (!dotsContainer || slides.length === 0) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `w-2.5 h-2.5 rounded-full transition-all ${
        idx === 0 ? 'bg-amber-400 w-6' : 'bg-gray-400/50'
      }`;
      dot.setAttribute('aria-label', `Go to photo ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.className = 'w-6 h-2.5 rounded-full bg-amber-400 transition-all';
      } else {
        dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-400/50 transition-all';
      }
    });
  }

  function goToSlide(index) {
    if (!track || slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

  // Touch Swipe for mobile viewports
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  }

  buildDots();

  // Photo Lightbox modal
  const lightboxModal = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  document.querySelectorAll('.gallery-zoomable').forEach((img) => {
    img.addEventListener('click', () => {
      if (!lightboxModal || !lightboxImg) return;
      lightboxImg.src = img.src;
      if (lightboxCaption) {
        lightboxCaption.textContent = img.alt || 'Aditya & Chetna';
      }
      lightboxModal.classList.remove('hidden');
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.add('hidden');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add('hidden');
      }
    });
  }
});
