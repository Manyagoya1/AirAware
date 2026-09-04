from main import get_city_data


data = get_city_data("Mumbai")


if data is not None:

    print("Current AQI:", data["current"]["us_aqi"])

    print("Temperature:", data["current"]["temperature"], "°C")

    print("PM2.5:", data["current"]["pm25"])

    print("7-Day Weather:")
    print(data["history"]["weather_history"])

    print("7-Day AQI:")
    print(data["history"]["aqi_history"])

else:

    print("❌ Could not get data.")