
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
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
                "Single Photo",
                "5 Photo Series",
                "Student Section",
                "Winners",
                "Leaderboard",
            ],
        },
        {
            title: "PLATFORM",
            links: ["Gallery", "Leaderboard", "About Us", "FAQ", "Contact"],
        },
        {
            title: "LEGAL",
            links: ["Privacy Policy", "Terms of Service", "Cookies"],
        },
    ];

    const socialLinks = [
        {
            name: "Instagram",
            href: "https://instagram.com",
            icon: <FaInstagram />,
        },
        {
            name: "Facebook",
            href: "https://facebook.com",
            icon: <FaFacebookF />,
        },
        {
            name: "X",
            href: "https://x.com",
            icon: <FaXTwitter />,
        },
    ];

    return (
        <footer className="bg-[#ECEDFA] pt-8 sm:pt-10">
            <div className="mx-auto max-w-main px-4 min-[400px]:px-5 sm:px-8 lg:px-10">
                {/* Main Footer Content */}
                <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-10 lg:gap-16">
                    {/* Logo, Description & Social Links */}
                    <div className="flex flex-col items-start">
                        <img
                            src={logo}
                            alt="My12Photos logo"
                            className="mb-3 h-auto w-[80px] md:w-[120px] rounded-full object-contain sm:mb-4 sm:w-[150px]"
                        />

                        <p className="max-w-[280px] text-sm font-normal leading-6 text-[#1A1A1A] sm:text-base">
                            A photography platform connecting photo enthusiasts and
                            rewarding the best work every month.
                        </p>

                        {/* Social Links */}
                        <div className="mt-4 flex items-center gap-2 sm:mt-5">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.name}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D3392] text-white transition-colors hover:bg-[#4048CD] sm:h-9 sm:w-9"
                                >
                                    <span className="text-sm sm:text-base">
                                        {social.icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 sm:gap-x-8 md:flex-1 md:gap-6 lg:gap-10">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-3 text-sm font-extrabold text-[#1A1A1A] sm:mb-4 sm:text-base">
                                    {section.title}
                                </h3>

                                <ul className="flex flex-col gap-2 sm:gap-3">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="break-words text-xs font-normal leading-5 text-[#1A1A1A] transition-colors hover:text-[#2D3392] sm:text-sm"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-[#D7D9EA] py-4 sm:mt-10 sm:py-5">
                    <p className="text-xs font-medium leading-5 text-[#191818] min-[400px]:text-sm sm:text-base">
                        © 2026 My12Photos. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
