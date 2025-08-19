import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Users, Target, Heart } from 'lucide-react'
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Voice Agent</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Bosh sahifa
            </Link>
            <Link href="/register">
              <Button>Bepul boshlang</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Biz haqimizda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI Voice Agent - O'zbekiston bizneslarini raqamlashtirish va 
            mijozlarga yaxshiroq xizmat ko'rsatish uchun yaratilgan bepul platforma
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Bizning missiyamiz</h2>
            <p className="text-lg text-gray-600 mb-6">
              Biz O'zbekistondagi har bir biznes, kichik bo'lsin yoki katta, 
              zamonaviy AI texnologiyalaridan foydalanish imkoniyatiga ega bo'lishi 
              kerak deb hisoblaymiz.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Shuning uchun biz AI Voice Agent xizmatini to'liq bepul taqdim etamiz - 
              hech qanday yashirin to'lovlar, cheklovlar yoki majburiyatlar yo'q.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg">Bepul boshlang</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Aloqa qiling</Button>
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Bepul xizmat</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Qo'llab-quvvatlash</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                <div className="text-gray-600">Cheksiz foydalanish</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0$</div>
                <div className="text-gray-600">Hech qanday to'lov</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Bizning qadriyatlarimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Bepul va ochiq</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Biz texnologiyani hamma uchun ochiq va bepul qilishga ishonamiz. 
                  Hech kim pul yo'qligi sababli yaxshi xizmatdan mahrum bo'lmasligi kerak.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Jamiyat uchun</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bizning maqsadimiz - O'zbekiston biznes jamiyatini qo'llab-quvvatlash 
                  va ularning o'sishiga hissa qo'shish.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Sifat va ishonch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bepul bo'lsa ham, biz eng yuqori sifat va ishonchlilikni ta'minlaymiz. 
                  Sizning biznesingiz bizning ustuvorligimiz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Free Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Nega bepul?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🚀 Bizneslarni qo'llab-quvvatlash
              </h3>
              <p className="text-gray-600 mb-6">
                O'zbekistondagi ko'plab kichik va o'rta bizneslar uchun AI texnologiyalari 
                qimmat. Biz bu to'siqni olib tashlamoqchimiz.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🌱 Bozorni rivojlantirish
              </h3>
              <p className="text-gray-600">
                Bepul xizmat orqali AI texnologiyalarini ommalashtirish va 
                mahalliy bozorni rivojlantirishga yordam berish.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🤝 Jamiyat bilan hamkorlik
              </h3>
              <p className="text-gray-600 mb-6">
                Biz biznes jamiyati bilan uzoq muddatli munosabatlar qurishni 
                va ularning muvaffaqiyatida ishtirok etishni xohlaymiz.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 Innovatsiyani targ'ib qilish
              </h3>
              <p className="text-gray-600">
                Zamonaviy texnologiyalarni O'zbekistonda keng tarqatish va 
                raqamli transformatsiyaga hissa qo'shish.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Bizga qo'shiling!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bepul AI Voice Agent bilan biznesingizni keyingi bosqichga olib chiqing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Hoziroq boshlang
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Savollaringiz bormi?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
