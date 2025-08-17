"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { RealtimeKpiCards } from "@/components/realtime-kpi-cards"
import { InteractiveMap } from "@/components/interactive-map"
import { AlertsList } from "@/components/alerts-list"
import { IncidentTable } from "@/components/incident-table"
import { CameraGrid } from "@/components/camera-grid"
import { SignalControlPanel } from "@/components/signal-control-panel"
import { EnhancedDispatchPanel } from "@/components/enhanced-dispatch-panel"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-[100dvh] bg-muted/30">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex min-h-[100dvh] flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-6">
          <RealtimeKpiCards />
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <InteractiveMap />
            </div>
            <div className="xl:col-span-1">
              <AlertsList />
            </div>
          </div>
          <div className="mt-6">
            <EnhancedDispatchPanel />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <IncidentTable />
            </div>
            <div className="xl:col-span-1">
              <SignalControlPanel />
            </div>
          </div>
          <div className="mt-6">
            <CameraGrid />
          </div>
        </main>
      </div>
    </div>
  )
}
