const Input = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    name,
}) => {

    return (

        <div className="mb-5">

            <label className="block text-sm font-semibold mb-2">

                {label}

            </label>

            {/* <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    transition

                    ${
                        error
                            ? "border-red-500 focus:ring-2 focus:ring-red-300"
                            : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    }
                `}
            /> */}


            <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`
        w-full
        border
        rounded-xl
        px-4
        py-3
        outline-none
        transition

        ${
            error
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        }
    `}
/>

            {

                error && (

                    <p className="text-red-500 text-sm mt-2">

                        {error}

                    </p>

                )

            }

        </div>

    );

};

export default Input;