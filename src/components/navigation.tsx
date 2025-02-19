"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navigation() {
    return (
        <nav className="border-b bg-sakiBlue">
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
                        <Link href="/profile">
                            <div className="w-8 h-8 rounded-full bg-[#e5e8eb]" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

