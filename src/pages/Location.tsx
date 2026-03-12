import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const Location = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.364444555555!2d3.3009523!3d6.5846099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b914996fa67bd%3A0x7537e29d83ce986a!2sBienSante%20hospital!5e0!3m2!1sen!2sng!4v1710260000000!5m2!1sen!2sng";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Location</h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Find your way to BienSanté Hospital. We are located in the heart of Shasha, Lagos, providing easy access for all our patients.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-12">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map Container */}
              <div className="lg:col-span-2 h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BienSanté Hospital Interactive Map"
                ></iframe>
              </div>

              {/* Contact Info Card */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Address</p>
                        <p className="text-slate-600 text-sm">No 9, Alaka Street, off Bameke Rd., Shasha, Lagos, Nigeria</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Phone</p>
                        <p className="text-slate-600 text-sm">09155171407, 09155171408</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Email</p>
                        <p className="text-slate-600 text-sm">biensantemedicacentre@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Hours</p>
                        <p className="text-slate-600 text-sm">Emergency: 24/7</p>
                        <p className="text-slate-600 text-sm">Outpatient: Mon-Sat, 8am-8pm</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold"
                      onClick={() => window.open("https://www.google.com/maps/dir//BienSante+hospital/@6.5846099,3.3009523,17z/", "_blank")}
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl">
                  <h4 className="text-xl font-bold mb-4">Need Assistance?</h4>
                  <p className="text-blue-100 mb-6">
                    If you're having trouble finding us or need emergency transport, please call our emergency line immediately.
                  </p>
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 h-12 rounded-xl font-bold">
                    Call Emergency: 0802 233 3285
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Location;
