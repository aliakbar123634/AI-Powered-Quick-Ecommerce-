const AuthCard = ({ title, subtitle, children }) => {

    return (

        <>

            <h2 className="text-4xl font-bold">

                {title}

            </h2>

            <p className="text-gray-500 mt-3 mb-10">

                {subtitle}

            </p>

            {children}

        </>

    );

};

export default AuthCard;