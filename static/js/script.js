import { Chart } from "@/components/ui/chart"
// Global variables
let priceChart = null
let demandChart = null
const sidebarCollapsed = false
let chatActive = false
// Add these variables at the top
let sidebarOpen = true
let currentChatLanguage = "en"

// Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
  loadPopularRoutes()
  loadPriceTrends()
  loadHighDemandDates()
  loadAIInsights()
})

// Initialize dashboard components
function initializeDashboard() {
  // Set default date range
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  document.getElementById("startDate").value = weekAgo.toISOString().split("T")[0]
  document.getElementById("endDate").value = today.toISOString().split("T")[0]

  // Add event listeners
  document.getElementById("csvFile").addEventListener("change", handleFileUpload)
  document.getElementById("chatInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
}

// Sidebar toggle functionality - Updated for AirPulse title click
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("mainContent")

  // Toggle the sidebar state
  sidebarOpen = !sidebarOpen

  if (sidebarOpen) {
    sidebar.classList.remove("collapsed")
    mainContent.classList.remove("expanded")
    // Add a subtle animation effect
    sidebar.style.transform = "translateX(0)"
  } else {
    sidebar.classList.add("collapsed")
    mainContent.classList.add("expanded")
    sidebar.style.transform = "translateX(-240px)"
  }

  // Save sidebar state
  localStorage.setItem("sidebar-open", sidebarOpen)

  // Add visual feedback to the title
  const title = document.querySelector(".nav-title")
  title.style.transform = "scale(0.95)"
  setTimeout(() => {
    title.style.transform = "scale(1)"
  }, 150)
}

// Add navigation function
function navigateTo(url) {
  window.location.href = url
}

// Load popular routes data
async function loadPopularRoutes() {
  try {
    const response = await fetch("/api/popular-routes")
    const data = await response.json()

    const container = document.getElementById("popularRoutes")
    container.innerHTML = ""

    data.forEach((route, index) => {
      const routeElement = document.createElement("div")
      routeElement.className = "route-item"
      routeElement.style.animationDelay = `${index * 0.1}s`

      routeElement.innerHTML = `
                <div class="route-name">${route.route}</div>
                <div class="route-stats">
                    <div class="booking-count" data-count="${route.bookings}">0</div>
                    <div class="trend">${route.trend}</div>
                </div>
            `

      container.appendChild(routeElement)

      // Animate count up
      animateCountUp(routeElement.querySelector(".booking-count"), route.bookings)
    })
  } catch (error) {
    console.error("Error loading popular routes:", error)
  }
}

