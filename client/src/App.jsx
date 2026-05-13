import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/layout/Sidebar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ChatInterface from "./components/chat/ChatInterface";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleStartChat = () => {
    setShowLanding(false);
    setActiveTab("chat");
  };

  if (showLanding) {
    return <LandingPage onStartChat={handleStartChat} />;
  }

  return (
    <div className="flex min-h-screen bg-medical-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden lg:ml-0">
        <div className="h-full pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto"
              >
                <Dashboard />
              </motion.div>
            )}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ChatInterface />
              </motion.div>
            )}
            {activeTab !== "dashboard" && activeTab !== "chat" && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sedang Dalam Pengembangan</h2>
                  <p className="text-medical-300">Fitur ini akan segera tersedia</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;