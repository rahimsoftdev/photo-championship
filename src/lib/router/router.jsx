import { createBrowserRouter } from "react-router";
// import App from "../../App.jsx";
import MainLayout from "../../layouts/MainLayout.jsx";
import HomePage from "../../pages/HomePage.jsx";
import NotFound from "../../pages/feedback/NotFoundPage.jsx";
import ErrorPage from "../../pages/feedback/ErrorPage.jsx";
import AboutPage from "../../pages/feed/AboutPage.jsx";
import FeedLayout from "../../layouts/FeedLayout.jsx";
import CompetitionPage from "../../pages/feed/CompetitionPage.jsx";
import GalleryPage from "../../pages/feed/GalleryPage.jsx";
import ArtwokDetailsPage from "../../pages/feed/ArtwokDetailsPage.jsx";
import AlbumTypePage from "../../pages/feed/AlbumTypePage.jsx";
import BayPhotosPage from "../../pages/feed/BayPhotosPage.jsx";
import BayImageDetailsPage from "../../pages/feed/BayImageDetailsPage.jsx";
import ByCheckOut from "../../pages/feed/ByCheckOut.jsx";
import LeaderboardPage from "../../pages/feed/LeaderboardPage.jsx";
import WinnerPage from "../../pages/feed/WinnerPage.jsx";
import Register from "../../pages/auth/RegisterPage.jsx";
import LoginPage from "../../pages/auth/LoginPage.jsx";
import UserDashboardLayout from "../../layouts/UserDashboardLayout.jsx";
import HomePageDhshboard from "../../pages/userDashboard/HomePageDhshboard.jsx";
import MyArtwork from "../../pages/userDashboard/MyArtwork.jsx";
import UploadArtWorkTypes from "../../pages/UploadArtWorkTypes.jsx";
import UploadArtWorkPage from "../../pages/userDashboard/UploadArtWorkPage.jsx";
import NewsAndMessagePage from "../../pages/userDashboard/NewsAndMessagePage.jsx";
import UploadMessagePage from "../../pages/userDashboard/UploadMessagePage.jsx";
import SellPhotosPage from "../../pages/feed/SellPhotosPage.jsx";
import MyStore from "../../pages/userDashboard/MyStore.jsx";
import CollectionForm from "../../pages/userDashboard/CollectionForm.jsx";
import BusinessLinkPage from "../../pages/userDashboard/BusinessLinkPhotosPage.jsx";
import NotificationsPage from "../../pages/userDashboard/NotificationsPage.jsx";
import OrdersPage from "../../pages/userDashboard/OrdersPage.jsx";
import OrderDetailsPage from "../../pages/userDashboard/OrderDetailsPage.jsx";
import MyOrdersPage from "../../pages/userDashboard/MyOrdersPage.jsx";
import MyOrderDetailsPage from "../../pages/userDashboard/MyOrderDetailsPage.jsx";
import FavoritePhotographarPage from "../../pages/userDashboard/FavoritePhotographerPage.jsx";
import PhotographarDetailsLayout from "../../layouts/PhotographarDetailsLayout.jsx";
import ProfileTab from "../../pages/profile/ProfileTab.jsx";
import ArtworksTab from "../../pages/profile/ArtworksTab.jsx";
import BayPhotoTab from "../../pages/profile/BayPhotoTab.jsx";
import PostTab from "../../pages/profile/PostTab.jsx";

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
                path: "leaderboard", Component: LeaderboardPage
            },
            {
                path: "album-types", Component: AlbumTypePage
            },
            {
                path: "winners", Component: WinnerPage
            },
            {
                path: "feed",
                Component: FeedLayout,
                children: [
                    {
                        path: "competition", Component: CompetitionPage
                    },
                    {
                        path: "gallery", Component: GalleryPage
                    },
                    {
                        path: 'buy-photos', Component: BayPhotosPage
                    }
                ]
            },
            {
                path: "artwokrdetails/:id", Component: ArtwokDetailsPage
            },
            {
                path: "bayimagedetails/:id", Component: BayImageDetailsPage
            },
            {
                path: "bayimagedetails/checkout", Component: ByCheckOut
            }
        ]
    },
    {
        path: "login", Component: LoginPage
    },
    {
        path: "register", Component: Register
    },
    {
        path: "userDashboard", Component: UserDashboardLayout,
        children: [
            {
                index: true, Component: HomePageDhshboard
            },
            //start artwork management routes
            {
                path: "artwork-management", Component: MyArtwork
            },
            {
                path: "artwork-management/:id", Component: ArtwokDetailsPage
            },
            {
                path: "artwork-management/UploadArtWorkTypes", Component: UploadArtWorkTypes
            },
            {
                path: "artwork-management/UploadArtWork", Component: UploadArtWorkPage
            },
            //news and message route:
            {
                path: "news-message", Component: NewsAndMessagePage
            },
            {
                path: "news-message/new", Component: UploadMessagePage
            },
            {
                path: "sell-photos", Component: SellPhotosPage
            },
            {
                path: "sell-photos/new", Component: UploadArtWorkPage
            },
            {
                path: "sell-photos/:id", Component: BayImageDetailsPage
            },
            //my store routs:
            {
                path: "my-store", Component: MyStore
            },
            {
                path: "my-store/new", Component: CollectionForm
            },
            //business-link-photos
            {
                path: "business-link-photos", Component: BusinessLinkPage
            },
            //notification
            {
                path: "notifications", Component: NotificationsPage
            },
            {
                path: "orders", Component: OrdersPage
            },
            {
                path: "my-orders", Component: MyOrdersPage
            },
            {
                path: "orders/:id", Component: OrderDetailsPage
            },
            {
                path: "my-orders/:id", Component: MyOrderDetailsPage
            },
            {
                path: "favourite-photographers", Component: FavoritePhotographarPage
            }
        ]
    },
    {
        path: "adminDashboard"
    },
    {
        path: "photographers/:id", Component: PhotographarDetailsLayout,
        children: [
                {
                    index:true, Component:ProfileTab
                }, 
                {
                    path:"artworks", Component: ArtworksTab
                },
                {
                    path:"premium-photos", Component: BayPhotoTab
                },
                {
                    path:"posts", Component: PostTab
                },
        ]
    },
    {
        path: "*",
        Component: NotFound,
        errorElement: <ErrorPage />
    }
])