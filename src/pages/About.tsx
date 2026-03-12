import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, Clock, Users, Shield, Stethoscope, Award, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import aboutImg from "@/assets/about-doctor.jpg";
import { useNavigate } from "react-router-dom";

const values = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description: "Every patient is treated with empathy, dignity, and respect — because healing begins with how you're treated.",
  },
  {
    icon: Shield,
    title: "Affordable Access",
    description: "Quality healthcare shouldn't break the bank. We keep our services accessible to every family in Shasha and beyond.",
  },
  {
    icon: Stethoscope,
    title: "Qualified Professionals",
    description: "Our team of 15+ experienced doctors and specialists bring expertise across cardiology, neurology, orthopedics and more.",
  },
  {
    icon: Award,
    title: "10+ Years of Trust",
    description: "Serving the Shasha community for over a decade with consistent, reliable, and high-standard medical services.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Services",
    description: "Medical emergencies don't wait — neither do we. Our emergency unit is staffed and ready around the clock.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "From antenatal care to elderly wellness, we are invested in the long-term health of every member of our community.",
  },
];

const milestones = [
  { year: "2013", event: "BienSanté Hospital founded in Shasha, Lagos" },
  { year: "2016", event: "Expanded to 8 specialized departments" },
  { year: "2019", event: "Partnered with 13+ HMO providers" },
  { year: "2022", event: "Upgraded laboratory with modern diagnostic equipment" },
  { year: "2024", event: "Launched 24/7 Emergency Care Unit" },
  { year: "2025", event: "Introduced AI-powered patient assistance" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-24">
        {/* Hero Banner */}
        <section className="relative py-24 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-slate-300 hover:text-white hover:bg-slate-800 mb-8 -ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                About BienSanté Hospital
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                A decade of compassionate, affordable, and quality healthcare for the people of Shasha, Lagos and beyond.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <img
                    src={aboutImg}
                    alt="Doctor at BienSanté Hospital"
                    className="rounded-xl shadow-lg w-full object-cover aspect-[4/5]"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-blue-700 text-white rounded-xl p-8 shadow-xl border-4 border-white">
                    <div className="text-5xl font-bold mb-1">10+</div>
                    <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Years of Service</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:pl-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight">
                  Built on Trust, Driven by Care
                </h2>
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                  <p>
                    BienSanté Hospital was established with a simple but powerful mission: to make quality healthcare affordable and accessible to everyone in our community.
                  </p>
                  <p>
                    Located at No. 9 Alaka Street, off Bammekke Road, Shasha, Lagos, we have grown from a small clinic into a multi-department hospital trusted by thousands of families across Shasha, Egbeda, Dopemu, and surrounding areas.
                  </p>
                  <p>
                    We believe that where you live or how much you earn should never determine the quality of healthcare you receive. That's why we partner with 13+ HMO providers including NHIS, offer competitive consultation fees, and maintain a 24/7 emergency unit.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Our Core Values</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every decision we make is rooted in these principles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Key Milestones</h2>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-6 md:ml-[50%] md:-translate-x-1/2">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`mb-12 relative pl-10 md:pl-0 ${
                    i % 2 === 0 ? "md:pr-12 md:text-right md:ml-0 md:mr-auto md:w-1/2" : "md:pl-12 md:ml-auto md:w-1/2"
                  }`}
                >
                  <div className={`absolute top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm -left-[9px] ${
                    i % 2 === 0 ? "md:-right-[9px] md:left-auto" : "md:-left-[9px]"
                  }`} />
                  <div className="pb-2">
                    <span className="text-sm font-bold text-blue-600 tracking-wider uppercase">{milestone.year}</span>
                    <p className="text-lg text-slate-900 font-medium mt-2">{milestone.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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
                Ready to Experience Quality Care?
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Book an appointment or walk in — we're here for you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-slate-100 rounded-lg font-semibold text-lg px-8 h-14"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
                <a
                  href="tel:08022333285"
                  className="inline-flex items-center justify-center gap-2 border-2 border-blue-400 text-white rounded-lg px-8 h-14 font-semibold text-lg hover:bg-blue-600 transition-colors"
                >
                  Call: 0802 233 3285
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
