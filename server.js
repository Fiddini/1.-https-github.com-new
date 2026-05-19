import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import slotsRouter from "./routes/slots.js";

dotenv.config();

const config = {
  groqApiKey: process.env.GROQ_API_KEY?.trim(),
  openaiApiKey: process.env.OPENAI_API_KEY?.trim(),
  supabaseUrl: process.env.SUPABASE_URL?.trim(),
  supabaseKey: process.env.SUPABASE_KEY?.trim(),
};

const missingEnv = Object.entries(config)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnv.length > 0) {
  console.warn(`⚠️ Missing environment: ${missingEnv.join(", ")}. Backend running in degraded mode.`);
}

const isSupabaseConfigured =
  Boolean(config.supabaseUrl) &&
  config.supabaseUrl.startsWith("https://") &&
  Boolean(config.supabaseKey);

if (config.supabaseUrl && !config.supabaseUrl.startsWith("https://")) {
  console.warn("⚠️ SUPABASE_URL harus dimulai dengan https://. Supabase disabled.");
}

const app = express();
app.use(cors({
  origin: true, // Allow all origins for development with ngrok
  credentials: true,
}));
app.use(express.json());

const groq = config.groqApiKey
  ? new OpenAI({
      apiKey: config.groqApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

const openai = config.openaiApiKey
  ? new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: "https://api.openai.com/v1",
    })
  : null;

const supabase = isSupabaseConfigured
  ? createClient(config.supabaseUrl, config.supabaseKey)
  : null;

// Import routes
app.use("/api/slot", slotsRouter);

const SYSTEM_PROMPT =
  "Anda adalah LACITA AI EDU, asisten belajar untuk siswa SMA di Provinsi Riau. Jawab soal & jelaskan materi SMA dengan bahasa santai.";

const FALLBACK_REPLY =
  "Maaf, layanan AI sedang tidak bisa dihubungi. Saya tetap siap membantu; coba lagi sebentar lagi atau periksa konfigurasi API.";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENAI_FALLBACK_MODEL = "gpt-4o-mini";
const AI_TIMEOUT_MS = 10_000;

class AiTimeoutError extends Error {
  constructor(provider) {
    super(`${provider} request timed out after ${AI_TIMEOUT_MS}ms`);
    this.name = "AiTimeoutError";
    this.status = 408;
  }
}

const createChatCompletion = async ({ client, model, messages, provider }) => {
  if (!client) {
    throw new Error(`${provider} client is not configured`);
  }

  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new AiTimeoutError(provider)), AI_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      client.chat.completions.create({
        model,
        max_tokens: 200,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
      timeout,
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const shouldFallbackToOpenAI = (error) => {
  const status = error?.status || error?.code || error?.response?.status;
  return (
    error instanceof AiTimeoutError ||
    status === 401 ||
    status === 429 ||
    (typeof status === "number" && status >= 500)
  );
};

const getAiReply = async (messages) => {
  if (groq) {
    try {
      const completion = await createChatCompletion({
        client: groq,
        model: GROQ_MODEL,
        messages,
        provider: "Groq",
      });

      return {
        reply: completion.choices[0]?.message?.content || FALLBACK_REPLY,
        provider: "groq",
      };
    } catch (error) {
      console.error("Groq API error:", error.message);

      if (!shouldFallbackToOpenAI(error)) {
        return { reply: FALLBACK_REPLY, provider: "fallback" };
      }

      console.warn("Groq failed, falling back to OpenAI");
    }
  } else {
    console.warn("Groq client disabled: GROQ_API_KEY missing.");
    console.warn("Groq failed, falling back to OpenAI");
  }

  if (!openai) {
    console.warn("OpenAI client disabled: OPENAI_API_KEY missing.");
    return { reply: FALLBACK_REPLY, provider: "fallback" };
  }

  try {
    const completion = await createChatCompletion({
      client: openai,
      model: OPENAI_FALLBACK_MODEL,
      messages,
      provider: "OpenAI",
    });

    return {
      reply: completion.choices[0]?.message?.content || FALLBACK_REPLY,
      provider: "openai",
    };
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    return { reply: FALLBACK_REPLY, provider: "fallback" };
  }
};

app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    services: {
      groq: Boolean(groq),
      openai: Boolean(openai),
      supabase: Boolean(supabase),
    },
    fallback: (!groq && !openai) || !supabase,
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, session_id, mode = "belajar" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages wajib diisi sebagai array" });
    }

    if (!session_id) {
      return res.status(400).json({ error: "session_id wajib diisi" });
    }

    const userMessage = messages[messages.length - 1]?.content;

    if (typeof userMessage !== "string" || !userMessage.trim()) {
      return res.status(400).json({ error: "pesan terakhir wajib berupa teks" });
    }

    console.log(`[${new Date().toISOString()}] Chat request: ${userMessage.substring(0, 50)}...`);

    const { reply: aiReply, provider } = await getAiReply(messages);
    const fallback = provider === "fallback";

    if (supabase) {
      try {
        const { error: insertError } = await supabase.from("chats").insert({
          session_id,
          message: userMessage,
          user_message: userMessage,
          ai_reply: aiReply,
          mode,
        });

        if (insertError) {
          console.error("Error saving chat:", insertError.message);
        }
      } catch (error) {
        console.error("Error saving chat:", error.message);
      }
    } else {
      console.warn("Supabase disabled: chat not saved.");
    }

    res.json({ reply: aiReply, fallback, provider });
  } catch (error) {
    console.error("API Error:", error.message);
    res.json({ reply: FALLBACK_REPLY, fallback: true });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "session_id wajib diisi" });
    }

    if (!supabase) {
      return res.json({ history: [], fallback: true });
    }

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("session_id", session_id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("History error:", error.message);
      return res.json({ history: [], fallback: true });
    }

    res.json({ history: (data || []).slice().reverse() });
  } catch (error) {
    console.error("History error:", error.message);
    res.json({ history: [], fallback: true });
  }
});

app.delete("/api/history/clear", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "session_id wajib diisi" });
    }

    if (!supabase) {
      return res.json({ success: true, fallback: true });
    }

    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("session_id", session_id);

    if (error) {
      console.error("Clear chat error:", error.message);
      return res.json({ success: false, fallback: true });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Clear chat error:", error.message);
    res.json({ success: false, fallback: true });
  }
});

app.listen(3000, () => {
  console.log("OTRIS AI backend jalan di http://localhost:3000");
});
