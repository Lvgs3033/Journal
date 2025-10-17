"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Upload, Trash2, RotateCcw } from "lucide-react"
import {
  downloadBackup,
  restoreBackup,
  getDeletedEntries,
  restoreDeletedEntry,
  permanentlyDeleteEntry,
  clearAllDeletedEntries,
} from "@/lib/backup-store"

interface BackupDialogProps {
  onRestore: () => void
}

export function BackupDialog({ onRestore }: BackupDialogProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"backup" | "deleted">("backup")
  const [deletedEntries, setDeletedEntries] = useState(getDeletedEntries())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadBackup = () => {
    downloadBackup()
  }

  const handleRestoreBackup = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (restoreBackup(content)) {
        onRestore()
        setOpen(false)
      } else {
        alert("Failed to restore backup. Invalid file format.")
      }
    }
    reader.readAsText(file)
  }

  const handleRestoreDeleted = (id: string) => {
    if (restoreDeletedEntry(id)) {
      setDeletedEntries(getDeletedEntries())
      onRestore()
    }
  }

  const handlePermanentlyDelete = (id: string) => {
    if (confirm("Permanently delete this entry? This cannot be undone.")) {
      permanentlyDeleteEntry(id)
      setDeletedEntries(getDeletedEntries())
    }
  }

  const handleClearAll = () => {
    if (confirm("Permanently delete all deleted entries? This cannot be undone.")) {
      clearAllDeletedEntries()
      setDeletedEntries([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Backup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Backup & Recovery</DialogTitle>
          <DialogDescription>Manage your journal backups and deleted entries</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("backup")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tab === "backup" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Backup
          </button>
          <button
            onClick={() => setTab("deleted")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tab === "deleted" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Deleted ({deletedEntries.length})
          </button>
        </div>

        {tab === "backup" && (
          <div className="space-y-3">
            <Button onClick={handleDownloadBackup} className="w-full gap-2">
              <Download className="h-4 w-4" />
              Download Backup
            </Button>
            <Button onClick={handleRestoreBackup} variant="outline" className="w-full gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Restore from File
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
            <p className="text-xs text-muted-foreground">
              Download a backup of all your entries or restore from a previously saved backup file.
            </p>
          </div>
        )}

        {tab === "deleted" && (
          <div className="space-y-3">
            {deletedEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No deleted entries</p>
            ) : (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {deletedEntries.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.entry.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Deleted {new Date(item.deletedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRestoreDeleted(item.id)}
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </Button>
                        <Button
                          onClick={() => handlePermanentlyDelete(item.id)}
                          size="sm"
                          variant="destructive"
                          className="flex-1 gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={handleClearAll} variant="destructive" className="w-full">
                  Clear All Deleted Entries
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
