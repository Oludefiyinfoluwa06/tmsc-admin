import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Modal from '../Modal'
import { fetchGalleryImages } from '../../api'
import Spinner from '../Spinner'

export default function GalleryViewer({ groupId, title, onClose }: { groupId: string; title?: string; onClose: () => void }) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!groupId) return
    setLoading(true)
    fetchGalleryImages('MODOOLA', groupId)
      .then((res: any) => setImages(res || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }, [groupId])

  function scroll(delta: number) {
    containerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={title || 'Gallery'}>
      <div className="relative">
        <button onClick={onClose} className="absolute right-3 top-3 p-2 bg-gray-800 rounded-full">
          <X size={16} />
        </button>

        {loading ? (
          <div className="py-8 flex items-center justify-center"><Spinner size={20} /></div>
        ) : (
          <div className="flex items-center">
            <button onClick={() => scroll(-400)} className="p-2 mr-3 bg-gray-800 rounded-lg"><ChevronLeft /></button>
            <div ref={containerRef} className="flex gap-3 overflow-x-auto py-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
              {images.map((img, i) => {
                const src = `${import.meta.env.VITE_API_BASE_URL}${img.imageUrl}`
                console.log({ src })
                return (
                  <div key={i} className="flex-shrink-0 w-80 h-56 bg-gray-800 rounded overflow-hidden" style={{ scrollSnapAlign: 'center' }}>
                    <img src={src} alt={img?.caption || `img-${i}`} className="w-full h-full object-cover" />
                  </div>
                )
              })}
            </div>
            <button onClick={() => scroll(400)} className="p-2 ml-3 bg-gray-800 rounded-lg"><ChevronRight /></button>
          </div>
        )}
      </div>
    </Modal>
  )
}
