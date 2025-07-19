"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"
import { MainLayout } from "@/components/ui/main-layout"

interface Task {
  id: string
  title: string
  description: string
  estimatedTime: string
  status: 'pending' | 'completed'
  uses: string[]
}

const initialTasks: Task[] = [
  {
    id: "voter-demographics",
    title: "Learn About Your Voters",
    description: "Understand the key demographics and characteristics of voters in your district.",
    estimatedTime: "20 minutes",
    status: 'pending',
    uses: ["Platform Definition", "Core Messaging", "Targeted Outreach"]
  },
  {
    id: "campaign-identity",
    title: "Complete Your Campaign Identity",
    description: "By completing your campaign identity, we'll be able to generate all of your outreach ahead of time.",
    estimatedTime: "25 minutes",
    status: 'pending',
    uses: ["Website", "Social Posts", "Text Messages", "Robocalls", "Canvassing Scripts", "Core Messaging"]
  },
  {
    id: "publish-website",
    title: "Publish Your Campaign Website",
    description: "Because you'll have completed your campaign identity, this will take <5 minutes.",
    estimatedTime: "<5 minutes",
    status: 'pending',
    uses: ["Online Presence", "Voter Information", "Credibility", "Contact Information"]
  },
  {
    id: "practice-outreach",
    title: "Practice Reaching Out",
    description: "Text your 10 closest people with a message we'll help you craft based on your campaign identity. Campaigns are built on outreach, and this is a great way to test your message and get feedback from a supportive group.",
    estimatedTime: "15 minutes",
    status: 'pending',
    uses: ["Outreach Skills", "Message Testing", "Personal Network", "Practice"]
  }
]



export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleTaskClick = (taskId: string) => {
    // For now, just toggle completion status
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ))
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalTasks = tasks.length

  return (
    <MainLayout currentPage="home">
      <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Campaign Foundation
                </h1>
                <p className="text-lg text-gray-600">
                  Let's build the foundation of your campaign. Complete these tasks to get started.
                </p>
              </div>
            </div>

            {/* Progress */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  {completedTasks} of {totalTasks} tasks completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {completedTasks === 0 && "Let's get started! Click on any task to begin."}
                  {completedTasks > 0 && completedTasks < totalTasks && "Great progress! Keep going."}
                  {completedTasks === totalTasks && "Excellent! You've completed all foundation tasks."}
                </p>
              </CardContent>
            </Card>

            {/* Task List */}
            <Card>
              <CardHeader>
                <CardTitle>Foundation Tasks</CardTitle>
                <CardDescription>
                  Complete these essential tasks to build a strong campaign foundation. Each task creates content that gets used across multiple channels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <Card 
                      key={task.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        task.status === 'completed' 
                          ? 'border-green-200 bg-green-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${
                                  task.status === 'completed' ? 'text-green-800' : 'text-gray-900'
                                }`}>
                                  {index + 1}. {task.title}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {task.estimatedTime}
                                </Badge>
                              </div>
                              <p className={`text-sm ${
                                task.status === 'completed' ? 'text-green-700' : 'text-gray-600'
                              }`}>
                                {task.description}
                              </p>
                              <div className="mt-3">
                                <div className="text-xs text-gray-500 mb-2">Used in:</div>
                                <div className="flex flex-wrap gap-1">
                                  {task.uses.map((use, useIndex) => (
                                    <Badge 
                                      key={useIndex} 
                                      variant="outline" 
                                      className="text-xs"
                                    >
                                      {use}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            {task.status === 'completed' ? (
                              <Badge variant="default" className="bg-green-600">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>


              </CardContent>
            </Card>
          </div>
      </MainLayout>
    )
  } 