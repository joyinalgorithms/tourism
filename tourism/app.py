import os
from cs50 import SQL
from flask import Flask, redirect, render_template, request, session
from flask_session import Session

app = Flask(__name__)

app.config["SESSION PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///tourism.db")


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/preview")
def preview():
    places = db.execute(
        "SELECT id, name, location, category, short_description, long_description, image_url FROM places")

    categories = {}
    for place in places:
        category = place["category"]
        if category not in categories:
            categories[category] = []

        place["description"] = place["short_description"]

        image_urls = [place["image_url"]]
        base_filename = os.path.basename(place["image_url"]).rsplit('.', 1)[0]
        static_images_path = os.path.join(app.root_path, 'static', 'images')

        for i in range(1, 4):
            extra_image = f"{base_filename}{i}.jpg"
            extra_image_path = os.path.join(static_images_path, extra_image)
            if os.path.exists(extra_image_path):
                image_urls.append(f"/static/images/{extra_image}")

        place["image_urls"] = image_urls
        categories[category].append(place)

    return render_template("preview.html", categories=categories)


@app.route("/destination/<int:place_id>")
def destination(place_id):
    place = db.execute("SELECT * FROM places WHERE id = ?", place_id)[0]

    image_urls = [place["image_url"]]
    base_filename = os.path.basename(place["image_url"]).rsplit('.', 1)[0]
    static_images_path = os.path.join(app.root_path, 'static', 'images')

    for i in range(1, 5):
        extra_image = f"{base_filename}{i}.jpg"
        extra_image_path = os.path.join(static_images_path, extra_image)
        if os.path.exists(extra_image_path):
            image_urls.append(f"/static/images/{extra_image}")

    place["image_urls"] = image_urls

    places = db.execute("SELECT * FROM places")
    activities = db.execute("""
        SELECT a.name, a.icon FROM activities a
        JOIN place_activities pa ON a.id = pa.activity_id
        WHERE pa.place_id = ?
    """, place_id)
    highlights = db.execute("SELECT highlight FROM highlights WHERE place_id = ?", place_id)
    seasons = db.execute(
        "SELECT season_name, description FROM seasons WHERE place_id = ?", place_id)
    tips = db.execute(
        "SELECT tip_type, content FROM transportation_tips WHERE place_id = ?", place_id)

    return render_template(
        "destination.html",
        place=place,
        places=places,
        activities=activities,
        highlights=highlights,
        seasons=seasons,
        tips=tips
    )


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")
