import React from 'react';
import { ShieldCheck, Heart, UserCheck, Lock } from 'lucide-react';

export const ConfidentialitySection: React.FC = () => {
  const pillars = [
    {
      title: 'Privacy',
      subtitle: 'Complete Discretion',
      description: 'Medical history, consultations, and discussions are kept strictly confidential under statutory medical ethics.',
      icon: Lock,
    },
    {
      title: 'Respect',
      subtitle: 'Dignified Regard',
      description: 'Every individual is treated with the highest dignity, validating emotional challenges without condescension.',
      icon: UserCheck,
    },
    {
      title: 'Compassion',
      subtitle: 'Judgement-Free Environment',
      description: 'An unhurried clinical setting dedicated to listening with patience, empathy, and professional understanding.',
      icon: Heart,
    }
  ];

  return (
    <section
      id="confidentiality"
      className="py-20 lg:py-24 bg-[#0c1b2f] text-white relative overflow-hidden"
      aria-label="Patient Confidentiality and Dignity"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#4A6B5D]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 mb-4 text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
          <span>Patient Trust &amp; Confidentiality</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-tight text-white">
          “A Safe Space to Speak Freely.”
        </h2>

        {/* Text */}
        <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          Mental health conversations are personal. Our clinic experience is designed to make patients feel respected, comfortable and free from judgement.
        </p>

        {/* 3 Pillars: Privacy, Respect, Compassion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-5xl mx-auto text-left">
          {pillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={idx}
                id={`pillar-${pillar.title.toLowerCase()}`}
                className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-[#C5A880]/40 transition-all duration-300 hover:bg-white/[0.07] group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <IconComp className="w-6 h-6 text-[#C5A880]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">
                  {pillar.subtitle}
                </p>
                <p className="text-sm text-white/75 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom medical reassurance footnote */}
        <div className="mt-12 text-xs text-white/60 max-w-xl mx-auto">
          Consultation records at Sai Shradhdha Mind Care Clinic are securely handled with strict medical confidentiality.
        </div>
      </div>
    </section>
  );
};
