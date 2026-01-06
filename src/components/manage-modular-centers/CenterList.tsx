import { useEffect, useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Modal from '../Modal'
import CenterForm from './CenterForm'
import { fetchCenters, deleteCenter } from '../../api'
import { useToast } from '../Toast'

type Center = { id: string; title: string; location?: string; description?: string; order?: number; imageUrl?: string }

export default function CenterList({ refreshSignal }: { refreshSignal?: number }) {
  const [items, setItems] = useState<Center[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Center | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const toast = useToast()

  function load() {
    setLoading(true)
    ;(async () => {
      try {
        const data: any = await fetchCenters()
        const list: Center[] = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: c.id || c._id || String(c.slug || c.title || c.name),
          title: c.title || c.name || 'Untitled',
          location: c.location || '',
          description: c.description || '',
          order: typeof c.order === 'number' ? c.order : undefined,
          imageUrl: c.imageUrl || c.image || null,
        }))
        setItems(list)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (typeof refreshSignal !== 'undefined') load() }, [refreshSignal])

  function remove(id: string) {
    if (!confirm('Delete this center?')) return
    ;(async () => {
      try {
        await deleteCenter(id)
        setItems(items.filter(i => i.id !== id))
        toast.show('Center removed', 'success')
      } catch {
        setItems(items.filter(i => i.id !== id))
        toast.show('Center removed locally', 'info')
      }
    })()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded">{items.length} items</span>
      </div>
      {loading ? <div className="text-sm text-gray-400">Loading...</div> : (
        <ul className="space-y-3">
          {items.map(p => (
            <li key={p.id} className="flex items-center justify-between bg-linear-to-br from-gray-800 to-gray-700 hover:scale-[1.01] hover:shadow-lg p-4 rounded-xl transition border border-gray-600">
              <div className="flex items-center space-x-4">
                {p.imageUrl ? (
                  <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{p.location}</div>
                  {p.description && <div className="text-xs text-gray-400 mt-1">{p.description}</div>}
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setEditing(p); setIsEditOpen(true) }} className="p-2 text-yellow-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => remove(p.id)} className="p-2 text-red-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Center">
        <CenterForm initialData={editing} onClose={() => setIsEditOpen(false)} onSaved={() => load()} />
      </Modal>
    </div>
  )
}
