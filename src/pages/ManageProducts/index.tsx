import { useState } from 'react'
import { Plus } from 'lucide-react'
import ProductList from '../../components/manage-products/ProductList'
import ProductForm from '../../components/manage-products/ProductForm'
import Modal from '../../components/Modal'

export default function ManageProducts() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-gray-400 mt-2">Create, edit and remove product packs for MODOOLA, Machine Exchange, and Titanium Laser.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Products</h3>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
          <ProductList />
        </div>
        <div className="p-6 hidden lg:block">
          {/* empty aside preserved for layout balance */}
        </div>
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New Product"
      >
        <ProductForm onClose={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  )
}
