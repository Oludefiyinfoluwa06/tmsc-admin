import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, LogIn } from 'lucide-react'
import logo from '../../assets/logo.jpeg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} className='w-70 h-20' />
        </div>

        {/* Form Card */}
        <form onSubmit={submit} className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-2xl space-y-6">
          <h2 className="text-white text-xl font-bold text-center">Sign In</h2>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@machineskills.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:outline-none transition placeholder-gray-500 text-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:outline-none transition placeholder-gray-500 text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 bg-linear-to-r from-[#093FB4] to-blue-700 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition text-white">
            <LogIn size={20} />
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  )
}
