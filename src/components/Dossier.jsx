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
function normalizeTechnologies(value) {
  return String(value ?? "")
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);
}
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
