import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  ClinicInfo, 
  ClinicTiming, 
  ServiceItem, 
  PatientReview, 
  FAQItem, 
  AppointmentRequest 
} from '../types';
import { 
  initialClinicInfo, 
  initialClinicTimings, 
  initialServices, 
  initialReviews, 
  initialFAQs 
} from '../data/initialData';
import {
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_TABLE_SQL,
  checkSupabaseStatus,
  insertAppointmentToSupabase,
  fetchAppointmentsFromSupabase,
  updateAppointmentInSupabase,
  deleteAppointmentFromSupabase,
  deduplicateAppointmentsList,
  getAppointmentDedupKey,
} from '../lib/supabase';

export interface SupabaseSyncStatus {
  connected: boolean;
  tableExists: boolean;
  message: string;
  checking: boolean;
  lastSyncedAt?: string;
}

interface ClinicContextType {
  clinicInfo: ClinicInfo;
  timings: ClinicTiming[];
  services: ServiceItem[];
  reviews: PatientReview[];
  faqs: FAQItem[];
  appointments: AppointmentRequest[];
  updateClinicInfo: (updated: Partial<ClinicInfo>) => void;
  updateDayTiming: (day: string, updatedTiming: Partial<ClinicTiming>) => void;
  addAppointment: (
    request: Omit<AppointmentRequest, 'id' | 'submittedAt' | 'status'>
  ) => Promise<{ success: boolean; syncedToSupabase: boolean; message?: string }>;
  updateAppointmentStatus: (
    id: string, 
    status: AppointmentRequest['status'], 
    staffNotes?: string
  ) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  isStaffAuthenticated: boolean;
  adminUser: string;
  loginStaff: (pin: string) => boolean;
  loginAdmin: (id: string, pass: string) => boolean;
  logoutStaff: () => void;
  isAdminView: boolean;
  setIsAdminView: (view: boolean) => void;
  
  // Supabase Integration & Health
  supabaseStatus: SupabaseSyncStatus;
  refreshAppointmentsFromSupabase: () => Promise<void>;
  checkSupabaseConnection: () => Promise<void>;
  cleanDuplicateAppointments: () => Promise<{ removedCount: number }>;
  supabaseProjectId: string;
  supabaseSqlScript: string;
  isSavingAppointment: boolean;

  // UI Modal controllers
  selectedServiceModal: ServiceItem | null;
  setSelectedServiceModal: (service: ServiceItem | null) => void;
  activeLegalModal: 'privacy' | 'terms' | 'disclaimer' | null;
  setActiveLegalModal: (modal: 'privacy' | 'terms' | 'disclaimer' | null) => void;
  isAboutDetailOpen: boolean;
  setIsAboutDetailOpen: (open: boolean) => void;
  isStaffModalOpen: boolean;
  setIsStaffModalOpen: (open: boolean) => void;
  isAllReviewsModalOpen: boolean;
  setIsAllReviewsModalOpen: (open: boolean) => void;
  resetToDefaults: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INFO: 'saishradhdha_clinic_info_v1',
  TIMINGS: 'saishradhdha_timings_v1',
  APPOINTMENTS: 'saishradhdha_appointments_v1',
  AUTH: 'saishradhdha_staff_auth_v1',
};

