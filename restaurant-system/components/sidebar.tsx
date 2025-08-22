// components/sidebar.tsx
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { type UserRole, type User } from "@/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { Utensils, Table, ClipboardList, UtensilsCrossed, BarChart, ShieldCheck } from "lucide-react"

interface SidebarProps {
  currentTab: string
  onTabChange: (tab: string) => void
  userRole: UserRole | ""
  user: User | null
  logout: () => void
}

export function Sidebar({ currentTab, onTabChange, userRole, user, logout }: SidebarProps) {
  const navItems = [
    { value: "tables", label: "Stollar", icon: Table, roles: ["admin", "waiter"] },
    { value: "orders", label: "Buyurtmalar", icon: ClipboardList, roles: ["admin", "waiter"] },
    { value: "menu", label: "Menyu", icon: UtensilsCrossed, roles: ["admin", "waiter"] },
    { value: "reports", label: "Hisobotlar", icon: BarChart, roles: ["admin"] },
    { value: "admin", label: "Admin", roles: ["admin"], icon: ShieldCheck },
    { value: "chef", label: "Oshpaz", roles: ["chef", "admin"], icon: Utensils },
  ]

  return (
    <nav className="flex flex-col p-4 space-y-2 bg-card rounded-lg shadow-md h-fit w-48">
      <div className="flex flex-col items-start mb-4 p-2 border-b pb-4">
        <p className="font-semibold text-lg">{user?.name}</p>
        <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
        <div className="flex gap-2 mt-2 w-full">
          <Button variant="outline" onClick={logout} className="flex-1">
            Chiqish
          </Button>
          <ThemeToggle />
        </div>
      </div>
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

      
    </nav>
  )
} 