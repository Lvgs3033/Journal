"use client"

import { Star, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShareDialog } from "@/components/share-dialog"
import type { JournalEntry } from "@/lib/journal-store"

interface EntryListProps {
  entries: JournalEntry[]
  onToggleFavorite: (id: string, favorite: boolean) => void
  onDelete: (id: string) => void
  onEdit: (entry: JournalEntry) => void
}

const moodEmojis: Record<string, string> = {
  amazing: "😄",
  good: "😊",
  okay: "😐",
  bad: "😔",
  terrible: "😢",
}

export function EntryList({ entries, onToggleFavorite, onDelete, onEdit }: EntryListProps) {
  const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime())

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center animate-fade-in">
        <p className="text-muted-foreground text-lg">No entries found. Start writing to see your thoughts here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry, index) => (
        <Card
          key={entry.id}
          className="border-border shadow-sm hover-lift animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-semibold text-foreground truncate">{entry.title}</h3>
                  {entry.mood && <span className="text-xl animate-bounce-soft">{moodEmojis[entry.mood]}</span>}
                  {entry.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: entry.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary transition-smooth" />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {entry.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(entry.id, !entry.favorite)}
                  className="shrink-0 hover-scale"
                >
                  <Star
                    className={`h-4 w-4 transition-smooth ${
                      entry.favorite ? "fill-primary text-primary animate-glow" : "text-muted-foreground"
                    }`}
                  />
                </Button>
                <ShareDialog entry={entry} />
                <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} className="shrink-0 hover-scale">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)} className="shrink-0 hover-scale">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {entry.images && entry.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {entry.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "/placeholder.svg"}
                    alt={`Entry image ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover-scale cursor-pointer"
                  />
                ))}
              </div>
            )}
            <p className="text-foreground leading-relaxed whitespace-pre-wrap line-clamp-3">{entry.content}</p>
            {entry.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="hover-scale cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
