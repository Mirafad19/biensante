import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, ChevronDown, Search, User } from "lucide-react";
import { biensante_logo_png as logo } from "@/assets/encodedImages";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchModal } from "./SearchModal";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const services = [
    { name: "Cardiology", href: "/services/cardiology" },
    { name: "Pulmonary", href: "/services/pulmonary" },
    { name: "Neurology", href: "/services/neurology" },
    { name: "Orthopedics", href: "/services/orthopedics" },
    { name: "Laboratory", href: "/services/laboratory" },
    { name: "Emergency Care", href: "/services/emergency" },
  ];

  const navItems = [
    { name: "Patients & Visitors", href: "/patients-visitors" },
    { name: "About Us", href: "/about" },
    { name: "Find a Doctor", href: "/find-doctor" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 hidden md:block">
        <div className="container mx-auto px-6 flex justify-between items-center text-xs font-medium tracking-wide">
          <div className="flex space-x-6">
            <Link to="/patient-portal" className="hover:text-white transition-colors">Careers</Link>
            <Link to="/patient-portal" className="hover:text-white transition-colors">Pay Bill</Link>
            <Link to="/patient-portal" className="hover:text-white transition-colors">Financial Assistance</Link>
            <Link to="/patient-portal" className="hover:text-white transition-colors">For Medical Professionals</Link>
          </div>
          <div className="flex items-center space-x-6">
            <a href="tel:08022333285" className="flex items-center hover:text-white transition-colors">
              <Phone className="w-3 h-3 mr-2" />
              Emergency: 0802 233 3285
            </a>
            <Link to="/patient-portal" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <User className="w-3 h-3 mr-2" />
              Patient Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="BienSanté Hospital" className="h-12 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200 flex items-center outline-none">
                Specialties & Services
                <ChevronDown className="w-4 h-4 ml-1 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg border-slate-100 p-2 rounded-xl">
                {services.map((service) => (
                  <DropdownMenuItem 
                    key={service.name} 
                    className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-lg py-2.5 px-3"
                    onClick={() => navigate(service.href)}
                  >
                    <span className="text-sm font-medium text-slate-700">{service.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors duration-200 flex items-center"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <SearchModal>
              <button className="text-slate-500 hover:text-blue-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </SearchModal>
            <Link to="/book-appointment">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-6 font-semibold"
              >
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <SearchModal>
              <button className="text-slate-500">
                <Search className="w-5 h-5" />
              </button>
            </SearchModal>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-slate-700"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Services</p>
              {services.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2 px-2 pl-4"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">More</p>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-semibold text-slate-700 hover:text-blue-600 transition-colors py-2 px-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 px-2">
              <Link to="/patient-portal" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 py-2">Patient Portal</Link>
              <Link to="/patient-portal" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600 py-2">Pay Bill</Link>
              <Link to="/book-appointment" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md font-semibold justify-center">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
