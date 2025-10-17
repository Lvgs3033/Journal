"use client"

export interface DeletedEntry {
  id: string
  entry: any
  deletedAt: Date
}

const BACKUP_KEY = "journal-backups"
const DELETED_ENTRIES_KEY = "journal-deleted-entries"

export function createBackup(): string {
  if (typeof window === "undefined") return ""
  const entries = localStorage.getItem("journal-entries") || "[]"
  const backup = {
    timestamp: new Date().toISOString(),
    data: JSON.parse(entries),
  }
  return JSON.stringify(backup, null, 2)
}

export function downloadBackup(): void {
  const backup = createBackup()
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(backup))
  element.setAttribute("download", `journal-backup-${new Date().toISOString().split("T")[0]}.json`)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function restoreBackup(backupData: string): boolean {
  try {
    const backup = JSON.parse(backupData)
    if (!backup.data || !Array.isArray(backup.data)) {
      return false
    }
    localStorage.setItem("journal-entries", JSON.stringify(backup.data))
    return true
  } catch {
    return false
  }
}

export function addToDeletedEntries(entry: any): void {
  if (typeof window === "undefined") return
  const deleted = getDeletedEntries()
  deleted.push({
    id: crypto.randomUUID(),
    entry,
    deletedAt: new Date(),
  })
  localStorage.setItem(DELETED_ENTRIES_KEY, JSON.stringify(deleted))
}

export function getDeletedEntries(): DeletedEntry[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(DELETED_ENTRIES_KEY)
  if (!stored) return []
  const parsed = JSON.parse(stored)
  return parsed.map((item: any) => ({
    ...item,
    deletedAt: new Date(item.deletedAt),
  }))
}

export function restoreDeletedEntry(id: string): boolean {
  const deleted = getDeletedEntries()
  const index = deleted.findIndex((e) => e.id === id)
  if (index === -1) return false

  const entry = deleted[index].entry
  const entries = JSON.parse(localStorage.getItem("journal-entries") || "[]")
  entries.push(entry)
  localStorage.setItem("journal-entries", JSON.stringify(entries))

  deleted.splice(index, 1)
  localStorage.setItem(DELETED_ENTRIES_KEY, JSON.stringify(deleted))
  return true
}

export function permanentlyDeleteEntry(id: string): void {
  const deleted = getDeletedEntries()
  const filtered = deleted.filter((e) => e.id !== id)
  localStorage.setItem(DELETED_ENTRIES_KEY, JSON.stringify(filtered))
}

export function clearAllDeletedEntries(): void {
  localStorage.removeItem(DELETED_ENTRIES_KEY)
}
