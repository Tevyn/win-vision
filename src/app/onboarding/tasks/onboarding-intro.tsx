"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Lightbulb, Globe, Calendar, ChevronRight, CheckCircle } from "lucide-react"

interface OnboardingIntroProps {
  onComplete: (data?: any) => void
  isCompleted: boolean
}

const onboardingSteps = [
  {
    id: "voter-segments",
    icon: Users,
    title: "Select Your Voter Segments",
    description: "Choose the specific groups of voters you'll focus your campaign on. We'll help you reach at least 150% of your win number.",
    estimatedTime: "10 minutes",
    details: "You'll review 5 data-driven voter segments and select the ones that align with your campaign strategy."
  },
  {
    id: "campaign-identity",
    icon: Lightbulb,
    title: "Build Your Campaign Identity",
    description: "Define your why statement, platform, and core messaging that resonates with your chosen voter segments.",
    estimatedTime: "25 minutes", 
    details: "We'll guide you through creating compelling messaging that speaks directly to your target voters."
  },
  {
    id: "website-content",
    icon: Globe,
    title: "Review & Publish Your Website",
    description: "Review the website content we generate based on your identity and publish your campaign site with one click.",
    estimatedTime: "<5 minutes",
    details: "Your website will be automatically generated and optimized for your voter segments and messaging."
  },
  {
    id: "campaign-plan",
    icon: Calendar,
    title: "Review Your Campaign Plan",
    description: "See your personalized campaign plan with content tailored to each voter segment you selected.",
    estimatedTime: "15 minutes",
    details: "We'll populate your campaigns with personalized content based on your campaign plan configuration and chosen segments."
  }
]

export default function OnboardingIntro({ onComplete, isCompleted }: OnboardingIntroProps) {
  const [readyToStart, setReadyToStart] = useState(false)

  const handleComplete = () => {
    onComplete({
      introCompleted: true,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-800">
            Welcome to Your Campaign Builder
          </CardTitle>
          <CardDescription className="text-blue-700 text-lg">
            Let's get your campaign set up in 4 simple steps. This entire process will take about <strong>50 minutes</strong>, 
            and you'll walk away with everything you need to launch your campaign.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* What You'll Get */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Have When We're Done</CardTitle>
          <CardDescription>
            By the end of this onboarding, you'll have a complete campaign foundation:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Target voter segments identified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Complete campaign identity & messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Live campaign website</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Personalized campaign plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Content tailored to each voter segment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Ready-to-use outreach materials</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Here's What We'll Do Together</h3>
        
        <div className="space-y-3">
          {onboardingSteps.map((step, index) => {
            const IconComponent = step.icon
            
            return (
              <Card key={step.id} className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-semibold text-blue-600 text-sm">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-lg text-gray-900">{step.title}</h4>
                        <Badge variant="outline" className="ml-auto">
                          {step.estimatedTime}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600">{step.description}</p>
                      
                      <p className="text-sm text-gray-500">{step.details}</p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Ready to Start */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Ready to Build Your Campaign?</CardTitle>
          <CardDescription className="text-green-700">
            The process is designed to be collaborative - we'll guide you through each step with clear instructions and smart defaults.
            You can always go back and make changes later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={readyToStart}
                onChange={(e) => setReadyToStart(e.target.checked)}
                disabled={isCompleted}
                className="w-4 h-4"
              />
              <span className="text-sm text-green-700">
                I understand what we'll be doing and I'm ready to start building my campaign
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleComplete}
          disabled={!readyToStart || isCompleted}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          {isCompleted 
            ? "✓ Ready to Start" 
            : "Let's Build My Campaign"
          }
        </Button>
      </div>
    </div>
  )
} 