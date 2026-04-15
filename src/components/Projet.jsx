import { Link } from 'react-router'

function Projet({ project, onDelete }) {
  return (
    <article className="panel project-card">
      <div className="project-visual">
        <img
          className="project-cover"
          src={project.image}
          alt={`Illustration du projet ${project.title}`}
        />
        <span className="project-year">{project.year}</span>
      </div>

      <div className="project-body">
        <p className="project-card-label">Projet</p>
        <Link className="project-link" to={`/projets/${project.id}`}>
          {project.title}
        </Link>

        <p className="project-category">{project.category}</p>
        <p className="project-description">{project.description}</p>

        <div className="project-tags">
          {project.technologies.slice(0, 3).map((technology) => (
            <span key={technology} className="chip">
              {technology}
            </span>
          ))}
        </div>

        <div className="button-row">
          <Link className="button-secondary" to={`/projets/${project.id}`}>
            Voir le detail
          </Link>
          <button
            className="button-danger"
            type="button"
            onClick={() => onDelete(project.id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </article>
  )
}

export default Projet
