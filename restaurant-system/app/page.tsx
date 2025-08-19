"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { TableManagement } from "@/components/table-management"
import { OrderManagement } from "@/components/order-management"
import { MenuManagement } from "@/components/menu-management"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useBusinessLogic } from "@/hooks/use-business-logic"
import { ReportsManagement } from "@/components/reports-management"

// Data types
interface MenuItem {
  id: string
  name: string
  category: "Taomlar" | "Salatlar" | "Ichimliklar"
  price: number
  stock: number
  description?: string
  isActive: boolean
}

interface OrderItem {
  menuItemId: string
  quantity: number
}

interface Order {
  id: string
  tableId: string
  items: OrderItem[]
  totalPrice: number
  status: "active" | "completed"
  createdAt: Date
}

interface Table {
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

// Mock data
const initialMenu: MenuItem[] = [
  {
    id: "1",
    name: "Osh",
    category: "Taomlar",
    price: 25000,
    stock: 50,
    description: "An'anaviy o'zbek oshi",
    isActive: true,
  },
  {
    id: "2",
    name: "Manti",
    category: "Taomlar",
    price: 20000,
    stock: 30,
    description: "Bug'da pishirilgan manti",
    isActive: true,
  },
  {
    id: "3",
    name: "Lag'mon",
    category: "Taomlar",
    price: 18000,
    stock: 40,
    description: "Qo'l lag'moni",
    isActive: true,
  },
  {
    id: "4",
    name: "Achichuk salat",
    category: "Salatlar",
    price: 8000,
    stock: 25,
    description: "Yangi sabzavotlar salati",
    isActive: true,
  },
  { id: "5", name: "Olivye", category: "Salatlar", price: 12000, stock: 20, description: "Rus salati", isActive: true },
  { id: "6", name: "Choy", category: "Ichimliklar", price: 3000, stock: 100, description: "Qora choy", isActive: true },
  {
    id: "7",
    name: "Kofe",
    category: "Ichimliklar",
    price: 8000,
    stock: 50,
    description: "Arabika kofe",
    isActive: true,
  },
  {
    id: "8",
    name: "Sharbat",
    category: "Ichimliklar",
    price: 6000,
    stock: 30,
    description: "Tabiiy mevali sharbat",
    isActive: true,
  },
]

const initialTables: Table[] = [
  { id: "1", name: "Stol 1", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 4 },
  { id: "2", name: "Stol 2", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 2 },
  { id: "3", name: "Stol 3", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 6 },
  { id: "4", name: "Stol 4", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 4 },
  { id: "5", name: "Stol 5", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 8 },
  { id: "6", name: "Stol 6", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 2 },
  { id: "7", name: "Stol 7", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 4 },
  { id: "8", name: "Stol 8", status: "Bo'sh", orders: [], totalAmount: 0, capacity: 6 },
]

export default function RestaurantManagement() {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [orders, setOrders] = useState<Order[]>([])
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const { user, logout, isAuthenticated } = useAuth()

  const { generateStockAlerts } = useBusinessLogic()

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate stock alerts and log them
      const alerts = generateStockAlerts(menu)
      if (alerts.criticalAlerts.length > 0) {
        console.log("[v0] Critical stock alerts:", alerts.criticalAlerts)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [menu, generateStockAlerts])

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />
  }

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "Bo'sh":
        return "bg-green-500"
      case "Band":
        return "bg-red-500"
      case "Tozalanmoqda":
        return "bg-yellow-500"
      case "Rezerv":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const updateTableStatus = (tableId: string, status: Table["status"]) => {
    setTables((prev) => prev.map((table) => (table.id === tableId ? { ...table, status } : table)))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restoran Boshqaruv Tizimi</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Chiqish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tables">Stollar</TabsTrigger>
            <TabsTrigger value="orders">Buyurtmalar</TabsTrigger>
            <TabsTrigger value="menu">Menyu</TabsTrigger>
            <TabsTrigger value="reports">Hisobotlar</TabsTrigger>
            {(user?.role === "admin" || user?.role === "manager") && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <TableManagement tables={tables} setTables={setTables} userRole={user?.role || ""} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrderManagement
              orders={orders}
              setOrders={setOrders}
              tables={tables}
              setTables={setTables}
              menu={menu}
              setMenu={setMenu}
              userRole={user?.role || ""}
              userName={user?.name || ""}
            />
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <MenuManagement menu={menu} setMenu={setMenu} userRole={user?.role || ""} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ReportsManagement orders={orders} menu={menu} />
          </TabsContent>

          {(user?.role === "admin" || user?.role === "manager") && (
            <TabsContent value="admin" className="space-y-4">
              <AdminDashboard orders={orders} tables={tables} menu={menu} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
