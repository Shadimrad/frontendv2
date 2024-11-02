const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createSprint(sprintData) {
  const response = await fetch(`${API_URL}/api/sprints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sprintData),
  });
  return response.json();
}

export async function getSprint(sprintId) {
  const response = await fetch(`${API_URL}/api/sprints/${sprintId}`);
  return response.json();
}

export async function logEffort(effortData) {
  const response = await fetch(`${API_URL}/api/efforts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(effortData),
  });
  return response.json();
}