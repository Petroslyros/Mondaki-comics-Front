import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505]">
            <Header />
            <main className="flex-1 pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;