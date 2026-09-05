
def generate_explanation(environment, personalization):

    attention = environment.get("environmental_attention", "Low")

    aqi = environment.get("aqi")
    temperature = environment.get("temperature")
    humidity = environment.get("humidity")

    factors = environment.get("factors", [])
    personalized_factors = personalization.get(
        "personalized_factors", []
    )

    explanations = []

    # Environmental explanation
    if aqi is not None and aqi > 150:
        explanations.append(
            "Poor air quality is a major environmental factor."
        )
    elif aqi is not None and aqi > 100:
        explanations.append(
            "Elevated air pollution is an important environmental factor."
        )

    if temperature is not None and temperature >= 35:
        explanations.append(
            "Very high temperature increases heat exposure."
        )
    elif temperature is not None and temperature >= 30:
        explanations.append(
            "High temperature may increase heat exposure."
        )

    if humidity is not None and humidity > 80:
        explanations.append(
            "Very high humidity can make hot conditions feel more uncomfortable."
        )
    elif humidity is not None and humidity > 60:
        explanations.append(
            "High humidity adds to the discomfort of warm conditions."
        )

    # Personalization explanation
    health_condition = personalization.get(
        "health_condition", "none"
    )

    occupation = personalization.get(
        "occupation", "indoor worker"
    )

    age_group = personalization.get(
        "age_group", "adult"
    )

    if health_condition.lower() == "asthma":
        if aqi is not None and aqi >= 100:
            explanations.append(
                "Air pollution is particularly relevant because the profile includes asthma."
            )

    if occupation.lower() == "outdoor worker":
        if aqi is not None and aqi >= 100:
            explanations.append(
                "Outdoor work can increase the duration of exposure to polluted air."
            )

        if temperature is not None and temperature >= 30:
            explanations.append(
                "Outdoor work can also increase exposure to high temperatures."
            )

    if age_group.lower() in ["child", "senior"]:
        if aqi is not None and aqi >= 100:
            explanations.append(
                "The profile includes an age group that may require more cautious environmental guidance."
            )

        if temperature is not None and temperature >= 35:
            explanations.append(
                "The profile may require greater caution during extreme heat."
            )

    return {
        "attention_level": attention,
        "environmental_factors": factors,
        "personalized_factors": personalized_factors,
        "explanation": explanations
    }
