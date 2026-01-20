// ============================================
// DOM REFERENCES
// ============================================
const aiInput = document.getElementById('ai-input') as HTMLInputElement;
const aiSend = document.getElementById('ai-send') as HTMLButtonElement;
const aiMessages = document.getElementById('ai-messages') as HTMLDivElement;

// ============================================
// GOOGLE CALENDAR INTEGRATION
// ============================================

// Check if user is authenticated when page loads
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            // User is logged in - fetch calendar events
            await loadCalendarEvents();
        } else {
            // User is not logged in - show login button
            showCalendarLoginButton();
        }
    } catch (error) {
        console.error('Auth status check failed:', error);
    }
}

// Show a "Connect Google Calendar" button
function showCalendarLoginButton() {
    const calendarSection = document.getElementById('calendar');
    if (!calendarSection) return;
    
    // Create login button
    const loginBtn = document.createElement('button');
    loginBtn.textContent = '🔗 Connect Google Calendar';
    loginBtn.className = 'calendar-login-btn';
    loginBtn.onclick = () => {
        window.location.href = '/auth/google';
    };
    
    // Insert at the top of calendar section
    calendarSection.insertBefore(loginBtn, calendarSection.firstChild);
}

// Fetch calendar events from backend
async function loadCalendarEvents() {
    try {
        const response = await fetch('/api/calendar/events');
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const events = await response.json();
        console.log('Calendar events:', events);
        
        // Display events in the calendar grid
        displayCalendarEvents(events);
        
    } catch (error) {
        console.error('Error loading calendar events:', error);
    }
}

// Google Calendar color mapping
function getGoogleCalendarColor(colorId: string): { background: string; text: string } {
    const colors: { [key: string]: { background: string; text: string } } = {
        '1': { background: '#a4bdfc', text: '#1d1d1d' },  // Lavender
        '2': { background: '#7ae7bf', text: '#1d1d1d' },  // Sage
        '3': { background: '#dbadff', text: '#1d1d1d' },  // Grape
        '4': { background: '#ff887c', text: '#1d1d1d' },  // Flamingo
        '5': { background: '#fbd75b', text: '#1d1d1d' },  // Banana
        '6': { background: '#ffb878', text: '#1d1d1d' },  // Tangerine
        '7': { background: '#46d6db', text: '#1d1d1d' },  // Peacock
        '8': { background: '#e1e1e1', text: '#1d1d1d' },  // Graphite
        '9': { background: '#5484ed', text: '#ffffff' },  // Blueberry
        '10': { background: '#51b749', text: '#ffffff' }, // Basil
        '11': { background: '#dc2127', text: '#ffffff' }, // Tomato
    };
    return colors[colorId] || { background: '#a4bdfc', text: '#1d1d1d' };
}

// Display events in the calendar grid
function displayCalendarEvents(events: any[]) {
    // Clear existing events
    document.querySelectorAll('.calendar-event').forEach(el => el.remove());
    
    events.forEach(event => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = startDate.getDay();
        const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const dayKey = dayMap[dayOfWeek];
        
        // Find the correct day column
        const dayColumn = document.querySelector(`.calendar-day[data-day="${dayKey}"]`);
        if (!dayColumn) return;
        
        const dayGrid = dayColumn.querySelector('.day-grid');
        if (!dayGrid) return;
        
        // Calculate position and height
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        const endHour = endDate.getHours();
        const endMinute = endDate.getMinutes();
        
        // Each hour is 30px tall (from our CSS)
        const hourHeight = 30;
        const topPosition = (startHour - 7) * hourHeight + (startMinute / 60) * hourHeight;
        const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
        const height = duration * hourHeight;
        
        // Create event element
        const eventEl = document.createElement('div');
        eventEl.className = 'calendar-event';
        eventEl.textContent = event.title;
        eventEl.style.top = `${topPosition}px`;
        eventEl.style.height = `${height}px`;
        eventEl.title = `${event.title}\n${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`;
        
        // Apply Google Calendar color
        const calendarColors = getGoogleCalendarColor(event.color);
        eventEl.style.backgroundColor = calendarColors.background;
        eventEl.style.color = calendarColors.text;
        
        // Make it clickable
        eventEl.onclick = () => {
            window.open(event.link, '_blank');
        };
        
        dayGrid.appendChild(eventEl);
    });
}

// ============================================
// AI CHAT FUNCTIONALITY
// ============================================

// Define the function first
async function handleSendMessage() {
    const inText = aiInput.value;
    const message = inText.trim();

    if (!message) return;

    // TODO: Display message in chat
    console.log('User said:', message);
    
    aiInput.value = '';
}

// Then set up event listeners
aiSend?.addEventListener('click', handleSendMessage);
aiInput?.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    
    // Check Google Calendar authentication
    checkAuthStatus();
});