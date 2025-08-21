"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  Package,
  AlertTriangle,
  Download,
} from "lucide-react"
import { MenuItem, Order, Table } from "@/types"

interface AdminDashboardProps {
  orders: Order[]
  tables: Table[]
  menu: MenuItem[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdminDashboard({ orders, tables, menu }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState("today")

  // Calculate key metrics
  const metrics = useMemo(() => {
    const completedOrders = orders.filter((order) => order.status === "completed")
    const activeOrders = orders.filter((order) => order.status === "active")
    const cancelledOrders = orders.filter((order) => order.status === "cancelled")

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

    const occupiedTables = tables.filter((table) => table.status === "Band")
    const tableUtilization = (occupiedTables.length / tables.length) * 100

    const lowStockItems = menu.filter((item) => item.stock <= 10 && item.stock > 0)
    const outOfStockItems = menu.filter((item) => item.stock === 0)

    return {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      activeOrders: activeOrders.length,
      cancelledOrders: cancelledOrders.length,
      averageOrderValue,
      tableUtilization,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
    }
  }, [orders, tables, menu])

  // Sales by category data
  const salesByCategory = useMemo(() => {
    const categoryData: Record<string, number> = {}

    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        order.items.forEach((item) => {
          const menuItem = menu.find((m) => m.id === item.menuItemId)
          if (menuItem) {
            const category = menuItem.category
            categoryData[category] = (categoryData[category] || 0) + item.quantity * item.price
          }
        })
      })

    return Object.entries(categoryData).map(([category, revenue]) => ({
      category,
      revenue,
      name: category,
    }))
  }, [orders, menu])

