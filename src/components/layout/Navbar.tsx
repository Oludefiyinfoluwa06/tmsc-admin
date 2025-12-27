import { useLocation } from 'react-router-dom'
import { User, LogOut, Menu, X } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation()

  const pageNames: Record<string, string> = {
    '/': 'Dashboard',
    '/products': 'Manage Products',
    '/gallery': 'Manage Gallery',
  }

  const currentPage = pageNames[location.pathname] || 'Dashboard'

  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-linear-to-r from-[#093FB4] via-[#0a4eb8] to-gray-800 border-b border-gray-700 shadow-lg">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg lg:text-xl font-bold tracking-tight">{currentPage}</h1>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-6">
        <div className="hidden sm:flex items-center space-x-3 bg-gray-800 px-3 lg:px-4 py-2 rounded-lg">
          <div className="text-right">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <button className="p-2 rounded-full bg-linear-to-br from-[#093FB4] to-blue-700 hover:shadow-lg transition">
            <User size={20} />
          </button>
        </div>
        <button className="p-2 text-gray-400 hover:text-red-400 transition">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
