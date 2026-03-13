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
    initInteractiveCube();
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

/* --- 7. Interactive 3D Tech-Cube --- */
function initInteractiveCube() {
    const cube = document.querySelector('.cube-container');
    const hero = document.getElementById('hero');
    const ctaBtn = document.querySelector('.hero-actions .btn-primary');
    const faces = document.querySelectorAll('.face');

    if (!cube || !hero) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let autoRotate = 0;
    
    // Navigation Rotation Offsets (to face the user better on hover)
    const hoverOffsets = {
        'front': { x: 0, y: 0 },
        'right': { x: 0, y: -90 },
        'back': { x: 0, y: -180 },
        'left': { x: 0, y: -270 }
    };


    // Magnetic Mouse Follow & Hover Logic
    hero.addEventListener('mousemove', (e) => {
        const isHoveringFace = e.target.closest('.face');
        const rect = hero.getBoundingClientRect();
        
        if (isHoveringFace && isHoveringFace.dataset.target) {
            const side = isHoveringFace.classList.contains('front') ? 'front' :
                         isHoveringFace.classList.contains('right') ? 'right' :
                         isHoveringFace.classList.contains('back') ? 'back' : 'left';
            
            targetRotateX = hoverOffsets[side].x;
            targetRotateY = hoverOffsets[side].y;
        } else {
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            targetRotateY = (x / (rect.width / 2)) * 30;
            targetRotateX = (y / (rect.height / 2)) * -30;
        }
    });

    hero.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
    });

    // Navigation Click Logic
    faces.forEach(face => {
        face.addEventListener('click', (e) => {
            const targetId = face.dataset.target;
            if (targetId) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // High Speed Spin on CTA Button Interactions
    if (ctaBtn) {
        const triggerSpin = () => {
            cube.classList.add('cube-fast-spin');
            cube.style.setProperty('--rot-x', `${currentRotateX}deg`);
            cube.style.setProperty('--rot-y', `${currentRotateY + autoRotate}deg`);
            
            setTimeout(() => {
                cube.classList.remove('cube-fast-spin');
            }, 600);
        };
        ctaBtn.addEventListener('mouseenter', triggerSpin);
        ctaBtn.addEventListener('click', triggerSpin);
    }

    // Animation Loop (60 FPS)
    function animate() {
        if (!cube.classList.contains('cube-fast-spin')) {
            autoRotate += 0.1; // Graceful exactly 1rpm rotation
            currentRotateX += (targetRotateX - currentRotateX) * 0.1;
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;
            cube.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY + autoRotate}deg)`;
        }
        requestAnimationFrame(animate);
    }

    animate();
}

