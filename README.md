#  AI-Powered Personalized Weather & AQI Health Advisory

An AI-powered environmental health advisory system that combines real-time weather and air-quality data with user context to provide personalized, easy-to-understand environmental guidance.

##  Overview

Traditional weather and AQI applications generally provide the same alerts and thresholds to everyone. However, environmental conditions can affect people differently depending on factors such as age group, health conditions, and occupation.

This project addresses this problem by combining:

*  Real-time weather data
*  Real-time Air Quality Index (AQI)
*  User profile information
*  Rule-based environmental risk analysis
*  Personalized context analysis
*  Explainable environmental factors
*  Generative AI-based advisory
*  Historical environmental records

The system converts live environmental conditions into a personalized advisory that explains **what is happening, why it may matter for the user, and what practical steps can be considered.**

---

##  Key Features

###  Live Weather Monitoring

Retrieves current:

* Temperature
* Relative humidity
* Wind speed
* UV index

###  Air Quality Monitoring

Retrieves:

* US AQI
* PM2.5
* PM10

AQI values are categorized into levels such as:

* Good
* Moderate
* Unhealthy for Sensitive Groups
* Unhealthy
* Very Unhealthy
* Hazardous

###  Environmental Risk Engine

The rule-based risk engine analyzes environmental conditions and identifies important factors such as:

* Elevated air pollution
* Poor air quality
* High temperature
* Very high temperature
* High humidity
* Very high humidity
* High wind speed
* Strong winds

###  Personalization

The system considers:

* Age group
* Health condition
* Occupation

Examples include:

* Adult
* Child
* Senior
* Indoor worker
* Outdoor worker
* Athlete
* Asthma
* Respiratory sensitivity

The personalization layer identifies conditions that are particularly relevant to the selected user profile.

###  Explainability

Instead of producing only a risk label, the system explains the environmental and profile-related factors contributing to the advisory.

Example:

> Poor air quality is an important environmental factor.

> Outdoor work can increase the duration of exposure to polluted air.

### 🤖 AI Advisory

A Generative AI model produces a short, plain-English environmental advisory based on:

* Current weather
* AQI
* PM2.5
* PM10
* User profile
* Environmental factors
* Personalized factors

The AI is instructed to provide general environmental guidance rather than medical diagnosis or treatment.

###  History

The backend stores previous advisory requests and environmental conditions using SQLite.

---

##  System Architecture

```text
                 ┌─────────────────────┐
                 │   User Profile      │
                 │ Age / Health / Job   │
                 └──────────┬──────────┘
                            │
                            ▼
┌──────────────────────────────────────────────┐
│             Live Environmental Data          │
│                                              │
│ Weather API              Air Quality API     │
│ Temperature              AQI                 │
│ Humidity                 PM2.5               │
│ Wind Speed               PM10                │
│ UV Index                                      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Risk Engine     │
              │                  │
              │ Environmental    │
              │ classification   │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Personalization  │
              │                  │
              │ Profile-specific │
              │ factors          │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Explainability   │
              │                  │
              │ Why this matters │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │   Generative AI  │
              │                  │
              │ Personalized     │
              │ Advisory         │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Flask Backend    │
              │                  │
              │ API + SQLite     │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    Dashboard     │
              └──────────────────┘
```

---

##  Project Structure

```text
AI-Weather-AQI-Health-Advisory/
│
├── README.md
├── .gitignore
├── requirements.txt
│
├── app.py
├── database.py
├── weather.py
├── aqi.py
│
├── engine/
│   ├── __init__.py
│   ├── risk_engine.py
│   ├── personalization.py
│   ├── explainability.py
│   ├── advisory.py
│   └── pipeline.py
│
├── notebooks/
│   ├── risk_engine.ipynb
│   ├── personalization.ipynb
│   ├── advisory.ipynb
│   └── ai_pipeline.ipynb
│
└── screenshots/
```

---

##  Team Responsibilities

