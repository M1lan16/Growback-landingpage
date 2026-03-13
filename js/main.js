/* 
=========================================================
  GROWBACK LANDING PAGE - MAIN JS
=========================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTiltCards();
    initAudioFeedback();
    initInactivityVoice();
    initMobileMenu();
    initPricingHoverSound();
    initScrollToBottomSpeech();
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

/* --- 4. Speech Synthesis (Inactivity) --- */
function initInactivityVoice() {
    let inactivityTimer;
    const INACTIVITY_LIMIT_MS = 30000; // 30 seconds
    let hasSpoken = false; // Only speak once

    const resetTimer = () => {
        if (hasSpoken) return; // Stop tracking after it triggers once

        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            triggerVoiceFeedback();
        }, INACTIVITY_LIMIT_MS);
    };

    const triggerVoiceFeedback = () => {
        if (!('speechSynthesis' in window)) return;

        hasSpoken = true;
        const msg = new SpeechSynthesisUtterance();

        // Randomize the message slightly
        const messages = [
            "Good boy.",
            "Check this out.",
            "Still there?"
        ];
        msg.text = messages[Math.floor(Math.random() * messages.length)];

        // Try to find a pleasant English voice (or German since it's a DE site, but user requested english text)
        msg.lang = 'en-US';
        msg.volume = 0.5; // Subtle volume
        msg.rate = 1.1;
        msg.pitch = 0.9;

        window.speechSynthesis.speak(msg);
    };

    // Track user activity
    window.addEventListener('mousemove', resetTimer, { passive: true });
    window.addEventListener('scroll', resetTimer, { passive: true });
    window.addEventListener('keypress', resetTimer, { passive: true });
    window.addEventListener('click', resetTimer, { passive: true });

    // Initial start
    resetTimer();
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

/* --- 7. Scroll to Bottom Speech --- */
function initScrollToBottomSpeech() {
    let hasSpokenBottom = false;

    window.addEventListener('scroll', () => {
        if (hasSpokenBottom) return;

        // Check if user is near the bottom (within 100px)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            if (!('speechSynthesis' in window)) return;
            hasSpokenBottom = true;

            const msg = new SpeechSynthesisUtterance("Good boy. Let's start your project.");
            msg.lang = 'en-US';
            msg.volume = 0.5;
            msg.rate = 1.0;
            msg.pitch = 0.9;
            window.speechSynthesis.speak(msg);
        }
    }, { passive: true });
}
