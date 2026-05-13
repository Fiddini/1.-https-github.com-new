import { motion } from "framer-motion";
import { Brain, MessageSquare, BookOpen, FileText, TrendingUp, Clock, Star, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { icon: MessageSquare, label: "Total Chat", value: "156", change: "+12%" },
    { icon: BookOpen, label: "Materi Dipelajari", value: "23", change: "+5%" },
    { icon: FileText, label: "Soal Dikerjakan", value: "89", change: "+18%" },
    { icon: TrendingUp, label: "Progress", value: "78%", change: "+8%" },
  ];

  const recentActivities = [
    { topic: "Anatomi Manusia", time: "2 jam lalu", type: "chat" },
    { topic: "Sistem Pernapasan", time: "5 jam lalu", type: "materi" },
    { topic: "Soal Biologi", time: "1 hari lalu", type: "soal" },
    { topic: "Sel dan Jaringan", time: "2 hari lalu", type: "chat" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-medical-300">Selamat datang kembali di OTRIS AI</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 md:px-6 py-3 bg-medical-500 hover:bg-medical-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all glow text-sm md:text-base"
        >
          <Brain className="w-5 h-5" />
          <span className="hidden sm:inline">Mulai Chat Baru</span>
          <span className="sm:hidden">Chat</span>
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass p-6 rounded-2xl border border-medical-700/50 hover:border-medical-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-medical-500/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-medical-400" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-medical-300 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass p-6 rounded-2xl border border-medical-700/50"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-4 p-4 bg-medical-800/50 rounded-xl border border-medical-700/50 hover:border-medical-500/50 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 bg-medical-500/20 rounded-lg flex items-center justify-center">
                  {activity.type === "chat" && <MessageSquare className="w-5 h-5 text-medical-400" />}
                  {activity.type === "materi" && <BookOpen className="w-5 h-5 text-medical-400" />}
                  {activity.type === "soal" && <FileText className="w-5 h-5 text-medical-400" />}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.topic}</div>
                  <div className="text-medical-400 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-medical-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-6 rounded-2xl border border-medical-700/50"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            {[
              { label: "Chat dengan AI", icon: MessageSquare, color: "medical" },
              { label: "Pelajari Materi", icon: BookOpen, color: "accent" },
              { label: "Kerjakan Soal", icon: FileText, color: "medical" },
              { label: "Lihat Progress", icon: TrendingUp, color: "accent" },
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-4 bg-medical-800/50 rounded-xl border border-medical-700/50 hover:border-medical-500/50 transition-all text-left"
              >
                <action.icon className={`w-5 h-5 text-${action.color}-400`} />
                <span className="text-white">{action.label}</span>
                <ArrowRight className="w-5 h-5 text-medical-400 ml-auto" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Featured Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass p-6 rounded-2xl border border-medical-700/50"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Topik Populer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Anatomi Tubuh", progress: 85 },
            { name: "Fisiologi", progress: 72 },
            { name: "Biologi Seluler", progress: 90 },
          ].map((topic, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-medical-800/50 rounded-xl border border-medical-700/50 hover:border-medical-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{topic.name}</span>
                <span className="text-medical-400 text-sm">{topic.progress}%</span>
              </div>
              <div className="w-full bg-medical-900 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${topic.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-medical-500 to-accent-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}