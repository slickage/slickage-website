import { Card, CardContent } from '@/components/ui/card';

export default function BusinessHours() {
  return (
    <Card className="border-0 shadow-xl bg-white/5 rounded-xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Business Hours</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Monday - Friday</span>
            <span className="text-white">9:00 AM - 5:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Saturday</span>
            <span className="text-white">Closed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sunday</span>
            <span className="text-white">Closed</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-500/10">
          <p className="text-gray-400 text-sm">Hawaii Standard Time (HST)</p>
        </div>
      </CardContent>
    </Card>
  );
}
