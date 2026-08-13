import { useState } from "react";
import { Star } from "lucide-react";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    {
      id: "description",
      label: "Description",
    },
    {
      id: "specifications",
      label: "Specifications",
    },
    {
      id: "reviews",
      label: `Reviews (${product.reviews?.length || 0})`,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tabs */}

        <div className="flex flex-wrap border-b border-slate-200">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-5 text-sm font-semibold transition
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-blue-600"
                }
              `}
            >
              {tab.label}
            </button>
          ))}

        </div>

        {/* Content */}

        <div className="p-8">

          {/* Description */}

          {activeTab === "description" && (
            <div>

              <h3 className="text-2xl font-bold mb-5">
                Product Description
              </h3>

              <p className="text-slate-600 leading-8 whitespace-pre-line">
                {product.description || "No description available."}
              </p>

            </div>
          )}

          {/* Specifications */}

          {activeTab === "specifications" && (
            <div>

              <h3 className="text-2xl font-bold mb-6">
                Specifications
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                <Spec
                  label="Category"
                  value={product.category_name}
                />

                <Spec
                  label="Brand"
                  value={product.brand}
                />

                <Spec
                  label="Weight"
                  value={`${product.weight} ${product.unit}`}
                />

                <Spec
                  label="Price"
                  value={`$${product.price}`}
                />

                <Spec
                  label="Discount Price"
                  value={`$${product.discount_price}`}
                />

                <Spec
                  label="Availability"
                  value={
                    product.stock_status
                      ? "In Stock"
                      : "Out Of Stock"
                  }
                />

              </div>

            </div>
          )}

          {/* Reviews */}

          {activeTab === "reviews" && (
            <div>

              <h3 className="text-2xl font-bold mb-6">
                Customer Reviews
              </h3>

              {product.reviews?.length ? (
                <div className="space-y-6">

                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-1 mb-2">

                        {[...Array(review.rating)].map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            fill="#FACC15"
                            stroke="#FACC15"
                          />
                        ))}

                      </div>

                      <h4 className="font-semibold">
                        {review.name}
                      </h4>

                      <p className="text-slate-600 mt-2">
                        {review.comment}
                      </p>

                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-slate-500">
                  No reviews available.
                </p>
              )}

            </div>
          )}

        </div>

      </div>

    </section>
  );
};

const Spec = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center border rounded-2xl px-5 py-4">

      <span className="font-medium text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>

    </div>
  );
};

export default ProductTabs;