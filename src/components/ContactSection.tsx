import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation, Calendar } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const ContactSection: React.FC = () => {
  const { clinicInfo, timings } = useClinic();

  const handleScrollToAppointment = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('appointment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Contact Information"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            Connect With The Clinic
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            “Let’s Take the First Step Together.”
          </h2>
          <p className="text-base sm:text-lg text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
            Reach out via phone, WhatsApp, or through our appointment portal. Our team will guide you with discretion.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Address */}
          <div className="bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center text-[#4A6B5D] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#0f233a] mb-2">
                Clinic Address
              </h4>
              <p className="text-xs sm:text-sm text-[#1B1F23]/75 font-light leading-relaxed">
                501, Om Complex, Opposite JCCC Hospital, Near Jolly Banglow, Summair Club Road, Jamnagar, Gujarat, India.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1B1F23]/10">
              <a
                href={clinicInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#4A6B5D] hover:text-[#0f233a] flex items-center gap-1.5"
              >
                <span>View Google Map</span>
                <Navigation className="w-3 h-3 text-[#C5A880]" />
              </a>
            </div>
          </div>

          {/* Phone & Direct Contact */}
          <div className="bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center text-[#0f233a] mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#0f233a] mb-2">
                Phone Enquiries
              </h4>
              <p className="text-xs sm:text-sm text-[#1B1F23]/75 font-light mb-1">
                Direct Clinic Desk:
              </p>
              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                className="text-base font-bold text-[#0f233a] hover:text-[#4A6B5D]"
              >
                {clinicInfo.phone}
              </a>
              <p className="text-[11px] text-[#1B1F23]/60 mt-2 font-light">
                Assistance available during operational clinic hours.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1B1F23]/10">
              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                className="text-xs font-semibold text-[#0f233a] hover:text-[#4A6B5D]"
              >
                Call Clinic Desk Now →
              </a>
            </div>
          </div>

          {/* WhatsApp Assistance */}
          <div className="bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#0f233a] mb-2">
                WhatsApp Messaging
              </h4>
              <p className="text-xs sm:text-sm text-[#1B1F23]/75 font-light mb-1">
                Quick Inquiries:
              </p>
              <a
                href={`https://wa.me/${clinicInfo.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-emerald-800 hover:text-emerald-900"
              >
                {clinicInfo.whatsapp}
              </a>
              <p className="text-[11px] text-[#1B1F23]/60 mt-2 font-light">
                Message anytime to request appointment timings or clinic directions.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1B1F23]/10">
              <a
                href={`https://wa.me/${clinicInfo.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* Email & Timings Summary */}
          <div className="bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center text-[#C5A880] mb-4">
                <Mail className="w-5 h-5 text-[#0f233a]" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#0f233a] mb-2">
                Email &amp; Schedule
              </h4>
              <a
                href={`mailto:${clinicInfo.email}`}
                className="text-xs sm:text-sm font-semibold text-[#0f233a] hover:underline block truncate"
              >
                {clinicInfo.email}
              </a>
              <div className="mt-3 text-xs text-[#1B1F23]/75 space-y-0.5">
                <p><span className="font-semibold text-[#0f233a]">Mon – Sat:</span> 10 AM – 1:30 PM &amp; 5:30 – 8:30 PM</p>
                <p><span className="font-semibold text-[#0f233a]">Sunday:</span> Closed</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1B1F23]/10">
              <a
                href="#clinic-location-and-hours"
                className="text-xs font-semibold text-[#4A6B5D] hover:text-[#0f233a]"
              >
                Full Weekly Timings →
              </a>
            </div>
          </div>
        </div>

        {/* 4 Required Action Buttons Bar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#1B1F23]/10 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0f233a]">
                Ready to Schedule Your Appointment?
              </h3>
              <p className="text-xs sm:text-sm text-[#1B1F23]/70 font-light mt-1">
                Consult with Dr. Renish Bhatt in Jamnagar with complete privacy and dedicated attention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                id="contact-action-call"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#0f233a] border border-[#1B1F23]/20 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4 text-[#4A6B5D]" />
                <span>CALL NOW</span>
              </a>

              <a
                href={`https://wa.me/${clinicInfo.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-action-whatsapp"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WHATSAPP</span>
              </a>

              <a
                href={clinicInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-action-directions"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#EFE8DF] text-[#0f233a] border border-[#1B1F23]/10 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#C5A880]" />
                <span>GET DIRECTIONS</span>
              </a>

              <a
                href="#appointment"
                onClick={handleScrollToAppointment}
                id="contact-action-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0f233a] hover:bg-[#172b4d] text-white text-xs font-semibold py-3 px-5 rounded-xl transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>BOOK APPOINTMENT</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
