from weather import get_coordinates, get_weather, get_weather_history
from aqi import get_aqi, get_aqi_history

def get_all_data(city):

    coordinates = get_coordinates(city)

    if coordinates is None:
        print("❌ City not found.")
        return None

    latitude, longitude = coordinates

    weather = get_weather(latitude, longitude)

    if weather is None:
        return None

    aqi = get_aqi(latitude, longitude)

    if aqi is None:
        return None

    return {
        "location": city,
        "latitude": latitude,
        "longitude": longitude,

        "temperature": weather["temperature"],
        "humidity": weather["humidity"],
        "wind_speed": weather["wind_speed"],
        "uv_index": weather["uv_index"],

        "us_aqi": aqi["us_aqi"],
        "pm25": aqi["pm25"],
        "pm10": aqi["pm10"]
    }


def get_history_by_city(city):

    coordinates = get_coordinates(city)

    if coordinates is None:
        print("❌ City not found.")
        return None

    latitude, longitude = coordinates

    weather_history = get_weather_history(latitude, longitude)

    if weather_history is None:
        return None

    aqi_history = get_aqi_history(latitude, longitude)

    if aqi_history is None:
        return None

    return {
        "location": city,
        "weather_history": weather_history,
        "aqi_history": aqi_history
    }

def get_city_data(city):

    current_data = get_all_data(city)

    if current_data is None:
        return None

    history_data = get_history_by_city(city)

    if history_data is None:
        return None

    return {
        "current": current_data,
        "history": history_data
    }

if __name__ == "__main__":
    data = get_city_data("Mumbai")
    print(data)