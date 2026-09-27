export interface ClinicTiming {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  morningHours: string;
  eveningHours: string;
  note?: string;
}

export interface ClinicInfo {
  clinicName: string;
  doctorName: string;
  specialty: string;
  experience: string;
  degrees: string[];
  registration: string;
  languages: string[];
  tagline: string;
  address: {
    suite: string;
    building: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    fullFormatted: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  announcement?: {
    active: boolean;
    message: string;
    badgeText?: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  detailedOverview: string;
  indications: string[];
  clinicalApproach: string;
  iconName: string;
  isHypnotherapy?: boolean;
}

export interface AppointmentRequest {
  id: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  preferredDate: string;
  preferredTime: string;
  patientType: 'New Patient' | 'Existing Patient';
  preferredLanguage: 'English' | 'Hindi' | 'Gujarati';
  reasonForVisit: string;
  additionalMessage?: string;
  submittedAt: string;
  status: 'Pending Review' | 'Contacted / Scheduled' | 'Completed' | 'Cancelled';
  staffNotes?: string;
}

export interface PatientReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  aspect: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Consultation' | 'Clinic & Location';
}
