"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"

export type AlertForm = {
  title: string
  detail: string
  level: "Advisory" | "Warning" | "Critical"
}

export function AlertDialog({
  onCreate = async () => {},
}: {
  onCreate?: (payload: AlertForm) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AlertForm>({
    title: "",
    detail: "",
    level: "Warning",
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.detail.trim()) return

    try {
      setSubmitting(true)
      await onCreate(form)
      setForm({ title: "", detail: "", level: "Warning" })
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Add Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Brief alert title..."
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail">Details</Label>
            <Textarea
              id="detail"
              value={form.detail}
              onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
              placeholder="Detailed description of the alert..."
              rows={3}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Priority Level</Label>
            <Select
              value={form.level}
              onValueChange={(v) => setForm((f) => ({ ...f, level: v as AlertForm["level"] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Advisory">Advisory</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700">
              {submitting ? "Creating..." : "Create Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
