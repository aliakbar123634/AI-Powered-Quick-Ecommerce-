import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "▦",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "◫",
    },
    {
      name: "Riders",
      path: "/admin/riders",
      icon: "♟",
    },
    {
      name: "Warehouses",
      path: "/admin/warehouses",
      icon: "⌂",
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: "▤",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">

        {/* Brand */}

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
                font-bold
                text-lg
                shadow-lg
                shadow-blue-500/20
              "
            >
              Q
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                QuickAI
              </h1>

              <p className="text-xs text-slate-400 mt-0.5">
                Admin Panel
              </p>
            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4 py-6">

          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Management
          </p>

          <div className="space-y-1.5">

            {menuItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  gap-3
                  px-3.5
                  py-3
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    isActive
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
                  `
                }
              >

                {({ isActive }) => (
                  <>
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
                        transition
                        ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-white/5 text-slate-400 group-hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span className="font-medium text-sm">
                      {item.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto text-white/80">
                        ›
                      </span>
                    )}
                  </>
                )}

              </NavLink>

            ))}

          </div>

        </nav>


        {/* Bottom Admin Info */}

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
                "
              >
                A
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-white">
                  Administrator
                </p>

                <p className="text-xs text-slate-400">
                  QuickAI Admin
                </p>

              </div>

            </div>

          </div>

        </div>

      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <main className="flex-1 min-w-0">

        {/* Header */}

        <header
          className="
            h-[82px]
            bg-white
            border-b
            border-slate-200
            px-8
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              QuickAI Administration
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Management Console
            </h2>

          </div>


          {/* Admin Profile */}

          <div className="flex items-center gap-3">

            <div className="text-right hidden sm:block">

              <p className="text-sm font-semibold text-slate-900">
                Admin
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>

            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                to-purple-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                shadow-md
                shadow-blue-500/20
              "
            >
              A
            </div>

          </div>

        </header>


        {/* Page Content */}

        <section className="p-6 md:p-8">

          <Outlet />

        </section>

      </main>

    </div>
  );
};

export default AdminLayout;