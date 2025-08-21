"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "waiter" | "manager"

export interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users
const mockUsers: User[] = [
  { id: "1", username: "admin", role: "admin", name: "Administrator" },
  { id: "2", username: "waiter1", role: "waiter", name: "Ofitsiant 1" },
  { id: "3", username: "waiter2", role: "waiter", name: "Ofitsiant 2" },
  { id: "4", username: "manager", role: "manager", name: "Menejer" },
  {
    id: "5",
    username: "chef.test",
    password: "password",
    role: "chef",
    name: "Oshpazbek",
  },
]

const mockPasswords: Record<string, string> = {
  admin: "admin123",
  waiter1: "waiter123",
  waiter2: "waiter123",
  manager: "manager123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("restaurant-user")
      if (savedUser) {
        return JSON.parse(savedUser)
      }
    }
    return null
  })

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("restaurant-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const foundUser = mockUsers.find((u) => u.username === username)
    if (foundUser && mockPasswords[username] === password) {
      setUser(foundUser)
      localStorage.setItem("restaurant-user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("restaurant-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
