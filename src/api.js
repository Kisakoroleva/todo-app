const API_URL = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`API error ${res.status}: ${error}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getTodos: (listId) =>
    request(`/api/lists/${listId}/todos`),

  addTodo: (listId, text) =>
    request(`/api/lists/${listId}/todos`, {
      method: 'POST',
      body: JSON.stringify({ text })
    }),

  updateTodo: (listId, id, data) =>
    request(`/api/lists/${listId}/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  deleteTodo: (listId, id) =>
    request(`/api/lists/${listId}/todos/${id}`, {
      method: 'DELETE'
    })
}