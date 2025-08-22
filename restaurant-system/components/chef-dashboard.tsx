// components/chef-dashboard.tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Utensils, XCircle } from "lucide-react"
import { Order, MenuItem, Table } from "@/types"

interface ChefDashboardProps {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  menu: MenuItem[]
  tables: Table[]
  setTables: React.Dispatch<React.SetStateAction<Table[]>>
  chefName: string
}

export function ChefDashboard({ orders, setOrders, menu, tables, chefName }: ChefDashboardProps) {
  const [activeTab, setActiveTab] = useState("new") // 'new', 'in-progress'

  const newOrders = useMemo(() => orders.filter((order) => order.status === "active"), [orders])
  const inProgressOrders = useMemo(
    () => orders.filter((order) => order.status === "in-progress"),
    [orders],
  )

  // Daily statistics for the chef
  const todayStats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const chefOrdersToday = orders.filter(
      (order) => order.waiterName === chefName && new Date(order.createdAt) >= today,
    )

    return {
      accepted: chefOrdersToday.filter((order) => order.status === "in-progress").length,
      inProgress: chefOrdersToday.filter((order) => order.status === "in-progress").length, 
      completed: chefOrdersToday.filter((order) => order.status === "completed").length,
      rework: 0, // Placeholder for future rework status
    }
  }, [orders, chefName])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"], tableId: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )

    if (newStatus === "completed") {
      // Remove the completed order from the table's active orders list
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId
            ? { ...table, orders: table.orders.filter((id) => id !== orderId) }
            : table,
        ),
      )
    }
  }

  const getTableAndItemNames = (order: Order) => {
    const tableName = tables.find((t) => t.id === order.tableId)?.name || "Noma'lum stol"
    const itemNames = order.items.map((item) => menu.find((m) => m.id === item.menuItemId)?.name || "Noma'lum mahsulot")
    return { tableName, itemNames: itemNames.join(", ") }
  }

  return (
    <div className="space-y-6">
      {/* Chef Info Header */}
      <Card className="p-6 shadow-sm flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-bold">Oshpaz: {chefName}</CardTitle>
          <p className="text-muted-foreground">Smena: 12:00 - 20:00</p> {/* This should be dynamic */}
        </div>
        
      </Card>

      {/* Order Queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span> Yangi buyurtmalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {newOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Yangi buyurtmalar yo'q</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {newOrders.map((order) => {
                  const { tableName, itemNames } = getTableAndItemNames(order)
                  return (
                    <Card key={order.id} className="p-4 shadow-sm bg-muted/20">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">Stol: {tableName}</h3>
                        <Badge variant="outline" className="font-medium">
                          {new Date(order.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">Buyurtma: {itemNames}</p>
                      <Button
                        onClick={() => updateOrderStatus(order.id, "in-progress", order.tableId)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Clock className="w-4 h-4" />
                        Tayyorlashni boshlash
                      </Button>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Jarayonda
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inProgressOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Jarayondagi buyurtmalar yo'q</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {inProgressOrders.map((order) => {
                  const { tableName, itemNames } = getTableAndItemNames(order)
                  return (
                    <Card key={order.id} className="p-4 shadow-sm bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">Stol {tableName}</h3>
                        <Badge variant="secondary" className="font-medium">
                          {new Date(order.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">Buyurtma: {itemNames}</p>
                      <Button
                        onClick={() => updateOrderStatus(order.id, "completed", order.tableId)}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Tayyor
                      </Button>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Statistics */}
      
    </div>
  )
} 