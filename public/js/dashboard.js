"use strict";
(() => {
  // src/dashboard.ts
  var aiInput = document.getElementById("ai-input");
  var aiSend = document.getElementById("ai-send");
  var aiMessages = document.getElementById("ai-messages");
  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/auth/status");
      const data = await response.json();
      if (data.authenticated) {
        await loadCalendarEvents();
      } else {
        showCalendarLoginButton();
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
    }
  }
  function showCalendarLoginButton() {
    const calendarSection = document.getElementById("calendar");
    if (!calendarSection) return;
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "\u{1F517} Connect Google Calendar";
    loginBtn.className = "calendar-login-btn";
    loginBtn.onclick = () => {
      window.location.href = "/auth/google";
    };
    calendarSection.insertBefore(loginBtn, calendarSection.firstChild);
  }
  async function loadCalendarEvents() {
    try {
      const response = await fetch("/api/calendar/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const events = await response.json();
      console.log("Calendar events:", events);
      displayCalendarEvents(events);
    } catch (error) {
      console.error("Error loading calendar events:", error);
    }
  }
  function getGoogleCalendarColor(colorId) {
    const colors = {
      "1": { background: "#a4bdfc", text: "#1d1d1d" },
      // Lavender
      "2": { background: "#7ae7bf", text: "#1d1d1d" },
      // Sage
      "3": { background: "#dbadff", text: "#1d1d1d" },
      // Grape
      "4": { background: "#ff887c", text: "#1d1d1d" },
      // Flamingo
      "5": { background: "#fbd75b", text: "#1d1d1d" },
      // Banana
      "6": { background: "#ffb878", text: "#1d1d1d" },
      // Tangerine
      "7": { background: "#46d6db", text: "#1d1d1d" },
      // Peacock
      "8": { background: "#e1e1e1", text: "#1d1d1d" },
      // Graphite
      "9": { background: "#5484ed", text: "#ffffff" },
      // Blueberry
      "10": { background: "#51b749", text: "#ffffff" },
      // Basil
      "11": { background: "#dc2127", text: "#ffffff" }
      // Tomato
    };
    return colors[colorId] || { background: "#a4bdfc", text: "#1d1d1d" };
  }
  function displayCalendarEvents(events) {
    document.querySelectorAll(".calendar-event").forEach((el) => el.remove());
    events.forEach((event) => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      const dayOfWeek = startDate.getDay();
      const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const dayKey = dayMap[dayOfWeek];
      const dayColumn = document.querySelector(`.calendar-day[data-day="${dayKey}"]`);
      if (!dayColumn) return;
      const dayGrid = dayColumn.querySelector(".day-grid");
      if (!dayGrid) return;
      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const hourHeight = 30;
      const topPosition = (startHour - 7) * hourHeight + startMinute / 60 * hourHeight;
      const duration = endHour - startHour + (endMinute - startMinute) / 60;
      const height = duration * hourHeight;
      const eventEl = document.createElement("div");
      eventEl.className = "calendar-event";
      eventEl.textContent = event.title;
      eventEl.style.top = `${topPosition}px`;
      eventEl.style.height = `${height}px`;
      eventEl.title = `${event.title}
${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`;
      const calendarColors = getGoogleCalendarColor(event.color);
      eventEl.style.backgroundColor = calendarColors.background;
      eventEl.style.color = calendarColors.text;
      eventEl.onclick = () => {
        window.open(event.link, "_blank");
      };
      dayGrid.appendChild(eventEl);
    });
  }
  async function handleSendMessage() {
    const inText = aiInput.value;
    const message = inText.trim();
    if (!message) return;
    console.log("User said:", message);
    aiInput.value = "";
  }
  aiSend?.addEventListener("click", handleSendMessage);
  aiInput?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Dashboard initialized");
    checkAuthStatus();
  });
})();
