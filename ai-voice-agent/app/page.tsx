import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, Users, TrendingUp, Mic, Settings, BarChart3, Shield } from 'lucide-react'
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Voice Agent</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Xususiyatlar
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Aloqa
            </Link>
            <Link href="/login">
              <Button variant="outline">Kirish</Button>
            </Link>
            <Link href="/register">
              <Button>Bepul sinab ko'ring</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            O'zbekiston uchun maxsus ishlab chiqilgan
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            24/7 AI Ovozli
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Yordamchi
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Restoranlar, call-centerlar va xizmat ko'rsatuvchi tashkilotlar uchun 
            sun'iy intellekt asosida ishlaydigan ovozli yordamchi tizim. 
            Mijozlarning qo'ng'iroqlariga 24/7 avtomatik javob bering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Bepul boshlang
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Demo ko'ring
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30-40%</div>
              <div className="text-gray-600">Operator yukini kamaytirish</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Uzluksiz xizmat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Tizim barqarorligi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Bir vaqtda qo'ng'iroq</div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Service Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-emerald-100">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              100% Bepul xizmat
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Hozircha bizning AI Voice Agent xizmati to'liq bepul! 
              Cheklovlarsiz foydalaning va biznesingizni rivojlantiring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-green-600 mb-2">∞</div>
                <div className="font-medium">Cheksiz qo'ng'iroqlar</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
                <div className="font-medium">Uzluksiz qo'llab-quvvatlash</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-green-600 mb-2">0$</div>
                <div className="font-medium">Hech qanday to'lov yo'q</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Asosiy xususiyatlar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Biznesingizni avtomatlashtirish va mijozlar qoniqishini oshirish uchun 
              zamonaviy AI texnologiyalari
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Ovozli qo'ng'iroqlar</CardTitle>
                <CardDescription>
                  O'zbek tilida tabiiy ovozda mijozlar bilan suhbatlashish
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>24/7 Xizmat</CardTitle>
                <CardDescription>
                  Kechayu kunduz uzluksiz mijozlarga xizmat ko'rsatish
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Operator integratsiyasi</CardTitle>
                <CardDescription>
                  Murakkab holatlarda qo'ng'iroqni operatorga yo'naltirish
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Statistika va tahlil</CardTitle>
                <CardDescription>
                  Qo'ng'iroqlar tahlili va batafsil hisobotlar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Oson sozlash</CardTitle>
                <CardDescription>
                  Intuitiv boshqaruv paneli orqali tizimni sozlash
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Xavfsizlik</CardTitle>
                <CardDescription>
                  Ma'lumotlar himoyasi va xavfsiz integratsiya
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kimlar uchun mos?
            </h2>
            <p className="text-xl text-gray-600">
              Turli soha vakillari uchun maxsus yechimlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <CardTitle className="text-lg">Restoranlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Buyurtma qabul qilish va bron qilish</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏦</span>
                </div>
                <CardTitle className="text-lg">Banklar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Hisob ma'lumotlari va kredit so'rovlar</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-lg">Kommunal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Hisob holati va to'lovlar</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <CardTitle className="text-lg">Klinikalar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Uchrashuvlar va ma'lumotlar</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hoziroq bepul boshlang!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hech qanday to'lov, hech qanday cheklov. Faqat ro'yxatdan o'ting va foydalanishni boshlang!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Bepul boshlang
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Savol berish
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Voice Agent</span>
              </div>
              <p className="text-gray-400">
                O'zbekiston uchun eng yaxshi AI ovozli yordamchi tizimi
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Mahsulot</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Xususiyatlar</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integratsiyalar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kompaniya</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">Biz haqimizda</Link></li>
                <li><Link href="/contact" className="hover:text-white">Aloqa</Link></li>
                <li><Link href="/careers" className="hover:text-white">Karyera</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Qo'llab-quvvatlash</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Yordam</Link></li>
                <li><Link href="/docs" className="hover:text-white">Hujjatlar</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Maxfiylik</Link></li>
                <li><Link href="/terms" className="hover:text-white">Shartlar</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Voice Agent. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
