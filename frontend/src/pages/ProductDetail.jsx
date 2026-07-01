import { addToCart } from '../api/orderApi';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import Navbar from "../components/Navbar";
import ProductBreadcrumb from "../components/ProductBreadcrumb";
import ProductGallery from "../components/ProductGallery"; 
import ProductInfo from '../components/ProductInfo';
import ProductTabs from "../components/ProductTabs";
import RelatedProducts from "../components/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);
  const handleAddtoCart=async()=>{
    try {
      const response=await addToCart({
        product: product.id,
        quantity: 1,      
      })
      alert("Added To Cart");
    }catch(error){
      console.log(error);
    }

  }

  if (!product) return <h3>Loading...</h3>;

  return (
    <div>
      <Navbar />
      <ProductBreadcrumb
        category={product.category_name}
        productName={product.name}
      />
      <ProductGallery
      // images={[product.image]}
        images={[
             product.image,
                ...product.images.map((img) => img.image),
          ]}
      offPercentage={product.off}
      />
      <div className="max-w-7xl mx-auto px-6 py-10">

    <div className="grid lg:grid-cols-2 gap-14">

        <ProductGallery
            images={[product.image]}
            offPercentage={product.off}
        />

        <ProductInfo
            product={product}
            onAddToCart={(qty) => {
                console.log(qty);
                handleAddtoCart();
            }}
        />

    </div>

   </div>
   <ProductTabs product={product} />
   <RelatedProducts product={product} />
    </div>
  );
};

export default ProductDetail;




