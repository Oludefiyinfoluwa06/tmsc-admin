import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'

interface AlbumFormProps {
  onClose: () => void
}

export default function AlbumForm({ onClose }: AlbumFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setTitle('')
    setDescription('')
    alert('Album created (local only)')
    onClose()
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-100 mb-1">Create New Album</h3>
      <p className="text-sm text-gray-400">Albums help organize images for products and projects.</p>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Album Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Training Center Setup" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add details about this album..." className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/20 focus:outline-none transition resize-none" rows={3} />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Upload Images</label>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#093FB4] transition cursor-pointer bg-gray-900">
          <Upload size={28} className="mx-auto mb-3 text-gray-400" />
          <input type="file" multiple className="w-full hidden" />
          <p className="text-sm text-gray-400">Click or drag to upload</p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button type="submit" className="flex-1 py-3 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition shadow-md">
          <Plus size={20} />
          <span>Create Album</span>
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition ring-1 ring-gray-700">
          Cancel
        </button>
      </div>
    </form>
  )
}
