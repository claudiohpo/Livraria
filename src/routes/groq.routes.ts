import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt é obrigatório" });
    return;
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

  if (!GROQ_API_KEY) {
    res.status(500).json({ error: "Chave de API do Groq não configurada no .env" });
    return;
  }

  try {
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
        (errorBody && typeof errorBody === "object" && "error" in errorBody && errorBody.error && errorBody.error.message) ||
        (errorBody && typeof errorBody === "object" && "message" in errorBody && errorBody.message) ||
        JSON.stringify(errorBody);
      throw new Error(`Erro na API Groq: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    res.json(data); // ✅ apenas envia a resposta
  } catch (error) {
    console.error("Erro na rota /groq:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;