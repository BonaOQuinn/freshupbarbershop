// ================================================================
// Fresh Up Barbershop — Booking System
// Flow: Location → Barber → CutApp (external)
// ================================================================

// ================================================================
// SUPABASE CONFIG
// ================================================================
const SUPABASE_URL = 'https://bgfkpijttooevmwyaiwn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmtwaWp0dG9vZXZtd3lhaXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjU2NzMsImV4cCI6MjA5MjcwMTY3M30.-rXZHLp2Qw73Yak_3hRH8ThuEqTIF7xr3mkHv7hQ10Y';

const SUPABASE_HEADERS = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type':  'application/json'
};

// ── Supabase fetch helper ──────────────────────────────────────
async function sbFetch(table, query = '', method = 'GET', body = null) {
    const url  = `${SUPABASE_URL}/rest/v1/${table}${query}`;
    const opts = { method, headers: SUPABASE_HEADERS };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`Supabase ${method} ${table} failed: ${res.status}`);
    return res.json();
}

// ================================================================
// STATE
// ================================================================
const bookingState = {
    step:     1,
    location: null,
    barber:   null
};

// ================================================================
// PROGRESS BAR
// ================================================================
function renderProgressBar(step) {
    const bar = document.getElementById('stepProgress');
    if (!bar) return;

    const steps = [
        { n: 1, label: 'Location' },
        { n: 2, label: 'Barber'   }
    ];

    bar.innerHTML = steps.map((s, i) => {
        const dotClass = step > s.n ? 'completed' : step === s.n ? 'active' : '';
        const lblClass = step >= s.n ? 'active' : '';
        const check    = step > s.n
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`
            : s.n;
        const line = i < steps.length - 1
            ? `<div class="sp-line ${step > s.n ? 'done' : ''}"></div>`
            : '';

        return `
            <div class="sp-group">
                <div class="sp-dot ${dotClass}">${check}</div>
                <div class="sp-label ${lblClass}">${s.label}</div>
            </div>
            ${line}
        `;
    }).join('');
}

// ================================================================
// STEP 1 — LOCATION
// ================================================================
async function renderLocationStep() {
    bookingState.step = 1;
    renderProgressBar(1);

    const content = document.getElementById('bookingContent');
    content.innerHTML = `<div class="step-wrap"><p class="step-sub" style="text-align:center;margin-top:3rem;">Loading locations…</p></div>`;

    let locations;
    try {
        locations = await sbFetch('locations', '?active=eq.true&order=name.asc');
    } catch (err) {
        console.error(err);
        content.innerHTML = `<div class="step-wrap"><p class="step-sub" style="text-align:center;color:#f87171;">Could not load locations. Please try again.</p></div>`;
        return;
    }

    content.innerHTML = `
        <div class="step-wrap" id="locationStep">
            <div class="step-head">
                <div class="step-eyebrow">STEP 01</div>
                <h2 class="step-title">Select Your <span>Location</span></h2>
                <p class="step-sub">Pick the Fresh Up location closest to you.</p>
            </div>
            <div class="loc-grid">
                ${locations.map((loc, i) => `
                    <button class="loc-card" data-id="${escapeAttr(String(loc.id))}" style="animation-delay:${i * 0.1}s">
                        <div class="loc-card-inner">
                            <div class="loc-num">0${i + 1}</div>
                            <div class="loc-pin-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <h3 class="loc-name">${escapeHtml(loc.name)}</h3>
                            <p class="loc-addr">${escapeHtml(loc.address)}</p>
                            <p class="loc-hours">${escapeHtml(loc.hours)}</p>
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
            const id  = this.dataset.id;
            const loc = locations.find(l => String(l.id) === id);
            if (loc) selectLocation(loc);
        });
    });
}

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

    const content = document.getElementById('bookingContent');
    content.innerHTML = `<div class="step-wrap"><p class="step-sub" style="text-align:center;margin-top:3rem;">Loading barbers…</p></div>`;

    let barbers;
    try {
        barbers = await sbFetch(
            'barbers',
            `?location_id=eq.${bookingState.location.id}&active=eq.true&order=display_order.asc`
        );
    } catch (err) {
        console.error(err);
        content.innerHTML = `<div class="step-wrap"><p class="step-sub" style="text-align:center;color:#f87171;">Could not load barbers. Please try again.</p></div>`;
        return;
    }

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
                    ${escapeHtml(bookingState.location.name)} · ${escapeHtml(bookingState.location.address)}
                </p>
            </div>
            <div class="barber-grid">
                ${barbers.length === 0
                    ? `<p class="step-sub" style="grid-column:1/-1;text-align:center;">No barbers available at this location right now.</p>`
                    : barbers.map((b, i) => {
                        const specialties = Array.isArray(b.specialties) ? b.specialties : [];
                        const experience  = b.experience ?? 0;
                        return `
                            <div class="barber-card" style="animation-delay:${i * 0.07}s">
                                <div class="barber-photo-wrap">
                                    <img
                                        src="${escapeAttr(b.photo_url || '')}"
                                        alt="${escapeAttr(b.name)}"
                                        class="barber-photo"
                                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%231a1208%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2260%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23F4A261%22%3E%E2%9C%82%3C/text%3E%3C/svg%3E'"
                                    >
                                    <div class="barber-photo-overlay"></div>
                                    <div class="barber-exp-badge">${experience}yr${experience !== 1 ? 's' : ''}</div>
                                </div>
                                <div class="barber-body">
                                    <div class="barber-title-tag">${escapeHtml(b.title || 'Barber')}</div>
                                    <h3 class="barber-name">${escapeHtml(b.name)}</h3>
                                    <p class="barber-bio">${escapeHtml(b.bio || '')}</p>
                                    <div class="barber-tags">
                                        ${specialties.map(s => `<span class="barber-tag">${escapeHtml(s)}</span>`).join('')}
                                    </div>
                                </div>
                                <button class="book-barber-btn"
                                    data-cutapp="${escapeAttr(b.cutapp_url || '#')}"
                                    data-name="${escapeAttr(b.name)}">
                                    <span>Book with ${escapeHtml(b.name.split(' ')[0])}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </button>
                            </div>
                        `;
                    }).join('')
                }
            </div>
        </div>
    `;

    document.getElementById('backToLocations')?.addEventListener('click', function (e) {
        e.preventDefault();
        renderLocationStep();
    });

    content.querySelectorAll('.book-barber-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            openCutApp(this.dataset.cutapp, this.dataset.name);
        });
    });
}

// ================================================================
// REDIRECT TO CUTAPP
// ================================================================
function openCutApp(url, barberName) {
    if (url && url !== '#') {
        showToast(`Redirecting you to book with ${barberName}…`, 'success');
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
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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