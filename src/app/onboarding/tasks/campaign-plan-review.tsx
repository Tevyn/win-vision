"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, AlertCircle, ExternalLink, Users, DollarSign, Clock } from "lucide-react"

interface CampaignActivity {
  name: string
  contacts: number
  cost: number
  time: number
  description: string
  color: string
  type: string
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

interface CampaignPlanReviewProps {
  onComplete: (data?: unknown) => void
  isCompleted: boolean
}

export default function CampaignPlanReview({ onComplete, isCompleted }: CampaignPlanReviewProps) {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCampaignPlan()
  }, [])

  const loadCampaignPlan = () => {
    // Generate the same 11-week campaign plan data as the main campaign-plan page
    const weeks: WeeklyPlan[] = []
    const campaignStartDate = new Date('2024-01-15')
    
    for (let i = 0; i < 11; i++) {
      const weekStart = new Date(campaignStartDate)
      weekStart.setDate(campaignStartDate.getDate() + (i * 7))
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
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

  const totalCampaignStats = weeklyPlans.reduce((totals, week) => ({
    contacts: totals.contacts + week.totalContacts,
    cost: totals.cost + week.totalCost,
    time: totals.time + week.totalTime
  }), { contacts: 0, cost: 0, time: 0 })

  const totalActivitiesNeedingApproval = weeklyPlans
    .flatMap(week => week.activities)
    .filter(activity => activity.needsApproval && !activity.isApproved).length

  const handleViewFullPlan = () => {
    window.open('/campaign-plan', '_blank')
  }

  const handleCompleteReview = () => {
    onComplete({
      reviewedAt: new Date().toISOString(),
      totalActivities: weeklyPlans.flatMap(week => week.activities).length,
      activitiesNeedingApproval: totalActivitiesNeedingApproval
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading your campaign plan...</div>
  }

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{totalCampaignStats.contacts.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Voter Contacts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">${totalCampaignStats.cost.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Campaign Cost</div>
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
                <div className="text-xs text-gray-500">Hours Per Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Content Approval Required
          </CardTitle>
          <CardDescription>
            {totalActivitiesNeedingApproval} activities need your review and approval before launch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            All campaign content (scripts, ads, social posts, etc.) is generated based on your campaign identity. 
            Your website content is already approved and ready to go! You&apos;ll need to review and approve each remaining piece of content before it goes live.
          </div>
          <Button 
            onClick={handleViewFullPlan}
            variant="outline" 
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Campaign Plan & Approve Content
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Overview - Show first 6 weeks */}
      <Card>
        <CardHeader>
          <CardTitle>11-Week Campaign Overview</CardTitle>
          <CardDescription>First 6 weeks of your campaign schedule (preview)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyPlans.slice(0, 6).map((week) => (
              <Card key={week.week} className={`${week.isCurrentWeek ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-500`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Week {week.week}
                        {week.isCurrentWeek && (
                          <Badge className="bg-blue-600 text-white text-xs">Current</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {week.startDate} - {week.endDate}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {week.totalContacts.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${week.totalCost}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {week.totalTime}h
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {week.activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                        <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {activity.name}
                            </div>
                            {activity.needsApproval && !activity.isApproved && (
                              <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                            )}
                            {activity.needsApproval && activity.isApproved && (
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {activity.targetAudience}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.contacts > 0 && `${activity.contacts.toLocaleString()} contacts`}
                            {activity.cost > 0 && ` • $${activity.cost}`}
                          </div>
                          {activity.script && (
                            <div className="text-xs text-gray-400 truncate mt-1">
                              &quot;{activity.script.substring(0, 50)}...&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button onClick={handleViewFullPlan} variant="outline">
              View All 11 Weeks & Approve Content
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complete Review Button */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center text-sm text-gray-600">
          Your personalized 11-week campaign plan is ready! Review the activities, approve the content, 
          and your campaign will be fully set up with targeted outreach to reach your vote goal.
        </div>
        
        <Button 
          onClick={handleCompleteReview}
          disabled={isCompleted}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isCompleted ? 'Review Complete' : 'Complete Campaign Plan Review'}
        </Button>
      </div>
    </div>
  )
} 