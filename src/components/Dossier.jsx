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