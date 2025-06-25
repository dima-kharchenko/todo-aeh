import { useEffect, useState } from "react";
import { getTasks, updateTask, deleteTask } from "../api";
import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
import DropdownCategories from "../Components/DropdownCategories";
import Priority from "../Components/Priority";
import Deadline from "../Components/Deadline";
import TaskBody from "../Components/TaskBody";
import DropdownFilter from "../Components/DropdownFilter";
import DropdownSort from "../Components/DropdownSort";

function Home() {
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [activeCategories, setActiveCategories] = useState([])
    const [activeSort, setActiveSort] = useState('')
    const [showDone, setShowDone] = useState(false)
    const [dropdownId, setDropdownId] = useState(null)
    const [categories, setCategories] = useState([])
    const [deleteMode, setDeleteMode] = useState(false)

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
            const matchesCategories = activeCategories.length > 0 ? activeCategories.includes(task.category) : true
            const matchesDone = showDone || !task.done
            return matchesCategories && matchesDone
        })
        setFilteredTasks(newFiltered)
    }, [activeCategories, showDone])
    
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

    const handleDelete = async (id) => {
        await deleteTask(id)
        const updatedTasks = tasks.filter(t => t.id !== id)
        setTasks(updatedTasks)

        const updatedFilteredTasks = filteredTasks.filter(t => t.id !== id)
        setFilteredTasks(updatedFilteredTasks)
    }

    const resetFilters = async () => {
        setActiveCategories([])
        setActiveSort('')
        setShowDone(false)
        setDeleteMode(false)
    }

    return(
    <>
    <Header />
    <div className="mt-12 text-white">
        <div className="pt-8 w-1/2 mx-auto text-center">
            <NewTask 
                setTasks={setTasks} 
                setFilteredTasks={setFilteredTasks}
                activeCategories={activeCategories}
                showDone={showDone}
            />
            <div className="flex mt-2 px-4 gap-2">
                <DropdownFilter 
                    tasks={tasks} 
                    setTasks={setTasks} 
                    filteredTasks={filteredTasks} 
                    setFilteredTasks={setFilteredTasks}
                    dropdownId={dropdownId} 
                    setDropdownId={setDropdownId} 
                    categories={categories} 
                    activeCategories={activeCategories}
                    setActiveCategories={setActiveCategories}
                    showDone={showDone}
                    setShowDone={setShowDone}
                    updateTaskLocally={updateTaskLocally}
                />
                <DropdownSort 
                    filteredTasks={filteredTasks}
                    setFilteredTasks={setFilteredTasks}
                    dropdownId={dropdownId} 
                    setDropdownId={setDropdownId} 
                    activeSort={activeSort}
                    setActiveSort={setActiveSort}
                />
                <button
                className={`py-1 px-2 rounded-lg cursor-pointer ${deleteMode ? 'bg-primary-a0' : 'text-surface-a30 hover:text-primary-a0'} transition`}
                onClick={() => setDeleteMode(p => !p)}
                >
                Delete
                </button>
                <button
                onClick={() => resetFilters()}
                >
                <div className={`w-3 h-3 rounded-sm cursor-pointer bg-primary-a0 transition-opacity ${activeSort || activeCategories.length > 0 || showDone || deleteMode ? '' : 'opacity-0 scale-0'}`}></div>
                </button>
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
                    <div className="relative ml-auto flex items-center">
                        <div className={`${deleteMode ? 'opacity-0 pointer-events-none' : 'opacity-100'} flex gap-4 transition-opacity`}>
                            <Deadline task={task} updateTaskLocally={updateTaskLocally}/>
                            <Priority task={task} updateTaskLocally={updateTaskLocally}/>
                        </div>
                        <button
                            className={`${deleteMode ? 'opacity-100' : 'opacity-0 pointer-events-none'} text-sm focus:outline-none pr-1 absolute right-0 cursor-pointer hover:text-red-400 transition`}
                            onClick={() => handleDelete(task.id)}
                        >
                            <i className="fa-solid fa-trash"></i> 
                        </button>
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
