import { useState } from 'react'
import { Plus } from 'lucide-react'
import CenterList from '../../components/manage-modular-centers/CenterList'
import CenterForm from '../../components/manage-modular-centers/CenterForm'
import Modal from '../../components/Modal'

export default function ManageCenters() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-gray-400 mt-2">Create, edit and remove modular centers.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Modular Centers</h3>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-[#DC2626] to-[#B21C1C] rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Plus size={20} />
              <span>Add Center</span>
            </button>
          </div>
          <CenterList refreshSignal={refreshKey} />
        </div>
        <div className="p-6 hidden lg:block">
          {/* empty aside preserved for layout balance */}
        </div>
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New Center"
      >
        <CenterForm onClose={() => setIsFormOpen(false)} onSaved={() => { setRefreshKey(k => k + 1) }} />
      </Modal>
    </div>
  )
}
