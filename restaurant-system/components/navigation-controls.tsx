"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Upload } from "lucide-react"

interface NavigationControlsProps {
  currentTab: string
  onTabChange: (tab: string) => void
  onBackupData: () => void
  onRestoreData: (data: any) => void
  orderCount: {
    today: number
    week: number
    month: number
  }
}

export function NavigationControls({
  currentTab,
  onTabChange,
  onBackupData,
  onRestoreData,
  orderCount,
}: NavigationControlsProps) {
  const [isRestoring, setIsRestoring] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          onRestoreData(data)
          setIsRestoring(false)
        } catch (error) {
          alert("Fayl formati noto'g'ri!")
          setIsRestoring(false)
        }
      }
      reader.readAsText(file)
    }
  }

  const tabNames: Record<string, string> = {
    tables: "Stollar",
    orders: "Buyurtmalar",
    menu: "Menyu",
    reports: "Hisobotlar",
    admin: "Admin",
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentTab !== "tables" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTabChange("tables")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Orqaga
              </Button>
            )}
            <span>Navigatsiya va Boshqaruv</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Joriy: {tabNames[currentTab] || currentTab}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Counter */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Buyurtmalar Sanoqi</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Bugun:</span>
                <Badge variant="default">{orderCount.today}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bu hafta:</span>
                <Badge variant="secondary">{orderCount.week}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bu oy:</span>
                <Badge variant="outline">{orderCount.month}</Badge>
              </div>
            </div>
          </div>

          {/* Data Backup */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Ma'lumotlar Zaxirasi</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBackupData}
                className="w-full flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Zaxiralash
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRestoring(true)}
                  className="w-full flex items-center gap-2"
                  disabled={isRestoring}
                >
                  <Upload className="h-4 w-4" />
                  Tiklash
                </Button>
                {isRestoring && (
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Tezkor Harakatlar</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={() => onTabChange("orders")} className="w-full">
                Yangi Buyurtma
              </Button>
              <Button variant="outline" size="sm" onClick={() => onTabChange("reports")} className="w-full">
                Hisobotlar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
