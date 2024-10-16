import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Button } from '../ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Cards'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { toast } from '../ui/use-toast'
import { Loader2, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { Slider } from '../ui/Slider'
import axios from 'axios'

interface SettingsTabProps {
  userData: any
}

const SettingsTab = ({ userData }: SettingsTabProps) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    last_name: userData?.last_name || '',
    email: userData?.email || '',
    username: userData?.username || '',
    height: userData?.height?.toString() || '170',
    weight: userData?.weight?.toString() || '70',
    sex: userData?.sex || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSliderChange = (value: number[], field: string) => {
    setFormData({
      ...formData,
      [field]: value[0].toString(),
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const token = localStorage.getItem('token')
     
      const response = await axios.patch(
        'https://backend-health-lens.vercel.app/user/update',
        {
          name: formData.name,
          last_name: formData.last_name,
          email: formData.email,
          username: formData.username,
          height: parseFloat(formData.height) || null,
          weight: parseFloat(formData.weight) || null,
          sex: formData.sex,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully.",
      })
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-600">Personal Information</CardTitle>
          <CardDescription>Manage your personal information and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback>
                  <User className="w-12 h-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{formData.name} {formData.last_name}</h3>
                <p className="text-sm text-gray-500">{formData.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="height"
                    min={100}
                    max={250}
                    step={1}
                    value={[parseInt(formData.height) || 170]}
                    onValueChange={(value) => handleSliderChange(value, 'height')}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    id="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-20"
                    min={100}
                    max={250}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="weight"
                    min={30}
                    max={200}
                    step={1}
                    value={[parseInt(formData.weight) || 70]}
                    onValueChange={(value) => handleSliderChange(value, 'weight')}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    id="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-20"
                    min={30}
                    max={200}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select onValueChange={(value) => handleSelectChange(value, 'sex')} value={formData.sex}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardFooter className="flex justify-end mt-6 px-0">
              <Button type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SettingsTab