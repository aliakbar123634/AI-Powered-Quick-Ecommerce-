import { Loader2 } from "lucide-react";

const PrimaryButton = ({
    children,
    type = "button",
    onClick,
    loading = false,
    disabled = false,
    fullWidth = true,
}) => {

    return (

        <button

            type={type}

            onClick={onClick}

            disabled={loading || disabled}

            className={`
                flex
                items-center
                justify-center
                gap-2

                ${fullWidth ? "w-full" : ""}

                bg-green-600
                hover:bg-green-700

                text-white

                font-semibold

                py-3

                rounded-xl

                transition-all

                duration-300

                shadow-md

                hover:shadow-lg

                disabled:bg-gray-400

                disabled:cursor-not-allowed
            `}
        >

            {

                loading && (

                    <Loader2

                        size={20}

                        className="animate-spin"

                    />

                )

            }

            {children}

        </button>

    );

};

export default PrimaryButton;