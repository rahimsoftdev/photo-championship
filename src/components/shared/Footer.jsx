import { Link } from "react-router";
import { FaLinkedinIn, FaGithub, FaGlobe, FaFacebookF } from "react-icons/fa6";
import logo from "../../assets/images/logo.png";
/**
 * Responsive footer with brand information, social media links,
 * navigation sections, and copyright text.
 * Footer content is managed using arrays for easy maintenance.
 */

const Footer = () => {
    const footerSections = [
        {
            title: "COMPETITIONS",
            links: [
                { name: "All Competitions", to: "/feed/competition" },
                {
                    name: "Single Photo",
                    to: "/feed/competition?albumType=single-photo",
                },
                {
                    name: "12 Photos Zodiac Story",
                    to: "/feed/competition?albumType=12-photos-full-zodiac-story",
                },
                { name: "Winners", to: "/winners" },
                { name: "Leaderboard", to: "/leaderboard" },
            ],
        },
        {
            title: "PLATFORM",
            links: [
                { name: "Gallery", to: "/feed/gallery" },
                { name: "Buy Photos", to: "/feed/buy-photos" },
                { name: "Album Types", to: "/album-types" },
                { name: "Advertise With Us", to: "/advertise" },
                { name: "About", to: "/about" },
            ],
        },
        {
            title: "LEGAL",
            links: [
                { name: "Privacy Policy", to: "/privacy-policy" },
                { name: "Terms of Service", to: "/terms-of-service" },
                { name: "Cookies", to: "/cookies" },
            ],
        },
    ];

    const socialLinks = [
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/rahimsoftdev/",
            icon: <FaLinkedinIn />,
            hover: "hover:bg-[#0A66C2] hover:shadow-[#0A66C2]/40",
        },
        {
            name: "GitHub",
            href: "https://github.com/rahimsoftdev",
            icon: <FaGithub />,
            hover: "hover:bg-[#171515] hover:shadow-black/30",
        },
        {
            name: "Portfolio",
            href: "https://rahimsoftdev.vercel.app/",
            icon: <FaGlobe />,
            hover: "hover:bg-[#4048CD] hover:shadow-[#4048CD]/40",
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/rahimsoftdev",
            icon: <FaFacebookF />,
            hover: "hover:bg-[#1877F2] hover:shadow-[#1877F2]/40",
        },
    ];

    return (
        <footer className="w-full bg-[#ECEDFA] pt-8 sm:pt-10">
            <div className="mx-auto w-full max-w-main px-4 min-[400px]:px-5 sm:px-8 lg:px-10">
                {/* Main Footer Content */}
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
                    {/* Left: Logo, Description & Social Links (sticks to the left) */}
                    <div className="flex flex-col items-start md:max-w-[300px]">
                        <img
                            src={logo}
                            alt="My12Photos logo"
                            className="mb-3 h-auto w-[90px] rounded-full object-contain sm:mb-4 sm:w-[110px] md:w-[120px]"
                        />

                        <p className="max-w-[280px] text-xs font-normal leading-5 text-[#1A1A1A] sm:text-sm sm:leading-6">
                            A photography platform connecting photo enthusiasts and
                            rewarding the best work every month.
                        </p>

                        {/* Social Links */}
                        <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.name}
                                    title={social.name}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#2D3392] text-white shadow-md shadow-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:shadow-lg active:scale-95 sm:h-9 sm:w-9 ${social.hover}`}
                                >
                                    <span className="text-sm sm:text-base">
                                        {social.icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Footer Sections (sticks to the right) */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 sm:gap-x-8 md:grid-cols-[repeat(3,auto)] md:justify-end md:gap-x-12 lg:gap-x-20 xl:gap-x-24">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-3 text-xs font-extrabold tracking-wide text-[#1A1A1A] sm:mb-4 sm:text-sm">
                                    {section.title}
                                </h3>

                                <ul className="flex flex-col gap-2 sm:gap-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                to={link.to}
                                                onClick={() =>
                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior: "smooth",
                                                    })
                                                }
                                                className="inline-block break-words text-xs font-normal leading-5 text-[#1A1A1A] transition-all duration-200 hover:translate-x-1 hover:text-[#2D3392]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-[#D7D9EA] py-4 sm:mt-10 sm:py-5">
                    <p className="text-xs font-medium leading-5 text-[#191818] sm:text-sm">
                        © 2026 My12Photos. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;