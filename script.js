/* ======== ESTRELLAS (ampliadas: 200 en vez de 120) ======== */
(function() {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  // Partículas: estrellas + pétalos + chispas doradas
  var stars = [];
  var petals = [];
  var sparks = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Estrellas (200)
  for (var i = 0; i < 200; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.008
    });
  }

  // ── Pétalos flotantes (60): caen en diagonal
  var petalColors = ['#c0392b','#8e44ad','#f0c040','#e91e8c','#ff6b9d'];
  for (var j = 0; j < 60; j++) {
    petals.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.5 + 0.15,
      r: Math.random() * 3 + 2,
      a: Math.random() * 0.55 + 0.2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.03,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    });
  }

  // ── Chispas doradas (80): se mueven lentamente y parpadean
  for (var k = 0; k < 80; k++) {
    sparks.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      life: Math.random(),
      maxLife: 0.5 + Math.random() * 0.5,
      r: Math.random() * 1.5 + 0.4
    });
  }



  function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Estrellas
    stars.forEach(function(s) {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.a.toFixed(2) + ')';
      ctx.fill();
    });

    // Pétalos
    petals.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height + 12) {
        p.y = -12;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 2.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.a * 200).toString(16).padStart(2, '0');
      ctx.fill();
      ctx.restore();
    });

    // Chispas doradas
    sparks.forEach(function(s) {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.004;
      if (s.life <= 0) {
        s.x = Math.random() * canvas.width;
        s.y = Math.random() * canvas.height;
        s.life = s.maxLife;
        s.vx = (Math.random() - 0.5) * 0.7;
        s.vy = (Math.random() - 0.5) * 0.7;
      }
      var alpha = Math.min(s.life / s.maxLife, 1) * 0.75;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,192,64,' + alpha.toFixed(2) + ')';
      ctx.fill();
    });

    requestAnimationFrame(drawAll);
  }
  drawAll();
})();

/* ======== CORAZONES FLOTANTES ======== */
var hero = document.querySelector('.hero');
var heartChars = ['❤', '♡', '✿', '✦', '♥', '❧', '✾'];

function spawnHeart() {
  if (!hero) return;
  var h = document.createElement('span');
  h.className = 'heart-float';
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = (Math.random() * 90 + 5) + '%';
  h.style.bottom = '5%';
  h.style.color = 'rgba(255,130,160,' + (0.3 + Math.random() * 0.4) + ')';
  h.style.animationDuration = (4 + Math.random() * 4) + 's';
  h.style.animationDelay = (Math.random() * 2) + 's';
  hero.appendChild(h);
  setTimeout(function() { h.remove(); }, 9000);
}
setInterval(spawnHeart, 800); // más frecuente: de 1100 a 800ms

/* ======== CARRUSEL ======== */
var track = document.getElementById('carousel-track');
var slides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
var originalCount = slides.length;
var dotEls = document.querySelectorAll('.dot');
var current = 0;
var wrapping = null;

if (track && originalCount > 0) {
  var firstClone = slides[0].cloneNode(true);
  var lastClone = slides[originalCount - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);
}

if (track) track.style.transform = 'translateX(-100%)';

function updateDots(idx) {
  dotEls.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
}

function goSlide(target) {
  if (!track) return;
  target = ((target % originalCount) + originalCount) % originalCount;
  if (target === 0 && current === originalCount - 1) {
    wrapping = 'forward';
    track.style.transition = '';
    track.style.transform = 'translateX(-' + ((originalCount + 1) * 100) + '%)';
    current = 0; return;
  }
  if (target === originalCount - 1 && current === 0) {
    wrapping = 'back';
    track.style.transition = '';
    track.style.transform = 'translateX(0%)';
    current = originalCount - 1; return;
  }
  wrapping = null;
  track.style.transition = '';
  track.style.transform = 'translateX(-' + ((target + 1) * 100) + '%)';
  current = target;
}

function nextSlide() { goSlide(current + 1); }
function prevSlide() { goSlide(current - 1); }

if (track) {
  track.addEventListener('transitionend', function() {
    if (wrapping === 'forward') {
      track.style.transition = 'none';
      track.style.transform = 'translateX(-100%)';
      void track.offsetWidth;
      track.style.transition = '';
      wrapping = null;
      updateDots(current); return;
    }
    if (wrapping === 'back') {
      track.style.transition = 'none';
      track.style.transform = 'translateX(-' + (originalCount * 100) + '%)';
      void track.offsetWidth;
      track.style.transition = '';
      wrapping = null;
      updateDots(current); return;
    }
    updateDots(current);
  });
}

var autoSlide = setInterval(nextSlide, 3800);
var carouselEl = document.getElementById('carousel');
if (carouselEl) {
  carouselEl.addEventListener('mouseenter', function() { clearInterval(autoSlide); });
  carouselEl.addEventListener('mouseleave', function() { autoSlide = setInterval(nextSlide, 3800); });
}

