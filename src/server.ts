import express from 'express';
import session from 'express-session';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'basecamp-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Google OAuth setup
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// Extend session type
declare module 'express-session' {
    interface SessionData {
        tokens: any;
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Google OAuth flow
app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// Google OAuth callback
app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code as string;
    
    try {
        const { tokens } = await oauth2Client.getToken(code);
        req.session.tokens = tokens;
        oauth2Client.setCredentials(tokens);
        res.redirect('/');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.redirect('/?error=auth_failed');
    }
});

// Check if user is authenticated
app.get('/api/auth/status', (req, res) => {
    res.json({ authenticated: !!req.session.tokens });
});

// Logout
app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Get calendar events
app.get('/api/calendar/events', async (req, res) => {
    if (!req.session.tokens) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    oauth2Client.setCredentials(req.session.tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get start and end of current week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);

    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startOfWeek.toISOString(),
            timeMax: endOfWeek.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items?.map(event => ({
            id: event.id,
            title: event.summary,
            start: event.start?.dateTime || event.start?.date,
            end: event.end?.dateTime || event.end?.date,
            link: event.htmlLink,
            color: event.colorId || '1', // Google Calendar color ID
        })) || [];

        res.json(events);
    } catch (error) {
        console.error('Error fetching calendar:', error);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
});

app.listen(PORT, () => {
    console.log(`Dashboard running at http://localhost:${PORT}`);
});
