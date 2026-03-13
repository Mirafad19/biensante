import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Mail, Calendar, FileText, Activity, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth, db, handleFirestoreError, OperationType } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
  patientId: string;
  role: string;
}

interface Appointment {
  id: string;
  date: string;
  specialty: string;
  status: string;
  patientUid?: string;
}

const PatientPortal = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
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
        const q = query(
          collection(db, "appointments"),
          where("patientUid", "==", currentUser.uid)
        );
        
        const unsubAppointments = onSnapshot(q, (snapshot) => {
          const apts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Appointment[];
          setAppointments(apts);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, "appointments");
        });

        return () => unsubAppointments();
      } else {
        setUserData(null);
        setAppointments([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsActionLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
    } catch (error: unknown) {
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
    const patientId = formData.get("patient-id") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        uid: newUser.uid,
        email: email,
        firstName,
        lastName,
        role: "patient",
        patientId: patientId || `BS-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", newUser.uid), userProfile);
      toast.success("Account created successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error("Registration failed", { description: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error: unknown) {
      toast.error("Sign out failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {userData?.firstName || "Patient"}
              </h1>
              <p className="text-slate-600">Patient ID: {userData?.patientId || "N/A"}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>Manage your scheduled visits and consultations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 bg-white border rounded-xl border-dashed">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No appointments found.</p>
                    </div>
                  ) : (
                    appointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 bg-white border rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                            <span className="text-xs font-bold uppercase">
                              {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-lg font-bold leading-none">
                              {new Date(apt.date).getDate()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{apt.specialty}</h4>
                            <p className="text-sm text-slate-500">
                              Status: <span className="capitalize font-medium text-blue-600">{apt.status}</span>
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">Details</Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/book-appointment" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Book New Appointment</Button>
                </Link>
              </CardFooter>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex flex-col h-24 space-y-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="text-xs">Lab Results</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-24 space-y-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <span className="text-xs">Health Track</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-24 space-y-2">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <span className="text-xs">Messages</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-24 space-y-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <span className="text-xs">History</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                  <CardDescription className="text-blue-100">Our support team is available 24/7 for any portal issues.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">Contact Support</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Patient Portal</CardTitle>
            <CardDescription>Access your medical records and appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input id="password" name="password" type="password" className="pl-10" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isActionLoading}>
                    {isActionLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" name="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" name="last-name" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address</Label>
                    <Input id="reg-email" name="reg-email" type="email" placeholder="name@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" name="reg-password" type="password" placeholder="••••••••" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-id">Patient ID (Optional)</Label>
                    <Input id="patient-id" name="patient-id" placeholder="BS-XXXX-XXXX" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isActionLoading}>
                    {isActionLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-slate-500">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PatientPortal;
