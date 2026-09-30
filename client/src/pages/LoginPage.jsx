import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form, remember);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#20252d]">
      <aside className="relative hidden w-[43%] flex-col justify-between overflow-hidden bg-[#222631] p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#838cab 0.7px, transparent 0.7px)', backgroundSize: '18px 18px' }} />
        <Link to="/" className="relative flex items-center gap-2.5 text-lg font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400"><BriefcaseBusiness size={17} /></span>JobTrack<span className="text-indigo-300">.</span></Link>
        <div className="relative max-w-md"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-200"><Sparkles size={20} /></div><h2 className="text-3xl font-bold leading-tight">Every application deserves a clear next step.</h2><p className="mt-4 text-sm leading-6 text-slate-300">Bring your roles, conversations, and career materials into one focused workspace.</p><div className="mt-8 rounded-lg border border-white/10 bg-white/[0.06] p-4"><div className="flex items-center justify-between text-xs"><span className="text-slate-300">Search momentum</span><span className="font-semibold text-emerald-300">On track</span></div><div className="mt-3 flex h-10 items-end gap-1.5">{[35, 60, 45, 76, 55, 100, 71, 85, 62, 92].map((height, index) => <i key={index} className="flex-1 rounded-t-sm bg-indigo-300/80" style={{ height: `${height}%` }} />)}</div></div></div>
        <p className="relative text-xs text-slate-400">A little more clarity, one step at a time.</p>
      </aside>
      <main className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold text-[#727986] hover:text-[#303641] lg:hidden"><ArrowLeft size={14} /> Back to JobTrack</Link>
          <Link to="/" className="mb-10 hidden items-center gap-2 text-sm font-bold lg:inline-flex"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4558c9] text-white"><BriefcaseBusiness size={14} /></span>JobTrack<span className="text-[#4558c9]">.</span></Link>
          <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#596bd3]">Welcome back</p><h1 className="mt-2 text-3xl font-bold">Sign in to JobTrack</h1><p className="mt-2 text-sm text-[#747b87]">Pick up where you left off in your search.</p></div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold text-[#343a45]">Email address<div className="relative mt-1.5"><Mail size={16} className="absolute left-3 top-3 text-[#8b929e]" /><input className="input h-11 pl-10" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" /></div></label>
            <label className="block text-xs font-semibold text-[#343a45]">Password<div className="relative mt-1.5"><LockKeyhole size={16} className="absolute left-3 top-3 text-[#8b929e]" /><input className="input h-11 pl-10 pr-11" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={form.password} onChange={handleChange} required placeholder="Enter your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-2 rounded p-1.5 text-[#838a96] hover:bg-[#f0f2f5]">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>
            <div className="flex items-center justify-between gap-3"><label className="inline-flex items-center gap-2 text-xs text-[#686f7b]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-3.5 w-3.5 rounded border-[#cbd0d9] accent-[#4558c9]" />Remember me</label><span className="text-xs text-[#9a9faa]" title="Password reset is not available yet">Forgot password?</span></div>

            {error && <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">{error}</div>}

            <button type="submit" className="button-primary h-11 w-full" disabled={loading}>{loading ? 'Signing in...' : <>Sign in <ArrowRight size={15} /></>}</button>
          </form>

          <p className="mt-7 text-center text-xs text-[#747b87]">New to JobTrack? <Link className="font-bold text-[#4558c9] hover:underline" to="/register">Create an account</Link></p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
