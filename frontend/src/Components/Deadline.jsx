import { useState } from "react";

const toLocalDatetimeString = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

function Deadline({ task, updateTaskLocally }) {
    const [editing, setEditing] = useState(false)
    const [inputValue, setInputValue] = useState(() => task.deadline ? toLocalDatetimeString(new Date(task.deadline)) : "")

    const deadline = new Date(task.deadline)
    const now = new Date()

    const isToday =
        deadline.getDate() === now.getDate() &&
        deadline.getMonth() === now.getMonth() &&
        deadline.getFullYear() === now.getFullYear()

    const formatted = isToday
        ? deadline.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
        : deadline.toLocaleString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          });

    const handleSave = async () => {
        const newDeadline = inputValue ? new Date(inputValue).toISOString() : null
        updateTaskLocally(task.id, {deadline: newDeadline })
        setEditing(false)
    }

    return (
        <div className="relative">
            {!editing ? (
                <p
                    className={`inline-block text-sm my-auto rounded-md transition 
                    ${task.done ? "text-surface-a30 " : task.deadline && new Date(task.deadline) < new Date ? "text-red-400" : "text-surface-a40"}
                    ${!task.done ? "hover:text-primary-a0 cursor-pointer" : ""}`}
                    onClick={() => {if (!task.done) setEditing(true)}}
                >
                    {task.deadline ? formatted : <i className="fa-regular fa-clock"></i>}
                </p>
            ) : (
                <input
                    type="datetime-local"
                    className="inline-block w-38 text-sm rounded-md bg-surface-a10 text-surface-a50 focus:outline-none cursor-pointer"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleSave}
                    autoFocus
                />
            )}
        </div>
    )
}

export default Deadline;