| Component             | Responsibility                                               |
| --------------------- | ------------------------------------------------------------ |
| Live Weather & AQI    | Weather, AQI and geolocation APIs                            |
| AI & Personalization  | Risk engine, personalization, explainability and AI advisory |
| Backend & Integration | Flask API, SQLite history and system integration             |
| Frontend              | Dashboard and user interface                                 |

---

##  AI Processing Pipeline

The AI component follows this pipeline:

```text
Live Weather + AQI
        ↓
Environmental Analysis
        ↓
User Profile
        ↓
Personalization
        ↓
Explainability
        ↓
Generative AI
        ↓
Personalized Advisory
```

The main pipeline function is:

```python
generate_personalized_advisory(
    weather,
    air,
    profile
)
```

The dashboard-ready function is:

```python
get_dashboard_advisory(
    weather,
    air,
    profile
)
```

---

## 🔌 API Endpoint

The backend provides a combined advisory endpoint:

```text
GET /api/advisory
```

Example:

```text
/api/advisory?city=Indore&age_group=adult&health_condition=asthma&occupation=outdoor%20worker
```

The response contains:

* Weather information
* Air-quality information
* Environmental attention level
* Personalized priority
* Advisory summary
* Explanation
* Recommendations
* Environmental factors
* Personalized factors

---

##  Example Response

```json
{
    "city": "Indore",
    "weather": {
        "temperature": 22.7,
        "humidity": 94,
        "wind_speed": 14.8,
        "uv_index": 0.0
    },
    "air_quality": {
        "aqi": 70,
        "pm25": 22.2,
        "pm10": 33.9
    },
    "attention_level": "Low",
    "risk_level": "normal",
    "environmental_factors": [
        "Very high humidity"
    ],
    "personalized_factors": [
        "Prolonged exposure to very high humidity"
    ],
    "advisory": "Current environmental conditions may make prolonged outdoor exposure less comfortable.",
    "recommendations": [
        "Take regular breaks in a comfortable environment.",
        "Consider the current environmental conditions before prolonged outdoor work.",
        "Check updated weather and air-quality conditions before outdoor activities."
    ]
}
```

---

## 🛠️ Technologies Used

### Backend

* Python
* Flask
* Flask-CORS
* SQLite
* SQLAlchemy

### AI / Machine Learning

* Python
* Rule-based environmental risk engine
* Generative AI
* Groq API

### APIs

* Open-Meteo Weather API
* Open-Meteo Air Quality API
* Open-Meteo Geocoding API

### Development

* Jupyter Notebook
* VS Code
* Git
* GitHub

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
cd AI-Weather-AQI-Health-Advisory
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```text
GROQ_API_KEY=your_groq_api_key
```

Do not upload the `.env` file to GitHub.

Run the backend:

```bash
python app.py
```

The Flask server should start at:

```text
http://127.0.0.1:5000
```

---

##  Environment Variables

The project uses the following environment variable:

```text
GROQ_API_KEY
```

The API key is loaded using `python-dotenv`.

Example:

```python
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
```

---

##  Security

API keys and other secrets must never be committed to the repository.

The `.gitignore` file should contain:

```text
.env
__pycache__/
*.pyc
```

---

## ⚠️ Disclaimer

This project provides general environmental information and guidance for demonstration purposes. It is not intended to diagnose medical conditions, replace professional medical advice, or prescribe treatment.

---

##  Future Scope

Potential improvements include:

* Regional-language advisories
* More detailed environmental trend analysis
* Personalized notification alerts
* Mobile application
* Location-based push notifications
* Historical AQI and weather visualization
* More user profiles
* Improved explainable AI
* Integration with additional environmental data sources
* Predictive environmental exposure analysis

---

##  Hackathon Goal

The goal of this project is to demonstrate how **real-time environmental data, rule-based reasoning, personalization, explainable AI, and generative AI** can be combined to move beyond generic weather and AQI alerts toward user-specific environmental guidance.

---

##  Project Status

**Hackathon Prototype — In Development**