// Load price trends and create chart
async function loadPriceTrends() {
  try {
    const response = await fetch("/api/price-trends")
    const data = await response.json()

    const ctx = document.getElementById("priceChart").getContext("2d")

    if (priceChart) {
      priceChart.destroy()
    }

    priceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.dates,
        datasets: [
          {
            label: "Average Price (AUD)",
            data: data.prices,
            borderColor: "#00FFFF",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#FF6B00",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#888888",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            ticks: {
              color: "#888888",
              callback: (value) => "$" + value,
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        elements: {
          point: {
            hoverRadius: 8,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error loading price trends:", error)
  }
}

// Load high demand dates and create chart
async function loadHighDemandDates() {
  try {
    const response = await fetch("/api/high-demand-dates")
    const data = await response.json()

    const ctx = document.getElementById("demandChart").getContext("2d")

    if (demandChart) {
      demandChart.destroy()
    }

    demandChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.dates.slice(0, 14), // Show first 14 days
        datasets: [
          {
            label: "Demand Level",
            data: data.demands.slice(0, 14),
            backgroundColor: data.demands.slice(0, 14).map((demand) => {
              if (demand > 80) return "#FF6B00"
              if (demand > 60) return "#FFFF00"
              if (demand > 40) return "#00FFFF"
              return "#4B0082"
            }),
            borderColor: "#ffffff",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#888888",
              maxRotation: 45,
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            ticks: {
              color: "#888888",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Error loading demand dates:", error)
  }
}

// Load AI insights
async function loadAIInsights() {
  try {
    const response = await fetch("/api/insights")
    const data = await response.json()

    const container = document.getElementById("aiInsights")
    container.innerHTML = ""

    data.insights.forEach((insight, index) => {
      const insightElement = document.createElement("div")
      insightElement.className = "insight-item"
      insightElement.style.animationDelay = `${index * 0.2}s`
      insightElement.textContent = insight

      container.appendChild(insightElement)
    })
  } catch (error) {
    console.error("Error loading AI insights:", error)
  }
}

// Animate count up effect
function animateCountUp(element, target) {
  const duration = 2000
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    if (target >= 1000) {
      element.textContent = (current / 1000).toFixed(1) + "k"
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Fetch trends with loading animation
async function fetchTrends() {
  const loadingOverlay = document.getElementById("loadingOverlay")
  loadingOverlay.classList.add("active")

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reload all data
    await Promise.all([loadPopularRoutes(), loadPriceTrends(), loadHighDemandDates(), loadAIInsights()])

    // Show success message
    showNotification("✈️ Flight data updated successfully!", "success")
  } catch (error) {
    console.error("Error fetching trends:", error)
    showNotification("❌ Error fetching data. Please try again.", "error")
  } finally {
    loadingOverlay.classList.remove("active")
  }
}

// Handle CSV file upload
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file && file.type === "text/csv") {
    showNotification("📤 CSV file uploaded successfully!", "success")
    // Here you would typically send the file to the server
    // For demo purposes, we'll just show a success message
  } else {
    showNotification("❌ Please select a valid CSV file.", "error")
  }
}

// Toggle chat functionality
function toggleChat() {
  const chat = document.getElementById("airbotChat")
  chatActive = !chatActive

  if (chatActive) {
    chat.classList.add("active")
  } else {
    chat.classList.remove("active")
  }
}

// Enhanced chatbot functions
function setChatLanguage(language) {
  currentChatLanguage = language

  // Update chat placeholder and suggestions based on language
  const chatInput = document.getElementById("chatInput")
  const suggestions = document.getElementById("chatSuggestions")

  if (language === "es") {
    chatInput.placeholder = "Pregúntame sobre tendencias aéreas..."
    suggestions.innerHTML = `
      <button class="suggestion-btn" onclick="sendSuggestion('¿Cuáles son las mejores rutas?')">¿Mejores Rutas?</button>
      <button class="suggestion-btn" onclick="sendSuggestion('¿Cómo debo fijar precios?')">¿Consejos de Precios?</button>
      <button class="suggestion-btn" onclick="sendSuggestion('Análisis de impacto del clima')">¿Impacto del Clima?</button>
    `
  } else {
    chatInput.placeholder = "Ask me about airline trends..."
    suggestions.innerHTML = `
      <button class="suggestion-btn" onclick="sendSuggestion('What are the best routes?')">Best Routes?</button>
      <button class="suggestion-btn" onclick="sendSuggestion('How should I price my rooms?')">Pricing Advice?</button>
      <button class="suggestion-btn" onclick="sendSuggestion('Weather impact analysis')">Weather Impact?</button>
    `
  }
}

function sendSuggestion(message) {
  document.getElementById("chatInput").value = message
  sendMessage()
}

// Update the sendMessage function to include language
async function sendMessage() {
  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const messagesContainer = document.getElementById("chatMessages")

  // Add user message
  const userMessage = document.createElement("div")
  userMessage.className = "user-message"
  userMessage.textContent = message
  messagesContainer.appendChild(userMessage)

  // Clear input
  input.value = ""

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight

  try {
    // Send to API with language
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        language: currentChatLanguage,
      }),
    })

    const data = await response.json()

    // Add bot response with typing animation
    const botMessage = document.createElement("div")
    botMessage.className = "bot-message"
    messagesContainer.appendChild(botMessage)

    // Typing animation
    let i = 0
    const typeWriter = () => {
      if (i < data.response.length) {
        botMessage.textContent += data.response.charAt(i)
        i++
        setTimeout(typeWriter, 30)
      }
    }
    typeWriter()

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  } catch (error) {
    console.error("Error sending message:", error)

    const errorMessage = document.createElement("div")
    errorMessage.className = "bot-message"
    errorMessage.textContent =
      currentChatLanguage === "es"
        ? "Lo siento, encontré un error. ¡Por favor intenta de nuevo! 🤖"
        : "Sorry, I encountered an error. Please try again! 🤖"
    messagesContainer.appendChild(errorMessage)
  }
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === "success" ? "background: linear-gradient(45deg, #00FF00, #00FFFF);" : "background: linear-gradient(45deg, #FF0000, #FF6B00);"}
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Add some interactive effects
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".card")

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    } else {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    }
  })
})

