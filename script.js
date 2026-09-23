const heartsContainer = document.getElementById('hearts');
const musicToggle = document.getElementById('musicToggle');
const musicPlayer = document.getElementById('musicPlayer');
const modal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalCloseBtn = document.querySelector('.message-modal-close');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentSlide = 0;
let slideTimer = null;

function updateBackgroundVibe(audio, forcedState = false) {
  const toggleState = musicToggle && musicToggle.dataset.playing === 'true';
  const directState = audio && !audio.paused && !audio.muted;
  const isPlaying = forcedState || toggleState || directState;

  if (!isPlaying) {
    document.body.classList.remove('audio-vibe');
    document.body.style.setProperty('--vibe-shift', '0px');
    document.body.style.setProperty('--vibe-scale', '1');
    document.body.style.animationDuration = '0.9s';
    return;
  }

  const volumeLevel = audio ? Number(audio.volume || 0) : 1;
  const strength = Math.min(1, Math.max(0.2, volumeLevel * 1.35));

  document.body.classList.add('audio-vibe');
  document.body.style.setProperty('--vibe-shift', `${(8 + strength * 18).toFixed(1)}px`);
  document.body.style.setProperty('--vibe-scale', (1 + strength * 0.035).toFixed(3));
  document.body.style.animationDuration = `${(1.3 - strength * 0.9).toFixed(2)}s`;
}

function showSlide(index) {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function startAutoSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4200);
}

if (prevBtn && nextBtn && slides.length) {
  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoSlide();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    startAutoSlide();
  });
});

showSlide(0);
startAutoSlide();

function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = '❤';

  const left = Math.random() * 100;
  const size = 0.8 + Math.random() * 1.8;
  const duration = 4 + Math.random() * 4;
  const delay = Math.random() * 1.4;

  heart.style.left = `${left}%`;
  heart.style.fontSize = `${size}rem`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.opacity = `${0.3 + Math.random() * 0.6}`;

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, (duration + delay) * 1000);
}

function triggerIntroHeartBurst() {
  const intro = document.querySelector('.letter-intro');
  if (!intro || !heartsContainer) return;

  const rect = intro.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let index = 0; index < 24; index += 1) {
    const heart = document.createElement('div');
    heart.className = 'burst-heart';
    heart.textContent = '❤';

    const dx = (Math.random() - 0.5) * 360;
    const dy = (Math.random() - 0.5) * 260;
    const rotate = `${(Math.random() - 0.5) * 200}deg`;

    heart.style.left = `${centerX - heartsContainer.getBoundingClientRect().left}px`;
    heart.style.top = `${centerY - heartsContainer.getBoundingClientRect().top}px`;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--dy', `${dy}px`);
    heart.style.setProperty('--rot', rotate);

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }
}

function openMessageModal(title, text) {
  if (!modal || !modalTitle || !modalText) return;

  modalTitle.textContent = title || 'Mensaje';
  modalText.textContent = text || '';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeMessageModal() {
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

if (musicToggle && musicPlayer) {
  const audio = musicPlayer.querySelector('video');

  if (audio) {
    audio.addEventListener('play', () => updateBackgroundVibe(audio));
    audio.addEventListener('pause', () => updateBackgroundVibe(audio));
    audio.addEventListener('volumechange', () => updateBackgroundVibe(audio));
    audio.addEventListener('ended', () => updateBackgroundVibe(audio));
  }

  musicToggle.addEventListener('click', () => {
    const isPlaying = musicToggle.dataset.playing !== 'true';
    musicToggle.dataset.playing = String(isPlaying);
    musicToggle.textContent = isPlaying ? '⏸ Pausar música' : '▶ Reproducir música';
    musicPlayer.classList.toggle('hidden', !isPlaying);

    if (isPlaying && audio) {
      audio.volume = 1;
      audio.muted = false;
      audio.play().catch(() => {});
      musicPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (!isPlaying && audio) {
      audio.pause();
    }

    updateBackgroundVibe(audio, isPlaying);
  });
}

const expandableItems = document.querySelectorAll('.expandable-message, .story-card');
expandableItems.forEach((item) => {
  const title = item.dataset.title || item.querySelector('h3')?.textContent || 'Mensaje';
  const text = item.dataset.text || item.querySelector('p')?.textContent || item.textContent || '';

  item.addEventListener('click', (event) => {
    const triggerButton = event.target.closest('.expand-trigger');
    if (triggerButton) {
      event.stopPropagation();
      openMessageModal(title, text);
      return;
    }

    if (item.classList.contains('story-card')) {
      openMessageModal(title, text);
    }
  });

  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMessageModal(title, text);
    }
  });
});

const letterSection = document.querySelector('.letter');
const letterIntro = document.querySelector('.letter-intro');
const letterLinks = document.querySelectorAll('a[href="#letter"]');

function openLetterIntro() {
  if (!letterSection || letterSection.classList.contains('is-open')) return;

  letterSection.classList.add('is-open');
  triggerIntroHeartBurst();

  setTimeout(() => {
    letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 180);
}

if (letterIntro) {
  letterIntro.addEventListener('click', openLetterIntro);
}

letterLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openLetterIntro();
  });
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeMessageModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-close="true"]') || event.target === modal) {
      closeMessageModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
    closeMessageModal();
  }
});

setInterval(createHeart, 550);
