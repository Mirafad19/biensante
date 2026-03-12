import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, User, Stethoscope, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BookAppointmentModal } from "@/components/BookAppointmentModal";

const doctors = [
  { id: 1, name: "Dr. Adebayo O.", specialty: "Cardiology", experience: "15+ Years", available: "Mon, Wed, Fri" },
  { id: 2, name: "Dr. Ngozi E.", specialty: "Neurology", experience: "12+ Years", available: "Tue, Thu, Sat" },
  { id: 3, name: "Dr. Chuks M.", specialty: "Orthopedics", experience: "18+ Years", available: "Mon - Fri" },
  { id: 4, name: "Dr. Fatima S.", specialty: "Pulmonary", experience: "10+ Years", available: "Wed, Fri, Sat" },
  { id: 5, name: "Dr. Tunde A.", specialty: "Emergency Care", experience: "8+ Years", available: "24/7 Shifts" },
  { id: 6, name: "Dr. Sarah K.", specialty: "Pediatrics", experience: "14+ Years", available: "Mon, Tue, Thu" },
];

const FindDoctor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find a Doctor</h1>
            <p className="text-xl text-blue-100 max-w-2xl mb-8">
              Search our directory of experienced specialists and medical professionals at BienSanté Hospital.
            </p>
            
            <div className="relative max-w-2xl bg-white rounded-lg p-2 flex items-center shadow-lg">
              <Search className="w-6 h-6 text-slate-400 ml-3" />
              <Input 
                type="text" 
                placeholder="Search by doctor name or specialty (e.g., Cardiology)" 
                className="border-0 focus-visible:ring-0 text-slate-900 text-lg h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No doctors found</h3>
                <p className="text-slate-600">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doc, i) => (
                  <motion.div 
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                      <User className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                    <p className="text-blue-600 font-medium mb-4 flex items-center gap-1 justify-center">
                      <Stethoscope className="w-4 h-4" /> {doc.specialty}
                    </p>
                    
                    <div className="w-full border-t border-slate-100 pt-4 mt-auto">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Experience:</span>
                        <span className="font-medium text-slate-900">{doc.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 mb-6">
                        <span>Available:</span>
                        <span className="font-medium text-slate-900">{doc.available}</span>
                      </div>
                      
                      <BookAppointmentModal>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Book Appointment
                        </Button>
                      </BookAppointmentModal>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FindDoctor;
