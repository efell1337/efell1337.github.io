
const titles = [
  "@  ",
  "@ | ",
  "@  ",
  "@  ",
  "@ | ",
  "@  ",
  "@ e",
  "@ ef",
  "@ efe",
  "@ efel",
  "@ efel.",
  "@ efel.p",
  "@ efel.py",
  "@ efel.p",
  "@ efel.",
  "@ efel ",
  "@ efe ",
  "@ ef ",
  "@ e ",
  "@ | ",
  "@  ",
  "@ | ",
  "@  ",
  "@ e "
];

let currentIndex = 0;

function changeTitle() {
  document.title = titles[currentIndex];
  currentIndex = (currentIndex + 1) % titles.length; // Loop back to the start
}
setInterval(changeTitle, 500); // Change every 500ms

// Volume control
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.querySelector('.volume-icon');

// Audio elements and context
const audioElement = document.getElementById('backgroundAudio');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioSource = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();
audioSource.connect(gainNode).connect(audioContext.destination);

// dB reduction and linear gain calculation
const dbReduction = -8;
const baseGain = Math.pow(10, dbReduction / 20); // Convert dB to linear scale
gainNode.gain.value = baseGain;

// Volume slider interaction with gainNode
volumeSlider.addEventListener('input', function () {
  const sliderValue = this.value / 100; // Slider range (0 to 1)
  const finalGain = baseGain * sliderValue; // Adjusted gain
  gainNode.gain.value = finalGain; // Update gainNode value
  updateVolumeIcon(sliderValue); // Update volume icon
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

document.getElementById('infoIcon').addEventListener('click', function (e) {
  e.preventDefault();
  const container = document.querySelector('.container');
  const aboutMeContainer = document.querySelector('.about-me-container');
  const volumeControl = document.querySelector('.volume-control');
  const originalPosition = '220px';

  if (aboutMeContainer.style.display === 'none') {
    container.style.transform = 'translateY(-60px)';
    aboutMeContainer.style.display = 'block';
    volumeControl.style.bottom = $;{aboutMeContainer.offsetHeight - 100}px;
    setTimeout(() => {
      aboutMeContainer.classList.add('show');
      aboutMeContainer.classList.remove('hide');
    }, 50);
  } else {
    container.style.transform = 'translateY(0)';
    volumeControl.style.bottom = originalPosition;
    aboutMeContainer.classList.add('hide');
    aboutMeContainer.classList.remove('show');
    setTimeout(() => {
      aboutMeContainer.style.display = 'none';
    }, 300);
  }
});

window.addEventListener('load', () => {
  const initialVolume = 0.5;
  volumeSlider.value = initialVolume * 100; 
  gainNode.gain.value = baseGain * initialVolume; 
  audioContext.resume().then(() => {
    audioElement.play();
  });
});

setInterval(changeTitle, 500);

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 200 };
    this.globalTime = 0;

    // Physics parameters
    this.damping = 0.98; // Velocity reduction per frame
    this.mouseRepelFactor = 0.0008; 
    this.baseSpeedFactor = 0.3; // Base random movement speed

    // Set canvas to full window size
    this.resize();
    
    // Create initial particles
    this.createParticles();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('mousemove', (event) => this.updateMousePosition(event));
    canvas.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
    });
  }

  resize() {
    // Only resize the canvas if the size changes
    if (this.canvas.width !== window.innerWidth || this.canvas.height !== window.innerHeight) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Recreate particles if canvas size changes
      this.particles = [];
      this.createParticles();
    }
  }

  createParticles() {
    // Reduce particle count further if performance is an issue
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000); // Adjusted particle density

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 2 + 1;
      
      this.particles.push({
        x, y, 
        size,
        // Base random movement
        baseSpeedX: (Math.random() * 2 - 1) * this.baseSpeedFactor,
        baseSpeedY: (Math.random() * 2 - 1) * this.baseSpeedFactor,
        // Velocity for additional momentum
        velocityX: 0,
        velocityY: 0,
        baseSize: size,
        seed: Math.random() * Math.PI * 2 // Unique seed for individual variations
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

    // Use a limit on the number of particles to loop over to avoid high cost
    const particleCount = this.particles.length;
    for (let i = 0; i < particleCount; i++) {
      const particle = this.particles[i];

      // Combine base movement with velocity
      particle.x += particle.baseSpeedX + particle.velocityX;
      particle.y += particle.baseSpeedY + particle.velocityY;

      // Apply damping to velocity
      particle.velocityX *= this.damping;
      particle.velocityY *= this.damping;

      // Wrap around screen edges with base movement preservation
      if (particle.x < 0) {
        particle.x = this.canvas.width;
        particle.velocityX *= -0.5; // Bounce with some energy loss
      }
      if (particle.x > this.canvas.width) {
        particle.x = 0;
        particle.velocityX *= -0.5;
      }
      if (particle.y < 0) {
        particle.y = this.canvas.height;
        particle.velocityY *= -0.5;
      }
      if (particle.y > this.canvas.height) {
        particle.y = 0;
        particle.velocityY *= -0.5;
      }

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        let dx = this.mouse.x - particle.x;
        let dy = this.mouse.y - particle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          // Softer push effect with velocity
          const repelFactor = Math.pow((this.mouse.radius - distance) / this.mouse.radius, 0.7);
          particle.velocityX -= dx * repelFactor * this.mouseRepelFactor;
          particle.velocityY -= dy * repelFactor * this.mouseRepelFactor;
        }
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();

      // Separate ambient glow effect
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

    // Request next animation frame
    requestAnimationFrame(() => this.update());
  }
}

// Initialize the particle system when the page loads
window.addEventListener('load', () => {
  const canvas = document.getElementById('backgroundCanvas');
  const particleSystem = new ParticleSystem(canvas);
  particleSystem.update();
});

class LyricDisplay {
  constructor(lyrics, containerSelector) {
      this.lyrics = lyrics; // lyrics now includes interval for each line
      this.container = document.querySelector(containerSelector);
      this.currentIndex = 0;
      this.lyricElements = [];
      this.transitionDuration = 700; // Still use a fixed transition time
      this.progressTimer = null;
  }

  init() {
      if (this.lyrics.length < 3) return;
      this.createLyricElements();
      this.updateLyrics();
      this.startAutoProgress();
  }

  createLyricElements() {
      // Create 3 lyric elements for the lyrics container
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
      // Get the interval for the next lyric
      const nextLyricInterval = this.lyrics[this.currentIndex].interval;

      // Set a new interval to update lyrics after the defined time
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

      // Increment currentIndex and schedule the next lyric update
      this.currentIndex = (this.currentIndex + 1) % this.lyrics.length;
      this.scheduleNextLyric(); // Schedule the next lyric update
  }
}

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


