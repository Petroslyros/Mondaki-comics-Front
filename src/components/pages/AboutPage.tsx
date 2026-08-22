import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Πίσω στη Gallery
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                <div className="md:col-span-1">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a]">
                        <img
                            src="/about-photo.jpg"
                            alt="Mondaki"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                    <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                        Σχετικά με εμένα
                    </h1>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {/* TODO: Βάλε εδώ το κείμενο που θα σου στείλει η κοπέλα σου */}
                        Εδώ θα μπει το κείμενο παρουσίασης — ποια είναι, πώς ξεκίνησε
                        με το σχέδιο/comics, τι στυλ/θέματα την εμπνέουν, κ.λπ.
                    </p>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Δεύτερη παράγραφος αν χρειαστεί.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;