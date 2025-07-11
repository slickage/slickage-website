import Image from 'next/image';

export default function CaseStudyImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5">
        <Image
          src={src}
          alt={alt}
          width={900}
          height={500}
          className="object-cover w-full h-auto"
        />
        {caption && (
          <div className="px-4 py-2 text-center text-gray-400 text-sm bg-[#0A0A0A] bg-opacity-80">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
