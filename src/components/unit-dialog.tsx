"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"

export type UnitForm = {
  name: string
  type: "Patrol Car" | "Motorbike" | "Tow Truck" | "Supervisor"
  location: string
}

export function UnitDialog({
  onCreate = async () => {},
}: {
  onCreate?: (payload: UnitForm) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<UnitForm>({
    name: "",
    type: "Patrol Car",
    location: "",
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim()) return

    try {
      setSubmitting(true)
      await onCreate(form)
      setForm({ name: "", type: "Patrol Car", location: "" })
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Shield className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Police Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Unit Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Unit 08 — Patrol Car"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Unit Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as UnitForm["type"] }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Patrol Car">Patrol Car</SelectItem>
                <SelectItem value="Motorbike">Motorbike</SelectItem>
                <SelectItem value="Tow Truck">Tow Truck</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="5th & Pine St"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
              {submitting ? "Adding..." : "Add Unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
