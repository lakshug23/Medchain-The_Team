"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Package, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface LoginPageProps {
  onLogin: (userData: { email: string; role: string; orgName: string; location: string }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    role: "",
    orgName: "",
    location: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, accept any credentials and assign default role
    onLogin({
      email: loginData.email,
      role: "Manufacturer", // Default role for demo
      orgName: "Demo Organization",
      location: "Demo Location",
    })

    toast({
      title: "Login Successful",
      description: "Welcome to MedChain!",
    })

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupData.email || !signupData.password || !signupData.role || !signupData.orgName || !signupData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate signup process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onLogin({
      email: signupData.email,
      role: signupData.role,
      orgName: signupData.orgName,
      location: signupData.location,
    })

    toast({
      title: "Account Created Successfully",
      description: "Welcome to MedChain!",
    })

    setIsLoading(false)
  }

  const features = [
    {
      icon: Shield,
      title: "Supply Chain Tracking",
      description: "End-to-end traceability",
    },
    {
      icon: Users,
      title: "Patient Verification",
      description: "Secure identity management",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Real-time stock monitoring",
    },
    {
      icon: BarChart3,
      title: "AI Demand Forecasting",
      description: "Predictive analytics",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding */}
      <div className="flex-1 flex flex-col justify-center px-12 py-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo.jpeg" alt="MedChain Logo" width={60} height={60} className="rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MedChain</h1>
              <p className="text-lg text-gray-600">Healthcare Supply Integrity Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              We are <span className="font-semibold text-blue-600">THE_TEAM</span> — a team of five engineers building a
              solution to make medicine delivery safer, more transparent, and reliable.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform tracks every step of a drug's journey, helps predict demand, and ensures it reaches
              patients—especially in underserved areas—on time and without compromise.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <feature.icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="w-96 flex items-center justify-center p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join the MedChain network</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={signupData.role}
                      onValueChange={(value) => setSignupData((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="Distributor">Distributor</SelectItem>
                        <SelectItem value="Hospital/Pharmacy">Hospital/Pharmacy</SelectItem>
                        <SelectItem value="Patient">Patient</SelectItem>
                        <SelectItem value="Admin/Regulator">Admin/Regulator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={signupData.orgName}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, orgName: e.target.value }))}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={signupData.location}
                      onValueChange={(value) => setSignupData((prev) => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urban">Urban</SelectItem>
                        <SelectItem value="Rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
