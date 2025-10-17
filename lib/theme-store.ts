"use client"

export type Theme = "cherry-pink" | "ocean-blue" | "forest-green" | "sunset-orange" | "lavender"
export type FontFamily = "geist" | "serif" | "mono"
export type FontSize = "small" | "medium" | "large"

export interface ThemeSettings {
  theme: Theme
  fontFamily: FontFamily
  fontSize: FontSize
  customColor?: string
}

const THEME_KEY = "journal-theme-settings"

const THEME_COLORS: Record<Theme, { primary: string; secondary: string; accent: string }> = {
  "cherry-pink": {
    primary: "oklch(0.65 0.2 350)",
    secondary: "oklch(0.85 0.1 350)",
    accent: "oklch(0.92 0.08 350)",
  },
  "ocean-blue": {
    primary: "oklch(0.55 0.2 250)",
    secondary: "oklch(0.75 0.15 260)",
    accent: "oklch(0.85 0.1 270)",
  },
  "forest-green": {
    primary: "oklch(0.45 0.2 150)",
    secondary: "oklch(0.65 0.15 160)",
    accent: "oklch(0.80 0.1 170)",
  },
  "sunset-orange": {
    primary: "oklch(0.60 0.2 50)",
    secondary: "oklch(0.75 0.15 40)",
    accent: "oklch(0.88 0.1 30)",
  },
  lavender: {
    primary: "oklch(0.60 0.15 310)",
    secondary: "oklch(0.75 0.12 320)",
    accent: "oklch(0.88 0.08 330)",
  },
}

export function getThemeSettings(): ThemeSettings {
  if (typeof window === "undefined") {
    return { theme: "cherry-pink", fontFamily: "geist", fontSize: "medium" }
  }
  const stored = localStorage.getItem(THEME_KEY)
  if (!stored) {
    return { theme: "cherry-pink", fontFamily: "geist", fontSize: "medium" }
  }
  return JSON.parse(stored)
}

export function saveThemeSettings(settings: ThemeSettings): void {
  localStorage.setItem(THEME_KEY, JSON.stringify(settings))
  applyTheme(settings)
}

export function applyTheme(settings: ThemeSettings): void {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const colors = settings.customColor
    ? { primary: settings.customColor, secondary: settings.customColor, accent: settings.customColor }
    : THEME_COLORS[settings.theme]

  root.style.setProperty("--primary", colors.primary)
  root.style.setProperty("--secondary", colors.secondary)
  root.style.setProperty("--accent", colors.accent)

  // Apply font family
  const fontMap: Record<FontFamily, string> = {
    geist: "var(--font-geist-sans)",
    serif: "Georgia, serif",
    mono: "var(--font-geist-mono)",
  }
  root.style.setProperty("--font-sans", fontMap[settings.fontFamily])

  // Apply font size
  const fontSizeMap: Record<FontSize, string> = {
    small: "14px",
    medium: "16px",
    large: "18px",
  }
  root.style.setProperty("--base-font-size", fontSizeMap[settings.fontSize])
  document.body.style.fontSize = fontSizeMap[settings.fontSize]
}

export function getThemePresets(): Theme[] {
  return ["cherry-pink", "ocean-blue", "forest-green", "sunset-orange", "lavender"]
}
