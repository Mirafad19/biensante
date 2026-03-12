import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MapSection = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.364444555555!2d3.3009523!3d6.5846099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b914996fa67bd%3A0x7537e29d83ce986a!2sBienSante%20hospital!5e0!3m2!1sen!2sng!4v1710260000000!5m2!1sen!2sng";

  return (
    <section className="py-20 bg-slate-50" id="contact">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Visit Our Facility</h2>
              <p className="text-slate-600 text-lg">
                Conveniently located in Shasha, we are easily accessible to provide you with the best medical care.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Our Address</h4>
                  <p className="text-slate-600">No 9, Alaka Street, off Bameke Rd., Shasha, Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Working Hours</h4>
                  <p className="text-slate-600">Emergency: 24/7</p>
                  <p className="text-slate-600">Outpatient: Mon - Sat, 8:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Contact Numbers</h4>
                  <p className="text-slate-600">09155171407, 09155171408</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/location">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl font-bold">
                  View Full Map <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BienSanté Hospital Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
