import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function JoinTeamSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Join Our Team</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              We're always looking for talented people
            </h2>
            <p className="text-gray-500">
              If you're passionate about technology and want to work on exciting projects with a great team, we'd love
              to hear from you.
            </p>
            <div className="pt-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Join Our Team"
              width={600}
              height={600}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

