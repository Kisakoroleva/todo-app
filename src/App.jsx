import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    if (!text.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: text.trim(),
        completed: false,
      },
    ]);

    setText("");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <main className="app">
      <div className="todo">
        <h1>ToDo</h1>

        <form onSubmit={addTask} className="form">
          <input
  className="todo-input"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Новая задача..."
/>
          

          <button type="submit" className="add-button">
            Добавить
          </button>
        </form>

        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <span onClick={() => toggleTask(task.id)}>
                {task.text}
              </span>

              <button onClick={() => deleteTask(task.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="empty">Задач пока нет</p>
        )}
      </div>
    </main>
  );
}

export default App;