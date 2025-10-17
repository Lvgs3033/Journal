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
import { Share2, Copy, Trash2, LinkIcon } from "lucide-react"
import { createShareLink, getShareLinksByEntry, deleteShareLink, generateShareUrl } from "@/lib/sharing-store"
import type { JournalEntry } from "@/lib/journal-store"

interface ShareDialogProps {
  entry: JournalEntry
}

export function ShareDialog({ entry }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [shareLinks, setShareLinks] = useState(getShareLinksByEntry(entry.id))

  const handleCreateShareLink = () => {
    const link = createShareLink(entry.id, 7 * 24 * 60 * 60 * 1000) // 7 days
    setShareLinks(getShareLinksByEntry(entry.id))
  }

  const handleCopyLink = (code: string) => {
    const url = generateShareUrl(code)
    navigator.clipboard.writeText(url)
  }

  const handleDeleteLink = (id: string) => {
    deleteShareLink(id)
    setShareLinks(getShareLinksByEntry(entry.id))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Entry</DialogTitle>
          <DialogDescription>Create shareable links to your journal entry</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={handleCreateShareLink} className="w-full gap-2">
            <LinkIcon className="h-4 w-4" />
            Create Share Link
          </Button>

          {shareLinks.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Links</p>
              {shareLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Input readOnly value={generateShareUrl(link.code)} className="text-xs" />
                  <Button onClick={() => handleCopyLink(link.code)} size="sm" variant="outline" className="gap-1">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button onClick={() => handleDeleteLink(link.id)} size="sm" variant="destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Share links expire after 7 days. Anyone with the link can view this entry.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
