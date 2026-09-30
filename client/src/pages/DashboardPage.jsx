import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, BarChart3, BriefcaseBusiness, CalendarClock, CalendarPlus, FileText, Plus, Sparkles, Video } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const chartColors = ['#596bd3', '#d79c43', '#9c6fc4', '#37966a', '#cf6565', '#718096', '#9ba3af'];

const StatCard = ({ title, value, description, icon: Icon, tint }) => (
  <div className="card min-w-0 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-[var(--muted)]">{title}</p>
        <div className="mt-3 text-[28px] font-bold leading-none text-[var(--text)]">{value}</div>
      </div>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}><Icon size={17} strokeWidth={1.8} /></div>
    </div>
    <p className="mt-4 text-[11px] text-[var(--muted)]">{description}</p>
  </div>
);

const ChartCard = ({ title, detail, children, className = '' }) => (
  <section className={`card min-w-0 p-4 sm:p-5 ${className}`}>
    <div className="mb-4 flex items-start justify-between gap-4">
      <div><h2 className="section-heading">{title}</h2><p className="mt-1 text-xs text-[var(--muted)]">{detail}</p></div>
      <span className="rounded-md bg-[var(--panel-strong)] p-2 text-[var(--muted)]"><Activity size={15} /></span>
    </div>
    {children}
  </section>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await api.get('/analytics/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="space-y-6" aria-label="Loading dashboard">
    <div className="skeleton h-14 w-64 rounded-lg" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <div className="skeleton h-32 rounded-lg" key={item} />)}</div>
    <div className="grid gap-4 xl:grid-cols-3"><div className="skeleton h-72 rounded-lg xl:col-span-2" /><div className="skeleton h-72 rounded-lg" /></div>
  </div>;

  if (loadError) return <div className="card mx-auto max-w-lg p-8 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Activity size={20} /></div><h1 className="text-lg font-semibold text-[var(--text)]">We couldn&apos;t load your dashboard</h1><p className="mt-2 text-sm text-[var(--muted)]">Your information is safe. Try refreshing this view.</p><button className="button-primary mt-5" onClick={fetchData}>Try again</button></div>;

  const { stats = {}, statusData = [], applicationsOverTime = [], recentApplications = [], upcomingInterviews = [] } = dashboardData || {};
  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hasActivity = applicationsOverTime.some((item) => Number(item.count) > 0);
  const hasStatusData = statusData.some((item) => Number(item.value) > 0);

  return (
    <div className="space-y-6">
      <div className="page-heading flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Your job search</p><h1 className="mt-2">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}</h1><p className="mt-2 text-sm text-[var(--muted)]">A clear view of what&apos;s moving and what comes next.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link className="button-secondary" to="/analyzer"><Sparkles size={15} /> Analyze a role</Link>
          <Link className="button-primary" to="/applications"><Plus size={16} /> Add application</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total applications" value={stats.totalApplications || 0} description="Roles saved in your tracker" icon={BriefcaseBusiness} tint="bg-indigo-50 text-indigo-700" />
        <StatCard title="In progress" value={stats.activeApplications || 0} description="Applications still moving" icon={BarChart3} tint="bg-amber-50 text-amber-700" />
        <StatCard title="Interviews" value={stats.interviews || 0} description="Conversations on the calendar" icon={CalendarClock} tint="bg-violet-50 text-violet-700" />
        <StatCard title="Offers" value={stats.offers || 0} description="A strong step forward" icon={ArrowRight} tint="bg-emerald-50 text-emerald-700" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Applications over time" detail="New applications by date" className="xl:col-span-2">
          {hasActivity ? <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsOverTime} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#858b96' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#858b96' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: 'var(--border)', background: 'var(--panel)', color: 'var(--text)', fontSize: 12 }} />
                <Line type="monotone" dataKey="count" name="Applications" stroke="#596bd3" strokeWidth={2.5} dot={{ r: 3, fill: '#596bd3', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div> : <div className="flex h-[250px] flex-col items-center justify-center rounded-md bg-[var(--panel-soft)] px-5 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]"><Activity size={18} /></span><p className="mt-3 text-sm font-semibold text-[var(--text)]">Your activity starts with one application</p><p className="mt-1 max-w-xs text-xs leading-5 text-[var(--muted)]">Add a role to see your search momentum take shape here.</p><Link to="/applications" className="mt-3 text-xs font-semibold text-[var(--primary)]">Add an application</Link></div>}
        </ChartCard>

        <ChartCard title="Application status" detail="Where each opportunity stands">
          {hasStatusData ? <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">
                  {statusData.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: 'var(--border)', background: 'var(--panel)', color: 'var(--text)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div> : <div className="flex h-[250px] flex-col items-center justify-center rounded-md bg-[var(--panel-soft)] px-5 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--panel-strong)] text-[var(--muted)]"><BarChart3 size={18} /></span><p className="mt-3 text-sm font-semibold text-[var(--text)]">No statuses to show yet</p><p className="mt-1 max-w-xs text-xs leading-5 text-[var(--muted)]">Your opportunities will be grouped here as you add them.</p></div>}
          {hasStatusData && <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">{statusData.map((item, index) => <span key={item.name} className="inline-flex items-center gap-1.5 text-[10px] text-[var(--muted)]"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />{item.name}</span>)}</div>}
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="card min-w-0 p-4 sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="section-heading">Recent applications</h2><p className="mt-1 text-xs text-[var(--muted)]">Your latest tracked opportunities</p></div><Link to="/applications" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline">View all <ArrowRight size={13} /></Link></div>
          {recentApplications.length ? <div className="divide-y divide-[var(--border)]">
            {recentApplications.slice(0, 5).map((item) => <div key={item._id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--panel-strong)] text-xs font-bold text-[var(--primary)]">{item.companyName?.slice(0, 2).toUpperCase() || 'CO'}</div>
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-[var(--text)]">{item.companyName}</div><div className="truncate text-xs text-[var(--muted)]">{item.jobTitle}{item.location ? ` · ${item.location}` : ''}</div></div>
              <div className="hidden text-right text-[10px] text-[var(--muted)] sm:block">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</div>
              <StatusBadge status={item.status} />
            </div>)}
          </div> : <div className="py-8 text-center"><div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--panel-strong)] text-[var(--muted)]"><BriefcaseBusiness size={18} /></div><p className="text-sm font-medium text-[var(--text)]">No applications yet</p><p className="mt-1 text-xs text-[var(--muted)]">Add a role to start building your pipeline.</p><Link to="/applications" className="mt-3 inline-flex text-xs font-semibold text-[var(--primary)]">Add your first application</Link></div>}
        </section>

        <section className="card min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="section-heading">Coming up</h2><p className="mt-1 text-xs text-[var(--muted)]">Interview schedule</p></div><Link to="/interviews" aria-label="View all interviews" className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--panel-strong)]"><CalendarPlus size={15} /></Link></div>
          {upcomingInterviews.length ? <div className="space-y-3">{upcomingInterviews.slice(0, 3).map((item) => <div key={item._id} className="rounded-lg border border-[var(--border)] p-3.5">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="truncate text-sm font-semibold text-[var(--text)]">{item.jobTitle || item.companyName}</div><div className="mt-0.5 truncate text-xs text-[var(--muted)]">{item.companyName}</div></div><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-700"><Video size={15} /></span></div>
            <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2.5"><span className="text-[11px] text-[var(--muted)]">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{item.time ? ` · ${item.time}` : ''}</span><span className="badge status-interview">{item.interviewType}</span></div>
          </div>)}</div> : <div className="rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center"><CalendarClock size={20} className="mx-auto text-[var(--muted)]" /><p className="mt-2 text-sm font-medium text-[var(--text)]">Nothing scheduled</p><p className="mt-1 text-xs text-[var(--muted)]">Your upcoming interviews will appear here.</p><Link to="/interviews" className="mt-3 inline-flex text-xs font-semibold text-[var(--primary)]">Schedule interview</Link></div>}
        </section>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link to="/pipeline" className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><BarChart3 size={17} /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[var(--text)]">Review your pipeline</strong><span className="text-xs text-[var(--muted)]">Keep every opportunity moving</span></span><ArrowRight size={15} className="text-[var(--muted)]" /></Link>
        <Link to="/resume" className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><FileText size={17} /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[var(--text)]">Update your resume</strong><span className="text-xs text-[var(--muted)]">Keep your best version ready</span></span><ArrowRight size={15} className="text-[var(--muted)]" /></Link>
        <Link to="/analyzer" className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Sparkles size={17} /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[var(--text)]">Match your skills</strong><span className="text-xs text-[var(--muted)]">Understand a role before applying</span></span><ArrowRight size={15} className="text-[var(--muted)]" /></Link>
      </section>
    </div>
  );
};

export default DashboardPage;
