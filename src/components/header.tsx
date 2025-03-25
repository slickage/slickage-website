import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-end">
                <span className="block h-[2px] w-4 bg-red-600"></span>
                <span className="mt-[2px] block h-[2px] w-3 bg-red-600"></span>
                <span className="mt-[2px] block h-[2px] w-2 bg-red-600"></span>
              </div>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-red-600">SLICKAGE</span>
        </div>
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-red-600">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium transition-colors hover:text-red-600">
            Services
          </Link>
          <Link href="/projects" className="text-sm font-medium transition-colors hover:text-red-600">
            Projects
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-red-600">
            About
          </Link>
          <Link href="/#contact" className="text-sm font-medium transition-colors hover:text-red-600">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/contact">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Let&apos;s Talk
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

