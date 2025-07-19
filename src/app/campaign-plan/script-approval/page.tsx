"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Edit, FileText } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/ui/main-layout"

interface ScriptContent {
  type: string
  title: string
  description: string
  content: string
  tips: string[]
}

const scriptTemplates: Record<string, ScriptContent> = {
  "canvassing-script": {
    type: "Canvassing Script",
    title: "Door-to-Door Canvassing Script",
    description: "Script for volunteers to use when talking to voters at their doors",
    content: `Hi, I'm [Name] and I'm volunteering for [Your Name]'s campaign for [Office].

We're reaching out to voters in the neighborhood to talk about the upcoming election. [Your Name] is running because [brief why statement].

The key issues [Your Name] is focused on are:
• [Issue 1 - with brief solution]
• [Issue 2 - with brief solution]
• [Issue 3 - with brief solution]

Can we count on your support in the upcoming election?

[If Yes]: That's great! Is there anything specific you'd like to know about [Your Name]'s positions?

[If Undecided]: I understand. What issues are most important to you? [Listen and connect to platform]

[If No]: I respect that. Thank you for your time, and I hope you'll still make sure to vote.

Thank you for your time, and have a great day!`,
    tips: [
      "Keep conversations brief (2-3 minutes max)",
      "Be friendly and respectful, even if they disagree",
      "Listen more than you talk",
      "Don't argue - just present information",
      "Always thank them for their time"
    ]
  },
  "text-script": {
    type: "Text Message",
    title: "Voter Text Message Template",
    description: "Template for text messages sent to voters",
    content: `Hi [First Name], this is [Your Name] running for [Office]. I'm reaching out because [brief why statement].

I'm focused on [key issue] and [key issue]. You can learn more about my platform at [website].

Can I count on your vote? Reply YES if you're supporting me, or STOP to opt out.

Thank you!
[Your Name]`,
    tips: [
      "Keep messages under 160 characters when possible",
      "Always include opt-out option",
      "Personalize with voter's first name",
      "Include clear call to action",
      "Test messages before sending to large groups"
    ]
  },
  "robocall-script": {
    type: "Robocall Script",
    title: "Automated Phone Call Script",
    description: "Script for automated phone calls to voters",
    content: `Hi, this is [Your Name], and I'm calling to ask for your vote for [Office].

I'm running because [brief why statement]. Our community needs someone who will fight for [key issue] and [key issue].

If elected, I will [specific commitment 1] and [specific commitment 2].

Early voting starts [date] and election day is [date]. Please make sure to vote.

To learn more about my campaign, visit [website].

Thank you, and I hope I can count on your support.

This message was paid for by [Your Name] for [Office].`,
    tips: [
      "Keep message under 30 seconds",
      "Speak clearly and at moderate pace",
      "Include required disclaimer",
      "Test recording quality before sending",
      "Time calls for appropriate hours"
    ]
  },
  "digital-ad-copy": {
    type: "Digital Ad Copy",
    title: "Online Advertising Content",
    description: "Content for social media and digital advertisements",
    content: `[Headline]: [Your Name] for [Office] - Real Change for Our Community

[Body Copy]: 
Our community deserves better. That's why I'm running for [Office].

✓ [Key Issue 1] - [Brief solution]
✓ [Key Issue 2] - [Brief solution]  
✓ [Key Issue 3] - [Brief solution]

I'm not a politician - I'm a [your background] who believes in [core value].

Learn more about my vision at [website]

[Call to Action]: Vote [Your Name] for [Office]

[Disclaimer]: Paid for by [Your Name] for [Office]`,
    tips: [
      "Use eye-catching headlines",
      "Keep paragraphs short and scannable",
      "Include clear call-to-action",
      "Test different versions to see what works",
      "Ensure images and text work together"
    ]
  },
  "event-materials": {
    type: "Event Materials",
    title: "Campaign Event Materials",
    description: "Materials and talking points for campaign events",
    content: `[Event Welcome/Introduction]
Thank you all for coming out today. I'm [Your Name], and I'm running for [Office] because [why statement].

[Key Talking Points]
• [Issue 1]: [Current problem] → [Your solution]
• [Issue 2]: [Current problem] → [Your solution]
• [Issue 3]: [Current problem] → [Your solution]

[Personal Connection]
[Share brief personal story that connects to community]

[Call to Action]
I need your help to win this election. Here's how you can get involved:
• Vote for me on [election date]
• Tell your friends and neighbors about my campaign
• Volunteer with us - we need people to [specific tasks]
• Follow us on [social media platforms]

[Contact Information]
Visit [website] or email [campaign email] to get involved.

Thank you again for your support!`,
    tips: [
      "Practice your delivery beforehand",
      "Make eye contact with audience",
      "Keep remarks concise and focused",
      "Leave time for questions",
      "Have campaign materials available"
    ]
  },
  "social-content": {
    type: "Social Media Content",
    title: "Social Media Posts",
    description: "Content templates for social media platforms",
    content: `[Post 1 - Introduction]
Hi everyone! I'm [Your Name], and I'm running for [Office]. I decided to run because [brief why statement]. Follow my campaign for updates on how we can improve our community together! #[YourName]For[Office]

[Post 2 - Issue Focus]
🏘️ [Issue]: [Current problem in community]
✅ My solution: [Specific proposal]
This is why I'm running for [Office]. We need real solutions, not just politics as usual. #[YourName]For[Office]

[Post 3 - Call to Action]
📅 Election Day is [date]!
🗳️ Early voting starts [date]
📍 Find your polling place: [website]
Let's make change happen together! #Vote[YourName]

[Post 4 - Community Engagement]
Great meeting with [community group] today! Thank you for sharing your concerns about [issue]. As your [Office], I'll work to [specific commitment]. #CommunityFirst #[YourName]For[Office]`,
    tips: [
      "Post consistently but don't spam",
      "Use relevant hashtags",
      "Engage with comments and messages",
      "Share behind-the-scenes content",
      "Include photos when possible"
    ]
  },
  "website-content": {
    type: "Website Content",
    title: "Campaign Website Content",
    description: "Content for your campaign website",
    content: `[Homepage Hero]
[Your Name] for [Office]
[Tagline - brief inspiring phrase]

[About Section]
I'm [Your Name], and I'm running for [Office] because [why statement]. As a [your background], I've seen firsthand how [relevant experience connects to office].

[Issues/Platform]
My priorities for [Office]:

[Issue 1]
[Current problem] → [Your solution] → [Expected outcome]

[Issue 2] 
[Current problem] → [Your solution] → [Expected outcome]

[Issue 3]
[Current problem] → [Your solution] → [Expected outcome]

[Biography]
[Longer background paragraph including relevant experience, community involvement, family, etc.]

[Get Involved]
• Volunteer with the campaign
• Make a donation
• Sign up for updates
• Follow us on social media

[Contact]
Email: [campaign email]
Phone: [campaign phone]
Address: [campaign address]

[Required Disclaimer]
Paid for by [Your Name] for [Office]`,
    tips: [
      "Keep navigation simple and clear",
      "Make sure site works on mobile",
      "Include high-quality photos",
      "Update regularly with campaign news",
      "Make it easy to contact you"
    ]
  }
}

export default function ScriptApproval() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isApproved, setIsApproved] = useState(false)
  
  const scriptType = searchParams.get('type') || 'canvassing-script'
  const week = searchParams.get('week') || '1'
  const activityName = searchParams.get('activity') || 'Activity'
  
  const script = scriptTemplates[scriptType] || scriptTemplates['canvassing-script']

  const handleApprove = () => {
    setIsApproved(true)
    // In a real app, this would save the approval status
    setTimeout(() => {
      router.push('/campaign-plan')
    }, 1000)
  }

  const handleEdit = () => {
    // Navigate to edit page (would be implemented separately)
    alert('Edit functionality would be implemented here')
  }

  return (
    <MainLayout currentPage="campaign-plan">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/campaign-plan')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign Plan
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {script.title}
                </h1>
                <p className="text-lg text-gray-600">
                  Week {week} • {activityName}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {isApproved && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Script Content */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {script.type}
                </CardTitle>
                <CardDescription>
                  {script.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                    {script.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips & Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {script.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button 
              onClick={handleApprove}
              disabled={isApproved}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isApproved ? 'Approved' : 'Approve Script'}
            </Button>
            <Button 
              onClick={handleEdit}
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Script
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 