"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/sidebar"
import { ChefDashboard } from "@/components/chef-dashboard"
import { MenuItem, Order, Table } from "@/types"
import { UserRole } from "@/types"

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
  const { user, logout, isAuthenticated } = useAuth()
  const [currentTab, setCurrentTab] = useState(user?.role === "chef" ? "chef" : "tables")

  const { generateStockAlerts } = useBusinessLogic()

  useEffect(() => {
    const savedTables = localStorage.getItem("restaurant-tables")
    const savedOrders = localStorage.getItem("restaurant-orders")
    const savedMenu = localStorage.getItem("restaurant-menu")

    if (savedTables) setTables(JSON.parse(savedTables))
    if (savedOrders) setOrders(JSON.parse(savedOrders))
    if (savedMenu) setMenu(JSON.parse(savedMenu))
  }, [])

  useEffect(() => {
    localStorage.setItem("restaurant-tables", JSON.stringify(tables))
  }, [tables])

  useEffect(() => {
    localStorage.setItem("restaurant-orders", JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem("restaurant-menu", JSON.stringify(menu))
  }, [menu])

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

  const handleBackupData = () => {
    const backupData = {
      tables,
      orders,
      menu,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `restaurant-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleRestoreData = (data: any) => {
    if (data.tables) setTables(data.tables)
    if (data.orders) setOrders(data.orders)
    if (data.menu) setMenu(data.menu)
    alert("Ma'lumotlar muvaffaqiyatli tiklandi!")
  }

  const getOrderCount = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      today: orders.filter((order) => new Date(order.createdAt) >= today).length,
      week: orders.filter((order) => new Date(order.createdAt) >= weekStart).length,
      month: orders.filter((order) => new Date(order.createdAt) >= monthStart).length,
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center restaurant-bg">
        <Image src="/placeholder-logo.png" alt="Logo" width={200} height={200} className="mr-10" />
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mx-auto rounded-lg shadow-xl p-6 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-gray-50">Restoran Boshqaruv Tizimi</h1>
          {/* Removed user info and logout button as they are now in the sidebar */}
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full flex">
          <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} userRole={user?.role || ""} user={user} logout={logout} />
          <div className="flex-1 ml-4">
            <TabsContent value="tables" className="space-y-4">
              <TableManagement tables={tables} setTables={setTables} userRole={user?.role || ""} />
            </TabsContent>

            {(user?.role === "admin" || user?.role === "waiter") && (
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
            )}

            {(user?.role === "admin" || user?.role === "waiter") && (
              <TabsContent value="menu" className="space-y-4">
                <MenuManagement menu={menu} setMenu={setMenu} userRole={user?.role || ""} />
              </TabsContent>
            )}

            {(user?.role === "admin") && (
              <TabsContent value="reports" className="space-y-4">
                <ReportsManagement orders={orders} menu={menu} />
              </TabsContent>
            )}

            {(user?.role === "admin") && (
              <TabsContent value="admin" className="space-y-4">
                <AdminDashboard orders={orders} tables={tables} menu={menu} />
              </TabsContent>
            )}

            {(user?.role === "chef" || user?.role === "admin") && (
              <TabsContent value="chef" className="space-y-4">
                <ChefDashboard orders={orders} setOrders={setOrders} menu={menu} tables={tables} chefName={user?.name || ""} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
