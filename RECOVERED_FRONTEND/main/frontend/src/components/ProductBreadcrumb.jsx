import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const ProductBreadcrumb = ({
  category = "Category",
  productName = "Product",
}) => {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center flex-wrap gap-2 text-sm">

          <Link
            to="/"
            className="
              flex
              items-center
              gap-1
              text-slate-500
              hover:text-blue-600
              transition-colors
            "
          >
          <Home size={16} />
            Home
          </Link>

          <ChevronRight
            size={16}
            className="text-slate-400"
          />

          <Link
            to="/products"
            className="
              text-slate-500
              hover:text-blue-600
              transition-colors
            "
          >
            Products
          </Link>

          <ChevronRight
            size={16}
            className="text-slate-400"
          />

          <span
            className="
              text-slate-500
              hover:text-blue-600
              cursor-pointer
              transition-colors
            "
          >
            {category}
          </span>

          <ChevronRight
            size={16}
            className="text-slate-400"
          />

          <span className="font-semibold text-slate-900 truncate">
            {productName}
          </span>

        </div>

      </div>
    </section>
  );
};

export default ProductBreadcrumb;