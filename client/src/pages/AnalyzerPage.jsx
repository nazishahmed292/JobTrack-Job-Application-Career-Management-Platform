import { useState } from 'react';
import { AlertCircle, ArrowRight, Check, ClipboardCheck, FileSearch, Lightbulb, LoaderCircle, Search, Sparkles, X } from 'lucide-react';
import api from '../services/api';

const AnalyzerPage = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [profileSkills, setProfileSkills] = useState('React, JavaScript, Node.js, MongoDB, Tailwind');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/analyzer/job-description', {
        jobDescription,
        profileSkills: profileSkills.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setResult(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError('We could not analyze this description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const matchingSkills = result?.matches?.matchingSkills || [];
  const missingSkills = result?.matches?.missingSkills || [];
  const matchPercentage = result?.matches?.matchPercentage || 0;

  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Role fit</p><h1>Job description analyzer</h1><p className="mt-2 text-sm">Compare your skills with a role&apos;s requirements before you apply.</p></div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <form onSubmit={handleAnalyze} className="card p-4 sm:p-5">
          <div className="mb-5 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]"><FileSearch size={17} /></span><div><h2 className="text-base font-bold text-[var(--text)]">Job description</h2><p className="mt-1 text-xs text-[var(--muted)]">Paste the role details to identify relevant skills.</p></div></div>
          <label htmlFor="job-description" className="sr-only">Job description</label><textarea id="job-description" required minLength={40} className="textarea min-h-[280px] resize-y text-sm leading-6" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the full job description here..." />
          <div className="mt-4"><label htmlFor="profile-skills" className="mb-2 block text-xs font-semibold text-[var(--text)]">Your skills <span className="font-normal text-[var(--muted)]">(comma-separated)</span></label><input id="profile-skills" className="input" value={profileSkills} onChange={(event) => setProfileSkills(event.target.value)} placeholder="React, product design, SQL..." /></div>
          {error && <div role="alert" className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"><AlertCircle size={15} />{error}</div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4"><span className="text-[11px] text-[var(--muted)]">{jobDescription.trim().split(/\s+/).filter(Boolean).length} words</span><button type="submit" className="button-primary" disabled={loading || jobDescription.trim().length < 40}>{loading ? <LoaderCircle size={15} className="animate-spin" /> : <Sparkles size={15} />}{loading ? 'Analyzing...' : 'Analyze match'}</button></div>
        </form>

        <section aria-live="polite" className="card min-h-[440px] p-4 sm:p-5">
          {loading ? <div className="space-y-5" aria-label="Analyzing job description"><div className="skeleton h-32 rounded-lg" /><div className="skeleton h-24 rounded-lg" /><div className="skeleton h-32 rounded-lg" /></div> : result ? <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-[7px] border-[var(--primary-soft)] text-[var(--primary)]" style={{ background: `conic-gradient(var(--primary) ${matchPercentage}%, var(--panel-strong) 0)` }}><span className="flex h-[66px] w-[66px] flex-col items-center justify-center rounded-full bg-[var(--panel)]"><strong className="text-xl leading-none">{matchPercentage}%</strong><span className="mt-1 text-[9px] text-[var(--muted)]">match</span></span></div><div><div className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">Skills match</div><h2 className="mt-1 text-lg font-bold text-[var(--text)]">{matchPercentage >= 70 ? 'Strong alignment' : matchPercentage >= 40 ? 'Some overlap' : 'Room to build'}</h2><p className="mt-1 max-w-sm text-xs leading-5 text-[var(--muted)]">{matchingSkills.length} matching skills from {result.extractedSkills?.length || 0} identified in this listing.</p></div></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-emerald-200/70 bg-emerald-50/60 p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-800"><Check size={14} /> Matching skills <span className="ml-auto rounded bg-white/70 px-1.5 py-0.5 text-[10px]">{matchingSkills.length}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{matchingSkills.length ? matchingSkills.map((skill) => <span key={skill} className="rounded bg-white px-2 py-1 text-[10px] font-medium text-emerald-800">{skill}</span>) : <span className="text-[11px] text-emerald-800/70">No direct matches found</span>}</div></div>
              <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-amber-900"><Lightbulb size={14} /> Skills to highlight <span className="ml-auto rounded bg-white/70 px-1.5 py-0.5 text-[10px]">{missingSkills.length}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{missingSkills.length ? missingSkills.map((skill) => <span key={skill} className="rounded bg-white px-2 py-1 text-[10px] font-medium text-amber-900">{skill}</span>) : <span className="text-[11px] text-amber-900/70">No gaps identified</span>}</div></div></div>
            {result.experienceRequirements?.length > 0 && <div><h3 className="text-xs font-semibold text-[var(--text)]">Experience signals</h3><div className="mt-2 flex flex-wrap gap-2">{result.experienceRequirements.map((item) => <span key={item} className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-[11px] text-[var(--muted)]">{item}</span>)}</div></div>}
            {result.educationRequirements?.length > 0 && <div><h3 className="text-xs font-semibold text-[var(--text)]">Education signals</h3><div className="mt-2 flex flex-wrap gap-2">{result.educationRequirements.map((item) => <span key={item} className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-[11px] text-[var(--muted)]">{item}</span>)}</div></div>}
            {!!result.keywords?.length && <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--text)]"><Search size={13} /> Keywords found</div><div className="flex flex-wrap gap-1.5">{result.keywords.slice(0, 20).map((keyword) => <span key={keyword} className="rounded bg-[var(--panel-strong)] px-2 py-1 text-[10px] text-[var(--muted)]">{keyword}</span>)}</div></div>}
            <div className="flex items-start gap-2 border-t border-[var(--border)] pt-4 text-[10px] leading-4 text-[var(--muted)]"><ClipboardCheck size={14} className="mt-0.5 shrink-0" />Use this as a guide when tailoring your application. Skills are matched against the profile list you provided.</div>
          </div> : <div className="flex min-h-[390px] flex-col items-center justify-center px-6 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--panel-strong)] text-[var(--muted)]"><FileSearch size={22} /></span><h2 className="mt-4 text-sm font-bold text-[var(--text)]">Your match report will appear here</h2><p className="mt-2 max-w-xs text-xs leading-5 text-[var(--muted)]">Add a job description and your skills to see relevant matches, gaps, and role keywords.</p><div className="mt-5 flex items-center gap-2 text-[10px] text-[var(--muted)]"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--panel-strong)]">1</span> Paste role <ArrowRight size={12} /><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--panel-strong)]">2</span> Review fit</div></div>}
        </section>
      </div>
    </div>
  );
};

export default AnalyzerPage;
