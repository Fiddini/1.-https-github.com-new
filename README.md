# LACITA AI EDU - RIAU LEARNING 🎓
Asisten Pembelajaran AI untuk Siswa SMA di Provinsi Riau

**Status:** Production Ready v1-live-school ✅
**Multi-User Privacy:** Session Isolation Enabled
**Deployment:** School-Ready with Ngrok Tunnel

---

## 🚀 Tech Stack
- **Frontend:** React + Vite
- **Backend:** Express.js
- **AI Model:** Groq llama-3.3-70b-versatile primary, OpenAI gpt-4o-mini fallback
- **Database:** Supabase PostgreSQL
- **Deployment:** Ngrok HTTPS Tunnel

---

## 📋 Prerequisites
- Node.js 18+ 
- npm/yarn
- Groq API Key (https://console.groq.com)
- OpenAI API Key (https://platform.openai.com/api-keys)
- Supabase Project (https://supabase.com)

---

## 🔧 Setup Cepat

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
```

### 3. Database Setup
Run the database schema update in Supabase SQL Editor:
```sql
-- See DATABASE_SCHEMA_UPDATE.sql for full schema
ALTER TABLE chats ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats(session_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
```

---

## 🏃 Cara Run

### Development Mode

**Terminal 1 - Backend:**
```bash
node server.js
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Mode with Public Access

**Terminal 1 - Backend:**
```bash
node server.js
```

**Terminal 2 - Frontend (Public Access):**
```bash
cd client
npm run dev -- --host 0.0.0.0
# Frontend accessible from network on port 5173
```

**Terminal 3 - Ngrok Tunnel:**
```bash
ngrok http 5173
# Generates HTTPS URL for public access
```

---

## 🌐 Deployment

### Ngrok Setup (Recommended for School Deployment)

1. **Install Ngrok:**
```bash
# macOS
brew install ngrok

# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc
sudo apt install ngrok
```

2. **Start Ngrok:**
```bash
ngrok http 5173
```

3. **Use Generated HTTPS URL:**
- Copy the HTTPS URL from ngrok output
- Share with students/school
- URL format: `https://xxxx-xxxx-xxxx.ngrok-free.dev`

### Production Considerations

- ✅ Session isolation ensures user privacy
- ✅ Multi-user support tested and verified
- ✅ CORS configured for ngrok compatibility
- ✅ Minimal logging for production performance
- ⚠️ Database schema update required before multi-user deployment

---

## 🔒 Security & Privacy

### Multi-User Session Isolation
- Each user gets unique session ID stored in localStorage
- Chat history isolated per session
- "New Chat" generates fresh session ID
- "Clear Chat" only deletes current session history

### API Key Security
- ✅ `.env` file in `.gitignore` (not committed)
- ✅ No hardcoded API keys in source code
- ✅ Environment variables only
- ✅ `.env.example` provided for reference

### Database Security
- ✅ Supabase Row Level Security (RLS) recommended
- ✅ Session-based data isolation
- ✅ Indexes for performance optimization

---

## 📁 Project Structure

```
otris-ai-backend/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── chat/      # Chat interface
│   │   │   └── layout/    # Layout components
│   │   └── pages/         # Page components
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── routes/                # API routes
│   └── slots.js          # Slot booking routes
├── backup/               # Project backups
│   ├── DATABASE_SCHEMA_UPDATE.sql
│   ├── server.js
│   └── client_src/
├── server.js             # Express backend
├── package.json          # Backend dependencies
├── .env.example          # Environment template
├── .env                  # Environment variables (not committed)
└── .gitignore           # Git ignore rules
```

---

## 🔌 API Endpoints

### POST /api/chat
Send message to AI with session isolation
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "session_id": "unique_session_id"
  }'
```

### GET /api/history?session_id=xxx
Get chat history for specific session
```bash
curl "http://localhost:3000/api/history?session_id=unique_session_id"
```

### DELETE /api/history/clear?session_id=xxx
Clear chat history for specific session
```bash
curl -X DELETE "http://localhost:3000/api/history/clear?session_id=unique_session_id"
```

---

## 🧪 Testing

### Multi-User Session Testing
```bash
# Test User 1
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Saya siswa kelas 10A"}],"session_id":"session_siswa10A"}'

# Test User 2  
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Saya guru IPA"}],"session_id":"session_guruIPA"}'

# Verify isolation - different responses for different sessions
```

---

## 📝 Version History

- **v1-live-school** - Production-ready for school deployment with multi-user privacy
- **v1.0** - Initial production version
- Database schema update required for full multi-user functionality

---

## 🆘 Troubleshooting

### Backend not starting
- Check `.env` file exists and has correct values
- Verify API keys are valid
- Check port 3000 is not in use

### Frontend not accessible
- Ensure Vite dev server is running
- Check port 5173 is not in use
- For public access, use `--host 0.0.0.0` flag

### Ngrok tunnel issues
- Ensure ngrok is installed and authenticated
- Check frontend is running on port 5173
- Verify no firewall blocking ngrok

### Chat history not saving
- Run DATABASE_SCHEMA_UPDATE.sql in Supabase
- Verify Supabase credentials in `.env`
- Check session_id is being sent correctly

---

## 📞 Support

For issues or questions:
- Check Supabase dashboard for database issues
- Verify Groq API status
- Review ngrok tunnel configuration

---

**Generated for LACITA AI EDU - RIAU LEARNING** 🎓
