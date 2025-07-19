"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { SimpleLayout } from "@/components/ui/simple-layout"

export default function PathToVictory() {
  const router = useRouter()

  return (
    <SimpleLayout>
      <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Office Selection
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Path to Victory
              </h1>
              <p className="text-lg text-gray-600">
                Here's what you need to focus on to win your local election.
              </p>
            </div>
          </div>

          {/* Vote Requirements */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle>Votes Needed to Win</CardTitle>
              <CardDescription>
                Here's your target number of votes based on recent election data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Vote Target */}
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                  <div className="text-5xl font-bold text-green-600 mb-4">
                    1,250
                  </div>
                  <div className="text-lg text-gray-600 mb-4">Votes Needed</div>
                  <div className="text-sm text-gray-500">
                    Based on recent election data and current voter turnout patterns
                  </div>
                </div>

                {/* Voter Contact Requirements */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4 text-lg">Voter Contact Strategy</h4>
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        6,250
                      </div>
                      <div className="text-sm text-gray-600 mb-4">Voter Contacts Recommended</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-200">
                    <h4 className="font-semibold mb-3">Our Recommendation</h4>
                    <p className="text-gray-600">
                      We recommend making 5x the number of voter contacts as the votes you need. 
                      This accounts for people who won't answer, aren't home, or won't vote for you. 
                      For your 1,250 vote target, plan to contact 6,250 voters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-green-200">
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => router.push(`/campaign-planning`)}
                >
                  Continue to Campaign Planning →
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </SimpleLayout>
  )
} 