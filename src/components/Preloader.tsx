import { motion } from "framer-motion";
import { biensante_logo_png as logo } from "@/assets/encodedImages";

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="mb-6"
        >
          <img src={logo} alt="BienSanté Hospital" className="h-24 w-auto object-contain" />
        </motion.div>
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-blue-600 rounded-full"
          />
        </div>
        <p className="mt-4 text-slate-500 font-medium text-sm tracking-widest uppercase">
          Loading Excellence
        </p>
      </div>
    </motion.div>
  );
};

export default Preloader;
