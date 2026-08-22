import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type UserLogin, userLoginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<UserLogin>({
        resolver: zodResolver(userLoginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit = async (data: UserLogin) => {
        try {
            await loginUser(data);
            toast.success("Welcome back!");
            navigate("/admin");
        } catch (err) {
            console.error("Login error:", err);
            setError("username", { type: "manual", message: "Invalid username or password" });
            setError("password", { type: "manual", message: "Invalid username or password" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-8">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl text-center text-white mb-8 font-bold">
                    Admin Login
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-[#121212] border border-[#2a2a2a] p-8 rounded-lg space-y-4"
                    autoComplete="off"
                >
                    <div>
                        <Label htmlFor="username" className="text-gray-300">
                            Username
                        </Label>
                        <Input
                            id="username"
                            {...register("username")}
                            className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                        />
                        {errors.username && (
                            <div className="text-gray-400 text-sm mt-1">
                                {errors.username.message}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-300">
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                        />
                        {errors.password && (
                            <div className="text-gray-400 text-sm mt-1">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white hover:bg-gray-200 text-black mt-2"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}