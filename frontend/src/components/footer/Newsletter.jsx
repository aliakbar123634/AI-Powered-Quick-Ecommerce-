import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Newsletter API
        console.log(email);

        setEmail("");
    };

    return (
        <div className="mt-12 border-t pt-10">

            <div className="max-w-3xl mx-auto text-center">

                <h2 className="text-2xl font-bold text-gray-900">
                    Subscribe to our Newsletter
                </h2>

                <p className="mt-2 text-gray-600">
                    Get the latest products, exclusive offers and discounts
                    delivered directly to your inbox.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 flex flex-col sm:flex-row gap-4"
                >

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Subscribe
                    </button>

                </form>

            </div>

        </div>
    );
}