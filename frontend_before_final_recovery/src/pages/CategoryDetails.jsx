import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCategoryProducts } from "../api/productApi";

import CategoryDetailHero from "../components/category-detail/CategoryDetailHero";
import ProductCard from "../components/category-detail/ProductCard";
import FilterToolbar from "../components/category-detail/FilterToolbar";
import ActiveFilters from "../components/category-detail/ActiveFilters";
import EmptyProducts from "../components/category-detail/EmptyProducts";
import ProductCardSkeleton from "../components/category-detail/ProductCardSkeleton";
import Breadcrumb from "../components/category-detail/Breadcrumb";

const CategoryDetail = () => {

    const { slug } = useParams();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [sortBy, setSortBy] = useState("default");

    const [selectedPrice, setSelectedPrice] = useState("all");

    const [stockFilter, setStockFilter] = useState("all");

    useEffect(() => {

        fetchCategory();

    }, [slug]);

    const fetchCategory = async () => {

        try {

            const data = await getCategoryProducts(slug);

            console.log(data);

            setCategory(data);

            setProducts(data.products);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

if (loading) {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}

        </div>

      </div>

    </>
  );
}

    // =======================
    // Search
    // =======================

    const filteredProducts = products.filter((product) =>

        product.name
            .toLowerCase()
            .includes(search.toLowerCase())

    );

    // =======================
    // Sort
    // =======================

    const sortedProducts = [...filteredProducts];

    switch (sortBy) {

        case "price_low":

            sortedProducts.sort(
                (a, b) =>
                    Number(a.discount_price) -
                    Number(b.discount_price)
            );

            break;

        case "price_high":

            sortedProducts.sort(
                (a, b) =>
                    Number(b.discount_price) -
                    Number(a.discount_price)
            );

            break;

        case "rating":

            sortedProducts.sort(
                (a, b) =>
                    (b.average_rating || 0) -
                    (a.average_rating || 0)
            );

            break;

        case "discount":

            sortedProducts.sort(
                (a, b) =>
                    (b.off || 0) -
                    (a.off || 0)
            );

            break;

        case "newest":

            sortedProducts.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );

            break;

        default:

            break;

    }

    // =======================
    // Price Filter
    // =======================

    const priceFilteredProducts = sortedProducts.filter((product) => {

        const price = Number(product.discount_price);

        switch (selectedPrice) {

            case "20":

                return price < 20;

            case "50":

                return price >= 20 && price <= 50;

            case "100":

                return price > 50 && price <= 100;

            case "101":

                return price > 100;

            default:

                return true;

        }

    });

    // =======================
    // Stock Filter
    // =======================

    const stockFilteredProducts = priceFilteredProducts.filter((product) => {

        switch (stockFilter) {

            case "in_stock":

                return product.stock_status === true;

            case "out_stock":

                return product.stock_status === false;

            default:

                return true;

        }

    });

    return (

        <>

            <Navbar />


            <div className="max-w-7xl mx-auto px-6 py-10">

            <Breadcrumb
                items={[
            {
            label: "Home",
            link: "/",
            },
            {
            label: "Categories",
            link: "/category",
            },
            {
            label: category.category_name,
            },
        ]}
/>

                {/* Hero */}

                <CategoryDetailHero category={category} />

                {/* Toolbar */}

                <FilterToolbar

                    search={search}
                    setSearch={setSearch}

                    sortBy={sortBy}
                    setSortBy={setSortBy}

                    selectedPrice={selectedPrice}
                    setSelectedPrice={setSelectedPrice}

                    stockFilter={stockFilter}
                    setStockFilter={setStockFilter}

                />

                {/* Product Count + Active Filters */}

                <ActiveFilters

                    totalProducts={products.length}
                    filteredCount={stockFilteredProducts.length}

                    search={search}
                    setSearch={setSearch}

                    selectedPrice={selectedPrice}
                    setSelectedPrice={setSelectedPrice}

                    stockFilter={stockFilter}
                    setStockFilter={setStockFilter}

                    setSortBy={setSortBy}

                />

                {/* Products */}

                <h2 className="text-3xl font-bold mt-10">

                    Products

                </h2>


                {
                    stockFilteredProducts.length === 0 ? (

                    <EmptyProducts />

                     ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">

                        {stockFilteredProducts.map((product) => (

                        <ProductCard key={product.id} product={product} />

                    ))}

                  </div>

                 )
               }

            </div>

        </>

    );

};

export default CategoryDetail;