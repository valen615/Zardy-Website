from flask import Flask, render_template, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

ARTIST_DATA = {
    "name": "zardy",
    "genre": "Indie Rock / Alt Rock / Corecore",
    "spotify_id": "5OylQa5tfrpPvkZLoeHPDh",
    "stats": {
        "monthly_listeners": "58.8K",
        "releases": 8,
        "active_years": "2021–2026"
    },
    "socials": {
        "spotify": "https://open.spotify.com/artist/5OylQa5tfrpPvkZLoeHPDh",
        "tiktok": "https://www.tiktok.com/@zardyeoeo"
    },
    "releases": [
        {
            "id": "rel-1",
            "title": "it be okay (bonus)",
            "year": 2026,
            "tracks": [
                {"name": "it be okay (sped up)", "time": "3:23", "spotify_id": "2ybNHCVEhTnbMJUTF1TbBk"},
                {"name": "it be okay (instrumental)", "time": "3:38", "spotify_id": "5AFu2kd3DEDzmN4GlBQrzK"},
                {"name": "it be okay (slowed)", "time": "3:56", "spotify_id": "2UvxkRrfPEpbmwHBSsDBcu"}
            ]
        },
        {
            "id": "rel-2",
            "title": "it be okay",
            "year": 2026,
            "spotify_embed": "https://open.spotify.com/embed/track/3BGOs6blumGyUbkkTjBNLa",
            "tracks": [{"name": "it be okay", "time": "3:39", "spotify_id": "3BGOs6blumGyUbkkTjBNLa"}]
        },
        {
            "id": "rel-3",
            "title": "baby steps.",
            "year": 2026,
            "kind": "Album",
            "spotify_embed": "https://open.spotify.com/embed/album/3t7Jpd0a0Ix44QJE63w53n",
            "tracks": [
                {"name": "Value (scene1)", "time": "0:36"},
                {"name": "Rotom", "time": "1:38"},
                {"name": "Summer (scene2)", "time": "0:51"},
                {"name": "ISO", "time": "1:19"},
                {"name": "Goodnight (feat. Pongus)", "time": "2:35"},
                {"name": "I Don't Care (feat. Pongus)", "time": "3:22"},
                {"name": "DITTO", "time": "2:29"},
                {"name": "Optimist", "time": "1:45"},
                {"name": "1964", "time": "3:09"}
            ]
        },
        {
            "id": "rel-4",
            "title": "don't play",
            "year": 2026,
            "tracks": [{"name": "don't play", "time": "2:02"}]
        },
        {
            "id": "rel-5",
            "title": "Grow",
            "year": 2026,
            "tracks": [{"name": "Grow", "time": "1:55"}]
        },
        {
            "id": "rel-6",
            "title": "number1",
            "year": 2026,
            "tracks": [{"name": "number1", "time": "3:01"}]
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