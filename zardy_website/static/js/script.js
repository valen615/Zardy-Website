(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const G = !!(window.gsap && window.ScrollTrigger);
  if (G) gsap.registerPlugin(ScrollTrigger);

  /* ================= DATOS (vienen de app.py) ================= */
  const DATA = JSON.parse($('#zardy-data').textContent);
  const ARTIST_URL = 'https://open.spotify.com/artist/' + DATA.spotify_id;
  // Más nuevo primero; dentro de un mismo año, los que tienen fecha exacta van antes.
  const releases = DATA.releases
    .map((r, i) => ({ ...r, _i: i }))
    .sort((a, b) => b.year - a.year ||
      (a.date && b.date ? b.date.localeCompare(a.date) : a.date ? -1 : b.date ? 1 : a._i - b._i));

  /* ================= TEXTOS ================= */
  const T = {
    es: {
      'skip': 'saltar al contenido', 'intro.skip': 'toca para entrar', 'menu.open': 'menú',
      'nav.bio': 'sobre', 'nav.diary': 'diario', 'nav.sound': 'sonido', 'nav.album': 'álbum', 'nav.gallery': 'galería', 'nav.discog': 'discografía', 'nav.shows': 'shows', 'nav.listen': 'escucha',
      hud: { portada: 'portada', manifiesto: 'manifiesto', '01': 'sobre', '02': 'diario', '03': 'números', '04': 'sonido', '05': 'álbum', '06': 'galería', '07': 'discografía', '08': 'preguntas', '09': 'shows', '10': 'escucha', fin: 'fin' },
      mood: h => (h < 5 ? 'madrugada en Malasia 🌙' : h < 12 ? 'mañana en Malasia ☀️' : h < 19 ? 'tarde en Malasia' : 'noche en Malasia 🌙'),
      'theme.toNight': 'apagar la luz', 'theme.toDay': 'encender la luz',
      'hero.kicker': 'bedroom indie · alt rock · desde Malasia',
      'hero.line': 'Canciones hechas en su cuarto, entre el indie rock y el alt rock: crudas, melancólicas y directas. Su música viajó por los edits de TikTok antes que por cualquier discográfica.',
      'hero.cta1': 'escuchar en Spotify', 'hero.cta2': 'ver discografía', 'hero.scroll': 'baja',
      'hero.arrow': 'este es zardy', 'hero.alt': 'Dibujo de zardy con su gorro marrón con boca de monstruo',
      'stat.listeners': 'oyentes al mes', 'stat.releases': 'lanzamientos', 'stat.songs': 'canciones', 'stat.collabs': 'colaboraciones', 'stat.since': 'desde',
      'st.new': '¡nuevo!', 'st.listen': 'al mes',
      'new.label': '¡nuevo!', 'new.short': '¡nuevo!',
      ago: d => (d === 0 ? 'hoy' : d === 1 ? 'ayer' : `hace ${d} días`),
      with: 'con',
      tapeB: 'BEDROOM INDIE DESDE MALASIA ✦ PONTE AUDÍFONOS ✦ FAN PAGE NO OFICIAL ✦ IT BE OKAY :) ✦ ザルディ',
      'stmt.label': 'manifiesto', 'stmt.sign': '— un fan, desde algún otro cuarto',
      stmt: 'zardy hace música {img:kidiused} desde su cuarto en *Malasia* {hat}. sin discográfica: solo guitarras melancólicas {img:number1}, edits de TikTok {img:bonus} y un gorro con dientes. y *{crowd}* {img:contemplating} lo escuchan cada mes.',
      crowd: k => (k >= 500 ? 'más de medio millón de personas' : `más de ${Math.floor(k)} mil personas`),
      'bio.h2': 'sobre él', 'bio.sub': 'lo que se sabe, sin inventar nada',
      'bio.p1': 'zardy es un artista independiente de <mark>Malasia</mark> que hace música <mark>desde su cuarto</mark>: así se presenta él mismo en la portada de “contemplating”. Su sonido vive entre el indie rock, el alt rock y la melancolía de internet.',
      'bio.p2': 'Su perfil creció sobre todo gracias a fan-edits de TikTok en la escena “corecore” / “losercore”. En marzo de 2026 sacó <b>“baby steps.”</b>, su primer álbum (9 canciones, dos con Pongus), y en julio llegó <b>“it be okay”</b>, la canción que le trajo muchísima gente nueva; tanta, que tuvo edición bonus con versiones sped up, slowed e instrumental.',
      'bio.p3': 'En septiembre de 2026 publicó <b>“contemplating”</b>, su segundo álbum: 11 canciones con Luxii, hiroshimal y jaylu, y hasta un título en malayo, “bunga senja” (algo así como “flor del atardecer”). En octubre siguió con <b>“shower”</b>, junto a Hyso.',
      'bio.note': 'ojo: zardy no tiene una biografía oficial larga. Todo lo de aquí sale de Spotify y de lo que él mismo ha publicado ✍️',
      'bio.collabs': 'créditos — ha colaborado con',
      'tl.title': 'diario', 'tl.sub': 'cada lanzamiento, en orden', 'tl.hint': 'desliza →', 'tl.also': 'también en 2026 (sin fecha exacta):', 'tl.today': 'HOY', 'tl.next': '¿lo próximo? 👀', 'tl.year': 'solo el año',
      'facts.h2': 'en números', 'facts.sub': 'contado a mano (bueno, con JavaScript)',
      'f.longest': 'canción más larga', 'f.shortest': 'canción más corta', 'f.collabs': 'colaboraciones', 'f.avg': 'duración promedio', 'f.total': 'minutos de música', 'f.since': 'primer lanzamiento', 'f.noVersions': 'sin contar versiones',
      'f.across': n => `en ${n} canciones con duración conocida`,
      'chart.title': 'lanzamientos por año', 'chart.note': '2026 fue una locura 📈 · toca un año',
      'sound.h2': 'el sonido', 'sound.sub': 'a qué suena zardy, en stickers',
      'sound.quote': 'para escuchar con audífonos, de noche, <mark>mirando al techo</mark>.',
      tags: ['indie rock', 'alt rock', 'bedroom pop', 'corecore', 'losercore', 'melancólico', 'lo-fi', 'TikTok-core'],
      cassette: 'zardy — lado A',
      'shuffle.title': '¿no sabes por dónde empezar?', 'shuffle.sub': 'gira la máquina de cápsulas y te toca una canción',
      'shuffle.btn': 'girar la perilla', 'shuffle.again': 'otra cápsula', 'shuffle.empty': 'Te elijo una canción al azar de toda su discografía.',
      'shuffle.play': 'escuchar aquí', 'shuffle.open': 'abrir en Spotify', 'shuffle.search': 'buscar en Spotify', 'shuffle.release': 'ver lanzamiento',
      'album.h2': 'último álbum', 'album.sub': 'de principio a fin', 'album.badge': 'álbum · ya disponible',
      'album.play': 'escuchar aquí', 'album.open': 'abrir en Spotify', 'album.details': 'ver detalles', 'album.debut': 'su debut fue',
      albumNotes: { contemplating: 'La portada parece de revista: “ZARDY (ザルディ)” en letras gigantes y una mini bio en inglés y chino. Adentro: colaboraciones con Luxii, hiroshimal y jaylu.' },
      albumFeats: who => `Con ${who.join(', ')}.`,
      'vinyl.hint': 'toca el disco 💿', 'vinyl.aria': 'sacar el disco de la funda',
      'gallery.h2': 'galería', 'gallery.sub': 'portadas y dibujos sobre la mesa', 'gallery.hint': 'arrastra las fotos · toca una para verla', 'gallery.scatter': 'desordenar',
      'discog.h2': 'discografía', 'discog.sub': 'toca una portada para ver las canciones',
      'filter.aria': 'filtrar discografía', 'filter.all': 'todo', 'filter.album': 'álbumes', 'filter.single': 'EPs y sencillos', 'filter.collab': 'colabs',
      'view.aria': 'vista', 'view.grid': 'cuadrícula', 'view.list': 'lista',
      discogSummary: (n, total) => (n === total ? `${total} lanzamientos` : `${n} de ${total} lanzamientos`),
      'dlg.play': 'escuchar aquí', 'dlg.open': 'abrir en Spotify', 'dlg.search': 'buscar en Spotify', 'dlg.tracklist': 'lista de canciones', 'dlg.noTracks': 'La lista de canciones se agrega pronto.', 'dlg.close': 'cerrar',
      playTrack: 'reproducir',
      'faq.h2': 'preguntas', 'faq.sub': 'lo básico, sin vueltas',
      'faq.q1': '¿Quién es zardy?', 'faq.a1': 'Un artista independiente de Malasia que hace indie / alt rock desde su cuarto. Su música creció gracias a fan-edits en TikTok. Tiene dos álbumes: “baby steps.” (marzo de 2026) y “contemplating” (septiembre de 2026).',
      'faq.q2': '¿Por dónde empiezo?', 'faq.a2': 'Por “it be okay”: es la canción que trajo a más gente. Si quieres un álbum entero, “contemplating” es lo más nuevo y “baby steps.” dura menos de 18 minutos. O gira la máquina de cápsulas en “el sonido”.',
      'faq.q3': '¿Qué es corecore y losercore?', 'faq.a3': 'Etiquetas de internet. El corecore es un estilo de edits que mezcla videos para hablar de emociones y de la vida online; el losercore es una estética melancólica sobre sentirse fuera de lugar. Aquí sirven para describir el ambiente de su música.',
      'faq.q4': '¿Y ese gorro?', 'faq.a4': 'El gorro marrón con boca de monstruo sale en su foto de perfil y en casi todas sus portadas, así que es lo más parecido a un logo que tiene. Por eso está por toda la página (sí, también abajo a la derecha… tócalo).',
      'faq.q5': '¿Tiene shows?', 'faq.a5': 'Por ahora no hay fechas anunciadas. Si las anuncia, aparecerán en la sección “shows”.',
      'faq.q6': '¿Esta página es oficial?', 'faq.a6': 'No. Es una fan page no oficial; los datos salen de Spotify y de lo que el artista ha publicado.',
      'shows.h2': 'shows', 'shows.sub': 'fechas en vivo, cuando las haya', 'shows.badge': 'en vivo',
      'shows.title': 'sin shows anunciados (todavía)',
      'shows.body': 'zardy no ha anunciado fechas en vivo. Cuando lo haga, esta sección se actualiza. Mientras tanto, así nos lo imaginamos.',
      'shows.sceneAlt': 'Dibujo de monigotes: zardy con su gorro tocando la guitarra frente a sus fans, bajo un sol sonriente',
      'scene.you': 'tú →',
      'newsletter.h3': 'déjame tu correo', 'newsletter.p': 'Para avisos de nuevos lanzamientos y shows. Es una demo de fan: tu correo no se guarda ni se envía a ningún lado.',
      'newsletter.aria': 'tu correo', 'newsletter.placeholder': 'tu@email.com', 'newsletter.btn': 'unirme',
      'newsletter.thanks': '¡listo! (es una demo: no se envió nada de verdad)',
      'listen.h2': 'escúchalo', 'listen.sub': 'perfiles verificados', 'listen.sub1': 'oyentes al mes',
      'listen.search': 'también búscalo en', 'listen.searchNote': 'son búsquedas, no perfiles verificados',
      'footer.made': 'hecho por un fan, a mano y con mucho cariño', 'footer.disclaimer': 'fan page no oficial · datos de Spotify', 'footer.top': 'volver arriba ↑', 'footer.cta': 'escuchar en Spotify →',
      'dock.aria': 'reproductor', 'dock.now': 'sonando', 'dock.close': 'cerrar reproductor',
      'cursor.view': 'ver', 'cursor.drag': 'arrastra',
      'mascot.aria': 'el gorro de zardy (tócalo)',
      mascot: c => [`¿ya escuchaste “${c.album}”? 👀`, 'it be okay :)', 'ザルディ！', 'escribe “zardy” con el teclado… 🤫', 'ponte audífonos, en serio', `“${c.latest}” salió ${c.ago}`, 'ñam ñam 🦷', 'hecho en un cuarto en Malasia 🛏️', 'arrastra los stickers de arriba 👆'],
      'mascot.night': 'shh… modo cuarto de noche 🌙', 'mascot.day': '¡buenos días! ☀️', 'mascot.play': 'dale play en el reproductor ▶',
      egg: '¡me encontraste! 🎉',
      kinds: { album: 'álbum', ep: 'EP', single: 'sencillo', versions: 'versiones' },
      single: 'canción', plural: 'canciones', releasesWord: 'lanzamientos'
    },
    en: {
      'skip': 'skip to content', 'intro.skip': 'tap to enter', 'menu.open': 'menu',
      'nav.bio': 'about', 'nav.diary': 'diary', 'nav.sound': 'sound', 'nav.album': 'album', 'nav.gallery': 'gallery', 'nav.discog': 'discography', 'nav.shows': 'shows', 'nav.listen': 'listen',
      hud: { portada: 'cover', manifiesto: 'manifesto', '01': 'about', '02': 'diary', '03': 'numbers', '04': 'sound', '05': 'album', '06': 'gallery', '07': 'discography', '08': 'questions', '09': 'shows', '10': 'listen', fin: 'the end' },
      mood: h => (h < 5 ? 'late night in Malaysia 🌙' : h < 12 ? 'morning in Malaysia ☀️' : h < 19 ? 'afternoon in Malaysia' : 'night in Malaysia 🌙'),
      'theme.toNight': 'turn the lights off', 'theme.toDay': 'turn the lights on',
      'hero.kicker': 'bedroom indie · alt rock · from Malaysia',
      'hero.line': 'Songs made in his bedroom, somewhere between indie rock and alt rock: raw, melancholic and direct. His music traveled through TikTok edits rather than through a record label.',
      'hero.cta1': 'listen on Spotify', 'hero.cta2': 'see discography', 'hero.scroll': 'scroll',
      'hero.arrow': 'this is zardy', 'hero.alt': 'Drawing of zardy wearing his brown monster-mouth hat',
      'stat.listeners': 'monthly listeners', 'stat.releases': 'releases', 'stat.songs': 'songs', 'stat.collabs': 'collabs', 'stat.since': 'since',
      'st.new': 'new!', 'st.listen': 'monthly',
      'new.label': 'new!', 'new.short': 'new!',
      ago: d => (d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`),
      with: 'with',
      tapeB: 'BEDROOM INDIE FROM MALAYSIA ✦ PUT YOUR HEADPHONES ON ✦ UNOFFICIAL FAN PAGE ✦ IT BE OKAY :) ✦ ザルディ',
      'stmt.label': 'manifesto', 'stmt.sign': '— a fan, from some other bedroom',
      stmt: 'zardy makes music {img:kidiused} from his bedroom in *Malaysia* {hat}. no label: just melancholic guitars {img:number1}, TikTok edits {img:bonus} and a hat with teeth. and *{crowd}* {img:contemplating} listen every month.',
      crowd: k => (k >= 500 ? 'over half a million people' : `over ${Math.floor(k)} thousand people`),
      'bio.h2': 'about him', 'bio.sub': 'what we know, nothing made up',
      'bio.p1': 'zardy is an independent artist from <mark>Malaysia</mark> who makes music <mark>straight from his bedroom</mark>, which is how he describes himself on the cover of “contemplating”. His sound lives between indie rock, alt rock and internet melancholy.',
      'bio.p2': 'His following grew mostly through TikTok fan edits in the “corecore” / “losercore” scene. In March 2026 he released <b>“baby steps.”</b>, his first album (9 songs, two with Pongus), and in July came <b>“it be okay”</b>, the song that brought in a ton of new listeners; so many that it got a bonus edition with sped up, slowed and instrumental versions.',
      'bio.p3': 'In September 2026 he put out <b>“contemplating”</b>, his second album: 11 songs featuring Luxii, hiroshimal and jaylu, plus a title in Malay, “bunga senja” (roughly “dusk flower”). In October he followed up with <b>“shower”</b>, together with Hyso.',
      'bio.note': 'heads-up: zardy doesn’t have a long official bio. Everything here comes from Spotify and from what he has published himself ✍️',
      'bio.collabs': 'credits — has worked with',
      'tl.title': 'diary', 'tl.sub': 'every release, in order', 'tl.hint': 'scroll →', 'tl.also': 'also in 2026 (no exact date):', 'tl.today': 'NOW', 'tl.next': 'what’s next? 👀', 'tl.year': 'year only',
      'facts.h2': 'by the numbers', 'facts.sub': 'counted by hand (ok, with JavaScript)',
      'f.longest': 'longest song', 'f.shortest': 'shortest song', 'f.collabs': 'collaborations', 'f.avg': 'average length', 'f.total': 'minutes of music', 'f.since': 'first release', 'f.noVersions': 'not counting versions',
      'f.across': n => `across ${n} songs with a known length`,
      'chart.title': 'releases per year', 'chart.note': '2026 went crazy 📈 · tap a year',
      'sound.h2': 'the sound', 'sound.sub': 'what zardy sounds like, in stickers',
      'sound.quote': 'for listening with headphones on, at night, <mark>staring at the ceiling</mark>.',
      tags: ['indie rock', 'alt rock', 'bedroom pop', 'corecore', 'losercore', 'melancholic', 'lo-fi', 'TikTok-core'],
      cassette: 'zardy — side A',
      'shuffle.title': 'not sure where to start?', 'shuffle.sub': 'turn the capsule machine and get a song',
      'shuffle.btn': 'turn the knob', 'shuffle.again': 'another capsule', 'shuffle.empty': 'I’ll pick a random song from his whole discography.',
      'shuffle.play': 'listen here', 'shuffle.open': 'open on Spotify', 'shuffle.search': 'search on Spotify', 'shuffle.release': 'see release',
      'album.h2': 'latest album', 'album.sub': 'start to finish', 'album.badge': 'album · out now',
      'album.play': 'listen here', 'album.open': 'open on Spotify', 'album.details': 'see details', 'album.debut': 'his debut was',
      albumNotes: { contemplating: 'The cover looks like a magazine: “ZARDY (ザルディ)” in giant letters plus a mini bio in English and Chinese. Inside: collabs with Luxii, hiroshimal and jaylu.' },
      albumFeats: who => `Featuring ${who.join(', ')}.`,
      'vinyl.hint': 'tap the record 💿', 'vinyl.aria': 'slide the record out of its sleeve',
      'gallery.h2': 'gallery', 'gallery.sub': 'covers and drawings on the desk', 'gallery.hint': 'drag the photos · tap one to view it', 'gallery.scatter': 'shuffle',
      'discog.h2': 'discography', 'discog.sub': 'tap a cover to see the songs',
      'filter.aria': 'filter discography', 'filter.all': 'all', 'filter.album': 'albums', 'filter.single': 'EPs & singles', 'filter.collab': 'collabs',
      'view.aria': 'view', 'view.grid': 'grid', 'view.list': 'list',
      discogSummary: (n, total) => (n === total ? `${total} releases` : `${n} of ${total} releases`),
      'dlg.play': 'listen here', 'dlg.open': 'open on Spotify', 'dlg.search': 'search on Spotify', 'dlg.tracklist': 'tracklist', 'dlg.noTracks': 'The tracklist is coming soon.', 'dlg.close': 'close',
      playTrack: 'play',
      'faq.h2': 'questions', 'faq.sub': 'the basics, no fluff',
      'faq.q1': 'Who is zardy?', 'faq.a1': 'An independent artist from Malaysia who makes indie / alt rock from his bedroom. His music grew through TikTok fan edits. He has two albums: “baby steps.” (March 2026) and “contemplating” (September 2026).',
      'faq.q2': 'Where do I start?', 'faq.a2': 'With “it be okay”: it’s the song that brought the most people in. For a full album, “contemplating” is the newest and “baby steps.” runs under 18 minutes. Or turn the capsule machine in “the sound”.',
      'faq.q3': 'What are corecore and losercore?', 'faq.a3': 'Internet labels. Corecore is an edit style that mixes clips to talk about emotions and online life; losercore is a melancholic aesthetic about feeling out of place. Here they describe the mood of his music.',
      'faq.q4': 'What’s with the hat?', 'faq.a4': 'The brown monster-mouth hat shows up in his profile picture and on almost every cover, so it’s the closest thing he has to a logo. That’s why it’s all over this page (yes, bottom right too… tap it).',
      'faq.q5': 'Does he play live?', 'faq.a5': 'No dates have been announced yet. If he announces some, they’ll show up in the “shows” section.',
      'faq.q6': 'Is this page official?', 'faq.a6': 'No. It’s an unofficial fan page; the data comes from Spotify and what the artist has published.',
      'shows.h2': 'shows', 'shows.sub': 'live dates, whenever there are any', 'shows.badge': 'live',
      'shows.title': 'no shows announced (yet)',
      'shows.body': 'zardy hasn’t announced any live dates. This section will update when he does. Meanwhile, this is how we picture it.',
      'shows.sceneAlt': 'Stick-figure drawing: zardy in his hat playing guitar for his fans, under a smiling sun',
      'scene.you': 'you →',
      'newsletter.h3': 'leave your email', 'newsletter.p': 'For heads-ups on new releases and shows. This is a fan demo: your email isn’t stored or sent anywhere.',
      'newsletter.aria': 'your email', 'newsletter.placeholder': 'you@email.com', 'newsletter.btn': 'join',
      'newsletter.thanks': 'done! (it’s a demo: nothing was actually sent)',
      'listen.h2': 'listen', 'listen.sub': 'verified profiles', 'listen.sub1': 'monthly listeners',
      'listen.search': 'also look for him on', 'listen.searchNote': 'these are searches, not verified profiles',
      'footer.made': 'made by a fan, by hand and with a lot of love', 'footer.disclaimer': 'unofficial fan page · data from Spotify', 'footer.top': 'back to top ↑', 'footer.cta': 'listen on Spotify →',
      'dock.aria': 'player', 'dock.now': 'now playing', 'dock.close': 'close player',
      'cursor.view': 'view', 'cursor.drag': 'drag',
      'mascot.aria': 'zardy’s hat (tap it)',
      mascot: c => [`have you heard “${c.album}” yet? 👀`, 'it be okay :)', 'ザルディ!', 'type “zardy” on your keyboard… 🤫', 'put your headphones on, seriously', `“${c.latest}” came out ${c.ago}`, 'nom nom 🦷', 'made in a bedroom in Malaysia 🛏️', 'drag the stickers up top 👆'],
      'mascot.night': 'shh… bedroom night mode 🌙', 'mascot.day': 'good morning! ☀️', 'mascot.play': 'hit play in the player ▶',
      egg: 'you found me! 🎉',
      kinds: { album: 'album', ep: 'EP', single: 'single', versions: 'versions' },
      single: 'song', plural: 'songs', releasesWord: 'releases'
    }
  };

  let lang = 'es';
  try { lang = localStorage.getItem('zardy-lang') || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en'); } catch (e) { /* sin storage */ }
  if (!T[lang]) lang = 'es';
  const L = k => T[lang][k];

  /* ================= HELPERS ================= */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sec = t => { if (!t) return 0; const [m, s] = t.split(':').map(Number); return m * 60 + s; };
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
  const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const byId = id => releases.find(r => r.id === id);
  const runtime = r => r.tracks.reduce((a, x) => a + sec(x.t), 0);
  const allTracks = () => releases.flatMap(r => r.tracks.map(x => ({ ...x, r })));
  const songs = () => allTracks().filter(x => x.r.kind !== 'versions' && x.n);
  const collabTracks = () => songs().filter(x => x.feat);
  const trackWord = n => (n === 1 ? L('single') : L('plural'));
  const dateOf = r => (r.date ? new Date(r.date + 'T12:00:00') : null);
  const fmtDate = (r, opts) => dateOf(r).toLocaleDateString(lang, opts);
  const daysSince = r => Math.max(0, Math.floor((Date.now() - dateOf(r)) / 864e5));
  const isNew = r => !!r.date && daysSince(r) <= 30;
  const fmtNum = (v, dec = 0) => Number(v).toLocaleString(lang, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const spotifyUrl = r => (r.album ? `https://open.spotify.com/album/${r.album}` : `https://open.spotify.com/search/${encodeURIComponent('zardy ' + r.title)}`);
  const trackUrl = x => (x.sp ? `https://open.spotify.com/track/${x.sp}` : spotifyUrl(x.r));
  const featTag = x => (x.feat ? ` <small>${L('with')} ${esc(x.feat)}</small>` : '');
  const latestDated = () => releases.find(r => r.date);
  const featured = () => releases.find(r => r.kind === 'album' && r.date) || releases.find(r => r.kind === 'album');
  const playPathOf = r => (r.tracks.length === 1 && r.tracks[0].sp ? 'track/' + r.tracks[0].sp : r.album ? 'album/' + r.album : null);
  const firstYear = () => Math.min(...releases.map(r => r.year));

  // ajusta el tamaño de letra para que una palabra larga quepa en una sola línea
  function fitText(el, max) {
    if (!el || !el.parentElement) return;
    el.style.fontSize = '';
    el.style.whiteSpace = 'nowrap';
    const cs = parseFloat(getComputedStyle(el).fontSize), avail = el.parentElement.clientWidth;
    const range = document.createRange(); range.selectNodeContents(el);
    const w = range.getBoundingClientRect().width;
    el.style.whiteSpace = '';
    const size = w && avail ? Math.min(max, cs * avail / w * .98) : 0;
    // si quedaría diminuta, mejor dejar que el título salte de línea
    if (size >= max * .42) el.style.fontSize = size + 'px';
  }

  function barcodeSVG(seed, w = 190, h = 46) {
    let x = 0, s = hash(seed) || 1, bars = '';
    while (x < w) {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      const bw = 1 + (s % 3), gap = 1 + ((s >>> 5) % 3);
      if (x + bw > w) break;
      bars += `<rect x="${x}" y="0" width="${bw}" height="${h}"/>`;
      x += bw + gap;
    }
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
  }

  /* ---------- portadas ---------- */
  // URL de Spotify → portada local de respaldo → portada dibujada (estilo cuaderno)
  const PAPERS = ['#f3ecdc', '#f7e27a', '#bfe3cf', '#f4c6c0', '#d5c8f0', '#e2d3b5'];
  function genCover(r) {
    const h = hash(r.title);
    return `<span class="cover gen" style="--g:${PAPERS[h % PAPERS.length]};--gr:${(h >> 3) % 9 - 6}deg"><span class="gen-title${r.title.length > 16 ? ' long' : ''}">${esc(r.title)}</span><svg class="gen-hat" aria-hidden="true"><use href="#sym-hat"/></svg><span class="gen-tag">zardy</span><i class="glare"></i></span>`;
  }
  function coverHTML(r) {
    const src = r.cover || r.local;
    if (!src) return genCover(r);
    const fb = r.cover && r.local ? ` data-fallback="${esc(r.local)}"` : '';
    return `<span class="cover"><img src="${esc(src)}"${fb} data-gen="${esc(r.id)}" alt="${esc(r.title)}" loading="lazy" decoding="async" draggable="false"><i class="glare"></i></span>`;
  }
  document.addEventListener('error', e => {
    const im = e.target;
    if (!(im instanceof HTMLImageElement) || !im.dataset.gen) return;
    if (im.dataset.fallback) { const f = im.dataset.fallback; delete im.dataset.fallback; im.src = f; return; }
    const r = byId(im.dataset.gen), holder = im.closest('.cover');
    if (r && holder) holder.outerHTML = genCover(r);
  }, true);

  /* ================= SCROLL SUAVE (Lenis) ================= */
  let lenis = null;
  if (window.Lenis && !reduce) {
    try {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      if (G) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; }
  }
  const scrollToEl = el => {
    if (lenis) lenis.scrollTo(el, { offset: -84, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  const lockScroll = on => { if (lenis) on ? lenis.stop() : lenis.start(); root.classList.toggle('no-scroll', on); };

  /* ================= PORTADA ================= */
  function renderHeroMeta() {
    $('#hero-issue').textContent = String(releases.length).padStart(2, '0');
    $('#hero-date').textContent = new Date().toLocaleDateString(lang, { month: 'short', year: 'numeric' }).toUpperCase();
  }

  // stickers alrededor de la foto (se pueden arrastrar)
  const stickerPos = {};
  function renderHeroStickers() {
    const r = latestDated(), x = (r && r.tracks[0]) || {}, path = r && playPathOf(r);
    const items = [
      { k: 'new', x: 6, y: 5, r: -12, d: 160, attrs: r ? (path ? `data-play="${path}" data-title="${esc(r.title)}" data-cursor="▶ play"` : `data-open="${esc(r.id)}"`) : '',
        html: r ? `<small>${L('st.new')}</small><b>${esc(r.title)}</b>${x.feat ? `<span>w/ ${esc(x.feat)}</span>` : ''}` : '' },
      { k: 'bar', x: 88, y: -3, r: 7, d: 260, html: barcodeSVG('zardy-vol15', 160, 40) + '<span>4 589 1209 0015</span>' },
      { k: 'hat', x: 57, y: -7, r: 14, d: 340, html: '<svg aria-hidden="true"><use href="#sym-hat"/></svg>' },
      { k: 'kana', x: -4, y: 42, r: -5, d: 420, html: 'ザルディ' },
      { k: 'listen', x: 102, y: 40, r: -9, d: 500, html: `<b>${fmtNum(DATA.listeners_k, 1)}K</b><span>${L('st.listen')}</span>` },
      { k: 'adv', x: 97, y: 80, r: 5, d: 580, html: '<div><b>BEDROOM</b><b>ADVISORY</b><span>made in a bedroom</span></div>' },
      { k: 'note', x: 64, y: 101, r: -4, d: 660, html: 'it be okay :)' }
    ].filter(s => s.html);
    $('#hero-stickers').innerHTML = items.map(s => {
      const p = stickerPos[s.k] || { x: s.x, y: s.y };
      return `<div class="stk-h st-${s.k}${stickerPos[s.k] ? ' settled' : ''}" data-k="${s.k}" style="--x:${p.x}%;--y:${p.y}%;--r:${s.r}deg;--d:${s.d}" ${s.attrs || `data-cursor="${L('cursor.drag')}"`}>${s.html}</div>`;
    }).join('');
  }
  function initStickerDrag() {
    const layer = $('#hero-stickers');
    let z = 10;
    layer.addEventListener('pointerdown', e => {
      const el = e.target.closest('.stk-h');
      if (!el || e.button !== 0) return;
      const box = layer.getBoundingClientRect(), sx = e.clientX, sy = e.clientY;
      const ox = parseFloat(el.style.getPropertyValue('--x')), oy = parseFloat(el.style.getPropertyValue('--y'));
      el._moved = false;
      el.setPointerCapture(e.pointerId);
      const mv = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!el._moved && Math.hypot(dx, dy) < 6) return;
        if (!el._moved) { el._moved = true; el.classList.add('drag', 'settled'); el.style.zIndex = ++z; }
        const nx = clamp(ox + dx / box.width * 100, -30, 130), ny = clamp(oy + dy / box.height * 100, -25, 125);
        el.style.setProperty('--x', nx + '%'); el.style.setProperty('--y', ny + '%');
        stickerPos[el.dataset.k] = { x: nx, y: ny };
      };
      const up = () => { el.classList.remove('drag'); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    // si se arrastró, no cuenta como clic
    layer.addEventListener('click', e => {
      const el = e.target.closest('.stk-h');
      if (el && el._moved) { el._moved = false; e.stopPropagation(); e.preventDefault(); }
    }, true);
  }

  // "ZARDY" a dos tintas: se ajusta al ancho y se deforma con el cursor
  const mega = $('#mega'), megaRed = $$('.mega-plate.red span', mega);
  const megaW = [112, 112, 112, 112, 112], megaG = [900, 900, 900, 900, 900];
  let megaTW = [...megaW], megaTG = [...megaG], plate = { x: 7, y: 5, tx: 7, ty: 5, rx: 7, ry: 5 }, heroVisible = true;
  function fitMega() {
    mega.style.fontSize = '100px';
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-variation-settings:"wdth" 125,"wght" 900';
    mega.appendChild(probe);
    let maxW = 0;
    for (const ch of 'ZARDY') { probe.textContent = ch; maxW = Math.max(maxW, probe.getBoundingClientRect().width); }
    probe.remove();
    const cell = (mega.clientWidth - 24) / 5;
    const fs = maxW ? Math.min(100 * cell * .98 / maxW, 440) : 200;
    mega.style.fontSize = fs + 'px';
    // desalineado de la tinta: proporcional al tamaño de la letra
    plate.rx = Math.max(2, fs * .024); plate.ry = Math.max(1.5, fs * .017);
    if (!finePointer || reduce) { plate.tx = plate.rx; plate.ty = plate.ry; }
    if (reduce) { mega.style.setProperty('--mx', plate.rx + 'px'); mega.style.setProperty('--my', plate.ry + 'px'); }
  }
  function megaPointer(e) {
    if (!heroVisible) return;
    const fs = parseFloat(mega.style.fontSize) || 200;
    megaRed.forEach((sp, i) => {
      const b = sp.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const t = clamp(1 - Math.hypot(e.clientX - cx, (e.clientY - cy) * 1.4) / (fs * 1.5), 0, 1);
      const k = t * t * (3 - 2 * t);
      megaTW[i] = 100 + 25 * k; megaTG[i] = 780 + 120 * k;
    });
    const mb = mega.getBoundingClientRect(), k2 = plate.rx / 7;
    plate.tx = clamp((e.clientX - (mb.left + mb.width / 2)) / mb.width * 22, -12, 12) * k2;
    plate.ty = clamp((e.clientY - (mb.top + mb.height / 2)) / innerHeight * 18, -9, 9) * k2;
  }
  if (finePointer && !reduce) {
    addEventListener('pointermove', megaPointer, { passive: true });
    $('#top').addEventListener('pointerleave', () => { megaTW = megaTW.map(() => 112); megaTG = megaTG.map(() => 900); plate.tx = plate.rx; plate.ty = plate.ry; });
  }
  mega.addEventListener('click', () => { chomp(); megaTW = megaTW.map(() => 125); setTimeout(() => { megaTW = megaTW.map(() => 112); }, 380); });

  /* ---------- números de la portada ---------- */
  const STATS = () => ({
    '#st-listeners': [DATA.listeners_k, 1, 'K'],
    '#st-releases': [releases.length, 0, ''],
    '#st-songs': [songs().length, 0, ''],
    '#st-collabs': [collabTracks().length, 0, ''],
    '#st-since': [firstYear(), 0, '', true]
  });
  let counted = false;
  function renderStats() {
    Object.entries(STATS()).forEach(([sel, [v, dec, suf, raw]]) => {
      const el = $(sel);
      Object.assign(el.dataset, { count: v, dec, suffix: suf, raw: raw ? '1' : '' });
      if (counted) el.textContent = raw ? String(v) : fmtNum(v, dec) + suf;
    });
  }
  function countUp(el) {
    const target = +el.dataset.count, dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '', raw = el.dataset.raw === '1', fmt = el.dataset.fmt;
    const from = raw ? Math.max(0, target - 25) : 0, dur = reduce ? 1 : 1400, t0 = performance.now();
    const show = v => (fmt === 'mmss' ? mmss(Math.round(v)) : raw ? String(Math.round(v)) : fmtNum(v, dec) + suf);
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = show(from + (target - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- cintas ---------- */
  const SPARK = '<svg aria-hidden="true"><use href="#sym-spark"/></svg>';
  function fillTrack(el, parts, copies = 6) {
    const one = parts.map(p => `<span>${esc(p)} ${SPARK}</span>`).join('');
    el.innerHTML = Array.from({ length: copies }, () => one).join('');
  }
  function renderTapes() {
    fillTrack($('#tape-a'), ['ZARDY', 'ザルディ', ...releases.filter(r => r.date).slice(0, 6).map(r => r.title.toUpperCase())]);
    fillTrack($('#tape-b'), L('tapeB').split(' ✦ '));
    fillTrack($('#thanks-track'), ['TERIMA KASIH', 'ありがとう', 'GRACIAS', 'THANK YOU', 'OBRIGADO', '谢谢', 'ザルディ'], 4);
    measureMarquees();
  }

  /* ================= MANIFIESTO ================= */
  let stmtTween = null;
  function renderStatement() {
    const src = L('stmt').replace('{crowd}', L('crowd')(DATA.listeners_k));
    let em = false, n = 0;
    $('#stmt').innerHTML = src.split(/\s+/).map(tok => {
      let m = tok.match(/^\{img:(\w+)\}([.,:;]?)$/);
      if (m) {
        const r = byId(m[1]), s = r && (r.cover || r.local);
        return s ? `<span class="wi stmt-img" style="--r:${n++ % 2 ? 5 : -5}deg"><img src="${esc(s)}" alt="" loading="lazy"></span>${m[2]}` : '';
      }
      m = tok.match(/^\{hat\}([.,:;]?)$/);
      if (m) return `<span class="wi"><svg class="stmt-hat" aria-hidden="true"><use href="#sym-hat"/></svg></span>${m[1]}`;
      let word = tok, close = false;
      if (word.startsWith('*')) { em = true; word = word.slice(1); }
      const e = word.match(/^(.*?)\*([.,:;]?)$/);
      if (e) { word = e[1] + e[2]; close = true; }
      const out = `<span class="w${em ? ' em' : ''}">${esc(word)}</span>`;
      if (close) em = false;
      return out;
    }).join(' ');
    setupStatementScrub();
  }
  function setupStatementScrub() {
    if (stmtTween) { stmtTween.scrollTrigger && stmtTween.scrollTrigger.kill(); stmtTween.kill(); stmtTween = null; }
    if (!G || reduce) return;
    stmtTween = gsap.fromTo($$('#stmt .w, #stmt .wi'), { opacity: .13 }, {
      opacity: 1, ease: 'none', stagger: .1,
      scrollTrigger: { trigger: '#stmt', start: 'top 85%', end: 'bottom 55%', scrub: .6 }
    });
  }

  /* ================= 01 SOBRE ================= */
  function renderCollabs() {
    const map = new Map();
    collabTracks().forEach(x => { if (!map.has(x.feat)) map.set(x.feat, []); map.get(x.feat).push(x); });
    $('#collab-list').innerHTML = [...map].map(([who, list]) =>
      `<li><button type="button" data-open="${esc(list[0].r.id)}"><b>${esc(who)}</b><i class="ld"></i><span>${list.map(x => esc(x.n)).join(' · ')}</span></button></li>`).join('');
  }

  /* ================= 02 DIARIO ================= */
  function renderDiary() {
    const datedYears = new Set(releases.filter(r => r.date).map(r => r.year));
    const items = releases.filter(r => r.date || !datedYears.has(r.year))
      .slice().sort((a, b) => a.year - b.year || (a.date || '').localeCompare(b.date || ''));
    const big = r => (r.date ? `${r.date.slice(8, 10)}.${r.date.slice(5, 7)}` : String(r.year));
    const small = r => (r.date ? fmtDate(r, { month: 'long', year: 'numeric' }) : L('tl.year'));
    $('#diary').innerHTML = items.map(r => `
      <li class="d-item">
        <button class="d-btn" type="button" data-open="${esc(r.id)}">
          <span class="d-date">${big(r)}<small>${esc(small(r))}</small></span>
          <span class="d-dot"></span>
          <span class="d-card" style="--r:${((hash(r.id) % 7) - 3) * .8}deg">${coverHTML(r)}<span class="d-title">${esc(r.title)}</span><span class="d-kind">${L('kinds')[r.kind]}${r.tracks.length ? ` · ${r.tracks.length} ${trackWord(r.tracks.length)}` : ''}</span></span>
        </button>
      </li>`).join('') +
      `<li class="d-item d-next"><span class="d-date">${L('tl.today')}<small>${new Date().toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })}</small></span><span class="d-dot"></span><span class="d-next-card">${L('tl.next')}</span></li>`;
    const also = releases.filter(r => !r.date && datedYears.has(r.year));
    $('#diary-also').innerHTML = also.map(r => `<button class="chip" type="button" data-open="${esc(r.id)}">${esc(r.title)}</button>`).join('');
    $('.diary-also').hidden = !also.length;
  }
  const hscroll = $('#hscroll'), hbar = $('#hbar');
  hscroll.addEventListener('scroll', () => {
    const max = hscroll.scrollWidth - hscroll.clientWidth;
    if (max > 0) hbar.style.setProperty('--p', hscroll.scrollLeft / max);
  }, { passive: true });

  /* ================= 03 NÚMEROS ================= */
  let selYear = null, factsCounted = false;
  function renderFacts() {
    const tr = songs().filter(x => x.t), sorted = [...tr].sort((a, b) => sec(a.t) - sec(b.t));
    const longest = sorted[sorted.length - 1], shortest = sorted[0];
    const collabs = collabTracks(), who = [...new Set(collabs.map(x => x.feat))];
    const total = tr.reduce((a, x) => a + sec(x.t), 0), avg = Math.round(total / tr.length);
    const first = releases.reduce((a, r) => (r.year <= a.year ? r : a));
    let no = 0;
    const card = (v, fmt, label, detail, id) => {
      const shown = fmt === 'mmss' ? mmss(v) : String(v);
      const inner = `<span class="f-no">Nº${String(++no).padStart(2, '0')}</span>${id ? '<span class="f-arrow" aria-hidden="true">↗</span>' : ''}<b data-count="${v}" data-fmt="${fmt}"${fmt === 'year' ? ' data-raw="1"' : ''}>${factsCounted ? shown : (fmt === 'mmss' ? '0:00' : fmt === 'year' ? String(v - 25) : '0')}</b><span>${label}</span><small>${esc(detail)}</small>`;
      return id ? `<button class="fact" type="button" data-open="${esc(id)}">${inner}</button>` : `<div class="fact">${inner}</div>`;
    };
    $('#facts').innerHTML =
      card(sec(longest.t), 'mmss', L('f.longest'), longest.n, longest.r.id) +
      card(sec(shortest.t), 'mmss', L('f.shortest'), shortest.n, shortest.r.id) +
      card(collabs.length, 'int', L('f.collabs'), `${L('with')} ${who.join(', ')}`, collabs[0] && collabs[0].r.id) +
      card(avg, 'mmss', L('f.avg'), L('f.noVersions')) +
      card(Math.round(total / 60), 'int', L('f.total'), L('f.across')(tr.length)) +
      card(first.year, 'year', L('f.since'), first.title, first.id);
    renderBars();
  }
  function renderBars() {
    const years = [...new Set(releases.map(r => r.year))].sort((a, b) => a - b);
    if (!selYear) selYear = years[years.length - 1];
    const counts = years.map(y => releases.filter(r => r.year === y).length), max = Math.max(...counts);
    $('#bars').innerHTML = years.map((y, i) =>
      `<button class="bar" type="button" data-year-pick="${y}" aria-pressed="${y === selYear}" aria-label="${y}: ${counts[i]} ${L('releasesWord')}"><b>${counts[i]}</b><i style="--h:${Math.round(14 + counts[i] / max * 150)}px"></i><span>${y}</span></button>`).join('');
    $('#year-chips').innerHTML = releases.filter(r => r.year === selYear)
      .map(r => `<button class="chip" type="button" data-open="${esc(r.id)}">${esc(r.title)}</button>`).join('');
  }

  /* ================= 04 SONIDO ================= */
  const STK = ['#f7e27a', '#bfe3cf', '#f4c6c0', '#d5c8f0', '#e2d3b5', '#fff8ec'];
  function renderTags() {
    $('#tag-cloud').innerHTML = L('tags').map((tg, i) =>
      `<span class="stk" style="--c:${STK[i % STK.length]};--r:${(hash(tg) % 11) - 5}deg">${esc(tg)}</span>`).join('');
    $('#cs-text').textContent = L('cassette');
  }

  // máquina de cápsulas (gashapon) con una canción al azar
  let lastPick = null, turns = 0, busy = false;
  const CAPS = ['#e2361f', '#7a4220', '#f2c230', '#7b52c9', '#3f8f6a'];
  function renderShuffle(pop) {
    const out = $('#shuffle-out');
    $('#shuffle-btn').textContent = '🎰 ' + L(lastPick ? 'shuffle.again' : 'shuffle.btn');
    if (!lastPick) { out.innerHTML = `<p class="muted">${L('shuffle.empty')}</p>`; return; }
    const x = lastPick, r = x.r;
    out.innerHTML = `
      <div class="${pop ? 'pick-pop' : ''}">
        <span class="pick">${esc(x.n)}</span>
        <span class="pick-meta">${esc(r.title)} · ${r.year}${x.t ? ' · ' + x.t : ''}${x.feat ? ` · ${L('with')} ${esc(x.feat)}` : ''}</span>
        <div class="row">
          ${x.sp ? `<button class="btn small" type="button" data-play="track/${x.sp}" data-title="${esc(x.n)}">▶ ${L('shuffle.play')}</button>` : ''}
          <a class="btn small ghost" href="${trackUrl(x)}" target="_blank" rel="noopener">${L(x.sp ? 'shuffle.open' : 'shuffle.search')} ↗</a>
          <button class="btn small ghost" type="button" data-open="${esc(r.id)}">${L('shuffle.release')}</button>
        </div>
      </div>`;
  }
  $('#shuffle-btn').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const all = songs();
    let p;
    do { p = all[Math.floor(Math.random() * all.length)]; } while (all.length > 1 && lastPick && p.n === lastPick.n);
    const g = $('#gacha');
    turns++;
    $('.g-knob', g).style.transform = `rotate(${turns * 360}deg)`;
    $('#g-cap').style.setProperty('--cap', CAPS[Math.floor(Math.random() * CAPS.length)]);
    g.classList.remove('drop', 'spin'); void g.offsetWidth; g.classList.add('spin');
    setTimeout(() => { g.classList.add('drop'); lastPick = p; renderShuffle(true); busy = false; }, reduce ? 0 : 650);
  });

  /* ================= 05 ÁLBUM ================= */
  function renderFeature() {
    const r = featured(); if (!r) return;
    $('#feature-cover').innerHTML = coverHTML(r);
    $('#feature-title').textContent = r.title;
    requestAnimationFrame(() => fitText($('#feature-title'), 104));
    const n = r.tracks.length, dur = runtime(r);
    $('#feature-meta').textContent = ['zardy', r.date ? fmtDate(r, { day: 'numeric', month: 'long', year: 'numeric' }) : r.year,
      `${n} ${trackWord(n)}`, dur ? mmss(dur) : ''].filter(Boolean).join(' · ');
    const who = [...new Set(r.tracks.filter(x => x.feat).map(x => x.feat))];
    $('#feature-note').textContent = L('albumNotes')[r.id] || (who.length ? L('albumFeats')(who) : '');
    $('#feature-actions').innerHTML =
      (r.album ? `<button class="btn" type="button" data-play="album/${r.album}" data-title="${esc(r.title)}" data-magnetic>▶ ${L('album.play')}</button>` : '') +
      `<a class="btn ghost" href="${spotifyUrl(r)}" target="_blank" rel="noopener">${L('album.open')} ↗</a>` +
      `<button class="btn ghost" type="button" data-open="${esc(r.id)}">${L('album.details')}</button>`;
    $('#feature-tracks').innerHTML = r.tracks.map((x, i) => `
      <li><span class="i">${String(i + 1).padStart(2, '0')}</span><span class="n">${esc(x.n)}${featTag(x)}</span><span class="t">${x.t || ''}</span>
      ${x.sp ? `<button class="mini-play" type="button" data-play="track/${x.sp}" data-title="${esc(x.n)}" aria-label="${L('playTrack')} ${esc(x.n)}">▶</button>` : ''}</li>`).join('');
    const others = releases.filter(x => x.kind === 'album' && x !== r), debut = others[others.length - 1];
    $('#feature-debut').innerHTML = debut
      ? `${L('album.debut')} <button class="link-btn" type="button" data-open="${esc(debut.id)}">${esc(debut.title)}</button> (${debut.year} · ${debut.tracks.length} ${trackWord(debut.tracks.length)})`
      : '';
    bindMagnetic($('#feature-actions'));
  }
  const sleeve = $('#sleeve');
  const toggleSleeve = () => { sleeve.classList.toggle('out'); sleeve.setAttribute('aria-pressed', String(sleeve.classList.contains('out'))); };
  sleeve.addEventListener('click', toggleSleeve);
  sleeve.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSleeve(); } });

  /* ================= 06 GALERÍA ================= */
  const lb = $('#lightbox');
  let wallSeed = 0;
  function initWall() {
    const wall = $('#wall');
    const photo = `<div class="polaroid" tabindex="0" role="button" data-photo="${esc(DATA.photo)}" aria-label="zardy"><div class="pic"><span class="cover"><img src="${esc(DATA.photo)}" alt="" draggable="false"></span></div><span class="cap">zardy ♡</span></div>`;
    wall.innerHTML = photo + releases.filter(r => r.cover || r.local).map(r =>
      `<div class="polaroid" tabindex="0" role="button" data-rel="${esc(r.id)}" aria-label="${esc(r.title)}"><div class="pic">${coverHTML(r)}</div><span class="cap">${esc(r.title)}</span></div>`).join('');
    $$('img', wall).forEach(im => { im.loading = 'eager'; });
    layoutWall();

    let z = 50;
    wall.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      const el = e.target.closest('.polaroid'); if (!el) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      el._moved = false; el.style.zIndex = ++z; el.classList.add('drag');
      const mv = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) > 5) el._moved = true;
        el.style.left = clamp(ox + dx, -20, wall.clientWidth - el.offsetWidth + 20) + 'px';
        el.style.top = clamp(oy + dy, -10, wall.clientHeight - el.offsetHeight + 10) + 'px';
      };
      const up = () => { el.classList.remove('drag'); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    const activate = el => {
      if (el.dataset.rel) return openRelease(el.dataset.rel);
      $('#lb-img').src = el.dataset.photo; $('#lb-cap').textContent = 'zardy ♡';
      lockScroll(true); lb.showModal();
    };
    wall.addEventListener('click', e => {
      const el = e.target.closest('.polaroid'); if (!el) return;
      if (el._moved) { el._moved = false; return; }
      activate(el);
    });
    wall.addEventListener('keydown', e => {
      const el = e.target.closest('.polaroid');
      if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); activate(el); }
    });
  }
  function layoutWall() {
    const wall = $('#wall'), W = wall.clientWidth;
    const cols = W < 560 ? 2 : W < 900 ? 3 : 4;
    const cellW = W / cols, iw = Math.min(210, cellW * .8);
    const items = $$('.polaroid', wall), rows = Math.ceil(items.length / cols), cellH = iw + 42 + 40;
    wall.style.height = rows * cellH + 60 + 'px';
    // con semilla 0 queda ordenado en cuadrícula; "desordenar" lo tira por toda la mesa
    const order = wallSeed ? items.map((_, i) => i).sort((a, b) => hash('o' + a + wallSeed) - hash('o' + b + wallSeed)) : items.map((_, i) => i);
    items.forEach((el, i) => {
      const slot = order[i], c = slot % cols, r = Math.floor(slot / cols), rnd = k => (hash('p' + i + k + wallSeed) % 1000) / 1000;
      const spread = wallSeed ? .5 : .16;
      el.style.width = iw + 'px';
      el.style.left = clamp(c * cellW + (cellW - iw) / 2 + (rnd('x') - .5) * cellW * spread, 6, W - iw - 6) + 'px';
      el.style.top = 44 + r * cellH + (rnd('y') - .3) * (wallSeed ? 60 : 18) + 'px';
      el.style.setProperty('--rot', ((rnd('r') - .5) * (wallSeed ? 30 : 16)).toFixed(1) + 'deg');
      el.style.setProperty('--tr', ((rnd('t') - .5) * 14).toFixed(1) + 'deg');
      el.style.zIndex = i + 1;
    });
  }
  $('#scatter-btn').addEventListener('click', () => {
    const wall = $('#wall');
    wallSeed++;
    wall.classList.add('scatter');
    layoutWall();
    setTimeout(() => wall.classList.remove('scatter'), 900);
  });
  lb.addEventListener('click', () => lb.close());
  lb.addEventListener('close', () => lockScroll(false));

  /* ================= 07 DISCOGRAFÍA ================= */
  let filter = 'all', view = 'grid';
  try { view = localStorage.getItem('zardy-view') === 'list' ? 'list' : 'grid'; } catch (e) { /* sin storage */ }
  const FILTERS = {
    all: () => true,
    album: r => r.kind === 'album',
    single: r => r.kind !== 'album',
    collab: r => r.tracks.some(x => x.feat)
  };
  function renderDiscog() {
    const grid = $('#rel-grid'), list = releases.filter(FILTERS[filter]);
    grid.dataset.view = view;
    if (view === 'list') {
      grid.innerHTML = list.map((r, i) => {
        const dur = r.tracks.length && r.tracks.every(x => x.t) ? mmss(runtime(r)) : '—';
        return `<button class="rel-row" type="button" data-open="${esc(r.id)}" style="--n:${i}">
          <span class="rr-no">${String(releases.indexOf(r) + 1).padStart(2, '0')}</span>
          <span class="rr-cover">${coverHTML(r)}</span>
          <span class="rr-title">${esc(r.title)}${isNew(r) ? `<small>${L('new.short')}</small>` : ''}</span>
          <span class="rr-kind">${L('kinds')[r.kind]}</span>
          <span class="rr-year">${r.year}</span>
          <span class="rr-n">♪ ${r.tracks.length || '—'}</span>
          <span class="rr-dur">${dur}</span>
          <span class="rr-arrow" aria-hidden="true">→</span>
        </button>`;
      }).join('');
    } else {
      grid.innerHTML = list.map((r, i) => `
        <button class="rel-card" type="button" data-open="${esc(r.id)}" style="--r:${((hash(r.id) % 7) - 3) * .7}deg;--n:${i}">
          ${isNew(r) ? `<span class="new-stk">${L('new.short')}</span>` : ''}
          <span class="rel-art"><span class="disc" aria-hidden="true"></span>${coverHTML(r)}</span>
          <span class="rel-title">${esc(r.title)}</span>
          <span class="rel-meta">${L('kinds')[r.kind]} · ${r.year}${r.tracks.length ? ' · ' + r.tracks.length + ' ' + trackWord(r.tracks.length) : ''}</span>
        </button>`).join('');
    }
    $('#disc-summary').textContent = L('discogSummary')(list.length, releases.length);
    $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    $$('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  }
  function initTilt() {
    if (reduce || !finePointer) return;
    const grid = $('#rel-grid');
    grid.addEventListener('pointermove', e => {
      const card = e.target.closest('.rel-card'); if (!card) return;
      const cv = $('.rel-art .cover', card); if (!cv) return;
      const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      cv.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(-6px)`;
      cv.style.setProperty('--gx', (x + .5) * 100 + '%'); cv.style.setProperty('--gy', (y + .5) * 100 + '%');
    });
    grid.addEventListener('pointerout', e => {
      const card = e.target.closest('.rel-card');
      if (card && !card.contains(e.relatedTarget)) { const cv = $('.rel-art .cover', card); if (cv) cv.style.transform = ''; }
    });
  }

  /* ---------- modal de lanzamiento ---------- */
  const dlg = $('#rel-dialog');
  let currentId = null;
  const iframeHTML = (path, h, title) =>
    `<iframe title="Spotify — ${esc(title || 'zardy')}" src="https://open.spotify.com/embed/${path}?utm_source=generator&amp;theme=0" height="${h}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
  function openRelease(id) {
    const r = byId(id); if (!r) return;
    currentId = id;
    const n = r.tracks.length, dur = n && r.tracks.every(x => x.t) ? runtime(r) : 0;
    const meta = [L('kinds')[r.kind], r.date ? fmtDate(r, { day: 'numeric', month: 'long', year: 'numeric' }) : r.year,
      n ? `${n} ${trackWord(n)}` : '', dur ? mmss(dur) : ''].filter(Boolean).join(' · ');
    const path = playPathOf(r);
    $('#dlg-body').innerHTML = `
      <div class="dlg-side">
        ${coverHTML(r)}
        <h3 id="dlg-title"${r.title.length > 18 ? ' class="long"' : ''}>${esc(r.title)}</h3>
        <p class="dlg-meta">${esc(meta)}</p>
        <div class="dlg-actions">
          ${path ? `<button class="btn" type="button" data-embed="${path}" data-title="${esc(r.title)}">▶ ${L('dlg.play')}</button>` : ''}
          <a class="btn ghost" href="${spotifyUrl(r)}" target="_blank" rel="noopener">${L(r.album ? 'dlg.open' : 'dlg.search')} ↗</a>
        </div>
      </div>
      <div class="dlg-main">
        <span class="mono-h">${L('dlg.tracklist')}</span>
        <ol class="dlg-tracks">${r.tracks.map((x, i) => `
          <li><span class="track-idx">${String(i + 1).padStart(2, '0')}</span><span class="track-name">${esc(x.n)}${featTag(x)}</span>
          ${x.sp ? `<button class="mini-play" type="button" data-embed="track/${x.sp}" data-title="${esc(x.n)}" aria-label="${L('playTrack')} ${esc(x.n)}">▶</button>` : ''}
          <span class="track-time">${x.t || '—'}</span></li>`).join('')}
        </ol>
        ${n ? '' : `<p class="dlg-empty">${L('dlg.noTracks')}</p>`}
        <div id="dlg-embed"></div>
      </div>`;
    if (!dlg.open) { lockScroll(true); dlg.showModal(); }
    if (r.title.length <= 18) fitText($('#dlg-title'), 40);
  }
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('#dlg-close')) return dlg.close();
    const em = e.target.closest('[data-embed]');
    if (!em) return;
    const p = em.dataset.embed;
    $('#dlg-embed').innerHTML = iframeHTML(p, p.startsWith('album') ? 352 : 152, em.dataset.title);
    $$('.mini-play', dlg).forEach(b => b.classList.toggle('on', b === em));
  });
  dlg.addEventListener('close', () => { $('#dlg-body').innerHTML = ''; currentId = null; lockScroll(false); });

  /* ================= REPRODUCTOR FLOTANTE ================= */
  const dock = $('#dock');
  let dockTimer;
  function dockPlay(path, title) {
    clearTimeout(dockTimer);
    $('#dock-embed').innerHTML = iframeHTML(path, path.startsWith('album') ? 152 : 80, title);
    $('#dock-title').textContent = title || 'zardy';
    dock.hidden = false; void dock.offsetWidth; dock.classList.add('on');
    document.body.classList.add('has-dock');
    mascot.classList.add('on');
    mascotSay(L('mascot.play'), 3000);
  }
  $('#dock-close').addEventListener('click', () => {
    dock.classList.remove('on');
    document.body.classList.remove('has-dock');
    dockTimer = setTimeout(() => { dock.hidden = true; $('#dock-embed').innerHTML = ''; }, 550);
  });

  /* ================= 10 ESCUCHA + PIE ================= */
  const ICONS = {
    spotify: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 18c9-3.5 18-3 26 1.5M13 25.5c7-2.5 15-2 21 1.5M15 32.5c6-1.8 11-1.4 16 1"/></svg>',
    tiktok: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 9v21.5a6.5 6.5 0 1 1-6.5-6.5M27 9c1 5 4.5 8.5 10 9"/></svg>'
  };
  function renderSocials() {
    $('#social-grid').innerHTML = DATA.socials.map(s => {
      const sub = s.name === 'spotify' ? `${fmtNum(DATA.listeners_k, 1)}K ${L('listen.sub1')}` : (s.handle || '');
      return `<a class="ticket" href="${esc(s.url)}" target="_blank" rel="noopener" data-cursor="${esc(s.name)} ↗">
        <span class="t-ico">${ICONS[s.name] || ''}</span>
        <span><span class="platform">${esc(s.name)}</span><span class="sub">${esc(sub)}</span></span>
        <span class="stub" aria-hidden="true"><span class="arrow">→</span><span class="adm">ADMIT ONE</span></span>
      </a>`;
    }).join('');
    $('#search-chips').innerHTML = DATA.searches.map(s =>
      `<a class="chip" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`).join('');
  }
  const SECTIONS = [['bio', '01'], ['diario', '02'], ['datos', '03'], ['sonido', '04'], ['album', '05'], ['galeria', '06'], ['discografia', '07'], ['faq', '08'], ['shows', '09'], ['escucha', '10']];
  function renderFooter() {
    const [y, m] = String(DATA.listeners_checked || '').split('-');
    const when = y && m ? new Date(+y, +m - 1, 15).toLocaleDateString(lang, { month: 'short', year: 'numeric' }) : '';
    $('#foot-disclaimer').textContent = L('footer.disclaimer') + (when ? ` (${when})` : '');
    $('#foot-index').innerHTML = SECTIONS.map(([id, no]) => `<a href="#${id}"><i>${no}</i>${esc(L('hud')[no])}</a>`).join('');
    $('#foot-barcode').innerHTML = barcodeSVG('zardy-footer') + '<span>ZARDY · VOL.15</span>';
  }
  function fitFootMega() {
    const el = $('#foot-mega'), sp = $('span', el);
    el.style.fontSize = '100px';
    const w = sp.getBoundingClientRect().width;
    if (w) el.style.fontSize = Math.min(100 * (el.clientWidth - 16) / w, 460) + 'px';
  }

  /* ================= MENÚ (móvil / tablet) ================= */
  const menu = $('#menu'), menuBtn = $('#menu-btn');
  let menuTimer;
  function renderMenu() {
    $('#menu-links').innerHTML = $$('.nav-links a').map((a, i) =>
      `<a href="${a.getAttribute('href')}" style="--i:${i}"><i>${a.querySelector('i').textContent}</i>${esc(L(a.querySelector('span').dataset.i18n))}</a>`).join('');
  }
  function openMenu() {
    clearTimeout(menuTimer);
    menu.hidden = false; void menu.offsetWidth; menu.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true'); lockScroll(true); root.classList.add('menu-open');
    $('#nav').classList.remove('hide');
  }
  function closeMenu() {
    if (!menu.classList.contains('open')) return;
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false'); lockScroll(false); root.classList.remove('menu-open');
    menuTimer = setTimeout(() => { menu.hidden = true; }, 760);
  }
  menuBtn.addEventListener('click', () => (menu.classList.contains('open') ? closeMenu() : openMenu()));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ================= LA MASCOTA ================= */
  const mascot = $('#mascot'), bubble = $('#bubble');
  let bubbleTimer, lastLine = -1;
  function chomp() { mascot.classList.remove('chomp'); void mascot.offsetWidth; mascot.classList.add('chomp'); }
  function mascotSay(text, ms = 3800) {
    bubble.textContent = text;
    bubble.classList.add('show'); mascot.classList.add('talking');
    chomp();
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.classList.remove('show'); mascot.classList.remove('talking'); }, ms);
  }
  function mascotLines() {
    const n = latestDated(), a = featured();
    return L('mascot')({ latest: n ? n.title : 'zardy', ago: n ? L('ago')(daysSince(n)) : '', album: a ? a.title : 'zardy' });
  }
  $('#mascot-btn').addEventListener('click', () => {
    const lines = mascotLines();
    let i;
    do { i = Math.floor(Math.random() * lines.length); } while (lines.length > 1 && i === lastLine);
    lastLine = i;
    mascotSay(lines[i]);
  });
  const eyes = $('.m-eyes'), mascotBtn = $('#mascot-btn');
  let eyeRaf = 0;
  if (finePointer && !reduce) {
    addEventListener('pointermove', e => {
      if (eyeRaf || !mascot.classList.contains('on')) return;
      eyeRaf = requestAnimationFrame(() => {
        eyeRaf = 0;
        const b = mascotBtn.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height * .3);
        const d = Math.hypot(dx, dy) || 1;
        eyes.setAttribute('transform', `translate(${(dx / d * 2.6).toFixed(2)} ${(dy / d * 2.6).toFixed(2)})`);
      });
    }, { passive: true });
  }

  // easter egg: escribe "zardy"
  let typed = '';
  addEventListener('keydown', e => {
    if ((e.target.closest && e.target.closest('input, textarea')) || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-5);
    if (typed === 'zardy') { typed = ''; hatRain(); mascot.classList.add('on'); mascotSay(L('egg'), 4500); }
  });
  function hatRain() {
    if (reduce) return;
    const box = document.createElement('div');
    box.className = 'rain'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = Array.from({ length: 36 }, () => {
      const s = 26 + Math.random() * 50;
      return `<svg style="left:${(Math.random() * 100).toFixed(1)}vw;width:${s.toFixed(0)}px;height:${(s * .93).toFixed(0)}px;--dur:${(2.2 + Math.random() * 2).toFixed(2)}s;--delay:${(Math.random() * .9).toFixed(2)}s;--rot:${Math.round(Math.random() * 720 - 360)}deg"><use href="#sym-hat"/></svg>`;
    }).join('');
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 5600);
  }

  /* ================= TEMA (luz del cuarto) ================= */
  const themeBtn = $('#theme-btn');
  function syncThemeUI() {
    const night = root.dataset.theme === 'night';
    themeBtn.setAttribute('aria-pressed', String(night));
    themeBtn.setAttribute('aria-label', L(night ? 'theme.toDay' : 'theme.toNight'));
    themeBtn.title = themeBtn.getAttribute('aria-label');
    $('meta[name="theme-color"]').setAttribute('content', night ? '#0f0c0a' : '#efe8d8');
  }
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'night' ? 'day' : 'night';
    root.dataset.theme = next;
    try { localStorage.setItem('zardy-theme', next); } catch (e) { /* sin storage */ }
    syncThemeUI();
    mascot.classList.add('on');
    mascotSay(L(next === 'night' ? 'mascot.night' : 'mascot.day'), 2600);
  });

  /* ================= TÍTULOS: letra por letra ================= */
  const SCRIB = '<svg class="scrib" viewBox="0 0 300 24" aria-hidden="true"><path pathLength="1" d="M3 15C40 6 70 20 110 12S190 5 230 13 280 16 297 9"/></svg>';
  $$('.sh-title').forEach(h => h.insertAdjacentHTML('beforeend', SCRIB));
  function splitTitles() {
    $$('.sh-title > span[data-i18n]').forEach(sp => {
      const text = sp.textContent;
      let i = 0;
      sp.innerHTML = text.split(' ').map(w => `<span class="w">${[...w].map(c => `<span class="ch" style="--i:${i++}">${esc(c)}</span>`).join('')}</span>`).join(' ');
      sp.setAttribute('aria-hidden', 'true');
      sp.closest('h2').setAttribute('aria-label', text);
    });
  }

  // texto que se "revuelve" con katakana al pasar el cursor
  const POOL = 'ザルディアイウエオカキクケコ#%&*01';
  function scramble(el, final) {
    if (el._scr || reduce) return;
    el._scr = true;
    let f = 0;
    const total = 16;
    const step = () => {
      f++;
      el.textContent = [...final].map((c, i) => (c === ' ' || i < (f / total) * final.length ? c : POOL[Math.floor(Math.random() * POOL.length)])).join('');
      if (f < total) requestAnimationFrame(step); else { el.textContent = final; el._scr = false; }
    };
    requestAnimationFrame(step);
  }
  $$('.nav-links a').forEach(a => a.addEventListener('mouseenter', () => { const sp = $('span', a); scramble(sp, L(sp.dataset.i18n)); }));

  /* ================= IDIOMA ================= */
  function applyLang() {
    root.lang = lang;
    $$('[data-i18n]').forEach(el => { const v = L(el.dataset.i18n); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = L(el.dataset.i18nPlaceholder) || ''; });
    $$('[data-i18n-aria]').forEach(el => { const v = L(el.dataset.i18nAria); if (typeof v === 'string') el.setAttribute('aria-label', v); });
    $$('[data-i18n-alt]').forEach(el => { const v = L(el.dataset.i18nAlt); if (v) el.alt = v; });
    $('#btn-es').classList.toggle('active', lang === 'es');
    $('#btn-en').classList.toggle('active', lang === 'en');
    $('#btn-es').setAttribute('aria-pressed', String(lang === 'es'));
    $('#btn-en').setAttribute('aria-pressed', String(lang === 'en'));
    $('#sc-you').textContent = L('scene.you');
    splitTitles();
    renderHeroMeta(); renderHeroStickers(); renderTapes(); renderStats(); renderStatement(); renderCollabs(); renderDiary();
    renderFacts(); renderTags(); renderShuffle(); renderFeature(); renderDiscog(); renderSocials(); renderFooter(); renderMenu();
    syncThemeUI(); tickClock(); updateHud();
    if (currentId) openRelease(currentId);
    if (G) requestAnimationFrame(() => ScrollTrigger.refresh());
  }
  function setLang(l) { lang = l; try { localStorage.setItem('zardy-lang', l); } catch (e) { /* sin storage */ } applyLang(); }
  $('#btn-es').addEventListener('click', () => setLang('es'));
  $('#btn-en').addEventListener('click', () => setLang('en'));

  /* ================= RELOJ DE MALASIA + HUD ================= */
  const MYT = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  function tickClock() {
    let s;
    try { s = MYT.format(new Date()); } catch (e) { return; }
    const h = parseInt(s, 10) % 24;
    $('#hud-clock').textContent = 'MYT ' + s;
    $('#menu-clock').textContent = 'MYT ' + s;
    $('#hero-time').innerHTML = `MYT ${s.slice(0, 5)}<span class="mood"> · ${esc(L('mood')(h))}</span>`;
  }
  setInterval(tickClock, 1000);
  let hudKey = 'portada';
  function updateHud() {
    const label = L('hud')[hudKey] || '';
    $('#hud-sec').textContent = `§${/^\d+$/.test(hudKey) ? hudKey : '··'} ${label}`;
  }

  /* ================= cursor + botones magnéticos ================= */
  const cursor = $('#cursor'), cursorLabel = $('#cursor-label');
  const cur = { x: -100, y: -100, tx: -100, ty: -100 };
  if (finePointer && !reduce) {
    addEventListener('pointermove', e => { cur.tx = e.clientX; cur.ty = e.clientY; cursor.classList.add('on'); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('on'));
    addEventListener('pointerdown', () => cursor.classList.add('down'));
    addEventListener('pointerup', () => cursor.classList.remove('down'));
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], [data-play], .polaroid, .stk-h, .rel-card, .rel-row, .d-btn, button.fact, a, button, summary, [role="button"], input');
      let label = '';
      if (t) {
        if (t.dataset.cursor) label = t.dataset.cursor;
        else if (t.matches('[data-play]')) label = '▶ play';
        else if (t.matches('.polaroid, .stk-h')) label = L('cursor.drag');
        else if (t.matches('.rel-card, .rel-row, .d-btn, button.fact')) label = L('cursor.view');
      }
      cursorLabel.textContent = label;
      cursor.classList.toggle('label', !!label);
      cursor.classList.toggle('hover', !!t && !label && !(t.matches && t.matches('input')));
    });
  }
  function bindMagnetic(scope = document) {
    if (!finePointer || reduce) return;
    $$('[data-magnetic]', scope).forEach(el => {
      if (el._mag) return;
      el._mag = true;
      el.addEventListener('pointermove', e => {
        const b = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - b.left - b.width / 2) * .22).toFixed(1)}px ${((e.clientY - b.top - b.height / 2) * .32).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = '0 0'; });
    });
  }

  /* ================= MOTOR: cintas, badge, tinta, cursor ================= */
  const marquees = $$('[data-marquee]').map(el => ({ el, dir: +el.dataset.marquee || 1, x: 0, w: 0, vis: true }));
  function measureMarquees() { marquees.forEach(m => { m.w = m.el.scrollWidth / 2; }); }
  const visIO = new IntersectionObserver(entries => entries.forEach(en => {
    marquees.forEach(m => { if (en.target.contains(m.el)) m.vis = en.isIntersecting; });
  }));
  marquees.forEach(m => visIO.observe(m.el.parentElement));
  const tapesEl = $('.tapes'), badgeRing = $('.badge-ring');
  let lastT = performance.now(), lastY = scrollY, vel = 0, skew = 0, badgeRot = 0, idle = 0;
  function frame(now) {
    const dt = Math.min(64, now - lastT) / 1000;
    lastT = now;
    const y = scrollY, dy = y - lastY;
    lastY = y;
    vel += (dy - vel) * .18;
    const boost = Math.min(Math.abs(vel), 60);
    if (!reduce) {
      marquees.forEach(m => {
        if (!m.w || !m.vis) return;
        m.x -= (70 + boost * 22) * dt * m.dir;
        if (m.x <= -m.w) m.x += m.w;
        if (m.x > 0) m.x -= m.w;
        m.el.style.transform = `translate3d(${m.x.toFixed(1)}px,0,0)`;
      });
      const ns = skew + (clamp(vel * .4, -9, 9) - skew) * .14;
      if (Math.abs(ns - skew) > .005) { skew = ns; tapesEl.style.setProperty('--skew', skew.toFixed(2) + 'deg'); }
      if (heroVisible) {
        badgeRot += (16 + boost * 7) * dt;
        badgeRing.style.setProperty('--rot', (badgeRot % 360).toFixed(1) + 'deg');
      }
      if (heroVisible) {
        if (!finePointer) { idle += dt; megaTW = megaTW.map((_, i) => 108 + 14 * Math.sin(idle * 1.3 + i * .9)); }
        // solo se escribe cuando algo cambió de verdad (cambiar el ancho de letra obliga a recalcular el texto)
        for (let i = 0; i < 5; i++) {
          const dw = megaTW[i] - megaW[i], dg = megaTG[i] - megaG[i];
          if (Math.abs(dw) > .15 || Math.abs(dg) > 1) {
            megaW[i] += dw * .14; megaG[i] += dg * .14;
            mega.style.setProperty('--w' + i, megaW[i].toFixed(1));
            mega.style.setProperty('--g' + i, megaG[i].toFixed(0));
          }
        }
        const dx = plate.tx - plate.x, dyp = plate.ty - plate.y;
        if (Math.abs(dx) > .02 || Math.abs(dyp) > .02) {
          plate.x += dx * .1; plate.y += dyp * .1;
          mega.style.setProperty('--mx', plate.x.toFixed(2) + 'px');
          mega.style.setProperty('--my', plate.y.toFixed(2) + 'px');
        }
      }
      if (cursor.classList.contains('on') && (Math.abs(cur.tx - cur.x) > .1 || Math.abs(cur.ty - cur.y) > .1)) {
        cur.x += (cur.tx - cur.x) * .22; cur.y += (cur.ty - cur.y) * .22;
        cursor.style.transform = `translate3d(${cur.x.toFixed(1)}px,${cur.y.toFixed(1)}px,0)`;
      }
    }
    requestAnimationFrame(frame);
  }
  for (let i = 0; i < 5; i++) { mega.style.setProperty('--w' + i, 112); mega.style.setProperty('--g' + i, 900); }

  /* ================= SCROLL: progreso, nav, menú activo, aparecer ================= */
  const nav = $('#nav'), bar = $('#progress i'), navLinks = $$('[data-nav]');
  let ticking = false, prevY = scrollY;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const h = root, max = h.scrollHeight - h.clientHeight, y = scrollY;
      const p = max > 0 ? y / max : 0;
      bar.style.width = (p * 100) + '%';
      $('#hud-pct').textContent = String(Math.round(p * 100)).padStart(3, '0') + '%';
      if (y > innerHeight * .6) mascot.classList.add('on');
      const dy = y - prevY;
      prevY = y;
      if (!menu.classList.contains('open')) {
        if (y > 420 && dy > 6) nav.classList.add('hide');
        else if (dy < -6 || y < 200) nav.classList.remove('hide');
      }
      if (max > 0 && y >= max - 4) navLinks.forEach((l, i) => l.classList.toggle('active', i === navLinks.length - 1));
      else if (y < innerHeight * .5) navLinks.forEach(l => l.classList.remove('active'));
    });
  }
  addEventListener('scroll', onScroll, { passive: true });

  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-visible');
    if (en.target.id === 'facts' && !factsCounted) { factsCounted = true; $$('#facts b[data-count]').forEach(countUp); }
    io.unobserve(en.target);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    hudKey = en.target.dataset.hud || hudKey;
    updateHud();
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('[data-hud]').forEach(s => spy.observe(s));

  new IntersectionObserver(entries => entries.forEach(en => { heroVisible = en.isIntersecting; }), { threshold: 0 }).observe($('#top'));

  /* ================= newsletter (demo) ================= */
  $('#newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    $('#newsletter-msg').textContent = L('newsletter.thanks');
    e.target.reset();
  });

  /* ================= clicks globales ================= */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && !a.classList.contains('skip')) {
      const id = a.getAttribute('href'), target = id.length > 1 && document.querySelector(id);
      if (target) { e.preventDefault(); closeMenu(); scrollToEl(target); return; }
    }
    const play = e.target.closest('[data-play]');
    if (play && !dlg.contains(play)) { dockPlay(play.dataset.play, play.dataset.title); return; }
    const o = e.target.closest('[data-open]');
    if (o && !dlg.contains(o)) { openRelease(o.dataset.open); return; }
    const f = e.target.closest('[data-filter]');
    if (f) { filter = f.dataset.filter; renderDiscog(); return; }
    const v = e.target.closest('[data-view]');
    if (v) { view = v.dataset.view; try { localStorage.setItem('zardy-view', view); } catch (err) { /* sin storage */ } renderDiscog(); return; }
    const yb = e.target.closest('[data-year-pick]');
    if (yb) { selYear = +yb.dataset.yearPick; renderBars(); }
  });

  /* ================= ANIMACIONES CON SCROLL (GSAP) ================= */
  function setupScrollFx() {
    if (!G) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      // diario: scroll horizontal anclado
      root.classList.add('has-pin');
      const track = $('#diary');
      const dist = () => Math.max(0, track.scrollWidth - hscroll.clientWidth);
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: hscroll, start: 'center 55%', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true,
          onUpdate: s => hbar.style.setProperty('--p', s.progress.toFixed(4))
        }
      });
      // portada con capas a distinta velocidad
      const heroST = { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-art', { yPercent: -14, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero-copy', { yPercent: -10, ease: 'none', scrollTrigger: { ...heroST } });
      gsap.to('#mega', { yPercent: 16, ease: 'none', scrollTrigger: { ...heroST } });
      // el ZARDY del pie sube desde abajo
      gsap.fromTo('#foot-mega', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      // el cassette gira un poco con el scroll
      gsap.fromTo('.cassette', { rotate: -14 }, { rotate: 4, ease: 'none', scrollTrigger: { trigger: '#sonido', start: 'top bottom', end: 'bottom top', scrub: true } });
      return () => { root.classList.remove('has-pin'); gsap.set(track, { x: 0 }); };
    });
  }

  /* ================= LOADER ================= */
  function onReady() {
    if (counted) return;
    counted = true;
    document.body.classList.add('ready');
    $$('.spec [data-count]').forEach(countUp);
    setTimeout(() => $$('.stk-h').forEach(s => s.classList.add('settled')), 1400);
    if (G) ScrollTrigger.refresh();
  }
  function runLoader() {
    const ld = $('#loader');
    let seen = false;
    try { seen = sessionStorage.getItem('zardy-intro') === '1'; } catch (e) { /* sin storage */ }
    if (!ld || reduce || seen) { if (ld) ld.remove(); return onReady(); }
    try { sessionStorage.setItem('zardy-intro', '1'); } catch (e) { /* sin storage */ }
    lockScroll(true);
    const num = $('#ld-num'), lbar = $('#ld-bar'), t0 = performance.now(), DUR = 1700;
    let done = false;
    const step = now => {
      if (done) return;
      const p = Math.min(1, (now - t0) / DUR), e = 1 - Math.pow(1 - p, 3);
      num.textContent = String(Math.round(e * 100)).padStart(3, '0');
      lbar.style.transform = `scaleX(${e})`;
      if (p < 1) requestAnimationFrame(step); else setTimeout(end, 260);
    };
    requestAnimationFrame(step);
    function end() {
      if (done) return;
      done = true;
      num.textContent = '100';
      ld.classList.add('out');
      lockScroll(false);
      setTimeout(onReady, 280);
      setTimeout(() => ld.remove(), 1200);
    }
    ld.addEventListener('click', end);
    addEventListener('keydown', end, { once: true });
    setTimeout(end, 4200);
  }

  /* ================= INIT ================= */
  initWall();
  initTilt();
  initStickerDrag();
  applyLang();
  bindMagnetic();
  fitMega();
  fitFootMega();
  measureMarquees();
  setupScrollFx();
  onScroll();
  requestAnimationFrame(frame);
  runLoader();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitMega(); fitFootMega(); measureMarquees(); layoutWall(); fitText($('#feature-title'), 104); if (G) ScrollTrigger.refresh(); });
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fitMega(); fitFootMega(); measureMarquees(); layoutWall(); fitText($('#feature-title'), 104); }, 150); });
  window.zardy = { lenis, refresh: () => G && ScrollTrigger.refresh() };
})();
