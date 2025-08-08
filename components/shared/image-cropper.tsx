"use client"

import React from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  src: string
  aspect?: number
  output?: { width: number; height: number }
  zoomLabel?: string
  onCancel?: () => void
  onCropped?: (blob: Blob) => void
  className?: string
}

export default function ImageCropper({
  src,
  aspect = 1,
  output = { width: 512, height: 512 },
  zoomLabel = "Zoom",
  onCancel = () => {},
  onCropped = () => {},
  className,
}: Props) {
  const [crop, setCrop] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)

  const onCropComplete = React.useCallback((_croppedArea: any, croppedAreaPx: any) => {
    setCroppedAreaPixels(croppedAreaPx)
  }, [])

  async function createCroppedImage() {
    setLoading(true)
    try {
      const blob = await getCroppedBlob(src, croppedAreaPixels, output.width, output.height)
      onCropped(blob)
    } catch (err) {
      console.error(err)
      alert("Failed to crop image.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative aspect-[16/9] w-full bg-black/60">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          restrictPosition={false}
          showGrid
        />
      </div>
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">{zoomLabel}</span>
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0] || 1)}
            min={1}
            max={4}
            step={0.01}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={createCroppedImage} disabled={loading}>
            {loading ? "Saving..." : "Save crop"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Utilities
async function getCroppedBlob(
  src: string,
  crop: { width: number; height: number; x: number; y: number },
  targetW: number,
  targetH: number
): Promise<Blob> {
  const image = await loadImage(src)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No 2d context")

  canvas.width = targetW
  canvas.height = targetH

  // drawImage parameters: image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    targetW,
    targetH
  )

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Canvas toBlob failed"))
    }, "image/png")
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // avoid CORS issues when rendering to canvas
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (e) => reject(e))
    img.src = src
  })
}
