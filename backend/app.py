from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db
from datetime import datetime
from engine.pipeline import get_dashboard_advisory
from weather import get_coordinates, get_weather
from aqi import get_aqi


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///history.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize DB with App
db.init_app(app)

# Database Model
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100))
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    wind_speed = db.Column(db.Float)
    aqi = db.Column(db.Integer)
    pm25 = db.Column(db.Float)
    pm10 = db.Column(db.Float)
    risk_level = db.Column(db.String(50))
    advisory = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return jsonify({"message": "Backend is running"})

# ----------------------------------------------------
@app.route("/api/advisory", methods=["GET"])
def get_advisory():

    # -------------------------------
    # 1. Get city
    # -------------------------------

    city = request.args.get("city")

    if not city:
        return jsonify({
            "error": "Query parameter 'city' is required"
        }), 400

    # -------------------------------
    # 2. Get user profile
    # -------------------------------

    age_group = request.args.get(
        "age_group",
        "adult"
    )

    health_condition = request.args.get(
        "health_condition",
        "none"
    )

    occupation = request.args.get(
        "occupation",
        "indoor worker"
    )

    profile = {
        "age_group": age_group,
        "health_condition": health_condition,
        "occupation": occupation
    }

    # -------------------------------
    # 3. Get coordinates
    # MEMBER 2
    # -------------------------------

    coordinates = get_coordinates(city)

    if coordinates is None:
        return jsonify({
            "error": "City not found"
        }), 404

    latitude, longitude = coordinates

    # -------------------------------
    # 4. Get live weather
    # MEMBER 2
    # -------------------------------

    weather = get_weather(
        latitude,
        longitude
    )

    if weather is None:
        return jsonify({
            "error": "Unable to fetch weather data"
        }), 500

    # -------------------------------
    # 5. Get live AQI
    # MEMBER 2
    # -------------------------------

    air_quality = get_aqi(
        latitude,
        longitude
    )

    if air_quality is None:
        return jsonify({
            "error": "Unable to fetch AQI data"
        }), 500

    # -------------------------------
    # 6. AI + PERSONALIZATION
    # MEMBER 3
    # -------------------------------

    result = get_dashboard_advisory(
        weather,
        air_quality,
        profile
    )

    # -------------------------------
    # 7. Save result to History
    # MEMBER 4
    # -------------------------------

    new_record = History(
        city=city,
        temperature=weather.get("temperature"),
        humidity=weather.get("humidity"),
        wind_speed=weather.get("wind_speed"),
        aqi=air_quality.get("aqi"),
        pm25=air_quality.get("pm25"),
        pm10=air_quality.get("pm10"),
        risk_level=result.get("priority"),
        advisory=result.get("summary")
    )

    db.session.add(new_record)
    db.session.commit()

    # -------------------------------
    # 8. Return result to frontend
    # -------------------------------

    return jsonify({
        "city": city,

        "weather": weather,

        "air_quality": air_quality,

        "risk_level": result.get("priority"),

        "attention_level": result.get("attention_level"),

        "advisory": result.get("summary"),

        "why_it_matters": result.get("why_it_matters"),

        "recommendations": result.get("recommendations"),

        "environmental_factors":
            result.get("environmental_factors"),

        "personalized_factors":
            result.get("personalized_factors")
    }), 200
#-----------------------------------------------
# Existing History Routes
# ----------------------------------------------------
@app.route("/api/history", methods=["GET"])
def get_history():
    records = History.query.order_by(History.timestamp.desc()).all()
    return jsonify([{
        "id": r.id,
        "city": r.city,
        "temperature": r.temperature,
        "humidity": r.humidity,
        "wind_speed": r.wind_speed,
        "aqi": r.aqi,
        "pm25": r.pm25,
        "pm10": r.pm10,
        "risk_level": r.risk_level,
        "advisory": r.advisory,
        "timestamp": r.timestamp.isoformat()
    } for r in records])

@app.route("/api/history", methods=["POST"])
def add_history():
    data = request.json
    record = History(
        city=data.get("city"),
        temperature=data.get("temperature"),
        humidity=data.get("humidity"),
        wind_speed=data.get("wind_speed"),
        aqi=data.get("aqi"),
        pm25=data.get("pm25"),
        pm10=data.get("pm10"),
        risk_level=data.get("risk_level"),
        advisory=data.get("advisory")
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({"message": "History saved successfully", "id": record.id}), 201

@app.route("/api/history/<int:id>", methods=["DELETE"])
def delete_history(id):
    record = History.query.get(id)
    if not record:
        return jsonify({"error": "Record not found"}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Record deleted successfully"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)