import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";

export default function FAQ() {
    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-8">

                    <div>
                        <h2 className="text-xl font-semibold">
                            How long does delivery take?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Orders are usually delivered within 2–5 business days.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Can I return a product?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Yes. Returns are accepted within 7 days if the product is unused.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Which payment methods are supported?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            We support Cash on Delivery, Debit/Credit Cards and online payments.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            How can I contact customer support?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            You can contact us through email or phone during business hours.
                        </p>
                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}