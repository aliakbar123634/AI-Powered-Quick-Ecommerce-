import { Link } from "react-router-dom";
import { ArrowRight, Flame, Zap } from "lucide-react";

export default function DealsHero() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 px-8 py-16 text-white shadow-xl">

            {/* Background Circles */}
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* Left Side */}
                <div>

                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">

                        <Flame size={18} />

                        <span className="font-semibold">
                            Limited Time Offer
                        </span>

                    </div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">

                        🔥 Mega Grocery Sale

                    </h1>

                    <p className="mt-6 text-lg text-green-100 leading-8 max-w-xl">

                        Save up to <span className="font-bold text-yellow-300">50% OFF</span> on fresh groceries,
                        beverages, snacks and daily essentials.

                        Hurry! These deals won't last long.

                    </p>

                    <div className="flex flex-wrap gap-4 mt-10">

                        <Link
                            to="/products"
                            className="bg-white text-green-700 font-bold px-7 py-4 rounded-xl hover:bg-gray-100 transition"
                        >
                            Shop Deals
                        </Link>

                        <Link
                            to="/category"
                            className="flex items-center gap-2 border border-white px-7 py-4 rounded-xl hover:bg-white hover:text-green-700 transition"
                        >
                            Explore Categories

                            <ArrowRight size={18} />
                        </Link>

                    </div>

                </div>

                {/* Right Side */}

                <div className="flex justify-center">

                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 w-full max-w-md">

                        <div className="flex items-center gap-3 mb-6">

                            <Zap className="text-yellow-300" />

                            <h2 className="text-2xl font-bold">

                                Flash Sale

                            </h2>

                        </div>

                        <div className="space-y-5">

                            <div className="flex justify-between text-lg">
                                <span>Discount</span>

                                <span className="font-bold text-yellow-300">
                                    Up to 50%
                                </span>
                            </div>

                            <div className="flex justify-between text-lg">
                                <span>Products</span>

                                <span className="font-bold">
                                    1000+
                                </span>
                            </div>

                            <div className="flex justify-between text-lg">
                                <span>Categories</span>

                                <span className="font-bold">
                                    20+
                                </span>
                            </div>

                        </div>

                        <button className="mt-8 w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition">

                            Grab Deals Now 🚀

                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}