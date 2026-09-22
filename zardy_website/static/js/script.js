/* ---------------- i18n & Content Management ---------------- */
const translations = {
    es: {
        "nav.bio": "sobre", "nav.sound": "sonido", "nav.discog": "discografía", "nav.listen": "escucha",
        "hero.kicker": "artista independiente — rock alternativo",
        "hero.line": "Sonido crudo, melancólico y directo, nacido más en la escena de edits de TikTok que en una discográfica. Sus lanzamientos se mueven entre el indie rock y el alt rock con letras introspectivas sobre vulnerabilidad y resiliencia.",
        "hero.stat1": "oyentes mensuales en Spotify", "hero.stat2": "lanzamientos", "hero.stat3": "años activo",
        "bio.h2": "sobre él", "bio.sub": "trayectoria e impacto en la escena alternativa underground",
        "bio.note": "Zardy es un artista independiente cuya música se ha viralizado orgánicamente en comunidades de TikTok (edits de anime, corecore y losercore) acumulando decenas de miles de reproducciones mensuales.",
        "bio.p1": "Su sencillo principal \"it be okay\" (2026) se convirtió en el punto de inflexión para su audiencia, con letras introspectivas y acordes melancólicos de guitarra. La abrumadora respuesta impulsó una versión extendida que incluyó ediciones Sped Up, Slowed e Instrumental.",
        "bio.p2": "En marzo de 2026 lanzó \"baby steps.\", su álbum debut de 9 canciones (con dos colaboraciones junto a Pongus). Antes de eso había ido soltando sencillos sueltos como \"Cult of katana\" y \"don't play\", construyendo su audiencia sin depender de una discográfica tradicional — el flujo típico del DIY musical en la era digital.",
        "sound.h2": "el sonido", "sound.sub": "estética musical y géneros característicos",
        "player.h2": "reproductor destacado", "player.sub": "escucha directa en Spotify",
        "discog.h2": "discografía", "discog.sub": "haz clic en un lanzamiento para desplegar sus pistas",
        "listen.h2": "plataformas oficiales", "listen.sub": "enlaces directos y verificados",
        "listen.spotifySub": "58.8K oyentes mensuales", "listen.tiktokSub": "@zardyeoeo",
        "footer.disclaimer": "Fan page no oficial — datos integrados con la API de Spotify",
        "footer.cta": "Escuchar en Spotify →",
        tags: ["indie rock", "alt rock", "corecore", "losercore", "melancólico", "TikTok-core", "post-punk vibes"],
        single: "canción", plural: "canciones", releaseKind: "Sencillo", releaseKindAlbum: "Álbum"
    },
    en: {
        "nav.bio": "about", "nav.sound": "sound", "nav.discog": "discography", "nav.listen": "listen",
        "hero.kicker": "independent artist — alternative rock",
        "hero.line": "Raw, melancholic and direct sound, born more out of TikTok's edit scene than a record label. His releases sit between indie rock and alt rock, with introspective lyrics about vulnerability and resilience.",
        "hero.stat1": "monthly listeners on Spotify", "hero.stat2": "releases", "hero.stat3": "years active",
        "bio.h2": "about him", "bio.sub": "pathway and impact in the underground alternative scene",
        "bio.note": "Zardy is an emerging independent artist whose music blew up organically across TikTok communities (anime edits, corecore, and losercore), racking up tens of thousands of monthly streams.",
        "bio.p1": "His breakout single \"it be okay\" (2026) marked a turning point for his audience with its moody guitar tones and relatable lyrics. The massive fan response prompted an extended release featuring Sped Up, Slowed, and Instrumental cuts.",
        "bio.p2": "In March 2026 he released \"baby steps.\", his 9-song debut album (featuring two collaborations with Pongus). Before that he'd been dropping standalone singles like \"Cult of katana\" and \"don't play\", building his audience without a traditional label — the modern DIY ethos of the digital music landscape.",
        "sound.h2": "the sound", "sound.sub": "musical aesthetic and core genres",
        "player.h2": "featured player", "player.sub": "listen directly on Spotify",
        "discog.h2": "discography", "discog.sub": "click a release to expand tracklist",
        "listen.h2": "official links", "listen.sub": "verified streaming profiles",
        "listen.spotifySub": "58.8K monthly listeners", "listen.tiktokSub": "@zardyeoeo",
        "footer.disclaimer": "Unofficial fan page — data integrated with the Spotify API",
        "footer.cta": "Listen on Spotify →",
        tags: ["indie rock", "alt rock", "corecore", "losercore", "melancholic", "TikTok-core", "post-punk vibes"],
        single: "song", plural: "songs", releaseKind: "Single", releaseKindAlbum: "Album"
    }
};

let lang = 'es';

const releases = [
    { title: "it be okay (bonus)", year: 2026, tracks: [
        { name: "it be okay (sped up)", time: "3:23" },
        { name: "it be okay (instrumental)", time: "3:38" },
        { name: "it be okay (slowed)", time: "3:56" }
    ]},
    { title: "it be okay", year: 2026, tracks: [{ name: "it be okay", time: "3:39" }] },
    { title: "baby steps.", year: 2026, kindAlbum: true, tracks: [
        { name: "Value (scene1)", time: "0:36" },
        { name: "Rotom", time: "1:38" },
        { name: "Summer (scene2)", time: "0:51" },
        { name: "ISO", time: "1:19" },
        { name: "Goodnight (feat. Pongus)", time: "2:35" },
        { name: "I Don't Care (feat. Pongus)", time: "3:22" },
        { name: "DITTO", time: "2:29" },
        { name: "Optimist", time: "1:45" },
        { name: "1964", time: "3:09" }
    ]},
    { title: "don't play", year: 2026, tracks: [{ name: "don't play", time: "2:02" }] },
    { title: "Grow", year: 2026, tracks: [{ name: "Grow", time: "1:55" }] },
    { title: "number1", year: 2026, tracks: [{ name: "number1", time: "3:01" }] },
    { title: "Cult of katana", year: 2025, tracks: [{ name: "Cult of katana", time: "1:51" }] },
    { title: "Perigo Noturno (2021 - Remasterizado)", year: 2021, tracks: [{ name: "Perigo Noturno (2021 - Remasterizado)", time: "2:41" }] }
];

function renderHeroName() {
    const el = document.getElementById('hero-name');
    if (!el) return;
    el.innerHTML = '';
    'zardy'.split('').forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.animationDelay = (0.05 * i) + 's';
        el.appendChild(s);
    });
}

function renderTags() {
    const cloud = document.getElementById('tag-cloud');
    if (!cloud) return;
    cloud.innerHTML = '';
    translations[lang].tags.forEach(t => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = t;
        cloud.appendChild(chip);
    });
}

function renderReleases() {
    const container = document.getElementById('releases');
    if (!container) return;
    const openIndex = [...container.querySelectorAll('.release')].findIndex(r => r.classList.contains('open'));
    container.innerHTML = '';
    const t = translations[lang];

    releases.forEach((rel, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'release';
        const num = String(i + 1).padStart(2, '0');
        const trackWord = rel.tracks.length === 1 ? t.single : t.plural;
        const kindLabel = rel.kindAlbum ? t.releaseKindAlbum : t.releaseKind;

        wrap.innerHTML = `
            <button class="release-head" aria-expanded="false">
                <span class="release-num">${num}</span>
                <span class="release-title">${rel.title}<span class="kind">${kindLabel}</span></span>
                <span class="release-count">${rel.tracks.length} ${trackWord}</span>
                <span class="release-year">${rel.year}</span>
                <span class="chevron"></span>
            </button>
            <div class="tracklist">
                <ol>
                    ${rel.tracks.map((tr, idx) => `
                        <li>
                            <span class="track-idx">${idx + 1}</span>
                            <span class="track-name">${tr.name}</span>
                            <span class="track-time">${tr.time}</span>
                        </li>
                    `).join('')}
                </ol>
            </div>
        `;

        const head = wrap.querySelector('.release-head');
        head.addEventListener('click', () => {
            const isOpen = wrap.classList.contains('open');
            document.querySelectorAll('.release.open').forEach(el => { if (el !== wrap) el.classList.remove('open'); });
            wrap.classList.toggle('open', !isOpen);
            head.setAttribute('aria-expanded', String(!isOpen));
        });

        container.appendChild(wrap);
    });

    if (openIndex >= 0 && container.children[openIndex]) {
        container.children[openIndex].classList.add('open');
    }
}

function applyLang() {
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key] !== undefined) el.innerHTML = translations[lang][key];
    });
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    if (btnEs && btnEn) {
        btnEs.classList.toggle('active', lang === 'es');
        btnEn.classList.toggle('active', lang === 'en');
    }
    renderTags();
    renderReleases();
}

document.addEventListener('DOMContentLoaded', () => {
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    if (btnEs) btnEs.addEventListener('click', () => { lang = 'es'; applyLang(); });
    if (btnEn) btnEn.addEventListener('click', () => { lang = 'en'; applyLang(); });

    renderHeroName();
    applyLang();

    /* ---------------- Scroll Reveal ---------------- */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});