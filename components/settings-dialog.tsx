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
import { Settings } from "lucide-react"
import { BackupDialog } from "@/components/backup-dialog"
import { RemindersDialog } from "@/components/reminders-dialog"
import { PINLockScreen } from "@/components/pin-lock-screen"
import {
  getThemeSettings,
  saveThemeSettings,
  getThemePresets,
  type Theme,
  type FontFamily,
  type FontSize,
} from "@/lib/theme-store"
import { isPINEnabled, disablePIN, setPIN } from "@/lib/pin-store"

interface SettingsDialogProps {
  onRestore?: () => void
}

export function SettingsDialog({ onRestore }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(getThemeSettings())
  const [customColor, setCustomColor] = useState(settings.customColor || "#ec4899")
  const [pinEnabled, setPinEnabled] = useState(isPINEnabled())
  const [showPINSetup, setShowPINSetup] = useState(false)

  const handleThemeChange = (theme: Theme) => {
    const newSettings = { ...settings, theme }
    setSettings(newSettings)
    saveThemeSettings(newSettings)
  }

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    const newSettings = { ...settings, fontFamily }
    setSettings(newSettings)
    saveThemeSettings(newSettings)
  }

  const handleFontSizeChange = (fontSize: FontSize) => {
    const newSettings = { ...settings, fontSize }
    setSettings(newSettings)
    saveThemeSettings(newSettings)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    const newSettings = { ...settings, customColor: color }
    setSettings(newSettings)
    saveThemeSettings(newSettings)
  }

  const handleTogglePIN = () => {
    if (pinEnabled) {
      disablePIN()
      setPinEnabled(false)
    } else {
      setShowPINSetup(true)
    }
  }

  const handlePINSetupComplete = (pin: string) => {
    setPIN(pin)
    setPinEnabled(true)
    setShowPINSetup(false)
  }

  if (showPINSetup) {
    return <PINLockScreen mode="setup" onUnlock={() => {}} onSetupComplete={handlePINSetupComplete} />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-2">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your journal experience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">PIN Protection</h3>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Protect with PIN</p>
                <p className="text-xs text-muted-foreground">{pinEnabled ? "PIN is enabled" : "No PIN protection"}</p>
              </div>
              <Button onClick={handleTogglePIN} variant={pinEnabled ? "default" : "outline"} size="sm">
                {pinEnabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {getThemePresets().map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.theme === theme ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <div className="text-xs font-medium capitalize">{theme.replace("-", " ")}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Custom Color</h3>
            <div className="flex gap-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#ec4899"
                className="flex-1"
              />
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Font Family</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["geist", "serif", "mono"] as FontFamily[]).map((font) => (
                <button
                  key={font}
                  onClick={() => handleFontFamilyChange(font)}
                  className={`p-2 rounded-lg border-2 transition-all text-sm capitalize ${
                    settings.fontFamily === font ? "border-primary bg-primary/10" : "border-border"
                  }`}
                  style={{
                    fontFamily: font === "serif" ? "Georgia, serif" : font === "mono" ? "monospace" : "sans-serif",
                  }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Font Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`p-2 rounded-lg border-2 transition-all capitalize ${
                    settings.fontSize === size ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <span className={size === "small" ? "text-xs" : size === "large" ? "text-lg" : "text-sm"}>
                    {size}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Backup & Reminders */}
          <div className="flex gap-2">
            <BackupDialog onRestore={onRestore} />
            <RemindersDialog />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
