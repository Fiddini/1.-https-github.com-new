import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import slotsRouter from "./routes/slots.js";

dotenv.config();

// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY tidak ditemukan di .env");
  process.exit(1);
}

if (!process.env.SUPABASE_URL) {
  console.error("❌ ERROR: SUPABASE_URL tidak ditemukan di .env");
  process.exit(1);
}

if (!process.env.SUPABASE_KEY) {
  console.error("❌ ERROR: SUPABASE_KEY tidak ditemukan di .env");
  process.exit(1);
}

if (!process.env.SUPABASE_URL.startsWith("https://")) {
  console.error("❌ ERROR: SUPABASE_URL harus dimulai dengan https://");
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));
app.use(express.json());

// Setup Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Setup Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Import routes
app.use("/api/slot", slotsRouter);

const SYSTEM_PROMPT =
  "Kamu OTRIS AI. Asisten anatomi SMA. Jawab singkat max 3 kalimat, bahasa santai.";

app.post("/api/chat", async (req, res) => {
  try {
    console.log("🔥 CHAT ENDPOINT CALLED");
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log("❌ ERROR: Messages tidak valid");
      return res.status(400).json({ error: "messages wajib diisi sebagai array" });
    }

    const userMessage = messages[messages.length - 1].content;
    const mode = "belajar";

    console.log("=== REQUEST MASUK ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("User message:", userMessage);
    console.log("Mode:", mode);
    console.log("Messages count:", messages.length);

    // Panggil Groq API
    console.log("🤖 Memanggil Groq API...");
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const aiReply = completion.choices[0]?.message?.content || "Maaf, AI gak jawab.";
    console.log("✅ Balasan AI:", aiReply);

    // Simpan ke table chats
    console.log("💾 Menyimpan ke chats...");
    const { error: insertError } = await supabase.from("chats").insert({
      message: userMessage,
      mode: mode,
      user_message: userMessage,
      ai_reply: aiReply,
    });

    if (insertError) {
      console.error("❌ Error menyimpan chats:", insertError);
    } else {
      console.log("✅ Chat berhasil disimpan");
    }

    res.json({ reply: aiReply });
  } catch (error) {
    console.log("❌ ERROR API");
    console.log("Error message:", error.message);
    res.status(500).json({ error: "Server OTRIS AI error" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    console.log("=== GET HISTORY ===");
    console.log("Timestamp:", new Date().toISOString());

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("❌ Error mengambil history:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ History berhasil diambil:", data?.length || 0, "chat");
    res.json({ history: data || [] });
  } catch (error) {
    console.error("❌ Error GET history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("OTRIS AI backend jalan di http://localhost:3000");
});
