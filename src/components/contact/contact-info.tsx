import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactInfo() {
  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-600/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-gray-500">info@slickage.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-600/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Phone</h4>
              <p className="text-gray-500">+1 (808) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-600/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Office</h4>
              <p className="text-gray-500">
                1234 Ala Moana Blvd
                <br />
                Honolulu, HI 96814
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

