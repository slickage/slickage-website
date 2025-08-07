import TeamMember from './team-member';

export default function TeamGrid() {
  const teamMembers = [
    { name: 'John Doe', role: 'Founder & CEO', image: '/placeholder.svg?height=400&width=400' },
    { name: 'Jane Smith', role: 'Lead Developer', image: '/placeholder.svg?height=400&width=400' },
    {
      name: 'Michael Johnson',
      role: 'UX/UI Designer',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      name: 'Sarah Williams',
      role: 'Project Manager',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      name: 'David Brown',
      role: 'Backend Developer',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      name: 'Emily Davis',
      role: 'Frontend Developer',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      name: 'Robert Wilson',
      role: 'Mobile Developer',
      image: '/placeholder.svg?height=400&width=400',
    },
    {
      name: 'Lisa Martinez',
      role: 'QA Specialist',
      image: '/placeholder.svg?height=400&width=400',
    },
  ];

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0"/>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-2">
            Our Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
            Meet the people behind Slickage
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            Our talented team of developers, designers, and strategists are passionate about
            creating exceptional software.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} name={member.name} role={member.role} image={member.image} />
          ))}
        </div>
      </div>
    </section>
  );
}
