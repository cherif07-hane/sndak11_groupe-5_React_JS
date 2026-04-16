import { useEffect, useState } from "react";

const EMPTY_FORM = {
  title: "",
  image: "",
  category: "",
  year: "2026",
  technologies: "",
  description: "",
};

function toFormValues(project) {
  if (!project) {
    return EMPTY_FORM;
  }

  return {
    title: project.title ?? "",
    image: project.image ?? "",
    category: project.category ?? "",
    year: String(project.year ?? "2026"),
    technologies: Array.isArray(project.technologies)
      ? project.technologies.join(", ")
      : "",
    description: project.description ?? "",
  };
}

function parseTechnologies(value) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function AjouterProjet({
  initialValues,
  onCancel,
  onSubmit,
  isSubmitting,
  submitLabel,
  title,
}) {
  const [formValues, setFormValues] = useState(() =>
    toFormValues(initialValues),
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormValues(toFormValues(initialValues));
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      const payload = {
        ...formValues,
        year: Number(formValues.year),
        technologies: parseTechnologies(formValues.technologies),
      };

      onSubmit(payload);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la soumission");
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // juste pour affichage local (preview)
    const imageUrl = URL.createObjectURL(file);

    setFormValues((currentValues) => ({
      ...currentValues,
      image: imageUrl,
    }));
  }

  return (
    <section className="panel form-panel">
      <p className="section-label">AjouterProjet</p>
      <h2>{title}</h2>
      <p className="form-note">
        Renseigne le libelle, l image, la categorie, l annee, les technologies
        et la description du projet.
      </p>

      {error && <p className="form-error">{error}</p>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <label htmlFor="title">
          Libelle du projet
          <input
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Ex : Application de gestion de portfolio"
            required
          />
        </label>

        <label htmlFor="imageFile">
          Photo du projet
          <input
            id="imageFile"
            accept="image/*"
            onChange={handleImageUpload}
            type="file"
          />
        </label>

        <label htmlFor="image">
          URL ou chemin de l image
          <input
            id="image"
            name="image"
            value={formValues.image}
            onChange={handleChange}
            placeholder="/project-portfolio.svg"
          />
        </label>

        {formValues.image ? (
          <div className="image-preview-card">
            <p className="image-preview-label">Apercu de l image</p>
            <img
              className="image-preview"
              src={formValues.image}
              alt="Apercu du projet a enregistrer"
            />
          </div>
        ) : null}

        <div className="form-columns">
          <label htmlFor="category">
            Categorie
            <input
              id="category"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              placeholder="SPA React"
              required
            />
          </label>

          <label htmlFor="year">
            Annee
            <input
              id="year"
              name="year"
              type="number"
              min="2000"
              max="2100"
              value={formValues.year}
              onChange={handleChange}
              placeholder="2026"
              required
            />
          </label>
        </div>

        <label htmlFor="technologies">
          Technologies separees par des virgules
          <input
            id="technologies"
            name="technologies"
            value={formValues.technologies}
            onChange={handleChange}
            placeholder="React, CSS, JSON Server"
            required
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Decrire le projet, son objectif et ses fonctionnalites."
            required
          />
        </label>

        <div className="button-row">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </button>

          {onCancel ? (
            <button
              className="button-secondary"
              type="button"
              onClick={onCancel}
            >
              Annuler
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default AjouterProjet;
