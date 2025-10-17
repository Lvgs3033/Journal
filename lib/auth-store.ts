"use client"

export interface User {
  id: string
  password: string
  createdAt: Date
}

const AUTH_KEY = "journal-auth"
const USERS_KEY = "journal-users"

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return null
  try {
    const user = JSON.parse(stored)
    return user
  } catch {
    return null
  }
}

export function registerUser(password: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    password: hashPassword(password),
    createdAt: new Date(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  return user
}

export function loginUser(password: string): boolean {
  const user = getCurrentUser()
  if (!user) return false
  return verifyPassword(password, user.password)
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  const user = getCurrentUser()
  if (!user || !verifyPassword(oldPassword, user.password)) {
    return false
  }
  user.password = hashPassword(newPassword)
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  return true
}

// Simple password hashing (for demo - in production use bcrypt)
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
