from flask import Flask, render_template, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

ARTIST_DATA = {
    "name": "zardy",
    "genre": "Indie Rock / Alt Rock / Corecore",
    "spotify_id": "5OylQa5tfrpPvkZLoeHPDh",
    "stats": {
        "monthly_listeners": "100K+",
        "releases": 8,
        "active_years": "2021–2026"
    },
    "milestone": {
        "label": "100K club",
        "achieved": True
    },
    "socials": {
        "spotify": "https://open.spotify.com/artist/5OylQa5tfrpPvkZLoeHPDh",
        "tiktok": "https://www.tiktok.com/@zardyeoeo"
    },
    "releases": [
        {
            "id": "rel-1",
            "title": "number1",
            "year": 2026,
            "spotify_embed": "https://open.spotify.com/embed/track/number1",
            "tracks": [{"name": "number1", "time": "3:01", "spotify_id": "number1"}]
        },
        {
            "id": "rel-2",
            "title": "it be okay (bonus)",
            "year": 2026,
            "spotify_embed": "https://open.spotify.com/embed/track/itbeokaybonus",
            "tracks": [
                {"name": "it be okay (sped up)", "time": "3:23"},
                {"name": "it be okay (instrumental)", "time": "3:38"},
                {"name": "it be okay (slowed)", "time": "3:56"}
            ]
        },
        {
            "id": "rel-3",
            "title": "it be okay",
            "year": 2026,
            "tracks": [{"name": "it be okay", "time": "3:38"}]
        },
        {
            "id": "rel-4",
            "title": "don't play",
            "year": 2026,
            "tracks": [{"name": "don't play", "time": "2:02"}]
        },
        {
            "id": "rel-5",
            "title": "Rotom",
            "year": 2026,
            "tracks": [{"name": "Rotom", "time": "1:38"}]
        },
        {
            "id": "rel-6",
            "title": "Grow",
            "year": 2026,
            "tracks": [{"name": "Grow", "time": "1:55"}]
        },
        {
            "id": "rel-7",
            "title": "Cult of katana",
            "year": 2025,
            "tracks": [{"name": "Cult of katana", "time": "1:51"}]
        },
        {
            "id": "rel-8",
            "title": "Perigo Noturno (2021 - Remasterizado)",
            "year": 2021,
            "tracks": [{"name": "Perigo Noturno (2021 - Remasterizado)", "time": "2:41"}]
        }
    ]
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/artist')
def get_artist_info():
    return jsonify(ARTIST_DATA)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
