import { useEffect, useRef } from "react"

function DropdownFilter({ tasks, dropdownId, setDropdownId, categories, activeCategories, setActiveCategories, setFilteredTasks, showDone, setShowDone }) {
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)

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

    const applyFilters = (categories, done) => {
        let filtered = tasks

        filtered = categories.length > 0 ? filtered.filter(t => categories.includes(t.category)) : filtered
        filtered = !done ? filtered.filter(t => !t.done) : filtered

        setFilteredTasks(filtered)
    }

    const handleCategory = (category) => {
        let newCategories
        if (!activeCategories.includes(category)) {
            newCategories = [...activeCategories, category]
        } else {
            const index = activeCategories.indexOf(category)
            newCategories = activeCategories
            newCategories.splice(index, 1)
        }

        setActiveCategories(newCategories) 
        applyFilters(newCategories, showDone)
    }

    const handleShowDone = () => {
        const newShowDone = !showDone
        setShowDone(newShowDone)
        applyFilters(activeCategories, newShowDone)
    } 

    const toggleDropdown = (id) => {
        setDropdownId(prev => (prev === id ? null : id))
    }

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => toggleDropdown(-1)}
                className="text-left text-surface-a30 hover:text-primary-a0 cursor-pointer transition"
            >Filter</button>
            <div
                ref={dropdownRef}
                className={`dropdown mt-8 -translate-x-3 absolute rounded-xl bg-surface-a10 ring-1 ring-surface-a20 transition ${dropdownId === -1 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
                <ul className="text-surface-a50 select-none">
                    {categories.map((item, index) =>
                        <li key={index}
                            onClick={() => handleCategory(item)}
                            className={`my-2 mx-2 py-1 px-3 text-sm rounded-lg hover:text-white cursor-pointer transition ${activeCategories.includes(item) ? 'bg-primary-a0 text-white' : 'bg-surface-a20'}`}>
                            {item}
                        </li>
                    )}
                        <li key="done-tasks"
                            onClick={handleShowDone}
                            className={`my-2 mx-2 py-1 px-3 text-sm rounded-lg hover:text-white cursor-pointer transition ${showDone ? 'bg-primary-a0 text-white' : 'bg-surface-a20'}`}>
                            Done 
                        </li>
                </ul>
            </div>
        </>
    )
}

export default DropdownFilter

