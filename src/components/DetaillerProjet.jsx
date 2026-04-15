function DetaillerProjet({ project, onCancel, onEdit }) { 
    return (
  <section className="panel detail-panel">
        <p className="section-label">DetaillerProjet</p>
            <img
      className="detail-cover"
      src={project.image}
      alt={`Illustration complète du projet ${project.title}`}
    />
        <h2>{project.title}</h2>
    <p>{project.description}</p>
        <div className="detail-meta-grid">
      <div className="detail-meta-card">
        <span>Catégorie</span>
        <strong>{project.category}</strong>
      </div>

      <div className="detail-meta-card">
        <span>Année</span>
        <strong>{project.year}</strong>
      </div>
    </div>
  </section> 
  )
}