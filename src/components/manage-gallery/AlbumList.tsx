import { useState } from 'react'
import { Edit2, Trash2, FolderOpen } from 'lucide-react'

type Album = { id: string; title: string; description?: string }

export default function AlbumList() {
  const [albums, setAlbums] = useState<Album[]>([
    { id: 'a1', title: 'MODOOLA Deployments', description: 'Modular training centers' },
    { id: 'a2', title: 'Titanium Laser Gallery', description: 'Laser systems and training' },
  ])

  function remove(id: string) {
    setAlbums(albums.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded">{albums.length} albums</span>
      </div>

      <ul className="space-y-3">
        {albums.map(a => (
          <li key={a.id} className="flex items-center justify-between bg-linear-to-br from-gray-800 to-gray-700 hover:scale-[1.01] hover:shadow-lg p-4 rounded-xl transition border border-gray-600">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 bg-linear-to-br from-[#DC2626] to-[#093FB4] rounded-lg">
                <FolderOpen size={20} />
              </div>
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-gray-400 mt-1">{a.description}</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-yellow-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                <Edit2 size={18} />
              </button>
              <button onClick={() => remove(a.id)} className="p-2 text-red-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
