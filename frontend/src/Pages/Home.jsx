import { useEffect, useState } from "react";
import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
import DropdownCategories from "../Components/DropdownCategories";
import Priority from "../Components/Priority";
import Deadline from "../Components/Deadline";
import { getTasks, updateTask } from "../api";
import TaskBody from "../Components/TaskBody";

function Home() {
    const [tasks, setTasks] = useState([])
    const [dropdownId, setDropdownId] = useState(null);
    const [categories, setCategories] = useState([])

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
                    <DropdownCategories 
                        tasks={tasks} 
                        task={task} 
                        setTasks={setTasks} 
                        dropdownId={dropdownId} 
                        setDropdownId={setDropdownId} 
                        categories={categories} 
                        setCategories={setCategories}
                    /> 
                    <TaskBody 
                        tasks={tasks} 
                        task={task} 
                        setTasks={setTasks} 
                    />
                    <div className="flex ml-auto gap-4">
                        <Deadline tasks={tasks} task={task} setTasks={setTasks}/>
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
