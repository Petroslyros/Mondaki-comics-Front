import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#1a1a2e]">
            <Header />
            <main className="flex-1 pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;