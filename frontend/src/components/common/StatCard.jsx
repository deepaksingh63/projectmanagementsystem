const StatCard = ({ icon, label, value, accent }) => (
  <article className="stat-card">
    <div className={`stat-card__icon stat-card__icon--${accent}`}>{icon}</div>
    <div>
      <p className="stat-card__label">{label}</p>
      <h3>{value}</h3>
    </div>
  </article>
);

export default StatCard;
