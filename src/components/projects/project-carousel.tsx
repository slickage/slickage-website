"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProjectCard from "./project-card"

interface Project {
  id: number
  title: string
  category: string
  image: string
  description: string
}

interface ProjectCarouselProps {
  title: string
  projects: Project[]
}

export default function ProjectCarousel({ title, projects }: ProjectCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75

      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })

      // Check if we need to show/hide arrows after scrolling
      setTimeout(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
          setShowLeftArrow(scrollLeft > 0)
          setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
        }
      }, 300)
    }
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!showLeftArrow}
            className={!showLeftArrow ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!showRightArrow}
            className={!showRightArrow ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-4 hide-scrollbar" ref={carouselRef} onScroll={handleScroll}>
        <div className="flex space-x-4" style={{ width: "max-content" }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

