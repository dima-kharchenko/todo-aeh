import { useEffect, useState, useRef } from "react";
import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
import { getTasks, updateTask } from "../api";
function Home() {
    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([])
    const [newCategory, setNewCategory] = useState('')

    const [hoveredPriority, setHoveredPriority] = useState({});

    const [dropdownOpen, setDropdownOpen] = useState({})
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null);
    
    useEffect(() => {
        (async () => {
            try {
                let data = await getTasks()
                data = data.filter(task => !task.done).sort((a, b) => b.id - a.id).sort((a, b) => a.done - b.done)
                setTasks(data)
                setCategories([...new Set(data.map(task => task.category).filter(Boolean))])
            } catch(err) {
                console.log(err)
            }
        })()
    }, [])


    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !event.target.closest(".dropdown") &&
                !event.target.closest(".dropdown-button")
            ) {
                setDropdownOpen({});
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCheckbox = async (id) => {
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task).sort((a, b) => b.id - a.id)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(task => task.id === id)
        await updateTask(updatedTask)
    }

    const handlePriority = async (id, priority) => {
        const task = tasks.find(t => t.id === id)
        const newPriority = task.priority === priority ? 0 : priority

        const updatedTasks = tasks.map(task => task.id === id ? { ...task, priority: newPriority } : task)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(t => t.id === id)
        await updateTask(updatedTask)
    }

    const handleCategory = async (id, category) => {
        const task = tasks.find(t => t.id === id);
        const newCategory = task.category === category ? 0 : category

        const updatedTasks = tasks.map(task => task.id === id ? { ...task, category: newCategory} : task)
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(t => t.id === id)
        await updateTask(updatedTask)
    } 

    const handleAddCategory = async (e, id) => {
        e.preventDefault()
        setCategories(p => ([...p, newCategory]))
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, category: newCategory} : task)
        setNewCategory('')
        setTasks(updatedTasks)

        const updatedTask = updatedTasks.find(t => t.id === id)
        await updateTask(updatedTask)
    }

    const toggleDropdown = (id) => {
        setDropdownOpen(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


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
                    {task.category && 
                        <div>
                        <button ref={buttonRef} onClick={() => toggleDropdown(task.id)} className={`dropdown-button mr-2 text-surface-a30 ${task.done ? '' : 'hover:text-primary-a0 cursor-pointer'} focus:outline-none transition`}>{task.category}</button>
                        {!task.done && 
                        <div ref={dropdownRef}
                        className={`dropdown mt-3 absolute -translate-x-4.5 rounded-xl bg-surface-a10 ring-1 ring-primary-a0 transition ${ dropdownOpen[task.id] ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        >
                            <ul className="text-surface-a50 select-none">
                            {categories.map((item, index) =>
                                <li key={index} onClick={() => handleCategory(task.id, item)} className={`my-2 mx-2 py-1 px-3 text-sm rounded-lg hover:text-white cursor-pointer transition ${task.category === item ? 'bg-primary-a0 text-white' : 'bg-surface-a20 '}`}>
                                {item} 
                                </li>
                            )}
                                <li key="new-collection" className="mx-2">
                                    <form onSubmit={(e) => handleAddCategory(e, task.id)}>
                                        <input
                                            placeholder="Add"
                                            className="mb-2 px-2 py-1 w-full rounded-lg text-center focus:outline-none field-sizing-content bg-surface-a20 placeholder:text-surface-a50 text-sm focus:placeholder:text-transparent transition"
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            />
                                    </form>
                                </li>
                            </ul>
                        </div>
                        }
                        </div>
                    }
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
                                onClick={!task.done ? () => handlePriority(task.id, priority) : ''}
                                className={`w-3 h-3 rounded-sm transition ${
                                  active && !task.done ? "bg-primary-a30 cursor-pointer" : "bg-surface-a20"
                                }`}
                              />
                            );
                          })}
                        </div>
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
