import React from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CredentialsBar } from './components/CredentialsBar';
import { AboutDoctor } from './components/AboutDoctor';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PatientJourney } from './components/PatientJourney';
import { ConfidentialitySection } from './components/ConfidentialitySection';
import { AppointmentBooking } from './components/AppointmentBooking';
import { ClinicInfoAndMap } from './components/ClinicInfoAndMap';
import { PatientReviews } from './components/PatientReviews';
import { FAQSection } from './components/FAQSection';
import { EmergencyNotice } from './components/EmergencyNotice';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AllReviewsModal } from './components/AllReviewsModal';
import { LegalModals } from './components/LegalModals';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminPanel } from './components/AdminPanel';

function ClinicAppContent() {
  const { isAdminView } = useClinic();

  if (isAdminView) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1B1F23]">
      {/* Sticky Header Navigation */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Section 2: Hero */}
        <Hero />

        {/* Section 3: Credentials & Experience Strip */}
        <CredentialsBar />

        {/* Section 4: About Dr. Renish Bhatt */}
        <AboutDoctor />

        {/* Section 5: Services Section */}
        <ServicesSection />

        {/* Section 6: Why Choose Us */}
        <WhyChooseUs />

        {/* Section 7: Patient Journey 4-Step Timeline */}
        <PatientJourney />

        {/* Section 8: Confidentiality Section (Navy) */}
        <ConfidentialitySection />

        {/* Section 9: Appointment Booking */}
        <AppointmentBooking />

        {/* Sections 10, 11, 12: Clinic Information, Google Map, Timings */}
        <ClinicInfoAndMap />

        {/* Section 13: Patient Reviews */}
        <PatientReviews />

        {/* Section 14: FAQ Section */}
        <FAQSection />

        {/* Section 15: Emergency Notice */}
        <EmergencyNotice />

        {/* Section 16: Contact Section */}
        <ContactSection />
      </main>

      {/* Section 17: Dark Footer */}
      <Footer />

      {/* Section 18: Mobile Sticky Action Bar */}
      <MobileStickyBar />

      {/* Modals & Dialogs */}
      <ServiceDetailModal />
      <DoctorDetailModal />
      <AllReviewsModal />
      <LegalModals />
      <AdminDashboardModal />
    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <ClinicAppContent />
    </ClinicProvider>
  );
}
