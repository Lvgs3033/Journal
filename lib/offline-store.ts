"use client"

export interface OfflineEntry {
  id: string
  data: any
  timestamp: number
  synced: boolean
}

const OFFLINE_QUEUE_KEY = "journal-offline-queue"
const OFFLINE_STATUS_KEY = "journal-offline-status"

export function addToOfflineQueue(entry: any): void {
  if (typeof window === "undefined") return
  const queue = getOfflineQueue()
  queue.push({
    id: crypto.randomUUID(),
    data: entry,
    timestamp: Date.now(),
    synced: false,
  })
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
}

export function getOfflineQueue(): OfflineEntry[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(OFFLINE_QUEUE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(OFFLINE_QUEUE_KEY)
}

export function markAsSynced(id: string): void {
  const queue = getOfflineQueue()
  const index = queue.findIndex((e) => e.id === id)
  if (index !== -1) {
    queue[index].synced = true
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
  }
}

export function isOnline(): boolean {
  if (typeof window === "undefined") return true
  return navigator.onLine
}

export function setOfflineStatus(status: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(OFFLINE_STATUS_KEY, JSON.stringify(!status))
}

export function getOfflineStatus(): boolean {
  if (typeof window === "undefined") return false
  const stored = localStorage.getItem(OFFLINE_STATUS_KEY)
  return stored ? JSON.parse(stored) : false
}
