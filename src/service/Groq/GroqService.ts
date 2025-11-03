import fetch from "node-fetch";

export class GroqService {
    async execute({ prompt }: { prompt: string }) {
        if (!prompt) throw new Error("Prompt é obrigatório");

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

        if (!GROQ_API_KEY) throw new Error("Chave de API do Groq não configurada no .env");

        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorBody: any = await response.json();
            const errorMessage =
                (errorBody?.error?.message) ||
                (errorBody?.message) ||
                JSON.stringify(errorBody);
            throw new Error(`Erro na API Groq: ${response.status} - ${errorMessage}`);
        }

        return await response.json();
    }
}