"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Users, Target, CheckCircle } from "lucide-react"

interface VoterSegment {
  id: string
  name: string
  description: string
  estimatedVoters: number
  characteristics: string[]
  keyIssues: string[]
  outreachStrategy: string
  category: 'first-time' | 'unlikely' | 'likely'
}

const WIN_NUMBER = 1250
const TARGET_VOTERS = Math.ceil(WIN_NUMBER * 1.5) // 150% of win number = 1,875

const voterSegments: VoterSegment[] = [
  {
    id: "young-professionals",
    name: "Young Professionals (25-40)",
    description: "College-educated professionals focused on career growth and economic opportunity",
    estimatedVoters: 850,
    characteristics: ["College degree", "Full-time employment", "Urban/suburban", "Active on social media"],
    keyIssues: ["Economic development", "Infrastructure", "Education funding", "Transportation"],
    outreachStrategy: "Social media, professional networks, evening events",
    category: 'first-time'
  },
  {
    id: "first-time-homeowners",
    name: "First-Time Homeowners (28-45)",
    description: "Recent homebuyers invested in neighborhood improvement and property values",
    estimatedVoters: 640,
    characteristics: ["Recent homebuyers", "Neighborhood-focused", "Property-conscious", "Civic-minded"],
    keyIssues: ["Property values", "Neighborhood development", "Local services", "Community planning"],
    outreachStrategy: "Neighborhood associations, local forums, targeted digital ads",
    category: 'unlikely'
  },
  {
    id: "working-families",
    name: "Working Families (30-55)",
    description: "Families with school-age children focused on community services and safety",
    estimatedVoters: 720,
    characteristics: ["Homeowners", "School-age children", "Middle income", "Community-involved"],
    keyIssues: ["Education quality", "Public safety", "Parks & recreation", "Property taxes"],
    outreachStrategy: "School events, door-to-door canvassing, local meetings",
    category: 'likely'
  },
  {
    id: "senior-voters",
    name: "Senior Voters (65+)",
    description: "Established residents concerned with community stability and services",
    estimatedVoters: 920,
    characteristics: ["Long-term residents", "Fixed income", "High voting frequency", "Community-focused"],
    keyIssues: ["Healthcare access", "Senior services", "Public transportation", "Community safety"],
    outreachStrategy: "Community centers, direct mail, phone outreach",
    category: 'likely'
  },
  {
    id: "small-business-owners",
    name: "Small Business Owners",
    description: "Local entrepreneurs and business owners focused on economic growth",
    estimatedVoters: 380,
    characteristics: ["Business ownership", "Economic stakeholders", "Community investors", "Network-connected"],
    keyIssues: ["Business development", "Regulatory environment", "Economic incentives", "Infrastructure"],
    outreachStrategy: "Business associations, chamber events, professional meetups",
    category: 'likely'
  }
]

const categoryInfo = {
  'first-time': {
    title: 'First Time Voters',
    description: 'Newer voters who may need more engagement and education about the electoral process',
    color: 'border-blue-200 bg-blue-50'
  },
  'unlikely': {
    title: 'Unlikely to Vote',
    description: 'Lower propensity voters who need motivation and multiple touchpoints',
    color: 'border-yellow-200 bg-yellow-50'
  },
  'likely': {
    title: 'Likely to Vote',
    description: 'High propensity voters with established voting patterns and civic engagement',
    color: 'border-green-200 bg-green-50'
  }
}

interface VoterSegmentsTaskProps {
  onComplete: (data?: any) => void
  isCompleted: boolean
}