// Add pulse effect to high-demand routes
setInterval(() => {
  const routes = document.querySelectorAll(".route-item")
  routes.forEach((route, index) => {
    if (Math.random() > 0.8) {
      // 20% chance
      route.style.boxShadow = "0 0 20px rgba(255, 107, 0, 0.5)"
      setTimeout(() => {
        route.style.boxShadow = "none"
      }, 1000)
    }
  })
}, 5000)

// Global variables for new features
let sentimentChart = null
let notificationsActive = false
let currentTheme = "dark"
let currentLanguage = "en"

// Language translations
const translations = {
  en: {
    title: "✈️ AirPulse – Airline Demand Monitor",
    dashboard: "Dashboard",
    trends: "Explore Trends",
    upload: "Upload CSV",
    predictions: "Predictions (AI)",
    chat: "Chat with AirBot 🤖",
    settings: "Settings",
  },
  es: {
    title: "✈️ AirPulse – Monitor de Demanda Aérea",
    dashboard: "Panel de Control",
    trends: "Explorar Tendencias",
    upload: "Subir CSV",
    predictions: "Predicciones (IA)",
    chat: "Chat con AirBot 🤖",
    settings: "Configuración",
  },
  fr: {
    title: "✈️ AirPulse – Moniteur de Demande Aérienne",
    dashboard: "Tableau de Bord",
    trends: "Explorer les Tendances",
    upload: "Télécharger CSV",
    predictions: "Prédictions (IA)",
    chat: "Chat avec AirBot 🤖",
    settings: "Paramètres",
  },
}

// Initialize new features when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Load existing features
  initializeDashboard()
  loadPopularRoutes()
  loadPriceTrends()
  loadHighDemandDates()
  loadAIInsights()

  // Load new features
  loadWeatherImpact()
  loadCompetitorAnalysis()
  loadRevenueOptimization()
  loadSocialSentiment()
  loadEventsCalendar()
  loadPredictions()
  loadPerformanceKPIs()
  loadNotifications()

  // Start real-time updates
  startRealTimeUpdates()
})

// Load weather impact data
async function loadWeatherImpact() {
  try {
    const response = await fetch("/api/weather-impact")
    const data = await response.json()

    const container = document.getElementById("weatherImpact")
    container.innerHTML = ""

    data.forEach((weather) => {
      const weatherElement = document.createElement("div")
      weatherElement.className = "weather-item"

      const weatherIcon = getWeatherIcon(weather.weather)
      const impactClass = weather.impact.includes("+") ? "positive" : "negative"

      weatherElement.innerHTML = `
        <div class="weather-icon">${weatherIcon}</div>
        <div class="weather-city">${weather.city}</div>
        <div class="weather-temp">${weather.temp}°C</div>
        <div class="weather-impact ${impactClass}">${weather.impact}</div>
        <div class="weather-bookings">${weather.bookings} bookings</div>
      `

      container.appendChild(weatherElement)
    })
  } catch (error) {
    console.error("Error loading weather impact:", error)
  }
}

// Load competitor analysis
async function loadCompetitorAnalysis() {
  try {
    const response = await fetch("/api/competitor-analysis")
    const data = await response.json()

    const container = document.getElementById("competitorAnalysis")
    container.innerHTML = ""

    data.forEach((competitor) => {
      const competitorElement = document.createElement("div")
      competitorElement.className = "competitor-item"

      competitorElement.innerHTML = `
        <div class="competitor-info">
          <div class="competitor-name">${competitor.name}</div>
          <div class="competitor-stats">
            <span>Avg Price: $${competitor.avg_price}</span>
            <span>Occupancy: ${competitor.occupancy}%</span>
          </div>
        </div>
        <div class="competitor-trend ${competitor.trend}">${competitor.trend}</div>
      `

      container.appendChild(competitorElement)
    })
  } catch (error) {
    console.error("Error loading competitor analysis:", error)
  }
}

