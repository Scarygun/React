export type UserRole = "admin" | "waiter" | "manager" | "chef"

export interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

export interface MenuItem {
  id: string
  name: string
  category: "Taomlar" | "Salatlar" | "Ichimliklar"
  price: number
  stock: number
  description?: string
  isActive: boolean
}

export interface OrderItem {
  menuItemId: string
  quantity: number
  price: number
  name: string
}

export interface Order {
  id: string
  tableId: string
  items: OrderItem[]
  totalPrice: number
  status: "active" | "in-progress" | "completed" | "cancelled"
  createdAt: Date
  completedAt?: Date
  waiterName?: string
}

export interface Table {
  id: string
  name: string
  status: "Bo'sh" | "Band" | "Tozalanmoqda" | "Rezerv"
  orders: string[]
  totalAmount: number
  capacity: number
  assignedWaiter?: string
  occupiedSince?: Date
  reservedBy?: string
  reservedTime?: Date
} 