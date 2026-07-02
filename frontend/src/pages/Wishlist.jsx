import React from 'react'
import Navbar from "../components/Navbar";
import WishlistBreadcrumb from "../components/WishlistBreadcrumb"
import WishlistHeader from "../components/WishlistHeader";
import WishlistGrid from "../components/WishlistGrid";
import EmptyWishlist from "../components/EmptyWishlist";
import { useEffect, useState } from "react";
import {
  getWishlist,
  removeFromWishlist,
} from "../api/productApi";
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);
    useEffect(() => {

    fetchWishlist();

  }, []);

  const fetchWishlist = async () => {

    try {

      const response = await getWishlist();

      // setWishlist(response.data.results);
      setWishlist(response.data.results);
      console.log("wishlist", response.data.results);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const handleRemove = async (productId) => {

    try {

      await removeFromWishlist({
        product: productId,
      });

      setWishlist((prev) =>
        prev.filter((item) => item.product !== productId)
      );

      alert("Product removed successfully.");

    } catch (error) {

      console.log(error);

      alert("Failed to remove product.");

    }

  };

  if (loading) {

    return (
      <h2 className="text-center text-2xl mt-20">
        Loading...
      </h2>
    );

  }
  return (
    <>
      <Navbar />

      <WishlistBreadcrumb />

      <WishlistHeader
        totalItems={wishlist.length}
      />

      {wishlist.length > 0 ? (

        <WishlistGrid
          wishlist={wishlist}
          handleRemove={handleRemove}
        />

      ) : (

        <EmptyWishlist />

      )}

    </>

  )
}

export default Wishlist
