import { ArrowRight, HeartPulse, Brain, Bone, Stethoscope, Baby, Microscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <HeartPulse className="w-8 h-8" />,
      title: "Cardiology",
      slug: "cardiology",
      description: "Advanced heart care, ECG diagnostics, and comprehensive treatment for cardiovascular conditions.",
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Pulmonology",
      slug: "pulmonary",
      description: "Lung health services including pulmonary function tests, asthma and COPD management.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Neurology",
      slug: "neurology",
      description: "Expert care for brain and nervous system disorders, stroke and epilepsy treatment.",
    },
    {
      icon: <Bone className="w-8 h-8" />,
      title: "Orthopedics",
      slug: "orthopedics",
      description: "Bone, joint, and muscle care — from fracture treatment to joint replacement surgeries.",
    },
    {
      icon: <Baby className="w-8 h-8" />,
      title: "Maternity & Women's Health",
      slug: "maternity",
      description: "Complete antenatal and postnatal care, gynecological services, and family planning.",
    },
    {
      icon: <Microscope className="w-8 h-8" />,
      title: "Laboratory & Diagnostics",
      slug: "laboratory",
      description: "State-of-the-art diagnostic testing, pathology services, and rapid lab results.",
    },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Medical Specialties & Services
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              BienSanté Hospital offers a comprehensive range of medical specialties. Our multidisciplinary teams work together to provide you with the highest standard of care.
            </p>
          </div>
          <button 
            onClick={() => navigate("/services/cardiology")}
            className="hidden md:inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            View All Specialties <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col items-start"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {/* Clone element to override color on hover if needed, but using CSS is easier. Let's just rely on the parent group-hover for the background, and we'll make the icon inherit color if we change it, but Lucide icons take color from className. Let's just keep it simple. */}
                <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4 flex-grow">
                {service.description}
              </p>
              <button
                onClick={() => navigate(`/services/${service.slug}`)}
                className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
          <button 
            onClick={() => navigate("/services/cardiology")}
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            View All Specialties <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
