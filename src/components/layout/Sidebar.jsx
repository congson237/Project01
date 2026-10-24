import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Coffee,
  Table,
  ClipboardList,
  History,
  LogOut,
} from 'lucide-react'

const menuItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/menu', icon: Coffee, label: 'Menu' },
  { to: '/tables', icon: Table, label: 'Quản lý Bàn' },
  { to: '/orders', icon: ClipboardList, label: 'Tạo Order' },
  { to: '/history', icon: History, label: 'Lịch sử Order' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-semibold tracking-wide">
          Café <span className="text-amber-500">Manager</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Quản lý quán cà phê</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}