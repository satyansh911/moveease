"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera } from "lucide-react"

export type CameraForm = {
  name: string
  location: string
  img: string
}

const sampleImages = [
  { label: "Traffic Intersection", value: "/traffic-camera-intersection.png" },
  { label: "Highway Camera", value: "/highway-traffic-camera.png" },
  { label: "Stadium Area", value: "/stadium-traffic-camera.png" },
  { label: "City Center", value: "/offline-city-camera.png" },
]

export function CameraDialog({
  onCreate = async () => {},
}: {
  onCreate?: (payload: CameraForm) => Promise<void> | void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CameraForm>({
    name: "",
    location: "",
    img: sampleImages[0].value,
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim()) return

    try {
      setSubmitting(true)
      await onCreate(form)
      setForm({ name: "", location: "", img: sampleImages[0].value })
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-600 hover:bg-zinc-700">
          <Camera className="mr-2 h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Traffic Camera</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Camera Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Cam 15 — Broadway & 5th"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Broadway & 5th Street"
            />
          </div>
          <div className="grid gap-2">
            <Label>Camera Type</Label>
            <Select value={form.img} onValueChange={(v) => setForm((f) => ({ ...f, img: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select camera type" />
              </SelectTrigger>
              <SelectContent>
                {sampleImages.map((img) => (
                  <SelectItem key={img.value} value={img.value}>
                    {img.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Preview</Label>
            <div className="border rounded-lg overflow-hidden">
              <img src={form.img || "/placeholder.svg"} alt="Camera preview" className="w-full h-32 object-cover" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-zinc-600 hover:bg-zinc-700">
              {submitting ? "Adding..." : "Add Camera"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
