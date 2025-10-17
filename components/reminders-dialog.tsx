"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Plus, Trash2 } from "lucide-react"
import { createReminder, getReminders, updateReminder, deleteReminder } from "@/lib/reminder-store"

export function RemindersDialog() {
  const [open, setOpen] = useState(false)
  const [reminders, setReminders] = useState(getReminders())
  const [newTitle, setNewTitle] = useState("")
  const [newTime, setNewTime] = useState("09:00")

  const handleCreateReminder = () => {
    if (newTitle.trim()) {
      createReminder(newTitle, newTime)
      setReminders(getReminders())
      setNewTitle("")
      setNewTime("09:00")
    }
  }

  const handleToggleReminder = (id: string, enabled: boolean) => {
    updateReminder(id, { enabled: !enabled })
    setReminders(getReminders())
  }

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id)
    setReminders(getReminders())
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Bell className="h-4 w-4" />
          Reminders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Reminders</DialogTitle>
          <DialogDescription>Set reminders to write in your journal</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reminder Title</label>
            <Input
              placeholder="e.g., Morning reflection"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          </div>

          <Button onClick={handleCreateReminder} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>

          {reminders.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-sm font-medium">Your Reminders</p>
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">{reminder.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleReminder(reminder.id, reminder.enabled)}
                      size="sm"
                      variant={reminder.enabled ? "default" : "outline"}
                      className="text-xs"
                    >
                      {reminder.enabled ? "On" : "Off"}
                    </Button>
                    <Button onClick={() => handleDeleteReminder(reminder.id)} size="sm" variant="destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
