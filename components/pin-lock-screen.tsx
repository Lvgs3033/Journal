"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface PINLockScreenProps {
  onUnlock: () => void
  mode: "verify" | "setup"
  onSetupComplete?: (pin: string) => void
}

export function PINLockScreen({ onUnlock, mode, onSetupComplete }: PINLockScreenProps) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [showSetupConfirm, setShowSetupConfirm] = useState(false)

  const handlePINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setPin(value)
    setError("")
  }

  const handleConfirmPINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setConfirmPin(value)
    setError("")
  }

  const handleVerify = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits")
      return
    }
    onUnlock()
  }

  const handleSetup = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits")
      return
    }
    if (!showSetupConfirm) {
      setShowSetupConfirm(true)
      return
    }
    if (pin !== confirmPin) {
      setError("PINs do not match")
      setConfirmPin("")
      return
    }
    onSetupComplete?.(pin)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Lock className="h-8 w-8 text-primary" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {mode === "verify" ? "Unlock Your Journal" : "Set Up PIN Protection"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "verify"
                ? "Enter your PIN to access your journal"
                : showSetupConfirm
                  ? "Confirm your PIN"
                  : "Create a 4-6 digit PIN for your journal"}
            </p>
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {mode === "verify" ? "PIN" : showSetupConfirm ? "Confirm PIN" : "PIN"}
              </label>
              <Input
                type="password"
                inputMode="numeric"
                placeholder="••••"
                value={showSetupConfirm && mode === "setup" ? confirmPin : pin}
                onChange={showSetupConfirm && mode === "setup" ? handleConfirmPINChange : handlePINChange}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            {mode === "setup" && !showSetupConfirm && (
              <p className="text-xs text-muted-foreground text-center">
                You can use 4-6 digits. Make it something you'll remember.
              </p>
            )}

            <Button onClick={mode === "verify" ? handleVerify : handleSetup} className="w-full" size="lg">
              {mode === "verify" ? "Unlock" : showSetupConfirm ? "Confirm PIN" : "Next"}
            </Button>

            {mode === "setup" && showSetupConfirm && (
              <Button
                onClick={() => {
                  setShowSetupConfirm(false)
                  setConfirmPin("")
                  setError("")
                }}
                variant="outline"
                className="w-full"
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
