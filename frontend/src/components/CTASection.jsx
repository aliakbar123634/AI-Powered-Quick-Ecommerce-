import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Brain,
} from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
          relative
          overflow-hidden
          rounded-[40px]
          bg-[#0F172A]
          text-white
          p-10
          md:p-16
          shadow-2xl
          "
        >

          {/* Background Glow */}

          <div className="absolute top-0 left-0 w-72 h-72 bg-[#2563EB]/20 blur-3xl rounded-full" />

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#7C3AED]/20 blur-3xl rounded-full" />

          <div className="relative z-10">

            {/* Badge */}

            <div
              className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/10
              border
              border-white/20
              text-sm
              font-medium
              "
            >
              <Sparkles size={16} />
              AI Powered Shopping Experience
            </div>

            {/* Main Content */}

            <div className="max-w-4xl mt-8">

              <h2
                className="
                text-4xl
                md:text-6xl
                font-bold
                leading-tight
                "
              >
                Ready To Find Products
                <span className="block text-[#60A5FA]">
                  You'll Actually Love?
                </span>
              </h2>

              <p
                className="
                mt-6
                text-lg
                text-slate-300
                max-w-2xl
                "
              >
                Get personalized AI recommendations,
                lightning-fast delivery and secure checkout
                all in one modern shopping experience.
              </p>

            </div>

            {/* Features */}

            <div
              className="
              grid
              md:grid-cols-3
              gap-4
              mt-10
              "
            >

              <div
                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-4
                flex
                items-center
                gap-3
                "
              >
                <Brain className="text-purple-400" />
                <span>Smart AI Recommendations</span>
              </div>

              <div
                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-4
                flex
                items-center
                gap-3
                "
              >
                <Truck className="text-green-400" />
                <span>15 Minute Delivery</span>
              </div>

              <div
                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-4
                flex
                items-center
                gap-3
                "
              >
                <ShieldCheck className="text-blue-400" />
                <span>Secure Checkout</span>
              </div>

            </div>

            {/* Buttons */}

            <div
              className="
              flex
              flex-col
              sm:flex-row
              gap-4
              mt-10
              "
            >

              <button
                className="
                bg-[#16A34A]
                hover:bg-[#15803D]
                px-8
                py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-300
                "
              >
                <ShoppingBag size={20} />
                Start Shopping Now
              </button>

              <button
                className="
                border
                border-white/20
                hover:bg-white/10
                px-8
                py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-300
                "
              >
                Browse Products
                <ArrowRight size={20} />
              </button>

            </div>

            {/* Trust Line */}

            <div
              className="
              mt-10
              pt-8
              border-t
              border-white/10
              flex
              flex-wrap
              gap-6
              text-slate-300
              "
            >
              <span>⭐ 4.9 Average Rating</span>
              <span>•</span>
              <span>10,000+ Happy Customers</span>
              <span>•</span>
              <span>98% Satisfaction Rate</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTASection;