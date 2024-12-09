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
    volumeControl.style.bottom = `${aboutMeContainer.offsetHeight - 100}px`;
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
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Recreate particles on resize
      this.particles = [];
      this.createParticles();
  }
  
  createParticles() {
      // Reduce particle count
      const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
      
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
      
      for (let particle of this.particles) {
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
      
      // Connect nearby particles with soft lines
      this.connectParticles();
      
      // Request next animation frame
      requestAnimationFrame(() => this.update());
  }
  
  connectParticles() {
      for (let i = 0; i < this.particles.length; i++) {
          for (let j = i + 1; j < this.particles.length; j++) {
              const dx = this.particles[i].x - this.particles[j].x;
              const dy = this.particles[i].y - this.particles[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 80) { // Increased connection distance
                  const opacity = 1 - (distance / 250);
                  this.ctx.beginPath();
                  this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                  this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                  this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                  this.ctx.lineWidth = 0.5;
                  this.ctx.stroke();
              }
          }
      }
  }
}

// Initialize the particle system when the page loads
window.addEventListener('load', () => {
  const canvas = document.getElementById('backgroundCanvas');
  const particleSystem = new ParticleSystem(canvas);
  particleSystem.update();
});