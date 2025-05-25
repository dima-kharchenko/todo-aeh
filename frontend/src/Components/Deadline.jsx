import { useState } from "react";
import { updateTask } from "../api";

function toLocalDatetimeString(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function Deadline({ task, tasks, setTasks }) {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(() => toLocalDatetimeString(new Date(task.deadline)));

    const deadline = new Date(task.deadline);
    const now = new Date();

    const isToday =
        deadline.getDate() === now.getDate() &&
        deadline.getMonth() === now.getMonth() &&
        deadline.getFullYear() === now.getFullYear();

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
        const updatedTasks = tasks.map((t) =>
            t.id === task.id ? { ...t, deadline: new Date(inputValue).toISOString() } : t
        );
        setTasks(updatedTasks);
        const updatedTask = updatedTasks.find((t) => t.id === task.id);
        await updateTask(updatedTask);
        setEditing(false);
    };

    return (
        task.deadline && (
            <div className="relative">
                {!editing ? (
                    <p
                        className={`inline-block text-sm my-auto rounded-md transition 
                        ${task.done ? "text-surface-a30" : "text-surface-a40 hover:text-primary-a0 cursor-pointer"}`}
                        onClick={() => {
                            if (!task.done) setEditing(true);
                        }}
                    >
                        {formatted}
                    </p>
                ) : (
                    <input
                        type="datetime-local"
                        className="inline-block w-37 text-sm rounded-md bg-surface-a10 text-surface-a50 focus:outline-none"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleSave}
                        autoFocus
                    />
                )}
            </div>
        )
    );
}

export default Deadline;

