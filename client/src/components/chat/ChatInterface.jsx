import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("belajar");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, error]);

  // Load history from Supabase on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();
        
        if (data.history && data.history.length > 0) {
          // Convert Supabase format to messages format
          const historyMessages = data.history.flatMap((chat) => [
            { role: "user", content: chat.user_message },
            { role: "assistant", content: chat.ai_reply }
          ]);
          setMessages(historyMessages);
        } else {
          // Default welcome message if no history
          setMessages([
            {
              role: "assistant",
              content: "Halo! Saya LACITA AI EDU, teman belajar SMA Riau. Bagaimana saya bisa membantu Anda hari ini?",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading history:", error);
        setMessages([
          {
            role: "assistant",
            content: "Halo! Saya LACITA AI EDU, teman belajar SMA Riau. Bagaimana saya bisa membantu Anda hari ini?",
          },
        ]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setError(null);
    
    // Add user message immediately to UI
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
          mode: mode
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.reply) {
        throw new Error("Tidak ada respon dari server");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setError(error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      // Remove the last error message and user message
      setMessages(prev => prev.slice(0, -2));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="glass border-b border-medical-700/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-medical-400" />
              <div className="absolute inset-0 blur-xl bg-medical-400/50 rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">LACITA AI EDU Chat</h2>
              <p className="text-sm text-medical-400">Asisten Belajar SMA Riau</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["belajar", "soal", "ringkas"].map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === m
                    ? "bg-medical-500 text-white glow"
                    : "bg-medical-800/50 text-medical-300 hover:bg-medical-700/50"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-medical-400 animate-spin" />
            <span className="ml-3 text-medical-300">Memuat riwayat chat...</span>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-accent-500/20 border border-accent-500/50"
                      : message.role === "error"
                      ? "bg-red-500/20 border border-red-500/50"
                      : "bg-medical-500/20 border border-medical-500/50"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-accent-400" />
                  ) : message.role === "error" ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Bot className="w-5 h-5 text-medical-400" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-2xl p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-accent-500/20 border border-accent-500/50"
                      : message.role === "error"
                      ? "bg-red-500/20 border border-red-500/50"
                      : "bg-medical-800/50 border border-medical-700/50"
                  }`}
                >
                  <p className="text-white whitespace-pre-wrap">{message.content}</p>
                  {message.role === "error" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRetry}
                      className="mt-3 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 border border-red-500/50 rounded-lg text-white text-sm flex items-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Coba Lagi</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && !isLoadingHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-medical-500/20 border border-medical-500/50">
              <Bot className="w-5 h-5 text-medical-400" />
            </div>
            <div className="flex-1 p-4 rounded-2xl bg-medical-800/50 border border-medical-700/50">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-medical-400 animate-spin" />
                <span className="text-medical-300">LACITA AI EDU sedang berpikir...</span>
              </div>
              <div className="mt-2 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-medical-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-medical-700/50 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pertanyaan Anda..."
              className="w-full bg-medical-800/50 border border-medical-700/50 rounded-xl px-4 py-3 text-white placeholder-medical-400 resize-none focus:outline-none focus:border-medical-500/50 focus:ring-2 focus:ring-medical-500/20 transition-all"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "200px" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isLoadingHistory}
            className="px-6 bg-medical-500 hover:bg-medical-600 disabled:bg-medical-800 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 transition-all glow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Kirim</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}