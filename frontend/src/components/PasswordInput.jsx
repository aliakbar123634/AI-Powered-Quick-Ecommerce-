import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
}) => {

    const [showPassword, setShowPassword] = useState(false);

    return (

        <div className="mb-5">

            <label className="block text-sm font-semibold mb-2">

                {label}

            </label>

            <div className="relative">

                {/* <input

                    type={showPassword ? "text" : "password"}

                    placeholder={placeholder}

                    value={value}

                    onChange={onChange}

                    className={`
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        pr-12
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

    type={showPassword ? "text" : "password"}

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
        pr-12
        outline-none
        transition

        ${
            error
                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        }
    `}
/>

                <button

                    type="button"

                    onClick={() => setShowPassword(!showPassword)}

                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"

                >

                    {

                        showPassword

                            ? <EyeOff size={20} />

                            : <Eye size={20} />

                    }

                </button>

            </div>

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

export default PasswordInput;