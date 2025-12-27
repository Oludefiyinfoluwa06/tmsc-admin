import { useState } from 'react'
import { Plus } from 'lucide-react'
import AlbumList from '../../components/manage-gallery/AlbumList'
import AlbumForm from '../../components/manage-gallery/AlbumForm'
import Modal from '../../components/Modal'

export default function ManageGallery() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-gray-400 mt-2">Create albums and upload images for product and project showcases.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Albums</h3>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Plus size={20} />
              <span>Create Album</span>
            </button>
          </div>
          <AlbumList />
        </div>
        <div className="p-6 hidden lg:block">
          {/* layout balance */}
        </div>
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create New Album"
      >
        <AlbumForm onClose={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  )
}
