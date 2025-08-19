"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, DollarSign, ShoppingCart, Clock } from "lucide-react"

interface Order {
  id: string
  tableId: string
  items: { menuItemId: string; quantity: number }[]
  totalPrice: number
  status: "active" | "completed"
  createdAt: Date
}

interface MenuItem {
  id: string
  name: string
  category: "Taomlar" | "Salatlar" | "Ichimliklar"
  price: number
  stock: number
}

interface ReportsManagementProps {
  orders: Order[]
  menu: MenuItem[]
}

export function ReportsManagement({ orders, menu }: ReportsManagementProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today")

  // Filter orders based on selected period
  const filteredOrders = useMemo(() => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    let filterDate: Date
    switch (selectedPeriod) {
      case "today":
        filterDate = startOfDay
        break
      case "week":
        filterDate = startOfWeek
        break
      case "month":
        filterDate = startOfMonth
        break
      default:
        filterDate = startOfDay
    }

    return orders.filter((order) => order.createdAt >= filterDate)
  }, [orders, selectedPeriod])

  // Calculate statistics
  const stats = useMemo(() => {
    const completedOrders = filteredOrders.filter((order) => order.status === "completed")
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const totalOrders = completedOrders.length
    const activeOrders = filteredOrders.filter((order) => order.status === "active").length

    // Most popular items
    const itemCounts: Record<string, number> = {}
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity
      })
    })

    const popularItems = Object.entries(itemCounts)
      .map(([menuItemId, count]) => ({
        item: menu.find((m) => m.id === menuItemId),
        count,
      }))
      .filter((item) => item.item)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Revenue by category
    const categoryRevenue: Record<string, number> = {}
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const menuItem = menu.find((m) => m.id === item.menuItemId)
        if (menuItem) {
          const category = menuItem.category
          categoryRevenue[category] = (categoryRevenue[category] || 0) + menuItem.price * item.quantity
        }
      })
    })

    return {
      totalRevenue,
      totalOrders,
      activeOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      popularItems,
      categoryRevenue,
    }
  }, [filteredOrders, menu])

  // Generate hourly sales data for today
  const hourlySales = useMemo(() => {
    if (selectedPeriod !== "today") return []

    const hourlyData: Record<number, number> = {}
    const completedOrders = filteredOrders.filter((order) => order.status === "completed")

    completedOrders.forEach((order) => {
      const hour = order.createdAt.getHours()
      hourlyData[hour] = (hourlyData[hour] || 0) + order.totalPrice
    })

    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      revenue: hourlyData[hour] || 0,
    }))
  }, [filteredOrders, selectedPeriod])

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      stats,
      orders: filteredOrders,
      hourlySales: selectedPeriod === "today" ? hourlySales : null,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `restoran-hisobot-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hisobotlar</h2>
          <p className="text-gray-600">Avtomatik yaratilgan sotuv hisobotlari</p>
        </div>
        <div className="flex gap-4">
          <Select
            value={selectedPeriod}
            onValueChange={(value: "today" | "week" | "month") => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Bugun</SelectItem>
              <SelectItem value="week">Bu hafta</SelectItem>
              <SelectItem value="month">Bu oy</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Eksport
          </Button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umumiy daromad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} so'm</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyurtmalar soni</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha buyurtma</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageOrderValue).toLocaleString()} so'm</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol buyurtmalar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="popular" className="w-full">
        <TabsList>
          <TabsTrigger value="popular">Mashhur taomlar</TabsTrigger>
          <TabsTrigger value="category">Kategoriya bo'yicha</TabsTrigger>
          <TabsTrigger value="hourly">Soatlik sotuv</TabsTrigger>
          <TabsTrigger value="orders">Buyurtmalar ro'yxati</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eng ko'p sotilgan taomlar</CardTitle>
              <CardDescription>Tanlangan davr bo'yicha eng mashhur taomlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.popularItems.map((item, index) => (
                  <div key={item.item?.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{item.item?.name}</p>
                        <p className="text-sm text-gray-600">{item.item?.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.count} dona</p>
                      <p className="text-sm text-gray-600">
                        {((item.item?.price || 0) * item.count).toLocaleString()} so'm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kategoriya bo'yicha daromad</CardTitle>
              <CardDescription>Har bir kategoriyadan olingan daromad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.categoryRevenue).map(([category, revenue]) => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="font-medium">{category}</div>
                    <div className="text-right">
                      <p className="font-bold">{revenue.toLocaleString()} so'm</p>
                      <p className="text-sm text-gray-600">
                        {stats.totalRevenue > 0 ? Math.round((revenue / stats.totalRevenue) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          {selectedPeriod === "today" ? (
            <Card>
              <CardHeader>
                <CardTitle>Soatlik sotuv ma'lumotlari</CardTitle>
                <CardDescription>Bugungi kun davomida soatlik daromad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {hourlySales.map((data) => (
                    <div key={data.hour} className="text-center p-2 border rounded">
                      <p className="text-xs font-medium">{data.hour}</p>
                      <p className="text-sm font-bold">{data.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">Soatlik ma'lumotlar faqat "Bugun" uchun mavjud</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buyurtmalar ro'yxati</CardTitle>
              <CardDescription>Tanlangan davr bo'yicha barcha buyurtmalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Buyurtma #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        Stol: {order.tableId} | {order.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.totalPrice.toLocaleString()} so'm</p>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                        {order.status === "completed" ? "Tugallangan" : "Faol"}
                      </Badge>
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
