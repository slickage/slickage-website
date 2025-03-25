import Image from "next/image"

export default function AboutStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="About Slickage"
              width={600}
              height={600}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Our Story</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Building amazing experiences since 2012</h2>
            <p className="text-gray-500">
              Slickage was founded in 2012 with a simple mission: to build amazing software that solves real problems.
              Based in beautiful Honolulu, Hawaii, we've grown from a small team of passionate developers to a
              full-service software development company serving clients around the world.
            </p>
            <p className="text-gray-500">
              We believe in creating software that not only meets functional requirements but also delivers exceptional
              user experiences. Our team combines technical expertise with creative thinking to build solutions that are
              both powerful and intuitive.
            </p>
            <p className="text-gray-500">
              Whether we're developing a complex enterprise application or a simple mobile app, we approach every
              project with the same level of dedication and attention to detail.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

