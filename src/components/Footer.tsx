import React from 'react';
import { MapPin, Phone, Mail, Clock, Shield, Lock } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Footer: React.FC = () => {
  const { clinicInfo, setActiveLegalModal, setIsStaffModalOpen, setIsAdminView } = useClinic();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#0c1b2f] text-white pt-16 pb-24 md:pb-16 border-t border-white/10"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10 text-left">
          {/* Brand & Clinic Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                SAI SHRADHDHA
              </span>
              <span className="font-serif text-sm tracking-widest text-[#C5A880] uppercase block">
                MIND CARE CLINIC
              </span>
            </div>

            <div className="pt-1">
              <p className="font-serif text-base font-semibold text-white">
                Dr. Renish Bhatt
              </p>
              <p className="text-xs text-[#C5A880] font-sans">
                Psychiatrist • MBBS, DPM (Psychiatry)
              </p>
              <p className="text-[11px] text-white/50 font-sans">
                Gujarat Medical Council: G 18979
              </p>
            </div>

            <p className="text-xs text-white/70 font-light max-w-sm leading-relaxed pt-1">
              “{clinicInfo.tagline}” Professional, confidential, and compassionate mental-health care in Jamnagar, Gujarat.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-white/60">
              <Shield className="w-3.5 h-3.5 text-[#4A6B5D]" />
              <span>Full Medical Discretion &amp; Confidentiality</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C5A880]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/80 font-light">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => handleNavClick(e, '#hero')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, '#about')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  About Doctor
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleNavClick(e, '#services')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#why-choose-us"
                  onClick={(e) => handleNavClick(e, '#why-choose-us')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Why Choose Us
                </a>
              </li>
              <li>
                <a
                  href="#appointment"
                  onClick={(e) => handleNavClick(e, '#appointment')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Appointment
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  onClick={(e) => handleNavClick(e, '#faqs')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C5A880]">
              Clinic Details
            </h4>
            <div className="space-y-2.5 text-xs text-white/80 font-light leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>
                  501, Om Complex, Opposite JCCC Hospital, Near Jolly Banglow, Summair Club Road, Jamnagar, Gujarat, India.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4A6B5D] shrink-0" />
                <a href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {clinicInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4A6B5D] shrink-0" />
                <a href={`mailto:${clinicInfo.email}`} className="hover:text-white">
                  {clinicInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p>Mon – Sat: 10:00 AM – 01:30 PM &amp; 05:30 PM – 08:30 PM</p>
                  <p className="text-white/50 text-[11px]">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="hover:text-[#C5A880] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="hover:text-[#C5A880] transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => setActiveLegalModal('disclaimer')}
              className="hover:text-[#C5A880] transition-colors"
            >
              Medical Disclaimer
            </button>
            <button
              onClick={() => setIsAdminView(true)}
              className="hover:text-white flex items-center gap-1.5 text-[11px] text-white/50 hover:text-[#C5A880] transition-colors"
              title="Clinic Owner & Staff Admin Portal"
            >
              <Lock className="w-3 h-3 text-[#C5A880]" />
              <span>Owner Admin Portal</span>
            </button>
          </div>

          <p className="font-light">
            © 2026 Sai Shradhdha Mind Care Clinic. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
