import { lazy, Suspense } from 'react';
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, BarChart3, BriefcaseBusiness, CalendarDays, Check, FileText, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/LoadingSpinner';
import LoginPage from './pages/LoginPage';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const InterviewsPage = lazy(() => import('./pages/InterviewsPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const RoutePage = ({ page: Page }) => <Suspense fallback={<LoadingSpinner fullScreen />}><Page /></Suspense>;

const RootGate = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user && location.pathname === '/') return <LandingPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (location.pathname === '/') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

const LandingPage = () => (
  <div className="min-h-screen bg-[#f7f8fa] text-[#20252d]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link to="/" className="flex items-center gap-2.5 text-lg font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4558c9] text-white"><BriefcaseBusiness size={17} /></span>JobTrack<span className="text-[#4558c9]">.</span></Link>
      <nav className="hidden items-center gap-7 text-sm font-medium text-[#626976] md:flex"><a href="#features" className="hover:text-[#20252d]">Features</a><a href="#workflow" className="hover:text-[#20252d]">How it works</a><a href="#analytics" className="hover:text-[#20252d]">Analytics</a></nav>
      <div className="flex items-center gap-2"><Link to="/login" className="hidden px-3 py-2 text-sm font-semibold text-[#4f5662] hover:text-[#20252d] sm:block">Log in</Link><Link to="/register" className="button-primary !px-3.5 !py-2 text-xs sm:text-sm">Get started <ArrowRight size={15} /></Link></div>
    </header>

    <main>
      <section className="relative overflow-hidden border-y border-[#e7e9ee] bg-[#fff]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cfd4e1 0.7px, transparent 0.7px)', backgroundSize: '18px 18px' }} />
        <div className="relative mx-auto max-w-7xl px-5 py-2 sm:px-8 sm:py-6 lg:py-4">
          <div className="mx-auto max-w-3xl text-center"><div className="inline-flex items-center gap-2 rounded-full border border-[#e3e6ef] bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#5e687c]"><span className="h-1.5 w-1.5 rounded-full bg-[#5d72d7]" />A calmer way to find your next role</div><h1 className="mx-auto mt-5 max-w-3xl text-[36px] font-bold leading-[1.08] sm:mt-6 sm:text-[48px]">Take control of your <span className="text-[#4558c9]">job search.</span></h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#69717e] sm:mt-5 sm:text-base sm:leading-7">Track applications, manage interviews, understand role fit, and keep your career momentum in one thoughtful workspace.</p><div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-7"><Link to="/register" className="button-primary !px-5 !py-3">Create your free account <ArrowRight size={16} /></Link><Link to="/login" className="button-secondary !px-5 !py-3">Log in</Link></div><div className="hidden flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#69717e] sm:mt-5 sm:flex"><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" />Simple opportunity tracking</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" />Your data, in one place</span></div></div>

          <div className="mx-auto mt-2 w-full max-w-5xl overflow-hidden rounded-xl border border-[#dfe2e9] bg-white p-2.5 shadow-[0_24px_64px_rgba(40,48,70,0.14)] sm:mt-4 lg:mt-3 sm:p-4">
            <div className="hidden items-center justify-between border-b border-[#eceef2] px-2 pb-3 sm:flex"><div><div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#89909d]">Workspace preview</div><div className="mt-1 text-sm font-bold">Your search at a glance</div></div><div className="flex gap-1"><i className="h-2 w-2 rounded-full bg-[#d9dce3]" /><i className="h-2 w-2 rounded-full bg-[#d9dce3]" /><i className="h-2 w-2 rounded-full bg-[#d9dce3]" /></div></div>
            <div className="grid grid-cols-3 gap-2.5 p-2 sm:gap-3 sm:p-3">{[{ label: 'Applications', value: '24', tone: 'bg-indigo-50 text-indigo-700' }, { label: 'Interviews', value: '06', tone: 'bg-violet-50 text-violet-700' }, { label: 'Offers', value: '02', tone: 'bg-emerald-50 text-emerald-700' }].map((stat) => <div key={stat.label} className="rounded-lg border border-[#e9ebf0] p-2.5 sm:p-3"><div className="text-[9px] text-[#818895] sm:text-[10px]">{stat.label}</div><div className={`mt-2 text-xl font-bold sm:text-2xl ${stat.tone.split(' ')[1]}`}>{stat.value}</div><div className="mt-1 hidden text-[9px] text-[#8a909b] sm:block">This month</div></div>)}</div>
            <div className="hidden gap-3 p-2 pt-0 lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:p-3 lg:pt-0"><div className="rounded-lg border border-[#e9ebf0] p-3"><div className="flex items-center justify-between"><div><div className="text-[11px] font-bold">Application activity</div><div className="mt-1 text-[9px] text-[#8a909b]">Applications over the last weeks</div></div><BarChart3 size={15} className="text-[#5367cf]" /></div><div className="mt-3 flex h-20 items-end gap-1.5 border-b border-[#eceef2] px-1">{[28, 42, 33, 58, 49, 76, 63, 88, 68, 94, 75, 100, 78, 86, 66, 92].map((height, index) => <i key={index} className={`flex-1 rounded-t-[2px] ${index > 10 ? 'bg-[#596bd3]' : 'bg-[#b9c1ef]'}`} style={{ height: `${height}%` }} />)}</div><div className="mt-2 flex justify-between text-[8px] text-[#9ba1ab]"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></div>
              <div className="rounded-lg border border-[#e9ebf0] p-3"><div className="text-[11px] font-bold">Next up</div><div className="mt-3 flex items-start gap-2 rounded-md bg-[#f7f8fc] p-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white text-[#596bd3]"><CalendarDays size={13} /></span><div className="min-w-0"><div className="truncate text-[9px] font-bold">Product Designer</div><div className="mt-1 text-[8px] text-[#8a909b]">Tuesday · 10:30 AM</div><div className="mt-2 inline-flex rounded bg-violet-50 px-1.5 py-0.5 text-[8px] text-violet-700">Technical</div></div></div><div className="mt-2 rounded-md border border-[#eceef2] p-2"><div className="flex items-center gap-1.5 text-[9px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Screening</div><div className="mt-1 text-[8px] text-[#8a909b]">Northstar · UX Lead</div></div></div></div>
            <div className="mx-2 hidden items-center gap-2 rounded-md bg-[#f6f7fa] px-3 py-2 text-[9px] text-[#7c8491] sm:mx-3 sm:flex"><Sparkles size={13} className="text-[#596bd3]" />Your next career move, organized.</div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#596bd3]">Everything in one place</p><h2 className="mt-3 text-3xl font-bold">A better system for the in-between.</h2><p className="mt-3 text-sm leading-6 text-[#6d7480]">The search can be a lot to manage. JobTrack gives each step a clear home.</p></div><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ icon: BriefcaseBusiness, title: 'Application tracking', copy: 'Keep roles, contacts, notes, and status together.' }, { icon: BarChart3, title: 'Pipeline view', copy: 'Know what needs a follow-up and what is moving.' }, { icon: CalendarDays, title: 'Interview planning', copy: 'Have dates, people, and meeting links ready.' }, { icon: FileText, title: 'Resume library', copy: 'Keep tailored versions organized and available.' }].map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-lg border border-[#e5e7ec] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#eef0ff] text-[#4e61ca]"><Icon size={17} /></span><h3 className="mt-4 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-[#757c88]">{copy}</p></article>)}</div></section>

      <section id="workflow" className="border-y border-[#e6e8ed] bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-3">{[{ number: '01', title: 'Save a role', copy: 'Add a job and keep the details you will need later.' }, { number: '02', title: 'Stay in motion', copy: 'Track progress, prepare for interviews, and follow up.' }, { number: '03', title: 'Learn as you go', copy: 'Review your activity and check how your skills match.' }].map((step) => <div key={step.number} className="flex gap-4"><span className="text-xs font-bold text-[#596bd3]">{step.number}</span><div><h3 className="text-sm font-bold">{step.title}</h3><p className="mt-2 text-xs leading-5 text-[#757c88]">{step.copy}</p></div></div>)}</div></section>

      <section id="analytics" className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-14 sm:px-8 sm:py-16 md:flex-row md:items-center"><div className="max-w-lg"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#596bd3]">Useful clarity</p><h2 className="mt-3 text-2xl font-bold">Make progress visible.</h2><p className="mt-3 text-sm leading-6 text-[#6d7480]">Spot patterns across your applications and keep an eye on upcoming conversations without building another spreadsheet.</p></div><Link to="/register" className="button-primary self-start !px-5 !py-3 md:self-auto">Start organizing <ArrowRight size={15} /></Link></section>
    </main>
    <footer className="border-t border-[#e5e7ec] bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-[#747b87] sm:px-8 md:flex-row md:items-center md:justify-between"><Link to="/" className="font-bold text-[#252a33]">JobTrack<span className="text-[#4558c9]">.</span></Link><div className="flex flex-wrap gap-5"><a href="#features" className="hover:text-[#20252d]">Features</a><a href="#workflow" className="hover:text-[#20252d]">How it works</a><a href="mailto:hello@jobtrack.app" className="hover:text-[#20252d]">Contact</a></div><span>© {new Date().getFullYear()} JobTrack</span></div></footer>
  </div>
);

const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <RoutePage page={LoginPage} />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <RoutePage page={RegisterPage} />
        </PublicRoute>
      }
    />

    <Route
      path="/"
      element={<RootGate />}
    >
      <Route element={<DashboardLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<RoutePage page={DashboardPage} />} />
      <Route path="applications" element={<RoutePage page={ApplicationsPage} />} />
      <Route path="pipeline" element={<RoutePage page={PipelinePage} />} />
      <Route path="interviews" element={<RoutePage page={InterviewsPage} />} />
      <Route path="resume" element={<RoutePage page={ResumePage} />} />
      <Route path="analyzer" element={<RoutePage page={AnalyzerPage} />} />
      <Route path="profile" element={<RoutePage page={ProfilePage} />} />
      <Route path="settings" element={<RoutePage page={SettingsPage} />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
