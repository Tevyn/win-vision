"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Calendar, Eye, CheckCircle, AlertCircle, Users, DollarSign, Clock, X } from "lucide-react"
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
  script?: string
  targetAudience?: string
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
  const [reviewingScript, setReviewingScript] = useState<{weekIndex: number, activityIndex: number} | null>(null)

  useEffect(() => {
    // Load campaign plan data from localStorage or use mock data
    loadCampaignPlan()
  }, [])

  const loadCampaignPlan = () => {
    // Generate 11 weeks of campaign plan with varied activities
    const weeks: WeeklyPlan[] = []
    const campaignStartDate = new Date('2024-01-15') // Mock start date
    
    for (let i = 0; i < 11; i++) {
      const weekStart = new Date(campaignStartDate)
      weekStart.setDate(campaignStartDate.getDate() + (i * 7))
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      // Create varied activities per week
      const weekActivities: CampaignActivity[] = []
      
      // Website only in week 1
      if (i === 0) {
        weekActivities.push({
          name: "Website Launch",
          contacts: 0,
          cost: 0,
          time: 1,
          description: "Professional campaign website",
          color: "bg-gray-500",
          type: "minimal",
          needsApproval: true,
          isApproved: true,
          scriptType: "website-content",
          script: "Welcome to [Candidate Name]'s campaign! I'm running for [Office] because our community deserves [key message]. Together, we can [vision statement]. Join me in building a better future for [community].",
          targetAudience: "General Public"
        })
      }
      
      // Social Posts - regular throughout campaign
      if (i === 0 || i === 2 || i === 4 || i === 6 || i === 8 || i === 10) {
        weekActivities.push({
          name: "Social Media Posts",
          contacts: 150,
          cost: 0,
          time: 0,
          description: "Engaging social media content",
          color: "bg-pink-500",
          type: "minimal",
          needsApproval: true,
          isApproved: false,
          scriptType: "social-content",
          script: "This week I was reminded why I'm running for [Office]. [Personal story/experience]. When elected, I'll fight to [specific policy]. #[YourName]For[Office] #[Community]",
          targetAudience: "Social Media Followers"
        })
      }
      
      // Canvassing - most weeks with increasing intensity
      if (i === 1 || i === 2 || i === 3 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9 || i === 10) {
        const intensity = i >= 8 ? 1.1 : 1 // Slight increase in final weeks
        weekActivities.push({
          name: "Door-to-Door Canvassing",
          contacts: Math.round(120 * intensity),
          cost: 0,
          time: 9,
          description: "Personal voter outreach",
          color: "bg-purple-500",
          type: "time-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "canvassing-script",
          script: `Hi, I'm [Your Name] and I'm running for [Office]. I wanted to personally meet you and hear about the issues that matter most to you. [Listen to response]. I share your concerns about [issue]. When elected, I plan to [specific action]. Can I count on your vote on [Election Day]?`,
          targetAudience: "Likely Voters in Target Precincts"
        })
      }
      
      // Events - scattered throughout
      if (i === 1 || i === 3 || i === 5 || i === 7 || i === 9) {
        weekActivities.push({
          name: "Community Events",
          contacts: 20,
          cost: 25,
          time: 0,
          description: "Meet & greets and town halls",
          color: "bg-orange-500",
          type: "time-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "event-materials",
          script: "Thank you all for coming tonight. I'm [Your Name], running for [Office] because I believe [community] deserves [vision]. Tonight, I want to hear from you about [key issues]. Together, we can [call to action].",
          targetAudience: "Community Members"
        })
      }
      
      // Texting - strategic timing
      if (i === 2 || i === 4 || i === 6 || i === 8 || i === 10) {
        const isGOTV = i >= 8
        const contacts = isGOTV ? 500 : 400
        weekActivities.push({
          name: isGOTV ? "GOTV Text Campaign" : "Voter ID Text Campaign",
          contacts: contacts,
          cost: Math.round(contacts * 0.06),
          time: 0,
          description: isGOTV ? "Get out the vote messaging" : "Voter identification and persuasion",
          color: "bg-green-500",
          type: "money-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "text-script",
          script: isGOTV ? 
            `Hi [FirstName], this is [YourName] running for [Office]. Election Day is [Date]! Your vote matters. Find your polling location: [link]. Thank you for your support!` :
            `Hi [FirstName], I'm [YourName] running for [Office]. I'm fighting for [key issue] that affects our community. Can I count on your support? Learn more: [website]`,
          targetAudience: isGOTV ? "Confirmed Supporters" : "Persuadable Voters"
        })
      }
      
      // Robocalls - key moments
      if (i === 3 || i === 6 || i === 9) {
        const isGOTV = i === 9
        weekActivities.push({
          name: isGOTV ? "GOTV Robocall" : "Introduction Robocall",
          contacts: 300,
          cost: 25,
          time: 0,
          description: isGOTV ? "Election day reminder call" : "Introductory message to voters",
          color: "bg-blue-500",
          type: "money-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "robocall-script",
          script: isGOTV ?
            `This is [YourName]. Tomorrow is Election Day! Your vote is crucial for [community]. Polls are open from [time] to [time]. Find your location at [website]. Thank you!` :
            `Hi, this is [YourName]. I'm running for [Office] to [key message]. I have [experience/qualification]. I'd appreciate your vote on [Election Day]. Learn more at [website].`,
          targetAudience: isGOTV ? "Confirmed Supporters" : "All Registered Voters"
        })
      }
      
      // Digital Ads - sustained through most of campaign
      if (i >= 3 && i <= 10) {
        const intensity = i >= 8 ? 1.2 : 1 // Slight increase in final weeks
        weekActivities.push({
          name: "Digital Advertising",
          contacts: Math.round(200 * intensity),
          cost: Math.round(30 * intensity),
          time: 0,
          description: "Online and social media ads",
          color: "bg-red-500",
          type: "money-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "digital-ad-copy",
          script: `[Your Name] for [Office]. [Community] needs leadership that [key message]. With [background/experience], I'll fight for [policy priorities]. Vote [Your Name] on [Election Day].`,
          targetAudience: "Target Demographics Online"
        })
      }
      
      // Phone Banking - final push
      if (i >= 7 && i <= 10) {
        const intensity = i >= 9 ? 1.1 : 1
        weekActivities.push({
          name: "Phone Banking",
          contacts: Math.round(80 * intensity),
          cost: 0,
          time: 0,
          description: "Volunteer phone calls to voters",
          color: "bg-indigo-500",
          type: "time-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "phone-script",
          script: `Hi, may I speak with [VoterName]? This is [VolunteerName] calling on behalf of [CandidateName] who's running for [Office]. [CandidateName] is committed to [key issue]. Can we count on your support?`,
          targetAudience: "Likely Voters"
        })
      }
      
      // Literature Drops - strategic placement
      if (i === 5 || i === 7 || i === 9) {
        weekActivities.push({
          name: "Literature Drop",
          contacts: 150,
          cost: 20,
          time: 0,
          description: "Door-to-door literature distribution",
          color: "bg-yellow-600",
          type: "time-intensive",
          needsApproval: true,
          isApproved: false,
          scriptType: "literature-content",
          script: `[Front] [Your Name] for [Office] - [Key Message]. [Back] My Plan: • [Policy 1] • [Policy 2] • [Policy 3]. Endorsed by [endorsements]. Vote [Election Date].`,
          targetAudience: "High-Turnout Precincts"
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
        isCurrentWeek: i === 0 // Week 1 is current week
      })
    }
    
    setWeeklyPlans(weeks)
    setIsLoading(false)
  }

  const handleAddOutreach = () => {
    router.push('/campaign-planning/add-outreach')
  }

  const handleAdjustPlan = () => {
    router.push('/campaign-planning')
  }

  const handleReviewScript = (weekIndex: number, activityIndex: number) => {
    setReviewingScript({ weekIndex, activityIndex })
  }

  const handleApproveFromReview = (weekIndex: number, activityIndex: number) => {
    setWeeklyPlans(prevWeeks => 
      prevWeeks.map((week, wIndex) => 
        wIndex === weekIndex 
          ? {
              ...week,
              activities: week.activities.map((activity, aIndex) => 
                aIndex === activityIndex 
                  ? { ...activity, isApproved: true }
                  : activity
              )
            }
          : week
      )
    )
    setReviewingScript(null)
  }

  const handleCloseReview = () => {
    setReviewingScript(null)
  }

  const handleViewScript = (activity: CampaignActivity, week: number) => {
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

  const totalStats = weeklyPlans.reduce((totals, week) => ({
    contacts: totals.contacts + week.totalContacts,
    cost: totals.cost + week.totalCost,
    time: totals.time + week.totalTime
  }), { contacts: 0, cost: 0, time: 0 })

  return (
    <MainLayout currentPage="campaign-plan">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  11-Week Campaign Plan
                </h1>
                <p className="text-lg text-gray-600">
                  Your comprehensive campaign schedule with targeted outreach activities
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

          {/* Campaign Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{totalStats.contacts.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Voter Contacts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalStats.cost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Campaign Cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">1-9h</div>
                    <div className="text-sm text-gray-500">Hours Per Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Plan - Full Width Rows */}
          <div className="space-y-6">
            {weeklyPlans.map((week, weekIndex) => (
              <Card 
                key={week.week} 
                className={`${
                  week.isCurrentWeek 
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                    : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Week {week.week}
                          {week.isCurrentWeek && (
                            <Badge className="bg-blue-600 text-white">Current Week</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {week.startDate} - {week.endDate}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {week.totalContacts.toLocaleString()} contacts
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${week.totalCost}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {week.totalTime}h
                        </div>
                      </div>
                    </div>
                    
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                
                {week.activities.length > 0 && (
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {week.activities.map((activity, activityIndex) => (
                        <Card key={activityIndex} className="border-l-4" style={{ borderLeftColor: activity.color.replace('bg-', '') }}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${activity.color}`} />
                                {activity.name}
                              </CardTitle>
                              {activity.needsApproval && (
                                <div className="flex items-center gap-2">
                                  {activity.isApproved ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Approved
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-orange-200 text-orange-600">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Needs Approval
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="space-y-3">
                              {/* Target Audience */}
                              <div>
                                <div className="text-sm font-medium text-gray-700">Target Audience</div>
                                <div className="text-sm text-gray-600">{activity.targetAudience}</div>
                                {activity.contacts > 0 && (
                                  <div className="text-sm font-medium text-blue-600">
                                    {activity.contacts.toLocaleString()} people
                                  </div>
                                )}
                              </div>
                              
                              {/* Script Preview */}
                              {activity.script && (
                                <div>
                                  <div className="text-sm font-medium text-gray-700">Script Preview</div>
                                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border line-clamp-3">
                                    {activity.script}
                                  </div>
                                </div>
                              )}
                              
                              {/* Activity Stats */}
                              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                                <span>Cost: ${activity.cost}</span>
                                <span>Time: {activity.time}h</span>
                              </div>
                              
                              {/* Approve Button */}
                              {activity.needsApproval && !activity.isApproved && (
                                <Button 
                                  onClick={() => handleReviewScript(weekIndex, activityIndex)}
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Review Script
                                </Button>
                              )}
                              
                              {activity.isApproved && (
                                <Button 
                                  onClick={() => handleViewScript(activity, week.week)}
                                  variant="outline"
                                  className="w-full"
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Full Script
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Script Review Modal */}
          {reviewingScript && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      Review Script: {weeklyPlans[reviewingScript.weekIndex]?.activities[reviewingScript.activityIndex]?.name}
                    </h2>
                    <Button variant="ghost" onClick={handleCloseReview}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Target Audience</h3>
                      <p className="text-gray-600">
                        {weeklyPlans[reviewingScript.weekIndex]?.activities[reviewingScript.activityIndex]?.targetAudience}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {weeklyPlans[reviewingScript.weekIndex]?.activities[reviewingScript.activityIndex]?.contacts.toLocaleString()} people
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Full Script</h3>
                      <div className="bg-gray-50 p-4 rounded border">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {weeklyPlans[reviewingScript.weekIndex]?.activities[reviewingScript.activityIndex]?.script}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">How this works:</h4>
                      <p className="text-sm text-blue-700">
                        This script is automatically personalized based on your campaign identity. 
                        Placeholders like [Your Name] and [Office] will be filled in with your specific information when the content goes live.
                      </p>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={() => handleApproveFromReview(reviewingScript.weekIndex, reviewingScript.activityIndex)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve & Ready to Launch
                      </Button>
                      <Button 
                        onClick={handleCloseReview}
                        variant="outline"
                        className="flex-1"
                      >
                        Review Later
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
} 