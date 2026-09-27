import React from 'react';
import { X, Calendar, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const ServiceDetailModal: React.FC = () => {
  const { selectedServiceModal, setSelectedServiceModal } = useClinic();

  if (!selectedServiceModal) return null;

  const handleBookThisService = () => {
    const serviceTitle = selectedServiceModal.title;
    setSelectedServiceModal(null);
    const formReasonSelect = document.getElementById('form-reason') as HTMLSelectElement;
    if (formReasonSelect) {
      formReasonSelect.value = serviceTitle;
    }
    const appointmentSection = document.getElementById('appointment');
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#1B1F23]/10 overflow-hidden max-h-[90vh] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#1B1F23]/10 flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#4A6B5D] font-semibold">
              Clinical Specialisation
            </span>
            <h3 id="service-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#0f233a] mt-1">
              {selectedServiceModal.title}
            </h3>
            {selectedServiceModal.isHypnotherapy && (
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#8c6b3f]">
                Adjunct Certified Medical Modality
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedServiceModal(null)}
            className="p-2 rounded-lg text-[#1B1F23]/50 hover:text-[#0f233a] hover:bg-[#1B1F23]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#1B1F23]/80 font-light leading-relaxed">
          <div>
            <h4 className="font-serif text-base font-bold text-[#0f233a] mb-1">
              Clinical Overview
            </h4>
            <p>{selectedServiceModal.detailedOverview}</p>
          </div>

          <div>
            <h4 className="font-serif text-base font-bold text-[#0f233a] mb-2">
              Common Reasons Individuals Seek Guidance
            </h4>
            <ul className="space-y-2">
              {selectedServiceModal.indications.map((ind, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4A6B5D] shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10">
            <h4 className="font-serif text-sm font-bold text-[#0f233a] mb-1">
              Dr. Renish Bhatt's Approach
            </h4>
            <p className="text-xs sm:text-sm text-[#1B1F23]/75">
              {selectedServiceModal.clinicalApproach}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#EFE8DF]/60 border border-[#1B1F23]/10 flex items-start gap-2 text-xs text-[#1B1F23]/70">
            <Info className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
            <span>
              Treatment plans are individualized following thorough face-to-face psychiatric evaluation. No treatment guarantees are made.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#1B1F23]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setSelectedServiceModal(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#1B1F23]/20 text-xs font-semibold text-[#1B1F23]/70 hover:bg-[#FAF8F5] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleBookThisService}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0f233a] hover:bg-[#4A6B5D] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#C5A880]" />
            <span>Book Consultation For This Service</span>
          </button>
        </div>
      </div>
    </div>
  );
};