  // Popular items data
  const popularItems = useMemo(() => {
    const itemData: Record<string, { name: string; quantity: number; revenue: number }> = {}

    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!itemData[item.menuItemId]) {
            itemData[item.menuItemId] = {
              name: item.name,
              quantity: 0,
              revenue: 0,
            }
          }
          itemData[item.menuItemId].quantity += item.quantity
          itemData[item.menuItemId].revenue += item.quantity * item.price
        })
      })

    return Object.values(itemData)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
  }, [orders])

  // Hourly sales data (mock data for demonstration)
  const hourlySales = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    return hours.map((hour) => ({
      hour: `${hour}:00`,
      sales: Math.floor(Math.random() * 500000) + 100000, // Mock data
      orders: Math.floor(Math.random() * 20) + 5, // Mock data
    }))
  }, [])

  // Table performance data
  const tablePerformance = useMemo(() => {
    return tables.map((table) => {
      const tableOrders = orders.filter((order) => order.tableId === table.id && order.status === "completed")
      const revenue = tableOrders.reduce((sum, order) => sum + order.totalPrice, 0)
      return {
        name: table.name,
        orders: tableOrders.length,
        revenue,
        utilization: table.status === "Band" ? 100 : 0,
      }
    })
  }, [tables, orders])

  const exportReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      metrics,
      salesByCategory,
      popularItems,
      tablePerformance,
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `restaurant-report-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg bg-card shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Restoran faoliyati haqida umumiy ma'lumot</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Bugun</SelectItem>
              <SelectItem value="week">Bu hafta</SelectItem>
              <SelectItem value="month">Bu oy</SelectItem>
              <SelectItem value="year">Bu yil</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Hisobot
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bugungi daromad</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.totalRevenue.toLocaleString()} so'm</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami buyurtmalar</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400">+8.2%</span>
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">O'rtacha buyurtma</p>
                <p className="text-2xl font-bold">{metrics.averageOrderValue.toLocaleString()} so'm</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">-2.1%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stollar bandligi</p>
                <p className="text-2xl font-bold">{metrics.tableUtilization.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-600 dark:text-orange-400">Real vaqt</span>
                </div>
              </div>
              <Package className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(metrics.lowStockItems > 0 || metrics.outOfStockItems > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.lowStockItems > 0 && (
            <Card className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
              <CardContent className="p-4 flex items-center gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Kam qolgan mahsulotlar</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{metrics.lowStockItems} ta mahsulot kam qolgan</p>
                </div>
              </CardContent>
            </Card>
          )}

          {metrics.outOfStockItems > 0 && (
            <Card className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
              <CardContent className="p-4 flex items-center gap-4">
                <Package className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">Tugab qolgan mahsulotlar</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{metrics.outOfStockItems} ta mahsulot tugab qolgan</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Charts and Analytics */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 h-auto p-1 bg-muted rounded-md">
          <TabsTrigger value="sales">Sotuv tahlili</TabsTrigger>
          <TabsTrigger value="menu">Menyu tahlili</TabsTrigger>
          <TabsTrigger value="tables">Stollar tahlili</TabsTrigger>
          <TabsTrigger value="performance">Ishlash ko'rsatkichlari</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Kategoriya bo'yicha sotuv</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesByCategory.map((category, index) => {
                    const total = salesByCategory.reduce((sum, cat) => sum + cat.revenue, 0)
                    const percentage = total > 0 ? (category.revenue / total) * 100 : 0
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                          />
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{category.revenue.toLocaleString()} so'm</p>
                          <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Hourly Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Soatlik sotuv (bugun)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {hourlySales
                    .filter((_, index) => index % 2 === 0)
                    .map((hour, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded bg-background hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">{hour.hour}</span>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{hour.sales.toLocaleString()} so'm</p>
                          <p className="text-xs text-muted-foreground">{hour.orders} buyurtma</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Buyurtmalar holati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                  <p className="text-3xl font-bold">{metrics.completedOrders}</p>
                  <p className="text-sm">Tugallangan</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  <p className="text-3xl font-bold">{metrics.activeOrders}</p>
                  <p className="text-sm">Faol</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                  <p className="text-3xl font-bold">{metrics.cancelledOrders}</p>
                  <p className="text-sm">Bekor qilingan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6 mt-4">
          {/* Popular Items */}
          <Card>
            <CardHeader>
              <CardTitle>Eng mashhur mahsulotlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularItems.slice(0, 8).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">#{index + 1} eng mashhur</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.quantity} dona</p>
                      <p className="text-sm text-muted-foreground">{item.revenue.toLocaleString()} so'm</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Menyu ishlashi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left p-3 font-medium">Mahsulot</th>
                      <th className="text-left p-3 font-medium">Kategoriya</th>
                      <th className="text-right p-3 font-medium">Sotilgan</th>
                      <th className="text-right p-3 font-medium">Daromad</th>
                      <th className="text-right p-3 font-medium">Zaxira</th>
                      <th className="text-center p-3 font-medium">Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularItems.slice(0, 10).map((item, index) => {
                      const menuItem = menu.find((m) => m.name === item.name)
                      return (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3 text-muted-foreground">{menuItem?.category}</td>
                          <td className="p-3 text-right">{item.quantity}</td>
                          <td className="p-3 text-right">{item.revenue.toLocaleString()} so'm</td>
                          <td className="p-3 text-right">{menuItem?.stock}</td>
                          <td className="p-3 text-center">
                            {menuItem?.stock === 0 ? (
                              <Badge variant="destructive">Tugagan</Badge>
                            ) : menuItem?.stock && menuItem.stock <= 10 ? (
                              <Badge variant="secondary">Kam</Badge>
                            ) : (
                              <Badge variant="default">Yaxshi</Badge>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6 mt-4">
          {/* Table Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Stollar ishlashi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tablePerformance.map((table, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                    <h3 className="font-semibold text-lg">{table.name}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Buyurtmalar: <span className="font-medium text-foreground">{table.orders}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Daromad: <span className="font-medium text-foreground">{table.revenue.toLocaleString()} so'm</span>
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(table.utilization, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Bandlik: {table.utilization}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Table Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
              <Card key={table.id} className="text-center border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{table.name}</h3>
                  <Badge
                    className={`${
                      table.status === "Bo'sh"
                        ? "bg-green-500 dark:bg-green-600"
                        : table.status === "Band"
                          ? "bg-red-500 dark:bg-red-600"
                          : table.status === "Rezerv"
                            ? "bg-blue-500 dark:bg-blue-600"
                            : "bg-yellow-500 dark:bg-yellow-600"
                    } text-white hover:bg-opacity-80`}
                  >
                    {table.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Sig'im: {table.capacity}</p>
                  <p className="text-sm font-medium">{table.totalAmount.toLocaleString()} so'm</p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => updateTableStatus(table.id, "Band")} className="w-full">
                      Band
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateTableStatus(table.id, "Bo'sh")} className="w-full">
                      Bo'sh
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateTableStatus(table.id, "Tozalanmoqda")} className="w-full">
                      Tozalash
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buyurtma tezligi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">8.5</p>
                  <p className="text-sm text-muted-foreground">daqiqa (o'rtacha)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mijozlar qoniqishi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">4.7</p>
                  <p className="text-sm text-muted-foreground">5 dan (o'rtacha reyting)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Xodimlar samaradorligi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">92%</p>
                  <p className="text-sm text-muted-foreground">Umumiy samaradorlik</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>So'nggi faoliyat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order) => order.status === "completed")
                  .slice(-10)
                  .reverse()
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">Buyurtma #{order.id.slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">
                          {tables.find((t) => t.id === order.tableId)?.name} • {order.waiterName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.totalPrice.toLocaleString()} so'm</p>
                        <p className="text-sm text-muted-foreground">
                          {order.completedAt?.toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
