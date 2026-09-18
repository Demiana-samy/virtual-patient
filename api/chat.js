import { cases } from '../js/data/cases/index.js';
import { buildSystemPrompt } from '../server/promptBuilder.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      // ignore parse error if body is already handled or malformed
    }
  }

  const { caseId, conversationHistory, studentMessage } = body ?? {};

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
    res.status(500).json({ error: 'GROQ_API_KEY is not configured' });
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

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages,
        max_tokens: 512,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errText);
      res.status(502).json({ error: 'Failed to get a response from the language model' });
      return;
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    res.status(200).json({ reply: reply || '...' });
  } catch (err) {
    console.error('Groq request failed:', err.message);
    res.status(502).json({ error: 'Failed to get a response from the language model' });
  }
}
