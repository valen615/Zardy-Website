(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const G = !!(window.gsap && window.ScrollTrigger);
  if (G) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }

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
      'skip': 'saltar al contenido', 'intro.skip': 'toca para entrar', 'menu.open': 'índice',
      'nav.bio': 'sobre', 'nav.diary': 'diario', 'nav.sound': 'sonido', 'nav.album': 'álbum', 'nav.gallery': 'galería', 'nav.discog': 'discografía', 'nav.shows': 'shows', 'nav.listen': 'escucha',
      'nav.songs': 'canciones', 'nav.collabs': 'colabs', 'nav.malaysia': 'malasia', 'nav.fan': 'fan zone', 'nav.numbers': 'números', 'nav.faq': 'preguntas',
      hud: { portada: 'portada', estreno: 'estreno', manifiesto: 'manifiesto', fin: 'fin' },
      'drop.label': 'estreno', 'drop.play': 'escuchar ahora',
      'drop.note': (by, feats) => (by ? `Una colaboración nueva: ${by} × zardy. Dale play antes que nadie.` : feats.length ? `Con ${feats.join(', ')}.` : 'Lo último de zardy, recién salido del cuarto.'),
      'songs.h2': 'todas las canciones', 'songs.sub': 'su discografía entera, convertida en una onda',
      'songs.hint': 'pasa el cursor por la onda · toca una barra para escucharla',
      'songs.total': (n, m) => `${n} canciones · ${m} minutos de música`,
      'songs.q': 'buscar canción, disco o colab…', 'songs.aria': 'ordenar canciones',
      'songs.sortDate': 'recientes', 'songs.sortAz': 'a–z', 'songs.sortLen': 'duración',
      'songs.count': (n, t) => (n === t ? `${t} canciones` : `${n} de ${t}`), 'songs.none': 'nada por aquí… prueba con otra palabra',
      'collabs.h2': 'colabs', 'collabs.sub': 'con quién ha hecho canciones (según Spotify)', 'collabs.songs': n => (n === 1 ? '1 canción' : `${n} canciones`),
      'mal.h2': 'su cuarto, ahora', 'mal.sub': 'la hora en Malasia, en vivo', 'mal.tz': 'MYT · UTC+8 · en vivo', 'mal.now': 'en Malasia son las', 'mal.here': 'donde estás tú:',
      'mal.diff': d => (d === 0 ? 'Es la misma hora que donde estás tú.' : `Malasia va ${fmtH(d)} ${d > 0 ? 'por delante' : 'por detrás'} de ti.`),
      'mal.sky': { night: 'de noche: hora perfecta para “it be okay” 🌙', dawn: 'amaneciendo en Malasia 🌄', day: 'de día en Malasia ☀️', dusk: 'atardecer en Malasia, como “bunga senja” 🌅' },
      'fan.h2': 'haz tu portada', 'fan.sub': 'arma tu propio póster de zardy y descárgalo', 'fan.alt': 'vista previa del póster',
      'fan.style': 'estilo', 'fan.styles': { riso: 'riso', note: 'cuaderno', mag: 'revista' }, 'fan.paper': 'papel', 'fan.ink': 'tinta', 'fan.song': 'canción',
      'fan.name': 'tu nombre', 'fan.namePh': 'tu nombre (opcional)', 'fan.shuffle': 'al azar', 'fan.download': 'descargar PNG',
      'fan.note': 'Se genera en tu navegador: no se sube nada a ningún lado.', 'fan.saved': '¡descargado! cuélgalo en tu pared 📌', 'fan.madeBy': 'hecho por', 'fan.edition': 'FAN EDITION',
      'hunt.aria': 'gorro escondido', 'hunt.found': (n, t) => `¡gorro ${n}/${t}! sigue buscando 🎩`, 'hunt.done': '¡encontraste los 5 gorros! fan certificado 🏆',
      mood: h => (h < 5 ? 'madrugada en Malasia 🌙' : h < 12 ? 'mañana en Malasia ☀️' : h < 19 ? 'tarde en Malasia' : 'noche en Malasia 🌙'),
      'theme.toNight': 'apagar la luz', 'theme.toDay': 'encender la luz',
      'hero.kicker': 'bedroom indie · alt rock · desde Malasia',
      'hero.line': 'Canciones hechas en su cuarto, entre el indie rock y el alt rock: crudas, melancólicas y directas. Su música viajó por los edits de TikTok antes que por cualquier discográfica.',
      'hero.cta1': 'escuchar en Spotify', 'hero.cta2': 'ver discografía', 'hero.scroll': 'baja',
      'hero.arrow': 'este es zardy', 'hero.alt': 'Dibujo de zardy con su gorro marrón con boca de monstruo',
      'stat.listeners': 'oyentes al mes', 'stat.releases': 'lanzamientos', 'stat.songs': 'canciones', 'stat.collabs': 'colaboraciones', 'stat.since': 'desde',
      'st.new': '¡nuevo!', 'st.listen': 'al mes',
      'new.label': '¡nuevo!', 'new.short': '¡nuevo!',
      ago: d => (d < 0 ? 'recién salida' : d === 0 ? 'hoy' : d === 1 ? 'ayer' : `hace ${d} días`),
      with: 'con',
      tapeB: 'BEDROOM INDIE DESDE MALASIA ✦ PONTE AUDÍFONOS ✦ FAN PAGE NO OFICIAL ✦ IT BE OKAY :) ✦ ザルディ',
      'stmt.label': 'manifiesto', 'stmt.sign': '— un fan, desde algún otro cuarto',
      stmt: 'zardy hace música {img:kidiused} desde su cuarto en *Malasia* {hat}. sin discográfica: solo guitarras melancólicas {img:number1}, edits de TikTok {img:bonus} y un gorro con dientes. y *{crowd}* {img:contemplating} lo escuchan cada mes.',
      crowd: k => (k >= 500 ? 'más de medio millón de personas' : `más de ${Math.floor(k)} mil personas`),
      'bio.h2': 'sobre él', 'bio.sub': 'lo que se sabe, sin inventar nada',
      'bio.p1': 'zardy es un artista independiente de <mark>Malasia</mark> que hace música <mark>desde su cuarto</mark>: así se presenta él mismo en la portada de “contemplating”. Su sonido vive entre el indie rock, el alt rock y la melancolía de internet.',
      'bio.p2': 'Su perfil creció sobre todo gracias a fan-edits de TikTok en la escena “corecore” / “losercore”. En marzo de 2026 sacó <b>“baby steps.”</b>, su primer álbum (9 canciones, dos con Pongus), y en julio llegó <b>“it be okay”</b>, la canción que le trajo muchísima gente nueva; tanta, que tuvo edición bonus con versiones sped up, slowed e instrumental.',
      'bio.p3': 'En septiembre de 2026 publicó <b>“contemplating”</b>, su segundo álbum: 11 canciones con Luxii, hiroshimal y jaylu, y hasta un título en malayo, “bunga senja” (algo así como “flor del atardecer”). En octubre siguió con <b>“shower”</b>, junto a Hyso, y <b>“Haze”</b>, una colaboración con zyun.',
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
      mascot: c => [`¿ya escuchaste “${c.album}”? 👀`, 'it be okay :)', 'ザルディ！', 'escribe “zardy” con el teclado… 🤫', 'ponte audífonos, en serio', `“${c.latest}” salió ${c.ago}`, 'ñam ñam 🦷', 'hecho en un cuarto en Malasia 🛏️', 'arrastra los stickers de arriba 👆', 'hay gorros escondidos por la página 👀', 'haz tu propio póster en la fan zone 🎨'],
      'mascot.night': 'shh… modo cuarto de noche 🌙', 'mascot.day': '¡buenos días! ☀️', 'mascot.play': 'dale play en el reproductor ▶',
      egg: '¡me encontraste! 🎉',
      kinds: { album: 'álbum', ep: 'EP', single: 'sencillo', versions: 'versiones' },
      single: 'canción', plural: 'canciones', releasesWord: 'lanzamientos'
    },
    en: {
      'skip': 'skip to content', 'intro.skip': 'tap to enter', 'menu.open': 'index',
      'nav.bio': 'about', 'nav.diary': 'diary', 'nav.sound': 'sound', 'nav.album': 'album', 'nav.gallery': 'gallery', 'nav.discog': 'discography', 'nav.shows': 'shows', 'nav.listen': 'listen',
      'nav.songs': 'songs', 'nav.collabs': 'collabs', 'nav.malaysia': 'malaysia', 'nav.fan': 'fan zone', 'nav.numbers': 'numbers', 'nav.faq': 'questions',
      hud: { portada: 'cover', estreno: 'new drop', manifiesto: 'manifesto', fin: 'the end' },
      'drop.label': 'new drop', 'drop.play': 'play it now',
      'drop.note': (by, feats) => (by ? `A brand-new collab: ${by} × zardy. Hit play before everyone else.` : feats.length ? `Featuring ${feats.join(', ')}.` : 'zardy’s latest, fresh out of the bedroom.'),
      'songs.h2': 'every song', 'songs.sub': 'his whole discography, turned into a waveform',
      'songs.hint': 'hover the waveform · tap a bar to play it',
      'songs.total': (n, m) => `${n} songs · ${m} minutes of music`,
      'songs.q': 'search a song, record or collab…', 'songs.aria': 'sort songs',
      'songs.sortDate': 'newest', 'songs.sortAz': 'a–z', 'songs.sortLen': 'length',
      'songs.count': (n, t) => (n === t ? `${t} songs` : `${n} of ${t}`), 'songs.none': 'nothing here… try another word',
      'collabs.h2': 'collabs', 'collabs.sub': 'who he has made songs with (per Spotify)', 'collabs.songs': n => (n === 1 ? '1 song' : `${n} songs`),
      'mal.h2': 'his room, right now', 'mal.sub': 'the time in Malaysia, live', 'mal.tz': 'MYT · UTC+8 · live', 'mal.now': 'in Malaysia it’s', 'mal.here': 'where you are:',
      'mal.diff': d => (d === 0 ? 'Same time as where you are.' : `Malaysia is ${fmtH(d)} ${d > 0 ? 'ahead of' : 'behind'} you.`),
      'mal.sky': { night: 'night time: perfect hour for “it be okay” 🌙', dawn: 'sunrise in Malaysia 🌄', day: 'daytime in Malaysia ☀️', dusk: 'sunset in Malaysia, like “bunga senja” 🌅' },
      'fan.h2': 'make your cover', 'fan.sub': 'build your own zardy poster and download it', 'fan.alt': 'poster preview',
      'fan.style': 'style', 'fan.styles': { riso: 'riso', note: 'notebook', mag: 'magazine' }, 'fan.paper': 'paper', 'fan.ink': 'ink', 'fan.song': 'song',
      'fan.name': 'your name', 'fan.namePh': 'your name (optional)', 'fan.shuffle': 'random', 'fan.download': 'download PNG',
      'fan.note': 'Made in your browser: nothing gets uploaded anywhere.', 'fan.saved': 'downloaded! pin it on your wall 📌', 'fan.madeBy': 'made by', 'fan.edition': 'FAN EDITION',
      'hunt.aria': 'hidden hat', 'hunt.found': (n, t) => `hat ${n}/${t}! keep looking 🎩`, 'hunt.done': 'you found all 5 hats! certified fan 🏆',
      mood: h => (h < 5 ? 'late night in Malaysia 🌙' : h < 12 ? 'morning in Malaysia ☀️' : h < 19 ? 'afternoon in Malaysia' : 'night in Malaysia 🌙'),
      'theme.toNight': 'turn the lights off', 'theme.toDay': 'turn the lights on',
      'hero.kicker': 'bedroom indie · alt rock · from Malaysia',
      'hero.line': 'Songs made in his bedroom, somewhere between indie rock and alt rock: raw, melancholic and direct. His music traveled through TikTok edits rather than through a record label.',
      'hero.cta1': 'listen on Spotify', 'hero.cta2': 'see discography', 'hero.scroll': 'scroll',
      'hero.arrow': 'this is zardy', 'hero.alt': 'Drawing of zardy wearing his brown monster-mouth hat',
      'stat.listeners': 'monthly listeners', 'stat.releases': 'releases', 'stat.songs': 'songs', 'stat.collabs': 'collabs', 'stat.since': 'since',
      'st.new': 'new!', 'st.listen': 'monthly',
      'new.label': 'new!', 'new.short': 'new!',
      ago: d => (d < 0 ? 'just out' : d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`),
      with: 'with',
      tapeB: 'BEDROOM INDIE FROM MALAYSIA ✦ PUT YOUR HEADPHONES ON ✦ UNOFFICIAL FAN PAGE ✦ IT BE OKAY :) ✦ ザルディ',
      'stmt.label': 'manifesto', 'stmt.sign': '— a fan, from some other bedroom',
      stmt: 'zardy makes music {img:kidiused} from his bedroom in *Malaysia* {hat}. no label: just melancholic guitars {img:number1}, TikTok edits {img:bonus} and a hat with teeth. and *{crowd}* {img:contemplating} listen every month.',
      crowd: k => (k >= 500 ? 'over half a million people' : `over ${Math.floor(k)} thousand people`),
      'bio.h2': 'about him', 'bio.sub': 'what we know, nothing made up',
      'bio.p1': 'zardy is an independent artist from <mark>Malaysia</mark> who makes music <mark>straight from his bedroom</mark>, which is how he describes himself on the cover of “contemplating”. His sound lives between indie rock, alt rock and internet melancholy.',
      'bio.p2': 'His following grew mostly through TikTok fan edits in the “corecore” / “losercore” scene. In March 2026 he released <b>“baby steps.”</b>, his first album (9 songs, two with Pongus), and in July came <b>“it be okay”</b>, the song that brought in a ton of new listeners; so many that it got a bonus edition with sped up, slowed and instrumental versions.',
      'bio.p3': 'In September 2026 he put out <b>“contemplating”</b>, his second album: 11 songs featuring Luxii, hiroshimal and jaylu, plus a title in Malay, “bunga senja” (roughly “dusk flower”). In October he followed up with <b>“shower”</b>, together with Hyso, and <b>“Haze”</b>, a collab with zyun.',
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
      mascot: c => [`have you heard “${c.album}” yet? 👀`, 'it be okay :)', 'ザルディ!', 'type “zardy” on your keyboard… 🤫', 'put your headphones on, seriously', `“${c.latest}” came out ${c.ago}`, 'nom nom 🦷', 'made in a bedroom in Malaysia 🛏️', 'drag the stickers up top 👆', 'there are hats hidden around the page 👀', 'make your own poster in the fan zone 🎨'],
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
  const daysSince = r => Math.floor((Date.now() - dateOf(r)) / 864e5);
  const isNew = r => !!r.date && daysSince(r) <= 30;
  const pad2 = n => String(n).padStart(2, '0');
  const fmtH = d => { const a = Math.abs(d), h = Math.floor(a), m = Math.round((a - h) * 60); return m ? `${h} h ${m} min` : `${h} h`; };
  const fmtNum = (v, dec = 0) => Number(v).toLocaleString(lang, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const lkDec = () => (Number.isInteger(DATA.listeners_k) ? 0 : 1);
  const fmtK = () => fmtNum(DATA.listeners_k, lkDec());
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
      { k: 'listen', x: 102, y: 40, r: -9, d: 500, html: `<b>${fmtK()}K</b><span>${L('st.listen')}</span>` },
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
    '#st-listeners': [DATA.listeners_k, lkDec(), 'K'],
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

  /* ================= ESTRENO (el lanzamiento más nuevo) ================= */
  function renderDrop() {
    const r = latestDated(), sect = $('#estreno');
    if (!r) { sect.hidden = true; return; }
    const feats = [...new Set(r.tracks.map(t => t.feat).filter(f => f && f !== r.by))];
    const src = r.cover || r.local, path = playPathOf(r);
    $('#drop-cd').innerHTML = src ? `<img src="${esc(src)}" alt="" loading="lazy" draggable="false">` : '';
    $('#drop-case').innerHTML = (isNew(r) ? `<span class="new-stk">${L('new.short')}</span>` : '') + coverHTML(r);
    $('#drop-badge').textContent = `${L(isNew(r) ? 'new.label' : 'new.latest')} · ${L('ago')(daysSince(r))}`;
    $('#drop-who').innerHTML = r.by ? `${esc(r.by)} <i>×</i> zardy` : feats.length ? `zardy <i>×</i> ${feats.map(esc).join(' <i>×</i> ')}` : 'zardy';
    const t = esc(r.title);
    $('#drop-title').innerHTML = `<span class="dp red">${t}</span><span class="dp ink" aria-hidden="true">${t}</span>`;
    const n = r.tracks.length, dur = runtime(r);
    $('#drop-meta').textContent = [L('kinds')[r.kind], fmtDate(r, { day: 'numeric', month: 'long', year: 'numeric' }),
      n > 1 ? `${n} ${trackWord(n)}` : '', dur ? mmss(dur) : ''].filter(Boolean).join(' · ');
    $('#drop-note').textContent = L('drop.note')(r.by, feats);
    $('#drop-actions').innerHTML =
      (path ? `<button class="btn" type="button" data-play="${path}" data-title="${esc(r.title)}" data-magnetic>▶ ${L('drop.play')}</button>` : '') +
      `<a class="btn ghost" href="${spotifyUrl(r)}" target="_blank" rel="noopener">${L('dlg.open')} ↗</a>` +
      `<button class="btn ghost" type="button" data-open="${esc(r.id)}">${L('album.details')}</button>`;
    fillTrack($('#drop-bg'), [r.title.toUpperCase(), 'NEW', r.title.toUpperCase(), r.by ? r.by.toUpperCase() + ' × ZARDY' : 'ZARDY'], 6);
    bindMagnetic($('#drop-actions'));
    requestAnimationFrame(() => fitText($('#drop-title'), 260));
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
      <li class="d-item" data-year="${r.year}">
        <button class="d-btn" type="button" data-open="${esc(r.id)}">
          <span class="d-date">${big(r)}<small>${esc(small(r))}</small></span>
          <span class="d-dot"></span>
          <span class="d-card" style="--r:${((hash(r.id) % 7) - 3) * .8}deg">${coverHTML(r)}<span class="d-title">${esc(r.title)}</span><span class="d-kind">${L('kinds')[r.kind]}${r.tracks.length ? ` · ${r.tracks.length} ${trackWord(r.tracks.length)}` : ''}</span></span>
        </button>
      </li>`).join('') +
      `<li class="d-item d-next" data-year="${new Date().getFullYear()}"><span class="d-date">${L('tl.today')}<small>${new Date().toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })}</small></span><span class="d-dot"></span><span class="d-next-card">${L('tl.next')}</span></li>`;
    const also = releases.filter(r => !r.date && datedYears.has(r.year));
    $('#diary-also').innerHTML = also.map(r => `<button class="chip" type="button" data-open="${esc(r.id)}">${esc(r.title)}</button>`).join('');
    $('.diary-also').hidden = !also.length;
    diaryItems = $$('#diary .d-item');
    $('#diary-total').textContent = pad2(diaryItems.length);
    diaryIdx = -1;
    diaryProgress(diaryP);
  }
  const hscroll = $('#hscroll'), hbar = $('#hbar');
  let diaryItems = [], diaryIdx = -1, diaryP = 0, yearTimer;
  function diaryProgress(p) {
    diaryP = p;
    hbar.style.setProperty('--p', p.toFixed(4));
    const n = diaryItems.length;
    if (!n) return;
    const idx = Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))));
    if (idx === diaryIdx) return;
    diaryIdx = idx;
    $('#diary-idx').textContent = pad2(idx + 1);
    diaryItems.forEach((li, i) => li.classList.toggle('cur', i === idx));
    const yEl = $('#diary-year'), y = diaryItems[idx].dataset.year;
    if (yEl.textContent !== y) {
      clearTimeout(yearTimer);
      yEl.classList.add('swap');
      yearTimer = setTimeout(() => { yEl.textContent = y; yEl.classList.remove('swap'); }, 180);
    }
  }
  hscroll.addEventListener('scroll', () => {
    const max = hscroll.scrollWidth - hscroll.clientWidth;
    if (max > 0 && !root.classList.contains('has-pin')) diaryProgress(hscroll.scrollLeft / max);
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
          <span class="rel-title">${esc(r.title)}${r.by ? ` <small>w/ ${esc(r.by)}</small>` : ''}</span>
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
    const meta = [r.by ? `${r.by}, zardy` : '', L('kinds')[r.kind], r.date ? fmtDate(r, { day: 'numeric', month: 'long', year: 'numeric' }) : r.year,
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
      const sub = s.name === 'spotify' ? `${fmtK()}K ${L('listen.sub1')}` : (s.handle || '');
      return `<a class="ticket" href="${esc(s.url)}" target="_blank" rel="noopener" data-cursor="${esc(s.name)} ↗">
        <span class="t-ico">${ICONS[s.name] || ''}</span>
        <span><span class="platform">${esc(s.name)}</span><span class="sub">${esc(sub)}</span></span>
        <span class="stub" aria-hidden="true"><span class="arrow">→</span><span class="adm">ADMIT ONE</span></span>
      </a>`;
    }).join('');
    $('#search-chips').innerHTML = DATA.searches.map(s =>
      `<a class="chip" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`).join('');
  }
  const SECTIONS = [['bio', '01', 'nav.bio'], ['diario', '02', 'nav.diary'], ['datos', '03', 'nav.numbers'], ['sonido', '04', 'nav.sound'], ['album', '05', 'nav.album'],
    ['canciones', '06', 'nav.songs'], ['colabs', '07', 'nav.collabs'], ['galeria', '08', 'nav.gallery'], ['discografia', '09', 'nav.discog'], ['malasia', '10', 'nav.malaysia'],
    ['fanzone', '11', 'nav.fan'], ['faq', '12', 'nav.faq'], ['shows', '13', 'nav.shows'], ['escucha', '14', 'nav.listen']];
  function renderFooter() {
    const [y, m] = String(DATA.listeners_checked || '').split('-');
    const when = y && m ? new Date(+y, +m - 1, 15).toLocaleDateString(lang, { month: 'short', year: 'numeric' }) : '';
    $('#foot-disclaimer').textContent = L('footer.disclaimer') + (when ? ` (${when})` : '');
    $('#foot-index').innerHTML = SECTIONS.map(([id, no, key]) => `<a href="#${id}"><i>${no}</i>${esc(L(key))}</a>`).join('');
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
    $('#menu-links').innerHTML = SECTIONS.map(([id, no, key], i) =>
      `<a href="#${id}" style="--i:${i}" data-id="${id}"><i>${no}</i>${esc(L(key))}</a>`).join('');
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


  /* ================= 06 TODAS LAS CANCIONES ================= */
  const WAVE_C = ['#f1e8d8', '#e0381f', '#ffcc2e'];
  let waveList = [], songSort = 'date', songQ = '';
  const chronoTracks = () => releases.slice().reverse().flatMap(r => r.tracks.filter(x => x.n).map(x => ({ ...x, r })));
  function renderWave() {
    const list = chronoTracks();
    waveList = list;
    const max = Math.max(...list.map(x => sec(x.t))) || 1;
    let prev = null, c = -1;
    $('#wave').innerHTML = list.map((x, k) => {
      if (x.r !== prev) { prev = x.r; c = (c + 1) % WAVE_C.length; }
      const d = sec(x.t), h = d ? 14 + d / max * 86 : 10;
      const act = x.sp ? `data-play="track/${x.sp}" data-title="${esc(x.n)}"` : `data-open="${esc(x.r.id)}"`;
      return `<button class="wv${x.r.kind === 'versions' ? ' ver' : ''}${d ? '' : ' unk'}" type="button" style="--h:${h.toFixed(1)}%;--c:${WAVE_C[c]};--k:${k}" data-k="${k}" ${act} aria-label="${esc(x.n)} — ${esc(x.r.title)}${x.t ? ' · ' + x.t : ''}"></button>`;
    }).join('');
    const a = list[0], z = list[list.length - 1];
    $('#wave-axis').innerHTML = `<span>← ${a.r.year} · ${esc(a.n)}</span><span>${esc(z.n)} · ${z.r.date ? fmtDate(z.r, { month: 'short', year: 'numeric' }) : z.r.year} →</span>`;
    showWave(-1);
  }
  function showWave(k) {
    const el = $('#wave-read'), x = waveList[k];
    $$('#wave .wv.on').forEach(b => b.classList.remove('on'));
    if (!x) {
      const mins = Math.round(waveList.reduce((acc, t) => acc + sec(t.t), 0) / 60);
      el.innerHTML = `<span class="wr-no">∿</span><b class="wr-name small">${L('songs.total')(waveList.length, mins)}</b><span class="wr-meta">${L('songs.hint')}</span>`;
      return;
    }
    const bar = $(`#wave .wv[data-k="${k}"]`);
    if (bar) bar.classList.add('on');
    el.innerHTML = `<span class="wr-no">Nº${pad2(k + 1)}</span><b class="wr-name${x.n.length > 24 ? ' xlong' : x.n.length > 13 ? ' long' : ''}">${esc(x.n)}</b><span class="wr-meta">${esc(x.r.title)} · ${x.r.year}${x.t ? ' · ' + x.t : ''}${x.feat ? ` · ${L('with')} ${esc(x.feat)}` : ''}</span>`;
  }
  const waveEl = $('#wave');
  waveEl.addEventListener('pointerover', e => { const b = e.target.closest('.wv'); if (b) showWave(+b.dataset.k); });
  waveEl.addEventListener('focusin', e => { const b = e.target.closest('.wv'); if (b) showWave(+b.dataset.k); });
  waveEl.addEventListener('pointerleave', () => showWave(-1));
  function renderSongs() {
    const all = chronoTracks().map((x, k) => ({ ...x, k }));
    let list = all;
    const q = songQ.trim().toLowerCase();
    if (q) list = list.filter(x => `${x.n} ${x.r.title} ${x.feat || ''}`.toLowerCase().includes(q));
    if (songSort === 'az') list = [...list].sort((a, b) => a.n.localeCompare(b.n, lang));
    else if (songSort === 'len') list = [...list].sort((a, b) => sec(b.t) - sec(a.t));
    else list = [...list].reverse();
    $('#songs').innerHTML = list.length ? list.map(x => `
      <li class="song-row">
        <span class="sr-i">${pad2(x.k + 1)}</span>
        <button class="sr-cover" type="button" data-open="${esc(x.r.id)}" aria-label="${esc(x.r.title)}">${coverHTML(x.r)}</button>
        <span class="sr-name">${esc(x.n)}${featTag(x)}</span>
        <span class="sr-rel">${esc(x.r.title)}</span>
        <span class="sr-y">${x.r.year}</span>
        <span class="sr-t">${x.t || '—'}</span>
        ${x.sp ? `<button class="mini-play" type="button" data-play="track/${x.sp}" data-title="${esc(x.n)}" aria-label="${L('playTrack')} ${esc(x.n)}">▶</button>` : `<a class="mini-play" href="${trackUrl(x)}" target="_blank" rel="noopener" aria-label="${L('shuffle.search')}">↗</a>`}
      </li>`).join('') : `<li class="songs-empty">${L('songs.none')}</li>`;
    $('#songs-count').textContent = L('songs.count')(list.length, all.length);
    $$('[data-sort]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sort === songSort)));
  }
  $('#song-q').addEventListener('input', e => { songQ = e.target.value; renderSongs(); });

  /* ================= 07 COLABORACIONES (órbita) ================= */
  function collabEntries() {
    const map = new Map();
    collabTracks().forEach(x => { if (!map.has(x.feat)) map.set(x.feat, []); map.get(x.feat).push(x); });
    return [...map];
  }
  function renderOrbit() {
    const list = collabEntries(), n = list.length || 1;
    const pos = list.map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? 33 : 41; return { x: 50 + Math.cos(a) * rr, y: 50 + Math.sin(a) * rr }; });
    $('#orbit').innerHTML = `
      <div class="orbit-ring">
        <svg class="orbit-lines" viewBox="0 0 100 100" aria-hidden="true">${pos.map((q, i) => `<line x1="50" y1="50" x2="${q.x.toFixed(2)}" y2="${q.y.toFixed(2)}" data-collab="${i}"/>`).join('')}</svg>
        ${list.map(([who, tr], i) => `<button class="orbit-node" type="button" style="--x:${pos[i].x.toFixed(2)}%;--y:${pos[i].y.toFixed(2)}%;--sz:${tr.length > 1 ? 136 : 114}px" data-collab="${i}" data-open="${esc(tr[0].r.id)}" data-cursor="${esc(who)}"><span class="on-in"><b${who.length > 8 ? ' class="long"' : ''}>${esc(who)}</b><small>${L('collabs.songs')(tr.length)}</small></span></button>`).join('')}
      </div>
      <div class="orbit-center"><svg aria-hidden="true"><use href="#sym-hat"/></svg><b>zardy</b></div>`;
    $('#collab-cards').innerHTML = list.map(([who, tr], i) => `
      <article class="collab-card" data-collab="${i}">
        <div class="cc-head"><span class="cc-no">${pad2(i + 1)}</span><h3>${esc(who)}</h3><span>${L('collabs.songs')(tr.length)}</span></div>
        <ul class="cc-songs">${tr.map(x => `<li><span>${esc(x.n)}</span><small>${esc(x.r.title)} · ${x.r.year}</small>${x.sp ? `<button class="mini-play" type="button" data-play="track/${x.sp}" data-title="${esc(x.n)}" aria-label="${L('playTrack')} ${esc(x.n)}">▶</button>` : ''}</li>`).join('')}</ul>
      </article>`).join('');
  }
  const colabsEl = $('#colabs');
  const collabHL = i => $$('#colabs [data-collab]').forEach(el => el.classList.toggle('hl', i != null && el.dataset.collab === String(i)));
  colabsEl.addEventListener('pointerover', e => { const t = e.target.closest('[data-collab]'); collabHL(t ? t.dataset.collab : null); });
  colabsEl.addEventListener('focusin', e => { const t = e.target.closest('[data-collab]'); collabHL(t ? t.dataset.collab : null); });
  colabsEl.addEventListener('pointerleave', () => collabHL(null));

  /* ================= 10 MALASIA, AHORA ================= */
  const skySec = $('#malasia'), clockEl = $('.clock');
  let skyPhase = '';
  function renderClockTicks() {
    let g = '';
    for (let i = 0; i < 60; i++) {
      const big = i % 5 === 0, a = i * 6 * Math.PI / 180, r1 = big ? 110 : 118, r2 = 126;
      g += `<line x1="${(150 + Math.sin(a) * r1).toFixed(1)}" y1="${(150 - Math.cos(a) * r1).toFixed(1)}" x2="${(150 + Math.sin(a) * r2).toFixed(1)}" y2="${(150 - Math.cos(a) * r2).toFixed(1)}" class="ck-tick${big ? ' big' : ''}"/>`;
    }
    $('#ck-ticks').innerHTML = g;
  }
  function updateMalaysia(h, m, sc) {
    $('#mal-time').textContent = `${pad2(h)}:${pad2(m)}`;
    const ds = h * 3600 + m * 60 + sc;
    $('#ck-h').style.transform = `rotate(${(ds / 120).toFixed(2)}deg)`;
    $('#ck-m').style.transform = `rotate(${(ds / 10).toFixed(2)}deg)`;
    $('#ck-s').style.transform = `rotate(${ds * 6}deg)`;
    if (!clockEl.classList.contains('live')) requestAnimationFrame(() => clockEl.classList.add('live'));
    const phase = h < 5 ? 'night' : h < 7 ? 'dawn' : h < 17 ? 'day' : h < 19 ? 'dusk' : 'night';
    if (phase !== skyPhase) { skyPhase = phase; skySec.dataset.sky = phase; }
    $('#mal-sky').textContent = L('mal.sky')[phase];
    const t = h + m / 60, f = t >= 6 && t < 18 ? (t - 6) / 12 : ((t + 6) % 24) / 12, orb = $('#sky-orb');
    orb.style.setProperty('--ox', (10 + f * 80).toFixed(2) + '%');
    orb.style.setProperty('--oy', (78 - Math.sin(f * Math.PI) * 56).toFixed(2) + '%');
    $('#mal-diff').textContent = L('mal.diff')(8 + new Date().getTimezoneOffset() / 60);
    $('#mal-local').textContent = new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  }

  /* ================= 11 FAN ZONE: generador de pósters ================= */
  const MK = {
    styles: ['riso', 'note', 'mag'],
    papers: ['#efe8d8', '#ffcc2e', '#bfe3cf', '#f4c6c0', '#151210'],
    inks: ['#151210', '#e0381f', '#7a4220', '#2f4fd1', '#7b52c9']
  };
  const mk = { style: 'riso', paper: 0, ink: 0, song: 0, name: '' };
  const poster = $('#poster'), pctx = poster.getContext('2d'), PW = 1080, PH = 1350;
  const HAT_BODY = [['M18 50C12 70 12 92 22 102C30 108 40 100 39 88L38 58Z', '#4b2711'], ['M102 50C108 70 108 92 98 102C90 108 80 100 81 88L82 58Z', '#4b2711'], ['M12 60C8 26 34 8 60 8C86 8 112 26 108 60C90 70 30 70 12 60Z', '#7a4220'], ['M41 36H79Q82 36 82 39V53Q82 56 79 56H41Q38 56 38 53V39Q38 36 41 36Z', '#e2361f']];
  const HAT_TEETH = ['M40 38.5L45 46L50 38.5L55 46L60 38.5L65 46L70 38.5L75 46L80 38.5Z', 'M40 54L45 49.5L50 54L55 49.5L60 54L65 49.5L70 54L75 49.5L80 54Z'];
  // el gorro se dibuja con trazos vectoriales (no ensucia el canvas, así se puede descargar)
  function drawHat(c, x, y, size, rot = 0) {
    c.save();
    c.translate(x, y); c.rotate(rot * Math.PI / 180);
    const k = size / 120; c.scale(k, k); c.translate(-60, -56);
    c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = '#1b1714'; c.lineWidth = 3.5;
    HAT_BODY.forEach(([d, f]) => { const p = new Path2D(d); c.fillStyle = f; c.fill(p); c.stroke(p); });
    c.strokeStyle = '#a8652f'; c.lineWidth = 4; c.stroke(new Path2D('M26 34C30 22 40 15 52 13'));
    c.fillStyle = '#fff8ec'; HAT_TEETH.forEach(d => c.fill(new Path2D(d)));
    c.fillStyle = '#1b1714';
    [[44, 27], [76, 27]].forEach(([ex, ey]) => { c.beginPath(); c.arc(ex, ey, 4, 0, Math.PI * 2); c.fill(); });
    c.restore();
  }
  let grainPat = null;
  function posterGrain(c) {
    if (!grainPat) {
      const g = document.createElement('canvas'); g.width = g.height = 180;
      const gx = g.getContext('2d'), id = gx.createImageData(180, 180);
      for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 46; }
      gx.putImageData(id, 0, 0); grainPat = c.createPattern(g, 'repeat');
    }
    c.save(); c.globalCompositeOperation = 'overlay'; c.fillStyle = grainPat; c.fillRect(0, 0, PW, PH); c.restore();
  }
  const PF = {
    sans: s => `900 ${s}px Archivo, "Arial Black", sans-serif`,
    dela: s => `${s}px "Dela Gothic One", "Arial Black", sans-serif`,
    hand: s => `700 ${s}px Caveat, "Comic Sans MS", cursive`,
    pix: s => `${s}px DotGothic16, monospace`
  };
  const setF = (c, f, wide = false) => { c.font = f; if ('fontStretch' in c) c.fontStretch = wide ? 'expanded' : 'normal'; };
  function fitSize(c, text, fn, maxW, max, min, wide) {
    let sz = max; setF(c, fn(sz), wide);
    while (sz > min && c.measureText(text).width > maxW) { sz -= 4; setF(c, fn(sz), wide); }
    return sz;
  }
  function wrapFit(c, text, fn, maxW, maxLines, max, min, wide) {
    for (let sz = max; sz >= min; sz -= 4) {
      setF(c, fn(sz), wide);
      const lines = []; let line = '';
      for (const w of text.split(/\s+/)) { const t = line ? line + ' ' + w : w; if (line && c.measureText(t).width > maxW) { lines.push(line); line = w; } else line = t; }
      if (line) lines.push(line);
      if (lines.length <= maxLines && lines.every(l => c.measureText(l).width <= maxW)) return { sz, lines };
    }
    setF(c, fn(min), wide);
    return { sz: min, lines: [text] };
  }
  function posterBarcode(c, x, y, w, h, seed, color) {
    let st = hash(seed) || 1, bx = 0;
    c.fillStyle = color;
    while (bx < w) {
      st ^= st << 13; st ^= st >>> 17; st ^= st << 5; st >>>= 0;
      const bw = 2 + (st % 4), gap = 2 + ((st >>> 5) % 4);
      if (bx + bw > w) break;
      c.fillRect(x + bx, y, bw, h); bx += bw + gap;
    }
  }
  function posterHalftone(c, cx0, cy0, R, color) {
    c.save(); c.fillStyle = color;
    for (let y = cy0 - R; y <= cy0 + R; y += 22) for (let x = cx0 - R; x <= cx0 + R; x += 22) {
      const d = Math.hypot(x - cx0, y - cy0) / R; if (d > 1) continue;
      c.beginPath(); c.arc(x, y, (1 - d) * 9 + 1.2, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }
  function posterRiso(c, o) {
    setF(c, PF.pix(30)); c.fillStyle = o.ink;
    c.fillText('ZARDY ZINE — ' + L('fan.edition'), 70, 96);
    c.textAlign = 'right'; c.fillText('VOL.15', PW - 70, 96); c.textAlign = 'left';
    c.fillRect(70, 118, PW - 140, 4);
    const sz = fitSize(c, 'ZARDY', PF.sans, PW - 130, 420, 100, true), base = 160 + sz * .72;
    c.fillStyle = o.accent; c.fillText('ZARDY', 76, base + 12);
    c.globalCompositeOperation = o.blend; c.fillStyle = o.ink; c.fillText('ZARDY', 62, base);
    c.globalCompositeOperation = 'source-over';
    posterHalftone(c, 760, 990, 250, o.accent);
    drawHat(c, 760, 980, 430, 10);
    const top = base + 70, t = wrapFit(c, o.title, PF.sans, 640, 3, 150, 54);
    c.fillStyle = o.ink;
    let ty = top + t.sz * .74;
    t.lines.forEach(l => { c.fillText(l, 70, ty); ty += t.sz * .92; });
    setF(c, PF.pix(28)); c.fillStyle = o.muted; c.fillText(o.rel.toUpperCase(), 72, ty - t.sz * .92 + 52);
    if (o.feat) { setF(c, PF.hand(56)); c.fillStyle = o.accent; c.fillText(o.feat, 72, ty - t.sz * .92 + 120); }
    setF(c, PF.dela(64)); c.fillStyle = o.accent;
    [...'ザルディ'].forEach((ch, i) => c.fillText(ch, PW - 136, top + 40 + i * 76));
    c.save(); c.translate(72, 1172); c.rotate(-.05); setF(c, PF.hand(62)); c.fillStyle = o.ink;
    c.fillText(o.who ? `${L('fan.madeBy')} ${o.who}` : 'it be okay :)', 0, 0); c.restore();
  }
  function posterNote(c, o) {
    c.save();
    c.strokeStyle = o.dark ? 'rgba(170,195,235,.22)' : 'rgba(64,104,160,.32)'; c.lineWidth = 2;
    for (let y = 190; y < PH - 140; y += 56) { c.beginPath(); c.moveTo(0, y); c.lineTo(PW, y); c.stroke(); }
    c.strokeStyle = 'rgba(214,64,52,.55)'; c.lineWidth = 3; c.beginPath(); c.moveTo(150, 0); c.lineTo(150, PH); c.stroke();
    for (let y = 200; y < PH - 120; y += 240) { c.beginPath(); c.arc(76, y, 22, 0, Math.PI * 2); c.fillStyle = o.dark ? '#000' : 'rgba(0,0,0,.14)'; c.fill(); c.strokeStyle = o.ink; c.lineWidth = 3; c.stroke(); }
    c.restore();
    c.save(); c.translate(PW / 2, 62); c.rotate(-.06); c.fillStyle = 'rgba(236,217,160,.88)'; c.fillRect(-160, -28, 320, 58); c.restore();
    c.save(); c.translate(200, 330); c.rotate(-.06); setF(c, PF.hand(230)); c.fillStyle = o.ink; c.fillText('zardy', 0, 0);
    c.strokeStyle = o.accent; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(4, 44); c.bezierCurveTo(140, 14, 280, 74, 470, 30); c.stroke(); c.restore();
    drawHat(c, 880, 250, 260, -12);
    setF(c, PF.dela(54)); c.fillStyle = o.accent;
    [...'ザルディ'].forEach((ch, i) => c.fillText(ch, PW - 104, 560 + i * 64));
    const t = wrapFit(c, o.title, PF.hand, 720, 3, 180, 70);
    c.save(); c.translate(200, 470); c.rotate(-.03); c.fillStyle = o.ink;
    let ty = t.sz * .8;
    t.lines.forEach(l => { c.fillText(l, 0, ty); ty += t.sz * .86; });
    setF(c, PF.pix(28)); c.fillStyle = o.muted; c.fillText(o.rel + (o.feat ? ' · ' + o.feat : ''), 6, ty - t.sz * .86 + 56);
    c.restore();
    c.save(); c.fillStyle = o.accent;
    [[230, 980], [820, 760], [960, 1080]].forEach(([sx, sy], i) => { c.save(); c.translate(sx, sy); c.rotate(i); c.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? 9 : 30, a = k * Math.PI / 4; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); });
    c.restore();
    c.save(); c.translate(250, 1020); c.rotate(.04);
    c.shadowColor = 'rgba(0,0,0,.28)'; c.shadowBlur = 24; c.shadowOffsetY = 12; c.fillStyle = '#f7e27a'; c.fillRect(0, 0, 470, 150);
    c.shadowColor = 'transparent'; setF(c, PF.hand(58)); c.fillStyle = '#2b2610';
    c.fillText(o.who ? `${L('fan.madeBy')} ${o.who}` : 'it be okay :)', 30, 94); c.restore();
  }
  function posterMag(c, o) {
    setF(c, PF.dela(30)); c.fillStyle = o.ink; c.fillText('・ザルディ'.repeat(14), 0, 62);
    c.fillRect(0, 84, PW, 4);
    const sz = fitSize(c, 'ZARDY', PF.dela, PW - 100, 300, 80), base = 116 + sz * .82;
    c.fillStyle = o.ink; c.fillText('ZARDY', 50, base);
    setF(c, PF.dela(40)); c.fillText('(ザルディ)', 56, base + 64);
    setF(c, PF.pix(26)); c.fillStyle = o.muted; c.fillText('(zardy) — bedroom indie · alt rock · malaysia', 58, base + 108);
    const cy = 860;
    c.save(); c.lineWidth = 16; c.strokeStyle = o.ink; c.fillStyle = o.dark ? '#241d17' : '#fbf7ee';
    c.beginPath(); c.arc(700, cy, 270, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
    c.save(); c.beginPath(); c.arc(700, cy, 262, 0, Math.PI * 2); c.clip(); posterHalftone(c, 700, cy + 120, 260, o.accent); c.restore();
    drawHat(c, 700, cy + 6, 400, -6);
    c.save(); c.beginPath(); c.arc(220, 680, 122, 0, Math.PI * 2); c.fillStyle = '#ffcc2e'; c.fill(); c.lineWidth = 8; c.strokeStyle = o.ink; c.stroke();
    c.textAlign = 'center'; c.fillStyle = '#151210'; setF(c, PF.sans(54), true); c.fillText(fmtK() + 'K', 220, 692);
    setF(c, PF.pix(22)); c.fillText(L('st.listen').toUpperCase(), 220, 730); c.restore();
    c.save(); c.beginPath(); c.arc(270, 1010, 180, 0, Math.PI * 2); c.fillStyle = o.accent; c.fill(); c.lineWidth = 10; c.strokeStyle = o.ink; c.stroke();
    const t = wrapFit(c, o.title, PF.sans, 280, 3, 84, 28);
    c.textAlign = 'center'; c.fillStyle = o.accent === '#151210' ? '#fff8ec' : (o.dark ? '#151210' : '#fff8ec');
    let ty = 1010 - (t.lines.length - 1) * t.sz * .46 + t.sz * .32;
    t.lines.forEach(l => { c.fillText(l, 270, ty); ty += t.sz * .92; });
    c.restore();
    setF(c, PF.hand(58)); c.fillStyle = o.ink; c.fillText(o.who ? `${L('fan.madeBy')} ${o.who}` : 'it be okay :)', 500, 1176);
    setF(c, PF.pix(24)); c.fillStyle = o.muted; c.fillText(o.rel + (o.feat ? ' · ' + o.feat : ''), 502, 1214);
  }
  function drawPoster() {
    const c = pctx, list = songs(), x = list[mk.song] || list[0];
    const dark = mk.paper === 4;
    let ink = MK.inks[mk.ink];
    if (dark && mk.ink === 0) ink = '#f1e8d8';
    const o = {
      ink, dark,
      accent: ink === '#e0381f' ? (dark ? '#f1e8d8' : '#151210') : '#e0381f',
      blend: dark ? 'screen' : 'multiply',
      muted: dark ? 'rgba(241,232,216,.72)' : 'rgba(21,18,16,.66)',
      title: x.n, rel: `${x.r.title} · ${x.r.year}${x.t ? ' · ' + x.t : ''}`, feat: x.feat ? `w/ ${x.feat}` : '', who: mk.name.trim()
    };
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    c.fillStyle = MK.papers[mk.paper]; c.fillRect(0, 0, PW, PH);
    if (mk.style === 'note') posterNote(c, o); else if (mk.style === 'mag') posterMag(c, o); else posterRiso(c, o);
    const fy = 1226;
    posterBarcode(c, 70, fy, 230, 52, 'zardy-' + o.title, ink);
    setF(c, PF.pix(24)); c.fillStyle = ink; c.fillText('4 589 1209 0015', 72, fy + 82);
    c.textAlign = 'right';
    c.fillText(`ZARDY ZINE · VOL.15 · ${new Date().toLocaleDateString(lang, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}`, PW - 70, fy + 30);
    c.fillStyle = o.muted; c.fillText('unofficial fan page', PW - 70, fy + 64);
    c.textAlign = 'left';
    c.strokeStyle = ink; c.lineWidth = 3;
    [[28, 28, 1, 1], [PW - 28, 28, -1, 1], [28, PH - 28, 1, -1], [PW - 28, PH - 28, -1, -1]].forEach(([cx0, cy0, dx, dy]) => { c.beginPath(); c.moveTo(cx0, cy0 + 34 * dy); c.lineTo(cx0, cy0); c.lineTo(cx0 + 34 * dx, cy0); c.stroke(); });
    posterGrain(c);
    c.restore();
  }
  let mkFonts = false;
  function loadPosterFonts() {
    if (mkFonts || !document.fonts || !document.fonts.load) return;
    mkFonts = true;
    Promise.all([document.fonts.load('900 100px Archivo'), document.fonts.load('100px "Dela Gothic One"', 'ZARDYザルディ・()'), document.fonts.load('700 100px Caveat'), document.fonts.load('30px DotGothic16', 'ZINE VOL')])
      .then(() => drawPoster()).catch(() => {});
  }
  function renderMaker() {
    $('#mk-style').innerHTML = MK.styles.map(st => `<button type="button" data-mk="style" data-v="${st}" aria-pressed="${mk.style === st}">${L('fan.styles')[st]}</button>`).join('');
    $('#mk-paper').innerHTML = MK.papers.map((col, i) => `<button type="button" data-mk="paper" data-v="${i}" style="--sw:${col}" aria-pressed="${mk.paper === i}" aria-label="${L('fan.paper')} ${i + 1}"></button>`).join('');
    $('#mk-ink').innerHTML = MK.inks.map((col, i) => `<button type="button" data-mk="ink" data-v="${i}" style="--sw:${col}" aria-pressed="${mk.ink === i}" aria-label="${L('fan.ink')} ${i + 1}"></button>`).join('');
    $('#mk-song').innerHTML = songs().map((x, i) => `<option value="${i}">${esc(x.n)} — ${esc(x.r.title)}</option>`).join('');
    $('#mk-song').value = String(mk.song);
    drawPoster();
    loadPosterFonts();
  }
  $('.maker').addEventListener('click', e => {
    const b = e.target.closest('[data-mk]');
    if (!b) return;
    const k = b.dataset.mk;
    mk[k] = k === 'style' ? b.dataset.v : +b.dataset.v;
    $$(`[data-mk="${k}"]`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    drawPoster();
  });
  $('#mk-song').addEventListener('change', e => { mk.song = +e.target.value; drawPoster(); });
  let nameRaf = 0;
  $('#mk-name').addEventListener('input', e => { mk.name = e.target.value.slice(0, 22); cancelAnimationFrame(nameRaf); nameRaf = requestAnimationFrame(drawPoster); });
  $('#mk-shuffle').addEventListener('click', () => {
    const rnd = n => Math.floor(Math.random() * n);
    mk.style = MK.styles[rnd(MK.styles.length)];
    mk.paper = rnd(MK.papers.length);
    mk.ink = rnd(MK.inks.length);
    mk.song = rnd(songs().length);
    renderMaker();
  });
  $('#mk-download').addEventListener('click', () => {
    drawPoster();
    poster.toBlob(b => {
      if (!b) return;
      const x = songs()[mk.song] || songs()[0], a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `zardy-${(x.n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'poster')}-${mk.style}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      $('#mk-note').textContent = L('fan.saved');
      mascot.classList.add('on'); mascotSay(L('fan.saved'), 2600);
    }, 'image/png');
  });

  /* ================= gorros escondidos (busca los 5) ================= */
  const HATS_TOTAL = $$('.hidden-hat').length;
  let hatsFound = new Set();
  try { hatsFound = new Set(JSON.parse(localStorage.getItem('zardy-hats') || '[]')); } catch (e) { /* sin storage */ }
  function syncHats() {
    $$('.hidden-hat').forEach(b => { if (hatsFound.has(b.dataset.hat)) b.hidden = true; });
    $('#hud-hats').textContent = `HATS ${hatsFound.size}/${HATS_TOTAL}`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.hidden-hat');
    if (!b || hatsFound.has(b.dataset.hat)) return;
    e.stopPropagation();
    hatsFound.add(b.dataset.hat);
    try { localStorage.setItem('zardy-hats', JSON.stringify([...hatsFound])); } catch (err) { /* sin storage */ }
    b.classList.add('found');
    setTimeout(() => { b.hidden = true; }, 720);
    $('#hud-hats').textContent = `HATS ${hatsFound.size}/${HATS_TOTAL}`;
    mascot.classList.add('on');
    if (hatsFound.size >= HATS_TOTAL) { hatRain(); mascotSay(L('hunt.done'), 5200); }
    else mascotSay(L('hunt.found')(hatsFound.size, HATS_TOTAL), 2800);
  }, true);

  // los títulos enormes nunca se salen de la pantalla
  function fitTitles() {
    $$('.sh-title').forEach(h => {
      h.style.fontSize = '';
      const avail = h.parentElement.clientWidth;
      let maxW = 0;
      $$('.w', h).forEach(w => { maxW = Math.max(maxW, w.getBoundingClientRect().width); });
      if (maxW > avail) h.style.fontSize = (parseFloat(getComputedStyle(h).fontSize) * avail / maxW * .97) + 'px';
    });
  }

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
    renderHeroMeta(); renderHeroStickers(); renderDrop(); renderTapes(); renderStats(); renderStatement(); renderCollabs(); renderDiary();
    renderFacts(); renderTags(); renderShuffle(); renderFeature(); renderDiscog(); renderSocials(); renderFooter(); renderMenu();
    renderWave(); renderSongs(); renderOrbit(); renderMaker(); syncHats();
    syncThemeUI(); tickClock(); updateHud(); fitTitles();
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
    const [, mm, ss] = s.split(':').map(Number);
    updateMalaysia(h, mm, ss);
  }
  setInterval(tickClock, 1000);
  let hudKey = 'portada';
  function updateHud() {
    const sec = SECTIONS.find(x => x[1] === hudKey);
    $('#hud-sec').textContent = `§${sec ? hudKey : '··'} ${sec ? L(sec[2]) : (L('hud')[hudKey] || '')}`;
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
    if (en.target.classList.contains('wave-box')) setTimeout(() => en.target.classList.add('done'), 1500);
    io.unobserve(en.target);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    hudKey = en.target.dataset.hud || hudKey;
    updateHud();
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    $$('#menu-links a').forEach(a => a.classList.toggle('cur', a.dataset.id === en.target.id));
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
    if (yb) { selYear = +yb.dataset.yearPick; renderBars(); return; }
    const so = e.target.closest('[data-sort]');
    if (so) { songSort = so.dataset.sort; renderSongs(); }
  });

  /* ================= ANIMACIONES CON SCROLL (GSAP) ================= */
  function setupScrollFx() {
    if (!G) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      // diario: scroll horizontal anclado
      root.classList.add('has-pin');
      const track = $('#diary'), pinEl = $('#diary-pin');
      const dist = () => Math.max(1, track.scrollWidth - hscroll.clientWidth);
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: pinEl, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => diaryProgress(s.progress)
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
      return () => { root.classList.remove('has-pin'); gsap.set(track, { x: 0 }); diaryProgress(0); };
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
  renderClockTicks();
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
  // al cambiar el tamaño (o entrar/salir de pantalla completa) primero se reajusta el diseño
  // y DESPUÉS se recalculan las animaciones de scroll, para que el diario anclado no quede desfasado
  function relayout() {
    fitMega(); fitFootMega(); measureMarquees(); layoutWall(); fitText($('#feature-title'), 104); fitText($('#drop-title'), 260); fitTitles();
    if (G) ScrollTrigger.refresh();
  }
  if (G) ScrollTrigger.addEventListener('refresh', () => { if (lenis && typeof lenis.resize === 'function') lenis.resize(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  addEventListener('load', () => setTimeout(relayout, 60));
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 180); });
  document.addEventListener('fullscreenchange', () => { clearTimeout(rt); rt = setTimeout(relayout, 320); });
  window.zardy = { lenis, refresh: relayout };
})();
