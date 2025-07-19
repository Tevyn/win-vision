"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Target, MessageSquare, Lightbulb, MessageCircle, CheckCircle2, CheckCircle, Circle } from "lucide-react"
import { MainLayout } from "@/components/ui/main-layout"

interface IdentitySection {
  id: string
  title: string
  description: string
  content: string
  guidelines: string[]
  uses: string[]
  isCompleted: boolean
  isApproved: boolean
}

interface OutreachItem {
  name: string
  description: string
  requiredSections: string[]
}

export default function CampaignIdentity() {
  const [sections, setSections] = useState<IdentitySection[]>([
    {
      id: "why-statement",
      title: "Why Statement",
      description: "Your personal motivation for running and what drives you to serve your community. This is the emotional core of your campaign.",
      content: "",
      guidelines: [
        "Be personal and authentic - share your story",
        "Connect to your community and its needs",
        "Explain what motivates you to make change",
        "Keep it concise but meaningful (2-3 sentences)",
        "Make it memorable and repeatable"
      ],
      uses: ["Website", "Social Posts", "Text Messages", "Robocalls", "Canvassing Scripts", "Event Introductions"],
      isCompleted: false,
      isApproved: false
    },
    {
      id: "platform",
      title: "Platform",
      description: "Your key policy positions and what you'll focus on if elected. This defines your priorities and goals for office.",
      content: "",
      guidelines: [
        "Focus on 3-5 key issues that matter most",
        "Be specific about your positions and solutions",
        "Connect to local community needs",
        "Show how you'll make a difference",
        "Keep language accessible to all voters"
      ],
      uses: ["Core Messaging", "Website", "Social Posts", "Canvassing Scripts", "Event Talking Points", "Media Interviews"],
      isCompleted: false,
      isApproved: false
    },
    {
      id: "core-messaging",
      title: "Core Messaging",
      description: "Your main talking points and how you'll communicate your platform to voters. This is your campaign's voice and key messages.",
      content: "",
      guidelines: [
        "Create 3-5 key messages that support your platform",
        "Use simple, clear language that resonates",
        "Include both problems and solutions",
        "Make messages memorable and repeatable",
        "Ensure consistency across all communications"
      ],
      uses: ["Text Messages", "Robocalls", "Canvassing Scripts", "Social Posts", "Website", "Press Releases"],
      isCompleted: false,
      isApproved: false
    }
  ])

  const outreachItems: OutreachItem[] = [
    {
      name: "Website",
      description: "Your campaign website with key messaging",
      requiredSections: ["why-statement", "platform", "core-messaging"]
    },
    {
      name: "Social Posts",
      description: "Facebook, Instagram, and other social media content",
      requiredSections: ["why-statement", "platform", "core-messaging"]
    },
    {
      name: "Text Messages",
      description: "Voter outreach via SMS",
      requiredSections: ["why-statement", "core-messaging"]
    },
    {
      name: "Robocalls",
      description: "Automated phone calls to voters",
      requiredSections: ["why-statement", "core-messaging"]
    },
    {
      name: "Canvassing Scripts",
      description: "Door-to-door conversation guides",
      requiredSections: ["why-statement", "platform", "core-messaging"]
    },
    {
      name: "Event Introductions",
      description: "Speaking points for events and forums",
      requiredSections: ["why-statement"]
    },
    {
      name: "Event Talking Points",
      description: "Key messages for public speaking",
      requiredSections: ["platform"]
    },
    {
      name: "Media Interviews",
      description: "Press and media conversation prep",
      requiredSections: ["platform"]
    },
    {
      name: "Press Releases",
      description: "Official campaign announcements",
      requiredSections: ["core-messaging"]
    }
  ]

  const handleContentChange = (sectionId: string, newContent: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            content: newContent,
            isCompleted: newContent.trim().length > 0
          }
        : section
    ))
  }

  const handleApprove = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            isApproved: true
          }
        : section
    ))
  }

  const handleFeedback = (sectionId: string) => {
    // For now, just show an alert - this could be expanded to show a modal or redirect
    alert("Feedback feature coming soon! This will help you improve your content.")
  }

  const getStatusBadge = (section: IdentitySection) => {
    if (section.isApproved) {
      return <Badge className="bg-green-600">Approved</Badge>
    } else if (section.isCompleted) {
      return <Badge variant="outline" className="border-blue-500 text-blue-700">Ready for Review</Badge>
    } else {
      return <Badge variant="outline">Pending</Badge>
    }
  }

  const getOutreachCompletion = (outreach: OutreachItem) => {
    const approvedSections = sections.filter(s => s.isApproved).map(s => s.id)
    const completedRequirements = outreach.requiredSections.filter(req => approvedSections.includes(req))
    return {
      completed: completedRequirements.length,
      total: outreach.requiredSections.length,
      isComplete: completedRequirements.length === outreach.requiredSections.length
    }
  }

  return (
    <MainLayout currentPage="campaign-identity">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Campaign Identity
            </h1>
            <p className="text-lg text-gray-600">
              Define your campaign's core identity and messaging foundation.
            </p>
          </div>
        </div>

        {/* Campaign Materials Generation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Campaign Materials</CardTitle>
            <CardDescription>
              Once you complete your campaign identity, we'll use these pieces to generate all of your outreach materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 mb-6">
                  Your identity foundation will power everything from your website and social media posts to your canvassing scripts and press releases. We'll automatically generate personalized, consistent messaging across all your campaign touchpoints.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="outline" className="text-sm py-2 px-4">Website Content</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Social Media Posts</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Text Messages</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Canvassing Scripts</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Press Releases</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Event Talking Points</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Robocalls</Badge>
                  <Badge variant="outline" className="text-sm py-2 px-4">Email Campaigns</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commented out outreach tracking section */}
        {/*
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Campaign Outreach</CardTitle>
            <CardDescription>
              Once you have your campaign identity completed, we'll work it into all of your outreach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outreachItems.map((item, index) => {
                const completion = getOutreachCompletion(item)
                return (
                  <div key={index} className={`p-4 border rounded-lg ${completion.isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {completion.isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="space-y-1">
                      {item.requiredSections.map((reqSection) => {
                        const section = sections.find(s => s.id === reqSection)
                        const isApproved = section?.isApproved || false
                        return (
                          <div key={reqSection} className="flex items-center gap-2 text-xs">
                            {isApproved ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <Circle className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={isApproved ? 'text-green-700' : 'text-gray-500'}>
                              {section?.title}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        */}

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.id} className={`${section.isApproved ? 'border-green-200 bg-green-50' : section.isCompleted ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`${section.isApproved ? 'text-green-800' : section.isCompleted ? 'text-blue-800' : 'text-gray-900'}`}>
                      {index + 1}. {section.title}
                    </CardTitle>
                    <CardDescription className={section.isApproved ? 'text-green-700' : section.isCompleted ? 'text-blue-700' : ''}>
                      {section.description}
                    </CardDescription>
                  </div>
                  {getStatusBadge(section)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Content Input - Left side (2 columns) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        Your {section.title}
                      </h4>
                      <Textarea
                        placeholder={`Write your ${section.title.toLowerCase()} here...`}
                        value={section.content}
                        onChange={(e) => handleContentChange(section.id, e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeedback(section.id)}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Get Feedback
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(section.id)}
                        disabled={!section.isCompleted || section.isApproved}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {section.isApproved ? "Approved" : "Approve"}
                      </Button>
                    </div>

                    {/* Uses */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-red-600" />
                        Used In
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {section.uses.map((use, useIndex) => (
                          <Badge 
                            key={useIndex} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {use}
                          </Badge>
                        ))}
                      </div>
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
                        {section.guidelines.map((guideline, guidelineIndex) => (
                          <li key={guidelineIndex} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-600 font-semibold mt-0.5">•</span>
                            {guideline}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </MainLayout>
  )
} 