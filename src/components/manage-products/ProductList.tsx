import { useEffect, useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
// gallery-group endpoints moved to ManageGallery
import Modal from '../Modal'
import ProductForm from './ProductForm'
import { fetchProducts, deleteProduct } from '../../api'
import ProductViewer from './ProductViewer'
import { useToast } from '../Toast'

type Product = { id: string; title: string; description?: string; order?: number }

export default function ProductList({ refreshSignal }: { refreshSignal?: number }) {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<string | null>(null)
  const toast = useToast()

  function load() {
    setLoading(true)
    ;(async () => {
      try {
        const data: any = await fetchProducts()
        const list: Product[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: p.id || p._id || String(p.slug || p.title),
          title: p.title || p.name || 'Untitled',
          description: p.description || '',
          order: typeof p.order === 'number' ? p.order : undefined,
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
    if (!confirm('Delete this product group?')) return
    ;(async () => {
      try {
        await deleteProduct(id)
        setItems(items.filter(i => i.id !== id))
        toast.show('Product removed', 'success')
      } catch {
        // fallback to local remove on error
        setItems(items.filter(i => i.id !== id))
        toast.show('Product removed locally', 'info')
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
              <div onClick={() => setViewingProduct(p.id)} className="cursor-pointer">
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-gray-400 mt-1">{p.description}</div>
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

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Product">
        <ProductForm initialData={editing} onClose={() => setIsEditOpen(false)} onSaved={() => load()} />
      </Modal>
      {viewingProduct && (
        <ProductViewer productId={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}
    </div>
  )
}
