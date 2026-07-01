import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById } from '../api/productApi';


const CategoryDetails = () => {
    const { id } = useParams();
    const [category, setcategory] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(()=>{

        const apicall=async ()=>{
            try{
                const response=await getCategoryById(id)
                setcategory(response)
                console.log(response);
                
            }catch(error){
                console.log(error);                
            }finally{
                setLoading(false)
            }
        }
    apicall()    
} , [id])
if (loading) return <h1>Loading...</h1>;

if (!category) return <h1>Category Not Found</h1>;
  return (
    <div>
       <h1>Category Details</h1>
       <h1>Category id :{category.id}</h1>
       <h1>Category name :{category.name}</h1>
       <h1>Category slug :{category.slug}</h1>
       <h1>Category description :{category.description}</h1>
       <h1>Category description :{category.description}</h1>
        <img
        src={category.image}
        alt={category.name}
        width="300"
      />
    </div>
  )
}

export default CategoryDetails
