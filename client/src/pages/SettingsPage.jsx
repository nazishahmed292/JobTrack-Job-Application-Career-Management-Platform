import { useEffect, useState } from 'react';
import { Bell, Check, LockKeyhole, Moon, Sun, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SettingsPage = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [accountForm, setAccountForm] = useState({ fullName: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [prefForm, setPrefForm] = useState({ theme: localStorage.getItem('jobtrack_theme') || 'light', emailNotifications: true, interviewReminders: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/users/profile');
        const profile = response.data.user;
        setAccountForm({ fullName: profile.fullName || '', email: profile.email || '' });
        if (profile.preferences) {
          setPrefForm((current) => ({ ...current, ...profile.preferences }));
          document.documentElement.classList.toggle('dark', profile.preferences.theme === 'dark');
          localStorage.setItem('jobtrack_theme', profile.preferences.theme);
          window.dispatchEvent(new CustomEvent('jobtrack-theme-change', { detail: profile.preferences.theme }));
        }
      } catch (requestError) {
        console.error(requestError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    setSaving('account');
    try {
      const currentProfile = await api.get('/users/profile');
      const profile = currentProfile.data.user;
      const response = await api.put('/users/profile', {
        fullName: accountForm.fullName,
        phone: profile.phone || '',
        location: profile.location || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        skills: profile.skills || [],
        professionalSummary: profile.professionalSummary || '',
      });
      setUser(response.data.user);
      setFeedback('Account details updated.');
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not update your account. Please try again.');
    } finally { setSaving(''); }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFeedback('Your new passwords do not match.');
      return;
    }
    setSaving('password');
    try {
      await api.put('/users/password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFeedback('Password changed successfully.');
    } catch (requestError) {
      console.error(requestError);
      setFeedback(requestError.response?.data?.message || 'We could not change your password. Please try again.');
    } finally { setSaving(''); }
  };

  const handlePreferencesSubmit = async (event) => {
    event.preventDefault();
    setSaving('preferences');
    try {
      const response = await api.put('/users/preferences', prefForm);
      const savedTheme = response.data.preferences?.theme || prefForm.theme;
      setPrefForm((current) => ({ ...current, ...response.data.preferences }));
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      localStorage.setItem('jobtrack_theme', savedTheme);
      window.dispatchEvent(new CustomEvent('jobtrack-theme-change', { detail: savedTheme }));
      setFeedback('Preferences saved.');
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not save your preferences. Please try again.');
    } finally { setSaving(''); }
  };

  if (loading) return <div className="space-y-4" aria-label="Loading settings"><div className="skeleton h-14 w-64 rounded-lg" /><div className="skeleton h-24 rounded-lg" /><div className="skeleton h-56 rounded-lg" /></div>;
  if (error) return <div className="card p-9 text-center"><p className="font-semibold text-[var(--text)]">Settings could not be loaded</p><p className="mt-1 text-sm text-[var(--muted)]">Please try again.</p><button className="button-secondary mt-4" onClick={() => window.location.reload()}>Try again</button></div>;

  const settingsNav = [{ id: 'account', label: 'Account', icon: UserRound }, { id: 'security', label: 'Security', icon: LockKeyhole }, { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'appearance', label: 'Appearance', icon: Sun }];
  const toggle = (label, name, checked) => <label key={name} className="flex cursor-pointer items-center justify-between gap-4"><span className="min-w-0"><span className="block text-sm font-medium text-[var(--text)]">{label}</span><span className="mt-0.5 block text-xs text-[var(--muted)]">{name === 'emailNotifications' ? 'Receive important account updates by email.' : 'Get a reminder before scheduled interviews.'}</span></span><span className="relative inline-flex h-6 w-11 shrink-0 items-center"><input className="peer sr-only" type="checkbox" checked={checked} onChange={(event) => setPrefForm((current) => ({ ...current, [name]: event.target.checked }))} /><span className="absolute inset-0 rounded-full bg-[var(--panel-strong)] transition peer-checked:bg-[var(--primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--primary)] peer-focus-visible:ring-offset-2" /><span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" /></span></label>;

  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Preferences</p><h1>Settings</h1><p className="mt-2 text-sm">Manage your account, security, and workspace preferences.</p></div>
      {feedback && <div role="status" className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)]"><span>{feedback}</span><button aria-label="Dismiss message" onClick={() => setFeedback('')}><X size={15} /></button></div>}

      <div className="grid items-start gap-5 lg:grid-cols-[190px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--panel)] p-1.5 lg:sticky lg:top-24 lg:flex-col">
          {settingsNav.map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--panel-strong)] hover:text-[var(--text)]"><Icon size={15} />{label}</a>)}
        </nav>

        <div className="min-w-0 space-y-5">
          <form id="account" className="card scroll-mt-24 p-4 sm:p-6" onSubmit={handleAccountSubmit}>
            <div className="mb-5"><h2 className="text-base font-bold text-[var(--text)]">Account</h2><p className="mt-1 text-xs text-[var(--muted)]">Manage the details associated with your profile.</p></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-[var(--text)]">Full name<input required className="input mt-1.5" value={accountForm.fullName} onChange={(event) => setAccountForm({ ...accountForm, fullName: event.target.value })} /></label><label className="block text-xs font-semibold text-[var(--text)]">Email address<input type="email" readOnly className="input mt-1.5 opacity-70" value={accountForm.email} /><span className="mt-1 block text-[10px] font-normal text-[var(--muted)]">Email changes are not available here.</span></label></div>
            <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4"><button className="button-primary" disabled={saving === 'account'}>{saving === 'account' ? 'Saving...' : 'Save account'}</button></div>
          </form>

          <form id="security" className="card scroll-mt-24 p-4 sm:p-6" onSubmit={handlePasswordSubmit}>
            <div className="mb-5 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><LockKeyhole size={16} /></span><div><h2 className="text-base font-bold text-[var(--text)]">Password & security</h2><p className="mt-1 text-xs text-[var(--muted)]">Choose a unique password with at least 8 characters.</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-[var(--text)] sm:col-span-2">Current password<input required type="password" autoComplete="current-password" className="input mt-1.5" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} /></label><label className="block text-xs font-semibold text-[var(--text)]">New password<input required minLength={8} type="password" autoComplete="new-password" className="input mt-1.5" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} /></label><label className="block text-xs font-semibold text-[var(--text)]">Confirm new password<input required minLength={8} type="password" autoComplete="new-password" className="input mt-1.5" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} /></label></div>
            <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4"><button className="button-primary" disabled={saving === 'password'}>{saving === 'password' ? 'Updating...' : 'Update password'}</button></div>
          </form>

          <form id="notifications" className="card scroll-mt-24 p-4 sm:p-6" onSubmit={handlePreferencesSubmit}>
            <div className="mb-5 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><Bell size={16} /></span><div><h2 className="text-base font-bold text-[var(--text)]">Notifications</h2><p className="mt-1 text-xs text-[var(--muted)]">Choose which updates you would like to receive.</p></div></div>
            <div className="space-y-5">{toggle('Email notifications', 'emailNotifications', prefForm.emailNotifications)}<div className="border-t border-[var(--border)]" />{toggle('Interview reminders', 'interviewReminders', prefForm.interviewReminders)}</div>
            <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4"><button className="button-primary" disabled={saving === 'preferences'}>{saving === 'preferences' ? 'Saving...' : 'Save preferences'}</button></div>
          </form>

          <form id="appearance" className="card scroll-mt-24 p-4 sm:p-6" onSubmit={handlePreferencesSubmit}>
            <div className="mb-5 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-700"><Sun size={16} /></span><div><h2 className="text-base font-bold text-[var(--text)]">Appearance</h2><p className="mt-1 text-xs text-[var(--muted)]">Choose the theme that works best for you.</p></div></div>
            <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Color theme">{[{ value: 'light', label: 'Light', icon: Sun }, { value: 'dark', label: 'Dark', icon: Moon }].map(({ value, label, icon: Icon }) => <button key={value} type="button" aria-pressed={prefForm.theme === value} onClick={() => setPrefForm((current) => ({ ...current, theme: value }))} className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${prefForm.theme === value ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-[var(--border)] hover:bg-[var(--panel-soft)]'}`}><span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--panel)] text-[var(--primary)]"><Icon size={17} /></span><span className="flex-1 text-sm font-semibold text-[var(--text)]">{label} mode</span>{prefForm.theme === value && <Check size={16} className="text-[var(--primary)]" />}</button>)}</div>
            <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4"><button className="button-primary" disabled={saving === 'preferences'}>{saving === 'preferences' ? 'Saving...' : 'Save appearance'}</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
