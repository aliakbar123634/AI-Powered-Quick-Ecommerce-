// import {
//   Brain,
//   Sparkles,
//   TrendingUp,
//   Clock,
//   Package,
//   Activity,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { getProducts } from "../api/productApi";

// import React from 'react'

// const AIRecommendation = () => {

//   const [product, setproduct] = useState([])
//   const [loading , setloading]=useState(true)
//   useEffect(()=>{
//     const fetchdata=async()=>{
//       try{
//       const data=await getProducts();
//         setProduct(data.data.results);
//         console.log(data.data); 
//         } catch(error){
//           console.log(error);
          
//         }  finally{
//           setloading(false)
//         }  
//     }; fetchdata()
//   } , [])
//   if (loading) return <h3 className="text-center py-10">Loading...</h3>;
//   return (
//     <section className="bg-white w-full p-10">
//       <div className="bg-white w-full flex justify-between">
//         <div className="w-1/2 flxe flex-col">
//             <div className="inline-flex items-center gap-2  rounded-full bg-purple-100 text-purple-600 px-4 py-2 font-semibold mb-6">
//                 <Brain size={18} />AI Powered Recommendations</div>
//             <div><h1 className="text-5xl font-bold text-[#0F172A] leading-tight">
//                 Shopping That Learns
//               <br />
//               What You Love</h1></div>
            
//             <p className="text-lg mt-6 text-gray-500 max-w-xl"> Our AI analyzes browsing behavior, purchases,
//               interests and shopping habits to recommend
//               products you'll actually buy.
//             </p>
//         <div className="mt-8 space-y-3">
//             <div className="flex items-center gap-3">
//                 <span className="text-green-500">✓</span>
//                 <span>Personalized Shopping Experience</span>
//             </div>
//             <div className="flex items-center gap-3">
//                 <span className="text-green-500">✓</span>
//                 <span>Purchase Behavior Analysis</span>
//             </div>
//             <div className="flex items-center gap-3">
//                 <span className="text-green-500">✓</span>
//                 <span>Smart Product Discovery</span>
//             </div>
//             <div className="flex items-center gap-3">
//                 <span className="text-green-500">✓</span>
//                 <span>AI Powered Discounts</span>
//             </div>
//         </div>
//         <div className="mt-10 space-y-5 mr-15">

//               {product.slice(0, 3).map((item) => (
//                 <div
//                   key={item.name}
//                   className="bg-[#F8FAFC] p-4 rounded-2xl"
//                 >
//                   <div className="flex justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       <Sparkles
//                         size={18}
//                         className="text-purple-500"
//                       />
//                       <span className="font-medium">
//                         {item.name}
//                       </span>
//                     </div>

//                     <span className="font-semibold text-purple-600">
//                       98% Match
//                     </span>
//                   </div>

//                   <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
//                       style={{
//                         width: `${item.match}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}

//             </div>
//         </div>
//         <motion.div
//             animate={{
//               y: [0, -12, 0],
//             }}
//             transition={{
//               duration: 5,
//               repeat: Infinity,
//             }}
//             className="
//             bg-[#0F172A]
//             rounded-3xl
//             w-1/2
//             p-8
//             text-white
//             shadow-2xl
//             "
//           >

//             <div className="flex items-center gap-3 mb-8">
//               <Brain size={30} />
//               <h3 className="text-3xl font-bold">
//                 AI Shopping Assistant
//               </h3>
//             </div>

//             {/* MAIN SCORE */}

//             <div className="bg-white/10 p-6 rounded-2xl mb-5">

//               <p className="text-gray-300">
//                 Behavior Match Score
//               </p>

//               <h2 className="text-6xl font-bold text-green-400 mt-2">
//                 98%
//               </h2>

//             </div>

//             {/* STATS */}

//             <div className="grid grid-cols-2 gap-4">

//               <div className="bg-white/10 p-5 rounded-2xl">
//                 <TrendingUp
//                   className="text-green-400 mb-3"
//                 />
//                 <p className="text-gray-300 text-sm">
//                   Savings
//                 </p>
//                 <h4 className="text-2xl font-bold">
//                   $45
//                 </h4>
//               </div>

//               <div className="bg-white/10 p-5 rounded-2xl">
//                 <Clock
//                   className="text-blue-400 mb-3"
//                 />
//                 <p className="text-gray-300 text-sm">
//                   ETA
//                 </p>
//                 <h4 className="text-2xl font-bold">
//                   12 Min
//                 </h4>
//               </div>

//               <div className="bg-white/10 p-5 rounded-2xl">
//                 <Package
//                   className="text-purple-400 mb-3"
//                 />
//                 <p className="text-gray-300 text-sm">
//                   Products Found
//                 </p>
//                 <h4 className="text-2xl font-bold">
//                   156
//                 </h4>
//               </div>

//               <div className="bg-white/10 p-5 rounded-2xl">
//                 <Activity
//                   className="text-orange-400 mb-3"
//                 />
//                 <p className="text-gray-300 text-sm">
//                   Accuracy
//                 </p>
//                 <h4 className="text-2xl font-bold">
//                   99%
//                 </h4>
//               </div>

//             </div>

//             {/* RECENT ACTIVITY */}

//             <div className="mt-6 bg-white/10 p-5 rounded-2xl">

//               <h4 className="font-semibold mb-4">
//                 Recent AI Activity
//               </h4>

