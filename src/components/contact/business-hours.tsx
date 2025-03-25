import { Card, CardContent } from "@/components/ui/card"

export default function BusinessHours() {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Business Hours</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Monday - Friday</span>
            <span>9:00 AM - 5:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Saturday</span>
            <span>Closed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sunday</span>
            <span>Closed</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-gray-500 text-sm">Hawaii Standard Time (HST)</p>
        </div>
      </CardContent>
    </Card>
  )
}

