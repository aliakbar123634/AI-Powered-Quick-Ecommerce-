import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";

export default function ShippingPolicy() {
    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Shipping Policy
                </h1>

                <p className="text-gray-600 leading-8 mb-4">
                    We aim to deliver your orders quickly and safely.
                </p>

                <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>Orders are processed within 24 hours.</li>
                    <li>Delivery usually takes 2–5 business days.</li>
                    <li>Shipping charges may vary by location.</li>
                    <li>Tracking details will be shared after dispatch.</li>
                </ul>

            </div>

            <Footer />
        </>
    );
}