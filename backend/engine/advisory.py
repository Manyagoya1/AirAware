
from dotenv import load_dotenv
from groq import Groq
import json
import os

load_dotenv()

# ============================================================
# CREATE PERSONALIZED ADVISORY
# ============================================================

def create_advisory(environment, personalization):
    """
    Generate a personalized environmental health advisory
    using the Groq LLM.
    """

    # --------------------------------------------------------
    # Get API key
    # --------------------------------------------------------

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError(
            "GROQ_API_KEY is not set. "
            "Please set your Groq API key first."
        )

    # Create Groq client
    client = Groq(api_key=api_key)


    # --------------------------------------------------------
    # Extract environmental information
    # --------------------------------------------------------

    temperature = environment.get("temperature")
    humidity = environment.get("humidity")
    wind_speed = environment.get("wind_speed")

    aqi = environment.get("aqi")
    pm25 = environment.get("pm25")
    pm10 = environment.get("pm10")

    aqi_category = environment.get("aqi_category")
    temperature_category = environment.get("temperature_category")
    humidity_category = environment.get("humidity_category")

    environmental_attention = environment.get(
        "environmental_attention"
    )


    # --------------------------------------------------------
    # Extract user profile
    # --------------------------------------------------------

    age_group = personalization.get(
        "age_group",
        "adult"
    )

    health_condition = personalization.get(
        "health_condition",
        "none"
    )

    occupation = personalization.get(
        "occupation",
        "indoor worker"
    )

    personalized_factors = personalization.get(
        "personalized_factors",
        []
    )

    priority = personalization.get(
        "priority",
        "normal"
    )


    # --------------------------------------------------------
    # Convert factors into readable text
    # --------------------------------------------------------

    factors_text = ", ".join(personalized_factors)

    if not factors_text:
        factors_text = "No major personalized factors identified."


    # ========================================================
    # LLM PROMPT
    # ========================================================

    prompt = f"""
You are an environmental health advisory assistant.

Your task is to generate a short, clear and practical
environmental advisory for a user based ONLY on the
information provided below.

============================================================
ENVIRONMENTAL CONDITIONS
============================================================

Temperature: {temperature} °C
Humidity: {humidity} %
Wind speed: {wind_speed} km/h

AQI: {aqi}
PM2.5: {pm25}
PM10: {pm10}

Air quality category:
{aqi_category}

Temperature category:
{temperature_category}

Humidity category:
{humidity_category}

Environmental attention level:
{environmental_attention}


============================================================
USER PROFILE
============================================================

Age group:
{age_group}

Health condition:
{health_condition}

Occupation:
{occupation}


============================================================
PERSONALIZED FACTORS
============================================================

{factors_text}


============================================================
PRIORITY
============================================================

{priority}


============================================================
IMPORTANT RULES
============================================================

1. Do not diagnose any disease.

2. Do not prescribe medication.

3. Do not recommend specific medicines or dosages.

4. Do not invent medical facts.

5. Do not claim that the user is medically at risk.

6. Give general environmental exposure-reduction guidance.

7. Explain why the current environmental conditions
   are relevant to this particular user profile.

8. Consider:
   - AQI
   - PM2.5
   - PM10
   - temperature
   - humidity
   - wind speed
   - occupation
   - health condition
   - age group

9. Keep the language simple and understandable.

10. Keep the response concise.

11. Do not mention that you are an AI.

12. Do not introduce environmental values that were
    not provided.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{{
    "summary": "Short overall advisory.",
    "why_it_matters": "Explain why these conditions matter for this user.",
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3"
    ]
}}
"""


    # ========================================================
    # SEND REQUEST TO GROQ
    # ========================================================

    try:

        response = client.chat.completions.create(

            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate concise environmental "
                        "health guidance."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.3,

            response_format={
                "type": "json_object"
            }
        )


        # ----------------------------------------------------
        # Extract response
        # ----------------------------------------------------

        result = response.choices[0].message.content


        # ----------------------------------------------------
        # Convert JSON string to Python dictionary
        # ----------------------------------------------------

        advisory = json.loads(result)

        return advisory


    # --------------------------------------------------------
    # Handle invalid JSON
    # --------------------------------------------------------

    except json.JSONDecodeError:

        return {
            "summary": result,
            "why_it_matters": "",
            "recommendations": []
        }

    # --------------------------------------------------------
    # Handle Groq/API errors
    # --------------------------------------------------------

    except Exception as e:

        return {
            "summary": "Unable to generate advisory.",
            "why_it_matters": "",
            "recommendations": [],
            "error": str(e)
        }
