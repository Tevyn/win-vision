"use client"

import { Button } from "@/components/ui/button"
import { Heart, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function TopNavigation() {
  const router = useRouter()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/home')}
        >
          <Heart className="w-6 h-6 text-gray-400" />
          <span className="text-lg font-semibold text-gray-900">Win Vision</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 