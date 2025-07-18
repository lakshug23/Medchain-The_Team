"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Package, MapPin, Clock, CheckCircle, AlertCircle, TrendingUp, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BatchData {
  id: string
  drugName: string
  manufacturer: string
  status: "pending" | "in-transit" | "delivered"
  location: string
  timestamp: string
  destination: string
}

export default function DistributorInterface() {
  const { toast } = useToast()
  const [qrInput, setQrInput] = useState("")
  const [batches, setBatches] = useState<BatchData[]>([
    {
      id: "BATCH001",
      drugName: "Paracetamol 500mg",
      manufacturer: "PharmaCorp Ltd",
      status: "in-transit",
      location: "Mumbai Distribution Center",
      timestamp: "2024-01-15 14:30",
      destination: "Rural Health Center - Pune",
    },
    {
      id: "BATCH002",
      drugName: "Amoxicillin 250mg",
      manufacturer: "MediLife Industries",
      status: "delivered",
      location: "Pune Rural Health Center",
      timestamp: "2024-01-14 09:15",
      destination: "Rural Health Center - Pune",
    },
    {
      id: "BATCH003",
      drugName: "Metformin 500mg",
      manufacturer: "HealthFirst Pharma",
      status: "pending",
      location: "Delhi Warehouse",
      timestamp: "2024-01-16 11:45",
      destination: "District Hospital - Gurgaon",
    },
  ])

  const handleQrScan = () => {
    if (!qrInput.trim()) {
      toast({
        title: "Invalid QR Code",
        description: "Please enter a valid batch ID",
        variant: "destructive",
      })
      return
    }

    // Simulate adding a new batch
    const newBatch: BatchData = {
      id: qrInput.toUpperCase(),
      drugName: "Scanned Drug",
      manufacturer: "Unknown Manufacturer",
      status: "pending",
      location: "Distribution Center",
      timestamp: new Date().toLocaleString(),
      destination: "To be assigned",
    }

    setBatches((prev) => [newBatch, ...prev])
    setQrInput("")

    toast({
      title: "Batch Scanned Successfully",
      description: `Batch ${newBatch.id} added to tracking system`,
    })
  }

  const updateBatchStatus = (batchId: string, newStatus: "pending" | "in-transit" | "delivered") => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id === batchId ? { ...batch, status: newStatus, timestamp: new Date().toLocaleString() } : batch,
      ),
    )

    toast({
      title: "Status Updated",
      description: `Batch ${batchId} marked as ${newStatus}`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "in-transit":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Truck className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const stats = {
    totalBatches: batches.length,
    inTransit: batches.filter((b) => b.status === "in-transit").length,
    delivered: batches.filter((b) => b.status === "delivered").length,
    pending: batches.filter((b) => b.status === "pending").length,
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-[#007CC3]/10 to-[#3781C2]/10 border-[#007CC3]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#007CC3]">
            <Truck className="h-5 w-5" />
            Distributor Dashboard
          </CardTitle>
          <CardDescription>Track and manage drug batch distribution across the supply chain</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scanner" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="tracking">Batch Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Scan Batch QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter batch ID or scan QR code"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleQrScan} className="bg-[#007CC3] hover:bg-[#3781C2]">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                Scan QR codes on drug packages to add them to the tracking system
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Batch Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>{batch.drugName}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {batch.location}
                        </div>
                      </TableCell>
                      <TableCell>{batch.destination}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {batch.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBatchStatus(batch.id, "in-transit")}
                            >
                              Ship
                            </Button>
                          )}
                          {batch.status === "in-transit" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBatchStatus(batch.id, "delivered")}
                            >
                              Deliver
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Batches</p>
                    <p className="text-2xl font-bold text-[#007CC3]">{stats.totalBatches}</p>
                  </div>
                  <Package className="h-8 w-8 text-[#007CC3]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Distribution Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Delivery Success Rate</span>
                  <span className="font-bold text-green-600">
                    {Math.round((stats.delivered / stats.totalBatches) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Transit Time</span>
                  <span className="font-bold">2.3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>On-Time Delivery</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
