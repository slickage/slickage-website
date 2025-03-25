import { Award, Clock, Code, Heart, MapPin, Users } from "lucide-react"
import ValueCard from "./value-card"

export default function ValueGrid() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Our Values</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What drives us</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            Our core values guide everything we do, from how we build software to how we interact with our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ValueCard
            icon={<Code className="h-6 w-6 text-red-600" />}
            title="Technical Excellence"
            description="We're committed to writing clean, maintainable code and staying at the forefront of technology."
          />
          <ValueCard
            icon={<Users className="h-6 w-6 text-red-600" />}
            title="Collaborative Approach"
            description="We work closely with our clients, treating their projects as if they were our own."
          />
          <ValueCard
            icon={<Heart className="h-6 w-6 text-red-600" />}
            title="Passion for Quality"
            description="We're passionate about creating software that not only works well but exceeds expectations."
          />
          <ValueCard
            icon={<Clock className="h-6 w-6 text-red-600" />}
            title="Timely Delivery"
            description="We understand the importance of deadlines and strive to deliver projects on time, every time."
          />
          <ValueCard
            icon={<Award className="h-6 w-6 text-red-600" />}
            title="Continuous Improvement"
            description="We're always learning, growing, and finding ways to improve our processes and skills."
          />
          <ValueCard
            icon={<MapPin className="h-6 w-6 text-red-600" />}
            title="Local Roots, Global Reach"
            description="We're proud of our Hawaiian roots while serving clients around the world."
          />
        </div>
      </div>
    </section>
  )
}