// Load revenue optimization
async function loadRevenueOptimization() {
  try {
    const response = await fetch("/api/revenue-optimization")
    const data = await response.json()

    const container = document.getElementById("revenueOptimization")
    container.innerHTML = ""

    data.forEach((optimization) => {
      const optimizationElement = document.createElement("div")
      optimizationElement.className = "optimization-item"

      optimizationElement.innerHTML = `
        <div class="optimization-header">
          <div class="optimization-route">${optimization.route}</div>
          <div class="optimization-confidence">${optimization.confidence} Confidence</div>
        </div>
        <div class="optimization-details">
          <div class="optimization-metric">
            <div class="optimization-value">$${optimization.current_rate}</div>
            <div class="optimization-label">Current Rate</div>
          </div>
          <div class="optimization-metric">
            <div class="optimization-value">$${optimization.recommended_rate}</div>
            <div class="optimization-label">Recommended</div>
          </div>
          <div class="optimization-metric">
            <div class="optimization-value">${optimization.potential_increase}</div>
            <div class="optimization-label">Potential Increase</div>
          </div>
        </div>
        <div class="optimization-reason">${optimization.reason}</div>
      `

      container.appendChild(optimizationElement)
    })
  } catch (error) {
    console.error("Error loading revenue optimization:", error)
  }
}

// Load social sentiment and create chart
async function loadSocialSentiment() {
  try {
    const response = await fetch("/api/social-sentiment")
    const data = await response.json()

    const ctx = document.getElementById("sentimentChart").getContext("2d")

    if (sentimentChart) {
      sentimentChart.destroy()
    }

    sentimentChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((item) => item.platform),
        datasets: [
          {
            data: data.map((item) => item.score * 100),
            backgroundColor: ["#FF6B00", "#00FFFF", "#4B0082", "#FFFF00"],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("Error loading social sentiment:", error)
  }
}

// Load events calendar
async function loadEventsCalendar() {
  try {
    const response = await fetch("/api/events-calendar")
    const data = await response.json()

    const container = document.getElementById("eventsCalendar")
    container.innerHTML = ""

    data.forEach((event) => {
      const eventElement = document.createElement("div")
      eventElement.className = "event-item"

      const impactClass = event.impact.toLowerCase().replace(" ", "-")

      eventElement.innerHTML = `
        <div class="event-date">${formatDate(event.date)}</div>
        <div class="event-details">
          <div class="event-name">${event.event}</div>
          <div class="event-city">${event.city}</div>
        </div>
        <div class="event-impact ${impactClass}">${event.impact}</div>
      `

      container.appendChild(eventElement)
    })
  } catch (error) {
    console.error("Error loading events calendar:", error)
  }
}

// Load predictions
async function loadPredictions() {
  try {
    const response = await fetch("/api/predictions")
    const data = await response.json()

    const container = document.getElementById("predictions")
    container.innerHTML = ""

    data.forEach((prediction) => {
      const predictionElement = document.createElement("div")
      predictionElement.className = "prediction-item"

      predictionElement.innerHTML = `
        <div class="prediction-value">${prediction.prediction.toLocaleString()}</div>
        <div class="prediction-metric">${prediction.metric}</div>
        <div class="prediction-confidence">
          ${prediction.confidence}% confidence
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
          </div>
        </div>
      `

      container.appendChild(predictionElement)
    })
  } catch (error) {
    console.error("Error loading predictions:", error)
  }
}

// Load performance KPIs
async function loadPerformanceKPIs() {
  try {
    const response = await fetch("/api/performance-kpis")
    const data = await response.json()

    const container = document.getElementById("performanceKPIs")
    container.innerHTML = ""

    data.forEach((kpi) => {
      const kpiElement = document.createElement("div")
      kpiElement.className = "kpi-card"

      kpiElement.innerHTML = `
        <div class="kpi-value ${kpi.status}">${kpi.value}</div>
        <div class="kpi-name">${kpi.name}</div>
        <div class="kpi-unit">${kpi.unit}</div>
      `

      container.appendChild(kpiElement)

      // Animate KPI values
      animateKPIValue(kpiElement.querySelector(".kpi-value"), kpi.value)
    })
  } catch (error) {
    console.error("Error loading performance KPIs:", error)
  }
}

// Load notifications
async function loadNotifications() {
  try {
    const response = await fetch("/api/notifications")
    const data = await response.json()

    const container = document.getElementById("notificationsList")
    const badge = document.getElementById("notificationBadge")

    container.innerHTML = ""
    badge.textContent = data.length

    data.forEach((notification) => {
      const notificationElement = document.createElement("div")
      notificationElement.className = `notification-item ${notification.priority}`

      notificationElement.innerHTML = `
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${notification.time}</div>
      `

      container.appendChild(notificationElement)
    })
  } catch (error) {
    console.error("Error loading notifications:", error)
  }
}

// Helper functions
function getWeatherIcon(weather) {
  const icons = {
    Sunny: "☀️",
    Rainy: "🌧️",
    Cloudy: "☁️",
    Stormy: "⛈️",
  }
  return icons[weather] || "🌤️"
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function animateKPIValue(element, targetValue) {
  const duration = 2000
  const start = 0
  const increment = targetValue / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= targetValue) {
      current = targetValue
      clearInterval(timer)
    }

    element.textContent = current.toFixed(1)
  }, 16)
}

