// ================================================================
// Fresh Up Barbershop — Booking System
// Flow: Location → Barber → CutApp (external)
// ================================================================
// SUPABASE CONFIG (replace placeholders when ready)
// ================================================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';          // e.g. https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // from Supabase project settings

// const SUPABASE_HEADERS = {
//     'apikey': SUPABASE_ANON_KEY,
//     'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
//     'Content-Type': 'application/json'
// };

// ================================================================
// PLACEHOLDER DATA  (swap these out with Supabase calls later)
// ================================================================

const LOCATIONS = [
    {
        id: 1,
        name: 'La Mesa',
        address: '1234 Spring St, La Mesa, CA 91942',
        phone: '(619) 555-0101',
        hours: 'Mon–Sat 9am–7pm · Sun 10am–4pm'
    },
    {
        id: 2,
        name: 'Spring Valley',
        address: '5678 Campo Rd, Spring Valley, CA 91977',
        phone: '(619) 555-0202',
        hours: 'Mon–Sat 9am–7pm · Sun 10am–4pm'
    },
    {
        id: 3,
        name: 'National City',
        address: '9012 Harbor Dr, National City, CA 91950',
        phone: '(619) 555-0303',
        hours: 'Mon–Sat 9am–7pm · Sun Closed'
    }
];

// 6 barbers per location — update photo paths and cutapp_url when ready
const BARBERS = {
    1: [ // La Mesa
        {
            id: 101,
            name: 'Marcus Leon',
            title: 'Master Barber',
            experience: 8,
            specialties: ['Skin Fades', 'Beard Sculpting', 'Hair Design'],
            bio: 'Known for razor-sharp fades and clean lines. Marcus brings West Coast precision to every cut.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/marcus-leon'  // ← replace with real CutApp URL
        },
        {
            id: 102,
            name: 'Devon Shaw',
            title: 'Senior Barber',
            experience: 5,
            specialties: ['Box Fades', 'Braiding', 'Lineups'],
            bio: 'Devon turns heads with creative hair design and expert braid work.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/devon-shaw'
        },
        {
            id: 103,
            name: 'Jaylen Cruz',
            title: 'Barber',
            experience: 3,
            specialties: ['Tapers', 'Textured Cuts', 'Kids Cuts'],
            bio: 'Patient, precise, and great with clients of all ages.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/jaylen-cruz'
        },
        {
            id: 104,
            name: 'Tony Reeves',
            title: 'Master Barber',
            experience: 12,
            specialties: ['Classic Cuts', 'Hot Towel Shave', 'Beard Trim'],
            bio: 'Old-school craft meets modern style. Tonys been shaping San Diego since day one.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/tony-reeves'
        },
        {
            id: 105,
            name: 'Isaiah Webb',
            title: 'Senior Barber',
            experience: 6,
            specialties: ['Burst Fades', 'Mohawks', 'Hair Color'],
            bio: 'Isaiah pushes the boundaries of style with bold shapes and color work.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/isaiah-webb'
        },
        {
            id: 106,
            name: 'Carlos Vega',
            title: 'Barber',
            experience: 4,
            specialties: ['Low Fades', 'Skin Tape', 'Afro Cuts'],
            bio: 'Carlos brings versatility and energy to every chair session.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/carlos-vega'
        }
    ],
    2: [ // Spring Valley
        {
            id: 201,
            name: 'Darius King',
            title: 'Master Barber',
            experience: 10,
            specialties: ['Skin Fades', 'Lineups', 'Beard Design'],
            bio: 'Darius is the go-to in Spring Valley for precise fades and defined beards.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/darius-king'
        },
        {
            id: 202,
            name: 'Malik Jordan',
            title: 'Senior Barber',
            experience: 7,
            specialties: ['Braiding', 'Twists', 'Natural Hair'],
            bio: 'Malik specializes in natural styles, protective looks, and detailed braid work.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/malik-jordan'
        },
        {
            id: 203,
            name: 'Tre Williams',
            title: 'Barber',
            experience: 3,
            specialties: ['Tapers', 'Kids Cuts', 'Shaggy Styles'],
            bio: 'Fresh energy and a steady hand — Tre is building a reputation one great cut at a time.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/tre-williams'
        },
        {
            id: 204,
            name: 'Elijah Moore',
            title: 'Master Barber',
            experience: 9,
            specialties: ['High Tops', 'Caesar Cuts', 'Waves'],
            bio: 'Elijah brings old-school technique and modern flair to every session.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/elijah-moore'
        },
        {
            id: 205,
            name: 'Ray Santos',
            title: 'Senior Barber',
            experience: 5,
            specialties: ['Drop Fades', 'Hair Design', 'Razor Art'],
            bio: 'Rays razor art is legendary in the community — detail-obsessed and creative.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/ray-santos'
        },
        {
            id: 206,
            name: 'James Owens',
            title: 'Barber',
            experience: 2,
            specialties: ['Skin Fades', 'Lineups', 'Beard Trim'],
            bio: 'Up-and-coming barber with a hunger for perfection and an eye for clean edges.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/james-owens'
        }
    ],
    3: [ // National City
        {
            id: 301,
            name: 'Alex Romero',
            title: 'Master Barber',
            experience: 11,
            specialties: ['Skin Fades', 'Classic Cuts', 'Hot Towel Shave'],
            bio: 'Alex runs the National City chair with precision, consistency, and old-school respect.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/alex-romero'
        },
        {
            id: 302,
            name: 'Kevin Park',
            title: 'Senior Barber',
            experience: 6,
            specialties: ['Textured Crops', 'Undercuts', 'Asian Hair'],
            bio: 'Kevin excels at working with all hair types, bringing global technique to SD.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/kevin-park'
        },
        {
            id: 303,
            name: 'Omar Jackson',
            title: 'Barber',
            experience: 4,
            specialties: ['Burst Fades', 'Braiding', 'Lineups'],
            bio: 'Omar brings raw talent and a meticulous attention to every fade and lineup.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/omar-jackson'
        },
        {
            id: 304,
            name: 'Nate Rivera',
            title: 'Master Barber',
            experience: 8,
            specialties: ['Tapers', 'Flat Tops', 'Beard Sculpting'],
            bio: 'Nate brings structure and shape to every cut — a sculptor behind the chair.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/nate-rivera'
        },
        {
            id: 305,
            name: 'Chris Bell',
            title: 'Senior Barber',
            experience: 5,
            specialties: ['Drop Fades', 'Waves', 'Design Work'],
            bio: 'Chris is patient, detail-oriented, and always delivers above expectations.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/chris-bell'
        },
        {
            id: 306,
            name: 'Dana Brooks',
            title: 'Barber',
            experience: 3,
            specialties: ['Kids Cuts', 'Tapers', 'Natural Styles'],
            bio: 'Friendly, focused, and fearless with any hair type — Danas the real deal.',
            photo: '../../backend/images/barbers/barber-placeholder.jpg',
            cutapp_url: 'https://cutapp.com/barber/dana-brooks'
        }
    ]
};

