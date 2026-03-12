import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, Phone, FileText, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PatientsVisitors = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-blue-700 py-20 text-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-blue-100 hover:text-white hover:bg-blue-800 mb-6 -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Patients & Visitors</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Everything you need to know about your visit to BienSanté Hospital. We are committed to making your experience as comfortable and seamless as possible.
            </p>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Visiting Hours */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Visiting Hours</h2>
                </div>
                <div className="space-y-4 text-slate-600">
                  <p><strong>General Wards:</strong> 4:00 PM – 6:00 PM daily</p>
                  <p><strong>ICU/Emergency:</strong> Restricted. Immediate family only, brief visits.</p>
                  <p><strong>Maternity:</strong> 10:00 AM – 12:00 PM & 4:00 PM – 6:00 PM</p>
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm">
                    Please note: Only two visitors are allowed per patient at a time to ensure a quiet healing environment.
                  </div>
                </div>
              </motion.div>

              {/* Admission & Discharge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Admission & Discharge</h2>
                </div>
                <div className="space-y-4 text-slate-600">
                  <p>Please bring your valid ID, HMO card (if applicable), and any previous medical records or current medications.</p>
                  <p>Discharge processing usually takes 2-3 hours. Our billing department will guide you through the final steps and provide your take-home medications.</p>
                </div>
              </motion.div>

              {/* Location & Parking */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Location & Parking</h2>
                </div>
                <div className="space-y-4 text-slate-600">
                  <p><strong>Address:</strong> No 9, Alaka Street, off Bameke Rd., Shasha, Lagos</p>
                  <p>Free secure parking is available for patients and visitors within the hospital premises.</p>
                </div>
              </motion.div>

              {/* Contact & Support */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Contact & Support</h2>
                </div>
                <div className="space-y-4 text-slate-600">
                  <p>If you need assistance during your stay, our patient experience team is here to help.</p>
                  <p><strong>Front Desk:</strong> 0915 517 1407</p>
                  <p><strong>Emergency:</strong> 0802 233 3285</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PatientsVisitors;
