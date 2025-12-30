import React, { createContext, useCallback, useContext, useState } from 'react'

type Toast = { id: string; type: 'success' | 'error' | 'info'; message: string }

const ToastContext = createContext<{ show: (m: string, t?: Toast['type']) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = String(Date.now())
    setToasts(t => [...t, { id, type, message }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
        {toasts.map((t, i) => (
          <div
            key={t.id}
            style={{ transform: 'translateY(0)', transition: 'transform 260ms, opacity 260ms' }}
            className={`px-4 py-2 rounded shadow-lg text-sm max-w-xs text-white flex items-center space-x-3 ${t.type==='success'? 'bg-gradient-to-r from-green-600 to-green-500' : t.type==='error'? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gray-800'}`}>
            <div className="w-3 h-3 rounded-full" style={{ background: t.type === 'success' ? '#059669' : t.type === 'error' ? '#b91c1c' : '#9ca3af' }} />
            <div className="flex-1">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
