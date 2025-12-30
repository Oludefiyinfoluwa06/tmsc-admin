import { BarChart3, Package, Images } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchProducts, fetchGalleryGroups } from '../../api'

export default function Dashboard() {
  const [productsCount, setProductsCount] = useState<number | null>(null)
  const [galleriesCount, setGalleriesCount] = useState<number | null>(null)
  const [statsCount, setStatsCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true

    Promise.all([fetchProducts(), fetchGalleryGroups()])
      .then(([products, groups]: any) => {
        if (!mounted) return
        const pCount = Array.isArray(products) ? products.length : (products?.length || 0)
        const gCount = Array.isArray(groups) ? groups.length : (groups?.length || 0)
        setProductsCount(pCount)
        setGalleriesCount(gCount)
        setStatsCount(pCount + gCount)
      })
      .catch(() => {
        if (!mounted) return
        setProductsCount(0)
        setGalleriesCount(0)
        setStatsCount(0)
      })

    return () => { mounted = false }
  }, [])

  const display = (v: number | null, fallback: number) => (v === null ? fallback : v)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-gray-400 mt-2">Overview — manage your products and gallery with ease</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Products</p>
              <h3 className="text-2xl font-bold mt-2">{display(productsCount, 0)}</h3>
              <p className="text-xs text-gray-500 mt-1">Manage inventory packs</p>
            </div>
            <div className="p-3 bg-linear-to-br from-[#093FB4] to-blue-700 rounded-lg">
              <Package size={28} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Galleries</p>
              <h3 className="text-2xl font-bold mt-2">{display(galleriesCount, 0)}</h3>
              <p className="text-xs text-gray-500 mt-1">Albums and images</p>
            </div>
            <div className="p-3 bg-linear-to-br from-[#DC2626] to-[#B21C1C] rounded-lg">
              <Images size={28} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold">Statistics</p>
              <h3 className="text-2xl font-bold mt-2">{display(statsCount, 0)}</h3>
              <p className="text-xs text-gray-500 mt-1">Total items managed</p>
            </div>
            <div className="p-3 bg-linear-to-br from-[#DC2626] via-[#0b47d3] to-[#093FB4] rounded-lg">
              <BarChart3 size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Quick Info</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start space-x-3">
              <span className="text-[#DC2626] font-bold">→</span>
              <span>Manage product offerings: MODOOLA, Machine Exchange, Titanium Laser</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#093FB4] font-bold">→</span>
              <span>Organize gallery albums by project or product line</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#DC2626] font-bold">→</span>
              <span>Upload and tag images for web showcase</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#093FB4] font-bold">→</span>
              <span>Edit or delete items at any time</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Next Steps</h3>
          <div className="flex flex-col space-y-3">
            <Link
              to="/products"
              className="block w-full py-3 px-4 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold text-center hover:shadow-lg transition"
            >
              Add New Product
            </Link>

            <Link
              to="/gallery"
              className="block w-full py-3 px-4 bg-linear-to-r from-[#093FB4] to-blue-700 rounded-lg font-semibold text-center hover:shadow-lg transition"
            >
              Create Album
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
