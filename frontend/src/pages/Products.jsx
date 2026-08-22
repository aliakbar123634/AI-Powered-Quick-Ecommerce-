import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductsHeader from "../components/ProductsHeader";
import SearchAndSort from "../components/SearchAndSort";
import ProductsGrid from "../components/ProductsGrid";
import FiltersSidebar from "../components/FiltersSidebar";
import Footer from "../components/footer/Footer";

const Products = () => {
  const [searchParams] = useSearchParams();

  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const [rating, setRating] = useState("");
  const [discount, setDiscount] = useState("");

  const [priceRange, setPriceRange] = useState([0, 1000]);

  // URL se search query read karo
  // useEffect(() => {
  //   const searchQuery = searchParams.get("search") || "";
  //   setSearch(searchQuery);
  // }, [searchParams]);

  useEffect(() => {
  const searchQuery = searchParams.get("search") || "";
  setSearch(searchQuery);
}, [searchParams]);

  const clearFilters = () => {
    setSearch("");
    setOrdering("");
    setSelectedCategory("");
    setStockStatus("");
    setRating("");
    setDiscount("");
    setPriceRange([0, 1000]);
  };

  return (
    <div>
      <Navbar />

      <ProductsHeader
        search={search}
        setSearch={setSearch}
      />

      <SearchAndSort
        search={search}
        setSearch={setSearch}
        ordering={ordering}
        setOrdering={setOrdering}
        totalProducts={totalProducts}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-12 gap-8">

          <div className="col-span-3">
            <FiltersSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              stockStatus={stockStatus}
              setStockStatus={setStockStatus}
              rating={rating}
              setRating={setRating}
              discount={discount}
              setDiscount={setDiscount}
              clearFilters={clearFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <div className="col-span-9">

            <ProductsGrid
              search={search}
              ordering={ordering}
              setTotalProducts={setTotalProducts}
              selectedCategory={selectedCategory}
              stockStatus={stockStatus}
              viewMode={viewMode}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              rating={rating}
              discount={discount}
            />

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Products;