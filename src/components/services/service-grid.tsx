import { Code, Database, Globe, Palette, Server, Smartphone } from "lucide-react"
import ServiceCard from "./service-card"

export default function ServiceGrid() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-2">All Services</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            Comprehensive Software Solutions
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            From concept to deployment, we offer a full range of software development services to meet your business
            needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Globe className="h-6 w-6 text-blue-500" />}
            title="Web Development"
            description="Custom web applications, responsive websites, and progressive web apps."
          />
          <ServiceCard
            icon={<Smartphone className="h-6 w-6 text-blue-500" />}
            title="Mobile Development"
            description="Native and cross-platform mobile applications for iOS and Android."
          />
          <ServiceCard
            icon={<Server className="h-6 w-6 text-blue-500" />}
            title="Backend Development"
            description="Scalable server-side applications, APIs, and microservices."
          />
          <ServiceCard
            icon={<Database className="h-6 w-6 text-blue-500" />}
            title="Database Solutions"
            description="Database design, optimization, and management for optimal performance."
          />
          <ServiceCard
            icon={<Palette className="h-6 w-6 text-blue-500" />}
            title="UI/UX Design"
            description="User-centered design that enhances usability and engagement."
          />
          <ServiceCard
            icon={<Code className="h-6 w-6 text-blue-500" />}
            title="DevOps & Cloud"
            description="Continuous integration, deployment, and cloud infrastructure management."
          />
        </div>
      </div>
    </section>
  )
}

