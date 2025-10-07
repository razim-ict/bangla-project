export type AdminRole = "super-admin" | "admin"

export interface Admin {
  id: string
  email: string
  password: string
  role: AdminRole
  is_enabled: boolean
  created_at: string
  updated_at: string
}

export interface LoginUser {
  id: string
  username: string
  password: string
  created_at: string
}
