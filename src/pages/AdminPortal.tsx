import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Search, 
  Plus, 
  Activity, 
  FileText, 
  Pill, 
  CreditCard, 
  LogOut,
  LayoutDashboard,
  Users,
  ChevronRight,
  TrendingUp,
  Heart,
  Thermometer,
  Weight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth, db } from "@/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp,
  addDoc,
  getDoc,
  Timestamp
} from "firebase/firestore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Patient {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  patientId: string;
  role: string;
}

const AdminPortal = () => {
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role !== "admin") {
            toast.error("Access denied. Admin only.");
            navigate("/patient-portal");
            return;
          }
          setUserData(data);
        }
      } else {
        navigate("/patient-portal");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Search by patientId or email
      const q = query(
        collection(db, "users"),
        where("role", "==", "patient")
      );
      const querySnapshot = await getDocs(q);
      const patients: Patient[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Patient;
        if (
          data.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${data.firstName} ${data.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          patients.push({ ...data, uid: doc.id });
        }
      });
      setSearchResults(patients);
      if (patients.length === 0) {
        toast.info("No patients found matching your search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search patients");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddVital = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    const value = formData.get("value") as string;
    const unit = formData.get("unit") as string;

    try {
      await addDoc(collection(db, "vitals"), {
        patientUid: selectedPatient.uid,
        type,
        value,
        unit,
        date: new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp(),
      });
      toast.success("Vital recorded successfully");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to record vital");
    }
  };

  const handleAddLabResult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const status = formData.get("status") as string;

    try {
      await addDoc(collection(db, "labResults"), {
        patientUid: selectedPatient.uid,
        testName: title,
        value: formData.get("value") as string || "N/A",
        unit: formData.get("unit") as string || "",
        date: new Date().toISOString().split('T')[0],
        status,
        category: formData.get("category") as string || "General",
        timestamp: serverTimestamp(),
      });
      toast.success("Lab result added successfully");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to add lab result");
    }
  };

  const handleAddPrescription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const formData = new FormData(e.currentTarget);
    const medicationName = formData.get("medicationName") as string;
    const dosage = formData.get("dosage") as string;
    const frequency = formData.get("frequency") as string;

    try {
      await addDoc(collection(db, "prescriptions"), {
        patientUid: selectedPatient.uid,
        medicationName,
        dosage,
        frequency,
        status: "active",
        doctorName: `${userData.firstName} ${userData.lastName}`,
        timestamp: serverTimestamp(),
      });
      toast.success("Prescription added successfully");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to add prescription");
    }
  };

  const handleAddInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);

    try {
      await addDoc(collection(db, "invoices"), {
        patientUid: selectedPatient.uid,
        description,
        amount,
        status: "unpaid",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timestamp: serverTimestamp(),
      });
      toast.success("Invoice generated successfully");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to generate invoice");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      
      <div className="flex-grow flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6">
          <div className="flex items-center space-x-3 mb-10 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-none">Admin Portal</h1>
              <p className="text-xs text-slate-400 mt-1">Staff Management</p>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
            <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active />
            <SidebarItem icon={<Users className="w-5 h-5" />} label="Patients" />
            <SidebarItem icon={<Activity className="w-5 h-5" />} label="Vitals Entry" />
            <SidebarItem icon={<FileText className="w-5 h-5" />} label="Lab Reports" />
            <SidebarItem icon={<Pill className="w-5 h-5" />} label="Pharmacy" />
            <SidebarItem icon={<CreditCard className="w-5 h-5" />} label="Billing" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center space-x-3 px-2 mb-6">
              <Avatar className="w-10 h-10 border-2 border-slate-100">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="font-bold text-slate-900 text-sm truncate">{userData?.firstName} {userData?.lastName}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Medical Admin</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              onClick={() => signOut(auth)}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-bold">Sign Out</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Welcome, {userData?.firstName}</h2>
                <p className="text-slate-500 mt-1">Manage patient records and clinical data securely.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search patient ID or name..." 
                    className="pl-10 w-64 bg-white border-slate-200 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </header>

            {searchResults.length > 0 && !selectedPatient && (
              <Card className="mb-8 border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((patient) => (
                      <div 
                        key={patient.uid} 
                        className="p-4 border border-slate-100 rounded-2xl hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-xs text-slate-500">{patient.patientId}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPatient ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 border-4 border-primary/10">
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                        {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                          ID: {selectedPatient.patientId}
                        </Badge>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-500 text-sm">{selectedPatient.email}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                    Change Patient
                  </Button>
                </div>

                <Tabs defaultValue="vitals" className="w-full">
                  <TabsList className="bg-white p-1 rounded-2xl shadow-sm border border-slate-50 mb-8">
                    <TabsTrigger value="vitals" className="rounded-xl px-6">Vitals</TabsTrigger>
                    <TabsTrigger value="lab" className="rounded-xl px-6">Lab Results</TabsTrigger>
                    <TabsTrigger value="pharmacy" className="rounded-xl px-6">Pharmacy</TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-xl px-6">Billing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="vitals">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle>Record New Vitals</CardTitle>
                        <CardDescription>Enter the latest measurements for {selectedPatient.firstName}.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddVital} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label>Vital Type</Label>
                            <select name="type" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                              <option value="heart-rate">Heart Rate (bpm)</option>
                              <option value="body-temp">Body Temp (°F)</option>
                              <option value="weight">Weight (lbs)</option>
                              <option value="blood-glucose">Blood Glucose (mg/dL)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Value</Label>
                            <Input name="value" type="text" placeholder="e.g. 72" required />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit</Label>
                            <Input name="unit" type="text" placeholder="e.g. bpm" required />
                          </div>
                          <Button type="submit" className="md:col-span-3">Record Vital</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="lab">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle>Add Lab Result</CardTitle>
                        <CardDescription>Upload or record a new laboratory report.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddLabResult} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Test Name</Label>
                              <Input name="title" placeholder="e.g. Complete Blood Count" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Input name="category" placeholder="e.g. Metabolic" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Value</Label>
                              <Input name="value" placeholder="e.g. 95" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Unit</Label>
                              <Input name="unit" placeholder="e.g. mg/dL" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <select name="status" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                <option value="normal">Normal</option>
                                <option value="abnormal">Abnormal</option>
                                <option value="critical">Critical</option>
                              </select>
                            </div>
                          </div>
                          <Button type="submit" className="w-full">Add Lab Result</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pharmacy">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle>New Prescription</CardTitle>
                        <CardDescription>Prescribe medication for {selectedPatient.firstName}.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddPrescription} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label>Medication Name</Label>
                              <Input name="medicationName" placeholder="e.g. Amoxicillin" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Dosage</Label>
                              <Input name="dosage" placeholder="e.g. 500mg" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Input name="frequency" placeholder="e.g. Twice daily" required />
                            </div>
                          </div>
                          <Button type="submit" className="w-full">Issue Prescription</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="billing">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle>Generate Invoice</CardTitle>
                        <CardDescription>Create a new billing record for services rendered.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddInvoice} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input name="description" placeholder="e.g. Specialist Consultation" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Amount (₦)</Label>
                              <Input name="amount" type="number" placeholder="0.00" required />
                            </div>
                          </div>
                          <Button type="submit" className="w-full">Generate Invoice</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Patient Selected</h3>
                <p className="text-slate-500 mt-2 text-center max-w-xs">
                  Search for a patient by ID, Email, or Name to start managing their records.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? "bg-primary text-white shadow-md shadow-primary/20" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default AdminPortal;
