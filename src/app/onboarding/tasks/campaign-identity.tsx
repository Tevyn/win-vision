"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, MessageSquare, CheckCircle2, Plus, X, MessageCircle } from "lucide-react"

interface CampaignIdentityProps {
  onComplete: (data?: unknown) => void
  isCompleted: boolean
}

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

interface SectionState {
  backgroundCompleted: boolean
  issuesCompleted: string[] // Array of completed issue IDs
  whyStatementCompleted: boolean
}

export default function CampaignIdentityTask({ onComplete, isCompleted }: CampaignIdentityProps) {
  const [formData, setFormData] = useState<FormData>({
    background: "",
    personalExperience: "",
    issues: [{ id: "1", problemToSolve: "", howItHurtsPeople: "", whatYoullDo: "" }],
    whyStatement: ""
  })
  
  const [sectionState, setSectionState] = useState<SectionState>({
    backgroundCompleted: false,
    issuesCompleted: [],
    whyStatementCompleted: false
  })
  
  const [showDraft, setShowDraft] = useState(false)

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
    
    // Remove from completed issues if it was completed
    setSectionState(prev => ({
      ...prev,
      issuesCompleted: prev.issuesCompleted.filter(id => id !== issueId)
    }))
  }

  const completeBackgroundSection = () => {
    if (formData.background && formData.personalExperience) {
      setSectionState(prev => ({ ...prev, backgroundCompleted: true }))
    }
  }

  const editBackgroundSection = () => {
    setSectionState(prev => ({ ...prev, backgroundCompleted: false }))
  }

  const completeIssueSection = (issueId: string) => {
    const issue = formData.issues.find(i => i.id === issueId)
    if (issue && issue.problemToSolve && issue.howItHurtsPeople && issue.whatYoullDo) {
      setSectionState(prev => ({
        ...prev,
        issuesCompleted: [...prev.issuesCompleted.filter(id => id !== issueId), issueId]
      }))
    }
  }

  const editIssueSection = (issueId: string) => {
    setSectionState(prev => ({
      ...prev,
      issuesCompleted: prev.issuesCompleted.filter(id => id !== issueId)
    }))
  }


  const editWhyStatementSection = () => {
    setSectionState(prev => ({ ...prev, whyStatementCompleted: false }))
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
    setShowDraft(true)
  }

  const handleComplete = () => {
    onComplete({
      background: formData.background,
      personalExperience: formData.personalExperience,
      issues: formData.issues,
      whyStatement: formData.whyStatement
    })
  }

  const validIssues = formData.issues.filter(issue => 
    issue.problemToSolve && issue.howItHurtsPeople && issue.whatYoullDo
  )
  const canGenerateDraft = formData.personalExperience && validIssues.length > 0
  const canComplete = formData.whyStatement.trim().length > 0

  // Helper functions for section visibility
  const canShowIssuesSection = sectionState.backgroundCompleted
  const canShowWhyStatementSection = sectionState.backgroundCompleted && 
    formData.issues.every(issue => sectionState.issuesCompleted.includes(issue.id))
  
  const canCompleteBackgroundSection = formData.background && formData.personalExperience
  const canCompleteIssue = (issue: Issue) => issue.problemToSolve && issue.howItHurtsPeople && issue.whatYoullDo
  const isIssueCompleted = (issueId: string) => sectionState.issuesCompleted.includes(issueId)



  if (isCompleted) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
          <CheckCircle2 className="w-8 h-8" />
          <span className="text-xl font-semibold">Campaign Identity Complete!</span>
        </div>
        <p className="text-gray-600">
          You&apos;ve defined your campaign&apos;s core identity and why statement.
        </p>
      </div>
    )
  }

      return (
      <div className="space-y-6">

      {/* Step 1: Background Information */}
      <Card className={sectionState.backgroundCompleted ? "border-green-200 bg-green-50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-lg ${sectionState.backgroundCompleted ? "text-green-800" : ""}`}>
                1. Tell Us About You
              </CardTitle>
              {!sectionState.backgroundCompleted && (
                <CardDescription>
                  Help us understand your background and what shaped you as a person.
                </CardDescription>
              )}
            </div>
            {sectionState.backgroundCompleted && (
              <Badge className="bg-green-600">Completed</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sectionState.backgroundCompleted ? (
            // Minimized view
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Background:</p>
                <p className="text-sm text-gray-900">{formData.background}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Personal Experience:</p>
                <p className="text-sm text-gray-900">{formData.personalExperience}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={editBackgroundSection}
                className="mt-3"
              >
                Edit
              </Button>
            </div>
          ) : (
            // Expanded view
            <div className="space-y-4">
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
              <Button
                onClick={completeBackgroundSection}
                disabled={!canCompleteBackgroundSection}
                className="w-full mt-4"
              >
                Complete This Section
              </Button>
            </div>
          )}
        </CardContent>
              </Card>

      {/* Issues Summary Card (when not yet accessible) */}
      {!canShowIssuesSection && (
        <Card className="border-gray-200 bg-gray-100 opacity-75">
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">2. The Issues You Care About</CardTitle>
            <CardDescription className="text-gray-500">
              Define the problems you want to solve and your solutions
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Step 2: Issues and Solutions */}
      {canShowIssuesSection && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">2. The Issues You Care About</CardTitle>
                <CardDescription>
                  What problems do you want to solve, and how will you fix them? Add up to 4 issues.
                </CardDescription>
              </div>
              {canShowWhyStatementSection && (
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
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.issues.map((issue, index) => (
              <Card 
                key={issue.id} 
                className={`border-gray-200 ${isIssueCompleted(issue.id) ? "border-green-200 bg-green-50" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-base ${isIssueCompleted(issue.id) ? "text-green-800" : ""}`}>
                      Issue {index + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isIssueCompleted(issue.id) && (
                        <Badge className="bg-green-600">Completed</Badge>
                      )}
                      {formData.issues.length > 1 && !isIssueCompleted(issue.id) && (
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
                  </div>
                </CardHeader>
                <CardContent>
                  {isIssueCompleted(issue.id) ? (
                    // Minimized view
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Problem:</p>
                        <p className="text-sm text-gray-900">{issue.problemToSolve}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Impact:</p>
                        <p className="text-sm text-gray-900">{issue.howItHurtsPeople}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Solution:</p>
                        <p className="text-sm text-gray-900">{issue.whatYoullDo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editIssueSection(issue.id)}
                        >
                          Edit
                        </Button>
                        {formData.issues.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIssue(issue.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Expanded view
                    <div className="space-y-3">
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
                          What you&apos;ll do to fix it
                        </Label>
                        <Input
                          id={`solution-${issue.id}`}
                          placeholder="e.g., Create more affordable housing programs, increase education funding..."
                          value={issue.whatYoullDo}
                          onChange={(e) => handleIssueChange(issue.id, "whatYoullDo", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        onClick={() => completeIssueSection(issue.id)}
                        disabled={!canCompleteIssue(issue)}
                        className="w-full mt-4"
                      >
                        Complete This Issue
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {!canShowWhyStatementSection && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-3">
                  Complete all issues above to continue to the next step
                </p>
                <Button
                  variant="outline"
                  onClick={addIssue}
                  disabled={formData.issues.length >= 4}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Issue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Why Statement Summary Card (when not yet accessible) */}
      {!canShowWhyStatementSection && (
        <Card className="border-gray-200 bg-gray-100 opacity-75">
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">3. Your Why Statement</CardTitle>
            <CardDescription className="text-gray-500">
              Craft your core campaign message that connects with voters
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Step 3: Draft Why Statement */}
      {canShowWhyStatementSection && (
        <Card className={sectionState.whyStatementCompleted ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-lg ${sectionState.whyStatementCompleted ? "text-green-800" : "text-blue-800"}`}>
                  3. Your Why Statement
                </CardTitle>
                {!sectionState.whyStatementCompleted && (
                  <CardDescription className="text-blue-700">
                    Edit and refine your why statement to make it perfect for your campaign.
                  </CardDescription>
                )}
              </div>
              <div>
                {sectionState.whyStatementCompleted && (
                  <Badge className="bg-green-600">Completed</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sectionState.whyStatementCompleted ? (
              // Minimized view
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Your Why Statement:</p>
                  <p className="text-sm text-gray-900 italic">&quot;{formData.whyStatement}&quot;</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={editWhyStatementSection}
                  className="mt-3"
                >
                  Edit
                </Button>
              </div>
            ) : (
              // Expanded view
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Content Input - Left side (2 columns) */}
                  <div className="lg:col-span-2 space-y-4">
                    {!showDraft && (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">
                          Ready to create your why statement? We&apos;ll generate a draft based on your background and issues.
                        </p>
                        <Button
                          onClick={generateDraft}
                          disabled={!canGenerateDraft}
                          className="flex items-center gap-2"
                        >
                          Generate My Why Statement Draft
                        </Button>
                      </div>
                    )}
                    
                    {showDraft && (
                      <>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            Your Why Statement
                          </h4>
                          <Textarea
                            placeholder="Edit your why statement here..."
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
                      </>
                    )}
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
                
                {/* Full Width Completion Button */}
                {showDraft && (
                  <Button
                    onClick={handleComplete}
                    disabled={!canComplete}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Campaign Identity
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 