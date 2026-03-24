import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { biensante_logo_png as logo } from "@/assets/encodedImages";
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
  CheckCheck,
  Paperclip,
  Download,
  Filter,
  MoreVertical,
  Clock,
  ArrowUpRight,
  MessageSquare,
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
  addDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
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
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  senderName?: string;
  read?: boolean;
}

interface TelehealthSession {
  id: string;
  patientUid: string;
  doctorUid?: string;
  doctorName: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  startTime: Timestamp;
  endTime?: Timestamp;
  meetingLink?: string;
  roomName: string;
}

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
}

interface Vital {
  id: string;
  patientUid: string;
  type: 'BP' | 'Weight' | 'HeartRate' | 'Temp' | 'Oxygen';
  value: string;
  unit: string;
  date: Timestamp;
}

const PatientPortal = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [telehealthSessions, setTelehealthSessions] = useState<TelehealthSession[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<"patient" | "admin">(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("role") as "patient" | "admin") || "patient";
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const messageData = {
        senderId: user.uid,
        receiverId: "doctor-1", // For demo
        content: newMessage,
        timestamp: serverTimestamp(),
        read: false
      };

      await addDoc(collection(db, "messages"), messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleStartTelehealth = async () => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const sessionData = {
        patientUid: user.uid,
        doctorUid: "doctor-1",
        doctorName: "Dr. Sarah Wilson",
        status: "active",
        startTime: serverTimestamp(),
        roomName: `room-${user.uid}-${Date.now()}`,
        meetingLink: "https://meet.jit.si/" + `room-${user.uid}-${Date.now()}`
      };

      await addDoc(collection(db, "telehealth_sessions"), sessionData);
      setActiveTab("telehealth");
      toast.success("Telehealth session started!");
    } catch (error) {
      console.error("Error starting telehealth:", error);
      toast.error("Failed to start telehealth session");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setIsActionLoading(true);
    try {
      await updateDoc(doc(db, "invoices", invoiceId), {
        status: 'paid'
      });
      toast.success("Invoice paid successfully!");
    } catch (error) {
      console.error("Error paying invoice:", error);
      toast.error("Payment failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Transform vitals for charts
  const healthData = useMemo(() => {
    if (vitals.length === 0) {
      return [
        { name: 'Mon', bpm: 72, weight: 165, glucose: 95 },
        { name: 'Tue', bpm: 75, weight: 164.8, glucose: 98 },
        { name: 'Wed', bpm: 70, weight: 165.2, glucose: 92 },
        { name: 'Thu', bpm: 68, weight: 165, glucose: 94 },
        { name: 'Fri', bpm: 74, weight: 164.5, glucose: 96 },
        { name: 'Sat', bpm: 71, weight: 164.2, glucose: 93 },
        { name: 'Sun', bpm: 72, weight: 164, glucose: 95 },
      ];
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grouped: Record<string, { name: string; bpm: number; weight: number; glucose: number }> = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      grouped[dayName] = { name: dayName, bpm: 72, weight: 165, glucose: 95 };
    }

    vitals.forEach((v: Vital) => {
      const date = v.date?.toDate ? v.date.toDate() : new Date(v.date);
      const dayName = days[date.getDay()];
      if (grouped[dayName]) {
        if (v.type === 'HeartRate') grouped[dayName].bpm = Number(v.value);
        if (v.type === 'Weight') grouped[dayName].weight = Number(v.value);
        if (v.type === 'Oxygen') grouped[dayName].glucose = Number(v.value);
      }
    });

    return Object.values(grouped);
  }, [vitals]);

  useEffect(() => {
    let unsubAppointments: (() => void) | undefined;
    let unsubMessages: (() => void) | undefined;
    let unsubTelehealth: (() => void) | undefined;
    let unsubLabResults: (() => void) | undefined;
    let unsubPrescriptions: (() => void) | undefined;
    let unsubInvoices: (() => void) | undefined;
    let unsubVitals: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user profile data to check role
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            if (data.role === "admin") {
              // Redirect admin to admin portal
              toast.info("Redirecting to Staff Portal...");
              navigate("/admin-portal");
              return;
            }
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      
      if (currentUser) {
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

        // Real-time Messages
        try {
          const messagesQuery = query(
            collection(db, "messages"),
            where("senderId", "in", [currentUser.uid, "doctor-1"]), // For demo, we assume doctor-1 is the primary contact
            where("receiverId", "in", [currentUser.uid, "doctor-1"]),
            orderBy("timestamp", "asc")
          );

          unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                senderName: data.senderId === currentUser.uid ? "You" : "Dr. Sarah Wilson"
              };
            }) as Message[];
            setMessages(msgs);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "messages");
          });
        } catch (error) {
          console.error("Error setting up messages listener:", error);
        }

        // Real-time Telehealth Sessions
        try {
          const telehealthQuery = query(
            collection(db, "telehealth_sessions"),
            where("patientUid", "==", currentUser.uid),
            where("status", "in", ["scheduled", "active"]),
            orderBy("startTime", "desc")
          );

          unsubTelehealth = onSnapshot(telehealthQuery, (snapshot) => {
            setTelehealthSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TelehealthSession[]);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "telehealth_sessions");
          });
        } catch (error) {
          console.error("Error setting up telehealth listener:", error);
        }

        // Real-time Lab Results
        try {
          const labQuery = query(
            collection(db, "lab_results"),
            where("patientUid", "==", currentUser.uid),
            orderBy("date", "desc")
          );

          unsubLabResults = onSnapshot(labQuery, (snapshot) => {
            setLabResults(snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
              };
            }) as LabResult[]);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "lab_results");
          });
        } catch (error) {
          console.error("Error setting up lab results listener:", error);
        }

        // Real-time Prescriptions
        try {
          const prescriptionQuery = query(
            collection(db, "prescriptions"),
            where("patientUid", "==", currentUser.uid),
            where("status", "==", "active")
          );

          unsubPrescriptions = onSnapshot(prescriptionQuery, (snapshot) => {
            setPrescriptions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Prescription[]);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "prescriptions");
          });
        } catch (error) {
          console.error("Error setting up prescriptions listener:", error);
        }

        // Real-time Invoices
        try {
          const invoiceQuery = query(
            collection(db, "invoices"),
            where("patientUid", "==", currentUser.uid),
            orderBy("dueDate", "desc")
          );

          unsubInvoices = onSnapshot(invoiceQuery, (snapshot) => {
            setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[]);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "invoices");
          });
        } catch (error) {
          console.error("Error setting up invoices listener:", error);
        }

        // Real-time Vitals
        try {
          const vitalsQuery = query(
            collection(db, "vitals"),
            where("patientUid", "==", currentUser.uid),
            orderBy("timestamp", "desc"),
            limit(50)
          );

          unsubVitals = onSnapshot(vitalsQuery, (snapshot) => {
            const vitalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vital[];
            setVitals(vitalsData);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, "vitals");
          });
        } catch (error) {
          console.error("Error setting up vitals listener:", error);
        }
      } else {
        setUserData(null);
        setAppointments([]);
        setMessages([]);
        setTelehealthSessions([]);
        setLabResults([]);
        setPrescriptions([]);
        setInvoices([]);
        if (unsubAppointments) unsubAppointments();
        if (unsubMessages) unsubMessages();
        if (unsubTelehealth) unsubTelehealth();
        if (unsubLabResults) unsubLabResults();
        if (unsubPrescriptions) unsubPrescriptions();
        if (unsubInvoices) unsubInvoices();
        if (unsubVitals) unsubVitals();
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubAppointments) unsubAppointments();
      if (unsubMessages) unsubMessages();
      if (unsubTelehealth) unsubTelehealth();
      if (unsubLabResults) unsubLabResults();
      if (unsubPrescriptions) unsubPrescriptions();
      if (unsubInvoices) unsubInvoices();
      if (unsubVitals) unsubVitals();
    };
  }, [navigate]);

  const getLatestVital = (type: string) => {
    const filtered = vitals.filter(v => v.type === type);
    if (filtered.length === 0) return null;
    return filtered.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())[0];
  };

  const heartRate = getLatestVital('heart-rate');
  const bodyTemp = getLatestVital('body-temp');
  const weight = getLatestVital('weight');
  const bloodGlucose = getLatestVital('blood-glucose');

  // Derived data for charts
  const chartData = [...vitals].reverse().map(v => ({
    name: v.timestamp instanceof Date ? v.timestamp.toLocaleDateString() : 
          v.timestamp?.toDate ? v.timestamp.toDate().toLocaleDateString() : "Unknown",
    bpm: v.type === "heart-rate" ? parseInt(v.value) : null,
    glucose: v.type === "blood-glucose" ? parseInt(v.value) : null,
    temp: v.type === "body-temp" ? parseFloat(v.value) : null,
  })).filter(d => d.bpm !== null || d.glucose !== null || d.temp !== null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // If logging in as patient, but user is admin, block it
        if (loginRole === "patient" && data.role === "admin") {
          toast.error("Admin accounts must use the Staff login portal.");
          await signOut(auth);
          return;
        }

        if (loginRole === "admin" && data.role !== "admin") {
          toast.error("This account does not have admin privileges.");
          await signOut(auth);
          return;
        }
        
        if (data.role === "admin") {
          toast.success("Welcome to Admin Portal");
          navigate("/admin-portal");
        } else {
          toast.success("Welcome back to Biensante Portal");
        }
      }
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
        role: loginRole, // Use the selected role
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
          role: loginRole, // Use the selected role
          patientId: `BS-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
      }
      
      const updatedUserDoc = await getDoc(doc(db, "users", user.uid));
      if (updatedUserDoc.exists()) {
        const data = updatedUserDoc.data();
        if (data.role === "admin") {
          toast.success("Welcome to Admin Portal");
          navigate("/admin-portal");
        } else {
          toast.success("Signed in with Google successfully");
        }
      }
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

  const handleRoleSwitch = (role: "patient" | "admin") => {
    if (role === loginRole) return;
    // Force a browser refresh as requested to clear all inputs and state
    window.location.href = window.location.pathname + "?role=" + role;
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
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Biensante" className="h-12 w-auto object-contain" />
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
                        value={heartRate ? heartRate.value : "--"} 
                        unit="bpm" 
                        icon={<Heart className="text-red-500" />} 
                        trend={heartRate ? "Real-time" : "No data"}
                        color="bg-red-50"
                      />
                      <StatCard 
                        title="Body Temp" 
                        value={bodyTemp ? bodyTemp.value : "--"} 
                        unit="°F" 
                        icon={<Thermometer className="text-orange-500" />} 
                        trend={bodyTemp ? "Normal" : "No data"}
                        color="bg-orange-50"
                      />
                      <StatCard 
                        title="Weight" 
                        value={weight ? weight.value : "--"} 
                        unit="lbs" 
                        icon={<Weight className="text-blue-500" />} 
                        trend={weight ? "Last recorded" : "No data"}
                        color="bg-blue-50"
                      />
                      <StatCard 
                        title="Blood Glucose" 
                        value={bloodGlucose ? bloodGlucose.value : "--"} 
                        unit="mg/dL" 
                        icon={<Activity className="text-emerald-500" />} 
                        trend={bloodGlucose ? "Stable" : "No data"}
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
                                  <Button variant="link" className="text-primary mt-2" onClick={handleStartTelehealth}>Schedule one now</Button>
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
                              <span className="text-5xl font-bold">{vitals.length > 0 ? "84" : "--"}</span>
                              <span className="text-primary-foreground/80 mb-1">/100</span>
                            </div>
                            <Progress value={vitals.length > 0 ? 84 : 0} className="h-2 bg-white/20" />
                            <p className="text-xs mt-4 text-primary-foreground/80 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {vitals.length > 0 ? "Up 4 points from last month" : "No activity recorded"}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {labResults.slice(0, 2).map(lr => (
                              <div key={lr.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">New Lab Result: {lr.testName}</p>
                                  <p className="text-xs text-slate-500">{new Date(lr.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                            {messages.slice(0, 1).map(msg => (
                              <div key={msg.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                  <MessageSquare className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">New Message from Care Team</p>
                                  <p className="text-xs text-slate-500">Just now</p>
                                </div>
                              </div>
                            ))}
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
                            <AreaChart data={chartData.filter(d => d.bpm !== null)}>
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
                            <LineChart data={chartData.filter(d => d.glucose !== null)}>
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
                          {vitals.length > 0 ? (
                            vitals.slice(0, 10).map((log, i) => (
                              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    {log.type === 'heart-rate' && <Heart className="w-5 h-5 text-red-500" />}
                                    {log.type === 'body-temp' && <Thermometer className="w-5 h-5 text-orange-500" />}
                                    {log.type === 'weight' && <Weight className="w-5 h-5 text-blue-500" />}
                                    {log.type === 'blood-glucose' && <Activity className="w-5 h-5 text-emerald-500" />}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900 capitalize">{log.type.replace('-', ' ')}</p>
                                    <p className="text-xs text-slate-500">
                                      {log.timestamp instanceof Date ? log.timestamp.toLocaleString() : 
                                       log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : "Unknown"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-slate-900">{log.value} <span className="text-xs font-normal text-slate-500">{log.unit}</span></p>
                                  <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-600 border-emerald-100">
                                    Normal
                                  </Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-slate-500">
                              <Activity className="w-12 h-12 mx-auto mb-2 opacity-20" />
                              <p>No vital logs found.</p>
                            </div>
                          )}
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
                      <Card className="bg-slate-900 text-white border-none p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                        <p className="text-slate-400 text-sm font-medium">Total Outstanding</p>
                        <h2 className="text-4xl font-bold mt-2 tracking-tight">₦245,000.00</h2>
                        <Button 
                          className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20"
                          onClick={() => {
                            const unpaid = invoices.find(inv => inv.status !== 'paid');
                            if (unpaid) handlePayInvoice(unpaid.id);
                          }}
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : "Pay via Paystack"}
                        </Button>
                      </Card>
                      <Card className="border-none shadow-sm p-6 flex flex-col justify-center bg-white">
                        <p className="text-slate-500 text-sm font-medium">Last Payment</p>
                        <h2 className="text-3xl font-bold mt-1 text-slate-900">₦150,000.00</h2>
                        <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Settled on Mar 15
                        </div>
                      </Card>
                      <Card className="border-none shadow-sm p-6 flex flex-col justify-center bg-white">
                        <p className="text-slate-500 text-sm font-medium">Insurance Status</p>
                        <div className="flex items-center mt-1">
                          <h2 className="text-2xl font-bold text-slate-900">Active</h2>
                          <Badge className="ml-2 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50">BCBS</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Policy: #BS-99283-X</p>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                            <div>
                              <CardTitle className="text-lg">Invoice History</CardTitle>
                              <p className="text-xs text-slate-500 mt-1">View and download your medical service invoices.</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl h-9">
                              <Filter className="w-3.5 h-3.5 mr-2" /> 
                              Filter
                            </Button>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                              {invoices.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                      <BillingIcon className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900 text-sm">{inv.description}</p>
                                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
                                        Invoice #{inv.id} • Due {inv.dueDate}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-6">
                                    <p className="font-bold text-slate-900 text-sm">₦{inv.amount.toLocaleString()}</p>
                                    <Badge className={`h-6 text-[10px] font-bold px-2.5 rounded-full ${
                                      inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                      inv.status === 'unpaid' ? 'bg-red-50 text-red-600 border-red-100' :
                                      'bg-orange-50 text-orange-600 border-orange-100'
                                    }`} variant="outline">
                                      {inv.status.toUpperCase()}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-6">
                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                          <CardHeader className="border-b border-slate-50 pb-4">
                            <CardTitle className="text-sm font-bold text-slate-800">Payment Methods</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <div className="p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 relative group cursor-pointer">
                              <div className="absolute top-3 right-3">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-7 bg-slate-900 rounded-md flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-white italic">CARD</span>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">Paystack / Flutterwave</p>
                                  <p className="text-[10px] text-slate-500">Card, Transfer, USSD</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-2xl border border-slate-100 bg-white relative group cursor-pointer hover:border-primary/30 transition-all">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-7 bg-slate-100 rounded-md flex items-center justify-center">
                                  <Globe className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">Bank Transfer</p>
                                  <p className="text-[10px] text-slate-500">Direct NGN Transfer</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Details</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-500">Bank:</span>
                                  <span className="font-bold text-slate-900">Zenith Bank</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-500">Account:</span>
                                  <span className="font-bold text-slate-900">1234567890</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-500">Name:</span>
                                  <span className="font-bold text-slate-900">BienSanté Healthcare</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button variant="outline" className="w-full border-dashed border-2 py-6 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                              <Plus className="w-4 h-4 mr-2" />
                              Add New Method
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-slate-50/50 border border-slate-100">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800">Secure NGN Billing</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Your payments are processed securely via Paystack or Flutterwave. We support local cards, bank transfers, and USSD.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
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
                    <Card className="flex-grow border-none shadow-sm flex flex-col overflow-hidden bg-white">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                              <AvatarImage src="https://i.pravatar.cc/150?u=dr-wilson" />
                              <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none">Dr. Sarah Wilson</p>
                            <p className="text-[10px] text-emerald-500 font-bold mt-1.5 flex items-center">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                              Online
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5" onClick={handleStartTelehealth}>
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <ScrollArea className="flex-grow p-6 bg-slate-50/30">
                        <div className="space-y-6">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Today</span>
                          </div>
                          
                          {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                              <div className="flex items-start space-x-3 max-w-[75%]">
                                {msg.senderId !== user?.uid && (
                                  <Avatar className="h-8 w-8 mt-1 border border-slate-100">
                                    <AvatarImage src="https://i.pravatar.cc/150?u=dr-wilson" />
                                    <AvatarFallback>SW</AvatarFallback>
                                  </Avatar>
                                )}
                                <div className="space-y-1">
                                  <div className={`p-4 rounded-2xl shadow-sm border ${
                                    msg.senderId === user?.uid 
                                      ? 'bg-primary text-white rounded-tr-none border-primary/10 shadow-primary/10' 
                                      : 'bg-white text-slate-900 rounded-tl-none border-slate-100'
                                  }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                  </div>
                                  <div className={`flex items-center space-x-1 mt-1 ${msg.senderId === user?.uid ? 'justify-end mr-1' : 'ml-1'}`}>
                                    <p className="text-[10px] text-slate-400">
                                      {msg.timestamp?.seconds 
                                        ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {msg.senderId === user?.uid && <CheckCheck className="w-3 h-3 text-primary" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-primary/30 focus-within:bg-white transition-all">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Input 
                            placeholder="Type a message..." 
                            className="border-none bg-transparent focus-visible:ring-0 text-sm h-10"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button 
                            size="icon" 
                            className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isActionLoading}
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

                    {telehealthSessions.length === 0 ? (
                      <Card className="p-12 text-center border-none shadow-sm bg-white">
                        <div className="max-w-md mx-auto space-y-6">
                          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Video className="w-10 h-10 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-900">No Active Session</h2>
                            <p className="text-slate-500">You don't have an active virtual consultation at the moment. You can start one now with an available doctor.</p>
                          </div>
                          <Button 
                            className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                            onClick={handleStartTelehealth}
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? "Starting..." : "Start Instant Consultation"}
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <Card className="lg:col-span-3 border-none shadow-2xl bg-slate-900 aspect-video rounded-3xl overflow-hidden relative group">
                          {/* Jitsi Meet Iframe for Real Video Call */}
                          <iframe
                            src={`${telehealthSessions[0].meetingLink}#config.prejoinPageEnabled=false&config.subject="BienSanté Consultation"&userInfo.displayName="${userData?.firstName} ${userData?.lastName}"&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","e2ee"]`}
                            allow="camera; microphone; display-capture; autoplay; clipboard-write"
                            className="w-full h-full border-none"
                            title="Telehealth Session"
                          />
                        </Card>

                        <div className="space-y-6">
                          <Card className="border-none shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                              <CardTitle className="text-sm font-bold text-slate-700">Session Info</CardTitle>
                              <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Recording</span>
                              </div>
                            </div>
                            <CardContent className="p-4 space-y-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">Moderator</span>
                                  <div className="flex items-center">
                                    <ShieldCheck className="w-3 h-3 text-primary mr-1" />
                                    <span className="text-xs font-bold text-slate-900">{telehealthSessions[0].doctorName}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">Status</span>
                                  <Badge variant="outline" className="h-5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border-emerald-100">
                                    {telehealthSessions[0].status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">Encryption</span>
                                  <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                                    <Lock className="w-2.5 h-2.5 mr-1" />
                                    End-to-End
                                  </span>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relevant Records</p>
                                <div className="space-y-2">
                                  {labResults.slice(0, 2).map((lr) => (
                                    <div key={lr.id} className="flex items-center p-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/20 transition-all cursor-pointer group">
                                      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm group-hover:bg-primary/5">
                                        <FileText className="w-3.5 h-3.5 text-primary" />
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <p className="text-[10px] font-bold text-slate-900 truncate">{lr.testName}</p>
                                        <p className="text-[9px] text-slate-400">{new Date(lr.date).toLocaleDateString()}</p>
                                      </div>
                                      <Download className="w-3 h-3 text-slate-300 group-hover:text-primary" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                <h4 className="font-bold text-primary text-xs uppercase tracking-tight">Clinical Notes</h4>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed italic">
                                {telehealthSessions[0].doctorNote || "Consultation in progress. Real-time clinical notes will be synchronized here as the MD updates your chart."}
                              </p>
                            </CardContent>
                          </Card>

                          <div className="space-y-3">
                            <Button 
                              variant="destructive" 
                              className="w-full h-11 rounded-xl font-bold text-sm shadow-lg shadow-red-500/10 hover:bg-red-600 transition-all"
                              onClick={async () => {
                                try {
                                  await updateDoc(doc(db, "telehealth_sessions", telehealthSessions[0].id), {
                                    status: 'completed',
                                    endTime: serverTimestamp()
                                  });
                                  setActiveTab("dashboard");
                                  toast.success("Consultation ended and saved to records");
                                } catch (error) {
                                  console.error("Error ending session:", error);
                                }
                              }}
                            >
                              End Consultation
                            </Button>
                            <p className="text-[9px] text-center text-slate-400">
                              By ending, a summary will be generated and sent to your medical records.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                        <CardContent className="space-y-4">
                          <Button 
                            variant="outline" 
                            className="w-full border-primary text-primary hover:bg-primary/10"
                            onClick={async () => {
                              if (user) {
                                await updateDoc(doc(db, "users", user.uid), { role: "admin" });
                                toast.success("You are now an Admin. Please sign out and sign back in as Admin.");
                              }
                            }}
                          >
                            Make me Admin (Testing Only)
                          </Button>
                          <Button variant="destructive" className="w-full">Delete Account</Button>
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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Branding & Image (Inspired by Duchess) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hospital Hallway" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-12">
            <img src={logo} alt="BIENSANTE" className="h-16 w-auto object-contain" />
          </div>

          <div className="max-w-md">
            <h1 className="text-6xl font-black leading-[1.1] mb-6 tracking-tight">
              Secure access to your <span className="text-primary italic">care records</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Experience world-class healthcare management at your fingertips. Your health, our priority.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-6 text-sm font-bold tracking-widest uppercase text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>256-bit Encryption</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-white relative">
        <div className="w-full max-w-[440px] space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="BIENSANTE" className="h-12 w-auto object-contain" />
          </div>

          <div className="text-center lg:text-left space-y-2">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center w-full max-w-[280px] shadow-inner">
                <button 
                  onClick={() => handleRoleSwitch("patient")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${loginRole === "patient" ? "bg-white text-primary shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Patient
                </button>
                <button 
                  onClick={() => handleRoleSwitch("admin")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${loginRole === "admin" ? "bg-white text-primary shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {loginRole === "patient" ? "Patient Sign In" : "Staff Sign In"}
            </h2>
            <p className="text-slate-500 font-medium">
              {loginRole === "patient" 
                ? "Use your Patient ID and password to access your portal." 
                : "Staff account? Use the Admin login tab above."}
            </p>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 bg-slate-100 rounded-2xl shadow-inner">
                  <TabsTrigger value="login" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all text-base" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-sm font-bold text-slate-700">Password</Label>
                        <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all text-base" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4" disabled={isActionLoading}>
                      {isActionLoading ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Authenticating...</span>
                        </div>
                      ) : "Log In"}
                    </Button>

                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                        <span className="bg-white px-4 text-slate-400">Or continue with</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full h-14 border-slate-200 hover:bg-slate-50 font-bold rounded-2xl text-base"
                      onClick={handleGoogleSignIn}
                      disabled={isActionLoading}
                    >
                      <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                      Google
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-sm font-bold text-slate-700 ml-1">First Name</Label>
                        <Input id="first-name" name="first-name" placeholder="John" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-sm font-bold text-slate-700 ml-1">Last Name</Label>
                        <Input id="last-name" name="last-name" placeholder="Doe" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
                      <Input id="reg-email" name="reg-email" type="email" placeholder="name@example.com" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-sm font-bold text-slate-700 ml-1">Create Password</Label>
                      <Input id="reg-password" name="reg-password" type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                    </div>
                    <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 mt-6" disabled={isActionLoading}>
                      {isActionLoading ? "Creating Account..." : "Create My Account"}
                    </Button>

                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                        <span className="bg-white px-4 text-slate-400">Or continue with</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full h-14 border-slate-200 hover:bg-slate-50 font-bold rounded-2xl text-base"
                      onClick={handleGoogleSignIn}
                      disabled={isActionLoading}
                    >
                      <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                      Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 pt-4">
            <p className="text-xs text-slate-400 font-medium">
              By continuing, you agree to Biensante's <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
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
