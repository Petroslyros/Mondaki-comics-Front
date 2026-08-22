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
            toast.success("Το μήνυμα στάλθηκε! Θα σου απαντήσω σύντομα.");
            reset();
        } catch {
            toast.error("Αποτυχία αποστολής μηνύματος. Δοκίμασε ξανά.");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                    Επικοινωνία
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    Ενδιαφέρεσαι για μια παραγγελία ή απλά θες να πεις ένα γεια;
                    Στείλε μου ένα μήνυμα και θα σου απαντήσω το συντομότερο δυνατό.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-lg p-8">
                    <h2 className="text-black dark:text-white font-semibold text-xl mb-6">
                        Στείλε ένα Μήνυμα
                    </h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        autoComplete="off"
                    >
                        <div>
                            <Label htmlFor="senderName" className="text-gray-600 dark:text-gray-300">
                                Το Όνομά σου
                            </Label>
                            <Input
                                id="senderName"
                                {...register("senderName")}
                                className="bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a] text-black dark:text-white mt-1"
                                placeholder="Μαρία Παπαδοπούλου"
                            />
                            {errors.senderName && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    {errors.senderName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="senderEmail" className="text-gray-600 dark:text-gray-300">
                                Το Email σου
                            </Label>
                            <Input
                                id="senderEmail"
                                type="email"
                                {...register("senderEmail")}
                                className="bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a] text-black dark:text-white mt-1"
                                placeholder="maria@example.com"
                            />
                            {errors.senderEmail && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    {errors.senderEmail.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="message" className="text-gray-600 dark:text-gray-300">
                                Μήνυμα
                            </Label>
                            <Textarea
                                id="message"
                                {...register("message")}
                                className="bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a] text-black dark:text-white mt-1 min-h-[120px]"
                                placeholder="Πες μου για το project σου..."
                            />
                            {errors.message && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                        >
                            {isSubmitting ? "Αποστολή..." : "Αποστολή Μηνύματος"}
                        </Button>
                    </form>
                </div>

                <div className="flex flex-col gap-6 justify-center">
                    <h2 className="text-black dark:text-white font-semibold text-xl">
                        Βρες με Online
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Μπορείς επίσης να με βρεις στα social media
                        ή να μου στείλεις απευθείας email.
                    </p>

                    <div className="flex flex-col gap-4">
                    <a
                        href="https://www.instagram.com/mondastardust95/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                        >
                        <FaInstagram className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        @mondastardust95
                    </a>
                    <a
                    href="https://www.facebook.com/mondaki.dakogianni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                    >
                    <FaFacebookF className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    Mondaki Comics
                </a>
                <a
                href="mailto:oliantakogianni@gmail.com"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                oliantakogianni@gmail.com
            </a>
        </div>
</div>
</div>
</div>
);
};

export default ContactPage;