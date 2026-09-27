import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MapPin, Languages, Shield, CalendarCheck } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const FAQSection: React.FC = () => {
  const { faqs } = useClinic();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faqs"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            Patient Inquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#1B1F23]/75 font-light mt-3 max-w-xl mx-auto leading-relaxed">
            Clear, honest answers to help you feel informed and reassured before your consultation.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                id={`faq-item-${idx}`}
                className="bg-white rounded-2xl border border-[#1B1F23]/10 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left focus:outline-none focus:bg-[#FAF8F5]/80 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#0f233a] pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#0f233a] text-white' : 'text-[#0f233a]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#1B1F23]/80 font-light leading-relaxed border-t border-[#1B1F23]/5"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Questions Help Box */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#EFE8DF]/50 border border-[#1B1F23]/10">
          <p className="text-sm text-[#1B1F23]/85 font-medium">
            Have a question that is not addressed here?
          </p>
          <p className="text-xs text-[#1B1F23]/65 mt-1">
            Our clinic desk is ready to answer your inquiries with complete confidentiality.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href="#appointment"
              className="text-xs font-semibold bg-[#0f233a] text-white px-4 py-2 rounded-lg hover:bg-[#4A6B5D] transition-colors"
            >
              Request Consultation
            </a>
            <a
              href="tel:+919428212345"
              className="text-xs font-semibold bg-white text-[#0f233a] border border-[#1B1F23]/15 px-4 py-2 rounded-lg hover:bg-[#FAF8F5] transition-colors"
            >
              Call Clinic Desk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
