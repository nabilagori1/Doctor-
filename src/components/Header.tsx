import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Lock, Phone, MapPin, ChevronRight, Shield } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Header: React.FC = () => {
  const { clinicInfo, setIsStaffModalOpen, setIsAdminView } = useClinic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About Doctor', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Why Choose Us', href: '#why-choose-us' },
    { label: 'Appointment', href: '#appointment' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Clinic Notice Banner if active */}
      {clinicInfo.announcement?.active && (
        <div id="clinic-top-announcement" className="bg-[#0f233a] text-[#FAF8F5] text-xs md:text-sm py-2 px-4 border-b border-[#C5A880]/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#4A6B5D] text-white uppercase tracking-wider">
                {clinicInfo.announcement.badgeText || 'Notice'}
              </span>
              <p className="truncate text-[#FAF8F5]/90 font-light">
                {clinicInfo.announcement.message}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-xs text-[#FAF8F5]/80">
              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                className="hover:text-[#C5A880] transition-colors flex items-center gap-1"
                aria-label="Call Clinic"
              >
                <Phone className="w-3 h-3" />
                <span className="hidden md:inline">{clinicInfo.phone}</span>
              </a>
              <button
                onClick={() => setIsAdminView(true)}
                className="text-[#FAF8F5]/80 hover:text-white flex items-center gap-1.5 transition-colors text-[11px] px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20"
                title="Clinic Owner & Staff Admin Portal"
              >
                <Lock className="w-3 h-3 text-[#C5A880]" />
                <span className="font-semibold">Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        id="main-navigation-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#1B1F23]/5 py-2.5'
            : 'bg-[#FAF8F5] border-b border-[#1B1F23]/10 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left side Brand */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="flex flex-col group text-left"
              id="header-brand-logo"
            >
              <span className="font-serif tracking-tight font-bold text-base sm:text-lg md:text-xl text-[#0f233a] group-hover:text-[#4A6B5D] transition-colors">
                SAI SHRADHDHA
              </span>
              <span className="font-serif tracking-widest text-[10px] sm:text-xs text-[#4A6B5D] font-medium uppercase -mt-0.5">
                MIND CARE CLINIC
              </span>
              <span className="text-[11px] sm:text-xs text-[#1B1F23]/70 font-sans mt-0.5 flex items-center gap-1">
                <span>Dr. Renish Bhatt</span>
                <span className="text-[#C5A880]">•</span>
                <span>Psychiatrist</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-[#1B1F23]/80 hover:text-[#0f233a] hover:border-b-2 hover:border-[#4A6B5D] pb-1 transition-all"
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right side CTAs */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setIsAdminView(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f233a] hover:text-[#4A6B5D] px-3.5 py-2 rounded-full border border-[#0f233a]/20 hover:border-[#0f233a]/40 bg-white/60 transition-all cursor-pointer"
                title="Owner & Staff Admin Panel"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Admin Panel</span>
              </button>

              <a
                href="#appointment"
                onClick={(e) => handleNavClick(e, '#appointment')}
                id="header-book-appointment-btn"
                className="inline-flex items-center gap-2 bg-[#0f233a] hover:bg-[#4A6B5D] text-[#FAF8F5] text-xs md:text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>BOOK APPOINTMENT</span>
              </a>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="#appointment"
                onClick={(e) => handleNavClick(e, '#appointment')}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-full bg-[#0f233a] text-white"
                aria-label="Book Appointment"
              >
                <Calendar className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                id="mobile-hamburger-btn"
                className="p-2 rounded-lg text-[#0f233a] hover:bg-[#1B1F23]/5 focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]"
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden fixed inset-x-0 top-[calc(100%+1px)] bg-[#FAF8F5] border-b border-[#1B1F23]/10 shadow-xl px-6 py-6 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#1B1F23]/10">
                <p className="text-xs uppercase tracking-widest text-[#4A6B5D] font-semibold">
                  Sai Shradhdha Mind Care Clinic
                </p>
                <p className="text-sm font-medium text-[#0f233a]">
                  Dr. Renish Bhatt • Consultant Psychiatrist
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="flex items-center justify-between text-base font-medium text-[#1B1F23] hover:text-[#4A6B5D] py-1 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#1B1F23]/30" />
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-[#1B1F23]/10 flex flex-col gap-3">
                <a
                  href="#appointment"
                  onClick={(e) => handleNavClick(e, '#appointment')}
                  className="w-full text-center bg-[#0f233a] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>BOOK APPOINTMENT</span>
                </a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAdminView(true);
                  }}
                  className="w-full text-center border border-[#0f233a]/20 bg-white py-2.5 rounded-xl font-semibold text-xs text-[#0f233a] flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>OWNER / ADMIN PORTAL</span>
                </button>
                <div className="flex items-center justify-between text-xs text-[#1B1F23]/70 pt-1">
                  <a
                    href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 hover:text-[#0f233a]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#4A6B5D]" />
                    <span>{clinicInfo.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
