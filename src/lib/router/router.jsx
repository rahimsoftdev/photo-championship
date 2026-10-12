import { createBrowserRouter } from "react-router";
// import App from "../../App.jsx";
import MainLayout from "../../layouts/MainLayout.jsx";
import HomePage from "../../pages/HomePage.jsx";
import NotFound from "../../pages/feedback/NotFoundPage.jsx";
import ErrorPage from "../../pages/feedback/ErrorPage.jsx";
import AboutPage from "../../pages/feed/AboutPage.jsx";

export const router = createBrowserRouter([
    {
        path:"/", 
        Component:MainLayout,
        errorElement:<ErrorPage/>,
        children:[
            {
                index:true, Component:HomePage
            },
            {
                path:"about", Component: AboutPage
            }
        ]
    }, {
        path:"*", 
        Component:NotFound
    }
])