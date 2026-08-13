// import {
//   CreditCard,
//   Sparkles,
//   Rocket,
//   Users,
// } from "lucide-react";

// import React from 'react'

// const TrustBadges = () => {
//   const status=[
//     {
//       icon: <CreditCard size={28} />,
//       value: "Secure Payments",
//       label: "256-bit encrypted checkout process.",
//     },
//     {
//       icon: <Sparkles size={28} />,
//       value: "AI Recommendations",
//       label: "Personalized products based on behavior.",
//     },
//     {
//       icon: <Rocket size={28} />,
//       value: "Fast Delivery",
//       label: " Get products delivered within minutes.",
//     },
//     {
//       icon: <Users size={28} />,
//       value: "Trusted By Users",
//       label: "Loved by more than 10,000 shoppers.",
//     },            
//   ] 
//   return (
//     <section className="w-full py-20 bg-white px-4">
//         <div className="flex flex-col justify-between items-center mb-14 ">
//             <div className="flex flex-col items-center gap-2 mb-15">
//                 <h1 className="text-4xl font-bold text-slate-900">Why Shop With Us</h1>
//                 <p className="mt-4 text-slate-500 max-w-2xl mx-auto">Experience secure payments, AI-powered shopping
//                 and lightning-fast delivery all in one place.</p>
//             </div>
//             <div className="flex justify-between items-center gap-6">{status.map((item, index)=>{
//                 return (

//                 <div key={index} className="bg-[#F8FAFC] border  border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
//                     <div className=" w-12 h-12 rounded-2xl  bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-2 ">
//                         {item.icon}</div>
//                     <div className="font-bold text-xl text-slate-900">{item.value}</div>
//                     <div className="leading-relaxed text-gray-500 mt-2">{item.label}</div>
//                 </div>)
//             })}</div>
//         </div>
//     </section>
//   )
// }

// export default TrustBadges



import {
  CreditCard,
  Sparkles,
  Rocket,
  Users,
} from "lucide-react";

import React from "react";

const TrustBadges = () => {
  const status = [
    {
      icon: <CreditCard size={28} />,
      value: "Secure Payments",
      label: "256-bit encrypted checkout process.",
    },
    {
      icon: <Sparkles size={28} />,
      value: "AI Recommendations",
      label: "Personalized products based on behavior.",
    },
    {
      icon: <Rocket size={28} />,
      value: "Fast Delivery",
      label: "Get products delivered within minutes.",
    },
    {
      icon: <Users size={28} />,
      value: "Trusted By Users",
      label: "Loved by more than 10,000 shoppers.",
    },
  ];

  return (
    <section className="w-full py-14 md:py-20 bg-white px-4">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why Shop With Us
          </h1>

          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            Experience secure payments, AI-powered shopping and
            lightning-fast delivery all in one place.
          </p>

        </div>

        {/* Cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {status.map((item, index) => (
            <div
              key={index}
              className="
                bg-[#F8FAFC]
                border
                border-slate-200
                rounded-3xl
                p-6
                hover:shadow-xl
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-500
                  flex
                  items-center
                  justify-center
                  text-white
                  mb-4
                "
              >
                {item.icon}
              </div>

              <h3 className="font-bold text-xl text-slate-900">
                {item.value}
              </h3>

              <p className="leading-relaxed text-gray-500 mt-2 text-sm md:text-base">
                {item.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustBadges;