import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin } from 'lucide-react';

export default function ContactInfo() {
  return (
    <Card className="border-0 shadow-xl bg-white/5 rounded-xl mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-500/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-white">Email</h4>
              <p className="text-gray-400">inquiry@slickage.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-500/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-white">Slickage Studios, LLC</h4>
              <p className="text-gray-400">
                1600 Kapiolani Blvd., Ste. 1315
                <br />
                Honolulu, HI 96814
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
