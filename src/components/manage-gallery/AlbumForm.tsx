import { useEffect, useRef, useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import Spinner from '../Spinner'
import { uploadGalleryFiles, createGalleryImage, createGalleryGroup, updateGalleryGroup } from '../../api'
import { useToast } from '../Toast'

interface AlbumFormProps {
  onClose: () => void
  initialData?: any
  onSaved?: () => void
}

export default function AlbumForm({ onClose, initialData, onSaved }: AlbumFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [initialPreview, setInitialPreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.caption || initialData.title || '')
      setDescription(initialData.description || '')
      if (initialData.imageUrl) setInitialPreview(initialData.imageUrl)
    }
  }, [initialData])

  useEffect(() => {
    // create object URLs for selected files
    const objectUrls = selectedFiles.map(f => URL.createObjectURL(f))
    setPreviews(objectUrls)
    return () => {
      objectUrls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [selectedFiles])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // First: create or update the gallery group (album)
      let groupId: string | undefined = initialData?.id
      if (initialData && initialData.id) {
        await updateGalleryGroup(initialData.id, { title, description })
        toast.show('Album updated', 'success')
      } else {
        const groupRes: any = await createGalleryGroup({ title, description, order: 0 })
        // try to extract id from response
        groupId = groupRes?.id || groupRes?._id || groupRes?.data?.id
        if (!groupId && groupRes && typeof groupRes === 'string') groupId = groupRes
        toast.show('Album created', 'success')
      }

      // Then: upload files (if any) and create gallery images linked to the group
      const files = selectedFiles.length ? selectedFiles : fileRef.current?.files
      if (files && (files as any).length > 0) {
        const uploaded: any = await uploadGalleryFiles(files as any)
        const arr = Array.isArray(uploaded) ? uploaded : [uploaded]
        for (const item of arr) {
          const imageUrl = item?.url || item?.path || item || null
          await createGalleryImage({
            imageUrl: imageUrl || '/uploads/gallery/sample-image.jpg',
            caption: title,
            description,
            order: 0,
            groupId: groupId || initialData?.id,
          })
        }
        toast.show('Images uploaded', 'success')
      }

      onSaved?.()
      // clear selected files and previews
      setSelectedFiles([])
      setPreviews([])
      setInitialPreview(null)
      onClose()
    } catch {
      toast.show('Upload or save failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{initialData ? 'Edit Image' : 'Create New Album'}</h3>
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
          <input ref={fileRef} type="file" multiple className="w-full hidden" onChange={e => {
            const files = e.target.files
            if (files && files.length) setSelectedFiles(Array.from(files))
          }} />
          <p className="text-sm text-gray-400">Click or drag to upload</p>
        </div>

        {/* Previews */}
        {(initialPreview || previews.length > 0) && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {initialPreview && (
              <div key="initial" className="bg-gray-800 p-1 rounded">
                <img src={initialPreview} alt="preview" className="w-full h-20 object-cover rounded" />
              </div>
            )}
            {previews.map((src, i) => (
              <div key={i} className="bg-gray-800 p-1 rounded relative">
                <img src={src} alt={`preview-${i}`} className="w-full h-20 object-cover rounded" />
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
                  onClick={() => {
                    // revoke corresponding object URL
                    const url = previews[idx]
                    if (url) URL.revokeObjectURL(url)
                    setSelectedFiles(s => s.filter((_, i) => i !== idx))
                  }}
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
          <span>{loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Image' : 'Create Album')}</span>
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition ring-1 ring-gray-700">
          Cancel
        </button>
      </div>
    </form>
  )
}
