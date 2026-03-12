import { MapPin, Phone, Mail, Twitter, Facebook, Youtube, Linkedin, ChevronRight } from "lucide-react";
import logo from "@/assets/biensante-logo.png";

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
    { name: "About Us", href: "#about" },
    { name: "Our Services", href: "#services" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact Us", href: "#faq" },
  ];

  return (
    <footer className="bg-medical-dark text-medical-dark-foreground">
      <div className="container mx-auto px-6 py-16">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-12">
          <img src={logo} alt="BienSanté Hospital" className="h-16 md:h-20 w-auto object-contain brightness-0 invert" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Address */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Address</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span>No 9, Alaka Street, off Bameke Rd., Shasha</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>09155171407 09155171408</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>biensantemedicacentre@gmail.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              {[Twitter, Facebook, Youtube, Linkedin].map((Icon, i) => (
                <div key={i} className="w-10 h-10 border border-medical-dark-foreground/20 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-colors cursor-pointer">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <a key={service.name} href={`/services/${service.slug}`} className="flex items-center space-x-2 group">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  <span className="group-hover:text-primary transition-colors cursor-pointer">{service.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <a key={link.name} href={link.href} className="flex items-center space-x-2 group">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  <span className="group-hover:text-primary transition-colors">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-medical-dark-foreground/80 mb-4">
              Subscribe to our newsletter for health tips and updates.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-medical-dark-foreground/10 border border-medical-dark-foreground/20 rounded-lg text-medical-dark-foreground placeholder:text-medical-dark-foreground/50 focus:outline-none focus:border-primary"
              />
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-medical-dark-foreground/20 mt-12 pt-6 flex justify-center items-center text-sm">
          <p>&copy; {new Date().getFullYear()} BienSanté Hospital. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
