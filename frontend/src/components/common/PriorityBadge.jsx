const PriorityBadge = ({ priority }) => (
  <span className={`badge badge--priority-${priority}`}>{priority}</span>
);

export default PriorityBadge;
