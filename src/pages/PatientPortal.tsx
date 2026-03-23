import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Lock, 
  Mail, 
  Calendar, 
  FileText, 
  Activity, 
  LogOut, 
  LayoutDashboard, 
  Pill, 
  Video,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Download,
  Filter,
  MoreVertical,
  CreditCard as BillingIcon,
  MessageSquare as ChatIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Heart,
  Thermometer,
  Weight,
  Settings,
  Bell,
  Search,
  Globe,
  Plus
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth, db, handleFirestoreError, OperationType } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp,
  getDoc,
  orderBy,
  limit,
  addDoc
} from "firebase/firestore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  firstName: string;
  lastName: string;
  patientId: string;
  role: string;
  email: string;
}

interface Appointment {
  id: string;
  date: string;
  specialty: string;
  status: string;
  doctorName?: string;
  time?: string;
}

interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: Date | string | number | { seconds: number; nanoseconds: number };
  category: string;
}

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  status: 'active' | 'completed' | 'discontinued';
  doctorName: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date | string | number | { seconds: number; nanoseconds: number };
  senderName: string;
}

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
}

const PatientPortal = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newMessage, setNewMessage] = useState("");

  // Mock data for charts
  const healthData = [
    { name: 'Mon', bpm: 72, weight: 165, glucose: 95 },
    { name: 'Tue', bpm: 75, weight: 164.8, glucose: 98 },
    { name: 'Wed', bpm: 70, weight: 165.2, glucose: 92 },
    { name: 'Thu', bpm: 68, weight: 165, glucose: 94 },
    { name: 'Fri', bpm: 74, weight: 164.5, glucose: 96 },
    { name: 'Sat', bpm: 71, weight: 164.2, glucose: 93 },
    { name: 'Sun', bpm: 72, weight: 164, glucose: 95 },
  ];

  useEffect(() => {
    let unsubAppointments: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user profile data
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        // Fetch appointments
        try {
          const aptsQuery = query(
            collection(db, "appointments"),
            where("patientUid", "==", currentUser.uid),
            orderBy("date", "desc"),
            limit(5)
          );
          
          unsubAppointments = onSnapshot(aptsQuery, (snapshot) => {
            setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "appointments");
          });
        } catch (error) {
          console.error("Error setting up appointments listener:", error);
        }

        // Mock data for demo purposes (if collections are empty)
        setLabResults([
          { id: '1', testName: 'Blood Glucose', value: '95', unit: 'mg/dL', status: 'normal', date: new Date(), category: 'Metabolic' },
          { id: '2', testName: 'Hemoglobin A1c', value: '5.4', unit: '%', status: 'normal', date: new Date(), category: 'Metabolic' },
          { id: '3', testName: 'LDL Cholesterol', value: '135', unit: 'mg/dL', status: 'abnormal', date: new Date(), category: 'Lipid Panel' }
        ]);

        setPrescriptions([
          { id: '1', medicationName: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'active', doctorName: 'Dr. Sarah Wilson' },
          { id: '2', medicationName: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'active', doctorName: 'Dr. James Chen' }
        ]);

        setMessages([
          { id: '1', senderId: 'doctor-1', senderName: 'Dr. Sarah Wilson', content: 'Your recent blood work looks excellent. Keep up the good work!', timestamp: new Date(Date.now() - 3600000) },
          { id: '2', senderId: currentUser.uid, senderName: 'You', content: 'Thank you, doctor. Should I continue the same dosage?', timestamp: new Date(Date.now() - 1800000) },
          { id: '3', senderId: 'doctor-1', senderName: 'Dr. Sarah Wilson', content: 'Yes, let\'s stay on the current plan for another 3 months.', timestamp: new Date(Date.now() - 600000) }
        ]);

        setInvoices([
          { id: 'INV-001', amount: 150.00, status: 'paid', description: 'General Consultation', dueDate: '2026-03-15' },
          { id: 'INV-002', amount: 45.00, status: 'unpaid', description: 'Lab Processing Fee', dueDate: '2026-04-01' },
          { id: 'INV-003', amount: 200.00, status: 'pending', description: 'Specialist Referral', dueDate: '2026-04-10' }
        ]);
      } else {
        setUserData(null);
        setAppointments([]);
        if (unsubAppointments) {
          unsubAppointments();
          unsubAppointments = undefined;
        }
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubAppointments) unsubAppointments();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back to Biensante Portal");
    } catch (error) {
      const err = error as Error;
      toast.error("Login failed", { description: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading(true);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("reg-email") as string;
    const password = formData.get("reg-password") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const userProfile = {
        uid: newUser.uid,
        email: email,
        firstName,
        lastName,
        role: "patient",
        patientId: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", newUser.uid), userProfile);
      toast.success("Account created! Welcome to Biensante.");
    } catch (error) {
      const err = error as Error;
      toast.error("Registration failed", { description: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsActionLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const [firstName, ...lastNameParts] = (user.displayName || "").split(" ");
        const lastName = lastNameParts.join(" ");
        
        const userProfile = {
          uid: user.uid,
          email: user.email,
          firstName: firstName || "User",
          lastName: lastName || "",
          role: "patient",
          patientId: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
      }
      toast.success("Signed in with Google successfully");
    } catch (error) {
      const err = error as Error;
      toast.error("Google Sign-in failed", { description: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Biensante Portal...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Biensante</span>
            </Link>
          </div>

          <nav className="flex-grow px-4 space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
              active={activeTab === "dashboard"} 
              onClick={() => setActiveTab("dashboard")} 
            />
            <SidebarItem 
              icon={<Calendar className="w-5 h-5" />} 
              label="Appointments" 
              active={activeTab === "appointments"} 
              onClick={() => setActiveTab("appointments")} 
            />
            <SidebarItem 
              icon={<FileText className="w-5 h-5" />} 
              label="Medical Records" 
              active={activeTab === "records"} 
              onClick={() => setActiveTab("records")} 
            />
            <SidebarItem 
              icon={<Pill className="w-5 h-5" />} 
              label="Prescriptions" 
              active={activeTab === "prescriptions"} 
              onClick={() => setActiveTab("prescriptions")} 
            />
            <SidebarItem 
              icon={<Activity className="w-5 h-5" />} 
              label="Health Tracking" 
              active={activeTab === "tracking"} 
              onClick={() => setActiveTab("tracking")} 
            />
            <SidebarItem 
              icon={<Video className="w-5 h-5" />} 
              label="Telehealth" 
              active={activeTab === "telehealth"} 
              onClick={() => setActiveTab("telehealth")} 
            />
            <SidebarItem 
              icon={<BillingIcon className="w-5 h-5" />} 
              label="Billing" 
              active={activeTab === "billing"} 
              onClick={() => setActiveTab("billing")} 
            />
            <SidebarItem 
              icon={<ChatIcon className="w-5 h-5" />} 
              label="Messages" 
              active={activeTab === "messages"} 
              onClick={() => setActiveTab("messages")} 
            />
          </nav>

          <div className="p-4 border-t border-slate-200">
            <SidebarItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
              active={activeTab === "settings"} 
              onClick={() => setActiveTab("settings")} 
            />
            <SidebarItem 
              icon={<LogOut className="w-5 h-5 text-red-500" />} 
              label="Sign Out" 
              onClick={handleSignOut} 
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col h-screen overflow-hidden">
          {/* Top Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeTab}</h2>
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search records..." className="pl-10 h-9 w-64 bg-slate-50 border-none" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{userData?.firstName} {userData?.lastName}</p>
                  <p className="text-xs text-slate-500">ID: {userData?.patientId}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <ScrollArea className="flex-grow">
            <div className="p-8 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                          Good morning, {userData?.firstName}
                        </h1>
                        <p className="text-slate-500 mt-1">Here's what's happening with your health today.</p>
                      </div>
                      <Link to="/book-appointment">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard 
                        title="Heart Rate" 
                        value="72" 
                        unit="bpm" 
                        icon={<Heart className="text-red-500" />} 
                        trend="+2% from yesterday"
                        color="bg-red-50"
                      />
                      <StatCard 
                        title="Body Temp" 
                        value="98.6" 
                        unit="°F" 
                        icon={<Thermometer className="text-orange-500" />} 
                        trend="Normal"
                        color="bg-orange-50"
                      />
                      <StatCard 
                        title="Weight" 
                        value="165" 
                        unit="lbs" 
                        icon={<Weight className="text-blue-500" />} 
                        trend="-1.2 lbs this month"
                        color="bg-blue-50"
                      />
                      <StatCard 
                        title="Blood Glucose" 
                        value="95" 
                        unit="mg/dL" 
                        icon={<Activity className="text-emerald-500" />} 
                        trend="Stable"
                        color="bg-emerald-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Upcoming Appointments */}
                      <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                            <CardDescription>Your scheduled visits for the next 30 days.</CardDescription>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary">View All</Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {appointments.length === 0 ? (
                              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No upcoming appointments.</p>
                                <Link to="/book-appointment">
                                  <Button variant="link" className="text-primary mt-2">Schedule one now</Button>
                                </Link>
                              </div>
                            ) : (
                              appointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-primary">
                                      <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                                      </span>
                                      <span className="text-xl font-bold leading-none">
                                        {new Date(apt.date).getDate()}
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{apt.specialty}</h4>
                                      <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>{apt.time || "09:00 AM"}</span>
                                        <span className="mx-2">•</span>
                                        <span>{apt.doctorName || "Dr. Assigned"}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                                      {apt.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                      <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Health Insights */}
                      <div className="space-y-8">
                        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity className="w-24 h-24" />
                          </div>
                          <CardHeader>
                            <CardTitle className="text-lg">Health Score</CardTitle>
                            <CardDescription className="text-primary-foreground/80">Based on your recent activity and results.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-end space-x-2 mb-4">
                              <span className="text-5xl font-bold">84</span>
                              <span className="text-primary-foreground/80 mb-1">/100</span>
                            </div>
                            <Progress value={84} className="h-2 bg-white/20" />
                            <p className="text-xs mt-4 text-primary-foreground/80 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Up 4 points from last month
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg">Quick Access</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 gap-3">
                            <QuickAction 
                              icon={<FileText className="w-4 h-4" />} 
                              label="Download Lab Results" 
                              onClick={() => setActiveTab("records")}
                            />
                            <QuickAction 
                              icon={<Pill className="w-4 h-4" />} 
                              label="Refill Prescriptions" 
                              onClick={() => setActiveTab("prescriptions")}
                            />
                            <QuickAction 
                              icon={<MessageSquare className="w-4 h-4" />} 
                              label="Message Care Team" 
                              onClick={() => setActiveTab("messages")}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "records" && (
                  <motion.div 
                    key="records"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-slate-900">Medical Records</h1>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Export All
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {labResults.map((result) => (
                        <Card key={result.id} className="border-none shadow-sm hover:shadow-md transition-all">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-2xl ${
                                  result.status === 'normal' ? 'bg-emerald-50 text-emerald-600' : 
                                  result.status === 'abnormal' ? 'bg-orange-50 text-orange-600' : 
                                  'bg-red-50 text-red-600'
                                }`}>
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900 text-lg">{result.testName}</h3>
                                  <p className="text-sm text-slate-500">{result.category} • {new Date(result.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-8">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-slate-900">{result.value} <span className="text-sm font-medium text-slate-500">{result.unit}</span></p>
                                  <Badge variant={result.status === 'normal' ? 'default' : 'destructive'} className="mt-1">
                                    {result.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <ArrowUpRight className="w-5 h-5 text-slate-400" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "prescriptions" && (
                  <motion.div 
                    key="prescriptions"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <h1 className="text-2xl font-bold text-slate-900">Active Medications</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {prescriptions.map((p) => (
                        <Card key={p.id} className="border-none shadow-sm overflow-hidden">
                          <div className="h-2 bg-primary"></div>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{p.medicationName}</CardTitle>
                              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                {p.status}
                              </Badge>
                            </div>
                            <CardDescription>{p.dosage} • {p.frequency}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center text-sm text-slate-500 mb-4">
                              <User className="w-4 h-4 mr-2" />
                              Prescribed by {p.doctorName}
                            </div>
                            <div className="flex gap-2">
                              <Button className="flex-grow bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                Request Refill
                              </Button>
                              <Button variant="ghost" size="icon">
                                <AlertCircle className="w-5 h-5 text-slate-400" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "tracking" && (
                  <motion.div 
                    key="tracking"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900">Health Tracking</h1>
                        <p className="text-slate-500">Monitor your vitals and health trends over time.</p>
                      </div>
                      <Button className="bg-primary text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Vitals
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card className="border-none shadow-sm p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg flex items-center">
                            <Heart className="w-5 h-5 mr-2 text-red-500" />
                            Heart Rate History
                          </CardTitle>
                        </CardHeader>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={healthData}>
                              <defs>
                                <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Area type="monotone" dataKey="bpm" stroke="#ef4444" fillOpacity={1} fill="url(#colorBpm)" strokeWidth={3} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>

                      <Card className="border-none shadow-sm p-6">
                        <CardHeader className="px-0 pt-0">
                          <CardTitle className="text-lg flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-emerald-500" />
                            Blood Glucose Trends
                          </CardTitle>
                        </CardHeader>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={healthData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Line type="monotone" dataKey="glucose" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    </div>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle>Recent Vital Logs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            { type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: 'Today, 08:30 AM', status: 'Normal' },
                            { type: 'Weight', value: '164', unit: 'lbs', date: 'Yesterday, 07:15 AM', status: 'Stable' },
                            { type: 'Oxygen Saturation', value: '98', unit: '%', date: 'Mar 20, 09:00 AM', status: 'Normal' }
                          ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                  <Activity className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{log.type}</p>
                                  <p className="text-xs text-slate-500">{log.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">{log.value} <span className="text-xs font-normal text-slate-500">{log.unit}</span></p>
                                <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-600 border-emerald-100">
                                  {log.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "billing" && (
                  <motion.div 
                    key="billing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Statement
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-slate-900 text-white border-none p-6">
                        <p className="text-slate-400 text-sm">Total Outstanding</p>
                        <h2 className="text-3xl font-bold mt-2">$245.00</h2>
                        <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Pay Now</Button>
                      </Card>
                      <Card className="border-none shadow-sm p-6 flex flex-col justify-center">
                        <p className="text-slate-500 text-sm">Last Payment</p>
                        <h2 className="text-2xl font-bold mt-1">$150.00</h2>
                        <p className="text-xs text-emerald-500 mt-2 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Successful on Mar 15
                        </p>
                      </Card>
                      <Card className="border-none shadow-sm p-6 flex flex-col justify-center">
                        <p className="text-slate-500 text-sm">Insurance Status</p>
                        <h2 className="text-xl font-bold mt-1">Active</h2>
                        <p className="text-xs text-slate-400 mt-2">Blue Cross Blue Shield</p>
                      </Card>
                    </div>

                    <Card className="border-none shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Invoice History</CardTitle>
                        <Button variant="ghost" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-0">
                          {invoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                  <BillingIcon className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{inv.description}</p>
                                  <p className="text-xs text-slate-500">Invoice #{inv.id} • Due {inv.dueDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6">
                                <p className="font-bold text-slate-900">${inv.amount.toFixed(2)}</p>
                                <Badge className={
                                  inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                                  inv.status === 'unpaid' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                  'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                }>
                                  {inv.status.toUpperCase()}
                                </Badge>
                                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "messages" && (
                  <motion.div 
                    key="messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[calc(100vh-12rem)] flex gap-6"
                  >
                    {/* Contacts List */}
                    <Card className="w-80 border-none shadow-sm hidden md:flex flex-col">
                      <CardHeader className="p-4 border-b border-slate-100">
                        <CardTitle className="text-lg">Messages</CardTitle>
                        <div className="relative mt-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <Input placeholder="Search chats..." className="pl-8 h-8 text-xs bg-slate-50 border-none" />
                        </div>
                      </CardHeader>
                      <ScrollArea className="flex-grow">
                        <div className="p-2 space-y-1">
                          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center space-x-3 cursor-pointer">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                              <AvatarImage src="https://i.pravatar.cc/150?u=dr-wilson" />
                              <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-sm text-slate-900">Dr. Sarah Wilson</p>
                                <span className="text-[10px] text-slate-400">10m</span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">Yes, let's stay on the current...</p>
                            </div>
                          </div>
                          <div className="p-3 hover:bg-slate-50 rounded-xl flex items-center space-x-3 cursor-pointer transition-colors">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://i.pravatar.cc/150?u=dr-chen" />
                              <AvatarFallback>JC</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-sm text-slate-900">Dr. James Chen</p>
                                <span className="text-[10px] text-slate-400">2d</span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">Your prescription has been sent...</p>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </Card>

                    {/* Chat Area */}
                    <Card className="flex-grow border-none shadow-sm flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="https://i.pravatar.cc/150?u=dr-wilson" />
                            <AvatarFallback>SW</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900">Dr. Sarah Wilson</p>
                            <p className="text-xs text-emerald-500 flex items-center">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                              Online
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="text-slate-400"><Phone className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setActiveTab("telehealth")}><Video className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical className="w-4 h-4" /></Button>
                        </div>
                      </div>

                      <ScrollArea className="flex-grow p-6">
                        <div className="space-y-6">
                          {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderName === 'You' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] rounded-2xl p-4 ${
                                msg.senderName === 'You' 
                                  ? 'bg-primary text-white rounded-tr-none' 
                                  : 'bg-slate-100 text-slate-900 rounded-tl-none'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-2 ${msg.senderName === 'You' ? 'text-primary-foreground/60' : 'text-slate-400'}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="text-slate-400"><Plus className="w-5 h-5" /></Button>
                          <Input 
                            placeholder="Type your message..." 
                            className="flex-grow bg-white border-slate-200"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && (setMessages([...messages, { id: Date.now().toString(), senderId: user.uid, senderName: 'You', content: newMessage, timestamp: new Date() }]), setNewMessage(""))}
                          />
                          <Button 
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => newMessage.trim() && (setMessages([...messages, { id: Date.now().toString(), senderId: user.uid, senderName: 'You', content: newMessage, timestamp: new Date() }]), setNewMessage(""))}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "telehealth" && (
                  <motion.div 
                    key="telehealth"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-slate-900">Virtual Consultation</h1>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3 py-1">
                        <ShieldCheck className="w-3 h-3 mr-1.5" />
                        Secure & Encrypted
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                      <Card className="lg:col-span-3 border-none shadow-2xl bg-slate-900 aspect-video rounded-3xl overflow-hidden relative group">
                        {/* Main Video Feed (Mock) */}
                        <img 
                          src="https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=1000" 
                          alt="Doctor Video" 
                          className="w-full h-full object-cover opacity-80"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Patient Self-View */}
                        <div className="absolute top-6 right-6 w-48 aspect-video bg-slate-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                            alt="Self View" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Call Controls */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white">
                            <Mic className="w-6 h-6" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white">
                            <Video className="w-6 h-6" />
                          </Button>
                          <Button variant="destructive" size="icon" className="w-14 h-14 rounded-full shadow-xl shadow-red-500/20" onClick={() => setActiveTab("dashboard")}>
                            <Phone className="w-6 h-6 rotate-[135deg]" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white">
                            <Settings className="w-6 h-6" />
                          </Button>
                        </div>

                        {/* Doctor Info Overlay */}
                        <div className="absolute top-6 left-6 flex items-center space-x-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <p className="text-white font-medium text-sm">Dr. Sarah Wilson (Cardiologist)</p>
                        </div>
                      </Card>

                      <div className="space-y-6">
                        <Card className="border-none shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg">Session Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Duration</span>
                              <span className="font-bold text-slate-900">12:45</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Connection</span>
                              <span className="text-emerald-500 font-medium">Excellent</span>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shared Documents</p>
                              <div className="flex items-center p-2 bg-slate-50 rounded-lg text-xs cursor-pointer hover:bg-slate-100 transition-colors">
                                <FileText className="w-3 h-3 mr-2 text-primary" />
                                <span className="truncate">Blood_Report_Mar22.pdf</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-primary text-sm mb-2">Doctor's Note</h4>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              "Patient reports feeling much better after the new medication. Vitals are stable. Continue current plan."
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div 
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl space-y-8"
                  >
                    <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
                    
                    <div className="space-y-6">
                      <Card className="border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Personal Information</CardTitle>
                          <CardDescription>Update your profile and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>First Name</Label>
                              <Input defaultValue={userData?.firstName} />
                            </div>
                            <div className="space-y-2">
                              <Label>Last Name</Label>
                              <Input defaultValue={userData?.lastName} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input defaultValue={userData?.email} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="+1 (555) 000-0000" />
                          </div>
                          <Button className="bg-primary text-white">Save Changes</Button>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Security</CardTitle>
                          <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Lock className="w-5 h-5 text-slate-400" />
                              <div>
                                <p className="font-bold text-slate-900">Password</p>
                                <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Update</Button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Bell className="w-5 h-5 text-slate-400" />
                              <div>
                                <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-500">Add an extra layer of security</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-red-100 bg-red-50/30">
                        <CardHeader>
                          <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                          <CardDescription>Permanently delete your account and all data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="destructive">Delete Account</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-xl z-10">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Patient Portal</CardTitle>
            <CardDescription className="text-slate-500">Your secure gateway to Biensante Healthcare.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                      <a href="#" className="text-xs text-primary font-semibold hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="password" name="password" type="password" className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isActionLoading}>
                    {isActionLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : "Sign In to Portal"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full h-12 border-slate-200 hover:bg-slate-50 font-semibold"
                    onClick={handleGoogleSignIn}
                    disabled={isActionLoading}
                  >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-slate-700 font-medium">First Name</Label>
                      <Input id="first-name" name="first-name" placeholder="John" className="h-11 bg-slate-50/50" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-slate-700 font-medium">Last Name</Label>
                      <Input id="last-name" name="last-name" placeholder="Doe" className="h-11 bg-slate-50/50" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input id="reg-email" name="reg-email" type="email" placeholder="name@example.com" className="h-11 bg-slate-50/50" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-slate-700 font-medium">Create Password</Label>
                    <Input id="reg-password" name="reg-password" type="password" placeholder="••••••••" className="h-11 bg-slate-50/50" required />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 mt-4" disabled={isActionLoading}>
                    {isActionLoading ? "Creating Account..." : "Create My Account"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full h-12 border-slate-200 hover:bg-slate-50 font-semibold"
                    onClick={handleGoogleSignIn}
                    disabled={isActionLoading}
                  >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-xs text-slate-400 pt-0">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>HIPAA Compliant & Secure</span>
            </div>
            <p>By continuing, you agree to Biensante's Terms of Service and Privacy Policy.</p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

// Helper Components
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

const StatCard = ({ title, value, unit, icon, trend, color }: { title: string, value: string, unit: string, icon: React.ReactNode, trend: string, color: string }) => (
  <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-normal border-none">
          Live
        </Badge>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline space-x-1 mt-1">
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <span className="text-sm font-medium text-slate-400">{unit}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
          {trend}
        </p>
      </div>
    </CardContent>
  </Card>
);

const QuickAction = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <Button 
    variant="outline" 
    className="w-full justify-start h-12 border-slate-100 hover:bg-slate-50 hover:border-slate-200 rounded-xl group"
    onClick={onClick}
  >
    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-white transition-colors">
      {icon}
    </div>
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
  </Button>
);

export default PatientPortal;
