"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, DollarSign, User } from "lucide-react"

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

interface TableManagementProps {
  tables: Table[]
  setTables: React.Dispatch<React.SetStateAction<Table[]>>
  userRole: string
}

const waiters = [
  { id: "waiter1", name: "Ofitsiant 1" },
  { id: "waiter2", name: "Ofitsiant 2" },
  { id: "waiter3", name: "Ofitsiant 3" },
]

export function TableManagement({ tables, setTables, userRole }: TableManagementProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [reservationName, setReservationName] = useState("")
  const [reservationTime, setReservationTime] = useState("")

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "Bo'sh":
        return "bg-green-500 hover:bg-green-600"
      case "Band":
        return "bg-red-500 hover:bg-red-600"
      case "Tozalanmoqda":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Rezerv":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500"
    }
  }

  const updateTableStatus = (tableId: string, status: Table["status"], additionalData?: Partial<Table>) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === tableId) {
          const updatedTable = { ...table, status, ...additionalData }
          if (status === "Band" && !table.occupiedSince) {
            updatedTable.occupiedSince = new Date()
          } else if (status === "Bo'sh") {
            updatedTable.occupiedSince = undefined
            updatedTable.assignedWaiter = undefined
          }
          return updatedTable
        }
        return table
      }),
    )
  }

  const assignWaiter = (tableId: string, waiterId: string) => {
    setTables((prev) => prev.map((table) => (table.id === tableId ? { ...table, assignedWaiter: waiterId } : table)))
  }

  const makeReservation = (tableId: string) => {
    if (reservationName && reservationTime) {
      updateTableStatus(tableId, "Rezerv", {
        reservedBy: reservationName,
        reservedTime: new Date(reservationTime),
      })
      setReservationName("")
      setReservationTime("")
    }
  }

  const getOccupiedDuration = (occupiedSince?: Date) => {
    if (!occupiedSince) return ""
    const now = new Date()
    const diff = now.getTime() - occupiedSince.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}d`
  }

  return (
    <div className="space-y-6">
      {/* Table Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Bo'sh: {tables.filter((t) => t.status === "Bo'sh").length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Band: {tables.filter((t) => t.status === "Band").length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Rezerv: {tables.filter((t) => t.status === "Rezerv").length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">
                Tozalanmoqda: {tables.filter((t) => t.status === "Tozalanmoqda").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTable?.id === table.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedTable(table)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{table.name}</CardTitle>
                <Badge className={`${getStatusColor(table.status)} text-white`}>{table.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Table Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Sig'im: {table.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{table.totalAmount.toLocaleString()} so'm</span>
                  </div>
                </div>

                {/* Occupied Duration */}
                {table.status === "Band" && table.occupiedSince && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Vaqt: {getOccupiedDuration(table.occupiedSince)}</span>
                  </div>
                )}

                {/* Assigned Waiter */}
                {table.assignedWaiter && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Ofitsiant: {waiters.find((w) => w.id === table.assignedWaiter)?.name}</span>
                  </div>
                )}

                {/* Reservation Info */}
                {table.status === "Rezerv" && table.reservedBy && (
                  <div className="text-sm text-blue-600">
                    <p>Rezerv: {table.reservedBy}</p>
                    {table.reservedTime && (
                      <p className="text-xs">
                        Vaqt:{" "}
                        {table.reservedTime.toLocaleTimeString("uz-UZ", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant={table.status === "Band" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateTableStatus(table.id, "Band")
                    }}
                  >
                    Band
                  </Button>
                  <Button
                    size="sm"
                    variant={table.status === "Bo'sh" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateTableStatus(table.id, "Bo'sh")
                    }}
                  >
                    Bo'sh
                  </Button>
                  <Button
                    size="sm"
                    variant={table.status === "Tozalanmoqda" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateTableStatus(table.id, "Tozalanmoqda")
                    }}
                  >
                    Tozalash
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Details Dialog */}
      {selectedTable && (
        <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedTable.name} - Batafsil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Holat</Label>
                  <Badge className={`${getStatusColor(selectedTable.status)} text-white mt-1`}>
                    {selectedTable.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sig'im</Label>
                  <p className="text-sm">{selectedTable.capacity} kishi</p>
                </div>
              </div>

              {/* Waiter Assignment */}
              {(userRole === "admin" || userRole === "manager") && (
                <div>
                  <Label className="text-sm font-medium">Ofitsiant tayinlash</Label>
                  <Select
                    value={selectedTable.assignedWaiter || ""}
                    onValueChange={(value) => assignWaiter(selectedTable.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Ofitsiant tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {waiters.map((waiter) => (
                        <SelectItem key={waiter.id} value={waiter.id}>
                          {waiter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Reservation */}
              {selectedTable.status === "Bo'sh" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Rezerv qilish</Label>
                  <Input
                    placeholder="Mijoz ismi"
                    value={reservationName}
                    onChange={(e) => setReservationName(e.target.value)}
                  />
                  <Input
                    type="datetime-local"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                  />
                  <Button
                    onClick={() => makeReservation(selectedTable.id)}
                    disabled={!reservationName || !reservationTime}
                    className="w-full"
                  >
                    Rezerv qilish
                  </Button>
                </div>
              )}

              {/* Current Orders */}
              <div>
                <Label className="text-sm font-medium">Buyurtmalar</Label>
                <p className="text-sm text-gray-600">{selectedTable.orders.length} ta buyurtma</p>
                <p className="text-sm font-semibold">Jami: {selectedTable.totalAmount.toLocaleString()} so'm</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
