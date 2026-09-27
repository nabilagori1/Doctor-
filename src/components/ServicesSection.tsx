import React from 'react';
import { 
  Stethoscope, 
  HeartHandshake, 
  ShieldCheck, 
  Moon, 
  Sparkles, 
  Compass, 
  Users, 
  Flower2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ServiceItem } from '../types';

export const ServicesSection: React.FC = () => {
  const { services, setSelectedServiceModal } = useClinic();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-[#0f233a]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-[#4A6B5D]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#4A6B5D]" />;
      case 'Moon':
        return <Moon className="w-6 h-6 text-[#0f233a]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#C5A880]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#0f233a]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#4A6B5D]" />;
      case 'Flower2':
        return <Flower2 className="w-6 h-6 text-[#C5A880]" />;
      default:
        return <Stethoscope className="w-6 h-6 text-[#0f233a]" />;
    }
  };

  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Clinical Services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            Clinical Scope &amp; Specialisations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            How We Can Help
          </h2>
          <p className="text-base sm:text-lg text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
            Professional support for mental health, emotional wellbeing and psychiatric concerns.
          </p>
        </div>

        {/* Services Grid (8 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service: ServiceItem) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group relative bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Icon & Special Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center group-hover:bg-[#0f233a]/5 transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  {service.isHypnotherapy && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#8c6b3f]">
                      Specialised Modality
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <h3 className="font-serif text-xl font-bold text-[#0f233a] group-hover:text-[#4A6B5D] transition-colors mb-2 leading-snug">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-[#1B1F23]/75 font-light leading-relaxed mb-6">
                  {service.shortDescription}
                </p>
              </div>

              {/* Learn More Action Button */}
              <div className="pt-3 border-t border-[#1B1F23]/5">
                <button
                  onClick={() => setSelectedServiceModal(service)}
                  id={`learn-more-${service.id}`}
                  className="w-full inline-flex items-center justify-between text-xs font-semibold text-[#0f233a] group-hover:text-[#4A6B5D] transition-colors py-1"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Medical Note */}
        <div className="mt-12 max-w-3xl mx-auto p-4 rounded-xl bg-[#EFE8DF]/60 border border-[#1B1F23]/10 flex items-start gap-3 text-left">
          <Info className="w-5 h-5 text-[#4A6B5D] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1B1F23]/75 leading-relaxed">
            <strong className="text-[#0f233a] font-semibold">Ethical Clinical Care:</strong> Every individual experiences mental health differently. At Sai Shradhdha Mind Care Clinic, we do not make exaggerated claims or guarantee unconditional outcomes. All consultations focus on thorough psychiatric evaluation, safe medical standards, and evidence-informed support.
          </p>
        </div>
      </div>
    </section>
  );
};
