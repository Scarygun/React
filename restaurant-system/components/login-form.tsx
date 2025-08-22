"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring")
      return
    }

    const success = login(username, password)
    if (!success) {
      setError("Noto'g'ri foydalanuvchi nomi yoki parol")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">Restoran Tizimiga Kirish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Foydalanuvchi nomi</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Foydalanuvchi nomini kiriting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Kirish
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-semibold mb-2">Test foydalanuvchilari:</p>
            <div className="text-xs space-y-1">
              <p>
                <strong>Admin:</strong> admin / admin123
              </p>
              <p>
                <strong>Ofitsiant:</strong> waiter1 / waiter123
              </p>
              
              <p>
                <strong>Oshpaz:</strong> chef.test / password
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
