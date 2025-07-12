# 🧠 MindGym

A LeetCode-like platform focused on Python-based algorithm and data structure problems. Built with modern web technologies and containerized judging system.

## 🚀 Features

- **Python-Only Focus**: Specialized platform for Python enthusiasts
- **Secure Code Execution**: Docker-based sandboxed judging environment
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Code Editor**: Monaco Editor with Python syntax highlighting
- **User Management**: JWT-based authentication with user profiles
- **Problem Management**: Admin panel for creating and managing problems
- **Submission Tracking**: Detailed submission history and statistics
- **Performance Monitoring**: Runtime and memory usage tracking

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express (ESModules)
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Docker** for secure code execution
- **Bcrypt** for password hashing

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API communication

### DevOps
- **Docker** for containerization
- **MongoDB** database
- **Node.js** runtime environment

## 📁 Project Structure

```
mindgym/
├── backend/              # Node.js backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── scripts/         # Utility scripts
│   └── utils/           # Helper utilities
├── frontend/            # React frontend
│   ├── public/          # Static files
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # State management
│   │   └── types/       # TypeScript types
├── database/            # Database schemas
├── scripts/             # Setup scripts
├── docs/                # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- Docker 20.10+
- Python 3.9+ (for judging)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindgym
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or use local MongoDB installation
   mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get specific problem
- `GET /api/problems/stats` - Get problem statistics
- `POST /api/admin/problems` - Create new problem (admin)
- `PUT /api/admin/problems/:id` - Update problem (admin)
- `DELETE /api/admin/problems/:id` - Delete problem (admin)

### Submissions
- `POST /api/submissions` - Submit code for judging
- `GET /api/submissions/:id` - Get submission status
- `GET /api/submissions/user` - Get user's submission history
- `GET /api/submissions/stats` - Get submission statistics

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/mindgym
DB_NAME=mindgym

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Docker (for judge)
DOCKER_SOCKET=/var/run/docker.sock
JUDGE_TIMEOUT=3000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Admin
ADMIN_EMAIL=admin@mindgym.com
ADMIN_PASSWORD=admin123
```

**Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Setup
```bash
# Build backend image
cd backend
docker build -t mindgym-backend .

# Build frontend image
cd frontend
docker build -t mindgym-frontend .

# Run with Docker
docker run -d -p 5000:5000 mindgym-backend
docker run -d -p 3000:3000 mindgym-frontend
```

## 🔒 Security Features

- **Sandboxed Code Execution**: Docker containers with limited resources
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Joi schema validation
- **Authentication**: JWT tokens with expiration
- **Password Hashing**: Bcrypt with salt rounds
- **CORS Protection**: Configured for production
- **Helmet**: Security headers

## 📈 Performance

- **Judge Response Time**: < 3 seconds for 95% of submissions
- **Memory Limits**: 256MB per container
- **CPU Limits**: 50% CPU quota per container
- **Network Isolation**: No network access during execution
- **Auto-cleanup**: Temporary files and containers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Roadmap

### Phase 1 (Current)
- [x] Basic authentication system
- [x] Problem CRUD operations
- [x] Code submission and judging
- [x] User profiles and statistics
- [x] Admin panel

### Phase 2
- [ ] Advanced code editor features
- [ ] Problem difficulty calculation
- [ ] Discussion forums
- [ ] Solution sharing
- [ ] Contest system

### Phase 3
- [ ] Machine learning recommendations
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API documentation
- [ ] Premium features

## 🐛 Known Issues

- Judge system currently uses basic output comparison
- Memory tracking needs improvement
- Limited error messages for compilation issues
- No real-time submission updates

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by LeetCode's user experience
- Built with modern web development best practices
- Community-driven problem collection
- Open source technologies

## 📞 Support

For support, email support@mindgym.com or open an issue on GitHub.

---

**MindGym** - Where Python developers sharpen their algorithmic skills! 🐍✨