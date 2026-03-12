import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="max-w-2xl w-full text-center bg-white rounded-2xl shadow-sm border border-slate-200 p-10 md:p-16">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Page Not Found
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto">
            We're sorry, but the page you are looking for doesn't exist or has been moved. 
            If you need immediate medical assistance, please call our emergency line.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 h-12 px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => navigate("/")}
              size="lg"
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 h-12 px-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Need help? Call our main line at <a href="tel:08022333285" className="text-blue-600 font-medium hover:underline">0802 233 3285</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
