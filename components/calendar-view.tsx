"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { JournalEntry } from "@/lib/journal-store"

interface CalendarViewProps {
  entries: JournalEntry[]
  onDateSelect: (date: Date) => void
}

const moodEmojis: Record<string, string> = {
  amazing: "😄",
  good: "😊",
  okay: "😐",
  bad: "😔",
  terrible: "😢",
}

export function CalendarView({ entries, onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEntriesForDate = (day: number) => {
    const date = new Date(year, month, day)
    return entries.filter(
      (entry) => entry.date.getDate() === day && entry.date.getMonth() === month && entry.date.getFullYear() === year,
    )
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEntries = getEntriesForDate(day)
    const hasEntries = dayEntries.length > 0
    const mood = dayEntries[0]?.mood

    days.push(
      <button
        key={day}
        onClick={() => hasEntries && onDateSelect(new Date(year, month, day))}
        className={`aspect-square rounded-lg border transition-colors ${
          hasEntries ? "border-primary bg-accent hover:bg-accent/80 cursor-pointer" : "border-border bg-card"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-1">
          <span className={`text-sm ${hasEntries ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
            {day}
          </span>
          {mood && <span className="text-lg">{moodEmojis[mood]}</span>}
        </div>
      </button>,
    )
  }

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">{monthName}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">{days}</div>
        </CardContent>
      </Card>
    </div>
  )
}
