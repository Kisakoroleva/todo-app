import { useEffect, useState } from 'react'
import {
  collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy
} from 'firebase/firestore'
import { db } from './firebase'
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

  useEffect(() => {
    const q = query(
      collection(db, 'lists', listId, 'todos'),
      orderBy('createdAt')
    )
    const unsub = onSnapshot(q, snap => {
      setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [listId])

  const addTodo = async () => {
    const text = input.trim()
    if (!text) return
    await addDoc(collection(db, 'lists', listId, 'todos'), {
      text,
      done: false,
      createdAt: Date.now()
    })
    setInput('')
  }

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id)
    updateDoc(doc(db, 'lists', listId, 'todos', id), { done: !todo.done })
  }

  const removeTodo = (id) => {
    deleteDoc(doc(db, 'lists', listId, 'todos', id))
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
            stroke="#2893eb"
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