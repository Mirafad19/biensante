import { MapPin, Phone, Mail, Twitter, Facebook, Youtube, Linkedin, ChevronRight } from "lucide-react";
import { biensante_logo_png as logo } from "@/assets/encodedImages";
import { Link } from "react-router-dom";

const Footer = () => {
  const services = [
    { name: "Cardiology", slug: "cardiology" },
    { name: "Pulmonary", slug: "pulmonary" },
    { name: "Neurology", slug: "neurology" },
    { name: "Orthopedics", slug: "orthopedics" },
    { name: "Laboratory", slug: "laboratory" },
    { name: "Emergency Care", slug: "emergency" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Find a Doctor", href: "/find-doctor" },
    { name: "Patients & Visitors", href: "/patients-visitors" },
    { name: "Patient Portal", href: "/patient-portal" },
  ];

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Link to="/">
              <img src={logo} alt="BienSanté Hospital" className="h-20 md:h-20 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Providing compassionate, world-class healthcare to our community. Your health is our priority.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">No 9, Alaka Street, off Bameke Rd., Shasha</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">09155171407, 09155171408</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">biensantemedicacentre@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Specialties</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link to={`/services/${service.slug}`} className="flex items-center space-x-2 group text-sm hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="flex items-center space-x-2 group text-sm hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Connect With Us</h3>
            <p className="text-sm text-slate-500 mb-6">
              Follow us on social media for health tips, news, and updates from our hospital.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Youtube, href: "https://youtube.com" },
                { Icon: Linkedin, href: "https://linkedin.com" }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} BienSanté Hospital. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link to="/patient-rights" className="hover:text-blue-600 transition-colors">Patient Rights</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;