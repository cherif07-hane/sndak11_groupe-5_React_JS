import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  title: '',
  image: '',
  category: '',
  year: '2026',
  technologies: '',
  description: '',
}

function toFormValues(project) {
  if (!project) {
    return EMPTY_FORM
  }

  return {
    title: project.title ?? '',
    image: project.image ?? '',
    category: project.category ?? '',
    year: String(project.year ?? '2026'),
    technologies: Array.isArray(project.technologies)
      ? project.technologies.join(', ')
      : '',
    description: project.description ?? '',
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'))
    reader.readAsDataURL(file)
  })
}

function AjouterProjet({
  initialValues,
  onCancel,
  onSubmit,
  isSubmitting,
  submitLabel,
  title,
}) {
  const [formValues, setFormValues] = useState(toFormValues(initialValues))

  useEffect(() => {
    setFormValues(toFormValues(initialValues))
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(formValues)
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const imageDataUrl = await readFileAsDataUrl(file)

    setFormValues((currentValues) => ({
      ...currentValues,
      image: imageDataUrl,
    }))
  }

  return (
    <section className="panel form-panel">
      <p className="section-label">AjouterProjet</p>
      <h2>{title}</h2>
      <p className="form-note">
        Renseigne le libelle, l image, la categorie, l annee, les technologies
        et la description du projet.
      </p>

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
            required
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
            {isSubmitting ? 'Enregistrement...' : submitLabel}
          </button>

          {onCancel ? (
            <button className="button-secondary" type="button" onClick={onCancel}>
              Annuler
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}

export default AjouterProjet
