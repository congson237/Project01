import { useState } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, Search } from 'lucide-react'
import { toast } from 'sonner'
import { menuItems, menuCategories } from '../data/menu'
import { tables as initialTables } from '../data/tables'

export default function OrdersPage() {
  const [tables, setTables] = useState(initialTables)
  const [selectedTable, setSelectedTable] = useState(null)
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [note, setNote] = useState('')

  // Lọc món còn hàng
  const filteredItems = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      selectedCategory === 'all' || item.categoryId === Number(selectedCategory)
    return matchSearch && matchCategory && item.status === 'available'
  })

  // Chỉ lấy bàn trống
  const availableTables = tables.filter((t) => t.status === 'available')

  // Thêm món vào giỏ
  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id)
      if (exist) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    toast.success(`Đã thêm ${item.name}`)
  }

  // Tăng / giảm số lượng
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Xóa món
  const removeFromCart = (id) => {
    const item = cart.find((i) => i.id === id)
    setCart((prev) => prev.filter((item) => item.id !== id))
    if (item) toast.message(`Đã xóa ${item.name}`)
  }

  // Tính tổng
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Tạo order
  const handleCreateOrder = () => {
    if (!selectedTable) {
      toast.error('Vui lòng chọn bàn!')
      return
    }
    if (cart.length === 0) {
      toast.error('Giỏ hàng đang trống!')
      return
    }

    const tableName = tables.find((t) => t.id === selectedTable)?.name

    // Cập nhật trạng thái bàn → occupied
    setTables((prev) =>
      prev.map((t) =>
        t.id === selectedTable
          ? { ...t, status: 'occupied', currentOrder: `ORD-${Date.now().toString().slice(-4)}` }
          : t
      )
    )

    toast.success(`Tạo order thành công cho ${tableName}!`)

    // Reset
    setCart([])
    setSelectedTable(null)
    setNote('')
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-6">
      {/* ========== CỘT TRÁI ========== */}
      <div className="flex-1 flex flex-col gap-5 overflow-hidden">
        {/* Chọn bàn */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Chọn bàn</h3>
          <div className="flex flex-wrap gap-2">
            {availableTables.length > 0 ? (
              availableTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedTable === table.id
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                  }`}
                >
                  {table.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400">Không còn bàn trống</p>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-800">Danh sách món</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
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
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="all">Tất cả</option>
                {menuCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-colors cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                    <p className="text-sm font-semibold text-amber-600 mt-1">
                      {item.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <button className="self-center p-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Không tìm thấy món nào
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== CỘT PHẢI: Giỏ hàng ========== */}
      <div className="w-full lg:w-96 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <ShoppingCart size={18} className="text-amber-600" />
          <h3 className="font-semibold text-gray-800">Đơn hàng hiện tại</h3>
          {cart.length > 0 && (
            <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} món
            </span>
          )}
        </div>

        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            Bàn đang chọn:{' '}
            <span className="font-semibold text-gray-800">
              {selectedTable
                ? tables.find((t) => t.id === selectedTable)?.name
                : 'Chưa chọn'}
            </span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Chưa có món nào
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                  <p className="text-xs text-amber-600 font-medium mt-0.5">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ít đá, không đường..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tổng cộng</span>
            <span className="text-xl font-bold text-amber-600">
              {total.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={cart.length === 0 || !selectedTable}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Tạo Order
          </button>
        </div>
      </div>
    </div>
  )
}