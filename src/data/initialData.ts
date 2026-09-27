import { ClinicInfo, ClinicTiming, ServiceItem, PatientReview, FAQItem } from '../types';

export const initialClinicInfo: ClinicInfo = {
  clinicName: 'SAI SHRADHDHA MIND CARE CLINIC',
  doctorName: 'DR. RENISH BHATT',
  specialty: 'Psychiatrist',
  experience: '13+ Years of Healthcare Experience',
  degrees: ['MBBS', 'DPM – Psychiatry'],
  registration: 'Gujarat Medical Council: G 18979',
  languages: ['English', 'Hindi', 'Gujarati'],
  tagline: 'Your Mind Deserves Care, Understanding & Compassion.',
  address: {
    suite: '501',
    building: 'Om Complex',
    landmark: 'Opposite JCCC Hospital, Near Jolly Banglow',
    area: 'Summair Club Road',
    city: 'Jamnagar',
    state: 'Gujarat',
    country: 'India',
    pincode: '361005',
    fullFormatted: '501, Om Complex, Opposite JCCC Hospital, Near Jolly Banglow, Summair Club Road, Jamnagar, Gujarat, India.'
  },
  phone: '+91 94282 12345',
  whatsapp: '+919428212345',
  email: 'contact@saishradhdhamindcare.com',
  googleMapsUrl: 'https://maps.google.com/?q=Om+Complex+Summair+Club+Road+Jamnagar+Gujarat',
  announcement: {
    active: true,
    message: 'Clinic is open for in-person consultations. Prior appointment is recommended for dedicated time.',
    badgeText: 'Clinic Update'
  }
};

