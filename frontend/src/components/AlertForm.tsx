import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import api from "../api/axiosConfig" // 🔥 IMPORTANT

import { CITIES } from "../utils/weatherUtils"

export default function AlertForm() {
  const [city, setCity] = useState('')
  const [threshold, setThreshold] = useState('')
  const [email, setEmail] = useState('')

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post("/setAlert", {   // 🔥 FIXED
        city,
        threshold: parseFloat(threshold),
        email,
      })

      toast({
        title: "Alert set successfully ✅",
        description: `You will be notified when ${city} exceeds ${threshold}°C`,
      })

    } catch (error: any) {
      console.error("ERROR:", error.response?.data || error.message)

      toast({
        title: "Error",
        description: "Failed to set alert ❌",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Weather Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
  placeholder="Enter city (e.g. Mysore, Udupi)"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  required
/>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature Threshold (°C)</label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Set Alert
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}