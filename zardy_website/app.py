from flask import Flask, render_template, jsonify, url_for
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# ---------------------------------------------------------------------------
# Todos los datos de la página salen de aquí (la web y /api/artist).
# Para agregar un lanzamiento nuevo: copia un bloque y ponlo al inicio de RELEASES.
#   kind:   'album' | 'ep' | 'single' | 'versions'
#   date:   'AAAA-MM-DD' (opcional; si falta solo se usa el año)
#   cover:  URL de Spotify o ruta dentro de /static (opcional; si falta se dibuja una)
#   local:  portada de respaldo dentro de /static (se usa si la URL falla)
#   album:  ID de Spotify del álbum/sencillo (para el reproductor y el enlace)
#   tracks: n = nombre, t = duración, sp = ID de Spotify de la canción, feat = colaborador
# ---------------------------------------------------------------------------

LISTENERS_K = 534.9          # oyentes mensuales en Spotify (en miles)
LISTENERS_CHECKED = '2026-10'


def cdn(image_hash):
    return f'https://i.scdn.co/image/ab67616d0000b273{image_hash}'


RELEASES = [
    {"id": "shower", "title": "shower", "year": 2026, "date": "2026-10-09", "kind": "single",
     "cover": cdn("4428ea7d1ba5ac3eb440554d"), "album": "4xQuPj5H37NkFncHUXdUQQ",
     "tracks": [{"n": "shower", "t": "1:43", "sp": "7an6vKPvKPdLpLqiFMTwnn", "feat": "Hyso"}]},

    {"id": "contemplating", "title": "contemplating", "year": 2026, "date": "2026-09-10", "kind": "album",
     "cover": cdn("f31dd6f0d443e3e7525fd34f"), "local": "img/contemplating.jpg", "album": "0pCTVdNBVzUOoW4JF9xZG3",
     "tracks": [
         {"n": "bunga senja", "t": "2:02", "sp": "6NygGSA64INYsOtVF6mkBK"},
         {"n": "school", "t": "2:04", "sp": "7sjhhKiPDI5qPu3hrroVb2"},
         {"n": "chase me", "t": "3:12", "sp": "3qkr9aQV0mrVGgiJ3T6Xgc", "feat": "Luxii"},
         {"n": "kredon", "t": "2:03", "sp": "2kkrvWr4DV2SHYMlgUpgoR"},
         {"n": "22aug1209", "t": "1:36", "sp": "0W90UMmWVMG9dZlDXxe8q2"},
         {"n": "poor soul", "t": "3:29", "sp": "1i6YrMvQ7FtL2LEdnqg4wS"},
         {"n": "nausea", "t": "0:55", "sp": "3D2k70OTcAvZUtRJIU4lVa"},
         {"n": "outta place", "t": "2:06", "sp": "6cjrsD5KAktgfuj9lX1v11"},
         {"n": "where", "t": "1:45", "sp": "7x8zeqJn7awzkbGqgXfr11", "feat": "hiroshimal"},
         {"n": "sake", "t": "2:49", "sp": "7DSSaYskHx0A3tRqi8Huwj", "feat": "jaylu"},
         {"n": "fate", "t": "2:02", "sp": "3aFWlx7CRnJb46ARBoSx6l"},
     ]},

    {"id": "number1", "title": "number1", "year": 2026, "date": "2026-08-18", "kind": "single",
     "cover": cdn("977dcd75ace604780f25a963"), "local": "img/number1.jpg", "album": "3PMKAOJmBj9Pl05yG6uQMn",
     "tracks": [{"n": "number1", "t": "3:01", "sp": "5HSnVCJ48TUNbdRGZ4W2zC"}]},

    {"id": "bonus", "title": "it be okay (bonus)", "year": 2026, "date": "2026-08-04", "kind": "versions",
     "cover": cdn("5df8179dc6399b36c1e8c233"), "local": "img/bonus.jpg", "album": "5zUpXOkXinFD0DCjoryGQ6",
     "tracks": [
         {"n": "it be okay (sped up)", "t": "3:23", "sp": "2ybNHCVEhTnbMJUTF1TbBk"},
         {"n": "it be okay (instrumental)", "t": "3:38", "sp": "5AFu2kd3DEDzmN4GlBQrzK"},
         {"n": "it be okay (slowed)", "t": "3:56", "sp": "2UvxkRrfPEpbmwHBSsDBcu"},
     ]},

    {"id": "kidiused", "title": "kid i used to be", "year": 2026, "date": "2026-07-21", "kind": "single",
     "cover": cdn("1b06134bd01b4581ddf41e2b"), "local": "img/kidiused.jpg", "album": "2yA8EmkfguFU0pvZazcnNe",
     "tracks": [{"n": "kid i used to be", "t": "2:15", "sp": "25qrc0vc2ZcKKrWRt2kOWA"}]},

    {"id": "iboa", "title": "it be okay", "year": 2026, "date": "2026-07-08", "kind": "single",
     "cover": cdn("70d46e4919d31f0cc7e051b9"), "album": "1JnAp38yBCQ5JMBYf2Ebjz",
     "tracks": [{"n": "it be okay", "t": "3:39", "sp": "3BGOs6blumGyUbkkTjBNLa"}]},

    {"id": "hikikomori", "title": "hikikomori", "year": 2026, "date": "2026-05-25", "kind": "single",
     "cover": cdn("e7fd2c48412d996fcd3d9fed"), "album": "7vIBuyfb0urGd1Ae92Oruu",
     "tracks": [{"n": "hikikomori", "t": "2:31", "sp": "5d8nKt7EkS6gJOc0Wj2Tvl"}]},

    {"id": "babysteps", "title": "baby steps.", "year": 2026, "date": "2026-03-22", "kind": "album",
     "cover": cdn("8d5b5b79f1a0d18f66d27333"), "album": "3t7Jpd0a0Ix44QJE63w53n",
     "tracks": [
         {"n": "Value (scene1)", "t": "0:36", "sp": "5Sy3BGHnIpl6FfPX8rKxYh"},
         {"n": "Rotom", "t": "1:38", "sp": "45YMQ6C3rPYmSToGtQotji"},
         {"n": "Summer (scene2)", "t": "0:51", "sp": "1pU4s3dEQNzQn7kCgjL8Ri"},
         {"n": "ISO", "t": "1:19", "sp": "4xRrD3dBOKVO2QVBNuL4y3"},
         {"n": "Goodnight", "t": "2:35", "sp": "7jXYRIiKKuHmymmaozADYF", "feat": "Pongus"},
         {"n": "I Don't Care", "t": "3:22", "sp": "3OZNPrnEicsjbGZ2A59oHO", "feat": "Pongus"},
         {"n": "DITTO", "t": "2:29", "sp": "6WjFK9DTXi6C5x5SjgKRWN"},
         {"n": "Optimist", "t": "1:45", "sp": "441qkE7EP2y9Tx45EgUBGM"},
         {"n": "1964", "t": "3:09", "sp": "5Tnbz9rXs4P9M5PFd4VwI1"},
     ]},

    {"id": "deardiary", "title": "dear diary,", "year": 2026, "kind": "ep",
     "cover": "img/deardiary.jpg", "tracks": []},
    {"id": "chronic", "title": "chronic", "year": 2026, "kind": "single",
     "cover": "img/chronic.jpg", "tracks": [{"n": "chronic"}]},
    {"id": "comehome", "title": "come home", "year": 2026, "kind": "single",
     "cover": "img/comehome.jpg", "tracks": [{"n": "come home"}]},
    {"id": "dontplay", "title": "don't play", "year": 2026, "kind": "single",
     "tracks": [{"n": "don't play", "t": "2:02"}]},
    {"id": "grow", "title": "Grow", "year": 2026, "kind": "single",
     "tracks": [{"n": "Grow", "t": "1:55"}]},
    {"id": "katana", "title": "Cult of katana", "year": 2025, "kind": "single",
     "tracks": [{"n": "Cult of katana", "t": "1:51"}]},
    {"id": "perigo", "title": "Perigo Noturno (2021 - Remasterizado)", "year": 2021, "kind": "single",
     "tracks": [{"n": "Perigo Noturno (2021 - Remasterizado)", "t": "2:41"}]},
]

