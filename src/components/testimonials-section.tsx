import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function TestimonialsSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Testimonials</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Clients Say</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface Testimonial {
  name: string
  role: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: "Alex Johnson",
    role: "CEO, TechStart",
    quote:
      "Working with Slickage was a game-changer for our business. Their team delivered a solution that exceeded our expectations and helped us scale rapidly.",
  },
  {
    name: "Sarah Williams",
    role: "Marketing Director, GrowthCo",
    quote:
      "The team at Slickage understood our vision from day one. They translated our ideas into a beautiful, functional website that has significantly increased our conversions.",
  },
  {
    name: "Michael Chen",
    role: "Founder, InnovateLabs",
    quote:
      "Slickage's attention to detail and commitment to quality is unmatched. They're not just developers, they're strategic partners who care about your success.",
  },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-red-600/20"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400">{testimonial.quote}</p>
      </CardContent>
      <CardFooter className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center">
          <span className="text-lg font-medium text-red-600">{testimonial.name.charAt(0)}</span>
        </div>
        <div>
          <h4 className="font-medium">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

