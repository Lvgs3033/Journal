"use client"

import { BookOpen, Calendar, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsDialog } from "@/components/settings-dialog"

interface JournalHeaderProps {
  view: "write" | "entries" | "calendar" | "favorites"
  onViewChange: (view: "write" | "entries" | "calendar" | "favorites") => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function JournalHeader({ view, onViewChange, searchQuery, onSearchChange }: JournalHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Daily Journal</h1>
              <p className="text-sm text-muted-foreground">Your personal reflection space</p>
            </div>
          </div>
          <SettingsDialog />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <nav className="flex gap-2">
            <Button
              variant={view === "write" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("write")}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Write
            </Button>
            <Button
              variant={view === "entries" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("entries")}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Entries
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("calendar")}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={view === "favorites" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("favorites")}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Favorites
            </Button>
          </nav>

          {(view === "entries" || view === "favorites") && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
