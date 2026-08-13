import { Link } from "react-router-dom";

export default function FooterLinks({ title, links = [] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
            </h3>

            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.path}>
                        <Link
                            to={link.path}
                            className="text-gray-600 hover:text-green-600 transition duration-300"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}