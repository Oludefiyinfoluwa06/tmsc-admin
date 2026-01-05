import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 p-6 lg:p-10 bg-linear-to-br from-gray-800 to-gray-900 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
