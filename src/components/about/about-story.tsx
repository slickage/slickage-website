import Image from 'next/image';

export default function AboutStory() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0"/>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="About Slickage"
              width={600}
              height={600}
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-2">
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight gradient-text mb-4">
              Building amazing experiences since 2012
            </h2>
            <p className="text-gray-300 text-lg">
              Slickage was founded in 2012 with a simple mission: to build amazing software that
              solves real problems. Based in beautiful Honolulu, Hawaii, we've grown from a small
              team of passionate developers to a full-service software development company serving
              clients around the world.
            </p>
            <p className="text-gray-400">
              We believe in creating software that not only meets functional requirements but also
              delivers exceptional user experiences. Our team combines technical expertise with
              creative thinking to build solutions that are both powerful and intuitive.
            </p>
            <p className="text-gray-400">
              Whether we're developing a complex enterprise application or a simple mobile app, we
              approach every project with the same level of dedication and attention to detail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
