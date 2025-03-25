import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="rounded-full bg-red-600/10 w-12 h-12 flex items-center justify-center mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Our {title.toLowerCase()} services are designed to help businesses create exceptional digital experiences.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="p-0 h-auto text-red-600 hover:text-red-700">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

