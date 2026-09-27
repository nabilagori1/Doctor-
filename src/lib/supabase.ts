/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { AppointmentRequest } from '../types';

export const SUPABASE_PROJECT_ID = 'pbivgyyylvgupudempjp';
export const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_GHjIsado2stkeAF3GXkgHA_D5U4tyyv';

function resolveSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return DEFAULT_SUPABASE_URL;
  }
  const trimmed = rawUrl.trim();
  // If user passed a project id directly like "pbivgyyylvgupudempjp"
  if (/^[a-z0-9]{15,30}$/.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // invalid URL format, ignore and use default
  }
  return DEFAULT_SUPABASE_URL;
}

function resolveSupabaseKey(rawKey?: string): string {
  if (!rawKey || typeof rawKey !== 'string') {
    return DEFAULT_SUPABASE_ANON_KEY;
  }
  const trimmed = rawKey.trim();
  // Valid anon keys are either JWTs starting with eyJ... or publishable keys starting with sb_publishable_ or keys > 20 chars
  if (trimmed.length > 20 && (trimmed.startsWith('sb_') || trimmed.startsWith('eyJ') || trimmed.includes('.'))) {
    return trimmed;
  }
  return DEFAULT_SUPABASE_ANON_KEY;
}

export const SUPABASE_URL = resolveSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = resolveSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

function createSafeSupabaseClient() {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Fallback to default Supabase client due to init error:', err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  }
}

export const supabase = createSafeSupabaseClient();

export const SUPABASE_TABLE_SQL = `-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email_address TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  patient_type TEXT NOT NULL,
  preferred_language TEXT NOT NULL,
  reason_for_visit TEXT NOT NULL,
  additional_message TEXT,
  status TEXT DEFAULT 'Pending Review',
  staff_notes TEXT,
  submitted_at TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public / patients to submit appointment requests
DROP POLICY IF EXISTS "Allow anonymous appointment booking" ON public.appointments;
CREATE POLICY "Allow anonymous appointment booking"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading appointments
DROP POLICY IF EXISTS "Allow read appointments" ON public.appointments;
CREATE POLICY "Allow read appointments"
  ON public.appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow clinic staff to update appointments
DROP POLICY IF EXISTS "Allow update appointments" ON public.appointments;
CREATE POLICY "Allow update appointments"
  ON public.appointments
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Allow clinic staff to delete appointments
DROP POLICY IF EXISTS "Allow delete appointments" ON public.appointments;
CREATE POLICY "Allow delete appointments"
  ON public.appointments
  FOR DELETE
  TO anon, authenticated
  USING (true);
`;

/**
 * Checks connection and table accessibility
 */
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (!error) {
      return {
        connected: true,
        tableExists: true,
        message: 'Connected to Supabase & appointments table is ready.',
      };
    }

    if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
      return {
        connected: true,
        tableExists: false,
        message: "Supabase project reachable, but table 'public.appointments' has not been created yet.",
      };
    }

    return {
      connected: true,
      tableExists: false,
      message: `Supabase responded: ${error.message} (Code: ${error.code})`,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: `Unable to reach Supabase: ${err?.message || 'Network error'}`,
    };
  }
}

/**
 * Inserts patient appointment into Supabase
 */
export async function insertAppointmentToSupabase(
  appointment: AppointmentRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    // Primary attempt: standard snake_case column format
    const payload = {
      id: appointment.id,
      full_name: appointment.fullName,
      mobile_number: appointment.mobileNumber,
      email_address: appointment.emailAddress || null,
      preferred_date: appointment.preferredDate,
      preferred_time: appointment.preferredTime,
      patient_type: appointment.patientType,
      preferred_language: appointment.preferredLanguage,
      reason_for_visit: appointment.reasonForVisit,
      additional_message: appointment.additionalMessage || null,
      status: appointment.status || 'Pending Review',
      staff_notes: appointment.staffNotes || null,
      submitted_at: appointment.submittedAt,
    };

    const { error } = await supabase.from('appointments').insert([payload]);

    if (!error) {
      return { success: true };
    }

    // If snake_case had an error about column names, try camelCase format
    if (error.code === 'PGRST204' || error.message?.includes('column')) {
      const camelPayload = {
        id: appointment.id,
        fullName: appointment.fullName,
        mobileNumber: appointment.mobileNumber,
        emailAddress: appointment.emailAddress || null,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
        patientType: appointment.patientType,
        preferredLanguage: appointment.preferredLanguage,
        reasonForVisit: appointment.reasonForVisit,
        additionalMessage: appointment.additionalMessage || null,
        status: appointment.status || 'Pending Review',
        staffNotes: appointment.staffNotes || null,
        submittedAt: appointment.submittedAt,
      };
      const retry = await supabase.from('appointments').insert([camelPayload]);
      if (!retry.error) {
        return { success: true };
      }
    }

    console.warn('[Supabase Insert Error]', error);
    return { success: false, error: error.message };
  } catch (err: any) {
    console.error('[Supabase Insert Exception]', err);
    return { success: false, error: err?.message || 'Network error during save' };
  }
}

