import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    setAuthed(!!token)
    setChecked(true)
  }, [])

  if (!checked) return null
  if (!authed) return <Navigate to="/login" replace />
  return <>{children}</>
}
