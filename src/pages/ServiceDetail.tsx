import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, CheckCircle, Clock, Users, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { service_cardiology_jpg as cardiologyImg, service_pulmonary_jpg as pulmonaryImg, service_neurology_jpg as neurologyImg, service_orthopedics_jpg as orthopedicsImg, service_laboratory_jpg as laboratoryImg, service_emergency_jpg as emergencyImg } from "@/assets/encodedImages";

const serviceData: Record<string, {
  title: string;
  image: string;
  tagline: string;
  description: string[];
  features: string[];
  conditions: string[];
  whyUs: string[];
}> = {
  cardiology: {
    title: "Cardiology",
    image: "https://image2url.com/r2/default/images/1773442908761-28549637-2151-41cc-846f-faeb540afe24.png",
    tagline: "Expert Heart Care You Can Trust",
    description: [
      "Our Cardiology department provides comprehensive heart care, from routine check-ups to advanced diagnostics and management of complex cardiovascular conditions.",
      "We use modern ECG machines, echocardiography, and Holter monitoring to diagnose heart conditions accurately and quickly. Our experienced cardiologists work closely with each patient to create personalized treatment plans.",
    ],
    features: [
      "12-lead ECG and stress testing",
      "Echocardiography (heart ultrasound)",
      "Holter monitoring (24-hour heart rhythm)",
      "Blood pressure management",
      "Cholesterol and lipid profile screening",
      "Heart failure management",
    ],
    conditions: [
      "Hypertension (High Blood Pressure)",
      "Coronary artery disease",
      "Heart failure",
      "Arrhythmias (irregular heartbeat)",
      "Chest pain evaluation",
      "Post-heart attack rehabilitation",
    ],
    whyUs: [
      "Experienced cardiologists on staff",
      "Modern diagnostic equipment",
      "Accepted by 13+ HMO partners",
      "Affordable consultation fees",
      "Same-day ECG results",
    ],
  },
  pulmonary: {
    title: "Pulmonary",
    image: "https://image2url.com/r2/default/images/1773440330238-c2c76650-f484-4b68-9b4d-521268763e1b.png",
    tagline: "Breathe Better, Live Better",
    description: [
      "Our Pulmonary department specializes in the diagnosis and treatment of lung and respiratory conditions. From asthma to COPD, we provide comprehensive respiratory care.",
      "We offer pulmonary function tests, chest X-rays, and nebulization therapy. Our team helps patients manage chronic conditions and improve their quality of life.",
    ],
    features: [
      "Pulmonary function testing (spirometry)",
      "Nebulization therapy",
      "Chest X-ray and imaging",
      "Oxygen therapy",
      "Asthma action plans",
      "Smoking cessation counseling",
    ],
    conditions: [
      "Asthma",
      "Chronic Obstructive Pulmonary Disease (COPD)",
      "Pneumonia",
      "Bronchitis",
      "Tuberculosis screening",
      "Respiratory infections",
    ],
    whyUs: [
      "Advanced spirometry equipment",
      "Dedicated respiratory therapists",
      "Walk-in nebulization services",
      "Affordable TB screening",
      "Follow-up care included",
    ],
  },
  neurology: {
    title: "Neurology",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop",
    tagline: "Expert Care for Your Brain & Nervous System",
    description: [
      "Our Neurology department offers specialized care for disorders of the brain, spinal cord, and nervous system. We diagnose and treat a wide range of neurological conditions.",
      "From headaches and seizures to stroke management, our neurologists use clinical expertise and modern diagnostics to provide the best possible outcomes for our patients.",
    ],
    features: [
      "Neurological examination and assessment",
      "EEG (electroencephalogram)",
      "Nerve conduction studies",
      "Headache and migraine management",
      "Stroke risk assessment",
      "Epilepsy monitoring and treatment",
    ],
    conditions: [
      "Stroke and TIA (mini-stroke)",
      "Epilepsy and seizure disorders",
      "Migraine and chronic headaches",
      "Peripheral neuropathy",
      "Bell's palsy",
      "Dizziness and vertigo",
    ],
    whyUs: [
      "Experienced neurologists",
      "Comprehensive diagnostic workup",
      "Stroke emergency protocols",
      "Ongoing patient education",
      "Referral network for advanced cases",
    ],
  },
  orthopedics: {
    title: "Orthopedics",
    image: "https://image2url.com/r2/default/images/1773440525219-91c2d568-449a-4c6d-ab5e-ca750bc21a25.png",
    tagline: "Get Back on Your Feet — Stronger",
    description: [
      "Our Orthopedic department provides expert care for bone, joint, and muscle conditions. Whether it's a fracture, chronic joint pain, or sports injury, our team is equipped to help.",
      "We offer fracture management, joint injections, physiotherapy referrals, and post-operative rehabilitation. Our goal is to restore mobility and improve quality of life.",
    ],
    features: [
      "Fracture diagnosis and casting",
      "Joint pain management",
      "Arthritis treatment",
      "Sports injury care",
      "Physiotherapy coordination",
      "Pre-surgical assessment",
    ],
    conditions: [
      "Fractures and dislocations",
      "Osteoarthritis",
      "Rheumatoid arthritis",
      "Back and neck pain",
      "Ligament and tendon injuries",
      "Osteoporosis screening",
    ],
    whyUs: [
      "Skilled orthopedic specialists",
      "On-site X-ray for quick diagnosis",
      "Affordable casting and splinting",
      "Post-treatment follow-up",
      "Coordination with physiotherapists",
    ],
  },
  laboratory: {
    title: "Laboratory",
    image: "https://image2url.com/r2/default/images/1773440570989-f69f70f9-06f8-4e0b-9919-dcd038220e66.png",
    tagline: "Accurate Results, Fast Turnaround",
    description: [
      "Our modern laboratory delivers accurate and reliable diagnostic results to support clinical decision-making. We perform a wide range of tests from routine blood work to specialized screenings.",
      "With quality-controlled processes and experienced lab scientists, you can trust that your results are accurate. Most routine results are available within hours.",
    ],
    features: [
      "Complete blood count (CBC)",
      "Blood glucose and HbA1c testing",
      "Liver and kidney function tests",
      "Lipid profile (cholesterol)",
      "Urinalysis and stool analysis",
      "Pregnancy testing (blood and urine)",
    ],
    conditions: [
      "Diabetes screening and monitoring",
      "Malaria parasite testing",
      "Typhoid (Widal) test",
      "HIV/STI screening",
      "Hepatitis B & C testing",
      "Genotype and blood group",
    ],
    whyUs: [
      "Modern lab equipment",
      "Quality-controlled processes",
      "Same-day results for most tests",
      "Affordable pricing",
      "HMO-covered tests available",
    ],
  },
  emergency: {
    title: "Emergency Care",
    image: "https://image2url.com/r2/default/images/1773441788512-93f12389-523e-4802-bfb4-1099352ffc18.png",
    tagline: "When Every Second Counts",
    description: [
      "Our 24/7 Emergency Care unit is equipped and staffed to handle medical emergencies at any time of day or night. From trauma to acute medical conditions, our emergency team responds swiftly.",
      "We have experienced emergency physicians, trained nurses, and life-saving equipment on standby. No appointment needed — walk in or call ahead for faster response.",
    ],
    features: [
      "24/7 availability — no appointments needed",
      "Trauma and accident care",
      "Emergency resuscitation equipment",
      "IV fluid administration",
      "Wound management and suturing",
      "Emergency lab and imaging",
    ],
    conditions: [
      "Severe injuries and trauma",
      "Heart attacks and chest pain",
      "Breathing difficulties",
      "High fever and convulsions",
      "Severe allergic reactions",
      "Poisoning and drug overdose",
    ],
    whyUs: [
      "Round-the-clock emergency doctors",
      "Life-saving equipment on standby",
      "Rapid triage and response",
      "Ambulance coordination",
      "Affordable emergency fees",
    ],
  },
};

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 pt-48">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <Button onClick={() => navigate("/")} className="bg-blue-700 hover:bg-blue-800 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          <div className="relative z-10 container mx-auto px-6 pb-16 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 mb-6 -ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                {service.title}
              </h1>
              <p className="text-xl text-slate-200 max-w-2xl leading-relaxed">
                {service.tagline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Description */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-16">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">
                  About Our {service.title} Department
                </h2>
                <div className="space-y-6">
                  {service.description.map((p, i) => (
                    <p key={i} className="text-slate-600 text-lg leading-relaxed">{p}</p>
                  ))}
                </div>
              </motion.div>

              {/* Quick Info Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-xl p-8 border border-slate-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-8">Quick Info</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">Hours</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {slug === "emergency" ? "24/7 — Always Open" : "Mon–Sat: 8AM – 6PM"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">HMO Accepted</p>
                      <p className="text-sm text-slate-600 mt-1">13+ HMO partners including NHIS</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Stethoscope className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">Consultation</p>
                      <p className="text-sm text-slate-600 mt-1">Walk-in or call to book</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 space-y-4">
                  <a
                    href="tel:09155171407"
                    className="flex items-center justify-center gap-2 bg-blue-700 text-white rounded-lg px-6 py-3.5 font-semibold hover:bg-blue-800 transition-colors w-full"
                  >
                    <Phone className="w-4 h-4" />
                    Call: 0915 517 1407
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services & Conditions */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16">
              {/* What We Offer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">What We Offer</h3>
                <div className="space-y-4">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Conditions We Treat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Conditions We Treat</h3>
                <div className="space-y-4">
                  {service.conditions.map((condition, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">
                Why Choose BienSanté for {service.title}?
              </h3>
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                {service.whyUs.map((reason, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-slate-800 font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-blue-700">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Need {service.title} Care?
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Walk in or call us to book a consultation. We're ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:09155171407"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 rounded-lg px-8 h-14 font-semibold text-lg hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <Button
                  size="lg"
                  className="border-2 border-blue-400 text-white bg-transparent hover:bg-blue-600 rounded-lg h-14 px-8 font-semibold text-lg"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
