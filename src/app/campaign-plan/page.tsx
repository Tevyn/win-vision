"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Calendar, Eye, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/ui/main-layout"

interface CampaignActivity {
  name: string
  contacts: number
  cost: number
  time: number
  description: string
  color: string
  type: string
  displayText?: string
  needsApproval?: boolean
  isApproved?: boolean
  scriptType?: string
}

interface WeeklyPlan {
  week: number
  startDate: string
  endDate: string
  activities: CampaignActivity[]
  totalContacts: number
  totalCost: number
  totalTime: number
  isCurrentWeek: boolean
}

export default function CampaignPlan() {
  const router = useRouter()
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load campaign plan data from localStorage or use mock data
    loadCampaignPlan()
  }, [])

  const loadCampaignPlan = () => {
    // Generate 8 weeks of campaign plan with varied activities
    const weeks: WeeklyPlan[] = []
    const campaignStartDate = new Date('2024-01-15') // Mock start date
    
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(campaignStartDate)
      weekStart.setDate(campaignStartDate.getDate() + (i * 7))
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      // Create varied activities per week
      const weekActivities: CampaignActivity[] = []
      
      // Website only in week 1
      if (i === 0) {
        weekActivities.push({
          name: "Website",
          contacts: 0,
          cost: 0,
          time: 8,
          description: "Professional campaign website",
          color: "bg-gray-500",
          type: "minimal",
          needsApproval: true,
          isApproved: true,
          scriptType: "website-content"
        })
      }
      
      // Social Posts - most weeks but not all
      if (i === 0 || i === 2 || i === 4 || i === 6 || i === 7) {
        weekActivities.push({
          name: "Social Posts",
          contacts: 0,
          cost: 50,
          time: 3,
          description: "Regular social media content",
          color: "bg-pink-500",
          type: "minimal",
          needsApproval: true,
          isApproved: Math.random() > 0.3, // Some approved, some not
          scriptType: "social-content"
        })
      }
      
      // Canvassing - most weeks with varying intensity
      if (i === 1 || i === 2 || i === 3 || i === 5 || i === 6 || i === 7) {
        const intensity = i >= 5 ? 1.5 : 1 // Increase in final weeks
        weekActivities.push({
          name: "Canvassing",
          contacts: Math.round(200 * intensity),
          cost: 0,
          time: Math.round(15 * intensity),
          description: "Door-to-door visits with volunteers",
          color: "bg-purple-500",
          type: "time-intensive",
          needsApproval: true,
          isApproved: i <= 2, // First few weeks approved, later weeks need approval
          scriptType: "canvassing-script"
        })
      }
      
      // Events - scattered throughout
      if (i === 1 || i === 3 || i === 5 || i === 7) {
        weekActivities.push({
          name: "Events",
          contacts: 25,
          cost: 100,
          time: 8,
          description: "Community events and meet & greets",
          color: "bg-orange-500",
          type: "time-intensive",
          needsApproval: true,
          isApproved: i <= 3, // Earlier events approved
          scriptType: "event-materials"
        })
      }
      
      // Texting - only 4 times across all 8 weeks
      if (i === 2 || i === 4 || i === 6 || i === 7) {
        const isLargeText = i >= 6 // Larger texts in final weeks
        weekActivities.push({
          name: "Texting",
          contacts: isLargeText ? 2500 : 1500,
          cost: isLargeText ? 125 : 75,
          time: 1,
          description: "Personalized text messages to voters",
          color: "bg-green-500",
          type: "money-intensive",
          needsApproval: true,
          isApproved: i <= 4, // First two text campaigns approved
          scriptType: "text-script"
        })
      }
      
      // Robocalls - only 2 times across all 8 weeks
      if (i === 3 || i === 6) {
        weekActivities.push({
          name: "Robocalls",
          contacts: 1000,
          cost: 100,
          time: 1,
          description: "Automated phone calls with your message",
          color: "bg-blue-500",
          type: "money-intensive",
          needsApproval: true,
          isApproved: i === 3, // First robocall approved, second needs approval
          scriptType: "robocall-script"
        })
      }
      
      // Digital Ads - middle to end of campaign
      if (i >= 3 && i <= 7) {
        const intensity = i >= 6 ? 1.5 : 1 // Increase in final weeks
        weekActivities.push({
          name: "Digital Ads",
          contacts: Math.round(800 * intensity),
          cost: Math.round(200 * intensity),
          time: 2,
          description: "Online advertising and social media ads",
          color: "bg-red-500",
          type: "money-intensive",
          needsApproval: true,
          isApproved: i <= 5, // First few weeks approved
          scriptType: "digital-ad-copy"
        })
      }
      
      weeks.push({
        week: i + 1,
        startDate: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activities: weekActivities,
        totalContacts: weekActivities.reduce((sum, a) => sum + a.contacts, 0),
        totalCost: weekActivities.reduce((sum, a) => sum + a.cost, 0),
        totalTime: weekActivities.reduce((sum, a) => sum + a.time, 0),
        isCurrentWeek: i === 1 // Week 2 is current week
      })
    }
    
    setWeeklyPlans(weeks)
    setIsLoading(false)
  }

  const handleAddOutreach = () => {
    // Navigate to add outreach functionality
    router.push('/campaign-planning/add-outreach')
  }

  const handleAdjustPlan = () => {
    // Navigate back to campaign planning to adjust
    router.push('/campaign-planning')
  }

  const handleViewScript = (activity: CampaignActivity, week: number) => {
    // Navigate to script approval page
    router.push(`/campaign-plan/script-approval?type=${activity.scriptType}&week=${week}&activity=${activity.name}`)
  }

  if (isLoading) {
    return (
      <MainLayout currentPage="campaign-plan">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Loading campaign plan...</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="campaign-plan">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Campaign Plan
                </h1>
                <p className="text-lg text-gray-600">
                  Your campaign schedule with activities and milestones
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddOutreach}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Outreach
                </Button>
                <Button 
                  onClick={handleAdjustPlan}
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Adjust Campaign Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Weekly Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyPlans.map((week) => (
              <Card 
                key={week.week} 
                className={`${
                  week.isCurrentWeek 
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                    : 'hover:shadow-lg transition-shadow'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Week {week.week}
                      {week.isCurrentWeek && (
                        <Badge className="ml-2 bg-blue-600 text-white">Current</Badge>
                      )}
                    </CardTitle>
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <CardDescription className="text-sm">
                    {week.startDate} - {week.endDate}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Activities */}
                  <div className="space-y-2">
                    {week.activities
                      .filter(activity => activity.contacts > 0 || activity.cost > 0 || activity.time > 0)
                      .map((activity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${activity.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {activity.name}
                              </div>
                              {activity.needsApproval && (
                                <div className="flex items-center gap-1">
                                  {activity.isApproved ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <AlertCircle className="w-3 h-3 text-orange-500" />
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewScript(activity, week.week)}
                                    className="h-5 px-1 py-0 text-xs hover:bg-gray-100"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {activity.isApproved ? 'View' : 'Approve'}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {activity.contacts > 0 && `${activity.contacts.toLocaleString()} contacts`}
                              {activity.cost > 0 && ` • $${activity.cost}`}
                              {activity.time > 0 && ` • ${activity.time}h`}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 