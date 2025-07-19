"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { SimpleLayout } from "@/components/ui/simple-layout"

interface CampaignActivity {
  name: string
  costPerContact: number
  timePerContact: number // in minutes
  description: string
  color: string
  type: 'time-intensive' | 'money-intensive' | 'minimal'
}

const activities: CampaignActivity[] = [
  {
    name: "Canvassing",
    costPerContact: 0,
    timePerContact: 8, // 8 minutes per contact (door-to-door)
    description: "Door-to-door visits with volunteers",
    color: "bg-purple-500",
    type: 'time-intensive'
  },
  {
    name: "Events",
    costPerContact: 0,
    timePerContact: 120, // 2 hours per event
    description: "Community events and meet & greets",
    color: "bg-orange-500",
    type: 'time-intensive'
  },
  {
    name: "Texting",
    costPerContact: 0.05,
    timePerContact: 0.1, // minimal time
    description: "Personalized text messages to voters",
    color: "bg-green-500",
    type: 'money-intensive'
  },
  {
    name: "Robocalls",
    costPerContact: 0.10,
    timePerContact: 0.1, // minimal time
    description: "Automated phone calls with your message",
    color: "bg-blue-500",
    type: 'money-intensive'
  },
  {
    name: "Digital Ads",
    costPerContact: 0.30,
    timePerContact: 0.1, // minimal time
    description: "Online advertising and social media ads",
    color: "bg-red-500",
    type: 'money-intensive'
  }
]



export default function CampaignPlanning() {
  const router = useRouter()
  const voterContactsNeeded = 6250
  const maxBudget = (voterContactsNeeded * 0.30) / 0.6
  const minBudget = maxBudget * 0.1

  const [budget, setBudget] = useState(maxBudget * 0.5)
  const [timeAvailable, setTimeAvailable] = useState(20) // hours per week
  const [campaignPlan, setCampaignPlan] = useState<any[]>([])

  // Calculate dependent values
  const maxTime = 40
  const minTime = 5
  const maxBudgetValue = maxBudget
  const minBudgetValue = minBudget

  // When time increases, budget decreases proportionally
  const handleTimeChange = (newTime: number) => {
    setTimeAvailable(newTime)
    // Calculate budget based on time (inverse relationship)
    const timeRatio = (newTime - minTime) / (maxTime - minTime)
    const newBudget = maxBudgetValue - (timeRatio * (maxBudgetValue - minBudgetValue))
    setBudget(Math.round(newBudget))
  }

  // When budget increases, time decreases proportionally
  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget)
    // Calculate time based on budget (inverse relationship)
    const budgetRatio = (newBudget - minBudgetValue) / (maxBudgetValue - minBudgetValue)
    const newTime = maxTime - (budgetRatio * (maxTime - minTime))
    setTimeAvailable(Math.round(newTime))
  }

  useEffect(() => {
    calculateCampaignPlan()
  }, [budget, timeAvailable])

  const calculateCampaignPlan = () => {
    const weeklyTimeMinutes = timeAvailable * 60
    const budgetForActivities = budget - 700 // Subtract website and social costs

    // Always include website and social posts
    const basePlan = [
      {
        name: "Website",
        contacts: 0,
        cost: 500,
        time: 2, // hours per week
        description: "Professional campaign website",
        color: "bg-gray-500",
        type: "minimal"
      },
      {
        name: "Social Posts",
        contacts: 0,
        cost: 200,
        time: 2, // hours per week
        description: "Regular social media content",
        color: "bg-pink-500",
        type: "minimal"
      }
    ]

    // Calculate time-intensive activities (canvassing, events) - these take time but no money
    const timeIntensiveActivities = activities
      .filter(activity => activity.type === 'time-intensive')
      .map(activity => {
        const maxContactsByTime = Math.floor(weeklyTimeMinutes / activity.timePerContact)
        const contacts = Math.min(maxContactsByTime, voterContactsNeeded)
        
        return {
          name: activity.name,
          contacts: contacts,
          cost: 0, // No money cost
          time: contacts * activity.timePerContact / 60, // convert to hours
          description: activity.description,
          color: activity.color,
          type: activity.type,
          displayText: `${(contacts * activity.timePerContact / 60).toFixed(1)} hours/week`
        }
      })

    // Calculate money-intensive activities (texting, robocalls, digital ads) - these take money but no time
    const moneyIntensiveActivities = activities
      .filter(activity => activity.type === 'money-intensive')
      .map(activity => {
        const maxContactsByBudget = Math.floor(budgetForActivities / activity.costPerContact)
        const contacts = Math.min(maxContactsByBudget, voterContactsNeeded)
        
        return {
          name: activity.name,
          contacts: contacts,
          cost: contacts * activity.costPerContact,
          time: 0, // No time cost
          description: activity.description,
          color: activity.color,
          type: activity.type,
          displayText: `${contacts.toLocaleString()} contacts`
        }
      })

    setCampaignPlan([...basePlan, ...timeIntensiveActivities, ...moneyIntensiveActivities])
  }

  const totalCost = campaignPlan.reduce((sum, activity) => sum + activity.cost, 0)
  const totalContacts = campaignPlan.reduce((sum, activity) => sum + activity.contacts, 0)
  const totalTime = campaignPlan.reduce((sum, activity) => sum + activity.time, 0)

  return (
    <SimpleLayout>
      <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header with back button */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/path-to-victory')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Path to Victory
              </Button>
              
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Campaign Foundation
                </h1>
                <p className="text-lg text-gray-600">
                  Let's build the foundation of your campaign. Complete these tasks to get started.
                </p>
              </div>
            </div>

          {/* Sliders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Resources</CardTitle>
              <CardDescription>
                Set your available time and budget to see your campaign plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Campaign Budget</label>
                  <span className="text-sm text-gray-600">${budget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[budget]}
                  onValueChange={(value: number[]) => handleBudgetChange(value[0])}
                  max={maxBudget}
                  min={minBudget}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${minBudget.toLocaleString()}</span>
                  <span>${maxBudget.toLocaleString()}</span>
                </div>
              </div>

              {/* Time Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Hours Available Per Week</label>
                  <span className="text-sm text-gray-600">{timeAvailable} hours</span>
                </div>
                <Slider
                  value={[timeAvailable]}
                  onValueChange={(value: number[]) => handleTimeChange(value[0])}
                  max={40}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 hours</span>
                  <span>40 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voter Contacts Breakdown */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Voter Contacts Breakdown</CardTitle>
              <CardDescription>
                Based on your time and budget, here's how you'll reach voters. You can adjust this mix during your campaign as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaignPlan
                  .filter(activity => activity.contacts > 0)
                  .map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                        <span className="font-medium">{activity.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{activity.contacts.toLocaleString()} contacts</span>
                    </div>
                  ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> This is your starting plan. As your campaign progresses, you can adjust your strategy 
                  based on what's working best and what resources become available.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 pt-6">
            <Button 
              className="w-full md:w-auto"
              onClick={() => router.push(`/home`)}
            >
              Continue to Next Steps →
            </Button>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
} 