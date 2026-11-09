function StatCard({ title, value, icon, description }) {
  return (
    <div className="stat-card">

      <div className="stat-top">
        <p>{title}</p>
        <span className="stat-icon">{icon}</span>
      </div>

      <h2>{value}</h2>

      <p className="stat-description">
        {description}
      </p>

    </div>
  );
}

export default StatCard;