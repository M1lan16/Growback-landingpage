document.addEventListener('DOMContentLoaded', () => {
    initAudioClicks();
    initContactForm();
    initMobileCards();
});

/* --- 1. Web Audio API Click Sounds --- */
function initAudioClicks() {
    const audioTriggers = document.querySelectorAll('.audio-trigger');
    let audioCtx = null;

    function playClick() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Short blip click
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    audioTriggers.forEach(btn => {
        const triggerPlay = (e) => {
            // Prevent duplicate firing if user taps then immediately clicks
            if (e.type === 'touchstart') btn.dataset.touched = 'true';
            if (e.type === 'mousedown' && btn.dataset.touched === 'true') {
                btn.dataset.touched = 'false';
                return;
            }
            playClick();
        };
        btn.addEventListener('mousedown', triggerPlay);
        btn.addEventListener('touchstart', triggerPlay, { passive: true });
    });
}

/* --- 2. Contact Form Submission --- */
function initContactForm() {
    const triggerBtn = document.getElementById('voice-submit-trigger');
    const contactForm = document.getElementById('contact-form');

    if (!triggerBtn || !contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload for demo
        // Here you would normally handle the form sending payload.
        triggerBtn.innerHTML = "Analyse Angefordert ✓";
        triggerBtn.style.backgroundColor = "transparent";
        triggerBtn.style.color = "var(--primary-color)";
    });
}

/* --- 3. Mobile Touch Hover for Cards --- */
function initMobileCards() {
    const browserCards = document.querySelectorAll('.browser-card');
    browserCards.forEach(card => {
        // Toggle active class on tap for mobile "Hover-to-Scroll"
        card.addEventListener('touchstart', function (e) {
            browserCards.forEach(c => {
                if (c !== this) c.classList.remove('is-active');
            });
            this.classList.toggle('is-active');
        }, { passive: true });
    });
}
