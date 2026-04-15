function DetaillerProjet({ project, onCancel, onEdit }) { 
    return (
  <section className="panel detail-panel">
        <p className="section-label">DetaillerProjet</p>
            <img
      className="detail-cover"
      src={project.image}
      alt={`Illustration complète du projet ${project.title}`}
    />
  </section> 
  )
}