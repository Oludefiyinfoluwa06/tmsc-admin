import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import Spinner from '../Spinner'
import { useToast } from '../Toast'
import { createProduct, updateProduct } from '../../api'

interface ProductFormProps {
  onClose: () => void
  initialData?: any
  onSaved?: () => void
}

export default function ProductForm({ onClose, initialData, onSaved }: ProductFormProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('MODOOLA')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setSlug(initialData.slug || initialData.productType || 'MODOOLA')
    }
  }, [initialData])

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!title) return toast.show('Title is required', 'error')

    setLoading(true)
    try {
      const payload = {
        slug,
        title,
        description,
      }

      if (initialData?.id) {
        await updateProduct(initialData.id, payload)
        toast.show('Product updated', 'success')
      } else {
        await createProduct(payload)
        toast.show('Product created', 'success')
      }

      onSaved?.()
      onClose()
    } catch {
      toast.show('Save failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
      <p className="text-sm text-gray-400">Create or update a product pack.</p>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Title <span className="text-xs text-gray-400">(required)</span></label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., MODOOLA Premium Pack" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Product</label>
        <select value={slug} onChange={e => setSlug(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition">
          <option value="MODOOLA">MODOOLA</option>
          <option value="MACHINE_EXCHANGE">MACHINE EXCHANGE</option>
          <option value="TITANIUM_LASER">TITANIUM LASER</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/20 focus:outline-none transition resize-none" rows={3} />
      </div>

      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition shadow-md disabled:opacity-50">
          {loading ? <Spinner size={18} /> : <Plus size={20} />}
          <span>{loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Product' : 'Create Product')}</span>
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition ring-1 ring-gray-700">
          Cancel
        </button>
      </div>
    </form>
  )
}