export const initialClinicTimings: ClinicTiming[] = [
  {
    day: 'Monday',
    isOpen: true,
    morningHours: '10:00 AM – 01:30 PM',
    eveningHours: '05:30 PM – 08:30 PM',
  },
  {
    day: 'Tuesday',
    isOpen: true,
    morningHours: '10:00 AM – 01:30 PM',
    eveningHours: '05:30 PM – 08:30 PM',
  },
  {
    day: 'Wednesday',
    isOpen: true,
    morningHours: '10:00 AM – 01:30 PM',
    eveningHours: '05:30 PM – 08:30 PM',
  },
  {
    day: 'Thursday',
    isOpen: true,
    morningHours: '10:00 AM – 01:30 PM',
    eveningHours: '05:30 PM – 08:30 PM',
  },
  {
    day: 'Friday',
    isOpen: true,
    morningHours: '10:00 AM – 01:30 PM',
    eveningHours: '05:30 PM – 08:30 PM',
  },
  {
    day: 'Saturday',
    isOpen: true,
    morningHours: '10:00 AM – 01:30 PM',
    eveningHours: '05:30 PM – 08:30 PM',
  },
  {
    day: 'Sunday',
    isOpen: false,
    morningHours: 'Closed',
    eveningHours: 'Closed',
    note: 'Emergency or prior appointment only'
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'psychiatric-consultation',
    title: 'Psychiatric Consultation',
    shortDescription: 'Professional assessment and personalised treatment planning.',
    detailedOverview: 'A comprehensive medical and psychiatric clinical evaluation focusing on your emotional, biological, and situational symptoms. Treatment plans are customized with compassionate understanding.',
    indications: [
      'Comprehensive clinical mental health evaluation',
      'Personalised pharmacological or psychological guidance',
      'Follow-up monitoring and medication management if indicated'
    ],
    clinicalApproach: 'Evidence-based psychiatric care balancing medical diagnosis with empathetic listening in a calm, non-judgmental environment.',
    iconName: 'Stethoscope'
  },
  {
    id: 'counselling-emotional-support',
    title: 'Counselling & Emotional Support',
    shortDescription: 'A confidential and respectful environment to discuss emotional and psychological concerns.',
    detailedOverview: 'One-on-one professional guidance designed to help you process grief, difficult life transitions, low mood, and overwhelming feelings in complete safety.',
    indications: [
      'Persistent sadness, loss of enthusiasm, or low motivation',
      'Coping with sudden life transitions or emotional distress',
      'Building resilience and healthy emotional boundaries'
    ],
    clinicalApproach: 'Confidential conversations structured to help you gain clarity, navigate challenges, and regain emotional balance.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'anxiety-stress-management',
    title: 'Anxiety & Stress Management',
    shortDescription: 'Professional support for managing anxiety, stress and related concerns.',
    detailedOverview: 'Targeted support for persistent worry, panic sensations, social tension, somatic stress reactions, and work or academic burnout.',
    indications: [
      'Excessive worry, racing thoughts, or feeling constantly on edge',
      'Physical sensations such as palpitations, restlessness, or tightness',
      'Performance and social anxiety difficulties'
    ],
    clinicalApproach: 'Holistic clinical interventions combining medical insight, cognitive techniques, and relaxation methods.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'sleep-mental-wellness',
    title: 'Sleep & Mental Wellness',
    shortDescription: 'Assessment and support for sleep-related concerns associated with mental wellbeing.',
    detailedOverview: 'Addressing chronic insomnia, disrupted sleep patterns, restless nights, and the strong interconnected link between sleep architecture and mental health.',
    indications: [
      'Difficulty falling asleep or frequent night awakenings',
      'Daytime fatigue, poor concentration, and low morning energy',
      'Circadian rhythm disturbances linked to stress or mood changes'
    ],
    clinicalApproach: 'Sleep hygiene psychoeducation, medical evaluation of underlying triggers, and sustainable management protocols.',
    iconName: 'Moon'
  },
  {
    id: 'addiction-deaddiction-support',
    title: 'Addiction & De-Addiction Support',
    shortDescription: 'Professional support for individuals dealing with substance or dependency-related concerns.',
    detailedOverview: 'Respectful, confidential clinical assessment and guidance for individuals and families dealing with chemical or behavioral dependency.',
    indications: [
      'Alcohol and tobacco dependency management',
      'Prescription or recreational substance misuse evaluation',
      'Relapse prevention planning and family psycho-education'
    ],
    clinicalApproach: 'Dignified, stigma-free medical assistance designed around safety, physiological stabilization, and ongoing emotional support.',
    iconName: 'Sparkles'
  },
  {
    id: 'ocd-related-concerns',
    title: 'OCD & Related Concerns',
    shortDescription: 'Assessment and professional treatment support for obsessive-compulsive symptoms.',
    detailedOverview: 'Structured diagnostic assessment and management for distressing intrusive thoughts, repetitive behavioral rituals, and related spectrum concerns.',
    indications: [
      'Persistent, repetitive intrusive thoughts causing distress',
      'Compulsive behaviors (checking, washing, counting, ordering)',
      'Intense discomfort when routines or environments feel incomplete'
    ],
    clinicalApproach: 'Specialized clinical care utilizing evidence-backed psychiatric management and gradual desensitization strategies.',
    iconName: 'Compass'
  },
  {
    id: 'personal-relationship-concerns',
    title: 'Personal & Relationship Concerns',
    shortDescription: 'A private and respectful environment for discussing sensitive personal concerns.',
    detailedOverview: 'A supportive therapeutic setting to address communication strain, family stress, emotional disconnect, and interpersonal conflict.',
    indications: [
      'Marital and interpersonal misunderstandings',
      'Intergenerational family tension and communication friction',
      'Self-esteem and identity-related dilemmas'
    ],
    clinicalApproach: 'Neutral, objective, and empathetic facilitation to help individuals and partners understand perspective and rebuild trust.',
    iconName: 'Users'
  },
  {
    id: 'hypnotherapy',
    title: 'Hypnotherapy',
    shortDescription: 'Include this service only if officially offered by the clinic.',
    detailedOverview: 'An adjunct therapeutic modality offered with proper medical supervision to facilitate deep mental relaxation, habit modification, and focused subconscious exploration.',
    indications: [
      'Facilitating deep relaxation and stress mitigation',
      'Complementary support for habit cessation and stress-related tension',
      'Mindfulness-based therapeutic conditioning'
    ],
    clinicalApproach: 'Conducting guided relaxation states strictly within professional medical boundaries and patient readiness.',
    iconName: 'Flower2',
    isHypnotherapy: true
  }
];

