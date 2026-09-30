const statusClasses = {
  Wishlist: 'status-wishlist',
  Applied: 'status-applied',
  Screening: 'status-screening',
  Interview: 'status-interview',
  Offer: 'status-offer',
  Rejected: 'status-rejected',
  Withdrawn: 'status-withdrawn',
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${statusClasses[status] || 'status-applied'}`}>{status}</span>
);

export default StatusBadge;
