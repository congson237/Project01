export const stats = [
  {
    id: 1,
    title: 'Doanh thu hôm nay',
    value: '4.850.000đ',
    change: '+12.5%',
    isUp: true,
    icon: 'DollarSign',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 2,
    title: 'Đơn hàng hôm nay',
    value: '48',
    change: '+8.2%',
    isUp: true,
    icon: 'ShoppingBag',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 3,
    title: 'Bàn đang dùng',
    value: '9/15',
    change: '60%',
    isUp: true,
    icon: 'Table',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 4,
    title: 'Món hết hàng',
    value: '3',
    change: '-2',
    isUp: false,
    icon: 'AlertCircle',
    color: 'bg-red-50 text-red-600',
  },
]

export const recentOrders = [
  {
    id: 'ORD-001',
    table: 'Bàn 05',
    items: 3,
    total: 145000,
    status: 'completed',
    time: '14:32',
  },
  {
    id: 'ORD-002',
    table: 'Bàn 02',
    items: 2,
    total: 85000,
    status: 'preparing',
    time: '14:28',
  },
  {
    id: 'ORD-003',
    table: 'Bàn 08',
    items: 5,
    total: 230000,
    status: 'pending',
    time: '14:25',
  },
  {
    id: 'ORD-004',
    table: 'Bàn 01',
    items: 1,
    total: 45000,
    status: 'completed',
    time: '14:18',
  },
  {
    id: 'ORD-005',
    table: 'Bàn 12',
    items: 4,
    total: 178000,
    status: 'preparing',
    time: '14:15',
  },
]

export const topSelling = [
  { name: 'Cà phê sữa', sold: 42, revenue: 1260000 },
  { name: 'Bạc xỉu', sold: 38, revenue: 1216000 },
  { name: 'Trà đào', sold: 31, revenue: 1085000 },
  { name: 'Cà phê đen', sold: 29, revenue: 725000 },
  { name: 'Tiramisu', sold: 18, revenue: 810000 },
]