import { useEffect, useRef } from "react"

function DropdownSort({ setFilteredTasks, dropdownId, setDropdownId, activeSort, setActiveSort }) {
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

    const applySort = (sort) => {
        switch(sort) {
            case 'deadline':
                setFilteredTasks(p => (p.sort((a, b) => {return new Date(a.deadline) - new Date(b.deadline)})))
                break
            case 'priority':
                setFilteredTasks(p => (p.sort((a, b) => {return new Date(b[sort]) - new Date(a[sort])})))
                break
            default:
                setFilteredTasks(p => (p.sort((a, b) => b.id - a.id)))
                break
        }
    }

    const handleSort = (category) => {
        const newSort = category !== activeSort ? category : ''
        setActiveSort(newSort)
        applySort(newSort)
    }

    const toggleDropdown = (id) => {
        setDropdownId(prev => (prev === id ? null : id))
    }

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => toggleDropdown(-2)}
                className="ml-2 text-left text-surface-a30 hover:text-primary-a0 cursor-pointer transition"
            >Sort</button>
            <div
                ref={dropdownRef}
                className={`dropdown mt-8 translate-x-5.5 absolute rounded-xl bg-surface-a10 ring-1 ring-surface-a20 transition ${dropdownId === -2 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
                <ul className="text-surface-a50 select-none">
                    {['Deadline', 'Priority'].map((item, index) =>
                        <li key={index}
                            onClick={() => handleSort(item.toLowerCase())}
                            className={`my-2 mx-2 py-1 px-3 text-sm rounded-lg hover:text-white cursor-pointer transition ${activeSort === item.toLowerCase() ? 'bg-primary-a0 text-white' : 'bg-surface-a20'}`}>
                            {item}
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default DropdownSort

