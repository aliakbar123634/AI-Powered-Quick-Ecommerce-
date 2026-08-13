
import Navbar from "../components/Navbar";
import CategoryHero from "../components/categories/CategoryHero";
import CategoryGrid from "../components/categories/CategoryGrid";
import { useEffect, useState } from "react";
import { getCategories } from "../api/productApi";
import CategorySearch from "../components/categories/CategorySearch";
import CategoryChips from "../components/categories/CategoryChips";
import CategoryPagination from "../components/categories/CategoryPagination";
import CategorySkeleton from "../components/categories/CategorySkeleton";
import CategoryEmpty from "../components/categories/CategoryEmpty";
import Footer from "../components/footer/Footer";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [error, setError] = useState("");
    const filteredCategories = categories.filter((category) => {

    const matchesSearch = category.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesChip =
        selectedCategory === "All" ||
        category.name === selectedCategory;

    return matchesSearch && matchesChip;

});
    useEffect(() => {
      window.scrollTo({

      top:0,

      behavior:"smooth"

   });
    fetchCategories(page);
    }, [page]);

    const fetchCategories = async (pageNumber) => {

    try {

        const data = await getCategories(pageNumber);

        setCategories(data.results);

        setCount(data.count);

        setNextPage(data.next);

        setPreviousPage(data.previous);

    } catch (error) {

        console.log(error);
        setError("Failed to load categories.");

    } finally {

        setLoading(false);

    }



};
if (error) {

return (

<div className="text-center py-24">

<h2 className="text-red-600 text-3xl font-bold">

{error}

</h2>

</div>

);

}
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <CategoryHero />
        
        <CategorySearch value={search} onChange={(e) => setSearch(e.target.value)}/>
        <CategoryChips categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory}/>
{
  loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
      {[...Array(8)].map((_, index) => (
        <CategorySkeleton key={index} />
      ))}
    </div>
  ) : filteredCategories.length > 0 ? (
    <CategoryGrid categories={filteredCategories} />
  ) : (
    <CategoryEmpty />
  )
}
  {/* <CategoryGrid categories={filteredCategories} /> */}
        <CategoryPagination  page={page}  setPage={setPage}  nextPage={nextPage}  previousPage={previousPage}/>
        <Footer/>
       </div>
      
    </>
  );
};

export default Categories;