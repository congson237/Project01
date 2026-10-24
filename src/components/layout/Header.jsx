import { Bell, Search, User } from 'lucide-react'

export default function Header({ title }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search (tùy chọn) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-amber-700" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-400">Quản lý</p>
          </div>
        </div>
      </div>
    </header>
  )
}