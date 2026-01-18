"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Sun } from "lucide-react"

import { cn, getImageUrl } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Knowledge Hub", href: "/knowledge" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/20">
            <Image
              src={getImageUrl("/uploads/1768564582084-cropped_logo.png")}
              alt="CrystalCred Logo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-contain"
            />
          </div>
          <span className={cn("text-xl font-bold tracking-tight", isScrolled ? "text-primary" : "text-primary")}>
            CrystalCred
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-ring",
                pathname === item.href
                  ? "text-ring font-semibold"
                  : "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Quote
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-base font-medium py-2 border-b border-gray-100 last:border-0",
                pathname === item.href ? "text-ring" : "text-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-primary text-white hover:bg-primary/90 w-full text-center py-3 rounded-md font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  )
}
