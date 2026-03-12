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
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative py-20 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
                About BienSanté Hospital
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl">
                A decade of compassionate, affordable, and quality healthcare for the people of Shasha, Lagos and beyond.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
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
                    className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
                    <div className="text-4xl font-bold">10+</div>
                    <div className="text-sm text-primary-foreground/80">Years of Service</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                  Built on Trust, Driven by Care
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
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
        <section className="py-20 bg-medical-light">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">What Drives Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Key Milestones</h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {milestone.year.slice(2)}
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                    <p className="text-lg text-foreground font-medium mt-1">{milestone.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary-dark">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Experience Quality Care?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Book an appointment or walk in — we're here for you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="medical"
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
                <a
                  href="tel:08022333285"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/30 text-primary-foreground rounded-full px-8 py-3 font-semibold hover:bg-primary-foreground/10 transition-all"
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
