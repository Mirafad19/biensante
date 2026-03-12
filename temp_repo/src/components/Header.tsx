import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";
import logo from "@/assets/biensante-logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "#about" },
    { name: "SERVICE", href: "#services" },
    { name: "TESTIMONIALS", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-0.7">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} alt="BienSanté Hospital" className="h-16 md:h-20 w-auto object-contain" />
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Call Button */}
          <a
            href="tel:08022333285"
            className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-primary-dark transition-all duration-300 hover:shadow-lg"
          >
            <Phone className="w-4 h-4" />
            Call Us
          </a>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border mt-3 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              >
                {item.name}
              </a>
            ))}
            <a
              href="tel:08022333285"
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold w-fit"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
