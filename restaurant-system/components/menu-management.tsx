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
import { MenuItem } from "@/types"

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

  const canManageMenu = userRole === "admin"

  return (
    <div className="space-y-6">
      {/* Alerts for low stock */}
      {lowStockItems.length > 0 && (
        <Alert className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            <strong>Kam qolgan mahsulotlar:</strong> {lowStockItems.map((item) => item.name).join(", ")} - zaxirani
            to'ldiring!
          </AlertDescription>
        </Alert>
      )}

      {outOfStockItems.length > 0 && (
        <Alert variant="destructive" className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 text-red-700 dark:text-red-300">
          <Package className="h-5 w-5" />
          <AlertDescription className="font-medium">
            <strong>Tugab qolgan mahsulotlar:</strong> {outOfStockItems.map((item) => item.name).join(", ")} - zudlik
            bilan to'ldiring!
          </AlertDescription>
        </Alert>
      )}

      {/* Menu Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami mahsulotlar</p>
                <p className="text-2xl font-bold">{menu.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faol mahsulotlar</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{menu.filter((item) => item.isActive).length}</p>
              </div>
              <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded-full flex-shrink-0"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kam qolgan</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tugab qolgan</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{outOfStockItems.length}</p>
              </div>
              <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded-full flex-shrink-0"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-lg bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Mahsulot qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base py-2"
            />
          </div>

          {/* Filters */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48 text-base py-2">
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
            <SelectTrigger className="w-full sm:w-48 text-base py-2">
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
              <Button className="flex items-center gap-2 text-base py-2 px-4">
                <Plus className="w-5 h-5" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 rounded-lg shadow-xl bg-background">
              <DialogHeader className="pb-4 mb-4 border-b">
                <DialogTitle className="text-2xl font-bold">Yangi mahsulot qo'shish</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nomi</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mahsulot nomini kiriting"
                    className="text-base py-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-muted-foreground">Kategoriya</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem["category"] })}
                  >
                    <SelectTrigger className="mt-1 text-base py-2">
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
                    <Label htmlFor="price" className="text-sm font-medium text-muted-foreground">Narxi (so'm)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      className="text-base py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock" className="text-sm font-medium text-muted-foreground">Zaxira</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                      className="text-base py-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">Tavsif (ixtiyoriy)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mahsulot haqida qisqacha ma'lumot"
                    className="text-base py-2"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button onClick={addMenuItem} disabled={!formData.name || !formData.price || !formData.stock} className="text-lg py-3 flex-1">
                    Qo'shish
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="text-lg py-3 flex-1">
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
          <Card key={item.id} className={`${!item.isActive ? "opacity-60" : ""} shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 text-muted-foreground border-muted-foreground/20">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {item.stock === 0 && <Badge variant="destructive" className="font-semibold">Tugagan</Badge>}
                  {item.stock > 0 && item.stock <= 10 && <Badge variant="secondary" className="font-semibold">Kam</Badge>}
                  {!item.isActive && <Badge variant="outline" className="font-semibold">Nofaol</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-base">
                  <span className="text-muted-foreground">Narxi:</span>
                  <span className="font-semibold text-foreground">{item.price.toLocaleString()} so'm</span>
                </div>

                <div className="flex justify-between items-center text-base">
                  <span className="text-muted-foreground">Zaxira:</span>
                  <div className="flex items-center gap-2">
                    {canManageMenu && (
                      <>
                        <Button size="icon" variant="outline" onClick={() => updateStock(item.id, item.stock - 1)} className="h-8 w-8">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-foreground">{item.stock}</span>
                        <Button size="icon" variant="outline" onClick={() => updateStock(item.id, item.stock + 1)} className="h-8 w-8">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {!canManageMenu && <span className="font-semibold text-foreground">{item.stock}</span>}
                  </div>
                </div>

                {item.description && (
                  <div>
                    <span className="text-muted-foreground text-sm">Tavsif:</span>
                    <p className="text-sm mt-1 text-foreground">{item.description}</p>
                  </div>
                )}

                {canManageMenu && (
                  <div className="flex gap-2 pt-4 border-t mt-4">
                    <Button size="icon" variant="outline" onClick={() => openEditDialog(item)} className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toggleItemStatus(item.id)} className="flex-1">
                      {item.isActive ? "Nofaol qilish" : "Faollashtirish"}
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => deleteMenuItem(item.id)} className="h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Hech qanday mahsulot topilmadi</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="p-6 rounded-lg shadow-xl bg-background">
          <DialogHeader className="pb-4 mb-4 border-b">
            <DialogTitle className="text-2xl font-bold">Mahsulotni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium text-muted-foreground">Nomi</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mahsulot nomini kiriting"
                className="text-base py-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-category" className="text-sm font-medium text-muted-foreground">Kategoriya</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MenuItem["category"] })}
              >
                <SelectTrigger className="mt-1 text-base py-2">
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
                <Label htmlFor="edit-price" className="text-sm font-medium text-muted-foreground">Narxi (so'm)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="text-base py-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock" className="text-sm font-medium text-muted-foreground">Zaxira</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="text-base py-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium text-muted-foreground">Tavsif (ixtiyoriy)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mahsulot haqida qisqacha ma'lumot"
                className="text-base py-2"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={updateMenuItem} disabled={!formData.name || !formData.price || !formData.stock} className="text-lg py-3 flex-1">
                Saqlash
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="text-lg py-3 flex-1">
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