//               <div className="space-y-3 text-sm">

//                 <p>✓ Gaming Mouse Recommended</p>

//                 <p>✓ Mechanical Keyboard Added</p>

//                 <p>✓ Smart Watch Predicted</p>

//               </div>

//             </div>

//             {/* LIVE STATUS */}

//             <div className="mt-6 bg-green-500 rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold">

//               <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>

//               AI Learning User Behavior Live

//             </div>

//           </motion.div>

//         </div>
//       {/* </div> */}
//     </section>
//   )
// }

// export default AIRecommendation





import {
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  Package,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

const AIRecommendation = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();

        setProduct(data.data.results);

        console.log(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <h3 className="text-center py-10 text-lg font-semibold">
        Loading...
      </h3>
    );

  return (
    <section className="bg-white w-full py-10 px-4 sm:px-6 lg:px-10">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

        {/* LEFT SIDE */}

        <div className="w-full lg:w-1/2">

          {/* Badge */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-purple-100
              text-purple-600
              px-4
              py-2
              font-semibold
              mb-6
            "
          >
            <Brain size={18} />
            AI Powered Recommendations
          </div>

          {/* Heading */}

          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              text-[#0F172A]
              leading-tight
            "
          >
            Shopping That Learns
            <br />
            What You Love
          </h1>

          {/* Description */}

          <p
            className="
              text-base
              sm:text-lg
              mt-6
              text-gray-500
              max-w-xl
              leading-8
            "
          >
            Our AI analyzes browsing behavior,
            purchase history, interests and
            shopping habits to recommend
            products you'll actually love.
          </p>

          {/* Features */}

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">
                ✓
              </span>

              <span className="text-sm sm:text-base">
                Personalized Shopping Experience
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">
                ✓
              </span>

              <span className="text-sm sm:text-base">
                Purchase Behavior Analysis
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">
                ✓
              </span>

              <span className="text-sm sm:text-base">
                Smart Product Discovery
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">
                ✓
              </span>

              <span className="text-sm sm:text-base">
                AI Powered Discounts
              </span>
            </div>

          </div>

          {/* Recommendation Cards */}

          <div className="mt-10 space-y-4">

            {product.slice(0, 3).map((item) => (

              <div
                key={item.id}
                className="
                  bg-[#F8FAFC]
                  p-4
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >

                <div className="flex justify-between items-center gap-3 mb-3">

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={18}
                      className="text-purple-500"
                    />

                    <span className="font-medium text-sm sm:text-base line-clamp-1">
                      {item.name}
                    </span>

                  </div>

                  <span className="text-purple-600 font-semibold text-sm whitespace-nowrap">
                    98% Match
                  </span>

                </div>

                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                      width: `${item.match || 98}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT SIDE STARTS */}
                <motion.div
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="
            w-full
            lg:w-1/2
            bg-[#0F172A]
            rounded-3xl
            p-6
            sm:p-8
            text-white
            shadow-2xl
          "
        >

          {/* Header */}

          <div className="flex items-center gap-3 mb-8">

            <Brain size={30} />

            <h3 className="text-2xl sm:text-3xl font-bold">
              AI Shopping Assistant
            </h3>

          </div>

          {/* Main Score */}

          <div className="bg-white/10 rounded-2xl p-6 mb-6">

            <p className="text-gray-300">
              Behavior Match Score
            </p>

            <h2 className="text-5xl sm:text-6xl font-bold text-green-400 mt-2">
              98%
            </h2>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white/10 rounded-2xl p-5">

              <TrendingUp
                className="text-green-400 mb-3"
              />

              <p className="text-gray-300 text-sm">
                Savings
              </p>

              <h4 className="text-xl sm:text-2xl font-bold">
                $45
              </h4>

            </div>

            <div className="bg-white/10 rounded-2xl p-5">

              <Clock
                className="text-blue-400 mb-3"
              />

              <p className="text-gray-300 text-sm">
                ETA
              </p>

              <h4 className="text-xl sm:text-2xl font-bold">
                12 Min
              </h4>

            </div>

            <div className="bg-white/10 rounded-2xl p-5">

              <Package
                className="text-purple-400 mb-3"
              />

              <p className="text-gray-300 text-sm">
                Products Found
              </p>

              <h4 className="text-xl sm:text-2xl font-bold">
                156
              </h4>

            </div>

            <div className="bg-white/10 rounded-2xl p-5">

              <Activity
                className="text-orange-400 mb-3"
              />

              <p className="text-gray-300 text-sm">
                Accuracy
              </p>

              <h4 className="text-xl sm:text-2xl font-bold">
                99%
              </h4>

            </div>

          </div>

          {/* Recent Activity */}

          <div className="mt-6 bg-white/10 rounded-2xl p-5">

            <h4 className="font-semibold mb-4">
              Recent AI Activity
            </h4>

            <div className="space-y-3 text-sm sm:text-base">

              <p>✓ Gaming Mouse Recommended</p>

              <p>✓ Mechanical Keyboard Added</p>

              <p>✓ Smart Watch Predicted</p>

            </div>

          </div>

          {/* Live Status */}

          <div
            className="
              mt-6
              bg-green-500
              rounded-2xl
              p-4
              flex
              items-center
              justify-center
              gap-3
              text-center
              text-sm
              sm:text-base
              font-semibold
            "
          >

            <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>

            AI Learning User Behavior Live

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default AIRecommendation;