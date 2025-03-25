import { Button } from "@/components/ui/button"

export default function ServiceCTA() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to start your project?</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            Let's discuss how we can help you achieve your business goals with our software development expertise.
          </p>
          <div className="pt-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Contact Us Today</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

