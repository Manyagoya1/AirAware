import requests

def get_coordinates(city):

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        if "results" not in data:
            return None

        result = data["results"][0]

        return result["latitude"], result["longitude"]

    except requests.exceptions.RequestException:
        print("❌ Unable to find city. Please check your internet connection.")
        return None

def get_weather(latitude, longitude):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        current = data["current"]

        return {
            "temperature": current["temperature_2m"],
            "humidity": current["relative_humidity_2m"],
            "wind_speed": current["wind_speed_10m"],
            "uv_index": current["uv_index"]
        }

    except requests.exceptions.RequestException:
        print("❌ Unable to fetch weather data.")
        return None

def get_weather_by_city(city):

    coordinates = get_coordinates(city)

    if coordinates is None:
        return None

    latitude, longitude = coordinates

    weather = get_weather(latitude, longitude)

    return weather

def get_weather_history(latitude, longitude):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "past_days": 7,
        "forecast_days": 0,
        "daily": "temperature_2m_max,temperature_2m_min",
        "timezone": "auto"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        daily = data["daily"]

        history = []

        for i in range(len(daily["time"])):
            history.append({
                "date": daily["time"][i],
                "max_temperature": daily["temperature_2m_max"][i],
                "min_temperature": daily["temperature_2m_min"][i]
            })

        return history

    except requests.exceptions.RequestException:
        print("❌ Unable to fetch historical weather data.")
        return None
    