import { useEffect, useState } from "react";
import { getCategories } from "../api/productApi"; 

const Category = () => {
  const [category, setcategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCategories();
        setcategory(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching cateory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h3>Loading...</h3>;

  return (
    <div>
      {category.map((category) => (
        <div key={category.id}>
          <h4> categor name :{category.name}</h4>
          <h4>categor slug :{category.slug}</h4>
          <h4>categor description :{category.description}</h4>
          <h4>categor image :    <img
      src={category.image}
      alt={category.name}
      width="200"
    /></h4>
        </div>
      ))}
    </div>
  );
};

export default Category;