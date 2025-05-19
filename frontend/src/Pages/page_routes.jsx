import Home from "../Pages/Home";
import NotFound from "../Pages/NotFound";

const page_routes = [
  { path: '/', page: Home, protected: false },
  { path: '*', page: NotFound },  
];

export default page_routes;
