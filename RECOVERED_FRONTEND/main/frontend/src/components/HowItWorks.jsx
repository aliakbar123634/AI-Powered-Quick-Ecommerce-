import {
  Search,
  Brain,
  ShoppingCart,
  Truck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse Products",
    description: "Discover products instantly with smart search.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Recommends",
    description: "Get personalized suggestions based on behavior.",
    color: "from-purple-500 to-pink-500",
    featured: true,
  },
  {
    number: "03",
    icon: ShoppingCart,
    title: "Place Order",
    description: "Secure checkout in just a few clicks.",
    color: "from-green-500 to-emerald-500",
  },
  {
    number: "04",
    icon: Truck,
    title: "Fast Delivery",
    description: "Receive orders in as little as 15 minutes.",
    color: "from-orange-500 to-red-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center max-w-3xl mx-auto mb-20">

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">
            <Sparkles size={16} />
            How It Works
          </span>

          <h2 className="mt-6 text-4xl md:text-6xl font-bold text-[#0F172A]">
            Shopping In
            <span className="text-[#2563EB]"> 4 Simple Steps</span>
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Browse products, get AI recommendations,
            place your order and enjoy lightning-fast delivery.
          </p>

        </div>

        {/* Steps */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`
                  relative
                  rounded-3xl
                  p-8
                  border
                  transition-all
                  duration-500
                  hover:-translate-y-3
                  hover:shadow-2xl
                  ${
                    step.featured
                      ? "border-purple-300 bg-purple-50 shadow-xl scale-105"
                      : "border-[#E2E8F0] bg-white"
                  }
                `}
              >
                {step.featured && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                      AI Powered
                    </span>
                  </div>
                )}

                <div className="absolute top-5 right-5 text-5xl font-bold text-gray-100">
                  {step.number}
                </div>

                <div
                  className={`
                    w-20 h-20
                    rounded-3xl
                    bg-gradient-to-r
                    ${step.color}
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-lg
                    mb-6
                  `}
                >
                  <Icon size={36} />
                </div>

                <h3 className="text-2xl font-bold text-[#0F172A]">
                  {step.title}
                </h3>

                <p className="mt-4 text-gray-500 leading-7">
                  {step.description}
                </p>

                <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-[#F1F5F9] text-sm text-gray-600">
                  Quick & Easy
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">

          <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0]">
            <h3 className="text-3xl font-bold text-[#2563EB]">10K+</h3>
            <p className="text-gray-500 mt-2">Active Users</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0]">
            <h3 className="text-3xl font-bold text-[#16A34A]">5K+</h3>
            <p className="text-gray-500 mt-2">Products</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0]">
            <h3 className="text-3xl font-bold text-purple-600">98%</h3>
            <p className="text-gray-500 mt-2">Satisfaction</p>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0]">
            <h3 className="text-3xl font-bold text-orange-500">15 Min</h3>
            <p className="text-gray-500 mt-2">Delivery</p>
          </div>

        </div>

        {/* CTA */}

        <div className="mt-20 rounded-[32px] overflow-hidden bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] p-12 text-center text-white shadow-2xl">

          <h3 className="text-4xl md:text-5xl font-bold">
            Start Shopping Smarter Today
          </h3>

          <p className="mt-5 text-lg text-blue-100 max-w-2xl mx-auto">
            Let AI find the products you actually want,
            save money and get them delivered in minutes.
          </p>

          <button className="mt-8 bg-white text-[#2563EB] px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-2 hover:scale-105 transition-all">
            Explore Products
            <ArrowRight size={20} />
          </button>

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;