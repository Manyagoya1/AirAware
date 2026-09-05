
def personalize_context(environment, profile):
    """
    Combines environmental conditions with the user's profile
    to determine which factors should receive more attention.
    """

    factors = []

    # --------------------------------
    # Environmental factors
    # --------------------------------

    aqi = environment.get("aqi")
    temperature = environment.get("temperature")
    humidity = environment.get("humidity")
    wind_speed = environment.get("wind_speed")

    if aqi is not None:
        if aqi >= 150:
            factors.append("poor air quality")
        elif aqi >= 100:
            factors.append("elevated air pollution")

    if temperature is not None:
        if temperature >= 35:
            factors.append("very high temperature")
        elif temperature >= 30:
            factors.append("high temperature")

    if humidity is not None:
        if humidity > 80:
            factors.append("very high humidity")
        elif humidity > 60:
            factors.append("high humidity")

    if wind_speed is not None:
        if wind_speed >= 40:
            factors.append("strong winds")
        elif wind_speed >= 25:
            factors.append("high wind speed")

    # --------------------------------
    # User profile
    # --------------------------------

    age_group = profile.get("age_group", "adult")
    health_condition = profile.get("health_condition", "none")
    occupation = profile.get("occupation", "indoor worker")

    # --------------------------------
    # Health-condition personalization
    # --------------------------------

    if health_condition.lower() == "asthma":
        if aqi is not None and aqi >= 100:
            factors.append("respiratory sensitivity")

    elif health_condition.lower() == "respiratory sensitivity":
        if aqi is not None and aqi >= 100:
            factors.append("respiratory sensitivity")

    # --------------------------------
    # Occupation personalization
    # --------------------------------

    if occupation.lower() == "outdoor worker":
        if aqi is not None and aqi >= 100:
            factors.append("prolonged outdoor exposure")

        if temperature is not None and temperature >= 30:
            factors.append("prolonged heat exposure")

    elif occupation.lower() in ["athlete", "outdoor activity"]:
        if aqi is not None and aqi >= 100:
            factors.append("intense outdoor activity")

        if temperature is not None and temperature >= 30:
            factors.append("exercise in high temperature")

    # --------------------------------
    # Age-group personalization
    # --------------------------------

    if age_group.lower() in ["child", "senior"]:
        if aqi is not None and aqi >= 100:
            factors.append("increased sensitivity to poor air quality")

        if temperature is not None and temperature >= 35:
            factors.append("increased sensitivity to extreme heat")

    # --------------------------------
    # Determine priority
    # --------------------------------

    priority = "normal"

    if (
        "respiratory sensitivity" in factors
        or "prolonged outdoor exposure" in factors
        or "intense outdoor activity" in factors
    ):
        priority = "high"

    elif len(factors) >= 3:
        priority = "high"

    return {
        "age_group": age_group,
        "health_condition": health_condition,
        "occupation": occupation,
        "personalized_factors": factors,
        "priority": priority
    }

