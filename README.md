# Weather + AQI API Layer

This module provides live weather data, live air-quality data, and 7-day historical data for a given city.

## 1. Features

* City name → latitude and longitude
* Current weather data
* Current US AQI data
* PM2.5 and PM10
* 7-day historical weather
* 7-day historical AQI
* API error handling
* One simple function for the complete dataset

## 2. Installation

Install the required Python package:

```bash
pip install -r requirements.txt
```

## 3. Main Function

The main function for other team members is:

```python
from main import get_city_data

data = get_city_data("Mumbai")
```

This returns current and historical data for Mumbai.

## 4. Current Data

Access current weather and AQI:

```python
current = data["current"]

print(current["temperature"])
print(current["humidity"])
print(current["wind_speed"])
print(current["uv_index"])
print(current["us_aqi"])
print(current["pm25"])
print(current["pm10"])
```

### Current fields

| Field         | Description                   |
| ------------- | ----------------------------- |
| `location`    | City name                     |
| `latitude`    | Latitude of the city          |
| `longitude`   | Longitude of the city         |
| `temperature` | Current temperature in °C     |
| `humidity`    | Current relative humidity (%) |
| `wind_speed`  | Current wind speed            |
| `uv_index`    | Current UV index              |
| `us_aqi`      | Current US AQI                |
| `pm25`        | PM2.5 concentration           |
| `pm10`        | PM10 concentration            |

## 5. Historical Data

Access historical weather:

```python
weather_history = data["history"]["weather_history"]
```

Each entry contains:

```python
{
    "date": "2026-09-04",
    "max_temperature": 29.6,
    "min_temperature": 24.8
}
```

Access historical AQI:

```python
aqi_history = data["history"]["aqi_history"]
```

Each entry contains:

```python
{
    "date": "2026-09-04",
    "us_aqi": 57.3,
    "pm25": 12.2,
    "pm10": 22.7
}
```

## 6. Complete Data Structure

The main function returns:

```python
{
    "current": {
        "location": "...",
        "latitude": 0.0,
        "longitude": 0.0,
        "temperature": 0.0,
        "humidity": 0,
        "wind_speed": 0.0,
        "uv_index": 0.0,
        "us_aqi": 0,
        "pm25": 0.0,
        "pm10": 0.0
    },

    "history": {
        "location": "...",

        "weather_history": [
            {
                "date": "...",
                "max_temperature": 0.0,
                "min_temperature": 0.0
            }
        ],

        "aqi_history": [
            {
                "date": "...",
                "us_aqi": 0.0,
                "pm25": 0.0,
                "pm10": 0.0
            }
        ]
    }
}
```

## 7. Example

```python
from main import get_city_data

data = get_city_data("Mumbai")

if data:
    print("Temperature:", data["current"]["temperature"], "°C")
    print("US AQI:", data["current"]["us_aqi"])
    print("PM2.5:", data["current"]["pm25"])

    print("\n7-Day Weather:")
    print(data["history"]["weather_history"])

    print("\n7-Day AQI:")
    print(data["history"]["aqi_history"])
```

## 8. Important AQI Note

The AQI value provided by this module is **US AQI**, not India's National Air Quality Index (NAQI).

The field is intentionally named:

```python
us_aqi
```

to make this distinction clear.

## 9. API Sources

Weather and geocoding data are obtained from Open-Meteo.

Air-quality data are obtained from the Open-Meteo Air Quality API.

No API key is required for the current implementation.

## 10. Team Integration

Other team members should normally use only:

```python
from main import get_city_data

data = get_city_data("City Name")
```

They do not need to directly call the individual weather or AQI functions.

The returned data can be used by:

* Streamlit dashboard
* Personalized AI advisory
* Historical charts
* Alert generation
* User health-profile analysis
