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
import { ArrowLeft, History, Download, Upload, Plus, Utensils, ClipboardList, BarChart, Home } from "lucide-react"

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
  const [currentTab, setCurrentTab] = useState(user?.role === "chef" ? "chef" : "dashboard")

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
    <div className="flex h-full w-full">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} userRole={user?.role || ""} user={user} logout={logout} />
      <main className="flex-1 overflow-auto p-4 lg:p-6 bg-muted/40 rounded-tl-lg shadow-inner">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" size="icon" className="lg:hidden">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Orqaga</span>
            </Button> */}
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Joriy: <span className="font-medium capitalize">{currentTab.replace('-', ' ')}</span></p>
            <ThemeToggle />
            {/* <div className="relative">
              <Button variant="ghost" size="icon">
                <History className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
              
            </div>
             */}
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full flex-1">
          <TabsContent value="dashboard" className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <p className="text-muted-foreground mb-6">Umumiy ko'rinish va statistika</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="p-4 bg-background rounded-lg shadow">
                <h3 className="text-lg font-semibold">Jami Stollar</h3>
                <p className="text-3xl font-bold mt-2">{tables.length}</p>
                <p className="text-sm text-muted-foreground">{tables.filter(table => table.status === "Band").length} band, {tables.filter(table => table.status === "Bo'sh").length} bo'sh</p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow">
                <h3 className="text-lg font-semibold">Faol Buyurtmalar</h3>
                <p className="text-3xl font-bold mt-2">{orders.filter(order => order.status !== "completed").length}</p>
                <p className="text-sm text-muted-foreground">{orders.filter(order => order.status === "completed").length} tugallangan</p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow">
                <h3 className="text-lg font-semibold">Bugungi Daromad</h3>
                <p className="text-3xl font-bold mt-2">{orders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString()).reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()} so'm</p>
                <p className="text-sm text-muted-foreground">Jami: {orders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()} so'm</p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow">
                <h3 className="text-lg font-semibold">Band Stollar</h3>
                <p className="text-3xl font-bold mt-2">{((tables.filter(table => table.status === "Band").length / tables.length) * 100 || 0).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">{tables.filter(table => table.status === "Band").length} / {tables.length}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Stollar Holati</h2>
            <p className="text-muted-foreground mb-6">Real vaqt stollar holati</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
              {tables.map((table) => (
                <div key={table.id} className="p-4 bg-background rounded-lg shadow flex flex-col items-center justify-center">
                  <p className="font-semibold text-lg">{table.name}</p>
                  <p className={`text-sm ${table.status === "Bo'sh" ? "text-green-500" : "text-red-500"}`}>{table.status}</p>
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-muted-foreground">Bo'sh ({tables.filter(table => table.status === "Bo'sh").length})</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-muted-foreground">Band ({tables.filter(table => table.status === "Band").length})</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-muted-foreground">Rezerv ({tables.filter(table => table.status === "Rezerv").length})</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">So'nggi Buyurtmalar</h2>
            <p className="text-muted-foreground mb-6">Eng yangi 5 ta buyurtma</p>
            <div className="p-4 bg-background rounded-lg shadow">
              {orders.length === 0 ? (
                <p className="text-muted-foreground">Hozircha buyurtmalar yo'q</p>
              ) : (
                <ul className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <li key={order.id} className="flex items-center justify-between">
                      <span>Buyurtma #{order.id} - {order.totalPrice.toLocaleString()} so'm</span>
                      <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          {(user?.role === "admin" || user?.role === "waiter") && (
            <TabsContent value="tables" className="space-y-4">
              <TableManagement tables={tables} setTables={setTables} userRole={user?.role || ""} />
            </TabsContent>
          )}

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
              <ChefDashboard orders={orders} setOrders={setOrders} menu={menu} tables={tables} setTables={setTables} chefName={user?.name || ""} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
