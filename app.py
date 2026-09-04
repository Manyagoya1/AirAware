import streamlit as st
from main import get_city_data


st.title("🌤️ Weather & AQI Health Advisory")

city = st.text_input("Enter your city", "Mumbai")

st.subheader("👤 Your Health Profile")

age_group = st.selectbox(
    "Age Group",
    ["Child", "Adult", "Senior"]
)

health_condition = st.selectbox(
    "Health Condition",
    ["None", "Asthma", "Heart Disease", "Allergy"]
)

occupation = st.selectbox(
    "Occupation",
    ["Indoor Worker", "Outdoor Worker", "Student", "Other"]
)

if st.button("Get Weather"):

    data = get_city_data(city)

    if data is None:

        st.error(
            "Unable to get data. Please check the city name or internet connection."
        )

    else:
        profile = {
            "age_group": age_group,
            "health_condition": health_condition,
            "occupation": occupation
        }        
        st.write("Selected Profile:", profile)
        
        current = data["current"]

        st.subheader(f"📍 {current['location']}")

        st.write("🌡️ Temperature:", current["temperature"], "°C")
        st.write("💧 Humidity:", current["humidity"], "%")
        st.write("💨 Wind Speed:", current["wind_speed"])
        st.write("☀️ UV Index:", current["uv_index"])
        st.write("🟢 US AQI:", current["us_aqi"])
        st.write("🫁 PM2.5:", current["pm25"])
        st.write("🌫️ PM10:", current["pm10"])


        st.subheader("📅 7-Day Temperature History")

        weather_history = data["history"]["weather_history"]

        chart_data = {
            "Date": [],
            "Maximum Temperature": [],
            "Minimum Temperature": []
        }

        for day in weather_history:

            chart_data["Date"].append(day["date"])
            chart_data["Maximum Temperature"].append(
                day["max_temperature"]
            )
            chart_data["Minimum Temperature"].append(
                day["min_temperature"]
            )

        st.line_chart(
            chart_data,
            x="Date",
            y=[
                "Maximum Temperature",
                "Minimum Temperature"
            ]
        )
        st.subheader("🟢 7-Day AQI History")

        aqi_history = data["history"]["aqi_history"]

        aqi_chart_data = {
            "Date": [],
            "US AQI": []
        }

        for day in aqi_history:

            aqi_chart_data["Date"].append(day["date"])
            aqi_chart_data["US AQI"].append(day["us_aqi"])

        st.line_chart(
            aqi_chart_data,
            x="Date",
            y="US AQI"
        )