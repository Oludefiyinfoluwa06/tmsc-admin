import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Modal from '../Modal'
import { fetchProduct } from '../../api'
import Spinner from '../Spinner'

export default function ProductViewer({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    fetchProduct(productId)
      .then((res: any) => setProduct(res || null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productId])

  function scroll(delta: number) {
    containerRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={product?.title || 'Product'}>
      <div className="relative">
        <button onClick={onClose} className="absolute right-3 top-3 p-2 bg-gray-800 rounded-full">
          <X size={16} />
        </button>

        {loading ? (
          <div className="py-8 flex items-center justify-center"><Spinner size={20} /></div>
        ) : product ? (
          <div>
            <div className="mb-4">
              <div className="text-lg font-semibold">{product.title}</div>
              <div className="text-sm text-gray-400">{product.description}</div>
              <div className="text-xs text-gray-400 mt-2">Product: {product.slug || product.productType || ''}</div>
            </div>

            {Array.isArray(product.images) && product.images.length > 0 ? (
              <div className="flex items-center">
                <button onClick={() => scroll(-400)} className="p-2 mr-3 bg-gray-800 rounded-lg"><ChevronLeft /></button>
                <div ref={containerRef} className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
                  {product.images.map((img: string, i: number) => {
                    const src = img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}${img}`
                    return (
                      <div key={i} className="shrink-0 w-80 h-56 bg-gray-800 rounded overflow-hidden">
                        <img src={src} alt={`${product.title}-${i}`} className="w-full h-full object-cover" />
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => scroll(400)} className="p-2 ml-3 bg-gray-800 rounded-lg"><ChevronRight /></button>
              </div>
            ) : (
              <div className="text-sm text-gray-400">No images available for this product.</div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400">Product not found.</div>
        )}
      </div>
    </Modal>
  )
}
