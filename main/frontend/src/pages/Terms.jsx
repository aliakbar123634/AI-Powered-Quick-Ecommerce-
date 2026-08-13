import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";

export default function Terms() {
    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Terms & Conditions
                </h1>

                <p className="text-gray-600 leading-8 mb-4">
                    By using Quick Ecommerce, you agree to follow our terms and conditions.
                </p>

                <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Provide accurate account information.</li>
                    <li>Use the website responsibly.</li>
                    <li>Orders may be cancelled if fraudulent activity is detected.</li>
                    <li>Prices and product availability may change without notice.</li>
                </ul>

            </div>

            <Footer />
        </>
    );
}