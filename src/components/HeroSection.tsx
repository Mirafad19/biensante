import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Search, ArrowRight } from "lucide-react";
import { hero_medical_team_jpg as heroImage } from "@/assets/encodedImages";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-slate-50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 h-[500px] md:h-[600px] lg:h-[700px]">
        <img
          src={heroImage}
          alt="Professional medical team at BienSanté Hospital"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 md:pt-32 lg:pt-48 lg:pb-32 min-h-[500px] md:h-[600px] lg:h-[700px] flex flex-col justify-center">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            24/7 Emergency Care Available
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Exceptional Care for You and Your Family.
          </h1>

          <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-xl">
            BienSanté Hospital provides world-class medical expertise, advanced technology, and compassionate care right here in Lagos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/book-appointment">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 h-14 px-8 text-base font-semibold rounded-md shadow-sm w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link to="/find-doctor">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50 h-14 px-8 text-base font-semibold rounded-md w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                Find a Doctor
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Cards (Overlapping) */}
      <div className="relative z-20 container mx-auto px-6 -mt-8 md:-mt-16 lg:-mt-24 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600 flex flex-col"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-3">Patient Portal</h3>
            <p className="text-slate-600 mb-6 flex-grow">Access your medical records, test results, and manage appointments securely.</p>
            <Link to="/patient-portal" className="text-blue-600 font-semibold flex items-center hover:text-blue-800 transition-colors">
              Log In <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-600 rounded-lg shadow-lg p-8 text-white flex flex-col"
          >
            <h3 className="text-xl font-bold mb-3">Emergency Care</h3>
            <p className="text-blue-100 mb-6 flex-grow">Our emergency department is open 24/7 with specialized trauma teams ready.</p>
            <a href="tel:08022333285" className="inline-flex items-center font-semibold hover:text-blue-200 transition-colors">
              <Phone className="w-4 h-4 mr-2" />
              0802 233 3285
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600 flex flex-col"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-3">Locations & Directions</h3>
            <p className="text-slate-600 mb-6 flex-grow">Find our main hospital campus and affiliated clinics across the region.</p>
            <Link to="/location" className="text-blue-600 font-semibold flex items-center hover:text-blue-800 transition-colors">
              View Map <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
