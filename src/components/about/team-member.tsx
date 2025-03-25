import Image from "next/image"

interface TeamMemberProps {
  name: string
  role: string
  image: string
}

export default function TeamMember({ name, role, image }: TeamMemberProps) {
  return (
    <div className="text-center">
      <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-500">{role}</p>
    </div>
  )
}

