export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    tocken_type: string;
    role: string;
  };
}

export interface UserData {
  email: string;
  role: string;
}

// Register request interface
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string; // 'admin' or 'user'
}

