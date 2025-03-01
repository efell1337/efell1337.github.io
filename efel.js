document.addEventListener('DOMContentLoaded', () => {
  const titles = [
    "@  ", "@ | ", "@  ", "@  ", "@ | ", "@  ", "@ e", "@ ef",
    "@ efe", "@ efel", "@ efel.", "@ efel.p", "@ efel.py",
    "@ efel.p", "@ efel.", "@ efel ", "@ efe ", "@ ef ",
    "@ e ", "@ | ", "@  ", "@ | ", "@  ", "@ e "
  ];

  let currentTitleIndex = 0;
  function changeTitle() {
    document.title = titles[currentTitleIndex];
    currentTitleIndex = (currentTitleIndex + 1) % titles.length;
  }
  setInterval(changeTitle, 500);

  const clickToContinue = document.getElementById('click-to-continue');
  const mainContent = document.getElementById('main-content');
  const audioElement = document.getElementById('backgroundAudio');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeIcon = document.querySelector('.volume-icon');
  const canvas = document.getElementById('backgroundCanvas');
  const particleSystem = new ParticleSystem(canvas);
  particleSystem.update();
  const initialVolume = 0.75;
  let audioContext;
  let gainNode;
  clickToContinue.addEventListener('click', () => {
    clickToContinue.style.display = 'none';
    mainContent.style.display = 'block';
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = audioContext.createMediaElementSource(audioElement);
      gainNode = audioContext.createGain();
      audioSource.connect(gainNode).connect(audioContext.destination);
      const dbReduction = -5;
      const baseGain = Math.pow(10, dbReduction / 20);
      gainNode.gain.value = baseGain * initialVolume;
      volumeSlider.value = initialVolume * 100;
      volumeSlider.addEventListener('input', () => {
        const sliderValue = volumeSlider.value / 100;
        gainNode.gain.value = baseGain * sliderValue;
        updateVolumeIcon(sliderValue);
      });
    }
    audioContext.resume().then(() => {
      audioElement.play();
    });
  });
  function updateVolumeIcon(volume) {
    if (volume > 0.5) {
      volumeIcon.className = 'fas fa-volume-up volume-icon';
    } else if (volume > 0) {
      volumeIcon.className = 'fas fa-volume-down volume-icon';
    } else {
      volumeIcon.className = 'fas fa-volume-mute volume-icon';
    }
  }
  class LyricDisplay {
    constructor(lyrics, containerSelector) {
      this.lyrics = lyrics;
      this.container = document.querySelector(containerSelector);
      this.currentIndex = 0;
      this.lyricElements = [];
      this.transitionDuration = 700;
      this.progressTimer = null;
      this.timerStart = null;
    }

    init() {
      if (this.lyrics.length < 3) return;
      this.createLyricElements();
      this.updateLyrics();
      this.startAutoProgress();
    }

    createLyricElements() {
      for (let i = 0; i < 3; i++) {
        const lyricEl = document.createElement('div');
        lyricEl.classList.add('lyric');
        this.container.appendChild(lyricEl);
        this.lyricElements.push(lyricEl);
      }
    }

    updateLyrics() {
      const positions = ['below', 'middle', 'above'];
      this.lyricElements.forEach((lyricEl, index) => {
        lyricEl.className = 'lyric';
        lyricEl.classList.add(positions[index]);
        const lyricIndex = (this.currentIndex + index - 1 + this.lyrics.length) % this.lyrics.length;
        lyricEl.textContent = this.lyrics[lyricIndex].text;
      });
    }

    startAutoProgress() {
      this.scheduleNextLyric();
    }

    scheduleNextLyric() {
      const nextLyricInterval = this.lyrics[this.currentIndex].interval;
      this.timerStart = Date.now();
      this.progressTimer = setTimeout(() => {
        this.progressLyrics();
      }, nextLyricInterval);
    }

    progressLyrics() {
      const newLyric = document.createElement('div');
      newLyric.classList.add('lyric', 'below');
      const nextIndex = (this.currentIndex + 1) % this.lyrics.length;
      newLyric.textContent = this.lyrics[nextIndex].text;
      this.container.appendChild(newLyric);

      this.lyricElements.forEach(el => {
        const currentClass = Array.from(el.classList).find(c => ['below', 'middle', 'above'].includes(c));
        el.classList.remove(currentClass);
        
        if (currentClass === 'below') el.classList.add('middle');
        else if (currentClass === 'middle') el.classList.add('above');
        else if (currentClass === 'above') {
          setTimeout(() => el.remove(), this.transitionDuration);
        }
      });

      this.lyricElements = [
        newLyric,
        ...this.lyricElements.slice(0, -1)
      ];

      this.currentIndex = (this.currentIndex + 1) % this.lyrics.length;
      this.scheduleNextLyric();
    }
  }

  let lyricRemainingTime = null;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      audioElement.pause();
      if (lyricDisplay.progressTimer) {
        clearTimeout(lyricDisplay.progressTimer);
        lyricRemainingTime = lyricDisplay.lyrics[lyricDisplay.currentIndex].interval - 
                             (Date.now() - lyricDisplay.timerStart);
        
        lyricDisplay.progressTimer = null;
      }
    } else if (document.visibilityState === 'visible') {
      audioElement.play();
      if (lyricRemainingTime !== null) {
        lyricDisplay.progressTimer = setTimeout(() => {
          lyricDisplay.progressLyrics();
          lyricRemainingTime = null;
        }, lyricRemainingTime);
        lyricDisplay.timerStart = Date.now();
      } else {
        lyricDisplay.scheduleNextLyric();
      }
    }
  });
  
  const lyrics = [
    { text: "♪", interval: 7880 },
    { text: "Days seem sometimes as if they'll never end", interval: 5340 },
    { text: "Sun digs its heels to taunt you", interval: 4200 },
    { text: "But after sunlit days, one thing stays the same", interval: 5240 },
    { text: "Rises the moon", interval: 3360 },
    { text: "♪", interval: 3840 },
    { text: "Days fade into a watercolour blur", interval: 5240 },
    { text: "Memories swim and haunt you", interval: 3900 },
    { text: "But look into the lake, shimmering like smoke", interval: 6040 },
    { text: "Rises the moon", interval: 3360 },
    { text: "♪", interval: 3680 },
    { text: "Oh-oh, close your weary eyes", interval: 3360 },
    { text: "I promise you that soon the autumn comes", interval: 6440 },
    { text: "To darken fading summer skies", interval: 3500 },
    { text: "Breathe, breathe, breathe", interval: 8720 },
    { text: "♪", interval: 6100 },
    { text: "Days pull you down just like a sinking ship", interval: 5340 },
    { text: "Floating is getting harder", interval: 4300 },
    { text: "But tread the water, child, and know that meanwhile", interval: 6040 },
    { text: "Rises the moon", interval: 3360 },
    { text: "♪", interval: 3840 },
    { text: "Days pull you up just like a daffodil", interval: 5040 },
    { text: "Uprooted from its garden", interval: 3600 },
    { text: "They'll tell you what you owe, but know even so", interval: 5040 },
    { text: "Rises the moon", interval: 3360 },
    { text: "♪", interval: 3680 },
    { text: "You'll be visited by sleep", interval: 5040 },
    { text: "I promise you that soon the autumn comes", interval: 5040 },
    { text: "To steal away each dream you keep", interval: 3600 },
    { text: "Breathe, breathe, breathe", interval: 6720 },
    { text: "♪", interval: 9600 }
  ];
  const lyricDisplay = new LyricDisplay(lyrics, '#lyric-display');
  lyricDisplay.init();
});
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null, radius: 200 };
      this.globalTime = 0;
      this.damping = 0.98;
      this.mouseRepelFactor = 0.0008;
      this.baseSpeedFactor = 0.3;

      this.resize();
      this.createParticles();
      
      window.addEventListener('resize', () => this.resize());
      canvas.addEventListener('mousemove', (event) => this.updateMousePosition(event));
      canvas.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    resize() {
      if (this.canvas.width !== window.innerWidth || this.canvas.height !== window.innerHeight) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.particles = [];
        this.createParticles();
      }
    }

    createParticles() {
      const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const size = Math.random() * 2 + 1;
        
        this.particles.push({
          x, y, 
          size,
          baseSpeedX: (Math.random() * 2 - 1) * this.baseSpeedFactor,
          baseSpeedY: (Math.random() * 2 - 1) * this.baseSpeedFactor,
          velocityX: 0,
          velocityY: 0,
          baseSize: size,
          seed: Math.random() * Math.PI * 2
        });
      }
    }

    updateMousePosition(event) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = event.clientY - rect.top;
    }

    update() {
      this.globalTime += 0.02;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const particleCount = this.particles.length;
      for (let i = 0; i < particleCount; i++) {
        const particle = this.particles[i];

        particle.x += particle.baseSpeedX + particle.velocityX;
        particle.y += particle.baseSpeedY + particle.velocityY;

        particle.velocityX *= this.damping;
        particle.velocityY *= this.damping;

        ['x', 'y'].forEach(axis => {
          const dimension = axis === 'x' ? this.canvas.width : this.canvas.height;
          if (particle[axis] < 0) {
            particle[axis] = dimension;
            particle[`velocity${axis.toUpperCase()}`] *= -0.5;
          }
          if (particle[axis] > dimension) {
            particle[axis] = 0;
            particle[`velocity${axis.toUpperCase()}`] *= -0.5;
          }
        });

        if (this.mouse.x !== null && this.mouse.y !== null) {
          let dx = this.mouse.x - particle.x;
          let dy = this.mouse.y - particle.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.mouse.radius) {
            const repelFactor = Math.pow((this.mouse.radius - distance) / this.mouse.radius, 0.7);
            particle.velocityX -= dx * repelFactor * this.mouseRepelFactor;
            particle.velocityY -= dy * repelFactor * this.mouseRepelFactor;
          }
        }
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();

        const glowIntensity = Math.sin(this.globalTime * 2 + particle.seed) * 0.3 + 0.7;
        const gradient = this.ctx.createRadialGradient(
          particle.x, particle.y, 0, 
          particle.x, particle.y, particle.size * 5
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity * 0.15})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }

      requestAnimationFrame(() => this.update());
    }
  }
