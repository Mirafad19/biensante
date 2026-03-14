import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const aboutImg = "https://image2url.com/r2/default/images/1773443576364-d04f6fcb-8f16-4ccd-ae22-ef64ba6ca944.jpg";

const features = [
  "Comprehensive, patient-centered care",
  "Board-certified specialists and surgeons",
  "Advanced medical technology and facilities",
  "Accepted by major HMOs and insurance providers",
];

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-24 bg-slate-50 border-t border-slate-100">
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
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src={aboutImg}
                alt="Doctor consultation at BienSanté Hospital"
                className="w-full h-auto object-cover aspect-[4/3] md:aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-8 -right-4 md:-right-8 bg-blue-600 text-white rounded-lg p-6 shadow-xl max-w-[200px]"
            >
              <div className="text-4xl font-bold mb-1">15+</div>
              <div className="text-sm text-blue-100 font-medium leading-tight">Years of Excellence in Healthcare</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              A Legacy of Excellence in Healthcare
            </h2>

            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              At BienSanté Hospital, we are committed to providing exceptional medical care to our community. Our multidisciplinary team of experts works collaboratively to ensure the best possible outcomes for every patient.
            </p>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              We believe that quality healthcare should be accessible, compassionate, and driven by the latest medical advancements. From routine check-ups to complex surgical procedures, your health is our priority.
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
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => navigate("/about")}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-8 font-semibold"
            >
              Learn More About Us
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
