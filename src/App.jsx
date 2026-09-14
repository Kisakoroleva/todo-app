import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import './App.css'

function getListId() {
  const params = new URLSearchParams(window.location.search)
  let id = params.get('list')
  if (!id) {
    id = Math.random().toString(36).slice(2, 8)
    params.set('list', id)
    window.history.replaceState({}, '', '?' + params.toString())
  }
  return id
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [listId] = useState(getListId)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getTodos(listId)
      setTodos(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [listId])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const addTodo = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    try {
      const created = await api.addTodo(listId, text)
      setTodos(prev => [...prev, created])
    } catch (e) {
      setError(e.message)
      setInput(text)
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    const newDone = !todo.done
    // оптимистично
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: newDone } : t))
    try {
      await api.updateTodo(listId, id, { done: newDone })
    } catch (e) {
      setError(e.message)
      // откат
      setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !newDone } : t))
    }
  }

  const removeTodo = async (id) => {
    const backup = todos
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await api.deleteTodo(listId, id)
    } catch (e) {
      setError(e.message)
      setTodos(backup)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Ссылка скопирована')
  }

  return (
    <div className="app">
      <h1>ToDo</h1>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Что нужно сделать?"
        />
        <button className="btn-liquid" onClick={addTodo}>
          <div className="liquid"></div>
          <span className="btn-txt">Добавить</span>
        </button>
      </div>

      {loading && <p className="counter">Загрузка...</p>}

      {error && (
        <p className="counter" style={{ color: '#ff5555' }}>
          Ошибка: {error}
        </p>
      )}

      <ul className="list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                className="check"
                id={`todo-${todo.id}`}
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <label htmlFor={`todo-${todo.id}`} className="label">
                <svg width="22" height="22" viewBox="0 0 18 18">
                  <g
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path className="path1" d="M2 9.5 L7 14 L16 4" />
                  </g>
                </svg>
              </label>
            </div>

            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <p className="counter">
          Осталось: {todos.filter(t => !t.done).length} из {todos.length}
        </p>
      )}

      <button className="share-btn" onClick={copyLink}>
        Скопировать ссылку для синхронизации
      </button>
    </div>
  )
}