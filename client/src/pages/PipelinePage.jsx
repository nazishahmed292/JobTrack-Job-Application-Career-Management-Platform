import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, CalendarDays, MapPin, Plus } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const pipelineStages = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];
const stageMarks = { Wishlist: 'bg-slate-400', Applied: 'bg-blue-500', Screening: 'bg-amber-500', Interview: 'bg-violet-500', Offer: 'bg-emerald-500', Rejected: 'bg-rose-500', Withdrawn: 'bg-slate-400' };

const PipelinePage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/applications');
      setApplications(response.data.applications || []);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const moveApplication = async (id, status) => {
    setApplications((items) => items.map((item) => item._id === id ? { ...item, status } : item));
    try {
      await api.patch(`/applications/${id}/status`, { status });
    } catch (requestError) {
      console.error(requestError);
      fetchApplications();
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-heading flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Your workflow</p><h1>Application pipeline</h1><p className="mt-2 text-sm">See every opportunity at a glance and move it forward.</p></div>
        <Link to="/applications" className="button-primary self-start sm:self-auto"><Plus size={15} /> Add opportunity</Link>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-[var(--muted)]"><span>{applications.length} opportunities</span><span className="hidden sm:inline">Choose a new status on any card to move it</span></div>
      {loading ? <div className="flex gap-3 overflow-hidden pb-3" aria-label="Loading pipeline">{pipelineStages.slice(0, 5).map((stage) => <div key={stage} className="skeleton h-[420px] min-w-[250px] flex-1 rounded-lg" />)}</div> : error ? <div className="card p-10 text-center"><p className="font-semibold text-[var(--text)]">Your pipeline could not be loaded</p><p className="mt-1 text-sm text-[var(--muted)]">Try again in a moment.</p><button className="button-secondary mt-4" onClick={fetchApplications}>Try again</button></div> : <div className="-mx-4 overflow-x-auto px-4 pb-3 md:-mx-7 md:px-7">
        <div className="flex min-h-[420px] min-w-max items-start gap-3">
          {pipelineStages.map((stage) => {
            const stageApplications = applications.filter((item) => item.status === stage);
            return <section key={stage} className="w-[258px] shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel-soft)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-3.5 py-3"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${stageMarks[stage]}`} /><h2 className="text-xs font-bold text-[var(--text)]">{stage}</h2><span className="rounded bg-[var(--panel-strong)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]">{stageApplications.length}</span></div><Link aria-label={`Add application to ${stage}`} title="Add application" to="/applications" className="rounded p-1 text-[var(--muted)] hover:bg-[var(--panel-strong)]"><Plus size={14} /></Link></div>
              <div className="min-h-[360px] space-y-2.5 p-2.5">{stageApplications.map((item) => <article key={item._id} className="rounded-md border border-[var(--border)] bg-[var(--panel)] p-3.5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-start gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--panel-strong)] text-[10px] font-bold text-[var(--primary)]">{item.companyName?.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><h3 className="truncate text-xs font-bold text-[var(--text)]">{item.companyName}</h3><p className="mt-0.5 line-clamp-2 text-xs leading-4 text-[var(--muted)]">{item.jobTitle}</p></div></div>
                <div className="mt-3 space-y-1.5 text-[10px] text-[var(--muted)]">{item.location && <div className="flex items-center gap-1.5"><MapPin size={12} />{item.location}</div>}<div className="flex items-center gap-1.5"><CalendarDays size={12} />{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Date not set'}</div></div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5"><StatusBadge status={item.status} /><select aria-label={`Move ${item.jobTitle} at ${item.companyName}`} className="select max-w-[112px] !px-2 !py-1 text-[10px]" value={item.status} onChange={(event) => moveApplication(item._id, event.target.value)}>{pipelineStages.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
              </article>)}
              {!stageApplications.length && <div className="flex min-h-24 flex-col items-center justify-center rounded-md border border-dashed border-[var(--border)] px-3 text-center"><BriefcaseBusiness size={16} className="text-[var(--muted)]" /><span className="mt-2 text-[11px] text-[var(--muted)]">No applications here yet</span></div>}
              </div>
              <div className="border-t border-[var(--border)] px-3 py-2"><Link to="/applications" className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--muted)] hover:text-[var(--primary)]">Manage applications <ArrowRight size={11} /></Link></div>
            </section>;
          })}
        </div>
      </div>}
    </div>
  );
};

export default PipelinePage;
