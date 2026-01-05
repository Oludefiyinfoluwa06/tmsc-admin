import { useEffect, useState } from 'react'
import { Edit2, Trash2, FolderOpen } from 'lucide-react'
import { fetchGalleryImages, deleteGalleryImage } from '../../api'
import Modal from '../Modal'
import AlbumForm from './AlbumForm'
import { useToast } from '../Toast'

type Album = { id: string; caption?: string; imageUrl?: string; description?: string }

export default function AlbumList({ refreshSignal }: { refreshSignal?: number }) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const toast = useToast()

  function load() {
    setLoading(true)
    fetchGalleryImages('MODOOLA')
      .then((res: any) => setAlbums(res || []))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (typeof refreshSignal !== 'undefined') load() }, [refreshSignal])

  function remove(id: string) {
    if (!confirm('Delete this image?')) return
    deleteGalleryImage(id)
      .then(() => {
        setAlbums(albums.filter(a => a.id !== id))
        toast.show('Image deleted', 'success')
      })
      .catch(() => toast.show('Delete failed', 'error'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded">{albums.length} albums</span>
      </div>

      {loading ? <div className="text-sm text-gray-400">Loading...</div> : (
        <ul className="space-y-3">
          {albums.map(a => (
            <li key={a.id} className="flex items-center justify-between bg-linear-to-br from-gray-800 to-gray-700 hover:scale-[1.01] hover:shadow-lg p-4 rounded-xl transition border border-gray-600">
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-linear-to-br from-[#DC2626] to-[#093FB4] rounded-lg">
                  <FolderOpen size={20} />
                </div>
                <div>
                  <div className="font-semibold">{a.caption || a.description || 'Image'}</div>
                  <div className="text-xs text-gray-400 mt-1">{a.imageUrl}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setEditing(a); setIsEditOpen(true) }} className="p-2 text-yellow-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => remove(a.id)} className="p-2 text-red-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Image">
        <AlbumForm initialData={editing} onClose={() => setIsEditOpen(false)} onSaved={() => load()} />
      </Modal>
    </div>
  )
}
