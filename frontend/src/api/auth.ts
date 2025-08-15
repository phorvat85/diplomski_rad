
import { api } from './client'

export type LoginReq = { username: string; password: string }
export type RegisterReq = { username: string; email: string; password: string; }
export type AuthResp = { token: string; user?: { id: number | string; username: string; role: string } }

export async function login(payload: LoginReq): Promise<AuthResp> {
  const { data } = await api.post('/auth/login', payload)
  return data
}
export async function register(payload: RegisterReq): Promise<AuthResp> {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  // Adjust the path to match your backend controller if needed
  const { data } = await api.post('/auth/change-password', payload)
  return data
}