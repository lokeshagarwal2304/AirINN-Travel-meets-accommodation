from flask import Flask, render_template, jsonify, request
import json
import random
from datetime import datetime, timedelta
import re

app = Flask(__name__)

# Enhanced bilingual chatbot training data
CHATBOT_TRAINING_DATA = {
    "en": {
        "greetings": [
            "Hello! I'm AirBot, your airline data assistant! ✈️",
            "Hey there, Captain! Ready to explore flight data? 🚁",
            "Welcome aboard! How can I help you with airline insights today? 🛫",
            "Hi! I'm here to help you navigate the skies of data! 🌤️"
        ],
        "route_questions": [
            "The SYD-MEL route is performing exceptionally well with 1,247 bookings and +12% growth! 📈",
            "Based on current data, I'd recommend focusing on the Sydney-Melbourne corridor - it's your golden route! ✨",
            "The Brisbane-Sydney route shows strong potential with +15% growth. Perfect for expansion! 🎯",
            "Melbourne-Brisbane is gaining momentum. Consider increasing your marketing efforts there! 🚀"
        ],
        "pricing_advice": [
            "Weekend rates can be increased by 15-20% based on current demand patterns! 💰",
            "I'm seeing price sensitivity on weekday flights - consider promotional rates! 🏷️",
            "Your current pricing is competitive, but there's room for 8-12% increase on premium routes! 📊",
            "Holiday season is approaching - time to implement surge pricing strategies! 🎄"
        ],
        "weather_insights": [
            "Sunny weather in Sydney is boosting bookings by 15%! Perfect time to promote outdoor activities! ☀️",
            "Rainy conditions in Melbourne are reducing demand by 8%. Consider indoor attraction partnerships! 🌧️",
            "Storm warnings in Perth may affect weekend bookings. Prepare flexible cancellation policies! ⛈️",
            "Beautiful weather across Australia is driving a 23% increase in leisure travel! 🌈"
        ],
        "competitor_analysis": [
            "SkyHigh Hostels raised their prices by 12% - opportunity for you to capture market share! 🎯",
            "Budget Stays is at 85% occupancy - they're doing something right! Study their strategy! 🔍",
            "Your pricing is 15% below market average. There's room for optimization! 💡",
            "Competitor analysis shows you're well-positioned in the mid-market segment! 📈"
        ],
        "predictions": [
            "My AI models predict a 34% booking surge in the next two weeks! Get ready! 🚀",
            "Revenue is expected to increase by 28% this quarter based on current trends! 💰",
            "I'm forecasting high demand for the Melbourne route next month! 📅",
            "Weekend bookings will likely spike by 45% during the upcoming holiday period! 🎉"
        ],
        "general_help": [
            "I can help you with route analysis, pricing strategies, competitor insights, and demand forecasting! 🤖",
            "Ask me about weather impacts, social sentiment, upcoming events, or revenue optimization! 💬",
            "I'm trained on airline industry data and can provide insights on booking patterns! 📚",
            "Need help with dashboard navigation? I can guide you through all features! 🗺️"
        ]
    },
    "es": {
        "greetings": [
            "¡Hola! Soy AirBot, tu asistente de datos aéreos! ✈️",
            "¡Hola Capitán! ¿Listo para explorar datos de vuelos? 🚁",
            "¡Bienvenido a bordo! ¿Cómo puedo ayudarte con insights aéreos hoy? 🛫",
            "¡Hola! ¡Estoy aquí para ayudarte a navegar por los cielos de datos! 🌤️"
        ],
        "route_questions": [
            "¡La ruta SYD-MEL está funcionando excepcionalmente bien con 1,247 reservas y +12% de crecimiento! 📈",
            "Basado en datos actuales, recomendaría enfocarse en el corredor Sydney-Melbourne - ¡es tu ruta dorada! ✨",
            "La ruta Brisbane-Sydney muestra fuerte potencial con +15% de crecimiento. ¡Perfecto para expansión! 🎯",
            "Melbourne-Brisbane está ganando impulso. ¡Considera aumentar tus esfuerzos de marketing allí! 🚀"
        ],
        "pricing_advice": [
            "¡Las tarifas de fin de semana pueden aumentarse 15-20% basado en patrones de demanda actuales! 💰",
            "Veo sensibilidad de precios en vuelos entre semana - ¡considera tarifas promocionales! 🏷️",
            "Tu precio actual es competitivo, ¡pero hay espacio para 8-12% de aumento en rutas premium! 📊",
            "Se acerca la temporada navideña - ¡es hora de implementar estrategias de precios dinámicos! 🎄"
        ],
        "weather_insights": [
            "¡El clima soleado en Sydney está impulsando las reservas en un 15%! ¡Momento perfecto para promover actividades al aire libre! ☀️",
            "Las condiciones lluviosas en Melbourne están reduciendo la demanda en un 8%. ¡Considera asociaciones con atracciones cubiertas! 🌧️",
            "Las advertencias de tormenta en Perth pueden afectar las reservas del fin de semana. ¡Prepara políticas de cancelación flexibles! ⛈️",
            "¡El hermoso clima en toda Australia está impulsando un aumento del 23% en viajes de placer! 🌈"
        ],
        "competitor_analysis": [
            "SkyHigh Hostels subió sus precios un 12% - ¡oportunidad para que captures cuota de mercado! 🎯",
            "Budget Stays está al 85% de ocupación - ¡están haciendo algo bien! ¡Estudia su estrategia! 🔍",
            "Tu precio está 15% por debajo del promedio del mercado. ¡Hay espacio para optimización! 💡",
            "El análisis de competidores muestra que estás bien posicionado en el segmento de mercado medio! 📈"
        ],
        "predictions": [
            "¡Mis modelos de IA predicen un aumento del 34% en reservas en las próximas dos semanas! ¡Prepárate! 🚀",
            "¡Se espera que los ingresos aumenten un 28% este trimestre basado en tendencias actuales! 💰",
            "¡Estoy pronosticando alta demanda para la ruta de Melbourne el próximo mes! 📅",
            "¡Las reservas de fin de semana probablemente aumentarán un 45% durante el próximo período navideño! 🎉"
        ],
        "general_help": [
            "¡Puedo ayudarte con análisis de rutas, estrategias de precios, insights de competidores y pronósticos de demanda! 🤖",
            "¡Pregúntame sobre impactos del clima, sentimiento social, eventos próximos u optimización de ingresos! 💬",
            "¡Estoy entrenado en datos de la industria aérea y puedo proporcionar insights sobre patrones de reservas! 📚",
            "¿Necesitas ayuda con la navegación del dashboard? ¡Puedo guiarte a través de todas las características! 🗺️"
        ]
    }
}

