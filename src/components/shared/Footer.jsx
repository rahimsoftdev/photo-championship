
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import logo from "../../assets/images/logo.png";

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
        <footer className="bg-[#ECEDFA]">
            {/* Main container: same width as Navbar */}
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                {/* Four equal sections */}
                <div className="md:flex justify-between gap-16">
                     <div className="flex flex-col items-start">
                            <img
                                src={logo}
                                alt="My12Photos logo"
                                className="mb-4 h-auto w-[150px]  rounded-full object-contain"
                            />

                            <p className="max-w-[280px] text-[16px] font-normal leading-6 text-[#1A1A1A]">
                                A photography platform connecting photo enthusiasts and
                                rewarding the best work every month.
                            </p>

                            <div className="mt-5 flex items-center gap-2">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.name}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D3392] text-white transition-colors hover:bg-[#4048CD]"
                                    >
                                        <span className="text-base">{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    <div className="flex-1 grid grid-cols-1 gap-8 py-10 sm:grid-cols-3  lg:gap-6">
                        {/* Section 1: Logo and Social Links */}
                       

                        {/* Sections 2, 3 and 4 */}
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-4 text-[16px] font-extrabold text-[#1A1A1A]">
                                    {section.title}
                                </h3>

                                <ul className="flex flex-col gap-3">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-[14px] font-normal text-[#1A1A1A] transition-colors hover:text-[#2D3392]"
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
                <div className="pt-9 border-[#D7D9EA] py-5">
                    <p className="text-[20px] font-medium text-[#191818]">
                        © 2026 My12Photos. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
