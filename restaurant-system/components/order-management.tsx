"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Minus, ShoppingCart, Clock, CheckCircle, Trash2, AlertTriangle, DollarSign } from "lucide-react"
import { useBusinessLogic } from "@/hooks/use-business-logic"
import { MenuItem, Order, OrderItem, Table } from "@/types"

interface OrderManagementProps {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  tables: Table[]
  setTables: React.Dispatch<React.SetStateAction<Table[]>>
  menu: MenuItem[]
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>
  userRole: string
  userName: string
}

export function OrderManagement({
  orders,
  setOrders,
  tables,
  setTables,
  menu,
  setMenu,
  userRole,
  userName,
}: OrderManagementProps) {
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const {
    calculateOrderTotal,
    validateOrder,
    updateStockForOrder,
    updateTableTotals,
    generateStockAlerts,
    autoCompleteOldOrders,
  } = useBusinessLogic()

  useEffect(() => {
    const interval = setInterval(() => {
      autoCompleteOldOrders(orders, setOrders)
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [orders, setOrders, autoCompleteOldOrders])

  useEffect(() => {
    const uniqueTableIds = [...new Set(orders.map((order) => order.tableId))]
    uniqueTableIds.forEach((tableId) => {
      updateTableTotals(tableId, orders, setTables)
    })
  }, [orders, updateTableTotals, setTables])

  const stockAlerts = generateStockAlerts(menu)

  const addItemToOrder = (menuItem: MenuItem) => {
    const existingItem = currentOrder.find((item) => item.menuItemId === menuItem.id)

    if (existingItem) {
      setCurrentOrder((prev) =>
        prev.map((item) => (item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setCurrentOrder((prev) => [
        ...prev,
        {
          menuItemId: menuItem.id,
          quantity: 1,
          price: menuItem.price,
          name: menuItem.name,
        },
      ])
    }
  }

  const updateItemQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCurrentOrder((prev) => prev.filter((item) => item.menuItemId !== menuItemId))
    } else {
      setCurrentOrder((prev) => prev.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item)))
    }
  }

  const createOrder = () => {
    if (!selectedTable || currentOrder.length === 0) return

    const validation = validateOrder(currentOrder, menu, selectedTable, tables)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    const totalPrice = calculateOrderTotal(currentOrder)

    const newOrder: Order = {
      id: Date.now().toString(),
      tableId: selectedTable,
      items: currentOrder,
      totalPrice,
      status: "active",
      createdAt: new Date(),
      waiterName: userName,
    }

    updateStockForOrder(currentOrder, menu, setMenu, "deduct")

    setOrders((prev) => [...prev, newOrder])

    setCurrentOrder([])
    setSelectedTable("")
    setValidationErrors([])
    setShowNewOrderDialog(false)
  }

  const completeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "completed" as const, completedAt: new Date() } : order,
      ),
    )
  }

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    updateStockForOrder(order.items, menu, setMenu, "restore")

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as const } : o)))
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-500 dark:bg-blue-600"
      case "completed":
        return "bg-green-500 dark:bg-green-600"
      case "cancelled":
        return "bg-red-500 dark:bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "active":
        return "Faol"
      case "completed":
        return "Tugallangan"
      case "cancelled":
        return "Bekor qilingan"
      default:
        return "Noma'lum"
    }
  }

  const activeOrders = orders.filter((order) => order.status === "active")
  const completedOrders = orders.filter((order) => order.status === "completed")

  return (
    <div className="space-y-6">
      {stockAlerts.criticalAlerts.length > 0 && (
        <div className="space-y-2">
          {stockAlerts.criticalAlerts.map((alert, index) => (
            <Alert key={index} variant="destructive" className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="font-medium">{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faol buyurtmalar</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeOrders.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bugun tugallangan</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedOrders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bugungi daromad</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()} so'm
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Buyurtmalar</h2>
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Yangi buyurtma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-xl bg-background">
            <DialogHeader className="pb-4 mb-4 border-b">
              <DialogTitle className="text-2xl font-bold">Yangi buyurtma yaratish</DialogTitle>
            </DialogHeader>

            {validationErrors.length > 0 && (
              <div className="space-y-2">
                {validationErrors.map((error, index) => (
                  <Alert key={index} variant="destructive" className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Stol tanlang</Label>
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Stol tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {tables
                        .filter((table) => table.status === "Bo'sh" || table.status === "Band")
                        .map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            {table.name} ({table.status}) - Sig'im: {table.capacity}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Menyu</Label>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {["Taomlar", "Salatlar", "Ichimliklar"].map((category) => (
                      <div key={category}>
                        <h4 className="font-semibold text-base text-muted-foreground mb-2">{category}</h4>
                        <div className="space-y-2">
                          {menu
                            .filter((item) => item.category === category && item.isActive)
                            .map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                                <div className="flex-1">
                                  <p className="font-medium text-base">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.price.toLocaleString()} so'm • Zaxira: {item.stock}
                                    {item.stock <= 10 && item.stock > 0 && (
                                      <Badge variant="secondary" className="ml-2">
                                        Kam
                                      </Badge>
                                    )}
                                    {item.stock === 0 && (
                                      <Badge variant="destructive" className="ml-2">
                                        Tugagan
                                      </Badge>
                                    )}
                                  </p>
                                </div>
                                <Button size="icon" onClick={() => addItemToOrder(item)} disabled={item.stock === 0} className="shrink-0">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-muted-foreground">Joriy buyurtma</Label>
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    {currentOrder.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">Buyurtma bo'sh</p>
                    ) : (
                      <div className="space-y-3">
                        {currentOrder.map((item) => (
                          <div key={item.menuItemId} className="flex items-center justify-between p-2 border-b last:border-b-0">
                            <div className="flex-1">
                              <p className="font-medium text-base">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.price.toLocaleString()} so'm</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}
                                className="h-7 w-7"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}
                                className="h-7 w-7"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => updateItemQuantity(item.menuItemId, 0)}
                                className="h-7 w-7"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Separator className="my-2" />

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Oraliq jami:</span>
                            <span className="font-semibold">
                              {currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}{" "}
                              so'm
                            </span>
                          </div>

                          {calculateOrderTotal(currentOrder) <
                            currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0) && (
                            <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                              <span>Chegirma:</span>
                              <span className="font-semibold">
                                -
                                {(
                                  currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0) -
                                  calculateOrderTotal(currentOrder)
                                ).toLocaleString()}{" "}
                                so'm
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                            <span>Jami:</span>
                            <span>{calculateOrderTotal(currentOrder).toLocaleString()} so'm</span>
                          </div>
                        </div>

                        <Button
                          onClick={createOrder}
                          disabled={!selectedTable || currentOrder.length === 0}
                          className="w-full text-lg py-3"
                        >
                          Buyurtma yaratish
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Faol buyurtmalar</h3>
        {activeOrders.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Hozircha faol buyurtmalar yo'q</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Buyurtma #{order.id.slice(-4)}</CardTitle>
                    <Badge className={`${getStatusColor(order.status)} text-white font-semibold`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>Stol: {tables.find((t) => t.id === order.tableId)?.name}</p>
                    <p>Ofitsiant: {order.waiterName}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {order.createdAt.toLocaleTimeString("uz-UZ", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium mb-1">Buyurtma tarkibi:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {order.items.slice(0, 3).map((item) => (
                          <li key={item.menuItemId}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                      {order.items.length > 3 && (
                        <p className="text-muted-foreground text-xs mt-1">va yana {order.items.length - 3} ta...</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t mt-2">
                      <span>Jami:</span>
                      <span>{order.totalPrice.toLocaleString()} so'm</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => completeOrder(order.id)} className="flex-1">
                        Tugallash
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => cancelOrder(order.id)}>
                        Bekor qilish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Tugallangan buyurtmalar</h3>
        {completedOrders.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Hozircha tugallangan buyurtmalar yo'q</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {completedOrders
              .slice(-5)
              .reverse()
              .map((order) => (
                <Card key={order.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Buyurtma #{order.id.slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">
                          Stol: {tables.find((t) => t.id === order.tableId)?.name} • Tugallangan:{" "}
                          {order.completedAt?.toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} text-white font-semibold mb-1`}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="font-semibold">{order.totalPrice.toLocaleString()} so'm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
