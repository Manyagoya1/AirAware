import requests

def get_aqi(latitude, longitude):

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "us_aqi,pm2_5,pm10"
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
            "aqi": current["us_aqi"],
            "pm25": current["pm2_5"],
            "pm10": current["pm10"]
        }

    except requests.exceptions.RequestException:
        print("❌ Unable to fetch AQI data.")
        return None

def get_aqi_history(latitude, longitude):

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "past_days": 7,
        "forecast_days": 0,
        "hourly": "us_aqi,pm2_5,pm10",
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

        hourly = data["hourly"]

        times = hourly["time"]
        aqi_values = hourly["us_aqi"]
        pm25_values = hourly["pm2_5"]
        pm10_values = hourly["pm10"]

        daily_data = {}

        for i in range(len(times)):

            date = times[i].split("T")[0]

            if date not in daily_data:
                daily_data[date] = {
                    "us_aqi": [],
                    "pm25": [],
                    "pm10": []
                }

            if aqi_values[i] is not None:
                daily_data[date]["us_aqi"].append(aqi_values[i])

            if pm25_values[i] is not None:
                daily_data[date]["pm25"].append(pm25_values[i])

            if pm10_values[i] is not None:
                daily_data[date]["pm10"].append(pm10_values[i])

        history = []

        for date, values in daily_data.items():

            history.append({
                "date": date,
                "aqi": round(sum(values["us_aqi"]) / len(values["us_aqi"]), 1),
                "pm25": round(sum(values["pm25"]) / len(values["pm25"]), 1),
                "pm10": round(sum(values["pm10"]) / len(values["pm10"]), 1)
            })

        return history

    except requests.exceptions.RequestException:
        print("❌ Unable to fetch AQI history.")
        return None