const SAMPLE_APPOINTMENTS: AppointmentRequest[] = [
  {
    id: 'apt-101',
    fullName: 'Haresh Solanki',
    mobileNumber: '+91 98251 44521',
    emailAddress: 'h.solanki@example.com',
    preferredDate: '2026-09-18',
    preferredTime: '11:30 AM',
    patientType: 'New Patient',
    preferredLanguage: 'Gujarati',
    reasonForVisit: 'Anxiety & Stress Management',
    additionalMessage: 'Consultation requested for work-related tension and sleep difficulty.',
    submittedAt: '2026-09-14 11:20 AM',
    status: 'Pending Review',
    staffNotes: 'Contacted patient via phone. Morning slot preferred.'
  },
  {
    id: 'apt-102',
    fullName: 'Pooja Bhatt',
    mobileNumber: '+91 97241 88312',
    emailAddress: 'pooja.b@example.com',
    preferredDate: '2026-09-17',
    preferredTime: '06:00 PM',
    patientType: 'Existing Patient',
    preferredLanguage: 'Hindi',
    reasonForVisit: 'Psychiatric Consultation',
    additionalMessage: 'Follow-up consultation after 4 weeks of initial guidance.',
    submittedAt: '2026-09-13 04:45 PM',
    status: 'Contacted / Scheduled',
    staffNotes: 'Scheduled for 6:00 PM Thursday.'
  }
];

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      return saved ? JSON.parse(saved) : initialClinicInfo;
    } catch {
      return initialClinicInfo;
    }
  });

  const [timings, setTimings] = useState<ClinicTiming[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMINGS);
      return saved ? JSON.parse(saved) : initialClinicTimings;
    } catch {
      return initialClinicTimings;
    }
  });

  const [appointments, setAppointments] = useState<AppointmentRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const parsed = saved ? JSON.parse(saved) : SAMPLE_APPOINTMENTS;
      const { unique } = deduplicateAppointmentsList(parsed);
      return unique;
    } catch {
      const { unique } = deduplicateAppointmentsList(SAMPLE_APPOINTMENTS);
      return unique;
    }
  });

  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<string>(() => {
    try {
      return localStorage.getItem('saishradhdha_admin_user') || 'Owner (admin)';
    } catch {
      return 'Owner (admin)';
    }
  });

  const [isAdminView, setIsAdminViewState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.search.includes('view=admin');
    }
    return false;
  });

  const setIsAdminView = useCallback((val: boolean) => {
    setIsAdminViewState(val);
    if (typeof window !== 'undefined') {
      if (val) {
        if (window.location.hash !== '#admin') {
          window.location.hash = '#admin';
        }
      } else {
        if (window.location.hash === '#admin') {
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    }
  }, []);

  // Listen to hash changes (e.g. user navigates to #admin or clicks back)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminViewState(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus>({
    connected: false,
    tableExists: false,
    message: 'Initializing Supabase connection...',
    checking: true,
  });
  const [isSavingAppointment, setIsSavingAppointment] = useState(false);

  // Services, Reviews, FAQs
  const [services] = useState<ServiceItem[]>(initialServices);
  const [reviews] = useState<PatientReview[]>(initialReviews);
  const [faqs] = useState<FAQItem[]>(initialFAQs);

  // Modals
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [isAboutDetailOpen, setIsAboutDetailOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);

  // Check Supabase connection and table
  const checkSupabaseConnection = useCallback(async () => {
    setSupabaseStatus(prev => ({ ...prev, checking: true }));
    const result = await checkSupabaseStatus();
    setSupabaseStatus({
      ...result,
      checking: false,
      lastSyncedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    });
    return result;
  }, []);

  // Refresh appointments from Supabase with automatic deduplication
  const refreshAppointmentsFromSupabase = useCallback(async () => {
    const statusResult = await checkSupabaseStatus();
    setSupabaseStatus({
      ...statusResult,
      checking: false,
      lastSyncedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    });

    if (statusResult.tableExists) {
      const fetchResult = await fetchAppointmentsFromSupabase();
      if (fetchResult.success && fetchResult.data) {
        // Run deduplication on the fetched Supabase items
        const { unique: dedupedSupabase, removedIds } = deduplicateAppointmentsList(fetchResult.data);

        // If duplicate rows existed in Supabase, purge redundant IDs in background
        if (removedIds.length > 0) {
          console.info(`[Auto-Clean] Purging ${removedIds.length} duplicate entries from Supabase:`, removedIds);
          for (const dupId of removedIds) {
            deleteAppointmentFromSupabase(dupId).catch(() => {});
          }
        }

        setAppointments(prev => {
          // Merge Supabase items with any local items, then deduplicate the combined list
          const combined = [...dedupedSupabase, ...prev];
          const { unique } = deduplicateAppointmentsList(combined);
          return unique;
        });
      }
    }
  }, []);

  // Initial mount: verify Supabase & fetch appointments
  useEffect(() => {
    refreshAppointmentsFromSupabase();

    // Set up Realtime listener if supported
    try {
      const channel = supabase
        .channel('realtime_appointments')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'appointments' },
          () => {
            fetchAppointmentsFromSupabase().then(res => {
              if (res.success && res.data) {
                const { unique: dedupedSupabase, removedIds } = deduplicateAppointmentsList(res.data);
                if (removedIds.length > 0) {
                  for (const dupId of removedIds) {
                    deleteAppointmentFromSupabase(dupId).catch(() => {});
                  }
                }
                setAppointments(prev => {
                  const combined = [...dedupedSupabase, ...prev];
                  const { unique } = deduplicateAppointmentsList(combined);
                  return unique;
                });
              }
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Supabase Realtime subscription note:', err);
    }
  }, [refreshAppointmentsFromSupabase]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(clinicInfo));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [clinicInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMINGS, JSON.stringify(timings));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [timings]);

  useEffect(() => {
    try {
      // Ensure only unique items are persisted to local storage
      const { unique } = deduplicateAppointmentsList(appointments);
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(unique));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [appointments]);

  const updateClinicInfo = (updated: Partial<ClinicInfo>) => {
    setClinicInfo(prev => ({ ...prev, ...updated }));
  };

  const updateDayTiming = (day: string, updatedTiming: Partial<ClinicTiming>) => {
    setTimings(prev =>
      prev.map(t => (t.day === day ? { ...t, ...updatedTiming } : t))
    );
  };

  // Add appointment with SINGLE-SOURCE-OF-TRUTH persistence & deduplication
  const addAppointment = async (
    request: Omit<AppointmentRequest, 'id' | 'submittedAt' | 'status'>
  ): Promise<{ success: boolean; syncedToSupabase: boolean; message?: string }> => {
    setIsSavingAppointment(true);

    const generatedId = `apt-${Date.now().toString().slice(-6)}`;
    const submittedAt = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const newAppointment: AppointmentRequest = {
      ...request,
      id: generatedId,
      submittedAt,
      status: 'Pending Review',
    };

    // Pre-check duplicate in existing appointments:
    const newKey = getAppointmentDedupKey(newAppointment);
    const isDuplicate = appointments.some(a => getAppointmentDedupKey(a) === newKey);
    if (isDuplicate) {
      console.warn('[addAppointment] Duplicate appointment skipped:', newKey);
      setIsSavingAppointment(false);
      return {
        success: true,
        syncedToSupabase: true,
        message: 'This appointment request is already registered in clinic records.',
      };
    }

    // Optimistically update local appointments with deduplication
    setAppointments(prev => {
      const { unique } = deduplicateAppointmentsList([newAppointment, ...prev]);
      return unique;
    });

    // Save directly to Supabase EXACTLY ONCE
    let syncedToSupabase = false;
    let message = 'Appointment saved to clinic records.';

    try {
      const result = await insertAppointmentToSupabase(newAppointment);
      if (result.success) {
        syncedToSupabase = true;
        message = 'Appointment saved successfully to Supabase database.';
      } else {
        console.warn('Supabase save notice:', result.error);
        message = `Saved locally. (Supabase notice: ${result.error || 'table pending'})`;
      }
    } catch (err: any) {
      console.error('Supabase save error:', err);
      message = 'Saved locally. Supabase connection pending.';
    } finally {
      setIsSavingAppointment(false);
    }

    return { success: true, syncedToSupabase, message };
  };

  // Explicit tool to clean any duplicate appointments from local and cloud storage
  const cleanDuplicateAppointments = useCallback(async (): Promise<{ removedCount: number }> => {
    let removed = 0;
    try {
      const fetchRes = await fetchAppointmentsFromSupabase();
      const combined = fetchRes.success && fetchRes.data ? [...fetchRes.data, ...appointments] : [...appointments];
      const { unique, removedIds } = deduplicateAppointmentsList(combined);
      removed = removedIds.length;

      if (removedIds.length > 0) {
        for (const id of removedIds) {
          await deleteAppointmentFromSupabase(id).catch(() => {});
        }
      }

      setAppointments(unique);
      try {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(unique));
      } catch {}
    } catch (err) {
      console.warn('Error during manual deduplication:', err);
    }
    return { removedCount: removed };
  }, [appointments]);

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentRequest['status'],
    staffNotes?: string
  ) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? {
              ...apt,
              status,
              staffNotes: staffNotes !== undefined ? staffNotes : apt.staffNotes,
            }
          : apt
      )
    );

    // Also update in Supabase if accessible
    await updateAppointmentInSupabase(id, status, staffNotes);
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    // Also remove from Supabase
    await deleteAppointmentFromSupabase(id);
  };

  const loginStaff = (pin: string): boolean => {
    const clean = pin.trim().toLowerCase().replace(/\s+/g, '');
    if (clean === 'noman' || clean === '18979' || clean === '1234' || clean === 'admin') {
      setIsStaffAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const loginAdmin = (id: string, pass: string): boolean => {
    const cleanId = id.trim();
    const cleanPass = pass.trim().toLowerCase().replace(/\s+/g, '');

    // The owner requested password is 'noman' (handles 'n o m a n', 'noman', case-insensitively)
    // Also accepts existing doctor pins (18979 / 1234)
    if (cleanPass === 'noman' || cleanPass === '18979' || cleanPass === '1234') {
      setIsStaffAuthenticated(true);
      const userDisplay = cleanId ? cleanId : 'Owner (admin)';
      setAdminUser(userDisplay);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        localStorage.setItem('saishradhdha_admin_user', userDisplay);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setIsStaffAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      // ignore
    }
  };

  const resetToDefaults = () => {
    setClinicInfo(initialClinicInfo);
    setTimings(initialClinicTimings);
    setAppointments(SAMPLE_APPOINTMENTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.INFO);
      localStorage.removeItem(STORAGE_KEYS.TIMINGS);
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    } catch {
      // ignore
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        clinicInfo,
        timings,
        services,
        reviews,
        faqs,
        appointments,
        updateClinicInfo,
        updateDayTiming,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        isStaffAuthenticated,
        adminUser,
        loginStaff,
        loginAdmin,
        logoutStaff,
        isAdminView,
        setIsAdminView,
        supabaseStatus,
        refreshAppointmentsFromSupabase,
        checkSupabaseConnection,
        cleanDuplicateAppointments,
        supabaseProjectId: SUPABASE_PROJECT_ID,
        supabaseSqlScript: SUPABASE_TABLE_SQL,
        isSavingAppointment,
        selectedServiceModal,
        setSelectedServiceModal,
        activeLegalModal,
        setActiveLegalModal,
        isAboutDetailOpen,
        setIsAboutDetailOpen,
        isStaffModalOpen,
        setIsStaffModalOpen,
        isAllReviewsModalOpen,
        setIsAllReviewsModalOpen,
        resetToDefaults,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = (): ClinicContextType => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
