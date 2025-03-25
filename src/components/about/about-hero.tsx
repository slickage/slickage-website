import Image from "next/image"

export default function AboutHero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10"></div>
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=600&width=1920"
          alt="About background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container relative z-20 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">About Slickage</h1>
            <p className="mx-auto max-w-[700px] text-lg text-gray-300 md:text-xl">
              A small software development company based in Honolulu, Hawaii building big things.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

