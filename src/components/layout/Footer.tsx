import { Mail } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { name: "Instagram", url: "https://www.instagram.com/mondastardust95/", icon: FaInstagram },
        { name: "Facebook", url: "https://www.facebook.com/mondaki.dakogianni", icon: FaFacebookF },
        { name: "Email", url: "mailto:oliantakogianni@gmail.com", icon: Mail },
    ];

    return (
        <footer className="bg-[#121212] text-gray-300 border-t border-[#2a2a2a]">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-white font-bold text-lg mb-2">
                            Mondaki<span className="text-gray-400">Comics</span>
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Original comics and illustrations
                        </p>
                    </div>

                    <div className="text-center">
                        <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            <a href="/" className="text-gray-400 hover:text-white transition">
                                Gallery
                            </a>
                            <a href="/contact" className="text-gray-400 hover:text-white transition">
                                Contact
                            </a>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <h4 className="text-white font-semibold mb-3">Follow</h4>
                        <div className="flex gap-4 justify-center md:justify-end">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                    key={link.name}
                                href={link.url}
                                target={link.name === "Email" ? undefined : "_blank"}
                                rel={link.name === "Email" ? undefined : "noopener noreferrer"}
                                className="text-gray-400 hover:text-white transition hover:scale-110 transform"
                                aria-label={link.name}
                                    >
                                    <Icon className="w-5 h-5" />
                                    </a>
                            );
                            })}
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#2a2a2a] pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <div>
                            © {currentYear}{" "}
                            <span className="font-medium text-white">Mondaki</span>
                            . All Rights Reserved.
                        </div>
                        <div className="text-xs text-gray-500">
                            Built with React • ASP.NET Core • Cloudflare R2
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;