import { useState, useEffect, useRef } from "react"
import { updateTask } from "../api"

function DropdownCategories({tasks, task, setTasks, dropdownId, setDropdownId, categories, setCategories}){
    const [newCategory, setNewCategory] = useState('')
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null);

    useEffect(() => {
        setCategories([...new Set(tasks.filter(task => !task.done).map(task => task.category).filter(Boolean))])
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !event.target.closest(".dropdown") &&
                !event.target.closest(".dropdown-button")
            ) {
                setDropdownId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCategory = async (id, category) => {
        const task = tasks.find(t => t.id === id);
        const newCategory = task.category === category ? '' : category

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
        setDropdownId(prev => (prev === id ? null : id));
    }

    return(
        <>
        <button ref={buttonRef} onClick={() => toggleDropdown(task.id)} className={`dropdown-button mr-2  ${task.done ? 'text-surface-a30' : 'text-surface-a40 hover:text-primary-a0 cursor-pointer'} focus:outline-none transition`}>{task.category ? task.category : '#'}</button>
        {!task.done && 
        <div ref={dropdownRef}
        className={`dropdown mt-9 absolute translate-x-1 rounded-xl bg-surface-a10 ring-1 ring-surface-a20 transition ${dropdownId === task.id ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
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
        </>
    )
}

export default DropdownCategories;
