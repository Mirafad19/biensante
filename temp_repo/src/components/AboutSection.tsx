import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import aboutImg from "@/assets/about-doctor.jpg";

const features = [
  "Quality health care",
  "Only Qualified Doctors",
  "Medical Research Professionals",
  "13+ HMO Partners Accepted",
];

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutImg}
                alt="Doctor consultation at BienSanté Hospital"
                className="w-full h-auto object-cover aspect-[4/5]"
              />
              {/* Overlay accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 md:right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl"
            >
              <div className="text-4xl font-extrabold">24/7</div>
              <div className="text-sm text-primary-foreground/80">Emergency Care</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -left-4 md:left-6 md:top-6 bg-background text-foreground rounded-2xl p-5 shadow-xl border border-border"
            >
              <div className="text-3xl font-extrabold text-primary">15+</div>
              <div className="text-xs text-muted-foreground font-medium">Qualified Doctors</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="lg:pl-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-wider uppercase">About Us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 mt-3 leading-tight tracking-tight">
              Why You Should Trust Us?{" "}
              <span className="block">Get to Know Us!</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-5 leading-relaxed">
              We are committed to excellence and have developed multiple competencies in
              the provision of integrated managed healthcare services.
            </p>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our main goal is to provide very affordable, quality and high standard services
              because we believe that quality healthcare should be affordable and accessible to
              everyone.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Button
              variant="medical"
              size="lg"
              onClick={() => navigate("/about")}
              className="group"
            >
              Read More
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
