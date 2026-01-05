import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Spinner from '../Spinner'
import { useToast } from '../Toast'
import { createCenter, updateCenter, uploadGalleryFiles } from '../../api'

interface CenterFormProps {
  onClose: () => void
  initialData?: any
  onSaved?: () => void
}

export default function CenterForm({ onClose, initialData, onSaved }: CenterFormProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [initialPreview, setInitialPreview] = useState<string | null>(null)
  // training info (optional)
  const [showTraining, setShowTraining] = useState(false)
  const [trainingTitle, setTrainingTitle] = useState('')
  const [trainingSchedule, setTrainingSchedule] = useState('')
  const [trainingDetails, setTrainingDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setLocation(initialData.location || '')
      setDescription(initialData.description || '')
      if (initialData.imageUrl) setInitialPreview(initialData.imageUrl)
      if (initialData.training) {
        setShowTraining(true)
        setTrainingTitle(initialData.training.title || '')
        setTrainingSchedule(initialData.training.schedule || '')
        setTrainingDetails(initialData.training.details || '')
      }
    }
  }, [initialData])

  useEffect(() => {
    const objectUrls = selectedFiles.map(f => URL.createObjectURL(f))
    setPreviews(objectUrls)
    return () => objectUrls.forEach(u => URL.revokeObjectURL(u))
  }, [selectedFiles])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return toast.show('Name is required', 'error')

    setLoading(true)
    try {
      const payload: any = { name, location, description }

      // handle image upload if files selected
      const files = selectedFiles.length ? selectedFiles : fileRef.current?.files
      if (files && (files as any).length > 0) {
        const uploaded: any = await uploadGalleryFiles(files as any)
        const arr = Array.isArray(uploaded) ? uploaded : [uploaded]
        const first = arr[0]
        const imageUrl = first?.url || first?.path || first || null
        if (imageUrl) payload.imageUrl = imageUrl
      } else if (initialPreview) {
        payload.imageUrl = initialPreview
      }

      // attach training info if provided
      if (showTraining && (trainingTitle || trainingSchedule || trainingDetails)) {
        payload.training = {
          title: trainingTitle,
          schedule: trainingSchedule,
          details: trainingDetails,
        }
      }

      if (initialData?.id) {
        await updateCenter(initialData.id, payload)
        toast.show('Center updated', 'success')
      } else {
        await createCenter(payload)
        toast.show('Center created', 'success')
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
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{initialData ? 'Edit Center' : 'Add New Center'}</h3>
      <p className="text-sm text-gray-400">Create or update a modular center.</p>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Name <span className="text-xs text-gray-400">(required)</span></label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Center name" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Location</label>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Address" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/20 focus:outline-none transition resize-none" rows={3} />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Upload Image</label>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={e => {
            e.preventDefault()
            const files = e.dataTransfer?.files
            if (files && files.length) setSelectedFiles(Array.from(files))
          }}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-[#093FB4] transition cursor-pointer bg-gray-900">
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <input ref={fileRef} type="file" accept="image/*" className="w-full hidden" onChange={e => {
            const files = e.target.files
            if (files && files.length) setSelectedFiles(Array.from(files))
          }} />
          <p className="text-sm text-gray-400">Click or drag to upload (optional)</p>
        </div>

        {/* Previews */}
        {(initialPreview || previews.length > 0) && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {initialPreview && (
              <div key="initial" className="bg-gray-800 p-1 rounded relative">
                <img src={initialPreview} alt="preview" className="w-full h-20 object-cover rounded" />
                <button type="button" onClick={() => { setInitialPreview(null) }} className="absolute top-1 right-1 text-xs text-red-400">Remove</button>
              </div>
            )}
            {previews.map((src, i) => (
              <div key={i} className="bg-gray-800 p-1 rounded relative">
                <img src={src} alt={`preview-${i}`} className="w-full h-20 object-cover rounded" />
                <button type="button" onClick={() => {
                  const url = previews[i]
                  if (url) URL.revokeObjectURL(url)
                  setSelectedFiles(s => s.filter((_, idx) => idx !== i))
                }} className="absolute top-1 right-1 text-xs text-red-400">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="inline-flex items-center text-sm text-gray-300">
          <input type="checkbox" checked={showTraining} onChange={e => setShowTraining(e.target.checked)} className="mr-2" />
          Add training information (optional)
        </label>
      </div>

      {showTraining && (
        <div className="space-y-4 p-4 bg-gray-800 rounded">
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Training Title</label>
            <input value={trainingTitle} onChange={e => setTrainingTitle(e.target.value)} placeholder="e.g., Basic Operation" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Schedule / Notes</label>
            <input value={trainingSchedule} onChange={e => setTrainingSchedule(e.target.value)} placeholder="e.g., Mon-Fri, 09:00 - 12:00" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/30 focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Details</label>
            <textarea value={trainingDetails} onChange={e => setTrainingDetails(e.target.value)} placeholder="Additional training details (optional)" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#093FB4] focus:ring-2 focus:ring-[#093FB4]/20 focus:outline-none transition resize-none" rows={3} />
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition shadow-md disabled:opacity-50">
          {loading ? <Spinner size={18} /> : <span>{initialData ? 'Update Center' : 'Create Center'}</span>}
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition ring-1 ring-gray-700">
          Cancel
        </button>
      </div>
    </form>
  )
}
