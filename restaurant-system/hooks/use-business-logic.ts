"use client"

import type React from "react"

import { useCallback } from "react"

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
  price: number
  name: string
}

interface Order {
  id: string
  tableId: string
  items: OrderItem[]
  totalPrice: number
  status: "active" | "completed" | "cancelled"
  createdAt: Date
  completedAt?: Date
  waiterName?: string
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

export function useBusinessLogic() {
  const calculateOrderTotal = useCallback((items: OrderItem[]): number => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

    // Apply business rules for discounts
    let discount = 0

    // Volume discount: 10% off for orders over 100,000 som
    if (subtotal > 100000) {
      discount = subtotal * 0.1
    }
    // Small discount: 5% off for orders over 50,000 som
    else if (subtotal > 50000) {
      discount = subtotal * 0.05
    }

    return Math.round(subtotal - discount)
  }, [])

  const validateOrder = useCallback(
    (
      items: OrderItem[],
      menu: MenuItem[],
      tableId: string,
      tables: Table[],
    ): { isValid: boolean; errors: string[] } => {
      const errors: string[] = []

      // Check if table exists and is available
      const table = tables.find((t) => t.id === tableId)
      if (!table) {
        errors.push("Stol topilmadi")
      } else if (table.status === "Tozalanmoqda") {
        errors.push("Stol tozalanmoqda, buyurtma berish mumkin emas")
      }

      // Check if order has items
      if (items.length === 0) {
        errors.push("Buyurtmada hech qanday mahsulot yo'q")
      }

      // Validate each item
      items.forEach((item) => {
        const menuItem = menu.find((m) => m.id === item.menuItemId)

        if (!menuItem) {
          errors.push(`Mahsulot topilmadi: ${item.name}`)
        } else {
          // Check if item is active
          if (!menuItem.isActive) {
            errors.push(`Mahsulot nofaol: ${menuItem.name}`)
          }

          // Check stock availability
          if (menuItem.stock < item.quantity) {
            errors.push(`Yetarli zaxira yo'q: ${menuItem.name} (mavjud: ${menuItem.stock}, kerak: ${item.quantity})`)
          }

          // Check quantity is positive
          if (item.quantity <= 0) {
            errors.push(`Noto'g'ri miqdor: ${menuItem.name}`)
          }
        }
      })

      return {
        isValid: errors.length === 0,
        errors,
      }
    },
    [],
  )

  const updateStockForOrder = useCallback(
    (
      items: OrderItem[],
      menu: MenuItem[],
      setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>,
      operation: "deduct" | "restore",
    ): void => {
      setMenu((prevMenu) =>
        prevMenu.map((menuItem) => {
          const orderItem = items.find((item) => item.menuItemId === menuItem.id)
          if (orderItem) {
            const adjustment = operation === "deduct" ? -orderItem.quantity : orderItem.quantity
            return {
              ...menuItem,
              stock: Math.max(0, menuItem.stock + adjustment),
            }
          }
          return menuItem
        }),
      )
    },
    [],
  )

