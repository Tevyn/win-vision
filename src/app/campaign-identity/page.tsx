"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, MessageSquare, Plus, X, MessageCircle } from "lucide-react"
import { MainLayout } from "@/components/ui/main-layout"

interface Issue {
  id: string
  problemToSolve: string
  howItHurtsPeople: string
  whatYoullDo: string
}

interface FormData {
  background: string
  personalExperience: string
  issues: Issue[]
  whyStatement: string
}

export default function CampaignIdentity() {
  const [formData, setFormData] = useState<FormData>({
    background: "",
    personalExperience: "",
    issues: [{ id: "1", problemToSolve: "", howItHurtsPeople: "", whatYoullDo: "" }],
    whyStatement: ""
  })

  // Load data from onboarding on component mount
  useEffect(() => {
    const savedIdentityData = localStorage.getItem('onboarding-task-campaign-identity')
    if (savedIdentityData) {
      try {
        const data = JSON.parse(savedIdentityData)
        setFormData(data)
      } catch (error) {
        console.error('Error loading campaign identity data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('onboarding-task-campaign-identity', JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (field: keyof Omit<FormData, 'issues'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleIssueChange = (issueId: string, field: keyof Issue, value: string) => {
    setFormData(prev => ({
      ...prev,
      issues: prev.issues.map(issue =>
        issue.id === issueId ? { ...issue, [field]: value } : issue
      )
    }))
  }

  const addIssue = () => {
    if (formData.issues.length >= 4) return
    
    const newId = (Math.max(...formData.issues.map(i => parseInt(i.id))) + 1).toString()
    setFormData(prev => ({
      ...prev,
      issues: [...prev.issues, { id: newId, problemToSolve: "", howItHurtsPeople: "", whatYoullDo: "" }]
    }))
  }

  const removeIssue = (issueId: string) => {
    if (formData.issues.length <= 1) return
    
    setFormData(prev => ({
      ...prev,
      issues: prev.issues.filter(issue => issue.id !== issueId)
    }))
  }

  const generateDraft = () => {
    const validIssues = formData.issues.filter(issue => 
      issue.problemToSolve && issue.howItHurtsPeople && issue.whatYoullDo
    )
    
    if (!formData.personalExperience || validIssues.length === 0) {
      return
    }

    let draft = `I'm running for office because ${formData.personalExperience}, and I want to `
    
    if (validIssues.length === 1) {
      draft += `${validIssues[0].whatYoullDo}, so that ${validIssues[0].howItHurtsPeople} can have a better future.`
    } else {
      const solutions = validIssues.map(issue => issue.whatYoullDo)
      const lastSolution = solutions.pop()
      draft += `${solutions.join(', ')} and ${lastSolution}, so that our community can have a better future.`
    }
    
    setFormData(prev => ({
      ...prev,
      whyStatement: draft
    }))
  }

  const canGenerateDraft = formData.personalExperience && 
    formData.issues.some(issue => issue.problemToSolve && issue.howItHurtsPeople && issue.whatYoullDo)

  return (
    <MainLayout currentPage="campaign-identity">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Campaign Identity
            </h1>
            <p className="text-lg text-gray-600">
              Your campaign's core identity and messaging foundation. You can edit this anytime as your campaign evolves.
            </p>
          </div>
        </div>

        {/* Campaign Materials Preview */}
        <Card className="border-green-200 bg-green-50 mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Your Campaign Materials</CardTitle>
            <CardDescription className="text-green-700">
              This identity powers all your campaign outreach. Changes here automatically update everything.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Website Content", "8 Social Media Posts", "5 Text Messages", "3 Canvassing Scripts", 
                "2 Press Releases", "4 Event Talking Points", "2 Robocalls", "6 Email Campaigns"
              ].map((material, index) => (
                <Badge key={index} variant="outline" className="justify-center py-2 border-green-300 text-green-800">
                  {material}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Section 1: Background Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Tell Us About You</CardTitle>
              <CardDescription>
                Your background and the personal experience that shaped you as a person.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="background" className="text-sm font-medium">
                  Your background (job, family, community role)
                </Label>
                <Input
                  id="background"
                  placeholder="e.g., Local teacher, parent of two, volunteer at the food bank..."
                  value={formData.background}
                  onChange={(e) => handleInputChange("background", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="experience" className="text-sm font-medium">
                  Personal experience that shaped you (one key story/moment)
                </Label>
                <Textarea
                  id="experience"
                  placeholder="e.g., When my daughter's school almost closed due to budget cuts, I realized..."
                  value={formData.personalExperience}
                  onChange={(e) => handleInputChange("personalExperience", e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Issues and Solutions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">2. The Issues You Care About</CardTitle>
                  <CardDescription>
                    The problems you want to solve and your solutions. You can add up to 4 issues.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addIssue}
                  disabled={formData.issues.length >= 4}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Issue
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.issues.map((issue, index) => (
                <Card key={issue.id} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Issue {index + 1}</CardTitle>
                      {formData.issues.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIssue(issue.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor={`problem-${issue.id}`} className="text-sm font-medium">
                        The problem you want to solve
                      </Label>
                      <Input
                        id={`problem-${issue.id}`}
                        placeholder="e.g., Lack of affordable housing, inadequate school funding..."
                        value={issue.problemToSolve}
                        onChange={(e) => handleIssueChange(issue.id, "problemToSolve", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`impact-${issue.id}`} className="text-sm font-medium">
                        How it hurts people personally
                      </Label>
                      <Input
                        id={`impact-${issue.id}`}
                        placeholder="e.g., Families are being forced to move away, children aren't getting quality education..."
                        value={issue.howItHurtsPeople}
                        onChange={(e) => handleIssueChange(issue.id, "howItHurtsPeople", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`solution-${issue.id}`} className="text-sm font-medium">
                        What you'll do to fix it
                      </Label>
                      <Input
                        id={`solution-${issue.id}`}
                        placeholder="e.g., Create more affordable housing programs, increase education funding..."
                        value={issue.whatYoullDo}
                        onChange={(e) => handleIssueChange(issue.id, "whatYoullDo", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Section 3: Why Statement */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">3. Your Why Statement</CardTitle>
              <CardDescription className="text-blue-700">
                Your core campaign message that connects with voters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Content Input - Left side (2 columns) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        Your Why Statement
                      </h4>
                      <Textarea
                        placeholder="Write or edit your why statement here..."
                        value={formData.whyStatement}
                        onChange={(e) => handleInputChange("whyStatement", e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                    
                    {/* Action Buttons under text box */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={generateDraft}
                        disabled={!canGenerateDraft}
                        className="flex items-center gap-2"
                      >
                        Generate New Draft
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => alert("Get feedback feature coming soon!")}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Get Feedback
                      </Button>
                    </div>
                  </div>

                  {/* Guidelines - Right side (1 column) */}
                  <div className="lg:col-span-1">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        Guidelines
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-semibold mt-0.5">•</span>
                          Be personal - share your real story
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-semibold mt-0.5">•</span>
                          Connect to community needs - show who benefits
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-semibold mt-0.5">•</span>
                          Take 20 seconds or less to say out loud
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-semibold mt-0.5">•</span>
                          Use simple language a 10-year-old would understand
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-semibold mt-0.5">•</span>
                          Feel authentic to you when you say it
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-semibold mt-0.5">•</span>
                          Be repeatable - others can easily remember it
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 