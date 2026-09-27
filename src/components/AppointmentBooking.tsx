import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Languages, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  Navigation,
  MessageCircle,
  AlertCircle,
  Database,
  ShieldCheck
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AppointmentBooking: React.FC = () => {
  const { clinicInfo, services, addAppointment, isSavingAppointment } = useClinic();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM – 01:30 PM)',
    patientType: 'New Patient' as 'New Patient' | 'Existing Patient',
    preferredLanguage: 'English' as 'English' | 'Hindi' | 'Gujarati',
    reasonForVisit: 'Psychiatric Consultation',
    additionalMessage: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ syncedToSupabase: boolean; message?: string } | null>(null);

  // Tomorrow's date for date picker min
  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    }
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Please enter a valid mobile number';
    } else if (!/^[0-9+ -]{8,15}$/.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.emailAddress.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errs.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select a preferred consultation date';
    }
    if (!formData.reasonForVisit) {
      errs.reasonForVisit = 'Please select your reason for visit';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-click submission
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Single unified source of truth: addAppointment handles ID generation,
      // deduplication, optimistic local state update, and direct Supabase insertion!
      const result = await addAppointment({
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        emailAddress: formData.emailAddress.trim(),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        patientType: formData.patientType,
        preferredLanguage: formData.preferredLanguage,
        reasonForVisit: formData.reasonForVisit,
        additionalMessage: formData.additionalMessage.trim(),
      });

      setSubmissionResult({
        syncedToSupabase: result.syncedToSupabase,
        message: result.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="appointment"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Book Consultation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context & Contact Quick Actions */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
                Private Consultations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
                Book Your Consultation
              </h2>
              <p className="text-base text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
                Take the initial step toward emotional balance. Fill in your preferred appointment details and our clinic desk will contact you to schedule an unhurried, private visit.
              </p>
            </div>

            {/* Quick Contact & Direct Action Cards */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1B1F23]/60">
                Prefer immediate contact?
              </p>

              {/* Call Now */}
              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                id="booking-quick-call"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#1B1F23]/10 hover:border-[#0f233a]/30 shadow-sm hover:shadow transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#4A6B5D] group-hover:bg-[#4A6B5D] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#1B1F23]/60 font-medium">Call Clinic Desk</span>
                    <p className="text-sm font-bold text-[#0f233a]">{clinicInfo.phone}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#4A6B5D] px-2.5 py-1 rounded bg-[#4A6B5D]/10">
                  Call Now
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${clinicInfo.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hello Sai Shradhdha Mind Care Clinic, I would like to inquire about booking an appointment with Dr. Renish Bhatt.')}`}
                target="_blank"
                rel="noopener noreferrer"
                id="booking-quick-whatsapp"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#1B1F23]/10 hover:border-emerald-600/30 shadow-sm hover:shadow transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#1B1F23]/60 font-medium">WhatsApp Assistance</span>
                    <p className="text-sm font-bold text-[#0f233a]">{clinicInfo.whatsapp}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-800 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                  WhatsApp
                </span>
              </a>

              {/* Get Directions */}
              <a
                href={clinicInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="booking-quick-directions"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#1B1F23]/10 hover:border-[#C5A880] shadow-sm hover:shadow transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-[#0f233a] transition-colors">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#1B1F23]/60 font-medium">Clinic Location</span>
                    <p className="text-sm font-bold text-[#0f233a]">Summair Club Road, Jamnagar</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#0f233a] px-2.5 py-1 rounded bg-[#C5A880]/20">
                  Get Directions
                </span>
              </a>
            </div>

            {/* Privacy reassurance note */}
            <div className="p-4 rounded-xl bg-[#EFE8DF]/60 border border-[#1B1F23]/10 text-xs text-[#1B1F23]/75 leading-relaxed">
              <p className="font-semibold text-[#0f233a] mb-0.5">Privacy Assurance</p>
              Your contact details and reasons for consultation are stored safely and accessible exclusively to authorized clinic staff to coordinate scheduling.
            </div>
          </div>

          {/* Right Column: Appointment Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#1B1F23]/10 shadow-lg text-left">
              {isSubmitted ? (
                <div
                  id="appointment-success-message"
                  className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f233a]">
                    Request Received
                  </h3>
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 text-sm text-[#1B1F23]/80 leading-relaxed font-light">
                    “Thank you. Your appointment request has been received. The clinic will contact you to confirm availability.”
                  </div>
                  
                  {/* Database sync status pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {submissionResult?.syncedToSupabase
                        ? 'Saved to Clinic Supabase Database'
                        : 'Saved to Clinic Records (Sync pending)'}
                    </span>
                  </div>

                  <p className="text-xs text-[#1B1F23]/60 max-w-sm mx-auto">
                    Please keep your phone accessible. If you require urgent assistance, please call our clinic desk directly at {clinicInfo.phone}.
                  </p>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          mobileNumber: '',
                          emailAddress: '',
                          preferredDate: '',
                          preferredTime: 'Morning (10:00 AM – 01:30 PM)',
                          patientType: 'New Patient',
                          preferredLanguage: 'English',
                          reasonForVisit: 'Psychiatric Consultation',
                          additionalMessage: '',
                        });
                      }}
                      className="px-6 py-2.5 rounded-xl border border-[#1B1F23]/20 hover:bg-[#FAF8F5] text-xs font-semibold text-[#0f233a] transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="border-b border-[#1B1F23]/10 pb-4">
                    <h3 className="font-serif text-xl font-bold text-[#0f233a]">
                      Consultation Request Form
                    </h3>
                    <p className="text-xs text-[#1B1F23]/60 mt-0.5">
                      Fields marked with <span className="text-red-500">*</span> are required for scheduling.
                    </p>
                  </div>

                  {/* Patient Type Radios */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B1F23]/70 mb-2">
                      Patient Status <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['New Patient', 'Existing Patient'] as const).map((type) => (
                        <label
                          key={type}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                            formData.patientType === type
                              ? 'border-[#0f233a] bg-[#0f233a] text-white shadow-sm'
                              : 'border-[#1B1F23]/15 bg-white text-[#1B1F23]/80 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="patientType"
                            value={type}
                            checked={formData.patientType === type}
                            onChange={() => setFormData(prev => ({ ...prev, patientType: type }))}
                            className="sr-only"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Full Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-fullName" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="form-fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, fullName: e.target.value }));
                            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                          }}
                          placeholder="e.g. Ramesh Patel"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 transition-all ${
                            errors.fullName
                              ? 'border-red-400 focus:ring-red-200'
                              : 'border-[#1B1F23]/15 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="form-mobileNumber" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="form-mobileNumber"
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, mobileNumber: e.target.value }));
                            if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: '' }));
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 transition-all ${
                            errors.mobileNumber
                              ? 'border-red-400 focus:ring-red-200'
                              : 'border-[#1B1F23]/15 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]'
                          }`}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.mobileNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Address & Preferred Language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-emailAddress" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                        Email Address <span className="text-[#1B1F23]/40 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="form-emailAddress"
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, emailAddress: e.target.value }));
                          if (errors.emailAddress) setErrors(prev => ({ ...prev, emailAddress: '' }));
                        }}
                        placeholder="name@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.emailAddress
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-[#1B1F23]/15 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]'
                        }`}
                      />
                      {errors.emailAddress && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.emailAddress}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="form-language" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                        Preferred Language <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="form-language"
                        value={formData.preferredLanguage}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value as any }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1B1F23]/15 text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Date & Preferred Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="form-preferredDate" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="form-preferredDate"
                        type="date"
                        required
                        min={getTomorrowDate()}
                        value={formData.preferredDate}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, preferredDate: e.target.value }));
                          if (errors.preferredDate) setErrors(prev => ({ ...prev, preferredDate: '' }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.preferredDate
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-[#1B1F23]/15 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]'
                        }`}
                      />
                      {errors.preferredDate && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.preferredDate}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="form-preferredTime" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                        Preferred Time Slot <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="form-preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#1B1F23]/15 text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]"
                      >
                        <option value="Morning (10:00 AM – 01:30 PM)">Morning: 10:00 AM – 01:30 PM</option>
                        <option value="Evening (05:30 PM – 08:30 PM)">Evening: 05:30 PM – 08:30 PM</option>
                        <option value="Flexible / Either Slot">Flexible / Any Available Slot</option>
                      </select>
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <label htmlFor="form-reason" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                      Reason for Visit <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="form-reason"
                      value={formData.reasonForVisit}
                      onChange={(e) => setFormData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1B1F23]/15 text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="General Psychiatric Evaluation">General Psychiatric Evaluation</option>
                      <option value="Follow-up Consultation">Follow-up Consultation</option>
                      <option value="Other Confidential Concern">Other Confidential Concern</option>
                    </select>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label htmlFor="form-additionalMessage" className="block text-xs font-semibold text-[#1B1F23] mb-1.5">
                      Additional Message or Notes <span className="text-[#1B1F23]/40 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="form-additionalMessage"
                      rows={3}
                      value={formData.additionalMessage}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalMessage: e.target.value }))}
                      placeholder="Share any specific timing preferences or questions you have before your visit..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1B1F23]/15 text-sm text-[#1B1F23] bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="submit-appointment-request-btn"
                      className="w-full bg-[#0f233a] hover:bg-[#172b4d] text-white text-base font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#C5A880]" />
                      <span>{isSubmitting ? 'Submitting Request...' : 'REQUEST APPOINTMENT'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#1B1F23]/60 text-center font-light">
                    Note: Appointment confirmation is subject to slot verification by clinic staff.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
