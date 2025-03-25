import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10"></div>
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container relative z-20 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white">
              We build amazing experiences
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-gray-300 md:text-xl">
              A small software development company based in Honolulu, Hawaii building big things.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Our Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="text-black border-white hover:bg-white/10">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

