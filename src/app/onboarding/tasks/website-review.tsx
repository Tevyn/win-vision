"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Check, Edit2, Plus } from "lucide-react"

interface WebsiteReviewProps {
  onComplete: (data?: any) => void
  isCompleted: boolean
}

interface ContactDetails {
  address: string
  email: string
  phone: string
}

interface KeyIssue {
  id: string
  title: string
  description: string
}

interface WebsiteData {
  contactDetails: ContactDetails
  bio: string
  keyIssues: KeyIssue[]
  title: string
  tagline: string
  colorTheme: 'light' | 'dark' | 'meridian' | 'earthy'
  customLink: string
}

const colorThemes = [
  { id: 'light', name: 'Light', colors: ['#ffffff', '#e5e7eb', '#3b82f6'] },
  { id: 'dark', name: 'Dark', colors: ['#1f2937', '#374151', '#60a5fa'] },
  { id: 'meridian', name: 'Meridian', colors: ['#64748b', '#dc2626'] },
  { id: 'earthy', name: 'Earthy', colors: ['#fef3c7', '#fbbf24', '#d97706'] }
]

export default function WebsiteReviewTask({ onComplete, isCompleted }: WebsiteReviewProps) {
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    contactDetails: {
      address: "",
      email: "contactjane@gmail.com",
      phone: "(555) 123-4567"
    },
    bio: "As a lifelong resident of our community, I'm committed to sustainable growth, public safety, and creating opportunities for all residents.",
    keyIssues: [
      { id: '1', title: 'Education', description: 'Our schools deserve leaders who prioritize...' },
      { id: '2', title: 'Education', description: 'Our schools deserve leaders who prioritize...' },
      { id: '3', title: 'Education', description: 'Our schools deserve leaders who prioritize...' }
    ],
    title: "Jane Smith for City Council",
    tagline: "Building a Brighter Future Together",
    colorTheme: 'light',
    customLink: "janesmithcitycouncil"
  })

  const handleContactDetailsChange = (field: keyof ContactDetails, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value
      }
    }))
  }

  const handleBioChange = (value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      bio: value
    }))
  }

  const handleKeyIssueChange = (issueId: string, field: 'title' | 'description', value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      keyIssues: prev.keyIssues.map(issue => 
        issue.id === issueId ? { ...issue, [field]: value } : issue
      )
    }))
  }

  const addKeyIssue = () => {
    const newIssue: KeyIssue = {
      id: Date.now().toString(),
      title: 'New Issue',
      description: 'Description goes here...'
    }
    setWebsiteData(prev => ({
      ...prev,
      keyIssues: [...prev.keyIssues, newIssue]
    }))
  }

  const handleTitleChange = (value: string) => {
    setWebsiteData(prev => ({ ...prev, title: value }))
  }

  const handleTaglineChange = (value: string) => {
    setWebsiteData(prev => ({ ...prev, tagline: value }))
  }

  const handleColorThemeChange = (theme: 'light' | 'dark' | 'meridian' | 'earthy') => {
    setWebsiteData(prev => ({ ...prev, colorTheme: theme }))
  }

  const handleCustomLinkChange = (value: string) => {
    setWebsiteData(prev => ({ ...prev, customLink: value }))
  }

  const handleSaveAndContinue = () => {
    onComplete(websiteData)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Forms */}
      <div className="space-y-8">
        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What are your contact details?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={websiteData.contactDetails.address}
                onChange={(e) => handleContactDetailsChange('address', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={websiteData.contactDetails.email}
                onChange={(e) => handleContactDetailsChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={websiteData.contactDetails.phone}
                onChange={(e) => handleContactDetailsChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Campaign About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What is your campaign about?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="bio">Your Bio</Label>
              <div className="mt-1 relative">
                <Textarea
                  id="bio"
                  value={websiteData.bio}
                  onChange={(e) => handleBioChange(e.target.value)}
                  rows={4}
                  className="pr-10"
                />
                <Edit2 className="absolute top-3 right-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label>Key Issues</Label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {websiteData.keyIssues.map((issue) => (
                  <Card key={issue.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        value={issue.title}
                        onChange={(e) => handleKeyIssueChange(issue.id, 'title', e.target.value)}
                        className="font-medium border-none p-0 h-auto"
                      />
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      value={issue.description}
                      onChange={(e) => handleKeyIssueChange(issue.id, 'description', e.target.value)}
                      className="text-sm text-gray-600 border-none p-0 h-auto"
                    />
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addKeyIssue}
                  className="h-24 border-2 border-dashed border-gray-300 hover:border-gray-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add issue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Customize the content visitors will see first</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={websiteData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={websiteData.tagline}
                onChange={(e) => handleTaglineChange(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Main Image</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Upload image</p>
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1280x640px. PNG or JPG format.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Choose a color theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleColorThemeChange(theme.id as any)}
                  className={`relative border-2 rounded-lg p-4 transition-all ${
                    websiteData.colorTheme === theme.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex h-8 rounded mb-3">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{theme.name}</span>
                    {websiteData.colorTheme === theme.id && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Upload your campaign logo if you have one</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Upload logo</p>
              <p className="text-xs text-gray-500 mt-1">Recommended size: 200x80px. PNG or JPG format.</p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What do you want your custom link to be?</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={websiteData.customLink}
              onChange={(e) => handleCustomLinkChange(e.target.value)}
              className="mb-2"
            />
            <p className="text-sm text-gray-500">goodparty.org/c/{websiteData.customLink}</p>
          </CardContent>
        </Card>

        {/* Publish Button */}
        <div className="pb-8">
          <Button onClick={handleSaveAndContinue} className="w-full" size="lg">
            {isCompleted ? 'Update Website' : 'Publish Website'}
          </Button>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:sticky lg:top-8 h-fit">
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Website Preview</CardTitle>
            <CardDescription>This is how your website will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center min-h-[400px] flex items-center justify-center">
              <div className="text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Website Preview Goes Here</h3>
                <p className="text-sm">Your website preview will be displayed here once implemented</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 