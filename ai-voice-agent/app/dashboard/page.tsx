"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Users, Clock, TrendingUp, Settings, BarChart3, Mic, PhoneCall, UserCheck, Timer, Activity } from 'lucide-react'
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const stats = {
    totalCalls: 1247,
    answeredCalls: 1156,
    avgResponseTime: 2.3,
    customerSatisfaction: 94,
    callsToday: 89,
    activeAgents: 3
  }

  const recentCalls = [
    { id: 1, time: "14:32", duration: "3:45", status: "completed", type: "Buyurtma" },
    { id: 2, time: "14:28", duration: "2:12", status: "transferred", type: "Bron" },
    { id: 3, time: "14:25", duration: "1:33", status: "completed", type: "Ma'lumot" },
    { id: 4, time: "14:20", duration: "4:21", status: "completed", type: "Shikoyat" },
    { id: 5, time: "14:15", duration: "2:55", status: "completed", type: "Buyurtma" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">AI Voice Agent</span>
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Faol
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Sozlamalar
              </Button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Xush kelibsiz, Ahmad!
          </h1>
          <p className="text-gray-600">
            Bugun sizning AI yordamchingiz {stats.callsToday} ta qo'ng'iroqni qayta ishladi. 
            Xizmat to'liq bepul!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami qo'ng'iroqlar</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% o'tgan oyga nisbatan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Javob berilgan</CardTitle>
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.answeredCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.answeredCalls / stats.totalCalls) * 100).toFixed(1)}% javob berish darajasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">O'rtacha javob vaqti</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}s</div>
              <p className="text-xs text-muted-foreground">
                -0.5s yaxshilandi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mijozlar qoniqishi</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customerSatisfaction}%</div>
              <p className="text-xs text-muted-foreground">
                +2% o'sish
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Qo'ng'iroqlar statistikasi</CardTitle>
                <CardDescription>
                  So'nggi 7 kunlik qo'ng'iroqlar tahlili
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Grafik bu yerda ko'rsatiladi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>So'nggi qo'ng'iroqlar</CardTitle>
                <CardDescription>
                  Bugungi eng so'nggi qo'ng'iroqlar ro'yxati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{call.type}</p>
                          <p className="text-sm text-gray-500">{call.time} - {call.duration}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={call.status === "completed" ? "default" : "secondary"}
                        className={call.status === "completed" ? "bg-green-100 text-green-800" : ""}
                      >
                        {call.status === "completed" ? "Tugallandi" : "Operator"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions and Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tizim holati</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Agent</span>
                  <Badge className="bg-green-100 text-green-800">Faol</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Telefon integratsiya</span>
                  <Badge className="bg-green-100 text-green-800">Ulangan</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ovoz sifati</span>
                  <Badge className="bg-blue-100 text-blue-800">Yaxshi</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Xizmat</span>
                  <Badge className="bg-green-100 text-green-800">Bepul</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tezkor harakatlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  AI sozlamalari
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mic className="w-4 h-4 mr-2" />
                  Ovoz sozlamalari
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Batafsil hisobot
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Integratsiya
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Xizmat ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Joriy tarif</span>
                    <Badge className="bg-green-100 text-green-800">Bepul</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cheklovlar</span>
                    <span className="font-medium">Yo'q</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>To'lov</span>
                    <span className="font-medium text-green-600">0$ / oy</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 text-center">
                    🎉 Xizmat to'liq bepul!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
