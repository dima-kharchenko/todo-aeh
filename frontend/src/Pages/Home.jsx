import { useEffect, useState } from "react";
import { getTasks, updateTask } from "../api";
import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
import DropdownCategories from "../Components/DropdownCategories";
import Priority from "../Components/Priority";
import Deadline from "../Components/Deadline";
import TaskBody from "../Components/TaskBody";
import DropdownFilter from "../Components/DropdownFilter";

function Home() {
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [activeCategory, setActiveCategory] = useState('')
    const [showDone, setShowDone] = useState(false)
    const [dropdownId, setDropdownId] = useState(null)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        (async () => {
            try {
                let data = await getTasks()
                data = data.sort((a, b) => b.id - a.id).sort((a, b) => a.done - b.done)
                setTasks(data)
                setFilteredTasks(data.filter(task => !task.done))
            } catch(err) {
                console.log(err)
            }
        })()
    }, [])

    useEffect(() => {
        const newFiltered = tasks.filter(task => {
            const matchesCategory = activeCategory ? task.category === activeCategory : true
            const matchesDone = showDone || !task.done
            return matchesCategory && matchesDone
        })
        setFilteredTasks(newFiltered)
    }, [activeCategory, showDone])
    
    const updateTaskLocally = async (id, update) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, ...update } : task
        ).sort((a, b) => b.id - a.id)
        setTasks(updatedTasks)

        const updatedFilteredTasks = filteredTasks.map(task =>
            task.id === id ? { ...task, ...update } : task
        )
        setFilteredTasks(updatedFilteredTasks)

        const updatedTask = updatedTasks.find(task => task.id === id)
        await updateTask(updatedTask)
    }

    const handleCheckbox = async (id) => {
        const task = tasks.find(task => task.id === id)
        
        updateTaskLocally(id, {done: !task.done})
    }

    return(
    <>
    <Header />
    <div className="mt-12 text-white">
        <div className="pt-8 w-1/2 mx-auto text-center">
            <NewTask 
                setTasks={setTasks} 
                setFilteredTasks={setFilteredTasks}
                activeCategory={activeCategory}
                showDone={showDone}
            />
            <div className="flex mt-2 px-4">
                <DropdownFilter 
                    tasks={tasks} 
                    setTasks={setTasks} 
                    filteredTasks={filteredTasks} 
                    setFilteredTasks={setFilteredTasks}
                    dropdownId={dropdownId} 
                    setDropdownId={setDropdownId} 
                    categories={categories} 
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    showDone={showDone}
                    setShowDone={setShowDone}
                    updateTaskLocally={updateTaskLocally}
                />
            </div>
            <div className="mt-8 space-y-2">
            {filteredTasks.map((task, index) => 
                <div className="transition flex px-3 py-2 bg-surface-a10 rounded-lg" key={index}>
                    <form className="w-4 h-4 mr-2">
                        <input 
                            type="checkbox"
                            name={`checkbox-${task.id}`}
                            checked={task.done} 
                            onChange={() => handleCheckbox(task.id)}
                            className="w-full h-full my-1 cursor-pointer focus:outline-none appearance-none bg-surface-a20 rounded-sm hover:ring-2 ring-primary-a0 checked:bg-primary-a0 transition"
                        />
                    </form>
                    <DropdownCategories 
                        tasks={tasks} 
                        task={task} 
                        dropdownId={dropdownId} 
                        setDropdownId={setDropdownId} 
                        categories={categories} 
                        setCategories={setCategories}
                        updateTaskLocally={updateTaskLocally}
                    /> 
                    <TaskBody tasks={tasks} task={task} setTasks={setTasks} setFilteredTasks={setFilteredTasks} /> 
                    <div className="flex ml-auto gap-4">
                        <Deadline task={task} updateTaskLocally={updateTaskLocally}/>
                        <Priority task={task} updateTaskLocally={updateTaskLocally}/>
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
