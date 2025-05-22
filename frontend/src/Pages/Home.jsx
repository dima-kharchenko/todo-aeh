import { useEffect, useState } from "react";
import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
import { getTasks, updateTask } from "../api";
function Home() {
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await getTasks()
                data = data.filter(task => !task.done).sort((a, b) => b.id - a.id).sort((a, b) => a.done - b.done)
                setTasks(data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const handleCheckbox = async (id) => {
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task).sort((a, b) => b.id - a.id).sort((a, b) => a.done - b.done)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(task => task.id === id)
        await updateTask(updatedTask)
    }
    return(
    <>
    <Header />
    <div className="mt-12 text-white">
        <div className="pt-8 w-2/3 mx-auto text-center">
        <NewTask setTasks={setTasks}/>
        <div>
        {tasks.map((task, index) => 
            <div className="flex" key={index}>
                <form>
                    <input 
                        type="checkbox"
                        checked={task.done} 
                        onChange={() => handleCheckbox(task.id)}
                    />
                </form>
                <p>{task.body}</p>
                <p>{task.category}</p>
            </div>
        )}
        </div>
        </div>
    </div>
    </>
    )
}

export default Home;
