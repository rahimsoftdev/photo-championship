import { createBrowserRouter } from "react-router";
// import App from "../../App.jsx";
import MainLayout from "../../layouts/MainLayout.jsx";

export const router = createBrowserRouter([
    {
        path:"/", 
        Component:MainLayout
    }
])