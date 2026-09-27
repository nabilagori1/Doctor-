import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const LegalModals: React.FC = () => {
  const { activeLegalModal, setActiveLegalModal } = useClinic();

  if (!activeLegalModal) return null;

  const closeModal = () => setActiveLegalModal(null);

  const getModalTitle = () => {
    switch (activeLegalModal) {
      case 'privacy':
        return 'Privacy & Confidentiality Policy';
      case 'terms':
        return 'Terms & Conditions';
      case 'disclaimer':
        return 'Medical & Clinical Disclaimer';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#1B1F23]/10 overflow-hidden max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#1B1F23]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f233a] text-[#C5A880] flex items-center justify-center">
              {activeLegalModal === 'privacy' && <Lock className="w-5 h-5" />}
              {activeLegalModal === 'terms' && <FileText className="w-5 h-5" />}
              {activeLegalModal === 'disclaimer' && <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#4A6B5D] font-semibold">
                Sai Shradhdha Mind Care Clinic
              </span>
              <h3 id="legal-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#0f233a]">
                {getModalTitle()}
              </h3>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-lg text-[#1B1F23]/50 hover:text-[#0f233a] hover:bg-[#1B1F23]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#1B1F23]/80 font-light leading-relaxed">
          {activeLegalModal === 'privacy' && (
            <>
              <p>
                <strong>1. Patient Confidentiality:</strong> Sai Shradhdha Mind Care Clinic holds all patient interactions, consultation discussions, clinical assessments, and contact information under strict medical confidentiality in accordance with the National Medical Commission (NMC) ethics guidelines.
              </p>
              <p>
                <strong>2. Data Use:</strong> Details submitted through the appointment booking request form (such as Name, Phone Number, and Reason for Consultation) are used solely by authorized clinic administration to coordinate and confirm appointments. We do not share, sell, or disclose personal details to external commercial entities.
              </p>
              <p>
                <strong>3. Exceptions:</strong> Confidentiality is strictly maintained except under legally mandated requirements, such as a formal court order or an imminent risk of severe harm to self or others where emergency intervention is required for safety.
              </p>
            </>
          )}

          {activeLegalModal === 'terms' && (
            <>
              <p>
                <strong>1. Appointment Scheduling:</strong> Submitting an appointment request on this website constitutes an enquiry and does not automatically confirm an appointment. Appointments are confirmed upon mutual agreement with the clinic desk via phone or WhatsApp.
              </p>
              <p>
                <strong>2. Punctuality &amp; Rescheduling:</strong> Patients are requested to arrive 10 minutes before their scheduled consultation slot. If you need to reschedule or cancel, please inform the clinic at least 4 hours in advance.
              </p>
              <p>
                <strong>3. Clinic Scope:</strong> Sai Shradhdha Mind Care Clinic is an outpatient private clinical practice. In-person psychiatric evaluation is the standard mode of diagnosis and care.
              </p>
            </>
          )}

          {activeLegalModal === 'disclaimer' && (
            <>
              <p>
                <strong>1. General Informational Nature:</strong> The information provided on this website is for educational and appointment scheduling purposes only and does not constitute medical advice or establish a formal doctor-patient relationship until an in-person consultation occurs.
              </p>
              <p>
                <strong>2. No Treatment Guarantees:</strong> Psychological medicine and psychiatric therapy vary according to individual biology and circumstance. No guarantees or promises of specific medical outcomes are made or implied.
              </p>
              <p>
                <strong>3. Emergency Situations:</strong> If you or a loved one are experiencing acute mental health crisis, active suicidal ideation, or physical danger, please do not wait for a website appointment. Immediately call national crisis helplines (Tele-MANAS: 14416 / 1800-891-4416 or 112) or proceed to the nearest hospital casualty emergency ward.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#1B1F23]/10 flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-xl bg-[#0f233a] text-white text-xs font-semibold hover:bg-[#4A6B5D] transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