export default function VoterSegmentsTask({ onComplete, isCompleted }: VoterSegmentsTaskProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])

  const handleSegmentToggle = (segmentId: string) => {
    if (isCompleted) return
    
    setSelectedSegments(prev => 
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    )
  }

  const selectedSegmentData = voterSegments.filter(segment => 
    selectedSegments.includes(segment.id)
  )

  const totalSelectedVoters = selectedSegmentData.reduce((sum, segment) => 
    sum + segment.estimatedVoters, 0
  )

  const targetReached = totalSelectedVoters >= TARGET_VOTERS
  const canComplete = targetReached && !isCompleted

  const handleComplete = () => {
    if (canComplete) {
      onComplete({
        selectedSegments: selectedSegmentData,
        totalVoters: totalSelectedVoters,
        targetVoters: TARGET_VOTERS
      })
    }
  }

  // Group segments by category
  const segmentsByCategory = {
    'first-time': voterSegments.filter(s => s.category === 'first-time'),
    'unlikely': voterSegments.filter(s => s.category === 'unlikely'),
    'likely': voterSegments.filter(s => s.category === 'likely')
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            Personalized Content for Your Voter Segments
          </CardTitle>
          <CardDescription className="text-blue-700">
            We'll use these segments to personalize all of your campaign content in conjunction with your campaign identity. 
            This includes your <strong>website content, social media posts, email campaigns, text messages, direct mail pieces, 
            door-to-door scripts, talking points, event invitations, and policy messaging</strong>.
            <br /><br />
            You need to reach <strong>{TARGET_VOTERS.toLocaleString()} voters</strong> (150% of your win number of {WIN_NUMBER.toLocaleString()}) 
            because you won't get everyone in your target segments to vote for you. We're building in leeway to account for 
            voter turnout, persuasion rates, and campaign effectiveness to ensure you have a strong path to victory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {totalSelectedVoters.toLocaleString()} / {TARGET_VOTERS.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Voters in selected segments</div>
            </div>
            <div className="text-right">
              {targetReached ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Target Reached!
                </div>
              ) : (
                <div className="text-gray-500">
                  {(TARGET_VOTERS - totalSelectedVoters).toLocaleString()} more needed
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voter Segments by Category */}
      {(['likely', 'unlikely', 'first-time'] as Array<keyof typeof segmentsByCategory>).map((category) => (
        <div key={category} className="space-y-4">
          {/* Category Header */}
          <Card className={categoryInfo[category].color}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{categoryInfo[category].title}</CardTitle>
              <CardDescription>{categoryInfo[category].description}</CardDescription>
            </CardHeader>
          </Card>

                     {/* Segments in this category */}
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {segmentsByCategory[category].map((segment) => {
               const isSelected = selectedSegments.includes(segment.id)
               
               return (
                 <Card 
                   key={segment.id}
                   className={`cursor-pointer transition-all hover:shadow-md ${
                     isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'hover:bg-gray-50'
                   } ${isCompleted ? 'opacity-75 cursor-not-allowed' : ''}`}
                   onClick={() => handleSegmentToggle(segment.id)}
                 >
                   <CardContent className="p-6">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex items-start gap-3">
                         <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                           isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                         } ${isCompleted ? 'opacity-50' : ''}`}>
                           {isSelected && <Check className="w-3 h-3 text-white" />}
                         </div>
                         <div className="flex-1">
                           <h3 className={`font-semibold text-lg ${
                             isSelected ? 'text-blue-800' : 'text-gray-900'
                           }`}>
                             {segment.name}
                           </h3>
                           <p className={`text-sm mt-1 ${
                             isSelected ? 'text-blue-700' : 'text-gray-600'
                           }`}>
                             {segment.description}
                           </p>
                         </div>
                       </div>
                     </div>

                     <div className="text-center mb-4">
                       <div className={`text-2xl font-bold ${
                         isSelected ? 'text-blue-600' : 'text-gray-700'
                       }`}>
                         {segment.estimatedVoters.toLocaleString()}
                       </div>
                       <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                         <Users className="w-3 h-3" />
                         voters
                       </div>
                     </div>

                     <div className="text-sm">
                       <div className="font-medium text-gray-700 mb-2">Characteristics</div>
                       <div className="space-y-1">
                         {segment.characteristics.map((char, index) => (
                           <div key={index} className="text-gray-600">• {char}</div>
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               )
             })}
          </div>
        </div>
      ))}

      {/* Summary */}
      {selectedSegments.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Selected Segments Summary</CardTitle>
            <CardDescription className="text-green-700">
              {selectedSegmentData.length} segment{selectedSegmentData.length !== 1 ? 's' : ''} selected • {totalSelectedVoters.toLocaleString()} total voters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedSegmentData.map((segment) => (
                <div key={segment.id} className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">{segment.name}</span>
                  <span className="text-green-700">{segment.estimatedVoters.toLocaleString()} voters</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleComplete}
          disabled={!canComplete}
          size="lg"
          className={canComplete ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isCompleted 
            ? "✓ Completed" 
            : targetReached 
            ? "Complete Voter Segments Selection"
            : `Need ${(TARGET_VOTERS - totalSelectedVoters).toLocaleString()} More Voters`
          }
        </Button>
      </div>
    </div>
  )
} 