"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Mock data for offices with election dates
interface Office {
  id: string
  name: string
  electionDate: string
  level: 'local' | 'county' | 'state'
}

const offices: Office[] = [
  {
    id: "city-council",
    name: "City Council Member",
    electionDate: "November 5, 2024",
    level: "local"
  },
  {
    id: "mayor",
    name: "Mayor",
    electionDate: "November 5, 2024",
    level: "local"
  },
  {
    id: "school-board",
    name: "School Board Member",
    electionDate: "November 5, 2024",
    level: "local"
  },
  {
    id: "county-commissioner",
    name: "County Commissioner",
    electionDate: "November 5, 2024",
    level: "county"
  },
  {
    id: "town-council",
    name: "Town Council Member",
    electionDate: "March 19, 2024",
    level: "local"
  },
  {
    id: "water-district",
    name: "Water District Director",
    electionDate: "May 7, 2024",
    level: "local"
  }
]

export default function Home() {
  const router = useRouter()

  const handleOfficeSelect = () => {
    router.push(`/path-to-victory`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Win Your Local Election
            </h1>
            <p className="text-xl text-gray-600">
              Ready to make a difference in your community? Choose the office you want to run for.
            </p>
          </div>

          {/* Office Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Office</CardTitle>
              <CardDescription>
                Select the position you want to run for. We&apos;ll show you exactly what it takes to win.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {offices.map((office) => (
                  <Card 
                    key={office.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:bg-gray-50"
                    onClick={handleOfficeSelect}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{office.name}</h3>
                          <p className="text-sm text-gray-600">Election: {office.electionDate}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {office.level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
