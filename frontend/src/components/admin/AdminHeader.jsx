
import React from "react";

const AdminHeader = () => {

  return (
    <header
      className="
        h-[82px]
        bg-white
        border-b
        border-slate-200
        px-6
        md:px-8
        flex
        items-center
        justify-between
      "
    >

      {/* =========================
          LEFT
      ========================= */}

      <div>

        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-blue-600
          "
        >
          QuickAI Administration
        </p>

        <h2
          className="
            text-xl
            font-bold
            text-slate-900
            mt-1
          "
        >
          Management Console
        </h2>

      </div>


      {/* =========================
          RIGHT
      ========================= */}

      <div className="flex items-center gap-3">

        {/* Status */}

        <div className="hidden sm:flex items-center gap-2">

          <span className="relative flex h-2.5 w-2.5">

            <span
              className="
                animate-ping
                absolute
                inline-flex
                h-full
                w-full
                rounded-full
                bg-green-400
                opacity-75
              "
            />

            <span
              className="
                relative
                inline-flex
                rounded-full
                h-2.5
                w-2.5
                bg-green-500
              "
            />

          </span>

          <span className="text-xs text-slate-500">
            System Online
          </span>

        </div>


        {/* Divider */}

        <div className="hidden sm:block h-8 w-px bg-slate-200" />


        {/* Admin */}

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

      </div>

    </header>
  );
};

export default AdminHeader;