import React from 'react';
import { 
  Lock, 
  Heart, 
  Sliders, 
  Stethoscope, 
  MapPin, 
  UserCheck 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: Lock,
      title: 'CONFIDENTIAL',
      subtitle: 'Your privacy and dignity come first.',
      description: 'Consultations are conducted in a strictly private, discreet environment with full adherence to medical confidentiality.',
      color: 'text-[#0f233a]'
    },
    {
      icon: Heart,
      title: 'COMPASSIONATE',
      subtitle: 'A respectful and judgement-free environment.',
      description: 'You will find an empathetic space to discuss thoughts and emotions freely without fear of stigma or bias.',
      color: 'text-[#4A6B5D]'
    },
    {
      icon: Sliders,
      title: 'PERSONALISED',
      subtitle: 'Care designed around individual needs.',
      description: 'Treatment plans reflect your specific lifestyle, emotional context, biological factors, and personal preferences.',
      color: 'text-[#C5A880]'
    },
    {
      icon: Stethoscope,
      title: 'PROFESSIONAL',
      subtitle: 'Professional psychiatric care.',
      description: 'Medical assessments guided by qualified clinical training (MBBS, DPM) and over 13 years of healthcare practice.',
      color: 'text-[#0f233a]'
    },
    {
      icon: MapPin,
      title: 'ACCESSIBLE',
      subtitle: 'Convenient clinic location in Jamnagar.',
      description: 'Centrally located at Om Complex, Summair Club Road, opposite JCCC Hospital, with easy transit access.',
      color: 'text-[#4A6B5D]'
    },
    {
      icon: UserCheck,
      title: 'PATIENT-CENTRED',
      subtitle: 'Focus on understanding the individual, not just symptoms.',
      description: 'We listen attentively to your life story, rather than rushing to label or over-medicate your circumstances.',
      color: 'text-[#C5A880]'
    }
  ];

  return (
    <section
      id="why-choose-us"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Why Choose Our Clinic"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            The Clinic Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            Care That Begins With Listening.
          </h2>
          <p className="text-base sm:text-lg text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
            Every aspect of Sai Shradhdha Mind Care Clinic is designed to make your journey toward emotional wellness reassuring and dignified.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                id={`why-card-${item.title.toLowerCase()}`}
                className="bg-white rounded-2xl p-7 border border-[#1B1F23]/10 shadow-sm hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center mb-5 group-hover:bg-[#0f233a] transition-colors duration-300">
                    <IconComponent className={`w-5 h-5 ${item.color} group-hover:text-[#C5A880] transition-colors`} />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#4A6B5D] font-bold">
                    {item.title}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#0f233a] mt-1 mb-2 leading-snug">
                    {item.subtitle}
                  </h3>
                  <p className="text-sm text-[#1B1F23]/75 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
