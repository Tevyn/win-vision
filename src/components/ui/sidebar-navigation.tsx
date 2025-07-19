"use client"

import { useRouter } from "next/navigation"
import { Home, BarChart3, ClipboardList, Phone, Globe, Palette } from "lucide-react"

const navItems = [
  { name: "Home", icon: Home, id: "home" },
  { name: "Your Voters", icon: BarChart3, id: "voter-data" },
  { name: "Campaign Identity", icon: Palette, id: "campaign-identity" },
  { name: "Campaign Plan", icon: ClipboardList, id: "campaign-plan" },
  { name: "Voter Outreach", icon: Phone, id: "voter-outreach" },
  { name: "Website", icon: Globe, id: "website" }
]

interface SidebarNavigationProps {
  currentPage?: string
}

export function SidebarNavigation({ currentPage = "home" }: SidebarNavigationProps) {
  const router = useRouter()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isCurrent = item.id === currentPage
            let href = null
            if (item.id === "home") href = `/home`
            else if (item.id === "campaign-identity") href = `/campaign-identity`
            else if (item.id === "campaign-plan") href = `/campaign-plan`
            else if (item.id === "voter-data") href = `/home/voter-data`
            else if (item.id === "voter-outreach") href = `/home/voter-outreach`
            else if (item.id === "website") href = `/home/website`
            
            // Special case for Home - always make it clickable
            if (item.id === "home") {
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left font-medium ${
                    isCurrent 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => router.push(href as string)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            } else if (isCurrent) {
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left bg-blue-50 text-blue-700 font-medium cursor-default"
                  disabled
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            } else if (href) {
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 font-medium"
                  onClick={() => router.push(href as string)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            } else {
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-400 bg-gray-100 cursor-not-allowed font-medium"
                  disabled
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            }
          })}
        </nav>
      </div>
    </div>
  )
} 