# Mock data functions
def generate_mock_routes():
    routes = [
        {"route": "SYD → MEL", "bookings": 1247, "trend": "+12%"},
        {"route": "MEL → BNE", "bookings": 892, "trend": "+8%"},
        {"route": "SYD → BNE", "bookings": 756, "trend": "+15%"},
        {"route": "PER → SYD", "bookings": 634, "trend": "+5%"},
        {"route": "ADL → MEL", "bookings": 523, "trend": "+18%"}
    ]
    return routes

def generate_price_trends():
    dates = []
    prices = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
        dates.append(date)
        prices.append(random.randint(150, 400))
    return {"dates": dates, "prices": prices}

def generate_high_demand_dates():
    dates = []
    demands = []
    for i in range(30):
        date = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
        dates.append(date)
        demands.append(random.randint(20, 100))
    return {"dates": dates, "demands": demands}

# Enhanced chatbot function
def get_chatbot_response(message, language="en"):
    message_lower = message.lower()
    lang_data = CHATBOT_TRAINING_DATA.get(language, CHATBOT_TRAINING_DATA["en"])
    
    # Route-related questions
    if any(word in message_lower for word in ["route", "ruta", "best", "mejor", "recommend", "recomendar"]):
        return random.choice(lang_data["route_questions"])
    
    # Pricing questions
    elif any(word in message_lower for word in ["price", "precio", "rate", "tarifa", "cost", "costo"]):
        return random.choice(lang_data["pricing_advice"])
    
    # Weather questions
    elif any(word in message_lower for word in ["weather", "clima", "rain", "lluvia", "sun", "sol"]):
        return random.choice(lang_data["weather_insights"])
    
    # Competitor questions
    elif any(word in message_lower for word in ["competitor", "competidor", "competition", "competencia"]):
        return random.choice(lang_data["competitor_analysis"])
    
    # Prediction questions
    elif any(word in message_lower for word in ["predict", "predecir", "forecast", "pronóstico", "future", "futuro"]):
        return random.choice(lang_data["predictions"])
    
    # Help questions
    elif any(word in message_lower for word in ["help", "ayuda", "what", "qué", "how", "cómo"]):
        return random.choice(lang_data["general_help"])
    
    # Greetings
    elif any(word in message_lower for word in ["hello", "hola", "hi", "hey"]):
        return random.choice(lang_data["greetings"])
    
    # Default response
    else:
        if language == "es":
            return "¡Interesante pregunta! Basado en los datos actuales, te sugiero revisar el dashboard de tendencias para obtener más insights. ¿Hay algo específico sobre rutas, precios o competidores que te gustaría saber? 🤖✈️"
        else:
            return "Great question! Based on current data trends, I'd suggest checking the trends dashboard for more insights. Is there something specific about routes, pricing, or competitors you'd like to know? 🤖✈️"

# Routes
@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/trends')
def trends():
    return render_template('trends.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/predictions')
