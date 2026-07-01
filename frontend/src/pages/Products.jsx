import React from 'react'
import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi"; 
import Navbar from '../components/Navbar';
import ProductsHeader from '../components/ProductsHeader'
import SearchAndSort from '../components/SearchAndSort';
import ProductsGrid from '../components/ProductsGrid';
import FeaturedProducts from '../components/FeaturedProducts'
import FiltersSidebar from '../components/FiltersSidebar'

import { Link } from "react-router-dom";
const Products = () => {
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [discount, setDiscount] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const clearFilters = () => {
  setSearch("");
  setOrdering("");
  setSelectedCategory("");
  setStockStatus("");
  setMinPrice("");
  setMaxPrice("");
  setRating("");
  setDiscount("");
  };
  useEffect(()=>{
    const getproduct=async ()=>{
        try{
            const data= await getProducts()
            console.log("API Response:", data)
            setproducts(data.data)
        }catch(error){
            console.log("Error fetching products:", error);
        }finally{
            setLoading(false);
        }
    }
    getproduct()
  },[])
  if (loading) return <h3>Loading...</h3>;
  return (
    <div>
        <Navbar />
        <ProductsHeader search={search} setSearch={setSearch} />
        <SearchAndSort   search={search} setSearch={setSearch} ordering={ordering} setOrdering={setOrdering} totalProducts={totalProducts}   viewMode={viewMode} setViewMode={setViewMode} />
        <div className="max-w-7xl mx-auto px-6 py-8">

         <div className="grid grid-cols-12 gap-8">

            <div className="col-span-3">
               <FiltersSidebar    selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} stockStatus={stockStatus} setStockStatus={setStockStatus}  rating={rating} setRating={setRating}    discount={discount}  setDiscount={setDiscount} clearFilters={clearFilters}   priceRange={priceRange} setPriceRange={setPriceRange}/>
            </div>
                <div className="col-span-9">
               <ProductsGrid   search={search} ordering={ordering} setTotalProducts={setTotalProducts}    selectedCategory={selectedCategory}  stockStatus={stockStatus} viewMode={viewMode}     minPrice={priceRange[0]}  maxPrice={priceRange[1]} rating={rating} discount={discount}/>
            </div>

         </div>

        </div>
        
        <h1>Products Page .............</h1>
    </div>
  )
}

export default Products
