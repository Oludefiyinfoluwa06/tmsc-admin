import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import ManageProducts from './pages/ManageProducts'
import ManageGallery from './pages/ManageGallery'
import ManageAdmins from './pages/ManageAdmins'
import MainLayout from './components/layout/MainLayout'
import { ToastProvider } from './components/Toast'
import RequireAuth from './components/layout/RequireAuth'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="admins" element={<ManageAdmins />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
