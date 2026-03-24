export function PageHeaderCard({ title, description, actions }) {
  return (
    <div className="page-header-card">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
