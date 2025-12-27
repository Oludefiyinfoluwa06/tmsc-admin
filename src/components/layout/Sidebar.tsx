import { Link, useLocation } from 'react-router-dom'
import { Home, Package, Images, LogOut, X } from 'lucide-react'
import logo from '../../assets/logo.jpeg'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 fixed lg:static lg:flex flex-col bg-gray-900 border-r border-gray-700 transition-transform duration-300 z-40 h-screen lg:h-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo / Brand Section */}
        <div className="p-8 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logo} className="w-125 h-20" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Navigation</div>

          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive('/') ? 'bg-[#093FB4] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive('/products') ? 'bg-[#093FB4] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Package size={20} />
            <span className="font-medium">Manage Products</span>
          </Link>

          <Link
            to="/gallery"
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive('/gallery') ? 'bg-[#093FB4] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Images size={20} />
            <span className="font-medium">Manage Gallery</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-700">
          <Link
            to="/login"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
