import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Our Work</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Projects</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            Explore some of our recent projects that showcase our expertise and creativity.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <ProjectCard key={item} item={item} type="Project" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="web" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <ProjectCard key={item} item={item} type="Web Project" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mobile" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((item) => (
                <ProjectCard key={item} item={item} type="Mobile Project" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="enterprise" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1].map((item) => (
                <ProjectCard key={item} item={item} type="Enterprise Project" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  item: number
  type: string
}

function ProjectCard({ item, type }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <Image
        src={`/placeholder.svg?height=600&width=800`}
        alt={`${type} ${item}`}
        width={800}
        height={600}
        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white">
          {type} {item}
        </h3>
        <p className="text-gray-300 mt-2">
          {type.includes("Mobile")
            ? "Mobile Application"
            : type.includes("Web")
              ? "Web Application"
              : type.includes("Enterprise")
                ? "Enterprise Solution"
                : "Web Application"}
        </p>
        <Button variant="link" className="p-0 h-auto text-red-400 hover:text-red-300 mt-4">
          View Case Study <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

