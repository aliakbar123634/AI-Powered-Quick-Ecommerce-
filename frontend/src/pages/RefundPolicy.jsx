import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";

export default function RefundPolicy() {
    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Refund Policy
                </h1>

                <p className="text-gray-600 leading-8 mb-4">
                    Customer satisfaction is our priority.
                </p>

                <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Refund requests are accepted within 7 days.</li>
                    <li>Products must be unused and in original condition.</li>
                    <li>Refunds are processed within 5–7 business days.</li>
                    <li>Some products may not be eligible for refunds.</li>
                </ul>

            </div>

            <Footer />
        </>
    );
}