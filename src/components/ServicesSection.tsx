import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    title: "Cardiology",
    slug: "cardiology",
    description: "Advanced heart care, ECG diagnostics, and comprehensive treatment for cardiovascular conditions.",
    image: "https://image2url.com/r2/default/images/1773442908761-28549637-2151-41cc-846f-faeb540afe24.png",
  },
  {
    title: "Pulmonary",
    slug: "pulmonary",
    description: "Lung health services including pulmonary function tests, asthma and COPD management.",
    image: "https://image2url.com/r2/default/images/1773440330238-c2c76650-f484-4b68-9b4d-521268763e1b.png",
  },
  {
    title: "Neurology",
    slug: "neurology",
    description: "Expert care for brain and nervous system disorders, stroke and epilepsy treatment.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Orthopedics",
    slug: "orthopedics",
    description: "Bone, joint, and muscle care — from fracture treatment to joint replacement surgeries.",
    image: "https://image2url.com/r2/default/images/1773440525219-91c2d568-449a-4c6d-ab5e-ca750bc21a25.png",
  },
  {
    title: "Emergency Care",
    slug: "emergency",
    description: "24/7 rapid response for critical conditions, trauma, and urgent medical needs.",
    image: "https://image2url.com/r2/default/images/1773441788512-93f12389-523e-4802-bfb4-1099352ffc18.png",
  },
  {
    title: "Laboratory & Diagnostics",
    slug: "laboratory",
    description: "State-of-the-art diagnostic testing, pathology services, and rapid lab results.",
    image: "https://image2url.com/r2/default/images/1773440570989-f69f70f9-06f8-4e0b-9919-dcd038220e66.png",
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Medical Specialties & Services
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            BienSanté Hospital offers a comprehensive range of medical specialties. Our 
            multidisciplinary teams work together to provide you with the highest standard of care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer h-[400px]"
              onClick={() => navigate(`/services/${service.slug}`)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-3 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {service.title}
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {service.description}
                </p>
                <div className="flex items-center text-blue-400 font-semibold text-sm">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
