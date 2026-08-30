// import React from "react";

// const AdminSidebar = ({
//   activeSection,
//   setActiveSection,
// }) => {

//   const menuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//     },
//     {
//       id: "orders",
//       label: "Orders",
//     },
//     {
//       id: "riders",
//       label: "Riders",
//     },
//     {
//       id: "warehouses",
//       label: "Warehouses",
//     },
//     {
//       id: "inventory",
//       label: "Inventory",
//     },
//   ];

//   return (
//     <aside className="w-64 min-h-screen bg-white border-r">

//       {/* Logo */}
//       <div className="p-6 border-b">

//         <h1 className="text-2xl font-bold">
//           QuickAI
//         </h1>

//         <p className="text-sm text-gray-500 mt-1">
//           Admin Panel
//         </p>

//       </div>

//       {/* Menu */}
//       <nav className="p-4 space-y-2">

//         {menuItems.map((item) => {

//           const active =
//             activeSection === item.id;

//           return (
//             <button
//               key={item.id}
//               onClick={() =>
//                 setActiveSection(item.id)
//               }
//               className={`w-full text-left px-4 py-3 rounded-lg transition ${
//                 active
//                   ? "bg-black text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               {item.label}
//             </button>
//           );

//         })}

//       </nav>

//     </aside>
//   );
// };

// export default AdminSidebar;

import React from "react";

const AdminSidebar = ({
  activeSection,
  setActiveSection,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "▦",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "◫",
    },
    {
      id: "riders",
      label: "Riders",
      icon: "♟",
    },
    {
      id: "warehouses",
      label: "Warehouses",
      icon: "⌂",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "▤",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col shrink-0">

      {/* =========================
          BRAND
      ========================= */}

      <div className="px-6 py-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-gradient-to-br
              from-blue-600
              to-purple-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shadow-lg
              shadow-blue-600/20
            "
          >
            Q
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              QuickAI
            </h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Admin Panel
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="flex-1 px-4 py-6">

        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Management
        </p>

        <div className="space-y-1.5">

          {menuItems.map((item) => {

            const active =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setActiveSection(item.id)
                }
                className={`
                  group
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-xl
                  text-left
                  transition-all
                  duration-200
                  ${
                    active
                      ? `
                        bg-gradient-to-r
                        from-blue-600
                        to-purple-600
                        text-white
                        shadow-lg
                        shadow-blue-600/20
                      `
                      : `
                        text-slate-400
                        hover:text-white
                        hover:bg-white/5
                      `
                  }
                `}
              >

                {/* Icon */}

                <span
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                    transition-all
                    ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    }
                  `}
                >
                  {item.icon}
                </span>


                {/* Label */}

                <span className="font-medium text-sm">
                  {item.label}
                </span>


                {/* Active Arrow */}

                {active && (
                  <span className="ml-auto text-white/80 text-lg">
                    ›
                  </span>
                )}

              </button>
            );

          })}

        </div>

      </nav>


      {/* =========================
          ADMIN PROFILE
      ========================= */}

      <div className="p-4 border-t border-white/10">

        <div className="rounded-xl bg-white/5 border border-white/10 p-3">

          <div className="flex items-center gap-3">

            <div
              className="
                w-9
                h-9
                rounded-full
                bg-gradient-to-br
                from-blue-500
                to-purple-500
                flex
                items-center
                justify-center
                text-sm
                font-bold
                text-white
              "
            >
              A
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-white">
                Administrator
              </p>

              <p className="text-xs text-slate-400 truncate">
                QuickAI Admin
              </p>

            </div>

          </div>

        </div>

      </div>

    </aside>
  );
};

export default AdminSidebar;