const PROJECTS_ENDPOINT = '/api/projects'

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error('Le serveur de projets n est pas disponible.')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function fetchProjects() {
  const response = await fetch(PROJECTS_ENDPOINT)
  return parseResponse(response)
}

export async function createProject(project) {
  const response = await fetch(PROJECTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })

  return parseResponse(response)
}

export async function updateProject(id, project) {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })

  return parseResponse(response)
}

export async function deleteProject(id) {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  })

  return parseResponse(response)
}
