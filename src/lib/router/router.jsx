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
import MyStoreTab from "../../pages/profile/MyStoreTab.jsx";
import FavoritePhotos from "../../pages/userDashboard/FavoritePhotos.jsx";
import SupportPage from "../../pages/userDashboard/SupportPage.jsx";
import ProfileDetailsEditor from "../../pages/userDashboard/ProfileDetailsEditor.jsx";
import PrizeAndPayments from "../../pages/userDashboard/PrizeAndPayments.jsx";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout.jsx";
import AdminOverview from "../../pages/adminDashboard/AdminOverview.jsx";
import Categories from "../../pages/adminDashboard/Categories.jsx";
import EditAlbumTypesPage from "../../pages/adminDashboard/EditAlbumTypePage.jsx";
import TopPhotographersSection from "../../components/shared/TopPhotographersSection.jsx";
import UsersManagement from "../../pages/adminDashboard/UserMangementPage.jsx";
import CompetitionManagementPage from "../../pages/adminDashboard/CompetitionManagementPage.jsx";
import GalleryManagementPage from "../../pages/adminDashboard/GalleryManagementPage.jsx";
import BayPhotoMangement from "../../pages/adminDashboard/BayPhotoMangement.jsx";
import PromotedProductsPage from "../../pages/adminDashboard/Promotedproductspage.jsx";
import SupportInbox from "../../pages/adminDashboard/Supportinbox.jsx";
import BusinessLinkPhotos from "../../pages/adminDashboard/Businesslinkphotos.jsx";
import BusinessLinkPhotoDetails from "../../pages/adminDashboard/Businesslinkphotodetails.jsx";
import Newsletter from "../../pages/adminDashboard/Newsletter.jsx";
import CommentManagement from "../../pages/adminDashboard/Commentmanagement.jsx";
import AdsManagement from "../../pages/adminDashboard/Adsmanagement.jsx";
import DemoProfiles from "../../pages/adminDashboard/Demoprofiles.jsx";
import AddDemoProfile from "../../pages/adminDashboard/Adddemoprofile.jsx";
import ReportsModeration from "../../pages/adminDashboard/Reportsmoderation.jsx";
import ReportDetails from "../../pages/adminDashboard/Reportdetails.jsx";
import PromoLinkManagement from "../../pages/adminDashboard/Promolinkmanagement.jsx";
import AdsAnnouncements from "../../pages/adminDashboard/AdsAnnouncements.jsx";
import MyProfile from "../../pages/adminDashboard/MyProfile.jsx";
import AdminAccessDenied from "../../pages/auth/Adminaccessdenied.jsx";
import NewsAndMessageDetailsPage from "../../pages/userDashboard/Newsandmessagedetailspage.jsx";
import ProductDetaisPage from "../../pages/userDashboard/ProductDetaisPage.jsx";

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
            //feed:
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
            },

            //photograhpar profile details routes
            {
                path: "photographers/:id", Component: PhotographarDetailsLayout,
                children: [
                    {
                        index: true, Component: ProfileTab
                    },
                    {
                        path: "artworks", Component: ArtworksTab
                    },
                    {
                        path: "premium-photos", Component: BayPhotoTab
                    },
                    {
                        path: "posts", Component: PostTab
                    },
                    {
                        path: "store", Component: MyStoreTab
                    },
                ]
            },
        ],

    },

    //auth:
    //loign
    {
        path: "login", Component: LoginPage
    },
    //register
    {
        path: "register", Component: Register
    },
    {
        path:"access-denied", Component:AdminAccessDenied
    },

    //user dashboard
    {
        path: "user-dashboard", Component: UserDashboardLayout,
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
                path: "news-message/:id", Component: NewsAndMessageDetailsPage
            },
            {
                path: "news-message/new", Component: UploadMessagePage
            },

            //sel photos
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
                path: "my-store/:id", Component:ProductDetaisPage
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
            //order route
            {
                path: "orders", Component: OrdersPage
            },
            //my orders route
            {
                path: "my-orders", Component: MyOrdersPage
            },
            //order details route
            {
                path: "orders/:id", Component: OrderDetailsPage
            },
            //my order details route:
            {
                path: "my-orders/:id", Component: MyOrderDetailsPage
            },
            //my all favorite photographers:
            {
                path: "favourite-photographers", Component: FavoritePhotographarPage
            },
            //profile in user dashboard
            {
                path: "photographers/:id", Component: PhotographarDetailsLayout,
                children: [
                    {
                        index: true, Component: ProfileTab
                    },
                    {
                        path: "artworks", Component: ArtworksTab
                    },
                    {
                        path: "premium-photos", Component: BayPhotoTab
                    },
                    {
                        path: "posts", Component: PostTab
                    },
                    {
                        path: "store", Component: MyStoreTab
                    },
                ]
            },
            {
                path: "favourite-photos", Component: CompetitionPage
            },
            {
                path: "contact-us", Component: SupportPage
            },
            {
                path: "settings", Component: ProfileDetailsEditor
            },
            {
                path: "prize-payments", Component: PrizeAndPayments
            },
        ]
    },

    //admin dashboard:
    {
        path: "admin-dashboard", Component: AdminDashboardLayout,
        children: [
            {
                index: true, Component: AdminOverview
            },
            {
                path: "payouts", Component: PrizeAndPayments
            },
            {
                path: "categories", Component: Categories
            },
            {
                path: "album-types", Component: EditAlbumTypesPage
            },
            {
                path: "winners", Component: TopPhotographersSection
            },
            {
                path: "users", Component: UsersManagement
            },
            {
                path: "competitions", Component: CompetitionManagementPage
            },
            {
                path: "competitions/:id", Component: ArtwokDetailsPage
            },
            {
                path: "gallery", Component: GalleryManagementPage
            },
            {
                path: "gallery/:id", Component: ArtwokDetailsPage
            },
            {
                path: "premium-photos", Component: BayPhotoMangement
            },
            {
                path: "premium-photos/:id", Component: BayImageDetailsPage
            },
            {
                path: "promoted-albums", Component: PromotedProductsPage
            },
            {
                path: "support", Component: SupportInbox
            },
            {
                path: "business-link-photos", Component: BusinessLinkPhotos
            },
            {
                path: "business-link-photos/details", Component: BusinessLinkPhotoDetails
            },
            {
                path: "newsletter", Component: Newsletter
            },
            {
                path: "comment", Component: CommentManagement
            },
            {
                path: "ads-management", Component: AdsManagement
            },
            {
                path: "demo-profile", Component: DemoProfiles
            },
            {
                path: "demo-profiles/add", Component: AddDemoProfile
            },
            {
                path: "reports-resolved", Component: ReportsModeration
            },
            {
                path: "reports-resolved/details", Component: ReportDetails
            },
            {
                path: "promo-links", Component: PromoLinkManagement
            },
            {
                path: "settings", Component: AdsAnnouncements
            },
            {
                path: "profile", Component: MyProfile
            },
        ]
    },





    {
        path: "*",
        Component: NotFound,
        errorElement: <ErrorPage />
    }
])