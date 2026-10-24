import { useState } from 'react'
import { Search, Eye, Clock, Filter } from 'lucide-react'
import { orderHistory } from '../data/orders'

const statusConfig = {
  completed: { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-700' },
  preparing: { label: 'Đang làm', className: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Chờ xử lý', className: 'bg-amber-100 text-amber-700' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
}

const paymentMap = {
  cash: 'Tiền mặt',
  transfer: 'Chuyển khoản',
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = orderHistory.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.table.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || order.status === filterStatus
    return matchSearch && matchStatus
  })

  const formatTime = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử Order</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tổng cộng {orderHistory.length} đơn hàng
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc bàn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="preparing">Đang làm</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 font-medium">Mã đơn</th>
                <th className="px-5 py-3 font-medium">Bàn</th>
                <th className="px-5 py-3 font-medium">Số món</th>
                <th className="px-5 py-3 font-medium">Tổng tiền</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Thanh toán</th>
                <th className="px-5 py-3 font-medium">Thời gian</th>
                <th className="px-5 py-3 font-medium text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-gray-800">{order.id}</td>
                  <td className="px-5 py-3.5 text-gray-600">{order.table}</td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">
                    {order.total.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].className}`}
                    >
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {order.paymentMethod ? paymentMap[order.paymentMethod] : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={13} />
                      {formatTime(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            Không tìm thấy đơn hàng nào
          </div>
        )}
      </div>

      {/* Modal chi tiết đơn */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Chi tiết {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Bàn</span>
                <span className="font-medium">{selectedOrder.table}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trạng thái</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedOrder.status].className}`}
                >
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Thời gian tạo</span>
                <span>{formatTime(selectedOrder.createdAt)}</span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Danh sách món</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <span className="font-semibold text-gray-800">Tổng cộng</span>
                <span className="font-bold text-amber-600 text-lg">
                  {selectedOrder.total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}