export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  message: string;
  user: {
    name: string;
    email: string;
  };
  token: string;
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
}

