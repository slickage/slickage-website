export interface Project {
  id: number
  title: string
  category: string
  image: string
  description: string
}

export const featuredProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    category: "Web Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "A comprehensive e-commerce solution with advanced product management and analytics.",
  },
  {
    id: 2,
    title: "Healthcare Mobile App",
    category: "Mobile Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "A patient-centered mobile application for healthcare management and telemedicine.",
  },
  {
    id: 3,
    title: "Financial Dashboard",
    category: "Web Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "Real-time financial analytics dashboard for enterprise decision making.",
  },
  {
    id: 4,
    title: "Logistics Management System",
    category: "Enterprise Solution",
    image: "/placeholder.svg?height=600&width=800",
    description: "End-to-end logistics and supply chain management platform.",
  },
  {
    id: 5,
    title: "Social Media Platform",
    category: "Web & Mobile",
    image: "/placeholder.svg?height=600&width=800",
    description: "A community-focused social platform with real-time messaging and content sharing.",
  },
  {
    id: 6,
    title: "Real Estate Marketplace",
    category: "Web Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "Property listing and management platform with virtual tours.",
  },
]

export const recentProjects: Project[] = [
  {
    id: 7,
    title: "Fitness Tracking App",
    category: "Mobile Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "Personalized fitness tracking with AI-powered recommendations.",
  },
  {
    id: 8,
    title: "Educational Platform",
    category: "Web Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "Interactive learning platform with course management and progress tracking.",
  },
  {
    id: 9,
    title: "Restaurant Ordering System",
    category: "Web & Mobile",
    image: "/placeholder.svg?height=600&width=800",
    description: "Digital menu and ordering system for restaurants with kitchen integration.",
  },
  {
    id: 10,
    title: "Event Management Platform",
    category: "Web Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "Comprehensive event planning and management solution.",
  },
  {
    id: 11,
    title: "Travel Booking App",
    category: "Mobile Application",
    image: "/placeholder.svg?height=600&width=800",
    description: "All-in-one travel booking and itinerary management application.",
  },
  {
    id: 12,
    title: "HR Management System",
    category: "Enterprise Solution",
    image: "/placeholder.svg?height=600&width=800",
    description: "Employee management, payroll, and HR analytics platform.",
  },
]

export const webProjects: Project[] = [
  featuredProjects[0],
  featuredProjects[2],
  featuredProjects[5],
  recentProjects[1],
  recentProjects[3],
]

export const mobileProjects: Project[] = [featuredProjects[1], recentProjects[0], recentProjects[4]]

export const enterpriseProjects: Project[] = [featuredProjects[3], recentProjects[5]]

