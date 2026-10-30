# 🏆 Photo Championship (My12Photos)

> **A premier global photography competition, visual storytelling, and digital marketplace platform.**

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v3.2.6-000000?style=flat-square&logoColor=white)](https://heroui.com/)
[![React Router](https://img.shields.io/badge/React_Router-v8.4.0-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 📌 Short Summary

**Photo Championship (My12Photos)** is an innovative web platform that redefines online photography contests by combining creative sequential storytelling with community-driven peer voting, cash rewards, and an integrated stock photo and merchandise marketplace. Inspired by the sun's journey through the twelve signs of the zodiac, photographers from across the globe can compete in single-shot, 6-photo narrative, or 12-photo zodiac arc formats—all completely free of charge.

---

## 📖 Project Description

**Photo Championship (My12Photos)** is engineered to empower photographers of all levels—from amateur mobile shutterbugs to seasoned visual storytellers—by giving them a fair, transparent, and rewarding global stage. Unlike traditional photo-sharing apps that rely purely on algorithmic vanity metrics, Photo Championship emphasizes **visual narrative structure, community appreciation, and real financial rewards**.

The platform provides a dual-dashboard architecture:
- **Creators (Users)** have access to a complete studio dashboard to submit and organize multi-photo entries, slot photos into zodiac signs, curate custom storefronts, monitor orders and sales, track cash prize payouts via PayPal, chat directly with clients, and analyze artwork engagement.
- **Administrators** enjoy a powerful management suite to moderate submissions, curate galleries, configure competition categories and tiers, manage demo profiles, resolve dispute reports, schedule announcements, review payouts, and manage advertisement banners.

With zero entry fees, monthly prize pools, transparent community voting, and integrated licensing, Photo Championship bridges the gap between artistic competition, social recognition, and commercial success.

---

## 🎯 Overview

### 💡 Purpose
- **Democratize Photography Competitions:** Eliminate high entry fees and elitist gatekeeping; participation is 100% free forever.
- **Elevate Visual Storytelling:** Introduce structured narrative formats (single, 6-photo story, and 12-photo zodiac timeline) that challenge creators beyond standalone snapshots.
- **Transparent & Fair Recognition:** Empower the community with transparent voting mechanisms, real-time leaderboards, and an indelible Hall of Fame / Winners Archive.
- **Creator Monetization:** Enable photographers to sell high-resolution digital licenses (Bay Photos), market custom merchandise/prints via personal storefronts, and win recurring monthly cash prizes.
- **End-to-End Platform Control:** Provide administrators with robust content moderation, category management, financial payout management, and promotional advertisement tools.

### ⭐ Key Features

#### 1. 🏅 Tiered Competition System
- **Single Photo:** For striking standalone images judged directly on impact, composition, and technical execution ($1,500 monthly prize pool).
- **6 Photos Story:** For narrative arcs, photojournalism essays, and conceptual sequences ($2,500 monthly prize pool).
- **12 Photos Zodiac Story:** The flagship tier where creators map a cohesive narrative across twelve images matching the zodiac sequence ($3,500 grand prize pool).

#### 2. 🗳️ Community Voting & Leaderboard
- Peer-based community voting ensuring fairness and transparency.
- Real-time **Leaderboard** showcasing top-ranked photographers and submissions.
- **Winners Archive & Hall of Fame** celebrating past champions with filterable monthly archives.

#### 3. 🛍️ Digital Marketplace & Creator Store
- **Bay Photos (Buy Photos):** Search, browse, and purchase high-resolution licensed stock photography with integrated checkout.
- **Photographer Storefronts:** Dedicated profile stores for prints, digital presets, frames, and merchandise.
- **Order Tracking:** Comprehensive order lifecycle management with status badges (`Pending`, `Processing`, `Delivered`, `Cancelled`).

#### 4. 🎨 Creator Studio & User Dashboard
- **Creative Upload Hub:** Multi-step upload wizard with zodiac slot configuration, image previews, and video attachments.
- **Artwork Management:** Track status, view analytics (impressions, votes, views), edit details, and promote albums.
- **Direct Messaging & Chat:** Real-time chat interface with photographer conversations, attachments, and messaging history.
- **Prize & Payouts Center:** Monitor prize earnings, submit PayPal payout requests, and view transaction history.
- **Community Feed & News:** Publish posts, updates, and photography articles.

#### 5. 🛡️ Admin Control Suite
- **Analytics & Workspace Overview:** Platform statistics, active competitions, revenue, and member growth charts.
- **Competition & Gallery Moderation:** Review, approve, reject, or feature submitted albums.
- **Category & Album Management:** Dynamically configure categories, competition formats, and seasonal themes.
- **Demo Profiles:** Create and simulate demo photographer profiles for system testing and showcase purposes.
- **Reports & Moderation Desk:** Handle reported content, investigate flags, and maintain platform integrity.
- **Advertising & Announcements:** Schedule top announcement banners, promotional cards, and sponsored campaign links.

---

## 📁 Project Structure

```text
photo-championship/
└── frontend/
    ├── public/                         # Public static mock data & assets
    │   ├── albumCategories.json        # Competition category definitions
    │   ├── albumTypesData.json         # Competition formats (Single, 6, 12 photos)
    │   ├── artWork.json                # Uploaded artworks and competition submissions
    │   ├── bayPhoto.json               # Marketplace premium stock photo listings
    │   ├── chatData.json               # Seed chat conversations and messages
    │   ├── monthlyWinners.json         # Monthly championship winner archives
    │   ├── newsOrPost.json             # Community posts, news, and announcements
    │   ├── notifications.json          # User notification items
    │   ├── orders.json                 # Marketplace and store orders
    │   ├── product.json                # Photographer store merchandise & products
    │   ├── testimonials.json           # User testimonials and reviews
    │   ├── topPhotoGrapher.json        # Global photographer leaderboard data
    │   └── users.json                  # Registered user and photographer records
    │
    ├── src/
    │   ├── assets/                     # Images, banners, logos, and illustrations
    │   │   └── images/
    │   │
    │   ├── components/                 # Modular, reusable React UI components
    │   │   ├── admin/                  # Admin-specific cards, modals, and management tools
    │   │   ├── feed/                   # Feed layout components, about sections, details
    │   │   ├── home/                   # Homepage sections (Hero, Stats, MonthlyWinners, etc.)
    │   │   ├── profile/                # Photographer profile header, navigation tabs
    │   │   ├── shared/                 # Navbar, Footers, Sidebars (User & Admin), Banners
    │   │   ├── ui/                     # Reusable atomic UI (Cards, Filters, Modals, Skeletons)
    │   │   └── userDashbaord/          # Creator dashboard cards, tables, wizards, chat
    │   │
    │   ├── hooks/                      # Custom React hooks (Data fetching & state stores)
    │   │   ├── useAllArtworks.js       # Artworks collection fetch & filter hook
    │   │   ├── useArtworkById.js       # Single artwork retrieval hook
    │   │   ├── useChat.js              # Real-time chat interaction state hook
    │   │   ├── useFetch.js             # Generic fetch handler with error/loading states
    │   │   ├── useOrders.js            # User orders management hook
    │   │   ├── useTopPhotographers.js  # Leaderboard and top creators hook
    │   │   ├── useUser.js              # User profile loader hook
    │   │   └── useWinnersArchive.js    # Historical winners filtering hook
    │   │
    │   ├── layouts/                    # Layout wrappers with navigation and sidebars
    │   │   ├── AdminDashboardLayout.jsx# Admin layout with responsive collapsible sidebar
    │   │   ├── FeedLayout.jsx          # Public feed layout with category filter sidebar
    │   │   ├── MainLayout.jsx          # Master layout (Header, Announcement, Content, Footer)
    │   │   ├── PhotographarDetailsLayout.jsx # Profile layout with tabbed navigation
    │   │   └── UserDashboardLayout.jsx # User dashboard with drawer/collapsible sidebar
    │   │
    │   ├── lib/
    │   │   └── router/
    │   │       └── router.jsx          # Master React Router route definitions
    │   │
    │   ├── pages/                      # Page view controllers
    │   │   ├── adminDashboard/         # 24+ administrative management screens
    │   │   ├── auth/                   # Login, Registration, and Access Denied screens
    │   │   ├── feed/                   # Competitions, Gallery, Marketplace, Details, Checkout
    │   │   ├── feedback/               # 404 Not Found, Error, and Loading screens
    │   │   ├── profile/                # Photographer tabs (Artworks, Photos, Posts, Store)
    │   │   ├── userDashboard/          # 22+ user creator studio views
    │   │   ├── HomePage.jsx            # Landing page
    │   │   └── UploadArtWorkTypes.jsx  # Competition format selection screen
    │   │
    │   ├── utils/                      # Helper utilities
    │   │   └── getUserInof.js          # Authentication session and role resolver
    │   │
    │   ├── App.css                     # Component style extensions
    │   ├── index.css                   # Global styles, Tailwind v4 theme, fonts
    │   └── main.jsx                    # Application bootstrapping and root render
    │
    ├── index.html                      # HTML5 root template
    ├── package.json                    # Project dependencies and npm scripts
    ├── vite.config.js                  # Vite bundler & Tailwind plugin configuration
    └── eslint.config.js                # Code linting rules
```

---

## 🗺️ Page Routes

The routing architecture is built with **React Router v8**, organized hierarchically across public pages, creator studio, and administrative workspaces:

### 1. 🌐 Public & Showcase Routes (`MainLayout`)
| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Platform landing page with hero, active competitions, winners, and testimonials |
| `/about` | `AboutPage` | Platform story, mission, vision, and how competitions work |
| `/leaderboard` | `LeaderboardPage` | Global photographer rankings and monthly standings |
| `/album-types` | `AlbumTypePage` | Detailed breakdown of Single, 6-Photo, and 12-Photo competition formats |
| `/winners` | `WinnerPage` | Historical champions archive and Hall of Fame |
| `/advertise` | `AdvertisePage` | Commercial advertising tiers, placement options, and partnership inquiry |
| `/artwokrdetails/:id` | `ArtwokDetailsPage` | Comprehensive artwork details, high-res carousel, story, and voting |
| `/bayimagedetails/:id`| `BayImageDetailsPage` | Marketplace photo details, license pricing, photographer bio, and specs |
| `/bayimagedetails/checkout` | `ByCheckOut` | Checkout and licensing purchase portal |

### 2. 🖼️ Feed Showcase Routes (`FeedLayout`)
| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/feed/competition` | `CompetitionPage` | Active competition submissions with category filtering |
| `/feed/gallery` | `GalleryPage` | Curated public gallery of community photography |
| `/feed/buy-photos` | `BayPhotosPage` | Stock photography marketplace catalog |

### 3. 👤 Photographer Public Profiles (`PhotographarDetailsLayout`)
| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/photographers/:id` | `ProfileTab` | Photographer bio, social links, camera gear, and overview |
| `/photographers/:id/artworks` | `ArtworksTab` | Submitted competition albums and series |
| `/photographers/:id/premium-photos` | `BayPhotoTab` | Premium stock photos available for purchase |
| `/photographers/:id/posts` | `PostTab` | Creator news updates, behind-the-scenes, and stories |
| `/photographers/:id/store` | `MyStoreTab` | Photographer's physical merchandise, prints, and presets |

### 4. 🔐 Authentication Routes
| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/login` | `LoginPage` | User and administrator sign-in portal |
| `/register` | `RegisterPage` | Free creator account registration |
| `/access-denied` | `AdminAccessDenied` | Guarded error screen for unauthorized administrative access |

### 5. 🧑‍💻 User Studio & Creator Dashboard (`/user-dashboard`)
| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/user-dashboard` | `HomePageDhshboard` | Creator overview: stats, active entries, earnings, recent activities |
| `.../artwork-management` | `MyArtwork` | Manage uploaded artworks, status filters, and promotion triggers |
| `.../artwork-management/:id`| `ArtwokDetailsPage` | Creator view of single artwork submission |
| `.../artwork-management/UploadArtWorkTypes` | `UploadArtWorkTypes` | Competition tier selection (Single, 6-Story, 12-Zodiac) |
| `.../artwork-management/UploadArtWork` | `UploadArtWorkPage` | Multi-image upload wizard with zodiac slot sorting |
| `.../news-message` | `NewsAndMessagePage` | Published posts and community announcements |
| `.../news-message/new` | `UploadMessagePage` | Compose new creator article or post |
| `.../sell-photos` | `SellPhotosPage` | Marketplace photo inventory and license manager |
| `.../my-store` | `MyStore` | Storefront product catalog and inventory manager |
| `.../my-store/new` | `CollectionForm` | Add new store product, print, or digital item |
| `.../orders` | `OrdersPage` | Store sales received from buyers |
| `.../my-orders` | `MyOrdersPage` | Purchases made by the user with invoice details |
| `.../orders/:id` | `OrderDetailsPage` | In-depth order fulfillment and tracking details |
| `.../favourite-photographers`| `FavoritePhotographerPage` | Followed and bookmarked photographer profiles |
| `.../favourite-photos` | `CompetitionPage` | Saved and liked competition photographs |
| `.../business-link-photos`| `BusinessLinkPage` | Business partnership photo licensing links |
| `.../chat` | `ChatPage` | Interactive messenger between creators and buyers |
| `.../notifications` | `NotificationsPage` | Activity notifications (votes, sales, comments) |
| `.../prize-payments` | `PrizeAndPayments` | Prize wallet, earnings history, and PayPal withdrawal |
| `.../contact-us` | `SupportPage` | Helpdesk ticket submission and customer care |
| `.../settings` | `ProfileDetailsEditor`| Account profile, biography, social links, and security settings |

### 6. ⚙️ Admin Control Center (`/admin-dashboard`)
| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/admin-dashboard` | `AdminOverview` | Platform metrics: revenue, users, submissions, and active contests |
| `.../competitions` | `CompetitionManagementPage`| Monitor and moderate all live and closed competitions |
| `.../gallery` | `GalleryManagementPage`| Gallery curation and featured artwork selection |
| `.../premium-photos` | `BayPhotoMangement`| Stock marketplace moderation and photo approvals |
| `.../promoted-albums` | `PromotedProductsPage`| Review and schedule paid/promoted entries |
| `.../users` | `UsersManagement`| Member directory, role management, and suspension tools |
| `.../categories` | `Categories` | Dynamic contest category creation and ordering |
| `.../album-types` | `EditAlbumTypesPage`| Configure competition formats and prize structures |
| `.../winners` | `TopPhotographersSection`| Assign and verify monthly competition winners |
| `.../payouts` | `PrizeAndPayments` | Review and execute creator prize payouts |
| `.../support` | `SupportInbox` | Customer support ticket inbox and inquiry response |
| `.../business-link-photos`| `BusinessLinkPhotos` | Commercial sponsorship submissions and review |
| `.../newsletter` | `Newsletter` | Email subscriber management and broadcast campaigns |
| `.../comment` | `CommentManagement`| Moderation queue for user comments and reviews |
| `.../ads-management` | `AdsManagement` | Advertisement banner setup, placements, and click metrics |
| `.../demo-profile` | `DemoProfiles` | Manage generated demo accounts for staging/showcases |
| `.../demo-profiles/add`| `AddDemoProfile` | Create new simulated photographer profile |
| `.../reports-resolved`| `ReportsModeration` | Reported content inbox and dispute resolution |
| `.../promo-links` | `PromoLinkManagement`| Affiliate and promotional campaign tracking links |
| `.../settings` | `AdsAnnouncements` | Global platform settings, announcement banner editor |
| `.../profile` | `MyProfile` | Administrator profile credentials and security |

### 7. ⚠️ Feedback & Error Handling
- `*` -> `NotFound` (404 Page)
- Application-wide route error boundary (`ErrorPage`)

---

## 💻 Technology Stack

### 🚀 Frontend Core & Runtime
- **[React 19](https://react.dev/):** Modern functional component paradigm leveraging the latest React architecture.
- **[Vite 8](https://vite.dev/):** Blazing-fast Next-Gen build tool and HMR development server.
- **[JavaScript (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript):** Clean, modern ES-modules-based codebase.

### 🎨 Styling & Design System
- **[Tailwind CSS v4](https://tailwindcss.com/):** Latest utility-first CSS framework configured via native Vite plugin (`@tailwindcss/vite`).
- **[HeroUI React](https://heroui.com/):** Accessible, modern UI component library (`@heroui/react` & `@heroui/styles`).
- **Google Fonts (Inter):** Clean, professional modern typography.

### 🧭 Navigation & Icons
- **[React Router v8](https://reactrouter.com/):** Declarative client-side routing with nested layout trees and error boundaries.
- **[React Icons](https://react-icons.github.io/react-icons/):** Comprehensive icon library incorporating Feather Icons (`fi`), FontAwesome (`fa`/`fa6`), and more.
- **[React Fast Marquee](https://www.react-fast-marquee.com/):** Smooth ticker marquees for announcements and sponsor showcases.

### 📊 Data Visualization & State
- **[Recharts v3](https://recharts.org/):** Declarative charting library for dashboard revenue, vote metrics, and member growth trends.
- **Custom React Hooks:** Decoupled data-fetching architecture (`useFetch`, `useArtwork`, `useOrders`, `useChat`, `useTopPhotographers`).
- **LocalStorage State Persistence:** Client-side persistence for authentication tokens, user preferences, and sidebar states.

---

## 🛠️ Project Installation Process

Follow these step-by-step instructions to set up, run, and build the project locally on your machine.

### 📋 Prerequisites
- **Node.js:** `v18.0.0` or higher (Node.js 20+ recommended)
- **Package Manager:** `npm` (v9+) or `yarn` / `pnpm`
- **Git:** Installed on your local machine

---

### 1️⃣ Clone the Repository
Open your terminal or command prompt and clone the repository:
```bash
git clone https://github.com/rahimsoftdev/photo-championship.git
```

---

### 2️⃣ Navigate to the Frontend Directory
```bash
cd photo-championship/frontend
```

---

### 3️⃣ Install Dependencies
Install all required project packages:
```bash
npm install
```

> **Windows PowerShell Note:** If your system restricts script execution (`PSSecurityException`), run the command via standard CMD:
> ```cmd
> cmd.exe /c "npm install"
> ```
> Or temporarily enable execution policy for the session:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

---

### 4️⃣ Start the Development Server
Launch the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

Once started, open your web browser and navigate to:
```text
http://localhost:5173
```

---

### 5️⃣ Testing User & Admin Roles
Authentication is managed via client-side storage and the session helper in [`src/utils/getUserInof.js`](src/utils/getUserInof.js):
- **User Role (Default):** Log in via `/login` with any valid email and 8+ character password.
- **Switch to Admin Role for Testing:** Open [`src/utils/getUserInof.js`](src/utils/getUserInof.js) and toggle the `role` property:
  ```javascript
  // For User Dashboard:
  return { email, role: 'user', name: "MD Rahim Sikdar", ... };

  // For Admin Dashboard:
  return { email, role: 'admin', name: "MD Rahim Sikdar", ... };
  ```
- **Direct Admin Route:** Navigate to `/admin-dashboard` (requires `role: 'admin'`).

---

### 6️⃣ Build for Production
To build the optimized static production bundle:
```bash
npm run build
```
The compiled production assets will be generated inside the `dist/` directory.

---

### 7️⃣ Preview Production Build
To preview the production build locally before deployment:
```bash
npm run preview
```

---

## 👨‍💻 Author & Acknowledgements

Developed by **MD Rahim Sikdar** ([@rahimsoftdev](https://github.com/rahimsoftdev))
- **Portfolio:** [rahimsoftdev.vercel.app](https://rahimsoftdev.vercel.app/)
- **LinkedIn:** [linkedin.com/in/rahimsoftdev](https://www.linkedin.com/in/rahimsoftdev/)
- **GitHub:** [github.com/rahimsoftdev](https://github.com/rahimsoftdev)
