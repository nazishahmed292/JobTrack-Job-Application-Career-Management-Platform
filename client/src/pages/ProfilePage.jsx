import { useEffect, useState } from 'react';
import { ExternalLink, Github, Globe2, Linkedin, MapPin, Save, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: '',
    professionalSummary: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const profile = response.data.user;
        setForm({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location || '',
          githubUrl: profile.githubUrl || '',
          linkedinUrl: profile.linkedinUrl || '',
          portfolioUrl: profile.portfolioUrl || '',
          skills: (profile.skills || []).join(', '),
          professionalSummary: profile.professionalSummary || '',
        });
      } catch (requestError) {
        console.error(requestError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      const response = await api.put('/users/profile', {
        ...form,
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setUser(response.data.user);
      setFeedback('Your profile has been updated.');
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = form.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'JT';
  const skills = form.skills.split(',').map((skill) => skill.trim()).filter(Boolean);

  if (loading) return <div className="space-y-5" aria-label="Loading profile"><div className="skeleton h-32 rounded-lg" /><div className="skeleton h-[420px] rounded-lg" /></div>;
  if (error) return <div className="card p-9 text-center"><p className="font-semibold text-[var(--text)]">Your profile could not be loaded</p><p className="mt-1 text-sm text-[var(--muted)]">Please refresh and try again.</p><button className="button-secondary mt-4" onClick={() => window.location.reload()}>Try again</button></div>;

  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">About you</p><h1>Career profile</h1><p className="mt-2 text-sm">Make it easy to keep your professional story current.</p></div>

      <section className="card overflow-hidden">
        <div className="h-24 bg-[linear-gradient(100deg,#e9ecff,#f2f3fa_48%,#e9f1ee)] dark:bg-[linear-gradient(100deg,#292e49,#272a32_48%,#25332e)]" />
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:px-6">
          <div className="-mt-9 flex h-[76px] w-[76px] items-center justify-center rounded-xl border-4 border-[var(--panel)] bg-[#dfe4ff] text-xl font-bold text-[#485ac4] shadow-sm">{initials}</div>
          <div className="min-w-0 flex-1"><h2 className="text-lg font-bold text-[var(--text)]">{form.fullName || 'Your name'}</h2><div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]"><span>{form.email}</span>{form.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{form.location}</span>}</div></div>
          <div className="flex flex-wrap gap-2">{form.githubUrl && <a aria-label="GitHub profile" title="GitHub profile" className="button-secondary !p-2" href={form.githubUrl} target="_blank" rel="noreferrer"><Github size={15} /></a>}{form.linkedinUrl && <a aria-label="LinkedIn profile" title="LinkedIn profile" className="button-secondary !p-2" href={form.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={15} /></a>}{form.portfolioUrl && <a aria-label="Portfolio" title="Portfolio" className="button-secondary !p-2" href={form.portfolioUrl} target="_blank" rel="noreferrer"><Globe2 size={15} /></a>}</div>
        </div>
      </section>

      {feedback && <div role="status" className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)]"><span>{feedback}</span><button aria-label="Dismiss message" onClick={() => setFeedback('')}><X size={15} /></button></div>}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
        <form onSubmit={handleSubmit} className="card p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]"><UserRound size={17} /></span><div><h2 className="text-base font-bold text-[var(--text)]">Personal information</h2><p className="mt-1 text-xs text-[var(--muted)]">Basic details and professional summary.</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[var(--text)]">Full name<input className="input mt-1.5" name="fullName" value={form.fullName} onChange={handleChange} required /></label>
            <label className="block text-xs font-semibold text-[var(--text)]">Email address<input className="input mt-1.5 opacity-70" type="email" name="email" value={form.email} readOnly aria-describedby="profile-email-note" /><span id="profile-email-note" className="mt-1 block text-[10px] font-normal text-[var(--muted)]">Managed through your account.</span></label>
            <label className="block text-xs font-semibold text-[var(--text)]">Phone<input className="input mt-1.5" type="tel" name="phone" value={form.phone} onChange={handleChange} /></label>
            <label className="block text-xs font-semibold text-[var(--text)]">Location<input className="input mt-1.5" name="location" value={form.location} onChange={handleChange} placeholder="City, country or remote" /></label>
            <label className="block text-xs font-semibold text-[var(--text)]">GitHub URL<input className="input mt-1.5" type="url" name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." /></label>
            <label className="block text-xs font-semibold text-[var(--text)]">LinkedIn URL<input className="input mt-1.5" type="url" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." /></label>
            <label className="block text-xs font-semibold text-[var(--text)] sm:col-span-2">Portfolio URL<input className="input mt-1.5" type="url" name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} placeholder="https://yourportfolio.com" /></label>
            <label className="block text-xs font-semibold text-[var(--text)] sm:col-span-2">Professional summary<textarea className="textarea mt-1.5 min-h-[120px] leading-6" name="professionalSummary" value={form.professionalSummary} onChange={handleChange} placeholder="A few lines about your experience, strengths, and the work you enjoy." /></label>
            <label className="block text-xs font-semibold text-[var(--text)] sm:col-span-2">Skills <span className="font-normal text-[var(--muted)]">(comma-separated)</span><input className="input mt-1.5" name="skills" value={form.skills} onChange={handleChange} placeholder="React, product strategy, SQL..." /></label>
          </div>
          <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4"><button type="submit" className="button-primary" disabled={saving}><Save size={15} />{saving ? 'Saving...' : 'Save profile'}</button></div>
        </form>

        <aside className="space-y-4">
          <section className="card p-4 sm:p-5"><h2 className="text-sm font-bold text-[var(--text)]">Professional summary</h2><p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-[var(--muted)]">{form.professionalSummary || 'Your summary will appear here once you add it.'}</p></section>
          <section className="card p-4 sm:p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[var(--text)]">Skills</h2><span className="text-[10px] text-[var(--muted)]">{skills.length} listed</span></div><div className="mt-3 flex flex-wrap gap-1.5">{skills.length ? skills.map((skill) => <span key={skill} className="rounded-md bg-[var(--panel-strong)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text)]">{skill}</span>) : <p className="text-xs text-[var(--muted)]">Add skills to help tailor your job search.</p>}</div></section>
          <p className="flex items-center gap-2 px-1 text-[10px] leading-4 text-[var(--muted)]"><ExternalLink size={13} /> Social URLs open in a new tab.</p>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
