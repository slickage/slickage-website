import React from 'react';
import { LazyImage } from '@/components/ui';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

export default React.memo(function TeamMember({ name, role, image }: TeamMemberProps) {
  return (
    <div className="bg-white/5 border-2 border-blue-500/10 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105">
      <div className="relative w-28 h-28 mb-4 overflow-hidden rounded-full border-4 border-blue-500/20 shadow-lg">
        <LazyImage
          src={image || '/placeholder.svg'}
          alt={name}
          fill
          priority={false}
          lazy={true}
          threshold={0.1}
          rootMargin="50px"
          showLoadingSpinner={false}
          containerClassName="w-full h-full"
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-blue-400 font-medium">{role}</p>
    </div>
  );
});
