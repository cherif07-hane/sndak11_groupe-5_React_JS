import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  title: '',
  image: '',
  category: '',
  year: '2026',
  technologies: '',
  description: '',
}

const YEAR_MIN = 1900
const YEAR_MAX = 2100
const MIN_DESCRIPTION_LENGTH = 20
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

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

function parseTechnologies(value) {
  return value
    .split(',')
    .map((technology) => technology.trim())
    .filter(Boolean)
}

function validateForm(values) {
  const errors = {}
  const year = values.year.trim()
  const yearAsNumber = Number(year)
  const technologies = parseTechnologies(values.technologies)
  const description = values.description.trim()

  if (!values.title.trim()) {
    errors.title = 'Le libelle du projet est obligatoire.'
  }

  if (!values.image.trim()) {
    errors.image = "L'URL ou le chemin de l'image est obligatoire."
  }

  if (!values.category.trim()) {
    errors.category = 'La categorie est obligatoire.'
  }

  if (!year) {
    errors.year = "L'annee est obligatoire."
  } else if (!Number.isInteger(yearAsNumber) || year.length !== 4) {
    errors.year = "L'annee doit contenir 4 chiffres."
  } else if (yearAsNumber < YEAR_MIN || yearAsNumber > YEAR_MAX) {
    errors.year = `L'annee doit etre comprise entre ${YEAR_MIN} et ${YEAR_MAX}.`
  }

  if (technologies.length === 0) {
    errors.technologies =
      'Ajoute au moins une technologie (separee par des virgules).'
  }

  if (!description) {
    errors.description = 'La description est obligatoire.'
  } else if (description.length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `La description doit contenir au moins ${MIN_DESCRIPTION_LENGTH} caracteres.`
  }

  return errors
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
  const [formErrors, setFormErrors] = useState({})
  const [uploadError, setUploadError] = useState('')
  const [isReadingImage, setIsReadingImage] = useState(false)

  useEffect(() => {
    setFormValues(toFormValues(initialValues))
    setFormErrors({})
    setUploadError('')
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    setFormErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors
      }

      const { [name]: _removedError, ...nextErrors } = currentErrors
      return nextErrors
    })

    if (name === 'image') {
      setUploadError('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateForm(formValues)

    setFormErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    onSubmit(formValues)
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(
        "Format non supporte. Utilise JPG, PNG, WEBP, GIF ou SVG.",
      )
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setUploadError('Image trop lourde. Taille maximale: 2 MB.')
      return
    }

    try {
      setIsReadingImage(true)
      setUploadError('')
      const imageDataUrl = await readFileAsDataUrl(file)

      setFormValues((currentValues) => ({
        ...currentValues,
        image: imageDataUrl,
      }))

      setFormErrors((currentErrors) => {
        if (!currentErrors.image) {
          return currentErrors
        }

        const { image: _removedError, ...nextErrors } = currentErrors
        return nextErrors
      })
    } catch {
      setUploadError(
        "Impossible de charger l'image. Essaie un autre fichier ou une URL.",
      )
    } finally {
      setIsReadingImage(false)
    }
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
        {Object.keys(formErrors).length > 0 ? (
          <p className="form-alert">Corrige les champs en erreur puis reessaie.</p>
        ) : null}

        <label htmlFor="title">
          Libelle du projet
          <input
            id="title"
            name="title"
            aria-invalid={Boolean(formErrors.title)}
            value={formValues.title}
            onChange={handleChange}
            placeholder="Ex : Application de gestion de portfolio"
          />
          {formErrors.title ? (
            <span className="field-error">{formErrors.title}</span>
          ) : null}
        </label>

        <label htmlFor="imageFile">
          Photo du projet
          <input
            id="imageFile"
            accept="image/*"
            onChange={handleImageUpload}
            type="file"
          />
          {uploadError ? <span className="field-error">{uploadError}</span> : null}
        </label>

        <label htmlFor="image">
          URL ou chemin de l image
          <input
            id="image"
            name="image"
            aria-invalid={Boolean(formErrors.image)}
            value={formValues.image}
            onChange={handleChange}
            placeholder="/project-portfolio.svg"
          />
          {formErrors.image ? (
            <span className="field-error">{formErrors.image}</span>
          ) : null}
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
              aria-invalid={Boolean(formErrors.category)}
              value={formValues.category}
              onChange={handleChange}
              placeholder="SPA React"
            />
            {formErrors.category ? (
              <span className="field-error">{formErrors.category}</span>
            ) : null}
          </label>

          <label htmlFor="year">
            Annee
            <input
              id="year"
              name="year"
              aria-invalid={Boolean(formErrors.year)}
              value={formValues.year}
              onChange={handleChange}
              placeholder="2026"
              inputMode="numeric"
            />
            {formErrors.year ? (
              <span className="field-error">{formErrors.year}</span>
            ) : null}
          </label>
        </div>

        <label htmlFor="technologies">
          Technologies separees par des virgules
          <input
            id="technologies"
            name="technologies"
            aria-invalid={Boolean(formErrors.technologies)}
            value={formValues.technologies}
            onChange={handleChange}
            placeholder="React, CSS, JSON Server"
          />
          {formErrors.technologies ? (
            <span className="field-error">{formErrors.technologies}</span>
          ) : null}
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            aria-invalid={Boolean(formErrors.description)}
            value={formValues.description}
            onChange={handleChange}
            placeholder="Decrire le projet, son objectif et ses fonctionnalites."
          />
          {formErrors.description ? (
            <span className="field-error">{formErrors.description}</span>
          ) : null}
        </label>

        <div className="button-row">
          <button
            className="button"
            type="submit"
            disabled={isSubmitting || isReadingImage}
          >
            {isSubmitting
              ? 'Enregistrement...'
              : isReadingImage
                ? 'Traitement image...'
                : submitLabel}
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