ARTIST = {
    "name": "zardy",
    "kana": "ザルディ",
    "spotify_id": "5OylQa5tfrpPvkZLoeHPDh",
    "listeners_k": LISTENERS_K,
    "listeners_checked": LISTENERS_CHECKED,
    "photo": "https://i.scdn.co/image/ab6761610000e5eb261db1a4813a539df598d22e",
    # Solo Spotify y TikTok están verificados. Agrega más perfiles aquí cuando los tengas.
    "socials": [
        {"name": "spotify", "url": "https://open.spotify.com/artist/5OylQa5tfrpPvkZLoeHPDh"},
        {"name": "tiktok", "url": "https://www.tiktok.com/@zardyeoeo", "handle": "@zardyeoeo"},
    ],
    # Búsquedas (no son perfiles verificados)
    "searches": [
        {"name": "youtube", "url": "https://www.youtube.com/results?search_query=zardy+it+be+okay"},
        {"name": "apple music", "url": "https://music.apple.com/search?term=zardy%20contemplating"},
        {"name": "soundcloud", "url": "https://soundcloud.com/search?q=zardy%20it%20be%20okay"},
    ],
    "releases": RELEASES,
}


def static_url(path):
    """Las rutas relativas se resuelven dentro de /static; las URLs completas se dejan igual."""
    if not path or path.startswith(('http://', 'https://', '/')):
        return path
    return url_for('static', filename=path)

@app.route('/robots.txt')
def robots():
    return "User-agent: *\nAllow: /", 200, {'Content-Type': 'text/plain'}


def artist_payload():
    releases = []
    for r in RELEASES:
        r = dict(r)
        for key in ('cover', 'local'):
            if r.get(key):
                r[key] = static_url(r[key])
        releases.append(r)
    return {**ARTIST, "releases": releases}


@app.route('/')
def home():
    return render_template('index.html', artist=artist_payload())


@app.route('/api/artist')
def get_artist_info():
    return jsonify(artist_payload())
    


if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG') == '1', port=5000)
