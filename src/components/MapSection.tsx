import { MapPin, Clock, Phone } from "lucide-react";

const MapSection = () => {
  return (
    <section className="py-20 bg-slate-50">
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
          </div>

          <div className="h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.447466847051!2d3.2954845!3d6.591147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b910000000001%3A0x0!2zNsKwMzUnMjguMSJOIDPCsDE3JzQzLjciRQ!5e0!3m2!1sen!2sng!4v1710281650000!5m2!1sen!2sng"
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
