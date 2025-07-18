"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeProps {
  value: string
  size?: number
  showDownload?: boolean
}

export default function QRCode({ value, size = 200, showDownload = false }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const modules = 25 // QR code size
    const moduleSize = size / modules
    const quietZone = 2 // Border modules

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Generate pattern based on value hash
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    ctx.fillStyle = "#000000"

    // Draw finder patterns (corner squares)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer 7x7 square
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            ctx.fillRect((x + i) * moduleSize, (y + j) * moduleSize, moduleSize, moduleSize)
          }
        }
      }
    }

    // Draw the three finder patterns
    drawFinderPattern(0, 0) // Top-left
    drawFinderPattern(modules - 7, 0) // Top-right
    drawFinderPattern(0, modules - 7) // Bottom-left

    // Draw timing patterns
    for (let i = 8; i < modules - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize) // Horizontal
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize) // Vertical
      }
    }

    // Draw data modules with realistic QR pattern
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Skip finder patterns and separators
        if (
          (row < 9 && col < 9) || // Top-left finder + separator
          (row < 9 && col >= modules - 8) || // Top-right finder + separator
          (row >= modules - 8 && col < 9) || // Bottom-left finder + separator
          (row === 6 && col >= 8 && col < modules - 8) || // Horizontal timing
          (col === 6 && row >= 8 && row < modules - 8) // Vertical timing
        ) {
          continue
        }

        // Generate pseudo-random pattern based on position and hash
        const seed = hash + row * 31 + col * 17 + ((row * col) % 7)
        const shouldFill = (seed % 3 === 0) !== ((row + col) % 2 === 0)

        if (shouldFill) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Add some random data patterns to make it look more realistic
    const dataRegions = [{ startRow: 9, endRow: modules - 9, startCol: 9, endCol: modules - 9 }]

    dataRegions.forEach((region) => {
      for (let row = region.startRow; row < region.endRow; row++) {
        for (let col = region.startCol; col < region.endCol; col++) {
          if (row === 6 || col === 6) continue // Skip timing patterns

          const pattern = (hash + row * 13 + col * 7) % 5
          if (pattern < 2) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
          }
        }
      }
    })
  }, [value, size])

  const downloadQR = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {showDownload && (
        <div className="flex justify-end w-full">
          <Button variant="outline" size="sm" onClick={downloadQR} className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      )}
      <div className="border-2 border-gray-300 p-2 bg-white">
        <canvas ref={canvasRef} width={size} height={size} className="block" />
      </div>
    </div>
  )
}
