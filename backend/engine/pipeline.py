
from engine.risk_engine import analyze_environment
from engine.personalization import personalize_context
from engine.explainability import generate_explanation
from engine.advisory import create_advisory


def generate_personalized_advisory(weather, air, profile):

    # 1. Analyze environmental conditions
    environment = analyze_environment(
        weather,
        air
    )

    # 2. Apply user-specific personalization
    personalization = personalize_context(
        environment,
        profile
    )

    # 3. Generate explanation
    explanation = generate_explanation(
        environment,
        personalization
    )

    # 4. Generate Groq advisory
    advisory = create_advisory(
        environment,
        personalization
    )

    # Return everything needed by the dashboard
    return {
        "environment": environment,
        "personalization": personalization,
        "explanation": explanation,
        "advisory": advisory
    }

def get_dashboard_advisory(weather, air, profile):

    result = generate_personalized_advisory(
        weather,
        air,
        profile
    )

    environment = result["environment"]
    personalization = result["personalization"]
    explanation = result["explanation"]
    advisory = result["advisory"]

    return {
        "aqi": environment["aqi"],
        "aqi_category": environment["aqi_category"],

        "temperature": environment["temperature"],
        "temperature_category": environment["temperature_category"],

        "humidity": environment["humidity"],
        "humidity_category": environment["humidity_category"],

        "wind_speed": environment["wind_speed"],

        "attention_level": environment["environmental_attention"],

        "priority": personalization["priority"],

        "why_it_matters": advisory["why_it_matters"],

        "summary": advisory["summary"],

        "recommendations": advisory["recommendations"],

        "environmental_factors": environment["factors"],

        "personalized_factors": personalization["personalized_factors"]        
    }
