import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BriefcaseBusiness, Building2, CalendarDays, ExternalLink, Eye, MapPin, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

const defaultForm = {
  companyName: '',
  jobTitle: '',
  location: '',
  workType: 'Remote',
  employmentType: 'Full-time',
  status: 'Applied',
  salary: '',
  jobUrl: '',
  jobDescription: '',
  recruiterName: '',
  recruiterEmail: '',
  recruiterPhone: '',
  notes: '',
  tags: '',
};

const ApplicationsPage = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = !search || `${app.companyName} ${app.jobTitle}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchApplications = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await api.get('/applications');
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error(error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/applications/${editingId}`, payload);
      } else {
        await api.post('/applications', payload);
      }

      setForm(defaultForm);
      setEditingId(null);
      setFormOpen(false);
      setFeedback(editingId ? 'Application updated.' : 'Application added.');
      await fetchApplications();
    } catch (error) {
      console.error(error);
      setFeedback('We could not save this application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (application) => {
    setForm({
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      location: application.location,
      workType: application.workType,
      employmentType: application.employmentType,
      status: application.status,
      salary: application.salary,
      jobUrl: application.jobUrl,
      jobDescription: application.jobDescription,
      recruiterName: application.recruiterName,
      recruiterEmail: application.recruiterEmail,
      recruiterPhone: application.recruiterPhone,
      notes: application.notes,
      tags: (application.tags || []).join(', '),
    });
    setEditingId(application._id);
    setSelectedApplication(null);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try {
      await api.delete(`/applications/${id}`);
      setFeedback('Application deleted.');
      setSelectedApplication(null);
      await fetchApplications();
    } catch (error) {
      console.error(error);
      setFeedback('We could not delete this application. Please try again.');
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(defaultForm);
    setFormOpen(false);
  };

  const statuses = ['', 'Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

  return (
    <div className="space-y-6">
      <div className="page-heading flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Opportunity tracker</p><h1>Applications</h1><p className="mt-2 text-sm">Track each opportunity from first contact to final decision.</p></div>
        <button className="button-primary self-start sm:self-auto" onClick={openCreateForm}><Plus size={16} /> Add application</button>
      </div>

      {feedback && <div role="status" className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)] shadow-sm"><span>{feedback}</span><button aria-label="Dismiss message" onClick={() => setFeedback('')}><X size={15} /></button></div>}

      <section className="card overflow-hidden">
        <div className="border-b border-[var(--border)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm"><span className="sr-only">Search applications</span><Search className="absolute left-3 top-3 text-[var(--muted)]" size={16} /><input className="input h-10 pl-9 text-sm" placeholder="Search companies or roles" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <div className="flex max-w-full gap-1 overflow-x-auto pb-1" role="group" aria-label="Filter by status">
              {statuses.map((status) => <button key={status || 'all'} className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition ${statusFilter === status ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : 'text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-[var(--text)]'}`} onClick={() => setStatusFilter(status)}>{status || 'All'}</button>)}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]"><BriefcaseBusiness size={14} /><span>{filteredApplications.length} {filteredApplications.length === 1 ? 'opportunity' : 'opportunities'}</span>{statusFilter && <span>· {statusFilter}</span>}</div>
        </div>

        {loading ? <div className="space-y-3 p-5" aria-label="Loading applications">{[0, 1, 2, 3].map((item) => <div key={item} className="skeleton h-[58px] rounded-md" />)}</div> : loadError ? <div className="p-10 text-center"><p className="font-semibold text-[var(--text)]">Applications are unavailable right now</p><p className="mt-1 text-sm text-[var(--muted)]">Please try loading them again.</p><button className="button-secondary mt-4" onClick={fetchApplications}>Try again</button></div> : filteredApplications.length ? <>
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[740px] text-left text-sm">
            <thead className="bg-[var(--panel-soft)] text-[11px] uppercase tracking-wide text-[var(--muted)]"><tr><th className="px-5 py-3 font-semibold">Company / role</th><th className="px-4 py-3 font-semibold">Location</th><th className="px-4 py-3 font-semibold">Applied</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
            <tbody className="divide-y divide-[var(--border)]">{filteredApplications.map((app) => <tr key={app._id} className="transition hover:bg-[var(--panel-soft)]">
              <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--panel-strong)] text-[11px] font-bold text-[var(--primary)]">{app.companyName?.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><div className="font-semibold text-[var(--text)]">{app.companyName}</div><div className="mt-0.5 text-xs text-[var(--muted)]">{app.jobTitle}</div></div></div></td>
              <td className="px-4 py-3.5 text-[var(--muted)]">{app.location || app.workType || 'Remote'}</td><td className="px-4 py-3.5 text-xs text-[var(--muted)]">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</td>
              <td className="px-4 py-3.5"><StatusBadge status={app.status} /></td><td className="px-4 py-3.5"><div className="flex justify-end gap-1"><button aria-label={`View ${app.companyName} application`} title="View details" className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-[var(--text)]" onClick={() => setSelectedApplication(app)}><Eye size={15} /></button><button aria-label={`Edit ${app.companyName} application`} title="Edit" className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-[var(--text)]" onClick={() => handleEdit(app)}><Pencil size={15} /></button><button aria-label={`Delete ${app.companyName} application`} title="Delete" className="rounded-md p-2 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(app._id)}><Trash2 size={15} /></button></div></td>
            </tr>)}</tbody>
          </table></div>
          <div className="divide-y divide-[var(--border)] md:hidden">{filteredApplications.map((app) => <article key={app._id} className="p-4">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--panel-strong)] text-xs font-bold text-[var(--primary)]">{app.companyName?.slice(0, 2).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h2 className="truncate text-sm font-semibold text-[var(--text)]">{app.companyName}</h2><p className="mt-0.5 truncate text-xs text-[var(--muted)]">{app.jobTitle}</p></div><StatusBadge status={app.status} /></div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]"><span className="inline-flex items-center gap-1"><MapPin size={12} />{app.location || app.workType || 'Remote'}</span><span className="inline-flex items-center gap-1"><CalendarDays size={12} />{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Date not set'}</span></div>
              <div className="mt-3 flex gap-2"><button className="button-secondary !px-2.5 !py-1.5 text-xs" onClick={() => setSelectedApplication(app)}><Eye size={13} /> View</button><button className="button-secondary !px-2.5 !py-1.5 text-xs" onClick={() => handleEdit(app)}><Pencil size={13} /> Edit</button><button aria-label={`Delete ${app.companyName} application`} className="rounded-md p-2 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(app._id)}><Trash2 size={14} /></button></div>
            </div></div>
          </article>)}</div>
        </> : <div className="p-6"><EmptyState title={search || statusFilter ? 'No matching applications' : 'No applications yet'} message={search || statusFilter ? 'Try a different search or status filter.' : 'Start tracking your job applications and keep your search organized.'} /></div>}
      </section>

      {formOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="application-form-title" className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl sm:rounded-xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="application-form-title" className="text-lg font-bold text-[var(--text)]">{editingId ? 'Edit application' : 'Add an application'}</h2><p className="mt-1 text-sm text-[var(--muted)]">Keep the details you need to follow up.</p></div><button className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--panel-strong)]" onClick={closeForm} aria-label="Close dialog"><X size={18} /></button></div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Company name<input required className="input mt-1" name="companyName" placeholder="e.g. Northstar Labs" value={form.companyName} onChange={handleFormChange} /></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Job title<input required className="input mt-1" name="jobTitle" placeholder="e.g. Product Designer" value={form.jobTitle} onChange={handleFormChange} /></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Location<input className="input mt-1" name="location" placeholder="City or remote" value={form.location} onChange={handleFormChange} /></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Salary<input className="input mt-1" name="salary" placeholder="Optional" value={form.salary} onChange={handleFormChange} /></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Workplace<select className="select mt-1" name="workType" value={form.workType} onChange={handleFormChange}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Employment type<select className="select mt-1" name="employmentType" value={form.employmentType} onChange={handleFormChange}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Status<select className="select mt-1" name="status" value={form.status} onChange={handleFormChange}><option>Wishlist</option><option>Applied</option><option>Screening</option><option>Interview</option><option>Offer</option><option>Rejected</option><option>Withdrawn</option></select></label>
              <label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Job URL<input type="url" className="input mt-1" name="jobUrl" placeholder="https://" value={form.jobUrl} onChange={handleFormChange} /></label>
            </div>
            <label className="block space-y-1.5 text-xs font-semibold text-[var(--text)]">Job description<textarea className="textarea mt-1 min-h-[90px]" name="jobDescription" placeholder="Optional notes from the listing" value={form.jobDescription} onChange={handleFormChange} /></label>
            <div className="grid gap-4 sm:grid-cols-3"><label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Recruiter<input className="input mt-1" name="recruiterName" placeholder="Name" value={form.recruiterName} onChange={handleFormChange} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Recruiter email<input type="email" className="input mt-1" name="recruiterEmail" placeholder="Email" value={form.recruiterEmail} onChange={handleFormChange} /></label><label className="space-y-1.5 text-xs font-semibold text-[var(--text)]">Recruiter phone<input className="input mt-1" name="recruiterPhone" placeholder="Phone" value={form.recruiterPhone} onChange={handleFormChange} /></label></div>
            <label className="block space-y-1.5 text-xs font-semibold text-[var(--text)]">Tags<input className="input mt-1" name="tags" placeholder="e.g. referral, priority" value={form.tags} onChange={handleFormChange} /></label>
            <label className="block space-y-1.5 text-xs font-semibold text-[var(--text)]">Private notes<textarea className="textarea mt-1 min-h-[75px]" name="notes" placeholder="Follow-up reminders, context, or next steps" value={form.notes} onChange={handleFormChange} /></label>
            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4"><button type="button" className="button-secondary" onClick={closeForm}>Cancel</button><button type="submit" className="button-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add application'}</button></div>
          </form>
        </section>
      </div>}

      {selectedApplication && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedApplication(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="application-detail-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl sm:rounded-xl sm:p-6">
          <div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] font-bold text-[var(--primary)]">{selectedApplication.companyName?.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><h2 id="application-detail-title" className="truncate text-lg font-bold text-[var(--text)]">{selectedApplication.companyName}</h2><p className="truncate text-sm text-[var(--muted)]">{selectedApplication.jobTitle}</p></div></div><button aria-label="Close details" className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--panel-strong)]" onClick={() => setSelectedApplication(null)}><X size={18} /></button></div>
          <div className="mt-5 flex flex-wrap items-center gap-2"><StatusBadge status={selectedApplication.status} />{selectedApplication.workType && <span className="rounded-md bg-[var(--panel-strong)] px-2 py-1 text-xs text-[var(--muted)]">{selectedApplication.workType}</span>}{selectedApplication.employmentType && <span className="rounded-md bg-[var(--panel-strong)] px-2 py-1 text-xs text-[var(--muted)]">{selectedApplication.employmentType}</span>}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{[['Location', selectedApplication.location], ['Salary', selectedApplication.salary], ['Recruiter', selectedApplication.recruiterName], ['Recruiter email', selectedApplication.recruiterEmail], ['Recruiter phone', selectedApplication.recruiterPhone], ['Applied', selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : 'Not specified']].map(([label, value]) => <div key={label} className="rounded-md bg-[var(--panel-soft)] p-3"><div className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">{label}</div><div className="mt-1 break-words text-sm font-medium text-[var(--text)]">{value || 'Not provided'}</div></div>)}</div>
          {selectedApplication.jobDescription && <div className="mt-5"><h3 className="text-sm font-semibold text-[var(--text)]">Job description</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{selectedApplication.jobDescription}</p></div>}
          {selectedApplication.notes && <div className="mt-5"><h3 className="text-sm font-semibold text-[var(--text)]">Notes</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{selectedApplication.notes}</p></div>}
          {selectedApplication.tags?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{selectedApplication.tags.map((tag) => <span key={tag} className="rounded-md bg-[var(--primary-soft)] px-2 py-1 text-xs text-[var(--primary)]">{tag}</span>)}</div>}
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[var(--border)] pt-4">{selectedApplication.jobUrl && <a className="button-secondary" href={selectedApplication.jobUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open job</a>}<button className="button-secondary" onClick={() => handleEdit(selectedApplication)}><Pencil size={14} /> Edit</button><button className="button-secondary !text-rose-600" onClick={() => handleDelete(selectedApplication._id)}><Trash2 size={14} /> Delete</button></div>
        </section>
      </div>}
    </div>
  );
};

export default ApplicationsPage;
