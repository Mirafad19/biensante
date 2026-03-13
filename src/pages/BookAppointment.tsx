import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { db, auth, handleFirestoreError, OperationType } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Phone, CheckCircle2 } from "lucide-react";

export default function BookAppointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const department = formData.get("department") as string;
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    try {
      // 1. Send Email Notification via Formspree
      const formspreeEndpoint = "https://formspree.io/f/mnjgvkqy"; 
      
      let formspreeSuccess = false;
      try {
        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            subject: `New Appointment Request from ${firstName} ${lastName}`,
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            department: department,
            preferredDate: date,
            notes: notes,
          }),
        });
        if (response.ok) {
          formspreeSuccess = true;
        } else {
          console.error("Formspree error:", await response.text());
        }
      } catch (e) {
        console.error("Formspree fetch error:", e);
      }

      // 2. Save to Firebase Database
      const appointmentData = {
        patientName: `${firstName} ${lastName}`,
        patientEmail: email,
        patientPhone: phone,
        specialty: department,
        date: date,
        reason: notes,
        status: "pending",
        createdAt: serverTimestamp(),
        patientUid: auth.currentUser?.uid || null,
      };

      let firebaseSuccess = false;
      try {
        await addDoc(collection(db, "appointments"), appointmentData);
        firebaseSuccess = true;
      } catch (error) {
        console.error("Firebase save error:", error);
        try {
          handleFirestoreError(error, OperationType.WRITE, "appointments");
        } catch (e) {
          console.error("Handled firestore error:", e);
        }
      }

      setIsSubmitting(false);

      if (formspreeSuccess || firebaseSuccess) {
        (e.target as HTMLFormElement).reset();
        setIsSuccess(true);
      } else {
        toast.error("Failed to send request", {
          description: "Please try again later or contact us directly.",
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("An unexpected error occurred", {
        description: "Please try again later or contact us directly.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        {/* Header Section */}
        <section className="bg-blue-700 py-16 text-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Book an Appointment</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Schedule your visit with our specialists. Fill out the form below and our team will get back to you to confirm your appointment time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Form Column */}
              <motion.div 
                className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <CheckCircle2 className="w-24 h-24 text-green-500" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-slate-900">Request Sent Successfully!</h2>
                    <p className="text-lg text-slate-600 max-w-md">
                      Thank you for booking with BienSanté Hospital. Our team will contact you shortly to confirm your appointment.
                    </p>
                    <p className="text-sm text-slate-400 animate-pulse">
                      Redirecting to home page...
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Patient Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input id="firstName" name="firstName" required placeholder="John" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input id="lastName" name="lastName" required placeholder="Doe" className="h-12" />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required placeholder="john@example.com" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone number</Label>
                          <Input id="phone" name="phone" type="tel" required placeholder="0801 234 5678" className="h-12" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department / Specialty</Label>
                          <select 
                            id="department" 
                            name="department"
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Select a department...</option>
                            <option value="cardiology">Cardiology</option>
                            <option value="neurology">Neurology</option>
                            <option value="orthopedics">Orthopedics</option>
                            <option value="pulmonary">Pulmonary</option>
                            <option value="laboratory">Laboratory</option>
                            <option value="general">General Consultation</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input id="date" name="date" type="date" required className="h-12" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea 
                          id="notes" 
                          name="notes" 
                          placeholder="Tell us briefly about your symptoms or reason for visit." 
                          className="min-h-[120px] resize-y"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 font-bold rounded-xl" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting Request..." : "Request Appointment"}
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>

              {/* Info Column */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">What Happens Next?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">1</div>
                      <p className="text-slate-700 text-sm mt-1">We receive your appointment request.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">2</div>
                      <p className="text-slate-700 text-sm mt-1">Our team reviews the schedule for your preferred doctor or department.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">3</div>
                      <p className="text-slate-700 text-sm mt-1">We call or email you to confirm the exact time of your visit.</p>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>09155171407, 09155171408</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>No 9, Alaka Street, Shasha, Lagos</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>Mon-Sat: 8am - 8pm</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <CalendarDays className="w-5 h-5 text-blue-600" />
                      <span>Emergency: 24/7</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
