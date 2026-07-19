import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInsertSchema, type ContactInsert } from "@/schemas/contact";
import { sendMessage } from "@/services/api.contact";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const ContactPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactInsert>({
        resolver: zodResolver(contactInsertSchema),
        defaultValues: {
            senderName: "",
            senderEmail: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactInsert) => {
        try {
            await sendMessage(data);
            toast.success("Message sent! I'll get back to you soon.");
            reset();
        } catch {
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Get In Touch</h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Interested in commissioning a piece or just want to say hello?
                    Send me a message and I'll get back to you as soon as possible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-[#16213e] border border-[#0f3460] rounded-lg p-8">
                    <h2 className="text-white font-semibold text-xl mb-6">
                        Send a Message
                    </h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        autoComplete="off"
                    >
                        <div>
                            <Label htmlFor="senderName" className="text-gray-300">
                                Your Name
                            </Label>
                            <Input
                                id="senderName"
                                {...register("senderName")}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                                placeholder="Jane Doe"
                            />
                            {errors.senderName && (
                                <p className="text-[#e94560] text-sm mt-1">
                                    {errors.senderName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="senderEmail" className="text-gray-300">
                                Your Email
                            </Label>
                            <Input
                                id="senderEmail"
                                type="email"
                                {...register("senderEmail")}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1"
                                placeholder="jane@example.com"
                            />
                            {errors.senderEmail && (
                                <p className="text-[#e94560] text-sm mt-1">
                                    {errors.senderEmail.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="message" className="text-gray-300">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                {...register("message")}
                                className="bg-[#1a1a2e] border-[#0f3460] text-white mt-1 min-h-[120px]"
                                placeholder="Tell me about your project..."
                            />
                            {errors.message && (
                                <p className="text-[#e94560] text-sm mt-1">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        <Button
                            disabled={isSubmitting}
                            className="w-full bg-[#e94560] hover:bg-[#c73652] text-white"
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </div>

                {/* Social links */}
                <div className="flex flex-col gap-6 justify-center">
                    <h2 className="text-white font-semibold text-xl">
                        Find Me Online
                    </h2>
                    <p className="text-gray-400">
                        You can also reach me through my social media channels
                        or send me a direct email.
                    </p>

                    <div className="flex flex-col gap-4">
                    <a
                        href="https://instagram.com/mondaki"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-white transition"
                        >
                        <FaInstagram className="w-5 h-5 text-[#e94560]" />
                        @mondaki
                    </a>
                    <a
                    href="https://facebook.com/mondaki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition"
                    >
                    <FaFacebookF className="w-5 h-5 text-[#e94560]" />
                    Mondaki Comics
                </a>
                <a
                href="mailto:mondaki@example.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition"
                >
                <Mail className="w-5 h-5 text-[#e94560]" />
                mondaki@example.com
            </a>
        </div>
</div>
</div>
</div>
);
};

export default ContactPage;