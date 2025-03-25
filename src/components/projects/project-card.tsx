import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    category: string
    image: string
    description: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card key={project.id} className="w-[300px] border-0 shadow-lg overflow-hidden">
      <div className="relative h-[180px]">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-red-600 bg-red-600/10 px-2 py-1 rounded-full">
            {project.category}
          </span>
        </div>
        <h4 className="text-lg font-bold mb-2">{project.title}</h4>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
        >
          View Project <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}