/**
 * Fetches appointments from Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  success: boolean;
  data?: AppointmentRequest[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const mapped: AppointmentRequest[] = (data || []).map((row: any) => ({
      id: row.id || `apt-${Math.random().toString().slice(2, 7)}`,
      fullName: row.full_name || row.fullName || 'Patient',
      mobileNumber: row.mobile_number || row.mobileNumber || '',
      emailAddress: row.email_address || row.emailAddress || '',
      preferredDate: row.preferred_date || row.preferredDate || '',
      preferredTime: row.preferred_time || row.preferredTime || '',
      patientType: (row.patient_type || row.patientType || 'New Patient') as any,
      preferredLanguage: (row.preferred_language || row.preferredLanguage || 'English') as any,
      reasonForVisit: row.reason_for_visit || row.reasonForVisit || 'Psychiatric Consultation',
      additionalMessage: row.additional_message || row.additionalMessage || '',
      submittedAt: row.submitted_at || row.submittedAt || (row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : 'Recently'),
      status: (row.status || 'Pending Review') as any,
      staffNotes: row.staff_notes || row.staffNotes || '',
    }));

    return { success: true, data: mapped };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Fetch error' };
  }
}

/**
 * Updates appointment status and staff notes in Supabase
 */
export async function updateAppointmentInSupabase(
  id: string,
  status: AppointmentRequest['status'],
  staffNotes?: string
): Promise<boolean> {
  try {
    const updateObj: Record<string, any> = { status };
    if (staffNotes !== undefined) {
      updateObj.staff_notes = staffNotes;
      updateObj.staffNotes = staffNotes;
    }

    const { error } = await supabase
      .from('appointments')
      .update(updateObj)
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Deletes appointment from Supabase
 */
export async function deleteAppointmentFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Normalizes phone numbers to digits only (e.g. matching last 10 digits in India)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Generates a unique deduplication identity key for an appointment
 */
export function getAppointmentDedupKey(apt: Partial<AppointmentRequest>): string {
  if (!apt) return `${Math.random()}`;
  const normName = (apt.fullName || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const normPhone = normalizePhoneNumber(apt.mobileNumber || '');
  const date = (apt.preferredDate || '').trim();
  const time = (apt.preferredTime || '').trim();

  // If we have patient name and phone number and preferred date, combine them as identity
  if (normName && normPhone && date) {
    return `${normName}:::${normPhone}:::${date}:::${time}`;
  }

  // Fallback to ID
  return apt.id || `${Math.random()}`;
}

/**
 * Robust deduplication engine for patient bookings:
 * - Identifies duplicates by ID or by same (Name + Phone + Preferred Date + Time)
 * - Retains the single most up-to-date and complete record (prioritizing staff notes & confirmed status)
 * - Returns the deduplicated list AND all redundant duplicate IDs that should be purged from database
 */
export function deduplicateAppointmentsList(list: AppointmentRequest[]): {
  unique: AppointmentRequest[];
  removedIds: string[];
} {
  if (!list || list.length === 0) {
    return { unique: [], removedIds: [] };
  }

  const seenKeys = new Map<string, AppointmentRequest>();
  const seenIds = new Set<string>();
  const removedIds: string[] = [];

  for (const apt of list) {
    if (!apt || !apt.id) continue;

    // Check if exact ID already processed
    if (seenIds.has(apt.id)) {
      removedIds.push(apt.id);
      continue;
    }

    const key = getAppointmentDedupKey(apt);

    if (!seenKeys.has(key)) {
      seenKeys.set(key, apt);
      seenIds.add(apt.id);
    } else {
      const existing = seenKeys.get(key)!;

      // Score both to decide which one to keep
      const existingScore = 
        (existing.staffNotes ? 10 : 0) + 
        (existing.status !== 'Pending Review' ? 5 : 0) +
        (existing.emailAddress ? 2 : 0) +
        (existing.additionalMessage ? 2 : 0);

      const currentScore = 
        (apt.staffNotes ? 10 : 0) + 
        (apt.status !== 'Pending Review' ? 5 : 0) +
        (apt.emailAddress ? 2 : 0) +
        (apt.additionalMessage ? 2 : 0);

      if (currentScore > existingScore) {
        // Keep current, discard existing
        if (existing.id && existing.id !== apt.id) {
          removedIds.push(existing.id);
        }
        seenKeys.set(key, apt);
        seenIds.delete(existing.id);
        seenIds.add(apt.id);
      } else {
        // Keep existing, discard current
        if (apt.id && apt.id !== existing.id) {
          removedIds.push(apt.id);
        }
      }
    }
  }

  const unique = Array.from(seenKeys.values());
  return { unique, removedIds };
}

