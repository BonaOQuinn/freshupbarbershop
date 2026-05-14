// ================================================================
// Fresh Up Barbershop — index.js
// ================================================================

// ── Header scroll shadow ─────────────────────────────────────────
(function () {
    var h = document.getElementById('mainHeader');
    function update() {
        h.classList[window.pageYOffset > 10 ? 'add' : 'remove']('scrolled');
    }
    window.addEventListener('scroll', update);
    update();
})();


// ── Scroll-triggered animations (adds .in-view class) ────────────
(function () {
    var targets = document.querySelectorAll('.about-text, .pillar-item');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // After the animation finishes, add .settled so hover works cleanly
                entry.target.addEventListener('animationend', function () {
                    entry.target.classList.add('settled');
                }, { once: true });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(function (el) { observer.observe(el); });
})();


// ── Reviews carousel ────────────────────────────────────────────
var reviewCurrent = 0;
var reviewTotal   = 3;

function goReview(n) {
    reviewCurrent = (n + reviewTotal) % reviewTotal;
    document.getElementById('reviewsTrack').style.transform =
        'translateX(-' + (reviewCurrent * 100) + '%)';
    document.querySelectorAll('.reviews-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === reviewCurrent);
    });
}

document.getElementById('reviewPrev').onclick = function () { goReview(reviewCurrent - 1); };
document.getElementById('reviewNext').onclick = function () { goReview(reviewCurrent + 1); };
setInterval(function () { goReview(reviewCurrent + 1); }, 5000);