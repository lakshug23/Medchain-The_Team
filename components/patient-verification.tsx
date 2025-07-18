"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, User, Phone, Calendar, MapPin, FileText, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DownloadButtons } from "@/components/download-utils"

interface PatientRecord {
  id: string
  aadhaarId: string
  name: string
  age: number
  dob: string
  phoneNumber: string
  location: string
  adminPasscode: string
  verificationStatus: "verified" | "pending" | "failed"
  lastVerified: string
  healthHistory: string[]
  medicinesPurchased: string[]
}

interface DummyNumber {
  number: string
  used: boolean
  patientId: string
}

export default function PatientVerification() {
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationData, setVerificationData] = useState({
    aadhaarId: "",
    adminPasscode: "",
    dummyNumber: "",
  })
  const [verifiedPatient, setVerifiedPatient] = useState<PatientRecord | null>(null)
  const [useEmergencyAccess, setUseEmergencyAccess] = useState(false)

  // Static Aadhaar IDs (no longer changing)
  const patientDatabase: PatientRecord[] = [
    {
      id: "1",
      aadhaarId: "123456789012",
      name: "Rajesh Kumar",
      age: 45,
      dob: "1979-03-15",
      phoneNumber: "+91-9876543210",
      location: "Rural Health Center - Rajasthan",
      adminPasscode: "ADMIN123",
      verificationStatus: "verified",
      lastVerified: new Date().toISOString(),
      healthHistory: ["Diabetes Type 2 (2018)", "Hypertension (2020)", "Regular checkup (2024-01-15)"],
      medicinesPurchased: [
        "Metformin 500mg - 30 tablets (2024-01-10)",
        "Paracetamol 500mg - 20 tablets (2024-01-05)",
        "Aspirin 75mg - 30 tablets (2023-12-20)",
      ],
    },
    {
      id: "2",
      aadhaarId: "234567890123",
      name: "Priya Sharma",
      age: 32,
      dob: "1992-07-22",
      phoneNumber: "+91-9876543211",
      location: "AIIMS Delhi",
      adminPasscode: "ADMIN123",
      verificationStatus: "verified",
      lastVerified: new Date().toISOString(),
      healthHistory: ["Pregnancy checkup (2023)", "Iron deficiency (2022)", "Regular vaccination (2024-02-01)"],
      medicinesPurchased: [
        "Iron tablets - 60 tablets (2024-02-01)",
        "Paracetamol 500mg - 10 tablets (2024-01-20)",
        "Vitamin D3 - 30 tablets (2024-01-15)",
      ],
    },
    {
      id: "3",
      aadhaarId: "345678901234",
      name: "Amit Singh",
      age: 28,
      dob: "1996-11-08",
      phoneNumber: "+91-9876543212",
      location: "Primary Health Center - Bihar",
      adminPasscode: "ADMIN123",
      verificationStatus: "verified",
      lastVerified: new Date().toISOString(),
      healthHistory: ["Fever treatment (2024-01)", "Cough and cold (2023-12)", "Annual health checkup (2023-11)"],
      medicinesPurchased: [
        "Amoxicillin 250mg - 21 tablets (2024-01-12)",
        "Cough syrup - 1 bottle (2023-12-28)",
        "Paracetamol 500mg - 15 tablets (2023-12-25)",
      ],
    },
  ]

  // Generate new dummy numbers each time
  const generateDummyNumbers = (): DummyNumber[] => {
    const numbers = []
    const patientIds = ["1", "2", "3"]

    for (let i = 1; i <= 15; i++) {
      numbers.push({
        number: `EMG${String(i).padStart(3, "0")}`,
        used: false,
        patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
      })
    }
    return numbers
  }

  // Initialize with fresh dummy numbers
  const [dummyNumbers, setDummyNumbers] = useState<DummyNumber[]>(generateDummyNumbers())

  const verifyPatient = async () => {
    if (useEmergencyAccess) {
      if (!verificationData.dummyNumber) {
        toast({
          title: "Missing Emergency Number",
          description: "Please enter the emergency dummy number",
          variant: "destructive",
        })
        return
      }
    } else {
      if (!verificationData.aadhaarId || !verificationData.adminPasscode) {
        toast({
          title: "Missing Information",
          description: "Please enter both Aadhaar ID and Admin Passcode",
          variant: "destructive",
        })
        return
      }
    }

    setIsVerifying(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let patient: PatientRecord | undefined

      if (useEmergencyAccess) {
        // Check dummy number
        const dummyNumber = dummyNumbers.find((dn) => dn.number === verificationData.dummyNumber && !dn.used)

        if (dummyNumber) {
          patient = patientDatabase.find((p) => p.id === dummyNumber.patientId)

          // Mark dummy number as used
          setDummyNumbers((prev) =>
            prev.map((dn) => (dn.number === verificationData.dummyNumber ? { ...dn, used: true } : dn)),
          )
        } else {
          const usedDummy = dummyNumbers.find((dn) => dn.number === verificationData.dummyNumber && dn.used)
          toast({
            title: "Invalid Emergency Access",
            description: usedDummy ? "This emergency number has already been used" : "Invalid emergency dummy number",
            variant: "destructive",
          })
          setIsVerifying(false)
          return
        }
      } else {
        // Regular verification
        patient = patientDatabase.find(
          (p) => p.aadhaarId === verificationData.aadhaarId && p.adminPasscode === verificationData.adminPasscode,
        )
      }

      if (patient) {
        setVerifiedPatient(patient)
        toast({
          title: "Patient Verified Successfully",
          description: `Welcome, ${patient.name}`,
        })
      } else {
        toast({
          title: "Verification Failed",
          description: useEmergencyAccess ? "Invalid emergency number" : "Invalid Aadhaar ID or Admin Passcode",
          variant: "destructive",
        })
        setVerifiedPatient(null)
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const resetVerification = () => {
    setVerifiedPatient(null)
    setVerificationData({
      aadhaarId: "",
      adminPasscode: "",
      dummyNumber: "",
    })
    setUseEmergencyAccess(false)
  }

  return (
    <div className="space-y-6">
      {/* Patient Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Patient Identity Verification
          </CardTitle>
          <CardDescription>
            Verify patient identity using Aadhaar ID and Admin Passcode or Emergency Access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!verifiedPatient ? (
            <>
              {/* Access Method Toggle */}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant={!useEmergencyAccess ? "default" : "outline"}
                  onClick={() => setUseEmergencyAccess(false)}
                  size="sm"
                >
                  Regular Access
                </Button>
                <span className="text-gray-400">OR</span>
                <Button
                  variant={useEmergencyAccess ? "default" : "outline"}
                  onClick={() => setUseEmergencyAccess(true)}
                  size="sm"
                >
                  Emergency Access
                </Button>
              </div>

              {!useEmergencyAccess ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarId">Aadhaar ID (12 digits)</Label>
                    <Input
                      id="aadhaarId"
                      value={verificationData.aadhaarId}
                      onChange={(e) => setVerificationData((prev) => ({ ...prev, aadhaarId: e.target.value }))}
                      placeholder="Enter 12-digit Aadhaar ID"
                      maxLength={12}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPasscode">Admin Passcode</Label>
                    <Input
                      id="adminPasscode"
                      type="password"
                      value={verificationData.adminPasscode}
                      onChange={(e) => setVerificationData((prev) => ({ ...prev, adminPasscode: e.target.value }))}
                      placeholder="Enter admin passcode"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="dummyNumber">Emergency Dummy Number</Label>
                  <Input
                    id="dummyNumber"
                    value={verificationData.dummyNumber}
                    onChange={(e) => setVerificationData((prev) => ({ ...prev, dummyNumber: e.target.value }))}
                    placeholder="Enter emergency dummy number (single use)"
                  />
                  <p className="text-sm text-orange-600">
                    ⚠️ Emergency numbers are single-use only and do not require passcode
                  </p>
                </div>
              )}

              <Button onClick={verifyPatient} disabled={isVerifying} className="w-full">
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying Identity...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Patient Identity
                  </>
                )}
              </Button>

              {/* Demo Credentials */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Demo Credentials (Same password for all):</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Patient 1:</strong> Aadhaar: 123456789012, Passcode: ADMIN123
                  </div>
                  <div>
                    <strong>Patient 2:</strong> Aadhaar: 234567890123, Passcode: ADMIN123
                  </div>
                  <div>
                    <strong>Patient 3:</strong> Aadhaar: 345678901234, Passcode: ADMIN123
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <strong>Emergency Numbers (change each session):</strong> EMG001, EMG002, EMG003, etc.
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 bg-transparent"
                      onClick={() => setDummyNumbers(generateDummyNumbers())}
                    >
                      Generate New Numbers
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800">{verifiedPatient.name}</h3>
                    <p className="text-sm text-green-600">
                      Age: {verifiedPatient.age} | Aadhaar: {verifiedPatient.aadhaarId}
                    </p>
                    <p className="text-sm text-green-600">Location: {verifiedPatient.location}</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <Button onClick={resetVerification} variant="outline" className="w-full bg-transparent">
                Verify Different Patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Passport */}
      {verifiedPatient && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Health Passport
                </CardTitle>
                <CardDescription>Complete patient health information and history</CardDescription>
              </div>
              <DownloadButtons
                data={verifiedPatient}
                filename={`health-passport-${verifiedPatient.aadhaarId}`}
                title={`Health Passport: ${verifiedPatient.name}`}
                type="health"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>{verifiedPatient.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">Age:</span>
                    <p>{verifiedPatient.age} years</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p>{verifiedPatient.dob}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">Aadhaar ID:</span>
                    <p>{verifiedPatient.aadhaarId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">Phone Number:</span>
                    <p>{verifiedPatient.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <p>{verifiedPatient.location}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Medical Information</h3>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Past Health History:</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    {verifiedPatient.healthHistory.map((history, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        • {history}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Medicine Purchase History:</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    {verifiedPatient.medicinesPurchased.map((medicine, index) => (
                      <div key={index} className="text-sm text-blue-700 mb-1">
                        • {medicine}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Features */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Security Features</CardTitle>
          <CardDescription className="text-purple-700">
            Patient verification and data protection measures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">Identity Verification:</h4>
              <ul className="space-y-1 text-purple-700">
                <li>• 12-digit Aadhaar ID validation</li>
                <li>• Encrypted admin passcode</li>
                <li>• Emergency single-use access</li>
                <li>• Multi-factor authentication</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">Data Protection:</h4>
              <ul className="space-y-1 text-purple-700">
                <li>• Blockchain immutable records</li>
                <li>• Patient data anonymization</li>
                <li>• Secure health passport</li>
                <li>• Emergency access controls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
