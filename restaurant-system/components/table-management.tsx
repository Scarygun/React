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
import { Table } from "@/types"

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
        return "bg-green-500 dark:bg-green-600"
      case "Band":
        return "bg-red-500 dark:bg-red-600"
      case "Tozalanmoqda":
        return "bg-yellow-500 dark:bg-yellow-600"
      case "Rezerv":
        return "bg-blue-500 dark:bg-blue-600"
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
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-full flex-shrink-0"></div>
            <span className="text-sm font-medium text-muted-foreground">Bo'sh: {tables.filter((t) => t.status === "Bo'sh").length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 dark:bg-red-600 rounded-full flex-shrink-0"></div>
            <span className="text-sm font-medium text-muted-foreground">Band: {tables.filter((t) => t.status === "Band").length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full flex-shrink-0"></div>
            <span className="text-sm font-medium text-muted-foreground">Rezerv: {tables.filter((t) => t.status === "Rezerv").length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 rounded-full flex-shrink-0"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Tozalanmoqda: {tables.filter((t) => t.status === "Tozalanmoqda").length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTable?.id === table.id ? "ring-2 ring-primary dark:ring-primary-foreground" : "shadow-sm"
            }`}
            onClick={() => setSelectedTable(table)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{table.name}</CardTitle>
                <Badge className={`${getStatusColor(table.status)} text-white font-semibold`}>{table.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Info */}
                <div className="flex items-center justify-between text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>Sig'im: <span className="font-semibold text-foreground">{table.capacity}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <span><span className="font-semibold text-foreground">{table.totalAmount.toLocaleString()}</span> so'm</span>
                  </div>
                </div>

                {/* Occupied Duration */}
                {table.status === "Band" && table.occupiedSince && (
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>Vaqt: <span className="font-semibold text-foreground">{getOccupiedDuration(table.occupiedSince)}</span></span>
                  </div>
                )}

                {/* Assigned Waiter */}
                {table.assignedWaiter && (
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span>Ofitsiant: <span className="font-semibold text-foreground">{waiters.find((w) => w.id === table.assignedWaiter)?.name}</span></span>
                  </div>
                )}

                {/* Reservation Info */}
                {table.status === "Rezerv" && table.reservedBy && (
                  <div className="text-base text-blue-600 dark:text-blue-400">
                    <p>Rezerv: <span className="font-semibold text-foreground">{table.reservedBy}</span></p>
                    {table.reservedTime && (
                      <p className="text-sm text-muted-foreground">
                        Vaqt:{" "}
                        <span className="font-semibold text-foreground">
                          {table.reservedTime.toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                  <Button
                    size="sm"
                    variant={table.status === "Band" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateTableStatus(table.id, "Band")
                    }}
                    className="text-base py-2"
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
                    className="text-base py-2"
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
                    className="text-base py-2"
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
          <DialogContent className="max-w-md p-6 rounded-lg shadow-xl bg-background">
            <DialogHeader className="pb-4 mb-4 border-b">
              <DialogTitle className="text-2xl font-bold">{selectedTable.name} - Batafsil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Holat</Label>
                  <Badge className={`${getStatusColor(selectedTable.status)} text-white font-semibold mt-1`}>
                    {selectedTable.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sig'im</Label>
                  <p className="text-base font-semibold text-foreground mt-1">{selectedTable.capacity} kishi</p>
                </div>
              </div>

              {/* Waiter Assignment */}
              {(userRole === "admin" || userRole === "manager") && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ofitsiant tayinlash</Label>
                  <Select
                    value={selectedTable.assignedWaiter || ""}
                    onValueChange={(value) => assignWaiter(selectedTable.id, value)}
                  >
                    <SelectTrigger className="mt-1 text-base py-2">
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
                  <Label className="text-sm font-medium text-muted-foreground">Rezerv qilish</Label>
                  <Input
                    placeholder="Mijoz ismi"
                    value={reservationName}
                    onChange={(e) => setReservationName(e.target.value)}
                    className="text-base py-2"
                  />
                  <Input
                    type="datetime-local"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="text-base py-2"
                  />
                  <Button
                    onClick={() => makeReservation(selectedTable.id)}
                    disabled={!reservationName || !reservationTime}
                    className="w-full text-lg py-3"
                  >
                    Rezerv qilish
                  </Button>
                </div>
              )}

              {/* Current Orders */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Buyurtmalar</Label>
                <p className="text-base text-foreground mt-1">{selectedTable.orders.length} ta buyurtma</p>
                <p className="text-base font-semibold text-foreground">Jami: {selectedTable.totalAmount.toLocaleString()} so'm</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
