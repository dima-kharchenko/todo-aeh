import { useEffect, useState, useMemo } from "react";
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
    const [activeCategories, setActiveCategories] = useState([])
    const [activeSort, setActiveSort] = useState('')
    const [showDone, setShowDone] = useState(false)
    const [dropdownId, setDropdownId] = useState(null)
    const [deleteMode, setDeleteMode] = useState(false)
    const [recentlyCreated, setRecentlyCreated] = useState([])
    const [recentlyDone, setRecentlyDone] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const data = await getTasks()
                data.sort((a, b) => b.id - a.id || a.done - b.done)
                setTasks(data)
            } catch(err) {
                console.log(err)
            }
        })()
    }, [])

    const categories = useMemo(() => {
        const s = new Set()
        tasks.forEach(t => { if (!t.done && t.category) s.add(t.category) })
        return Array.from(s)
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        let res = tasks.filter(task => {
            const matchesCategories = activeCategories.length > 0 ? activeCategories.includes(task.category) : true
            const matchesDone = showDone || !task.done || recentlyDone.includes(task.id)

            return (matchesCategories && matchesDone) || recentlyCreated.includes(task.id)
        })
        setRecentlyCreated([])

        switch(activeSort) {
            case 'deadline':
                res = res.sort((a, b) => {return new Date(a.deadline) - new Date(b.deadline)})
                break
            case 'priority':
                res = res.sort((a, b) => (a.done - b.done) || (b.priority - a.priority))
                break
            case 'category':
                res = res.sort((a, b) => a.category.localeCompare(b.category))
                break
            default:
                res = res.sort((a, b) => {
                    if (recentlyDone.includes(a.id) && recentlyDone.includes(b.id)) return b.id - a.id
                    if (recentlyDone.includes(a.id)) return -1
                    if (recentlyDone.includes(b.id)) return 1

                    return (a.done - b.done) || (b.id - a.id)
                })
                break

        }
        setRecentlyDone([])

        return res
    }, [tasks, activeCategories, activeSort, showDone])


    const updateTaskLocally = async (id, update) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, ...update } : task
        ).sort((a, b) => b.id - a.id)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(task => task.id === id)
        await updateTask(updatedTask)
    }

    const handleCheckbox = async (id) => {
        const task = tasks.find(task => task.id === id)
        setRecentlyDone(p => [id, ...p])
        
        updateTaskLocally(id, {done: !task.done})
    }

    const handleDelete = async (id) => {
        await deleteTask(id)
        setTasks(tasks.filter(t => t.id !== id))
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
                setRecentlyCreated={setRecentlyCreated}
            />
            <div className="flex mt-2 px-4 gap-2">
                <DropdownFilter 
                    dropdownId={dropdownId} 
                    setDropdownId={setDropdownId} 
                    categories={categories} 
                    activeCategories={activeCategories}
                    setActiveCategories={setActiveCategories}
                    showDone={showDone}
                    setShowDone={setShowDone}
                />
                <DropdownSort 
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
            {filteredTasks.map(task => 
                <div className="transition flex px-3 py-2 bg-surface-a10 rounded-lg" key={task.id}>
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
                        task={task} 
                        dropdownId={dropdownId} 
                        setDropdownId={setDropdownId} 
                        categories={categories} 
                        updateTaskLocally={updateTaskLocally}
                    /> 
                    <TaskBody
                        tasks={tasks} 
                        task={task} 
                        setTasks={setTasks} 
                    /> 
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
