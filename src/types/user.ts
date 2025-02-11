export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm extends LoginForm {
  email: string
  confirmPassword: string
}

export interface UserInfo {
  id: string
  username: string
  email: string
  avatar: string
  wallet: string
}

export enum UserRole {
  NORMAL = 'normal',
  CREATOR = 'creator',
  ADMIN = 'admin'
} 