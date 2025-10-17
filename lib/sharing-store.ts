"use client"

export interface ShareLink {
  id: string
  entryId: string
  code: string
  createdAt: Date
  expiresAt?: Date
}

const SHARE_LINKS_KEY = "journal-share-links"

export function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function createShareLink(entryId: string, expiresIn?: number): ShareLink {
  const shareLink: ShareLink = {
    id: crypto.randomUUID(),
    entryId,
    code: generateShareCode(),
    createdAt: new Date(),
    expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : undefined,
  }

  const links = getShareLinks()
  links.push(shareLink)
  localStorage.setItem(SHARE_LINKS_KEY, JSON.stringify(links))

  return shareLink
}

export function getShareLinks(): ShareLink[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(SHARE_LINKS_KEY)
  if (!stored) return []
  const parsed = JSON.parse(stored)
  return parsed.map((link: any) => ({
    ...link,
    createdAt: new Date(link.createdAt),
    expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
  }))
}

export function getShareLinksByEntry(entryId: string): ShareLink[] {
  return getShareLinks().filter((link) => link.entryId === entryId)
}

export function deleteShareLink(id: string): void {
  const links = getShareLinks()
  const filtered = links.filter((link) => link.id !== id)
  localStorage.setItem(SHARE_LINKS_KEY, JSON.stringify(filtered))
}

export function generateShareUrl(code: string): string {
  if (typeof window === "undefined") return ""
  return `${window.location.origin}/share/${code}`
}
