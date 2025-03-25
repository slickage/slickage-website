import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Globe, Server, Smartphone } from "lucide-react"

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-red-600/10 px-3 py-1 text-sm text-red-600">Our Services</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Expert Software Solutions</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
            We specialize in creating custom software solutions that drive business growth and enhance user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="rounded-full bg-red-600/10 w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Web Development</CardTitle>
              <CardDescription>
                Custom web applications and responsive websites built with modern technologies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                From simple landing pages to complex web applications, we deliver solutions that are fast, secure, and
                scalable.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="p-0 h-auto text-red-600 hover:text-red-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="rounded-full bg-red-600/10 w-12 h-12 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Mobile Development</CardTitle>
              <CardDescription>Native and cross-platform mobile applications for iOS and Android.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                We build intuitive and performant mobile apps that provide seamless experiences across all devices.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="p-0 h-auto text-red-600 hover:text-red-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="rounded-full bg-red-600/10 w-12 h-12 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Backend Solutions</CardTitle>
              <CardDescription>Robust server-side applications and API development.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                We design and implement scalable backend systems that power your applications with reliability and
                performance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="p-0 h-auto text-red-600 hover:text-red-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

