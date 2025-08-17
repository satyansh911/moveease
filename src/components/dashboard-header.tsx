"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, TrafficCone, Bell } from "lucide-react"

export function DashboardHeader({ onMenuClick = () => {} }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <TrafficCone className="h-5 w-5 text-emerald-600" />
            <span className="hidden sm:inline">FlowGuard</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back to Site</Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
