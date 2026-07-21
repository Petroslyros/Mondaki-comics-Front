import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { AuthButton } from "@/components/AuthButton";
import { Menu, X, LayoutDashboard } from "lucide-react";

const Header = () => {
    const { isAuthenticated, userRole } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="bg-[#16213e] w-full fixed top-0 z-50 shadow-md border-b border-[#0f3460]">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
                        <span className="text-white text-xl md:text-2xl font-bold tracking-wide">
                            Mondaki<span className="text-[#e94560]">Comics</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <nav className="flex gap-6 text-gray-300 font-medium">
                            <Link to="/" className="hover:text-white transition duration-200">
                                Gallery
                            </Link>
                            <Link to="/contact" className="hover:text-white transition duration-200">
                                Contact
                            </Link>
                            {isAuthenticated && userRole === "Admin" && (
                                <button
                                    onClick={() => navigate("/admin")}
                                    className="flex items-center gap-1 hover:text-white transition duration-200"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Admin
                                </button>
                            )}
                        </nav>
                        {/* Μόνο αν είναι logged in εμφανίζεται το Logout */}
                        {isAuthenticated && <AuthButton />}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-300 hover:text-white transition"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-[#0f3460]">
                        <nav className="flex flex-col gap-3 py-4">
                            <Link to="/" className="text-gray-300 hover:text-white transition py-2" onClick={closeMenu}>
                                Gallery
                            </Link>
                            <Link to="/contact" className="text-gray-300 hover:text-white transition py-2" onClick={closeMenu}>
                                Contact
                            </Link>
                            {isAuthenticated && userRole === "Admin" && (
                                <Link to="/admin" className="text-gray-300 hover:text-white transition py-2 flex items-center gap-1" onClick={closeMenu}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    Admin
                                </Link>
                            )}
                        </nav>
                        {isAuthenticated && (
                            <div className="border-t border-[#0f3460] pt-4">
                                <AuthButton />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;