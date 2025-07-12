#!/bin/bash

# MindGym Setup Script
echo "🧠 Setting up MindGym..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if MongoDB is running
if ! docker ps | grep -q mongo; then
    echo "🐳 Starting MongoDB container..."
    docker run -d -p 27017:27017 --name mindgym-mongodb mongo:latest
    echo "✅ MongoDB started on port 27017"
else
    echo "✅ MongoDB is already running"
fi

# Setup backend
echo "🔧 Setting up backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Seed database
echo "🌱 Seeding database..."
npm run seed
echo "✅ Database seeded with sample data"

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "🎉 MindGym setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Default login credentials:"
echo "Admin: admin@mindgym.com / admin123"
echo "User: john@example.com / user123"
echo ""
echo "Access the application at: http://localhost:3000"