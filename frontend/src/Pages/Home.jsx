import Header from "../Components/Header";
import NewTask from "../Components/NewTask";
function Home() {

    return(
    <>
    <Header />
    <div className="mt-12 text-white">
        <div className="pt-4 w-2/3 mx-auto text-center">
        <NewTask />
        </div>
    </div>
    </>
    )
}

export default Home;
