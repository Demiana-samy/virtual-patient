# Virtual Patient — API Server

Minimal backend proxy for the chat panel. Keeps the Anthropic API key server-side.

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

3. Edit `.env` and set your key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
npm start
```

The server listens on **http://localhost:3000** (override with `PORT` in `.env`).

## Endpoint

**POST** `/api/chat`

Request body:

```json
{
  "caseId": "appendicitis",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "studentMessage": "امتى بدأ الألم؟"
}
```

Response:

```json
{
  "reply": "..."
}
```

## Frontend

Serve the project root separately (ES modules require HTTP, not `file://`):

```bash
cd ..
python -m http.server 8000
```

Open **http://localhost:8000** while the API server is running on port 3000.
