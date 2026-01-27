# 🤖 WhatsApp Gemini AI Chatbot

An intelligent AI-powered WhatsApp chatbot built with Google's Gemini AI, enabling seamless two-way conversations through WhatsApp using Twilio integration.

## 📋 Description

This project is a full-stack application that creates an AI-powered chatbot accessible through WhatsApp. It combines the power of Google's Gemini AI for intelligent responses with Twilio's WhatsApp API for message delivery, wrapped in a modern React-based web interface for monitoring and managing conversations.

### Key Features

- 🧠 **AI-Powered Responses**: Leverages Google Gemini AI for intelligent, context-aware conversations
- 💬 **Two-Way Communication**: Full bidirectional messaging between WhatsApp and the web interface
- 🌐 **Real-time Chat Interface**: Modern, responsive React frontend for monitoring conversations
- 📱 **WhatsApp Integration**: Seamless integration with WhatsApp via Twilio API
- 💾 **Message Persistence**: MongoDB database for storing conversation history
- 🚀 **Easy Deployment**: Simple setup with environment variables and batch scripts

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API endpoints for message handling
- Google Gemini AI integration for generating responses
- Twilio API integration for WhatsApp messaging
- MongoDB for data persistence
- CORS-enabled for frontend communication

### Frontend (React + Vite)
- Modern, responsive chat interface
- Real-time message display
- Clean and intuitive user experience
- Built with Vite for fast development and optimized builds

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Model**: Google Gemini AI
- **Messaging**: Twilio WhatsApp API
- **Database**: MongoDB with Mongoose ODM
- **Environment Management**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Modern CSS

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Twilio account with WhatsApp sandbox configured
- Google Gemini API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/BGJ06/Chatbot-with-Gemini-LLM.git
   cd whatsapp-gemini-chatbot
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   MONGODB_URI=your_mongodb_connection_string
   ```

## 🚀 Usage

### Option 1: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Automated Start (Windows)

Simply run the provided batch script:
```bash
start_app.bat
```

This will automatically start both the backend server and frontend development server in separate terminal windows.

## 📱 How It Works

1. **User sends a WhatsApp message** to your Twilio WhatsApp number
2. **Twilio forwards the message** to your backend webhook
3. **Backend processes the message** and sends it to Google Gemini AI
4. **Gemini generates an intelligent response** based on the conversation context
5. **Backend sends the response** back to WhatsApp via Twilio
6. **Frontend displays** the entire conversation in real-time

## 🔧 Configuration

### Twilio WhatsApp Setup
1. Create a Twilio account at [twilio.com](https://www.twilio.com)
2. Access the WhatsApp Sandbox
3. Configure the webhook URL to point to your backend endpoint
4. Add your Twilio credentials to the `.env` file

### Google Gemini API
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your `.env` file

### MongoDB
1. Set up a MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
2. Add the connection string to your `.env` file

## 📂 Project Structure

```
whatsapp-gemini-chatbot/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env            # Environment variables
├── frontend/
│   ├── src/            # React source files
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite configuration
├── start_app.bat       # Automated startup script
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Keep your API keys and tokens secure
- Use environment variables for all sensitive data
- Regularly rotate your API keys and tokens

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**BGJ06**
- GitHub: [@BGJ06](https://github.com/BGJ06)

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Twilio for WhatsApp API integration
- React and Vite teams for excellent development tools

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainer.

---

**Note**: This is a development project. For production deployment, ensure proper security measures, error handling, and scalability considerations are implemented.
