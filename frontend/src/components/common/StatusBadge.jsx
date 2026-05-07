const StatusBadge = ({ status }) => (
  <span className={`badge badge--${status}`}>{status.replace("-", " ")}</span>
);

export default StatusBadge;
