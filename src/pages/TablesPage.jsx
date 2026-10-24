import { useState } from 'react'
import { Plus, Users, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { tables as initialTables } from '../data/tables'
import Modal from '../components/ui/Modal'

const statusConfig = {
  available: {
    label: 'Trống',
    bg: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  occupied: {
    label: 'Đang dùng',
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
  reserved: {
    label: 'Đã đặt',
    bg: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
  },
}

const emptyForm = {
  name: '',
  capacity: 2,
  floor: 1,
  status: 'available',
}

export default function TablesPage() {
  const [tables, setTables] = useState(initialTables)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFloor, setFilterFloor] = useState('all')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filteredTables = tables.filter((table) => {
    const matchStatus = filterStatus === 'all' || table.status === filterStatus
    const matchFloor = filterFloor === 'all' || table.floor === Number(filterFloor)
    return matchStatus && matchFloor
  })

  const counts = {
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  }

  const openAddModal = () => {
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên bàn')
      return
    }

    const newTable = {
      id: Date.now(),
      name: form.name,
      capacity: Number(form.capacity),
      floor: Number(form.floor),
      status: form.status,
    }

    setTables((prev) => [...prev, newTable])
    toast.success(`Đã thêm ${form.name} thành công!`)
    closeModal()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Bàn</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng {tables.length} bàn
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={18} />
          Thêm bàn mới
        </button>
      </div>

      {/* Stats nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <div>
            <p className="text-sm text-gray-500">Bàn trống</p>
            <p className="text-xl font-bold text-gray-800">{counts.available}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div>
            <p className="text-sm text-gray-500">Đang dùng</p>
            <p className="text-xl font-bold text-gray-800">{counts.occupied}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div>
            <p className="text-sm text-gray-500">Đã đặt trước</p>
            <p className="text-xl font-bold text-gray-800">{counts.reserved}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={16} />
          Lọc:
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Trống</option>
          <option value="occupied">Đang dùng</option>
          <option value="reserved">Đã đặt</option>
        </select>

        <select
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="all">Tất cả tầng</option>
          <option value="1">Tầng 1</option>
          <option value="2">Tầng 2</option>
        </select>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTables.map((table) => {
          const config = statusConfig[table.status]
          return (
            <div
              key={table.id}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${config.bg}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800">{table.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                  {config.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                <Users size={14} />
                <span>{table.capacity} người</span>
              </div>

              <p className="text-xs text-gray-500">Tầng {table.floor}</p>

              {table.currentOrder && (
                <p className="mt-2 text-xs font-medium text-gray-700">
                  Đơn: {table.currentOrder}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          Không tìm thấy bàn nào
        </div>
      )}

      {/* ========== MODAL THÊM BÀN ========== */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Thêm bàn mới">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên bàn *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ví dụ: Bàn 16"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sức chứa
              </label>
              <select
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value={2}>2 người</option>
                <option value={4}>4 người</option>
                <option value={6}>6 người</option>
                <option value={8}>8 người</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tầng
              </label>
              <select
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value={1}>Tầng 1</option>
                <option value={2}>Tầng 2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái ban đầu
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="available">Trống</option>
              <option value="reserved">Đã đặt</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Thêm bàn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}