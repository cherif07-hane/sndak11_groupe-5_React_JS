import { Link } from 'react-router'

function HomePage() {
  return (
    <section className="home-stack">
      <section className="hero-banner panel">
        <div className="hero-copy">
          <p className="section-label">Accueil</p>
          <h2>Application Web SPA de gestion de portfolio</h2>
          <p className="hero-text">
            Cette page presente la demo demandee par le sujet. Chaque element
            du menu ouvre sa propre page, et chaque projet possede une page de
            detail avec consultation et edition.
          </p>

          <div className="hero-metrics">
            <div className="metric-card">
              <strong>6</strong>
              <span>projets de demonstration</span>
            </div>
            <div className="metric-card">
              <strong>4</strong>
              <span>composants principaux</span>
            </div>
            <div className="metric-card">
              <strong>1</strong>
              <span>API REST avec json-server</span>
            </div>
          </div>

          <div className="helper-actions">
            <Link className="button" to="/projets">
              Voir les projets
            </Link>
            <Link className="button-secondary" to="/ajouter">
              Ajouter un projet
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-image"
            src="/projet4.jpg"
            alt="Visuel de gestion de projet"
          />
        </div>
      </section>

      <section className="panel gallery-panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Apercu visuel</p>
            <h3>Les illustrations du portfolio</h3>
          </div>
        </div>

        <div className="reference-gallery">
          <img src="/projet1.jpg" alt="Apercu projet 1" />
          <img src="/projet2.jpg" alt="Apercu projet 2" />
          <img src="/projet3.jpg" alt="Apercu projet 3" />
          <img src="/projet4.jpg" alt="Apercu projet 4" />
          <img src="/projet5.png" alt="Apercu projet 5" />
          <img src="/projet1.jpg" alt="Apercu projet 6" />
        </div>
      </section>
    </section>
  )
}

export default HomePage
