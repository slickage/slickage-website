import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

export default function TeamMember({ name, role, image }: TeamMemberProps) {
  return (
    <div className="bg-white/5 border-2 border-blue-500/10 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
      <div className="relative w-28 h-28 mb-4 overflow-hidden rounded-full border-4 border-blue-500/20 shadow-lg">
        <Image src={image || '/placeholder.svg'} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-blue-400 font-medium">{role}</p>
    </div>
  );
}
