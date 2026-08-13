import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import Newsletter from "./Newsletter";
import SocialLinks from "./SocialLinks";
import FooterBottom from "./FooterBottom";

export default function Footer() {
    return (
        <footer className="bg-white border-t mt-16">

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    <FooterBrand />

                    <FooterLinks
    title="Quick Links"
    links={[
        { label: "Home", path: "/" },
        { label: "Products", path: "/products" },
        { label: "Categories", path: "/categories" },
        { label: "Wishlist", path: "/wishlist" },
        { label: "Cart", path: "/cart" },
    ]}
/>

<FooterLinks
    title="Customer Care"
    links={[
        { label: "Contact Us", path: "/contact" },
        { label: "FAQ", path: "/faq" },
        { label: "Shipping Policy", path: "/shipping-policy" },
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Terms & Conditions", path: "/terms" },
    ]}
/>

<FooterLinks
    title="Categories"
    links={[
        { label: "Fruits", path: "/category/fruits" },
        { label: "Vegetables", path: "/category/vegetables" },
        { label: "Dairy", path: "/category/dairy" },
        { label: "Bakery", path: "/category/bakery" },
        { label: "Beverages", path: "/category/beverages" },
    ]}
/>

                    {/* <FooterLinks
                        title="Quick Links"
                    />

                    <FooterLinks
                        title="Customer Care"
                    />

                    <FooterLinks
                        title="Categories"
                    /> */}

                </div>

                <Newsletter />

                <SocialLinks />

            </div>

            <FooterBottom />

        </footer>
    );
}