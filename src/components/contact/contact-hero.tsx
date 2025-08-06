import Image from 'next/image';

export default function ContactHero() {
  return (
    <section className="relative min-h-[30vh] md:min-h-[40vh] max-h-[50vh] flex items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=600&width=1920"
            alt="Contact background"
            fill
            className="object-cover opacity-10 mix-blend-overlay"
            priority
          />
        </div>
      </div>
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-4">
            Contact Us
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 gradient-text">
            Get In Touch
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 mb-4">
            Have a project in mind? We'd love to hear from you. Let's create something amazing
            together.
          </p>
        </div>
      </div>
    </section>
  );
}
