import React from 'react';
import { X, Award, FileCheck, CheckCircle2, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const DoctorDetailModal: React.FC = () => {
  const { isAboutDetailOpen, setIsAboutDetailOpen, clinicInfo } = useClinic();

  if (!isAboutDetailOpen) return null;

  const handleBookFromDoctorModal = () => {
    setIsAboutDetailOpen(false);
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
      aria-labelledby="doctor-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#1B1F23]/10 overflow-hidden max-h-[90vh] flex flex-col text-left">
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#1B1F23]/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/doctor_portrait_1789459821174.jpg"
              alt="Dr. Renish Bhatt"
              className="w-16 h-16 rounded-xl object-cover object-top border border-[#1B1F23]/10"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs uppercase tracking-widest text-[#4A6B5D] font-semibold">
                Consultant Psychiatrist
              </span>
              <h3 id="doctor-modal-title" className="font-serif text-2xl font-bold text-[#0f233a]">
                {clinicInfo.doctorName}
              </h3>
              <p className="text-xs text-[#1B1F23]/70 font-sans">
                MBBS, DPM – Psychiatry • GMC Reg. {clinicInfo.registration.split(': ')[1] || 'G 18979'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAboutDetailOpen(false)}
            className="p-2 rounded-lg text-[#1B1F23]/50 hover:text-[#0f233a] hover:bg-[#1B1F23]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#1B1F23]/80 font-light leading-relaxed">
          <div>
            <h4 className="font-serif text-base font-bold text-[#0f233a] mb-2">
              Clinical Background &amp; Philosophy
            </h4>
            <p className="mb-3">
              Dr. Renish Bhatt brings over 13 years of healthcare practice to Sai Shradhdha Mind Care Clinic in Jamnagar. His practice is anchored in the conviction that psychological wellbeing cannot be separated from an individual’s physical health, family context, and personal life narrative.
            </p>
            <p>
              By combining medical psychiatric assessment with empathetic counselling, Dr. Bhatt seeks to demystify mental healthcare, ensuring every patient and accompanying family member feels dignified, informed, and respected.
            </p>
          </div>

          {/* Verified Qualifications */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#0f233a] mb-3">
              Medical Council Verified Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10">
                <div className="flex items-center gap-2 text-[#4A6B5D] mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#0f233a]">MBBS</span>
                </div>
                <p className="text-xs text-[#1B1F23]/70">
                  Bachelor of Medicine &amp; Bachelor of Surgery
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10">
                <div className="flex items-center gap-2 text-[#4A6B5D] mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#0f233a]">DPM – Psychiatry</span>
                </div>
                <p className="text-xs text-[#1B1F23]/70">
                  Postgraduate Diploma in Psychological Medicine
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10">
                <div className="flex items-center gap-2 text-[#C5A880] mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#0f233a]">Gujarat Medical Council</span>
                </div>
                <p className="text-xs text-[#1B1F23]/70">
                  Permanent Registration Number: G 18979
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10">
                <div className="flex items-center gap-2 text-[#C5A880] mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-bold text-[#0f233a]">Clinical Experience</span>
                </div>
                <p className="text-xs text-[#1B1F23]/70">
                  13+ Years of Continuous Healthcare Experience
                </p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#0f233a] mb-1">
              Consultation Languages
            </h4>
            <p className="text-xs sm:text-sm text-[#1B1F23]/75">
              Fluent consultations are conducted in <strong className="text-[#0f233a]">English</strong>, <strong className="text-[#0f233a]">Hindi</strong>, and <strong className="text-[#0f233a]">Gujarati (ગુજરાતી)</strong> to ensure that you can express nuances of emotion with maximum comfort.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#1B1F23]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setIsAboutDetailOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#1B1F23]/20 text-xs font-semibold text-[#1B1F23]/70 hover:bg-[#FAF8F5] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleBookFromDoctorModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0f233a] hover:bg-[#4A6B5D] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#C5A880]" />
            <span>Book Consultation with Dr. Bhatt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
