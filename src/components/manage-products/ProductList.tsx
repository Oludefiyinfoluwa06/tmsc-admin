import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'

type Product = { id: string; title: string; type: string }

export default function ProductList() {
  const [items, setItems] = useState<Product[]>([
    { id: '1', title: 'MODOOLA Basic Pack', type: 'MODOOLA' },
    { id: '2', title: 'Machine Exchange Starter', type: 'Exchange' },
  ])

  function remove(id: string) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded">{items.length} items</span>
      </div>
      <ul className="space-y-3">
        {items.map(p => (
          <li key={p.id} className="flex items-center justify-between bg-linear-to-br from-gray-800 to-gray-700 hover:scale-[1.01] hover:shadow-lg p-4 rounded-xl transition border border-gray-600">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-gray-400 mt-1">
                <span className="inline-block bg-linear-to-r from-[#093FB4] to-[#DC2626] text-white px-2 py-1 rounded font-medium">{p.type}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-yellow-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                <Edit2 size={18} />
              </button>
              <button onClick={() => remove(p.id)} className="p-2 text-red-400 hover:bg-gray-600/60 rounded-lg transition bg-gray-800/30">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
