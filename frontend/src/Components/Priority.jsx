import { useState } from "react";
import { updateTask } from "../api";

function Priority({ tasks, task, setTasks }) {
    const [hoveredPriority, setHoveredPriority] = useState({});

    const handlePriority = async (id, priority) => {
        const task = tasks.find(t => t.id === id)
        const newPriority = task.priority === priority ? 0 : priority

        const updatedTasks = tasks.map(task => task.id === id ? { ...task, priority: newPriority } : task)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(t => t.id === id)
        await updateTask(updatedTask)
    }

    return (
        <div className="flex gap-1 my-auto">
          {[1, 2, 3].map((priority) => {
            const active = hoveredPriority[task.id] !== undefined
              ? priority <= hoveredPriority[task.id]
              : priority <= task.priority

            return (
              <div
                key={priority}
                onMouseEnter={() =>
                  setHoveredPriority((prev) => ({ ...prev, [task.id]: priority }))
                }
                onMouseLeave={() =>
                  setHoveredPriority((prev) => {
                    const updated = { ...prev }
                    delete updated[task.id]
                    return updated
                  })
                }
                onClick={!task.done ? () => handlePriority(task.id, priority) : null}
                className={`w-3 h-3 rounded-sm transition ${
                  active && !task.done ? "bg-primary-a30 cursor-pointer" : "bg-surface-a20"
                }`}
              />
            );
          })}
        </div>
    )
}

export default Priority;
