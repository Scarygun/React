// components/sidebar.tsx
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { type UserRole, type User } from "@/types"

import { Utensils, Table, ClipboardList, UtensilsCrossed, BarChart, ShieldCheck, LayoutDashboard } from "lucide-react"

interface SidebarProps {
  currentTab: string
  onTabChange: (tab: string) => void
  userRole: UserRole | ""
  user: User | null
  logout: () => void
}

export function Sidebar({ currentTab, onTabChange, userRole, user, logout }: SidebarProps) {
  const navItems = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "waiter", "chef"] },
    { value: "tables", label: "Stollar", icon: Table, roles: ["admin", "waiter"] },
    { value: "orders", label: "Buyurtmalar", icon: ClipboardList, roles: ["admin", "waiter", "chef"] },
    { value: "menu", label: "Menyu", icon: UtensilsCrossed, roles: ["admin", "waiter", "chef"] },
    { value: "reports", label: "Hisobotlar", icon: BarChart, roles: ["admin"] },
    { value: "admin", label: "Admin", roles: ["admin"], icon: ShieldCheck },
    { value: "chef", label: "Oshpaz", roles: ["chef", "admin"], icon: Utensils },
  ]

  return (
    <nav className="flex flex-col p-4 space-y-2 bg-card rounded-lg shadow-md h-full w-48 sticky top-0 left-0">
      <div className="flex items-center justify-between mb-4 p-2">
        <div>
          <h1 className="font-bold text-xl">Restoran Pro</h1>
          <p className="text-sm text-muted-foreground">Boshqaruv tizimi</p>
        </div>

      </div>
      <div className="flex flex-col flex-1 space-y-2">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(userRole)) {
            return null
          }
          return (
            <Button
              key={item.value}
              variant={currentTab === item.value ? "default" : "ghost"}
              onClick={() => onTabChange(item.value)}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </div>

      {user && (
        <div className="mt-auto p-2 border-t pt-4">
          <div className="flex flex-col items-start mb-2 bg-muted/40 p-2 rounded-md">
            <p className="font-semibold text-base">{user.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
          </div>
          <Button variant="outline" onClick={logout} className="w-full">
            Chiqish
          </Button>
        </div>
      )}
    </nav>
  )
} 