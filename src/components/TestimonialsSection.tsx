import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mrs. Adeyemi F.",
    role: "Mother of 3",
    content: "I delivered my last baby here and the maternity team was wonderful. They were patient, professional, and made me feel safe throughout. I recommend BienSanté to every expectant mother.",
    rating: 5,
    initials: "AF",
  },
  {
    name: "Mr. Ogunlade T.",
    role: "Business Owner, Shasha",
    content: "I rushed in with chest pain one night and the emergency team responded fast. The doctor took time to explain my condition clearly. Very grateful for the care I received.",
    rating: 5,
    initials: "OT",
  },
  {
    name: "Nurse Bola K.",
    role: "Community Health Worker",
    content: "I refer patients to BienSanté because of their lab accuracy and affordable consultation fees. The staff treat everyone with respect regardless of status. That matters.",
    rating: 5,
    initials: "BK",
  },
  {
    name: "Alhaja Muinat S.",
    role: "Retired Teacher",
    content: "My knee problem was properly diagnosed here after two hospitals couldn't figure it out. The orthopedic doctor was thorough and honest. I'm walking well again thanks to BienSanté.",
    rating: 5,
    initials: "MS",
  },
  {
    name: "Mr. Chinedu O.",
    role: "Engineer, Egbeda",
    content: "Brought my son in for a medical emergency on a Sunday and they attended to us immediately. Clean facility, friendly nurses. You can tell they genuinely care about patients.",
    rating: 5,
    initials: "CO",
  },
  {
    name: "Mrs. Funke A.",
    role: "Trader, Dopemu",
    content: "The antenatal clinic here is well organized. Every Tuesday I look forward to going because the nurses are kind and the doctors explain everything. I feel safe with my pregnancy here.",
    rating: 5,
    initials: "FA",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="flex-shrink-0 w-[350px] bg-white rounded-lg p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 flex flex-col">
    {/* Stars */}
    <div className="flex space-x-1 mb-6">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    {/* Content */}
    <blockquote className="text-slate-700 text-base leading-relaxed mb-8 flex-grow italic">
      "{testimonial.content}"
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-4 border-t border-slate-100 pt-6 mt-auto">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
        {testimonial.initials}
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-900">{testimonial.name}</h4>
        <p className="text-sm text-slate-500">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Patient Stories
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Real stories from members of our community who trust BienSanté Hospital with their health and the health of their loved ones.
          </p>
        </div>
      </div>

      {/* Marquee Row */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] px-6">
          {allTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
