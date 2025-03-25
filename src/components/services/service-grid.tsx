import { Code, Database, Globe, Palette, Server, Smartphone } from "lucide-react"
import ServiceCard from "./service-card"

export default function ServiceGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">All Services</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Comprehensive Software Solutions
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            From concept to deployment, we offer a full range of software development services to meet your business
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            icon={<Globe className="h-6 w-6 text-red-600" />}
            title="Web Development"
            description="Custom web applications, responsive websites, and progressive web apps."
          />
          <ServiceCard
            icon={<Smartphone className="h-6 w-6 text-red-600" />}
            title="Mobile Development"
            description="Native and cross-platform mobile applications for iOS and Android."
          />
          <ServiceCard
            icon={<Server className="h-6 w-6 text-red-600" />}
            title="Backend Development"
            description="Scalable server-side applications, APIs, and microservices."
          />
          <ServiceCard
            icon={<Database className="h-6 w-6 text-red-600" />}
            title="Database Solutions"
            description="Database design, optimization, and management for optimal performance."
          />
          <ServiceCard
            icon={<Palette className="h-6 w-6 text-red-600" />}
            title="UI/UX Design"
            description="User-centered design that enhances usability and engagement."
          />
          <ServiceCard
            icon={<Code className="h-6 w-6 text-red-600" />}
            title="DevOps & Cloud"
            description="Continuous integration, deployment, and cloud infrastructure management."
          />
        </div>
      </div>
    </section>
  )
}

