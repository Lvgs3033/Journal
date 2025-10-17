"use client"

export interface PINSettings {
  enabled: boolean
  pin: string // hashed PIN
  createdAt: Date
}

const PIN_KEY = "journal-pin-settings"

// Simple hash function for PIN (not cryptographically secure, but sufficient for local storage)
function hashPin(pin: string): string {
  let hash = 0
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16)
}

export function getPINSettings(): PINSettings | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(PIN_KEY)
  if (!stored) return null
  const parsed = JSON.parse(stored)
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt),
  }
}

export function setPIN(pin: string): void {
  if (typeof window === "undefined") return
  const settings: PINSettings = {
    enabled: true,
    pin: hashPin(pin),
    createdAt: new Date(),
  }
  localStorage.setItem(PIN_KEY, JSON.stringify(settings))
}

export function verifyPIN(pin: string): boolean {
  const settings = getPINSettings()
  if (!settings || !settings.enabled) return true
  return settings.pin === hashPin(pin)
}

export function disablePIN(): void {
  if (typeof window === "undefined") return
  const settings = getPINSettings()
  if (settings) {
    settings.enabled = false
    localStorage.setItem(PIN_KEY, JSON.stringify(settings))
  }
}

export function isPINEnabled(): boolean {
  const settings = getPINSettings()
  return settings?.enabled ?? false
}
