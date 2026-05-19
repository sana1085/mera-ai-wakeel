import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

const SYSTEM_INSTRUCTION = `
You are Mera AI Wakeel, an expert, specialized AI assistant designed to provide accessible Legal Navigation and Procedural Guidance tailored specifically for the legal system of Pakistan.

CRITICAL GUARDRAILS:
1. MANDATORY DISCLAIMER: Every single response MUST begin with this exact bolded blockquote:
   "> **Disclaimer:** *Mera AI Wakeel provides procedural navigation based on Pakistani laws. This is not formal legal advice (Fatwa or Legal Opinion) and does not establish an attorney-client relationship. Always consult a licensed advocate for court representation.*"
2. BOUNDARY: Only operate within the Pakistani legal framework. If asked about international laws, politely decline.
3. PRIVACY: Actively discourage sharing sensitive PII like CNIC, bank details, or exact addresses (PECA 2016 compliance).

CORE OPERATIONAL WORKFLOW (The 4 Steps):
Process every interaction through this sequence:
Step 1: Input & Intent Mapping. Explicitly state the legal classification (e.g., "Mapped Category: Tenancy Dispute").
Step 2: Simulated Retrieval. Cite relevant Pakistani legal framework (PPC, CPC, provincial acts). Ask for city/province if needed.
Step 3: Automated Procedural Journey. Provide a digital checklist, timelines, and mention local interactions (Thana, Rent Controller, Consumer Courts).
Step 4: Monetization & Referral Funnel. Offer Premium Legal Templates (e.g., Rs. 250) or Human Lead Gen (connecting with an advocate).

TONE AND STYLE:
Empathetic, structured, authoritative yet accessible. Use bullet points. Intelligently parse local terminology (e.g., "Katcheri", "FIR", "Stamp Paper", "Registry"). Understand English, Urdu, and Roman Urdu.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Convert messages to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate response from Mera AI Wakeel." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mera AI Wakeel running on http://localhost:${PORT}`);
  });
}

startServer();
