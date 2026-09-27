import React, { useState } from 'react';
import { X, Star, CheckCircle, Search, Filter } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AllReviewsModal: React.FC = () => {
  const { isAllReviewsModalOpen, setIsAllReviewsModalOpen, reviews } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAllReviewsModalOpen) return null;

  const filtered = reviews.filter(r => 
    r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.aspect.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-reviews-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#1B1F23]/10 overflow-hidden max-h-[90vh] flex flex-col text-left">
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#1B1F23]/10 flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#4A6B5D] font-semibold">
              Feedback &amp; Testimonials
            </span>
            <h3 id="all-reviews-title" className="font-serif text-2xl font-bold text-[#0f233a] mt-1">
              Patient Experiences
            </h3>
            <p className="text-xs text-[#1B1F23]/70 font-light mt-0.5">
              Verified clinical consultations at Sai Shradhdha Mind Care Clinic, Jamnagar.
            </p>
          </div>
          <button
            onClick={() => setIsAllReviewsModalOpen(false)}
            className="p-2 rounded-lg text-[#1B1F23]/50 hover:text-[#0f233a] hover:bg-[#1B1F23]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white border-b border-[#1B1F23]/10">
          <div className="relative">
            <Search className="w-4 h-4 text-[#1B1F23]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiences (e.g., anxiety, listening, atmosphere)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#1B1F23]/15 focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]/30"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {filtered.length === 0 ? (
            <p className="text-xs text-[#1B1F23]/60 text-center py-8">
              No matching reviews found.
            </p>
          ) : (
            filtered.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#C5A880]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#0f233a]">{rev.author}</span>
                    <CheckCircle className="w-3 h-3 text-[#4A6B5D]" />
                  </div>
                  <span className="text-[11px] text-[#1B1F23]/50">{rev.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1B1F23]/80 font-light italic leading-relaxed">
                  “{rev.comment}”
                </p>
                <p className="text-[11px] text-[#4A6B5D] font-medium">
                  {rev.aspect}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#1B1F23]/10 flex justify-end">
          <button
            onClick={() => setIsAllReviewsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#0f233a] text-white text-xs font-semibold hover:bg-[#4A6B5D] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
