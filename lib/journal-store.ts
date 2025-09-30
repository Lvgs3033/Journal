"use client"

export type Mood = "amazing" | "good" | "okay" | "bad" | "terrible"

export interface JournalEntry {
  id: string
  date: Date
  title: string
  content: string
  mood?: Mood
  tags: string[]
  favorite: boolean
  rating?: number
  images?: string[]
}

const STORAGE_KEY = "journal-entries"

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  const parsed = JSON.parse(stored)
  return parsed.map((entry: any) => ({
    ...entry,
    date: new Date(entry.date),
  }))
}

export function saveEntry(entry: Omit<JournalEntry, "id">): JournalEntry {
  const entries = getEntries()
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
  }
  entries.push(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return newEntry
}

export function updateEntry(id: string, updates: Partial<JournalEntry>): void {
  const entries = getEntries()
  const index = entries.findIndex((e) => e.id === id)
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }
}

export function deleteEntry(id: string): void {
  const entries = getEntries()
  const filtered = entries.filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function searchEntries(query: string): JournalEntry[] {
  const entries = getEntries()
  const lowerQuery = query.toLowerCase()
  return entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}

export function getEntriesByDateRange(start: Date, end: Date): JournalEntry[] {
  const entries = getEntries()
  return entries.filter((entry) => entry.date >= start && entry.date <= end)
}

export function getEntriesByTag(tag: string): JournalEntry[] {
  const entries = getEntries()
  return entries.filter((entry) => entry.tags.includes(tag))
}

export function getAllTags(): string[] {
  const entries = getEntries()
  const tagSet = new Set<string>()
  entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)))
  return Array.from(tagSet).sort()
}
