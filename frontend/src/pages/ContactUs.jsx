import {
    FaEnvelope,
    FaPhone,
    FaLocationDot,
    FaClock,
} from "react-icons/fa6";

import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";

export default function ContactUs() {
    return (
        <>
            <Navbar />

            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-900">
                            Contact Us
                        </h1>

                        <p className="mt-4 text-lg text-gray-600">
                            We'd love to hear from you. Our team is always ready to help.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">

                            <div className="flex items-start gap-4">
                                <FaEnvelope className="text-3xl text-green-600 mt-1" />

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Email
                                    </h3>

                                    <p className="text-gray-600">
                                        support@quickecommerce.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">

                                <FaPhone className="text-3xl text-green-600 mt-1" />

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Phone
                                    </h3>

                                    <p className="text-gray-600">
                                        +92 300 1234567
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <FaLocationDot className="text-3xl text-green-600 mt-1" />

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Address
                                    </h3>

                                    <p className="text-gray-600">
                                        Bahawalpur, Punjab, Pakistan
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <FaClock className="text-3xl text-green-600 mt-1" />

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Working Hours
                                    </h3>

                                    <p className="text-gray-600">
                                        Monday - Saturday
                                    </p>

                                    <p className="text-gray-600">
                                        9:00 AM - 8:00 PM
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Right Card */}
                        <div className="bg-green-600 rounded-2xl shadow-lg p-10 flex flex-col justify-center text-white">

                            <h2 className="text-3xl font-bold mb-5">
                                Need Help?
                            </h2>

                            <p className="leading-8 text-lg">
                                If you have any questions regarding your
                                orders, delivery or payments, our support
                                team is always available to help you.
                            </p>

                            <button className="mt-8 bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                                Contact Support
                            </button>

                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}