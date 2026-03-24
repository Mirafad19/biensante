import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, handleFirestoreError, OperationType } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, ChevronLeft, User, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { biensante_logo_png as logo } from "@/assets/encodedImages";

const AdminLogin = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role === "admin") {
            navigate("/admin-portal");
          } else {
            // If a patient tries to access admin login, sign them out or redirect to patient portal
            toast.error("This portal is for staff only.");
            await signOut(auth);
          }
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

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
        if (data.role !== "admin") {
          toast.error("Access denied. This account does not have staff privileges.");
          await signOut(auth);
          return;
        }
        toast.success("Welcome to Staff Portal");
        navigate("/admin-portal");
      } else {
        toast.error("Account not found. Please contact IT support.");
        await signOut(auth);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "users");
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
    const accessCode = formData.get("access-code") as string;

    // Simple security check for admin registration
    if (accessCode !== "BIENSANTE-STAFF-2024") {
      toast.error("Invalid Staff Access Code", { description: "Please contact your administrator for the correct code." });
      setIsActionLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const userProfile = {
        uid: newUser.uid,
        email: email,
        firstName,
        lastName,
        role: "admin",
        patientId: `STAFF-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", newUser.uid), userProfile);
      toast.success("Staff account created! Welcome to the team.");
      navigate("/admin-portal");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "users");
      const err = error as Error;
      toast.error("Registration failed", { description: err.message });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 flex items-center justify-between">
        <Link to="/" className="flex items-center text-slate-500 hover:text-primary transition-colors font-bold">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Home
        </Link>
        <img src={logo} alt="Biensante" className="h-10 w-auto" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <div className="bg-primary p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Staff Portal</h1>
            <p className="text-primary-foreground/80 font-medium text-sm mt-1">Administrative Access Only</p>
          </div>
        </div>

        <CardContent className="p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 bg-slate-100 rounded-2xl">
              <TabsTrigger value="login" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6 mt-0">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Staff Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input name="email" type="email" placeholder="staff@biensante.com" className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input name="password" type="password" placeholder="••••••••" className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={isActionLoading}>
                  {isActionLoading ? "Authenticating..." : "Staff Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-5 mt-0">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">First Name</Label>
                    <Input name="first-name" placeholder="Staff" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 ml-1">Last Name</Label>
                    <Input name="last-name" placeholder="Member" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Staff Email</Label>
                  <Input name="reg-email" type="email" placeholder="staff@biensante.com" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Password</Label>
                  <Input name="reg-password" type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 ml-1">Staff Access Code</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input name="access-code" placeholder="Enter security code" className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl" required />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium ml-1">Required for administrative account creation.</p>
                </div>
                <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 mt-4" disabled={isActionLoading}>
                  {isActionLoading ? "Creating Account..." : "Create Staff Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-slate-500 font-medium text-sm">
          Are you a patient?{" "}
          <Link to="/patient-portal" className="text-primary font-bold hover:underline">
            Go to Patient Portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
