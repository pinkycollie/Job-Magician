"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/services" className="text-lg font-medium">
                  Services
                </Link>
                <Link href="/resources" className="text-lg font-medium">
                  Resources
                </Link>
                <Link href="/jobs" className="text-lg font-medium">
                  Job Search
                </Link>
                <Link href="/training" className="text-lg font-medium">
                  Training
                </Link>
                <Link href="/contact" className="text-lg font-medium">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">360 Job Magician</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium">
            Services
          </Link>
          <Link href="/resources" className="text-sm font-medium">
            Resources
          </Link>
          <Link href="/jobs" className="text-sm font-medium">
            Job Search
          </Link>
          <Link href="/training" className="text-sm font-medium">
            Training
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Search..." className="w-[200px] mr-2" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
