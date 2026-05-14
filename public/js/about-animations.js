// ================================================================
// Fresh Up — About Section Scroll Animations
// Triggers slide-in-from-right on .about-text and .pillar-item
// ================================================================

(function () {
    'use strict';

    // Shared observer options — fire when 15% of element is visible
    var observerOptions = {
        root:       null,
        rootMargin: '0px 0px -60px 0px',
        threshold:  0.15
    };

    // ── About text block ─────────────────────────────────────────
    var textObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target); // fire once only
            }
        });
    }, observerOptions);

    var aboutText = document.querySelector('.about-text');
    if (aboutText) textObserver.observe(aboutText);

    // ── Pillar cards ─────────────────────────────────────────────
    var cardObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var card = entry.target;
                card.classList.add('in-view');

                // After all animation delays + duration have elapsed,
                // add .settled so the hover transition takes over cleanly
                var maxDelay = 0.44; // last card delay in seconds
                var duration = 0.65;
                setTimeout(function () {
                    card.classList.add('settled');
                }, (maxDelay + duration) * 1000 + 50);

                obs.unobserve(card);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pillar-item').forEach(function (card) {
        cardObserver.observe(card);
    });

})();