"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Phone, Play, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ListenumApp() {
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
                <div className="w-6 h-6 bg-[#141414] rounded" />
                Listenum
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-8">
                  {["Home", "Explore", "Workbook", "Practice", "Community", "Events"].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      className="text-[#49454f] hover:text-[#141414] px-1 py-2 text-sm font-medium"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-[#789978] hover:bg-[#779977] text-white rounded-full px-6">Become a member</Button>
              <div className="w-8 h-8 rounded-full bg-[#e5e8eb]" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="number" className="w-fit mb-8">
          <TabsList className="bg-[#e5e8eb]/30">
            <TabsTrigger value="number" className="gap-2">
              <MapPin className="w-4 h-4" />
              Number
            </TabsTrigger>
            <TabsTrigger value="date" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <h1 className="text-3xl font-semibold mb-8 text-[#141414]">Listen to the number and type it out</h1>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Listenum-9BjMYlTNvLnL1WlajLT6dlvv9gvwnb.png"
            alt="Illustration of a person wearing headphones"
            width={400}
            height={300}
            className="rounded-lg"
          />
          <div>
            <h2 className="text-4xl font-bold mb-6 text-[#141414]">4, 7, 2, 9, 1, 6</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Type the number here"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-10 bg-[#f2f2f2] border-0"
                />
              </div>
              <Button className="bg-[#789978] hover:bg-[#779977] text-white px-6">Check</Button>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-[#f2f2f2] p-4 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e5e8eb] rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-[#141414] rounded" />
          </div>
          <div>
            <h3 className="font-medium">Number sequence</h3>
            <p className="text-sm text-[#737873]">Listenum</p>
          </div>
          <div className="flex-1 h-1 bg-[#e5e8eb] rounded-full mx-4">
            <div className="w-1/3 h-full bg-[#789978] rounded-full" />
          </div>
          <div className="text-sm text-[#737873]">1:17</div>
          <div className="text-sm text-[#737873]">2:23</div>
          <Button size="icon" variant="ghost" className="text-[#789978]">
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </main>
    </div>
  )
}

