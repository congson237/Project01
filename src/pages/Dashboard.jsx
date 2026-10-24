import {
  DollarSign,
  ShoppingBag,
  Table,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react'
import { stats, recentOrders, topSelling } from '../data/dashboard'

const iconMap = {
  DollarSign,
  ShoppingBag,
  Table,
  AlertCircle,
}

const statusMap = {
  completed: { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-700' },
  preparing: { label: 'Đang làm', className: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Chờ xử lý', className: 'bg-amber-100 text-amber-700' },
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hoạt động hôm nay</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${item.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm">
                {item.isUp ? (
                  <TrendingUp size={14} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={14} className="text-red-500" />
                )}
                <span className={item.isUp ? 'text-emerald-600' : 'text-red-600'}>
                  {item.change}
                </span>
                <span className="text-gray-400 ml-1">so với hôm qua</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 2 cột: Đơn gần đây + Món bán chạy */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Đơn hàng gần đây</h3>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Xem tất cả
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Bàn</th>
                  <th className="px-5 py-3 font-medium">Số món</th>
                  <th className="px-5 py-3 font-medium">Tổng tiền</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{order.id}</td>
                    <td className="px-5 py-3.5 text-gray-600">{order.table}</td>
                    <td className="px-5 py-3.5 text-gray-600">{order.items}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {order.total.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusMap[order.status].className}`}
                      >
                        {statusMap[order.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        {order.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Món bán chạy</h3>
          </div>
          <div className="p-5 space-y-4">
            {topSelling.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.sold} đã bán</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {(item.revenue / 1000).toFixed(0)}k
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}