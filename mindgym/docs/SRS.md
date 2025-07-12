# 🧠 MindGym – Software Requirements Specification (SRS)

## 1. Introduction

### 1.1. Purpose
The purpose of MindGym is to provide a platform similar to LeetCode where users can:
- Practice algorithm and data structure problems
- Solve problems using Python only
- Submit code for automatic evaluation
- Track progress and attempt history

## 2. Overall Description

### 2.1 Product Perspective
MindGym is a standalone web platform focused on Python-based problem solving. It includes:
- Problem database
- Python code editor
- Code execution and judging system
- User accounts and profiles

### 2.2 Product Functions
- User registration/login (JWT-based)
- Browse/search problems
- View problem details
- Code editor with Python support
- Submit code and receive results
- Track submission history
- Admin panel to add/manage problems

### 2.3 User Classes
| User Type | Permissions |
|-----------|-------------|
| Guest | View problems, register/login |
| Registered User | Solve and submit problems, track history |
| Admin | Manage problems, view user activity |

### 2.4 Constraints
- Only Python 3 is allowed for submissions
- Judging environment must be sandboxed and secure (e.g., Docker)
- Response time for code evaluation ≤ 3 seconds

### 2.5 Assumptions
- Users are familiar with Python syntax
- No concurrent code execution conflicts
- Internet access is required

## 3. Functional Requirements

### 3.1 Authentication
- Register: POST /api/register
- Login: POST /api/login
- JWT token used for session

### 3.2 Problem Management
- List Problems: GET /api/problems
- Get Problem Detail: GET /api/problems/:id
- Add Problem (admin): POST /api/admin/problems
- Edit/Delete Problem (admin): PUT/DELETE /api/admin/problems/:id

Each problem includes:
- ID, Title, Description, Input/Output Format
- Constraints
- Sample Input/Output
- Hidden test cases

### 3.3 Submission System
- Submit Code: POST /api/submit
- Fields: problemId, userCode, language (always python)
- Judge evaluates and returns:
  - ✅ Correct / ❌ Wrong Answer / ⏱ Time Limit Exceeded / 💥 Runtime Error

### 3.4 Execution/Judging
Backend uses a secure sandbox (e.g., Docker or Firecracker) to:
- Run submitted code against hidden test cases
- Compare outputs
- Prevent infinite loops or malicious code

### 3.5 User Progress
- Submission History: GET /api/user/submissions
- Profile Stats: GET /api/user/profile
- Solved, failed, languages used, rank

### 3.6 Admin Panel
Web interface for:
- Creating/editing problems
- Viewing user performance

## 4. Non-Functional Requirements

### 4.1 Performance
- Judge 95% of submissions within 3 seconds

### 4.2 Scalability
- Horizontally scalable judging workers

### 4.3 Security
- Sandbox runtime for code execution
- Rate limiting for API abuse
- Passwords hashed (bcrypt)

### 4.4 Usability
- Intuitive UI like LeetCode
- Monaco-based editor with Python syntax highlighting

## 5. System Design Overview

### 5.1 Folder Structure
```
mindgym/
├── frontend/             # React + Tailwind + TypeScript
│   ├── pages/
│   ├── components/
│   └── api/
├── backend/              # Node.js (type: module)
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── judge/            # Python judge with Docker
│   └── config/
├── database/             # MongoDB or PostgreSQL schema/migrations
├── scripts/              # For local judge/test
├── docs/
│   └── SRS.md
└── README.md
```

## 6. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js (Express, ESModules) |
| Code Editor | Monaco Editor |
| Judge | Python inside Docker container |
| DB | MongoDB or PostgreSQL |
| Auth | JWT |
| Deployment | Render / Railway / VPS (with Docker) |

## 7. Sample APIs

### Submit Code
```http
POST /api/submit
Content-Type: application/json

{
  "problemId": "123",
  "userCode": "def twoSum(...):",
  "language": "python"
}
```

**Response:**
```json
{
  "status": "Accepted",
  "runtime": "0.43s",
  "memory": "12MB"
}
```

## 8. Sample Problem Format

```json
{
  "id": "1",
  "title": "Two Sum",
  "description": "Given an array...",
  "inputFormat": "nums = [int], target = int",
  "outputFormat": "List[int]",
  "constraints": "...",
  "samples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]"
    }
  ],
  "testCases": [ ... ]
}
```

## 9. Milestones

| Week | Milestone |
|------|-----------|
| Week 1 | Auth, DB setup, basic UI |
| Week 2 | Problem model, display page |
| Week 3 | Code editor + submission |
| Week 4 | Judge integration (Docker) |
| Week 5 | User profile and history |
| Week 6 | Admin panel, deployment |