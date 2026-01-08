# Basecamp Dashboard

A custom homelab dashboard built with Node.js, Express, and TypeScript.

## Features

- **AI Chat Bar** - Chat with local Ollama AI models
- **Search Bar** - Quick Google search shortcut
- **Stocks Widget** - Real-time stock quotes
- **YouTube Widget** - Latest videos from subscribed channels
- **Twitch Widget** - See which streamers are live
- **Calendar Widget** - Google Calendar integration
- **Services Widget** - Quick links to homelab services
- **News Widget** - RSS news feed aggregator

## Tech Stack

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** HTML + CSS + TypeScript
- **AI:** Ollama (local)
- **Containerization:** Docker

## Project Structure
```
Basecamp/
├── src/
│   └── server.ts          # Express backend
├── public/
│   ├── index.html         # Main dashboard page
│   ├── css/
│   │   └── style.css      # Styles
│   └── js/
│       └── dashboard.js   # Frontend scripts
├── package.json
├── tsconfig.json
├── .env.example           # Environment variables template
├── .gitignore
└── README.md
```

## Setup

1. Clone the repository:
```bash
   git clone https://github.com/wonderer41/Basecamp.git
   cd Basecamp
```

2. Install dependencies:
```bash
   npm install
```

3. Create environment file:
```bash
   cp .env.example .env
```

4. Add your API keys to `.env`

5. Run development server:
```bash
   npm run dev
```

6. Open `http://localhost:3000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production server |

## API Keys & Services

| Service | Where to get it |
|---------|-----------------|
| Alpha Vantage (Stocks) | https://www.alphavantage.co/support/#api-key |
| Twitch | https://dev.twitch.tv/console/apps |
| Google Calendar | https://console.cloud.google.com |
| Ollama | https://ollama.ai (runs locally) |

## Ollama Setup

Make sure Ollama is running locally:
```bash
# Install Ollama (if not already)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2

# Ollama runs on http://localhost:11434 by default
```

## License

MIT