// ================================================================
// SUPABASE FETCH HELPER (uncomment when Supabase is ready)
// ================================================================

// async function sbFetch(table, params = '') {
//     const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
//         headers: SUPABASE_HEADERS
//     });
//     if (!res.ok) throw new Error(`Supabase error ${res.status}: ${await res.text()}`);
//     return res.json();
// }

// ================================================================
// STATE
// ================================================================

const bookingState = {
    location: null,
    barber: null,
    step: 1
};

// ================================================================
// INIT
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    renderProgressBar(1);
    renderLocationStep();
});

// ================================================================
// STEP PROGRESS BAR
// ================================================================

function renderProgressBar(activeStep) {
    const steps = [
        { num: 1, label: 'Location' },
        { num: 2, label: 'Barber' }
    ];

    const container = document.getElementById('stepProgress');
    if (!container) return;

    container.innerHTML = steps.map((s, i) => `
        <div class="sp-group">
            <div class="sp-dot ${s.num < activeStep ? 'completed' : s.num === activeStep ? 'active' : ''}">
                ${s.num < activeStep ? '✓' : s.num}
            </div>
            <span class="sp-label ${s.num === activeStep ? 'active' : ''}">${s.label}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="sp-line ${activeStep > s.num ? 'done' : ''}"></div>` : ''}
    `).join('');
}

// ================================================================
// STEP 1 — LOCATION
// ================================================================

function renderLocationStep() {
    // ── SUPABASE SWAP ──────────────────────────────────────────
    // Replace the LOCATIONS array call below with:
    //
    // const locations = await sbFetch('locations', '?is_active=eq.true&order=id.asc');
    // Then map `locations` instead of `LOCATIONS`
    // ──────────────────────────────────────────────────────────

    bookingState.step = 1;
    renderProgressBar(1);

    const content = document.getElementById('bookingContent');
    content.innerHTML = `
        <div class="step-wrap" id="locationStep">
            <div class="step-head">
                <div class="step-eyebrow">STEP 01</div>
                <h2 class="step-title">Choose Your <span>Location</span></h2>
                <p class="step-sub">Pick the shop closest to you and let's get started.</p>
            </div>
            <div class="loc-grid">
                ${LOCATIONS.map((loc, i) => `
                    <button class="loc-card" data-id="${loc.id}" style="animation-delay:${i * 0.08}s">
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
}

function selectLocation(loc) {
    bookingState.location = loc;
    renderBarberStep();
}

// ================================================================
// STEP 2 — BARBER
// ================================================================

function renderBarberStep() {
    // ── SUPABASE SWAP ──────────────────────────────────────────
    // Replace the BARBERS[locationId] lookup below with:
    //
    // const barbers = await sbFetch(
    //     'barbers',
    //     `?location_id=eq.${bookingState.location.id}&is_active=eq.true&order=display_order.asc`
    // );
    // Then map `barbers` instead of `locationBarbers`
    // ──────────────────────────────────────────────────────────

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
}

// ================================================================
// REDIRECT TO CUTAPP
// ================================================================

function openCutApp(url, barberName) {
    // ── SUPABASE SWAP ──────────────────────────────────────────
    // Optionally log the booking intent to Supabase before redirect:
    //
    // await sbFetch('booking_clicks', '') POST with:
    //   { barber_name: barberName, location_id: bookingState.location.id, ts: new Date() }
    // ──────────────────────────────────────────────────────────

    if (url && url !== '#') {
        showToast(`Redirecting you to book with ${barberName}...`, 'success');
        setTimeout(() => window.open(url, '_blank'), 800);
    } else {
        showToast(`CutApp link coming soon for ${barberName}.`, 'info');
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

console.log('✂️ Fresh Up booking.js loaded');