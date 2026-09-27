import React from 'react';
import { CalendarCheck, MessageSquareQuote, BrainCircuit, HeartPulse } from 'lucide-react';

export const PatientJourney: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'BOOK',
      subtitle: 'Choose your preferred appointment and contact the clinic.',
      description: 'Submit an appointment request online, phone the clinic, or message via WhatsApp to arrange a convenient time.',
      icon: CalendarCheck
    },
    {
      number: '02',
      title: 'CONSULT',
      subtitle: 'Discuss your concerns privately with the doctor.',
      description: 'Meet Dr. Renish Bhatt in a confidential, safe room designed for unhurried, comfortable conversation.',
      icon: MessageSquareQuote
    },
    {
      number: '03',
      title: 'UNDERSTAND',
      subtitle: 'Receive professional assessment and guidance.',
      description: 'Gain clear, medical understanding of your situation with explanations provided in plain language.',
      icon: BrainCircuit
    },
    {
      number: '04',
      title: 'CONTINUE CARE',
      subtitle: 'Follow your personalised treatment and follow-up plan.',
      description: 'Receive supportive follow-up appointments and ongoing modifications to maintain lasting mental wellbeing.',
      icon: HeartPulse
    }
  ];

  return (
    <section
      id="patient-journey"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Patient Journey Timeline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            Step-by-Step Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            Your Path to Mental Wellness
          </h2>
          <p className="text-base sm:text-lg text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
            We understand taking the first step can feel daunting. Here is how your consultation journey unfolds.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-1/2 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#C5A880]/30 via-[#4A6B5D]/40 to-[#0f233a]/30 -translate-y-8 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  id={`journey-step-${step.number}`}
                  className="bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    {/* Header circle with step number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-full bg-[#0f233a] text-[#C5A880] flex items-center justify-center font-serif text-base font-bold shadow-sm group-hover:bg-[#4A6B5D] transition-colors">
                        {step.number}
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center text-[#4A6B5D]">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <span className="text-xs uppercase tracking-widest text-[#4A6B5D] font-semibold">
                      STEP {step.number}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#0f233a] mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium text-[#1B1F23]/85 mb-2 leading-snug">
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-[#1B1F23]/65 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
