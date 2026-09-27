import React from 'react';
import { Award, GraduationCap, Stethoscope, Languages } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const CredentialsBar: React.FC = () => {
  const { clinicInfo } = useClinic();

  const credentials = [
    {
      icon: Award,
      title: '13+ Years',
      subtitle: 'Healthcare Experience',
      badge: 'Experienced Practice',
      color: 'text-[#4A6B5D]'
    },
    {
      icon: GraduationCap,
      title: 'MBBS',
      subtitle: 'Primary Medical Qualification',
      badge: 'Medical Council Registered',
      color: 'text-[#0f233a]'
    },
    {
      icon: Stethoscope,
      title: 'DPM – Psychiatry',
      subtitle: 'Diploma in Psychological Medicine',
      badge: 'Specialized Training',
      color: 'text-[#4A6B5D]'
    },
    {
      icon: Languages,
      title: 'Languages',
      subtitle: clinicInfo.languages.join(' • '),
      badge: 'Multilingual Consultations',
      color: 'text-[#C5A880]'
    }
  ];

  return (
    <section
      id="credentials-strip"
      className="relative z-20 -mt-4 sm:-mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Doctor Qualifications and Experience"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-[#1B1F23]/10 p-5 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#1B1F23]/10">
          {credentials.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''} group`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0f233a] group-hover:text-[#FAF8F5] transition-all duration-300">
                  <IconComponent className={`w-6 h-6 ${item.color} group-hover:text-[#C5A880] transition-colors`} />
                </div>
                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0f233a]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#1B1F23]/75 leading-tight">
                    {item.subtitle}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-[#4A6B5D] font-semibold pt-0.5">
                    {item.badge}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
