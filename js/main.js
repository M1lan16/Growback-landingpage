/* 
=========================================================
  GROWBACK LANDING PAGE - MAIN JS
=========================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTiltCards();
    initAudioFeedback();
    initMobileMenu();
    // initPricingHoverSound(); // Disabled per user request: only button blips active
    initDataSphere();
});

/* --- 1. Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    // Performance optimization: only observe elements once, unobserve when revealed
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Header shrinking effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(2, 6, 23, 0.9)';
        } else {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(2, 6, 23, 0.7)';
        }
    }, { passive: true });
}

/* --- 2. 3D Tilt & Glow Effect for Cards --- */
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Inner light effect position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt calculations
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transforms smoothly
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

/* --- 3. Audio Feedback --- */
// Base64 encoded short click sound (to avoid needing an external file request for setup snippet)
// This is a synthesized tiny 'pop/click'
const clickSoundSrc = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

function initAudioFeedback() {
    const buttons = document.querySelectorAll('.btn-primary');

    let audioCtx = null;

    // We synthesize a short, futuristic pluck rather than loading a file, ensuring high performance.
    function playClickSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine'; // Smooth tone
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // High pitch
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1); // Drop

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
        });
    });
}


/* --- 5. Mobile Menu Toggle --- */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        // Toggle logic if we want an expanding menu
        // For now, it simply shows it as block if requested
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = 'rgba(2, 6, 23, 0.95)';
            nav.style.padding = '2rem';
            nav.style.alignItems = 'center';
        }
    });
}

/* --- 6. Pricing Hover Sound --- */
function initPricingHoverSound() {
    const pricingCards = document.querySelectorAll('.pricing-card');

    let audioCtx = null;
    function playHoverSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
}


/* --- 7. Interactive Data Sphere --- */
function initDataSphere() {
    const canvas = document.getElementById('sphereCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 80;
    const maxDistance = 100;
    let rotationX = 0;
    let rotationY = 0;
    let pulse = 0;

    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            // Generate points on a sphere
            const phi = Math.acos(-1 + (2 * Math.random()));
            const theta = Math.random() * Math.PI * 2;
            const r = 120;

            this.x = r * Math.sin(phi) * Math.cos(theta);
            this.y = r * Math.sin(phi) * Math.sin(theta);
            this.z = r * Math.cos(phi);
            
            this.baseR = r;
            this.px = 0;
            this.py = 0;
        }

        rotate(rx, ry) {
            // Rotate X
            const y1 = this.y * Math.cos(rx) - this.z * Math.sin(rx);
            const z1 = this.y * Math.sin(rx) + this.z * Math.cos(rx);
            
            // Rotate Y
            const x2 = this.x * Math.cos(ry) + z1 * Math.sin(ry);
            const z2 = -this.x * Math.sin(ry) + z1 * Math.cos(ry);

            this.rx = x2;
            this.ry = y1;
            this.rz = z2;
        }

        project() {
            const factor = 400 / (400 + this.rz);
            const scale = (1 + Math.sin(pulse)) * 0.05 + 0.95; // Pulse effect
            
            this.px = (this.rx * scale * factor) + width / 2;
            this.py = (this.ry * scale * factor) + height / 2;
        }

        draw() {
            const opacity = (this.rz + 150) / 300;
            ctx.fillStyle = `rgba(0, 242, 255, ${opacity * 0.8})`;
            ctx.beginPath();
            ctx.arc(this.px, this.py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        rotationX += 0.003;
        rotationY += 0.005;
        pulse += 0.02;

        particles.forEach(p => {
            p.rotate(rotationX, rotationY);
            p.project();
        });

        // Draw lines
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dist = Math.sqrt(
                    Math.pow(p1.rx - p2.rx, 2) + 
                    Math.pow(p1.ry - p2.ry, 2) + 
                    Math.pow(p1.rz - p2.rz, 2)
                );

                if (dist < maxDistance) {
                    const opacity = (1 - dist / maxDistance) * 0.2;
                    ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.px, p1.py);
                    ctx.lineTo(p2.px, p2.py);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => p.draw());

        requestAnimationFrame(animate);
    }

    animate();
}
