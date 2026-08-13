import { Link } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";

export default function FooterBrand() {
    return (
        <div className="space-y-4">

            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2"
            >
                <FaShoppingBasket className="text-3xl text-green-600" />

                <h2 className="text-2xl font-bold text-gray-900">
                    Quick Ecommerce
                </h2>
            </Link>

            {/* Description */}
            <p className="text-gray-600 leading-7">
                Fresh groceries delivered to your doorstep.
                Shop fresh fruits, vegetables, dairy products,
                beverages and more with fast delivery.
            </p>

            {/* Small Info */}
            <div className="space-y-2 text-sm text-gray-500">

                <p>✅ Fresh Products</p>

                <p>🚚 Fast Delivery</p>

                <p>💳 Secure Payments</p>

            </div>

        </div>
    );
}