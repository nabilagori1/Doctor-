import React from 'react';
import { Calendar, Phone, Navigation, Shield, Heart, UserCheck, Sparkles } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Hero: React.FC = () => {
  const { clinicInfo } = useClinic();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center bg-[#FAF8F5] overflow-hidden pt-6 pb-16 lg:py-20"
      aria-label="Welcome Hero"
    >
      {/* Subtle organic background aura */}
      <div
        className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#4A6B5D]/5 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none -ml-24 -mb-24"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography and CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            {/* Doctor & Clinic Identity Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DF] border border-[#C5A880]/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#4A6B5D] animate-pulse" />
              <span className="text-xs md:text-sm font-medium tracking-wide text-[#0f233a]">
                Jamnagar, Gujarat • In-Person Consultations
              </span>
            </div>

            {/* Prominent Doctor Name & Specialty */}
            <div className="pt-1">
              <h2 className="text-sm uppercase tracking-[0.2em] text-[#4A6B5D] font-semibold">
                Sai Shradhdha Mind Care Clinic
              </h2>
              <div className="mt-1 flex items-baseline gap-3 flex-wrap">
                <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0f233a]">
                  {clinicInfo.doctorName}
                </span>
                <span className="text-sm sm:text-base font-medium px-2.5 py-0.5 rounded-md bg-[#0f233a]/5 text-[#0f233a] border border-[#0f233a]/10">
                  {clinicInfo.specialty}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-[#0f233a] leading-[1.18] font-bold tracking-tight">
              “Your Mind Deserves Care, <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#4A6B5D]">Understanding</span> &amp; Compassion.”
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#1B1F23]/80 max-w-2xl font-light leading-relaxed">
              Professional psychiatric and mental-health care in a safe, confidential and compassionate environment.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => handleScrollTo('appointment')}
                id="hero-book-appointment-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0f233a] hover:bg-[#172b4d] text-white text-sm sm:text-base font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>BOOK AN APPOINTMENT</span>
              </button>

              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                id="hero-call-clinic-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FAF8F5] text-[#0f233a] border border-[#1B1F23]/15 text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:border-[#0f233a]/30 active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-[#4A6B5D]" />
                <span>CALL CLINIC</span>
              </a>

              <a
                href={clinicInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-get-directions-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#4A6B5D] hover:text-[#0f233a] text-sm font-medium px-4 py-3 rounded-xl transition-colors hover:bg-[#4A6B5D]/5"
              >
                <Navigation className="w-4 h-4 text-[#C5A880]" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>

            {/* Micro reassurance badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#1B1F23]/70">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#4A6B5D]" />
                <span>Strict Confidentiality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#4A6B5D]" />
                <span>GMC Reg. G 18979</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>No Judgment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Floating Atmosphere Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#1B1F23]/10 bg-[#EFE8DF]">
                <img
                  src="/src/assets/images/clinic_interior_1789459789938.jpg"
                  alt="Sai Shradhdha Mind Care Clinic peaceful consultation room"
                  className="w-full h-[380px] sm:h-[460px] object-cover hover:scale-[1.02] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f233a]/80 via-transparent to-transparent pointer-events-none" />

                {/* Bottom caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-left text-white p-3 rounded-xl bg-[#0f233a]/75 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">
                        A Calm &amp; Private Space
                      </p>
                      <p className="text-sm font-serif font-medium">
                        Summair Club Road, Jamnagar
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[11px] font-sans px-2 py-0.5 rounded bg-emerald-700/80 text-white">
                        Consultations Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Confidential Care */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-[#1B1F23]/10 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-9 h-9 rounded-lg bg-[#0f233a] flex items-center justify-center text-[#C5A880] shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#0f233a]">Confidential Care</p>
                  <p className="text-[11px] text-[#1B1F23]/70">Safe, private environment</p>
                </div>
              </div>

              {/* Floating Card 2: Personalised Support */}
              <div className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-[#1B1F23]/10 flex items-center gap-3 transition-transform hover:translate-x-1 duration-200">
                <div className="w-9 h-9 rounded-lg bg-[#4A6B5D] flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#0f233a]">Personalised Support</p>
                  <p className="text-[11px] text-[#1B1F23]/70">Tailored to your needs</p>
                </div>
              </div>

              {/* Floating Card 3: Compassionate Approach */}
              <div className="absolute -bottom-5 left-8 sm:left-12 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-[#1B1F23]/10 flex items-center gap-3 transition-transform hover:translate-y-1 duration-200 z-20">
                <div className="w-9 h-9 rounded-lg bg-[#C5A880] flex items-center justify-center text-[#0f233a] shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#0f233a]">Compassionate Approach</p>
                  <p className="text-[11px] text-[#1B1F23]/70">Listening without judgment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
