import {
  Brain,
  Truck,
  ShieldCheck,
  MapPinned,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Smart Search",
    description:
      "Discover products instantly with AI-powered recommendations tailored to your shopping behavior.",
    gradient: "from-blue-500 to-purple-500",
    featured: true,
    points: [
      "98% Recommendation Accuracy",
      "Personalized Results",
      "Smart Product Discovery",
    ],
  },
  {
    icon: Truck,
    title: "Lightning Delivery",
    description:
      "Get groceries, electronics and essentials delivered within minutes.",
    gradient: "from-green-500 to-emerald-500",
    points: [
      "15 Min Average Delivery",
      "Live Driver Tracking",
      "Instant Dispatch",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Fast and secure checkout with encrypted transactions.",
    gradient: "from-orange-500 to-yellow-500",
    points: [
      "256-bit Encryption",
      "Fraud Protection",
      "Safe Checkout",
    ],
  },
  {
    icon: MapPinned,
    title: "Live Tracking",
    description:
      "Track your order from warehouse to doorstep in real time.",
    gradient: "from-pink-500 to-rose-500",
    points: [
      "Real-Time Updates",
      "Driver Location",
      "Delivery ETA",
    ],
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center max-w-3xl mx-auto mb-16">

          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">
            Why Choose Us
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mt-6">
            Built For Modern
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}AI Shopping
            </span>
          </h2>

          <p className="text-gray-500 text-lg mt-5">
            Experience a smarter way to shop with AI recommendations,
            lightning-fast delivery and secure checkout.
          </p>
        </div>

        {/* Feature Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={`
                  group
                  bg-white
                  rounded-3xl
                  border
                  border-[#E2E8F0]
                  p-8
                  transition-all
                  duration-500
                  hover:-translate-y-3
                  hover:shadow-2xl
                  ${feature.featured ? "ring-2 ring-blue-500" : ""}
                `}
              >

                {/* Badge */}

                {feature.featured && (
                  <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                    <Sparkles size={14} />
                    Most Popular
                  </div>
                )}

                {/* Icon */}

                <div
                  className={`
                    w-16 h-16 rounded-2xl
                    bg-gradient-to-r ${feature.gradient}
                    flex items-center justify-center
                    text-white mb-6
                    group-hover:scale-110
                    transition-all duration-500
                  `}
                >
                  <Icon size={30} />
                </div>

                {/* Title */}

                <h3 className="text-2xl font-bold text-[#0F172A] mb-4">
                  {feature.title}
                </h3>

                {/* Description */}

                <p className="text-gray-500 leading-7 mb-6">
                  {feature.description}
                </p>

                {/* Mini Features */}

                <div className="space-y-3 mb-8">

                  {feature.points.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle
                        size={16}
                        className="text-green-500"
                      />
                      <span className="text-sm text-gray-600">
                        {point}
                      </span>
                    </div>
                  ))}

                </div>

                {/* Button */}

                <button
                  className="
                  flex items-center gap-2
                  text-[#2563EB]
                  font-semibold
                  group-hover:gap-4
                  transition-all
                  duration-300
                  "
                >
                  Learn More
                  <ArrowRight size={18} />
                </button>

              </div>
            );
          })}
        </div>

        {/* Trust Section */}

        <div className="mt-20 bg-white rounded-3xl border border-[#E2E8F0] p-10">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div>
              <h3 className="text-3xl font-bold text-[#0F172A]">
                Trusted By Thousands Of Shoppers
              </h3>

              <p className="text-gray-500 mt-4">
                Join thousands of customers using AI-powered
                shopping, secure payments and ultra-fast delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">

              <div className="text-center">
                <h4 className="text-4xl font-bold text-[#2563EB]">
                  10K+
                </h4>
                <p className="text-gray-500 mt-2">
                  Active Users
                </p>
              </div>

              <div className="text-center">
                <h4 className="text-4xl font-bold text-[#16A34A]">
                  5K+
                </h4>
                <p className="text-gray-500 mt-2">
                  Products
                </p>
              </div>

              <div className="text-center">
                <h4 className="text-4xl font-bold text-purple-600">
                  98%
                </h4>
                <p className="text-gray-500 mt-2">
                  Satisfaction
                </p>
              </div>

              <div className="text-center">
                <h4 className="text-4xl font-bold text-orange-500">
                  15 Min
                </h4>
                <p className="text-gray-500 mt-2">
                  Avg Delivery
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;