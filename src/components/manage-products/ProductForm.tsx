import { useState } from 'react'
import { Plus } from 'lucide-react'

interface ProductFormProps {
  onClose: () => void
}

export default function ProductForm({ onClose }: ProductFormProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('MODOOLA')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setTitle('')
    setType('MODOOLA')
    alert('Product created (local only)')
    onClose()
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-100 mb-1">Add New Product</h3>
      <p className="text-sm text-gray-400">Create a product pack. This demo stores data locally.</p>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Title <span className="text-xs text-gray-400">(required)</span></label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., MODOOLA Premium Pack" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/20 focus:outline-none transition">
          <option>MODOOLA</option>
          <option>Exchange</option>
          <option>Titanium Laser</option>
        </select>
      </div>

      <div className="flex space-x-3">
        <button type="submit" className="flex-1 py-3 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition shadow-md">
          <Plus size={20} />
          <span>Create Product</span>
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition ring-1 ring-gray-700">
          Cancel
        </button>
      </div>
    </form>
  )
}
