import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-8">

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          {item.link ? (
            <Link
              to={item.link}
              className="hover:text-green-600 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-900">
              {item.label}
            </span>
          )}

          {index !== items.length - 1 && (
            <ChevronRight size={16} />
          )}
        </div>
      ))}

    </nav>
  );
};

export default Breadcrumb;