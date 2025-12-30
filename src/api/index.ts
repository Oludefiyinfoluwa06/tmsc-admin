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
  console.log('fetchGalleryImages', res)
  return res.data
}

export async function createGalleryImage(productType = 'MODOOLA', payload: any) {
  const res = await api.post(`/admin/gallery/${productType}`, payload)
  console.log('createGalleryImage', res)
  return res.data
}

export async function updateGalleryImage(id: string, payload: any) {
  const res = await api.put(`/admin/gallery/${id}`, payload)
  console.log('updateGalleryImage', res)
  return res.data
}

export async function deleteGalleryImage(id: string) {
  const res = await api.delete(`/admin/gallery/${id}`)
  console.log('deleteGalleryImage', res)
  return res.data
}

export async function reorderGalleryImages(list: Array<any>) {
  const res = await api.patch('/admin/gallery/reorder', list)
  console.log('reorderGalleryImages', res)
  return res.data
}

// Gallery groups
export async function fetchGalleryGroups(productType = 'MODOOLA') {
  const res = await api.get('/admin/gallery-groups', { params: { productType } })
  console.log('fetchGalleryGroups', res)
  return res.data
}

// Products
export async function fetchProducts() {
  const res = await api.get('/admin/products')
  console.log('fetchProducts', res)
  return res.data
}

export async function fetchProduct(id: string) {
  const res = await api.get(`/admin/products/${id}`)
  console.log('fetchProduct', res)
  return res.data
}

export async function createProduct(payload: any) {
  // const config = (payload instanceof FormData) ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
  try {
    const res = await api.post('/admin/products', payload)
    console.log('createProduct', res)
    return res.data
  } catch (error) {
    console.log({ createProductError: error });
  }
}

export async function updateProduct(id: string, payload: any) {
  const config = (payload instanceof FormData) ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
  const res = await api.put(`/admin/products/${id}`, payload, config)
  console.log('updateProduct', res)
  return res.data
}

export async function deleteProduct(id: string) {
  const res = await api.delete(`/admin/products/${id}`)
  console.log('deleteProduct', res)
  return res.data
}

export async function createGalleryGroup(payload: any) {
  const res = await api.post('/admin/gallery-groups', payload)
  console.log('createGalleryGroup', res)
  return res.data
}

export async function updateGalleryGroup(id: string, payload: any) {
  const res = await api.put(`/admin/gallery-groups/${id}`, payload)
  console.log('updateGalleryGroup', res)
  return res.data
}

export async function deleteGalleryGroup(id: string) {
  const res = await api.delete(`/admin/gallery-groups/${id}`)
  console.log('deleteGalleryGroup', res)
  return res.data
}

// Upload files
export async function uploadGalleryFiles(files: FileList | File[]) {
  const form = new FormData()
  const list: File[] = Array.from(files as any)
  list.forEach((f: File) => form.append('files', f))
  const res = await api.post('/upload/gallery', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  console.log('uploadGalleryFiles', res)
  return res.data
}

export default api
