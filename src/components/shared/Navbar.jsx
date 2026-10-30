
import { useState } from "react";
import { FiChevronDown, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { Link, NavLink } from "react-router";
import { getSavedUserInfo } from "../../utils/getUserInof";

const navLinks = [
    { name: "Competitions", path: "/feed/competition" },
    { name: "Gallery", path: "/feed/gallery" },
    { name: "Buy Photos", path: "/feed/buy-photos" },
    { name: "Album Types", path: "/album-types" },
    { name: "Advertise With Us", path: "/advertise" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Winners", path: "/winners" },
    { name: "About", path: "/about" },
];

const languages = ["English", "বাংলা"];

const Navbar = () => {
    const [userinfo, setUserinfo] = useState(() => getSavedUserInfo());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [language, setLanguage] = useState("English");
    console.log(userinfo)

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsLanguageOpen(false);
    };

    // Logout: remove saved user information from localStorage
    const handleLogout = () => {
        localStorage.removeItem("rememberedEmail");
        setUserinfo(null);
        closeMenu();
    };

    // Conditional dashboard link
    const dashboardLink =
        userinfo?.role === "user"
            ? "/user-dashboard"
            : userinfo?.role === "admin"
                ? "/admin-dashboard"
                : null;

    // Conditional dashboard text label
    const dashboardLabel =
        userinfo?.role === "user"
            ? "User Dashboard"
            : userinfo?.role === "admin"
                ? "Admin Dashboard"
                : null;

    const renderAuthActions = (mobile = false) => {
        const baseClass = mobile
            ? "flex w-full min-w-0 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 min-[380px]:px-4 min-[380px]:py-2.5 min-[420px]:text-sm sm:py-3"
            : "whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:px-4 sm:py-2.5 sm:text-sm";

        if (!userinfo?.email) {
            return (
                <>
                    <Link
                        to="/login"
                        onClick={mobile ? closeMenu : undefined}
                        className={`${baseClass} bg-primary`}
                    >
                        Log In
                    </Link>

                    <Link
                        to="/register"
                        onClick={mobile ? closeMenu : undefined}
                        className={`${baseClass} bg-secondary`}
                    >
                        Register Free
                    </Link>
                </>
            );
        }

        if (dashboardLink && dashboardLabel) {
            return (
                <>
                    <Link
                        to={dashboardLink}
                        onClick={mobile ? closeMenu : undefined}
                        className={`${baseClass} bg-primary`}
                    >
                        {dashboardLabel}
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`${baseClass} flex items-center gap-2 bg-secondary hover:bg-red-900`}
                    >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                    </button>
                </>
            );
        }

        return null;
    };

    const renderLanguageOptions = () => (
        <div className="absolute right-0 top-full z-[200] mt-2 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl ring-1 ring-black/5">
            {languages.map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => {
                        setLanguage(item);
                        setIsLanguageOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-xs transition hover:bg-gray-100 min-[420px]:text-sm ${
                        language === item
                            ? "font-semibold text-primary"
                            : "text-gray-700"
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-white shadow-sm">
            <nav className="mx-auto flex min-h-[64px] max-w-main items-center justify-between gap-2 px-3 py-2 min-[420px]:gap-3 min-[420px]:px-4 sm:min-h-[76px] sm:px-6 lg:px-5">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="shrink-0"
                    aria-label="Photo Championship home"
                >
                    <img
                        src="/logo.png"
                        alt="Photo Championship"
                        className="h-9 w-auto  object-contain min-[380px]:h-10 sm:h-12 sm:max-w-none lg:h-14"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 xl:flex 2xl:gap-7">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `whitespace-nowrap text-sm font-semibold transition-colors duration-200 ${
                                    isActive
                                        ? "text-primary"
                                        : "text-[#6B7280] hover:text-primary"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden shrink-0 items-center gap-2 xl:flex">
                    <div className="relative z-[150]">
                        <button
                            type="button"
                            onClick={() =>
                                setIsLanguageOpen((open) => !open)
                            }
                            aria-expanded={isLanguageOpen}
                            className="flex items-center gap-1.5 rounded-lg bg-[#F0F0F0] px-2.5 py-2 text-xs font-medium text-black transition hover:bg-gray-200 2xl:px-3 2xl:text-sm"
                        >
                            {language}
                            <FiChevronDown
                                className={`transition-transform ${
                                    isLanguageOpen ? "rotate-180" : ""
                                }`}
                                size={15}
                            />
                        </button>

                        {isLanguageOpen && renderLanguageOptions()}
                    </div>

                    <div className="flex items-center gap-2">
                        {renderAuthActions()}
                    </div>
                </div>

                {/* Mobile / Tablet Menu Button */}
                <button
                    type="button"
                    onClick={() => {
                        setIsMenuOpen((open) => !open);
                        setIsLanguageOpen(false);
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 min-[420px]:h-10 min-[420px]:w-10 xl:hidden"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
                </button>
            </nav>

            {/* Mobile / Tablet Menu */}
            {isMenuOpen && (
                <div className="absolute left-0 right-0 top-full z-[120] max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-gray-100 bg-white shadow-xl xl:hidden">
                    <div className="mx-auto max-w-main space-y-0.5 px-3 py-3 min-[420px]:px-4 sm:px-6 sm:py-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block rounded-lg px-3 py-2 text-xs font-semibold transition min-[380px]:py-2.5 min-[420px]:text-sm sm:px-4 sm:py-3 ${
                                        isActive
                                            ? "bg-primary/5 text-primary"
                                            : "text-[#6B7280] hover:bg-gray-50 hover:text-primary"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="mt-2 border-t border-gray-100 pt-3 sm:mt-3 sm:pt-4">
                            {/* Mobile Language Dropdown */}
                            <div className="relative z-[150]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsLanguageOpen((open) => !open)
                                    }
                                    className="flex w-full items-center justify-between rounded-lg bg-[#F0F0F0] px-3 py-2.5 text-xs font-medium text-black min-[420px]:px-4 min-[420px]:text-sm sm:py-3"
                                    aria-expanded={isLanguageOpen}
                                >
                                    <span>{language}</span>

                                    <FiChevronDown
                                        size={16}
                                        className={`transition-transform ${
                                            isLanguageOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {isLanguageOpen && (
                                    <div className="absolute left-0 right-0 top-full z-[200] mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black/5">
                                        {languages.map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => {
                                                    setLanguage(item);
                                                    setIsLanguageOpen(false);
                                                }}
                                                className={`block w-full rounded-md px-3 py-2 text-left text-xs transition hover:bg-gray-100 min-[420px]:px-4 min-[420px]:py-2.5 min-[420px]:text-sm ${
                                                    language === item
                                                        ? "font-semibold text-primary"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Auth Actions */}
                            <div className="mt-3 grid grid-cols-2 gap-2 min-[420px]:gap-3 sm:flex">
                                {renderAuthActions(true)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
