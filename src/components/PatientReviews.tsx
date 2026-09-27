import React from 'react';
import { Star, MessageSquareQuote, CheckCircle, ExternalLink } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const PatientReviews: React.FC = () => {
  const { reviews, setIsAllReviewsModalOpen } = useClinic();

  return (
    <section
      id="patient-reviews"
      className="py-20 lg:py-28 bg-[#FAF8F5] relative border-t border-[#1B1F23]/5"
      aria-label="Patient Testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A6B5D] font-bold">
            Patient Reflections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f233a] mt-2 tracking-tight">
            What Patients Say
          </h2>
          <p className="text-base sm:text-lg text-[#1B1F23]/75 font-light mt-3 leading-relaxed">
            Honest reflections shared by individuals and families who received care at Sai Shradhdha Mind Care Clinic.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-[#1B1F23]/10 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#C5A880] mb-4" aria-label="5 out of 5 stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#1B1F23]/80 font-light leading-relaxed mb-6 italic">
                  “{review.comment}”
                </p>
              </div>

              {/* Author & Date Details */}
              <div className="pt-4 border-t border-[#1B1F23]/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif text-sm font-bold text-[#0f233a]">
                      {review.author}
                    </h4>
                    <CheckCircle className="w-3 h-3 text-[#4A6B5D]" title="Verified Consultation" />
                  </div>
                  <p className="text-[11px] text-[#4A6B5D] font-medium">
                    {review.aspect}
                  </p>
                </div>
                <span className="text-[11px] text-[#1B1F23]/50">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsAllReviewsModalOpen(true)}
            id="view-all-reviews-btn"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#0f233a] border border-[#1B1F23]/15 text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <span>VIEW ALL REVIEWS</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#4A6B5D]" />
          </button>
          <p className="text-[11px] text-[#1B1F23]/60 mt-2 font-light">
            Patient privacy is paramount. Identifiers are abbreviated to protect personal medical confidentiality.
          </p>
        </div>
      </div>
    </section>
  );
};
