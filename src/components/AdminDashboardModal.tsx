import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  LogOut, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  Bell, 
  UserCheck, 
  Trash2, 
  Check, 
  RotateCcw,
  Save,
  MessageCircle,
  FileText,
  Database,
  RefreshCw,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { AppointmentRequest } from '../types';

export const AdminDashboardModal: React.FC = () => {
  const { 
    isStaffModalOpen, 
    setIsStaffModalOpen, 
    isStaffAuthenticated, 
    loginStaff, 
    logoutStaff,
    clinicInfo,
    updateClinicInfo,
    timings,
    updateDayTiming,
    appointments,
    updateAppointmentStatus,
    deleteAppointment,
    resetToDefaults,
    supabaseStatus,
    refreshAppointmentsFromSupabase,
    checkSupabaseConnection,
    supabaseProjectId,
    supabaseSqlScript,
    cleanDuplicateAppointments,
    setIsAdminView
  } = useClinic();

  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'timings' | 'contact' | 'announcement' | 'database'>('appointments');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCleaningDups, setIsCleaningDups] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Local form state for contact & profile
  const [editPhone, setEditPhone] = useState(clinicInfo.phone);
  const [editWhatsapp, setEditWhatsapp] = useState(clinicInfo.whatsapp);
  const [editEmail, setEditEmail] = useState(clinicInfo.email);
  const [editAddress, setEditAddress] = useState(clinicInfo.address.fullFormatted);
  const [editAnnouncement, setEditAnnouncement] = useState(clinicInfo.announcement?.message || '');
  const [announcementActive, setAnnouncementActive] = useState(clinicInfo.announcement?.active ?? true);

  if (!isStaffModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginStaff(pinInput.trim());
    if (success) {
      setAuthError(false);
      setPinInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicInfo({
      phone: editPhone,
      whatsapp: editWhatsapp,
      email: editEmail,
      address: {
        ...clinicInfo.address,
        fullFormatted: editAddress,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicInfo({
      announcement: {
        active: announcementActive,
        message: editAnnouncement,
        badgeText: 'Notice',
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshAppointmentsFromSupabase();
    setIsSyncing(false);
  };

  const handleCleanDuplicates = async () => {
    setIsCleaningDups(true);
    const res = await cleanDuplicateAppointments();
    setIsCleaningDups(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#1B1F23]/15 overflow-hidden max-h-[92vh] flex flex-col text-left">
        {/* Top Header */}
        <div className="p-5 bg-[#0f233a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A880]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                Clinic Staff Administration
              </span>
              <h3 id="admin-dashboard-title" className="font-serif text-lg sm:text-xl font-bold">
                Sai Shradhdha Mind Care Portal
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isStaffAuthenticated && (
              <button
                onClick={logoutStaff}
                className="text-xs text-white/70 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Logout staff session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsStaffModalOpen(false)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isStaffAuthenticated ? (
          /* Login Authentication Prompt */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#1B1F23]/10 mx-auto flex items-center justify-center text-[#0f233a]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-2xl font-bold text-[#0f233a]">
                Doctor &amp; Staff Login
              </h4>
              <p className="text-xs text-[#1B1F23]/70 mt-1 font-light">
                Please enter the password to view client bookings and manage clinic records.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  placeholder="Enter Password (noman)"
                  className={`w-full px-4 py-3 rounded-xl border text-center text-sm font-medium tracking-wider focus:outline-none focus:ring-2 transition-all ${
                    authError
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-[#1B1F23]/20 focus:ring-[#4A6B5D]/30 focus:border-[#4A6B5D]'
                  }`}
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-red-600 mt-1.5">
                    Invalid password. Password is: <span className="font-bold">noman</span>.
                  </p>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#1B1F23]/10 text-[11px] text-[#1B1F23]/70 text-left">
                <span className="font-bold text-[#0f233a] block">Owner Credentials:</span>
                <span>ID: <code className="font-mono font-bold text-[#0f233a]">admin</code> &nbsp;|&nbsp; Password: <code className="font-mono font-bold text-emerald-700">noman</code></span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0f233a] hover:bg-[#172b4d] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow"
              >
                Access Staff Portal
              </button>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsStaffModalOpen(false);
                    setIsAdminView(true);
                  }}
                  className="text-xs text-[#4A6B5D] hover:underline font-semibold"
                >
                  → Open Dedicated Full-Screen Admin Panel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs Navigation */}
            <div className="px-6 pt-3 bg-[#FAF8F5] border-b border-[#1B1F23]/10 flex gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'appointments'
                    ? 'border-[#0f233a] text-[#0f233a]'
                    : 'border-transparent text-[#1B1F23]/60 hover:text-[#0f233a]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'database'
                    ? 'border-[#0f233a] text-[#0f233a]'
                    : 'border-transparent text-[#1B1F23]/60 hover:text-[#0f233a]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Database</span>
                <span 
                  className={`w-2 h-2 rounded-full ${
                    supabaseStatus.tableExists ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} 
                  title={supabaseStatus.message}
                />
              </button>

              <button
                onClick={() => setActiveTab('timings')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'timings'
                    ? 'border-[#0f233a] text-[#0f233a]'
                    : 'border-transparent text-[#1B1F23]/60 hover:text-[#0f233a]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Clinic Timings</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'contact'
                    ? 'border-[#0f233a] text-[#0f233a]'
                    : 'border-transparent text-[#1B1F23]/60 hover:text-[#0f233a]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact &amp; Address</span>
              </button>

              <button
                onClick={() => setActiveTab('announcement')}
                className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'announcement'
                    ? 'border-[#0f233a] text-[#0f233a]'
                    : 'border-transparent text-[#1B1F23]/60 hover:text-[#0f233a]'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Top Notice Banner</span>
              </button>
            </div>

            {/* Notification Toast */}
            {saveSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 border-b border-emerald-200 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Changes saved successfully to clinic records.</span>
              </div>
            )}

            {/* Tab Views */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: Appointments Manager */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#1B1F23]/10">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                        Patient Consultation Requests
                      </h4>
                      <p className="text-xs text-[#1B1F23]/60">
                        View submitted appointment inquiries, update status, and sync with Supabase.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#1B1F23]/60 hidden sm:inline">
                        Project: <code className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{supabaseProjectId}</code>
                      </span>
                      <button
                        onClick={handleCleanDuplicates}
                        disabled={isCleaningDups}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1B1F23]/15 text-xs font-semibold text-[#0f233a] bg-white hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-50"
                        title="Remove any duplicate bookings and keep database clean"
                      >
                        <Check className="w-3.5 h-3.5 text-[#4A6B5D]" />
                        <span>{isCleaningDups ? 'Cleaning...' : 'Deduplicate'}</span>
                      </button>
                      <button
                        onClick={handleManualSync}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1B1F23]/15 text-xs font-semibold text-[#0f233a] bg-white hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-50"
                        title="Fetch latest appointment requests from Supabase"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#4A6B5D] ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Supabase status banner if table not yet created */}
                  {!supabaseStatus.tableExists && (
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-3 text-xs text-amber-900">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-950">
                            Supabase connected ({supabaseProjectId}) — Table setup recommended
                          </p>
                          <p className="text-[11px] text-amber-800 mt-0.5 font-light">
                            Patient submissions are safely captured locally. To enable permanent storage in your Supabase project, execute the SQL script in the Supabase tab.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('database')}
                        className="px-2.5 py-1 rounded-lg bg-amber-700 text-white font-semibold text-[11px] whitespace-nowrap hover:bg-amber-800"
                      >
                        Setup SQL
                      </button>
                    </div>
                  )}

                  {appointments.length === 0 ? (
                    <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#1B1F23]/10 text-xs text-[#1B1F23]/60">
                      No appointment requests currently logged.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border border-[#1B1F23]/10 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#1B1F23]/10 pb-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-serif text-base font-bold text-[#0f233a]">
                                  {apt.fullName}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EFE8DF] text-[#0f233a]">
                                  {apt.patientType}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#4A6B5D]/10 text-[#4A6B5D]">
                                  Lang: {apt.preferredLanguage}
                                </span>
                              </div>
                              <p className="text-xs text-[#1B1F23]/60 mt-0.5">
                                Submitted on: {apt.submittedAt}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Status Badge & Selector */}
                              <select
                                value={apt.status}
                                onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                  apt.status === 'Pending Review'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : apt.status === 'Contacted / Scheduled'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : apt.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="Contacted / Scheduled">Contacted / Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              <button
                                onClick={() => deleteAppointment(apt.id)}
                                className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete inquiry record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-[#1B1F23]/50 block text-[10px] uppercase font-bold">
                                Mobile Number
                              </span>
                              <a
                                href={`tel:${apt.mobileNumber}`}
                                className="font-semibold text-[#0f233a] hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-[#4A6B5D]" />
                                {apt.mobileNumber}
                              </a>
                            </div>

                            {apt.emailAddress && (
                              <div>
                                <span className="text-[#1B1F23]/50 block text-[10px] uppercase font-bold">
                                  Email Address
                                </span>
                                <span className="font-semibold text-[#0f233a]">
                                  {apt.emailAddress}
                                </span>
                              </div>
                            )}

                            <div>
                              <span className="text-[#1B1F23]/50 block text-[10px] uppercase font-bold">
                                Preferred Date &amp; Slot
                              </span>
                              <span className="font-semibold text-[#0f233a] flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#C5A880]" />
                                {apt.preferredDate} ({apt.preferredTime})
                              </span>
                            </div>

                            <div className="sm:col-span-2">
                              <span className="text-[#1B1F23]/50 block text-[10px] uppercase font-bold">
                                Reason for Visit
                              </span>
                              <span className="font-semibold text-[#0f233a]">
                                {apt.reasonForVisit}
                              </span>
                            </div>

                            {apt.additionalMessage && (
                              <div className="sm:col-span-2 lg:col-span-3 bg-white p-2.5 rounded-lg border border-[#1B1F23]/10">
                                <span className="text-[#1B1F23]/50 block text-[10px] uppercase font-bold mb-0.5">
                                  Patient's Message
                                </span>
                                <p className="text-xs text-[#1B1F23]/80 italic">
                                  "{apt.additionalMessage}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Quick Actions (Call / WhatsApp patient) */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#1B1F23]/10">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${apt.mobileNumber}`}
                                className="text-[11px] font-semibold px-2.5 py-1 rounded bg-[#0f233a] text-white hover:bg-[#172b4d] flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                Call Patient
                              </a>

                              <a
                                href={`https://wa.me/${apt.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Namaste ${apt.fullName}, this is Sai Shradhdha Mind Care Clinic Jamnagar regarding your appointment consultation request.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                              </a>
                            </div>

                            <span className="text-[10px] text-[#1B1F23]/40">
                              ID: {apt.id}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Supabase Database Manager */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                      Supabase Cloud Database Connection
                    </h4>
                    <p className="text-xs text-[#1B1F23]/60">
                      Live integration settings and database schema for patient consultation requests.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-full ${supabaseStatus.tableExists ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-[#0f233a]">
                            Project: <span className="font-mono">{supabaseProjectId}</span>
                          </p>
                          <p className="text-[11px] text-[#1B1F23]/70 mt-0.5">
                            {supabaseStatus.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleManualSync}
                          disabled={isSyncing}
                          className="px-3 py-1.5 rounded-lg border border-[#1B1F23]/15 text-xs font-semibold text-[#0f233a] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-[#4A6B5D] ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>Test &amp; Sync</span>
                        </button>

                        <a
                          href={`https://supabase.com/dashboard/project/${supabaseProjectId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#0f233a] text-white text-xs font-semibold hover:bg-[#172b4d] transition-colors flex items-center gap-1.5"
                        >
                          <span>Open Supabase</span>
                          <ExternalLink className="w-3 h-3 text-[#C5A880]" />
                        </a>
                      </div>
                    </div>

                    {supabaseStatus.lastSyncedAt && (
                      <p className="text-[10px] text-[#1B1F23]/50 border-t border-[#1B1F23]/5 pt-2">
                        Last checked: {supabaseStatus.lastSyncedAt}
                      </p>
                    )}
                  </div>

                  {/* Schema Setup Instructions */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#1B1F23]/10 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h5 className="font-serif text-sm font-bold text-[#0f233a] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#4A6B5D]" />
                          Supabase Table SQL Script
                        </h5>
                        <p className="text-[11px] text-[#1B1F23]/70 mt-0.5">
                          Copy and run this in your Supabase SQL Editor to create the <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#1B1F23]/10 text-xs">appointments</code> table with Row Level Security.
                        </p>
                      </div>

                      <button
                        onClick={handleCopySql}
                        className="px-3 py-1.5 rounded-lg bg-[#4A6B5D] hover:bg-[#3d594c] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {copiedSql ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy SQL Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* SQL Code Block */}
                    <div className="relative rounded-xl overflow-hidden border border-[#1B1F23]/15">
                      <pre className="p-4 bg-[#0f233a] text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-60">
                        {supabaseSqlScript}
                      </pre>
                    </div>

                    <div className="text-xs text-[#1B1F23]/80 space-y-1.5 bg-white p-3 rounded-xl border border-[#1B1F23]/10 font-light">
                      <p className="font-semibold text-[#0f233a]">Quick 30-Second Setup Guide:</p>
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Click <strong>Copy SQL Script</strong> above.</li>
                        <li>Click <strong>Open Supabase</strong> (or visit <a href={`https://supabase.com/dashboard/project/${supabaseProjectId}/sql`} target="_blank" rel="noopener noreferrer" className="text-[#4A6B5D] underline font-medium">Supabase SQL Editor</a>).</li>
                        <li>Paste into the SQL query window and click <strong>Run</strong>.</li>
                        <li>Come back and click <strong>Test &amp; Sync</strong>. All patient form submissions will save into your Supabase database!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Clinic Timings */}
              {activeTab === 'timings' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                      Consultation Schedule &amp; Timings
                    </h4>
                    <p className="text-xs text-[#1B1F23]/60">
                      Configure open days and session timings shown across the website.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {timings.map((t) => (
                      <div
                        key={t.day}
                        className="bg-[#FAF8F5] p-3 rounded-xl border border-[#1B1F23]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={t.isOpen}
                            onChange={(e) => updateDayTiming(t.day, { isOpen: e.target.checked })}
                            id={`timing-${t.day}`}
                            className="w-4 h-4 rounded text-[#0f233a] cursor-pointer"
                          />
                          <label
                            htmlFor={`timing-${t.day}`}
                            className="text-xs font-bold text-[#0f233a] w-24 cursor-pointer"
                          >
                            {t.day}
                          </label>
                        </div>

                        {t.isOpen ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full sm:w-auto">
                            <input
                              type="text"
                              value={t.morningHours}
                              onChange={(e) => updateDayTiming(t.day, { morningHours: e.target.value })}
                              placeholder="Morning slot"
                              className="px-2.5 py-1 text-xs rounded-lg border border-[#1B1F23]/15 bg-white"
                            />
                            <input
                              type="text"
                              value={t.eveningHours}
                              onChange={(e) => updateDayTiming(t.day, { eveningHours: e.target.value })}
                              placeholder="Evening slot"
                              className="px-2.5 py-1 text-xs rounded-lg border border-[#1B1F23]/15 bg-white"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-rose-700 italic font-medium px-2 py-1">
                            Closed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Contact & Address */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSaveContact} className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                      Clinic Contact Information
                    </h4>
                    <p className="text-xs text-[#1B1F23]/60">
                      Update phone numbers, WhatsApp, and physical address shown to patients.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                        Clinic Desk Phone
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={editWhatsapp}
                        onChange={(e) => setEditWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                      Clinic Email
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                      Full Physical Address
                    </label>
                    <textarea
                      rows={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0f233a] hover:bg-[#172b4d] text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-[#C5A880]" />
                      <span>Save Contact Information</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: Announcement Banner */}
              {activeTab === 'announcement' && (
                <form onSubmit={handleSaveAnnouncement} className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                      Top Announcement Notice
                    </h4>
                    <p className="text-xs text-[#1B1F23]/60">
                      Display a critical alert or holiday notice banner at the very top of the website.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="toggle-banner"
                      type="checkbox"
                      checked={announcementActive}
                      onChange={(e) => setAnnouncementActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0f233a] cursor-pointer"
                    />
                    <label htmlFor="toggle-banner" className="text-xs font-semibold text-[#0f233a] cursor-pointer">
                      Show announcement banner on website
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                      Notice Message
                    </label>
                    <textarea
                      rows={3}
                      value={editAnnouncement}
                      onChange={(e) => setEditAnnouncement(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-white"
                      placeholder="e.g. Clinic will remain open on Sunday 10 AM – 1 PM for special consultations."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0f233a] hover:bg-[#172b4d] text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-[#C5A880]" />
                      <span>Update Announcement</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#1B1F23]/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset clinic data and demo appointments to initial defaults?')) {
                    resetToDefaults();
                    setIsStaffModalOpen(false);
                  }
                }}
                className="text-xs text-[#1B1F23]/50 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>

              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0f233a] text-white text-xs font-semibold hover:bg-[#4A6B5D] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
