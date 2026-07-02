import React from "react";
import WishlistCard from "./WishlistCard";

const WishlistGrid = ({ wishlist, handleRemove }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">

      {wishlist.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {wishlist.map((item) => (

            <WishlistCard
              key={item.id}
              item={item}
              handleRemove={handleRemove}
            />

          ))}

        </div>

      ) : null}

    </div>
  );
};

export default WishlistGrid;