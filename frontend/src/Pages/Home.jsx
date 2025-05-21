import { createTask } from "../api";
import Header from "../Components/Header";
import { useState } from "react";
function Home() {
    const [newTask, setNewTask] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(newTask){
            console.log(newTask)
            const res = await createTask(newTask, null, null)
            console.log(res)
            setNewTask("")
        }
    }

    return(
    <>
    <Header />
    <div className="mt-12 text-white">
        <div className="pt-4 w-2/3 mx-auto text-center">
            <form onSubmit={handleSubmit} className="flex w-3/4 mx-auto">
                <input 
                    type="text"
                    id="newTask"
                    name="newTask"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task..."
                    className="bg-surface-a10 px-4 py-2 w-full rounded-lg ring-1 ring-primary-a0 focus:outline-none focus:ring-2 hover:ring-2 transition"
                />
                <button type="submit" className="ml-4 bg-primary-a0 px-4 py-2 rounded-lg cursor-pointer ring-primary-a0 hover:ring-2 active:ring-0 transition">Add</button>
            </form>
        </div>
    </div>
    </>
    )
}

export default Home;
