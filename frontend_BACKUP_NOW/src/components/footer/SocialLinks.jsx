// import {
//     FaFacebookF,
//     FaInstagram,
//     FaLinkedinIn,
//     FaYoutube,
// } from "react-icons/fa";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTwitter,
} from "react-icons/fa";

// import { FaXTwitter } from "react-icons/fa6";

export default function SocialLinks() {
    return (
        <div className="mt-10 border-t pt-8">

            <div className="flex flex-col items-center">

                <h3 className="text-lg font-semibold text-gray-900">
                    Follow Us
                </h3>

                <div className="flex items-center gap-5 mt-5">

                    <a
                        href="#"
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition duration-300"
                    >
                        <FaFacebookF size={18} />
                    </a>

                    <a
                        href="#"
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition duration-300"
                    >
                        <FaInstagram size={18} />
                    </a>

                    <a
                        href="#"
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition duration-300"
                    >
                        <FaLinkedinIn size={18} />
                    </a>

                    <a
                        href="#"
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition duration-300"
                    >
                        <FaTwitter size={18} />
                    </a>

                    <a
                        href="#"
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition duration-300"
                    >
                        <FaYoutube size={18} />
                    </a>

                </div>

            </div>

        </div>
    );
}



// export default function SocialLinks() {
//     return <h1>Social Links Working</h1>;
// }