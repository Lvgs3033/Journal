"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { isOnline } from "@/lib/offline-store"

export function OfflineIndicator() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setOnline(isOnline())

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 shadow-lg animate-pulse">
      <WifiOff className="h-4 w-4 text-yellow-600" />
      <span className="text-sm font-medium text-yellow-800">You are offline - changes will sync when online</span>
    </div>
  )
}
