import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, ExternalLink, Plus, Trash2, UserRound, Video, X } from 'lucide-react';
import api from '../services/api';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ application: '', interviewType: 'Phone', date: '', time: '', meetingUrl: '', interviewer: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [interviewsRes, applicationsRes] = await Promise.all([api.get('/interviews'), api.get('/applications')]);
      setInterviews(interviewsRes.data.interviews || []);
      setApplications(applicationsRes.data.applications || []);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/interviews', form);
      setForm({ application: '', interviewType: 'Phone', date: '', time: '', meetingUrl: '', interviewer: '', notes: '' });
      setFeedback('Interview scheduled.');
      await fetchData();
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not schedule this interview. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    try {
      await api.delete(`/interviews/${id}`);
      setFeedback('Interview removed.');
      await fetchData();
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not delete this interview. Please try again.');
    }
  };

  const now = new Date();
  const upcoming = interviews.filter((item) => new Date(item.date) >= new Date(now.toDateString())).sort((first, second) => new Date(first.date) - new Date(second.date));
  const past = interviews.filter((item) => new Date(item.date) < new Date(now.toDateString())).sort((first, second) => new Date(second.date) - new Date(first.date));

  const InterviewCard = ({ interview, pastInterview = false }) => {
    const date = new Date(interview.date);
    return <article key={interview._id} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4 transition hover:shadow-md sm:p-5">
      <div className="flex gap-4">
        <div className="flex h-[62px] w-[58px] shrink-0 flex-col items-center justify-center rounded-md bg-[var(--primary-soft)] text-[var(--primary)]"><span className="text-[10px] font-bold uppercase">{date.toLocaleDateString(undefined, { month: 'short' })}</span><span className="text-[22px] font-bold leading-6">{date.getDate()}</span></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-bold text-[var(--text)]">{interview.application?.jobTitle || 'Interview'}</h3><p className="mt-1 truncate text-xs text-[var(--muted)]">{interview.application?.companyName || 'Application'}</p></div><button aria-label={`Delete interview with ${interview.application?.companyName || 'company'}`} title="Delete interview" onClick={() => handleDelete(interview._id)} className="rounded-md p-2 text-[var(--muted)] hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button></div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[var(--muted)]"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{interview.time || 'Time to be confirmed'}</span><span className="inline-flex items-center gap-1.5"><Video size={13} />{interview.interviewType}</span>{interview.interviewer && <span className="inline-flex items-center gap-1.5"><UserRound size={13} />{interview.interviewer}</span>}</div>
          {interview.notes && <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{interview.notes}</p>}
          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3"><span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">{pastInterview ? 'Completed' : 'Scheduled'}</span>{interview.meetingUrl && !pastInterview && <a className="button-primary !px-2.5 !py-1.5 text-xs" href={interview.meetingUrl} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Join meeting</a>}{interview.meetingUrl && pastInterview && <a className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]" href={interview.meetingUrl} target="_blank" rel="noreferrer">Meeting link <ExternalLink size={12} /></a>}</div>
        </div>
      </div>
    </article>;
  };

  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Stay prepared</p><h1>Interview schedule</h1><p className="mt-2 text-sm">Keep every conversation, link, and next step in one place.</p></div>
      {feedback && <div role="status" className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)]"><span>{feedback}</span><button aria-label="Dismiss message" onClick={() => setFeedback('')}><X size={15} /></button></div>}

      {error && <div className="card p-8 text-center"><p className="font-semibold text-[var(--text)]">We couldn&apos;t load your schedule</p><p className="mt-1 text-sm text-[var(--muted)]">Please try again.</p><button className="button-secondary mt-4" onClick={fetchData}>Try again</button></div>}

      {!error && <div className="grid items-start gap-5 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]">
        <section className="card p-4 sm:p-5">
          <div className="mb-5 flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]"><CalendarDays size={17} /></span><div><h2 className="text-base font-bold text-[var(--text)]">Schedule an interview</h2><p className="mt-1 text-xs text-[var(--muted)]">Add the details so you&apos;re ready.</p></div></div>
          {loading ? <div className="space-y-3">{[0, 1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-10 rounded-md" />)}</div> : <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold text-[var(--text)]">Application<select className="select mt-1.5" name="application" value={form.application} onChange={handleChange} required><option value="">Select an application</option>{applications.map((application) => <option key={application._id} value={application._id}>{application.companyName} · {application.jobTitle}</option>)}</select></label>
            <label className="block text-xs font-semibold text-[var(--text)]">Interview type<select className="select mt-1.5" name="interviewType" value={form.interviewType} onChange={handleChange}><option>Phone</option><option>Video</option><option>Technical</option><option>HR</option><option>Final</option></select></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-semibold text-[var(--text)]">Date<input className="input mt-1.5" type="date" name="date" value={form.date} onChange={handleChange} required /></label><label className="block text-xs font-semibold text-[var(--text)]">Time<input className="input mt-1.5" type="time" name="time" value={form.time} onChange={handleChange} /></label></div>
            <label className="block text-xs font-semibold text-[var(--text)]">Meeting link<input type="url" className="input mt-1.5" name="meetingUrl" placeholder="https://" value={form.meetingUrl} onChange={handleChange} /></label>
            <label className="block text-xs font-semibold text-[var(--text)]">Interviewer<input className="input mt-1.5" name="interviewer" placeholder="Name (optional)" value={form.interviewer} onChange={handleChange} /></label>
            <label className="block text-xs font-semibold text-[var(--text)]">Preparation notes<textarea className="textarea mt-1.5 min-h-[86px]" name="notes" placeholder="Topics to prepare, questions to ask..." value={form.notes} onChange={handleChange} /></label>
            <button type="submit" className="button-primary w-full" disabled={saving || !applications.length}><Plus size={15} />{saving ? 'Saving...' : 'Save interview'}</button>
            {!applications.length && <p className="text-center text-xs text-[var(--muted)]">Add an application before scheduling an interview.</p>}
          </form>}
        </section>

        <div className="space-y-6">
          <section><div className="mb-3 flex items-end justify-between"><div><h2 className="section-heading">Upcoming interviews</h2><p className="mt-1 text-xs text-[var(--muted)]">{upcoming.length} scheduled</p></div></div>
            {loading ? <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((item) => <div key={item} className="skeleton h-44 rounded-lg" />)}</div> : upcoming.length ? <div className="grid gap-3 sm:grid-cols-2">{upcoming.map((interview) => <InterviewCard key={interview._id} interview={interview} />)}</div> : <div className="card flex min-h-40 flex-col items-center justify-center p-6 text-center"><CalendarDays size={20} className="text-[var(--muted)]" /><p className="mt-2 text-sm font-semibold text-[var(--text)]">No upcoming interviews</p><p className="mt-1 text-xs text-[var(--muted)]">Scheduled conversations will show up here.</p></div>}
          </section>
          {past.length > 0 && <section><div className="mb-3"><h2 className="section-heading">Past interviews</h2><p className="mt-1 text-xs text-[var(--muted)]">A record of previous conversations</p></div><div className="grid gap-3 sm:grid-cols-2">{past.map((interview) => <InterviewCard key={interview._id} interview={interview} pastInterview />)}</div></section>}
        </div>
      </div>}
    </div>
  );
};

export default InterviewsPage;
