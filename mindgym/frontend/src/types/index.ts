export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profile: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    github?: string;
    linkedin?: string;
  };
  stats: {
    totalProblems: number;
    solvedProblems: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    rank: number;
    languages: string[];
  };
  solvedProblems: string[];
  isActive: boolean;
  lastLogin?: Date;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  samples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode?: string;
  hints?: string[];
  stats: {
    totalSubmissions: number;
    acceptedSubmissions: number;
    acceptanceRate: number;
  };
  createdBy: {
    _id: string;
    username: string;
  };
  isActive: boolean;
  timeLimit: number;
  memoryLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  _id: string;
  userId: string;
  problemId: {
    _id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  };
  code: string;
  language: 'python';
  status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compilation Error' | 'Internal Error';
  runtime: number;
  memory: number;
  testCasesPassed: number;
  totalTestCases: number;
  errorMessage?: string;
  executionDetails?: {
    compilationTime?: number;
    executionTime?: number;
    peakMemory?: number;
    exitCode?: number;
  };
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User['profile']>) => Promise<void>;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  current: number;
  pages: number;
  total: number;
}

export interface ProblemsResponse {
  problems: Problem[];
  pagination: PaginationMeta;
}

export interface SubmissionsResponse {
  submissions: Submission[];
  pagination: PaginationMeta;
}