export const initialReviews: PatientReview[] = [
  {
    id: 'rev-1',
    author: 'R. K. P.',
    rating: 5,
    date: 'February 2026',
    comment: 'Dr. Renish Bhatt is remarkably patient. He listened to all my concerns without any hurry, which made me feel completely comfortable. The clinic environment in Jamnagar is very calm and confidential.',
    aspect: 'Attentive Listening & Calm Atmosphere'
  },
  {
    id: 'rev-2',
    author: 'M. S. Joshi',
    rating: 5,
    date: 'January 2026',
    comment: 'I was dealing with acute anxiety and sleep troubles for months. Dr. Bhatt explained the condition with utmost clarity in Gujarati, avoiding unnecessary medical jargon. His guidance brought true peace of mind.',
    aspect: 'Clear Explanation & Care'
  },
  {
    id: 'rev-3',
    author: 'D. V. Jadeja',
    rating: 5,
    date: 'December 2025',
    comment: 'Very professional and respectful experience. There was no judgment whatsoever. Privacy is strictly maintained from the reception to the consultation room.',
    aspect: 'Strict Confidentiality'
  },
  {
    id: 'rev-4',
    author: 'A. H. Trivedi',
    rating: 5,
    date: 'November 2025',
    comment: 'Sai Shradhdha clinic is clean, serene, and well organized. The consultation was thorough and personalized. It is reassuring to have such a dedicated psychiatrist in Jamnagar.',
    aspect: 'Professional Guidance'
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What does a psychiatrist do?',
    answer: 'A psychiatrist is a qualified medical doctor (MBBS followed by specialized postgraduate training such as DPM or MD in Psychiatry) specializing in mental health. Psychiatrists assess, diagnose, and treat mental, emotional, and behavioral conditions. Because they are medical doctors, they can evaluate both the psychological and biological aspects of mental wellness and recommend personalized treatment plans, which may include lifestyle guidance, counselling, or medication when medically appropriate.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'When should I consult a psychiatrist?',
    answer: 'You may benefit from consulting a psychiatrist when emotional, psychological, or behavioral challenges begin interfering with your daily routine, sleep, relationships, or work. Common situations include persistent sadness or mood fluctuations, overwhelming worry or panic sensations, chronic insomnia, unexplained physical tension, substance dependency, or distressing intrusive thoughts. Seeking timely professional support is an active, positive step toward mental wellness.',
    category: 'Consultation'
  },
  {
    id: 'faq-3',
    question: 'Is my consultation confidential?',
    answer: 'Yes. At Sai Shradhdha Mind Care Clinic, patient confidentiality and dignity are treated with the highest professional seriousness. All discussions, medical history, clinical assessments, and records are kept strictly private in accordance with established medical ethics and standards. Information is never shared with third parties without your informed consent, except in rare situations mandated by law involving imminent risk of harm.',
    category: 'Consultation'
  },
  {
    id: 'faq-4',
    question: 'Do I need an appointment?',
    answer: 'Yes, we strongly recommend booking an appointment prior to your visit. Scheduling ahead ensures that you receive dedicated, unhurried time with Dr. Renish Bhatt and minimizes waiting room delays. You can request an appointment directly through this website, call the clinic at +91 94282 12345, or reach out via WhatsApp.',
    category: 'Clinic & Location'
  },
  {
    id: 'faq-5',
    question: 'What languages are available?',
    answer: 'Dr. Renish Bhatt consults fluently in English, Hindi, and Gujarati (ગુજરાતી). You are welcome to express your thoughts and feelings in whichever language you feel most at ease with.',
    category: 'Consultation'
  },
  {
    id: 'faq-6',
    question: 'Where is the clinic located?',
    answer: 'Sai Shradhdha Mind Care Clinic is conveniently located at 501, Om Complex, Opposite JCCC Hospital, Near Jolly Banglow, Summair Club Road, Jamnagar, Gujarat, India. The location is easily accessible by road with parking availability in the vicinity.',
    category: 'Clinic & Location'
  }
];
