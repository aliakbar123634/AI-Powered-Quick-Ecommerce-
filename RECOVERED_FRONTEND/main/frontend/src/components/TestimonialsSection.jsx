import {
  Star,
  Quote,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Customer",
    rating: 5,
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "The AI recommendations are incredibly accurate. I discovered products I didn't even know I needed and got them delivered within minutes.",
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Premium Member",
    rating: 5,
    featured: true,
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Fast delivery, smart recommendations and a flawless checkout experience. Easily the best shopping platform I've used.",
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Verified Customer",
    rating: 4,
    image:
      "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "The interface is beautiful, delivery is lightning fast and the AI assistant saves me hours every month.",
  },
];

const stats = [
  {
    value: "10K+",
    label: "Happy Customers",
    color: "text-blue-600",
  },
  {
    value: "4.9",
    label: "Average Rating",
    color: "text-green-600",
  },
  {
    value: "98%",
    label: "Satisfaction",
    color: "text-purple-600",
  },
  {
    value: "15 Min",
    label: "Delivery Time",
    color: "text-orange-500",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-[#F8FAFC]">

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center max-w-4xl mx-auto mb-20">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">
            <TrendingUp size={16} />
            Customer Reviews
          </div>

          <h2 className="mt-6 text-5xl md:text-6xl font-bold text-[#0F172A] leading-tight">
            Loved By
            <span className="text-[#2563EB]">
              {" "}Thousands Of Shoppers
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Real feedback from customers using our AI-powered
            shopping experience every day.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">

            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill="#F59E0B"
                stroke="#F59E0B"
              />
            ))}

            <span className="font-semibold text-[#0F172A]">
              4.9/5
            </span>

            <span className="text-gray-500">
              from 10,000+ reviews
            </span>

          </div>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 gap-8">

          {testimonials.map((user) => (

            <div
              key={user.id}
              className={`
                relative
                rounded-3xl
                p-8
                transition-all
                duration-500
                hover:-translate-y-3
                ${
                  user.featured
                    ? "bg-white border-2 border-blue-300 shadow-2xl scale-105"
                    : "bg-white border border-[#E2E8F0] hover:shadow-xl"
                }
              `}
            >

              {user.featured && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-semibold">
                    Most Popular Review
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">

                <Quote
                  size={34}
                  className="text-[#2563EB]"
                />

                <div className="flex gap-1">
                  {[...Array(user.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="#F59E0B"
                      stroke="#F59E0B"
                    />
                  ))}
                </div>

              </div>

              <p className="text-gray-600 leading-8 min-h-[170px]">
                "{user.review}"
              </p>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center gap-4">

                <img
                  src={user.image}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>

                  <h4 className="font-bold text-[#0F172A]">
                    {user.name}
                  </h4>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BadgeCheck
                      size={14}
                      className="text-blue-500"
                    />
                    {user.role}
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">

          {stats.map((item, index) => (

            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                border
                border-[#E2E8F0]
                p-8
                text-center
                hover:shadow-lg
                transition-all
              "
            >

              <h3
                className={`text-5xl font-bold ${item.color}`}
              >
                {item.value}
              </h3>

              <p className="text-gray-500 mt-3">
                {item.label}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default TestimonialsSection;