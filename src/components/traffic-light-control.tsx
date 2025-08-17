"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type State = "Red" | "Yellow" | "Green"

const intersections = ["5th & Pine", "Broadway & Oak", "I-90 On-Ramp", "Stadium Blvd", "Main & 2nd"]

export function TrafficLightControl() {
  const [intersection, setIntersection] = useState(intersections[0])
  const [state, setState] = useState<State>("Green")

  return (
    <section id="signals" aria-label="Signal controls">
      <Card>
        <CardHeader>
          <CardTitle>Signal Control</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Intersection</div>
            <Select value={intersection} onValueChange={setIntersection}>
              <SelectTrigger>
                <SelectValue placeholder="Select intersection" />
              </SelectTrigger>
              <SelectContent>
                {intersections.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">State</div>
            <Select value={state} onValueChange={(v) => setState(v as State)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-6 py-3">
            <span
              className={`h-4 w-4 rounded-full ${state === "Red" ? "bg-red-600 ring-2 ring-red-300" : "bg-red-200/60"}`}
              aria-label="Red light"
            />
            <span
              className={`h-4 w-4 rounded-full ${
                state === "Yellow" ? "bg-amber-500 ring-2 ring-amber-300" : "bg-amber-200/60"
              }`}
              aria-label="Yellow light"
            />
            <span
              className={`h-4 w-4 rounded-full ${
                state === "Green" ? "bg-emerald-600 ring-2 ring-emerald-300" : "bg-emerald-200/60"
              }`}
              aria-label="Green light"
            />
          </div>

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => alert(`Applied ${state} at ${intersection}`)}
          >
            Apply State
          </Button>
          <p className="text-xs text-muted-foreground">Demo only: This does not control real signals.</p>
        </CardContent>
      </Card>
    </section>
  )
}