def predictions():
    return render_template('predictions.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

# API Routes
@app.route('/api/popular-routes')
def popular_routes():
    return jsonify(generate_mock_routes())

@app.route('/api/price-trends')
def price_trends():
    return jsonify(generate_price_trends())

@app.route('/api/high-demand-dates')
def high_demand_dates():
    return jsonify(generate_high_demand_dates())

@app.route('/api/insights')
def insights():
    insights = [
        "Bookings surge 34% during school holidays",
        "Weekend flights show 28% higher demand",
        "SYD-MEL route peaks on Friday evenings",
        "Price drops of 15% increase bookings by 45%"
    ]
    return jsonify({"insights": random.sample(insights, 2)})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    language = data.get('language', 'en')
    
    response = get_chatbot_response(message, language)
    return jsonify({"response": response})

@app.route('/api/weather-impact')
def weather_impact():
    weather_data = [
        {"city": "Sydney", "weather": "Sunny", "temp": 25, "impact": "+15%", "bookings": 1200},
        {"city": "Melbourne", "weather": "Rainy", "temp": 18, "impact": "-8%", "bookings": 850},
        {"city": "Brisbane", "weather": "Cloudy", "temp": 22, "impact": "+2%", "bookings": 950},
        {"city": "Perth", "weather": "Sunny", "temp": 28, "impact": "+12%", "bookings": 720},
    ]
    return jsonify(weather_data)

@app.route('/api/competitor-analysis')
def competitor_analysis():
    competitors = [
        {"name": "SkyHigh Hostels", "avg_price": 45, "occupancy": 78, "trend": "up"},
        {"name": "Budget Stays", "avg_price": 38, "occupancy": 85, "trend": "stable"},
        {"name": "Traveler's Inn", "avg_price": 52, "occupancy": 72, "trend": "down"},
        {"name": "City Backpackers", "avg_price": 41, "occupancy": 80, "trend": "up"},
    ]
    return jsonify(competitors)

@app.route('/api/revenue-optimization')
def revenue_optimization():
    recommendations = [
        {
            "route": "SYD-MEL",
            "current_rate": 65,
            "recommended_rate": 78,
            "potential_increase": "+20%",
            "confidence": "High",
            "reason": "High demand, low competition"
        },
        {
            "route": "BNE-SYD", 
            "current_rate": 55,
            "recommended_rate": 52,
            "potential_increase": "+8%",
            "confidence": "Medium",
            "reason": "Price sensitive market"
        }
    ]
    return jsonify(recommendations)

@app.route('/api/social-sentiment')
def social_sentiment():
    sentiment_data = [
        {"platform": "Twitter", "sentiment": "Positive", "score": 0.75, "mentions": 1240},
        {"platform": "Instagram", "sentiment": "Very Positive", "score": 0.85, "mentions": 890},
        {"platform": "Facebook", "sentiment": "Neutral", "score": 0.55, "mentions": 650},
        {"platform": "TikTok", "sentiment": "Positive", "score": 0.72, "mentions": 420},
    ]
    return jsonify(sentiment_data)

@app.route('/api/events-calendar')
def events_calendar():
    events = [
        {"date": "2024-01-15", "event": "Australian Open", "city": "Melbourne", "impact": "High"},
        {"date": "2024-02-10", "event": "Sydney Festival", "city": "Sydney", "impact": "Medium"},
        {"date": "2024-03-20", "event": "F1 Grand Prix", "city": "Melbourne", "impact": "Very High"},
        {"date": "2024-04-25", "event": "ANZAC Day", "city": "All Cities", "impact": "High"},
    ]
    return jsonify(events)

@app.route('/api/predictions')
def predictions_api():
    predictions = [
        {"metric": "Next Week Bookings", "prediction": 2340, "confidence": 87, "trend": "up"},
        {"metric": "Average Price", "prediction": 285, "confidence": 92, "trend": "up"},
        {"metric": "Occupancy Rate", "prediction": 78, "confidence": 85, "trend": "stable"},
        {"metric": "Revenue", "prediction": 45600, "confidence": 89, "trend": "up"},
    ]
    return jsonify(predictions)

@app.route('/api/performance-kpis')
def performance_kpis():
    kpis = [
        {"name": "Revenue Growth", "value": 23.5, "unit": "%", "status": "excellent"},
        {"name": "Booking Conversion", "value": 12.8, "unit": "%", "status": "good"},
        {"name": "Customer Satisfaction", "value": 4.7, "unit": "/5", "status": "excellent"},
        {"name": "Market Share", "value": 15.2, "unit": "%", "status": "good"},
    ]
    return jsonify(kpis)

@app.route('/api/notifications')
def notifications():
    notifications = [
        {"type": "surge", "message": "SYD-MEL route experiencing 34% booking surge!", "time": "2 min ago", "priority": "high"},
        {"type": "price", "message": "Competitor dropped prices by 15% on BNE-SYD", "time": "15 min ago", "priority": "medium"},
        {"type": "weather", "message": "Storm warning may affect Perth flights", "time": "1 hour ago", "priority": "low"},
        {"type": "event", "message": "F1 Grand Prix tickets on sale - expect Melbourne surge", "time": "2 hours ago", "priority": "high"},
    ]
    return jsonify(notifications)

if __name__ == '__main__':
    app.run(debug=True)
