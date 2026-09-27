import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert } from 'lucide-react';

export const EmergencyNotice: React.FC = () => {
  return (
    <section
      id="emergency-notice"
      className="py-12 bg-[#FAF8F5] border-t border-[#1B1F23]/5"
      aria-label="Mental Health Emergency Information"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 text-left shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Critical Care Guidance
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0f233a]">
                  Need Immediate Help?
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-amber-200/60 text-amber-900">
              Not an Emergency Center
            </span>
          </div>

          <div className="pt-4 space-y-4 text-xs sm:text-sm text-[#1B1F23]/80 leading-relaxed font-light">
            <p>
              “If you or someone else is in immediate danger or experiencing a mental-health emergency, contact local emergency services or go to the nearest emergency department immediately.”
            </p>
            <p>
              Sai Shradhdha Mind Care Clinic provides outpatient scheduled consultations and is not equipped to handle acute medical or psychiatric crises requiring 24-hour emergency casualty admission.
            </p>

            {/* India Emergency Helpline References */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-amber-200/60">
                <span className="text-[11px] font-semibold text-amber-800 block">
                  Tele-MANAS (Govt. of India)
                </span>
                <a
                  href="tel:14416"
                  className="text-sm font-bold text-[#0f233a] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>14416 / 1800-891-4416</span>
                </a>
                <span className="text-[10px] text-[#1B1F23]/60 block mt-0.5">24/7 Toll-Free Mental Health</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-200/60">
                <span className="text-[11px] font-semibold text-amber-800 block">
                  National Emergency Helpline
                </span>
                <a
                  href="tel:112"
                  className="text-sm font-bold text-[#0f233a] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>112 (All India Emergency)</span>
                </a>
                <span className="text-[10px] text-[#1B1F23]/60 block mt-0.5">Police &amp; Ambulance Support</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-200/60">
                <span className="text-[11px] font-semibold text-amber-800 block">
                  Vandrevala Foundation
                </span>
                <a
                  href="tel:+919999666555"
                  className="text-sm font-bold text-[#0f233a] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>+91 9999 666 555</span>
                </a>
                <span className="text-[10px] text-[#1B1F23]/60 block mt-0.5">24/7 Crisis Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
