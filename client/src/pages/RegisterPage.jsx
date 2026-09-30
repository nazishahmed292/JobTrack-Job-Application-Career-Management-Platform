import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, Check, Eye, EyeOff, FileText, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Choose a password with at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#20252d]">
      <aside className="relative hidden w-[43%] flex-col justify-between overflow-hidden bg-[#222631] p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#838cab 0.7px, transparent 0.7px)', backgroundSize: '18px 18px' }} />
        <Link to="/" className="relative flex items-center gap-2.5 text-lg font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400"><BriefcaseBusiness size={17} /></span>JobTrack<span className="text-indigo-300">.</span></Link>
        <div className="relative max-w-md"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-200"><Sparkles size={20} /></div><h2 className="text-3xl font-bold leading-tight">Make room for the work that comes next.</h2><p className="mt-4 text-sm leading-6 text-slate-300">A thoughtful place for your applications, interviews, and career story.</p><div className="mt-8 space-y-3">{[{ icon: BriefcaseBusiness, text: 'One home for every opportunity' }, { icon: CalendarDays, text: 'Interview details within reach' }, { icon: FileText, text: 'Your career materials, organized' }].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-indigo-200"><Icon size={14} /></span>{text}<Check size={14} className="ml-auto text-emerald-300" /></div>)}</div></div>
        <p className="relative text-xs text-slate-400">Start with one role. Build from there.</p>
      </aside>
      <main className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[440px]">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#727986] hover:text-[#303641] lg:hidden"><ArrowLeft size={14} /> Back to JobTrack</Link>
          <Link to="/" className="mb-8 hidden items-center gap-2 text-sm font-bold lg:inline-flex"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4558c9] text-white"><BriefcaseBusiness size={14} /></span>JobTrack<span className="text-[#4558c9]">.</span></Link>
          <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#596bd3]">Get started</p><h1 className="mt-2 text-3xl font-bold">Create your account</h1><p className="mt-2 text-sm text-[#747b87]">Set up your workspace in just a moment.</p></div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block text-xs font-semibold text-[#343a45]">Full name<div className="relative mt-1.5"><UserRound size={16} className="absolute left-3 top-3 text-[#8b929e]" /><input className="input h-11 pl-10" type="text" name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} required placeholder="Your name" /></div></label>
            <label className="block text-xs font-semibold text-[#343a45]">Email address<div className="relative mt-1.5"><Mail size={16} className="absolute left-3 top-3 text-[#8b929e]" /><input className="input h-11 pl-10" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" /></div></label>
            <label className="block text-xs font-semibold text-[#343a45]">Password<div className="relative mt-1.5"><LockKeyhole size={16} className="absolute left-3 top-3 text-[#8b929e]" /><input className="input h-11 pl-10 pr-11" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" minLength={8} value={form.password} onChange={handleChange} required placeholder="At least 8 characters" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-2 rounded p-1.5 text-[#838a96] hover:bg-[#f0f2f5]">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>
            <label className="block text-xs font-semibold text-[#343a45]">Confirm password<div className="relative mt-1.5"><LockKeyhole size={16} className="absolute left-3 top-3 text-[#8b929e]" /><input className="input h-11 pl-10 pr-11" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} required placeholder="Enter your password again" /><button type="button" aria-label={showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'} onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-2 top-2 rounded p-1.5 text-[#838a96] hover:bg-[#f0f2f5]">{showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>

            {error && <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">{error}</div>}

            <button type="submit" className="button-primary h-11 w-full" disabled={loading}>{loading ? 'Creating account...' : <>Create account <ArrowRight size={15} /></>}</button>
          </form>

          <p className="mt-6 text-center text-xs text-[#747b87]">Already have an account? <Link className="font-bold text-[#4558c9] hover:underline" to="/login">Sign in</Link></p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
