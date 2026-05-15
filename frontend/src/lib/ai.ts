import { createServerFn } from '@tanstack/react-start';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API key
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
console.log('AI Initializing with API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING');

// Create a GoogleGenAI instance
const ai = new GoogleGenAI({ apiKey });

/**
 * Parse transaction text into structured data.
 * Expects `data` (raw text) and optional `typeHint`.
 */
export const parseTransactionFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any) => {
    const { data: text, typeHint } = ctx as { data: string; typeHint?: string };
    try {
      console.log(`AI Parsing Request [${typeHint || 'auto'}]:`, text);
      const now = new Date();
      const todayStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      const prompt = `
Context: Financial assistant.
Task: Extract transactions from this text: "${text}".
Today: ${todayStr} (${now.toISOString().split('T')[0]})
${typeHint ? `Note: User explicitly said this is a ${typeHint}. Force the "type" to "${typeHint === 'saving' ? 'expense' : typeHint}" and "cat" to "${typeHint === 'saving' ? 'Tabungan' : ''}" if unclear.` : ''}
  


Rules:
- Return ONLY a JSON array. No text before or after.
- Schema: [{ "item": string, "cat": string, "type": "expense"|"income", "amount": number, "date": "YYYY-MM-DD" }]
- Categories: F&B, Transport, Income, Hiburan, Belanja, Sewa, Listrik, Internet, Tabungan, Investasi, Persepuluhan, Bulanan Orang Tua.
- If amount is in "rb" or "k", convert to thousands (e.g. 50rb -> 50000).
- If no item name found, use the category as item name.
`;

      const response = await ai.models.generateContent({ model: 'gemini-1.0-pro', contents: prompt });
      let responseText = response.text || '[]';
      console.log('AI Raw Response:', responseText);

      // Extract JSON array if wrapped in extra text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) responseText = jsonMatch[0];

      const parsed = JSON.parse(responseText.trim());
      console.log('AI Parsed Data:', parsed);

      const sanitized = (Array.isArray(parsed) ? parsed : []).map((tx: any) => ({
        ...tx,
        type: typeHint && typeHint !== 'saving' ? typeHint : tx.type || 'expense',
        amount: Number(tx.amount) || 0,
      }));

      return { success: true, data: sanitized };
    } catch (error: any) {
      console.error('AI Parsing Error:', error);
      return { success: false, error: error.message || 'Gagal memproses teks' };
    }
  });

/**
 * Generate AI insights based on a list of transactions.
 */
export const getAIInsightsFn = createServerFn({ method: 'POST' })
  .handler(async (ctx: any) => {
    const { data: txs } = ctx as { data: any[] };
    try {
      const prompt = `
Anda adalah konsultan keuangan pribadi cerdas dan jujur bernama Wiglads.
Berikut adalah daftar transaksi pengguna bulan ini: ${JSON.stringify(txs)}

Tugas Anda:
1. Analisis apakah pengguna terlalu banyak jajan (F&B) atau hiburan.
2. Jika ada pemborosan, berikan teguran yang sopan tapi "ngena" agar mereka sadar (bahasa santai, Indonesia).
3. Jika tabungan mereka bagus, berikan pujian.
4. Berikan 1 tips konkret agar sisa saldo cukup sampai akhir bulan.
5. Gunakan maksimal 2-3 kalimat yang sangat personal (panggil "kamu").

Jangan gunakan markdown, cukup teks biasa.
`;
      const response = await ai.models.generateContent({ model: 'gemini-1.0-pro', contents: prompt });
      return { success: true, text: response.text };
    } catch (error: any) {
      console.error('AI Insights Error:', error);
      return { success: false, error: error.message };
    }
  });
