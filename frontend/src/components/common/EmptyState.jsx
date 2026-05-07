const EmptyState = ({ title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state__icon">+</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

export default EmptyState;
