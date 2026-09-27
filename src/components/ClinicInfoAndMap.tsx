import React, { useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  MessageCircle, 
  Clock, 
  ExternalLink,
  CalendarCheck,
  Building,
  Check,
  AlertCircle
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const ClinicInfoAndMap: React.FC = () => {
  const { clinicInfo, timings } = useClinic();

  // Current day determination for Jamnagar (Asia/Kolkata or local browser)
  const currentDayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    return days[now.getDay()];
  }, []);

  const todayTiming = useMemo(() => {
    return timings.find(t => t.day === currentDayName);
  }, [timings, currentDayName]);

  return (
    <section
      id="clinic-location-and-hours"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Clinic Location and Timings"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            Visit Our Clinic
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            Find Us in Jamnagar
          </h2>
          <p className="text-base sm:text-lg text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
            Conveniently situated on Summair Club Road, opposite JCCC Hospital and near Jolly Banglow.
          </p>
        </div>

        {/* 2-Column Layout: Left = Info Card & Timings, Right = Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Clinic Card & Timings Table */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Clinic Info Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#1B1F23]/10 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#4A6B5D]" />
                <span className="text-xs uppercase tracking-widest text-[#4A6B5D] font-bold">
                  Consultation Center
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f233a] leading-tight">
                {clinicInfo.clinicName}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#C5A880] mt-0.5 mb-4">
                Dr. Renish Bhatt • Consultant Psychiatrist
              </p>

              {/* Address details */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 text-sm text-[#1B1F23]/85 space-y-1 mb-6">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#4A6B5D] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0f233a]">
                      {clinicInfo.address.suite}, {clinicInfo.address.building}
                    </p>
                    <p className="text-xs sm:text-sm text-[#1B1F23]/75">
                      {clinicInfo.address.landmark}
                    </p>
                    <p className="text-xs sm:text-sm text-[#1B1F23]/75">
                      {clinicInfo.address.area}, {clinicInfo.address.city}, {clinicInfo.address.state}, {clinicInfo.address.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={clinicInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="clinic-card-directions-btn"
                  className="inline-flex items-center justify-center gap-2 bg-[#0f233a] hover:bg-[#172b4d] text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-[#C5A880]" />
                  <span>GET DIRECTIONS</span>
                </a>

                <a
                  href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                  id="clinic-card-call-btn"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#0f233a] border border-[#1B1F23]/15 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#4A6B5D]" />
                  <span>CALL CLINIC</span>
                </a>

                <a
                  href={`https://wa.me/${clinicInfo.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hello Sai Shradhdha Mind Care Clinic, I would like to inquire about consulting Dr. Renish Bhatt.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="clinic-card-whatsapp-btn"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Clinic Timings Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#1B1F23]/10 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4A6B5D]" />
                  <h4 className="font-serif text-xl font-bold text-[#0f233a]">
                    Clinic Consultation Timings
                  </h4>
                </div>

                {/* Today badge */}
                {todayTiming && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      todayTiming.isOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {todayTiming.isOpen ? 'Open Today' : 'Closed Today'}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#1B1F23]/60 mb-4 font-light">
                Consultation slots are organized into morning and evening sessions. Prior appointment is advised to avoid wait times.
              </p>

              {/* Day by Day Timings Table */}
              <div className="divide-y divide-[#1B1F23]/10 border-t border-b border-[#1B1F23]/10 text-xs sm:text-sm">
                {timings.map((slot) => {
                  const isToday = slot.day === currentDayName;
                  return (
                    <div
                      key={slot.day}
                      className={`py-2.5 flex items-center justify-between transition-colors ${
                        isToday ? 'bg-[#FAF8F5] -mx-2 px-2 rounded-lg font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-20 sm:w-24 text-[#0f233a] font-semibold">
                          {slot.day}
                        </span>
                        {isToday && (
                          <span className="text-[10px] uppercase font-bold text-[#4A6B5D] bg-[#4A6B5D]/10 px-1.5 py-0.5 rounded">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {slot.isOpen ? (
                          <div className="space-y-0.5">
                            <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded mr-1.5">
                              OPEN
                            </span>
                            <span className="text-xs text-[#1B1F23]/80">
                              <strong className="font-semibold text-[#0f233a]">Morning:</strong> {slot.morningHours}
                              <span className="mx-1.5 text-[#1B1F23]/30">|</span>
                              <strong className="font-semibold text-[#0f233a]">Evening:</strong> {slot.eveningHours}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="inline-block text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                              CLOSED
                            </span>
                            <span className="text-xs text-[#1B1F23]/60">
                              {slot.note || 'Closed'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#1B1F23]/60 mt-3 font-light">
                * Note: Timings are subject to doctor’s clinical schedule. Timings can be verified or updated by staff in real time via the clinic portal.
              </p>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Embed */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-[#1B1F23]/10 shadow-md">
              {/* Map header */}
              <div className="p-4 bg-[#FAF8F5] border-b border-[#1B1F23]/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-left">
                  <Building className="w-4 h-4 text-[#4A6B5D]" />
                  <span className="text-xs font-semibold text-[#0f233a]">
                    Om Complex, Summair Club Road, Jamnagar
                  </span>
                </div>
                <a
                  href={clinicInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="open-in-google-maps-btn"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A6B5D] hover:text-[#0f233a] transition-colors"
                >
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Real Embedded Google Map for Jamnagar */}
              <div className="relative w-full h-[460px] sm:h-[520px] bg-[#EFE8DF]">
                <iframe
                  title="Sai Shradhdha Mind Care Clinic Jamnagar Location"
                  src="https://maps.google.com/maps?q=Om+Complex,+Summair+Club+Road,+Jamnagar,+Gujarat,+India&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Landmark Guidance Footer */}
              <div className="p-4 bg-white text-xs text-[#1B1F23]/75 text-left flex items-start gap-2 border-t border-[#1B1F23]/10">
                <Navigation className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0f233a]">Key Landmarks &amp; Route Guidance:</p>
                  <p className="text-[11px] text-[#1B1F23]/70 mt-0.5">
                    Located on Summair Club Road opposite JCCC Hospital and adjacent to Jolly Banglow. Elevator access is available to the 5th floor (Suite 501).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
