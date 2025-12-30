import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  type Role,
  type AdminCreatePayload,
} from '../../api'
import { useToast } from '../../components/Toast'

type Admin = {
  id: string
  name: string
  email: string
  role: Role
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Admin | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('GALLERY_ADMIN')

  const toast = useToast()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await fetchAdmins()
      // expect array of users
      setAdmins(data || [])
    } catch {
      toast.show('Failed to fetch admins', 'error')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole('GALLERY_ADMIN')
    setModalOpen(true)
  }

  function openEdit(a: Admin) {
    setEditing(a)
    setName(a.name)
    setEmail(a.email)
    setPassword('')
    setRole(a.role)
    setModalOpen(true)
  }

  async function handleSave(e?: any) {
    if (e) e.preventDefault()
    if (!name || !email) return toast.show('Name and email required', 'error')
    setSaving(true)
    try {
      const payload: AdminCreatePayload = { name, email, role }
      if (password) payload.password = password

      if (editing) {
        await updateAdmin(editing.id, payload)
        toast.show('Admin updated', 'success')
      } else {
        await createAdmin(payload)
        toast.show('Admin created', 'success')
      }
      setModalOpen(false)
      await load()
    } catch {
      toast.show('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this admin?')) return
    try {
      await deleteAdmin(id)
      toast.show('Admin deleted', 'success')
      await load()
    } catch {
      toast.show('Delete failed', 'error')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded bg-linear-to-br from-[#093FB4] to-blue-700 text-white font-semibold"
        >
          Create Admin
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-400">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id} className="border-t border-gray-700">
                    <td className="py-3">{a.name}</td>
                    <td className="py-3 text-gray-300">{a.email}</td>
                    <td className="py-3 text-gray-300">{a.role}</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="px-3 py-1 rounded bg-gray-700 text-white text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {admins.length === 0 && <div className="text-gray-400 mt-4">No admins found.</div>}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Admin' : 'Create Admin'}>
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder="email@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              placeholder={editing ? 'Leave blank to keep current password' : 'strong password'}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="SUPER_ADMIN">SUPER ADMIN</option>
              <option value="GALLERY_ADMIN">GALLERY ADMIN</option>
              <option value="CONTACTS_ADMIN">CONTACTS ADMIN</option>
            </select>
          </div>

          <div className="pt-4 flex items-center space-x-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-linear-to-br from-[#093FB4] to-blue-700 text-white font-semibold"
              disabled={saving}
            >
              {saving ? 'Saving...' : editing ? 'Update Admin' : 'Create Admin'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-700 text-white">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
