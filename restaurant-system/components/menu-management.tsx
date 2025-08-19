"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Package, AlertTriangle, Search, Minus } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  category: "Taomlar" | "Salatlar" | "Ichimliklar"
  price: number
  stock: number
  description?: string
  isActive: boolean
}

interface MenuManagementProps {
  menu: MenuItem[]
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>
  userRole: string
}

export function MenuManagement({ menu, setMenu, userRole }: MenuManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStock, setFilterStock] = useState<string>("all")

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "Taomlar" as MenuItem["category"],
    price: "",
    stock: "",
    description: "",
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Taomlar",
      price: "",
      stock: "",
      description: "",
      isActive: true,
    })
  }

  const addMenuItem = () => {
    if (!formData.name || !formData.price || !formData.stock) return

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: Number.parseInt(formData.price),
      stock: Number.parseInt(formData.stock),
      description: formData.description,
      isActive: formData.isActive,
    }

    setMenu((prev) => [...prev, newItem])
    resetForm()
    setShowAddDialog(false)
  }

  const updateMenuItem = () => {
    if (!editingItem || !formData.name || !formData.price || !formData.stock) return

    setMenu((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              category: formData.category,
              price: Number.parseInt(formData.price),
              stock: Number.parseInt(formData.stock),
              description: formData.description,
              isActive: formData.isActive,
            }
          : item,
      ),
    )

    resetForm()
    setEditingItem(null)
    setShowEditDialog(false)
  }

  const deleteMenuItem = (itemId: string) => {
    setMenu((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateStock = (itemId: string, newStock: number) => {
    if (newStock < 0) return
    setMenu((prev) => prev.map((item) => (item.id === itemId ? { ...item, stock: newStock } : item)))
  }

  const toggleItemStatus = (itemId: string) => {
    setMenu((prev) => prev.map((item) => (item.id === itemId ? { ...item, isActive: !item.isActive } : item)))
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
      description: item.description || "",
      isActive: item.isActive,
    })
    setShowEditDialog(true)
  }

  // Filter and search logic
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "low" && item.stock <= 10) ||
      (filterStock === "out" && item.stock === 0) ||
      (filterStock === "available" && item.stock > 0)

    return matchesSearch && matchesCategory && matchesStock
  })

  const lowStockItems = menu.filter((item) => item.stock <= 10 && item.stock > 0)
  const outOfStockItems = menu.filter((item) => item.stock === 0)

  const canManageMenu = userRole === "admin" || userRole === "manager"

  return (
    <div className="space-y-6">
      {/* Alerts for low stock */}
      {lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Kam qolgan mahsulotlar:</strong> {lowStockItems.map((item) => item.name).join(", ")} - zaxirani
            to'ldiring!
          </AlertDescription>
        </Alert>
      )}

      {outOfStockItems.length > 0 && (
        <Alert variant="destructive">
          <Package className="h-4 w-4" />
          <AlertDescription>
            <strong>Tugab qolgan mahsulotlar:</strong> {outOfStockItems.map((item) => item.name).join(", ")} - zudlik
            bilan to'ldiring!
          </AlertDescription>
        </Alert>
      )}

      {/* Menu Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jami mahsulotlar</p>
                <p className="text-2xl font-bold">{menu.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faol mahsulotlar</p>
                <p className="text-2xl font-bold text-green-600">{menu.filter((item) => item.isActive).length}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kam qolgan</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tugab qolgan</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Mahsulot qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kategoriya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha kategoriyalar</SelectItem>
              <SelectItem value="Taomlar">Taomlar</SelectItem>
              <SelectItem value="Salatlar">Salatlar</SelectItem>
              <SelectItem value="Ichimliklar">Ichimliklar</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStock} onValueChange={setFilterStock}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Zaxira holati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha mahsulotlar</SelectItem>
              <SelectItem value="available">Mavjud</SelectItem>
              <SelectItem value="low">Kam qolgan</SelectItem>
              <SelectItem value="out">Tugab qolgan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add New Item Button */}
        {canManageMenu && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yangi mahsulot qo'shish</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nomi</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mahsulot nomini kiriting"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategoriya</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem["category"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Taomlar">Taomlar</SelectItem>
                      <SelectItem value="Salatlar">Salatlar</SelectItem>
                      <SelectItem value="Ichimliklar">Ichimliklar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Narxi (so'm)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Zaxira</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Tavsif (ixtiyoriy)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mahsulot haqida qisqacha ma'lumot"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={addMenuItem} disabled={!formData.name || !formData.price || !formData.stock}>
                    Qo'shish
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenu.map((item) => (
          <Card key={item.id} className={`${!item.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {item.stock === 0 && <Badge variant="destructive">Tugagan</Badge>}
                  {item.stock > 0 && item.stock <= 10 && <Badge variant="secondary">Kam</Badge>}
                  {!item.isActive && <Badge variant="outline">Nofaol</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Narxi:</span>
                  <span className="font-semibold">{item.price.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Zaxira:</span>
                  <div className="flex items-center gap-2">
                    {canManageMenu && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateStock(item.id, item.stock - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.stock}</span>
                        <Button size="sm" variant="outline" onClick={() => updateStock(item.id, item.stock + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {!canManageMenu && <span>{item.stock}</span>}
                  </div>
                </div>

                {item.description && (
                  <div>
                    <span className="text-sm text-gray-600">Tavsif:</span>
                    <p className="text-sm mt-1">{item.description}</p>
                  </div>
                )}

                {canManageMenu && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toggleItemStatus(item.id)}>
                      {item.isActive ? "Nofaol qilish" : "Faollashtirish"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMenuItem(item.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Hech qanday mahsulot topilmadi</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nomi</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mahsulot nomini kiriting"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Kategoriya</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem["category"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Taomlar">Taomlar</SelectItem>
                  <SelectItem value="Salatlar">Salatlar</SelectItem>
                  <SelectItem value="Ichimliklar">Ichimliklar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Narxi (so'm)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Zaxira</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Tavsif (ixtiyoriy)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mahsulot haqida qisqacha ma'lumot"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={updateMenuItem} disabled={!formData.name || !formData.price || !formData.stock}>
                Saqlash
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
