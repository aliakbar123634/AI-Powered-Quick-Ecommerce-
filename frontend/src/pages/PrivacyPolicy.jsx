import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Privacy Policy
                </h1>

                <p className="text-gray-600 leading-8 mb-4">
                    Your privacy is important to us. We are committed to protecting
                    your personal information and ensuring a secure shopping experience.
                </p>

                <ul className="list-disc pl-6 space-y-3 text-gray-600">
                    <li>We collect only the information required to process your orders.</li>
                    <li>Your personal data is never sold to third parties.</li>
                    <li>Payment information is processed securely.</li>
                    <li>We may use cookies to improve your browsing experience.</li>
                </ul>

            </div>

            <Footer />
        </>
    );
}