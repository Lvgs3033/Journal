"use client"

import { useState, useEffect } from "react"
import { JournalHeader } from "@/components/journal-header"
import { EntryEditor } from "@/components/entry-editor"
import { EntryList } from "@/components/entry-list"
import { CalendarView } from "@/components/calendar-view"
import { EditEntryDialog } from "@/components/edit-entry-dialog"
import { FilterPanel } from "@/components/filter-panel"
import { PINLockScreen } from "@/components/pin-lock-screen"
import {
  getEntries,
  saveEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  type JournalEntry,
  type Mood,
} from "@/lib/journal-store"
import { applyTheme, getThemeSettings } from "@/lib/theme-store"
import { isOnline, addToOfflineQueue } from "@/lib/offline-store"
import { isPINEnabled, verifyPIN } from "@/lib/pin-store"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function JournalPage() {
  const [view, setView] = useState<"write" | "entries" | "calendar" | "favorites">("entries")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [filterMood, setFilterMood] = useState<Mood | "all">("all")
  const [filterRating, setFilterRating] = useState<number | "all">("all")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [isUnlocked, setIsUnlocked] = useState(!isPINEnabled())
  const { toast } = useToast()

  useEffect(() => {
    setEntries(getEntries())
    applyTheme(getThemeSettings())
  }, [])

  const handleUnlock = (pin: string) => {
    if (verifyPIN(pin)) {
      setIsUnlocked(true)
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEntry = (entry: Omit<JournalEntry, "id">) => {
    if (!isOnline()) {
      addToOfflineQueue(entry)
      toast({
        title: "Saved offline",
        description: "Your entry will sync when you're back online.",
      })
    } else {
      saveEntry(entry)
    }
    setEntries(getEntries())
    toast({
      title: "Entry saved",
      description: "Your journal entry has been saved successfully.",
    })
  }

  const handleToggleFavorite = (id: string, favorite: boolean) => {
    updateEntry(id, { favorite })
    setEntries(getEntries())
  }

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntry(id)
      setEntries(getEntries())
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted. You can restore it from backups.",
      })
    }
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (id: string, updates: Partial<JournalEntry>) => {
    updateEntry(id, updates)
    setEntries(getEntries())
    toast({
      title: "Entry updated",
      description: "Your changes have been saved.",
    })
  }

  const handleDateSelect = (date: Date) => {
    setView("entries")
    const dateStr = date.toLocaleDateString()
    setSearchQuery(dateStr)
  }

  const handleRestore = () => {
    setEntries(getEntries())
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background">
        <PINLockScreen mode="verify" onUnlock={handleUnlock} />
      </div>
    )
  }

  const displayedEntries = (() => {
    let filtered = searchQuery.trim() !== "" ? searchEntries(searchQuery) : entries

    if (view === "favorites") {
      filtered = filtered.filter((e) => e.favorite)
    }

    if (filterMood !== "all") {
      filtered = filtered.filter((e) => e.mood === filterMood)
    }

    if (filterRating !== "all") {
      filtered = filtered.filter((e) => e.rating === filterRating)
    }

    if (filterTag !== "all") {
      filtered = filtered.filter((e) => e.tags.includes(filterTag))
    }

    return filtered
  })()

  return (
    <div className="min-h-screen bg-background">
      <JournalHeader view={view} onViewChange={setView} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        {view === "write" && <EntryEditor onSave={handleSaveEntry} />}
        {(view === "entries" || view === "favorites") && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <FilterPanel
                entries={entries}
                filterMood={filterMood}
                onFilterMoodChange={setFilterMood}
                filterRating={filterRating}
                onFilterRatingChange={setFilterRating}
                filterTag={filterTag}
                onFilterTagChange={setFilterTag}
              />
              <div className="flex-1">
                <EntryList
                  entries={displayedEntries}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteEntry}
                  onEdit={handleEditEntry}
                />
              </div>
            </div>
          </div>
        )}
        {view === "calendar" && <CalendarView entries={entries} onDateSelect={handleDateSelect} />}
      </main>

      <EditEntryDialog
        entry={editingEntry}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <Toaster />
    </div>
  )
}
