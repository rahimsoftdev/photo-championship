import { createBrowserRouter } from "react-router";
// import App from "../../App.jsx";
import MainLayout from "../../layouts/MainLayout.jsx";
import HomePage from "../../pages/HomePage.jsx";
import NotFound from "../../pages/feedback/NotFoundPage.jsx";
import ErrorPage from "../../pages/feedback/ErrorPage.jsx";
import AboutPage from "../../pages/feed/AboutPage.jsx";
import FeedLayout from "../../layouts/FeedLayout.jsx";
import CompetitionPage from "../../pages/feed/CompetitionPage.jsx";

//for user dashboard use:  /user route
//for admin dashboard use:  /admin route
//for competition, gallery and Bay photo pages use: /feed

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true, Component: HomePage
            },
            {
                path: "about", Component: AboutPage
            },
            {
                path: "feed",
                Component: FeedLayout,
                children: [
                    {
                        path:"competition", Component: CompetitionPage
                    }
                ]
            },
        ]
    },
    {
        path: "*",
        Component: NotFound
    }
])