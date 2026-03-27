// ===== HERO PARTICLES =====
const canvas = document.getElementById('heroParticles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    const hero = document.querySelector('.hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      this.opacity = 0.15 + Math.sin(this.pulse) * 0.15;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
}

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.innerWidth > 768) {
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== SCROLL ANIMATIONS (enhanced with stagger) =====
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = parent.querySelectorAll('.animate-on-scroll');
      const siblingIndex = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, siblingIndex * 120);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// ===== COUNTER ANIMATION (enhanced with easing) =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  counterObserver.observe(statsSection);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2500;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.floor(easedProgress * target);
      counter.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    requestAnimationFrame(updateCounter);
  });
}

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ===== PARALLAX ON SCROLL =====
const heroContent = document.querySelector('.hero-content');
const heroGlows = document.querySelectorAll('.hero-glow');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    const factor = scrollY * 0.3;
    if (heroContent) {
      heroContent.style.transform = `translateY(${factor * 0.4}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
    }
    heroGlows.forEach((glow, i) => {
      glow.style.transform = `translateY(${factor * (0.2 + i * 0.1)}px)`;
    });
  }
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toast.classList.add('show');
  contactForm.reset();
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== TEXT TYPING EFFECT FOR HERO =====
const heroWords = ['Business', 'Startup', 'Brand', 'Vision'];
let wordIndex = 0;
const gradientTextEl = document.getElementById('heroGradientText');
if (gradientTextEl) {
  setInterval(() => {
    wordIndex = (wordIndex + 1) % heroWords.length;
    gradientTextEl.style.opacity = '0';
    gradientTextEl.style.transform = 'translateY(10px)';
    setTimeout(() => {
      gradientTextEl.textContent = heroWords[wordIndex];
      gradientTextEl.style.opacity = '1';
      gradientTextEl.style.transform = 'translateY(0)';
    }, 400);
  }, 3000);
  gradientTextEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  gradientTextEl.style.display = 'inline-block';
}
