export async function generateGeminiReply({ apiKey, model, system, contents }) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    signal: AbortSignal.timeout(25_000),
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: 1200, temperature: 0.55 } })
  });
  if (!response.ok) throw Object.assign(new Error('The Gemini provider request failed.'), { providerStatus: response.status });
  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.map(part => part.text ?? '').join('').trim();
  if (!reply) throw Object.assign(new Error('Gemini returned no text.'), { providerStatus: 502 });
  return reply.slice(0, 12_000);
}
