import { TopNavigation } from "./top-navigation"
import { SidebarNavigation } from "./sidebar-navigation"
import { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
  currentPage?: string
  showSidebar?: boolean
}

export function MainLayout({ 
  children, 
  currentPage = "home", 
  showSidebar = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="flex">
        {showSidebar && <SidebarNavigation currentPage={currentPage} />}
        <div className={`flex-1 ${showSidebar ? 'p-8' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  )
} 