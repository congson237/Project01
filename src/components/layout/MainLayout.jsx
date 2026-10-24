import { Outlet, useLocation } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
const pageTitles = {
  '/': 'Dashboard',
  '/menu': 'Quản lý Menu',
  '/tables': 'Quản lý Bàn',
  '/orders': 'Tạo Order',
  '/history': 'Lịch sử Order',
}
export default function MainLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Café Manager'
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
       <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
         <Outlet />
        </main>
      </div>
    </div>
  )
}