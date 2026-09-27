import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  LogOut, 
  Globe, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  UserCheck, 
  Trash2, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  Database, 
  Save, 
  ChevronRight, 
  FileText, 
  Check, 
  ExternalLink,
  Copy,
  Users,
  CalendarCheck,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Github,
  Terminal,
  Cloud,
  Rocket,
  Zap,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { AppointmentRequest } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    isStaffAuthenticated, 
    adminUser,
    loginAdmin, 
    logoutStaff, 
    setIsAdminView,
    appointments, 
    updateAppointmentStatus, 
    deleteAppointment, 
    addAppointment,
    clinicInfo,
    updateClinicInfo,
    timings,
    updateDayTiming,
    supabaseStatus,
    refreshAppointmentsFromSupabase,
    cleanDuplicateAppointments,
    supabaseProjectId,
    supabaseSqlScript,
    resetToDefaults
  } = useClinic();

  // Login form state
  const [loginId, setLoginId] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'new-booking' | 'schedule' | 'database' | 'timings' | 'settings' | 'deploy'>('bookings');
  const [deployTab, setDeployTab] = useState<'netlify' | 'github-pages'>('netlify');

  // Bookings filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [patientTypeFilter, setPatientTypeFilter] = useState<string>('ALL');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCleaningDups, setIsCleaningDups] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Manual new booking form state
  const [newBooking, setNewBooking] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '10:30 AM',
    patientType: 'New Patient' as 'New Patient' | 'Existing Patient',
    preferredLanguage: 'Gujarati' as 'Gujarati' | 'Hindi' | 'English',
    reasonForVisit: 'Psychiatric Consultation',
    additionalMessage: '',
  });

  // Settings form state
  const [editPhone, setEditPhone] = useState(clinicInfo.phone);
  const [editWhatsapp, setEditWhatsapp] = useState(clinicInfo.whatsapp);
  const [editEmail, setEditEmail] = useState(clinicInfo.email);
  const [editAddress, setEditAddress] = useState(clinicInfo.address.fullFormatted);
  const [editAnnouncement, setEditAnnouncement] = useState(clinicInfo.announcement?.message || '');
  const [announcementActive, setAnnouncementActive] = useState(clinicInfo.announcement?.active ?? true);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError('Please enter the password.');
      return;
    }
    const success = loginAdmin(loginId.trim() || 'admin', password);
    if (success) {
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Invalid password. Password is: noman');
    }
  };

  const handleAutoFillAndLogin = () => {
    setLoginId('admin');
    setPassword('noman');
    loginAdmin('admin', 'noman');
  };

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        apt.fullName.toLowerCase().includes(q) ||
        apt.mobileNumber.toLowerCase().includes(q) ||
        (apt.emailAddress && apt.emailAddress.toLowerCase().includes(q)) ||
        apt.reasonForVisit.toLowerCase().includes(q) ||
        apt.preferredDate.includes(q);

      const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
      const matchesType = patientTypeFilter === 'ALL' || apt.patientType === patientTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [appointments, searchQuery, statusFilter, patientTypeFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'Pending Review').length;
    const scheduled = appointments.filter(a => a.status === 'Contacted / Scheduled').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    return { total, pending, scheduled, completed };
  }, [appointments]);

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      alert('No booking records to export.');
      return;
    }

    const headers = [
      'ID',
      'Client Name',
      'Mobile Number',
      'Email',
      'Preferred Date',
      'Time Slot',
      'Patient Type',
      'Preferred Language',
      'Reason For Visit',
      'Client Message',
      'Status',
      'Doctor / Staff Notes',
      'Submitted At'
    ];

    const rows = appointments.map(a => [
      `"${a.id}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.mobileNumber.replace(/"/g, '""')}"`,
      `"${(a.emailAddress || '').replace(/"/g, '""')}"`,
      `"${a.preferredDate}"`,
      `"${a.preferredTime}"`,
      `"${a.patientType}"`,
      `"${a.preferredLanguage}"`,
      `"${a.reasonForVisit.replace(/"/g, '""')}"`,
      `"${(a.additionalMessage || '').replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${(a.staffNotes || '').replace(/"/g, '""')}"`,
      `"${a.submittedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sai_shradhdha_clients_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync Supabase
  const handleSyncCloud = async () => {
    setIsSyncing(true);
    await refreshAppointmentsFromSupabase();
    setIsSyncing(false);
    showNotice('Database synchronized with Supabase cloud.');
  };

  // Clean and merge any duplicate records
  const handleCleanDuplicates = async () => {
    setIsCleaningDups(true);
    try {
      const res = await cleanDuplicateAppointments();
      if (res.removedCount > 0) {
        showNotice(`Cleaned & merged ${res.removedCount} duplicate patient records successfully!`);
      } else {
        showNotice('All client bookings are unique. No duplicate records found.');
      }
    } catch {
      showNotice('Deduplication completed.');
    } finally {
      setIsCleaningDups(false);
    }
  };

  const showNotice = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(null), 3500);
  };

  // Save manual new booking
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.fullName.trim() || !newBooking.mobileNumber.trim()) {
      alert('Please provide client name and mobile number.');
      return;
    }
    await addAppointment({
      fullName: newBooking.fullName.trim(),
      mobileNumber: newBooking.mobileNumber.trim(),
      emailAddress: newBooking.emailAddress.trim(),
      preferredDate: newBooking.preferredDate,
      preferredTime: newBooking.preferredTime,
      patientType: newBooking.patientType,
      preferredLanguage: newBooking.preferredLanguage,
      reasonForVisit: newBooking.reasonForVisit,
      additionalMessage: newBooking.additionalMessage.trim(),
    });

    setNewBooking({
      fullName: '',
      mobileNumber: '',
      emailAddress: '',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:30 AM',
      patientType: 'New Patient',
      preferredLanguage: 'Gujarati',
      reasonForVisit: 'Psychiatric Consultation',
      additionalMessage: '',
    });

    showNotice('New client booking registered successfully!');
    setActiveTab('bookings');
  };

  // Save Contact & Settings
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
    showNotice('Clinic contact details updated.');
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
    showNotice('Top announcement banner updated.');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  /* ========================================================================= */
  /* SCREEN 1: LOGIN PORTAL (WHEN NOT AUTHENTICATED)                            */
  /* ========================================================================= */
  if (!isStaffAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a1626] text-white flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#C5A880] selection:text-[#0a1626]">
        {/* Top bar back button */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
          <button
            onClick={() => setIsAdminView(false)}
            className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          <span className="text-[11px] uppercase tracking-widest text-[#C5A880] font-bold">
            Doctor &amp; Owner Login
          </span>
        </div>

        {/* Center Login Box */}
        <div className="max-w-md w-full mx-auto my-8 bg-[#0f233a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left">
          {/* Branding */}
          <div className="text-center space-y-1.5 pb-2 border-b border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1B3B5F] to-[#2B5480] border border-[#C5A880]/40 flex items-center justify-center mx-auto shadow-inner text-[#C5A880]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white pt-2">
              Sai Shradhdha Mind Care
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              Owner &amp; Administration Portal
            </p>
            <p className="text-xs text-white/60 font-light max-w-xs mx-auto pt-1">
              Secure portal for Dr. Renish Bhatt &amp; clinic management to view client bookings and appointments.
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Admin / Owner ID
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter ID (e.g. admin or owner)"
                className="w-full px-4 py-3 rounded-xl bg-[#0a1626] border border-white/20 text-white text-sm focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-white/80">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#C5A880] hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl bg-[#0a1626] border border-white/20 text-white text-sm focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#b5966c] text-[#0a1626] text-sm font-bold tracking-wide transition-all duration-200 shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Admin Panel</span>
            </button>
          </form>

          {/* Owner Credentials Helper Box */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#C5A880] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Your Login Credentials:
              </span>
              <button
                type="button"
                onClick={handleAutoFillAndLogin}
                className="text-[11px] text-[#FAF8F5] underline hover:text-[#C5A880]"
              >
                1-Click Auto Fill
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#0a1626] p-2 rounded-lg border border-white/10">
              <div>
                <span className="text-white/50 block text-[9px] uppercase font-sans">ID</span>
                <span className="text-white font-bold">admin</span> (or owner)
              </div>
              <div>
                <span className="text-white/50 block text-[9px] uppercase font-sans">Password</span>
                <span className="text-emerald-400 font-bold">noman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="max-w-md w-full mx-auto text-center text-xs text-white/40">
          <p>© 2026 Sai Shradhdha Mind Care Clinic, Jamnagar. Confidential Owner Access.</p>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* SCREEN 2: STANDALONE ADMIN DASHBOARD (AUTHENTICATED)                      */
  /* ========================================================================= */
  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1B1F23] flex flex-col selection:bg-[#0f233a] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-[#0f233a] text-white sticky top-0 z-30 shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1B3B5F] to-[#2B5480] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg leading-tight text-white">
                  Sai Shradhdha Mind Care
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A880] text-[#0f233a] uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Dr. Renish Bhatt • Jamnagar, Gujarat
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Pill */}
            <div 
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                supabaseStatus.tableExists 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
              title={supabaseStatus.message}
            >
              <Database className="w-3 h-3" />
              <span>{supabaseStatus.tableExists ? 'Supabase Connected' : 'Supabase Table Pending'}</span>
            </div>

            {/* View Public Website */}
            <button
              onClick={() => setIsAdminView(false)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Return to the public patient website"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            {/* Logout */}
            <button
              onClick={logoutStaff}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-700/40"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold pt-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client Bookings</span>
            {metrics.pending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                {metrics.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('new-booking')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'new-booking'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Schedule Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'database'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('timings')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'timings'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>OPD Timings</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Clinic Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'deploy'
                ? 'border-[#C5A880] text-[#C5A880] bg-white/5 rounded-t-lg'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4 text-[#C5A880]" />
            <span>Deploy (Netlify & GitHub)</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 text-left space-y-6">
        {/* Success Alert Notice Banner */}
        {savedSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{savedSuccessMsg}</span>
            </div>
            <button onClick={() => setSavedSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: CLIENT BOOKINGS & INQUIRIES                                */}
        {/* ================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Metric Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#1B1F23]/10 shadow-sm">
                <span className="text-[11px] uppercase font-bold text-[#1B1F23]/50 block">
                  Total Bookings
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0f233a]">
                  {metrics.total}
                </span>
                <span className="text-[11px] text-[#1B1F23]/60 block mt-1">
                  All recorded inquiries
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
                <span className="text-[11px] uppercase font-bold text-amber-700 block">
                  Pending Review
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-900">
                  {metrics.pending}
                </span>
                <span className="text-[11px] text-amber-700/80 block mt-1">
                  Requires confirmation call
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm">
                <span className="text-[11px] uppercase font-bold text-blue-700 block">
                  Scheduled / Contacted
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-blue-900">
                  {metrics.scheduled}
                </span>
                <span className="text-[11px] text-blue-700/80 block mt-1">
                  Slot confirmed with patient
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
                <span className="text-[11px] uppercase font-bold text-emerald-700 block">
                  Completed Consultations
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900">
                  {metrics.completed}
                </span>
                <span className="text-[11px] text-emerald-700/80 block mt-1">
                  Consultation completed
                </span>
              </div>
            </div>

            {/* Filter & Action Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#1B1F23]/10 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1B1F23]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client name, mobile (+91), email, or symptom..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#1B1F23]/15 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f233a]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#1B1F23]/40 hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns & Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#1B1F23]/15 bg-[#FAF8F5] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Statuses ({appointments.length})</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Contacted / Scheduled">Contacted / Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Patient Type Filter */}
                  <select
                    value={patientTypeFilter}
                    onChange={(e) => setPatientTypeFilter(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#1B1F23]/15 bg-[#FAF8F5] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Patients</option>
                    <option value="New Patient">New Patients Only</option>
                    <option value="Existing Patient">Existing Patients Only</option>
                  </select>

                  {/* Export CSV */}
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 rounded-xl bg-white border border-[#1B1F23]/20 hover:bg-[#FAF8F5] text-xs font-semibold text-[#0f233a] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Export all client bookings to CSV / Excel spreadsheet"
                  >
                    <Download className="w-3.5 h-3.5 text-[#4A6B5D]" />
                    <span>Export CSV</span>
                  </button>

                  {/* Clean Duplicates */}
                  <button
                    onClick={handleCleanDuplicates}
                    disabled={isCleaningDups}
                    className="px-3 py-2 rounded-xl bg-white border border-[#1B1F23]/20 hover:bg-[#FAF8F5] text-xs font-semibold text-[#0f233a] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    title="Purge redundant duplicate submissions and keep single clean client record"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B5D]" />
                    <span>{isCleaningDups ? 'Deduplicating...' : 'Deduplicate'}</span>
                  </button>

                  {/* Sync Cloud */}
                  <button
                    onClick={handleSyncCloud}
                    disabled={isSyncing}
                    className="px-3 py-2 rounded-xl bg-[#0f233a] hover:bg-[#1a334d] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    title="Fetch newly submitted appointments from Supabase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#C5A880] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
                  </button>
                </div>
              </div>

              {/* Showing count indicator */}
              <div className="flex items-center justify-between text-[11px] text-[#1B1F23]/60 pt-1 border-t border-[#1B1F23]/5">
                <span>
                  Showing {filteredAppointments.length} of {appointments.length} client booking records
                </span>
                {(searchQuery || statusFilter !== 'ALL' || patientTypeFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setPatientTypeFilter('ALL');
                    }}
                    className="text-[#4A6B5D] font-semibold hover:underline"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>

            {/* Bookings List Cards */}
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-[#1B1F23]/40">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                  No matching client bookings found
                </h4>
                <p className="text-xs text-[#1B1F23]/60 max-w-sm mx-auto">
                  Try adjusting your search keywords or filters, or add a new appointment manually.
                </p>
                <button
                  onClick={() => setActiveTab('new-booking')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f233a] text-white text-xs font-semibold hover:bg-[#4A6B5D] transition-colors mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Walk-in Client</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const isEditingNote = editingNotesId === apt.id;
                  const whatsappMessage = encodeURIComponent(
                    `Namaste ${apt.fullName}, this is Dr. Renish Bhatt from Sai Shradhdha Mind Care Clinic, Jamnagar. Regarding your consultation request for ${apt.reasonForVisit} on ${apt.preferredDate} (${apt.preferredTime}). Please let us know if this time suits you.`
                  );

                  return (
                    <div
                      key={apt.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm p-4 sm:p-5 space-y-4 ${
                        apt.status === 'Pending Review'
                          ? 'border-amber-300/80 bg-gradient-to-r from-amber-50/20 to-white'
                          : 'border-[#1B1F23]/10 hover:border-[#1B1F23]/25'
                      }`}
                    >
                      {/* Card Header: Client Name, Tags, and Status Selector */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1B1F23]/10 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-lg sm:text-xl font-bold text-[#0f233a]">
                              {apt.fullName}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#1B1F23]/15 text-[#0f233a]">
                              {apt.patientType}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4A6B5D]/10 text-[#4A6B5D]">
                              Language: {apt.preferredLanguage}
                            </span>
                            <span className="text-[10px] text-[#1B1F23]/50 font-mono">
                              #{apt.id}
                            </span>
                          </div>
                          <p className="text-xs text-[#1B1F23]/60">
                            Submitted on: <span className="font-medium text-[#1B1F23]/80">{apt.submittedAt}</span>
                          </p>
                        </div>

                        {/* Status Controls */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[#1B1F23]/50 uppercase hidden md:inline">
                              Status:
                            </span>
                            <select
                              value={apt.status}
                              onChange={(e) => {
                                updateAppointmentStatus(apt.id, e.target.value as any);
                                showNotice(`Status updated to "${e.target.value}" for ${apt.fullName}`);
                              }}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-colors ${
                                apt.status === 'Pending Review'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : apt.status === 'Contacted / Scheduled'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : apt.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-rose-100 text-rose-900 border-rose-300'
                              }`}
                            >
                              <option value="Pending Review">⏳ Pending Review</option>
                              <option value="Contacted / Scheduled">📅 Contacted / Scheduled</option>
                              <option value="Completed">✓ Completed</option>
                              <option value="Cancelled">✕ Cancelled</option>
                            </select>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Delete appointment record for "${apt.fullName}"?`)) {
                                deleteAppointment(apt.id);
                                showNotice(`Appointment record removed.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Client Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        {/* Mobile & Direct Phone Call */}
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#1B1F23]/5 space-y-1">
                          <span className="text-[10px] font-bold text-[#1B1F23]/50 uppercase tracking-wider block">
                            Client Mobile
                          </span>
                          <a
                            href={`tel:${apt.mobileNumber}`}
                            className="font-bold text-sm text-[#0f233a] hover:text-[#4A6B5D] flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#4A6B5D]" />
                            <span>{apt.mobileNumber}</span>
                          </a>
                        </div>

                        {/* Preferred Slot */}
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#1B1F23]/5 space-y-1">
                          <span className="text-[10px] font-bold text-[#1B1F23]/50 uppercase tracking-wider block">
                            Requested Slot
                          </span>
                          <span className="font-bold text-sm text-[#0f233a] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>{apt.preferredDate} ({apt.preferredTime})</span>
                          </span>
                        </div>

                        {/* Reason For Visit */}
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#1B1F23]/5 space-y-1 sm:col-span-2">
                          <span className="text-[10px] font-bold text-[#1B1F23]/50 uppercase tracking-wider block">
                            Clinical Concern / Reason
                          </span>
                          <span className="font-semibold text-xs text-[#0f233a] block">
                            {apt.reasonForVisit}
                          </span>
                          {apt.emailAddress && (
                            <span className="text-[11px] text-[#1B1F23]/60 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#1B1F23]/40" />
                              <a href={`mailto:${apt.emailAddress}`} className="hover:underline">{apt.emailAddress}</a>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Additional Patient Message */}
                      {apt.additionalMessage && (
                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10 text-xs">
                          <span className="text-[10px] font-bold text-[#1B1F23]/50 uppercase tracking-wider block mb-0.5">
                            Client's Detailed Note:
                          </span>
                          <p className="text-xs text-[#1B1F23]/80 italic leading-relaxed">
                            "{apt.additionalMessage}"
                          </p>
                        </div>
                      )}

                      {/* Staff & Doctor Clinical Follow-up Notes */}
                      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Doctor / Staff Follow-up Note:
                          </span>
                          {!isEditingNote && (
                            <button
                              onClick={() => {
                                setEditingNotesId(apt.id);
                                setTempNotes(apt.staffNotes || '');
                              }}
                              className="text-[11px] text-amber-800 hover:underline font-semibold"
                            >
                              {apt.staffNotes ? 'Edit Note' : '+ Add Note'}
                            </button>
                          )}
                        </div>

                        {isEditingNote ? (
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows={2}
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="e.g. Called client on 24th, confirmed evening slot, requested old medical reports..."
                              className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none"
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-2.5 py-1 text-[11px] rounded text-[#1B1F23]/60 hover:text-black"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  updateAppointmentStatus(apt.id, apt.status, tempNotes);
                                  setEditingNotesId(null);
                                  showNotice(`Note saved for ${apt.fullName}`);
                                }}
                                className="px-3 py-1 text-[11px] font-bold rounded-lg bg-[#0f233a] text-white hover:bg-[#4A6B5D]"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-950 font-light italic">
                            {apt.staffNotes ? `“${apt.staffNotes}”` : 'No staff follow-up note recorded yet.'}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Fast Action Buttons */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[#1B1F23]/5 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Call Client */}
                          <a
                            href={`tel:${apt.mobileNumber.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f233a] text-white hover:bg-[#1a334d] font-semibold text-xs shadow-sm transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Call {apt.fullName.split(' ')[0]}</span>
                          </a>

                          {/* WhatsApp Client */}
                          <a
                            href={`https://wa.me/${apt.mobileNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold text-xs shadow-sm transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Confirmation</span>
                          </a>
                        </div>

                        <span className="text-[11px] text-[#1B1F23]/40 font-mono">
                          ID: {apt.id}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MANUAL NEW BOOKING REGISTRATION                            */}
        {/* ================================================================= */}
        {activeTab === 'new-booking' && (
          <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-8 max-w-3xl shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0f233a]">
                Register New Client Consultation
              </h3>
              <p className="text-xs text-[#1B1F23]/60 mt-1">
                Record appointments made via phone call, WhatsApp inquiry, or clinic walk-in. Data saves directly to Supabase and clinic records.
              </p>
            </div>

            <form onSubmit={handleCreateNewBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    value={newBooking.fullName}
                    onChange={(e) => setNewBooking({ ...newBooking, fullName: e.target.value })}
                    placeholder="e.g. Jayesh Mehta"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f233a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={newBooking.mobileNumber}
                    onChange={(e) => setNewBooking({ ...newBooking, mobileNumber: e.target.value })}
                    placeholder="+91 98980 00000"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f233a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={newBooking.emailAddress}
                    onChange={(e) => setNewBooking({ ...newBooking, emailAddress: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f233a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Patient Type
                  </label>
                  <select
                    value={newBooking.patientType}
                    onChange={(e) => setNewBooking({ ...newBooking, patientType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                  >
                    <option value="New Patient">New Patient (First Visit)</option>
                    <option value="Existing Patient">Existing Patient (Follow-up)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={newBooking.preferredDate}
                    onChange={(e) => setNewBooking({ ...newBooking, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newBooking.preferredTime}
                    onChange={(e) => setNewBooking({ ...newBooking, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="10:30 AM">10:30 AM (Morning)</option>
                    <option value="11:00 AM">11:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Morning)</option>
                    <option value="12:00 PM">12:00 PM (Morning)</option>
                    <option value="05:30 PM">05:30 PM (Evening)</option>
                    <option value="06:00 PM">06:00 PM (Evening)</option>
                    <option value="06:30 PM">06:30 PM (Evening)</option>
                    <option value="07:00 PM">07:00 PM (Evening)</option>
                    <option value="07:30 PM">07:30 PM (Evening)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={newBooking.preferredLanguage}
                    onChange={(e) => setNewBooking({ ...newBooking, preferredLanguage: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                  >
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                    Consultation Concern
                  </label>
                  <select
                    value={newBooking.reasonForVisit}
                    onChange={(e) => setNewBooking({ ...newBooking, reasonForVisit: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                  >
                    <option value="Psychiatric Consultation">General Psychiatric Consultation</option>
                    <option value="Anxiety & Stress Management">Anxiety & Stress Management</option>
                    <option value="Depression Treatment">Depression & Mood Disorder</option>
                    <option value="Sleep Disorder Evaluation">Sleep Disorder / Insomnia</option>
                    <option value="Addiction & De-addiction Guidance">Addiction / De-addiction Support</option>
                    <option value="Clinical Hypnotherapy">Clinical Hypnotherapy</option>
                    <option value="Headache & Neuro-Psychiatric Concern">Headache & Neuro-Psychiatric Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                  Additional Notes / Case History
                </label>
                <textarea
                  rows={3}
                  value={newBooking.additionalMessage}
                  onChange={(e) => setNewBooking({ ...newBooking, additionalMessage: e.target.value })}
                  placeholder="Notes from telephone discussion, referral details, or specific symptoms..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="px-4 py-2.5 rounded-xl border border-[#1B1F23]/15 text-xs font-semibold text-[#1B1F23]/70 hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0f233a] hover:bg-[#4A6B5D] text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#C5A880]" />
                  <span>Register &amp; Save Booking</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: SCHEDULE / CALENDAR DAY-BY-DAY                             */}
        {/* ================================================================= */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0f233a]">
                  Day-by-Day Client Schedule
                </h3>
                <p className="text-xs text-[#1B1F23]/60 mt-1">
                  Chronological view of consultations grouped by appointment date.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/15 text-xs font-semibold text-[#0f233a] hover:bg-[#EFE8DF] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#4A6B5D]" />
                <span>Export Schedule</span>
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-[#1B1F23]/60 italic py-6 text-center">
                No appointments scheduled currently.
              </p>
            ) : (
              <div className="space-y-6">
                {/* Group appointments by date */}
                {Array.from(new Set(appointments.map(a => a.preferredDate))).sort().map(dateStr => {
                  const dayAppointments = appointments.filter(a => a.preferredDate === dateStr);
                  const isToday = new Date().toISOString().slice(0, 10) === dateStr;

                  return (
                    <div key={dateStr} className="border border-[#1B1F23]/10 rounded-2xl overflow-hidden">
                      <div className={`p-3.5 px-4 flex items-center justify-between ${
                        isToday ? 'bg-[#0f233a] text-white' : 'bg-[#FAF8F5] text-[#0f233a]'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${isToday ? 'text-[#C5A880]' : 'text-[#4A6B5D]'}`} />
                          <span className="font-serif font-bold text-sm">
                            {dateStr}
                          </span>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A880] text-[#0f233a] uppercase">
                              Today
                            </span>
                          )}
                        </div>
                        <span className="text-xs opacity-80 font-medium">
                          {dayAppointments.length} client{dayAppointments.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="p-4 divide-y divide-[#1B1F23]/5 space-y-3">
                        {dayAppointments.map(apt => (
                          <div key={apt.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0f233a]">
                                  {apt.fullName}
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-[#C5A880] bg-[#0f233a] px-2 py-0.5 rounded">
                                  {apt.preferredTime}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#1B1F23]/70 font-semibold border border-[#1B1F23]/10">
                                  {apt.patientType}
                                </span>
                              </div>
                              <p className="text-[#1B1F23]/70">
                                {apt.reasonForVisit} • Lang: {apt.preferredLanguage}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <a
                                href={`tel:${apt.mobileNumber}`}
                                className="font-mono font-semibold text-[#0f233a] hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-[#4A6B5D]" />
                                {apt.mobileNumber}
                              </a>

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                apt.status === 'Pending Review'
                                  ? 'bg-amber-100 text-amber-900'
                                  : apt.status === 'Contacted / Scheduled'
                                  ? 'bg-blue-100 text-blue-900'
                                  : apt.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-rose-100 text-rose-900'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SUPABASE CLOUD DATABASE                                    */}
        {/* ================================================================= */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#1B1F23]/10">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${supabaseStatus.tableExists ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#0f233a]">
                      Supabase Cloud Storage: <span className="font-mono text-sm">{supabaseProjectId}</span>
                    </h3>
                    <p className="text-xs text-[#1B1F23]/60">
                      {supabaseStatus.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncCloud}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-[#0f233a] text-white text-xs font-semibold hover:bg-[#4A6B5D] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#C5A880] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Test & Sync Now'}</span>
                  </button>

                  <a
                    href={`https://supabase.com/dashboard/project/${supabaseProjectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl border border-[#1B1F23]/20 text-[#0f233a] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#4A6B5D]" />
                  </a>
                </div>
              </div>

              {supabaseStatus.lastSyncedAt && (
                <p className="text-[11px] text-[#1B1F23]/50">
                  Last verified: {supabaseStatus.lastSyncedAt}
                </p>
              )}
            </div>

            {/* SQL Table Creation Code */}
            <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#0f233a] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4A6B5D]" />
                    <span>Supabase Table SQL Script</span>
                  </h4>
                  <p className="text-xs text-[#1B1F23]/60 mt-0.5">
                    If you ever need to recreate or verify the <code className="font-mono bg-[#FAF8F5] px-1 py-0.5 rounded text-[11px]">appointments</code> table schema with Row Level Security:
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-[#4A6B5D] hover:bg-[#3b574a] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-[#1B1F23]/10">
                <pre className="p-4 bg-[#0a1626] text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-56">
                  {supabaseSqlScript}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: OPD TIMINGS                                                */}
        {/* ================================================================= */}
        {activeTab === 'timings' && (
          <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0f233a]">
                OPD Schedule &amp; Timings Configuration
              </h3>
              <p className="text-xs text-[#1B1F23]/60 mt-1">
                Configure opening days and session timings visible to patients across the website.
              </p>
            </div>

            <div className="space-y-3">
              {timings.map((t) => (
                <div
                  key={t.day}
                  className="p-3.5 rounded-xl border border-[#1B1F23]/10 bg-[#FAF8F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`day-${t.day}`}
                      checked={t.isOpen}
                      onChange={(e) => updateDayTiming(t.day, { isOpen: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0f233a] cursor-pointer"
                    />
                    <label htmlFor={`day-${t.day}`} className="font-bold text-xs text-[#0f233a] w-28 cursor-pointer">
                      {t.day}
                    </label>
                  </div>

                  {t.isOpen ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full sm:w-auto">
                      <div>
                        <span className="text-[10px] text-[#1B1F23]/50 block">Morning Hours</span>
                        <input
                          type="text"
                          value={t.morningHours}
                          onChange={(e) => updateDayTiming(t.day, { morningHours: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1B1F23]/15 bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#1B1F23]/50 block">Evening Hours</span>
                        <input
                          type="text"
                          value={t.eveningHours}
                          onChange={(e) => updateDayTiming(t.day, { eveningHours: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1B1F23]/15 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-rose-700 italic font-semibold px-2 py-1">
                      Closed on {t.day}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => showNotice('Clinic timing preferences saved.')}
                className="px-5 py-2 rounded-xl bg-[#0f233a] text-white text-xs font-bold hover:bg-[#4A6B5D] transition-colors"
              >
                Save Timings
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: CLINIC SETTINGS & ANNOUNCEMENT                              */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Info */}
            <form onSubmit={handleSaveContact} className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f233a]">
                  Clinic Contact Details
                </h3>
                <p className="text-xs text-[#1B1F23]/60">
                  Update primary phone, WhatsApp, and clinic address.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                  Desk Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                  WhatsApp Support Number
                </label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                  Clinic Physical Address
                </label>
                <textarea
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0f233a] text-white text-xs font-bold hover:bg-[#4A6B5D] transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Update Contact Details</span>
                </button>
              </div>
            </form>

            {/* Announcement Banner */}
            <form onSubmit={handleSaveAnnouncement} className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0f233a]">
                  Website Top Announcement Notice
                </h3>
                <p className="text-xs text-[#1B1F23]/60">
                  Broadcast clinic announcements, holiday closures, or emergency notices.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ann-toggle"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0f233a] cursor-pointer"
                />
                <label htmlFor="ann-toggle" className="text-xs font-semibold text-[#0f233a] cursor-pointer">
                  Activate Announcement Banner on Website
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] mb-1">
                  Notice Text
                </label>
                <textarea
                  rows={4}
                  value={editAnnouncement}
                  onChange={(e) => setEditAnnouncement(e.target.value)}
                  placeholder="e.g. Clinic remains open on Sunday 10:00 AM – 01:00 PM for special consultations."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#1B1F23]/20 bg-[#FAF8F5] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0f233a] text-white text-xs font-bold hover:bg-[#4A6B5D] transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Update Banner</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset demo client records and clinic details to initial default state?')) {
                      resetToDefaults();
                      showNotice('System reset to defaults.');
                    }
                  }}
                  className="text-xs text-[#1B1F23]/50 hover:text-rose-700"
                >
                  Reset Demo Data
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: NETLIFY & GITHUB DEPLOYMENT GUIDE                          */}
        {/* ================================================================= */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            {/* Header & Status Card */}
            <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1B1F23]/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00c7b7] to-[#0f233a] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-2xl font-bold text-[#0f233a]">
                        Deploy Website to Netlify using GitHub
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00c7b7]/15 text-[#008f84] border border-[#00c7b7]/30">
                        Netlify Ready
                      </span>
                    </div>
                    <p className="text-xs text-[#1B1F23]/70 mt-1 max-w-2xl leading-relaxed">
                      Connect your GitHub repository to Netlify for lightning-fast edge CDN hosting, free automated SSL certificates, instant previews, and continuous deployment whenever you commit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://app.netlify.com/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00c7b7] text-[#0f233a] font-bold text-xs shadow-sm hover:bg-[#00b3a4] transition-colors"
                  >
                    <span>Open Netlify App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Ready Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-6">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>netlify.toml Created</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    Pre-configured with <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">build = "npm run build"</code> and <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">publish = "dist"</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>SPA 200 Rewrite Rules</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">public/_redirects</code> ensures direct URL hits and page refreshes never return 404 errors.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Vite Base Configured</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    Asset URLs resolve relatively (<code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">base: './'</code>), compatible with root domains and subpaths.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Supabase Cloud Sync</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    Appointment bookings write directly to the Supabase cloud table from any production domain.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Subtabs */}
            <div className="flex items-center gap-2 border-b border-[#1B1F23]/10 pb-2">
              <button
                type="button"
                onClick={() => setDeployTab('netlify')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  deployTab === 'netlify'
                    ? 'bg-[#0f233a] text-white shadow-sm'
                    : 'bg-white text-[#1B1F23]/70 hover:bg-[#FAF8F5] border border-[#1B1F23]/10'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-[#00c7b7]" />
                <span>Netlify via GitHub (Recommended)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#00c7b7] text-[#0f233a] font-bold">Fastest</span>
              </button>

              <button
                type="button"
                onClick={() => setDeployTab('github-pages')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  deployTab === 'github-pages'
                    ? 'bg-[#0f233a] text-white shadow-sm'
                    : 'bg-white text-[#1B1F23]/70 hover:bg-[#FAF8F5] border border-[#1B1F23]/10'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Pages (Actions CI/CD)</span>
              </button>
            </div>

            {/* SUBTAB 1: NETLIFY VIA GITHUB */}
            {deployTab === 'netlify' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main 4 Steps */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-7 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1B1F23]/10">
                    <h4 className="font-serif text-lg font-bold text-[#0f233a] flex items-center gap-2">
                      <span>4 Simple Steps to Deploy on Netlify using GitHub</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      Zero Config Needed
                    </span>
                  </div>

                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#0f233a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#0f233a] text-sm">Push this repository to GitHub</strong>
                        <button
                          type="button"
                          onClick={() => {
                            const cmds = `git init\ngit add .\ngit commit -m "Deploy Sai Shradhdha Clinic to Netlify"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git\ngit push -u origin main`;
                            navigator.clipboard.writeText(cmds);
                            setCopiedCmd('git-netlify');
                            setTimeout(() => setCopiedCmd(null), 3000);
                          }}
                          className="text-[11px] text-[#4A6B5D] hover:underline font-bold flex items-center gap-1"
                        >
                          {copiedCmd === 'git-netlify' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedCmd === 'git-netlify' ? 'Copied Git Commands!' : 'Copy Commands'}
                        </button>
                      </div>
                      <p className="text-xs text-[#1B1F23]/70">
                        Create a repository at <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#4A6B5D] underline font-semibold">github.com/new</a> and run these terminal commands in your project folder:
                      </p>
                      <div className="rounded-xl overflow-hidden border border-[#1B1F23]/10 bg-[#0a1626] p-3 text-[11px] font-mono text-emerald-300 space-y-1">
                        <p className="text-white/40"># Initialize, add all files and commit</p>
                        <p>git init</p>
                        <p>git add .</p>
                        <p>git commit -m "Deploy Sai Shradhdha Clinic to Netlify"</p>
                        <p className="text-white/40 pt-1"># Connect your GitHub repository</p>
                        <p>git branch -M main</p>
                        <p className="text-amber-300">git remote add origin https://github.com/<span className="underline">YOUR_USERNAME</span>/<span className="underline">YOUR_REPO_NAME</span>.git</p>
                        <p className="text-white/40 pt-1"># Push code</p>
                        <p>git push -u origin main</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#0f233a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1.5">
                      <strong className="text-[#0f233a] text-sm block">Connect GitHub in Netlify Dashboard</strong>
                      <p className="text-xs text-[#1B1F23]/70 leading-relaxed">
                        Go to <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-[#4A6B5D] underline font-semibold">app.netlify.com</a>, log in (use <strong>Log in with GitHub</strong>), then click the blue <strong>"Add new site"</strong> button and pick <strong>"Import an existing project"</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#0f233a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1.5 w-full">
                      <strong className="text-[#0f233a] text-sm block">Choose your repository (Auto-Configured)</strong>
                      <p className="text-xs text-[#1B1F23]/70 leading-relaxed">
                        Select your clinic repo. Because this project contains <code className="bg-[#FAF8F5] px-1 py-0.5 rounded font-mono font-bold text-[#0f233a]">netlify.toml</code>, Netlify will auto-fill everything:
                      </p>
                      <div className="bg-[#FAF8F5] border border-[#1B1F23]/10 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-[#1B1F23]/50 block font-sans text-[10px]">Build Command</span>
                          <span className="font-bold text-[#0f233a]">npm run build</span>
                        </div>
                        <div>
                          <span className="text-[#1B1F23]/50 block font-sans text-[10px]">Publish Directory</span>
                          <span className="font-bold text-[#0f233a]">dist</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#00c7b7] text-[#0f233a] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                      4
                    </div>
                    <div className="space-y-1.5">
                      <strong className="text-[#0f233a] text-sm block">Click "Deploy site"</strong>
                      <p className="text-xs text-[#1B1F23]/70 leading-relaxed">
                        Netlify builds your production package in ~25 seconds and generates a free SSL URL (e.g. <code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">https://sai-shradhdha-clinic.netlify.app</code>). Every future <code className="font-mono text-[10px]">git push</code> will auto-deploy!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Info Cards */}
                <div className="space-y-4">
                  {/* Quick Action Button */}
                  <div className="bg-[#0f233a] text-white rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-[#00c7b7] text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>Ready to Deploy</span>
                    </div>
                    <h5 className="font-serif text-base font-bold text-white leading-tight">
                      One-click Netlify Import
                    </h5>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Click below to open Netlify's direct repository importer and authorize your GitHub account.
                    </p>
                    <a
                      href="https://app.netlify.com/start"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00c7b7] text-[#0f233a] font-bold text-xs hover:bg-[#00b3a4] transition-colors shadow"
                    >
                      <span>Deploy on Netlify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Custom Domain Card */}
                  <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-[#0f233a] font-serif font-bold text-sm">
                      <Globe className="w-4 h-4 text-[#C5A880]" />
                      <span>Custom Clinic Domain</span>
                    </div>
                    <p className="text-xs text-[#1B1F23]/70 leading-relaxed">
                      Netlify provides free automated SSL for your own custom domain (e.g. <span className="font-semibold text-[#0f233a]">drrenishbhatt.com</span> or <span className="font-semibold text-[#0f233a]">mindcareclinic.in</span>).
                    </p>
                    <p className="text-[11px] text-[#1B1F23]/60 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#1B1F23]/10">
                      In Netlify: Go to <strong>Site configuration</strong> → <strong>Domain management</strong> → <strong>Add domain</strong>.
                    </p>
                  </div>

                  {/* Alternative: Netlify CLI */}
                  <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#0f233a] font-serif font-bold text-sm">
                        <Terminal className="w-4 h-4 text-[#4A6B5D]" />
                        <span>Deploy via Netlify CLI</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('npx netlify deploy --prod');
                          setCopiedCmd('npx-cli');
                          setTimeout(() => setCopiedCmd(null), 3000);
                        }}
                        className="text-[10px] text-[#4A6B5D] font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedCmd === 'npx-cli' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedCmd === 'npx-cli' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-[#1B1F23]/70">
                      If you have Node.js installed, you can also deploy instantly from your terminal without pushing to GitHub first:
                    </p>
                    <div className="bg-[#0a1626] text-emerald-300 font-mono text-[10px] p-2.5 rounded-xl space-y-1">
                      <p className="text-white/40"># 1. Build dist</p>
                      <p>npm run build</p>
                      <p className="text-white/40 pt-1"># 2. Deploy to production</p>
                      <p className="text-amber-300">npx netlify deploy --prod --dir=dist</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: GITHUB PAGES */}
            {deployTab === 'github-pages' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-7 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0f233a]/10 flex items-center justify-center font-bold text-xs text-[#0f233a]">
                        1
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                        Deploy to GitHub Pages with GitHub Actions
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Built-in CI/CD
                    </span>
                  </div>

                  <div className="space-y-4 text-xs text-[#1B1F23]/80 leading-relaxed">
                    <div>
                      <strong className="text-[#0f233a] block">Step 1: Push code to GitHub</strong>
                      <p className="text-[#1B1F23]/70 mt-1">
                        Run the terminal commands to push your project to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#4A6B5D] font-bold underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a>.
                      </p>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-[#1B1F23]/10 bg-[#0a1626] p-3 text-[11px] font-mono text-emerald-300 space-y-1">
                      <p className="text-white/40"># Git commands</p>
                      <p>git init</p>
                      <p>git add .</p>
                      <p>git commit -m "Initial clinic deployment"</p>
                      <p>git branch -M main</p>
                      <p className="text-amber-300">git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git</p>
                      <p>git push -u origin main</p>
                    </div>

                    <div>
                      <strong className="text-[#0f233a] block">Step 2: Enable GitHub Pages in Repo Settings</strong>
                      <ol className="list-decimal list-inside space-y-1 mt-1 pl-1 text-[11px] text-[#1B1F23]/70">
                        <li>Open your repository on GitHub.</li>
                        <li>Click <strong>Settings</strong> (top tab) → <strong>Pages</strong> (left menu).</li>
                        <li>Under <strong>Build and deployment</strong> → <strong>Source</strong>, select <span className="font-bold text-[#0f233a]">GitHub Actions</span>.</li>
                      </ol>
                    </div>

                    <div className="text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px]">
                      ✨ The included workflow file (<code className="font-bold">.github/workflows/deploy.yml</code>) will automatically build and publish to: <br />
                      <code className="font-bold block mt-1">https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/</code>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-7 shadow-sm space-y-4">
                  <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                    Why Choose Netlify vs GitHub Pages?
                  </h4>
                  <div className="space-y-3 text-xs text-[#1B1F23]/75 leading-relaxed">
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                      <strong className="text-teal-950 block font-bold mb-0.5">Netlify Advantages</strong>
                      <p className="text-teal-900/80 text-[11px]">
                        1-click setup, instantaneous Edge CDN caching, clean URLs without subpath prefixing, built-in forms, instant rollback, and custom domains with free Let's Encrypt certificates.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#1B1F23]/10">
                      <strong className="text-[#0f233a] block font-bold mb-0.5">GitHub Pages Advantages</strong>
                      <p className="text-[#1B1F23]/70 text-[11px]">
                        Completely hosted inside GitHub without needing an external account, powered by GitHub Actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supabase Environment Variables Reference */}
            <div className="bg-white rounded-2xl border border-[#1B1F23]/10 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#0f233a]">
                    Supabase Environment Variables (Optional)
                  </h4>
                  <p className="text-xs text-[#1B1F23]/60 mt-0.5">
                    These keys are already safely packaged into the client code, but you can also configure them in Netlify's <strong>Site configuration → Environment variables</strong>:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-[#1B1F23]/10 bg-[#FAF8F5] flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="font-mono font-bold text-[#0f233a] block">VITE_SUPABASE_URL</span>
                    <span className="text-[11px] text-[#1B1F23]/60 font-mono truncate block mt-0.5">
                      https://pbivgyyylvgupudempjp.supabase.co
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://pbivgyyylvgupudempjp.supabase.co');
                      setCopiedCmd('url');
                      setTimeout(() => setCopiedCmd(null), 2500);
                    }}
                    className="p-1.5 rounded-lg border border-[#1B1F23]/10 bg-white hover:bg-[#FAF8F5] text-[#1B1F23]/70 flex-shrink-0"
                    title="Copy URL"
                  >
                    {copiedCmd === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-[#1B1F23]/10 bg-[#FAF8F5] flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="font-mono font-bold text-[#0f233a] block">VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-[11px] text-[#1B1F23]/60 font-mono truncate block mt-0.5">
                      sb_publishable_GHjIsado2stkeAF3GXkgHA_D5U4tyyv
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('sb_publishable_GHjIsado2stkeAF3GXkgHA_D5U4tyyv');
                      setCopiedCmd('key');
                      setTimeout(() => setCopiedCmd(null), 2500);
                    }}
                    className="p-1.5 rounded-lg border border-[#1B1F23]/10 bg-white hover:bg-[#FAF8F5] text-[#1B1F23]/70 flex-shrink-0"
                    title="Copy Key"
                  >
                    {copiedCmd === 'key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
