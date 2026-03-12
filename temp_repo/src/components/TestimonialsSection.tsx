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
    content: "Brought my son in for a dental emergency on a Sunday and they attended to us immediately. Clean facility, friendly nurses. You can tell they genuinely care about patients.",
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
  <div className="flex-shrink-0 w-[350px] bg-background rounded-2xl p-7 shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-300">
    {/* Stars - now yellow */}
    <div className="flex space-x-1 mb-4">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>

    {/* Content */}
    <blockquote className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-4">
      "{testimonial.content}"
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-3 border-t border-border pt-4">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
        {testimonial.initials}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{testimonial.name}</h4>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 bg-medical-light overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">
            Patient Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from members of our community who trust BienSanté Hospital with their health.
          </p>
        </div>
      </div>

      {/* Marquee Row */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-medical-light to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-medical-light to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee md:animate-marquee max-md:animate-marquee-mobile hover:[animation-play-state:paused]">
          {allTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
