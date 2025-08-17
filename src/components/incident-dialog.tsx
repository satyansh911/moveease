"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type IncidentForm = {
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  location: string
}

export function IncidentDialog({
  onCreate = async () => {},
}: {
  onCreate?: (payload: IncidentForm) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<IncidentForm>({
    type: "Accident",
    severity: "Medium",
    location: "5th Ave & Pine St",
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSubmitting(true)
      await onCreate(form)
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">Add Incident</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log new incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              placeholder="Accident, Roadwork, Breakdown..."
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Severity</Label>
            <Select
              value={form.severity}
              onValueChange={(v) => setForm((f) => ({ ...f, severity: v as IncidentForm["severity"] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Intersection or coordinates"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
