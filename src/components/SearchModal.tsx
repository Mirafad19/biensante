import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText, User, Stethoscope, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple mock search index
const searchIndex = [
  { id: 1, title: "Cardiology", type: "Service", url: "/services/cardiology", icon: Stethoscope },
  { id: 2, title: "Pulmonary", type: "Service", url: "/services/pulmonary", icon: Stethoscope },
  { id: 3, title: "Neurology", type: "Service", url: "/services/neurology", icon: Stethoscope },
  { id: 4, title: "Orthopedics", type: "Service", url: "/services/orthopedics", icon: Stethoscope },
  { id: 5, title: "Laboratory", type: "Service", url: "/services/laboratory", icon: Stethoscope },
  { id: 6, title: "Emergency Care", type: "Service", url: "/services/emergency", icon: Stethoscope },
  { id: 7, title: "About Us", type: "Page", url: "/about", icon: FileText },
  { id: 8, title: "Patients & Visitors", type: "Page", url: "/patients-visitors", icon: FileText },
  { id: 9, title: "Find a Doctor", type: "Page", url: "/find-doctor", icon: User },
  { id: 10, title: "Dr. Adebayo O. (Cardiology)", type: "Doctor", url: "/find-doctor", icon: User },
  { id: 11, title: "Dr. Ngozi E. (Neurology)", type: "Doctor", url: "/find-doctor", icon: User },
];

export function SearchModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = query.trim() === "" 
    ? [] 
    : searchIndex.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <Input 
            autoFocus
            placeholder="Search for services, doctors, or information..." 
            className="border-0 focus-visible:ring-0 px-0 text-lg shadow-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto text-slate-200 mb-4" />
              <p>Type to start searching</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result.url)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all text-left group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{result.title}</h4>
                        <p className="text-xs text-slate-500">{result.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
