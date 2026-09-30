const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={fullScreen ? 'flex min-h-screen items-center justify-center' : 'flex items-center justify-center p-4'}>
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
  </div>
);

export default LoadingSpinner;
