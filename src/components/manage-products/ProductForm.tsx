import { useEffect, useRef, useState } from 'react'
import { Plus, Upload } from 'lucide-react'
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
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const toast = useToast()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setImages(Array.isArray(initialData.images) ? initialData.images : [])
      setSlug(initialData.slug || initialData.productType || 'MODOOLA')
    }
  }, [initialData])

  useEffect(() => {
    const objectUrls = selectedFiles.map(f => URL.createObjectURL(f))
    setPreviews(objectUrls)
    return () => { objectUrls.forEach(u => URL.revokeObjectURL(u)) }
  }, [selectedFiles])

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!title) return toast.show('Title is required', 'error')

    setLoading(true)
    try {
      const form = new FormData()
      form.append('slug', slug)
      form.append('title', title)
      form.append('description', description)

      if (images && images.length) {
        images.forEach(img => form.append('images[]', img))
      }

      if (initialData?.id) {
        await updateProduct(initialData.id, form)
        toast.show('Product updated', 'success')
      } else {
        await createProduct(form)
        toast.show('Product created', 'success')
      }

      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
      toast.show('Save failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length) setSelectedFiles(Array.from(files))
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  function removeSelectedFile(idx: number) {
    const url = previews[idx]
    if (url) URL.revokeObjectURL(url)
    setSelectedFiles(s => s.filter((_, i) => i !== idx))
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

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Upload Images</label>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={e => {
            e.preventDefault()
            const files = e.dataTransfer?.files
            if (files && files.length) setSelectedFiles(Array.from(files))
          }}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#093FB4] transition cursor-pointer bg-gray-900">
          <Upload size={28} className="mx-auto mb-3 text-gray-400" />
          <input ref={fileRef} type="file" multiple className="w-full hidden" onChange={handleFiles} />
          <p className="text-sm text-gray-400">Click or drag to upload</p>
        </div>

        {/* Previews */}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div key={i} className="bg-gray-800 p-1 rounded">
                <img
                  src={src}
                  alt={`img-${i}`}
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="mt-1 text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}


        {selectedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {selectedFiles.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <div className="text-sm text-gray-300 truncate">{f.name}</div>
                <button
                  type="button"
                  onClick={() => removeSelectedFile(idx)}
                  className="text-xs text-red-400 px-2 py-1 rounded hover:bg-gray-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
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
