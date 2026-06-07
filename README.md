# 🤖 AI Chatbot

A modern AI-powered chatbot built with **React.js**, **Node.js**, **TypeScript**, and **Groq SDK**. The application provides real-time conversational AI capabilities with user authentication, conversation management, and persistent chat history.

## 🚀 Features

* 🔐 User Authentication (Register & Login)
* 💬 Real-time AI Conversations
* 📚 Conversation History Management
* 🧠 AI Responses powered by Groq LLMs
* 🔄 Persistent Chat Storage
* 🎨 Modern React User Interface
* ⚡ Fast Backend with Node.js & Express
* 🛡️ JWT-based Authentication
* 📱 Responsive Design
* 🗂️ Multiple Chat Conversations

---

## 🛠️ Tech Stack

### Frontend

* React.js
* TypeScript
* Axios
* React Router
* CSS / Tailwind CSS (if applicable)

### Backend

* Node.js
* Express.js
* TypeScript
* Sequelize ORM
* JWT Authentication
* bcryptjs

### Database

* PostgreSQL / MySQL (Update based on your database)

### AI Integration

* Groq SDK
* Llama Models / Groq Supported Models

---

## 📂 Project Structure

```bash
project-root/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── config/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=your_jwt_secret

DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatbot_db
DB_USER=postgres
DB_PASSWORD=password

GROQ_API_KEY=your_groq_api_key
```

Start backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application will run on:

```text
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

---

## 🔑 Environment Variables

| Variable     | Description         |
| ------------ | ------------------- |
| PORT         | Backend Server Port |
| JWT_SECRET   | JWT Secret Key      |
| DB_HOST      | Database Host       |
| DB_PORT      | Database Port       |
| DB_NAME      | Database Name       |
| DB_USER      | Database User       |
| DB_PASSWORD  | Database Password   |
| GROQ_API_KEY | Groq API Key        |

---

## 📡 API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
```

#### Login

```http
POST /api/auth/login
```

### Conversations

#### Create Conversation

```http
POST /api/chat/conversations
```

#### Get Conversations

```http
GET /api/chat/conversations
```

### Messages

#### Send Message

```http
POST /api/chat/conversations/:id/messages
```

#### Get Messages

```http
GET /api/chat/conversations/:id/messages
```

---

## 🧠 AI Flow

1. User sends a message.
2. Message is stored in the database.
3. Conversation history is retrieved.
4. History is sent to Groq LLM.
5. AI response is generated.
6. Response is stored and returned to the user.

---

## 🔒 Security

* Password Hashing using bcryptjs
* JWT Authentication
* Protected API Routes
* Environment Variables for Secrets
* Secure Database Access

---

## 📈 Future Improvements

* Streaming Responses
* Typing Indicators
* File Upload Support
* Voice Conversations
* Multi-Model Selection
* Conversation Search
* AI Chat Titles Generation
* Docker Deployment
* AWS Deployment

---

## 👨‍💻 Author

**Pooja Malviya**

* GitHub: https://github.com/poojamalviya20
* LinkedIn: www.linkedin.com/in/pooja-malviya-7619881a9

---

## 📄 License

This project is licensed under the MIT License.

⭐ If you found this project useful, please consider giving it a star.
