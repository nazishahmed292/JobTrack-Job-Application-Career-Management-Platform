import { useEffect, useState } from 'react';
import { Download, FileText, LoaderCircle, Star, Trash2, UploadCloud, X } from 'lucide-react';
import api from '../services/api';
import { API_BASE_URL } from '../config/api';

const fileHost = new URL(API_BASE_URL).origin;
const readableSize = (size) => size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;

const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/resumes');
      setResumes(response.data.resumes || []);
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(extension)) {
      setFeedback('Choose a PDF, DOC, or DOCX file.');
      setFile(null);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFeedback('Your resume must be smaller than 5 MB.');
      setFile(null);
      return;
    }
    setFeedback('');
    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      await api.post('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null);
      setFeedback('Resume uploaded.');
      await fetchResumes();
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not upload that resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setFeedback('Resume deleted.');
      await fetchResumes();
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not delete this resume. Please try again.');
    }
  };

  const handlePrimary = async (id) => {
    try {
      await api.patch(`/resumes/${id}/primary`);
      setFeedback('Primary resume updated.');
      await fetchResumes();
    } catch (requestError) {
      console.error(requestError);
      setFeedback('We could not update your primary resume. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Career documents</p><h1>Your resumes</h1><p className="mt-2 text-sm">Keep your latest, role-ready documents close at hand.</p></div>
      {feedback && <div role="status" className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)]"><span>{feedback}</span><button aria-label="Dismiss message" onClick={() => setFeedback('')}><X size={15} /></button></div>}

      <form onSubmit={handleUpload} className={`rounded-lg border border-dashed p-6 transition sm:p-8 ${dragging ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-[var(--border)] bg-[var(--panel)]'}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); }}>
        <label className="flex cursor-pointer flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><UploadCloud size={22} /></span>
          <span className="mt-4 text-sm font-semibold text-[var(--text)]">{file ? file.name : 'Drop your resume here'}</span>
          <span className="mt-1 text-xs text-[var(--muted)]">PDF, DOC, or DOCX up to 5 MB</span>
          {file && <span className="mt-1 text-[11px] text-[var(--muted)]">{readableSize(file.size)}</span>}
          <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(event) => selectFile(event.target.files[0])} />
        </label>
        <div className="mt-5 flex flex-wrap justify-center gap-2">{file && <button type="button" className="button-secondary" onClick={() => setFile(null)}>Remove file</button>}<button type="submit" className="button-primary" disabled={!file || uploading}>{uploading ? <LoaderCircle size={15} className="animate-spin" /> : <UploadCloud size={15} />}{uploading ? 'Uploading...' : 'Upload resume'}</button></div>
      </form>

      <section>
        <div className="mb-3 flex items-end justify-between"><div><h2 className="section-heading">Saved resumes</h2><p className="mt-1 text-xs text-[var(--muted)]">{resumes.length} {resumes.length === 1 ? 'document' : 'documents'}</p></div></div>
        {loading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading resumes">{[0, 1, 2].map((item) => <div key={item} className="skeleton h-52 rounded-lg" />)}</div> : error ? <div className="card p-8 text-center"><p className="font-semibold text-[var(--text)]">Your resumes could not be loaded</p><button className="button-secondary mt-4" onClick={fetchResumes}>Try again</button></div> : resumes.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => {
            const resumeUrl = `${fileHost}${resume.path}`;
            return <article key={resume._id} className="card p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
              <div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><FileText size={21} /></span>{resume.isPrimary && <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700"><Star size={12} fill="currentColor" /> Primary</span>}</div>
              <h3 className="mt-4 break-all text-sm font-semibold text-[var(--text)]">{resume.originalName}</h3>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--muted)]"><span>{readableSize(resume.size)}</span><span aria-hidden="true">·</span><span>{resume.createdAt ? `Uploaded ${new Date(resume.createdAt).toLocaleDateString()}` : 'Date unavailable'}</span></div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3"><a href={resumeUrl} target="_blank" rel="noreferrer" className="button-secondary !px-2.5 !py-1.5 text-xs"><FileText size={13} /> View</a><a href={resumeUrl} download={resume.originalName} className="button-secondary !px-2.5 !py-1.5 text-xs"><Download size={13} /> Download</a>{!resume.isPrimary && <button className="button-secondary !px-2.5 !py-1.5 text-xs" onClick={() => handlePrimary(resume._id)}><Star size={13} /> Make primary</button>}<button aria-label={`Delete ${resume.originalName}`} className="ml-auto rounded-md p-2 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(resume._id)}><Trash2 size={14} /></button></div>
            </article>;
          })}
        </div> : <div className="card flex flex-col items-center p-9 text-center"><FileText size={22} className="text-[var(--muted)]" /><h3 className="mt-3 text-sm font-semibold text-[var(--text)]">No resumes uploaded</h3><p className="mt-1 max-w-sm text-xs text-[var(--muted)]">Add a resume to keep your application documents together.</p></div>}
      </section>
    </div>
  );
};

export default ResumePage;
