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
    initFAQAccordion();
    initProcessGlowLine();
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

    // Frosted glass on scroll — class-based, no inline styles
    const header = document.getElementById('main-header');
    const onScroll = () => {
        header.classList.toggle('nav-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load in case page is already scrolled
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
    const buttons = document.querySelectorAll('.btn, .faq-question');

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

        oscillator.type = 'sine'; 
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1); 

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
    const btn     = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('mobile-nav');

    if (!btn || !overlay) return;

    function openMenu() {
        btn.classList.add('open');
        overlay.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Menü schließen');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        btn.classList.remove('open');
        overlay.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Menü öffnen');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        btn.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close when any mobile nav link is clicked
    overlay.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(el => {
        el.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && btn.classList.contains('open')) closeMenu();
    });
}

/* --- 6. FAQ Accordion — clean open/close toggle --- */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other open items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    const otherAnswer = other.querySelector('.faq-answer');
                    const otherBtn = other.querySelector('.faq-question');
                    if (otherAnswer) otherAnswer.classList.remove('open');
                    if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the clicked item
            if (isOpen) {
                item.classList.remove('open');
                answer.classList.remove('open');
                answer.setAttribute('aria-hidden', 'true');
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                answer.classList.add('open');
                answer.setAttribute('aria-hidden', 'false');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* --- 7. Process Section — Mobile Scroll Glow Line --- */
function initProcessGlowLine() {
    const steps = document.querySelector('#demo-mechanism .timeline-steps');
    if (!steps) return;

    function isMobile() {
        return window.innerWidth < 768;
    }

    function updateGlow() {
        if (!isMobile()) {
            steps.style.removeProperty('--glow-pos');
            return;
        }

        const rect = steps.getBoundingClientRect();
        const sectionHeight = rect.height;

        if (sectionHeight === 0) return;

        // How far the viewport center has moved through the section
        const viewportCenter = window.innerHeight / 2;
        const relativePos = viewportCenter - rect.top;
        const progress = Math.min(Math.max(relativePos / sectionHeight, 0), 1);

        steps.style.setProperty('--glow-pos', `${progress * 100}%`);
    }

    window.addEventListener('scroll', updateGlow, { passive: true });
    window.addEventListener('resize', updateGlow, { passive: true });
    updateGlow();
}


