import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { cases } from '../js/data/cases/index.js';
import { buildSystemPrompt } from './promptBuilder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.post('/api/chat', async (req, res) => {
  try {
    const { caseId, conversationHistory, studentMessage } = req.body ?? {};

    if (!caseId || typeof studentMessage !== 'string' || !studentMessage.trim()) {
      res.status(400).json({ error: 'caseId and studentMessage are required' });
      return;
    }

    if (!Array.isArray(conversationHistory)) {
      res.status(400).json({ error: 'conversationHistory must be an array' });
      return;
    }

    const caseData = cases[caseId];
    if (!caseData) {
      res.status(404).json({ error: `Unknown case: ${caseId}` });
      return;
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('Groq Error: GROQ_API_KEY is missing from environment variables');
      res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server' });
      return;
    }

    const systemPrompt = buildSystemPrompt(caseData);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.filter(
        (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
      ),
      { role: 'user', content: studentMessage.trim() },
    ];

    const modelName = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        max_tokens: 512,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error(`Groq API Error HTTP ${groqResponse.status}:`, errText);
      res.status(502).json({
        error: `خادم الذكاء الاصطناعي أرجع خطأ (${groqResponse.status}). يرجى إعادة المحاولة.`,
        details: errText,
      });
      return;
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.warn('Groq returned empty content reply:', JSON.stringify(data));
    }

    res.json({ reply: reply || 'عذراً، لم أستطع فهم السؤال، هل يمكنك إعادة طرحه؟' });
  } catch (err) {
    console.error('Server Express request failure:', err);
    res.status(500).json({ error: `حدث خطأ في معالجة الطلب: ${err.message || err}` });
  }
});

app.listen(PORT, () => {
  console.log(`Virtual Patient API listening on http://localhost:${PORT}`);
});