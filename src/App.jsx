import './App.css'
import { Link, Navigate, NavLink, Route, Routes } from 'react-router'
import Dossier from './components/Dossier.jsx'
import HomePage from './components/HomePage.jsx'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" to="/">
            <img
              className="brand-logo"
              src="/favicon.svg"
              alt="Logo Portfolio React"
            />
            <div className="brand-copy">
              <p className="brand-group">React JS</p>
              <h1>Portfolio G5</h1>
            </div>
          </Link>

          <nav className="main-nav" aria-label="Navigation principale">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to="/"
              end
            >
              Accueil
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to="/projets"
            >
              Projets
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to="/ajouter"
            >
              Ajouter Projet
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/projets" element={<Dossier mode="projets" />} />
          <Route
            path="/projets/:projectId"
            element={<Dossier mode="details" />}
          />
          <Route path="/ajouter" element={<Dossier mode="ajouter" />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>Application SPA de gestion de portfolio realisee avec React JS.</p>
          <p>Composants, props, etat local, formulaires, HTTP et routage.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
