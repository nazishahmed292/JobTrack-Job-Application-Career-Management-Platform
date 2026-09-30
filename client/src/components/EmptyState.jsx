const EmptyState = ({ title, message, action }) => (
  <div className="card flex flex-col items-center justify-center px-6 py-10 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">•</div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
    {action}
  </div>
);

export default EmptyState;