  const updateTableTotals = useCallback(
    (tableId: string, orders: Order[], setTables: React.Dispatch<React.SetStateAction<Table[]>>): void => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (table.id === tableId) {
            const tableOrders = orders.filter((order) => order.tableId === tableId && order.status === "active")

            const totalAmount = tableOrders.reduce((sum, order) => sum + order.totalPrice, 0)
            const orderIds = tableOrders.map((order) => order.id)

            // Determine table status based on orders
            let newStatus = table.status
            if (tableOrders.length > 0 && table.status === "Bo'sh") {
              newStatus = "Band"
            } else if (tableOrders.length === 0 && table.status === "Band") {
              newStatus = "Bo'sh"
            }

            return {
              ...table,
              orders: orderIds,
              totalAmount,
              status: newStatus,
              occupiedSince:
                tableOrders.length > 0 && !table.occupiedSince
                  ? new Date()
                  : tableOrders.length === 0
                    ? undefined
                    : table.occupiedSince,
            }
          }
          return table
        }),
      )
    },
    [],
  )

  const generateStockAlerts = useCallback(
    (
      menu: MenuItem[],
    ): {
      lowStock: MenuItem[]
      outOfStock: MenuItem[]
      criticalAlerts: string[]
    } => {
      const lowStock = menu.filter((item) => item.stock > 0 && item.stock <= 10 && item.isActive)
      const outOfStock = menu.filter((item) => item.stock === 0 && item.isActive)

      const criticalAlerts: string[] = []

      // Generate critical alerts for popular items that are out of stock
      const popularItems = ["Osh", "Manti", "Choy", "Kofe"]
      outOfStock.forEach((item) => {
        if (popularItems.includes(item.name)) {
          criticalAlerts.push(`MUHIM: ${item.name} tugab qoldi - zudlik bilan to'ldiring!`)
        }
      })

      // Alert for low stock on popular items
      lowStock.forEach((item) => {
        if (popularItems.includes(item.name) && item.stock <= 5) {
          criticalAlerts.push(`OGOHLANTIRISH: ${item.name} juda kam qoldi (${item.stock} ta)`)
        }
      })

      return { lowStock, outOfStock, criticalAlerts }
    },
    [],
  )

  const calculateBusinessMetrics = useCallback((orders: Order[], tables: Table[], menu: MenuItem[]) => {
    const completedOrders = orders.filter((order) => order.status === "completed")
    const activeOrders = orders.filter((order) => order.status === "active")
    const cancelledOrders = orders.filter((order) => order.status === "cancelled")

    // Revenue calculations
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

    // Table utilization
    const occupiedTables = tables.filter((table) => table.status === "Band")
    const tableUtilization = (occupiedTables.length / tables.length) * 100

    // Menu performance
    const menuPerformance = menu
      .map((item) => {
        const itemOrders = completedOrders.flatMap((order) =>
          order.items.filter((orderItem) => orderItem.menuItemId === item.id),
        )
        const totalSold = itemOrders.reduce((sum, orderItem) => sum + orderItem.quantity, 0)
        const revenue = itemOrders.reduce((sum, orderItem) => sum + orderItem.quantity * orderItem.price, 0)

        return {
          ...item,
          totalSold,
          revenue,
          profitability: revenue / (item.price * totalSold || 1),
        }
      })
      .sort((a, b) => b.totalSold - a.totalSold)

    // Time-based metrics
    const today = new Date()
    const todayOrders = completedOrders.filter(
      (order) => order.completedAt && order.completedAt.toDateString() === today.toDateString(),
    )

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0)

    // Efficiency metrics
    const averageOrderTime =
      activeOrders.length > 0
        ? activeOrders.reduce((sum, order) => {
            const timeDiff = new Date().getTime() - order.createdAt.getTime()
            return sum + timeDiff / (1000 * 60) // minutes
          }, 0) / activeOrders.length
        : 0

    return {
      totalRevenue,
      todayRevenue,
      averageOrderValue,
      tableUtilization,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      activeOrders: activeOrders.length,
      cancelledOrders: cancelledOrders.length,
      menuPerformance,
      averageOrderTime,
      cancellationRate: orders.length > 0 ? (cancelledOrders.length / orders.length) * 100 : 0,
    }
  }, [])

  const autoCompleteOldOrders = useCallback(
    (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>): void => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "active" && order.createdAt < twoHoursAgo) {
            return {
              ...order,
              status: "completed" as const,
              completedAt: new Date(),
            }
          }
          return order
        }),
      )
    },
    [],
  )

  const validateTableCapacity = useCallback(
    (tableId: string, guestCount: number, tables: Table[]): { isValid: boolean; message?: string } => {
      const table = tables.find((t) => t.id === tableId)

      if (!table) {
        return { isValid: false, message: "Stol topilmadi" }
      }

      if (guestCount > table.capacity) {
        return {
          isValid: false,
          message: `Stol sig'imi yetarli emas. Maksimal: ${table.capacity} kishi, so'ralgan: ${guestCount} kishi`,
        }
      }

      if (guestCount <= 0) {
        return { isValid: false, message: "Mehmonlar soni noto'g'ri" }
      }

      return { isValid: true }
    },
    [],
  )

  return {
    calculateOrderTotal,
    validateOrder,
    updateStockForOrder,
    updateTableTotals,
    generateStockAlerts,
    calculateBusinessMetrics,
    autoCompleteOldOrders,
    validateTableCapacity,
  }
}
