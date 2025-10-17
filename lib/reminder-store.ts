"use client"

export interface Reminder {
  id: string
  title: string
  time: string // HH:MM format
  enabled: boolean
  createdAt: Date
}

const REMINDERS_KEY = "journal-reminders"

export function createReminder(title: string, time: string): Reminder {
  const reminder: Reminder = {
    id: crypto.randomUUID(),
    title,
    time,
    enabled: true,
    createdAt: new Date(),
  }

  const reminders = getReminders()
  reminders.push(reminder)
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))

  return reminder
}

export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(REMINDERS_KEY)
  if (!stored) return []
  const parsed = JSON.parse(stored)
  return parsed.map((reminder: any) => ({
    ...reminder,
    createdAt: new Date(reminder.createdAt),
  }))
}

export function updateReminder(id: string, updates: Partial<Reminder>): void {
  const reminders = getReminders()
  const index = reminders.findIndex((r) => r.id === id)
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates }
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))
  }
}

export function deleteReminder(id: string): void {
  const reminders = getReminders()
  const filtered = reminders.filter((r) => r.id !== id)
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered))
}

export function checkReminders(): Reminder[] {
  const reminders = getReminders()
  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  return reminders.filter((r) => r.enabled && r.time === currentTime)
}
