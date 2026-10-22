import { useState } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router";

/**
 * Navbar Component
 *
 * Features:
 * - Responsive navigation
 * - Active navigation link using NavLink
 * - Language dropdown
 * - Mobile menu toggle
 * - Login and registration links
 */

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

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [language, setLanguage] = useState("English");

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsLanguageOpen(false);
    };

    return (
        // TODO: Navbar will be sticky
        <header className="top-0 z-50 w-full border-b border-gray-100 bg-white">
            <nav className="mx-auto flex min-h-[84px] max-h-[87px] max-w-z items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-5">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="shrink-0"
                    aria-label="Photo Championship home"
                >
                    <img
                        src="/src/assets/images/logo.png"
                        alt="Photo Championship"
                        className="h-14 w-auto object-contain sm:h-14"
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
                    {/* Language Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setIsLanguageOpen(!isLanguageOpen)
                            }
                            aria-expanded={isLanguageOpen}
                            className="flex items-center gap-2 rounded-lg bg-[#F0F0F0] px-3 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
                        >
                            {language}
                            <FiChevronDown
                                className={`transition-transform ${
                                    isLanguageOpen ? "rotate-180" : ""
                                }`}
                                size={16}
                            />
                        </button>

                        {isLanguageOpen && (
                            <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                                {["English", "বাংলা"].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                            setLanguage(item);
                                            setIsLanguageOpen(false);
                                        }}
                                        className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 ${
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

                    {/* Login */}
                    <Link
                        to="/login"
                        className="whitespace-nowrap rounded-full bg-btn2 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3038B5]"
                    >
                        Log In
                    </Link>

                    {/* Register */}
                    <Link
                        to="/register"
                        className="whitespace-nowrap rounded-full bg-btn px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D71920]"
                    >
                        Register Free
                    </Link>
                </div>

                {/* Mobile / Tablet Menu Button */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 xl:hidden"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? (
                        <FiX size={24} />
                    ) : (
                        <FiMenu size={24} />
                    )}
                </button>
            </nav>

            {/* Mobile / Tablet Dropdown Menu */}
            {isMenuOpen && (
                <div className="border-t border-gray-100 bg-white shadow-lg xl:hidden">
                    <div className="mx-auto max-w-[1280px] space-y-1 px-4 py-4 sm:px-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block rounded-lg px-4 py-3 text-base font-semibold transition ${
                                        isActive
                                            ? "text-primary"
                                            : "text-[#6B7280] hover:bg-gray-50 hover:text-primary"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="mt-3 border-t border-gray-100 pt-4">
                            {/* Mobile Language Dropdown */}
                            <button
                                type="button"
                                onClick={() =>
                                    setIsLanguageOpen(!isLanguageOpen)
                                }
                                className="flex w-full items-center justify-between rounded-lg bg-[#F0F0F0] px-4 py-3 text-sm font-medium text-black"
                                aria-expanded={isLanguageOpen}
                            >
                                <span>{language}</span>
                                <FiChevronDown
                                    size={18}
                                    className={`transition-transform ${
                                        isLanguageOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {isLanguageOpen && (
                                <div className="mt-1 rounded-lg border border-gray-100 p-1">
                                    {["English", "বাংলা"].map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setLanguage(item);
                                                setIsLanguageOpen(false);
                                            }}
                                            className={`block w-full rounded-md px-4 py-2.5 text-left text-sm hover:bg-gray-100 ${
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

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="flex flex-1 items-center justify-center rounded-lg bg-[#4048CD] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3038B5]"
                                >
                                    Log In
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="flex flex-1 items-center justify-center rounded-lg bg-[#EE1C25] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#D71920]"
                                >
                                    Register Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
