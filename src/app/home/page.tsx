"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MainLayout } from "@/components/ui/main-layout"
import OnboardingIntro from "../onboarding/tasks/onboarding-intro"
import VoterSegmentsTask from "../onboarding/tasks/voter-segments"
import CampaignIdentityTask from "../onboarding/tasks/campaign-identity"
import WebsiteReviewTask from "../onboarding/tasks/website-review"
import CampaignPlanReview from "../onboarding/tasks/campaign-plan-review"

interface OnboardingTask {
  id: string
  title: string
  description: string
  estimatedTime: string
  component: React.ComponentType<any>
  isCompleted: boolean
}

const onboardingTasks: OnboardingTask[] = [
  {
    id: "onboarding-intro",
    title: "Welcome to Your Campaign Builder",
    description: "Learn what we'll build together in the next 50 minutes - your complete campaign foundation.",
    estimatedTime: "2 minutes",
    component: OnboardingIntro,
    isCompleted: false
  },
  {
    id: "voter-segments",
    title: "Select Your Voter Segments",
    description: "Choose the specific groups of voters you'll focus your campaign on. We'll help you reach at least 150% of your win number.",
    estimatedTime: "10 minutes",
    component: VoterSegmentsTask,
    isCompleted: false
  },
  {
    id: "campaign-identity", 
    title: "Build Your Campaign Identity",
    description: "Define your why statement, platform, and core messaging that resonates with your chosen voter segments. You can edit this later as your campaign evolves based on feedback from voters.",
    estimatedTime: "25 minutes",
    component: CampaignIdentityTask,
    isCompleted: false
  },
  {
    id: "website-content",
    title: "Review & Publish Your Website", 
    description: "Review the website content we generate based on your identity and publish your campaign site with one click.",
    estimatedTime: "<5 minutes",
    component: WebsiteReviewTask,
    isCompleted: false
  },
  {
    id: "campaign-plan",
    title: "Review Your Campaign Plan", 
    description: "See your personalized campaign plan with content tailored to each voter segment based on your campaign plan configuration.",
    estimatedTime: "15 minutes",
    component: CampaignPlanReview,
    isCompleted: false
  }
]

export default function HomePage() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [tasks, setTasks] = useState<OnboardingTask[]>(onboardingTasks)

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboarding-progress')
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setCurrentTaskIndex(progress.currentTaskIndex || 0)
        
        // Update tasks with saved completion status
        setTasks(prevTasks => 
          prevTasks.map(task => ({
            ...task,
            isCompleted: progress.completedTasks?.includes(task.id) || false
          }))
        )
      } catch (error) {
        console.error('Error loading onboarding progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const completedTaskIds = tasks.filter(task => task.isCompleted).map(task => task.id)
    const progress = {
      currentTaskIndex,
      completedTasks: completedTaskIds
    }
    localStorage.setItem('onboarding-progress', JSON.stringify(progress))
  }, [currentTaskIndex, tasks])

  const currentTask = tasks[currentTaskIndex]
  const completedTasks = tasks.filter(task => task.isCompleted).length
  const totalTasks = tasks.length

  const handleTaskComplete = (taskId: string, data?: any) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    )
    
    // Also save task-specific data if needed
    if (data) {
      localStorage.setItem(`onboarding-task-${taskId}`, JSON.stringify(data))
    }
    
    // Move to next task if available
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    }
  }

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1)
    }
  }

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    }
  }

  const TaskComponent = currentTask.component

  return (
    <MainLayout currentPage="home">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Campaign Onboarding
            </h1>
            <p className="text-lg text-gray-600">
              Let's build your campaign step by step
            </p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Step {currentTaskIndex + 1} of {totalTasks} • {completedTasks} completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentTaskIndex + (currentTask.isCompleted ? 1 : 0)) / totalTasks) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              {tasks.map((task, index) => (
                <div key={task.id} className={`text-center ${index === currentTaskIndex ? 'text-blue-600 font-medium' : ''}`}>
                  {task.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Task */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentTask.title}
                  <Badge variant="outline">{currentTask.estimatedTime}</Badge>
                </CardTitle>
                <CardDescription className="mt-2">
                  {currentTask.description}
                </CardDescription>
              </div>
              {currentTask.isCompleted && (
                <Badge variant="default" className="bg-green-600">
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <TaskComponent 
              onComplete={(data?: any) => handleTaskComplete(currentTask.id, data)}
              isCompleted={currentTask.isCompleted}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousTask}
            disabled={currentTaskIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Task
          </Button>
          
          <Button
            onClick={handleNextTask}
            disabled={currentTaskIndex === tasks.length - 1 || !currentTask.isCompleted}
            className="flex items-center gap-2"
          >
            Next Task
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {completedTasks === totalTasks && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Onboarding Complete!</CardTitle>
              <CardDescription className="text-green-700">
                You've completed all onboarding tasks. Your campaign is ready to launch!
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}