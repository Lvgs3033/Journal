"use client"

import { Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JournalEntry, Mood } from "@/lib/journal-store"

interface FilterPanelProps {
  entries: JournalEntry[]
  filterMood: Mood | "all"
  onFilterMoodChange: (mood: Mood | "all") => void
  filterRating: number | "all"
  onFilterRatingChange: (rating: number | "all") => void
  filterTag: string
  onFilterTagChange: (tag: string) => void
}

const moods: { value: Mood; emoji: string; label: string }[] = [
  { value: "amazing", emoji: "😄", label: "Amazing" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "bad", emoji: "😔", label: "Bad" },
  { value: "terrible", emoji: "😢", label: "Terrible" },
]

export function FilterPanel({
  entries,
  filterMood,
  onFilterMoodChange,
  filterRating,
  onFilterRatingChange,
  filterTag,
  onFilterTagChange,
}: FilterPanelProps) {
  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags))).sort()

  return (
    <Card className="lg:w-64 h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mood</Label>
          <Select value={filterMood} onValueChange={(v) => onFilterMoodChange(v as Mood | "all")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {moods.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.emoji} {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Rating</Label>
          <Select
            value={String(filterRating)}
            onValueChange={(v) => onFilterRatingChange(v === "all" ? "all" : Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
              <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
              <SelectItem value="2">⭐⭐ (2)</SelectItem>
              <SelectItem value="1">⭐ (1)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tag</Label>
            <Select value={filterTag} onValueChange={onFilterTagChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
