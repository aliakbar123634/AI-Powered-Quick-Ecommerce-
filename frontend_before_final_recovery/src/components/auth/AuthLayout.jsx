const AuthLayout = ({ children }) => {

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-green-50 flex items-center justify-center px-6 py-10">

            <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">

                {/* Left Side */}

                <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white p-14">

                    <h1 className="text-5xl font-extrabold">

                        QuickAI

                    </h1>

                    <p className="mt-8 text-lg leading-8 text-green-100">

                        Shop smarter with AI powered recommendations,
                        fast delivery and secure checkout.

                    </p>

                    <img

                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"

                        alt="Shopping"

                        className="rounded-3xl mt-12 object-cover h-80"

                    />

                </div>

                {/* Right */}

                <div className="p-10 lg:p-16">

                    {children}

                </div>

            </div>

        </div>

    );

};

export default AuthLayout;