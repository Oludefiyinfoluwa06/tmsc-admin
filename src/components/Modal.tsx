import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-200 scale-100 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 bg-linear-to-r from-[#DC2626] via-[#0b47d3] to-[#093FB4] flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>
        <div className="p-6 bg-gray-800 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
