import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const MobileStickyBar: React.FC = () => {
  const { clinicInfo } = useClinic();

  const handleScrollToAppointment = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('appointment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      id="mobile-sticky-action-bar"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1B1F23]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      aria-label="Mobile Quick Actions"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* CALL */}
        <a
          href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
          id="mobile-sticky-call"
          className="min-h-[46px] flex flex-col items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 text-[#0f233a] active:bg-[#EFE8DF] transition-colors"
          aria-label="Call clinic directly"
        >
          <Phone className="w-4 h-4 text-[#4A6B5D]" />
          <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">
            CALL
          </span>
        </a>

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/${clinicInfo.whatsapp.replace(/\+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-sticky-whatsapp"
          className="min-h-[46px] flex flex-col items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 active:bg-emerald-100 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-emerald-700" />
          <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">
            WHATSAPP
          </span>
        </a>

        {/* APPOINTMENT */}
        <a
          href="#appointment"
          onClick={handleScrollToAppointment}
          id="mobile-sticky-appointment"
          className="min-h-[46px] flex flex-col items-center justify-center rounded-xl bg-[#0f233a] text-white active:bg-[#172b4d] shadow-sm transition-colors"
          aria-label="Book appointment form"
        >
          <Calendar className="w-4 h-4 text-[#C5A880]" />
          <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">
            APPOINTMENT
          </span>
        </a>
      </div>
    </aside>
  );
};
