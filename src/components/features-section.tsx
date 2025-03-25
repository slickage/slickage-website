import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Code, Laptop, MessageSquare } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/placeholder.svg?height=800&width=800"
              alt="About Slickage"
              width={800}
              height={800}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Why Choose Us</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Hawaii-based software experts with global impact
            </h2>
            <p className="text-gray-500">
              We're a small team of passionate developers, designers, and strategists who love building amazing digital
              experiences. Based in beautiful Honolulu, we bring a unique perspective to every project.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <FeatureItem
                icon={<Code className="h-5 w-5 text-red-600" />}
                title="Quality Code"
                description="Clean, maintainable, and efficient code."
              />
              <FeatureItem
                icon={<Laptop className="h-5 w-5 text-red-600" />}
                title="Modern Tech"
                description="Latest technologies and frameworks."
              />
              <FeatureItem
                icon={<MessageSquare className="h-5 w-5 text-red-600" />}
                title="Clear Communication"
                description="Transparent and responsive process."
              />
              <FeatureItem
                icon={
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
                    className="h-5 w-5 text-red-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                }
                title="Secure Solutions"
                description="Security-first development approach."
              />
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white mt-4">Learn More About Us</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="rounded-full bg-red-600/10 w-10 h-10 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

