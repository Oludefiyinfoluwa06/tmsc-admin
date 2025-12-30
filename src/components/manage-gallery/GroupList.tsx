import { useEffect, useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { fetchGalleryGroups, deleteGalleryGroup } from '../../api'
import Modal from '../Modal'
import AlbumForm from './AlbumForm'
import GalleryViewer from './GalleryViewer'
import { useToast } from '../Toast'

type Group = { id: string; title: string; description?: string }

export default function GroupList({ refreshSignal }: { refreshSignal?: number }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Group | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [viewingGroup, setViewingGroup] = useState<{ id: string; title?: string } | null>(null)
  const toast = useToast()

  function load() {
    setLoading(true)
    fetchGalleryGroups('MODOOLA')
      .then((res: any) => setGroups(res || []))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (typeof refreshSignal !== 'undefined') load() }, [refreshSignal])

  function remove(id: string) {
    if (!confirm('Delete this album group?')) return
    deleteGalleryGroup(id)
      .then(() => {
        setGroups(groups.filter(g => g.id !== id))
        toast.show('Album group deleted', 'success')
      })
      .catch(() => toast.show('Delete failed', 'error'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded">{groups.length} albums</span>
      </div>

      {loading ? <div className="text-sm text-gray-400">Loading...</div> : (
        <ul className="space-y-3">
          {groups.map(g => (
            <li key={g.id} className="flex items-center justify-between bg-linear-to-br from-gray-800 to-gray-700 hover:scale-[1.01] hover:shadow-lg p-4 rounded-xl transition border border-gray-600">
              <div onClick={() => setViewingGroup({ id: g.id, title: g.title })} className="cursor-pointer">
                <div className="font-semibold">{g.title}</div>
                <div className="text-xs text-gray-400 mt-1">{g.description}</div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setEditing(g); setIsEditOpen(true) }} className="p-2 text-yellow-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => remove(g.id)} className="p-2 text-red-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Album">
        <AlbumForm initialData={editing} onClose={() => setIsEditOpen(false)} onSaved={() => load()} />
      </Modal>
      {viewingGroup && (
        <GalleryViewer groupId={viewingGroup.id} title={viewingGroup.title} onClose={() => setViewingGroup(null)} />
      )}
    </div>
  )
}
