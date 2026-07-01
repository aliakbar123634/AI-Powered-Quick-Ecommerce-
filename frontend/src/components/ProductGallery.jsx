import { useState } from "react";
import { Heart } from "lucide-react";

const ProductGallery = ({
  images = [],
  offPercentage = 0,
}) => {
  const [selectedImage, setSelectedImage] = useState(
    images[0] || ""
  );

  return (
    <div className="flex flex-col lg:flex-row gap-5">

      {/* Thumbnails */}

      <div className="flex lg:flex-col gap-3 order-2 lg:order-1">

        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`
              w-20
              h-20
              rounded-2xl
              overflow-hidden
              border-2
              transition-all
              duration-300
              ${
                selectedImage === img
                  ? "border-blue-600"
                  : "border-slate-200 hover:border-blue-300"
              }
            `}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}

      </div>

      {/* Main Image */}

      <div
        className="
        relative
        flex-1
        bg-white
        rounded-3xl
        border
        border-slate-200
        overflow-hidden
        shadow-sm
        "
      >

        {/* Discount */}

        {offPercentage > 0 && (
          <span
            className="
            absolute
            top-5
            left-5
            z-10
            bg-red-500
            text-white
            text-sm
            font-semibold
            px-4
            py-2
            rounded-full
            "
          >
            {offPercentage}% OFF
          </span>
        )}

        {/* Wishlist */}

        <button
          className="
          absolute
          top-5
          right-5
          z-10
          w-12
          h-12
          rounded-full
          bg-white
          shadow-lg
          flex
          items-center
          justify-center
          hover:bg-red-500
          hover:text-white
          transition
          "
        >
          <Heart size={20} />
        </button>

        {/* Image */}

        <img
          src={selectedImage}
          alt=""
          className="
          w-full
          h-[550px]
          object-contain
          p-8
          transition-all
          duration-300
          hover:scale-105
          "
        />

      </div>

    </div>
  );
};

export default ProductGallery;