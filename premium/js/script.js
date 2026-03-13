document.addEventListener('DOMContentLoaded', () => {
    initAudioClicks();
    initVoiceSynthesis();
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

        // Futuristic high-pitch click
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    }

    audioTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            playClick();
        });
    });
}

/* --- 2. Speech Synthesis on Contact Form --- */
function initVoiceSynthesis() {
    const triggerBtn = document.getElementById('voice-submit-trigger');
    const contactForm = document.getElementById('contact-form');
    let targetHasSpoken = false;

    if (!triggerBtn || !contactForm) return;

    // Trigger voice either when hovering closely on the submit, or when focusing the last input
    // User requested: 'Speech Synthesis "Good boy" on final contact form step'
    // Let's trigger it when the user focuses on the submit button or clicks it.

    const speakMessage = () => {
        if (targetHasSpoken || !('speechSynthesis' in window)) return;
        targetHasSpoken = true;

        const msg = new SpeechSynthesisUtterance("Good boy.");
        msg.lang = 'en-US';
        msg.volume = 0.6;
        msg.rate = 1.0;
        msg.pitch = 0.9;

        window.speechSynthesis.speak(msg);
    };

    triggerBtn.addEventListener('mouseenter', speakMessage, { once: true });
    triggerBtn.addEventListener('focus', speakMessage, { once: true });
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload for demo
        speakMessage();
        // Here you would normally handle the form sending payload.
        triggerBtn.innerHTML = "Analyse Angefordert ✓";
        triggerBtn.style.backgroundColor = "transparent";
        triggerBtn.style.color = "var(--primary-color)";
    });
}
