// ================================================================
// Fresh Up Barbershop — Booking System
// Flow: Location → Barber → CutApp (external)
// ================================================================

// ================================================================
// SUPABASE CONFIG (replace placeholders when ready)
// ================================================================
const SUPABASE_URL = 'https://Freshup.supabase.co';          // e.g. https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmtwaWp0dG9vZXZtd3lhaXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjU2NzMsImV4cCI6MjA5MjcwMTY3M30.-rXZHLp2Qw73Yak_3hRH8ThuEqTIF7xr3mkHv7hQ10Y'; // from Supabase project settings

const SUPABASE_HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
};

// ── Supabase fetch helper ──────────────────────────────────
async function sbFetch(table, query = '', method = 'GET', body = null) {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
    const opts = { method, headers: SUPABASE_HEADERS };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`Supabase ${method} failed: ${res.status}`);
    return res.json();
}

// ================================================================
// STATE
// ================================================================

const bookingState = {
    step: 1,
    location: null,
    barber: null
};

// ================================================================
// PROGRESS BAR
// ================================================================

function renderProgressBar(step) {
    const bar = document.getElementById('bookingProgress');
    if (!bar) return;
    bar.innerHTML = `
        <div class="progress-step ${step >= 1 ? 'active' : ''}">
            <div class="progress-circle">1</div>
            <div class="progress-label">Location</div>
        </div>
        <div class="progress-line ${step >= 2 ? 'active' : ''}"></div>
        <div class="progress-step ${step >= 2 ? 'active' : ''}">
            <div class="progress-circle">2</div>
            <div class="progress-label">Barber</div>
        </div>
    `;
}

// ================================================================
// STEP 1 — LOCATION
// ================================================================

async function renderLocationStep() {
    bookingState.step = 1;
    renderProgressBar(1);

    const locations = await sbFetch('locations', '?active=eq.true&order=name.asc');
    const content = document.getElementById('bookingContent');

    content.innerHTML = `
        <div class="step-wrap" id="locationStep">
            ...
            <div class="loc-grid">
                ${locations.map((loc, i) => `
                    ...
                `).join('')}
            </div>
        </div>
    `;

    content.querySelectorAll('.loc-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = this.dataset.id;
            const loc = locations.find(l => l.id === id);
            selectLocation(loc);
        });
    });
}

    bookingState.step = 1;
    renderProgressBar(1);

    const content = document.getElementById('bookingContent');
    content.innerHTML = `
        <div class="step-wrap" id="locationStep">
            <div class="step-head">
                <div class="step-eyebrow">STEP 01</div>
                <h2 class="step-title">Select Your <span>Location</span></h2>
                <p class="step-sub">Pick the Fresh Up location closest to you.</p>
            </div>
            <div class="loc-grid">
                ${LOCATIONS.map((loc, i) => `
                    <button class="loc-card" data-id="${loc.id}" style="animation-delay:${i * 0.1}s">
                        <div class="loc-card-inner">
                            <div class="loc-num">0${i + 1}</div>
                            <div class="loc-pin-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <h3 class="loc-name">${loc.name}</h3>
                            <p class="loc-addr">${loc.address}</p>
                            <p class="loc-hours">${loc.hours}</p>
                            <div class="loc-cta">
                                Select Location
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </div>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    content.querySelectorAll('.loc-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const loc = LOCATIONS.find(l => l.id === id);
            selectLocation(loc);
        });
    });

function selectLocation(loc) {
    bookingState.location = loc;
    renderBarberStep();
}

// ================================================================
// STEP 2 — BARBER
// ================================================================

async function renderBarberStep() {
    bookingState.step = 2;
    renderProgressBar(2);

    const barbers = await sbFetch(
        'barbers',
        `?location_id=eq.${bookingState.location.id}&active=eq.true&order=display_order.asc`
    );

    const content = document.getElementById('bookingContent');
    content.innerHTML = `
        <div class="step-wrap" id="barberStep">
            ...
            <div class="barber-grid">
                ${barbers.map((b, i) => `
                    ...
                    photo: b.photo_url,
                    cutapp_url: b.cutapp_url
                    ...
                `).join('')}
            </div>
        </div>
    `;
}

    bookingState.step = 2;
    renderProgressBar(2);

    const locationBarbers = BARBERS[bookingState.location.id] || [];
    const content = document.getElementById('bookingContent');

    content.innerHTML = `
        <div class="step-wrap" id="barberStep">
            <div class="step-head">
                <button class="back-btn" id="backToLocations">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back
                </button>
                <div class="step-eyebrow">STEP 02</div>
                <h2 class="step-title">Choose Your <span>Barber</span></h2>
                <p class="step-sub">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${bookingState.location.name} · ${bookingState.location.address}
                </p>
            </div>
            <div class="barber-grid">
                ${locationBarbers.map((b, i) => `
                    <div class="barber-card" style="animation-delay:${i * 0.07}s">
                        <div class="barber-photo-wrap">
                            <img
                                src="${b.photo}"
                                alt="${escapeHtml(b.name)}"
                                class="barber-photo"
                                onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\'><rect fill=\\'%231a1208\\'/><text x=\\'50%\\' y=\\'50%\\' font-size=\\'60\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' fill=\\'%23F4A261\\'>✂</text></svg>'"
                            >
                            <div class="barber-photo-overlay"></div>
                            <div class="barber-exp-badge">${b.experience}yr${b.experience > 1 ? 's' : ''}</div>
                        </div>
                        <div class="barber-body">
                            <div class="barber-title-tag">${escapeHtml(b.title)}</div>
                            <h3 class="barber-name">${escapeHtml(b.name)}</h3>
                            <p class="barber-bio">${escapeHtml(b.bio)}</p>
                            <div class="barber-tags">
                                ${b.specialties.map(s => `<span class="barber-tag">${escapeHtml(s)}</span>`).join('')}
                            </div>
                        </div>
                        <button class="book-barber-btn"
                            data-cutapp="${escapeAttr(b.cutapp_url)}"
                            data-name="${escapeAttr(b.name)}">
                            <span>Book with ${escapeHtml(b.name.split(' ')[0])}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('backToLocations')?.addEventListener('click', function (e) {
        e.preventDefault();
        renderLocationStep();
    });

    content.querySelectorAll('.book-barber-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const url = this.dataset.cutapp;
            const name = this.dataset.name;
            openCutApp(url, name);
        });
    });

// ================================================================
// REDIRECT TO CUTAPP
// ================================================================

function openCutApp(url, barberName) {
    // ── SUPABASE SWAP ──────────────────────────────────────────
    // Optionally log the booking intent to Supabase before redirect:
    //
    // await sbFetch('booking_clicks', '', 'POST', {
    //     barber_name: barberName,
    //     location_id: bookingState.location.id,
    //     clicked_at: new Date().toISOString()
    // });
    // ──────────────────────────────────────────────────────────

    if (url && url !== '#') {
        showToast(`Redirecting you to book with ${barberName}...`, 'success');
        setTimeout(() => window.open(url, '_blank'), 800);
    } else {
        showToast(`Booking link coming soon for ${barberName}.`, 'info');
    }
}

// ================================================================
// UTILITIES
// ================================================================

function escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.fu-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `fu-toast fu-toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('fu-toast--show'));
    });

    setTimeout(() => {
        toast.classList.remove('fu-toast--show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ================================================================
// BOOT
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    renderLocationStep();
});

console.log('✂️ Fresh Up booking.js loaded');