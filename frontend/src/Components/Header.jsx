import { logout } from '../api';
import { useNavigate } from 'react-router-dom';

function Header(){
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch(e) {
            console.error(e)
        }
    }
    return(
        <>
        <div>
        <nav className="border-b-1 bg-surface-a0 border-primary-a0 fixed top-0 w-full z-50 select-none">
            <div className="px-5 flex flex-wrap items-center justify-between mx-auto h-12"> 
                <a href="https://github.com/dima-kharchenko/todo-aeh" target="_blank"><i className="fa-brands fa-github text-3xl text-white"></i></a>
                <div className="flex text-white">
                    <a href="/" className="cursor-pointer font-medium">Home</a>
                    <p onClick={handleLogout} className="cursor-pointer ml-2">Logout</p>
                </div>
            </div>
        </nav>
        </div>
        </>
    );
}

export default Header