var touchStartX = 0;
var touchStartY = 0;
if (track) {
  track.addEventListener('touchstart', function(e) { 
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    
    // Ignorar si fue más vertical que horizontal
    if (dy > Math.abs(dx)) return;
    
    // Solo deslizar si el movimiento es significativo
    if (Math.abs(dx) > 30) {
      dx < 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });
  
  // Pausa autoplay al tocar
  track.addEventListener('touchstart', function() { clearInterval(autoSlide); });
  track.addEventListener('touchend', function() { 
    setTimeout(function() { autoSlide = setInterval(nextSlide, 3800); }, 1500);
  });
}

/* ======== MODAL ======== */
var _savedScrollY = 0;

function abrirCarta() {
  var modal = document.getElementById('modal');
  if (!modal) return;
  _savedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + _savedScrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
  modal.classList.add('open');
}

function cerrarCarta() {
  var modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, _savedScrollY);
}
var modalEl = document.getElementById('modal');
if (modalEl) {
  modalEl.addEventListener('click', function(e) {
    if (e.target === this) cerrarCarta();
  });
}

/* ======== CONTADOR ======== */
function makeZonedMidnightUTC(year, month, day, timeZone) {
  const utcMid = Date.UTC(year, month - 1, day, 0, 0, 0);
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const parts = dtf.formatToParts(new Date(utcMid));
  const map = {};
  for (const { type, value } of parts) map[type] = value;
  const asUTC = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) + (utcMid - asUTC));
}

var birthDate = makeZonedMidnightUTC(2025, 5, 30, 'America/Mexico_City');

function pad(n, len) { return String(n).padStart(len || 2, '0'); }

function updateCounter() {
  var diff  = Date.now() - birthDate.getTime();
  var total = Math.floor(diff / 1000);
  var elDays = document.getElementById('c-days');   if (elDays)  elDays.textContent  = pad(Math.floor(total / 86400), 4);
  var elHours = document.getElementById('c-hours'); if (elHours) elHours.textContent = pad(Math.floor(total / 3600) % 24);
  var elMins = document.getElementById('c-mins');   if (elMins)  elMins.textContent  = pad(Math.floor(total / 60) % 60);
  var elSecs = document.getElementById('c-secs');   if (elSecs)  elSecs.textContent  = pad(total % 60);
}
updateCounter();
setInterval(updateCounter, 1000);

/* ======== SCROLL ANIMATIONS ======== */
var cards = document.querySelectorAll('.mem-card');
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry, i) {
    if (entry.isIntersecting) {
      setTimeout(function() { entry.target.classList.add('visible'); }, i * 150);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
cards.forEach(function(c) { observer.observe(c); });

/* ======== BARRA DE AMOR ======== */
var loveObs = new IntersectionObserver(function(entries) {
  if (entries[0].isIntersecting) {
    var lb = document.getElementById('love-bar');
    if (lb) lb.style.width = '100%';
    loveObs.disconnect();
  }
}, { threshold: 0.5 });
var loveBarEl = document.getElementById('love-bar');
if (loveBarEl) loveObs.observe(loveBarEl);

/* ======== REPRODUCTOR DE MÚSICA ======== */
(function() {
  var audio = document.getElementById('love-audio');
  var icon = document.getElementById('music-icon');
  var progress = document.getElementById('music-progress');
  var timeEl = document.getElementById('music-time');

  if (!audio) return;

  window.toggleMusic = function() {
    if (audio.paused) {
      audio.play();
      icon.innerHTML = '&#9646;&#9646;';
    } else {
      audio.pause();
      icon.innerHTML = '&#9654;';
    }
  };

  audio.addEventListener('timeupdate', function() {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    if (progress) progress.style.width = pct + '%';
    var secs = Math.floor(audio.currentTime);
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    if (timeEl) timeEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
  });

  var track = document.querySelector('.music-progress-track');
  if (track) {
    track.style.cursor = 'pointer';
    track.addEventListener('click', function(e) {
      if (!audio.duration) return;
      var rect = track.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    });
  }

  audio.addEventListener('ended', function() {
    if (icon) icon.innerHTML = '&#9654;';
    if (progress) progress.style.width = '0%';
    if (timeEl) timeEl.textContent = '0:00';
  });
})();

/* ======== VIDEO UPLOAD FOR RECUERDOS ======== */
(function() {
  var input = document.getElementById('video-input');
  var selectBtn = document.getElementById('video-select-btn');
  var placeholder = document.getElementById('video-placeholder');
  var filenameEl = document.getElementById('video-filename');
  var videoEl = document.getElementById('uploaded-video');
  var playBtn = document.getElementById('video-play');

  if (!input || !selectBtn || !videoEl) return;

  selectBtn.addEventListener('click', function() { input.click(); });
  if (placeholder) placeholder.addEventListener('click', function() { input.click(); });

  playBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (videoEl.hidden) {
      if (!input.files || input.files.length === 0) { input.click(); return; }
      videoEl.hidden = false;
      if (placeholder) placeholder.style.display = 'none';
    }
    if (videoEl.paused) videoEl.play(); else videoEl.pause();
  });

  input.addEventListener('change', function() {
    var file = input.files[0];
    if (!file) return;
    filenameEl.textContent = file.name;
    var url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.hidden = false;
    if (placeholder) placeholder.style.display = 'none';

    // Capture first frame as poster when ready
    function capturePoster() {
      try {
        var canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        videoEl.setAttribute('poster', dataUrl);
      } catch (e) {}
      videoEl.removeEventListener('loadeddata', capturePoster);
    }
    videoEl.addEventListener('loadeddata', capturePoster);
  });
})();