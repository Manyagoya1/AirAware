
def classify_aqi(aqi):
    """
    Classifies AQI into a general environmental category.
    """

    if aqi is None:
        return "Unknown"

    if aqi <= 50:
        return "Good"

    elif aqi <= 100:
        return "Moderate"

    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"

    elif aqi <= 200:
        return "Unhealthy"

    elif aqi <= 300:
        return "Very Unhealthy"

    else:
        return "Hazardous"


def classify_temperature(temperature):
    """
    Classifies temperature into a general environmental category.
    """

    if temperature is None:
        return "Unknown"

    if temperature < 25:
        return "Comfortable"

    elif temperature < 30:
        return "Warm"

    elif temperature < 35:
        return "Hot"

    else:
        return "Very Hot"


def classify_humidity(humidity):
    """
    Classifies relative humidity.
    """

    if humidity is None:
        return "Unknown"

    if humidity < 30:
        return "Low"

    elif humidity <= 60:
        return "Comfortable"

    elif humidity <= 80:
        return "High"

    else:
        return "Very High"


def identify_factors(aqi, temperature, humidity, wind_speed):

    factors = []

    #Air Quality
    if aqi is not None:

        if aqi > 150:
            factors.append("Poor air quality")

        elif aqi > 100:
            factors.append("Elevated air pollution")

    #Temperature
    if temperature is not None:

        if temperature >= 35:
            factors.append("Very high temperature")

        elif temperature >= 30:
            factors.append("High temperature")

    #Humidity
    if humidity is not None:

        if humidity > 80:
            factors.append("Very high humidity")

        elif humidity > 60:
            factors.append("High humidity")

    #Wind
    if wind_speed is not None:

        if wind_speed >= 40:
            factors.append("Strong winds")

        elif wind_speed >= 25:
            factors.append("High wind speed")
        

    return factors


def calculate_environmental_attention(aqi, temperature, wind_speed):

    score = 0

    # AQI contribution
    if aqi is not None:

        if aqi > 300:
            score += 4

        elif aqi > 200:
            score += 3

        elif aqi > 150:
            score += 2

        elif aqi > 100:
            score += 1

    # Temperature contribution
    if temperature is not None:

        if temperature >= 40:
            score += 3

        elif temperature >= 35:
            score += 2

        elif temperature >= 30:
            score += 1

    # Wind speed is mainly used as an environmental factor.
    # We avoid giving it a strong risk score by itself.
    
    # Environmental attention level
    if score >= 6:
        level = "Very High"

    elif score >= 4:
        level = "High"

    elif score >= 2:
        level = "Moderate"

    else:
        level = "Low"

    return score, level


def analyze_environment(weather, air):

    temperature = weather.get("temperature")
    humidity = weather.get("humidity")
    wind_speed = weather.get("wind_speed")

    aqi = air.get("aqi")
    pm25 = air.get("pm25")
    pm10 = air.get("pm10")

    environmental_score, environmental_attention = \
    calculate_environmental_attention(
        aqi,
        temperature,
        wind_speed
    )

    return {

      "aqi": aqi,

      "aqi_category":
          classify_aqi(aqi),

      "temperature": temperature,

      "temperature_category":
          classify_temperature(temperature),

      "humidity": humidity,

      "humidity_category":
          classify_humidity(humidity),

      "wind_speed": wind_speed,        

      "pm25": pm25,

      "pm10": pm10,

      "environmental_score": environmental_score,    

      "environmental_attention": environmental_attention,
          

      "factors":
          identify_factors(
              aqi,
              temperature,
              humidity,
              wind_speed
          )
    }
