"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser, loginUser } from "@/lib/auth-store"
import { Lock, BookOpen } from "lucide-react"

interface LoginScreenProps {
  onLoginSuccess: () => void
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        if (loginUser(password)) {
          onLoginSuccess()
        } else {
          setError("Invalid password")
        }
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }
        if (password.length < 4) {
          setError("Password must be at least 4 characters")
          setLoading(false)
          return
        }
        registerUser(password)
        onLoginSuccess()
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-pink-200">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-pink-900">My Journal</CardTitle>
          <CardDescription>{isLogin ? "Welcome back" : "Create your journal"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-pink-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-400"
                  disabled={loading}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-pink-200 focus:border-pink-400"
                  disabled={loading}
                />
              </div>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setPassword("")
                  setConfirmPassword("")
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
