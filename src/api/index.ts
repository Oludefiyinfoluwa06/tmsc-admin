import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
})

export function setToken(token: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

// Gallery images (admin)
export async function fetchGalleryImages(productType = 'MODOOLA', groupId?: string) {
  const params: any = {}
  if (groupId) params.groupId = groupId
  const res = await api.get(`/admin/gallery/${productType}`, { params })
  return res.data
}

export async function createGalleryImage(payload: any) {
  const res = await api.post(`/admin/gallery`, payload)
  return res.data
}

export async function updateGalleryImage(id: string, payload: any) {
  const res = await api.put(`/admin/gallery/${id}`, payload)
  return res.data
}

export async function deleteGalleryImage(id: string) {
  const res = await api.delete(`/admin/gallery/${id}`)
  return res.data
}

export async function reorderGalleryImages(list: Array<any>) {
  const res = await api.patch('/admin/gallery/reorder', list)
  return res.data
}

// Gallery groups
export async function fetchGalleryGroups(productType = 'MODOOLA') {
  const res = await api.get('/admin/gallery-groups', { params: { productType } })
  return res.data
}

// Products
export async function fetchProducts() {
  const res = await api.get('/admin/products')
  return res.data
}

export async function fetchProduct(id: string) {
  const res = await api.get(`/admin/products/${id}`)
  return res.data
}

export async function createProduct(payload: any) {
  const res = await api.post('/admin/products', payload)
  return res.data
}

export async function updateProduct(id: string, payload: any) {
  const res = await api.put(`/admin/products/${id}`, payload)
  return res.data
}

export async function deleteProduct(id: string) {
  const res = await api.delete(`/admin/products/${id}`)
  return res.data
}

export async function createGalleryGroup(payload: any) {
  const res = await api.post('/admin/gallery-groups', payload)
  return res.data
}

export async function updateGalleryGroup(id: string, payload: any) {
  const res = await api.put(`/admin/gallery-groups/${id}`, payload)
  return res.data
}

export async function deleteGalleryGroup(id: string) {
  const res = await api.delete(`/admin/gallery-groups/${id}`)
  return res.data
}

// Upload files
export async function uploadGalleryFiles(files: FileList | File[]) {
  const form = new FormData()
  const list: File[] = Array.from(files as any)
  list.forEach((f: File) => form.append('files', f))
  try {
    const res = await api.post('/upload/gallery', form)
    return res.data
  } catch (error) {
    console.log('Upload error', error)
  }
}

export async function fetchAdmins() {
  const res = await api.get('/admin/users')
  return res.data
}

export type Role = 'SUPER_ADMIN' | 'GALLERY_ADMIN' | 'CONTACTS_ADMIN'

export interface AdminCreatePayload {
  name: string
  email: string
  password?: string
  role: Role
}

export async function createAdmin(payload: AdminCreatePayload) {
  const res = await api.post('/admin/users', payload)
  return res.data
}

export async function updateAdmin(id: string, payload: Partial<AdminCreatePayload>) {
  const res = await api.put(`/admin/users/${id}`, payload)
  return res.data
}

export async function deleteAdmin(id: string) {
  const res = await api.delete(`/admin/users/${id}`)
  return res.data
}

export default api
