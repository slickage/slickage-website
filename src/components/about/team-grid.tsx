import TeamMember from "./team-member"

export default function TeamGrid() {
  const teamMembers = [
    { name: "John Doe", role: "Founder & CEO", image: "/placeholder.svg?height=400&width=400" },
    { name: "Jane Smith", role: "Lead Developer", image: "/placeholder.svg?height=400&width=400" },
    { name: "Michael Johnson", role: "UX/UI Designer", image: "/placeholder.svg?height=400&width=400" },
    { name: "Sarah Williams", role: "Project Manager", image: "/placeholder.svg?height=400&width=400" },
    { name: "David Brown", role: "Backend Developer", image: "/placeholder.svg?height=400&width=400" },
    { name: "Emily Davis", role: "Frontend Developer", image: "/placeholder.svg?height=400&width=400" },
    { name: "Robert Wilson", role: "Mobile Developer", image: "/placeholder.svg?height=400&width=400" },
    { name: "Lisa Martinez", role: "QA Specialist", image: "/placeholder.svg?height=400&width=400" },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Our Team</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Meet the people behind Slickage
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            Our talented team of developers, designers, and strategists are passionate about creating exceptional
            software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} name={member.name} role={member.role} image={member.image} />
          ))}
        </div>
      </div>
    </section>
  )
}

