// src/app/models/activation.model.ts

export interface ActivateAccountRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ActivateAccountResponse {
  success: boolean;
  message: string;
  email: string;
}