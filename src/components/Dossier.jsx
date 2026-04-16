import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../services/projectsApi.js";
import AjouterProjet from "./AjouterProjet.jsx";
import DetaillerProjet from "./DetaillerProjet.jsx";
import Projet from "./Projet.jsx";



function toProjectPayload(formValues) {
  return {
    title: String(formValues.title ?? "").trim(),
    image: String(formValues.image ?? "").trim(),
    category: String(formValues.category ?? "").trim(),
    year: Number(formValues.year),
    technologies: normalizeTechnologies(formValues.technologies),
    description: String(formValues.description ?? "").trim(),
  };
}

function Dossier({ mode }) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setErrorMessage("");
        const data = await fetchProjects();

        if (!ignore) {
          setProjects(data);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setErrorMessage(
            "Impossible de charger les projets. Lance d abord l API avec 'npm run api'.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setIsEditing(false);
  }, [mode, projectId]);

  const selectedProject = projects.find(
    (project) => String(project.id) === String(projectId),
  );

  const filteredProjects = (() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) => {
      const searchableValue = [
        project.title,
        project.category,
        project.description,
        project.technologies.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableValue.includes(query);
    });
  })();

  async function handleAddProject(formValues) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = toProjectPayload(formValues);
      console.log("payload envoyé:", payload);

      const createdProject = await createProject(payload);

      setProjects((currentProjects) => [createdProject, ...currentProjects]);
      navigate("/projets");
    } catch (error) {
      console.error("Erreur ajout projet:", error);
      setErrorMessage(
        "L ajout a echoue. Verifie que l API json-server est bien demarree.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProject(formValues) {
    if (!selectedProject) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = toProjectPayload(formValues);

      const updatedProject = await updateProject(selectedProject.id, {
        ...selectedProject,
        ...payload,
      });

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          String(project.id) === String(updatedProject.id)
            ? updatedProject
            : project,
        ),
      );

      setIsEditing(false);
      navigate(`/projets/${updatedProject.id}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "La modification a echoue. Verifie que l API json-server est bien demarree.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteProject(id) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce projet ?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setErrorMessage("");
      await deleteProject(id);
      setProjects((currentProjects) =>
        currentProjects.filter((project) => String(project.id) !== String(id)),
      );

      if (String(projectId) === String(id)) {
        navigate("/projets");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "La suppression a echoue. Verifie que l API json-server est bien demarree.",
      );
    }
  }

  if (mode === "ajouter") {
    return (
      <section className="page-stack">
        <section className="panel page-banner">
          <p className="section-label">AjouterProjet</p>
          <h2>Ajouter un nouveau projet au portfolio</h2>
          <p>
            Cette page est reservee au formulaire d ajout. Elle met en avant les
            champs controles, les evenements et la soumission vers le serveur.
          </p>
        </section>

        {errorMessage ? <div className="message">{errorMessage}</div> : null}

        <AjouterProjet
          isSubmitting={isSubmitting}
          submitLabel="Ajouter le projet"
          title="Formulaire d ajout"
          onSubmit={handleAddProject}
        />
      </section>
    );
  }

  if (mode === "details") {
    if (loading) {
      return <div className="status">Chargement du projet...</div>;
    }

    if (errorMessage) {
      return <div className="message">{errorMessage}</div>;
    }

    if (!selectedProject) {
      return (
        <section className="page-stack">
          <section className="panel help-panel">
            <p className="section-label">DetaillerProjet</p>
            <h2>Projet introuvable</h2>
            <p>
              Le projet demande n existe plus. Reviens a la page Projets pour
              selectionner un autre element.
            </p>
            <div className="helper-actions">
              <Link className="button" to="/projets">
                Retour aux projets
              </Link>
            </div>
          </section>
        </section>
      );
    }

    if (isEditing) {
      return (
        <section className="page-stack">
          <section className="panel page-banner">
            <p className="section-label">Edition</p>
            <h2>Modifier le projet selectionne</h2>
            <p>
              Cette page reutilise le composant AjouterProjet pour mettre a jour
              les informations du projet.
            </p>
          </section>

          {errorMessage ? <div className="message">{errorMessage}</div> : null}

          <AjouterProjet
            initialValues={selectedProject}
            isSubmitting={isSubmitting}
            submitLabel="Enregistrer les modifications"
            title="Formulaire d edition"
            onCancel={() => setIsEditing(false)}
            onSubmit={handleUpdateProject}
          />
        </section>
      );
    }

    return (
      <section className="detail-page">
        <DetaillerProjet
          project={selectedProject}
          onCancel={() => navigate("/projets")}
          onEdit={() => setIsEditing(true)}
        />

        <aside className="panel support-panel">
          <p className="section-label">Informations</p>
          <h3>Resume du projet</h3>
          <p>
            Les informations detaillees viennent du composant DetaillerProjet.
            Cette page montre aussi le routage dynamique avec l identifiant du
            projet.
          </p>

          <div className="support-list">
            {selectedProject.technologies.map((technology) => (
              <span key={technology} className="chip">
                {technology}
              </span>
            ))}
          </div>

          <div className="helper-actions">
            <Link className="button-secondary" to="/projets">
              Retour aux projets
            </Link>
          </div>
        </aside>
      </section>
    );
  }

  return (
    <section className="page-stack">
      <section className="panel page-banner">
        <div className="section-heading">
          <div>
            <p className="section-label">Dossier</p>
            <h2>Liste des projets</h2>
            <p>
              Clique sur le libelle d un projet pour ouvrir une page de detail.
            </p>
          </div>

          <div className="helper-actions">
            <Link className="button" to="/ajouter">
              Ajouter un projet
            </Link>
          </div>
        </div>
      </section>

      <section className="panel search-panel">
        <div className="search-head">
          <div>
            <p className="section-label">Recherche</p>
            <h3>
              {filteredProjects.length} projet(s) affiche(s) sur{" "}
              {projects.length}
            </h3>
          </div>
        </div>

        <div className="search-box">
          <label htmlFor="searchProject">
            Rechercher un projet
            <input
              id="searchProject"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Titre, categorie, technologie..."
              type="search"
            />
          </label>
        </div>
      </section>

      {loading ? <div className="status">Chargement des projets...</div> : null}
      {errorMessage ? <div className="message">{errorMessage}</div> : null}

      {!loading && filteredProjects.length === 0 ? (
        <div className="panel empty-state">
          Aucun projet ne correspond a la recherche en cours.
        </div>
      ) : null}

      <div className="project-list">
        {filteredProjects.map((project) => (
          <Projet
            key={project.id}
            project={project}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    </section>
  );
}

export default Dossier;
