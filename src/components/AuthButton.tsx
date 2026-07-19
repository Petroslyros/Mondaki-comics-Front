import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export function AuthButton() {
    const { isAuthenticated, logoutUser } = useAuth();
    const navigate = useNavigate();

    return isAuthenticated ? (
        <Button onClick={logoutUser} variant="outline">
            Logout
        </Button>
    ) : (
        <Button onClick={() => navigate("/login")}>
            Login
        </Button>
    );
}