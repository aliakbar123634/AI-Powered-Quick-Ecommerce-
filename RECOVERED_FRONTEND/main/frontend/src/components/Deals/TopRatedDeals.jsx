import { useEffect, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { dealProducts } from "../../api/productApi";

const BASE_URL = "http://127.0.0.1:8000";

export default function TopRatedDeals() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopRated();
    }, []);

    const fetchTopRated = async () => {

        try {

            const data = await dealProducts();

            const list = Array.isArray(data)
                ? data
                : data.results || [];

            const sorted = list
                .filter((product) => Number(product.average_rating) > 0)
                .sort(
                    (a, b) =>
                        Number(b.average_rating) -
                        Number(a.average_rating)
                )
                .slice(0, 4);

            setProducts(sorted);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-20 text-xl font-semibold">
                Loading Top Rated Products...
            </div>

        );

    }

    return (

        <section className="mt-20">

            <div className="mb-8">

                <h2 className="text-4xl font-bold">

                    ⭐ Top Rated Deals

                </h2>

                <p className="text-gray-500 mt-2">

                    Customers' favourite products with the highest ratings.

                </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {products.map((product) => {

                    const image = product.image
                        ? `${BASE_URL}${product.image}`
                        : "https://placehold.co/600x600?text=No+Image";

                    return (

                        <div
                            key={product.id}
                            className="
                                bg-white
                                rounded-3xl
                                overflow-hidden
                                shadow-lg
                                hover:shadow-2xl
                                transition-all
                                duration-300
                                hover:-translate-y-2
                            "
                        >

                            <div className="relative">

                                {product.off > 0 && (

                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">

                                        {product.off}% OFF

                                    </div>

                                )}

                                <Link to={`/products/${product.id}`}>

                                    <img
                                        src={image}
                                        alt={product.name}
                                        className="w-full h-64 object-cover"
                                    />

                                </Link>

                            </div>

                            <div className="p-5">

                                <p className="text-green-600 text-sm font-semibold">

                                    {product.category_name}

                                </p>

                                <h3 className="text-xl font-bold mt-2 line-clamp-2 min-h-[56px]">

                                    {product.name}

                                </h3>

                                <div className="flex items-center gap-2 mt-3">

                                    <Star
                                        size={18}
                                        fill="#FACC15"
                                        stroke="#FACC15"
                                    />

                                    <span className="font-semibold">

                                        {product.average_rating}

                                    </span>

                                    <span className="text-gray-500">

                                        ({product.reviews_count} Reviews)

                                    </span>

                                </div>

                                <div className="flex items-center gap-3 mt-4">

                                    <span className="text-2xl font-bold text-green-600">

                                        ${product.discount_price}

                                    </span>

                                    <span className="line-through text-gray-400">

                                        ${product.price}

                                    </span>

                                </div>

                                <button
                                    className="
                                        w-full
                                        mt-6
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        py-3
                                        rounded-xl
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >

                                    <ShoppingCart size={18} />

                                    Add To Cart

                                </button>

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>

    );

}