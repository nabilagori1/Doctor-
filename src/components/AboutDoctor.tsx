import React from 'react';
import { Award, FileBadge, CheckCircle, Quote, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AboutDoctor: React.FC = () => {
  const { clinicInfo, setIsAboutDetailOpen } = useClinic();

  return (
    <section
      id="about"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative overflow-hidden"
      aria-label="About Dr. Renish Bhatt"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Professional Doctor Portrait */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Decorative background shape */}
              <div
                className="absolute inset-0 bg-[#EFE8DF] rounded-2xl transform -rotate-2 scale-[1.02] border border-[#1B1F23]/10 -z-10"
                aria-hidden="true"
              />

              {/* Portrait Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#1B1F23]/10 bg-white">
                <img
                  src="/src/assets/images/doctor_portrait_1789459821174.jpg"
                  alt="Dr. Renish Bhatt - Consultant Psychiatrist in Jamnagar"
                  className="w-full h-[420px] sm:h-[500px] object-cover object-top"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Bottom doctor label overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0f233a] via-[#0f233a]/80 to-transparent p-5 text-white text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A880]">
                    Consultant Psychiatrist
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                    {clinicInfo.doctorName}
                  </h3>
                  <p className="text-xs text-white/80 font-sans mt-0.5">
                    Sai Shradhdha Mind Care Clinic • Jamnagar
                  </p>
                </div>
              </div>

              {/* Verified Council Badge Pill */}
              <div className="mt-4 p-3 rounded-xl bg-white border border-[#1B1F23]/10 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4A6B5D]/10 flex items-center justify-center text-[#4A6B5D] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-[#0f233a]">Registered Medical Practitioner</p>
                  <p className="text-[#1B1F23]/70">{clinicInfo.registration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Biography & Clinical Vision */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
                Meet Your Doctor
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-[#0f233a] mt-1 tracking-tight">
                Dr. Renish Bhatt
              </h2>
              <p className="text-sm font-medium text-[#C5A880] mt-1">
                MBBS, DPM – Psychiatry • Consultant Psychiatrist
              </p>
            </div>

            {/* Warm & Professional Biography */}
            <div className="space-y-4 text-base text-[#1B1F23]/85 leading-relaxed font-light">
              <p>
                Dr. Renish Bhatt is a dedicated consultant psychiatrist with over 13 years of healthcare experience, serving patients in Jamnagar and surrounding regions with clinical excellence and heartfelt empathy.
              </p>
              <p>
                At Sai Shradhdha Mind Care Clinic, Dr. Bhatt provides psychiatric and mental-health care with a deep emphasis on genuine listening, understanding each individual’s unique personal concerns, and co-creating personalised care plans. Rather than reducing distress to symptoms alone, he takes time to explore biological, emotional, and social factors in an environment built strictly on trust and confidentiality.
              </p>
            </div>

            {/* Qualification Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#1B1F23]/10 shadow-sm">
                <div className="flex items-center gap-2 text-[#4A6B5D] mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Degree</span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#0f233a]">MBBS</h4>
                <p className="text-xs text-[#1B1F23]/70 mt-0.5">Primary Medical Qualification</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#1B1F23]/10 shadow-sm">
                <div className="flex items-center gap-2 text-[#4A6B5D] mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Post-Graduate</span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#0f233a]">DPM – Psychiatry</h4>
                <p className="text-xs text-[#1B1F23]/70 mt-0.5">Specialist in Psychological Medicine</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#1B1F23]/10 shadow-sm">
                <div className="flex items-center gap-2 text-[#C5A880] mb-1">
                  <FileBadge className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">GMC Reg.</span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#0f233a]">G 18979</h4>
                <p className="text-xs text-[#1B1F23]/70 mt-0.5">Gujarat Medical Council</p>
              </div>
            </div>

            {/* Sophisticated Doctor Quote */}
            <div className="relative p-5 sm:p-6 rounded-2xl bg-[#EFE8DF]/60 border-l-4 border-[#4A6B5D] text-left">
              <Quote className="w-7 h-7 text-[#4A6B5D]/40 mb-2" />
              <p className="font-serif italic text-lg sm:text-xl text-[#0f233a] leading-snug">
                “Every mind deserves to be heard, understood and cared for.”
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4A6B5D] mt-2">
                — Dr. Renish Bhatt
              </p>
            </div>

            {/* Learn More Action */}
            <div className="pt-2">
              <button
                onClick={() => setIsAboutDetailOpen(true)}
                id="about-doctor-learn-more-btn"
                className="inline-flex items-center gap-2 text-[#0f233a] hover:text-[#4A6B5D] font-semibold text-sm group transition-colors pb-1 border-b border-[#0f233a]/30 hover:border-[#4A6B5D]"
              >
                <span>LEARN MORE ABOUT CLINICAL APPROACH</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
