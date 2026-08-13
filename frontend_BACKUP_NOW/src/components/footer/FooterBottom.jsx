import { Link } from "react-router-dom";

export default function FooterBottom() {
    return (
        <div className="border-t bg-gray-50">

            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Copyright */}
                <p className="text-sm text-gray-600 text-center md:text-left">
                    © {new Date().getFullYear()} Quick Ecommerce. All Rights Reserved.
                </p>

                {/* Footer Links */}
                <div className="flex flex-wrap items-center justify-center gap-5 text-sm">

                    <Link
                        to="/privacy-policy"
                        className="text-gray-600 hover:text-green-600 transition duration-300"
                    >
                        Privacy Policy
                    </Link>

                    <Link
                        to="/terms"
                        className="text-gray-600 hover:text-green-600 transition duration-300"
                    >
                        Terms & Conditions
                    </Link>

                    <Link
                        to="/shipping-policy"
                        className="text-gray-600 hover:text-green-600 transition duration-300"
                    >
                        Shipping Policy
                    </Link>

                    <Link
                        to="/refund-policy"
                        className="text-gray-600 hover:text-green-600 transition duration-300"
                    >
                        Refund Policy
                    </Link>

                </div>

            </div>

        </div>
    );
}