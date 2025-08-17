import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrafficCone, Radar, Siren, Map, Camera, Gauge } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <TrafficCone className="h-5 w-5 text-emerald-600" />
            <span>MoveEase</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#solutions" className="text-muted-foreground hover:text-foreground">
              Solutions
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                Real-time Traffic Intelligence
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Manage city traffic with clarity and control
              </h1>
              <p className="mt-4 max-w-[60ch] text-muted-foreground md:text-lg">
                MoveEase provides unified visibility into incidents, congestion, cameras, and signals—helping operators
                respond faster and commuters move safer.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto">
                    Launch Console
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/city-traffic-dashboard.png"
                alt="City traffic dashboard preview"
                className="mx-auto aspect-video w-full rounded-xl border object-cover shadow-sm"
              />
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/30">
          <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
            <div className="rounded-xl border bg-background p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Radar className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Live Congestion</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Monitor speed and flow across corridors. Detect slowdowns before they cascade.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Siren className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Incident Management</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Log, triage, and resolve incidents with clear workflows and real-time updates.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50 text-zinc-700">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Cameras & Signals</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Check camera feeds and coordinate signal states to keep traffic moving.
              </p>
            </div>
          </div>
        </section>

        <section id="solutions">
          <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border p-6">
              <h2 className="text-2xl font-semibold">Unified traffic operations</h2>
              <p className="mt-2 text-muted-foreground">
                Bring maps, analytics, and controls together in one console built for operators.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-emerald-600" /> KPI monitoring for speed, flow, and incidents
                </li>
                <li className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-emerald-600" /> Corridor-level congestion overview
                </li>
                <li className="flex items-center gap-2">
                  <Siren className="h-4 w-4 text-emerald-600" /> Incident lifecycle and alerting
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-emerald-600" /> Camera grids with quick snapshots
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Try the Dashboard</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl border p-6">
              <img
                src="/traffic-command-center-operator.png"
                alt="Operator using traffic command center"
                className="aspect-video w-full rounded-lg border object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MoveEase. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
