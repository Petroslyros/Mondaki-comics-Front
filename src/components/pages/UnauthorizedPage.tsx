import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <ShieldAlert className="w-24 h-24 text-[#e94560] mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                You don't have permission to access this page.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
                <Button onClick={() => navigate("/")}>
                    Go to Gallery
                </Button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;