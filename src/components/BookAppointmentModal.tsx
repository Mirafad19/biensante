import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { db, auth, handleFirestoreError, OperationType } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function BookAppointmentModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const department = formData.get("department") as string;
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    try {
      // 1. Save to Firebase Database (for Patient Portal & Admin Dashboard)
      const appointmentData = {
        patientName: `${firstName} ${lastName}`,
        patientEmail: email,
        patientPhone: phone,
        specialty: department,
        date: date,
        reason: notes,
        status: "pending",
        createdAt: serverTimestamp(),
        patientUid: auth.currentUser?.uid || null,
      };

      await addDoc(collection(db, "appointments"), appointmentData);

      // 2. Send Email Notification via Formspree (Optional)
      // Replace "YOUR_FORMSPREE_ID" with your actual Formspree form ID (e.g., "xqk...").
      // You can get this by signing up at formspree.io
      const formspreeEndpoint = "https://formspree.io/f/mnjgvkqy"; 
      
      if (formspreeEndpoint !== "https://formspree.io/f/mnjgvkqy") {
        await fetch(formspreeEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            subject: `New Appointment Request from ${firstName} ${lastName}`,
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            department: department,
            preferredDate: date,
            notes: notes,
          }),
        });
      }

      setIsSubmitting(false);
      setOpen(false);
      toast.success("Appointment request sent!", {
        description: "Our team will contact you shortly to confirm your appointment.",
      });
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.WRITE, "appointments");
      toast.error("Failed to send request", {
        description: "Please try again later or contact us directly.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill out the form below and our team will get back to you to confirm your appointment time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="0801 234 5678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department / Specialty</Label>
            <select 
              id="department" 
              name="department"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a department...</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="pulmonary">Pulmonary</option>
              <option value="laboratory">Laboratory</option>
              <option value="general">General Consultation</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date</Label>
            <Input id="date" name="date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Tell us briefly about your symptoms or reason for visit." />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Request Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
