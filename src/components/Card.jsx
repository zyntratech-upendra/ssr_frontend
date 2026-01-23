const Card = ({ title, value, description, icon: Icon }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {Icon && <Icon className="card-icon" size={24} />}
      </div>
      {value && <div className="card-value">{value}</div>}
      {description && <p className="card-description">{description}</p>}
    </div>
  );
};

export default Card;
