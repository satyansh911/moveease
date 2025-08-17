"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import { LayoutDashboard, Map, Siren, Camera, Settings, TrafficCone, Gauge } from "lucide-react"

export function Sidebar({
  open = false,
  onOpenChange = () => {},
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const Nav = () => (
    <nav className="grid gap-1 p-2 text-sm">
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </Link>
      </Button>
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/dashboard#map">
          <Map className="h-4 w-4" />
          Map
        </Link>
      </Button>
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/dashboard#incidents">
          <Siren className="h-4 w-4" />
          Incidents
        </Link>
      </Button>
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/dashboard#cameras">
          <Camera className="h-4 w-4" />
          Cameras
        </Link>
      </Button>
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/dashboard#signals">
          <TrafficCone className="h-4 w-4" />
          Signals
        </Link>
      </Button>
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/dashboard#analytics">
          <Gauge className="h-4 w-4" />
          Analytics
        </Link>
      </Button>
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="#">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </Button>
    </nav>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-[100dvh] w-60 shrink-0 border-r bg-background md:block">
        <div className="p-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground">Navigation</div>
          <Nav />
        </div>
      </aside>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="p-4">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Navigation</div>
            <Nav />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
