import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BottomOfferBanner() {
  return (
    <section className="mt-20 mb-10">

      <div
        className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-orange-500
        via-red-500
        to-pink-600
        p-10
        lg:p-16
        text-white
        "
      >

        {/* Background Circles */}

        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10"></div>

        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10"></div>

        <div className="relative z-10 grid lg:grid-cols-2 items-center gap-10">

          {/* Left */}

          <div>

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              🎉 Limited Time Offer
            </span>

            <h2 className="mt-6 text-4xl lg:text-6xl font-extrabold leading-tight">
              Up To
              <span className="text-yellow-300"> 70% OFF </span>
              On Today's Deals
            </h2>

            <p className="mt-5 text-lg text-white/90 max-w-xl">
              Save big on groceries, electronics, fashion,
              beauty and thousands of products.
              Hurry before the deals expire.
            </p>

            <Link
              to="/products"
              className="
              inline-flex
              items-center
              gap-3
              mt-8
              bg-white
              text-red-600
              px-8
              py-4
              rounded-xl
              font-bold
              hover:scale-105
              transition
              "
            >
              Shop Now
              <ArrowRight size={20} />
            </Link>

          </div>

          {/* Right */}

          <div className="flex justify-center">

            <img
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=700"
              alt="Sale"
              className="
              w-full
              max-w-md
              rounded-3xl
              shadow-2xl
              object-cover
              "
            />

          </div>

        </div>

      </div>

    </section>
  );
}