import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Brain,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: MessageSquare, label: "Chat AI", id: "chat" },
  { icon: BookOpen, label: "Materi", id: "materi" },
  { icon: FileText, label: "Soal", id: "soal" },
  { icon: Activity, label: "Analisis", id: "analisis" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-medical-500 rounded-lg text-white glow"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0),
        }}
        className={cn(
          "glass h-screen flex flex-col border-r border-medical-700/50 relative z-50",
          "lg:translate-x-0 fixed lg:static"
        )}
      >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-medical-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="w-8 h-8 text-medical-400" />
            <div className="absolute inset-0 blur-xl bg-medical-400/50 rounded-full" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <span className="text-xl font-bold text-gradient">OTRIS AI</span>
                <span className="text-xs text-medical-400">Medical Learning</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 hover:bg-medical-800/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
              activeTab === item.id
                ? "bg-medical-500/20 text-medical-400 border border-medical-500/50 glow"
                : "text-medical-300 hover:bg-medical-800/50 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", activeTab === item.id && "text-medical-400")} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-medical-700/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-medical-300 hover:bg-medical-800/50 hover:text-white transition-all duration-300"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="font-medium"
              >
                Pengaturan
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-medical-500 rounded-full flex items-center justify-center text-white shadow-lg glow hidden lg:flex"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </motion.button>
    </motion.aside>
    </>
  );
}