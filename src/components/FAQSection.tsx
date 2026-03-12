import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqsLeft = [
    {
      question: "What are your operating hours?",
      answer: "BienSanté Hospital operates 24 hours daily, 7 days a week. Our outpatient clinics run from 8:00 AM to 6:00 PM on weekdays. Emergency services are always available.",
    },
    {
      question: "Do you accept HMO plans?",
      answer: "Yes, we accept NHIS and several private HMOs including Reliance HMO, Leadway HMO, NEM HMO, Kenedia HMO, Lifworth HMO, Green Shield HMO, Healthcare International HMO, Redcare HMO, Serene HMO, Wellness HMO, Clearline HMO, MB & O HMO, and DOT HMO.",
    },
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment by calling us at 0802 233 3285 or 0902 391 6337, or by using our AI assistant available on this website. Walk-in patients are also welcome.",
    },
    {
      question: "What is the consultation fee?",
      answer: "A general consultation costs ₦5,000. Specialist consultation fees vary depending on the doctor and your specific case. Contact us for exact pricing on specialist visits.",
    },
  ];

  const faqsRight = [
    {
      question: "What specialist services do you offer?",
      answer: "We offer Cardiology, Pulmonology, Neurology, Orthopedics, Gynecology & Obstetrics, Dental Surgery, Pediatrics, and comprehensive Laboratory Diagnostics.",
    },
    {
      question: "Where is BienSanté Hospital located?",
      answer: "We are located at No. 9 Alaka Street, off Bammekke Road, Shasha, Lagos — near Oguntade Junction. It's easy to locate from the main road.",
    },
    {
      question: "What are the visiting hours?",
      answer: "Weekdays: Morning 10:00 AM – 12:00 PM, Evening 5:00 PM – 8:45 PM. Weekends: 10:00 AM – 8:00 PM. Antenatal Clinic: Tuesdays only, 9:00 AM – 1:00 PM.",
    },
    {
      question: "Do you handle maternity and childbirth?",
      answer: "Yes! Our Maternity & Childcare department provides complete antenatal, delivery, and postnatal care. We have experienced midwives and obstetricians on call 24/7.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Get instant answers about our services, appointments, fees, and more. Can't find what you're looking for? Speak with our assistant or call us directly.
          </p>
        </div>

        {/* Two-column FAQs */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
          {[faqsLeft, faqsRight].map((faqColumn, columnIndex) => (
            <Accordion key={columnIndex} type="single" collapsible className="w-full">
              {faqColumn.map((faq, i) => (
                <AccordionItem key={i} value={`col-${columnIndex}-item-${i}`} className="border-b border-slate-200">
                  <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-blue-700 hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-slate-600 leading-relaxed pb-6 text-base">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
