import { useState, useEffect, useRef } from "react"
import { getTasks } from "../api"

function DropdownFilter({tasks, setTasks, dropdownId, setDropdownId, categories}){
    const [selectedCategory, setSelectedCategory] = useState('')
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)
    const allTasks = useRef([])

    useEffect(() => {
        (async () => {
            let data = await getTasks()
            allTasks.current = data.filter(task => !task.done).sort((a, b) => b.id - a.id).sort((a, b) => a.done - b.done)
        })()
    }, [tasks])

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !event.target.closest(".dropdown") &&
                !event.target.closest(".dropdown-button")
            ) {
                setDropdownId(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleCategory = (category) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category)
            const filtered = allTasks.current.filter(task => task.category === category)
            setTasks(filtered)
        } else {
            setSelectedCategory('')
            setTasks(allTasks.current)
        } 
    }
    const toggleDropdown = (id) => {
        setDropdownId(prev => (prev === id ? null : id))
    }

    return(
        <>
        <button
            ref={buttonRef}
            onClick={() => toggleDropdown(-1)}
            className="text-left text-surface-a30 hover:text-primary-a0 cursor-pointer transition"
        >Filter</button>
        <div ref={dropdownRef}
        className={`dropdown mt-8 -translate-x-3 absolute rounded-xl bg-surface-a10 ring-1 ring-surface-a20 transition ${dropdownId === -1 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
            <ul className="text-surface-a50 select-none">
            {categories.map((item, index) =>
                <li key={index} onClick={() => handleCategory(item)} className={`my-2 mx-2 py-1 px-3 text-sm rounded-lg hover:text-white cursor-pointer transition ${selectedCategory === item ? 'bg-primary-a0 text-white' : 'bg-surface-a20 '}`}>
                {item} 
                </li>
            )}
            </ul>
        </div>
        </>
    )
}

export default DropdownFilter
