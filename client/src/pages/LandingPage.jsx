import { motion } from "framer-motion";
import { Brain, Sparkles, Shield, Zap, Users, ArrowRight, Activity } from "lucide-react";

export default function LandingPage({ onStartChat }) {
  const features = [
    {
      icon: Brain,
      title: "AI Cerdas",
      description: "Didukung oleh AI tercanggih untuk pembelajaran medis",
    },
    {
      icon: Shield,
      title: "Akurat & Terpercaya",
      description: "Informasi medis yang valid dan terpercaya",
    },
    {
      icon: Zap,
      title: "Cepat & Efisien",
      description: "Respon instan untuk pertanyaan medis Anda",
    },
    {
      icon: Users,
      title: "Mudah Digunakan",
      description: "Antarmuka yang intuitif untuk semua kalangan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-950 via-medical-900 to-medical-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-medical-500/20 border border-medical-500/50 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-medical-400" />
              <span className="text-medical-400 text-sm font-medium">AI Medis Terdepan</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-gradient">OTRIS AI</span>
              <br />
              <span className="text-white">Asisten Pembelajaran Medis</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-medical-300 max-w-2xl mx-auto mb-10 px-4"
            >
              Platform pembelajaran medis berbasis AI yang membantu Anda memahami materi
              kesehatan dengan cara yang interaktif dan personal
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartChat}
                className="px-8 py-4 bg-medical-500 hover:bg-medical-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all glow"
              >
                Mulai Chat Sekarang
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-medical-800/50 hover:bg-medical-700/50 border border-medical-700/50 text-white rounded-xl font-semibold transition-all"
              >
                Pelajari Lebih Lanjut
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Mengapa OTRIS AI?</h2>
            <p className="text-medical-300 text-lg max-w-2xl mx-auto">
              Fitur-fitur premium untuk pengalaman pembelajaran terbaik
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-6 rounded-2xl border border-medical-700/50 hover:border-medical-500/50 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-medical-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-medical-500/30 transition-all">
                  <feature.icon className="w-7 h-7 text-medical-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-medical-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-medical-700/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-gradient mb-2">10K+</div>
                <div className="text-medical-300">Pengguna Aktif</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-gradient mb-2">50K+</div>
                <div className="text-medical-300">Pertanyaan Dijawab</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-gradient mb-2">98%</div>
                <div className="text-medical-300">Tingkat Kepuasan</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-medical-700/50 glow"
          >
            <Activity className="w-16 h-16 text-medical-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Siap Memulai?</h2>
            <p className="text-medical-300 text-lg mb-8">
              Bergabunglah dengan ribuan pengguna lainnya dan rasakan kemudahan pembelajaran
              medis dengan OTRIS AI
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartChat}
              className="px-8 py-4 bg-medical-500 hover:bg-medical-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto transition-all glow"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}