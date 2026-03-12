import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-medical-team.jpg";

const HeroSection = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Happiness", "Strength", "Wellness", "Freedom", "Vitality"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Professional medical team at BienSanté Hospital"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/70 to-primary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 border border-primary-foreground/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm bg-primary-foreground/5"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary-foreground/80 font-medium tracking-wide">
              24/7 Emergency Care Available
            </span>
          </motion.div>

          {/* Title with animated word */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-8 leading-[1.1] tracking-tight">
            Good Health Is
            <br />
            The Root Of All
            <br />
            <span className="relative inline-flex h-[1.2em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titles[titleNumber]}
                  className="text-primary inline-block"
                  initial={{ y: 60, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -60, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {titles[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/75 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Providing exceptional medical care with compassion, innovation, and excellence at BienSanté Hospital, Shasha, Lagos.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="medical"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-lg shadow-primary/30"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <a
              href="tel:08022333285"
              className="inline-flex items-center gap-2 border-2 border-primary-foreground/30 text-primary-foreground rounded-full px-8 py-3 font-semibold text-base transition-all duration-300 hover:bg-primary-foreground/10 backdrop-blur-sm"
            >
              <Phone className="w-4 h-4" />
              Call: 0802 233 3285
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
