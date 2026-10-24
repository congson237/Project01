import { useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { menuItems as initialItems, menuCategories } from '../data/menu'
import Modal from '../components/ui/Modal'

const emptyForm = {
  name: '',
  categoryId: 1,
  price: '',
  description: '',
  image: '',
  status: 'available',
}

export default function MenuPage() {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null) // null = đang thêm mới
  const [form, setForm] = useState(emptyForm)

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      selectedCategory === 'all' || item.categoryId === Number(selectedCategory)
    return matchSearch && matchCategory
  })

  // Mở modal thêm mới
  const openAddModal = () => {
    setEditingItem(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  // Mở modal sửa
  const openEditModal = (item) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price,
      description: item.description,
      image: item.image,
      status: item.status,
    })
    setIsModalOpen(true)
  }

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setForm(emptyForm)
  }

  // Lưu (thêm hoặc sửa)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.price) {
      toast.error('Vui lòng nhập tên món và giá')
      return
    }

    if (editingItem) {
      // Sửa
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...form, price: Number(form.price) }
            : item
        )
      )
      toast.success('Cập nhật món thành công!')
    } else {
      // Thêm mới
      const newItem = {
        id: Date.now(),
        ...form,
        price: Number(form.price),
        image: form.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
      }
      setItems((prev) => [newItem, ...prev])
      toast.success('Thêm món mới thành công!')
    }

    closeModal()
  }

  // Xóa món
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món này?')) {
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast.success('Đã xóa món')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Menu</h2>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {items.length} món</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={18} />
          Thêm món mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm món..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="all">Tất cả danh mục</option>
          {menuCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid món */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.status === 'out_of_stock' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-amber-600">
                  {item.price.toLocaleString('vi-VN')}đ
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-gray-400">Không tìm thấy món nào</div>
      )}

      {/* ========== MODAL THÊM / SỬA ========== */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Sửa món' : 'Thêm món mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên món *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ví dụ: Cà phê sữa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {menuCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="30000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Mô tả ngắn về món"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link ảnh
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="available">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
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
              {editingItem ? 'Cập nhật' : 'Thêm món'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}