import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cardiologyImg from "@/assets/service-cardiology.jpg";
import pulmonaryImg from "@/assets/service-pulmonary.jpg";
import neurologyImg from "@/assets/service-neurology.jpg";
import orthopedicsImg from "@/assets/service-orthopedics.jpg";
import laboratoryImg from "@/assets/service-laboratory.jpg";
import emergencyImg from "@/assets/service-emergency.jpg";

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      image: cardiologyImg,
      title: "Cardiology",
      slug: "cardiology",
      description: "Advanced heart care, ECG diagnostics, and treatment for cardiovascular conditions.",
    },
    {
      image: pulmonaryImg,
      title: "Pulmonary",
      slug: "pulmonary",
      description: "Lung health services including pulmonary function tests, asthma and COPD management.",
    },
    {
      image: neurologyImg,
      title: "Neurology",
      slug: "neurology",
      description: "Expert care for brain and nervous system disorders, stroke and epilepsy treatment.",
    },
    {
      image: orthopedicsImg,
      title: "Orthopedics",
      slug: "orthopedics",
      description: "Bone, joint, and muscle care — from fracture treatment to joint replacement.",
    },
    {
      image: laboratoryImg,
      title: "Laboratory",
      slug: "laboratory",
      description: "Accurate diagnostic testing, pathology services, and rapid lab results.",
    },
    {
      image: emergencyImg,
      title: "Emergency Care",
      slug: "emergency",
      description: "24/7 emergency response with experienced doctors and modern life-saving equipment.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-medical-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare delivered by experienced professionals using modern medical technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-background rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <button
                  onClick={() => navigate(`/services/${service.slug}`)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
