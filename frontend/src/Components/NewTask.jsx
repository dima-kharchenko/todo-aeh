import { createTask } from "../api";
import { useState } from "react";
function NewTask({ setTasks, setFilteredTasks, showDone }) {
    const [newTask, setNewTask] = useState({body: '', category: '', done: false, deadline: null, priority: 0})

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(newTask){
            const res = await createTask(newTask)
            setNewTask({body: '', category: '', done: false, deadline: null, priority: 0})
            setTasks(p => [res, ...p])

            const fitsDone = showDone || !res.done

            if (fitsDone) {
                setFilteredTasks(prev => [res, ...prev])
            }
        }
    }

    return(
    <>
    <form onSubmit={handleSubmit} className="flex mx-auto">
        <input 
            type="text"
            id="newTask"
            name="newTask"
            value={newTask.body}
            onChange={(e) => setNewTask(p => ({...p, body: e.target.value}))}
            placeholder="Add new task..."
            className="bg-surface-a10 px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 hover:ring-2 ring-primary-a0 transition"
        />
        <button type="submit" className="ml-4 bg-primary-a0 px-4 py-2 rounded-lg cursor-pointer ring-primary-a0 hover:ring-2 active:ring-0 transition">Add</button>
    </form>
    </>
    )
}

export default NewTask;
