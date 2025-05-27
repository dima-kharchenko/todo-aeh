import { useRef, useState } from "react";
import { updateTask } from "../api";

function TaskBody ({tasks, task, setTasks, setFilteredTasks}) {
    const inputRef = useRef(null)
    const [submitted, setSubmitted] = useState(false)

    const handleBodyChange = async (e) => {
        const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, body: e.target.value } : t).sort((a, b) => b.id - a.id).filter(t => !t.done)
        setTasks(updatedTasks)
        setFilteredTasks(updatedTasks)
        setSubmitted(false)
    }

    const handleBodySubmit = async (e) => {
        e.preventDefault()
        if (submitted) return
        setSubmitted(true)
        const updatedTask = tasks.find(t => t.id === task.id)
        if (updatedTask.body) {
            await updateTask(updatedTask)
        }
    }

    return (
        <form onSubmit={async (e) => {
            await handleBodySubmit(e)
            inputRef.current?.blur()
        }}>
            <input
                ref={inputRef}
                type="text"
                name={`body-${task.id}`}
                className={`${task.done ? 'text-surface-a30' : ''} focus:outline-none transition`}
                value={task.body}
                onChange={(e) => handleBodyChange(e)}
                onBlur={(e) => handleBodySubmit(e)}
                disabled={task.done}
            />
        </form>
    )
}

export default TaskBody;
