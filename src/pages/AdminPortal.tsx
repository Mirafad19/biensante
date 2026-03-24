import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { biensante_logo_png as logo } from "@/assets/encodedImages";
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

interface Vital {
  id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  timestamp: Timestamp;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  status: string;
  category: string;
  date: string;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  status: string;
  doctorName: string;
}

interface Invoice {
  id: string;
  description: string;
  amount: number;
  status: string;
  dueDate: string;
}

const AdminPortal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // History states
  const [patientVitals, setPatientVitals] = useState<Vital[]>([]);
  const [patientLabs, setPatientLabs] = useState<LabResult[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalPatients: 0,
    recentVitals: 0,
    activePrescriptions: 0,
    pendingInvoices: 0
  });

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
          fetchStats();
        }
      } else {
        navigate("/patient-portal");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const patientsQ = query(collection(db, "users"), where("role", "==", "patient"));
      const patientsSnap = await getDocs(patientsQ);
      const patientsList = patientsSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as Patient));
      setAllPatients(patientsList);
      
      const vitalsSnap = await getDocs(collection(db, "vitals"));
      const presSnap = await getDocs(query(collection(db, "prescriptions"), where("status", "==", "active")));
      const invSnap = await getDocs(query(collection(db, "invoices"), where("status", "==", "unpaid")));

      setStats({
        totalPatients: patientsSnap.size,
        recentVitals: vitalsSnap.size,
        activePrescriptions: presSnap.size,
        pendingInvoices: invSnap.size
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientHistory(selectedPatient.uid);
    }
  }, [selectedPatient]);

  const fetchPatientHistory = async (patientUid: string) => {
    setIsHistoryLoading(true);
    try {
      // Fetch Vitals
      const vitalsQ = query(collection(db, "vitals"), where("patientUid", "==", patientUid));
      const vitalsSnap = await getDocs(vitalsQ);
      setPatientVitals(vitalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vital)));

      // Fetch Labs
      const labsQ = query(collection(db, "labResults"), where("patientUid", "==", patientUid));
      const labsSnap = await getDocs(labsQ);
      setPatientLabs(labsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LabResult)));

      // Fetch Prescriptions
      const presQ = query(collection(db, "prescriptions"), where("patientUid", "==", patientUid));
      const presSnap = await getDocs(presQ);
      setPatientPrescriptions(presSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prescription)));

      // Fetch Invoices
      const invQ = query(collection(db, "invoices"), where("patientUid", "==", patientUid));
      const invSnap = await getDocs(invQ);
      setPatientInvoices(invSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice)));
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load patient history");
    } finally {
      setIsHistoryLoading(false);
    }
  };

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
      fetchPatientHistory(selectedPatient.uid); // Refresh history
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
      fetchPatientHistory(selectedPatient.uid); // Refresh history
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
      fetchPatientHistory(selectedPatient.uid); // Refresh history
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
      fetchPatientHistory(selectedPatient.uid); // Refresh history
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
        <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col p-6 text-white">
          <div className="flex items-center mb-10 px-2">
            <img src={logo} alt="Biensante Staff" className="h-12 w-auto object-contain brightness-0 invert" />
          </div>

          <nav className="space-y-1 flex-grow">
            <SidebarItem 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
              active={activeTab === "dashboard"} 
              onClick={() => setActiveTab("dashboard")}
            />
            <SidebarItem 
              icon={<Users className="w-5 h-5" />} 
              label="Patient Directory" 
              active={activeTab === "patients"} 
              onClick={() => setActiveTab("patients")}
            />
            <SidebarItem icon={<Activity className="w-5 h-5" />} label="Clinical Records" />
            <SidebarItem icon={<FileText className="w-5 h-5" />} label="Lab Management" />
            <SidebarItem icon={<Pill className="w-5 h-5" />} label="Pharmacy" />
            <SidebarItem icon={<CreditCard className="w-5 h-5" />} label="Billing & Finance" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-3 px-2 mb-6">
              <Avatar className="w-10 h-10 border-2 border-slate-700">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="font-bold text-white text-sm truncate">{userData?.firstName} {userData?.lastName}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Medical Administrator</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
              onClick={() => signOut(auth)}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-bold">Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === "dashboard" ? (
              <div className="space-y-10">
                <header>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Dashboard</h2>
                  <p className="text-slate-500 font-medium mt-1">Hospital performance and patient activity overview.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AdminStatCard icon={<Users className="text-blue-600" />} label="Total Patients" value={stats.totalPatients.toString()} trend="+12% this month" />
                  <AdminStatCard icon={<Activity className="text-emerald-600" />} label="Vital Records" value={stats.recentVitals.toString()} trend="+48 today" />
                  <AdminStatCard icon={<Pill className="text-purple-600" />} label="Active Prescriptions" value={stats.activePrescriptions.toString()} trend="8 pending review" />
                  <AdminStatCard icon={<CreditCard className="text-orange-600" />} label="Pending Invoices" value={stats.pendingInvoices.toString()} trend="₦2.4M outstanding" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-bold">Patient Directory Overview</CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => setActiveTab("patients")}>
                        View All <ChevronRight className="ml-1 w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                        {allPatients.slice(0, 5).map((patient) => (
                          <div 
                            key={patient.uid} 
                            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setActiveTab("patients");
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{patient.firstName} {patient.lastName}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{patient.email}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
                              {patient.patientId}
                            </Badge>
                          </div>
                        ))}
                        {allPatients.length === 0 && (
                          <div className="p-8 text-center text-slate-400 italic">
                            No patients registered yet.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                      <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <QuickActionButton icon={<Plus className="w-5 h-5" />} label="Register Patient" color="bg-blue-50 text-blue-600" />
                        <QuickActionButton icon={<FileText className="w-5 h-5" />} label="New Lab Request" color="bg-emerald-50 text-emerald-600" />
                        <QuickActionButton icon={<Pill className="w-5 h-5" />} label="Issue Medication" color="bg-purple-50 text-purple-600" />
                        <QuickActionButton icon={<TrendingUp className="w-5 h-5" />} label="View Reports" color="bg-orange-50 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <>
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Patient Directory</h2>
                    <p className="text-slate-500 font-medium mt-1">Search and manage patient clinical records.</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Patient ID, Name or Email..." 
                        className="pl-10 w-64 bg-white border-slate-200 rounded-xl h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching} className="h-11 px-6 rounded-xl font-bold">
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </header>

                {searchResults.length > 0 && !selectedPatient && (
                  <Card className="mb-8 border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                      <CardTitle className="text-lg font-bold">Search Results</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.map((patient) => (
                          <div 
                            key={patient.uid} 
                            className="p-4 border border-slate-100 rounded-2xl hover:border-primary hover:shadow-md transition-all cursor-pointer group bg-white"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                  {patient.firstName[0]}{patient.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-grow overflow-hidden">
                                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                                  {patient.firstName} {patient.lastName}
                                </p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{patient.patientId}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!selectedPatient && searchResults.length === 0 && (
                  <Card className="mb-8 border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                      <CardTitle className="text-lg font-bold">All Registered Patients</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allPatients.map((patient) => (
                          <div 
                            key={patient.uid} 
                            className="p-4 border border-slate-100 rounded-2xl hover:border-primary hover:shadow-md transition-all cursor-pointer group bg-white"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                  {patient.firstName[0]}{patient.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-grow overflow-hidden">
                                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                                  {patient.firstName} {patient.lastName}
                                </p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{patient.patientId}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        ))}
                        {allPatients.length === 0 && (
                          <div className="col-span-full p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No patients registered in the system yet.</p>
                          </div>
                        )}
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
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">
                              ID: {selectedPatient.patientId}
                            </Badge>
                            <span className="text-slate-400 text-sm">•</span>
                            <span className="text-slate-500 text-sm font-medium">{selectedPatient.email}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedPatient(null)} className="rounded-xl font-bold border-slate-200">
                        Back to Directory
                      </Button>
                    </div>

                    <Tabs defaultValue="vitals" className="w-full">
                      <TabsList className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-50 mb-8">
                        <TabsTrigger value="vitals" className="rounded-xl px-8 font-bold py-2.5">Clinical Vitals</TabsTrigger>
                        <TabsTrigger value="lab" className="rounded-xl px-8 font-bold py-2.5">Lab Reports</TabsTrigger>
                        <TabsTrigger value="pharmacy" className="rounded-xl px-8 font-bold py-2.5">Pharmacy</TabsTrigger>
                        <TabsTrigger value="billing" className="rounded-xl px-8 font-bold py-2.5">Billing</TabsTrigger>
                      </TabsList>
                      {/* ... tabs content ... */}

                  <TabsContent value="vitals">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-1 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Record New Vitals</CardTitle>
                          <CardDescription>Enter latest measurements.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleAddVital} className="space-y-4">
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
                            <Button type="submit" className="w-full">Record Vital</Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Vitals History</CardTitle>
                          <CardDescription>Recent records for {selectedPatient.firstName}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            {isHistoryLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            ) : patientVitals.length > 0 ? (
                              <div className="space-y-4">
                                {patientVitals.sort((a, b) => b.date.localeCompare(a.date)).map((vital) => (
                                  <div key={vital.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        {vital.type === 'heart-rate' && <Heart className="w-5 h-5 text-red-500" />}
                                        {vital.type === 'body-temp' && <Thermometer className="w-5 h-5 text-orange-500" />}
                                        {vital.type === 'weight' && <Weight className="w-5 h-5 text-blue-500" />}
                                        {vital.type === 'blood-glucose' && <Activity className="w-5 h-5 text-emerald-500" />}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900 capitalize">{vital.type.replace('-', ' ')}</p>
                                        <p className="text-xs text-slate-500">{vital.date}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-black text-slate-900">{vital.value} <span className="text-xs font-medium text-slate-500">{vital.unit}</span></p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12 text-slate-400">No vitals recorded yet.</div>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="lab">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-1 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Add Lab Result</CardTitle>
                          <CardDescription>Record a new laboratory report.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleAddLabResult} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Test Name</Label>
                              <Input name="title" placeholder="e.g. CBC" required />
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
                            <Button type="submit" className="w-full">Add Result</Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Lab History</CardTitle>
                          <CardDescription>Historical reports for {selectedPatient.firstName}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            {isHistoryLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            ) : patientLabs.length > 0 ? (
                              <div className="space-y-4">
                                {patientLabs.sort((a, b) => b.date.localeCompare(a.date)).map((lab) => (
                                  <div key={lab.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-bold text-slate-900">{lab.testName}</h4>
                                      <Badge className={
                                        lab.status === 'normal' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                                        lab.status === 'abnormal' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                                        'bg-red-100 text-red-700 hover:bg-red-100'
                                      }>
                                        {lab.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="text-slate-500">
                                        <span className="font-medium text-slate-700">{lab.value} {lab.unit}</span> • {lab.category}
                                      </div>
                                      <div className="text-slate-400">{lab.date}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12 text-slate-400">No lab results found.</div>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="pharmacy">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-1 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">New Prescription</CardTitle>
                          <CardDescription>Issue medication.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleAddPrescription} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Medication</Label>
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
                            <Button type="submit" className="w-full">Issue</Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Prescription History</CardTitle>
                          <CardDescription>Active and past medications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            {isHistoryLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            ) : patientPrescriptions.length > 0 ? (
                              <div className="space-y-4">
                                {patientPrescriptions.map((pres) => (
                                  <div key={pres.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-bold text-slate-900">{pres.medicationName}</h4>
                                      <Badge variant="outline" className="text-primary border-primary/20">
                                        {pres.status}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Dosage</p>
                                        <p className="text-slate-700 font-medium">{pres.dosage}</p>
                                      </div>
                                      <div>
                                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Frequency</p>
                                        <p className="text-slate-700 font-medium">{pres.frequency}</p>
                                      </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-400">
                                      Prescribed by {pres.doctorName}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12 text-slate-400">No prescriptions found.</div>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="billing">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-1 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Generate Invoice</CardTitle>
                          <CardDescription>Create billing record.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleAddInvoice} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input name="description" placeholder="Consultation" required />
                            </div>
                            <div className="space-y-2">
                              <Label>Amount (₦)</Label>
                              <Input name="amount" type="number" placeholder="0.00" required />
                            </div>
                            <Button type="submit" className="w-full">Generate</Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Billing History</CardTitle>
                          <CardDescription>Invoices and payment status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            {isHistoryLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            ) : patientInvoices.length > 0 ? (
                              <div className="space-y-4">
                                {patientInvoices.map((inv) => (
                                  <div key={inv.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                      <h4 className="font-bold text-slate-900">{inv.description}</h4>
                                      <p className="text-xs text-slate-500">Due: {inv.dueDate}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-black text-slate-900">₦{inv.amount.toLocaleString()}</p>
                                      <Badge className={inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}>
                                        {inv.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12 text-slate-400">No invoices found.</div>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
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
          </>
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
        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const AdminStatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
    </CardContent>
  </Card>
);

const QuickActionButton = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
  <button className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all hover:scale-[1.05] active:scale-[0.98] ${color}`}>
    <div className="mb-2">{icon}</div>
    <span className="text-xs font-bold text-center">{label}</span>
  </button>
);

export default AdminPortal;
