import { useEffect, useState } from "react";
import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
import DropdownCategories from "../Components/DropdownCategories";
import Priority from "../Components/Priority";
import { getTasks, updateTask } from "../api";

function Home() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        (async () => {
            try {
                let data = await getTasks()
                data = data.filter(task => !task.done).sort((a, b) => b.id - a.id).sort((a, b) => a.done - b.done)
                setTasks(data)
            } catch(err) {
                console.log(err)
            }
        })()
    }, [])
    
    const handleCheckbox = async (id) => {
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task).sort((a, b) => b.id - a.id)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(task => task.id === id)
        await updateTask(updatedTask)
    }

    return(
    <>
    <Header />
    <div className="mt-12 text-white">
        <div className="pt-8 w-1/2 mx-auto text-center">
            <NewTask setTasks={setTasks}/>
            <div className="mt-8 space-y-2">
            {tasks.map((task, index) => 
                <div className="transition flex px-3 py-2 bg-surface-a10 rounded-lg" key={index}>
                    <form className="w-4 h-4 mr-2">
                        <input 
                            type="checkbox"
                            checked={task.done} 
                            onChange={() => handleCheckbox(task.id)}
                            className="w-full h-full my-1 cursor-pointer focus:outline-none appearance-none bg-surface-a20 rounded-sm hover:ring-2 ring-primary-a0 checked:bg-primary-a0 transition"
                        />
                    </form>
                    <DropdownCategories tasks={tasks} task={task} setTasks={setTasks}/> 
                    <p className={`${task.done ? 'text-surface-a30' : ''} transition`}>{task.body}</p>
                    <div className="flex ml-auto gap-2">
                        {task.deadline && (() => {
                            const deadline = new Date(task.deadline);
                            const now = new Date();
                            const isToday =
                                deadline.getDate() === now.getDate() &&
                                deadline.getMonth() === now.getMonth() &&
                                deadline.getFullYear() === now.getFullYear();
                            return (
                            <p className={`text-sm my-auto ${task.done ? 'text-surface-a30' : 'text-surface-a50'} transition`}>
                                {isToday ? 
                                new Date(task.deadline).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
                                : 
                                new Date(task.deadline).toLocaleString("pl-PL", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        )
                        })()}
                        <Priority tasks={tasks} task={task} setTasks={setTasks}/>
                    </div>
                </div>
            )}
            </div>
        </div>
    </div>
    </>
    )
}

export default Home;
