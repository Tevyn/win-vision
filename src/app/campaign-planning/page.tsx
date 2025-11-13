"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
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

interface CampaignPlanItem {
  name: string
  contacts: number
  cost: number
  time: number
  description: string
  color: string
  type: string
  campaignCount: number
  displayUnit: string
  displayText?: string
  isGreyedOut?: boolean
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
  const [campaignPlan, setCampaignPlan] = useState<CampaignPlanItem[]>([])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget, timeAvailable])

  const calculateCampaignPlan = () => {
    const weeklyTimeMinutes = timeAvailable * 60
    const budgetForActivities = budget - 15 - 10 // Subtract website cost ($15) and voter data cost ($10/mo)

    // Calculate social media posts based on time available (2-4 posts per week over 11 weeks)
    const socialPostsCount = Math.round((timeAvailable / 40) * 44 + 22) // Scale from 22-44 posts

    // Always include website, social posts, and voter data
    const basePlan = [
      {
        name: "Website",
        contacts: 0,
        cost: 15,
        time: 0.5, // one-time setup, minimal ongoing time
        description: "Professional campaign website",
        color: "bg-gray-500",
        type: "minimal",
        campaignCount: 1,
        displayUnit: "website"
      },
      {
        name: "Social Posts",
        contacts: 0,
        cost: 0,
        time: 2, // hours per week
        description: "Regular social media content",
        color: "bg-pink-500",
        type: "minimal",
        campaignCount: socialPostsCount,
        displayUnit: "posts"
      },
      {
        name: "Voter Data",
        contacts: 0,
        cost: 10, // per month
        time: 0, // no time required
        description: "Voter insights, segments & contact information",
        color: "bg-blue-500",
        type: "minimal",
        campaignCount: 1,
        displayUnit: "database"
      }
    ]

    // Calculate time-intensive activities (canvassing, events) - these take time but no money
    const timeIntensiveActivities = activities
      .filter(activity => activity.type === 'time-intensive')
      .map(activity => {
        const maxContactsByTime = Math.floor(weeklyTimeMinutes / activity.timePerContact)
        const contacts = Math.min(maxContactsByTime, voterContactsNeeded)
        
        // Calculate time based on activity type and intensity
        let timeHours = contacts * activity.timePerContact / 60
        if (activity.name === "Canvassing") {
          timeHours = Math.min(timeHours, 8) // Cap at 8h/week
        } else if (activity.name === "Events") {
          timeHours = Math.min(timeHours, 4) // Cap at 4h/week
        }
        
        // Calculate campaign counts
        let campaignCount = 0
        let displayUnit = ""
        
        if (activity.name === "Canvassing") {
          campaignCount = Math.max(1, Math.round(contacts / 250)) // 1 campaign = ~250 contacts
          displayUnit = campaignCount === 1 ? "campaign" : "campaigns"
        } else if (activity.name === "Events") {
          campaignCount = Math.max(1, Math.round(contacts / 30)) // 1 event = ~30 people
          displayUnit = campaignCount === 1 ? "event" : "events"
        }
        
        return {
          name: activity.name,
          contacts: contacts,
          cost: 0, // No money cost
          time: timeHours,
          description: activity.description,
          color: activity.color,
          type: activity.type,
          campaignCount: campaignCount,
          displayUnit: displayUnit,
          displayText: `${timeHours.toFixed(1)} hours/week`
        }
      })

    // Calculate money-intensive activities (texting, robocalls, digital ads) - these take money but minimal time
    // Grey out high-cost channels when budget is too low instead of hiding them
    const digitalAdsCost = voterContactsNeeded * 0.30 // $1,875 for 6,250 contacts
    const robocallsCost = voterContactsNeeded * 0.10 // $625 for 6,250 contacts
    const textingCost = voterContactsNeeded * 0.05 // $312.50 for 6,250 contacts
    
    const allMoneyIntensiveActivities = activities.filter(activity => activity.type === 'money-intensive')
    
    // Determine which activities should be greyed out based on budget
    const shouldGreyOutDigitalAds = budgetForActivities < digitalAdsCost + robocallsCost + textingCost
    const shouldGreyOutRobocalls = budgetForActivities < robocallsCost + textingCost
    const shouldGreyOutTexting = budgetForActivities < textingCost
    
    const moneyIntensiveActivities = allMoneyIntensiveActivities
      .map(activity => {
        // Check if this activity should be greyed out
        let isGreyedOut = false
        if (activity.name === "Digital Ads" && shouldGreyOutDigitalAds) {
          isGreyedOut = true
        } else if (activity.name === "Robocalls" && shouldGreyOutRobocalls) {
          isGreyedOut = true
        } else if (activity.name === "Texting" && shouldGreyOutTexting) {
          isGreyedOut = true
        }
        
        // If greyed out, set everything to 0
        if (isGreyedOut) {
          return {
            name: activity.name,
            contacts: 0,
            cost: 0,
            time: 0,
            description: activity.description,
            color: activity.color,
            type: activity.type,
            campaignCount: 0,
            displayUnit: "campaigns",
            displayText: "0 contacts",
            isGreyedOut: true
          }
        }
        
        // Otherwise, calculate normally
        const maxContactsByBudget = Math.floor(budgetForActivities / activity.costPerContact)
        const contacts = Math.min(maxContactsByBudget, voterContactsNeeded)
        
        // Calculate campaign counts
        let campaignCount = 0
        let displayUnit = ""
        
        if (activity.name === "Texting") {
          campaignCount = Math.max(1, Math.round(contacts / 750)) // 1 campaign = ~750 contacts
          displayUnit = campaignCount === 1 ? "campaign" : "campaigns"
        } else if (activity.name === "Robocalls") {
          campaignCount = Math.max(1, Math.round(contacts / 750)) // 1 campaign = ~750 contacts  
          displayUnit = campaignCount === 1 ? "campaign" : "campaigns"
        } else if (activity.name === "Digital Ads") {
          campaignCount = Math.max(1, Math.round(contacts / 300)) // 1 campaign = ~300 contacts
          displayUnit = campaignCount === 1 ? "campaign" : "campaigns"
        }
        
        return {
          name: activity.name,
          contacts: contacts,
          cost: contacts * activity.costPerContact,
          time: 0.5, // <1h/week for money-intensive activities
          description: activity.description,
          color: activity.color,
          type: activity.type,
          campaignCount: campaignCount,
          displayUnit: displayUnit,
          displayText: `${contacts.toLocaleString()} contacts`,
          isGreyedOut: false
        }
      })

    setCampaignPlan([...basePlan, ...timeIntensiveActivities, ...moneyIntensiveActivities])
  }

  const totalCost = campaignPlan.reduce((sum, activity) => sum + activity.cost, 0)
  const totalContacts = campaignPlan.reduce((sum, activity) => sum + activity.contacts, 0)
  const totalTime = campaignPlan.reduce((sum, activity) => sum + activity.time, 0)

  const handleDownloadPlan = () => {
    // Generate campaign plan outline text
    let planText = `CAMPAIGN PLAN OUTLINE\n`
    planText += `Generated: ${new Date().toLocaleDateString()}\n\n`
    planText += `RESOURCES:\n`
    planText += `Budget: $${budget.toLocaleString()}\n`
    planText += `Time Available: ${timeAvailable} hours/week\n\n`
    planText += `CAMPAIGN ACTIVITIES:\n\n`
    
    // Always include Voter Data, Website, and Social Posts
    planText += `Voter Data - $10/mo, 0h\n`
    planText += `• Voter contact database\n`
    planText += `• Ready-made voter segments\n`
    planText += `• Voting history and likelihood\n\n`
    
    planText += `Website - $15, <1hr\n`
    planText += `• Homepage with bio & platform\n`
    planText += `• Issues & policy positions\n`
    planText += `• Contact & volunteer forms\n\n`
    
    const socialPostsItem = campaignPlan.find(item => item.name === "Social Posts")
    planText += `Social Media Posts - $0, 2h/week\n`
    planText += `• ${socialPostsItem?.campaignCount || 33} posts total\n`
    planText += `• Campaign announcements\n`
    planText += `• Policy highlights\n`
    planText += `• Behind-the-scenes content\n`
    planText += `• Community engagement posts\n\n`
    
    // Add other activities
    campaignPlan
      .filter(activity => activity.contacts > 0 && activity.name !== "Website" && activity.name !== "Social Posts")
      .forEach(activity => {
        if (activity.name === "Texting") {
          const textingIntensity = activity.contacts
          let textTypes: string[] = []
          
          if (textingIntensity >= 400) {
            textTypes = ["Introduction Text", "Persuasion Text", "Early Voting Text", "GOTV Text"]
          } else if (textingIntensity >= 300) {
            textTypes = ["Introduction Text", "Persuasion Text", "GOTV Text"]
          } else if (textingIntensity >= 200) {
            textTypes = ["Introduction Text", "GOTV Text"]
          } else if (textingIntensity > 0) {
            textTypes = ["Introduction Text"]
          }
          
          planText += `Text Campaigns - $${Math.round(activity.cost)}, <1h/week\n`
          planText += `• ${activity.campaignCount} ${activity.displayUnit}\n`
          textTypes.forEach(textType => {
            planText += `• ${textType}\n`
          })
          planText += `\n`
        } else {
          planText += `${activity.name} - $${Math.round(activity.cost)}, ${
            activity.name === "Canvassing" ? "0-8h/week" :
            activity.name === "Events" ? "0-4h/week" :
            "<1h/week"
          }\n`
          planText += `• ${activity.campaignCount} ${activity.displayUnit}\n`
          
          if (activity.name === "Canvassing") {
            planText += `• Door-to-door conversations\n• Voter ID & persuasion\n• Vote commitment tracking\n`
          } else if (activity.name === "Events") {
            planText += `• Community meet & greets\n• Town halls & forums\n• House parties\n`
          } else if (activity.name === "Robocalls") {
            planText += `• Introduction messages\n• Policy announcements\n• Election reminders\n`
          } else if (activity.name === "Digital Ads") {
            planText += `• Facebook & Instagram ads\n• Google search ads\n• YouTube video ads\n`
          }
          planText += `\n`
        }
      })
    
    planText += `\nCONTENT GENERATION:\n`
    planText += `We'll automatically generate personalized content for every activity in your campaign plan based on your campaign identity and target audience. You can then review, edit, and approve the content we generate. Then pay for texts, robocalls, and digital ads on a campaign-by-campaign basis when you're ready to launch them.\n`

    planText += `\nTOTALS:\n`
    planText += `Total Voter Contacts: ${totalContacts.toLocaleString()}\n`
    planText += `Total Cost: $${totalCost.toLocaleString()}\n`
    planText += `Total Time: ${totalTime}h/week\n`
    
    // Create and download the file
    const blob = new Blob([planText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'campaign-plan-outline.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
                  Let&apos;s build the foundation of your campaign. Complete these tasks to get started.
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

          {/* Campaign Plan Outline */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campaign Plan Outline</CardTitle>
                  <CardDescription>
                    Based on your time and budget, here&apos;s your comprehensive campaign plan. You can adjust this mix during your campaign as needed.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadPlan}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Plan
                </Button>
              </div>
            </CardHeader>
            
            {/* Content Generation Notice */}
            <CardContent className="pt-0">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-semibold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">We&apos;ve got the first drafts covered for all your content</h3>
                    <p className="text-sm text-blue-800">
                      For every activity in your campaign plan, we&apos;ll automatically generate personalized content 
                      based on your campaign identity and target audience. You can then review, edit, and approve 
                      the content we generate. Then pay for texts, robocalls, and digital ads on a campaign-by-campaign 
                      basis when you&apos;re ready to launch them.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardHeader className="pt-0">
              <CardTitle className="sr-only">Campaign Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Always show Voter Data first */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">Voter Data</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      $10/mo • 0h
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Voter insights, segments & contact information</p>
                  <div className="text-xs text-gray-500">
                    <div>• Voter contact database</div>
                    <div>• Ready-made voter segments</div>
                    <div>• Voting history and likelihood</div>
                  </div>
                </div>

                {/* Always show Website */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="font-medium">Website</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      $15 • {'<1hr'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Professional campaign website</p>
                  <div className="text-xs text-gray-500">
                    <div>• Homepage with bio & platform</div>
                    <div>• Issues & policy positions</div>
                    <div>• Contact & volunteer forms</div>
                  </div>
                </div>

                {/* Always show Social Posts */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="font-medium">Social Media Posts</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      $0 • 2h/week
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{campaignPlan.find(item => item.name === "Social Posts")?.campaignCount || 33} posts</p>
                  <div className="text-xs text-gray-500">
                    <div>• Campaign announcements</div>
                    <div>• Policy highlights</div>
                    <div>• Behind-the-scenes content</div>
                    <div>• Community engagement posts</div>
                  </div>
                </div>

                {/* Show other activities based on campaign plan */}
                {campaignPlan
                  .filter(activity => activity.name !== "Website" && activity.name !== "Social Posts" && activity.name !== "Voter Data")
                  .map((activity, index) => {
                                         // Special handling for texting to show different text types
                     if (activity.name === "Texting") {
                       const textingIntensity = activity.contacts
                       let textTypes: string[] = []
                      
                      if (textingIntensity >= 400) {
                        textTypes = ["Introduction Text", "Persuasion Text", "Early Voting Text", "GOTV Text"]
                      } else if (textingIntensity >= 300) {
                        textTypes = ["Introduction Text", "Persuasion Text", "GOTV Text"]
                      } else if (textingIntensity >= 200) {
                        textTypes = ["Introduction Text", "GOTV Text"]
                      } else if (textingIntensity > 0) {
                        textTypes = ["Introduction Text"]
                      }
                      
                      // For greyed out texting, show empty state
                      if (activity.isGreyedOut) {
                        return (
                          <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-300 opacity-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span className="font-medium text-gray-500">Text Campaigns</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                $0 • 0h/week
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">0 campaigns</p>
                            <div className="text-xs text-gray-400">
                              <div>• Insufficient budget</div>
                            </div>
                          </div>
                        )
                      }
                      
                      if (textTypes.length === 0) return null
                      
                      return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                              <span className="font-medium">Text Campaigns</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              ${Math.round(activity.cost)} • {'<1h/week'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{activity.campaignCount} {activity.displayUnit}</p>
                          <div className="text-xs text-gray-500">
                            {textTypes.map((textType, idx) => (
                              <div key={idx}>• {textType}</div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    
                    // Handle other activities
                    const isGreyedOut = activity.isGreyedOut
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${
                        isGreyedOut 
                          ? 'bg-gray-100 border-gray-300 opacity-50' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              isGreyedOut ? 'bg-gray-400' : activity.color
                            }`}></div>
                            <span className={`font-medium ${
                              isGreyedOut ? 'text-gray-500' : 'text-gray-900'
                            }`}>{activity.name}</span>
                          </div>
                          <div className={`text-xs ${
                            isGreyedOut ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            ${Math.round(activity.cost)} • {
                              isGreyedOut ? '0h/week' :
                              activity.name === "Canvassing" ? "0-8h/week" :
                              activity.name === "Events" ? "0-4h/week" :
                              activity.time < 1 ? '<1h/week' : `${activity.time}h/week`
                            }
                          </div>
                        </div>
                        <p className={`text-sm mb-2 ${
                          isGreyedOut ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {isGreyedOut
                            ? "0 campaigns"
                            : activity.campaignCount && activity.displayUnit
                            ? `${activity.campaignCount} ${activity.displayUnit}`
                            : activity.displayText || activity.description
                          }
                        </p>
                        <div className={`text-xs ${
                          isGreyedOut ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {isGreyedOut ? (
                            <div>• Insufficient budget</div>
                          ) : (
                            <>
                              {activity.name === "Canvassing" && (
                                <>
                                  <div>• Door-to-door conversations</div>
                                  <div>• Voter ID & persuasion</div>
                                  <div>• Vote commitment tracking</div>
                                </>
                              )}
                              {activity.name === "Events" && (
                                <>
                                  <div>• Community meet & greets</div>
                                  <div>• Town halls & forums</div>
                                  <div>• House parties</div>
                                </>
                              )}
                              {activity.name === "Robocalls" && (
                                <>
                                  <div>• Introduction messages</div>
                                  <div>• Policy announcements</div>
                                  <div>• Election reminders</div>
                                </>
                              )}
                              {activity.name === "Digital Ads" && (
                                <>
                                  <div>• Facebook & Instagram ads</div>
                                  <div>• Google search ads</div>
                                  <div>• YouTube video ads</div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
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