// Theme management
function setTheme(theme) {
  currentTheme = theme
  document.body.className = `${theme}-theme`

  // Update active theme button
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-theme="${theme}"]`).classList.add("active")

  // Save theme preference
  localStorage.setItem("airpulse-theme", theme)
}

// Language management
function changeLanguage(language) {
  currentLanguage = language

  // Update UI text based on selected language
  const translation = translations[language] || translations.en

  // Update navigation title
  document.querySelector(".nav-title").textContent = translation.title

  // Update sidebar items
  const sidebarItems = document.querySelectorAll(".sidebar-item span")
  const keys = ["dashboard", "trends", "upload", "predictions", "chat", "settings"]

  sidebarItems.forEach((item, index) => {
    if (keys[index] && translation[keys[index]]) {
      item.textContent = translation[keys[index]]
    }
  })

  // Save language preference
  localStorage.setItem("airpulse-language", language)
}

// Notifications management
function toggleNotifications() {
  const panel = document.getElementById("notificationsPanel")
  notificationsActive = !notificationsActive

  if (notificationsActive) {
    panel.classList.add("active")
  } else {
    panel.classList.remove("active")
  }
}

// Real-time updates
function startRealTimeUpdates() {
  // Update notifications every 30 seconds
  setInterval(loadNotifications, 30000)

  // Update weather data every 5 minutes
  setInterval(loadWeatherImpact, 300000)

  // Update competitor data every 10 minutes
  setInterval(loadCompetitorAnalysis, 600000)

  // Simulate real-time price changes
  setInterval(() => {
    const priceElements = document.querySelectorAll(".booking-count")
    priceElements.forEach((element) => {
      const currentValue = Number.parseInt(element.textContent.replace("k", "")) * 1000
      const change = Math.floor(Math.random() * 20) - 10 // -10 to +10
      const newValue = Math.max(0, currentValue + change)

      if (newValue >= 1000) {
        element.textContent = (newValue / 1000).toFixed(1) + "k"
      } else {
        element.textContent = newValue.toString()
      }

      // Add pulse effect for significant changes
      if (Math.abs(change) > 5) {
        element.style.animation = "pulse 0.5s ease-in-out"
        setTimeout(() => {
          element.style.animation = ""
        }, 500)
      }
    })
  }, 10000)
}

// Load sidebar state on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedSidebarState = localStorage.getItem("sidebar-open")
  if (savedSidebarState !== null) {
    sidebarOpen = savedSidebarState === "true"
    if (!sidebarOpen) {
      toggleSidebar()
    }
  }

  // Initialize chat language
  const savedChatLanguage = localStorage.getItem("chat-language") || "en"
  setChatLanguage(savedChatLanguage)
  document.getElementById("chatLanguage").value = savedChatLanguage

  // Load existing functionality
  initializeDashboard()
  loadPopularRoutes()
  loadPriceTrends()
  loadHighDemandDates()
  loadAIInsights()
  loadWeatherImpact()
  loadCompetitorAnalysis()
  loadRevenueOptimization()
  loadSocialSentiment()
  loadEventsCalendar()
  loadPredictions()
  loadPerformanceKPIs()
  loadNotifications()
  startRealTimeUpdates()
})

// Add saved preferences on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("airpulse-theme") || "dark"
  const savedLanguage = localStorage.getItem("airpulse-language") || "en"

  setTheme(savedTheme)
  changeLanguage(savedLanguage)
  document.getElementById("languageSelect").value = savedLanguage
})

// Add pulse animation to CSS
const style = document.createElement("style")
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`
document.head.appendChild(style)
