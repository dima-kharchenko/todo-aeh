import { useState, useEffect, useRef } from "react"

function DropdownCategories({task, dropdownId, setDropdownId, categories, updateTaskLocally}){
    const [newCategory, setNewCategory] = useState('')
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null);

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

    const handleCategory = async (category) => {
        const newCategory = task.category === category ? '' : category
        updateTaskLocally(task.id, {category: newCategory})
    } 

    const handleAddCategory = async (e) => {
        e.preventDefault()
        updateTaskLocally(task.id, {category: newCategory})
        setNewCategory('')
    }

    const toggleDropdown = () => {
        setDropdownId(prev => (prev === task.id ? null : task.id))
    }

    return(
        <>
        <button ref={buttonRef} onClick={toggleDropdown} className={`dropdown-button mr-2  ${task.done ? 'text-surface-a30' : 'text-surface-a40 hover:text-primary-a0 cursor-pointer'} focus:outline-none transition`}>{task.category ? task.category : '#'}</button>
        {!task.done && 
        <div ref={dropdownRef}
        className={`dropdown mt-9 absolute translate-x-1 rounded-xl bg-surface-a10 ring-1 ring-surface-a20 transition ${dropdownId === task.id ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
            <ul className="text-surface-a50 select-none">
            {categories.map((item, index) =>
                <li key={index} onClick={() => handleCategory(item)} className={`my-2 mx-2 py-1 px-3 text-sm rounded-lg hover:text-white cursor-pointer transition ${task.category === item ? 'bg-primary-a0 text-white' : 'bg-surface-a20 '}`}>
                {item} 
                </li>
            )}
                <li key="new-collection" className="mx-2">
                    <form onSubmit={(e) => handleAddCategory(e)}>
                        <input
                            placeholder="Add"
                            name="add-category"
                            className={`mb-2 px-2 py-1 ${categories.length > 0 ? '' : 'mt-2'} w-full rounded-lg text-center focus:outline-none field-sizing-content bg-surface-a20 placeholder:text-surface-a50 text-sm focus:placeholder:text-transparent transition`}
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

export default DropdownCategories
